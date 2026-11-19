// El módulo "ia": un modelo de lenguaje SIMULADO para la ruta de
// inteligencia artificial. Está escrito en Python y el estudiante lo usa
// con "import ia", igual que usaría la librería de un servicio real.
//
// ¿Por qué simulado? Un modelo real necesita una clave de pago y responde
// distinto cada vez, así que no se podría revisar un ejercicio con pruebas
// automáticas. Este responde con reglas fijas: siempre igual, sin internet y
// gratis. Lo que se practica (armar mensajes, pedir formatos, leer JSON,
// desconfiar de la respuesta, usar herramientas, reintentar) se escribe casi
// igual con un modelo de verdad.
//
// Cada "habilidad" de abajo existe para una lección: reacciona a qué tan
// clara es la instrucción, que es justo lo que la lección quiere enseñar.

globalThis.MODULOS_PYTHON = {
  ...(globalThis.MODULOS_PYTHON || {}),
  ia: String.raw`
"""ia: un modelo de lenguaje simulado para practicar."""

import json
import re
import unicodedata

ROLES = ("sistema", "usuario", "asistente", "herramienta")

# Tres comillas invertidas: asi marcan los modelos un bloque de codigo.
CERCA = chr(96) * 3


class ErrorDeServicio(Exception):
    """El servicio no pudo responder (como cuando un servidor esta saturado)."""


_estado = {"llamadas_inestables": 0}


def contar_tokens(texto):
    # Aproximacion comun: un token son unos 4 caracteres.
    return max(1, round(len(str(texto)) / 4))


# ---------- Ayudas internas ----------

def _normalizar(texto):
    # Minusculas y sin tildes, para comparar sin fijarse en esos detalles.
    separado = unicodedata.normalize("NFD", str(texto))
    return "".join(c for c in separado if unicodedata.category(c) != "Mn").lower()


_VACIAS = {
    "que", "cual", "como", "para", "por", "con", "los", "las", "una", "uno", "del",
    "esta", "este", "son", "hay", "tiene", "tienen", "donde", "cuando", "cuanto",
    "cuanta", "mas", "sus", "sobre", "puedo", "puede",
}


def _palabras(texto):
    # Palabras "con significado", recortadas a sus primeras 6 letras para que
    # coincidan "cuesta" con "cuestan" y "domicilio" con "domicilios".
    halladas = re.findall(r"[a-z0-9]+", _normalizar(texto))
    utiles = [p for p in halladas if len(p) > 2 and p not in _VACIAS and p.rstrip("s") not in _VACIAS]
    return {p[:6] for p in utiles}


def _pide_solo(instrucciones):
    # ¿La instruccion limita el formato? Vale "solo", "sola", "unicamente"...
    limitadores = r"\b(solo|sola|solamente|unicamente|exclusivamente|nada mas)\b"
    return re.search(limitadores, instrucciones) is not None


def _despues(texto, etiqueta):
    # El texto que viene despues de "Etiqueta:". Si no esta, el texto completo.
    posicion = _normalizar(texto).rfind(etiqueta + ":")
    if posicion == -1:
        return texto
    return texto[posicion + len(etiqueta) + 1:].strip()


def _validar(mensajes):
    if not isinstance(mensajes, list) or len(mensajes) == 0:
        raise TypeError("mensajes debe ser una lista con al menos un mensaje")
    for mensaje in mensajes:
        if not isinstance(mensaje, dict) or "rol" not in mensaje or "contenido" not in mensaje:
            raise ValueError('Cada mensaje debe ser un diccionario con las claves "rol" y "contenido"')
        if mensaje["rol"] not in ROLES:
            raise ValueError(
                'El rol "' + str(mensaje["rol"]) + '" no existe. Usa: sistema, usuario, asistente o herramienta'
            )
        if not isinstance(mensaje["contenido"], str):
            raise ValueError('El "contenido" de cada mensaje debe ser un texto')
    if mensajes[-1]["rol"] not in ("usuario", "herramienta"):
        raise ValueError("El ultimo mensaje debe ser del usuario (o el resultado de una herramienta)")
    # Igual que en los servicios reales: el resultado de una herramienta va
    # justo despues del mensaje del asistente que la pidio.
    for anterior, mensaje in zip([None] + mensajes, mensajes):
        if mensaje["rol"] == "herramienta" and (anterior is None or anterior["rol"] != "asistente"):
            raise ValueError(
                "Antes del resultado de una herramienta debe ir el mensaje del asistente que la pidio"
            )


# ---------- Habilidad: sentimiento de una resena ----------

_POSITIVAS = {
    "excelente", "delicioso", "deliciosa", "rico", "rica", "encanto", "encanta", "bueno",
    "buena", "rapido", "rapida", "recomiendo", "amable", "amables", "feliz", "genial",
    "perfecto", "perfecta",
}
_NEGATIVAS = {
    "malo", "mala", "horrible", "frio", "fria", "tarde", "demorado", "demorada", "pesimo",
    "pesima", "nunca", "sucio", "sucia", "caro", "cara", "decepcion", "grosero", "grosera",
}


def _sentimiento(texto):
    palabras = set(re.findall(r"[a-z]+", _normalizar(texto)))
    puntos = len(palabras & _POSITIVAS) - len(palabras & _NEGATIVAS)
    if puntos > 0:
        return "positivo"
    if puntos < 0:
        return "negativo"
    return "neutro"


def _responder_sentimiento(ultimo, instrucciones):
    etiqueta = _sentimiento(_despues(ultimo, "resena"))
    if "json" in instrucciones:
        return json.dumps({"sentimiento": etiqueta})
    if _pide_solo(instrucciones):
        dice_formato = "palabra" in instrucciones or "etiqueta" in instrucciones
        nombra_etiquetas = "positivo" in instrucciones and "negativo" in instrucciones
        if dice_formato or nombra_etiquetas:
            return etiqueta
    # Sin una instruccion clara de formato, el modelo "conversa".
    return (
        "¡Claro! Después de analizar la reseña, diría que el sentimiento es más bien "
        + etiqueta + ", por las palabras que usa el cliente. ¿Quieres que analice otra?"
    )


# ---------- Habilidad: clasificar tiquetes de soporte ----------

# Cada categoria se reconoce por el comienzo de ciertas palabras: "cobr"
# sirve para cobro, cobraron, cobrado...
_CATEGORIAS = {
    "facturacion": ("cobr", "factur", "pag", "reembols", "tarjeta"),
    "envios": ("envi", "paquet", "lleg", "entreg", "domicili", "repartidor"),
    "tecnico": ("app", "aplicac", "error", "contrasen", "pantalla", "abr", "cierr", "cerr", "sesion", "cuenta"),
}
_EN_SUS_PALABRAS = {
    "facturacion": "Parece un problema relacionado con cobros o pagos.",
    "envios": "Esto tiene que ver con la entrega de un paquete.",
    "tecnico": "Suena a una falla técnica de la aplicación.",
    None: "No estoy seguro de qué trata este tiquete.",
}
_ETIQUETAS = {"facturacion": "facturación", "envios": "envíos", "tecnico": "técnico"}


def _categoria(texto):
    palabras = set(re.findall(r"[a-z]+", _normalizar(texto)))
    puntos = {
        nombre: sum(1 for palabra in palabras if palabra.startswith(comienzos))
        for nombre, comienzos in _CATEGORIAS.items()
    }
    mejor = max(puntos, key=puntos.get)
    return mejor if puntos[mejor] > 0 else None


def _responder_tiquete(mensajes, ultimo, instrucciones):
    categoria = _categoria(_despues(ultimo, "tiquete"))
    # 1. Si la conversacion trae ejemplos (usuario y luego asistente) de la
    #    misma categoria, el modelo imita la respuesta del ejemplo.
    for anterior, siguiente in zip(mensajes, mensajes[1:]):
        es_ejemplo = anterior["rol"] == "usuario" and siguiente["rol"] == "asistente"
        if es_ejemplo and categoria is not None:
            if _categoria(_despues(anterior["contenido"], "tiquete")) == categoria:
                return siguiente["contenido"].strip()
    # 2. Si la instruccion nombra las etiquetas y pide responder solo con una.
    if categoria is not None and _pide_solo(instrucciones) and categoria in instrucciones:
        return _ETIQUETAS[categoria]
    # 3. Si no, lo describe a su manera.
    return _EN_SUS_PALABRAS[categoria]


# ---------- Habilidad: extraer los datos de un pedido ----------

_PRODUCTOS = ["arepa", "empanada", "tinto", "bunuelo", "jugo", "oblea", "pandebono", "almojabana"]
_CON_TILDE = {"bunuelo": "buñuelo", "almojabana": "almojábana"}
_CIUDADES = {
    "bogota": "Bogotá", "medellin": "Medellín", "cali": "Cali", "barranquilla": "Barranquilla",
    "pereira": "Pereira", "tunja": "Tunja", "manizales": "Manizales", "bucaramanga": "Bucaramanga",
}


def _pedido(texto):
    normal = _normalizar(texto)
    numero = re.search(r"\d+", normal)
    producto = next((p for p in _PRODUCTOS if p in normal), None)
    ciudad = next(
        (nombre for clave, nombre in _CIUDADES.items() if re.search(r"\b" + clave + r"\b", normal)),
        None,
    )
    return {
        "producto": _CON_TILDE.get(producto, producto),
        "cantidad": int(numero.group()) if numero else None,
        "ciudad": ciudad,
    }


def _responder_pedido(ultimo, instrucciones):
    datos = _pedido(_despues(ultimo, "pedido"))
    if "json" not in instrucciones:
        return (
            "El cliente pide " + str(datos["cantidad"]) + " de " + str(datos["producto"])
            + " para " + str(datos["ciudad"]) + "."
        )
    texto = json.dumps(datos, ensure_ascii=False)
    if _pide_solo(instrucciones) or "sin texto adicional" in instrucciones:
        return texto
    # Pidieron JSON pero no "solo JSON": el modelo lo envuelve en texto, como
    # hacen muchas veces los modelos de verdad.
    return "Aquí tienes el JSON que pediste:\n" + CERCA + "json\n" + texto + "\n" + CERCA


# ---------- Habilidad: responder con un contexto ----------

def _responder_con_contexto(ultimo, instrucciones):
    pregunta = _despues(ultimo, "pregunta")
    normal = _normalizar(ultimo)
    inicio = normal.find("contexto:")
    fin = normal.rfind("pregunta:")
    contexto = ultimo[inicio + len("contexto:"):fin] if inicio != -1 and inicio < fin else ""
    frases = [f.strip().rstrip(".") for f in re.split(r"\.\s+|\n+", contexto) if f.strip()]
    clave = _palabras(pregunta)
    mejor = max(frases, key=lambda frase: len(_palabras(frase) & clave), default=None)
    if mejor is not None and len(_palabras(mejor) & clave) >= 2:
        return mejor + "."
    if "no lo se" in instrucciones:
        return "No lo sé"
    # Sin el dato y sin permiso para decir "no se", el modelo inventa con
    # total seguridad. A esto se le llama alucinar.
    return "Sí, por supuesto: está disponible todos los días, las 24 horas, y es gratis."


# ---------- Habilidad: "memoria" (solo lo que venga en la conversacion) ----------

_ME_LLAMO = r"[Mm]e llamo ([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)"


def _responder_memoria(mensajes, ultimo):
    if "como me llamo" in _normalizar(ultimo):
        for mensaje in reversed(mensajes):
            hallado = re.search(_ME_LLAMO, mensaje["contenido"]) if mensaje["rol"] == "usuario" else None
            if hallado:
                return "Te llamas " + hallado.group(1) + "."
        return "No sé cómo te llamas: no me lo has dicho en esta conversación."
    hallado = re.search(_ME_LLAMO, ultimo)
    if hallado:
        return "¡Mucho gusto, " + hallado.group(1) + "!"
    return None


# ---------- Habilidad: pedir una herramienta ----------

def _elegir_herramienta(ultimo, herramientas):
    # Devuelve (pedido, aclaracion). El modelo NO ejecuta la herramienta:
    # solo dice cual quiere usar y con que datos.
    clave = _palabras(ultimo)
    for herramienta in herramientas:
        if not isinstance(herramienta, dict) or "nombre" not in herramienta:
            raise ValueError('Cada herramienta debe ser un diccionario con la clave "nombre"')
        if not (_palabras(herramienta["nombre"].replace("_", " ")) & clave):
            continue
        argumentos = {}
        for parametro, opciones in herramienta.get("parametros", {}).items():
            elegido = next((o for o in opciones if _normalizar(o) in _normalizar(ultimo)), None)
            if elegido is None:
                return None, "¿De cuál " + parametro + " quieres saber? Opciones: " + ", ".join(opciones) + "."
            argumentos[parametro] = elegido
        return {"nombre": herramienta["nombre"], "argumentos": argumentos}, None
    return None, None


# ---------- El modelo ----------

def _responder(mensajes, sistema, ultimo, instrucciones):
    normal = _normalizar(ultimo)
    if "pregunta:" in normal:
        return _responder_con_contexto(ultimo, instrucciones)
    if "tiquete:" in normal:
        return _responder_tiquete(mensajes, ultimo, instrucciones)
    if "resena:" in normal or "sentimiento" in instrucciones:
        return _responder_sentimiento(ultimo, instrucciones)
    if "pedido:" in normal or "extrae" in instrucciones:
        return _responder_pedido(ultimo, instrucciones)
    if "resume" in instrucciones or "resumen" in instrucciones:
        # Resumir, para este modelo, es quedarse con la primera frase.
        return re.split(r"(?<=[.!?])\s+", _despues(ultimo, "texto").strip())[0]
    de_memoria = _responder_memoria(mensajes, ultimo)
    if de_memoria is not None:
        return de_memoria
    if normal.strip(" ¡!.,").startswith("hola"):
        nombre = re.search(r"[Tt]e llamas ([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)", sistema)
        quien = nombre.group(1) if nombre else "un modelo simulado"
        return "¡Hola! Soy " + quien + ". ¿En qué te ayudo?"
    return (
        "Soy un modelo simulado: solo sé hacer las tareas de estas lecciones. "
        "Recibí " + str(len(mensajes)) + " mensajes."
    )


def _aplicar_estilo(contenido, instrucciones):
    limite = re.search(r"maximo (\d+) palabras", instrucciones)
    if limite:
        contenido = " ".join(contenido.split()[: int(limite.group(1))])
    if "mayusculas" in instrucciones:
        contenido = contenido.upper()
    return contenido


def preguntar(mensajes, temperatura=0, max_tokens=200, herramientas=None):
    """Envia una conversacion al modelo y devuelve su respuesta (un diccionario).

    "temperatura" existe porque los servicios reales la tienen (cuanta variedad
    hay entre una respuesta y otra), pero este modelo simulado la ignora:
    siempre responde lo mismo, para que los ejercicios se puedan revisar.
    """
    _validar(mensajes)
    sistema = " ".join(m["contenido"] for m in mensajes if m["rol"] == "sistema")
    ultimo_mensaje = mensajes[-1]
    ultimo = ultimo_mensaje["contenido"]
    instrucciones = _normalizar(sistema + " " + ultimo)

    contenido = ""
    motivo = "fin"
    pedido = None

    if ultimo_mensaje["rol"] == "herramienta":
        nombre = str(ultimo_mensaje.get("nombre", "la herramienta"))
        contenido = "El resultado de " + nombre + " es " + ultimo + "."
    else:
        pedido, aclaracion = _elegir_herramienta(ultimo, herramientas or [])
        if pedido is not None:
            motivo = "herramienta"
        elif aclaracion is not None:
            contenido = aclaracion
        else:
            contenido = _aplicar_estilo(_responder(mensajes, sistema, ultimo, instrucciones), instrucciones)

    if contar_tokens(contenido) > max_tokens:
        contenido = contenido[: max_tokens * 4]
        motivo = "max_tokens"

    respuesta = {
        "contenido": contenido,
        "motivo_fin": motivo,
        "tokens_entrada": sum(contar_tokens(m["contenido"]) for m in mensajes),
        "tokens_salida": contar_tokens(contenido) if contenido else 0,
    }
    if pedido is not None:
        respuesta["herramienta"] = pedido
    return respuesta


def reiniciar_fallos():
    _estado["llamadas_inestables"] = 0


def preguntar_inestable(mensajes, **opciones):
    """Como preguntar(), pero falla dos de cada tres veces (falla, falla, responde)."""
    numero = _estado["llamadas_inestables"]
    _estado["llamadas_inestables"] = numero + 1
    if numero % 3 != 2:
        raise ErrorDeServicio("El servicio está saturado. Intenta de nuevo en un momento.")
    return preguntar(mensajes, **opciones)


# ---------- El formato de la API de Mensajes de Anthropic ----------
#
# preguntar() usa nombres en espanol para aprender las ideas. crear_mensaje()
# recibe y devuelve lo mismo que la API de Mensajes de Anthropic
# (POST /v1/messages), con sus nombres de campos en ingles, para practicar el
# formato real. El SDK oficial de Python se usa asi:
#     cliente.messages.create(model=..., max_tokens=..., messages=[...])
# y devuelve un objeto con estos mismos campos (respuesta.content[0].text).
# Aqui la respuesta es un diccionario: el JSON que viaja por internet, sin
# envoltura. Por dentro contesta el mismo modelo simulado de arriba.

ROLES_API = ("user", "assistant")
TIPOS_DE_BLOQUE = ("text", "tool_use", "tool_result")


def _bloques(contenido):
    # "content" puede ser un texto o una lista de bloques: se lleva todo a bloques.
    if isinstance(contenido, str):
        return [{"type": "text", "text": contenido}]
    if not isinstance(contenido, list):
        raise ValueError('"content" debe ser un texto o una lista de bloques')
    for bloque in contenido:
        if not isinstance(bloque, dict) or bloque.get("type") not in TIPOS_DE_BLOQUE:
            raise ValueError('Cada bloque de "content" debe ser un diccionario con "type": "text", "tool_use" o "tool_result"')
    return contenido


def _texto_de(bloques):
    return " ".join(str(b.get("text", "")) for b in bloques if b["type"] == "text")


def _texto_de_resultado(bloque):
    # El "content" de un tool_result puede ser un texto o una lista de bloques de texto.
    contenido = bloque.get("content", "")
    return _texto_de(contenido) if isinstance(contenido, list) else str(contenido)


def _ids_pedidos(mensaje):
    if mensaje is None or mensaje["role"] != "assistant":
        return []
    return [b.get("id") for b in _bloques(mensaje["content"]) if b["type"] == "tool_use"]


def _validar_api(model, max_tokens, messages, system, tools):
    if not isinstance(model, str) or model.strip() == "":
        raise ValueError('Falta "model": el nombre del modelo que va a responder')
    if not isinstance(max_tokens, int) or isinstance(max_tokens, bool) or max_tokens < 1:
        raise ValueError('"max_tokens" es obligatorio y debe ser un numero entero mayor que 0')
    if not isinstance(system, str):
        raise ValueError('"system" debe ser un texto (va aparte, no dentro de "messages")')
    if not isinstance(messages, list) or len(messages) == 0:
        raise TypeError('"messages" debe ser una lista con al menos un mensaje')
    for mensaje in messages:
        if not isinstance(mensaje, dict) or "role" not in mensaje or "content" not in mensaje:
            raise ValueError('Cada mensaje debe ser un diccionario con las claves "role" y "content"')
        if mensaje["role"] not in ROLES_API:
            raise ValueError(
                'El role "' + str(mensaje["role"]) + '" no existe en la API: usa "user" o "assistant".'
                ' Las instrucciones van en "system", fuera de "messages"'
            )
        _bloques(mensaje["content"])
    if messages[-1]["role"] != "user":
        raise ValueError('En este simulador el ultimo mensaje debe tener role "user"')
    for herramienta in tools:
        if not isinstance(herramienta, dict) or "name" not in herramienta or "input_schema" not in herramienta:
            raise ValueError('Cada tool debe ser un diccionario con "name", "description" e "input_schema"')
    # Igual que la API real: cada tool_use del asistente se contesta en el
    # mensaje siguiente con un tool_result que lleva su mismo id.
    for anterior, mensaje in zip([None] + messages, messages):
        respondidos = [b.get("tool_use_id") for b in _bloques(mensaje["content"]) if b["type"] == "tool_result"]
        pedidos = _ids_pedidos(anterior)
        for id_respondido in respondidos:
            if id_respondido not in pedidos:
                raise ValueError(
                    'El tool_use_id ' + repr(id_respondido) + ' no corresponde a ningun bloque "tool_use"'
                    ' del mensaje anterior del asistente'
                )
        sin_respuesta = [p for p in pedidos if p not in respondidos]
        if sin_respuesta:
            raise ValueError(
                'Al tool_use ' + repr(sin_respuesta[0]) + ' le falta su "tool_result" en el mensaje siguiente'
            )


def _valor_para(definicion, texto):
    # Lo que el modelo simulado sabe sacar del texto: una opcion de una lista
    # cerrada ("enum") o un numero entero.
    if "enum" in definicion:
        return next((o for o in definicion["enum"] if _normalizar(o) in _normalizar(texto)), None)
    if definicion.get("type") == "integer":
        numero = re.search(r"\d+", texto)
        return int(numero.group()) if numero else None
    return None


def _elegir_tool(texto, tools):
    # Devuelve (pedido, aclaracion), como _elegir_herramienta, pero leyendo el
    # JSON Schema de cada tool: sus "properties" y cuales son "required".
    clave = _palabras(texto)
    for herramienta in tools:
        if not (_palabras(herramienta["name"].replace("_", " ")) & clave):
            continue
        esquema = herramienta["input_schema"]
        entrada = {}
        for campo, definicion in esquema.get("properties", {}).items():
            valor = _valor_para(definicion, texto)
            if valor is not None:
                entrada[campo] = valor
        faltan = [campo for campo in esquema.get("required", []) if campo not in entrada]
        if faltan:
            return None, "Para usar " + herramienta["name"] + " me falta saber: " + ", ".join(faltan) + "."
        return {"name": herramienta["name"], "input": entrada}, None
    return None, None


def _como_texto(valor):
    return valor if isinstance(valor, str) else json.dumps(valor, ensure_ascii=False)


def _a_mensajes_internos(messages, system):
    # Traduce al formato de preguntar() para reusar las habilidades de arriba.
    internos = [{"rol": "sistema", "contenido": system}] if system else []
    for mensaje in messages:
        rol = "usuario" if mensaje["role"] == "user" else "asistente"
        internos.append({"rol": rol, "contenido": _texto_de(_bloques(mensaje["content"]))})
    return internos


def crear_mensaje(model=None, max_tokens=None, messages=None, system="", tools=None, temperature=1.0):
    """Imita POST /v1/messages de Anthropic y devuelve la respuesta como diccionario.

    Como en preguntar(), "temperature" existe porque la API real la tiene,
    pero el modelo simulado la ignora para que los ejercicios se puedan revisar.
    """
    tools = tools or []
    _validar_api(model, max_tokens, messages, system, tools)
    ultimo = _bloques(messages[-1]["content"])
    resultados = [b for b in ultimo if b["type"] == "tool_result"]
    bloques = []
    stop_reason = "end_turn"
    texto = None

    if resultados:
        # Llegaron los resultados de las tools: el modelo redacta con ellos.
        nombres = {b["id"]: b["name"] for b in _bloques(messages[-2]["content"]) if b["type"] == "tool_use"}
        texto = " ".join(
            "El resultado de " + nombres[r["tool_use_id"]] + " es " + _texto_de_resultado(r) + "."
            for r in resultados
        )
    else:
        texto_usuario = _texto_de(ultimo)
        pedido, aclaracion = _elegir_tool(texto_usuario, tools)
        if pedido is not None:
            # El id se arma con la cantidad de mensajes: siempre igual, para las pruebas.
            bloques = [{"type": "tool_use", "id": "toolu_sim_" + str(len(messages)).zfill(3), **pedido}]
            stop_reason = "tool_use"
        elif aclaracion is not None:
            texto = aclaracion
        else:
            instrucciones = _normalizar(system + " " + texto_usuario)
            internos = _a_mensajes_internos(messages, system)
            texto = _aplicar_estilo(_responder(internos, system, texto_usuario, instrucciones), instrucciones)

    if texto is not None:
        if contar_tokens(texto) > max_tokens:
            texto = texto[: max_tokens * 4]
            stop_reason = "max_tokens"
        bloques = [{"type": "text", "text": texto}]

    # Todo lo que se envia cuenta como entrada, tambien system y las tools.
    enviado = [system] + [_como_texto(m["content"]) for m in messages] + ([_como_texto(tools)] if tools else [])
    return {
        "id": "msg_sim_" + str(len(messages)).zfill(3),
        "type": "message",
        "role": "assistant",
        "model": model,
        "content": bloques,
        "stop_reason": stop_reason,
        "usage": {
            "input_tokens": sum(contar_tokens(t) for t in enviado if t),
            "output_tokens": sum(contar_tokens(_como_texto(b.get("text", b.get("input")))) for b in bloques),
        },
    }
`,
};

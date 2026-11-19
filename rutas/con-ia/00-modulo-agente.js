// El módulo "agente": un agente de código SIMULADO para la ruta "Programar
// con IA". Es una versión diminuta de lo que hace Claude Code: recibe una
// tarea ("arregla el error"), pide usar herramientas (correr las pruebas,
// buscar, leer y escribir archivos) sobre un proyecto y repite hasta terminar.
// El estudiante lo usa con "import agente", igual que el módulo "ia".
//
// ¿Por qué es un módulo aparte y no parte de "ia"? Porque enseña otra cosa:
// "ia" es un modelo que conversa; este es un modelo que decide qué
// herramienta usar. Separados, cada uno se lee de corrido sin mezclar reglas.
//
// ¿Por qué simulado? Por lo mismo que "ia": un modelo real cuesta, necesita
// internet y no responde igual dos veces, así que no se podría revisar un
// ejercicio con pruebas. Este decide con reglas fijas mirando lo que vio en el
// último paso. Un modelo real no "entiende" el código como una persona:
// predice el texto más probable, y ese texto a veces es un pedido de
// herramienta. Lo que hace de él un agente es el programa que lo rodea, y ese
// programa es justo lo que el estudiante escribe en estas lecciones.
//
// El "proyecto" es un diccionario {ruta: contenido} en memoria: no se toca
// ningún archivo de verdad.

globalThis.MODULOS_PYTHON = {
  ...(globalThis.MODULOS_PYTHON || {}),
  agente: String.raw`
"""agente: un agente de codigo simulado, como una version diminuta de Claude Code."""

import inspect
import re
import sys
import traceback
import types


# ---------- Los proyectos de practica ----------

# Cada proyecto tiene un error pequenio (el mismo tipo de error, para que el
# modelo simulado sepa reconocerlo) y sus pruebas.
_PROYECTOS = {
    "tienda": {
        "LEEME.md": (
            "# Caja de Don Pepe\n"
            "Calcula cuanto paga un cliente por su pedido.\n"
            "Las pruebas estan en prueba_tienda.py\n"
        ),
        "tienda.py": (
            "# La caja de la tienda de Don Pepe\n"
            'PRECIOS = {"tinto": 2000, "arepa": 3500, "empanada": 2500}\n'
            "\n"
            "\n"
            "def total(pedido):\n"
            "    suma = 0\n"
            "    for producto, cantidad in pedido.items():\n"
            "        suma = PRECIOS[producto] * cantidad\n"
            "    return suma\n"
        ),
        "prueba_tienda.py": (
            "from tienda import total\n"
            "\n"
            "\n"
            "def prueba_un_producto():\n"
            '    assert total({"tinto": 2}) == 4000\n'
            "\n"
            "\n"
            "def prueba_varios_productos():\n"
            '    assert total({"tinto": 1, "arepa": 2}) == 9000\n'
        ),
    },
    "domicilios": {
        "domicilios.py": (
            "# Lo que cobra Don Pepe por llevar pedidos a cada zona\n"
            'TARIFAS = {"centro": 3000, "norte": 5000, "sur": 4000}\n'
            "\n"
            "\n"
            "def costo_domicilios(zonas):\n"
            "    costo = 0\n"
            "    for zona in zonas:\n"
            "        costo = TARIFAS[zona]\n"
            "    return costo\n"
        ),
        "prueba_domicilios.py": (
            "from domicilios import costo_domicilios\n"
            "\n"
            "\n"
            "def prueba_una_zona():\n"
            '    assert costo_domicilios(["centro"]) == 3000\n'
            "\n"
            "\n"
            "def prueba_varias_zonas():\n"
            '    assert costo_domicilios(["centro", "norte"]) == 8000\n'
        ),
    },
}


def proyecto(nombre="tienda"):
    """Devuelve un proyecto nuevo: un diccionario {ruta: contenido}."""
    if nombre not in _PROYECTOS:
        raise ValueError(
            'No hay un proyecto llamado "' + str(nombre) + '". Hay: ' + ", ".join(_PROYECTOS)
        )
    # Una copia: asi cambiarla no dania el original.
    return dict(_PROYECTOS[nombre])


# ---------- Las herramientas ----------

# Lo que se le describe al modelo. El modelo solo ve estas descripciones:
# no ve el codigo de las funciones de abajo.
HERRAMIENTAS = [
    {
        "nombre": "correr_pruebas",
        "descripcion": "Corre las pruebas del proyecto y dice cuáles fallan",
        "parametros": {},
    },
    {
        "nombre": "buscar",
        "descripcion": "Busca un texto en todos los archivos y dice en qué línea está",
        "parametros": {"texto": "el texto que se busca"},
    },
    {
        "nombre": "leer_archivo",
        "descripcion": "Devuelve el contenido completo de un archivo",
        "parametros": {"ruta": "el nombre del archivo"},
    },
    {
        "nombre": "escribir_archivo",
        "descripcion": "Reemplaza el contenido de un archivo",
        "parametros": {"ruta": "el nombre del archivo", "contenido": "el texto nuevo completo"},
    },
]


def _validar_proyecto(proyecto):
    if not isinstance(proyecto, dict):
        raise TypeError(
            'El proyecto debe ser un diccionario {ruta: contenido}. Créalo con agente.proyecto("tienda")'
        )


def leer_archivo(proyecto, ruta):
    _validar_proyecto(proyecto)
    if ruta not in proyecto:
        # El error vuelve como texto: asi el modelo lo "ve" y puede reaccionar.
        return "Error: no existe el archivo " + str(ruta) + ". Los archivos son: " + ", ".join(sorted(proyecto))
    return proyecto[ruta]


def escribir_archivo(proyecto, ruta, contenido):
    _validar_proyecto(proyecto)
    if not isinstance(contenido, str):
        raise TypeError("El contenido de un archivo debe ser texto")
    # Un proyecto NUEVO con el archivo cambiado: el anterior queda intacto.
    return {**proyecto, ruta: contenido}


def buscar(proyecto, texto):
    _validar_proyecto(proyecto)
    hallazgos = []
    for ruta in sorted(proyecto):
        for numero, linea in enumerate(proyecto[ruta].split("\n"), start=1):
            if texto in linea:
                hallazgos.append(ruta + ":" + str(numero) + ": " + linea.strip())
    if not hallazgos:
        return "No encontré " + repr(texto) + " en ningún archivo."
    return "\n".join(hallazgos)


def _es_prueba(ruta):
    return ruta.startswith("prueba_") and ruta.endswith(".py")


def _cargar_modulos(proyecto):
    # Cada archivo .py que no es de pruebas se vuelve un modulo, para que las
    # pruebas puedan hacer "from tienda import total".
    modulos = {}
    for ruta in sorted(proyecto):
        if ruta.endswith(".py") and not _es_prueba(ruta):
            modulo = types.ModuleType(ruta[:-3])
            exec(compile(proyecto[ruta], ruta, "exec"), modulo.__dict__)
            modulos[ruta[:-3]] = modulo
    return modulos


def _linea_que_fallo(error, ruta, fuente):
    # Busca en el rastro del error la linea del archivo de pruebas.
    for marco in reversed(traceback.extract_tb(error.__traceback__)):
        if marco.filename == ruta:
            texto = fuente.split("\n")[marco.lineno - 1].strip()
            return "línea " + str(marco.lineno) + " de " + ruta + "): " + texto
    return ruta + "): " + type(error).__name__ + ": " + str(error)


def _correr_archivo_de_pruebas(ruta, fuente):
    # Devuelve (cuantas pasaron, cuantas hubo, lineas de las que fallaron).
    ambito = {"__name__": ruta[:-3]}
    exec(compile(fuente, ruta, "exec"), ambito)
    pruebas = [(n, f) for n, f in ambito.items() if n.startswith("prueba_") and callable(f)]
    fallas = []
    for nombre, prueba in pruebas:
        try:
            prueba()
        except Exception as error:
            fallas.append("FALLÓ " + nombre + " (" + _linea_que_fallo(error, ruta, fuente))
    return len(pruebas) - len(fallas), len(pruebas), fallas


def correr_pruebas(proyecto):
    _validar_proyecto(proyecto)
    archivos = sorted(r for r in proyecto if _es_prueba(r))
    if not archivos:
        return "Error: no hay archivos de pruebas (deben llamarse prueba_algo.py)."
    try:
        modulos = _cargar_modulos(proyecto)
    except Exception as error:
        return "Error: el código no carga. " + type(error).__name__ + ": " + str(error)
    # Los modulos del proyecto se instalan solo mientras corren las pruebas y
    # despues se quitan, para no dejar rastro en el programa del estudiante.
    anteriores = {nombre: sys.modules.get(nombre) for nombre in modulos}
    sys.modules.update(modulos)
    pasaron, total, fallas = 0, 0, []
    try:
        for ruta in archivos:
            p, t, f = _correr_archivo_de_pruebas(ruta, proyecto[ruta])
            pasaron, total, fallas = pasaron + p, total + t, fallas + f
    except Exception as error:
        return "Error: las pruebas no cargan. " + type(error).__name__ + ": " + str(error)
    finally:
        for nombre, anterior in anteriores.items():
            if anterior is None:
                sys.modules.pop(nombre, None)
            else:
                sys.modules[nombre] = anterior
    resumen = "Pasaron " + str(pasaron) + " de " + str(total) + " pruebas."
    return "\n".join([resumen] + fallas)


# Las funciones de verdad detras de cada herramienta.
FUNCIONES = {
    "correr_pruebas": correr_pruebas,
    "buscar": buscar,
    "leer_archivo": leer_archivo,
    "escribir_archivo": escribir_archivo,
}


# ---------- El modelo: decide el siguiente paso ----------

ROLES = ("sistema", "usuario", "asistente", "herramienta")


def _validar_mensajes(mensajes):
    if not isinstance(mensajes, list) or len(mensajes) == 0:
        raise TypeError("mensajes debe ser una lista con al menos un mensaje (la tarea del usuario)")
    for anterior, mensaje in zip([None] + mensajes, mensajes):
        if not isinstance(mensaje, dict) or "rol" not in mensaje or "contenido" not in mensaje:
            raise ValueError('Cada mensaje debe ser un diccionario con las claves "rol" y "contenido"')
        if mensaje["rol"] not in ROLES:
            raise ValueError(
                'El rol "' + str(mensaje["rol"]) + '" no existe. Usa: sistema, usuario, asistente o herramienta'
            )
        if not isinstance(mensaje["contenido"], str):
            if mensaje["rol"] == "herramienta":
                raise ValueError(
                    "El resultado de una herramienta debe ser texto: el modelo solo lee texto. "
                    "Si tienes otra cosa, conviértela con str()"
                )
            raise ValueError('El "contenido" de cada mensaje debe ser un texto')
        if mensaje["rol"] == "herramienta":
            pidio = anterior is not None and anterior["rol"] == "asistente"
            if not pidio or not isinstance(anterior.get("herramienta"), dict):
                raise ValueError(
                    "Antes del resultado de una herramienta debe ir el mensaje del asistente "
                    'con su pedido en la clave "herramienta"'
                )
    if mensajes[-1]["rol"] not in ("usuario", "herramienta"):
        raise ValueError(
            "El último mensaje debe ser la tarea del usuario o el resultado de una herramienta"
        )


def _nombres_de(herramientas):
    if not isinstance(herramientas, list):
        raise TypeError("herramientas debe ser una lista, como agente.HERRAMIENTAS")
    for herramienta in herramientas:
        if not isinstance(herramienta, dict) or "nombre" not in herramienta:
            raise ValueError(
                'Cada herramienta debe ser un diccionario con la clave "nombre", como las de agente.HERRAMIENTAS'
            )
    return [h["nombre"] for h in herramientas]


def _usar(pensamiento, nombre, argumentos):
    return {"pensamiento": pensamiento, "nombre": nombre, "argumentos": argumentos}


def _terminar(pensamiento, respuesta):
    return {"pensamiento": pensamiento, "nombre": None, "respuesta": respuesta}


def _buscar_acumulador_roto(contenido):
    # El unico error que este modelo sabe arreglar: una variable que empieza
    # en 0 y, dentro del for, se REEMPLAZA en vez de sumarse ("x = ..." en
    # lugar de "x += ..."). Un modelo real reconoce muchisimos patrones; la
    # idea es la misma: ha visto ese error miles de veces en sus textos.
    iniciadas = {}
    for indice, linea in enumerate(contenido.split("\n")):
        inicio = re.match(r"^(\s*)(\w+) = 0\s*$", linea)
        if inicio:
            iniciadas[inicio.group(2)] = len(inicio.group(1))
            continue
        asignacion = re.match(r"^(\s*)(\w+) = (.+)$", linea)
        if asignacion is None:
            continue
        sangria, variable, valor = asignacion.groups()
        mas_adentro = variable in iniciadas and len(sangria) > iniciadas[variable]
        if mas_adentro and not re.search(r"\b" + variable + r"\b", valor):
            return indice, sangria, variable, valor
    return None


def _ya_escribio(mensajes):
    pedidos = [m.get("herramienta") for m in mensajes if m["rol"] == "asistente"]
    return [p["argumentos"]["ruta"] for p in pedidos if isinstance(p, dict)
            and p.get("nombre") == "escribir_archivo" and "ruta" in p.get("argumentos", {})]


def _tras_pruebas(resultado, mensajes):
    escritos = _ya_escribio(mensajes)
    if resultado.startswith("Error"):
        return _terminar("Las pruebas ni siquiera arrancan.", "No puedo seguir. " + resultado)
    if "FALLÓ" not in resultado:
        if escritos:
            return _terminar(
                "Las pruebas pasan después de mi cambio: ya puedo responder.",
                "Listo: corregí " + ", ".join(escritos) + " y ahora pasan todas las pruebas.",
            )
        return _terminar("Todas las pruebas pasan.", "Las pruebas ya pasan: no hay nada que arreglar.")
    if escritos:
        return _terminar(
            "Hice un cambio y las pruebas siguen fallando.",
            "Cambié " + ", ".join(escritos) + ", pero las pruebas siguen fallando. "
            "Mejor que una persona lo revise antes de seguir.",
        )
    funcion = re.search(r"FALLÓ .*?assert\s+(\w+)\(", resultado)
    if funcion is None:
        return _terminar("Falla una prueba, pero no veo qué función revisar.", "No sé por dónde empezar.")
    return _usar(
        "Falla una prueba de la función " + funcion.group(1) + ". Busco en qué archivo está.",
        "buscar",
        {"texto": "def " + funcion.group(1) + "("},
    )


def _tras_buscar(resultado):
    hallado = re.match(r"^([^:\n]+):\d+:", resultado)
    if hallado is None:
        return _terminar("No la encontré.", "No encontré dónde está definida la función, así que no puedo arreglarla.")
    ruta = hallado.group(1)
    return _usar("Está en " + ruta + ". Leo el archivo completo antes de tocarlo.", "leer_archivo", {"ruta": ruta})


def _tras_leer(resultado, ruta):
    if resultado.startswith("Error"):
        return _terminar("No pude leer el archivo.", "No pude leer " + str(ruta) + ". " + resultado)
    hallazgo = _buscar_acumulador_roto(resultado)
    if hallazgo is None:
        return _terminar(
            "No veo el error en " + str(ruta) + ".",
            "Leí " + str(ruta) + " y no encuentro el error. Prefiero no cambiar nada a ciegas.",
        )
    indice, sangria, variable, valor = hallazgo
    lineas = resultado.split("\n")
    corregida = sangria + variable + " += " + valor
    nuevo = "\n".join(lineas[:indice] + [corregida] + lineas[indice + 1:])
    pensamiento = (
        "En " + str(ruta) + ", la línea '" + lineas[indice].strip() + "' reemplaza el valor de "
        + variable + " en cada vuelta del for en vez de sumarlo. La cambio por '" + corregida.strip() + "'."
    )
    return _usar(pensamiento, "escribir_archivo", {"ruta": ruta, "contenido": nuevo})


def _decidir(mensajes):
    ultimo = mensajes[-1]
    if ultimo["rol"] == "usuario":
        # Al empezar, lo primero es mirar: correr las pruebas.
        return _usar("Antes de cambiar nada, corro las pruebas para ver qué falla.", "correr_pruebas", {})
    pedido = mensajes[-2]["herramienta"]
    nombre = pedido.get("nombre")
    resultado = ultimo["contenido"]
    if nombre == "correr_pruebas":
        return _tras_pruebas(resultado, mensajes)
    if nombre == "buscar":
        return _tras_buscar(resultado)
    if nombre == "leer_archivo":
        return _tras_leer(resultado, pedido.get("argumentos", {}).get("ruta"))
    if nombre == "escribir_archivo":
        return _usar("Guardé el cambio. Corro las pruebas otra vez para comprobar que de verdad quedó bien.",
                     "correr_pruebas", {})
    return _terminar("No conozco esa herramienta.", "No sé qué hacer con el resultado de " + str(nombre) + ".")


def preguntar(mensajes, herramientas):
    """Le muestra al modelo la conversacion y las herramientas; devuelve su siguiente paso.

    La respuesta es un diccionario:
      "pensamiento": lo que el modelo escribe antes de actuar.
      "motivo_fin": "herramienta" si pide usar una, o "fin" si termino.
      "herramienta": el pedido {"nombre": ..., "argumentos": {...}} (solo si pidio una).
      "contenido": la respuesta final para el usuario (vacia si pidio una herramienta).
    El modelo NO ejecuta nada: solo pide. Ejecutar es trabajo de tu programa.
    """
    _validar_mensajes(mensajes)
    disponibles = _nombres_de(herramientas)
    decision = _decidir(mensajes)
    if decision["nombre"] is not None and decision["nombre"] not in disponibles:
        decision = _terminar(
            "Quiero usar " + decision["nombre"] + ", pero no la tengo.",
            "Para seguir necesito la herramienta " + decision["nombre"] + ", pero no está en la lista que me diste.",
        )
    if decision["nombre"] is None:
        return {"pensamiento": decision["pensamiento"], "motivo_fin": "fin", "contenido": decision["respuesta"]}
    return {
        "pensamiento": decision["pensamiento"],
        "motivo_fin": "herramienta",
        "contenido": "",
        "herramienta": {"nombre": decision["nombre"], "argumentos": decision["argumentos"]},
    }


# ---------- El programa que rodea al modelo ----------

def _combinar_funciones(funciones):
    if funciones is None:
        return dict(FUNCIONES)
    if not isinstance(funciones, dict):
        raise TypeError('funciones debe ser un diccionario, como {"leer_archivo": leer_archivo}')
    for nombre, funcion in funciones.items():
        if nombre not in FUNCIONES:
            raise ValueError(
                'No hay una herramienta llamada "' + str(nombre) + '". Son: ' + ", ".join(FUNCIONES)
            )
        if not callable(funcion):
            raise TypeError('En funciones, "' + nombre + '" debe ser una función (sin paréntesis)')
    return {**FUNCIONES, **funciones}


def _revisar_parametros(nombre, funcion, proyecto, argumentos):
    try:
        inspect.signature(funcion).bind(proyecto, **argumentos)
    except TypeError:
        esperados = ", ".join(["proyecto"] + list(argumentos))
        raise TypeError(
            "Tu función " + nombre + " debe recibir estos parámetros, con estos nombres: " + esperados
        ) from None


def usar_herramienta(proyecto, pedido, funciones=None):
    """Ejecuta lo que pidio el modelo. Devuelve (proyecto, resultado_en_texto).

    El proyecto que devuelve es nuevo si la herramienta lo cambio
    (escribir_archivo); si no, es el mismo que recibio.
    "funciones" sirve para cambiar una herramienta por la tuya:
    {"leer_archivo": mi_funcion}.
    """
    _validar_proyecto(proyecto)
    if not isinstance(pedido, dict) or "nombre" not in pedido:
        raise TypeError('El pedido debe ser el diccionario que viene en respuesta["herramienta"]')
    todas = _combinar_funciones(funciones)
    nombre = pedido["nombre"]
    if nombre not in todas:
        # Un agente real tambien recibe el error como texto, y puede corregirse.
        return proyecto, "Error: la herramienta " + str(nombre) + " no existe."
    argumentos = pedido.get("argumentos", {})
    funcion = todas[nombre]
    _revisar_parametros(nombre, funcion, proyecto, argumentos)
    salida = funcion(proyecto, **argumentos)
    if nombre == "escribir_archivo":
        if not isinstance(salida, dict):
            raise TypeError(
                "escribir_archivo debe devolver (con return) el proyecto nuevo, que es un diccionario. "
                "Devolvió: " + repr(salida)
            )
        return salida, "Guardé " + str(argumentos.get("ruta")) + "."
    if not isinstance(salida, str):
        raise TypeError(
            nombre + " debe devolver un texto (el modelo solo lee texto). Devolvió: " + repr(salida)
        )
    return proyecto, salida


def ejecutar(tarea, proyecto, funciones=None, max_pasos=10):
    """Un agente completo: repite pensar -> usar herramienta -> observar.

    Devuelve un diccionario con "proyecto" (como quedo), "registro" (la
    lista de pasos), "respuesta" (lo ultimo que dijo el modelo) y
    "terminado" (False si se acabaron los pasos antes de que terminara).
    """
    if not isinstance(tarea, str) or tarea.strip() == "":
        raise TypeError("La tarea debe ser un texto, como \"Arregla el error del proyecto\"")
    if not isinstance(max_pasos, int) or max_pasos < 1:
        raise ValueError("max_pasos debe ser un número entero mayor que 0")
    _validar_proyecto(proyecto)
    _combinar_funciones(funciones)
    mensajes = [{"rol": "usuario", "contenido": tarea}]
    registro = []
    for numero in range(1, max_pasos + 1):
        respuesta = preguntar(mensajes, HERRAMIENTAS)
        if respuesta["motivo_fin"] == "fin":
            registro = registro + [{
                "numero": numero, "pensamiento": respuesta["pensamiento"],
                "herramienta": None, "argumentos": {}, "resultado": respuesta["contenido"],
            }]
            return {"proyecto": proyecto, "registro": registro,
                    "respuesta": respuesta["contenido"], "terminado": True}
        pedido = respuesta["herramienta"]
        proyecto, resultado = usar_herramienta(proyecto, pedido, funciones)
        registro = registro + [{
            "numero": numero, "pensamiento": respuesta["pensamiento"],
            "herramienta": pedido["nombre"], "argumentos": pedido["argumentos"], "resultado": resultado,
        }]
        mensajes = mensajes + [
            {"rol": "asistente", "contenido": respuesta["pensamiento"], "herramienta": pedido},
            {"rol": "herramienta", "nombre": pedido["nombre"], "contenido": resultado},
        ]
    # Un limite de pasos evita que un agente confundido de vueltas para siempre.
    return {"proyecto": proyecto, "registro": registro,
            "respuesta": "Se acabaron los pasos antes de terminar.", "terminado": False}


# ---------- Ver lo que paso ----------

def _describir_pedido(nombre, argumentos):
    partes = []
    for clave, valor in argumentos.items():
        texto = str(valor)
        if "\n" in texto:
            # Un archivo entero no cabe en una linea: se muestra su tamanio.
            texto = "<" + str(len(texto.rstrip("\n").split("\n"))) + " líneas>"
        else:
            texto = repr(texto)
        partes.append(clave + "=" + texto)
    return nombre + "(" + ", ".join(partes) + ")"


def _sangrar(texto):
    return str(texto).rstrip("\n").replace("\n", "\n" + " " * 11)


def mostrar(registro):
    """Imprime un registro de pasos: pense -> use herramienta -> vi."""
    if not isinstance(registro, list):
        raise TypeError('mostrar recibe la lista de pasos, por ejemplo resultado["registro"]')
    for paso in registro:
        print("Paso " + str(paso["numero"]))
        print("  Pensé:   " + _sangrar(paso["pensamiento"]))
        if paso["herramienta"] is None:
            print("  Terminé: " + _sangrar(paso["resultado"]))
        else:
            print("  Usé:     " + _describir_pedido(paso["herramienta"], paso["argumentos"]))
            print("  Vi:      " + _sangrar(paso["resultado"]))
`,
};

// Ruta "El oficio", lección 4: validar lo que llega del cliente.
//
// Las pruebas mandan datos "malos" de verdad (texto en vez de número, True,
// campos de más, campos que faltan) y revisan la respuesta completa, no solo
// que exista la función: así se nota si la validación deja pasar algo.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  // ---------- Práctica ----------

  const ES_ENTERO = [
    'def es_entero(valor):',
    '    # Ojo: en Python True y False también son int (True vale 1). Un',
    '    # {"cantidad": true} en el JSON no debe pasar como si fuera un 1.',
    '    return isinstance(valor, int) and not isinstance(valor, bool)',
  ];

  const validarPedido = (cantidad) =>
    [
      ...ES_ENTERO,
      '',
      '',
      'def validar_pedido(datos):',
      '    if not isinstance(datos, dict):',
      '        return ["El pedido debe ser un objeto JSON"]',
      '    errores = []',
      '',
      '    # producto_id: obligatorio y entero (esta parte ya está hecha)',
      '    if "producto_id" not in datos:',
      '        errores.append("Falta el campo producto_id")',
      '    elif not es_entero(datos["producto_id"]):',
      '        errores.append("producto_id debe ser un número entero")',
      '',
      ...cantidad,
      '',
      '    return errores',
      '',
      '',
      'print(validar_pedido({"producto_id": 2, "cantidad": 3}))',
      'print(validar_pedido({"producto_id": "2", "cantidad": -5}))',
      'print(validar_pedido({}))',
    ].join('\n');

  const CANTIDAD_VACIA = ['    # cantidad: obligatoria, entera y entre 1 y 50 (escríbela tú)'];
  const CANTIDAD = [
    '    # cantidad: obligatoria, entera y entre 1 y 50',
    '    if "cantidad" not in datos:',
    '        errores.append("Falta el campo cantidad")',
    '    elif not es_entero(datos["cantidad"]):',
    '        errores.append("cantidad debe ser un número entero")',
    '    elif not 1 <= datos["cantidad"] <= 50:',
    '        errores.append("cantidad debe estar entre 1 y 50")',
  ];

  const errores = (datos) => 'validar_pedido(' + datos + ')';

  // ---------- Reto ----------

  const RETO_INICIAL = [
    'def limpiar_registro(datos):',
    '    # Devuelve {"ok": True, "datos": {...}} o {"ok": False, "errores": {...}}',
    '    return {"ok": True, "datos": datos}',
  ];

  const RETO_SOLUCION = [
    'MAXIMO_NOMBRE = 60',
    '',
    '',
    'def limpiar_nombre(valor):',
    '    nombre = valor.strip()',
    '    if nombre == "":',
    '        return None, "nombre no puede estar vacío"',
    '    if len(nombre) > MAXIMO_NOMBRE:',
    '        return None, "nombre puede tener máximo " + str(MAXIMO_NOMBRE) + " letras"',
    '    return nombre, None',
    '',
    '',
    'def limpiar_celular(valor):',
    '    numero = valor.replace(" ", "").replace("-", "")',
    '    if numero.startswith("+57"):',
    '        numero = numero[3:]',
    '    # isascii(): isdigit() solo también acepta "²" o dígitos árabes como "٣".',
    '    if len(numero) != 10 or not (numero.isascii() and numero.isdigit()) or not numero.startswith("3"):',
    '        return None, "celular debe ser un celular colombiano de 10 dígitos que empiece por 3"',
    '    return numero, None',
    '',
    '',
    'def limpiar_correo(valor):',
    '    correo = valor.strip().lower()',
    '    partes = correo.split("@")',
    '    if len(partes) != 2 or partes[0] == "" or " " in correo:',
    '        return None, "correo no es un correo válido"',
    '    dominio = partes[1]',
    '    if "." not in dominio or dominio.startswith(".") or dominio.endswith("."):',
    '        return None, "correo no es un correo válido"',
    '    return correo, None',
    '',
    '',
    '# Lista blanca: SOLO estos campos, cada uno con su forma de limpiarse.',
    '# Lo que no esté aquí (como "es_admin") se ignora.',
    'LIMPIADORES = {"nombre": limpiar_nombre, "celular": limpiar_celular, "correo": limpiar_correo}',
    '',
    '',
    'def limpiar_registro(datos):',
    '    limpios = {}',
    '    errores = {}',
    '    for campo, limpiar in LIMPIADORES.items():',
    '        if campo not in datos:',
    '            errores[campo] = "Falta el campo " + campo',
    '        elif not isinstance(datos[campo], str):',
    '            errores[campo] = campo + " debe ser texto"',
    '        else:',
    '            valor, error = limpiar(datos[campo])',
    '            if error:',
    '                errores[campo] = error',
    '            else:',
    '                limpios[campo] = valor',
    '    if errores:',
    '        return {"ok": False, "errores": errores}',
    '    return {"ok": True, "datos": limpios}',
  ];

  const retoCon = (cuerpo) =>
    [
      ...cuerpo,
      '',
      '',
      'formulario = {',
      '    "nombre": "  Ana María Ruiz ",',
      '    "celular": "+57 300 123 4567",',
      '    "correo": " Ana.Ruiz@Correo.com ",',
      '    "es_admin": True,',
      '}',
      'print(limpiar_registro(formulario))',
      'print(limpiar_registro({"nombre": "", "celular": "12345"}))',
    ].join('\n');

  const BUENO = '{"nombre": "  Ana María Ruiz ", "celular": "+57 300 123 4567", "correo": " Ana.Ruiz@Correo.com "}';
  const conCampo = (campo, valor) => `limpiar_registro({**${BUENO}, "${campo}": ${valor}})`;
  // Aprueba si el registro falla SOLO por ese campo: los demás estaban bien.
  const fallaSoloPor = (campo, valor) =>
    `(lambda r: r["ok"] is False and list(r["errores"]) == ["${campo}"] and isinstance(r["errores"]["${campo}"], str))(${conCampo(campo, valor)})`;

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'validar',
    titulo: 'Validar lo que llega',
    pasos: [
      {
        id: 'idea',
        titulo: 'Nunca confíes en los datos del cliente',
        texto: [
          'Tu servidor recibe datos de afuera: un formulario, una app, otro sistema. **No los escribiste tú**, así que pueden venir de cualquier forma: con campos de menos, con texto donde esperabas un número, con valores absurdos o con trampas a propósito. Y ojo: que la página valide no basta. Cualquiera puede mandarle peticiones a tu API sin pasar por la página (con una herramienta o con un programa de diez líneas).',
          'Ejecuta el ejemplo: una función **ingenua** calcula el precio de un pedido sin revisar nada. Mira lo que pasa con una cantidad negativa (¡le debemos plata al cliente!), con `"3"` como texto (Python repite el texto en vez de multiplicar), con `True` o con un cliente que manda **su propio precio**.',
          'La regla del oficio: **valida en la frontera**, apenas llegan los datos y antes de usarlos. Con una **lista blanca**: di exactamente qué aceptas (estos campos, de este tipo, en este rango) y rechaza todo lo demás. Y responde con **mensajes claros** que digan qué campo está mal y qué se esperaba, todos de una vez, para que quien los mandó los pueda corregir.',
        ],
        codigo: [
          '# Pedidos que llegaron (o pudieron llegar) al formulario de Don Pepe',
          'llegadas = [',
          '    {"producto_id": 2, "cantidad": 3},               # bien',
          '    {"producto_id": 2, "cantidad": "3"},             # texto: así llegan los formularios',
          '    {"producto_id": 2},                              # falta la cantidad',
          '    {"producto_id": 2, "cantidad": -5},              # negativa',
          '    {"producto_id": 2, "cantidad": True},            # en Python, True vale 1',
          '    {"producto_id": 2, "cantidad": 3, "precio": 1},  # trae su propio precio',
          ']',
          '',
          '',
          'def precio_ingenuo(datos):',
          '    precio_tinto = 2000',
          '    # Error: confía en todo lo que llegó',
          '    return datos.get("precio", precio_tinto) * datos["cantidad"]',
          '',
          '',
          'for datos in llegadas:',
          '    try:',
          '        resultado = precio_ingenuo(datos)',
          '        print(datos, "->", repr(resultado)[:30])',
          '    except Exception as error:',
          '        print(datos, "-> se rompió con", type(error).__name__)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Campos obligatorios, tipos y rangos',
        texto: [
          '`validar_pedido(datos)` devuelve la **lista de errores** de un pedido: vacía si todo está bien. La parte de `producto_id` ya está hecha; úsala de modelo.',
          'Escribe la de `cantidad`, revisando en este orden y con estos mensajes exactos (el cliente los va a leer): si no viene, `"Falta el campo cantidad"`; si no es un entero, `"cantidad debe ser un número entero"`; si no está entre 1 y 50, `"cantidad debe estar entre 1 y 50"`.',
          'Fíjate en que no se detiene en el primer error: los junta todos. Así quien llenó el formulario corrige todo de una vez y no tiene que reenviarlo tres veces. Usa `es_entero`, que ya está escrita: ¿por qué crees que tiene ese `not isinstance(valor, bool)`?',
        ],
        codigo: validarPedido(CANTIDAD_VACIA),
        pruebas: [
          { descripcion: 'Un pedido correcto no tiene errores', condicion: errores('{"producto_id": 2, "cantidad": 3}') + ' == [] and ' + errores('{"producto_id": 1, "cantidad": 50}') + ' == []' },
          { descripcion: 'Si falta la cantidad, lo dice', condicion: errores('{"producto_id": 2}') + ' == ["Falta el campo cantidad"]' },
          {
            descripcion: 'Una cantidad que no es entera (texto, decimal o True) se rechaza',
            condicion: 'all(' + errores('{"producto_id": 2, "cantidad": c}') + ' == ["cantidad debe ser un número entero"] for c in ("3", 3.5, True, None, [3]))',
          },
          {
            descripcion: 'Una cantidad fuera de 1 a 50 se rechaza',
            condicion: 'all(' + errores('{"producto_id": 2, "cantidad": c}') + ' == ["cantidad debe estar entre 1 y 50"] for c in (0, -5, 51, 1000))',
          },
          {
            descripcion: 'Junta todos los errores, no solo el primero',
            condicion: errores('{}') + ' == ["Falta el campo producto_id", "Falta el campo cantidad"] and ' + errores('{"producto_id": "2", "cantidad": -5}') + ' == ["producto_id debe ser un número entero", "cantidad debe estar entre 1 y 50"]',
          },
        ],
        pistas: [
          'Copia la forma del bloque de `producto_id`: un `if "cantidad" not in datos:`, luego un `elif not es_entero(datos["cantidad"]):`.',
          'El tercer caso es otro `elif`: `elif not 1 <= datos["cantidad"] <= 50:`. Python permite comparar en cadena, como en matemáticas.',
          'Cada caso hace `errores.append("...")` con el mensaje exacto. Ese bloque va antes del `return errores`, con la misma sangría que el de `producto_id`.',
        ],
        solucion: validarPedido(CANTIDAD),
      },
      {
        id: 'reto',
        titulo: 'Reto: el formulario de registro',
        texto: [
          'Don Pepe quiere que sus clientes se registren para pedir a domicilio. Escribe `limpiar_registro(datos)`, que recibe el formulario y devuelve `{"ok": True, "datos": {...}}` con los datos **limpios**, o `{"ok": False, "errores": {campo: mensaje}}` con un mensaje por cada campo malo.',
          'Los campos son tres, todos obligatorios y de tipo texto (si falta: `"Falta el campo nombre"`; si no es texto, un error para ese campo). **nombre**: sin espacios a los lados, no vacío y de máximo 60 letras. **celular**: acepta `"300 123 4567"`, `"300-123-4567"` o `"+57 3001234567"`, y se guarda como `"3001234567"`: 10 dígitos que empiezan por 3. **correo**: sin espacios a los lados y en minúsculas, con una sola `@`, algo antes de ella y un punto en el dominio (`ana@correo` no sirve). Los demás mensajes de error los escribes tú, claros.',
          'Dos reglas de seguridad: **no modifiques** el diccionario que llega (crea uno nuevo) y **copia solo los tres campos que conoces**. Si alguien manda `"es_admin": True`, no debe colarse en los datos: ese truco se llama *asignación masiva* y ha servido para robar cuentas en sistemas reales.',
        ],
        codigo: retoCon(RETO_INICIAL),
        pruebas: [
          {
            descripcion: 'Un formulario bien llenado queda limpio',
            condicion: `limpiar_registro(${BUENO}) == {"ok": True, "datos": {"nombre": "Ana María Ruiz", "celular": "3001234567", "correo": "ana.ruiz@correo.com"}}`,
          },
          {
            descripcion: 'Un campo de más (es_admin) no se cuela en los datos',
            condicion: conCampo('es_admin', 'True') + '.get("datos", {}).keys() == {"nombre", "celular", "correo"}',
          },
          {
            descripcion: 'No modifica el diccionario que recibe',
            condicion: comprobar([
              `original = {**${BUENO}, "es_admin": True}`,
              'copia = dict(original)',
              'limpiar_registro(original)',
              'ok = original == copia',
            ]),
          },
          {
            descripcion: 'Si faltan campos, hay un error para cada uno',
            condicion: '(lambda r: r["ok"] is False and r["errores"] == {"nombre": "Falta el campo nombre", "celular": "Falta el campo celular", "correo": "Falta el campo correo"})(limpiar_registro({}))',
          },
          {
            descripcion: 'Rechaza nombres vacíos, muy largos o que no son texto',
            condicion: [fallaSoloPor('nombre', '"   "'), fallaSoloPor('nombre', '"a" * 61'), fallaSoloPor('nombre', '123')].join(' and '),
          },
          {
            descripcion: 'Acepta celulares con espacios, guiones o +57, y rechaza los que no son colombianos',
            condicion:
              conCampo('celular', '"300-123-4567"') + '["datos"]["celular"] == "3001234567" and ' +
              ['"12345"', '"4001234567"', '"300 123 456"', '"30012345678"', '"300abc4567"', '"300123456²"', '3001234567'].map((v) => fallaSoloPor('celular', v)).join(' and '),
          },
          {
            descripcion: 'Rechaza correos sin @, con dos @, sin usuario o sin punto en el dominio',
            condicion: ['"ana"', '"ana@"', '"@correo.com"', '"ana@correo"', '"ana@@correo.com"', '"ana@correo."', '"ana ruiz@correo.com"'].map((v) => fallaSoloPor('correo', v)).join(' and '),
          },
        ],
        pistas: [
          'Escribe una función pequeña por campo (`limpiar_nombre`, `limpiar_celular`, `limpiar_correo`) que reciba el texto y devuelva `(valor_limpio, None)` si está bien o `(None, "mensaje")` si no. Así `limpiar_registro` solo las llama una por una.',
          'Celular: `numero = valor.replace(" ", "").replace("-", "")`; si `numero.startswith("+57")`, quítalo con `numero[3:]`. Luego exige `len(numero) == 10`, `numero.isascii() and numero.isdigit()` (sin `isascii`, `isdigit` también acepta `"²"`) y `numero.startswith("3")`. Correo: `partes = correo.split("@")` debe dar exactamente 2 partes, la primera no vacía, y la segunda con un `"."` que no esté ni al comienzo ni al final.',
          'En `limpiar_registro`, empieza con `limpios = {}` y `errores = {}` y recorre **solo** los tres nombres de campo (no `datos.items()`): por cada uno revisa que exista, que sea `str` y luego límpialo. Al final: si hay errores devuelve `{"ok": False, "errores": errores}`; si no, `{"ok": True, "datos": limpios}`.',
        ],
        solucion: retoCon(RETO_SOLUCION),
      },
    ],
  });
})();

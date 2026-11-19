// Ruta "El oficio", lección 3: APIs REST, desde los dos lados.
//
// La idea usa el motor de JavaScript con el fetch simulado de la tienda
// (js/api-tienda.js): el estudiante ve códigos de estado de verdad. La
// práctica y el reto están en Python (el motor de la ruta) y van del otro
// lado: el estudiante escribe el "servidor" que responde esas peticiones.
//
// Un servidor real (Flask, Express...) hace lo mismo que el de esta lección:
// un diccionario de (método, ruta) → función, y cada función devuelve un
// código de estado y un cuerpo que viaja como JSON.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  const ENCABEZADO = [
    'PRODUCTOS = [',
    '    {"id": 1, "nombre": "Arepa de queso", "precio": 3500},',
    '    {"id": 2, "nombre": "Tinto", "precio": 2000},',
    '    {"id": 3, "nombre": "Buñuelo", "precio": 1500},',
    ']',
    '',
    '',
    'def responder(estado, cuerpo):',
    '    # Toda respuesta HTTP lleva un código de estado y un cuerpo (que viaja como JSON)',
    '    return {"estado": estado, "cuerpo": cuerpo}',
    '',
    '',
    'def listar_productos(cuerpo):',
    '    return responder(200, PRODUCTOS)',
  ];

  // ---------- Práctica ----------

  const CREAR_SENCILLO = [
    'def crear_producto(cuerpo):',
    '    # Aquí no se guarda nada (cada ejecución empieza de cero): solo se',
    '    # devuelve el producto nuevo, con el id que le tocaría.',
    '    nuevo_id = max(p["id"] for p in PRODUCTOS) + 1',
    '    nuevo = {"id": nuevo_id, "nombre": cuerpo["nombre"], "precio": cuerpo["precio"]}',
    '    return responder(201, nuevo)',
  ];

  const practica = (rutas, atender) =>
    [
      ...ENCABEZADO,
      '',
      '',
      'def salud(cuerpo):',
      '    # Muchas APIs tienen una ruta así para saber si el servidor está vivo',
      '    return responder(200, {"estado": "ok"})',
      '',
      '',
      ...CREAR_SENCILLO,
      '',
      '',
      ...rutas,
      '',
      '',
      ...atender,
      '',
      '',
      'print(atender("GET", "/productos"))',
      'print(atender("GET", "/clientes"))',
      'print(atender("DELETE", "/productos"))',
      'print(atender("POST", "/productos", {"nombre": "Pandebono", "precio": 2500}))',
    ].join('\n');

  const RUTAS_INICIALES = [
    'RUTAS = {',
    '    ("GET", "/productos"): listar_productos,',
    '    ("GET", "/salud"): salud,',
    '}',
  ];
  const RUTAS_COMPLETAS = [
    'RUTAS = {',
    '    ("GET", "/productos"): listar_productos,',
    '    ("GET", "/salud"): salud,',
    '    ("POST", "/productos"): crear_producto,',
    '}',
  ];

  const ATENDER_VACIO = [
    'def atender(metodo, ruta, cuerpo=None):',
    '    # 1. Busca en RUTAS la función de (metodo, ruta) y llámala con el cuerpo.',
    '    # 2. Si la ruta existe pero con otro método: 405.',
    '    # 3. Si la ruta no existe: 404.',
    '    return responder(500, {"error": "Todavía no está hecho"})',
  ];
  const ATENDER_SOLUCION = [
    'def atender(metodo, ruta, cuerpo=None):',
    '    clave = (metodo.upper(), ruta)',
    '    if clave in RUTAS:',
    '        return RUTAS[clave](cuerpo)',
    '    if any(ruta_conocida == ruta for (_, ruta_conocida) in RUTAS):',
    '        return responder(405, {"error": "Método no permitido"})',
    '    return responder(404, {"error": "No existe " + ruta})',
  ];

  // ---------- Reto ----------

  const EMPAREJAR = [
    'def emparejar(patron, ruta):',
    '    # "/productos/<id>" con "/productos/7" -> {"id": "7"}. Si no encaja -> None.',
    '    partes_patron = patron.strip("/").split("/")',
    '    partes_ruta = ruta.strip("/").split("/")',
    '    if len(partes_patron) != len(partes_ruta):',
    '        return None',
    '    parametros = {}',
    '    for esperado, real in zip(partes_patron, partes_ruta):',
    '        if esperado.startswith("<") and esperado.endswith(">"):',
    '            parametros[esperado[1:-1]] = real',
    '        elif esperado != real:',
    '            return None',
    '    return parametros',
  ];

  const RUTAS_RETO = [
    'RUTAS = {',
    '    ("GET", "/productos"): listar_productos,',
    '    ("GET", "/productos/<id>"): ver_producto,',
    '    ("POST", "/productos"): crear_producto,',
    '}',
  ];

  // El paso 4 de atender (el try) es parte del reto.
  const atenderReto = (llamada) => [
    'def atender(metodo, ruta, cuerpo=None):',
    '    otro_metodo = False',
    '    for (metodo_ruta, patron), funcion in RUTAS.items():',
    '        parametros = emparejar(patron, ruta)',
    '        if parametros is None:',
    '            continue',
    '        if metodo_ruta != metodo.upper():',
    '            otro_metodo = True',
    '            continue',
    ...llamada,
    '    if otro_metodo:',
    '        return responder(405, {"error": "Método no permitido"})',
    '    return responder(404, {"error": "No existe " + ruta})',
  ];
  const LLAMADA_SIN_PROTEGER = ['        # "**parametros" pasa {"id": "7"} como id="7"', '        return funcion(cuerpo, **parametros)'];
  const LLAMADA_PROTEGIDA = [
    '        # "**parametros" pasa {"id": "7"} como id="7"',
    '        try:',
    '            return funcion(cuerpo, **parametros)',
    '        except Exception as error:',
    '            # El detalle se queda en el servidor (aquí, en la consola);',
    '            # al cliente no se le cuentan las tripas del sistema.',
    '            print("ERROR INTERNO:", repr(error))',
    '            return responder(500, {"error": "Error interno del servidor"})',
  ];

  const VER_Y_CREAR_VACIOS = [
    'def ver_producto(cuerpo, id):',
    '    # id llega como TEXTO, porque viene de la dirección: "/productos/7"',
    '    pass',
    '',
    '',
    'def crear_producto(cuerpo):',
    '    pass',
  ];
  const VER_Y_CREAR = [
    'def ver_producto(cuerpo, id):',
    '    # id llega como TEXTO, porque viene de la dirección: "/productos/7"',
    '    # isascii(): isdigit() solo también acepta "²", y int("²") revienta.',
    '    if not (id.isascii() and id.isdigit()):',
    '        return responder(400, {"error": "El id debe ser un número"})',
    '    for producto in PRODUCTOS:',
    '        if producto["id"] == int(id):',
    '            return responder(200, producto)',
    '    return responder(404, {"error": "No existe el producto " + id})',
    '',
    '',
    'def crear_producto(cuerpo):',
    '    if not isinstance(cuerpo, dict) or "nombre" not in cuerpo or "precio" not in cuerpo:',
    '        return responder(400, {"error": "Faltan datos: se necesitan nombre y precio"})',
    '    nuevo_id = max(p["id"] for p in PRODUCTOS) + 1',
    '    return responder(201, {"id": nuevo_id, "nombre": cuerpo["nombre"], "precio": cuerpo["precio"]})',
  ];

  const reto = (verYCrear, llamada) =>
    [
      ...ENCABEZADO,
      '',
      '',
      ...verYCrear,
      '',
      '',
      ...RUTAS_RETO,
      '',
      '',
      ...EMPAREJAR,
      '',
      '',
      ...atenderReto(llamada),
      '',
      '',
      'print(atender("GET", "/productos/2"))',
      'print(atender("GET", "/productos/99"))',
      'print(atender("GET", "/productos/abc"))',
      'print(atender("POST", "/productos", {"nombre": "Pandebono"}))',
    ].join('\n');

  const estado = (llamada) => 'atender(' + llamada + ')["estado"]';

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'apis-rest',
    titulo: 'APIs REST: cómo hablan los programas',
    pasos: [
      {
        id: 'idea',
        motor: 'javascript',
        titulo: 'Recursos, métodos y códigos de estado',
        texto: [
          'Casi todo sistema de una empresa es una **API**: un programa que recibe peticiones por internet y responde con datos. La app del celular, la página web y el sistema de facturación le hablan a la misma API. **REST** es la forma más común de organizarla, y tiene tres ideas:',
          '**1. Recursos con dirección.** Cada cosa tiene su ruta: `/productos` es la lista, `/productos/7` es uno solo. **2. Métodos que dicen qué hacer** con ese recurso: `GET` lee, `POST` crea, `PUT` o `PATCH` cambian (PUT reemplaza todo; PATCH, solo algunos campos) y `DELETE` borra. **3. Códigos de estado que dicen cómo salió**: `200` bien, `201` creado, `400` lo que mandaste está mal, `404` no existe, `405` ese método no se puede aquí, `500` el servidor falló. Los que empiezan por **4** son culpa de quien pide; los que empiezan por **5**, del servidor.',
          'Los datos van y vuelven en **JSON**, el formato que ya conoces. Ejecuta el ejemplo: le pide cosas a la API de la tienda de Don Pepe y muestra el código de cada respuesta. Fíjate en que un error también es una respuesta: trae su código y un mensaje en JSON.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function preguntar(metodo, ruta, cuerpo) {',
          '  const opciones = { method: metodo };',
          '  if (cuerpo) {',
          '    opciones.headers = { "Content-Type": "application/json" };',
          '    opciones.body = JSON.stringify(cuerpo);',
          '  }',
          '  const respuesta = await fetch(API + ruta, opciones);',
          '  const datos = await respuesta.json();',
          '  console.log(metodo + " " + ruta + "  →  " + respuesta.status + " " + respuesta.statusText);',
          '  console.log("   " + JSON.stringify(datos).slice(0, 90));',
          '}',
          '',
          'await preguntar("GET", "/productos/1");',
          'await preguntar("GET", "/productos/99");',
          'await preguntar("POST", "/pedidos", { cliente_id: 1, producto_id: 2, cantidad: 3 });',
          'await preguntar("POST", "/pedidos", { cliente_id: 1, producto_id: 2, cantidad: -2 });',
          'await preguntar("DELETE", "/productos/1");',
          'await preguntar("GET", "/ventas");',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El otro lado: tu propio servidor',
        texto: [
          'Ahora te toca ser el servidor. Por dentro, una API es casi siempre un **diccionario de rutas**: la clave es `(método, ruta)` y el valor es la función que la atiende. Así funcionan por dentro Flask, Django o Express; tú vas a escribir esa parte.',
          'Completa `atender(metodo, ruta, cuerpo=None)`: **1.** Si `(metodo, ruta)` está en `RUTAS`, llama a esa función con el `cuerpo` y devuelve lo que ella responda. Acepta el método en minúsculas también (`"get"`), como hacen los servidores. **2.** Si la ruta existe pero con otro método, responde `405` con `{"error": ...}`. **3.** Si no existe, `404` con `{"error": ...}`.',
          'Además, la función `crear_producto` ya está escrita pero nadie puede llegar a ella: **regístrala** en `RUTAS` para `POST /productos`.',
        ],
        codigo: practica(RUTAS_INICIALES, ATENDER_VACIO),
        pruebas: [
          {
            descripcion: 'GET /productos responde 200 con los 3 productos',
            condicion: 'atender("GET", "/productos") == {"estado": 200, "cuerpo": PRODUCTOS} and len(PRODUCTOS) == 3',
          },
          { descripcion: 'Acepta el método en minúsculas', condicion: 'atender("get", "/salud") == {"estado": 200, "cuerpo": {"estado": "ok"}}' },
          {
            descripcion: 'Una ruta que no existe responde 404 con un mensaje de error',
            condicion: estado('"GET", "/clientes"') + ' == 404 and "error" in atender("GET", "/clientes")["cuerpo"]',
          },
          {
            descripcion: 'Una ruta que existe con otro método responde 405',
            condicion: estado('"DELETE", "/productos"') + ' == 405 and "error" in atender("DELETE", "/productos")["cuerpo"] and ' + estado('"POST", "/salud"') + ' == 405',
          },
          {
            descripcion: 'POST /productos responde 201 con el producto nuevo',
            condicion: 'atender("POST", "/productos", {"nombre": "Pandebono", "precio": 2500}) == {"estado": 201, "cuerpo": {"id": 4, "nombre": "Pandebono", "precio": 2500}}',
          },
          {
            descripcion: 'atender busca en el diccionario RUTAS (una ruta nueva funciona sin tocar atender)',
            condicion: comprobar([
              'RUTAS[("GET", "/ping")] = lambda cuerpo: {"estado": 200, "cuerpo": "pong"}',
              'try:',
              '    ok = atender("GET", "/ping") == {"estado": 200, "cuerpo": "pong"}',
              'finally:',
              '    del RUTAS[("GET", "/ping")]',
            ]),
          },
        ],
        pistas: [
          'Arma la clave con el método en mayúsculas: `clave = (metodo.upper(), ruta)`. Si `clave in RUTAS`, devuelve `RUTAS[clave](cuerpo)`.',
          'Para el 405, mira si alguna clave tiene esa misma ruta: `any(r == ruta for (_, r) in RUTAS)`. Si no, responde `responder(404, {"error": "No existe " + ruta})`.',
          'Para registrar la función, agrega una línea dentro del diccionario: `("POST", "/productos"): crear_producto,` (sin paréntesis después de `crear_producto`: guardas la función, no la llamas).',
        ],
        solucion: practica(RUTAS_COMPLETAS, ATENDER_SOLUCION),
      },
      {
        id: 'reto',
        titulo: 'Reto: rutas con id y errores bien contados',
        texto: [
          'Las APIs reales tienen rutas con partes que cambian: `/productos/7`. El servidor ya sabe leerlas: `emparejar("/productos/<id>", "/productos/7")` da `{"id": "7"}`, y `atender` le pasa ese id a la función. Tú escribes las funciones y decides qué código responder en cada caso.',
          '**1.** `ver_producto(cuerpo, id)`: el `id` llega como **texto**. Si no son solo dígitos, `400` ("El id debe ser un número"). Si no hay un producto con ese id, `404`. Si lo hay, `200` con el producto. **2.** `crear_producto(cuerpo)`: si el cuerpo no es un diccionario o le falta `nombre` o `precio`, `400` con un mensaje que diga qué falta; si está completo, `201` con el producto nuevo (id siguiente al mayor). No lo agregues a `PRODUCTOS`: aquí cada ejecución empieza de cero.',
          '**3.** Si una función se revienta, hoy el servidor entero se cae. En `atender`, envuelve la llamada en `try` y, si algo falla, responde `500` con un mensaje **genérico**. El detalle del error se imprime en la consola del servidor (para quien lo arregla), nunca se le manda al cliente: le daría pistas a un atacante.',
        ],
        codigo: reto(VER_Y_CREAR_VACIOS, LLAMADA_SIN_PROTEGER),
        pruebas: [
          { descripcion: 'GET /productos/2 responde 200 con el tinto', condicion: 'atender("GET", "/productos/2") == {"estado": 200, "cuerpo": {"id": 2, "nombre": "Tinto", "precio": 2000}}' },
          {
            descripcion: 'Un id que no existe responde 404 con un mensaje',
            condicion: estado('"GET", "/productos/99"') + ' == 404 and "error" in atender("GET", "/productos/99")["cuerpo"]',
          },
          {
            descripcion: 'Un id que no es un número responde 400',
            condicion: estado('"GET", "/productos/abc"') + ' == 400 and ' + estado('"GET", "/productos/-1"') + ' == 400 and ' + estado('"GET", "/productos/²"') + ' == 400 and "error" in atender("GET", "/productos/abc")["cuerpo"]',
          },
          {
            descripcion: 'POST con nombre y precio responde 201 sin tocar PRODUCTOS',
            condicion: 'atender("POST", "/productos", {"nombre": "Pandebono", "precio": 2500}) == {"estado": 201, "cuerpo": {"id": 4, "nombre": "Pandebono", "precio": 2500}} and len(PRODUCTOS) == 3',
          },
          {
            descripcion: 'POST sin cuerpo o con datos incompletos responde 400',
            condicion: estado('"POST", "/productos"') + ' == 400 and ' + estado('"POST", "/productos", {"nombre": "Pandebono"}') + ' == 400 and ' + estado('"POST", "/productos", ["Pandebono", 2500]') + ' == 400',
          },
          {
            descripcion: 'Si una función se revienta, responde 500 sin mostrarle el detalle al cliente',
            condicion: comprobar([
              'def explota(cuerpo):',
              '    raise KeyError("clave_secreta_de_la_base")',
              '',
              'RUTAS[("GET", "/explota")] = explota',
              'try:',
              '    r = atender("GET", "/explota")',
              '    ok = r["estado"] == 500 and "clave_secreta" not in str(r["cuerpo"]) and "error" in r["cuerpo"]',
              'except Exception:',
              '    ok = False',
              'finally:',
              '    del RUTAS[("GET", "/explota")]',
            ]),
          },
          { descripcion: 'Lo que ya servía sigue igual: 404 y 405', condicion: estado('"GET", "/clientes"') + ' == 404 and ' + estado('"DELETE", "/productos/1"') + ' == 405' },
        ],
        pistas: [
          'En `ver_producto`: `if not (id.isascii() and id.isdigit()): return responder(400, {"error": "El id debe ser un número"})`. Después recorre `PRODUCTOS` comparando `producto["id"] == int(id)`.',
          'En `crear_producto`: `if not isinstance(cuerpo, dict) or "nombre" not in cuerpo or "precio" not in cuerpo:` responde 400. Si no, `nuevo_id = max(p["id"] for p in PRODUCTOS) + 1` y responde 201.',
          'En `atender`, cambia `return funcion(cuerpo, **parametros)` por un `try:` con esa línea adentro y un `except Exception as error:` que haga `print("ERROR INTERNO:", repr(error))` y `return responder(500, {"error": "Error interno del servidor"})`.',
        ],
        solucion: reto(VER_Y_CREAR, LLAMADA_PROTEGIDA),
      },
    ],
  });
})();

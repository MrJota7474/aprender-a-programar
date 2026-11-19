// Ruta "Proyectos", lección 5: la tienda completa, de punta a punta. Cada paso
// declara su propio motor (javascript, sql, python, javascript con fetch, web y
// python-ia) y su etiqueta; las "condicion" se escriben con las reglas de ESE
// motor (ver 02-catalogo-tienda.js y 03-asistente-resenas.js). Los datos son
// los de rutas/sql/00-base-tienda.js, los mismos que sirve js/api-tienda.js.

globalThis.Rutas.agregarLeccion(
  'proyectos',
  {
    id: 'tienda-completa',
    titulo: 'La tienda completa, de punta a punta',
    pasos: [
      {
        id: 'plan',
        etiqueta: 'El plan',
        titulo: 'Cómo viaja un dato por una aplicación real',
        texto: [
          'Cuando abres la tienda de Don Pepe en el celular, un dato (por ejemplo, cuántas arepas quedan) hace un viaje: sale de una **base de datos**, pasa por un **servidor** que decide qué hacer con él, viaja por internet hasta tu **página**, y al final un **asistente de IA** lo puede explicar con palabras.',
          'En este proyecto armas cada pieza, una por pestaña: **1.** SQL (la base de datos), **2.** Python (la lógica del servidor), **3.** JavaScript con `fetch` (la página le pide los datos a la API), **4.** HTML y CSS (lo que ve el cliente) y **5.** IA (el resumen en lenguaje natural).',
          'Es el mismo camino de casi cualquier aplicación que uses. Ejecuta el ejemplo y sigue con la pestaña **Base de datos**.',
        ],
        codigo: [
          'console.log("Proyecto: la tienda completa de Don Pepe");',
          'console.log("1. SQL: la base de datos guarda los pedidos");',
          'console.log("2. Python: el servidor aplica las reglas del negocio");',
          'console.log("3. JavaScript: la página pide los datos con fetch");',
          'console.log("4. HTML y CSS: el cliente ve el resultado");',
          'console.log("5. IA: un asistente lo explica con palabras");',
        ].join('\n'),
      },
      {
        id: 'base-de-datos',
        etiqueta: 'Base de datos',
        motor: 'sql',
        titulo: 'Las ventas por producto',
        texto: [
          '**Qué pieza es:** la base de datos. Es la memoria de la aplicación: guarda los pedidos aunque se apague todo. Va primero porque todo lo demás depende de sus datos.',
          'Don Pepe quiere saber qué se vende más. La tabla `pedidos` dice qué producto y cuántas unidades, y `productos` tiene el precio. Únelas con `JOIN` y muestra, por producto: el `nombre`, las unidades vendidas (`SUM` de `cantidad`) y los ingresos (`SUM` de `cantidad * precio`), en ese orden.',
          'Ordena de **mayor a menor ingreso** y, si dos productos empatan, por nombre (de la A a la Z).',
        ],
        codigo: '-- Ventas por producto: nombre, unidades e ingresos\n',
        pruebas: [
          { descripcion: 'Muestra tres columnas: nombre, unidades e ingresos', condicion: 'columnas.length === 3' },
          { descripcion: 'Hay una fila por cada producto vendido (8)', condicion: 'filas.length === 8' },
          { descripcion: 'Usas JOIN y GROUP BY', condicion: 'codigo.includes("JOIN") && codigo.includes("GROUP BY")' },
          {
            descripcion: 'Los valores y el orden son correctos (mayor ingreso primero, empates por nombre)',
            condicion:
              'igualA("SELECT p.nombre, SUM(pe.cantidad), SUM(pe.cantidad * p.precio) FROM pedidos pe JOIN productos p ON p.id = pe.producto_id GROUP BY p.id ORDER BY SUM(pe.cantidad * p.precio) DESC, p.nombre")',
          },
        ],
        pistas: [
          'Une las tablas así: `FROM pedidos pe JOIN productos p ON p.id = pe.producto_id`.',
          'Para sumar por producto agrupa con `GROUP BY p.id` y usa `SUM(pe.cantidad)` y `SUM(pe.cantidad * p.precio)`.',
          'Para ordenar: `ORDER BY ingresos DESC, p.nombre` (ponle el alias `AS ingresos` a la segunda suma).',
        ],
        solucion: [
          'SELECT p.nombre,',
          '       SUM(pe.cantidad) AS unidades,',
          '       SUM(pe.cantidad * p.precio) AS ingresos',
          'FROM pedidos pe',
          'JOIN productos p ON p.id = pe.producto_id',
          'GROUP BY p.id',
          'ORDER BY ingresos DESC, p.nombre;',
        ].join('\n'),
      },
      {
        id: 'servidor',
        etiqueta: 'El servidor',
        motor: 'python',
        titulo: 'La regla de inventario bajo',
        texto: [
          '**Qué pieza es:** la lógica del servidor. Entre la base de datos y la página hay un programa que recibe los datos, aplica las **reglas del negocio** y contesta en un formato que todos entienden: **JSON**. Va en el medio para que la página no tenga que conocer la base de datos ni repetir las reglas.',
          'Crea la función `armar_respuesta(productos)`. Recibe una **lista de diccionarios** (filas con `nombre`, `precio` y `existencias`) y devuelve **un texto JSON** con dos claves: `"total_productos"` (cuántos productos llegaron) y `"alertas"` (una lista con `{"nombre": ..., "existencias": ...}` de los productos con **menos de 20** existencias, en el mismo orden en que llegaron).',
          'Con una lista vacía: `{"total_productos": 0, "alertas": []}`. Usa `json.dumps` para armar el texto.',
        ],
        codigo: [
          'import json',
          '',
          '# Crea aquí la función armar_respuesta',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'armar_respuesta es una función', condicion: 'callable(armar_respuesta)' },
          {
            descripcion: 'Devuelve un texto JSON (no un diccionario)',
            condicion: 'isinstance(armar_respuesta([]), str) and json.loads(armar_respuesta([])) == {"total_productos": 0, "alertas": []}',
          },
          {
            descripcion: 'Cuenta los productos y avisa de los que tienen menos de 20 existencias',
            condicion:
              'json.loads(armar_respuesta([{"nombre": "Tinto", "precio": 2000, "existencias": 100}, {"nombre": "Café en grano", "precio": 18000, "existencias": 12}, {"nombre": "Panela", "precio": 4000, "existencias": 20}, {"nombre": "Bocadillo veleño", "precio": 3000, "existencias": 0}])) == {"total_productos": 4, "alertas": [{"nombre": "Café en grano", "existencias": 12}, {"nombre": "Bocadillo veleño", "existencias": 0}]}',
          },
          {
            descripcion: 'Con 20 existencias exactas todavía no hay alerta',
            condicion:
              'json.loads(armar_respuesta([{"nombre": "Panela", "precio": 4000, "existencias": 20}]))["alertas"] == []',
          },
          { descripcion: 'Usas json.dumps', condicion: '"json.dumps" in codigo' },
        ],
        pistas: [
          'Recorre la lista con una comprensión: `[... for p in productos if p["existencias"] < 20]`.',
          'Cada alerta es un diccionario nuevo: `{"nombre": p["nombre"], "existencias": p["existencias"]}`.',
          'Termina con `return json.dumps({"total_productos": len(productos), "alertas": alertas}, ensure_ascii=False)`.',
        ],
        solucion: [
          'import json',
          '',
          '',
          'def armar_respuesta(productos):',
          '    alertas = [',
          '        {"nombre": p["nombre"], "existencias": p["existencias"]}',
          '        for p in productos',
          '        if p["existencias"] < 20',
          '    ]',
          '    return json.dumps({"total_productos": len(productos), "alertas": alertas}, ensure_ascii=False)',
        ].join('\n'),
      },
      {
        id: 'la-api',
        etiqueta: 'Pedir con fetch',
        motor: 'javascript',
        titulo: 'La página le pide los datos a la API',
        texto: [
          '**Qué pieza es:** el cliente que habla con el servidor. La página no tiene los datos: se los **pide por internet** con `fetch` a una dirección (la API) y los transforma para mostrarlos. Por eso es `async`: la respuesta tarda y la página no se puede quedar congelada esperándola.',
          'Crea la función `async` llamada `catalogoDisponible()`. Debe pedir `API + "/productos"`, quedarse solo con los productos que **sí hay** (`existencias` mayores que 0) y devolver una lista de objetos `{ nombre, precio }`, ordenada del **más barato al más caro**.',
          'Si la respuesta no es `ok`, lanza un error con `throw new Error("No se pudo cargar el catálogo")`: así la página sabría avisarle al cliente en vez de mostrar datos rotos.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function catalogoDisponible() {',
          '  return [];',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'catalogoDisponible es una función', condicion: 'typeof catalogoDisponible === "function"' },
          {
            descripcion: 'Devuelve los 9 productos que hay (el bocadillo agotado no aparece)',
            condicion:
              '(async () => { const c = await catalogoDisponible(); return c.length === 9 && !c.some((p) => p.nombre === "Bocadillo veleño"); })()',
          },
          {
            descripcion: 'Cada elemento trae solo nombre y precio',
            condicion:
              '(async () => { const c = await catalogoDisponible(); return c.length > 0 && c.every((p) => Object.keys(p).sort().join() === "nombre,precio"); })()',
          },
          {
            descripcion: 'Va del más barato (Buñuelo) al más caro (Café en grano)',
            condicion:
              '(async () => { const c = await catalogoDisponible(); return c.length > 0 && c[0].nombre === "Buñuelo" && c[c.length - 1].nombre === "Café en grano" && c.every((p, i) => i === 0 || c[i - 1].precio <= p.precio); })()',
          },
          {
            descripcion: 'Los datos se piden con fetch (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await catalogoDisponible(); } finally { fetch = real; } return n >= 1; })()',
          },
          {
            descripcion: 'Si la respuesta no es ok, lanza "No se pudo cargar el catálogo"',
            condicion:
              '(async () => { const real = fetch; fetch = async () => ({ ok: false }); try { await catalogoDisponible(); return false; } catch (e) { return e.message === "No se pudo cargar el catálogo"; } finally { fetch = real; } })()',
          },
        ],
        pistas: [
          'Pide con `const respuesta = await fetch(API + "/productos");` y convierte con `await respuesta.json()`.',
          'Filtra con `.filter((p) => p.existencias > 0)`, transforma con `.map((p) => ({ nombre: p.nombre, precio: p.precio }))` y ordena con `.sort((a, b) => a.precio - b.precio)`.',
          'Antes de leer el JSON: `if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo");`',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function catalogoDisponible() {',
          '  const respuesta = await fetch(API + "/productos");',
          '  if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo");',
          '  const productos = await respuesta.json();',
          '  return productos',
          '    .filter((p) => p.existencias > 0)',
          '    .map((p) => ({ nombre: p.nombre, precio: p.precio }))',
          '    .sort((a, b) => a.precio - b.precio);',
          '}',
        ].join('\n'),
      },
      {
        id: 'la-pagina',
        etiqueta: 'La página',
        motor: 'web',
        titulo: 'Lo que ve el cliente',
        texto: [
          '**Qué pieza es:** la interfaz. Es lo único que el cliente ve; todo lo anterior trabaja detrás. Con HTML pones el contenido y con CSS le das forma y color.',
          'Dentro del `<div class="vitrina">` crea **tres tarjetas** `<div class="producto">`, cada una con un `<h2>` (el nombre) y un `<p class="precio">`. A **una** tarjeta ponle además la clase `poco` (`class="producto poco"`): es un producto con pocas existencias.',
          'En `<style>`: que `.vitrina` use **cuadrícula** (`display: grid`), que `.producto` tenga color de fondo y espacio interno (`padding`), y que `.poco` tenga **su propio color de fondo** para llamar la atención.',
        ],
        codigo: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title>La tienda de Don Pepe</title>',
          '    <style>',
          '      /* Escribe tus estilos aquí */',
          '    </style>',
          '  </head>',
          '  <body>',
          '    <h1>La tienda de Don Pepe</h1>',
          '    <div class="vitrina">',
          '      <!-- Escribe aquí las tres tarjetas -->',
          '    </div>',
          '  </body>',
          '</html>',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Hay tres tarjetas dentro de la vitrina', condicion: 'cuenta(".vitrina > .producto") === 3' },
          {
            descripcion: 'Cada tarjeta tiene un título h2 y un precio con números',
            condicion:
              'todos(".producto").length === 3 && todos(".producto").every((t) => t.uno("h2") !== null && t.uno("h2").texto !== "" && t.uno(".precio") !== null && /[0-9]/.test(t.uno(".precio").texto))',
          },
          { descripcion: 'Una tarjeta es de producto con pocas existencias (clase poco)', condicion: 'cuenta(".producto.poco") >= 1' },
          { descripcion: 'La vitrina usa cuadrícula (display: grid)', condicion: 'estilo(".vitrina", "display") === "grid"' },
          {
            descripcion: 'Las tarjetas tienen color de fondo y espacio interno',
            condicion: 'estilo(".producto", "background-color") !== "" && estilo(".producto", "padding-top") !== ""',
          },
          { descripcion: 'Las tarjetas con pocas existencias tienen su propio color de fondo', condicion: 'estilo(".poco", "background-color") !== ""' },
        ],
        pistas: [
          'Una tarjeta: `<div class="producto">`, un `<h2>`, un `<p class="precio">` y `</div>`. La que tiene pocas existencias: `<div class="producto poco">`.',
          'En el estilo: `.vitrina { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }`',
          'Y los colores: `.producto { background-color: #fff3cd; padding: 16px; }` y `.poco { background-color: #fecaca; }`',
        ],
        solucion: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title>La tienda de Don Pepe</title>',
          '    <style>',
          '      .vitrina { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }',
          '      .producto { background-color: #fff3cd; padding: 16px; border-radius: 8px; }',
          '      .poco { background-color: #fecaca; }',
          '      .precio { color: #b45309; font-weight: bold; }',
          '    </style>',
          '  </head>',
          '  <body>',
          '    <h1>La tienda de Don Pepe</h1>',
          '    <div class="vitrina">',
          '      <div class="producto">',
          '        <h2>Tinto</h2>',
          '        <p class="precio">$2.000</p>',
          '      </div>',
          '      <div class="producto">',
          '        <h2>Jugo de lulo</h2>',
          '        <p class="precio">$4.500</p>',
          '      </div>',
          '      <div class="producto poco">',
          '        <h2>Café en grano</h2>',
          '        <p class="precio">$18.000</p>',
          '      </div>',
          '    </div>',
          '  </body>',
          '</html>',
        ].join('\n'),
      },
      {
        id: 'el-asistente',
        etiqueta: 'El asistente',
        motor: 'python-ia',
        titulo: 'Un resumen con palabras',
        texto: [
          '**Qué pieza es:** la IA como servicio. Las tablas y el JSON son para los programas; a Don Pepe y a sus clientes les sirve más una **frase**. El asistente toma los datos que ya calculaste y los convierte en lenguaje natural. Va al final porque necesita datos buenos para decir algo útil.',
          'Crea `resumen_ventas(ventas)`: recibe una lista de diccionarios `{"producto": ..., "unidades": ...}` **ya ordenada del más vendido al menos vendido**. Arma un texto que empiece con `"Lo más vendido fue X con N unidades."` y siga con `"En total se vendieron T unidades."`. Envíaselo al modelo con `ia.preguntar`, con un mensaje de `sistema` que le pida **resumir el texto en una sola frase**, y devuelve su `"contenido"`.',
          'El mensaje del usuario debe ser `"Texto: " + texto`. Si la lista está vacía, devuelve `"Todavía no hay ventas."` sin llamar al modelo.',
        ],
        codigo: [
          'import ia',
          '',
          '',
          'def resumen_ventas(ventas):',
          '    if not ventas:',
          '        return "Todavía no hay ventas."',
          '    lider = ventas[0]',
          '    total = sum(v["unidades"] for v in ventas)',
          '    texto = (',
          '        "Lo más vendido fue " + lider["producto"] + " con " + str(lider["unidades"]) + " unidades. "',
          '        + "En total se vendieron " + str(total) + " unidades."',
          '    )',
          '    mensajes = [',
          '        {"rol": "usuario", "contenido": "Texto: " + texto},',
          '    ]',
          '    return ia.preguntar(mensajes)["contenido"]',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Sin ventas devuelve el aviso', condicion: 'resumen_ventas([]) == "Todavía no hay ventas."' },
          {
            descripcion: 'El modelo resume en una sola frase con lo más vendido',
            condicion:
              'resumen_ventas([{"producto": "Tinto", "unidades": 5}, {"producto": "Empanada", "unidades": 3}]) == "Lo más vendido fue Tinto con 5 unidades."',
          },
          {
            descripcion: 'Funciona con otros datos',
            condicion:
              'resumen_ventas([{"producto": "Arepa de queso", "unidades": 12}, {"producto": "Buñuelo", "unidades": 7}, {"producto": "Oblea", "unidades": 1}]) == "Lo más vendido fue Arepa de queso con 12 unidades."',
          },
          {
            descripcion: 'La respuesta sale del modelo (se llama a ia.preguntar)',
            // Espía: reemplaza ia.preguntar un momento, cuenta las llamadas y lo restaura siempre.
            condicion:
              'exec("def _contar_llamadas():\\n    real = ia.preguntar\\n    llamadas = []\\n    def espia(*a, **k):\\n        llamadas.append(1)\\n        return real(*a, **k)\\n    ia.preguntar = espia\\n    try:\\n        resumen_ventas([{\\"producto\\": \\"Tinto\\", \\"unidades\\": 5}])\\n    finally:\\n        ia.preguntar = real\\n    return len(llamadas)", globals()) or _contar_llamadas() >= 1',
          },
        ],
        pistas: [
          'Agrega al comienzo de la lista `mensajes` un diccionario con `"rol": "sistema"`.',
          'La instrucción debe decir que **resuma el texto en una sola frase**.',
          '`{"rol": "sistema", "contenido": "Resume el texto en una sola frase."},`',
        ],
        solucion: [
          'import ia',
          '',
          '',
          'def resumen_ventas(ventas):',
          '    if not ventas:',
          '        return "Todavía no hay ventas."',
          '    lider = ventas[0]',
          '    total = sum(v["unidades"] for v in ventas)',
          '    texto = (',
          '        "Lo más vendido fue " + lider["producto"] + " con " + str(lider["unidades"]) + " unidades. "',
          '        + "En total se vendieron " + str(total) + " unidades."',
          '    )',
          '    mensajes = [',
          '        {"rol": "sistema", "contenido": "Resume el texto en una sola frase."},',
          '        {"rol": "usuario", "contenido": "Texto: " + texto},',
          '    ]',
          '    return ia.preguntar(mensajes)["contenido"]',
        ].join('\n'),
      },
      {
        id: 'todo-conectado',
        etiqueta: 'Todo conectado',
        motor: 'javascript',
        titulo: 'Así se conecta todo',
        texto: [
          'Mira el camino completo de un dato: **base de datos** (SQL) → **servidor** (Python) → **API** (HTTP y JSON) → **página** (`fetch`, HTML y CSS) → **asistente** (IA). Cada pieza hace una sola cosa y le pasa el resultado a la siguiente; por eso se pueden cambiar o mejorar por separado.',
          'Esto es lo que hace un equipo de verdad: unos cuidan los datos (backend y datos), otros la pantalla (frontend) y otros el uso de la IA. Para ver el panorama completo, los caminos de trabajo y qué cubre una carrera, abre la pantalla **Mapa del oficio** (la dirección `#mapa`).',
        ],
        codigo: [
          'const camino = [',
          '  ["SQL", "guarda y consulta los pedidos"],',
          '  ["Python", "aplica las reglas y arma el JSON"],',
          '  ["fetch", "la página pide los datos por internet"],',
          '  ["HTML y CSS", "el cliente ve el catálogo"],',
          '  ["IA", "el asistente lo explica con palabras"],',
          '];',
          '',
          'for (const [pieza, queHace] of camino) {',
          '  console.log(pieza + ": " + queHace);',
          '}',
        ].join('\n'),
      },
    ],
  }
);

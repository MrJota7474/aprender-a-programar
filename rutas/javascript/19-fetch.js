// Lección 19 de JavaScript: pedir datos con fetch (API simulada de la tienda).
// Las pruebas asíncronas siguen el modelo de 18-async-await.js: condiciones
// '(async () => ...)()' y try/catch que devuelve true para comprobar un fallo.
// Las direcciones disponibles están en js/api-tienda.js.

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'fetch',
    titulo: 'Pedir datos con fetch',
    pasos: [
      {
        id: 'idea',
        titulo: 'Hablar con una API',
        texto: [
          'Una **API** es una ventanilla de un servicio: tú pides algo por una dirección y el servicio contesta. La tienda de Don Pepe tiene la suya en `https://api.tienda-donpepe.co` (aquí es simulada, pero se comporta igual).',
          '`fetch(direccion)` devuelve una promesa con la **respuesta**. La respuesta trae `status` (el código: 200 es "todo bien", 404 es "no existe", 500 es "el servidor falló"), `ok` (`true` si el código está entre 200 y 299) y `json()`, que devuelve otra promesa con los datos ya convertidos.',
          '**Revisa siempre `respuesta.ok` antes de usar los datos**: si el producto no existe, la respuesta igual llega, pero con un error en vez del producto. Ojo: `json()` solo se puede leer una vez por respuesta.',
          'Para **enviar** datos se usa `POST`: le pasas a `fetch` un segundo argumento con el `method`, los `headers` (aquí avisas que va JSON) y el `body`, que debe ser texto: por eso se usa `JSON.stringify(objeto)`.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 4: pide el producto con ese `id` y espera la respuesta. Línea 5: muestra su código; para el 4 es 200 y `ok` es `true`, para el 99 es 404 y `ok` es `false`.',
          'Línea 6: convierte el cuerpo de la respuesta en datos. Líneas 7 a 11: si salió bien muestra el nombre; si no, el mensaje de error que mandó el servicio.',
          'Líneas 17 a 21: un `POST` a `/pedidos` con el pedido nuevo convertido en texto. El servicio contesta 201 ("creado") y devuelve el pedido con su `id` nuevo.',
          '**Error común:** creer que `fetch` falla cuando el producto no existe. Con un 404 la promesa **no** se rechaza ni salta al `catch`: llega una respuesta normal con `ok` en `false`. Si no lo revisas, `datos.nombre` sale `undefined`. Solución: pregunta `if (!respuesta.ok)` antes de usar los datos.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function verProducto(id) {',
          '  const respuesta = await fetch(API + "/productos/" + id);',
          '  console.log("Código:", respuesta.status, "ok:", respuesta.ok);',
          '  const datos = await respuesta.json();',
          '  if (respuesta.ok) {',
          '    console.log(datos.nombre);',
          '  } else {',
          '    console.log(datos.error);',
          '  }',
          '}',
          '',
          'await verProducto(4);',
          'await verProducto(99);',
          '',
          '// Enviar datos: un pedido nuevo',
          'const envio = await fetch(API + "/pedidos", {',
          '  method: "POST",',
          '  headers: { "Content-Type": "application/json" },',
          '  body: JSON.stringify({ cliente_id: 1, producto_id: 4, cantidad: 2 }),',
          '});',
          'console.log("Pedido creado:", envio.status, await envio.json());',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El nombre de un producto',
        texto: [
          'Crea la función `async` llamada `nombreDeProducto(id)`. Debe pedir `API + "/productos/" + id` con `fetch`.',
          'Si la respuesta **no** está `ok` (por ejemplo, el producto no existe), devuelve `null`. Si está bien, devuelve el `nombre` del producto.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function nombreDeProducto(id) {',
          '  // TODO 1: pide API + "/productos/" + id con fetch (y await).',
          '  // TODO 2: si la respuesta no está ok, devuelve null.',
          '  // TODO 3: si está bien, lee los datos con .json() y devuelve el nombre.',
          '  return "";',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'nombreDeProducto es una función', condicion: 'typeof nombreDeProducto === "function"' },
          {
            descripcion: 'El producto 1 es "Arepa de queso"',
            condicion: '(async () => (await nombreDeProducto(1)) === "Arepa de queso")()',
          },
          {
            descripcion: 'El producto 4 es "Tinto" y el 10 es "Oblea"',
            condicion:
              '(async () => (await nombreDeProducto(4)) === "Tinto" && (await nombreDeProducto(10)) === "Oblea")()',
          },
          {
            descripcion: 'Un id que no existe (99) devuelve null',
            condicion: '(async () => (await nombreDeProducto(99)) === null)()',
          },
          {
            descripcion: 'Revisa la respuesta: si no está ok, devuelve null aunque traiga datos',
            condicion:
              '(async () => { const real = fetch; fetch = async () => ({ ok: false, status: 404, json: async () => ({ nombre: "Fantasma" }) }); try { return (await nombreDeProducto(4)) === null; } finally { fetch = real; } })()',
          },
          {
            descripcion: 'Los datos se piden con fetch (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await nombreDeProducto(4); } finally { fetch = real; } return n >= 1; })()',
          },
        ],
        pistas: [
          'Tu función se parece a `verProducto` de la Idea, pero en vez de mostrar, devuelve con `return`.',
          'Empieza con `const respuesta = await fetch(API + "/productos/" + id);` y antes de leer los datos: `if (!respuesta.ok) { return null; }`',
          'Si todo va bien: `const producto = await respuesta.json(); return producto.nombre;`',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function nombreDeProducto(id) {',
          '  const respuesta = await fetch(API + "/productos/" + id);',
          '  if (!respuesta.ok) {',
          '    return null;',
          '  }',
          '  const producto = await respuesta.json();',
          '  return producto.nombre;',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: crear un pedido',
        texto: [
          'Crea la función `async` llamada `crearPedido(clienteId, productoId, cantidad)`. Debe enviar un `POST` a `API + "/pedidos"` con un cuerpo JSON `{ cliente_id, producto_id, cantidad }` (recuerda `JSON.stringify` y el encabezado `Content-Type`).',
          'Si el servicio responde bien (201), devuelve el pedido creado. Si responde con error (400, por ejemplo una cantidad de 0 o un producto que no existe), **lanza** `new Error(...)` con el mensaje que trae el servicio en la propiedad `error` del JSON.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function crearPedido(clienteId, productoId, cantidad) {',
          '  // TODO 1: envía un POST a API + "/pedidos" con el cuerpo en JSON,',
          '  //         igual que el envío del ejemplo de la Idea.',
          '  // TODO 2: lee los datos de la respuesta con .json().',
          '  // TODO 3: si la respuesta no está ok, lanza un Error con datos.error;',
          '  //         si está bien, devuelve los datos.',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'crearPedido es una función', condicion: 'typeof crearPedido === "function"' },
          {
            descripcion: 'Devuelve el pedido creado (cliente 1, producto 4, cantidad 2)',
            condicion:
              '(async () => { const p = await crearPedido(1, 4, 2); return !!p && p.id === 11 && p.cliente_id === 1 && p.producto_id === 4 && p.cantidad === 2; })()',
          },
          {
            descripcion: 'Con otros datos (cliente 3, producto 7, cantidad 5) también funciona',
            condicion:
              '(async () => { const p = await crearPedido(3, 7, 5); return !!p && p.cliente_id === 3 && p.producto_id === 7 && p.cantidad === 5; })()',
          },
          {
            descripcion: 'Con cantidad 0 lanza un Error que habla de la cantidad',
            condicion:
              '(async () => { try { await crearPedido(1, 4, 0); return false; } catch (e) { return e instanceof Error && /cantidad/i.test(e.message); } })()',
          },
          {
            descripcion: 'Con un producto que no existe (99) lanza un Error con el mensaje del servicio',
            condicion:
              '(async () => { try { await crearPedido(1, 99, 1); return false; } catch (e) { return e instanceof Error && /producto/i.test(e.message); } })()',
          },
          {
            descripcion: 'Los datos se piden con fetch (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await crearPedido(2, 5, 1); } finally { fetch = real; } return n >= 1; })()',
          },
          {
            descripcion: 'Usas POST, JSON.stringify y throw',
            condicion: '/POST/i.test(codigo) && /JSON\\.stringify/.test(codigo) && /throw/.test(codigo)',
          },
        ],
        pistas: [
          'Copia el envío de las líneas 17 a 21 de la Idea y cambia los números fijos por los parámetros. Ojo: el servicio usa `cliente_id`, con guion bajo.',
          'El cuerpo es `body: JSON.stringify({ cliente_id: clienteId, producto_id: productoId, cantidad: cantidad })`. Lee siempre los datos con `await respuesta.json()`: si salió bien es el pedido, y si falló trae `{ error: "..." }`.',
          'Si `!respuesta.ok`, lanza `throw new Error(datos.error);`; si no, `return datos;`',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function crearPedido(clienteId, productoId, cantidad) {',
          '  const respuesta = await fetch(API + "/pedidos", {',
          '    method: "POST",',
          '    headers: { "Content-Type": "application/json" },',
          '    body: JSON.stringify({ cliente_id: clienteId, producto_id: productoId, cantidad: cantidad }),',
          '  });',
          '  const datos = await respuesta.json();',
          '  if (!respuesta.ok) {',
          '    throw new Error(datos.error);',
          '  }',
          '  return datos;',
          '}',
        ].join('\n'),
      },
    ],
  }
);

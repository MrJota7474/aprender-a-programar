// Lección 20 de JavaScript: repaso de async/await y fetch con tres retos.
// Mismo modelo de pruebas que 18-async-await.js; datos en js/api-tienda.js.

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'repaso-async',
    titulo: 'Repaso: retos con async',
    pasos: [
      {
        id: 'reto1',
        etiqueta: 'Reto 1',
        titulo: 'Cuánto vale lo que hay en una categoría',
        texto: [
          'Don Pepe quiere saber cuánta plata tiene guardada en cada categoría. Crea la función `async` llamada `valorInventario(categoria)`.',
          'Debe pedir `API + "/productos?categoria=" + categoria` y devolver la **suma de `precio * existencias`** de esos productos. Si la categoría no existe, devuelve `0`.',
          'Lo que va después del `?` en la dirección se llama **parámetro de consulta**: es como decirle a la ventanilla "solo los de esta categoría". Por ejemplo, Bebidas debe dar `387500`.',
          'Repasa: fetch (lección 19) y `reduce` (lección 16).',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function valorInventario(categoria) {',
          '  // TODO 1: pide los productos de esa categoría con fetch y conviértelos con .json().',
          '  // TODO 2: suma precio * existencias de cada producto (empieza en 0) y devuelve el total.',
          '  return 0;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'valorInventario es una función', condicion: 'typeof valorInventario === "function"' },
          {
            descripcion: 'Bebidas vale 387500',
            condicion: '(async () => (await valorInventario("Bebidas")) === 387500)()',
          },
          {
            descripcion: 'Comidas vale 410000 y Mercado 296000',
            condicion:
              '(async () => (await valorInventario("Comidas")) === 410000 && (await valorInventario("Mercado")) === 296000)()',
          },
          {
            descripcion: 'Dulces vale 52500 (el bocadillo agotado no suma)',
            condicion: '(async () => (await valorInventario("Dulces")) === 52500)()',
          },
          {
            descripcion: 'Una categoría que no existe vale 0',
            condicion: '(async () => (await valorInventario("Ropa")) === 0)()',
          },
          {
            descripcion: 'Los datos se piden con fetch (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await valorInventario("Bebidas"); } finally { fetch = real; } return n >= 1; })()',
          },
        ],
        pistas: [
          'Son dos partes: pedir la lista (como en la lección 19) y reducirla a un solo número (como en la 16).',
          'Pide con `await fetch(API + "/productos?categoria=" + categoria)` y luego `await respuesta.json()`. Para sumar usa `reduce` con valor inicial 0.',
          'La suma queda `return productos.reduce((total, p) => total + p.precio * p.existencias, 0);`. Con una categoría vacía, el valor inicial 0 es la respuesta.',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function valorInventario(categoria) {',
          '  const respuesta = await fetch(API + "/productos?categoria=" + categoria);',
          '  const productos = await respuesta.json();',
          '  return productos.reduce((total, p) => total + p.precio * p.existencias, 0);',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto2',
        etiqueta: 'Reto 2',
        titulo: 'Cuántos pedidos tiene cada cliente',
        texto: [
          'Crea la función `async` llamada `pedidosPorCliente()`. Debe pedir `/clientes` y `/pedidos` y devolver un **objeto** cuyas claves son los nombres de los clientes y cuyos valores son cuántos pedidos tiene cada uno (`0` si no tiene ninguno). Ejemplo: `{ "Laura Gómez": 3, ... }`.',
          'Tip: `Promise.all([promesaA, promesaB])` espera varias promesas a la vez y entrega sus resultados en un arreglo, así no esperas una petición después de la otra.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function pedidosPorCliente() {',
          '  // TODO 1: pide /clientes y /pedidos (con Promise.all) y lee los dos con .json().',
          '  // TODO 2: crea un objeto vacío y, por cada cliente, guarda cuántos pedidos',
          '  //         tienen su cliente_id. Devuelve el objeto.',
          '  return {};',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'pedidosPorCliente es una función', condicion: 'typeof pedidosPorCliente === "function"' },
          {
            descripcion: 'Devuelve un objeto con los 6 clientes',
            condicion:
              '(async () => { const r = await pedidosPorCliente(); return !!r && typeof r === "object" && Object.keys(r).length === 6; })()',
          },
          {
            descripcion: 'Laura Gómez tiene 3 pedidos y Mateo Ríos 2',
            condicion:
              '(async () => { const r = await pedidosPorCliente(); return r["Laura Gómez"] === 3 && r["Mateo Ríos"] === 2; })()',
          },
          {
            descripcion: 'Valentina Cruz tiene 1 y Samuel Díaz 2',
            condicion:
              '(async () => { const r = await pedidosPorCliente(); return r["Valentina Cruz"] === 1 && r["Samuel Díaz"] === 2; })()',
          },
          {
            descripcion: 'Andrés Mora no tiene pedidos: aparece con 0',
            condicion: '(async () => (await pedidosPorCliente())["Andrés Mora"] === 0)()',
          },
          {
            descripcion: 'Los datos se piden con fetch, dos peticiones (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await pedidosPorCliente(); } finally { fetch = real; } return n >= 2; })()',
          },
        ],
        pistas: [
          'Pide las dos listas: `const [rc, rp] = await Promise.all([fetch(API + "/clientes"), fetch(API + "/pedidos")]);` y lee cada una con `await rc.json()`.',
          'Recorre los clientes y, por cada uno, cuenta con `pedidos.filter((p) => p.cliente_id === cliente.id).length`.',
          'Guarda cada cuenta en un objeto: `conteo[cliente.nombre] = ...`. Los corchetes usan el valor de `cliente.nombre` como nombre de la propiedad, igual que en la lección 16.',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function pedidosPorCliente() {',
          '  const [respClientes, respPedidos] = await Promise.all([',
          '    fetch(API + "/clientes"),',
          '    fetch(API + "/pedidos"),',
          '  ]);',
          '  const clientes = await respClientes.json();',
          '  const pedidos = await respPedidos.json();',
          '  const conteo = {};',
          '  for (const cliente of clientes) {',
          '    conteo[cliente.nombre] = pedidos.filter((p) => p.cliente_id === cliente.id).length;',
          '  }',
          '  return conteo;',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto3',
        etiqueta: 'Reto 3',
        titulo: 'Cuando el servidor falla',
        texto: [
          'El servidor de ventas (`/ventas`) está caído: siempre responde 500. Una buena app no se rompe por eso: usa un valor de respaldo.',
          'Crea la función `async` llamada `pedirConRespaldo(ruta, respaldo)`. Debe pedir `API + ruta` y, si la respuesta está `ok`, devolver sus datos (`json()`). Si **no** está `ok`, devolver `respaldo` en vez de dejar escapar un error.',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function pedirConRespaldo(ruta, respaldo) {',
          '  // TODO 1: pide API + ruta con fetch.',
          '  // TODO 2: si la respuesta no está ok, devuelve respaldo.',
          '  // TODO 3: si está bien, devuelve sus datos con .json().',
          '  return respaldo;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'pedirConRespaldo es una función', condicion: 'typeof pedirConRespaldo === "function"' },
          {
            descripcion: '/ventas (error 500) devuelve el respaldo',
            condicion:
              '(async () => (await pedirConRespaldo("/ventas", "Ventas no disponibles")) === "Ventas no disponibles")()',
          },
          {
            descripcion: 'Un respaldo distinto también funciona (arreglo vacío)',
            condicion:
              '(async () => { const r = await pedirConRespaldo("/ventas", []); return Array.isArray(r) && r.length === 0; })()',
          },
          {
            descripcion: '/clientes responde bien: devuelve los 6 clientes, no el respaldo',
            condicion:
              '(async () => { const r = await pedirConRespaldo("/clientes", []); return Array.isArray(r) && r.length === 6; })()',
          },
          {
            descripcion: '/productos/4 devuelve el Tinto y /productos/99 el respaldo',
            condicion:
              '(async () => { const a = await pedirConRespaldo("/productos/4", null); const b = await pedirConRespaldo("/productos/99", "sin producto"); return !!a && a.nombre === "Tinto" && b === "sin producto"; })()',
          },
          {
            descripcion: 'Los datos se piden con fetch (no están escritos a mano)',
            condicion:
              '(async () => { let n = 0; const real = fetch; fetch = (...a) => { n++; return real(...a); }; try { await pedirConRespaldo("/clientes", []); } finally { fetch = real; } return n >= 1; })()',
          },
          {
            descripcion: 'Revisas la respuesta (ok o status)',
            condicion: '/\\.ok\\b|\\.status\\b/.test(codigo)',
          },
        ],
        pistas: [
          'Es casi igual a `nombreDeProducto` de la lección 19: cambia qué devuelves en cada caso.',
          'Primero `const respuesta = await fetch(API + ruta);` y luego, si `!respuesta.ok`, `return respaldo;` (así el error 500 no se escapa).',
          'Si está bien, `return await respuesta.json();`',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function pedirConRespaldo(ruta, respaldo) {',
          '  const respuesta = await fetch(API + ruta);',
          '  if (!respuesta.ok) {',
          '    return respaldo;',
          '  }',
          '  return await respuesta.json();',
          '}',
        ].join('\n'),
      },
    ],
  }
);

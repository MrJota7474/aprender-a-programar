// Lección 18 de JavaScript: promesas y async/await.
//
// Cómo escribir pruebas para código asíncrono (sirve de modelo para las
// lecciones de fetch y de repaso):
//
// - El evaluador espera a que el programa termine antes de revisar: espera
//   cada await del nivel superior y todos los setTimeout / setInterval
//   pendientes (hasta 2 s; después da un error "TiempoAgotado" claro).
// - Una condición puede devolver una promesa: se espera su valor y aprueba
//   solo si es exactamente true. La forma más clara es una función async que
//   se llama a sí misma:
//       '(async () => (await prepararTinto()) === "Tinto listo")()'
//   Dentro de la condición NO se puede usar await suelto: siempre dentro de
//   (async () => ...)().
// - Si la prueba lanza un error o su promesa se rechaza, no aprueba (igual
//   que una prueba normal). Para revisar que algo falle, atrápalo:
//       '(async () => { try { await f(); return false; } catch (e) { return true; } })()'
// - Para medir que de verdad esperó: Date.now() antes y después del await.
//   Deja margen (pide 40 ms si el código espera 50).
// - El código inicial de un ejercicio no debe dejar promesas que fallen sin
//   atrapar ni temporizadores eternos: la prueba "el código inicial se
//   ejecuta" exige que no haya error.
//
// fetch simulado (sin internet), en https://api.tienda-donpepe.co:
//   GET /productos, /productos?categoria=Bebidas, /productos/<id> (404 si no existe),
//   GET /clientes, GET /pedidos, POST /pedidos (cuerpo JSON con cliente_id,
//   producto_id y cantidad → 201; 400 si es inválido), GET /ventas (siempre 500).
//   Otro dominio: la promesa se rechaza con TypeError: Failed to fetch.
//   Detalle completo y datos en js/api-tienda.js (los mismos de la base de SQL).

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'async-await',
    titulo: 'Promesas y async/await',
    pasos: [
      {
        id: 'idea',
        titulo: 'Esperar sin quedarse quieto',
        texto: [
          'Cuando pides un domicilio, no te quedas parado en la puerta: sigues con lo tuyo y, cuando llega, lo recibes. Muchas cosas en programación funcionan así: pedir datos a un servidor, leer un archivo o esperar un tiempo.',
          'Una **promesa** es ese "ya te aviso": un valor que todavía no está. Se crea con `new Promise((resolver, rechazar) => { ... })`: cuando el trabajo termina llamas a `resolver(valor)`, y si algo sale mal, a `rechazar(error)`. `setTimeout(funcion, ms)` ejecuta una función después de unos milisegundos.',
          'Una función `async` puede usar `await`, que **espera** a que la promesa se cumpla y te entrega su valor. Si la promesa se rechaza, `await` lanza el error: atrápalo con `try` / `catch`, como en la lección de errores.',
          'Fíjate en el orden de lo que se muestra: "Pedido hecho" sale antes que el domicilio, porque el programa no se detiene a esperar hasta que llega al `await`.',
        ],
        codigo: [
          'function esperarDomicilio(producto) {',
          '  return new Promise((resolver, rechazar) => {',
          '    setTimeout(() => {',
          '      if (producto === "Pizza") {',
          '        rechazar(new Error("Don Pepe no vende pizza"));',
          '      } else {',
          '        resolver(producto + " entregado");',
          '      }',
          '    }, 100);',
          '  });',
          '}',
          '',
          'async function pedir(producto) {',
          '  try {',
          '    const mensaje = await esperarDomicilio(producto);',
          '    console.log(mensaje);',
          '  } catch (error) {',
          '    console.log("No se pudo:", error.message);',
          '  }',
          '}',
          '',
          'const pendiente = pedir("Arepa de queso");',
          'console.log("Pedido hecho, mientras tanto barro la tienda");',
          'await pendiente;',
          'await pedir("Pizza");',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un tinto que tarda',
        texto: [
          'Crea la función `async` llamada `prepararTinto()`. Debe **esperar 50 milisegundos** (lo que tarda la greca) y después devolver el texto `"Tinto listo"`.',
          'Para esperar, crea una promesa que se cumpla con `setTimeout` y espérala con `await`. Usa `await` (también existe `.then()`, otra forma de esperar promesas, pero en estas lecciones practicamos con `await`).',
        ],
        codigo: [
          '// Haz que esta función espere 50 ms antes de responder',
          'function prepararTinto() {',
          '  return "Tinto listo";',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'prepararTinto es una función', condicion: 'typeof prepararTinto === "function"' },
          {
            descripcion: 'Es una función async (devuelve una promesa)',
            condicion:
              'prepararTinto() instanceof Promise && /async\\s+function\\s+prepararTinto|prepararTinto\\s*=\\s*async/.test(codigo)',
          },
          {
            descripcion: 'Con await entrega "Tinto listo"',
            condicion: '(async () => (await prepararTinto()) === "Tinto listo")()',
          },
          {
            descripcion: 'De verdad espera unos 50 milisegundos',
            condicion:
              '(async () => { const inicio = Date.now(); await prepararTinto(); return Date.now() - inicio >= 40; })()',
          },
          { descripcion: 'Usas setTimeout y await', condicion: '/setTimeout/.test(codigo) && /await/.test(codigo)' },
        ],
        pistas: [
          'Escribe `async` antes de `function`: `async function prepararTinto() { ... }`',
          'La espera es una promesa: `await new Promise((resolver) => setTimeout(resolver, 50));`',
          'Después del `await`, `return "Tinto listo";`',
        ],
        solucion: [
          'async function prepararTinto() {',
          '  await new Promise((resolver) => setTimeout(resolver, 50));',
          '  return "Tinto listo";',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: lo que hay en la tienda',
        texto: [
          'La tienda tiene un servicio web (una **API**) en `https://api.tienda-donpepe.co`. Aquí no hay internet: es una API simulada, pero responde igual que una de verdad y se demora un poquito.',
          'Con `fetch(direccion)` le pides datos. Devuelve una promesa con la **respuesta**; a su vez, `respuesta.json()` devuelve otra promesa con los datos ya convertidos. Por eso se usa `await` dos veces.',
          'Crea la función `async` llamada `productosDisponibles()`. Debe pedir `https://api.tienda-donpepe.co/productos` y devolver un arreglo con los **nombres** de los productos que tienen `existencias` mayores que 0, en el mismo orden.',
          'Usa `await` para esperar las promesas (también existe `.then()`, otra forma de hacerlo, pero aquí practicamos con `await`).',
        ],
        codigo: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          '// Pide los productos con fetch y devuelve los nombres de los que hay',
          'async function productosDisponibles() {',
          '  return [];',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'productosDisponibles es una función',
            condicion: 'typeof productosDisponibles === "function"',
          },
          {
            descripcion: 'Devuelve 9 nombres (hay un producto agotado)',
            condicion: '(async () => { const n = await productosDisponibles(); return Array.isArray(n) && n.length === 9; })()',
          },
          {
            descripcion: 'Son nombres, en el orden de la tienda',
            condicion:
              '(async () => { const n = await productosDisponibles(); return n[0] === "Arepa de queso" && n[8] === "Oblea"; })()',
          },
          {
            descripcion: 'No incluye el Bocadillo veleño (sin existencias)',
            condicion: '(async () => !(await productosDisponibles()).includes("Bocadillo veleño"))()',
          },
          {
            descripcion: 'Usas fetch, await y json()',
            condicion: '/fetch\\s*\\(/.test(codigo) && /await/.test(codigo) && /\\.json\\s*\\(/.test(codigo)',
          },
        ],
        pistas: [
          'Primero la respuesta: `const respuesta = await fetch(API + "/productos");`',
          'Luego los datos: `const productos = await respuesta.json();`',
          'Para terminar, `filter` por `existencias > 0` y `map` al `nombre`, como en la lección de métodos de arreglos.',
        ],
        solucion: [
          'const API = "https://api.tienda-donpepe.co";',
          '',
          'async function productosDisponibles() {',
          '  const respuesta = await fetch(API + "/productos");',
          '  const productos = await respuesta.json();',
          '  return productos',
          '    .filter((producto) => producto.existencias > 0)',
          '    .map((producto) => producto.nombre);',
          '}',
        ].join('\n'),
      },
    ],
  }
);

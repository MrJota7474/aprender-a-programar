// Pruebas del evaluador de JavaScript y del formato de textos y errores.
// Se corren con:  node --test "pruebas/*.test.js"

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/api-tienda.js');
require('../js/evaluador.js');
require('../js/formato.js');

const { evaluarCodigo, formatearTexto, explicarError } = globalThis;

// ---------- evaluador ----------
// evaluarCodigo devuelve una promesa (espera el código asíncrono): por eso await.

test('captura lo que el código muestra con console.log', async () => {
  const resultado = await evaluarCodigo('console.log("hola"); console.log(1 + 1, true);', []);

  assert.deepEqual(resultado.salida, ['hola', '2 true']);
  assert.equal(resultado.error, null);
});

test('muestra arreglos y objetos como texto legible', async () => {
  const resultado = await evaluarCodigo('console.log([1, "a"]); console.log({ x: 1 });', []);

  assert.deepEqual(resultado.salida, ['[1,"a"]', '{"x":1}']);
});

test('las pruebas pueden ver variables let, const y funciones del estudiante', async () => {
  const codigo = 'let a = 2; const b = 3; function sumar(x, y) { return x + y; }';
  const pruebas = [
    { descripcion: 'a', condicion: 'a === 2' },
    { descripcion: 'b', condicion: 'b === 3' },
    { descripcion: 'sumar', condicion: 'sumar(a, b) === 5' },
  ];

  const resultado = await evaluarCodigo(codigo, pruebas);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true, true]);
});

test('las pruebas pueden revisar la salida y el texto del código', async () => {
  const pruebas = [
    { descripcion: 'salida', condicion: 'salida.includes("7")' },
    { descripcion: 'codigo', condicion: 'codigo.includes("3 + 4")' },
  ];

  const resultado = await evaluarCodigo('console.log(3 + 4);', pruebas);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true]);
});

test('el estudiante puede llamar a sus variables salida, codigo o console', async () => {
  const resultado = await evaluarCodigo('let salida = 5; const codigo = "abc";', [
    { descripcion: 'la salida sigue siendo la de la consola', condicion: 'salida.length === 0' },
  ]);

  assert.equal(resultado.error, null);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('las pruebas sobre el texto del código ignoran los comentarios', async () => {
  const resultado = await evaluarCodigo('// usa && aquí\n/* y || acá */\nconst a = 1;', [
    { descripcion: 'sin trampa', condicion: '!codigo.includes("&&") && !codigo.includes("||")' },
  ]);

  assert.equal(resultado.resultados[0].aprobada, true);
});

test('una prueba sobre una variable que no existe cuenta como no aprobada', async () => {
  const resultado = await evaluarCodigo('', [{ descripcion: 'x', condicion: 'x === 1' }]);

  assert.equal(resultado.error, null);
  assert.equal(resultado.resultados[0].aprobada, false);
});

test('solo aprueba cuando la condición da exactamente true', async () => {
  const resultado = await evaluarCodigo('', [{ descripcion: 'uno', condicion: '1' }]);

  assert.equal(resultado.resultados[0].aprobada, false);
});

test('informa los errores de escritura sin lanzar excepción', async () => {
  const resultado = await evaluarCodigo('console.log("hola"', []);

  assert.equal(resultado.error.nombre, 'SyntaxError');
  assert.deepEqual(resultado.resultados, []);
});

test('informa los errores al ejecutar y conserva la salida anterior al error', async () => {
  const resultado = await evaluarCodigo('console.log("antes"); noExiste;', []);

  assert.equal(resultado.error.nombre, 'ReferenceError');
  assert.deepEqual(resultado.salida, ['antes']);
});

test('evaluarCodigo es autosuficiente: funciona reconstruida desde su texto', async () => {
  // Es lo mismo que hace el ejecutor para llevarla al Web Worker.
  const copia = new Function('return ' + evaluarCodigo.toString())();

  const resultado = await copia('const n = 4;', [{ descripcion: 'n', condicion: 'n === 4' }]);

  assert.equal(resultado.resultados[0].aprobada, true);
});

test('las pruebas pueden ver las clases del estudiante', async () => {
  const resultado = await evaluarCodigo('class Caja { constructor() { this.n = 3; } }', [
    { descripcion: 'clase', condicion: 'new Caja().n === 3' },
  ]);

  assert.equal(resultado.resultados[0].aprobada, true);
});

// ---------- código asíncrono ----------

// Un límite corto para las pruebas que esperan algo que nunca termina: así
// no se demoran los 2 s de la página. El { timeout } de node:test es la
// segunda red: si el evaluador se colgara, la prueba falla en vez de quedarse quieta.
const LIMITE_CORTO = { limiteMs: 300 };
const SIN_COLGARSE = { timeout: 5000 };

// Corre el evaluador en un hilo de Node (worker_threads), armado con el mismo
// texto que el ejecutor le pasa al Web Worker de la página.
function evaluarEnHilo(codigo, pruebas) {
  const { Worker } = require('node:worker_threads');
  const fuente = [
    globalThis.crearFetchSimulado.toString(),
    evaluarCodigo.toString(),
    'const { parentPort, workerData } = require("node:worker_threads");',
    'evaluarCodigo(workerData.codigo, workerData.pruebas).then((r) => parentPort.postMessage(r));',
  ].join('\n');
  return new Promise((resolver, rechazar) => {
    const hilo = new Worker(fuente, { eval: true, workerData: { codigo, pruebas } });
    hilo.once('message', (resultado) => {
      hilo.terminate();
      resolver(resultado);
    });
    hilo.once('error', rechazar);
  });
}

test('acepta await en el nivel superior y las pruebas ven lo que creó después', SIN_COLGARSE, async () => {
  const codigo = [
    'const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));',
    'await esperar(30);',
    'const listo = "sí";',
    'console.log("después de esperar");',
  ].join('\n');

  const resultado = await evaluarCodigo(codigo, [{ descripcion: 'listo', condicion: 'listo === "sí"' }]);

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.salida, ['después de esperar']);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('espera los setTimeout pendientes aunque nadie use await', SIN_COLGARSE, async () => {
  const codigo = [
    'let pasos = [];',
    'setTimeout(() => { pasos.push("b"); console.log("tarde"); }, 40);',
    'setTimeout(() => pasos.push("a"), 10);',
    'const cancelado = setTimeout(() => pasos.push("x"), 20);',
    'clearTimeout(cancelado);',
    'console.log("primero");',
  ].join('\n');

  const resultado = await evaluarCodigo(codigo, [
    { descripcion: 'orden', condicion: 'pasos.join("") === "ab"' },
  ]);

  assert.deepEqual(resultado.salida, ['primero', 'tarde']);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('setInterval se espera hasta que el estudiante lo detiene', SIN_COLGARSE, async () => {
  const codigo = 'let n = 0; const id = setInterval(() => { n++; if (n === 3) clearInterval(id); }, 5);';

  const resultado = await evaluarCodigo(codigo, [{ descripcion: 'tres', condicion: 'n === 3' }]);

  assert.equal(resultado.resultados[0].aprobada, true);
});

test('una prueba puede ser asíncrona y aprueba solo con true', SIN_COLGARSE, async () => {
  const codigo = 'async function total() { await new Promise((r) => setTimeout(r, 10)); return 10500; }';

  const resultado = await evaluarCodigo(codigo, [
    { descripcion: 'espera el valor', condicion: '(async () => (await total()) === 10500)()' },
    { descripcion: 'una promesa de algo que no es true', condicion: 'total()' },
    { descripcion: 'una promesa rechazada', condicion: '(async () => { throw new Error("x"); })()' },
  ]);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, false, false]);
});

test('un error después de un await sale como error, con lo que alcanzó a mostrar', SIN_COLGARSE, async () => {
  const codigo = 'console.log("antes");\nawait null;\nnoExiste();';

  const resultado = await evaluarCodigo(codigo, []);

  assert.equal(resultado.error.nombre, 'ReferenceError');
  assert.deepEqual(resultado.salida, ['antes']);
});

test('una promesa rechazada que nadie atrapa se informa como error', SIN_COLGARSE, async () => {
  const codigo = [
    'async function cobrar() {',
    '  await new Promise((r) => setTimeout(r, 10));',
    '  throw new Error("Sin saldo");',
    '}',
    'cobrar(); // sin await ni .catch',
  ].join('\n');

  // node:test toma como fallo de la prueba cualquier rechazo sin atrapar del
  // proceso, aunque el evaluador también lo escuche. Por eso este caso corre
  // en un hilo aparte, igual que en la página (que usa un Web Worker).
  const resultado = await evaluarEnHilo(codigo, [{ descripcion: 'x', condicion: 'true' }]);

  assert.deepEqual(resultado.error, { nombre: 'Error', mensaje: 'Sin saldo', sinAtrapar: true });
  assert.match(explicarError(resultado.error), /nadie atrapó su error/);
});

test('un error dentro de un setTimeout se informa como error', SIN_COLGARSE, async () => {
  const resultado = await evaluarCodigo('setTimeout(() => { null.x; }, 5);', []);

  assert.equal(resultado.error.nombre, 'TypeError');
});

test('setTimeout sin función da un error claro', async () => {
  const resultado = await evaluarCodigo('function hola() {}\nsetTimeout(hola(), 10);', []);

  assert.equal(resultado.error.nombre, 'TypeError');
  assert.match(explicarError(resultado.error), /quita los paréntesis/);
});

test('una promesa que nunca termina se corta con un mensaje claro', SIN_COLGARSE, async () => {
  const codigo = 'console.log("esperando");\nawait new Promise(() => {});';

  const resultado = await evaluarCodigo(codigo, [], LIMITE_CORTO);

  assert.equal(resultado.error.nombre, 'TiempoAgotado');
  assert.match(resultado.error.mensaje, /promesa que nunca terminó/);
  assert.deepEqual(resultado.salida, ['esperando']);
});

test('un setTimeout demasiado largo se corta y no vuelve a correr', SIN_COLGARSE, async () => {
  const codigo = 'setTimeout(() => console.log("muy tarde"), 600);';

  const resultado = await evaluarCodigo(codigo, [], LIMITE_CORTO);
  await new Promise((r) => setTimeout(r, 400)); // más allá de los 600 ms del estudiante

  assert.match(resultado.error.mensaje, /setTimeout o setInterval/);
  assert.deepEqual(resultado.salida, []); // el reloj olvidado se canceló
});

test('una prueba asíncrona que nunca termina no aprueba (ni cuelga)', SIN_COLGARSE, async () => {
  const resultado = await evaluarCodigo('', [
    { descripcion: 'eterna', condicion: 'new Promise(() => {})' },
  ], LIMITE_CORTO);

  assert.equal(resultado.error.nombre, 'TiempoAgotado'); // además de no aprobar, avisa
  assert.equal(resultado.resultados[0].aprobada, false);
});

test('await dentro de una función que no es async se explica', async () => {
  const resultado = await evaluarCodigo('function f() { await 1; }', []);

  assert.equal(resultado.error.nombre, 'SyntaxError');
  assert.match(explicarError(resultado.error), /no es async/);
});

// ---------- fetch simulado ----------

const TIENDA = 'https://api.tienda-donpepe.co';

test('fetch: pide los productos y lee el JSON', SIN_COLGARSE, async () => {
  const codigo = [
    `const respuesta = await fetch("${TIENDA}/productos");`,
    'const productos = await respuesta.json();',
    'console.log(respuesta.status, productos.length);',
  ].join('\n');

  const resultado = await evaluarCodigo(codigo, [
    { descripcion: 'ok', condicion: 'respuesta.ok === true' },
    { descripcion: 'primero', condicion: 'productos[0].nombre === "Arepa de queso"' },
    { descripcion: 'leído', condicion: 'respuesta.bodyUsed === true' },
  ]);

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.salida, ['200 10']);
  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true, true]);
});

test('fetch: un producto, una categoría, clientes, pedidos y un pedido nuevo', SIN_COLGARSE, async () => {
  const codigo = [
    `const leer = async (ruta, opciones) => (await fetch("${TIENDA}" + ruta, opciones)).json();`,
    'const tinto = await leer("/productos/4");',
    'const bebidas = await leer("/productos?categoria=Bebidas");',
    'const clientes = await leer("/clientes");',
    'const pedidos = await leer("/pedidos");',
    'const nuevo = await fetch(TIENDA_PEDIDOS, {',
    '  method: "POST",',
    '  body: JSON.stringify({ cliente_id: 1, producto_id: 4, cantidad: 2 }),',
    '});',
    'const creado = await nuevo.json();',
  ].join('\n').replace('TIENDA_PEDIDOS', `"${TIENDA}/pedidos"`);

  const resultado = await evaluarCodigo(codigo, [
    { descripcion: 'tinto', condicion: 'tinto.precio === 2000' },
    { descripcion: 'bebidas', condicion: 'bebidas.length === 3' },
    { descripcion: 'clientes', condicion: 'clientes.length === 6' },
    { descripcion: 'pedidos', condicion: 'pedidos.length === 10' },
    { descripcion: 'creado', condicion: 'nuevo.status === 201 && creado.id === 11 && creado.cantidad === 2' },
  ]);

  assert.equal(resultado.error, null);
  assert.ok(resultado.resultados.every((r) => r.aprobada));
});

test('fetch: un producto que no existe responde 404, y /ventas responde 500', SIN_COLGARSE, async () => {
  const codigo = [
    `const r404 = await fetch("${TIENDA}/productos/99");`,
    'const datos404 = await r404.json();',
    `const r500 = await fetch("${TIENDA}/ventas");`,
  ].join('\n');

  const resultado = await evaluarCodigo(codigo, [
    { descripcion: '404', condicion: 'r404.ok === false && r404.status === 404' },
    { descripcion: 'mensaje', condicion: 'datos404.error.includes("99")' },
    { descripcion: '500', condicion: 'r500.ok === false && r500.status === 500' },
    { descripcion: 'texto', condicion: '(async () => (await r500.text()).includes("caído"))()' },
  ]);

  assert.equal(resultado.error, null);
  assert.ok(resultado.resultados.every((r) => r.aprobada));
});

test('fetch: el cuerpo solo se puede leer una vez', SIN_COLGARSE, async () => {
  const codigo = `const r = await fetch("${TIENDA}/clientes");\nawait r.json();\nawait r.json();`;

  const resultado = await evaluarCodigo(codigo, []);

  assert.equal(resultado.error.nombre, 'TypeError');
  assert.match(explicarError(resultado.error), /solo se pueden usar una vez/);
});

test('fetch: otro dominio falla como sin internet y se explica', SIN_COLGARSE, async () => {
  const codigo = [
    'try {',
    '  await fetch("https://www.google.com");',
    '} catch (error) {',
    '  console.log(error.name, error.message);',
    '}',
    'await fetch("https://api.otra-tienda.co/productos");',
  ].join('\n');

  const resultado = await evaluarCodigo(codigo, []);

  assert.deepEqual(resultado.salida, ['TypeError Failed to fetch']);
  assert.deepEqual(resultado.error, { nombre: 'TypeError', mensaje: 'Failed to fetch' });
  assert.match(explicarError(resultado.error), /solo existe la API simulada de la tienda/);
});

test('fetch: una dirección incompleta se explica', SIN_COLGARSE, async () => {
  const resultado = await evaluarCodigo('await fetch("/productos");', []);

  assert.match(explicarError(resultado.error), /empezando por https:\/\//);
});

test('fetch: el evaluador copiado con su texto también lo tiene (como en el Worker)', SIN_COLGARSE, async () => {
  // El ejecutor arma el Worker con el texto de crearFetchSimulado y de evaluarCodigo.
  const fuente = globalThis.crearFetchSimulado.toString() + '\nreturn ' + evaluarCodigo.toString();
  const copia = new Function(fuente)();

  const resultado = await copia(`const r = await fetch("${TIENDA}/productos/1");`, [
    { descripcion: 'ok', condicion: 'r.status === 200' },
  ]);

  assert.equal(resultado.resultados[0].aprobada, true);
});

test('fetch: los datos de la API son los mismos de la base de SQL', SIN_COLGARSE, async () => {
  // Así la tienda es la misma en las rutas de SQL y de JavaScript.
  require('../rutas/sql/00-base-tienda.js');
  const iniciarSqlJs = require('../vendor/sqljs/sql-wasm.js');
  const SQL = await iniciarSqlJs();
  const base = new SQL.Database();
  base.run(globalThis.BASES_SQL.tienda);
  const fetchSimulado = globalThis.crearFetchSimulado(setTimeout);

  for (const tabla of ['productos', 'clientes', 'pedidos']) {
    const [{ columns, values }] = base.exec(`SELECT * FROM ${tabla} ORDER BY id`);
    const filas = values.map((fila) => Object.fromEntries(columns.map((c, i) => [c, fila[i]])));
    const desdeLaApi = await (await fetchSimulado(`${TIENDA}/${tabla}`)).json();

    assert.deepEqual(desdeLaApi, filas, tabla);
  }
  base.close();
});

// ---------- formato ----------

test('formatearTexto convierte `código` y **negrita**', () => {
  assert.equal(
    formatearTexto('Usa `let` y **nunca** olvides'),
    'Usa <code>let</code> y <strong>nunca</strong> olvides'
  );
});

test('formatearTexto escapa el HTML para que no se ejecute', () => {
  assert.equal(
    formatearTexto('<img src=x onerror="alert(1)">'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
  );
});

test('explicarError traduce un nombre que no existe', () => {
  const texto = explicarError({ nombre: 'ReferenceError', mensaje: 'nombr is not defined' });

  assert.match(texto, /Usaste "nombr"/);
  assert.match(texto, /Mensaje original: ReferenceError: nombr is not defined/);
});

test('explicarError da ayuda general para errores de sintaxis', () => {
  const texto = explicarError({ nombre: 'SyntaxError', mensaje: 'Unexpected end of input' });

  assert.match(texto, /error de escritura/);
});

test('explicarError muestra tal cual el mensaje de tiempo agotado', () => {
  const texto = explicarError({ nombre: 'TiempoAgotado', mensaje: 'Tardó mucho.' });

  assert.equal(texto, 'Tardó mucho.');
});

// ---------- arreglos de la revisión ----------

test('una URL completa dentro de fetch se conserva en codigo', async () => {
  const codigo = 'fetch("https://api.tienda-donpepe.co/productos");';
  const pruebas = [{ descripcion: 'url', condicion: 'codigo.includes("https://api.tienda-donpepe.co/productos")' }];

  const resultado = await evaluarCodigo(codigo, pruebas);

  assert.equal(resultado.resultados[0].aprobada, true);
});

test('un comentario real se quita de codigo, y un // dentro de un texto se conserva', async () => {
  const codigo = 'const a = "x//y"; // palabraSecreta\n/* otraSecreta */ const b = 1;';
  const pruebas = [
    { descripcion: 'sin comentario de línea', condicion: '!codigo.includes("palabraSecreta")' },
    { descripcion: 'sin comentario de bloque', condicion: '!codigo.includes("otraSecreta")' },
    { descripcion: 'el texto conserva //', condicion: 'codigo.includes("x//y")' },
  ];

  const resultado = await evaluarCodigo(codigo, pruebas);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true, true]);
});

test('un error dentro de un setTimeout mientras se espera una promesa se informa de inmediato', async () => {
  const codigo = 'await new Promise(resolver => setTimeout(() => { consola.log("x"); resolver(); }, 50));';
  const inicio = Date.now();

  const resultado = await evaluarCodigo(codigo, []);

  assert.notEqual(resultado.error.nombre, 'TiempoAgotado');
  assert.match(resultado.error.mensaje, /consola/);
  assert.ok(Date.now() - inicio < 1000);
});

test('una prueba que no alcanza a terminar devuelve un error de tiempo agotado', async () => {
  const pruebas = [{ descripcion: 'eterna', condicion: 'new Promise(() => {})' }];

  const resultado = await evaluarCodigo('const a = 1;', pruebas, LIMITE_CORTO);

  assert.equal(resultado.resultados[0].aprobada, false);
  assert.equal(resultado.error.nombre, 'TiempoAgotado');
  assert.match(resultado.error.mensaje, /prueba no alcanz/);
});

test('fetch con body en un GET falla como el real y se explica', async () => {
  const codigo = 'try { await fetch("https://api.tienda-donpepe.co/productos", { body: "{}" }); }\n' +
    'catch (e) { console.log(e.name + ": " + e.message); }';

  const resultado = await evaluarCodigo(codigo, []);

  assert.deepEqual(resultado.salida, ['TypeError: Request with GET/HEAD method cannot have body.']);
  assert.match(
    explicarError({ nombre: 'TypeError', mensaje: 'Request with GET/HEAD method cannot have body.' }),
    /method: "POST"/
  );
});

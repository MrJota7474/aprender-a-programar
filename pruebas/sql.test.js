// Pruebas del evaluador de SQL, de la explicación de sus errores y del
// manejo compartido de Workers.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

require('../js/formato.js');
require('../js/resaltado.js');
require('../js/motores.js');
require('../js/trabajadores.js');
require('../js/motor-sql.js');
require('../js/sql-evaluador.js');

const { crearEvaluadorSql, explicarErrorSql, Motores, resaltar } = globalThis;

const PREPARACION = `
  CREATE TABLE frutas (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, precio INTEGER);
  INSERT INTO frutas (nombre, precio) VALUES ('Mango', 3000), ('Lulo', 2000), ('Mora', 2500);
`;

const iniciarSqlJs = require(path.join(__dirname, '..', 'vendor', 'sqljs', 'sql-wasm.js'));
const evaluadorListo = iniciarSqlJs().then(crearEvaluadorSql);
const evaluar = async (codigo, pruebas = []) => (await evaluadorListo).evaluar(codigo, pruebas, PREPARACION);
const aprobadas = (resultado) => resultado.resultados.map((r) => r.aprobada);

// ---------- evaluador ----------

test('devuelve una tabla por cada consulta, con columnas en minúscula', async () => {
  const resultado = await evaluar('SELECT Nombre FROM frutas WHERE precio > 2200; SELECT COUNT(*) AS N FROM frutas;');

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.tablas, [
    { columnas: ['nombre'], filas: [['Mango'], ['Mora']], total: 2 },
    { columnas: ['n'], filas: [[3]], total: 1 },
  ]);
});

test('las pruebas ven filas, columnas, tabla y el código en mayúsculas sin comentarios', async () => {
  const resultado = await evaluar('-- where falso\nselect nombre, precio from frutas order by precio;', [
    { descripcion: 'filas', condicion: 'filas[0][0] === "Lulo"' },
    { descripcion: 'columnas', condicion: 'columnas.join() === "nombre,precio"' },
    { descripcion: 'tabla', condicion: 'tabla[2].precio === 3000' },
    { descripcion: 'codigo', condicion: '/\\bORDER\\s+BY\\b/.test(codigo) && !/WHERE/.test(codigo)' },
  ]);

  assert.deepEqual(aprobadas(resultado), [true, true, true, true]);
});

test('igualA exige el mismo orden y mismasFilas no', async () => {
  const resultado = await evaluar('SELECT nombre FROM frutas ORDER BY nombre DESC;', [
    { descripcion: 'igualA con otro orden', condicion: 'igualA("SELECT nombre FROM frutas ORDER BY nombre")' },
    { descripcion: 'mismasFilas con otro orden', condicion: 'mismasFilas("SELECT nombre FROM frutas ORDER BY nombre")' },
    { descripcion: 'igualA con el mismo orden', condicion: 'igualA("SELECT nombre FROM frutas ORDER BY nombre DESC")' },
    { descripcion: 'mismasFilas con otras filas', condicion: 'mismasFilas("SELECT nombre FROM frutas WHERE precio > 2200")' },
  ]);

  assert.deepEqual(aprobadas(resultado), [false, true, true, false]);
});

test('consulta ve los cambios que hizo el estudiante', async () => {
  const resultado = await evaluar("INSERT INTO frutas (nombre, precio) VALUES ('Uchuva', 4000);", [
    { descripcion: 'hay 4', condicion: 'consulta("SELECT COUNT(*) AS n FROM frutas")[0].n === 4' },
  ]);

  assert.deepEqual(aprobadas(resultado), [true]);
  assert.deepEqual(resultado.tablas, []);
});

test('cada ejecución empieza con la base original', async () => {
  await evaluar('DELETE FROM frutas;');

  const resultado = await evaluar('SELECT COUNT(*) FROM frutas;');

  assert.deepEqual(resultado.tablas[0].filas, [[3]]);
});

test('un error de SQL se informa sin lanzar excepción', async () => {
  const resultado = await evaluar('SELECT * FROM verduras;', [{ descripcion: 'x', condicion: 'true' }]);

  assert.equal(resultado.error.nombre, 'ErrorSQL');
  assert.match(resultado.error.mensaje, /no such table: verduras/);
  assert.deepEqual(resultado.resultados, []);
});

test('una prueba que falla por dentro cuenta como no aprobada', async () => {
  const resultado = await evaluar('SELECT 1;', [
    { descripcion: 'tabla inexistente', condicion: 'consulta("SELECT * FROM nada").length === 0' },
    { descripcion: 'no es exactamente true', condicion: '1' },
  ]);

  assert.deepEqual(aprobadas(resultado), [false, false]);
});

test('describir lista las tablas con sus columnas, el total y una muestra', async () => {
  const evaluador = await evaluadorListo;

  const { tablas } = evaluador.describir(PREPARACION, 2);

  assert.deepEqual(tablas, [
    {
      nombre: 'frutas',
      total: 3,
      columnas: ['id', 'nombre', 'precio'],
      filas: [
        [1, 'Mango', 3000],
        [2, 'Lulo', 2000],
      ],
    },
  ]);
});

// ---------- motor y errores ----------

test('el motor de SQL queda registrado con su contrato completo', () => {
  const motor = Motores.obtener('sql');

  assert.equal(typeof motor.ejecutar, 'function');
  assert.equal(typeof motor.describir, 'function');
  assert.equal(motor.lenguaje, 'sql');
});

test('explicarErrorSql traduce los errores más comunes', () => {
  const explicar = (mensaje) => explicarErrorSql({ nombre: 'ErrorSQL', mensaje });

  assert.match(explicar('no such table: produtos'), /No existe una tabla llamada "produtos"/);
  assert.match(explicar('no such column: Bebidas'), /comillas simples/);
  assert.match(explicar('near "FORM": syntax error'), /cerca de "FORM"/);
  assert.match(explicar('ambiguous column name: id'), /tabla\.id/);
  assert.match(explicar('algo rarísimo'), /Algo falló.*Mensaje original: algo rarísimo/);
});

test('explicarErrorSql muestra tal cual los mensajes propios de la app', () => {
  assert.equal(explicarErrorSql({ nombre: 'TiempoAgotado', mensaje: 'Tardó mucho.' }), 'Tardó mucho.');
});

// ---------- resaltado de SQL ----------

test('resalta SQL sin importar mayúsculas o minúsculas', () => {
  const html = resaltar("select nombre FROM frutas where nombre = 'Lulo' -- nota", 'sql');

  assert.match(html, /<span class="r-palabra">select<\/span>/);
  assert.match(html, /<span class="r-palabra">FROM<\/span>/);
  assert.match(html, /<span class="r-palabra">where<\/span>/);
  assert.match(html, /<span class="r-cadena">&#39;Lulo&#39;<\/span>/);
  assert.match(html, /<span class="r-comentario">-- nota<\/span>/);
  assert.doesNotMatch(html, /r-palabra">nombre/);
});

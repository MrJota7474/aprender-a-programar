// Revisa TODAS las lecciones de TODAS las rutas de forma automática:
// - que tengan la forma correcta,
// - que el código inicial de cada ejercicio NO pase (si no, no habría reto),
// - que la solución oficial SÍ pase todas las pruebas.
// Así, al agregar o editar una lección, un error se nota de inmediato.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

require('../js/api-tienda.js');
require('../js/evaluador.js');
require('../js/python-evaluador.js');
require('../js/sql-evaluador.js');
require('../js/web-analizador.js');
require('../js/web-estilos.js');
require('../js/web-evaluador.js');
require('../js/terminal-evaluador.js');
require('../js/rutas.js');
require('../rutas/catalogo.js');

const raiz = path.join(__dirname, '..');
const carpetaRutas = path.join(raiz, 'rutas');

// Cada ruta tiene su carpeta rutas/<id>/ con un archivo por lección.
function archivosDeLecciones(rutaId) {
  const carpeta = path.join(carpetaRutas, rutaId);
  if (!fs.existsSync(carpeta)) return [];
  return fs
    .readdirSync(carpeta)
    .filter((nombre) => nombre.endsWith('.js'))
    .sort()
    .map((nombre) => rutaId + '/' + nombre);
}

const { Rutas, evaluarCodigo, crearEvaluadorPython } = globalThis;
const archivos = Rutas.todas().flatMap((ruta) => archivosDeLecciones(ruta.id));
archivos.forEach((archivo) => require(path.join(carpetaRutas, archivo)));

// Python se evalúa con el mismo Pyodide y el mismo evaluador que usa la
// página. Cargarlo tarda unos segundos, así que se hace una sola vez y solo
// cuando alguna prueba lo necesita.
let pythonListo = null;
// "modulos" son los modulos propios de la app que el motor instala (como "ia").
function evaluarPython(codigo, pruebas, paso, modulos = {}) {
  if (pythonListo === null) {
    const direccion = pathToFileURL(path.join(raiz, 'vendor', 'pyodide', 'pyodide.mjs')).href;
    pythonListo = import(direccion)
      .then(({ loadPyodide }) => loadPyodide())
      .then(crearEvaluadorPython);
  }
  return pythonListo.then((evaluar) => evaluar(codigo, pruebas, modulos));
}

// SQL se evalúa con el mismo SQLite (sql.js) que usa la página. La base de
// datos sale del paso (paso.base) o es la base por defecto de la ruta.
let sqlListo = null;
function evaluarSql(codigo, pruebas, paso) {
  if (sqlListo === null) {
    const iniciarSqlJs = require(path.join(raiz, 'vendor', 'sqljs', 'sql-wasm.js'));
    sqlListo = iniciarSqlJs().then(globalThis.crearEvaluadorSql);
  }
  const base = (paso && paso.base) || globalThis.BASE_SQL_POR_DEFECTO;
  return sqlListo.then((evaluador) => evaluador.evaluar(codigo, pruebas, globalThis.BASES_SQL[base]));
}

// Un evaluador por motor. Reciben (codigo, pruebas, paso) y pueden responder
// de inmediato (web, terminal) o con una promesa (JavaScript, Python, SQL): por eso las
// pruebas de abajo usan await.
// Las rutas de inteligencia artificial son Python con los modulos "ia" y
// "agente" instalados, igual que en js/motor-python.js.
const evaluarPythonConIa = (codigo, pruebas, paso) =>
  evaluarPython(codigo, pruebas, paso, {
    ia: globalThis.MODULOS_PYTHON.ia,
    agente: globalThis.MODULOS_PYTHON.agente,
  });

const EVALUADORES = {
  javascript: evaluarCodigo,
  // El motor de Python trae el módulo "proyecto" (ruta "Entender proyectos hechos con IA").
  python: (codigo, pruebas, paso) =>
    evaluarPython(codigo, pruebas, paso, { proyecto: globalThis.MODULOS_PYTHON.proyecto }),
  // Datos y ML corren en el Worker con pandas, pero se revisan igual que Python.
  'python-datos': evaluarPython,
  'python-ia': evaluarPythonConIa,
  sql: evaluarSql,
  // HTML y CSS se revisan con nuestro propio analizador: no necesita navegador.
  web: globalThis.evaluarWeb,
  // Git simulado: tampoco necesita navegador; los archivos salen de paso.archivos.
  terminal: globalThis.evaluarTerminal,
};

// Los archivos de una ruta que no son lecciones (como la base de datos de
// SQL) empiezan por "00-": se cargan primero y no cuentan como lección.
const esLeccion = (archivo) => !path.basename(archivo).startsWith('00-');

// Motores que todavía no se pueden evaluar desde Node. Es una lista explícita
// para que una ruta con motor desconocido (o mal escrito) no pase en silencio.
const MOTORES_SIN_EVALUADOR = [];
const ID_VALIDO = /^[a-z0-9-]+$/;

// Se revisan el motor de la ruta y los que declaren sus pasos (paso.motor,
// que usan los proyectos para mezclar lenguajes).
test('cada ruta usa un motor conocido', () => {
  for (const ruta of Rutas.todas()) {
    for (const motor of Rutas.motoresDeLaRuta(ruta)) {
      const conocido = motor in EVALUADORES || MOTORES_SIN_EVALUADOR.includes(motor);
      assert.ok(conocido, `La ruta "${ruta.id}" usa el motor desconocido "${motor}"`);
    }
  }
});

test('las rutas sin evaluador en Node todavía no tienen lecciones sin revisar', () => {
  // Cuando una de estas rutas reciba lecciones, hay que agregar su evaluador
  // arriba: de lo contrario sus soluciones no se estarían comprobando.
  // Se mira paso por paso: un paso con un motor sin evaluador tampoco se revisaría.
  const sinRevisar = Rutas.todas().flatMap((ruta) =>
    ruta.lecciones.flatMap((leccion) =>
      leccion.pasos
        .filter((paso) => !(Rutas.motorDelPaso(ruta, paso) in EVALUADORES))
        .map((paso) => `${ruta.id}/${leccion.id}/${paso.id}`)
    )
  );

  assert.deepEqual(sinRevisar, []);
});

test('los ids de lecciones y pasos solo usan minúsculas, números y guiones', () => {
  // El progreso se guarda con la clave ruta/leccion/paso: un "/" en un id la dañaría.
  for (const ruta of Rutas.todas()) {
    for (const leccion of ruta.lecciones) {
      assert.match(leccion.id, ID_VALIDO);
      leccion.pasos.forEach((paso) => assert.match(paso.id, ID_VALIDO));
    }
  }
});

test('las rutas disponibles tienen todas sus lecciones', () => {
  assert.ok(Rutas.buscar('javascript').lecciones.length >= 10);
  assert.ok(Rutas.buscar('python').lecciones.length >= 12);
  assert.ok(Rutas.buscar('sql').lecciones.length >= 12);
  assert.ok(Rutas.buscar('ia').lecciones.length >= 10);
  assert.ok(Rutas.buscar('con-ia').lecciones.length >= 3);
  assert.ok(Rutas.buscar('fundamentos').lecciones.length >= 10);
  assert.ok(Rutas.buscar('primer-trabajo').lecciones.length >= 10);
  assert.ok(Rutas.buscar('oficio').lecciones.length >= 10);
  assert.ok(Rutas.buscar('proyectos-ia').lecciones.length >= 10);
  assert.ok(Rutas.buscar('datos').lecciones.length >= 10);
  assert.ok(Rutas.buscar('ml').lecciones.length >= 8);
  assert.ok(Rutas.buscar('react').lecciones.length >= 6);
  assert.ok(Rutas.buscar('ciberseguridad').lecciones.length >= 7);
  assert.ok(Rutas.buscar('tu-computador').lecciones.length >= 8);
});

test('cada archivo de lección registra exactamente una lección', () => {
  for (const ruta of Rutas.todas()) {
    const cantidad = archivosDeLecciones(ruta.id).filter(esLeccion).length;
    assert.equal(ruta.lecciones.length, cantidad, ruta.id);
  }
});

test('index.html carga el catálogo y todos los archivos de lecciones', () => {
  const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const cargados = [...html.matchAll(/src="rutas\/([^"]+)"/g)].map((m) => m[1]);

  assert.equal(cargados[0], 'catalogo.js');
  // puentes.js no es una lección: va al final, después de todas ellas
  // (lo revisa pruebas/puentes.test.js).
  assert.equal(cargados[cargados.length - 1], 'puentes.js');
  assert.deepEqual(cargados.slice(1, -1).sort(), [...archivos].sort());
});

test('dentro de cada ruta, index.html carga las lecciones en orden', () => {
  const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const cargados = [...html.matchAll(/src="rutas\/([^"]+)"/g)].map((m) => m[1]);

  for (const ruta of Rutas.todas()) {
    const deLaRuta = cargados.filter((archivo) => archivo.startsWith(ruta.id + '/'));
    assert.deepEqual(deLaRuta, archivosDeLecciones(ruta.id));
  }
});

test('todas las rutas tienen sigla, título, descripción y motor', () => {
  for (const ruta of Rutas.todas()) {
    assert.ok(ruta.sigla.length > 0, ruta.id);
    assert.ok(ruta.titulo.length > 0, ruta.id);
    assert.ok(ruta.descripcion.length > 0, ruta.id);
    assert.ok(ruta.motor.length > 0, ruta.id);
  }
});

test('la etiqueta propia de un paso, si existe, es texto no vacío', () => {
  // Una etiqueta vacía o que no es texto dejaría la pestaña sin nombre.
  for (const ruta of Rutas.todas()) {
    for (const leccion of ruta.lecciones) {
      for (const paso of leccion.pasos.filter((p) => 'etiqueta' in p)) {
        assert.equal(typeof paso.etiqueta, 'string', `${ruta.id}/${leccion.id}/${paso.id}`);
        assert.ok(paso.etiqueta.trim().length > 0, `${ruta.id}/${leccion.id}/${paso.id}`);
      }
    }
  }
});

for (const ruta of Rutas.todas()) {

  test(`ruta "${ruta.id}": sus lecciones tienen identificadores únicos`, () => {
    const ids = ruta.lecciones.map((leccion) => leccion.id);

    assert.equal(new Set(ids).size, ids.length);
  });

  for (const leccion of ruta.lecciones) {
    test(`${ruta.id}/${leccion.id}: tiene título y pasos con identificadores únicos`, () => {
      const ids = leccion.pasos.map((paso) => paso.id);

      assert.ok(leccion.titulo.length > 0);
      assert.ok(leccion.pasos.length > 0);
      assert.equal(new Set(ids).size, ids.length);
    });

    for (const paso of leccion.pasos) {
      const nombre = `${ruta.id}/${leccion.id}/${paso.id}`;
      // Cada paso se evalúa con su propio motor (en un proyecto, el paso 2
      // puede ser SQL y el 3 HTML); si no declara uno, con el de la ruta.
      const evaluar = EVALUADORES[Rutas.motorDelPaso(ruta, paso)];

      test(`${nombre}: tiene título, explicación y código inicial`, () => {
        assert.ok(paso.titulo.length > 0);
        assert.ok(Array.isArray(paso.texto) && paso.texto.length > 0);
        assert.equal(typeof paso.codigo, 'string');
      });

      if (paso.pruebas) {
        test(`${nombre}: tiene pistas y solución`, () => {
          assert.ok(paso.pruebas.length > 0);
          assert.ok(Array.isArray(paso.pistas) && paso.pistas.length > 0);
          assert.equal(typeof paso.solucion, 'string');
        });
      }

      if (!evaluar) continue;

      if (!paso.pruebas) {
        test(`${nombre}: el ejemplo se ejecuta sin errores y muestra algo`, async () => {
          const resultado = await evaluar(paso.codigo, [], paso);

          assert.equal(resultado.error, null);
          // "Algo" son líneas de texto, en SQL al menos una tabla, y en la
          // ruta web una página para la vista previa.
          const hayPagina = Boolean(resultado.vista) && resultado.vista.html.trim() !== '';
          assert.ok(resultado.salida.length > 0 || (resultado.tablas || []).length > 0 || hayPagina);
        });
        continue;
      }

      test(`${nombre}: el código inicial se ejecuta pero no aprueba`, async () => {
        const resultado = await evaluar(paso.codigo, paso.pruebas, paso);

        assert.equal(resultado.error, null);
        assert.ok(resultado.resultados.some((r) => !r.aprobada));
      });

      test(`${nombre}: la solución aprueba todas las pruebas`, async () => {
        const resultado = await evaluar(paso.solucion, paso.pruebas, paso);
        const fallidas = resultado.resultados.filter((r) => !r.aprobada).map((r) => r.descripcion);

        assert.equal(resultado.error, null);
        assert.deepEqual(fallidas, []);
      });
    }
  }
}

// ---------- el evaluador de Python ----------

test('python: una ejecución no ve las variables de la anterior', async () => {
  await evaluarPython('secreto = 1', []);

  const resultado = await evaluarPython('print(secreto)', []);

  assert.equal(resultado.error.nombre, 'NameError');
});

test('python: informa la línea del error y conserva la salida anterior', async () => {
  const resultado = await evaluarPython('print("antes")\nprint(no_existe)', []);

  assert.deepEqual(resultado.salida, ['antes']);
  assert.equal(resultado.error.linea, 2);
});

test('python: las pruebas sobre el texto del código ignoran los comentarios', async () => {
  const resultado = await evaluarPython('# for\nx = "# no es comentario"', [
    { descripcion: 'sin for', condicion: '"for" not in codigo' },
    { descripcion: 'el texto con # se conserva', condicion: '"no es comentario" in codigo' },
  ]);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true]);
});

test('python: lo que imprime una función llamada por una prueba no llega a la consola', async () => {
  const codigo = 'def f():\n    print("ruido")\n    return 1';

  const resultado = await evaluarPython(codigo, [{ descripcion: 'f', condicion: 'f() == 1' }]);

  assert.deepEqual(resultado.salida, []);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('python: mostrado() acepta el valor aunque venga con más texto', async () => {
  const resultado = await evaluarPython('print("Total:", 10500)', [
    { descripcion: 'con texto alrededor', condicion: 'mostrado(10500)' },
    { descripcion: 'otro valor no', condicion: 'mostrado(999) is False' },
  ]);

  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true]);
});

test('python: input() da un error claro en vez de bloquear', async () => {
  const resultado = await evaluarPython('nombre = input("¿Nombre? ")', []);

  assert.match(resultado.error.mensaje, /input\(\) no funciona/);
});

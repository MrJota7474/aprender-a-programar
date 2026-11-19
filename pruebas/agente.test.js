// Pruebas del módulo "agente" (el agente de código simulado de la ruta
// "Programar con IA").
//
// Igual que en ia.test.js, cada prueba corre un programita de Python como lo
// haría un estudiante y revisa lo que imprimió.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

require('../js/python-evaluador.js');
require('../rutas/con-ia/00-modulo-agente.js');

const raiz = path.join(__dirname, '..');
const evaluadorListo = import(pathToFileURL(path.join(raiz, 'vendor', 'pyodide', 'pyodide.mjs')).href)
  .then(({ loadPyodide }) => loadPyodide())
  .then(globalThis.crearEvaluadorPython);

async function correr(codigo) {
  const evaluar = await evaluadorListo;
  return evaluar('import agente\n' + codigo, [], { agente: globalThis.MODULOS_PYTHON.agente });
}

async function salidaDe(codigo) {
  const resultado = await correr(codigo);
  assert.equal(resultado.error, null, JSON.stringify(resultado.error));
  return resultado.salida;
}

// Corre el código y devuelve el error de Python (debe haberlo).
async function errorDe(codigo) {
  const resultado = await correr(codigo);
  assert.ok(resultado.error, 'Se esperaba un error');
  return resultado.error;
}

const TAREA = '"Arregla el error"';

// ---------- el proyecto y las herramientas ----------

test('el proyecto de la tienda trae un error que hace fallar una prueba', async () => {
  const salida = await salidaDe('print(agente.correr_pruebas(agente.proyecto("tienda")))');

  assert.equal(salida[0], 'Pasaron 1 de 2 pruebas.');
  assert.match(salida[1], /^FALLÓ prueba_varios_productos \(línea 9 de prueba_tienda.py\): assert total/);
});

test('cada llamada a proyecto() da una copia: cambiarla no daña la siguiente', async () => {
  const salida = await salidaDe(`
p = agente.proyecto("tienda")
p["tienda.py"] = "roto"
print(agente.proyecto("tienda")["tienda.py"] != "roto")`);

  assert.deepEqual(salida, ['True']);
});

test('escribir_archivo devuelve un proyecto nuevo y no toca el original', async () => {
  const salida = await salidaDe(`
p = agente.proyecto("tienda")
nuevo = agente.escribir_archivo(p, "notas.txt", "hola")
print("notas.txt" in nuevo, "notas.txt" in p)`);

  assert.deepEqual(salida, ['True False']);
});

test('leer y buscar devuelven sus errores como texto, para que el modelo los vea', async () => {
  const salida = await salidaDe(`
p = agente.proyecto("tienda")
print(agente.leer_archivo(p, "caja.py").startswith("Error: no existe el archivo caja.py"))
print(agente.buscar(p, "def total"))
print(agente.buscar(p, "pandebono"))`);

  assert.deepEqual(salida, ['True', 'tienda.py:5: def total(pedido):', "No encontré 'pandebono' en ningún archivo."]);
});

test('correr_pruebas avisa si el código no carga y no deja módulos sueltos', async () => {
  const salida = await salidaDe(`
import sys
p = agente.escribir_archivo(agente.proyecto("tienda"), "tienda.py", "def total(:")
print(agente.correr_pruebas(p).startswith("Error: el código no carga. SyntaxError"))
agente.correr_pruebas(agente.proyecto("tienda"))
print("tienda" in sys.modules)`);

  assert.deepEqual(salida, ['True', 'False']);
});

// ---------- el ciclo completo ----------

test('el agente arregla la tienda con el ciclo pensar, herramienta, observar', async () => {
  const salida = await salidaDe(`
original = agente.proyecto("tienda")
r = agente.ejecutar(${TAREA}, original)
print([paso["herramienta"] for paso in r["registro"]])
print(r["terminado"], r["respuesta"])
print(agente.correr_pruebas(r["proyecto"]))
print("suma = PRECIOS" in original["tienda.py"], "suma += PRECIOS" in r["proyecto"]["tienda.py"])`);

  assert.deepEqual(salida, [
    "['correr_pruebas', 'buscar', 'leer_archivo', 'escribir_archivo', 'correr_pruebas', None]",
    'True Listo: corregí tienda.py y ahora pasan todas las pruebas.',
    'Pasaron 2 de 2 pruebas.',
    'True True',
  ]);
});

test('el agente también arregla el proyecto de domicilios', async () => {
  const salida = await salidaDe(`
r = agente.ejecutar(${TAREA}, agente.proyecto("domicilios"))
print(agente.correr_pruebas(r["proyecto"]))`);

  assert.deepEqual(salida, ['Pasaron 2 de 2 pruebas.']);
});

test('si las pruebas ya pasan, no cambia nada', async () => {
  const salida = await salidaDe(`
arreglado = agente.ejecutar(${TAREA}, agente.proyecto("tienda"))["proyecto"]
r = agente.ejecutar(${TAREA}, arreglado)
print([paso["herramienta"] for paso in r["registro"]], r["proyecto"] == arreglado)
print(r["respuesta"])`);

  assert.deepEqual(salida, ["['correr_pruebas', None] True", 'Las pruebas ya pasan: no hay nada que arreglar.']);
});

test('es determinista: dos ejecuciones dan el mismo registro', async () => {
  const salida = await salidaDe(`
a = agente.ejecutar(${TAREA}, agente.proyecto("tienda"))["registro"]
b = agente.ejecutar(${TAREA}, agente.proyecto("tienda"))["registro"]
print(a == b)`);

  assert.deepEqual(salida, ['True']);
});

test('con pocos pasos se detiene sin terminar', async () => {
  const salida = await salidaDe(`
r = agente.ejecutar(${TAREA}, agente.proyecto("tienda"), max_pasos=2)
print(r["terminado"], len(r["registro"]))`);

  assert.deepEqual(salida, ['False 2']);
});

test('si cambia algo y las pruebas siguen fallando, se detiene y pide ayuda', async () => {
  // Un escribir_archivo que "guarda" pero no cambia nada: el arreglo no llega.
  const salida = await salidaDe(`
def no_guarda(proyecto, ruta, contenido):
    return dict(proyecto)
r = agente.ejecutar(${TAREA}, agente.proyecto("tienda"), funciones={"escribir_archivo": no_guarda})
print(r["terminado"], "siguen fallando" in r["respuesta"])`);

  assert.deepEqual(salida, ['True True']);
});

test('si le falta una herramienta, el modelo lo dice en vez de inventar', async () => {
  const salida = await salidaDe(`
sin_buscar = [h for h in agente.HERRAMIENTAS if h["nombre"] != "buscar"]
m = [{"rol": "usuario", "contenido": "Arregla"}]
r = agente.preguntar(m, sin_buscar)
_, resultado = agente.usar_herramienta(agente.proyecto("tienda"), r["herramienta"])
m = m + [{"rol": "asistente", "contenido": "", "herramienta": r["herramienta"]},
         {"rol": "herramienta", "nombre": "correr_pruebas", "contenido": resultado}]
r = agente.preguntar(m, sin_buscar)
print(r["motivo_fin"], "buscar" in r["contenido"])`);

  assert.deepEqual(salida, ['fin True']);
});

test('el agente usa las funciones que le pasa el estudiante', async () => {
  const salida = await salidaDe(`
usadas = []
def mi_leer(proyecto, ruta):
    usadas.append(ruta)
    return proyecto[ruta]
r = agente.ejecutar(${TAREA}, agente.proyecto("tienda"), funciones={"leer_archivo": mi_leer})
print(usadas, r["terminado"])`);

  assert.deepEqual(salida, ["['tienda.py'] True"]);
});

test('una herramienta desconocida vuelve como texto de error', async () => {
  const salida = await salidaDe(`
p = agente.proyecto("tienda")
nuevo, resultado = agente.usar_herramienta(p, {"nombre": "borrar_todo", "argumentos": {}})
print(nuevo is p, resultado)`);

  assert.deepEqual(salida, ['True Error: la herramienta borrar_todo no existe.']);
});

test('mostrar imprime el registro como pensé, usé, vi', async () => {
  const salida = await salidaDe(`agente.mostrar(agente.ejecutar(${TAREA}, agente.proyecto("tienda"))["registro"])`);

  assert.equal(salida[0], 'Paso 1');
  assert.match(salida[1], /^ {2}Pensé: {3}Antes de cambiar nada/);
  assert.equal(salida[2], '  Usé:     correr_pruebas()');
  assert.equal(salida[3], '  Vi:      Pasaron 1 de 2 pruebas.');
  assert.ok(salida.includes("  Usé:     escribir_archivo(ruta='tienda.py', contenido=<9 líneas>)"));
  assert.equal(salida.at(-1), '  Terminé: Listo: corregí tienda.py y ahora pasan todas las pruebas.');
});

// ---------- errores claros cuando se usa mal ----------

test('rechaza usos equivocados con mensajes en español', async () => {
  const casos = [
    ['agente.proyecto("caja")', 'ValueError', /No hay un proyecto llamado "caja". Hay: tienda, domicilios/],
    ['agente.leer_archivo("tienda.py", "x")', 'TypeError', /El proyecto debe ser un diccionario/],
    ['agente.preguntar("Arregla", agente.HERRAMIENTAS)', 'TypeError', /lista con al menos un mensaje/],
    ['agente.preguntar([{"rol": "usuario", "contenido": "x"}], "todas")', 'TypeError', /herramientas debe ser una lista/],
    [
      'agente.preguntar([{"rol": "usuario", "contenido": "x"}, {"rol": "herramienta", "contenido": "1"}], agente.HERRAMIENTAS)',
      'ValueError',
      /Antes del resultado de una herramienta/,
    ],
    [
      'agente.preguntar([{"rol": "usuario", "contenido": "x"}, {"rol": "asistente", "contenido": "", "herramienta": {"nombre": "buscar"}}, {"rol": "herramienta", "contenido": 3}], agente.HERRAMIENTAS)',
      'ValueError',
      /debe ser texto.*str\(\)/,
    ],
    ['agente.ejecutar("x", agente.proyecto(), funciones={"borrar": print})', 'ValueError', /No hay una herramienta llamada "borrar"/],
    [
      'agente.ejecutar("x", agente.proyecto(), funciones={"leer_archivo": lambda p: ""})',
      'TypeError',
      /Tu función leer_archivo debe recibir estos parámetros, con estos nombres: proyecto, ruta/,
    ],
    [
      'agente.ejecutar("x", agente.proyecto(), funciones={"escribir_archivo": lambda proyecto, ruta, contenido: None})',
      'TypeError',
      /escribir_archivo debe devolver \(con return\) el proyecto nuevo/,
    ],
    [
      'agente.ejecutar("x", agente.proyecto(), funciones={"correr_pruebas": lambda proyecto: 2})',
      'TypeError',
      /correr_pruebas debe devolver un texto/,
    ],
  ];

  for (const [codigo, nombre, mensaje] of casos) {
    const error = await errorDe(codigo);
    assert.equal(error.nombre, nombre, codigo);
    assert.match(error.mensaje, mensaje, codigo);
  }
});

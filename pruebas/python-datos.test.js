// Prueba que el evaluador de Python carga numpy y pandas desde vendor/pyodide/
// (sin internet) solo cuando el código los importa.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

require('../js/python-evaluador.js');

const direccion = pathToFileURL(path.join(__dirname, '..', 'vendor', 'pyodide', 'pyodide.mjs')).href;
// Un solo Pyodide para todas las pruebas de este archivo: cargarlo tarda.
const listo = import(direccion).then(async ({ loadPyodide }) => {
  const pyodide = await loadPyodide();
  return { pyodide, evaluar: globalThis.crearEvaluadorPython(pyodide) };
});

test('python: el código sin numpy ni pandas no los carga', async () => {
  const { pyodide, evaluar } = await listo;

  await evaluar('print(1 + 1)', []);

  assert.equal(pyodide.loadedPackages.pandas, undefined);
});

test('python: import pandas carga la librería y un DataFrame funciona', async () => {
  const { evaluar } = await listo;
  const codigo = [
    'import pandas as pd',
    'ventas = pd.DataFrame({"producto": ["arepa", "café"], "precio": [2500, 1800]})',
    'print(ventas["precio"].sum())',
  ].join('\n');

  const resultado = await evaluar(codigo, [
    { descripcion: 'dos filas', condicion: 'len(ventas) == 2' },
  ]);

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.salida, ['4300']);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('python: numpy funciona con operaciones vectorizadas', async () => {
  const { evaluar } = await listo;

  const resultado = await evaluar('import numpy as np\nprint(int((np.array([1, 2, 3]) * 2).sum()))', []);

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.salida, ['12']);
});

test('python: un error de escritura se informa aunque no se puedan leer los import', async () => {
  const { evaluar } = await listo;

  const resultado = await evaluar('import pandas as pd\nprint(1', []);

  assert.equal(resultado.error.nombre, 'SyntaxError');
});

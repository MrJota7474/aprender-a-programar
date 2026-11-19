// Pruebas de los logros (js/logros.js).

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/progreso.js');
require('../js/logros.js');

const { Progreso, Logros } = globalThis;

const rutas = [
  { id: 'a', titulo: 'Ruta A', lecciones: [{ id: 'l1', pasos: [{ id: 'idea' }, { id: 'reto' }] }] },
  { id: 'vacia', titulo: 'Vacía', lecciones: [] },
];

const conCompletados = (claves, dias = {}) => ({
  ...Progreso.PROGRESO_VACIO,
  completados: Object.fromEntries(claves.map((c) => [c, true])),
  dias,
});
const conseguidos = (progreso, hoy = '2026-03-10') =>
  Logros.calcular(progreso, rutas, hoy).filter((l) => l.conseguido).map((l) => l.id);

test('sin progreso no hay logros y el orden es el pedido', () => {
  const lista = Logros.calcular(Progreso.PROGRESO_VACIO, rutas, '2026-03-10');

  assert.deepEqual(lista.map((l) => l.id), [
    'primer-paso', 'primera-leccion', 'racha-3', 'racha-7', 'cien-puntos', 'ruta-a', 'primer-commit',
  ]);
  assert.ok(lista.every((l) => l.conseguido === false && l.titulo && l.descripcion));
});

test('primer-paso, lección completa y ruta completa', () => {
  assert.deepEqual(conseguidos(conCompletados(['a/l1/idea'])), ['primer-paso']);
  assert.deepEqual(
    conseguidos(conCompletados(['a/l1/idea', 'a/l1/reto'])),
    ['primer-paso', 'primera-leccion', 'ruta-a']
  );
});

test('la ruta sin lecciones no tiene logro y el título lleva el nombre de la ruta', () => {
  const lista = Logros.calcular(Progreso.PROGRESO_VACIO, rutas, '2026-03-10');

  assert.equal(lista.some((l) => l.id === 'ruta-vacia'), false);
  assert.equal(lista.find((l) => l.id === 'ruta-a').titulo, 'Terminaste Ruta A');
});

test('rachas de 3 y de 7 días', () => {
  const dias = (fechas) => Object.fromEntries(fechas.map((f) => [f, 1]));
  const tres = conCompletados([], dias(['2026-03-08', '2026-03-09', '2026-03-10']));
  const siete = conCompletados(
    [],
    dias(['2026-03-04', '2026-03-05', '2026-03-06', '2026-03-07', '2026-03-08', '2026-03-09', '2026-03-10'])
  );

  assert.deepEqual(conseguidos(tres), ['racha-3']);
  assert.deepEqual(conseguidos(siete), ['racha-3', 'racha-7']);
});

test('cien-puntos exige 10 pasos', () => {
  const diez = Array.from({ length: 10 }, (_, i) => 'x/y/p' + i);

  assert.ok(conseguidos(conCompletados(diez)).includes('cien-puntos'));
  assert.ok(!conseguidos(conCompletados(diez.slice(1))).includes('cien-puntos'));
});

test('primer-commit se consigue con el paso de Git donde se hace el commit', () => {
  assert.equal(Logros.PASO_PRIMER_COMMIT, 'proyectos/guardar-con-git/preparar-y-guardar');
  assert.ok(conseguidos(conCompletados([Logros.PASO_PRIMER_COMMIT])).includes('primer-commit'));
  assert.ok(
    !conseguidos(conCompletados(['proyectos/guardar-con-git/primer-repositorio'])).includes('primer-commit')
  );
});

test('calcular no modifica el progreso', () => {
  const progreso = conCompletados(['a/l1/idea']);
  const copia = JSON.parse(JSON.stringify(progreso));

  Logros.calcular(progreso, rutas, '2026-03-10');

  assert.deepEqual(progreso, copia);
});

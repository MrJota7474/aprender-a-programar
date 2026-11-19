// Revisa el camino por etapas del inicio (js/etapas.js): que cada ruta del
// catálogo esté en exactamente una etapa y que "Sigue por aquí" recomiende
// la ruta correcta en cada situación.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/rutas.js');
require('../rutas/catalogo.js');
require('../js/etapas.js');
require('../js/mapa.js');

const { Etapas, Mapa, Rutas } = globalThis;
const idsDelCatalogo = Rutas.todas().map((ruta) => ruta.id);

// Arma el "avance" que recibe Etapas: todas las rutas abribles, con 10 pasos
// y 0 hechos, salvo lo que diga "cambios" ({ id: hechos }).
function avanceCon(cambios = {}) {
  return Object.fromEntries(
    idsDelCatalogo.map((id) => [id, { hechos: cambios[id] || 0, total: 10, disponible: true }])
  );
}

test('cada ruta del catálogo está en exactamente una etapa', () => {
  for (const id of idsDelCatalogo) {
    const veces = Etapas.ETAPAS.filter((etapa) => etapa.rutas.includes(id)).length;
    assert.equal(veces, 1, 'la ruta "' + id + '" está en ' + veces + ' etapas');
  }
});

test('las etapas no nombran rutas que no existen', () => {
  for (const id of Etapas.ORDEN) {
    assert.ok(idsDelCatalogo.includes(id), 'ruta inexistente en las etapas: ' + id);
  }
  assert.equal(Etapas.ORDEN.length, idsDelCatalogo.length);
});

test('la última etapa sigue el mismo orden que "Listo para trabajar" del Mapa', () => {
  const ultima = Etapas.ETAPAS[Etapas.ETAPAS.length - 1];
  assert.deepEqual([...ultima.rutas], Mapa.LISTO.map((paso) => paso.ruta));
});

test('sin progreso, recomienda empezar por Python', () => {
  assert.deepEqual(Etapas.recomendar(avanceCon(), null), { rutaId: 'python', continuando: false });
});

test('sin progreso, abrir otra ruta sin hacer pasos no cambia la recomendación', () => {
  assert.deepEqual(Etapas.recomendar(avanceCon(), 'sql'), { rutaId: 'python', continuando: false });
});

test('respeta la última ruta abierta si va empezada y sin terminar', () => {
  const avance = avanceCon({ python: 10, ciberseguridad: 3 });
  assert.deepEqual(Etapas.recomendar(avance, 'ciberseguridad'), { rutaId: 'ciberseguridad', continuando: true });
});

test('si la última ruta ya está terminada, sigue con la primera sin terminar del camino', () => {
  const avance = avanceCon({ python: 10, fundamentos: 10 });
  assert.deepEqual(Etapas.recomendar(avance, 'fundamentos'), { rutaId: 'web', continuando: false });
});

test('una ruta empezada antes en el camino gana a la siguiente sin empezar', () => {
  const avance = avanceCon({ python: 4, web: 10 });
  assert.deepEqual(Etapas.recomendar(avance, 'web'), { rutaId: 'python', continuando: true });
});

test('salta las rutas que todavía no se pueden abrir', () => {
  const avance = { ...avanceCon(), python: { hechos: 0, total: 0, disponible: false } };
  assert.deepEqual(Etapas.recomendar(avance, null), { rutaId: 'fundamentos', continuando: false });
});

test('con todo terminado, se queda en la última ruta abierta', () => {
  const todo = Object.fromEntries(idsDelCatalogo.map((id) => [id, 10]));
  assert.deepEqual(Etapas.recomendar(avanceCon(todo), 'sql'), { rutaId: 'sql', continuando: true });
});

test('sin ninguna ruta abrible, no recomienda nada', () => {
  const avance = Object.fromEntries(idsDelCatalogo.map((id) => [id, { hechos: 0, total: 0, disponible: false }]));
  assert.equal(Etapas.recomendar(avance, null), null);
});

test('el avance de una etapa suma solo sus rutas abribles', () => {
  const avance = { ...avanceCon({ python: 4, fundamentos: 2 }), fundamentos: { hechos: 0, total: 0, disponible: false } };
  const bases = Etapas.etapaDe('python');
  assert.deepEqual(Etapas.avanceDeEtapa(bases, avance), { hechos: 4, total: 10 });
});

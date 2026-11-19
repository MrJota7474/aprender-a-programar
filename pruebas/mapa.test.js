// Revisa que el Mapa del oficio solo enlace a rutas que existen y que
// la lista de la carrera sea coherente.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/rutas.js');
require('../rutas/catalogo.js');
require('../js/mapa.js');

const idsDelCatalogo = globalThis.Rutas.todas().map((ruta) => ruta.id);

test('cada enlace del mapa apunta a una ruta del catálogo', () => {
  const usadas = globalThis.Mapa.rutasUsadas();
  assert.ok(usadas.length > 0);
  for (const id of usadas) {
    assert.ok(idsDelCatalogo.includes(id), 'ruta inexistente en el mapa: ' + id);
  }
});

test('cada área de la carrera tiene un estado válido y solo "Ya está" lleva enlaces', () => {
  for (const area of globalThis.Mapa.CARRERA) {
    assert.ok(area.estado in globalThis.Mapa.ESTADOS, area.area);
    assert.equal(area.estado === 'ya', area.rutas.length > 0, area.area);
  }
});

test('"Listo para trabajar" ordena las rutas: tu computador, oficio, proyectos con IA y primer trabajo', () => {
  const orden = globalThis.Mapa.LISTO.map((paso) => paso.ruta);

  assert.deepEqual(orden, ['tu-computador', 'oficio', 'proyectos-ia', 'primer-trabajo']);
});

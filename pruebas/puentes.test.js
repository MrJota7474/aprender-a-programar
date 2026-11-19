// Revisa los puentes entre lecciones (rutas/puentes.js):
// - toda lección registrada tiene su puente, con viene, sirve y sigue;
// - toda ruta con lecciones tiene su intro;
// - no sobran puentes de rutas o lecciones que ya no existen
//   (pasa si se renombra o se borra una lección y se olvida el puente).
// No carga Python: solo necesita los títulos e ids de las lecciones.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('../js/rutas.js');
require('../rutas/catalogo.js');

const carpetaRutas = path.join(__dirname, '..', 'rutas');
const { Rutas } = globalThis;

// Mismas lecciones que carga la página: un archivo por lección en rutas/<id>/.
Rutas.todas().forEach((ruta) => {
  const carpeta = path.join(carpetaRutas, ruta.id);
  if (!fs.existsSync(carpeta)) return;
  fs.readdirSync(carpeta)
    .filter((nombre) => nombre.endsWith('.js'))
    .sort()
    .forEach((nombre) => require(path.join(carpeta, nombre)));
});
require('../rutas/puentes.js');

const { Puentes } = globalThis;
const rutasConLecciones = Rutas.todas().filter((ruta) => ruta.lecciones.length > 0);
const textoLleno = (valor) => typeof valor === 'string' && valor.trim().length > 0;

test('toda ruta con lecciones tiene su intro', () => {
  rutasConLecciones.forEach((ruta) => {
    assert.ok(Puentes[ruta.id], 'Falta la ruta en puentes.js: ' + ruta.id);
    assert.ok(textoLleno(Puentes[ruta.id].intro), 'Falta la intro de la ruta ' + ruta.id);
  });
});

test('toda lección tiene su puente con viene, sirve y sigue', () => {
  rutasConLecciones.forEach((ruta) => {
    const lecciones = (Puentes[ruta.id] || {}).lecciones || {};
    ruta.lecciones.forEach((leccion) => {
      const puente = lecciones[leccion.id];
      const nombre = ruta.id + '/' + leccion.id;
      assert.ok(puente, 'Falta el puente de ' + nombre);
      ['viene', 'sirve', 'sigue'].forEach((campo) => {
        assert.ok(textoLleno(puente[campo]), 'Falta "' + campo + '" en ' + nombre);
      });
    });
  });
});

test('no sobran puentes de rutas o lecciones que no existen', () => {
  Object.entries(Puentes).forEach(([rutaId, datos]) => {
    const ruta = rutasConLecciones.find((candidata) => candidata.id === rutaId);
    assert.ok(ruta, 'Sobra la ruta en puentes.js: ' + rutaId);
    const ids = ruta.lecciones.map((leccion) => leccion.id);
    Object.keys(datos.lecciones || {}).forEach((leccionId) => {
      assert.ok(ids.includes(leccionId), 'Sobra el puente de ' + rutaId + '/' + leccionId);
    });
  });
});

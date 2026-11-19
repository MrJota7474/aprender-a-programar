// Revisa que el panel de certificados solo enlace a rutas que existen, que
// cada certificado lleve a una página oficial segura (https) y que las
// referencias entre certificados y temas faltantes no estén rotas.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/rutas.js');
require('../rutas/catalogo.js');
require('../js/certificados.js');

const { Certificados } = globalThis;
const idsDelCatalogo = globalThis.Rutas.todas().map((ruta) => ruta.id);
const idsCertificados = Certificados.CERTIFICADOS.map((c) => c.id);
const idsTemas = Certificados.TEMAS_FALTANTES.map((t) => t.id);

test('cada ruta enlazada existe en el catálogo', () => {
  const usadas = Certificados.rutasUsadas();
  assert.ok(usadas.length > 0);
  for (const id of usadas) {
    assert.ok(idsDelCatalogo.includes(id), 'ruta inexistente en certificados: ' + id);
  }
});

test('cada certificado tiene una URL https', () => {
  for (const c of Certificados.CERTIFICADOS) {
    assert.equal(new URL(c.url).protocol, 'https:', c.id);
  }
});

test('no hay ids repetidos entre certificados ni entre temas faltantes', () => {
  const todos = [...idsCertificados, ...idsTemas];
  assert.equal(new Set(todos).size, todos.length);
});

test('cada certificado está en un grupo conocido y con un nivel válido (si lo tiene)', () => {
  const grupos = Certificados.GRUPOS.map((g) => g.id);
  for (const c of Certificados.CERTIFICADOS) {
    assert.ok(grupos.includes(c.grupo), c.id);
    if (c.nivel !== undefined) assert.ok(c.nivel in Certificados.NIVELES, c.id);
    assert.ok(c.pide.length > 0, c.id);
  }
});

test('certificados y temas faltantes se citan entre sí con ids que existen', () => {
  for (const c of Certificados.CERTIFICADOS) {
    for (const id of c.faltan) assert.ok(idsTemas.includes(id), c.id + ' → ' + id);
  }
  for (const t of Certificados.TEMAS_FALTANTES) {
    assert.ok(t.piden.length > 0, t.id);
    for (const id of t.piden) assert.ok(idsCertificados.includes(id), t.id + ' → ' + id);
    assert.ok(t.ruta.existente || t.ruta.nueva, t.id);
  }
});

// Revisa los videos de YouTube (rutas/videos.js):
// - toda URL tiene una de las formas aceptadas (watch, youtu.be o playlist);
// - toda clave apunta a una ruta o lección que existe en el catálogo
//   (pasa si se renombra o se borra una lección y se olvida el video);
// - no hay URL repetidas dentro de una misma lista;
// - los campos obligatorios tienen texto.
// No carga Python: solo necesita los ids de las rutas y las lecciones.

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
require('../rutas/videos.js');

const { Videos } = globalThis;
const textoLleno = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// Todas las listas, cada una con su clave, para revisarlas igual.
const listas = [
  ...Object.entries(Videos.rutas).map(([clave, videos]) => ['rutas/' + clave, videos]),
  ...Object.entries(Videos.lecciones).map(([clave, videos]) => ['lecciones/' + clave, videos]),
];

test('esUrlDeYouTube acepta solo las tres formas permitidas', () => {
  const validas = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/playlist?list=PLU8oAlHdN5BlvPxziopYZRd55pdqFwkeS',
  ];
  const invalidas = [
    'http://www.youtube.com/watch?v=dQw4w9WgXcQ', // sin https
    'https://www.youtube.com/watch?v=dQw4w9WgXc', // id de 10 caracteres
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30', // parámetros extra
    'https://www.youtube.com.malo.co/watch?v=dQw4w9WgXcQ', // otro dominio
    'https://youtube.com/watch?v=dQw4w9WgXcQ', // sin www
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'javascript:alert(1)',
    '',
    undefined,
  ];
  validas.forEach((url) => assert.ok(Videos.esUrlDeYouTube(url), url));
  invalidas.forEach((url) => assert.ok(!Videos.esUrlDeYouTube(url), String(url)));
});

test('analizarUrlDeYouTube distingue videos de listas', () => {
  assert.deepEqual(Videos.analizarUrlDeYouTube('https://youtu.be/dQw4w9WgXcQ'), { tipo: 'video', id: 'dQw4w9WgXcQ' });
  assert.equal(Videos.analizarUrlDeYouTube('https://www.youtube.com/playlist?list=PLabc123').tipo, 'lista');
});

test('videosDeLeccion y videosDeRuta devuelven [] si no hay videos, y una copia si hay', () => {
  assert.deepEqual(Videos.videosDeLeccion('no-existe', 'tampoco'), []);
  assert.deepEqual(Videos.videosDeRuta('no-existe'), []);
  Object.keys(Videos.rutas).forEach((rutaId) => {
    const copia = Videos.videosDeRuta(rutaId);
    assert.notEqual(copia, Videos.rutas[rutaId]);
    assert.deepEqual(copia, Videos.rutas[rutaId]);
  });
});

test('cada clave de rutas es una ruta del catálogo', () => {
  Object.keys(Videos.rutas).forEach((rutaId) => {
    assert.ok(Rutas.buscar(rutaId), 'Sobra la ruta en videos.js: ' + rutaId);
  });
});

test('cada clave de lecciones es "ruta/lección" de una lección que existe', () => {
  Object.keys(Videos.lecciones).forEach((clave) => {
    const [rutaId, leccionId, ...resto] = clave.split('/');
    assert.equal(resto.length, 0, 'La clave debe ser "ruta/lección": ' + clave);
    const ruta = Rutas.buscar(rutaId);
    assert.ok(ruta, 'No existe la ruta de ' + clave);
    assert.ok(ruta.lecciones.some((leccion) => leccion.id === leccionId), 'No existe la lección ' + clave);
  });
});

test('cada video tiene título, canal, URL válida e idioma es/en', () => {
  listas.forEach(([clave, videos]) => {
    assert.ok(Array.isArray(videos) && videos.length > 0, 'Lista vacía o mal formada: ' + clave);
    videos.forEach((video, indice) => {
      const donde = clave + ' #' + (indice + 1);
      assert.ok(textoLleno(video.titulo), 'Falta título: ' + donde);
      assert.ok(textoLleno(video.canal), 'Falta canal: ' + donde);
      assert.ok(Videos.esUrlDeYouTube(video.url), 'URL no válida en ' + donde + ': ' + video.url);
      assert.ok(['es', 'en'].includes(video.idioma), 'idioma debe ser es o en: ' + donde);
      if ('nota' in video) assert.ok(textoLleno(video.nota), 'Nota vacía: ' + donde);
    });
  });
});

test('no hay URL repetidas dentro de una misma lista', () => {
  listas.forEach(([clave, videos]) => {
    const urls = videos.map((video) => video.url);
    assert.equal(new Set(urls).size, urls.length, 'URL repetida en ' + clave);
  });
});

// Pruebas del glosario (js/glosario.js) y de cómo formatearTexto marca sus
// términos dentro de las lecciones sin abrirle la puerta a HTML ajeno.

const test = require('node:test');
const assert = require('node:assert/strict');

// El mismo orden que en index.html: primero el diccionario, después formato.js.
require('../js/glosario.js');
require('../js/formato.js');

const { Glosario, formatearTexto, escaparHtml } = globalThis;

const botones = (html) => html.match(/<button[^>]*>[^<]*<\/button>/g) || [];
const terminosMarcados = (html) => botones(html).map((boton) => boton.replace(/<[^>]+>/g, ''));

// ---------- el diccionario ----------

test('el glosario tiene más de cien términos, cada uno con su definición', () => {
  assert.ok(Glosario.terminos.length >= 100, 'hay ' + Glosario.terminos.length + ' términos');
  Glosario.terminos.forEach((entrada) => {
    assert.equal(typeof entrada.termino, 'string');
    assert.ok(entrada.definicion.length > 20, 'definición corta en "' + entrada.termino + '"');
    // "1 o 2 frases sencillas": a lo sumo tres puntos seguidos de espacio.
    const frases = entrada.definicion.split(/[.:]\s/).length;
    assert.ok(frases <= 3, 'definición muy larga en "' + entrada.termino + '"');
  });
});

test('ninguna forma de escribir un término apunta a dos términos distintos', () => {
  const vistas = new Map();
  Glosario.terminos.forEach((entrada) => {
    [entrada.termino, ...entrada.formas].forEach((forma) => {
      const clave = forma.toLowerCase();
      assert.ok(!vistas.has(clave), '"' + forma + '" está en "' + vistas.get(clave) + '" y en "' + entrada.termino + '"');
      vistas.set(clave, entrada.termino);
    });
  });
});

test('el diccionario no se puede cambiar desde otro archivo', () => {
  assert.ok(Object.isFrozen(Glosario.terminos));
  assert.ok(Object.isFrozen(Glosario.terminos[0]));
  assert.throws(() => {
    'use strict';
    Glosario.terminos[0].definicion = 'otra cosa';
  });
});

test('cada término que se marca se encuentra cuando aparece en un párrafo', () => {
  Glosario.terminos
    .filter((entrada) => entrada.marcar !== false)
    .forEach((entrada) => {
      const html = formatearTexto('Hoy vimos ' + entrada.termino + ' juntos.');
      assert.deepEqual(terminosMarcados(html), [escaparHtml(entrada.termino)], entrada.termino);
    });
});

test('el buscador del panel ignora tildes y mayúsculas y devuelve una lista nueva ordenada', () => {
  const encontrados = Glosario.filtrar('FUNCION');
  assert.ok(encontrados.some((entrada) => entrada.termino === 'función'));

  const todos = Glosario.filtrar('');
  assert.equal(todos.length, Glosario.terminos.length);
  assert.notEqual(todos, Glosario.terminos);
  const nombres = todos.map((entrada) => entrada.termino);
  assert.deepEqual(nombres, [...nombres].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));

  assert.deepEqual(Glosario.filtrar('palabra que no está en ningún lado'), []);
});

// ---------- marcar dentro del texto ----------

test('marca solo la primera vez que aparece cada término en un párrafo', () => {
  const html = formatearTexto('Una variable guarda un dato. Otra variable guarda otro.');

  assert.deepEqual(terminosMarcados(html), ['variable']);
  assert.match(html, /Otra variable guarda otro\.$/);
});

test('la marca es un botón accesible conectado con su definición', () => {
  const html = formatearTexto('Crea una variable.');
  const [, id] = html.match(/aria-describedby="([^"]+)"/);

  assert.match(html, /<button type="button" class="glosario__termino" aria-expanded="false"/);
  assert.match(html, new RegExp('<span class="glosario__definicion" role="tooltip" id="' + id + '">'));
  assert.match(html, /Una caja con nombre donde guardas un valor/);
});

test('cada marca tiene un id distinto, aunque el término se repita en otro párrafo', () => {
  const ids = [formatearTexto('una variable'), formatearTexto('otra variable')].map(
    (html) => html.match(/aria-describedby="([^"]+)"/)[1]
  );
  assert.notEqual(ids[0], ids[1]);
});

test('no marca dentro de un código, ni pedazos de palabras, ni direcciones', () => {
  assert.deepEqual(terminosMarcados(formatearTexto('Escribe `variable = 5` y listo')), []);
  assert.deepEqual(terminosMarcados(formatearTexto('Este programa es corto')), []); // "rama" en "programa"
  assert.deepEqual(terminosMarcados(formatearTexto('Pide a api.tienda-donpepe.co los datos')), []);
  assert.deepEqual(terminosMarcados(formatearTexto('La API responde')), ['API']);
});

test('la frase más larga gana: "base de datos" antes que sus palabras sueltas', () => {
  const html = formatearTexto('Guarda la tabla en una base de datos y une con una clave foránea.');
  assert.deepEqual(terminosMarcados(html), ['tabla', 'base de datos', 'clave foránea']);
});

test('marca a lo sumo tres términos por párrafo, para que se pueda leer', () => {
  const html = formatearTexto('variable, función, bucle, lista y diccionario');
  assert.equal(botones(html).length, 3);
});

test('respeta mayúsculas del texto y marca dentro de la negrita', () => {
  const html = formatearTexto('**Variable** es una caja.');
  assert.match(html, /^<strong><span class="glosario"><button[^>]*>Variable<\/button>/);
});

test('sin el glosario cargado, formatearTexto queda como antes', () => {
  const guardado = globalThis.Glosario;
  globalThis.Glosario = undefined;
  try {
    assert.equal(formatearTexto('Una `variable` y una **lista**'), 'Una <code>variable</code> y una <strong>lista</strong>');
  } finally {
    globalThis.Glosario = guardado;
  }
});

// ---------- seguridad ----------

// Las únicas etiquetas y atributos que formatearTexto puede producir.
const ETIQUETAS_PERMITIDAS = new Set(['code', 'strong', 'span', 'button']);
const ATRIBUTOS_PERMITIDOS = new Set(['type', 'class', 'aria-expanded', 'aria-describedby', 'role', 'id']);

function revisarHtmlSeguro(html) {
  const etiquetas = html.match(/<[^>]*>/g) || [];
  etiquetas.forEach((etiqueta) => {
    const [, nombre, resto] = etiqueta.match(/^<\/?([a-z]+)([^>]*)>$/) || [];
    assert.ok(nombre && ETIQUETAS_PERMITIDAS.has(nombre), 'etiqueta no permitida: ' + etiqueta);
    const atributos = [...resto.matchAll(/([\w-]+)="[^"<>]*"/g)].map((m) => m[1]);
    atributos.forEach((atributo) => assert.ok(ATRIBUTOS_PERMITIDOS.has(atributo), 'atributo raro: ' + etiqueta));
    // Lo que queda fuera de los atributos válidos debe ser solo espacio.
    assert.equal(resto.replace(/([\w-]+)="[^"<>]*"/g, '').trim(), '', 'sobra algo en ' + etiqueta);
  });
}

test('formatearTexto con glosario sigue escapando todo el HTML del texto', () => {
  const ataques = [
    '<img src=x onerror="alert(1)"> una variable',
    'una variable"><script>alert(1)</script>',
    "la función ' onmouseover='alert(1)",
    '`<b>código</b>` y una lista &amp; <i>diccionario</i>',
    '**<a href="javascript:alert(1)">API</a>**',
    'una variable &lt;script&gt; y &#60;b&#62;',
  ];
  ataques.forEach((ataque) => {
    const html = formatearTexto(ataque);
    revisarHtmlSeguro(html);
    // onerror= puede quedar, pero como texto escapado: lo que no puede haber es una etiqueta.
    assert.doesNotMatch(html, /<script|<img|<a |<i>|<b>/i, ataque);
  });
});

test('la definición sale del diccionario fijo, nunca del texto del estudiante', () => {
  const html = formatearTexto('variable <b>definición falsa</b>');
  const definicion = html.match(/role="tooltip" id="[^"]+">([\s\S]*?)<\/span><\/span>/)[1];

  assert.doesNotMatch(definicion, /definición falsa/);
  assert.match(definicion, /^<strong class="glosario__nombre">variable:<\/strong> Una caja con nombre/);
});

test('las entidades del texto no se parten al marcar', () => {
  const html = formatearTexto('Tom & Jerry usan una variable; "comillas" y \'simples\'.');
  assert.match(html, /Tom &amp; Jerry/);
  assert.match(html, /&quot;comillas&quot; y &#39;simples&#39;/);
});

test('no marca la palabra común cuando no es el término ("ya está lista", "Prueba con…")', () => {
  assert.deepEqual(terminosMarcados(formatearTexto('La función ya está lista.')), ['función']);
  assert.deepEqual(terminosMarcados(formatearTexto('Prueba la cuenta con lápiz.')), []);
  assert.deepEqual(terminosMarcados(formatearTexto('Corre la prueba otra vez.')), ['prueba']);
  assert.deepEqual(terminosMarcados(formatearTexto('Recorre la lista.')), ['lista']);
});

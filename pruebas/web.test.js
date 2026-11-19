// Pruebas del evaluador de HTML y CSS (el que revisa las lecciones de la
// ruta "web" sin necesitar un navegador) y de su motor.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/formato.js');
require('../js/motores.js');
require('../js/trabajadores.js');
require('../js/web-analizador.js');
require('../js/web-estilos.js');
require('../js/web-evaluador.js');
require('../js/motor-web.js');

const { evaluarWeb, explicarErrorWeb, Motores } = globalThis;

// Evalúa una página con condiciones sueltas y devuelve cuáles aprobaron.
const aprobadas = (codigo, ...condiciones) =>
  evaluarWeb(
    codigo,
    condiciones.map((condicion) => ({ descripcion: condicion, condicion }))
  ).resultados.map((r) => r.aprobada);

const todasAprueban = (codigo, ...condiciones) => {
  const resultado = evaluarWeb(
    codigo,
    condiciones.map((condicion) => ({ descripcion: condicion, condicion }))
  );
  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.resultados.filter((r) => !r.aprobada).map((r) => r.descripcion), []);
};

const errorDe = (codigo) => evaluarWeb(codigo, []).error;

const conEstilo = (css, cuerpo) =>
  '<html><head><style>' + css + '</style></head><body>' + cuerpo + '</body></html>';

// ---------- el resultado ----------

test('devuelve el documento en vista.html y ningún error cuando está bien formado', () => {
  const codigo = '<h1>Hola</h1>';

  const resultado = evaluarWeb(codigo, []);

  assert.deepEqual(resultado, { salida: [], error: null, resultados: [], vista: { html: codigo } });
});

test('con un error de HTML también entrega la vista, pero no corre las pruebas', () => {
  const resultado = evaluarWeb('<p>sin cerrar', [{ descripcion: 'x', condicion: 'true' }]);

  assert.equal(resultado.error.nombre, 'ErrorHTML');
  assert.deepEqual(resultado.resultados, []);
  assert.equal(resultado.vista.html, '<p>sin cerrar');
});

// ---------- estructura ----------

test('las pruebas pueden contar elementos, leer textos y atributos', () => {
  todasAprueban(
    '<h1>Tienda   Don\n  Pepe</h1><ul><li>Pan</li><li>Leche</li><li>Tinto</li></ul>' +
      '<a href="https://ejemplo.com/pan">Ver <b>pan</b></a><img src="pan.png" alt="Un pan">',
    'texto("h1") === "Tienda Don Pepe"',
    'cuenta("ul > li") === 3',
    'texto("ul") === "Pan Leche Tinto"',
    'atributo("a", "href") === "https://ejemplo.com/pan"',
    'texto("a") === "Ver pan"',
    'atributo("img", "alt") === "Un pan" && atributo("img", "title") === null',
    'texto("h2") === "" && uno("h2") === null && cuenta("h2") === 0',
    'todos("li").map((li) => li.texto).join() === "Pan,Leche,Tinto"',
    'uno("ul").hijos.length === 3 && uno("li").padre.etiqueta === "ul"'
  );
});

test('acepta mayúsculas en etiquetas y atributos, comillas simples, dobles o ninguna', () => {
  todasAprueban(
    '<H1 CLASS=\'titulo\'>Hola</H1><A HREF="x.html" id=enlace>Ir</a><BR><input type=text disabled>',
    'cuenta("h1.titulo") === 1',
    'atributo("a", "href") === "x.html"',
    'cuenta("#enlace") === 1',
    'cuenta("br") === 1',
    'atributo("input", "disabled") === ""'
  );
});

test('entiende los selectores de CSS más usados', () => {
  todasAprueban(
    '<div id="menu" class="caja grande"><p>uno</p><p class="oferta">dos</p><span><p>tres</p></span></div><p>cuatro</p>',
    'cuenta("p") === 4',
    'cuenta("div p") === 3',
    'cuenta("div > p") === 2',
    'cuenta("#menu.caja.grande") === 1',
    'cuenta("p.oferta, span") === 2',
    'texto("p:first-child") === "uno"',
    'texto("div > p:nth-child(2)") === "dos"',
    'texto("div + p") === "cuatro"',
    'cuenta("p:not(.oferta)") === 3',
    'cuenta("[class]") === 2 && cuenta("[class=oferta]") === 1 && cuenta(\'[id^="me"]\') === 1',
    'cuenta("*") === 6'
  );
});

test('convierte las entidades y deja por fuera el texto de style y script', () => {
  todasAprueban(
    '<p>Caf&eacute; &amp; pan &lt;fresco&gt; &#36;300</p><style>p { color: red; }</style><script>var x = 1;</script>',
    'texto("p") === "Café & pan <fresco> $300"',
    'uno("p").padre.texto === "Café & pan <fresco> $300"'
  );
});

test('mismoTexto perdona mayúsculas, tildes, espacios y el punto final', () => {
  todasAprueban(
    '<h1> tienda  don pépe. </h1>',
    'mismoTexto(texto("h1"), "Tienda Don Pepe")',
    'mismoTexto(texto("h1"), "Tienda de Pepe") === false'
  );
});

test('tieneDoctype y codigo (sin comentarios) están disponibles', () => {
  assert.deepEqual(
    aprobadas('<!doctype html>\n<!-- <h2> de mentiras -->\n<h1>Hola</h1>', 'tieneDoctype', '!/h2/.test(codigo)', 'cuenta("h2") === 0'),
    [true, true, true]
  );
  assert.deepEqual(aprobadas('<h1>Hola</h1>', 'tieneDoctype'), [false]);
});

test('una prueba que falla por dentro cuenta como no aprobada', () => {
  assert.deepEqual(aprobadas('<p>hola</p>', 'uno("h1").texto === "x"', 'cuenta("p >") === 1', 'esto no es javascript'), [
    false,
    false,
    false,
  ]);
});

// ---------- errores de HTML en español ----------

test('una etiqueta sin cerrar se explica con su nombre y su línea', () => {
  const error = errorDe('<h1>Hola</h1>\n<p>Abrimos todos los días');

  assert.equal(error.nombre, 'ErrorHTML');
  assert.equal(error.linea, 2);
  assert.match(error.mensaje, /<p> no se cerró/);
  assert.match(error.mensaje, /<\/p>/);
});

test('avisa cuando a la etiqueta de cierre le faltó la barra', () => {
  const error = errorDe('<h1>Hola<h1>');

  assert.match(error.mensaje, /le faltó la barra/);
});

test('avisa cuando las etiquetas se cierran en desorden', () => {
  const error = errorDe('<div>\n<p>Hola</div>\n</p>');

  assert.equal(error.linea, 2);
  assert.match(error.mensaje, /Cerraste <\/div>/);
  assert.match(error.mensaje, /Cierra primero <\/p>/);
});

test('avisa de un cierre que sobra, de un > que falta y de unas comillas abiertas', () => {
  assert.match(errorDe('<p>Hola</p></div>').mensaje, /no hay ninguna <div> abierta/);
  assert.match(errorDe('<p>Hola</p\n<p>Chao</p>').mensaje, /le falta el >/);
  assert.match(errorDe('<p class="a" <b>Hola</b></p>').mensaje, /<p le falta el >/);
  assert.match(errorDe('<a href="pan.html>Pan</a>\n<p>Hola</p>').mensaje, /href le falta cerrar las comillas/);
  assert.match(errorDe('<br></br>').mensaje, /se escribe sola/);
  assert.match(errorDe('<!-- nota <p>Hola</p>').mensaje, /comentario no se cerró/);
  assert.match(errorDe('<style>h1 { color: red; }').mensaje, /<style> no se cerró/);
});

test('un signo < suelto en el texto no es un error', () => {
  todasAprueban('<p>2 < 3 y 5 > 4</p>', 'texto("p") === "2 < 3 y 5 > 4"');
});

// ---------- CSS ----------

test('estilo() entrega el valor normalizado y color() lo lleva a #rrggbb', () => {
  todasAprueban(
    conEstilo(
      'H1 { COLOR: Red; font-family: "Trebuchet MS" , Arial,  Sans-Serif }\n.a { color: #0F0 } .b { color: rgb(0, 0, 255) } .c { color: #FFFF00 }',
      '<h1>Hola</h1><p class="a">a</p><p class="b">b</p><p class="c">c</p><p class="d">d</p>'
    ),
    'estilo("h1", "color") === "red"',
    'color("h1", "color") === "#ff0000"',
    'estilo("h1", "font-family") === "trebuchet ms,arial,sans-serif"',
    'color(".a", "color") === "#00ff00"',
    'color(".b", "color") === "#0000ff"',
    'color(".c", "color") === "#ffff00"',
    'estilo(".d", "color") === "" && color(".d", "color") === ""',
    'estilo("h2", "color") === ""',
    'aHex("White") === "#ffffff" && aHex("12px") === null'
  );
});

test('gana la regla más específica y, si empatan, la última', () => {
  todasAprueban(
    conEstilo(
      'p { color: blue; } .oferta { color: red; } p { color: green; } #unico { color: black; } p.oferta { margin: 0 !important; } #unico { margin: 5px; }',
      '<p>a</p><p class="oferta">b</p><p class="oferta" id="unico">c</p><p style="color: orange">d</p>'
    ),
    'estilo("p", "color") === "green"',
    'estilo(".oferta", "color") === "red"',
    'estilo("#unico", "color") === "black"',
    'estilo("#unico", "margin") === "0"',
    'estilo("p:nth-child(4)", "color") === "orange"'
  );
});

test('las propiedades de texto se heredan del papá y las demás no', () => {
  todasAprueban(
    conEstilo('body { font-family: Arial, sans-serif; color: navy; background-color: beige; }', '<div><p>Hola</p></div>'),
    '/sans-serif/.test(estilo("p", "font-family"))',
    'color("p", "color") === "#000080"',
    'estilo("p", "background-color") === ""',
    'color("body", "background-color") === "#f5f5dc"'
  );
});

test('las propiedades abreviadas también responden por las largas', () => {
  todasAprueban(
    conEstilo(
      '.a { background: yellow; margin: 10px 20px; padding: 5px; border: 2px solid #f00; } .b { display: flex; }',
      '<div class="a"></div><div class="b"></div>'
    ),
    'color(".a", "background-color") === "#ffff00"',
    'estilo(".a", "margin-top") === "10px" && estilo(".a", "margin-left") === "20px"',
    'estilo(".a", "padding-bottom") === "5px"',
    'estilo(".a", "border-style") === "solid" && estilo(".a", "border-width") === "2px"',
    'color(".a", "border-color") === "#ff0000"',
    'estilo(".b", "display") === "flex"'
  );
});

test('reglas y regla() dejan revisar lo que escribió el estudiante', () => {
  todasAprueban(
    conEstilo('h1,h2{color:red}  ul   >li { color: blue; }\n a:hover { color: green; } /* p { color: pink } */', '<h1>a</h1><a href="#">b</a>'),
    'reglas.length === 3',
    'reglas[0].selector === "h1, h2" && reglas[0].propiedades.color === "red"',
    'regla("ul > li").color === "blue" && regla("ul>li") !== null',
    'regla("a:hover").color === "green"',
    'regla("p") === null',
    // :hover depende del ratón: la regla existe pero no pinta el enlace.
    'estilo("a", "color") === ""'
  );
});

test('junta el CSS de varias etiquetas style y se salta las reglas con @', () => {
  todasAprueban(
    '<style>@import url("x.css"); @media (max-width: 600px) { p { color: red; } } p { color: blue; }</style><style>h1 { color: red; }</style><p>a</p><h1>b</h1>',
    'estilo("p", "color") === "blue"',
    'estilo("h1", "color") === "red"',
    'reglas.length === 2'
  );
});

test('las reglas de @media van en medias y estiloEn las aplica según el ancho', () => {
  todasAprueban(
    conEstilo(
      '.caja { display: grid; grid-template-columns: 1fr; gap: 10px; }' +
        '@media (min-width: 600px) { .caja { grid-template-columns: repeat(2, 1fr); } }' +
        '@media screen and (min-width: 62.5em) { .caja { grid-template-columns: repeat(3, 1fr); } }' +
        '@media (max-width: 300px) { .caja { gap: 0; } }' +
        '@media print { .caja { display: none; } }',
      '<div class="caja"><p>a</p></div>'
    ),
    // Sin ancho no cuenta ninguna @media, y "reglas" solo trae las de siempre.
    'estilo(".caja", "grid-template-columns") === "1fr" && estilo(".caja", "display") === "grid"',
    'estilo(".caja", "gap") === "10px" && reglas.length === 1',
    'medias.length === 4 && medias[0].media === "(min-width: 600px)"',
    'medias[0].propiedades["grid-template-columns"] === "repeat(2,1fr)"',
    'estiloEn(375, ".caja", "grid-template-columns") === "1fr"',
    'estiloEn(600, ".caja", "grid-template-columns") === "repeat(2,1fr)"',
    'estiloEn(1000, ".caja", "grid-template-columns") === "repeat(3,1fr)"',
    'estiloEn(200, ".caja", "gap") === "0" && estiloEn(375, ".caja", "gap") === "10px"',
    // print nunca se cumple en una pantalla.
    'estiloEn(1000, ".caja", "display") === "grid"',
    'estiloEn(375, ".no-existe", "display") === ""'
  );
});

test('contraste() mide qué tanto se distinguen dos colores, como las pautas WCAG', () => {
  todasAprueban(
    conEstilo('.claro { color: #999; background-color: white; } .oscuro { color: #333; background: #fff; }', '<p class="claro">a</p><p class="oscuro">b</p>'),
    'Math.abs(contraste("black", "#ffffff") - 21) < 0.01 && contraste("red", "red") === 1',
    'contraste(color(".claro", "color"), color(".claro", "background-color")) < 4.5',
    'contraste(color(".oscuro", "color"), color(".oscuro", "background-color")) >= 4.5',
    'contraste("no-es-color", "white") === null'
  );
});

test('una @media dentro de otra suma las dos condiciones y sus errores dicen la línea', () => {
  todasAprueban(
    conEstilo('@media (min-width: 600px) { @media (max-width: 900px) { p { color: red; } } }', '<p>a</p>'),
    'estiloEn(700, "p", "color") === "red"',
    'estiloEn(1000, "p", "color") === "" && estiloEn(500, "p", "color") === ""'
  );
  const error = errorDe('<style>\n@media (min-width: 600px) {\n  p { color red; }\n}\n</style>');
  assert.match(error.mensaje, /dos puntos/);
  assert.equal(error.linea, 3);
});

test('los errores de CSS se explican en español y dicen la línea', () => {
  const sinLlave = errorDe('<style>\nh1 {\n  color: red;\np { color: blue; }\n</style>');
  const sinDosPuntos = errorDe(conEstilo('h1 { color red; }', ''));
  const sinPuntoYComa = errorDe(conEstilo('h1 {\n color: red\n background-color: blue;\n}', ''));
  const porFuera = errorDe(conEstilo('h1 { color: red; }\ncolor: blue;', ''));

  assert.equal(sinLlave.nombre, 'ErrorCSS');
  assert.equal(sinLlave.linea, 2);
  assert.match(sinLlave.mensaje, /regla de "h1" le falta la llave de cierre/);
  assert.match(sinDosPuntos.mensaje, /"color red" le faltan los dos puntos/);
  assert.match(sinPuntoYComa.mensaje, /falta un punto y coma/);
  assert.match(porFuera.mensaje, /por fuera de las llaves/);
  assert.match(errorDe(conEstilo('h1 { color: red; } }', '')).mensaje, /sobra una llave/);
});

// ---------- JavaScript en la página ----------

const PAGINA_CON_BOTON = [
  '<p id="saludo">Hola</p>',
  '<button id="boton">Cambiar</button>',
  '<script>',
  '  const saludo = document.getElementById("saludo");',
  '  let veces = 0;',
  '  document.querySelector("#boton").addEventListener("click", function () {',
  '    veces = veces + 1;',
  '    saludo.textContent = "Clics: " + veces;',
  '    saludo.classList.toggle("activo");',
  '    saludo.style.backgroundColor = "Yellow";',
  '    console.log("clic", veces);',
  '  });',
  '  console.log("lista");',
  '</script>',
].join('\n');

test('corre el script de la página y clic() dispara sus funciones', () => {
  const resultado = evaluarWeb(PAGINA_CON_BOTON, [
    { descripcion: 'antes', condicion: 'texto("#saludo") === "Hola"' },
    { descripcion: 'un clic', condicion: 'clic("#boton") && texto("#saludo") === "Clics: 1"' },
    { descripcion: 'clase y estilo', condicion: 'cuenta("#saludo.activo") === 1 && color("#saludo", "background-color") === "#ffff00"' },
    { descripcion: 'otro clic', condicion: 'clic("#boton") && texto("#saludo") === "Clics: 2" && cuenta(".activo") === 0' },
    { descripcion: 'sin elemento', condicion: 'clic("#no-existe") === false' },
    { descripcion: 'salida', condicion: 'salida.includes("clic 2")' },
  ]);

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.resultados.map((r) => r.aprobada), [true, true, true, true, true, true]);
  assert.deepEqual(resultado.salida, ['lista', 'clic 1', 'clic 2']);
});

test('cada ejecución empieza con la página original', () => {
  const prueba = [{ descripcion: 'un clic', condicion: 'clic("#boton") && texto("#saludo") === "Clics: 1"' }];

  evaluarWeb(PAGINA_CON_BOTON, prueba);
  const segunda = evaluarWeb(PAGINA_CON_BOTON, prueba);

  assert.equal(segunda.resultados[0].aprobada, true);
});

test('un onclick escrito en la etiqueta encuentra las funciones del script', () => {
  todasAprueban(
    '<h1 id="titulo">Cerrado</h1><button onclick="abrir(\'Abierto\')">Abrir</button><input id="nombre">' +
      '<script>function abrir(texto) { document.getElementById("titulo").innerHTML = "<b>" + texto + "</b>"; }\n' +
      'document.getElementById("nombre").addEventListener("input", (evento) => { document.title = evento.target.value; abrir(evento.target.value); });</script>',
    'clic("button") && texto("#titulo") === "Abierto" && cuenta("#titulo > b") === 1',
    'escribir("#nombre", "Pepe") && texto("#titulo") === "Pepe"'
  );
});

test('un script solo ve los elementos escritos antes que él', () => {
  const alFinal = evaluarWeb('<p id="a">x</p><script>document.getElementById("a").textContent = "y";</script>', [
    { descripcion: 'cambió', condicion: 'texto("#a") === "y"' },
  ]);
  const alComienzo = evaluarWeb('<script>document.getElementById("a").textContent = "y";</script><p id="a">x</p>', []);

  assert.equal(alFinal.resultados[0].aprobada, true);
  assert.equal(alComienzo.error.nombre, 'TypeError');
  assert.match(explicarErrorWeb(alComienzo.error), /al final del <body>/);
});

test('un script que espera a que cargue la página sí ve todo, y setTimeout se cumple', () => {
  todasAprueban(
    '<script>document.addEventListener("DOMContentLoaded", () => { setTimeout(() => { document.querySelector("p").textContent = "listo"; }, 500); });</script><p>espera</p>',
    'texto("p") === "listo"'
  );
});

test('un error en el script se informa sin lanzar excepción y conserva la salida', () => {
  const resultado = evaluarWeb('<p>Hola</p><script>console.log("antes"); noExiste();</script>', [
    { descripcion: 'x', condicion: 'true' },
  ]);

  assert.equal(resultado.error.nombre, 'ReferenceError');
  assert.deepEqual(resultado.salida, ['antes']);
  assert.deepEqual(resultado.resultados, []);
  assert.match(explicarErrorWeb(resultado.error), /En el JavaScript de tu página/);
});

// ---------- el motor ----------

test('el motor web queda registrado con su contrato completo', () => {
  const motor = Motores.obtener('web');

  assert.equal(typeof motor.ejecutar, 'function');
  assert.equal(typeof motor.preparar, 'function');
  assert.equal(motor.lenguaje, 'html');
  assert.equal(motor.nombreLenguaje, 'HTML y CSS');
  assert.equal(motor.archivo, 'index.html');
});

test('explicarErrorWeb agrega la línea a los errores de HTML y CSS', () => {
  const texto = explicarErrorWeb(errorDe('<h1>Hola</h1>\n<p>Chao'));

  assert.match(texto, /^Línea 2: La etiqueta <p> no se cerró/);
});

test('explicarErrorWeb muestra tal cual los mensajes propios de la app', () => {
  assert.equal(explicarErrorWeb({ nombre: 'TiempoAgotado', mensaje: 'Tardó mucho.' }), 'Tardó mucho.');
});

test('un error dentro de un clic se devuelve en español, con el selector', () => {
  const pagina =
    '<button id="alternar">Ir</button><script>' +
    'document.querySelector("#alternar").addEventListener("click", function () { noExiste.algo(); });' +
    '</script>';
  const resultado = evaluarWeb(pagina, [{ descripcion: 'un clic', condicion: 'clic("#alternar")' }]);

  assert.equal(resultado.error.nombre, 'ReferenceError');
  assert.match(resultado.error.mensaje, /^Al hacer clic en #alternar: /);
});

test('un error al escribir en un campo también se avisa', () => {
  const pagina =
    '<input id="nombre"><script>' +
    'document.querySelector("#nombre").addEventListener("input", function () { null.x; });</script>';
  const resultado = evaluarWeb(pagina, [{ descripcion: 'escribir', condicion: 'escribir("#nombre", "a")' }]);

  assert.match(resultado.error.mensaje, /^Al escribir en #nombre: /);
});

test('toggleAttribute pone, quita y obliga con su segundo argumento', () => {
  const pagina = '<p id="a">x</p>';
  todasAprueban(
    pagina,
    'uno("#a").toggleAttribute("hidden") === true && uno("#a").hidden === true',
    'uno("#a").toggleAttribute("hidden") === false && uno("#a").hidden === false',
    'uno("#a").toggleAttribute("hidden", true) === true && uno("#a").toggleAttribute("hidden", true) === true',
    'uno("#a").toggleAttribute("hidden", false) === false && uno("#a").hasAttribute("hidden") === false'
  );
});

// ---------- arreglos de la revisión de la fase 9 ----------

test('grid-column: 1/3 y 1 / 3 quedan iguales al normalizar', () => {
  const { normalizarValor } = globalThis.EstilosWeb;

  assert.equal(normalizarValor('1/3'), normalizarValor('1 / 3'));
  todasAprueban(conEstilo('h1 { grid-column: 1/3; }', '<h1>Hola</h1>'), 'estilo("h1", "grid-column") === "1/3"');
});

test('grid-gap cuenta como gap y aPixeles pasa 1rem a 16px', () => {
  todasAprueban(
    conEstilo('div { grid-gap: 10px; grid-row-gap: 4px; grid-column-gap: 6px; }', '<div></div>'),
    'estilo("div", "gap") === "10px"',
    'estilo("div", "row-gap") === "4px"',
    'estilo("div", "column-gap") === "6px"'
  );
  todasAprueban(conEstilo('div { gap: 1rem; }', '<div></div>'), 'aPixeles(estilo("div", "gap")) === 16');
});

test('cumpleMedia entiende la forma moderna (width >= N)', () => {
  const { cumpleMedia } = globalThis.EstilosWeb;

  assert.equal(cumpleMedia('(width >= 600px)', 600), true);
  assert.equal(cumpleMedia('(width >= 600px)', 599), false);
  assert.equal(cumpleMedia('(width <= 600px)', 600), true);
  assert.equal(cumpleMedia('(width > 600px)', 600), false);
  assert.equal(cumpleMedia('(width < 37.5em)', 500), true);
  assert.equal(cumpleMedia('screen and (width>=600px)', 700), true);
});

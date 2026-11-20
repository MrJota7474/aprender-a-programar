// Pruebas del resaltado de código y de la explicación de errores de Python.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/formato.js');
require('../js/resaltado.js');
require('../js/motores.js');
require('../js/trabajadores.js');
require('../js/motor-python.js');

const { resaltar, explicarErrorPython, Motores } = globalThis;

// ---------- resaltado ----------

test('resalta palabras clave, textos, números y comentarios en JavaScript', () => {
  const html = resaltar('let x = 5; // nota\nconsole.log("hola");', 'javascript');

  assert.match(html, /<span class="r-palabra">let<\/span>/);
  assert.match(html, /<span class="r-numero">5<\/span>/);
  assert.match(html, /<span class="r-comentario">\/\/ nota<\/span>/);
  assert.match(html, /<span class="r-cadena">&quot;hola&quot;<\/span>/);
});

test('resalta palabras clave, valores y comentarios en Python', () => {
  const html = resaltar('def f():\n    return True  # listo', 'python');

  assert.match(html, /<span class="r-palabra">def<\/span>/);
  assert.match(html, /<span class="r-palabra">return<\/span>/);
  assert.match(html, /<span class="r-valor">True<\/span>/);
  assert.match(html, /<span class="r-comentario"># listo<\/span>/);
});

test('un símbolo de comentario dentro de un texto no es un comentario', () => {
  const html = resaltar('x = "# no"', 'python');

  assert.doesNotMatch(html, /r-comentario/);
  assert.match(html, /<span class="r-cadena">&quot;# no&quot;<\/span>/);
});

test('una palabra clave dentro de otro nombre no se resalta', () => {
  const html = resaltar('formato = letra', 'javascript');

  assert.doesNotMatch(html, /r-palabra/);
});

test('escapa el HTML que escriba el estudiante', () => {
  const html = resaltar('x = "<img src=x onerror=alert(1)>" + <b>', 'python');

  assert.doesNotMatch(html, /<img|<b>/);
  assert.match(html, /&lt;img/);
});

test('al quitar las etiquetas queda exactamente el código original', () => {
  const codigo = 'for i in range(3):\n    print(f"{i} & <ok>")  # fin';
  const desescapar = (texto) =>
    texto
      .replace(/<\/?span[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');

  assert.equal(desescapar(resaltar(codigo, 'python')), codigo);
});

test('con un lenguaje desconocido solo escapa, sin colores', () => {
  assert.equal(resaltar('let <x>', 'cobol'), 'let &lt;x&gt;');
});

// ---------- motor de Python ----------

test('el motor de Python queda registrado con su contrato completo', () => {
  const motor = Motores.obtener('python');

  assert.equal(typeof motor.ejecutar, 'function');
  assert.equal(typeof motor.preparar, 'function');
  assert.equal(motor.lenguaje, 'python');
  assert.equal(motor.sangria, '    ');
});

test('explicarErrorPython traduce un nombre que no existe y dice la línea', () => {
  const texto = explicarErrorPython({
    nombre: 'NameError',
    mensaje: "name 'nombr' is not defined",
    linea: 3,
  });

  assert.match(texto, /Usaste "nombr"/);
  assert.match(texto, /línea 3/);
  assert.match(texto, /Mensaje original: NameError/);
});

test('explicarErrorPython explica la sangría y los errores de escritura', () => {
  const sangria = explicarErrorPython({ nombre: 'IndentationError', mensaje: 'expected an indented block', linea: 2 });
  const escritura = explicarErrorPython({ nombre: 'SyntaxError', mensaje: "expected ':'", linea: 1 });

  assert.match(sangria, /sangría/);
  assert.match(escritura, /dos puntos/);
});

test('explicarErrorPython muestra tal cual los mensajes propios de la app', () => {
  const texto = explicarErrorPython({ nombre: 'TiempoAgotado', mensaje: 'Tardó mucho.' });

  assert.equal(texto, 'Tardó mucho.');
});

test('explicarErrorPython no falla con un error desconocido y sin línea', () => {
  const texto = explicarErrorPython({ nombre: 'ValueError', mensaje: 'raro', linea: null });

  assert.match(texto, /Algo falló/);
  assert.doesNotMatch(texto, /línea/);
});

// ---------- resaltado de HTML y CSS ----------

test('resalta etiquetas, atributos, valores y comentarios en HTML', () => {
  const html = resaltar('<!-- nota -->\n<a href="pan.html" class=menu>Pan</a>', 'html');

  assert.match(html, /<span class="r-comentario">&lt;!-- nota --&gt;<\/span>/);
  assert.match(html, /&lt;<span class="r-palabra">a<\/span>/);
  assert.match(html, /<span class="r-valor">href<\/span>=<span class="r-cadena">&quot;pan.html&quot;<\/span>/);
  assert.match(html, /<span class="r-valor">class<\/span>=<span class="r-cadena">menu<\/span>/);
  assert.match(html, /&lt;\/<span class="r-palabra">a<\/span>&gt;/);
});

test('dentro de style resalta CSS y dentro de script resalta JavaScript', () => {
  const html = resaltar(
    '<style>\n/* fondo */ a:hover { color: #fff; margin: 10px; }\n</style>\n<script>let x = 5; // nota\n</script>',
    'html'
  );

  assert.match(html, /<span class="r-comentario">\/\* fondo \*\/<\/span>/);
  assert.match(html, /<span class="r-valor">color<\/span>: <span class="r-numero">#fff<\/span>/);
  assert.match(html, /<span class="r-numero">10px<\/span>/);
  // "a" antes de ":hover" es un selector, no una propiedad.
  assert.match(html, / a:hover \{/);
  assert.match(html, /<span class="r-palabra">let<\/span> x = <span class="r-numero">5<\/span>/);
  assert.match(html, /<span class="r-comentario">\/\/ nota<\/span>/);
});

test('el resaltado de HTML escapa todo y conserva el código original', () => {
  const codigo = '<p class="a">2 < 3 & "ok"</p>\n<style>p { color: red }</style>\n<script>if (a < b) { alert("<b>"); }</script>\n<h1>sin cerrar';
  const html = resaltar(codigo, 'html');
  const desescapar = (texto) =>
    texto
      .replace(/<\/?span[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');

  assert.doesNotMatch(html, /<(?!\/?span\b)/);
  assert.equal(desescapar(html), codigo);
});

// ---------- resaltado de la terminal ----------

test('resalta comandos, subcomandos de git, opciones, textos y comentarios en la terminal', () => {
  const html = resaltar('# guardar\ngit commit -m "Primer commit"\nls', 'terminal');

  assert.match(html, /<span class="r-comentario"># guardar<\/span>/);
  assert.match(html, /<span class="r-palabra">git<\/span> <span class="r-palabra">commit<\/span>/);
  assert.match(html, /<span class="r-valor">-m<\/span>/);
  assert.match(html, /<span class="r-cadena">&quot;Primer commit&quot;<\/span>/);
  assert.match(html, /<span class="r-palabra">ls<\/span>/);
});

test('en la terminal un # dentro de un texto o pegado a una palabra no es comentario', () => {
  const html = resaltar('echo "nota #1" > a#b.txt', 'terminal');

  assert.doesNotMatch(html, /r-comentario/);
  assert.match(html, /<span class="r-cadena">&quot;nota #1&quot;<\/span>/);
});

test('en la terminal un subcomando solo se colorea después de git, y un guion dentro de un nombre no es opción', () => {
  const html = resaltar('echo add\ngit switch -c nueva-portada', 'terminal');

  assert.match(html, /<span class="r-palabra">echo<\/span> add/);
  assert.match(html, /<span class="r-valor">-c<\/span> nueva-portada/);
});

test('el resaltado de la terminal escapa todo y conserva el código original', () => {
  const codigo = 'echo "<h1>Hola & chao</h1>" >> index.html # fin\ngit log --oneline';
  const html = resaltar(codigo, 'terminal');
  const desescapar = (texto) =>
    texto
      .replace(/<\/?span[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');

  assert.doesNotMatch(html, /<(?!\/?span\b)/);
  assert.equal(desescapar(html), codigo);
});

// ---------- los errores más comunes de quien empieza ----------
// Los mensajes son los que da de verdad el Python 3.14 de Pyodide (se
// sacaron corriendo cada código con el evaluador).

const ERRORES_COMUNES_PYTHON = [
  ['NameError', "name 'nombr' is not defined", /no existe.*Antes: print\(hola\)/],
  ['NameError', "name 'true' is not defined", /se escribe True/],
  ['IndentationError', "expected an indented block after 'if' statement on line 1", /4 espacios/],
  ['IndentationError', 'unexpected indent', /espacios de más/],
  ['IndentationError', 'unindent does not match any outer indentation level', /no coincide/],
  ['TabError', 'inconsistent use of tabs and spaces in indentation', /tabulaciones y espacios/],
  ['SyntaxError', "expected ':'", /dos puntos.*Antes: if edad > 18  →  Después: if edad > 18:/],
  ['SyntaxError', 'unterminated string literal (detected at line 1)', /comillas y no las cerraste/],
  ['SyntaxError', "'(' was never closed", /Abriste un "\(" y nunca lo cerraste: agrega el "\)"/],
  ['SyntaxError', "unmatched ')'", /Sobra un signo de cierre/],
  ['SyntaxError', 'invalid syntax. Perhaps you forgot a comma?', /falta una coma/],
  ['SyntaxError', "invalid syntax. Maybe you meant '==' or ':=' instead of '='?", /se usan dos: ==/],
  ['SyntaxError', "Missing parentheses in call to 'print'. Did you mean print(...)?", /print es una función/],
  ['TypeError', 'can only concatenate str (not "int") to str', /texto y un número.*str\(16\)/],
  ['TypeError', "unsupported operand type(s) for +: 'int' and 'str'", /int\("16"\)/],
  ['TypeError', "f() missing 1 required positional argument: 'b'", /falta b/],
  ['TypeError', 'f() takes 1 positional argument but 2 were given', /recibe 1 dato\(s\), pero le pasaste 2/],
  ['TypeError', "'int' object is not callable", /un número entero.*2 \* \(3 \+ 4\)/],
  ['TypeError', "'int' object is not iterable", /range\(5\)/],
  ['ZeroDivisionError', 'division by zero', /dividir entre cero/],
  ['IndexError', 'list index out of range', /desde 0.*frutas\[-1\]/],
  ['KeyError', "'correo'", /la clave "correo".*\.get\(/],
  ['AttributeError', "'list' object has no attribute 'push'", /en Python se usa append/],
  ['AttributeError', "'NoneType' object has no attribute 'append'", /valor vacío \(None\)/],
  ['ValueError', "invalid literal for int() with base 10: 'hola'", /el texto "hola".*no tiene forma de número/],
  ['ValueError', "invalid literal for int() with base 10: '3.5'", /int\(float\("3\.5"\)\)/],
  ['TypeError', 'can only concatenate str (not "NoneType") to str', /valor vacío \(None\)/],
  ['TypeError', 'can only concatenate list (not "int") to list', /numeros \+ \[4\].*append/],
  ['TypeError', 'can only concatenate str (not "list") to str', /join/],
  ['AttributeError', "module 'math' has no attribute 'raiz'", /El módulo math no tiene "raiz"/],
  ['ModuleNotFoundError', "No module named 'pandaz'", /"pandaz"/],
  ['RecursionError', 'maximum recursion depth exceeded', /caso base/],
];

test('explicarErrorPython explica los errores más comunes con qué pasó, la línea y cómo arreglarlo', () => {
  ERRORES_COMUNES_PYTHON.forEach(([nombre, mensaje, esperado]) => {
    const texto = explicarErrorPython({ nombre, mensaje, linea: 4 });
    assert.match(texto, /^En la línea 4: /, nombre + ': ' + mensaje);
    assert.match(texto, esperado, nombre + ': ' + mensaje);
    assert.match(texto, new RegExp('Mensaje original: ' + nombre));
    assert.doesNotMatch(texto, /Algo falló/, nombre + ': ' + mensaje);
  });
});

test('explicarErrorPython deja tal cual el aviso propio de input( )', () => {
  const mensaje = 'input() no funciona en este editor. Guarda el dato en una variable.';
  assert.match(explicarErrorPython({ nombre: 'RuntimeError', mensaje, linea: 1 }), /^En la línea 1: input\(\) no funciona/);
});

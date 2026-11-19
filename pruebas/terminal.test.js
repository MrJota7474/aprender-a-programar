// Pruebas de la terminal con Git simulado (terminal-evaluador.js) y de su motor.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/motores.js');
require('../js/terminal-evaluador.js');
require('../js/motor-terminal.js');

const { evaluarTerminal, explicarErrorTerminal, Motores } = globalThis;

const PASO = Object.freeze({ archivos: { 'index.html': '<h1>Hola</h1>' } });
const GUARDAR = 'git init\ngit add index.html\ngit commit -m "Primer commit"';

const correr = (codigo, paso = PASO) => evaluarTerminal(codigo, [], paso);
const errorDe = (codigo, paso = PASO) => correr(codigo, paso).error;

// Lo que mostró un comando (sin las líneas "$ comando").
const salidaSin = (resultado) => resultado.salida.filter((linea) => !linea.startsWith('$ '));

// Revisa condiciones sueltas sobre el estado final y devuelve cuáles aprobaron.
const aprobadas = (codigo, condiciones, paso = PASO) => {
  const resultado = evaluarTerminal(
    codigo,
    condiciones.map((condicion) => ({ descripcion: condicion, condicion })),
    paso
  );
  assert.equal(resultado.error, null);
  return resultado.resultados.map((r) => r.aprobada);
};

// ---------- comandos de archivos ----------

test('ls, cat y echo con > y >> trabajan sobre los archivos del paso', () => {
  const resultado = correr('ls\necho "Hola mundo" > notas.txt\necho otra línea >> notas.txt\ncat notas.txt\nls');

  assert.equal(resultado.error, null);
  assert.deepEqual(resultado.salida, [
    '$ ls',
    'index.html',
    '$ echo "Hola mundo" > notas.txt',
    '$ echo otra línea >> notas.txt',
    '$ cat notas.txt',
    'Hola mundo',
    'otra línea',
    '$ ls',
    'index.html  notas.txt',
  ]);
});

test('las líneas vacías y los comentarios se saltan, también un # al final', () => {
  const resultado = correr('# empiezo\n\n   ls   # ver archivos');

  assert.deepEqual(resultado.salida, ['$ ls   # ver archivos', 'index.html']);
});

test('cat de un archivo que no existe es un error', () => {
  assert.match(errorDe('cat nada.txt').mensaje, /No existe el archivo/);
});

test('un archivo no puede crecer sin límite (cat a >> a repetido)', () => {
  const duplicar = Array.from({ length: 20 }, () => 'cat index.html >> index.html').join('\n');

  assert.match(errorDe(duplicar).mensaje, /demasiado grande/);
});

// ---------- git init, status, add y commit ----------

test('git status cuenta lo que pasa en cada momento', () => {
  const resultado = correr('git init\ngit status\ngit add .\ngit status\ngit commit -m "Inicio"\ngit status');
  const texto = resultado.salida.join('\n');

  assert.equal(resultado.error, null);
  assert.match(texto, /Inicializado repositorio Git vacío/);
  assert.match(texto, /En la rama main\n\nNo hay commits todavía/);
  assert.match(texto, /Archivos sin seguimiento:[\s\S]*index\.html/);
  assert.match(texto, /Cambios a ser confirmados:\n\s+nuevo archivo:\s+index\.html/);
  assert.match(texto, /nada para hacer commit, el árbol de trabajo está limpio$/);
});

test('git status muestra los cambios sin preparar después de editar un archivo', () => {
  const resultado = correr(GUARDAR + '\necho "<p>más</p>" >> index.html\ngit status');

  assert.match(resultado.salida.join('\n'), /Cambios no rastreados para el commit:[\s\S]*modificado:\s+index\.html/);
});

test('git commit muestra la rama, el identificador, el mensaje y el resumen', () => {
  const resultado = correr(GUARDAR);
  const lineas = salidaSin(resultado);

  assert.match(lineas[1], /^\[main \(commit-raíz\) [0-9a-f]{7}\] Primer commit$/);
  assert.equal(lineas[2], ' 1 archivo cambiado, 1 inserción(+)');
  assert.equal(lineas[3], ' create mode 100644 index.html');
});

test('los identificadores de commit son siempre los mismos para los mismos comandos', () => {
  const uno = correr(GUARDAR + '\ngit log --oneline').salida;
  const otro = correr(GUARDAR + '\ngit log --oneline').salida;
  const distinto = correr('git init\ngit add .\ngit commit -m "Otro mensaje"\ngit log --oneline').salida;

  assert.deepEqual(uno, otro);
  assert.notEqual(uno[uno.length - 1].slice(0, 7), distinto[distinto.length - 1].slice(0, 7));
});

test('git commit -a prepara solo los archivos que Git ya conocía', () => {
  const codigo = GUARDAR + '\necho cambio >> index.html\necho nuevo > notas.txt\ngit commit -am "Cambio"';

  assert.deepEqual(aprobadas(codigo, ['estaGuardado("index.html")', '!estaGuardado("notas.txt")', 'commits().length === 2']), [
    true,
    true,
    true,
  ]);
});

test('git log --oneline y git log muestran la historia del más nuevo al más viejo', () => {
  const resultado = correr(GUARDAR + '\necho x >> index.html\ngit add .\ngit commit -m "Segundo"\ngit log --oneline\ngit log');
  const texto = resultado.salida.join('\n');

  assert.match(texto, /\$ git log --oneline\n[0-9a-f]{7} \(HEAD -> main\) Segundo\n[0-9a-f]{7} Primer commit/);
  assert.match(texto, /commit [0-9a-f]{7} \(HEAD -> main\)\nAutor: .+\n\n    Segundo\n\ncommit [0-9a-f]{7}\n/);
});

test('git diff muestra lo cambiado sin preparar y --staged lo ya preparado', () => {
  const resultado = correr(GUARDAR + '\necho "<p>nuevo</p>" >> index.html\ngit diff\ngit add .\ngit diff\ngit diff --staged');
  const texto = resultado.salida.join('\n');
  const bloque = 'diff --git a/index.html b/index.html\n--- a/index.html\n+++ b/index.html\n@@ -1,1 +1,2 @@\n <h1>Hola</h1>\n+<p>nuevo</p>';

  assert.ok(texto.includes('$ git diff\n' + bloque + '\n$ git add .\n$ git diff\n$ git diff --staged\n' + bloque));
});

test('git diff main muestra lo que la rama cambió frente a main (lo que vería un revisor)', () => {
  const codigo = GUARDAR + '\ngit switch -c portada\necho "<p>nuevo</p>" >> index.html\necho "hola" > notas.txt\ngit add .\ngit commit -m "Portada"\necho "suelto" > borrador.txt\ngit diff main';
  const resultado = correr(codigo);
  const despues = resultado.salida.slice(resultado.salida.indexOf('$ git diff main') + 1);

  assert.equal(resultado.error, null);
  assert.deepEqual(despues, [
    'diff --git a/index.html b/index.html',
    '--- a/index.html',
    '+++ b/index.html',
    '@@ -1,1 +1,2 @@',
    ' <h1>Hola</h1>',
    '+<p>nuevo</p>',
    'diff --git a/notas.txt b/notas.txt',
    'new file mode 100644',
    '--- /dev/null',
    '+++ b/notas.txt',
    '@@ -0,0 +1,1 @@',
    '+hola',
  ]);
  // Un archivo sin seguimiento (borrador.txt) no aparece, igual que en Git.
  assert.match(errorDe(GUARDAR + '\ngit diff no-existe').mensaje, /git diff main/);
  assert.match(errorDe(GUARDAR + '\ngit diff --staged main').mensaje, /no está disponible/);
});

// ---------- ramas y merge ----------

test('git branch crea ramas y las lista marcando la actual', () => {
  const resultado = correr(GUARDAR + '\ngit branch portada\ngit branch');

  assert.deepEqual(salidaSin(resultado).slice(-2), ['* main', '  portada']);
});

test('switch -c y checkout -b crean una rama y se pasan a ella', () => {
  const resultado = correr(GUARDAR + '\ngit switch -c portada\ngit checkout -b otra\ngit checkout main');

  assert.equal(resultado.error, null);
  assert.deepEqual(salidaSin(resultado).slice(-3), [
    "Cambiado a nueva rama 'portada'",
    "Cambiado a nueva rama 'otra'",
    "Cambiado a rama 'main'",
  ]);
});

test('al cambiar de rama la carpeta muestra los archivos de esa rama', () => {
  const codigo = GUARDAR + '\ngit switch -c notas\necho hola > notas.txt\ngit add .\ngit commit -m "Notas"\ngit switch main';

  assert.deepEqual(aprobadas(codigo, ['archivos().join() === "index.html"', 'ramaActual() === "main"']), [true, true]);
});

test('git merge con avance rápido trae los commits de la otra rama', () => {
  const codigo = GUARDAR + '\ngit switch -c notas\necho hola > notas.txt\ngit add .\ngit commit -m "Notas"\ngit switch main\ngit merge notas';
  const resultado = correr(codigo + '\ngit log --oneline');
  const texto = resultado.salida.join('\n');

  assert.match(texto, /Actualizando [0-9a-f]{7}\.\.[0-9a-f]{7}\nFast-forward\n 1 archivo cambiado/);
  assert.match(texto, /\(HEAD -> main, notas\) Notas/);
  assert.deepEqual(
    aprobadas(codigo, ['archivo("notas.txt") === "hola\\n"', 'commits().length === 2', 'limpio()']),
    [true, true, true]
  );
});

test('git merge de una rama ya incluida dice que está actualizado', () => {
  const resultado = correr(GUARDAR + '\ngit branch vieja\ngit merge vieja');

  assert.equal(resultado.salida[resultado.salida.length - 1], 'Ya está actualizado.');
});

test('git merge de ramas que avanzaron por separado crea un commit de fusión', () => {
  const codigo =
    GUARDAR +
    '\ngit switch -c notas\necho hola > notas.txt\ngit add .\ngit commit -m "Notas"' +
    '\ngit switch main\necho adios > fin.txt\ngit add .\ngit commit -m "Fin"\ngit merge notas';
  const resultado = correr(codigo);

  assert.equal(resultado.error, null);
  assert.ok(resultado.salida.includes("Merge hecho por la estrategia 'ort'."));
  assert.deepEqual(
    aprobadas(codigo, [
      'ultimoCommit().padres.length === 2',
      'ultimoCommit().mensaje === "Merge branch \'notas\'"',
      'archivos().join() === "fin.txt,index.html,notas.txt"',
    ]),
    [true, true, true]
  );
});

test('un conflicto en el merge se explica como error', () => {
  const codigo =
    GUARDAR +
    '\ngit switch -c otra\necho A > index.html\ngit commit -am "A"' +
    '\ngit switch main\necho B > index.html\ngit commit -am "B"\ngit merge otra';

  assert.match(errorDe(codigo).mensaje, /CONFLICTO en index\.html/);
});

// ---------- errores ----------

test('el primer error detiene los comandos siguientes y dice en qué línea fue', () => {
  const resultado = correr('git init\n# comentario\ngit comit -m "x"\nls');

  assert.deepEqual(resultado.salida, ['$ git init', 'Inicializado repositorio Git vacío en /proyecto/.git/', '$ git comit -m "x"']);
  assert.equal(resultado.error.linea, 3);
  assert.equal(resultado.error.comando, 'git comit -m "x"');
  assert.match(resultado.error.mensaje, /¿Quisiste decir git commit\?/);
  assert.deepEqual(resultado.resultados, []);
});

test('un comando desconocido sugiere el parecido', () => {
  assert.match(errorDe('gti status').mensaje, /No conozco el comando "gti". ¿Quisiste decir git\?/);
  assert.match(errorDe('python hola.py').mensaje, /puedes usar: git, pwd, ls, cd, mkdir/);
});

test('usar git antes de git init pide hacer git init', () => {
  assert.match(errorDe('git status').mensaje, /Escribe primero git init/);
});

test('commit sin nada preparado explica que falta git add', () => {
  assert.match(errorDe('git init\ngit commit -m "Nada"').mensaje, /git add/);
  assert.match(errorDe(GUARDAR + '\ngit commit -m "Otra vez"').mensaje, /nada en el área de preparación/);
});

test('el mensaje del commit no puede faltar, estar vacío ni ir sin comillas', () => {
  assert.match(errorDe('git init\ngit add .\ngit commit').mensaje, /Falta el mensaje/);
  assert.match(errorDe('git init\ngit add .\ngit commit -m').mensaje, /Falta el mensaje después de -m/);
  assert.match(errorDe('git init\ngit add .\ngit commit -m ""').mensaje, /está vacío/);
  assert.match(
    errorDe('git init\ngit add .\ngit commit -m Primer commit').mensaje,
    /va entre comillas, así: git commit -m "Primer commit"/
  );
  // Una sola palabra sin comillas sí la acepta Git.
  assert.equal(errorDe('git init\ngit add .\ngit commit -m Inicio'), null);
});

test('una comilla sin cerrar es un error, y las comillas curvas valen', () => {
  assert.match(errorDe('git init\ngit add .\ngit commit -m "Inicio').mensaje, /no la cerraste/);
  assert.equal(errorDe('git init\ngit add .\ngit commit -m “Inicio bonito”'), null);
});

test('git add de un archivo que no existe sugiere el nombre parecido', () => {
  assert.match(errorDe('git init\ngit add indx.html').mensaje, /No existe el archivo "indx.html".*¿Quisiste decir index\.html\?/);
  assert.match(errorDe('git init\ngit add').mensaje, /git add \./);
});

test('cambiar a una rama que no existe sugiere crearla', () => {
  assert.match(errorDe(GUARDAR + '\ngit switch nueva').mensaje, /No existe la rama "nueva".*git switch -c nueva/);
  assert.match(errorDe(GUARDAR + '\ngit checkout nueva').mensaje, /git checkout -b nueva/);
});

test('no deja cambiar de rama si se perderían cambios sin guardar', () => {
  const codigo = GUARDAR + '\ngit switch -c otra\necho cambio >> index.html\ngit commit -am "Cambio"\ngit switch main\necho mio >> index.html\ngit switch otra';

  assert.match(errorDe(codigo).mensaje, /cambios sin guardar en index\.html se perderían/);
});

test('crear ramas antes del primer commit, repetirlas o con nombres raros es un error', () => {
  assert.match(errorDe('git init\ngit branch otra').mensaje, /Todavía no hay commits/);
  assert.match(errorDe(GUARDAR + '\ngit branch main').mensaje, /Ya existe una rama llamada "main"/);
  assert.match(errorDe(GUARDAR + '\ngit switch -c "mi rama"').mensaje, /no es un nombre válido/);
});

test('git log sin commits y los comandos remotos explican el porqué', () => {
  assert.match(errorDe('git init\ngit log').mensaje, /todavía no tiene commits/);
  assert.match(errorDe(GUARDAR + '\ngit push').mensaje, /repositorio en internet/);
});

test('no se pueden encadenar comandos en una línea', () => {
  assert.match(errorDe('git add . && git commit -m "x"').mensaje, /un solo comando por línea/);
});

// ---------- ayudas para las pruebas ----------

test('las ayudas describen el estado final del repositorio', () => {
  const codigo = GUARDAR + '\ngit switch -c portada\necho "<p>x</p>" >> index.html\ngit add index.html';

  assert.deepEqual(
    aprobadas(codigo, [
      'hayRepo()',
      'ramaActual() === "portada"',
      'ramas().join() === "main,portada"',
      'commits("main").length === 1',
      'commits()[0].archivos["index.html"] === "<h1>Hola</h1>\\n"',
      'preparados().join() === "index.html"',
      'archivo("index.html").includes("<p>x</p>")',
      'archivo("nada") === null',
      '!estaGuardado("index.html")',
      '!limpio()',
      'comandos.length === 6 && /git add/.test(codigo)',
      'salida.some((l) => l.includes("Primer commit"))',
    ]),
    Array(12).fill(true)
  );
});

test('una respuesta correcta pasa con git add . o con el nombre y con cualquier mensaje', () => {
  const condiciones = ['commits().length === 1', 'estaGuardado("index.html")', 'limpio()'];

  assert.deepEqual(aprobadas(GUARDAR, condiciones), [true, true, true]);
  assert.deepEqual(aprobadas('git init\ngit add .\ngit commit -m "Guardo mi página"', condiciones), [true, true, true]);
  assert.deepEqual(aprobadas('git init\ngit add .', condiciones), [false, false, false]);
});

test('sin git init las ayudas responden sin explotar', () => {
  assert.deepEqual(aprobadas('ls', ['!hayRepo()', 'ramaActual() === null', 'commits().length === 0', '!limpio()']), [
    true,
    true,
    true,
    true,
  ]);
});

test('paso.preparacion deja listo el repositorio sin mostrar su salida', () => {
  const paso = { archivos: { 'index.html': 'hola' }, preparacion: GUARDAR };
  const resultado = evaluarTerminal('git log --oneline', [{ descripcion: 'x', condicion: 'commits().length === 1' }], paso);

  assert.equal(resultado.salida.length, 2);
  assert.match(resultado.salida[1], /^[0-9a-f]{7} \(HEAD -> main\) Primer commit$/);
  assert.equal(resultado.resultados[0].aprobada, true);
});

test('una preparación que falla es un error de la app, no del estudiante', () => {
  const resultado = correr('ls', { preparacion: 'git commit -m "x"' });

  assert.equal(resultado.error.nombre, 'ErrorInterno');
});

// ---------- el motor ----------

test('el motor terminal queda registrado y devuelve una promesa', async () => {
  const motor = Motores.obtener('terminal');

  assert.equal(motor.lenguaje, 'terminal');
  assert.equal(motor.nombreLenguaje, 'Terminal');
  assert.equal(motor.archivo, 'terminal');
  assert.equal(motor.sangria, '  ');
  const promesa = motor.ejecutar('git init', [], () => {}, PASO);
  assert.ok(promesa instanceof Promise);
  assert.equal((await promesa).error, null);
});

test('explicarErrorTerminal agrega la línea y el comando', () => {
  const texto = explicarErrorTerminal({ nombre: 'ErrorTerminal', mensaje: 'Algo pasó.', linea: 4, comando: 'git comit' });

  assert.equal(texto, 'Línea 4 (git comit): Algo pasó. Los comandos de después no se corrieron.');
  assert.match(explicarErrorTerminal({ nombre: 'ErrorInterno', mensaje: 'x' }), /falla de la app/);
});

// ---------- topes, borrar ramas y mensajes honestos ----------

test('una salida enorme se detiene con un error claro y no con RangeError', () => {
  const resultado = correr('echo hola > f\n' + 'cat f >> f\n'.repeat(11) + 'cat f f f f');

  assert.equal(resultado.error.nombre, 'ErrorTerminal');
  assert.match(resultado.error.mensaje, /demasiadas líneas/);
});

test('más de 500 comandos da un error claro (el tope de commits queda como red de seguridad)', () => {
  assert.match(errorDe('echo a\n'.repeat(501)).mensaje, /más de 500 comandos/);
});

test('git merge se niega si hay cambios preparados', () => {
  const codigo =
    GUARDAR +
    '\ngit switch -c otra\necho A > a.txt\ngit add .\ngit commit -m "A"' +
    '\ngit switch main\necho B > b.txt\ngit add .\ngit commit -m "B"' +
    '\necho C > c.txt\ngit add c.txt\ngit merge otra';

  assert.match(errorDe(codigo).mensaje, /cambios preparados/);
});

test('el conflicto del merge no afirma que cambiaron lo mismo y avisa del límite', () => {
  const codigo =
    GUARDAR +
    '\ngit switch -c otra\necho A > index.html\ngit commit -am "A"' +
    '\ngit switch main\necho B > index.html\ngit commit -am "B"\ngit merge otra';

  assert.match(errorDe(codigo).mensaje, /líneas distintas.*todavía no lo hace/);
});

test('git branch -d borra una rama fusionada y rechaza la actual o las no fusionadas', () => {
  const nueva = GUARDAR + '\ngit switch -c otra\necho A > a.txt\ngit add .\ngit commit -m "A"\ngit switch main';

  assert.deepEqual(salidaSin(correr(nueva + '\ngit merge otra\ngit branch -d otra\ngit branch')).slice(-1), ['* main']);
  assert.match(errorDe(nueva + '\ngit branch -d otra').mensaje, /no está fusionada/);
  assert.match(errorDe(nueva + '\ngit branch -d main').mensaje, /en la que estás/);
  assert.match(errorDe(nueva + '\ngit branch -d nada').mensaje, /No existe la rama/);
  assert.match(errorDe(nueva + '\ngit branch -x').mensaje, /no está disponible/);
});

test('git checkout de un archivo y git diff de un archivo dan mensajes honestos', () => {
  assert.match(errorDe(GUARDAR + '\ngit checkout index.html').mensaje, /Restaurar archivos.*no está disponible/);
  assert.match(errorDe(GUARDAR + '\ngit diff index.html').mensaje, /no está disponible/);
});

test('git diff --staged de un archivo vacío no muestra el encabezado @@', () => {
  const resultado = correr('git init\ntouch vacio.txt\ngit add vacio.txt\ngit diff --staged');

  assert.equal(resultado.error, null);
  assert.ok(!resultado.salida.some((l) => l.startsWith('@@')));
});

// ---------- carpetas: pwd, mkdir y cd ----------

test('pwd, mkdir y cd: crear una carpeta, entrar, escribir en ella y volver', () => {
  const resultado = correr('pwd\nmkdir datos\nls\ncd datos\npwd\necho "id,nombre" > clientes.csv\nls\ncd ..\nls datos\ncat datos/clientes.csv');

  assert.equal(resultado.error, null);
  assert.deepEqual(salidaSin(resultado), [
    '/proyecto',
    'datos/  index.html',
    '/proyecto/datos',
    'clientes.csv',
    'clientes.csv',
    'id,nombre',
  ]);
});

test('las pruebas ven las carpetas, la carpeta actual y los archivos con su ruta', () => {
  const codigo = 'mkdir datos respaldos\ncd respaldos\ntouch copia.sql';
  const condiciones = [
    'JSON.stringify(carpetas()) === \'["datos","respaldos"]\'',
    'carpetaActual() === "/proyecto/respaldos"',
    'archivos().includes("respaldos/copia.sql")',
    'archivo("respaldos/copia.sql") === ""',
  ];

  assert.deepEqual(aprobadas(codigo, condiciones), [true, true, true, true]);
});

test('cd acepta rutas con .. y /proyecto, y cd solo vuelve al proyecto', () => {
  const resultado = correr('mkdir a\nmkdir a/b\ncd a/b\npwd\ncd ../..\npwd\ncd /proyecto/a\npwd\ncd\npwd');

  assert.deepEqual(salidaSin(resultado), ['/proyecto/a/b', '/proyecto', '/proyecto/a', '/proyecto']);
});

test('los errores de carpetas se parecen a los de Bash', () => {
  assert.match(errorDe('cd nada').mensaje, /cd: nada: No existe el archivo o el directorio/);
  assert.match(errorDe('cd index.html').mensaje, /No es un directorio/);
  assert.match(errorDe('cd ..').mensaje, /No puedes salir de \/proyecto/);
  assert.match(errorDe('cd /etc').mensaje, /solo existe la carpeta del proyecto/);
  assert.match(errorDe('mkdir datos\nmkdir datos').mensaje, /El archivo ya existe/);
  assert.match(errorDe('mkdir a/b').mensaje, /No existe el archivo o el directorio/);
  assert.match(errorDe('echo hola > nada/a.txt').mensaje, /No existe el archivo o el directorio/);
  assert.match(errorDe('mkdir datos\ncat datos').mensaje, /Es un directorio/);
  assert.match(errorDe('mkdir datos\nrm datos').mensaje, /Es un directorio/);
});

test('git se usa desde la carpeta del proyecto y guarda los archivos de las subcarpetas', () => {
  assert.match(errorDe('git init\nmkdir datos\ncd datos\ngit status').mensaje, /git se usa desde \/proyecto/);

  const codigo = 'git init\nmkdir datos\necho x > datos/a.txt\ngit add .\ngit commit -m "Datos"\ngit switch -c otra\ncd datos\npwd';
  const condiciones = ['estaGuardado("datos/a.txt")', 'carpetaActual() === "/proyecto/datos"', 'carpetas().length === 1'];

  assert.deepEqual(aprobadas(codigo, condiciones), [true, true, true]);
});

test('un archivo del paso dentro de una carpeta crea esa carpeta', () => {
  const resultado = correr('ls\nls datos', { archivos: { 'datos/tienda.sql': 'SELECT 1;' } });

  assert.deepEqual(salidaSin(resultado), ['datos/', 'tienda.sql']);
});

test('git add con una carpeta prepara todos sus archivos, con o sin barra final', () => {
  const crear = 'git init\nmkdir datos\necho a > datos/a.txt\necho b > datos/b.txt\necho c > otro.txt\n';
  const condiciones = ['preparados().includes("datos/a.txt")', 'preparados().includes("datos/b.txt")', '!preparados().includes("otro.txt")'];

  assert.deepEqual(aprobadas(crear + 'git add datos', condiciones), [true, true, true]);
  assert.deepEqual(aprobadas(crear + 'git add datos/', condiciones), [true, true, true]);
});

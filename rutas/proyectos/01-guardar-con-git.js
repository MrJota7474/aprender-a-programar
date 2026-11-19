// Ruta "Proyectos", lección 1: guardar el trabajo con Git. Todos los pasos
// usan el motor "terminal" (un Git simulado, ver js/terminal-evaluador.js):
// el estudiante escribe comandos, uno por línea, y las "condicion" son
// JavaScript con ayudas como commits(), estaGuardado(nombre) o limpio(),
// explicadas al comienzo de ese archivo.
//
// paso.archivos es la carpeta del proyecto al empezar y paso.preparacion son
// comandos que corren antes, en silencio, para que el paso arranque con el
// repositorio del paso anterior ya hecho.
//
// Las pruebas miran el ESTADO final y no el texto: aprueban con cualquier
// mensaje de commit y tanto con "git add ." como con el nombre del archivo.
//
// Va dentro de una función: en la página todas las lecciones son scripts
// clásicos que comparten el ámbito global, y dos "const" con el mismo nombre
// en archivos distintos romperían la página.

(function () {
  'use strict';

  const PAGINA_DON_PEPE = ['<h1>Tienda de Don Pepe</h1>', '<p>Arepas, tinto y buñuelos</p>'].join('\n');
  const PRECIOS_DON_PEPE = ['Arepa de queso: 3500', 'Tinto: 2000', 'Buñuelo: 1500'].join('\n');
  const PRIMER_COMMIT = 'git init\ngit add .\ngit commit -m "Primera versión de la página"';

  globalThis.Rutas.agregarLeccion('proyectos', {
    id: 'guardar-con-git',
    titulo: 'Guardar tu trabajo con Git',
    pasos: [
      {
        id: 'primer-repositorio',
        etiqueta: 'Tu primer repositorio',
        motor: 'terminal',
        titulo: 'Git: la memoria de tu proyecto',
        texto: [
          'Antes de seguir con la tienda de Don Pepe, una herramienta que usa todo el que programa: **Git**. Git guarda **fotos** de tu proyecto cada vez que tú se lo pides. Con esas fotos tienes un **historial** de todo lo que cambiaste, puedes **volver atrás** si dañas algo y puedes **trabajar en equipo** sin pisar el trabajo de otros. Sitios como **GitHub** guardan esas fotos en internet para compartirlas.',
          'Aquí vas a usar una **terminal simulada**: imita a Git real, con los mismos comandos y casi los mismos mensajes, pero todo pasa dentro de esta página. Por eso aquí no se sube nada a internet; lo que aprendas sí te sirve igual en tu computador.',
          'Se escribe **un comando por línea**. Las líneas que empiezan con `#` son comentarios. La carpeta del proyecto ya tiene la página `index.html` de la tienda: el comando `ls` muestra los archivos y `cat index.html` muestra lo que tiene uno.',
          'Tu tarea: convierte la carpeta en un **repositorio** (la carpeta que Git vigila) con `git init`, y después pregúntale a Git cómo va todo con `git status`. Fíjate que dice que `index.html` está **sin seguimiento**: Git lo ve, pero todavía no lo ha guardado.',
        ],
        archivos: { 'index.html': PAGINA_DON_PEPE },
        codigo: ['# Escribe tus comandos aquí, uno por línea', 'ls', ''].join('\n'),
        pruebas: [
          { descripcion: 'La carpeta ya es un repositorio de Git (git init)', condicion: 'hayRepo()' },
          { descripcion: 'Le preguntaste a Git cómo va todo (git status)', condicion: 'comandos.some((c) => /^git status\\b/.test(c))' },
        ],
        pistas: [
          'Escribe `git init` en una línea nueva.',
          'Debajo, en otra línea, escribe `git status`.',
        ],
        solucion: ['ls', 'git init', 'git status'].join('\n'),
      },
      {
        id: 'preparar-y-guardar',
        etiqueta: 'Preparar y guardar',
        motor: 'terminal',
        titulo: 'Preparar y hacer el primer commit',
        texto: [
          'Guardar en Git tiene **dos pasos**. Primero **preparas** lo que quieres guardar con `git add`: es como poner las cosas en la mesa antes de tomar la foto. Luego tomas la foto con `git commit`. Cada foto se llama **commit**.',
          '`git add index.html` prepara un archivo; `git add .` (con punto) prepara **todo** lo que cambió en la carpeta. El commit lleva un mensaje entre comillas que cuenta qué hiciste: `git commit -m "Página inicial de la tienda"`. Escribe mensajes claros: tu yo del futuro (y tu equipo) los va a leer.',
          'Ya está hecho el `git init`. La carpeta tiene la página `index.html` y la lista `precios.txt` de Don Pepe. Tu tarea: prepara **los dos archivos** y guárdalos en un commit. Al final, `git status` debe decir que no hay nada para hacer commit.',
        ],
        archivos: { 'index.html': PAGINA_DON_PEPE, 'precios.txt': PRECIOS_DON_PEPE },
        preparacion: 'git init',
        codigo: ['# Ya se hizo git init. Mira cómo está todo:', 'git status', ''].join('\n'),
        pruebas: [
          { descripcion: 'Hay al menos un commit', condicion: 'commits().length >= 1' },
          { descripcion: 'index.html quedó guardado', condicion: 'estaGuardado("index.html")' },
          { descripcion: 'precios.txt quedó guardado', condicion: 'estaGuardado("precios.txt")' },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Primero prepara: `git add index.html` y `git add precios.txt`, o los dos de una vez con `git add .`',
          'Después guarda con un mensaje entre comillas: `git commit -m "Página y precios de la tienda"`',
          'Si Git dice que no hay nada en el área de preparación, te faltó el `git add` antes del commit.',
        ],
        solucion: ['git status', 'git add .', 'git commit -m "Página y precios de la tienda"', 'git status'].join('\n'),
      },
      {
        id: 'la-historia',
        etiqueta: 'La historia',
        motor: 'terminal',
        titulo: 'Cambiar, comparar y ver la historia',
        texto: [
          'Ahora el proyecto ya tiene un commit. Don Pepe quiere que la página diga su **horario**. Para agregar una línea al final de un archivo se usa `echo` con `>>` (dos signos de mayor): `echo "<p>Abierto de 6 a. m. a 8 p. m.</p>" >> index.html`. Con un solo `>` se **reemplazaría** todo el archivo, ¡cuidado!',
          'Antes de guardar, `git diff` te muestra qué cambió: las líneas con `+` son nuevas y las que tienen `-` se quitaron. Es la mejor forma de revisar tu trabajo antes del commit.',
          'Tu tarea: agrega el horario (una línea que diga **Abierto**) al final de `index.html`, revisa con `git diff`, guarda el cambio en un **segundo commit** y mira la historia con `git log --oneline`. Cada commit tiene un código corto (como `a1b2c3d`) que lo identifica: con él, en Git real, puedes volver a esa versión.',
        ],
        archivos: { 'index.html': PAGINA_DON_PEPE },
        preparacion: PRIMER_COMMIT,
        codigo: ['# Ya hay un commit. Mira la historia:', 'git log --oneline', ''].join('\n'),
        pruebas: [
          { descripcion: 'La página dice el horario (una línea con "Abierto")', condicion: '/abierto/i.test(archivo("index.html"))' },
          { descripcion: 'El título de la tienda sigue ahí (usaste >>, no >)', condicion: 'archivo("index.html").includes("Tienda de Don Pepe")' },
          { descripcion: 'Hay al menos dos commits y el último guarda el horario', condicion: 'commits().length >= 2 && /abierto/i.test(ultimoCommit().archivos["index.html"])' },
          { descripcion: 'Revisaste la historia con git log', condicion: 'comandos.some((c) => /^git log\\b/.test(c))' },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Agrega la línea con: `echo "<p>Abierto de 6 a. m. a 8 p. m.</p>" >> index.html` y mira el cambio con `git diff`.',
          'Luego lo mismo de antes: `git add index.html` (o `git add .`) y `git commit -m "Agrega el horario"`.',
          'Termina con `git log --oneline`: deben aparecer dos commits, el más nuevo arriba.',
        ],
        solucion: [
          'echo "<p>Abierto de 6 a. m. a 8 p. m.</p>" >> index.html',
          'git diff',
          'git add index.html',
          'git commit -m "Agrega el horario"',
          'git log --oneline',
        ].join('\n'),
      },
      {
        id: 'una-rama',
        etiqueta: 'Una rama',
        motor: 'terminal',
        titulo: 'Reto: probar una idea en una rama',
        texto: [
          'Don Pepe está pensando en hacer **domicilios**, pero no está seguro. Una **rama** es una línea de trabajo aparte: ahí puedes probar una idea sin tocar la versión buena, que vive en la rama `main`. Así trabajan los equipos: cada persona en su rama y, cuando algo está listo, se junta con `main`.',
          'Los comandos: `git switch -c domicilios` crea la rama y se pasa a ella; `git switch main` vuelve a `main`; `git branch` lista las ramas (la actual lleva `*`); y estando en `main`, `git merge domicilios` trae a `main` los commits de la otra rama.',
          'Tu reto: crea la rama `domicilios`, agrega a `index.html` una línea que hable de domicilios, guárdala en un commit **en esa rama**, vuelve a `main` y trae el cambio con `git merge`. Fíjate en lo que muestra `ls` o `cat index.html` justo después de volver a `main`, antes del merge: el cambio todavía no está ahí.',
        ],
        archivos: { 'index.html': PAGINA_DON_PEPE },
        preparacion: PRIMER_COMMIT,
        codigo: ['# Mira qué ramas hay:', 'git branch', ''].join('\n'),
        pruebas: [
          { descripcion: 'Creaste una rama además de main', condicion: 'ramas().some((rama) => rama !== "main") || comandos.some((c) => /^git (switch -c|checkout -b|branch [^-])/.test(c))' },
          {
            descripcion: 'En esa rama hay un commit que habla de domicilios',
            // Si la rama ya se borró con git branch -d, su commit sigue en la historia de main.
            condicion: 'ramas().some((rama) => rama !== "main" && /domicilio/i.test((ultimoCommit(rama) || { archivos: {} }).archivos["index.html"] || "")) || (!ramas().some((rama) => rama !== "main") && commits("main").length >= 2 && commits("main").some((c) => /domicilio/i.test(c.archivos["index.html"] || "")))',
          },
          { descripcion: 'Terminaste de vuelta en main', condicion: 'ramaActual() === "main"' },
          { descripcion: 'main ya tiene los domicilios (hiciste git merge)', condicion:
              // Con la rama aún viva, su último commit debe estar en la historia de main. Si la borraron
              // (git branch -d), ya estaba fusionada: main tiene un commit de fusión o un commit de la
              // rama con los domicilios, no solo la línea copiada a mano.
              '/domicilio/i.test(ultimoCommit("main").archivos["index.html"]) && (ramas().some((rama) => rama !== "main" && commits("main").some((c) => c.id === ultimoCommit(rama).id)) || (!ramas().some((rama) => rama !== "main") && commits("main").some((c) => c.padres.length > 1 || /domicilio/i.test(c.mensaje))))',
          },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Empieza con `git switch -c domicilios` y agrega la línea: `echo "<p>Ahora con domicilios</p>" >> index.html`',
          'Guarda en la rama: `git add .` y `git commit -m "Agrega domicilios"`.',
          'Vuelve con `git switch main` y junta los cambios con `git merge domicilios`.',
        ],
        solucion: [
          'git switch -c domicilios',
          'echo "<p>Ahora con domicilios</p>" >> index.html',
          'git add .',
          'git commit -m "Agrega domicilios"',
          'git switch main',
          'cat index.html',
          'git merge domicilios',
          'git log --oneline',
        ].join('\n'),
      },
    ],
  });
})();

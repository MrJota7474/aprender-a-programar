// Ruta "El oficio", lección 8: Git en equipo (ramas, pull requests y revisión).
//
// Todos los pasos usan el motor "terminal" (el Git simulado de
// js/terminal-evaluador.js). paso.preparacion corre en silencio antes que
// los comandos del estudiante: aquí la usamos para fingir el trabajo del
// resto del equipo (commits de otras personas que ya llegaron a main).
//
// Las pruebas miran el ESTADO final (ramas, commits, archivos) y no el texto,
// así aprueban igual con otro nombre de rama o con "git add ." en vez del
// nombre del archivo. La lección de Proyectos "Guardar tu trabajo con Git"
// enseña lo básico; esta se concentra en cómo se trabaja con otras personas.

(function () {
  'use strict';

  const PAGINA = ['<h1>Tienda de Don Pepe</h1>', '<p>Arepas, tinto y buñuelos</p>'].join('\n');
  const PRECIOS = ['Arepa de queso: 3500', 'Tinto: 2000', 'Buñuelo: 1500'].join('\n');
  const ARCHIVOS = { 'index.html': PAGINA, 'precios.txt': PRECIOS };
  const PRIMER_COMMIT = ['git init', 'git add .', 'git commit -m "Página inicial de la tienda"'];

  // Con comillas simples: en una terminal real, dentro de comillas dobles el
  // "$5" se reemplazaría por una variable vacía. Mejor enseñar la costumbre buena.
  const LINEA_COSTO = "echo '<p>Domicilio: $5.000</p>' >> index.html";

  // El equipo ya trabajó así: una rama, un commit, merge a main y se borra la rama.
  const HISTORIA_DEL_EQUIPO = [
    ...PRIMER_COMMIT,
    'git switch -c horario',
    'echo "<p>Abierto de 6 a. m. a 8 p. m.</p>" >> index.html',
    'git commit -am "Agrega el horario de atención"',
    'git switch main',
    'git merge horario',
    'git branch -d horario',
  ].join('\n');

  // Reto: tu rama "domicilios" ya existe con un commit, y mientras tanto una
  // compañera agregó el pandebono a main. Terminas parado en tu rama.
  const RAMA_CON_REVISION = [
    ...PRIMER_COMMIT,
    'git switch -c domicilios',
    'echo "<p>Ahora hacemos domicilios</p>" >> index.html',
    'git commit -am "Agrega el aviso de domicilios"',
    'git switch main',
    'echo "Pandebono: 2500" >> precios.txt',
    'git commit -am "Agrega el pandebono a los precios"',
    'git switch domicilios',
  ].join('\n');

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'git-en-equipo',
    titulo: 'Git en equipo: ramas, pull requests y revisión',
    pasos: [
      {
        id: 'idea',
        motor: 'terminal',
        titulo: 'Cómo trabaja un equipo con Git',
        texto: [
          'Solo, Git es tu memoria. En un equipo es además la forma de **no pisarse**. Casi todas las empresas trabajan con el mismo flujo. **1.** La rama `main` siempre funciona: es lo que está publicado, y nadie trabaja directamente en ella. **2.** Cada tarea va en **su propia rama**, con un nombre que diga qué es: `arreglo/precio-tinto`, `domicilios`. **3.** En la rama haces **commits pequeños** con mensajes claros.',
          '**4.** Subes tu rama a GitHub (`git push`) y abres un **pull request** (PR): una petición de "por favor, junten mi rama con `main`". Lleva un título y una descripción: qué cambiaste, por qué y cómo se prueba. **5.** Una compañera hace la **revisión de código**: lee tus cambios línea por línea y comenta. Si pide cambios, haces más commits **en la misma rama** y el PR se actualiza solo. **6.** Cuando lo aprueban, se fusiona con `main` y se borra la rama.',
          'La revisión no es un examen ni algo personal: es la forma en que un equipo atrapa errores y aprende. Tú también vas a revisar el código de otros. Este simulador no tiene internet (no hay `push` ni GitHub), pero todo lo demás funciona igual. Ejecuta y mira la historia: el equipo ya trabajó así una vez (rama `horario`, merge y rama borrada).',
        ],
        archivos: ARCHIVOS,
        preparacion: HISTORIA_DEL_EQUIPO,
        codigo: ['# La historia del proyecto, la más nueva arriba', 'git log --oneline', '', '# Las ramas que existen (en la que estás lleva *)', 'git branch', '', 'git status'].join('\n'),
      },
      {
        id: 'practica',
        motor: 'terminal',
        titulo: 'Tu tarea, en tu propia rama',
        texto: [
          'Te asignan el ticket **TIENDA-120**: *"El tinto subió: ahora cuesta 2500"*. El cambio es en `precios.txt` (míralo con `cat precios.txt`).',
          '**1.** Crea una rama para la tarea, por ejemplo `git switch -c arreglo/precio-tinto`. **2.** Cambia el precio. Esta terminal no tiene editor, así que reescribe el archivo con `echo`: el primer renglón con `>` (reemplaza todo el archivo) y los siguientes con `>>` (agregan al final). Los otros dos precios deben quedar igual. **3.** Guarda el cambio en un commit **en tu rama**.',
          '**4.** Antes de pedir la revisión, mira lo que va a ver tu compañera: `git diff main` muestra la diferencia entre `main` y tu carpeta. Debe ser una sola línea cambiada; si aparece algo más, algo se coló. Quédate en tu rama: el merge lo hace el equipo cuando aprueben el PR.',
        ],
        archivos: ARCHIVOS,
        preparacion: PRIMER_COMMIT.join('\n'),
        codigo: ['cat precios.txt', ''].join('\n'),
        pruebas: [
          { descripcion: 'Estás en una rama de trabajo, no en main', condicion: 'ramaActual() !== "main" && ramas().includes(ramaActual())' },
          {
            descripcion: 'El último commit de tu rama tiene el tinto a 2500 y los demás precios igual',
            condicion: '(() => { const p = (ultimoCommit() || { archivos: {} }).archivos["precios.txt"] || ""; return /Tinto: 2500/.test(p) && !/Tinto: 2000/.test(p) && /Arepa de queso: 3500/.test(p) && /Buñuelo: 1500/.test(p); })()',
          },
          { descripcion: 'main no se tocó (sigue con un solo commit)', condicion: 'commits("main").length === 1 && /Tinto: 2000/.test(ultimoCommit("main").archivos["precios.txt"])' },
          { descripcion: 'Revisaste lo que verá el revisor (git diff main)', condicion: 'comandos.some((c) => /^git diff main\\s*$/.test(c))' },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Empieza con `git switch -c arreglo/precio-tinto`. Luego: `echo "Arepa de queso: 3500" > precios.txt` (con un solo `>`).',
          'Sigue con `echo "Tinto: 2500" >> precios.txt` y `echo "Buñuelo: 1500" >> precios.txt` (con `>>`). Revisa con `cat precios.txt`.',
          'Guarda: `git add precios.txt` y `git commit -m "TIENDA-120: sube el tinto a 2500"`. Termina con `git diff main`.',
        ],
        solucion: [
          'cat precios.txt',
          'git switch -c arreglo/precio-tinto',
          'echo "Arepa de queso: 3500" > precios.txt',
          'echo "Tinto: 2500" >> precios.txt',
          'echo "Buñuelo: 1500" >> precios.txt',
          'git add precios.txt',
          'git commit -m "TIENDA-120: sube el tinto a 2500"',
          'git diff main',
        ].join('\n'),
      },
      {
        id: 'reto',
        motor: 'terminal',
        titulo: 'Reto: atender la revisión y fusionar',
        texto: [
          'Abriste un PR con tu rama `domicilios` (ya estás en ella). Laura lo revisó y comentó: *"Bien, pero falta el costo. Agrega una línea que diga **Domicilio: $5.000** en index.html."* Y mientras tanto, otra compañera fusionó en `main` el precio del pandebono: tu rama se quedó atrás.',
          '**1.** Atiende la revisión: agrega la línea y haz un commit **en tu rama**. **2.** Trae lo nuevo de `main` a tu rama con `git merge main`. Se hace antes de fusionar para comprobar que tu cambio funciona junto con lo de los demás: si algo choca, se arregla en tu rama, nunca en `main`. **3.** Mira el PR final con `git diff main`: deben aparecer solo tus cambios, no el pandebono.',
          '**4.** Laura aprueba. Fusiona: pásate a `main`, trae tu rama con `git merge domicilios` y borra la rama ya fusionada con `git branch -d domicilios`. En GitHub, el botón "Merge" del PR hace estos pasos por ti.',
        ],
        archivos: ARCHIVOS,
        preparacion: RAMA_CON_REVISION,
        codigo: ['# Estás en tu rama. Mira cómo va todo:', 'git log --oneline', 'git log --oneline main', ''].join('\n'),
        pruebas: [
          {
            descripcion: 'Atendiste la revisión con un commit en la rama (Domicilio: $5.000)',
            // Un commit normal (un solo padre) que agrega el costo: no vale que llegue solo por un merge.
            condicion: 'commits("main").some((c) => c.padres.length === 1 && /\\$5\\.000/.test(c.archivos["index.html"] || "") && !/\\$5\\.000/.test((commits("main").find((p) => p.id === c.padres[0]) || { archivos: {} }).archivos["index.html"] || ""))',
          },
          { descripcion: 'Trajiste main a tu rama antes de fusionar (git merge main)', condicion: 'commits("main").some((c) => c.mensaje === "Merge branch \'main\'")' },
          { descripcion: 'Revisaste el PR final con git diff main', condicion: 'comandos.some((c) => /^git diff main\\s*$/.test(c))' },
          {
            descripcion: 'main tiene todo: los domicilios, su costo y el pandebono',
            condicion: '/domicilios/.test(ultimoCommit("main").archivos["index.html"]) && /\\$5\\.000/.test(ultimoCommit("main").archivos["index.html"]) && /Pandebono: 2500/.test(ultimoCommit("main").archivos["precios.txt"])',
          },
          { descripcion: 'Terminaste en main, con la rama domicilios borrada', condicion: 'ramaActual() === "main" && !ramas().includes("domicilios")' },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Primero el cambio que pidió Laura, con comillas **simples**: `' + LINEA_COSTO + '`. En una terminal real, dentro de comillas dobles el `$5` se tomaría como una variable y desaparecería. Luego `git add .` y `git commit -m "Agrega el costo del domicilio"`.',
          'Sin salir de tu rama: `git merge main`. Después `git diff main` debe mostrar solo los cambios de `index.html`.',
          'Para fusionar: `git switch main`, `git merge domicilios` y `git branch -d domicilios`.',
        ],
        solucion: [
          'git log --oneline',
          LINEA_COSTO,
          'git add .',
          'git commit -m "Agrega el costo del domicilio (revisión de Laura)"',
          'git merge main',
          'git diff main',
          'git switch main',
          'git merge domicilios',
          'git branch -d domicilios',
          'git log --oneline',
        ].join('\n'),
      },
    ],
  });
})();

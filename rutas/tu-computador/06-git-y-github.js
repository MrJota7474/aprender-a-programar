// Ruta "Programar en tu computador", lección 6: Git y GitHub de verdad.
//
// La idea y la práctica usan el motor "terminal" (Git simulado de
// js/terminal-evaluador.js). El simulador no tiene internet (no hay
// git config, remote ni push) y no lee .gitignore, así que esos pasos van en
// la Idea como "Hazlo en tu computador" y la práctica agrega los archivos por
// nombre. El reto es Python: revisar qué se subiría por error.
(function () {
  'use strict';

  const ARCHIVOS = {
    'index.html': '<h1>Mi portafolio</h1>',
    'estilos.css': 'h1 { color: navy; }',
    // Una clave de mentira: es justo lo que NUNCA debe llegar a GitHub.
    '.env': 'CLAVE_API=clave-de-ejemplo-no-es-real',
  };

  // La regla para saber si .gitignore tapa una ruta, simplificada: una línea
  // "carpeta/" tapa todo lo que está dentro, y una línea "nombre" tapa ese
  // archivo en cualquier carpeta. El Git real entiende más (comodines como *).
  const IGNORADO = [
    'def ignorado(ruta, gitignore):',
    '    reglas = [l.strip() for l in gitignore.splitlines() if l.strip() and not l.strip().startswith("#")]',
    '    nombre = ruta.split("/")[-1]',
    '    for regla in reglas:',
    '        if regla.endswith("/") and ruta.startswith(regla):',
    '            return True',
    '        if regla == nombre or regla == ruta:',
    '            return True',
    '    return False',
  ];

  const DATOS = [
    'ARCHIVOS = ["index.html", "app.py", ".env", ".venv/Scripts/python.exe", "node_modules/express/index.js", "README.md"]',
    'GITIGNORE = """',
    '# Lo que no se sube',
    'node_modules/',
    '"""',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'git-y-github',
    titulo: 'Git y GitHub de verdad',
    pasos: [
      {
        id: 'idea',
        motor: 'terminal',
        titulo: 'De tu carpeta a GitHub',
        texto: [
          '**Hazlo en tu computador: Git.** 1. Descarga **Git for Windows** de **git-scm.com** e instálalo; las opciones que trae sirven. Trae Git Bash y el administrador de credenciales. 2. Dile a Git quién eres, una sola vez por computador: `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo.com"`. Ese nombre y correo quedan en cada commit. 3. En la carpeta del proyecto: `git init`, `git add .` y `git commit -m "Primera versión"`, como ya practicaste.',
          '**Hazlo en tu computador: GitHub.** 1. Crea tu cuenta en **github.com** (con un nombre de usuario profesional: va a estar en tu portafolio). 2. Botón **New repository**, ponle nombre (por ejemplo `mi-portafolio`), déjalo **Public** y **no** marques que cree un README (ya tienes tu proyecto). 3. GitHub te muestra los comandos para "subir un repositorio existente". Son estos: `git remote add origin https://github.com/TU-USUARIO/mi-portafolio.git` (le dice a Git dónde está la copia en internet, con el nombre `origin`), `git branch -M main` (le pone `main` a tu rama, por si Git la creó como `master`) y `git push -u origin main` (sube los commits; `-u` hace que después baste con `git push`).',
          '**La contraseña no sirve.** GitHub **no acepta la contraseña de tu cuenta** para `git push` por HTTPS. Con Git for Windows, el primer `push` abre una ventana del **administrador de credenciales** que te lleva al navegador para iniciar sesión en GitHub y autorizar; después Git recuerda el permiso. La otra opción es un **token** (Settings → Developer settings → Personal access tokens), que se pega en lugar de la contraseña y se guarda como una clave.',
          '**.gitignore.** Es un archivo de texto con lo que Git debe ignorar, una cosa por línea: `.venv/` y `node_modules/` (se reconstruyen con `requirements.txt` y `package.json`, y pesan mucho) y `.env` (tus claves). Una clave subida a un repositorio público se considera **robada**: hay programas que recorren GitHub buscándolas. Ejecuta el ejemplo para ver un repositorio con su primer commit.',
        ],
        archivos: { 'index.html': ARCHIVOS['index.html'], 'estilos.css': ARCHIVOS['estilos.css'] },
        codigo: ['git init', 'git add .', 'git commit -m "Primera versión del portafolio"', 'git log --oneline', 'git status'].join('\n'),
      },
      {
        id: 'practica',
        motor: 'terminal',
        titulo: 'Primer commit, sin secretos',
        texto: [
          'Tu carpeta tiene `index.html`, `estilos.css` y un `.env` con una clave. Vas a crear el repositorio sin que la clave entre a la historia.',
          '**1.** Crea el `.gitignore` con tres líneas: `echo ".env" > .gitignore`, y luego `.venv/` y `node_modules/` con `>>`. **2.** `git init`. **3.** Agrega **por nombre** `index.html`, `estilos.css` y `.gitignore`. **4.** Haz el commit y mira `git status`: el `.env` aparece como "sin seguimiento", y así debe quedarse.',
          'Por qué por nombre: este simulador no lee el `.gitignore`. En tu PC sí: allí `git add .` salta solo lo que está en `.gitignore`. Aun así, antes de cada commit mira `git status`: es tu última revisión.',
        ],
        archivos: ARCHIVOS,
        codigo: ['ls', 'cat .env', ''].join('\n'),
        pruebas: [
          { descripcion: 'Hay un repositorio con al menos un commit', condicion: 'hayRepo() && commits().length >= 1' },
          {
            descripcion: 'El .gitignore del commit tapa .env, .venv/ y node_modules/',
            condicion: '(() => { const g = ((ultimoCommit() || { archivos: {} }).archivos[".gitignore"] || "").split("\\n").map((l) => l.trim()); return g.includes(".env") && g.includes(".venv/") && g.includes("node_modules/"); })()',
          },
          { descripcion: 'La página y los estilos quedaron guardados', condicion: 'estaGuardado("index.html") && estaGuardado("estilos.css")' },
          { descripcion: 'El .env NO está en ningún commit', condicion: 'hayRepo() && commits().every((c) => !(".env" in c.archivos))' },
        ],
        pistas: [
          'Primero el `.gitignore`: `echo ".env" > .gitignore`, `echo ".venv/" >> .gitignore` y `echo "node_modules/" >> .gitignore`.',
          'Después `git init` y `git add index.html estilos.css .gitignore` (los tres en un solo comando).',
          'Guarda con `git commit -m "Primera versión del portafolio"` y revisa con `git status`.',
        ],
        solucion: [
          'ls',
          'echo ".env" > .gitignore',
          'echo ".venv/" >> .gitignore',
          'echo "node_modules/" >> .gitignore',
          'git init',
          'git add index.html estilos.css .gitignore',
          'git commit -m "Primera versión del portafolio"',
          'git status',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿qué se subiría por error?',
        texto: [
          'Antes del primer `git push` conviene revisar. Ya tienes `ignorado(ruta, gitignore)`, que dice si el `.gitignore` tapa una ruta. Escribe `peligros(archivos, gitignore)`: devuelve, en el orden en que vienen, los archivos **delicados** que **no** están ignorados, o sea, los que se subirían por error.',
          'Un archivo es delicado si se llama `.env` (en cualquier carpeta), o si está dentro de `.venv/` o de `node_modules/` (la ruta empieza así). En el ejemplo, el `.gitignore` solo tapa `node_modules/`: se colarían el `.env` y el Python de `.venv`.',
        ],
        codigo: [
          ...DATOS,
          '',
          '',
          ...IGNORADO,
          '',
          '',
          'def peligros(archivos, gitignore):',
          '    # Para cada archivo: ¿es delicado? ¿lo tapa el .gitignore?',
          '    return []',
          '',
          '',
          'print("Se subiría por error:", peligros(ARCHIVOS, GITIGNORE))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'En el ejemplo se colarían .env y lo de .venv',
            condicion: 'peligros(ARCHIVOS, GITIGNORE) == [".env", ".venv/Scripts/python.exe"]',
          },
          { descripcion: 'Con un buen .gitignore no hay peligros', condicion: 'peligros(ARCHIVOS, ".env\\n.venv/\\nnode_modules/") == []' },
          { descripcion: 'Un .env dentro de otra carpeta también es delicado', condicion: 'peligros(["api/.env", "api/app.py"], "") == ["api/.env"]' },
          { descripcion: 'Los archivos normales no son peligro aunque no estén ignorados', condicion: 'peligros(["index.html", "README.md", "envios.py"], "") == []' },
        ],
        pistas: [
          'El nombre del archivo es lo último de la ruta: `nombre = ruta.split("/")[-1]`.',
          'Delicado: `nombre == ".env" or ruta.startswith(".venv/") or ruta.startswith("node_modules/")`.',
          'Guarda los que son delicados y `not ignorado(ruta, gitignore)`, recorriendo `archivos` en orden.',
        ],
        solucion: [
          ...DATOS,
          '',
          '',
          ...IGNORADO,
          '',
          '',
          'def es_delicado(ruta):',
          '    nombre = ruta.split("/")[-1]',
          '    # .env guarda claves; .venv y node_modules se reconstruyen y pesan mucho.',
          '    return nombre == ".env" or ruta.startswith(".venv/") or ruta.startswith("node_modules/")',
          '',
          '',
          'def peligros(archivos, gitignore):',
          '    return [ruta for ruta in archivos if es_delicado(ruta) and not ignorado(ruta, gitignore)]',
          '',
          '',
          'print("Se subiría por error:", peligros(ARCHIVOS, GITIGNORE))',
        ].join('\n'),
      },
    ],
  });
})();

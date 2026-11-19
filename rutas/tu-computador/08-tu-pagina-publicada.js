// Ruta "Programar en tu computador", lección 8 (proyecto final): tu página
// hecha en tu PC, subida a GitHub y publicada con GitHub Pages.
//
// Publicar solo se puede en el PC real (Idea, "Hazlo en tu computador").
// La práctica es un validador de la lista de chequeo en Python, sobre un
// proyecto dado como diccionario {nombre: contenido}. El reto usa el motor
// "terminal" para dejar el repositorio listo para el push.
(function () {
  'use strict';

  // La etiqueta viewport es la que hace que la página se vea bien en el
  // celular: sin ella, el teléfono la muestra como si fuera un computador.
  const PAGINA = [
    '<!doctype html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Ana Gómez - Páginas para negocios</title>',
    '</head>',
    '<body><h1>Ana Gómez</h1><p>Hago páginas para negocios del barrio.</p></body>',
    '</html>',
  ].join('\n');

  const EJEMPLO = [
    'proyecto = {',
    '    "index.html": "<html><head><title>Ana</title></head><body>Hola</body></html>",',
    '    "README.md": "",',
    '    "app.js": "const CLAVE = \'sk-ejemplo-no-es-real\';",',
    '}',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'tu-pagina-publicada',
    titulo: 'Proyecto final: tu página publicada',
    pasos: [
      {
        id: 'idea',
        titulo: 'De tu PC a internet, gratis',
        texto: [
          'Este es el proyecto que pide la ruta **Tu primer trabajo** para tu portafolio: una página **tuya**, hecha en tu computador, con su código en GitHub y publicada en internet. Puede ser tu portafolio (quién eres, qué sabes hacer, tus proyectos y cómo contactarte) o la página de un negocio real, como la tienda de un familiar.',
          '**Hazlo en tu computador.** 1. En VS Code, abre tu carpeta `mi-portafolio` y escribe `index.html` y `estilos.css` con lo que aprendiste en la ruta web. Puedes pedirle ayuda a Claude Code, en pasos pequeños. 2. Escribe un `README.md`: qué es la página, cómo verla y qué usaste. 3. Haz commit y `git push` a tu repositorio de GitHub, que debe ser **público**.',
          '**Publicar con GitHub Pages.** 1. En tu repositorio de GitHub, entra a **Settings** y, en el menú de la izquierda, a **Pages**. 2. En "Build and deployment", deja la fuente en **Deploy from a branch**. 3. En "Branch" elige **main** y la carpeta **/ (root)**, y dale **Save**. 4. Espera unos minutos y recarga: GitHub te muestra la dirección, que es de la forma `https://TU-USUARIO.github.io/mi-portafolio/`. Para que funcione, el `index.html` debe estar en la raíz del repositorio. Cada `git push` a `main` actualiza la página publicada.',
          '**Lista de chequeo antes de compartir el enlace.** Que tenga `index.html` en la raíz, con título (`<title>`). Que tenga un `README.md` que no esté vacío. Que se vea bien **en el celular**: ábrelo en el tuyo; la etiqueta `<meta name="viewport">` es indispensable. Y que **no haya claves** en el repositorio: ni archivo `.env`, ni textos como `sk-…` en el código. Recuerda que en un repositorio público todo el mundo puede leer todo. Ejecuta el ejemplo para ver la lista.',
        ],
        codigo: [
          'chequeo = [',
          '    "index.html en la raíz, con <title>",',
          '    "README.md que explica el proyecto",',
          '    "<meta name=\\"viewport\\"> para el celular",',
          '    "Sin .env ni claves en el código",',
          '    "Repositorio público y Pages en main, / (root)",',
          ']',
          '',
          'for numero, punto in enumerate(chequeo, start=1):',
          '    print(f"[{numero}] {punto}")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un validador de la lista de chequeo',
        texto: [
          'Escribe `revisar(proyecto)`. El proyecto es un diccionario `{nombre_del_archivo: contenido}`. Devuelve la lista de problemas, en este orden:',
          '`"falta index.html"` si no existe (y si existe pero no tiene `<title>`, `"falta el título"`); `"falta el viewport"` si existe y no contiene `name="viewport"`; `"falta README.md"` si no existe o solo tiene espacios; `"hay un .env"` si algún archivo se llama `.env`; y `"posible clave en ARCHIVO"` por cada archivo, en su orden, cuyo contenido tenga `"sk-"`. Si todo está bien, la lista sale vacía.',
        ],
        codigo: [
          ...EJEMPLO,
          '',
          '',
          'def revisar(proyecto):',
          '    problemas = []',
          '    pagina = proyecto.get("index.html")',
          '    # Revisa cada punto de la lista, en orden',
          '    return problemas',
          '',
          '',
          'for problema in revisar(proyecto):',
          '    print("✗", problema)',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'En el ejemplo: sin viewport, README vacío y una clave en app.js',
            condicion: 'revisar(proyecto) == ["falta el viewport", "falta README.md", "posible clave en app.js"]',
          },
          { descripcion: 'Sin index.html no revisa título ni viewport', condicion: 'revisar({"README.md": "Hola"}) == ["falta index.html"]' },
          {
            descripcion: 'Una página sin <title>',
            condicion: 'revisar({"index.html": \'<meta name="viewport" content="x">\', "README.md": "Hola"}) == ["falta el título"]',
          },
          {
            descripcion: 'Avisa de un .env (y de la clave que tiene)',
            condicion: 'revisar({"index.html": \'<title>A</title><meta name="viewport">\', "README.md": "A", ".env": "C=sk-1"}) == ["hay un .env", "posible clave en .env"]',
          },
          {
            descripcion: 'Un proyecto bien hecho no tiene problemas',
            condicion: 'revisar({"index.html": \'<title>Ana</title><meta name="viewport" content="width=device-width">\', "README.md": "Mi portafolio", "estilos.css": "h1 {}"}) == []',
          },
        ],
        pistas: [
          'Si `pagina is None`, agrega `"falta index.html"`; si no, revisa `"<title>" not in pagina` y `\'name="viewport"\' not in pagina`.',
          'El README: `if not proyecto.get("README.md", "").strip():` cubre que no exista y que esté vacío.',
          'Al final: `if ".env" in proyecto:` y luego `for nombre, contenido in proyecto.items():` buscando `"sk-"`.',
        ],
        solucion: [
          ...EJEMPLO,
          '',
          '',
          'def revisar(proyecto):',
          '    problemas = []',
          '    pagina = proyecto.get("index.html")',
          '    # Sin página no tiene sentido revisar su título ni su viewport.',
          '    if pagina is None:',
          '        problemas.append("falta index.html")',
          '    else:',
          '        if "<title>" not in pagina:',
          '            problemas.append("falta el título")',
          '        if \'name="viewport"\' not in pagina:',
          '            problemas.append("falta el viewport")',
          '    # .get con "" por defecto: un README que no existe y uno vacío son el mismo problema.',
          '    if not proyecto.get("README.md", "").strip():',
          '        problemas.append("falta README.md")',
          '    if ".env" in proyecto:',
          '        problemas.append("hay un .env")',
          '    for nombre, contenido in proyecto.items():',
          '        if "sk-" in contenido:',
          '            problemas.append("posible clave en " + nombre)',
          '    return problemas',
          '',
          '',
          'for problema in revisar(proyecto):',
          '    print("✗", problema)',
        ].join('\n'),
      },
      {
        id: 'reto',
        motor: 'terminal',
        titulo: 'Reto: el repositorio listo para publicar',
        texto: [
          'Tu `index.html` ya está hecho (míralo con `cat index.html`: tiene título y viewport). En la carpeta también quedó un `.env` de una prueba. Deja el repositorio listo para el `git push`:',
          '**1.** Crea el `README.md` con una línea que diga qué es, por ejemplo `echo "Portafolio de Ana: páginas para negocios del barrio" > README.md`. **2.** Crea un `.gitignore` que tape `.env`. **3.** `git init` y un commit con `index.html`, `README.md` y `.gitignore`, agregados por nombre. **4.** Revisa con `git status` que el `.env` se quedó por fuera.',
          'En tu computador seguirías con `git remote add origin …`, `git branch -M main`, `git push -u origin main` y la configuración de Pages. Aquí no hay internet: el reto termina con el repositorio listo.',
        ],
        archivos: { 'index.html': PAGINA, '.env': 'CLAVE_API=sk-ejemplo-no-es-real' },
        codigo: ['ls', 'cat index.html', ''].join('\n'),
        pruebas: [
          { descripcion: 'Estás en la rama main con al menos un commit', condicion: 'hayRepo() && ramaActual() === "main" && commits().length >= 1' },
          { descripcion: 'La página quedó guardada', condicion: 'hayRepo() && estaGuardado("index.html")' },
          {
            descripcion: 'El README.md quedó guardado y no está vacío',
            condicion: 'hayRepo() && estaGuardado("README.md") && ultimoCommit().archivos["README.md"].trim().length > 0',
          },
          {
            descripcion: 'El .gitignore del commit tapa .env',
            condicion: 'hayRepo() && ((ultimoCommit() || { archivos: {} }).archivos[".gitignore"] || "").split("\\n").map((l) => l.trim()).includes(".env")',
          },
          { descripcion: 'El .env NO está en ningún commit', condicion: 'hayRepo() && commits().every((c) => !(".env" in c.archivos))' },
          { descripcion: 'Revisaste con git status al final', condicion: 'comandos[comandos.length - 1] === "git status"' },
        ],
        pistas: [
          'Primero los archivos: `echo "Portafolio de Ana: páginas para negocios del barrio" > README.md` y `echo ".env" > .gitignore`.',
          'Después `git init` y `git add index.html README.md .gitignore`.',
          'Guarda con `git commit -m "Primera versión del portafolio"` y termina con `git status`.',
        ],
        solucion: [
          'ls',
          'cat index.html',
          'echo "Portafolio de Ana: páginas para negocios del barrio" > README.md',
          'echo ".env" > .gitignore',
          'git init',
          'git add index.html README.md .gitignore',
          'git commit -m "Primera versión del portafolio"',
          'git status',
        ].join('\n'),
      },
    ],
  });
})();

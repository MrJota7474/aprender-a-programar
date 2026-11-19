// Ruta "Programar en tu computador", lección 7: Claude Code en tu proyecto.
//
// La instalación cambia con el tiempo, así que la lección no da el comando:
// remite a la documentación oficial de Anthropic. Lo que sí enseña es la
// forma de trabajar (CLAUDE.md, pasos pequeños, revisar con git diff, commit
// seguido), y los ejercicios practican dos partes: escribir un CLAUDE.md y
// leer un diff antes de aceptar un cambio.
(function () {
  'use strict';

  const DIFF = [
    'DIFF = """',
    'diff --git a/index.html b/index.html',
    '--- a/index.html',
    '+++ b/index.html',
    '@@ -1,2 +1,3 @@',
    ' <h1>Mi portafolio</h1>',
    '-<p>Hola</p>',
    '+<p>Hola, soy Ana y hago páginas para negocios</p>',
    '+<a href="mailto:ana@correo.com">Escríbeme</a>',
    'diff --git a/config.js b/config.js',
    '--- a/config.js',
    '+++ b/config.js',
    '@@ -0,0 +1 @@',
    '+const CLAVE = "sk-ejemplo-no-es-real";',
    '"""',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'claude-code',
    titulo: 'Claude Code en tu proyecto',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un agente en tu terminal',
        texto: [
          'En la ruta **Programar con IA** viste cómo trabaja un agente: piensa, usa una herramienta, mira el resultado y sigue. **Claude Code** es eso mismo, de verdad, en tu computador: un agente que corre en la terminal, dentro de la carpeta de tu proyecto, y puede **leer** tus archivos, **editarlos** y **correr comandos** (como las pruebas o `git`). Necesita una cuenta de Anthropic con un plan o créditos que lo incluyan; revisa las condiciones actuales en su página.',
          '**Hazlo en tu computador.** 1. **Instálalo** siguiendo la documentación oficial de Anthropic (busca "Claude Code" en docs.anthropic.com): el comando de instalación y los requisitos cambian, y copiarlo de un video viejo o de un foro es la forma más común de que falle. 2. Abre la terminal **en la carpeta de tu proyecto** (en VS Code, la terminal integrada ya está ahí) y escribe `claude`. 3. La primera vez te pide iniciar sesión.',
          '**Cómo trabajar bien.** Escribe un **CLAUDE.md** en la raíz del proyecto: qué es el proyecto, cómo se corre y tus reglas. El agente lo lee al empezar, como esta app tiene el suyo. Pide en **pasos pequeños** ("agrega una sección de contacto", no "hazme la página"). Después de cada cambio, revisa con **`git diff`** qué tocó, prueba que funcione y haz **commit**: si el siguiente paso sale mal, vuelves a ese punto con Git.',
          '**Los permisos.** Antes de editar un archivo o correr un comando, Claude Code te pregunta. Lee qué va a hacer antes de aceptar, sobre todo con comandos que borran o instalan cosas. Tú eres responsable de lo que entra a tu proyecto. Si no estás seguro de qué hace una opción o un comando, revisa la documentación oficial. Ejecuta el ejemplo: es una sesión típica.',
        ],
        codigo: [
          'sesion = [',
          '    ("tú", "Lee el proyecto y dime cómo está organizado"),',
          '    ("agente", "Leí index.html y estilos.css: es una página de una sola sección."),',
          '    ("tú", "Agrega una sección de contacto con un enlace a mi correo"),',
          '    ("agente", "Quiero editar index.html. ¿Lo permites?"),',
          '    ("tú", "Sí"),',
          '    ("tú (en la terminal)", "git diff  →  reviso los cambios"),',
          '    ("tú (en la terminal)", \'git commit -am "Agrega la sección de contacto"\'),',
          ']',
          '',
          'for quien, texto in sesion:',
          '    print(quien + ":", texto)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Tu propio CLAUDE.md',
        texto: [
          'Escribe `armar_claude_md(nombre, como_correr, reglas)`. Devuelve el texto del archivo, con líneas separadas por `\\n`, en este formato:',
          '`# nombre`, una línea vacía, `## Cómo correrlo`, la línea `como_correr`, una línea vacía, `## Reglas` y una línea `- regla` por cada regla. Si no hay reglas, debajo de `## Reglas` va `- (ninguna todavía)`.',
        ],
        codigo: [
          'def armar_claude_md(nombre, como_correr, reglas):',
          '    lineas = ["# " + nombre]',
          '    # Agrega las demás líneas y únelas con "\\n".join(lineas)',
          '    return "\\n".join(lineas)',
          '',
          '',
          'print(armar_claude_md(',
          '    "Mi portafolio",',
          '    "Abrir index.html en el navegador",',
          '    ["Textos en español", "Sin librerías externas", "Que se vea bien en el celular"],',
          '))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Arma el archivo completo',
            condicion:
              'armar_claude_md("Tienda", "python app.py", ["Español", "Sin claves en el código"]) == ' +
              '"# Tienda\\n\\n## Cómo correrlo\\npython app.py\\n\\n## Reglas\\n- Español\\n- Sin claves en el código"',
          },
          {
            descripcion: 'Sin reglas pone "(ninguna todavía)"',
            condicion: 'armar_claude_md("X", "node app.js", []).endswith("## Reglas\\n- (ninguna todavía)")',
          },
          { descripcion: 'Empieza con el título', condicion: 'armar_claude_md("Mi portafolio", "a", ["b"]).startswith("# Mi portafolio\\n")' },
        ],
        pistas: [
          'Después del título agrega, en orden: `""`, `"## Cómo correrlo"`, `como_correr`, `""` y `"## Reglas"`. Puedes usar `lineas += [...]`.',
          'Para las reglas: `for regla in reglas: lineas.append("- " + regla)`.',
          'Si la lista viene vacía (`if not reglas:`), agrega `"- (ninguna todavía)"` en su lugar.',
        ],
        solucion: [
          'def armar_claude_md(nombre, como_correr, reglas):',
          '    lineas = ["# " + nombre, "", "## Cómo correrlo", como_correr, "", "## Reglas"]',
          '    # Una lista de reglas vacía también se nota: así sabes que te falta escribirlas.',
          '    lineas += ["- " + regla for regla in reglas] or ["- (ninguna todavía)"]',
          '    return "\\n".join(lineas)',
          '',
          '',
          'print(armar_claude_md(',
          '    "Mi portafolio",',
          '    "Abrir index.html en el navegador",',
          '    ["Textos en español", "Sin librerías externas", "Que se vea bien en el celular"],',
          '))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: revisar el diff antes del commit',
        texto: [
          'El agente terminó y vas a mirar `git diff`. En un diff, cada archivo empieza con una línea `+++ b/nombre`; las líneas que empiezan con `+` se **agregaron** y las que empiezan con `-` se **quitaron** (pero `+++` y `---` son encabezados, no cuentan).',
          'Escribe `revisar_diff(diff)`: devuelve un diccionario con `"archivos"` (los nombres, en orden), `"agregadas"` y `"quitadas"` (cuántas líneas) y `"alertas"`: los archivos en los que una línea agregada contiene `"sk-"` (así empiezan muchas claves de API) o que se llaman `.env`, sin repetir. En el ejemplo, el agente metió una clave en `config.js`: eso no se acepta.',
        ],
        codigo: [
          ...DIFF,
          '',
          '',
          'def revisar_diff(diff):',
          '    archivos, alertas = [], []',
          '    agregadas = quitadas = 0',
          '    # Recorre diff.splitlines(); recuerda en qué archivo vas',
          '    return {"archivos": archivos, "agregadas": agregadas, "quitadas": quitadas, "alertas": alertas}',
          '',
          '',
          'print(revisar_diff(DIFF))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Encuentra los dos archivos, en orden',
            condicion: 'revisar_diff(DIFF)["archivos"] == ["index.html", "config.js"]',
          },
          { descripcion: 'Cuenta 3 líneas agregadas y 1 quitada', condicion: 'revisar_diff(DIFF)["agregadas"] == 3 and revisar_diff(DIFF)["quitadas"] == 1' },
          { descripcion: 'Avisa de la clave en config.js', condicion: 'revisar_diff(DIFF)["alertas"] == ["config.js"]' },
          {
            descripcion: 'Un .env es alerta, sin repetirlo',
            condicion: 'revisar_diff("+++ b/.env\\n+A=1\\n+B=sk-x")["alertas"] == [".env"]',
          },
          { descripcion: 'Un diff vacío no tiene nada', condicion: 'revisar_diff("") == {"archivos": [], "agregadas": 0, "quitadas": 0, "alertas": []}' },
        ],
        pistas: [
          'Revisa primero los encabezados: `if linea.startswith("+++ b/"):` guarda `actual = linea[6:]` en `archivos`; y `elif linea.startswith("---"): continue`.',
          'Después `elif linea.startswith("+"):` suma una agregada y, si `"sk-" in linea`, es alerta; `elif linea.startswith("-"):` suma una quitada.',
          'Para no repetir alertas, agrega con `if actual not in alertas: alertas.append(actual)`. El `.env` se revisa al leer su encabezado.',
        ],
        solucion: [
          ...DIFF,
          '',
          '',
          'def revisar_diff(diff):',
          '    archivos, alertas = [], []',
          '    agregadas = quitadas = 0',
          '    actual = None',
          '',
          '    def alertar(nombre):',
          '        if nombre not in alertas:',
          '            alertas.append(nombre)',
          '',
          '    for linea in diff.splitlines():',
          '        # Los encabezados van primero: "+++" y "---" también empiezan con + y -.',
          '        if linea.startswith("+++ b/"):',
          '            actual = linea[len("+++ b/"):]',
          '            archivos.append(actual)',
          '            if actual.split("/")[-1] == ".env":',
          '                alertar(actual)',
          '        elif linea.startswith("+++") or linea.startswith("---"):',
          '            continue',
          '        elif linea.startswith("+"):',
          '            agregadas += 1',
          '            if "sk-" in linea:',
          '                alertar(actual)',
          '        elif linea.startswith("-"):',
          '            quitadas += 1',
          '    return {"archivos": archivos, "agregadas": agregadas, "quitadas": quitadas, "alertas": alertas}',
          '',
          '',
          'print(revisar_diff(DIFF))',
        ].join('\n'),
      },
    ],
  });
})();

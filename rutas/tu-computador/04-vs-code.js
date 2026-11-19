// Ruta "Programar en tu computador", lección 4: VS Code.
//
// Abrir carpetas, la terminal integrada, las extensiones y el depurador solo
// se pueden hacer en el PC, así que se explican en la Idea. Los ejercicios
// practican dos decisiones que VS Code toma por ti y que conviene entender:
// con qué comando se corre cada archivo y qué extensiones le sirven a un
// proyecto (el archivo .vscode/extensions.json, que es real).
(function () {
  'use strict';

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'vs-code',
    titulo: 'VS Code, tu editor',
    pasos: [
      {
        id: 'idea',
        titulo: 'Abrir, escribir, correr y depurar',
        texto: [
          '**Visual Studio Code** (VS Code) es el editor gratuito de Microsoft y el más usado hoy. Se descarga de **code.visualstudio.com**. Puedes ponerlo en español con la extensión de idioma que te ofrece al abrirlo; aquí van los nombres en español y, entre paréntesis, en inglés.',
          '**Hazlo en tu computador.** 1. **Abre una carpeta**, no archivos sueltos: Archivo → Abrir carpeta (File → Open Folder) y elige `mi-portafolio`. VS Code trata la carpeta como tu proyecto: a la izquierda ves todos sus archivos. 2. **La terminal integrada**: menú Terminal → Nueva terminal (Terminal → New Terminal). Se abre abajo, **ya parada en la carpeta del proyecto**: no tienes que hacer `cd`. 3. **Extensiones**: el ícono de los cuadritos en la barra izquierda (o Ctrl+Shift+X). Instala **Python** (de Microsoft) y **ESLint**, que avisa errores en JavaScript. Revisa que el autor sea el oficial antes de instalar: hay copias.',
          '**Correr un archivo.** Crea `hola.py` con `print("Hola")`. Con la extensión de Python aparece un botón ▶ arriba a la derecha que lo corre; por dentro escribe en la terminal `python hola.py`. Con JavaScript es `node archivo.js`. Puedes escribir esos comandos tú mismo: es lo mismo.',
          '**El depurador**, a grandes rasgos: haz clic a la izquierda del número de una línea y aparece un punto rojo (un **punto de interrupción**). Al correr con el depurador (F5) el programa se **detiene** ahí y puedes ver el valor de cada variable y avanzar línea por línea. Es como poner `print` en todas partes, pero sin cambiar el código. Ejecuta el ejemplo: así se ve una carpeta abierta en VS Code.',
        ],
        codigo: [
          'proyecto = ["index.html", "estilos.css", "app.js", "hola.py"]',
          '',
          'print("EXPLORADOR: MI-PORTAFOLIO")',
          'for archivo in proyecto:',
          '    print("  ", archivo)',
          'print()',
          'print("TERMINAL")',
          'print("PS C:\\\\Users\\\\ana\\\\mi-portafolio> python hola.py")',
          'print("Hola")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Con qué se corre este archivo?',
        texto: [
          'Escribe `comando_para_correr(archivo)`: devuelve el comando que escribirías en la terminal para correr ese archivo. Un `.py` se corre con `python` y un `.js` con `node`: `"app.py"` da `"python app.py"`.',
          'Si es otra cosa (un `.html` se abre con el navegador, no con la terminal), devuelve `None`. Fíjate en la **extensión** (lo que va después del último punto) y en minúsculas: `"APP.PY"` también es Python.',
        ],
        codigo: [
          'def comando_para_correr(archivo):',
          '    # Mira cómo termina el nombre del archivo',
          '    return None',
          '',
          '',
          'for archivo in ["hola.py", "app.js", "index.html"]:',
          '    print(archivo, "→", comando_para_correr(archivo))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Un .py se corre con python', condicion: 'comando_para_correr("hola.py") == "python hola.py"' },
          { descripcion: 'Un .js se corre con node', condicion: 'comando_para_correr("app.js") == "node app.js"' },
          { descripcion: 'Respeta el nombre tal cual, aunque venga en mayúsculas', condicion: 'comando_para_correr("APP.PY") == "python APP.PY"' },
          { descripcion: 'Un .html no se corre en la terminal', condicion: 'comando_para_correr("index.html") is None' },
          { descripcion: 'Un nombre que solo contiene "py" no cuenta', condicion: 'comando_para_correr("copy.txt") is None' },
        ],
        pistas: [
          'Usa `archivo.lower().endswith(".py")`: así "APP.PY" también cuenta, y "copy.txt" no (no termina en ".py").',
          'Arma el comando con el nombre original: `return "python " + archivo`.',
          'Haz lo mismo con `.js` y `"node "`. Si no es ninguno, `return None`.',
        ],
        solucion: [
          'def comando_para_correr(archivo):',
          '    # lower() solo para comparar: el comando lleva el nombre tal como es.',
          '    nombre = archivo.lower()',
          '    if nombre.endswith(".py"):',
          '        return "python " + archivo',
          '    if nombre.endswith(".js"):',
          '        return "node " + archivo',
          '    return None',
          '',
          '',
          'for archivo in ["hola.py", "app.js", "index.html"]:',
          '    print(archivo, "→", comando_para_correr(archivo))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: las extensiones que recomienda tu proyecto',
        texto: [
          'Un proyecto puede traer un archivo `.vscode/extensions.json` que le dice a VS Code qué extensiones sugerir a quien lo abra. Así, si alguien de tu equipo abre el proyecto, VS Code le ofrece instalarlas. Tiene esta forma: `{"recommendations": ["ms-python.python"]}`. Cada extensión se nombra con su identificador: `autor.nombre`.',
          'Escribe `recomendaciones(archivos)`: recibe la lista de archivos del proyecto y devuelve ese diccionario. Si hay algún `.py`, recomienda `"ms-python.python"` (la extensión de Python de Microsoft); si hay algún `.js`, `"dbaeumer.vscode-eslint"` (ESLint). Python va primero. Si no aplica ninguna, la lista va vacía.',
        ],
        codigo: [
          'import json',
          '',
          'PYTHON = "ms-python.python"',
          'ESLINT = "dbaeumer.vscode-eslint"',
          '',
          '',
          'def recomendaciones(archivos):',
          '    lista = []',
          '    return {"recommendations": lista}',
          '',
          '',
          '# json.dumps muestra el diccionario tal como quedaría en el archivo',
          'print(json.dumps(recomendaciones(["index.html", "app.js", "datos.py"]), indent=2))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Con Python y JavaScript recomienda las dos, Python primero',
            condicion: 'recomendaciones(["index.html", "app.js", "datos.py"]) == {"recommendations": [PYTHON, ESLINT]}',
          },
          { descripcion: 'Solo JavaScript: solo ESLint', condicion: 'recomendaciones(["app.js", "otro.js"]) == {"recommendations": [ESLINT]}' },
          { descripcion: 'No repite una extensión aunque haya varios .py', condicion: 'recomendaciones(["a.py", "b.py"]) == {"recommendations": [PYTHON]}' },
          { descripcion: 'Una página sin código: la lista va vacía', condicion: 'recomendaciones(["index.html", "estilos.css"]) == {"recommendations": []}' },
        ],
        pistas: [
          '`any(...)` dice si al menos uno cumple: `hay_python = any(a.lower().endswith(".py") for a in archivos)`.',
          'Haz lo mismo con `.js`. Luego `if hay_python: lista.append(PYTHON)` y después ESLint, en ese orden.',
          'Al revisar "hay alguno" en vez de recorrer archivo por archivo, cada extensión entra una sola vez.',
        ],
        solucion: [
          'import json',
          '',
          'PYTHON = "ms-python.python"',
          'ESLINT = "dbaeumer.vscode-eslint"',
          '',
          '',
          'def recomendaciones(archivos):',
          '    # any() responde "¿hay al menos uno?": así cada extensión entra una vez.',
          '    hay_python = any(a.lower().endswith(".py") for a in archivos)',
          '    hay_js = any(a.lower().endswith(".js") for a in archivos)',
          '    lista = []',
          '    if hay_python:',
          '        lista.append(PYTHON)',
          '    if hay_js:',
          '        lista.append(ESLINT)',
          '    return {"recommendations": lista}',
          '',
          '',
          '# json.dumps muestra el diccionario tal como quedaría en el archivo',
          'print(json.dumps(recomendaciones(["index.html", "app.js", "datos.py"]), indent=2))',
        ].join('\n'),
      },
    ],
  });
})();

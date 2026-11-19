// Ruta "Programar en tu computador", lección 3: instalar Python y Node en
// Windows y comprobar que quedaron bien.
//
// La instalación solo se puede hacer en el PC real, así que va en la Idea
// como "Hazlo en tu computador". Los ejercicios leen la SALIDA de los
// comandos de comprobación (dada como texto) y dicen qué falta o qué hacer:
// es lo mismo que hace una persona al mirar la terminal.
// Los números de versión del ejercicio son de ejemplo: lo que importa es la
// forma ("Python 3.x", "v…"), no una versión en particular.
(function () {
  'use strict';

  const EJEMPLO = [
    'salidas = {',
    '    "python --version": "Python 3.12.0",',
    '    "node --version": "v20.0.0",',
    '    "npm --version": "npm : El término \'npm\' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.",',
    '}',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'instalar-python-y-node',
    titulo: 'Instalar Python y Node en Windows',
    pasos: [
      {
        id: 'idea',
        titulo: 'Instalar y comprobar',
        texto: [
          '**Hazlo en tu computador: Python.** 1. Entra a **python.org**, menú Downloads, y descarga la versión para Windows que te ofrezca la página. 2. Abre el instalador. **Antes** de darle a "Install Now", marca abajo la casilla **"Add python.exe to PATH"**: sin ella, la terminal no encuentra Python (es el PATH de la lección anterior). 3. Termina la instalación. Si la página de Python te ofrece un instalador distinto al que se describe aquí, sigue las instrucciones de esa página: python.org es la fuente oficial y cambia con el tiempo.',
          '**Hazlo en tu computador: Node.** 1. Entra a **nodejs.org** y descarga la versión **LTS** ("Long Term Support": la estable, con soporte por más tiempo). 2. Instálala con las opciones que trae: ya agrega Node y npm al PATH. npm es el programa que instala librerías de JavaScript y viene con Node.',
          '**Comprueba.** Cierra todas las terminales y abre una nueva (una terminal abierta antes de instalar no ve el PATH nuevo). Escribe `python --version`, `node --version` y `npm --version`. Si cada uno responde con un número de versión, quedó bien.',
          '**Errores típicos.** *"python no se reconoce como un comando"* (o "nombre de un cmdlet" en PowerShell): no quedó en el PATH. Lo más simple es volver a correr el instalador, elegir "Modify" o desinstalar e instalar otra vez con la casilla marcada, y abrir una terminal nueva. *Se abre la Microsoft Store* o sale un mensaje que la menciona: Windows trae un atajo llamado "alias de ejecución" que manda `python` a la Store. Si ya instalaste Python desde python.org, ve a Configuración → Aplicaciones → Configuración avanzada de aplicaciones → Alias de ejecución de aplicaciones, y apaga los de python.exe y python3.exe. Los nombres del menú pueden variar un poco según tu versión de Windows.',
        ],
        codigo: [
          '# Así se ve una comprobación que salió bien (números de ejemplo)',
          'print("PS C:\\\\Users\\\\ana> python --version")',
          'print("Python 3.12.0")',
          'print("PS C:\\\\Users\\\\ana> node --version")',
          'print("v20.0.0")',
          'print("PS C:\\\\Users\\\\ana> npm --version")',
          'print("10.0.0")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un diagnóstico de la instalación',
        texto: [
          'Escribe `diagnostico(salidas)`. Recibe un diccionario con lo que respondió cada comando y devuelve la lista de lo que **falta**, en este orden: `"python"`, `"node"`, `"npm"`.',
          'Cuenta como bien instalado: Python si su salida empieza con `"Python 3."`; Node si empieza con `"v"` seguida de un dígito (como `v20.0.0`); npm si empieza con un dígito. Si el comando no está en el diccionario, o respondió otra cosa (un error), falta. Ojo: `"Python 2.7"` también cuenta como faltante: esa versión ya no tiene soporte.',
        ],
        codigo: [
          ...EJEMPLO,
          '',
          '',
          'def diagnostico(salidas):',
          '    faltan = []',
          '    # Lee cada salida con salidas.get(comando, "") y revisa cómo empieza',
          '    return faltan',
          '',
          '',
          'print("Falta:", diagnostico(salidas))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'En el ejemplo falta npm', condicion: 'diagnostico(salidas) == ["npm"]' },
          {
            descripcion: 'Si todo respondió con versión, no falta nada',
            condicion: 'diagnostico({"python --version": "Python 3.13.1", "node --version": "v22.1.0", "npm --version": "10.9.0"}) == []',
          },
          { descripcion: 'Con el diccionario vacío faltan los tres, en orden', condicion: 'diagnostico({}) == ["python", "node", "npm"]' },
          {
            descripcion: 'Python 2 cuenta como faltante',
            condicion: 'diagnostico({"python --version": "Python 2.7.18", "node --version": "v20.0.0", "npm --version": "10.0.0"}) == ["python"]',
          },
          {
            descripcion: 'Un error en vez de versión cuenta como faltante',
            condicion: 'diagnostico({"python --version": "\'python\' no se reconoce como un comando interno o externo", "node --version": "v20.0.0", "npm --version": "10.0.0"}) == ["python"]',
          },
        ],
        pistas: [
          'Toma cada salida sin espacios de sobra: `py = salidas.get("python --version", "").strip()`, y lo mismo con node y npm.',
          'Python: `py.startswith("Python 3.")`. Node: `nd[:1] == "v" and nd[1:2].isdigit()`. npm: `nm[:1].isdigit()`. Usar `[:1]` en vez de `[0]` evita un error si el texto está vacío.',
          'Por cada uno que no cumpla, `faltan.append("python")` (o "node", "npm"), en ese orden.',
        ],
        solucion: [
          ...EJEMPLO,
          '',
          '',
          'def diagnostico(salidas):',
          '    py = salidas.get("python --version", "").strip()',
          '    nd = salidas.get("node --version", "").strip()',
          '    nm = salidas.get("npm --version", "").strip()',
          '    faltan = []',
          '    # Se mira el COMIENZO de la salida: un mensaje de error nunca empieza así.',
          '    if not py.startswith("Python 3."):',
          '        faltan.append("python")',
          '    # [:1] y [1:2] en vez de [0] y [1]: con un texto vacío no fallan.',
          '    if not (nd[:1] == "v" and nd[1:2].isdigit()):',
          '        faltan.append("node")',
          '    if not nm[:1].isdigit():',
          '        faltan.append("npm")',
          '    return faltan',
          '',
          '',
          'print("Falta:", diagnostico(salidas))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿qué hago con este error?',
        texto: [
          'Tu primo te manda una foto de la terminal después de escribir `python --version`. Escribe `que_hacer(salida)`, que lea el texto y devuelva un consejo corto:',
          '`"listo"` si empieza con `"Python 3."`. `"apaga el alias"` si menciona la **Microsoft Store** (en mayúsculas o minúsculas): es el alias de ejecución. `"agrega Python al PATH"` si dice **"no se reconoce"** (en español) o **"not recognized"** (en Windows en inglés). Y `"revisa el mensaje"` para cualquier otra cosa.',
          'Revisa la Store **antes** que el PATH: así, si algún día un mensaje trae las dos cosas, gana el arreglo más específico.',
        ],
        codigo: [
          'def que_hacer(salida):',
          '    texto = salida.strip()',
          '    return "revisa el mensaje"',
          '',
          '',
          'print(que_hacer("Python 3.12.0"))',
          'print(que_hacer("Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings > App execution aliases."))',
          'print(que_hacer("\'python\' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable."))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Una versión de Python 3 está lista', condicion: 'que_hacer("Python 3.12.0") == "listo"' },
          {
            descripcion: 'El mensaje de la Microsoft Store pide apagar el alias',
            condicion: 'que_hacer("Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut") == "apaga el alias"',
          },
          { descripcion: 'No distingue mayúsculas: "microsoft store" también', condicion: 'que_hacer("se abrió la microsoft store") == "apaga el alias"' },
          {
            descripcion: '"no se reconoce" pide agregarlo al PATH',
            condicion: 'que_hacer("\'python\' no se reconoce como un comando interno o externo") == "agrega Python al PATH"',
          },
          {
            descripcion: '"not recognized" (Windows en inglés) también',
            condicion: 'que_hacer("python : The term \'python\' is not recognized as the name of a cmdlet") == "agrega Python al PATH"',
          },
          { descripcion: 'Lo demás: "revisa el mensaje"', condicion: 'que_hacer("Acceso denegado") == "revisa el mensaje" and que_hacer("Python 2.7.18") == "revisa el mensaje"' },
        ],
        pistas: [
          'Compara en minúsculas: `minusculas = texto.lower()`. Así "Microsoft Store" y "microsoft store" son lo mismo.',
          'El orden de los `if`: primero `texto.startswith("Python 3.")`, luego `"microsoft store" in minusculas`, luego el PATH.',
          'Para el PATH: `if "no se reconoce" in minusculas or "not recognized" in minusculas:`.',
        ],
        solucion: [
          'def que_hacer(salida):',
          '    texto = salida.strip()',
          '    minusculas = texto.lower()',
          '    if texto.startswith("Python 3."):',
          '        return "listo"',
          '    # La Store va antes que el PATH: es el caso más específico.',
          '    if "microsoft store" in minusculas:',
          '        return "apaga el alias"',
          '    if "no se reconoce" in minusculas or "not recognized" in minusculas:',
          '        return "agrega Python al PATH"',
          '    return "revisa el mensaje"',
          '',
          '',
          'print(que_hacer("Python 3.12.0"))',
          'print(que_hacer("Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings > App execution aliases."))',
          'print(que_hacer("\'python\' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable."))',
        ].join('\n'),
      },
    ],
  });
})();

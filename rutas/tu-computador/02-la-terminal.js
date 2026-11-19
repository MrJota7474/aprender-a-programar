// Ruta "Programar en tu computador", lección 2: la terminal de Windows.
//
// La idea y la práctica usan el motor "terminal" (js/terminal-evaluador.js),
// que imita Bash: pwd, ls, cd, mkdir, cat, echo, touch y rm. Son los mismos
// nombres que acepta PowerShell (allí son "alias" de sus comandos propios),
// así que lo practicado aquí sirve en las dos terminales.
// El reto es Python: simula cómo Windows busca un programa en el PATH, que es
// la causa del error más común al instalar Python o Node.
(function () {
  'use strict';

  const ARCHIVOS = { 'notas.txt': 'Aquí empieza mi carrera de programador' };

  // Un PATH de ejemplo: carpetas separadas por punto y coma, como en Windows.
  // Las carpetas y sus programas son inventados para el ejercicio.
  const DATOS_PATH = [
    'PATH = "C:\\\\Windows\\\\system32;C:\\\\Program Files\\\\Git\\\\cmd;C:\\\\Program Files\\\\nodejs"',
    '',
    '# Qué programas hay en cada carpeta (solo para el ejercicio)',
    'CARPETAS = {',
    '    "C:\\\\Windows\\\\system32": ["notepad.exe", "cmd.exe"],',
    '    "C:\\\\Program Files\\\\Git\\\\cmd": ["git.exe"],',
    '    "C:\\\\Program Files\\\\nodejs": ["node.exe", "npm.cmd"],',
    '    "C:\\\\Python312": ["python.exe"],',
    '}',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'la-terminal',
    titulo: 'La terminal de Windows',
    pasos: [
      {
        id: 'idea',
        motor: 'terminal',
        titulo: 'PowerShell, Git Bash y dónde estás parado',
        texto: [
          'La **terminal** es una ventana donde escribes órdenes en vez de hacer clic. En Windows vas a ver dos: **PowerShell**, que ya viene con Windows (búscala en el menú Inicio), y **Git Bash**, que llega al instalar Git for Windows e imita la terminal de Linux y Mac (Bash). Hay una tercera, más vieja, el **Símbolo del sistema** (`cmd`); hoy casi no se usa.',
          'Los comandos básicos se llaman casi igual en las dos: `pwd` dice en qué carpeta estás, `ls` lista lo que hay, `cd carpeta` entra a una carpeta, `cd ..` sube una, `mkdir nombre` crea una carpeta y `cat archivo` muestra lo que tiene. En PowerShell esos nombres son atajos (alias) de sus comandos propios, como `Get-ChildItem` para `ls`. En el Símbolo del sistema, `ls` no existe: allí se usa `dir`.',
          'Una diferencia que confunde: Windows separa las carpetas con `\\` (`C:\\Users\\ana`) y Bash con `/` (`/c/Users/ana`). PowerShell acepta las dos.',
          '**Hazlo en tu computador.** 1. Abre el menú Inicio, escribe "PowerShell" y ábrelo. 2. Escribe `pwd` y Enter: vas a ver tu carpeta personal. 3. Escribe `ls` para ver lo que hay. 4. Escribe `cd Desktop` (o `cd Escritorio` si así se llama en tu PC) y otra vez `ls`. Aquí, en el simulador, ejecuta el código para ver lo mismo.',
        ],
        archivos: ARCHIVOS,
        codigo: ['# ¿Dónde estoy?', 'pwd', '', '# ¿Qué hay aquí?', 'ls', '', 'cat notas.txt'].join('\n'),
      },
      {
        id: 'practica',
        motor: 'terminal',
        titulo: 'Tu primera carpeta de proyecto',
        texto: [
          'Todo proyecto vive en **su propia carpeta**. Vas a crear la de tu portafolio, que es la página que vas a publicar al final de esta ruta.',
          '**1.** Crea la carpeta `mi-portafolio` con `mkdir`. Sin espacios ni tildes en el nombre: en la terminal, un espacio separa palabras y te obligaría a usar comillas. **2.** Entra a ella con `cd`. **3.** Crea un `index.html` con una línea, usando `echo "<h1>Hola, soy ...</h1>" > index.html`. **4.** Comprueba con `pwd` y `ls` que quedaste dentro y que el archivo está.',
          'En PowerShell funciona igual, con una diferencia: su `>` guarda el archivo en otra codificación (UTF-16 en Windows PowerShell 5.1, la que trae Windows), que algunos programas leen mal. Para archivos de código es mejor crearlos desde VS Code, que verás en la lección 4.',
        ],
        archivos: ARCHIVOS,
        codigo: ['pwd', 'ls', ''].join('\n'),
        pruebas: [
          { descripcion: 'Existe la carpeta mi-portafolio', condicion: 'carpetas().includes("mi-portafolio")' },
          { descripcion: 'Dentro hay un index.html con un título <h1>', condicion: '/<h1>/.test(archivo("mi-portafolio/index.html") || "")' },
          { descripcion: 'Terminaste parado dentro de mi-portafolio', condicion: 'carpetaActual() === "/proyecto/mi-portafolio"' },
          { descripcion: 'Comprobaste con ls al final', condicion: 'comandos[comandos.length - 1].startsWith("ls")' },
        ],
        pistas: [
          'Crea la carpeta con `mkdir mi-portafolio` y entra con `cd mi-portafolio`.',
          'Ya adentro: `echo "<h1>Hola, soy Ana</h1>" > index.html` (con tu nombre).',
          'Termina con `pwd` y después `ls`: debe aparecer `index.html`.',
        ],
        solucion: [
          'pwd',
          'mkdir mi-portafolio',
          'cd mi-portafolio',
          'echo "<h1>Hola, soy Ana</h1>" > index.html',
          'pwd',
          'ls',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: cómo encuentra Windows un programa (el PATH)',
        texto: [
          'Cuando escribes `python` en la terminal, Windows no busca en todo el disco: revisa una lista de carpetas llamada **PATH**, en orden, y usa el **primer** programa que encuentre con ese nombre. Si no está en ninguna, sale el famoso error de que el comando "no se reconoce". Por eso al instalar Python hay que marcar la casilla que lo agrega al PATH.',
          'En Windows, el PATH es un texto con las carpetas separadas por `;`. Escribe `buscar(programa, path, carpetas)`: recorre las carpetas del PATH en orden y devuelve la **ruta completa** del primero que tenga `programa + ".exe"` o `programa + ".cmd"` (por ejemplo `C:\\Program Files\\nodejs\\node.exe`). Si no aparece, devuelve `None`. Una carpeta del PATH que no esté en `carpetas` se salta.',
          'Mira el ejemplo: `C:\\Python312` tiene `python.exe`, pero **no está en el PATH**. Ese es justo el caso de quien instaló Python sin marcar la casilla.',
        ],
        codigo: [
          ...DATOS_PATH,
          '',
          '',
          'def buscar(programa, path, carpetas):',
          '    # Parte el PATH con split(";") y revisa cada carpeta en orden',
          '    return None',
          '',
          '',
          'for programa in ["node", "npm", "git", "python"]:',
          '    print(programa, "→", buscar(programa, PATH, CARPETAS))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Encuentra node en la carpeta de Node', condicion: 'buscar("node", PATH, CARPETAS) == "C:\\\\Program Files\\\\nodejs\\\\node.exe"' },
          { descripcion: 'Encuentra npm aunque sea .cmd', condicion: 'buscar("npm", PATH, CARPETAS) == "C:\\\\Program Files\\\\nodejs\\\\npm.cmd"' },
          { descripcion: 'python no está en el PATH: devuelve None', condicion: 'buscar("python", PATH, CARPETAS) is None' },
          {
            descripcion: 'Al agregar C:\\Python312 al PATH, sí lo encuentra',
            condicion: 'buscar("python", PATH + ";C:\\\\Python312", CARPETAS) == "C:\\\\Python312\\\\python.exe"',
          },
          {
            descripcion: 'Gana la primera carpeta del PATH que lo tenga',
            condicion: 'buscar("git", "C:\\\\b;C:\\\\a", {"C:\\\\a": ["git.exe"], "C:\\\\b": ["git.exe"]}) == "C:\\\\b\\\\git.exe"',
          },
          { descripcion: 'Una carpeta del PATH que no existe se salta', condicion: 'buscar("git", "C:\\\\nada;C:\\\\Program Files\\\\Git\\\\cmd", CARPETAS) == "C:\\\\Program Files\\\\Git\\\\cmd\\\\git.exe"' },
        ],
        pistas: [
          'Recorre `for carpeta in path.split(";"):` y toma sus programas con `carpetas.get(carpeta, [])`: así una carpeta que no existe da una lista vacía.',
          'Dentro, prueba los dos nombres: `for nombre in [programa + ".exe", programa + ".cmd"]:`.',
          'Si `nombre in programas`, devuelve `carpeta + "\\\\" + nombre` (en Python, `"\\\\"` es una sola barra invertida). Al final de todo, `return None`.',
        ],
        solucion: [
          ...DATOS_PATH,
          '',
          '',
          'def buscar(programa, path, carpetas):',
          '    # El orden importa: Windows usa el PRIMERO que encuentra.',
          '    for carpeta in path.split(";"):',
          '        programas = carpetas.get(carpeta, [])',
          '        for nombre in [programa + ".exe", programa + ".cmd"]:',
          '            if nombre in programas:',
          '                return carpeta + "\\\\" + nombre',
          '    # Ninguna carpeta lo tiene: es el error "no se reconoce como un comando".',
          '    return None',
          '',
          '',
          'for programa in ["node", "npm", "git", "python"]:',
          '    print(programa, "→", buscar(programa, PATH, CARPETAS))',
        ].join('\n'),
      },
    ],
  });
})();

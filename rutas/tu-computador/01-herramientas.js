// Ruta "Programar en tu computador", lección 1: las herramientas de un
// programador y para qué sirve cada una.
//
// Todo lo de la app pasa dentro del navegador; esta ruta lleva lo aprendido
// al PC del estudiante. Los pasos que solo se pueden hacer en Windows se
// explican en la Idea ("Hazlo en tu computador") y los ejercicios practican
// la parte que sí se puede revisar aquí: en esta lección, saber qué papel
// cumple cada herramienta.
(function () {
  'use strict';

  // El diccionario completo. En la práctica el estudiante lo termina; en el
  // reto ya viene lleno porque el ejercicio es otro (qué le falta a un PC).
  const ROLES_COMPLETOS = [
    'ROLES = {',
    '    "vs code": "editor",',
    '    "python": "intérprete",',
    '    "node": "intérprete",',
    '    "powershell": "terminal",',
    '    "git bash": "terminal",',
    '    "git": "control de versiones",',
    '    "github": "repositorio remoto",',
    '    "claude code": "asistente de IA",',
    '}',
  ];

  const FUNCION_ROL = [
    'def rol(herramienta):',
    '    # strip y lower: "  VS Code " y "vs code" son la misma herramienta',
    '    return ROLES.get(herramienta.strip().lower(), "no sé")',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'herramientas',
    titulo: 'Las herramientas de un programador',
    pasos: [
      {
        id: 'idea',
        titulo: 'Seis herramientas, seis trabajos',
        texto: [
          'Hasta ahora todo pasó dentro de esta app: escribías, le dabas a Ejecutar y la app hacía el resto. En un trabajo real esas piezas están separadas, y cada una es un programa que instalas en tu computador.',
          '**1. El editor** (VS Code): donde escribes el código. Es como un bloc de notas que entiende de programación: colorea, avisa errores y completa nombres. **2. El intérprete** (Python, Node): el programa que lee tu código y lo ejecuta. Sin él, un archivo `.py` es solo texto. **3. La terminal** (PowerShell o Git Bash): una ventana donde le das órdenes al computador escribiendo, como `python app.py`.',
          '**4. El control de versiones** (Git): guarda la historia de tu proyecto en tu PC; ya lo usaste simulado. **5. El repositorio remoto** (GitHub): una copia de esa historia en internet, para no perderla, compartirla y publicarla. **6. El asistente de IA** (Claude Code): un agente que trabaja en tu carpeta: lee, edita y corre comandos, con tu permiso.',
          'Una forma de recordarlo: escribes en el **editor**, lo corres con el **intérprete** desde la **terminal**, guardas la historia con **Git**, la subes a **GitHub** y le pides ayuda a la **IA**. En esta ruta instalas y usas cada una, y terminas con tu página publicada en internet. Ejecuta el código para ver la lista.',
        ],
        codigo: [
          'herramientas = [',
          '    ("Editor", "VS Code", "escribir el código"),',
          '    ("Intérprete", "Python y Node", "ejecutar el código"),',
          '    ("Terminal", "PowerShell o Git Bash", "darle órdenes al computador"),',
          '    ("Control de versiones", "Git", "guardar la historia del proyecto"),',
          '    ("Repositorio remoto", "GitHub", "guardar esa historia en internet"),',
          '    ("Asistente de IA", "Claude Code", "ayudarte a leer y cambiar el código"),',
          ']',
          '',
          'for papel, nombre, sirve in herramientas:',
          '    print(papel + ":", nombre, "→ sirve para", sirve)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Qué papel cumple cada una?',
        texto: [
          'Completa el diccionario `ROLES` para que `rol(herramienta)` diga qué papel cumple cada programa. Las claves van en minúsculas y la función ya se encarga de quitar espacios y mayúsculas.',
          'Los papeles posibles son: `"editor"`, `"intérprete"`, `"terminal"`, `"control de versiones"`, `"repositorio remoto"` y `"asistente de IA"`. Python y Node son intérpretes; PowerShell y Git Bash son terminales. Si la herramienta no está en el diccionario, `rol` devuelve `"no sé"`.',
        ],
        codigo: [
          'ROLES = {',
          '    "vs code": "editor",',
          '    # Agrega aquí: python, node, powershell, git bash, git, github y claude code',
          '}',
          '',
          '',
          ...FUNCION_ROL,
          '',
          '',
          'for herramienta in ["VS Code", "Python", "Git", "GitHub", "Claude Code", "Excel"]:',
          '    print(herramienta, "→", rol(herramienta))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'VS Code es el editor', condicion: 'rol("VS Code") == "editor"' },
          { descripcion: 'Python y Node son intérpretes', condicion: 'rol("Python") == "intérprete" and rol("node") == "intérprete"' },
          { descripcion: 'PowerShell y Git Bash son terminales', condicion: 'rol("PowerShell") == "terminal" and rol("Git Bash") == "terminal"' },
          { descripcion: 'Git es el control de versiones', condicion: 'rol("Git") == "control de versiones"' },
          { descripcion: 'GitHub es el repositorio remoto', condicion: 'rol("GitHub") == "repositorio remoto"' },
          { descripcion: 'Claude Code es el asistente de IA', condicion: 'rol(" Claude Code ") == "asistente de IA"' },
          { descripcion: 'Lo que no conoce da "no sé"', condicion: 'rol("Excel") == "no sé"' },
        ],
        pistas: [
          'Cada línea del diccionario es `"nombre en minúsculas": "papel",`. Por ejemplo: `"python": "intérprete",`.',
          'Git y GitHub son distintos: `"git": "control de versiones"` y `"github": "repositorio remoto"`.',
          'Faltan: node, powershell, git bash (con el espacio) y `"claude code": "asistente de IA"`.',
        ],
        solucion: [
          ...ROLES_COMPLETOS,
          '',
          '',
          ...FUNCION_ROL,
          '',
          '',
          'for herramienta in ["VS Code", "Python", "Git", "GitHub", "Claude Code", "Excel"]:',
          '    print(herramienta, "→", rol(herramienta))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿qué le falta a este computador?',
        texto: [
          'Un amigo te cuenta qué tiene instalado y quiere saber si ya puede programar. Escribe `que_falta(instaladas)`: recibe una lista de herramientas y devuelve los **papeles** que nadie cubre, en el orden de `PAPELES`.',
          'Usa `rol` para saber el papel de cada herramienta. Las que dan `"no sé"` no cubren nada. Si tiene de todo, la lista sale vacía. Ojo: tener Python y Node no cuenta dos veces; el papel "intérprete" queda cubierto con uno.',
        ],
        codigo: [
          ...ROLES_COMPLETOS,
          'PAPELES = ["editor", "intérprete", "terminal", "control de versiones", "repositorio remoto", "asistente de IA"]',
          '',
          '',
          ...FUNCION_ROL,
          '',
          '',
          'def que_falta(instaladas):',
          '    # Averigua qué papeles cubren las herramientas instaladas',
          '    return []',
          '',
          '',
          'print(que_falta(["VS Code", "Python", "PowerShell"]))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'A un PC con editor, Python y terminal le faltan Git, GitHub y la IA',
            condicion: 'que_falta(["VS Code", "Python", "PowerShell"]) == ["control de versiones", "repositorio remoto", "asistente de IA"]',
          },
          { descripcion: 'Sin nada instalado faltan los seis papeles', condicion: 'que_falta([]) == PAPELES' },
          {
            descripcion: 'Con todo, no falta nada',
            condicion: 'que_falta(["vs code", "Node", "Git Bash", "Git", "GitHub", "Claude Code"]) == []',
          },
          { descripcion: 'Lo que no conoce no cubre ningún papel', condicion: 'que_falta(["Excel", "Word"]) == PAPELES' },
          { descripcion: 'No cambia la lista que recibe', condicion: '(lambda l: (que_falta(l), l)[1])(["Git"]) == ["Git"]' },
        ],
        pistas: [
          'Primero arma el conjunto de papeles cubiertos: `cubiertos = {rol(h) for h in instaladas}`.',
          'Después recorre `PAPELES` en orden y guarda los que no están en `cubiertos`.',
          'En una línea: `return [papel for papel in PAPELES if papel not in cubiertos]`.',
        ],
        solucion: [
          ...ROLES_COMPLETOS,
          'PAPELES = ["editor", "intérprete", "terminal", "control de versiones", "repositorio remoto", "asistente de IA"]',
          '',
          '',
          ...FUNCION_ROL,
          '',
          '',
          'def que_falta(instaladas):',
          '    # Un conjunto: si Python y Node dan "intérprete", queda una sola vez.',
          '    cubiertos = {rol(h) for h in instaladas}',
          '    # Se recorre PAPELES (y no el conjunto) para respetar su orden.',
          '    return [papel for papel in PAPELES if papel not in cubiertos]',
          '',
          '',
          'print(que_falta(["VS Code", "Python", "PowerShell"]))',
        ].join('\n'),
      },
    ],
  });
})();

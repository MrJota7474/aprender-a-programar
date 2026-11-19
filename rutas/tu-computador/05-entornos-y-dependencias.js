// Ruta "Programar en tu computador", lección 5: entornos virtuales y
// dependencias (venv + pip + requirements.txt, y npm + package.json).
//
// Crear el entorno e instalar paquetes solo se puede en el PC (aquí no hay
// internet ni disco), así que va en la Idea. Los ejercicios hacen lo que pip
// hace por dentro con requirements.txt: leerlo y compararlo con lo instalado.
(function () {
  'use strict';

  const REQUISITOS = [
    'REQUISITOS = """',
    '# Lo que necesita la app de la tienda',
    'requests==2.31.0',
    'Flask==3.0.0',
    '',
    'python-dotenv',
    '"""',
  ];

  const LEER_RESUELTO = [
    'def leer_requirements(texto):',
    '    paquetes = {}',
    '    for linea in texto.splitlines():',
    '        linea = linea.strip()',
    '        # Las líneas vacías y los comentarios no son paquetes.',
    '        if not linea or linea.startswith("#"):',
    '            continue',
    '        # partition no falla si no hay "==": la versión queda en "".',
    '        nombre, _, version = linea.partition("==")',
    '        # pip no distingue mayúsculas en los nombres: Flask y flask son el mismo.',
    '        paquetes[nombre.strip().lower()] = version.strip()',
    '    return paquetes',
  ];

  globalThis.Rutas.agregarLeccion('tu-computador', {
    id: 'entornos-y-dependencias',
    titulo: 'Entornos y dependencias en tu PC',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cada proyecto con sus propias librerías',
        texto: [
          'Una **dependencia** es una librería que otra persona escribió y tu proyecto usa (como `requests` en Python o `express` en JavaScript). Si las instalas todas "en el computador", dos proyectos que piden versiones distintas chocan. La solución es que **cada proyecto tenga su propia caja** de librerías.',
          '**Hazlo en tu computador: Python.** Con la terminal parada en la carpeta del proyecto: 1. `python -m venv .venv` crea el **entorno virtual**, una carpeta `.venv` con un Python propio del proyecto. 2. Actívalo en PowerShell con `.venv\\Scripts\\Activate.ps1` (en Git Bash: `source .venv/Scripts/activate`). Verás `(.venv)` al comienzo de la línea: desde ahí, `pip` instala dentro de la caja. 3. `pip install requests` instala una librería. 4. `pip freeze > requirements.txt` guarda la lista de lo instalado con sus versiones, y quien reciba el proyecto lo reconstruye con `pip install -r requirements.txt`.',
          '**El error de PowerShell.** Al activar puede salir que *"la ejecución de scripts está deshabilitada en este sistema"*. Windows bloquea por defecto los scripts de PowerShell, y `Activate.ps1` es uno. La solución segura es `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`: permite correr scripts **creados en tu PC** (como el de `.venv`) y sigue exigiendo firma a los **descargados de internet**. `-Scope CurrentUser` lo cambia solo para tu usuario, no para todo el computador, y no pide ser administrador. Nunca pongas `Unrestricted` o `Bypass` porque lo leíste en un foro: eso quita la protección.',
          '**Hazlo en tu computador: Node.** 1. `npm init -y` crea el `package.json` (la ficha del proyecto, con `-y` acepta las respuestas por defecto). 2. `npm install express` instala una librería en la carpeta `node_modules` y la anota en `package.json`. 3. Quien reciba el proyecto solo corre `npm install`. Ni `.venv` ni `node_modules` se suben a GitHub: se reconstruyen con esas listas (lo verás en la próxima lección). Ejecuta el ejemplo: así se ve un `requirements.txt`.',
        ],
        codigo: [
          ...REQUISITOS,
          '',
          'print("requirements.txt:")',
          'print(REQUISITOS)',
          'print("Cada línea es un paquete; con == se fija la versión exacta.")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Leer un requirements.txt',
        texto: [
          'Escribe `leer_requirements(texto)`: devuelve un diccionario `{nombre: versión}`. Cada línea es `nombre==versión`; si no trae versión, la versión es `""`. Salta las líneas vacías y las que empiezan con `#` (comentarios).',
          'Guarda los nombres en **minúsculas**: para pip, `Flask` y `flask` son el mismo paquete. Quita los espacios de sobra de cada línea.',
        ],
        codigo: [
          ...REQUISITOS,
          '',
          '',
          'def leer_requirements(texto):',
          '    paquetes = {}',
          '    # Recorre texto.splitlines() y llena el diccionario',
          '    return paquetes',
          '',
          '',
          'print(leer_requirements(REQUISITOS))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Lee el ejemplo completo',
            condicion: 'leer_requirements(REQUISITOS) == {"requests": "2.31.0", "flask": "3.0.0", "python-dotenv": ""}',
          },
          { descripcion: 'Salta comentarios y líneas vacías', condicion: 'leer_requirements("# nada\\n\\n   \\n") == {}' },
          { descripcion: 'Quita espacios de sobra', condicion: 'leer_requirements("  numpy == 1.26.0  ") == {"numpy": "1.26.0"}' },
          { descripcion: 'Los nombres quedan en minúsculas', condicion: 'list(leer_requirements("Django==5.0")) == ["django"]' },
        ],
        pistas: [
          'Recorre `for linea in texto.splitlines():` y quita espacios con `linea = linea.strip()`. Si queda vacía o empieza con `"#"`, usa `continue`.',
          '`nombre, _, version = linea.partition("==")` parte la línea en tres; si no hay `==`, `version` queda en `""`.',
          'Guarda `paquetes[nombre.strip().lower()] = version.strip()`.',
        ],
        solucion: [...REQUISITOS, '', '', ...LEER_RESUELTO, '', '', 'print(leer_requirements(REQUISITOS))'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿qué falta instalar?',
        texto: [
          'Clonaste el proyecto de un compañero, activaste tu `.venv` y corriste `pip freeze`, que muestra lo que tienes instalado con el mismo formato `nombre==versión`. Escribe `que_instalar(requisitos, instalado)`: devuelve la lista **ordenada alfabéticamente** de los paquetes del `requirements.txt` que no tienes, o que tienes en **otra versión**.',
          'Si el requisito no pide versión (`""`), basta con que esté instalado, en cualquier versión. Reutiliza `leer_requirements` para leer los dos textos.',
        ],
        codigo: [
          ...REQUISITOS,
          'PIP_FREEZE = """',
          'requests==2.25.0',
          'python-dotenv==1.0.0',
          'numpy==1.26.0',
          '"""',
          '',
          '',
          ...LEER_RESUELTO,
          '',
          '',
          'def que_instalar(requisitos, instalado):',
          '    pedidos = leer_requirements(requisitos)',
          '    tengo = leer_requirements(instalado)',
          '    return []',
          '',
          '',
          'print("Instala:", que_instalar(REQUISITOS, PIP_FREEZE))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'En el ejemplo faltan flask (no está) y requests (otra versión)', condicion: 'que_instalar(REQUISITOS, PIP_FREEZE) == ["flask", "requests"]' },
          { descripcion: 'Con todo igual no falta nada', condicion: 'que_instalar("a==1\\nb==2", "b==2\\na==1") == []' },
          { descripcion: 'Sin versión pedida, cualquier versión sirve', condicion: 'que_instalar("python-dotenv", "python-dotenv==1.0.0") == []' },
          { descripcion: 'Con nada instalado falta todo, en orden', condicion: 'que_instalar("zeta==1\\nalfa==2", "") == ["alfa", "zeta"]' },
          { descripcion: 'No le importan las mayúsculas', condicion: 'que_instalar("Flask==3.0.0", "flask==3.0.0") == []' },
        ],
        pistas: [
          'Recorre `for nombre, version in pedidos.items():`. Falta si `nombre not in tengo`.',
          'También falta si pide una versión y no coincide: `version != "" and tengo[nombre] != version`.',
          'Junta los que faltan en una lista y devuelve `sorted(faltan)`.',
        ],
        solucion: [
          ...REQUISITOS,
          'PIP_FREEZE = """',
          'requests==2.25.0',
          'python-dotenv==1.0.0',
          'numpy==1.26.0',
          '"""',
          '',
          '',
          ...LEER_RESUELTO,
          '',
          '',
          'def que_instalar(requisitos, instalado):',
          '    pedidos = leer_requirements(requisitos)',
          '    tengo = leer_requirements(instalado)',
          '    faltan = [',
          '        nombre',
          '        for nombre, version in pedidos.items()',
          '        # Falta si no está, o si se pidió una versión exacta y la mía es otra.',
          '        if nombre not in tengo or (version != "" and tengo[nombre] != version)',
          '    ]',
          '    return sorted(faltan)',
          '',
          '',
          'print("Instala:", que_instalar(REQUISITOS, PIP_FREEZE))',
        ].join('\n'),
      },
    ],
  });
})();

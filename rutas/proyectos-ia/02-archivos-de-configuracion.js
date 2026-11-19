// Ruta "Entender proyectos hechos con IA", lección 2. Mismo formato que
// 01-el-mapa-del-proyecto.js. Se leen package.json (JSON) y requirements.txt
// (texto, un paquete por línea), que son la "ficha técnica" de un proyecto.

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'archivos-de-configuracion',
    titulo: 'Archivos de configuración',
    pasos: [
      {
        id: 'idea',
        titulo: 'La ficha técnica del proyecto',
        texto: [
          'Antes de leer una sola línea de código, dos archivos te dicen casi todo: **qué usa** el proyecto y **cómo se arranca**.',
          '**`package.json`** es la ficha de un proyecto de JavaScript (está en `frontend/`). Es JSON. En `"scripts"` están los comandos con nombre: `"dev": "vite"` significa que `npm run dev` ejecuta `vite`. En `"dependencies"` están las librerías que la página necesita para funcionar (React), y en `"devDependencies"` las que solo usas mientras programas (Vite, que sirve y empaqueta la página; Vitest, que corre pruebas).',
          '**`requirements.txt`** es la ficha de un proyecto de Python (está en `backend/`). Es texto: un paquete por línea, con su versión (`flask==3.0.3`). `pip install -r requirements.txt` los instala todos.',
          'Corre el ejemplo: lee `package.json` con `json.loads` (lo viste en la ruta de Python) y recorre `requirements.txt` línea por línea. Compara lo que sale con la sección "Cómo arrancarlo" del README: coinciden, porque el README se escribe a partir de estos archivos.',
        ],
        codigo: [
          'import json',
          'import proyecto',
          '',
          'archivos = proyecto.abrir()',
          '',
          'paquete = json.loads(archivos["frontend/package.json"])',
          'print("Proyecto:", paquete["name"], "versión", paquete["version"])',
          'print()',
          'print("Comandos (npm run <nombre>):")',
          'for nombre, comando in paquete["scripts"].items():',
          '    print("  npm run", nombre, "->", comando)',
          'print()',
          'print("La página necesita:", list(paquete["dependencies"]))',
          'print("Solo para programar:", list(paquete["devDependencies"]))',
          'print()',
          'print("El backend necesita (requirements.txt):")',
          'for linea in archivos["backend/requirements.txt"].split("\\n"):',
          '    if linea:',
          '        print("  ", linea)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Cómo se arranca?',
        texto: [
          'Te pasan un proyecto de JavaScript y no trae README. Con el `package.json` te basta: primero siempre `npm install` (descarga las librerías) y después el script para arrancar.',
          'Crea el cuerpo de `como_se_arranca(texto)`: recibe el **texto** de un `package.json` y devuelve la lista de comandos. Si hay un script `"dev"`, el segundo comando es `"npm run dev"` (es el que se usa mientras se programa). Si no, pero hay `"start"`, es `"npm start"` (ese no necesita `run`: es un atajo de npm). Si no hay ninguno, la lista solo tiene `"npm install"`.',
          'Cuidado: un `package.json` puede no tener la clave `"scripts"`.',
        ],
        codigo: [
          'import json',
          'import proyecto',
          '',
          '',
          'def como_se_arranca(texto):',
          '    paquete = json.loads(texto)',
          '    return ["npm install", "npm start"]',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(como_se_arranca(archivos["frontend/package.json"]))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El frontend de Don Pepe se arranca con npm run dev',
            condicion:
              'como_se_arranca(__import__("proyecto").abrir()["frontend/package.json"]) == ["npm install", "npm run dev"]',
          },
          {
            descripcion: 'Si solo hay "start", se arranca con npm start',
            condicion: 'como_se_arranca(\'{"scripts": {"start": "node servidor.js"}}\') == ["npm install", "npm start"]',
          },
          {
            descripcion: 'Si hay "dev" y "start", gana "dev"',
            condicion:
              'como_se_arranca(\'{"scripts": {"start": "next start", "dev": "next dev"}}\') == ["npm install", "npm run dev"]',
          },
          {
            descripcion: 'Sin scripts (o sin la clave "scripts") solo se instala',
            condicion:
              'como_se_arranca(\'{"name": "x"}\') == ["npm install"] and como_se_arranca(\'{"scripts": {"test": "vitest"}}\') == ["npm install"]',
          },
        ],
        pistas: [
          '`paquete.get("scripts", {})` te da los scripts, o un diccionario vacío si no hay.',
          'Pregunta con `in`: `if "dev" in scripts:` ... `elif "start" in scripts:` ...',
          'Empieza con `comandos = ["npm install"]` y devuelve `comandos + ["npm run dev"]`, `comandos + ["npm start"]` o `comandos`.',
        ],
        solucion: [
          'import json',
          'import proyecto',
          '',
          '',
          'def como_se_arranca(texto):',
          '    scripts = json.loads(texto).get("scripts", {})',
          '    comandos = ["npm install"]',
          '    if "dev" in scripts:',
          '        return comandos + ["npm run dev"]',
          '    if "start" in scripts:',
          '        return comandos + ["npm start"]',
          '    return comandos',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(como_se_arranca(archivos["frontend/package.json"]))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿qué hay que instalar?',
        texto: [
          'Crea `que_instalar(archivos)`: devuelve un diccionario con dos listas **ordenadas**: `"npm"`, con los nombres de todas las librerías de los `package.json` del proyecto (`dependencies` y `devDependencies` juntas), y `"pip"`, con los nombres de los paquetes de los `requirements.txt`, sin versión y en minúsculas.',
          'Un archivo es `package.json` o `requirements.txt` si ese es el **último pedazo** de su ruta (`ruta.split("/")[-1]`): así sirve aunque el proyecto los tenga en otras carpetas. Ojo: `package-lock.json` no cuenta.',
          'En `requirements.txt` hay que ignorar líneas vacías y comentarios (empiezan con `#`), y la versión puede venir con `==`, `>=` o `~=`. El nombre de un paquete solo tiene letras, números, `-`, `_` y `.`: una expresión regular lo saca limpio.',
        ],
        codigo: [
          'import json',
          'import re',
          'import proyecto',
          '',
          '',
          'def que_instalar(archivos):',
          '    npm = []',
          '    pip = []',
          '    return {"npm": npm, "pip": pip}',
          '',
          '',
          'print(que_instalar(proyecto.abrir()))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Las librerías de npm de Don Pepe, juntas y ordenadas',
            condicion:
              'que_instalar(__import__("proyecto").abrir())["npm"] == ["@vitejs/plugin-react", "react", "react-dom", "vite", "vitest"]',
          },
          {
            descripcion: 'Los paquetes de pip de Don Pepe, sin versión',
            condicion:
              'que_instalar(__import__("proyecto").abrir())["pip"] == ["flask", "flask-cors", "pytest", "python-dotenv"]',
          },
          {
            descripcion: 'Ignora comentarios y líneas vacías, y entiende >= y ~=',
            condicion:
              'que_instalar({"api/requirements.txt": "# Servidor\\n\\nDjango>=5.0\\nrequests~=2.32.3\\n"}) == {"npm": [], "pip": ["django", "requests"]}',
          },
          {
            descripcion: 'Un package.json sin devDependencies también sirve, y el lock no cuenta',
            condicion:
              'que_instalar({"web/package.json": \'{"dependencies": {"next": "14.2.5"}}\', "web/package-lock.json": \'{"dependencies": {"zzz": "1.0.0"}}\'}) == {"npm": ["next"], "pip": []}',
          },
        ],
        pistas: [
          'Recorre `for ruta, contenido in archivos.items():` y mira `nombre = ruta.split("/")[-1]`. Si es `"package.json"`, carga el JSON y suma `list(datos.get("dependencies", {}))` y lo mismo con `"devDependencies"`.',
          'Si es `"requirements.txt"`, recorre sus líneas y quédate con `re.match(r"[A-Za-z0-9_.-]+", linea.strip())`. Si la línea empieza con `#` o está vacía, sáltala con `continue`.',
          'Para cada coincidencia: `pip.append(encontrado.group(0).lower())`. Al final: `return {"npm": sorted(npm), "pip": sorted(pip)}`.',
        ],
        solucion: [
          'import json',
          'import re',
          'import proyecto',
          '',
          '',
          'def que_instalar(archivos):',
          '    npm = []',
          '    pip = []',
          '    for ruta, contenido in archivos.items():',
          '        nombre = ruta.split("/")[-1]',
          '        if nombre == "package.json":',
          '            datos = json.loads(contenido)',
          '            npm = npm + list(datos.get("dependencies", {})) + list(datos.get("devDependencies", {}))',
          '        elif nombre == "requirements.txt":',
          '            for linea in contenido.split("\\n"):',
          '                linea = linea.strip()',
          '                if linea == "" or linea.startswith("#"):',
          '                    continue',
          '                encontrado = re.match(r"[A-Za-z0-9_.-]+", linea)',
          '                if encontrado:',
          '                    pip.append(encontrado.group(0).lower())',
          '    return {"npm": sorted(npm), "pip": sorted(pip)}',
          '',
          '',
          'print(que_instalar(proyecto.abrir()))',
        ].join('\n'),
      },
    ],
  }
);

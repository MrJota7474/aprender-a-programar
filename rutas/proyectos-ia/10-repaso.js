// Ruta "Entender proyectos hechos con IA", lección 10: el repaso. Mismo
// formato que 01-el-mapa-del-proyecto.js. La versión "repaso" del proyecto
// (ver 00-modulo-proyecto.js) trae tres problemas: falta flask-cors en
// requirements.txt, hay una clave escrita en app.py y la ruta de crear
// pedidos cambió de nombre. El reto se revisa por comportamiento: el backend
// arranca, las pruebas pasan, la clave sale del entorno y el frontend
// encuentra todas sus rutas.

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'repaso',
    titulo: 'Repaso: el proyecto que te entregaron',
    pasos: [
      {
        id: 'idea',
        titulo: 'Tu primer día con un proyecto ajeno',
        texto: [
          'Te contratan para seguir con la app de domicilios. La hizo alguien con una IA, a la carrera, y "funcionaba en su computador". En tu primer día, sigue la lista que armaste en esta ruta, en orden:',
          '**1. El mapa:** README, carpetas y puntos de entrada. **2. La ficha técnica:** `package.json` y `requirements.txt`: qué se instala y cómo se arranca. **3. Arrancarlo** de cero, como un servidor nuevo: si algo no está en `requirements.txt`, aquí revienta. **4. Correr las pruebas**: te dicen qué se rompió y dónde. **5. Secretos:** que no haya claves en el código. **6. El contrato:** que cada llamada del frontend tenga quien la conteste en el backend.',
          'Corre el ejemplo con la versión que te entregaron. Lee los errores despacio: cada uno dice el archivo y la línea. Fíjate también en lo que **no** sale: la clave escrita en el código no hace fallar ninguna prueba. Por eso existe el paso 5.',
        ],
        codigo: [
          'import proyecto',
          '',
          'archivos = proyecto.abrir("repaso")',
          '',
          'print("3. Arrancar el backend:")',
          'try:',
          '    proyecto.servidor(archivos)',
          '    print("   Arrancó.")',
          'except proyecto.ErrorDelProyecto as error:',
          '    print("  ", error)',
          '',
          'print("4. Las pruebas:")',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(archivos))',
          '',
          'print("5. ¿Claves en el código?")',
          'for linea in proyecto.buscar(archivos, "sk_live_"):',
          '    print("  ", linea)',
          '',
          'print("6. Lo que el frontend le pide al backend:")',
          'for metodo, ruta in proyecto.llamadas_fetch(archivos):',
          '    print("  ", metodo, ruta)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'La librería que falta',
        texto: [
          '"En mi computador funciona" casi siempre significa: **instalé algo a mano y no lo anoté** en `requirements.txt`. En un servidor nuevo, ese `import` revienta. Crea el cuerpo de `dependencias_faltantes(archivos)`: devuelve, ordenados y sin repetir, los nombres de **pip** que el backend importa y no están en `backend/requirements.txt`.',
          'Revisa los archivos `.py` de `backend/` (también las pruebas) y saca el primer nombre de cada `import x` o `from x import y` (`flask_cors`, de `from flask_cors import CORS`). No cuentan los de la librería estándar (`ESTANDAR`) ni los **del mismo proyecto**: si existe `backend/precios.py`, entonces `precios` es propio.',
          'Detalle importante: el nombre con el que se importa **no siempre** es el de pip. Se importa `flask_cors` pero se instala `flask-cors`; se importa `dotenv` pero se instala `python-dotenv`. Para eso está `NOMBRE_EN_PIP`; si un nombre no está en la tabla, se usa igual. En `requirements.txt` compara en minúsculas.',
        ],
        codigo: [
          'import re',
          'import proyecto',
          '',
          'ESTANDAR = {"os", "sys", "json", "re", "math", "datetime", "random", "time"}',
          'NOMBRE_EN_PIP = {"flask_cors": "flask-cors", "dotenv": "python-dotenv", "jwt": "pyjwt"}',
          '',
          '',
          'def dependencias_faltantes(archivos):',
          '    faltan = set()',
          '    return sorted(faltan)',
          '',
          '',
          'print(dependencias_faltantes(proyecto.abrir("repaso")))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'En el proyecto que te entregaron falta flask-cors',
            condicion: 'dependencias_faltantes(__import__("proyecto").abrir("repaso")) == ["flask-cors"]',
          },
          {
            descripcion: 'En el proyecto original no falta nada (precios, datos y app son propios)',
            condicion: 'dependencias_faltantes(__import__("proyecto").abrir()) == []',
          },
          {
            descripcion: 'Traduce el nombre de import al de pip',
            condicion:
              'dependencias_faltantes({"backend/requirements.txt": "flask==3.0.3\\n", "backend/app.py": "from dotenv import load_dotenv\\nimport jwt\\nimport flask"}) == ["pyjwt", "python-dotenv"]',
          },
          {
            descripcion: 'Entiende imports con punto y compara en minúsculas',
            condicion:
              'dependencias_faltantes({"backend/requirements.txt": "Flask==3.0.3\\n", "backend/app.py": "import os.path\\nfrom flask.json import dumps\\nimport requests"}) == ["requests"]',
          },
          {
            descripcion: 'También revisa las pruebas y no repite',
            condicion:
              'dependencias_faltantes({"backend/requirements.txt": "", "backend/app.py": "import requests", "backend/tests/test_app.py": "import requests\\nimport pytest"}) == ["pytest", "requests"]',
          },
        ],
        pistas: [
          'Los módulos propios: `propios = {r.split("/")[-1][:-3] for r in archivos if r.startswith("backend/") and r.endswith(".py")}`. Los instalados: el nombre de cada línea de `requirements.txt` en minúsculas (como en la lección 2).',
          'Para cada `.py` de `backend/`, `re.findall(r"^(?:import|from)\\s+(\\w+)", contenido, re.MULTILINE)` te da el primer nombre de cada import (`\\w+` se detiene en el punto de `os.path`).',
          'Por cada nombre que no esté en `ESTANDAR` ni en `propios`: `pip = NOMBRE_EN_PIP.get(nombre, nombre)`, y si `pip` no está en los instalados, `faltan.add(pip)`.',
        ],
        solucion: [
          'import re',
          'import proyecto',
          '',
          'ESTANDAR = {"os", "sys", "json", "re", "math", "datetime", "random", "time"}',
          'NOMBRE_EN_PIP = {"flask_cors": "flask-cors", "dotenv": "python-dotenv", "jwt": "pyjwt"}',
          '',
          '',
          'def instalados(archivos):',
          '    nombres = set()',
          '    for linea in archivos.get("backend/requirements.txt", "").split("\\n"):',
          '        encontrado = re.match(r"[A-Za-z0-9_.-]+", linea.strip())',
          '        if encontrado and not linea.strip().startswith("#"):',
          '            nombres.add(encontrado.group(0).lower())',
          '    return nombres',
          '',
          '',
          'def dependencias_faltantes(archivos):',
          '    del_backend = [r for r in archivos if r.startswith("backend/") and r.endswith(".py")]',
          '    propios = {r.split("/")[-1][:-3] for r in del_backend}',
          '    hay = instalados(archivos)',
          '    faltan = set()',
          '    for ruta in del_backend:',
          '        for nombre in re.findall(r"^(?:import|from)\\s+(\\w+)", archivos[ruta], re.MULTILINE):',
          '            if nombre in ESTANDAR or nombre in propios:',
          '                continue',
          '            pip = NOMBRE_EN_PIP.get(nombre, nombre)',
          '            if pip not in hay:',
          '                faltan.add(pip)',
          '    return sorted(faltan)',
          '',
          '',
          'print(dependencias_faltantes(proyecto.abrir("repaso")))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: déjalo listo para trabajar',
        texto: [
          'Arregla los tres problemas del proyecto que te entregaron, con `proyecto.editar`, y deja el resultado en `arreglado`. Ve en orden, corriendo después de cada arreglo: cada uno deja ver el siguiente.',
          '**1.** Agrega `flask-cors==4.0.1` a `backend/requirements.txt`. **2.** Saca la clave de `app.py`: que vuelva a leerse con `os.environ.get("CLAVE_PAGOS", "")`. (En la vida real, además, esa clave ya se considera robada: hay que **cambiarla** en la pasarela de pagos.) **3.** Ya con el backend arrancando, las pruebas te muestran el último problema: una ruta del backend que no coincide con la que llama el frontend. Decide de qué lado arreglarlo; pista: las pruebas del backend y la página están de acuerdo entre ellas.',
          'Las pruebas de esta lección revisan que solo toques `requirements.txt` y `app.py` (partir del proyecto original o cambiar las pruebas no vale) y el comportamiento: que el backend arranque, que pasen las 8 pruebas del proyecto, que no quede ninguna clave escrita, que la clave se tome del entorno y que cada llamada del frontend tenga quien la conteste.',
        ],
        codigo: [
          'import proyecto',
          '',
          'entregado = proyecto.abrir("repaso")',
          '',
          '# Tus arreglos aquí, uno por uno, con proyecto.editar(...)',
          'arreglado = entregado',
          '',
          'try:',
          '    cliente = proyecto.servidor(arreglado)',
          '    print("El backend arranca.")',
          'except proyecto.ErrorDelProyecto as error:',
          '    print(error)',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(arreglado))',
        ].join('\n'),
        pruebas: [
          {
            // Sin esta prueba, abrir el proyecto original o "arreglar" las
            // pruebas del backend también pasaba. Los arreglos solo tocan
            // requirements.txt y app.py; todo lo demás debe quedar como llegó.
            descripcion: 'Solo cambiaste backend/requirements.txt y backend/app.py: el resto queda como te lo entregaron',
            condicion:
              '(e := __import__("proyecto").abrir("repaso")) and {r: c for r, c in arreglado.items() if r not in ("backend/requirements.txt", "backend/app.py")} == {r: c for r, c in e.items() if r not in ("backend/requirements.txt", "backend/app.py")}',
          },
          {
            descripcion: 'El backend arranca en un servidor nuevo',
            condicion: '__import__("proyecto").servidor(arreglado).get("/api/menu").status_code == 200',
          },
          {
            descripcion: 'Pasan las 8 pruebas del proyecto',
            condicion: '(r := __import__("proyecto").correr_pruebas(arreglado))["fallas"] == [] and r["total"] == 8',
          },
          {
            descripcion: 'No queda ninguna clave escrita en el proyecto',
            condicion: 'not any("sk_live_" in contenido for contenido in arreglado.values())',
          },
          {
            descripcion: 'La clave se toma del entorno: con CLAVE_PAGOS hay pagos, sin ella no',
            condicion:
              '__import__("proyecto").servidor(arreglado, {"CLAVE_PAGOS": "clave_de_prueba"}).get("/api/estado").get_json()["pagos_configurados"] is True and __import__("proyecto").servidor(arreglado).get("/api/estado").get_json()["pagos_configurados"] is False',
          },
          {
            descripcion: 'Cada llamada del frontend tiene quien la conteste en el backend',
            condicion:
              '(c := __import__("proyecto").servidor(arreglado)) and len(__import__("proyecto").llamadas_fetch(arreglado)) == 2 and all(c.open(ruta, method=metodo).status_code not in (404, 405) for metodo, ruta in __import__("proyecto").llamadas_fetch(arreglado))',
          },
        ],
        pistas: [
          'Requirements: `paso1 = proyecto.editar(entregado, "backend/requirements.txt", "flask==3.0.3\\n", "flask==3.0.3\\nflask-cors==4.0.1\\n")`. Busca la clave con `proyecto.buscar(paso1, "sk_live_")` y reemplaza esa línea completa por `CLAVE_PAGOS = os.environ.get("CLAVE_PAGOS", "")` (app.py ya tiene `import os`).',
          'Con eso el backend arranca y fallan tres pruebas de `test_api.py` con 404: piden `POST /api/pedidos`. Busca `@app.post` en `app.py`: la IA le quitó la "s".',
          'Arréglalo en el backend: `proyecto.editar(paso2, "backend/app.py", \'@app.post("/api/pedido")\', \'@app.post("/api/pedidos")\')`. Si lo cambiaras en el frontend, las pruebas del backend seguirían fallando.',
        ],
        solucion: [
          'import proyecto',
          '',
          'entregado = proyecto.abrir("repaso")',
          '',
          '# 1. La librería que faltaba',
          'paso1 = proyecto.editar(',
          '    entregado, "backend/requirements.txt", "flask==3.0.3\\n", "flask==3.0.3\\nflask-cors==4.0.1\\n"',
          ')',
          '# 2. La clave sale del entorno, no del código',
          'paso2 = proyecto.editar(',
          '    paso1,',
          '    "backend/app.py",',
          '    \'CLAVE_PAGOS = "sk_live_EJEMPLO_no_es_real_9f8e7d"\',',
          '    \'CLAVE_PAGOS = os.environ.get("CLAVE_PAGOS", "")\',',
          ')',
          '# 3. La ruta vuelve a llamarse como la usan la página y las pruebas',
          'arreglado = proyecto.editar(paso2, "backend/app.py", \'@app.post("/api/pedido")\', \'@app.post("/api/pedidos")\')',
          '',
          'try:',
          '    cliente = proyecto.servidor(arreglado)',
          '    print("El backend arranca.")',
          'except proyecto.ErrorDelProyecto as error:',
          '    print(error)',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(arreglado))',
        ].join('\n'),
      },
    ],
  }
);

// Ruta "Entender proyectos hechos con IA", lección 9. Mismo formato que
// 01-el-mapa-del-proyecto.js. La versión "cambio-ia" del proyecto (ver
// 00-modulo-proyecto.js) es un cambio con las pruebas en verde que, sin
// embargo, quitó una validación. En el reto se comprueba también que las
// pruebas del estudiante PROTEJAN la regla: si alguien la vuelve a borrar,
// deben fallar.

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'revisar-y-cambiar',
    titulo: 'Revisar y cambiar lo que hizo la IA',
    pasos: [
      {
        id: 'idea',
        titulo: 'Leer un diff',
        texto: [
          'Le pidieron a una IA: **"agrega el teléfono del cliente al pedido"**. Terminó, dijo "listo, las pruebas pasan" y es verdad: pasan. ¿Lo aceptas? Antes, mira **qué cambió**. Eso se lee en un **diff** (lo que muestran `git diff` y cada pull request).',
          'Cómo se lee: `diff --git a/ruta b/ruta` dice qué archivo cambió. `---` es la versión de antes y `+++` la de después. `@@ -7,6 +7,6 @@` dice dónde: desde la línea 7, 6 líneas antes y 6 después. Las líneas con **`-`** se quitaron, las de **`+`** se agregaron, y las que empiezan con un espacio no cambiaron (están para dar contexto).',
          'Lo que hay que buscar con lupa: **líneas quitadas** (sobre todo validaciones y pruebas), cambios en archivos que no tenían que ver con el pedido, claves escritas a mano, `except: pass` que esconden errores. Una IA que no logra que una prueba pase a veces **cambia la prueba**. Las pruebas en verde no bastan si alguien cambió las pruebas.',
          'Corre el ejemplo y lee el diff con calma, línea por línea, antes de seguir. ¿Qué se perdió?',
        ],
        codigo: [
          'import proyecto',
          '',
          'antes = proyecto.abrir()',
          'despues = proyecto.abrir("cambio-ia")',
          '',
          'print("Pedido: agrega el teléfono del cliente al pedido.")',
          'print("La IA dice: listo, las pruebas pasan.")',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(despues))',
          'print()',
          'print(proyecto.diff(antes, despues))',
          'print()',
          'cliente = proyecto.servidor(despues)',
          'sin_direccion = {"direccion": "", "telefono": "3001234567", "items": [{"id": 1, "cantidad": 1}]}',
          'respuesta = cliente.post("/api/pedidos", json=sin_direccion)',
          'print("Un pedido SIN dirección ahora responde:", respuesta.status_code)',
          'print("¿A dónde manda Don Pepe ese domicilio?")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Lo que se quitó',
        texto: [
          'En un diff largo, lo primero que conviene mirar es lo que se **quitó**: agregar casi nunca rompe lo que ya funcionaba, quitar sí. Crea el cuerpo de `lineas_quitadas(diff)`: recibe el texto de un diff y devuelve una lista de parejas `(ruta, línea)` con cada línea quitada, sin el `-` del comienzo.',
          'La ruta sale de la línea `diff --git a/ruta b/ruta`: es lo que va después de `" b/"`. Ojo con la cabecera: las líneas que empiezan con `--- a/` o `--- /dev/null` empiezan con `-` pero **no** son líneas quitadas. En cambio, una línea quitada que decía `-- comentario` (así se comenta en SQL) aparece como `--- comentario`, y esa sí cuenta.',
        ],
        codigo: [
          'import proyecto',
          '',
          '',
          'def lineas_quitadas(diff):',
          '    # Todavía no sabe en qué archivo va, y se traga la cabecera',
          '    quitadas = []',
          '    for linea in diff.split("\\n"):',
          '        if linea.startswith("-"):',
          '            quitadas.append(("?", linea[1:]))',
          '    return quitadas',
          '',
          '',
          'cambio = proyecto.diff(proyecto.abrir(), proyecto.abrir("cambio-ia"))',
          'for ruta, linea in lineas_quitadas(cambio):',
          '    print(ruta, "|", linea)',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Encuentra las 5 líneas que quitó la IA',
            condicion: 'len(lineas_quitadas(__import__("proyecto").diff(__import__("proyecto").abrir(), __import__("proyecto").abrir("cambio-ia")))) == 5',
          },
          {
            descripcion: 'Entre ellas, la validación de la dirección, con su archivo',
            condicion:
              '("backend/validacion.py", \'    if not str(pedido.get("direccion", "")).strip():\') in lineas_quitadas(__import__("proyecto").diff(__import__("proyecto").abrir(), __import__("proyecto").abrir("cambio-ia")))',
          },
          {
            descripcion: 'Y la prueba que la protegía',
            condicion:
              '("backend/tests/test_api.py", "def test_pedido_sin_direccion_se_rechaza():") in lineas_quitadas(__import__("proyecto").diff(__import__("proyecto").abrir(), __import__("proyecto").abrir("cambio-ia")))',
          },
          {
            descripcion: 'No confunde la cabecera con líneas quitadas, pero sí cuenta un "-- comentario"',
            condicion:
              'lineas_quitadas("diff --git a/db/esquema.sql b/db/esquema.sql\\n--- a/db/esquema.sql\\n+++ b/db/esquema.sql\\n@@ -1,2 +1,1 @@\\n--- tabla vieja\\n CREATE TABLE pedidos (id INTEGER);") == [("db/esquema.sql", "-- tabla vieja")]',
          },
          {
            descripcion: 'Entiende un archivo borrado (--- a/ y +++ /dev/null)',
            condicion:
              'lineas_quitadas("diff --git a/viejo.py b/viejo.py\\n--- a/viejo.py\\n+++ /dev/null\\n@@ -1 +0,0 @@\\n-print(1)\\ndiff --git a/nuevo.py b/nuevo.py\\n--- /dev/null\\n+++ b/nuevo.py\\n@@ -0,0 +1 @@\\n+print(2)") == [("viejo.py", "print(1)")]',
          },
        ],
        pistas: [
          'Recorre las líneas guardando en qué archivo vas: `if linea.startswith("diff --git "): ruta = linea.split(" b/", 1)[1]`.',
          'Salta la cabecera: `elif linea.startswith("--- a/") or linea.startswith("--- /dev/null"): continue`.',
          'Y las quitadas: `elif linea.startswith("-"): quitadas.append((ruta, linea[1:]))`. El `[1:]` quita el `-` del comienzo.',
        ],
        solucion: [
          'import proyecto',
          '',
          '',
          'def lineas_quitadas(diff):',
          '    quitadas = []',
          '    ruta = None',
          '    for linea in diff.split("\\n"):',
          '        if linea.startswith("diff --git "):',
          '            ruta = linea.split(" b/", 1)[1]',
          '        elif linea.startswith("--- a/") or linea.startswith("--- /dev/null"):',
          '            continue',
          '        elif linea.startswith("-"):',
          '            quitadas.append((ruta, linea[1:]))',
          '    return quitadas',
          '',
          '',
          'cambio = proyecto.diff(proyecto.abrir(), proyecto.abrir("cambio-ia"))',
          'for ruta, linea in lineas_quitadas(cambio):',
          '    print(ruta, "|", linea)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: arréglalo tú, sin romper nada',
        texto: [
          'No hace falta volver a pedírselo a la IA: el arreglo es pequeño y ya sabes dónde está. Parte de la versión de la IA y, con `proyecto.editar(archivos, ruta, viejo, nuevo)`, devuelve la validación de la dirección **sin quitar** la del teléfono, y devuelve también la prueba `test_pedido_sin_direccion_se_rechaza` (copia sus líneas del diff). `editar` funciona como la herramienta Edit de Claude Code: el texto viejo debe aparecer **una sola vez**, y devuelve un proyecto nuevo.',
          'Las pruebas de esta lección revisan que las pruebas del proyecto pasen, que el backend rechace pedidos sin dirección **y** sin teléfono, y algo más fino: que **tus pruebas protejan las dos reglas**. Si alguien vuelve a borrar una de las validaciones, alguna prueba del proyecto debe fallar.',
          'Mira el diff que imprime el código: muestra solo lo que **tú** cambiaste. Así se revisa también un cambio propio antes de entregarlo.',
        ],
        codigo: [
          'import proyecto',
          '',
          'de_la_ia = proyecto.abrir("cambio-ia")',
          '',
          '# Tus cambios aquí, con proyecto.editar(...)',
          'arreglado = de_la_ia',
          '',
          'print(proyecto.diff(de_la_ia, arreglado))',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(arreglado))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Las pruebas del proyecto pasan',
            condicion: '(r := __import__("proyecto").correr_pruebas(arreglado))["fallas"] == [] and r["total"] > 0',
          },
          {
            descripcion: 'El backend rechaza un pedido sin dirección',
            condicion:
              '(r := __import__("proyecto").servidor(arreglado).post("/api/pedidos", json={"direccion": "", "telefono": "3001234567", "items": [{"id": 1, "cantidad": 1}]})).status_code == 400 and "Falta la dirección" in r.get_json()["errores"]',
          },
          {
            descripcion: 'Y sigue rechazando un pedido sin teléfono',
            condicion:
              '__import__("proyecto").servidor(arreglado).post("/api/pedidos", json={"direccion": "Calle 10", "telefono": "", "items": [{"id": 1, "cantidad": 1}]}).status_code == 400',
          },
          {
            descripcion: 'Un pedido completo se guarda con su teléfono',
            condicion:
              '(r := __import__("proyecto").servidor(arreglado).post("/api/pedidos", json={"direccion": "Calle 10", "telefono": "3001234567", "items": [{"id": 1, "cantidad": 1}]})).status_code == 201 and r.get_json()["telefono"] == "3001234567"',
          },
          {
            descripcion: 'Tus pruebas protegen la dirección: si alguien borra esa validación, fallan',
            condicion:
              '__import__("proyecto").correr_pruebas({**arreglado, "backend/validacion.py": __import__("proyecto").abrir("cambio-ia")["backend/validacion.py"]})["fallas"] != []',
          },
          {
            descripcion: 'Y protegen el teléfono: si alguien borra esa validación, fallan',
            condicion:
              '__import__("proyecto").correr_pruebas({**arreglado, "backend/validacion.py": __import__("proyecto").abrir()["backend/validacion.py"]})["fallas"] != []',
          },
        ],
        pistas: [
          'Para la validación, inserta las dos líneas justo después de `errores = []`: `proyecto.editar(de_la_ia, "backend/validacion.py", "    errores = []\\n", "    errores = []\\n" + LAS_DOS_LINEAS)`. Las dos líneas son las que el diff muestra con `-` en `validacion.py`.',
          'Para la prueba, edita el resultado anterior (no `de_la_ia`, o perderías el primer arreglo). Un buen ancla es la línea `def test_producto_que_no_existe_se_rechaza():` : reemplázala por la prueba completa, dos líneas en blanco y esa misma línea.',
          'La prueba completa son tres líneas: `def test_pedido_sin_direccion_se_rechaza():`, `    respuesta = cliente.post("/api/pedidos", json={**PEDIDO, "direccion": ""})` y `    assert respuesta.status_code == 400`. Une todo con `\\n`.',
        ],
        solucion: [
          'import proyecto',
          '',
          'de_la_ia = proyecto.abrir("cambio-ia")',
          '',
          'con_validacion = proyecto.editar(',
          '    de_la_ia,',
          '    "backend/validacion.py",',
          '    "    errores = []\\n",',
          '    "    errores = []\\n"',
          '    \'    if not str(pedido.get("direccion", "")).strip():\\n\'',
          '    \'        errores.append("Falta la dirección")\\n\',',
          ')',
          'arreglado = proyecto.editar(',
          '    con_validacion,',
          '    "backend/tests/test_api.py",',
          '    "def test_producto_que_no_existe_se_rechaza():",',
          '    "def test_pedido_sin_direccion_se_rechaza():\\n"',
          '    \'    respuesta = cliente.post("/api/pedidos", json={**PEDIDO, "direccion": ""})\\n\'',
          '    "    assert respuesta.status_code == 400\\n"',
          '    "\\n"',
          '    "\\n"',
          '    "def test_producto_que_no_existe_se_rechaza():",',
          ')',
          '',
          'print(proyecto.diff(de_la_ia, arreglado))',
          'proyecto.mostrar_pruebas(proyecto.correr_pruebas(arreglado))',
        ].join('\n'),
      },
    ],
  }
);

// Pruebas del módulo "proyecto" (el proyecto web de ejemplo de la ruta
// "Entender proyectos hechos con IA", con su Flask simulado).
//
// Igual que en agente.test.js, cada prueba corre un programita de Python como
// lo haría un estudiante y revisa lo que imprimió.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

require('../js/python-evaluador.js');
require('../rutas/proyectos-ia/00-modulo-proyecto.js');

const raiz = path.join(__dirname, '..');
const evaluadorListo = import(pathToFileURL(path.join(raiz, 'vendor', 'pyodide', 'pyodide.mjs')).href)
  .then(({ loadPyodide }) => loadPyodide())
  .then(globalThis.crearEvaluadorPython);

async function salidaDe(codigo) {
  const evaluar = await evaluadorListo;
  const resultado = evaluar('import proyecto\n' + codigo, [], { proyecto: globalThis.MODULOS_PYTHON.proyecto });
  assert.equal(resultado.error, null, JSON.stringify(resultado.error));
  return resultado.salida;
}

// ---------- las tres versiones del proyecto ----------

test('el proyecto original pasa sus 8 pruebas', async () => {
  const salida = await salidaDe('print(proyecto.correr_pruebas(proyecto.abrir()))');

  assert.deepEqual(salida, ["{'pasaron': 8, 'total': 8, 'fallas': []}"]);
});

test('el cambio de la IA también pasa sus pruebas, pero acepta pedidos sin dirección', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir("cambio-ia")
print(proyecto.correr_pruebas(a)["fallas"])
pedido = {"direccion": "", "telefono": "300", "items": [{"id": 1, "cantidad": 1}]}
print(proyecto.servidor(a).post("/api/pedidos", json=pedido).status_code)`);

  assert.deepEqual(salida, ['[]', '201']);
});

test('el proyecto del repaso no arranca porque falta flask-cors en requirements.txt', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir("repaso")
try:
    proyecto.servidor(a)
except proyecto.ErrorDelProyecto as error:
    print(error)
proyecto.mostrar_pruebas(proyecto.correr_pruebas(a))`);

  assert.equal(salida[0], "El backend no arranca. ModuleNotFoundError: No module named 'flask_cors' (backend/app.py, línea 7)");
  assert.match(salida[1], /^Pasaron 4 de 4 pruebas\. Además, 1 archivo\(s\) de pruebas no cargan\.$/);
});

test('abrir() da una copia y avisa si la versión no existe', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
a["README.md"] = "roto"
print(proyecto.abrir()["README.md"] != "roto")
try:
    proyecto.abrir("otra")
except ValueError as error:
    print(error)`);

  assert.deepEqual(salida, ['True', 'No hay una versión "otra". Hay: domicilios, cambio-ia, repaso']);
});

// ---------- el Flask simulado ----------

test('el servidor contesta como Flask: 200, 201, 400, 404, 405 y 415', async () => {
  const salida = await salidaDe(`
c = proyecto.servidor(proyecto.abrir())
print(c.get("/api/menu").status_code, len(c.get("/api/menu").get_json()))
r = c.post("/api/pedidos", json={"direccion": "Calle 1", "items": [{"id": 1, "cantidad": 2}]})
print(r.status_code, r.get_json()["total"], r.get_json()["numero"])
print(c.post("/api/pedidos", json={"items": []}).get_json())
print(c.get("/api/nada").status_code, c.put("/api/menu").status_code, c.post("/api/pedidos").status_code)`);

  assert.deepEqual(salida, [
    '200 4',
    '201 11000 1',
    "{'errores': ['Falta la dirección', 'El pedido no tiene productos']}",
    '404 405 415',
  ]);
});

test('las rutas con <int:...> solo aceptan números y convierten el valor', async () => {
  const salida = await salidaDe(`
c = proyecto.servidor(proyecto.abrir())
c.post("/api/pedidos", json={"direccion": "Calle 1", "items": [{"id": 3, "cantidad": 1}]})
print(c.get("/api/pedidos/1").get_json()["total"], c.get("/api/pedidos/2").status_code, c.get("/api/pedidos/uno").status_code)`);

  assert.deepEqual(salida, ['6000 404 404']);
});

test('un error dentro de una ruta responde 500 sin tumbar el servidor', async () => {
  const salida = await salidaDe(`
a = proyecto.editar(proyecto.abrir(), "backend/app.py", "return jsonify(MENU)", "return jsonify(MENU[99])")
c = proyecto.servidor(a)
print(c.get("/api/menu").status_code, c.get("/api/estado").status_code)`);

  // Como el Flask real, el error queda en la consola con su archivo y línea.
  assert.deepEqual(salida, [
    'Error en GET /api/menu: IndexError: list index out of range (backend/app.py, línea 32)',
    '500 200',
  ]);
});

test('una ruta que devuelve None responde 500; un trío (cuerpo, código, cabeceras) sirve', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
sin_return = proyecto.editar(a, "backend/app.py", '    return jsonify({"ok": True, "pagos_configurados": CLAVE_PAGOS != ""})', "    pass")
print(proyecto.servidor(sin_return).get("/api/estado").status_code)
trio = proyecto.editar(a, "backend/app.py", "    return jsonify(MENU)", '    return jsonify(MENU), 203, {"X-Prueba": "1"}')
r = proyecto.servidor(trio).get("/api/menu")
print(r.status_code, len(r.get_json()))`);

  assert.deepEqual(salida, [
    'Error en GET /api/estado: TypeError: la ruta no devolvió nada (None). ¿Le falta un return?',
    '500',
    '203 4',
  ]);
});

test('request.json funciona igual que request.get_json()', async () => {
  const salida = await salidaDe(`
a = proyecto.editar(proyecto.abrir(), "backend/app.py", "pedido = request.get_json()", "pedido = request.json")
c = proyecto.servidor(a)
print(c.post("/api/pedidos", json={"direccion": "Calle 1", "items": [{"id": 1, "cantidad": 2}]}).get_json()["total"])
print(c.post("/api/pedidos").status_code)`);

  assert.deepEqual(salida, ['11000', '415']);
});

test('la validación no acepta true como id ni como cantidad', async () => {
  const salida = await salidaDe(`
c = proyecto.servidor(proyecto.abrir())
for item in [{"id": True, "cantidad": 1}, {"id": 1, "cantidad": True}]:
    r = c.post("/api/pedidos", json={"direccion": "Calle 1", "items": [item]})
    print(r.status_code, r.get_json()["errores"])`);

  assert.deepEqual(salida, [
    "400 ['Hay un producto que no existe']",
    "400 ['Cada cantidad debe ser un número entero mayor que 0']",
  ]);
});

test('solo se importan las librerías de requirements.txt', async () => {
  const salida = await salidaDe(`
a = proyecto.editar(proyecto.abrir(), "backend/requirements.txt", "flask==3.0.3\\n", "")
try:
    proyecto.servidor(a)
except proyecto.ErrorDelProyecto as error:
    print(error)`);

  assert.deepEqual(salida, ["El backend no arranca. ModuleNotFoundError: No module named 'flask' (backend/app.py, línea 6)"]);
});

test('la clave sale del entorno o de backend/.env, y nada queda en os.environ', async () => {
  const salida = await salidaDe(`
import os, sys
a = proyecto.abrir()
estado = lambda c: c.get("/api/estado").get_json()["pagos_configurados"]
print(estado(proyecto.servidor(a)), estado(proyecto.servidor(a, {"CLAVE_PAGOS": "x"})))
print(estado(proyecto.servidor({**a, "backend/.env": "# pagos\\nCLAVE_PAGOS = \\"y\\"\\n"})))
print("CLAVE_PAGOS" in os.environ, [m for m in ("app", "flask", "precios", "dotenv") if m in sys.modules])`);

  assert.deepEqual(salida, ['False True', 'True', 'False []']);
});

test('una prueba que falla muestra su línea y lo que dio, como pytest', async () => {
  const salida = await salidaDe(`
a = proyecto.editar(proyecto.abrir(), "backend/precios.py", "COSTO_DOMICILIO = 4000", "COSTO_DOMICILIO = 5000")
proyecto.mostrar_pruebas(proyecto.correr_pruebas(a))`);

  assert.equal(salida[0], 'Pasaron 5 de 8 pruebas.');
  // Si la expresión tiene una llamada, no se muestra lo que dio: repetirla
  // podría tener efectos (guardar otro pedido, por ejemplo).
  assert.ok(
    salida.includes(
      '  FALLÓ test_domicilio_se_cobra_en_pedidos_pequenos (backend/tests/test_precios.py, línea 11): assert costo_domicilio(49999) == 4000'
    ),
    salida.join('\n')
  );
});

test('lo que dio un assert se muestra sin repetir llamadas con efectos', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
prueba = '''from app import app
cliente = app.test_client()
def test_n():
    assert cliente.post("/api/pedidos", json={"direccion": "x", "items": [{"id": 1, "cantidad": 1}]}).get_json()["numero"] == 5
def test_v():
    respuesta = cliente.get("/api/menu")
    assert respuesta.status_code == 201
'''
r = proyecto.correr_pruebas({**a, "backend/tests/test_x.py": prueba})
for falla in r["fallas"]:
    print(falla)`);

  assert.deepEqual(salida, [
    'test_n (backend/tests/test_x.py, línea 4): assert cliente.post("/api/pedidos", json={"direccion": "x", "items": [{"id": 1, "cantidad": 1}]}).get_json()["numero"] == 5',
    'test_v (backend/tests/test_x.py, línea 7): assert respuesta.status_code == 201  (dio 200)',
  ]);
});

test('un error de escritura en el backend dice archivo y línea', async () => {
  const salida = await salidaDe(`
a = proyecto.editar(proyecto.abrir(), "backend/app.py", "app = Flask(__name__)", "app = Flask(__name__")
try:
    proyecto.servidor(a)
except proyecto.ErrorDelProyecto as error:
    print(error)`);

  assert.deepEqual(salida, ["El backend no arranca. SyntaxError: '(' was never closed (backend/app.py, línea 16)"]);
});

// ---------- las herramientas ----------

test('editar devuelve un proyecto nuevo y exige que el texto aparezca una sola vez', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
b = proyecto.editar(a, "backend/precios.py", "4000", "4500")
print(a["backend/precios.py"] != b["backend/precios.py"], "4500" in b["backend/precios.py"])
for viejo in ["no está", "@app.get"]:
    try:
        proyecto.editar(a, "backend/app.py", viejo, "x")
    except ValueError as error:
        print(error)`);

  assert.deepEqual(salida, [
    'True True',
    'No encontré ese texto en backend/app.py. Cópialo tal cual, con sus espacios y comillas.',
    'Ese texto aparece 3 veces en backend/app.py. Incluye más texto alrededor para que sea uno solo.',
  ]);
});

test('diff muestra los cambios como git diff', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
b = {**proyecto.editar(a, "backend/precios.py", "COSTO_DOMICILIO = 4000", "COSTO_DOMICILIO = 4500"), "NUEVO.md": "hola"}
print(proyecto.diff(a, b))`);

  assert.deepEqual(salida.slice(0, 3), ['diff --git a/NUEVO.md b/NUEVO.md', '--- /dev/null', '+++ b/NUEVO.md']);
  assert.ok(salida.includes('diff --git a/backend/precios.py b/backend/precios.py'));
  assert.ok(salida.includes('-COSTO_DOMICILIO = 4000'));
  assert.ok(salida.includes('+COSTO_DOMICILIO = 4500'));
});

test('llamadas_fetch, buscar y arbol recorren el proyecto', async () => {
  const salida = await salidaDe(`
a = proyecto.abrir()
print(proyecto.llamadas_fetch(a))
print(proyecto.buscar(a, "@app.post"))
print(proyecto.arbol(a).split("\\n")[:3])`);

  assert.deepEqual(salida, [
    "[('GET', '/api/menu'), ('POST', '/api/pedidos')]",
    "['backend/app.py:35: @app.post(\"/api/pedidos\")']",
    "['domicilios-don-pepe/', '├── .gitignore', '├── CLAUDE.md']",
  ]);
});

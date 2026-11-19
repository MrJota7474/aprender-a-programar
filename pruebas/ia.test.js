// Pruebas del módulo "ia" (el modelo simulado) y de la instalación de
// módulos propios en el evaluador de Python.
//
// Cada prueba corre un programita de Python, igual que lo haría un
// estudiante, y revisa lo que imprimió.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

require('../js/python-evaluador.js');
require('../rutas/ia/00-modulo-ia.js');

const raiz = path.join(__dirname, '..');
const evaluadorListo = import(pathToFileURL(path.join(raiz, 'vendor', 'pyodide', 'pyodide.mjs')).href)
  .then(({ loadPyodide }) => loadPyodide())
  .then(globalThis.crearEvaluadorPython);

const MODULOS = { ia: globalThis.MODULOS_PYTHON.ia };

async function correr(codigo, modulos = MODULOS) {
  const evaluar = await evaluadorListo;
  return evaluar('import ia\n' + codigo, [], modulos);
}

async function salidaDe(codigo) {
  const resultado = await correr(codigo);
  assert.equal(resultado.error, null, JSON.stringify(resultado.error));
  return resultado.salida;
}

const U = (texto) => `{"rol": "usuario", "contenido": ${JSON.stringify(texto)}}`;
const S = (texto) => `{"rol": "sistema", "contenido": ${JSON.stringify(texto)}}`;

// ---------- módulos propios ----------

test('el módulo ia solo existe cuando el motor lo instala', async () => {
  const con = await correr('print("ok")');
  const sin = await correr('print("ok")', {});

  assert.deepEqual(con.salida, ['ok']);
  assert.equal(sin.error.nombre, 'ModuleNotFoundError');
});

test('el módulo se crea de nuevo en cada ejecución (no guarda estado)', async () => {
  await correr(`
try:
    ia.preguntar_inestable([${U('Hola')}])
except ia.ErrorDeServicio:
    pass`);

  const salida = await salidaDe('print(ia._estado["llamadas_inestables"])');

  assert.deepEqual(salida, ['0']);
});

// ---------- forma de la respuesta y validaciones ----------

test('la respuesta trae contenido, motivo y tokens', async () => {
  const salida = await salidaDe(`
r = ia.preguntar([${U('Hola')}])
print(sorted(r.keys()))
print(r["motivo_fin"], r["tokens_entrada"] > 0, r["tokens_salida"] > 0)`);

  assert.deepEqual(salida, [
    "['contenido', 'motivo_fin', 'tokens_entrada', 'tokens_salida']",
    'fin True True',
  ]);
});

test('rechaza mensajes mal formados con un mensaje claro', async () => {
  const casos = [
    ['ia.preguntar("Hola")', 'TypeError', /lista/],
    ['ia.preguntar([{"rol": "user", "contenido": "x"}])', 'ValueError', /El rol "user" no existe/],
    ['ia.preguntar([{"rol": "usuario"}])', 'ValueError', /"rol" y "contenido"/],
    ['ia.preguntar([{"rol": "asistente", "contenido": "x"}])', 'ValueError', /ultimo mensaje/],
    [
      'ia.preguntar([{"rol": "usuario", "contenido": "x"}, {"rol": "herramienta", "contenido": "1"}])',
      'ValueError',
      /asistente que la pidio/,
    ],
  ];

  for (const [codigo, nombre, patron] of casos) {
    const resultado = await correr(codigo);
    assert.equal(resultado.error.nombre, nombre, codigo);
    assert.match(resultado.error.mensaje, patron, codigo);
    assert.equal(resultado.error.linea, 2, codigo); // la línea del estudiante, no la del módulo
  }
});

test('max_tokens corta la respuesta y lo avisa en motivo_fin', async () => {
  const salida = await salidaDe(`
r = ia.preguntar([${U('Hola')}], max_tokens=3)
print(r["motivo_fin"], len(r["contenido"]))`);

  assert.deepEqual(salida, ['max_tokens 12']);
});

// ---------- habilidades ----------

test('sentimiento: el formato depende de la instrucción', async () => {
  const salida = await salidaDe(`
resena = ${U('Reseña: La comida llegó fría y tarde.')}
print(ia.preguntar([resena])["contenido"] == "negativo")
print(ia.preguntar([${S('Responde solo con una palabra: positivo, negativo o neutro.')}, resena])["contenido"])
print(ia.preguntar([${S('Responde en JSON.')}, resena])["contenido"])`);

  assert.deepEqual(salida, ['False', 'negativo', '{"sentimiento": "negativo"}']);
});

test('sentimiento: una instrucción que limita y nombra las etiquetas devuelve solo la etiqueta', async () => {
  const salida = await salidaDe(`
resena = ${U('Reseña: La comida llegó fría y tarde.')}
print(ia.preguntar([${S('Responde únicamente con positivo, negativo o neutro.')}, resena])["contenido"])
print(ia.preguntar([${S('Responde solo positivo, negativo o neutro.')}, resena])["contenido"])
print(ia.preguntar([${S('Dime positivo, negativo o neutro.')}, resena])["contenido"] == "negativo")`);

  assert.deepEqual(salida, ['negativo', 'negativo', 'False']);
});

test('tiquetes: imita la etiqueta de un ejemplo de la misma categoría', async () => {
  const salida = await salidaDe(`
ejemplos = [${U('Tiquete: Necesito la factura.')}, {"rol": "asistente", "contenido": "COBROS"}]
print(ia.preguntar(ejemplos + [${U('Tiquete: Me cobraron dos veces.')}])["contenido"])
print(ia.preguntar(ejemplos + [${U('Tiquete: La app muestra un error.')}])["contenido"])`);

  assert.deepEqual(salida, ['COBROS', 'Suena a una falla técnica de la aplicación.']);
});

test('pedidos: JSON limpio solo si se pide "solo JSON"', async () => {
  const salida = await salidaDe(`
pedido = ${U('Pedido: 2 tintos para Cali')}
print(ia.preguntar([${S('Extrae y responde solo con JSON.')}, pedido])["contenido"])
print(ia.preguntar([${S('Extrae en JSON.')}, pedido])["contenido"].startswith("Aquí tienes"))`);

  assert.deepEqual(salida, ['{"producto": "tinto", "cantidad": 2, "ciudad": "Cali"}', 'True']);
});

test('contexto: responde con el dato, admite no saber o inventa', async () => {
  const salida = await salidaDe(`
regla = ${S('Si no está en el contexto, responde "No lo sé".')}
con_dato = ${U('Contexto:\nLos domicilios cuestan 3000 pesos.\n\nPregunta: ¿Cuánto cuestan los domicilios?')}
sin_dato = ${U('Contexto:\nLos domicilios cuestan 3000 pesos.\n\nPregunta: ¿Venden ropa para perros?')}
print(ia.preguntar([regla, con_dato])["contenido"])
print(ia.preguntar([regla, sin_dato])["contenido"])
print(ia.preguntar([sin_dato])["contenido"].startswith("Sí, por supuesto"))`);

  assert.deepEqual(salida, ['Los domicilios cuestan 3000 pesos.', 'No lo sé', 'True']);
});

test('memoria: solo sabe lo que viene en la conversación', async () => {
  const salida = await salidaDe(`
print(ia.preguntar([${U('¿Cómo me llamo?')}])["contenido"])
print(ia.preguntar([${U('Me llamo Sofía.')}, {"rol": "asistente", "contenido": "Hola"}, ${U('¿Cómo me llamo?')}])["contenido"])`);

  assert.deepEqual(salida, [
    'No sé cómo te llamas: no me lo has dicho en esta conversación.',
    'Te llamas Sofía.',
  ]);
});

test('herramientas: pide la herramienta, aclara si falta un dato y usa el resultado', async () => {
  const salida = await salidaDe(`
h = [{"nombre": "consultar_precio", "parametros": {"producto": ["tinto", "arepa"]}}]
r = ia.preguntar([${U('¿Qué precio tiene la arepa?')}], herramientas=h)
print(r["motivo_fin"], r["herramienta"])
print(ia.preguntar([${U('¿Cuál es el precio?')}], herramientas=h)["motivo_fin"])
print(ia.preguntar([${U('Hola')}], herramientas=h)["motivo_fin"])
pedido = {"rol": "asistente", "contenido": "", "herramienta": r["herramienta"]}
print(ia.preguntar([${U('x')}, pedido, {"rol": "herramienta", "nombre": "consultar_precio", "contenido": "3500"}])["contenido"])`);

  assert.deepEqual(salida, [
    "herramienta {'nombre': 'consultar_precio', 'argumentos': {'producto': 'arepa'}}",
    'fin',
    'fin',
    'El resultado de consultar_precio es 3500.',
  ]);
});

test('preguntar_inestable falla dos veces y responde a la tercera', async () => {
  const salida = await salidaDe(`
resultados = []
for i in range(6):
    try:
        ia.preguntar_inestable([${U('Hola')}])
        resultados.append("ok")
    except ia.ErrorDeServicio:
        resultados.append("falla")
print(resultados)`);

  assert.deepEqual(salida, ["['falla', 'falla', 'ok', 'falla', 'falla', 'ok']"]);
});

// ---------- crear_mensaje: el formato de la API de Mensajes de Anthropic ----------

const API = 'model="claude-simulado", max_tokens=200';

test('crear_mensaje devuelve los campos de la API: content, stop_reason y usage', async () => {
  const salida = await salidaDe(`
r = ia.crear_mensaje(${API}, system="Te llamas Tina.", messages=[{"role": "user", "content": "Hola"}])
print(sorted(r.keys()))
print(r["type"], r["role"], r["model"], r["stop_reason"])
print(r["content"])
print(sorted(r["usage"].keys()), r["usage"]["input_tokens"] > 0, r["usage"]["output_tokens"] > 0)`);

  assert.deepEqual(salida, [
    "['content', 'id', 'model', 'role', 'stop_reason', 'type', 'usage']",
    'message assistant claude-simulado end_turn',
    "[{'type': 'text', 'text': '¡Hola! Soy Tina. ¿En qué te ayudo?'}]",
    "['input_tokens', 'output_tokens'] True True",
  ]);
});

test('crear_mensaje: system, las tools y la conversación suman tokens de entrada', async () => {
  const salida = await salidaDe(`
m = [{"role": "user", "content": "Hola"}]
t = [{"name": "consultar_precio", "description": "Precio", "input_schema": {"type": "object", "properties": {}}}]
solo = ia.crear_mensaje(${API}, messages=m)["usage"]["input_tokens"]
con_system = ia.crear_mensaje(${API}, system="Eres amable y breve.", messages=m)["usage"]["input_tokens"]
con_tools = ia.crear_mensaje(${API}, messages=m, tools=t)["usage"]["input_tokens"]
print(solo < con_system, solo < con_tools)`);

  assert.deepEqual(salida, ['True True']);
});

test('crear_mensaje corta en max_tokens y lo dice en stop_reason', async () => {
  const salida = await salidaDe(`
r = ia.crear_mensaje(model="x", max_tokens=3, messages=[{"role": "user", "content": "Hola"}])
print(r["stop_reason"], len(r["content"][0]["text"]))`);

  assert.deepEqual(salida, ['max_tokens 12']);
});

test('crear_mensaje rechaza lo que la API real rechaza, con un mensaje claro', async () => {
  const casos = [
    ['ia.crear_mensaje(max_tokens=10, messages=[{"role": "user", "content": "x"}])', /Falta "model"/],
    ['ia.crear_mensaje(model="x", messages=[{"role": "user", "content": "x"}])', /max_tokens/],
    ['ia.crear_mensaje(model="x", max_tokens=10, messages=[{"role": "system", "content": "x"}])', /van en "system"/],
    ['ia.crear_mensaje(model="x", max_tokens=10, messages=[{"role": "user", "content": [{"type": "imagen"}]}])', /"type": "text"/],
    [
      'ia.crear_mensaje(model="x", max_tokens=10, messages=[{"role": "user", "content": [{"type": "tool_result", "tool_use_id": "a", "content": "1"}]}])',
      /no corresponde a ningun bloque "tool_use"/,
    ],
    [
      'ia.crear_mensaje(model="x", max_tokens=10, messages=[{"role": "user", "content": "x"}, {"role": "assistant", "content": [{"type": "tool_use", "id": "a", "name": "f", "input": {}}]}, {"role": "user", "content": "y"}])',
      /le falta su "tool_result"/,
    ],
  ];
  for (const [codigo, mensaje] of casos) {
    const resultado = await correr(codigo);
    assert.match(resultado.error.mensaje, mensaje, codigo);
  }
});

test('crear_mensaje con tools: pide tool_use según el JSON schema y redacta con el tool_result', async () => {
  const salida = await salidaDe(`
t = [{"name": "consultar_precio", "description": "Precio de un producto",
      "input_schema": {"type": "object", "properties": {"producto": {"type": "string", "enum": ["tinto", "arepa"]}}, "required": ["producto"]}}]
m = [{"role": "user", "content": "¿Qué precio tiene la arepa?"}]
r = ia.crear_mensaje(${API}, messages=m, tools=t)
print(r["stop_reason"], r["content"])
print(ia.crear_mensaje(${API}, messages=[{"role": "user", "content": "¿Cuál es el precio?"}], tools=t)["content"][0]["text"])
m2 = m + [{"role": "assistant", "content": r["content"]},
          {"role": "user", "content": [{"type": "tool_result", "tool_use_id": r["content"][0]["id"], "content": "3500"}]}]
final = ia.crear_mensaje(${API}, messages=m2, tools=t)
print(final["stop_reason"], final["content"][0]["text"])`);

  assert.deepEqual(salida, [
    "tool_use [{'type': 'tool_use', 'id': 'toolu_sim_001', 'name': 'consultar_precio', 'input': {'producto': 'arepa'}}]",
    'Para usar consultar_precio me falta saber: producto.',
    'end_turn El resultado de consultar_precio es 3500.',
  ]);
});

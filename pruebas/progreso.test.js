// Pruebas del progreso por ruta, del registro de rutas y del de motores.

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/progreso.js');
require('../js/rutas.js');
require('../js/motores.js');

const { Progreso, Rutas, Motores } = globalThis;

function crearAlmacenFalso(inicial = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
    setItem: (clave, valor) => datos.set(clave, String(valor)),
  };
}

// ---------- progreso ----------

test('clavePaso incluye la ruta para que dos rutas no se mezclen', () => {
  assert.equal(Progreso.clavePaso('python', 'variables', 'idea'), 'python/variables/idea');
});

test('marcarCompletado devuelve un progreso nuevo sin modificar el original', () => {
  const original = Progreso.PROGRESO_VACIO;

  const nuevo = Progreso.marcarCompletado(original, 'js/a/idea');

  assert.equal(nuevo.completados['js/a/idea'], true);
  assert.deepEqual(original.completados, {});
});

test('guardarCodigo y olvidarCodigo no modifican el original', () => {
  const conCodigo = Progreso.guardarCodigo(Progreso.PROGRESO_VACIO, 'js/a/idea', 'let x;');

  const sinCodigo = Progreso.olvidarCodigo(conCodigo, 'js/a/idea');

  assert.equal(conCodigo.codigos['js/a/idea'], 'let x;');
  assert.deepEqual(sinCodigo.codigos, {});
});

test('recordarUbicacion guarda una ubicación por ruta y cuál está abierta', () => {
  const enJs = Progreso.recordarUbicacion(Progreso.PROGRESO_VACIO, 'js', 'a', 'reto');

  const enPython = Progreso.recordarUbicacion(enJs, 'python', 'b', 'idea');

  assert.equal(enPython.rutaAbierta, 'python');
  assert.deepEqual(enPython.ubicaciones, {
    js: { leccionId: 'a', pasoId: 'reto' },
    python: { leccionId: 'b', pasoId: 'idea' },
  });
});

test('cerrarRuta olvida la ruta abierta pero conserva las ubicaciones', () => {
  const abierto = Progreso.recordarUbicacion(Progreso.PROGRESO_VACIO, 'js', 'a', 'reto');

  const cerrado = Progreso.cerrarRuta(abierto);

  assert.equal(cerrado.rutaAbierta, null);
  assert.deepEqual(cerrado.ubicaciones, abierto.ubicaciones);
});

test('borrarRuta borra solo el avance de esa ruta', () => {
  const progreso = {
    completados: { 'js/a/idea': true, 'python/a/idea': true },
    codigos: { 'js/a/idea': 'let x;', 'python/a/idea': 'x = 1' },
    ubicaciones: { js: { leccionId: 'a', pasoId: 'idea' }, python: { leccionId: 'a', pasoId: 'idea' } },
    rutaAbierta: 'js',
  };

  const resultado = Progreso.borrarRuta(progreso, 'js');

  assert.deepEqual(resultado.completados, { 'python/a/idea': true });
  assert.deepEqual(resultado.codigos, { 'python/a/idea': 'x = 1' });
  assert.deepEqual(resultado.ubicaciones, { python: { leccionId: 'a', pasoId: 'idea' } });
});

test('borrarRuta no confunde rutas cuyo nombre empieza igual', () => {
  const progreso = {
    ...Progreso.PROGRESO_VACIO,
    completados: { 'js/a/idea': true, 'js-avanzado/a/idea': true },
  };

  const resultado = Progreso.borrarRuta(progreso, 'js');

  assert.deepEqual(resultado.completados, { 'js-avanzado/a/idea': true });
});

test('contarCompletados solo cuenta pasos que existen en esa ruta', () => {
  const ruta = { id: 'js', lecciones: [{ id: 'a', pasos: [{ id: 'idea' }, { id: 'reto' }] }] };
  const progreso = {
    ...Progreso.PROGRESO_VACIO,
    completados: { 'js/a/idea': true, 'js/vieja/idea': true, 'python/a/reto': true },
  };

  assert.equal(Progreso.contarCompletados(progreso, ruta), 1);
});

test('guardar y cargar conservan el progreso', () => {
  const almacen = crearAlmacenFalso();
  const progreso = Progreso.recordarUbicacion(
    Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'js/a/idea'),
    'js',
    'a',
    'reto'
  );

  const seGuardo = Progreso.guardar(almacen, progreso);

  assert.equal(seGuardo, true);
  assert.deepEqual(Progreso.cargar(almacen), progreso);
});

test('cargar devuelve progreso vacío si no hay nada guardado', () => {
  assert.deepEqual(Progreso.cargar(crearAlmacenFalso()), Progreso.PROGRESO_VACIO);
});

test('cargar devuelve progreso vacío si lo guardado está dañado', () => {
  const almacen = crearAlmacenFalso({ [Progreso.CLAVE_ALMACEN]: '{esto no es json' });

  assert.deepEqual(Progreso.cargar(almacen), Progreso.PROGRESO_VACIO);
});

test('cargar migra el progreso del formato viejo a la ruta javascript', () => {
  const viejo = {
    completados: { 'hola-mundo/idea': true },
    codigos: { 'hola-mundo/practica': 'console.log(1);' },
    ultimo: { leccionId: 'hola-mundo', pasoId: 'practica' },
  };
  const almacen = crearAlmacenFalso({ [Progreso.CLAVE_V1]: JSON.stringify(viejo) });

  assert.deepEqual(Progreso.cargar(almacen), {
    completados: { 'javascript/hola-mundo/idea': true },
    codigos: { 'javascript/hola-mundo/practica': 'console.log(1);' },
    ubicaciones: { javascript: { leccionId: 'hola-mundo', pasoId: 'practica' } },
    rutaAbierta: 'javascript',
    dias: {},
    ultimaRuta: null,
  });
});

test('cargar devuelve progreso vacío si el formato viejo está dañado', () => {
  const almacen = crearAlmacenFalso({ [Progreso.CLAVE_V1]: 'no es json' });

  assert.deepEqual(Progreso.cargar(almacen), Progreso.PROGRESO_VACIO);
});

test('cargar devuelve progreso vacío si leer el almacenamiento falla', () => {
  const almacenRoto = {
    getItem: () => {
      throw new Error('bloqueado');
    },
  };

  assert.deepEqual(Progreso.cargar(almacenRoto), Progreso.PROGRESO_VACIO);
});

test('cargar devuelve progreso vacío si lo guardado no es un objeto', () => {
  for (const valor of ['null', '[1, 2]', '7']) {
    const almacen = crearAlmacenFalso({ [Progreso.CLAVE_ALMACEN]: valor });

    assert.deepEqual(Progreso.cargar(almacen), Progreso.PROGRESO_VACIO);
  }
});

test('cargar prefiere el formato nuevo cuando existen los dos', () => {
  const nuevo = Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'javascript/a/idea');
  const almacen = crearAlmacenFalso({
    [Progreso.CLAVE_V1]: JSON.stringify({ completados: { 'vieja/idea': true } }),
    [Progreso.CLAVE_ALMACEN]: JSON.stringify(nuevo),
  });

  assert.deepEqual(Progreso.cargar(almacen), nuevo);
});

test('migrarDesdeV1 sin último paso visitado no abre ninguna ruta', () => {
  const migrado = Progreso.migrarDesdeV1({ completados: { 'a/idea': true }, ultimo: null });

  assert.equal(migrado.rutaAbierta, null);
  assert.deepEqual(migrado.ubicaciones, {});
  assert.deepEqual(migrado.completados, { 'javascript/a/idea': true });
});

test('normalizar descarta los datos con forma incorrecta', () => {
  const sucio = {
    completados: { 'js/a/idea': true, 'js/a/reto': 'sí' },
    codigos: { 'js/a/idea': 'let x;', 'js/a/reto': 42 },
    ubicaciones: { js: { leccionId: 'a', pasoId: 'idea' }, python: { leccionId: 7 } },
    rutaAbierta: 12,
  };

  assert.deepEqual(Progreso.normalizar(sucio), {
    completados: { 'js/a/idea': true },
    codigos: { 'js/a/idea': 'let x;' },
    ubicaciones: { js: { leccionId: 'a', pasoId: 'idea' } },
    rutaAbierta: null,
    dias: {},
    ultimaRuta: null,
  });
});

// ---------- motivación: días, racha, puntos, nivel ----------

const conDias = (dias) => ({ ...Progreso.PROGRESO_VACIO, dias });

test('normalizar: progreso viejo sin dias ni ultimaRuta carga con {} y null', () => {
  const viejo = { completados: { 'js/a/idea': true }, codigos: {}, ubicaciones: {}, rutaAbierta: 'js' };

  const resultado = Progreso.normalizar(viejo);

  assert.deepEqual(resultado.dias, {});
  assert.equal(resultado.ultimaRuta, null);
  assert.deepEqual(resultado.completados, { 'js/a/idea': true });
  assert.equal(resultado.rutaAbierta, 'js');
});

test('normalizar descarta dias inválidos y conserva los buenos', () => {
  const resultado = Progreso.normalizar({
    dias: {
      '2026-03-10': 3,
      '2026-3-10': 1,
      hoy: 2,
      '2026-03-11': 0,
      '2026-03-12': -1,
      '2026-03-13': 1.5,
      '2026-03-14': '2',
    },
    ultimaRuta: 'python',
  });

  assert.deepEqual(resultado.dias, { '2026-03-10': 3 });
  assert.equal(resultado.ultimaRuta, 'python');
  assert.deepEqual(Progreso.normalizar({ dias: [1], ultimaRuta: 5 }).dias, {});
  assert.equal(Progreso.normalizar({ ultimaRuta: 5 }).ultimaRuta, null);
});

test('marcarCompletado con fecha suma un paso a ese día', () => {
  const uno = Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'js/a/idea', '2026-03-10');
  const dos = Progreso.marcarCompletado(uno, 'js/a/reto', '2026-03-10');

  assert.deepEqual(uno.dias, { '2026-03-10': 1 });
  assert.deepEqual(dos.dias, { '2026-03-10': 2 });
  assert.deepEqual(Progreso.PROGRESO_VACIO.dias, {});
});

test('marcarCompletado no suma dos veces el mismo paso ni sin fecha', () => {
  const uno = Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'js/a/idea', '2026-03-10');
  const repetido = Progreso.marcarCompletado(uno, 'js/a/idea', '2026-03-11');
  const sinFecha = Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'js/a/idea');

  assert.deepEqual(repetido.dias, { '2026-03-10': 1 });
  assert.deepEqual(sinFecha.dias, {});
});

test('recordarUbicacion guarda ultimaRuta y cerrarRuta no la borra', () => {
  const abierto = Progreso.recordarUbicacion(Progreso.PROGRESO_VACIO, 'js', 'a', 'reto');

  assert.equal(abierto.ultimaRuta, 'js');
  assert.equal(Progreso.cerrarRuta(abierto).ultimaRuta, 'js');
});

test('borrarRuta pone ultimaRuta en null solo si era esa ruta y no toca dias', () => {
  const progreso = {
    ...Progreso.recordarUbicacion(Progreso.PROGRESO_VACIO, 'js', 'a', 'reto'),
    dias: { '2026-03-10': 2 },
  };

  const borradaJs = Progreso.borrarRuta(progreso, 'js');
  const borradaOtra = Progreso.borrarRuta(progreso, 'python');

  assert.equal(borradaJs.ultimaRuta, null);
  assert.deepEqual(borradaJs.dias, { '2026-03-10': 2 });
  assert.equal(borradaOtra.ultimaRuta, 'js');
});

test('guardar y cargar conservan dias y ultimaRuta', () => {
  const almacen = crearAlmacenFalso();
  const progreso = Progreso.recordarUbicacion(
    Progreso.marcarCompletado(Progreso.PROGRESO_VACIO, 'js/a/idea', '2026-03-10'),
    'js',
    'a',
    'reto'
  );

  Progreso.guardar(almacen, progreso);

  assert.deepEqual(Progreso.cargar(almacen), progreso);
});

test('racha cuenta días seguidos terminando hoy', () => {
  const progreso = conDias({ '2026-03-08': 1, '2026-03-09': 2, '2026-03-10': 1 });

  assert.equal(Progreso.racha(progreso, '2026-03-10'), 3);
});

test('racha: si hoy no tiene actividad cuenta desde ayer', () => {
  const progreso = conDias({ '2026-03-08': 1, '2026-03-09': 2 });

  assert.equal(Progreso.racha(progreso, '2026-03-10'), 2);
});

test('racha: se rompe si falta ayer y hoy, y es 0 sin actividad', () => {
  const progreso = conDias({ '2026-03-07': 1, '2026-03-08': 1 });

  assert.equal(Progreso.racha(progreso, '2026-03-10'), 0);
  assert.equal(Progreso.racha(Progreso.PROGRESO_VACIO, '2026-03-10'), 0);
});

test('racha: un hueco corta la cuenta', () => {
  const progreso = conDias({ '2026-03-05': 1, '2026-03-07': 1, '2026-03-08': 1, '2026-03-09': 1 });

  assert.equal(Progreso.racha(progreso, '2026-03-09'), 3);
});

test('racha atraviesa el cambio de mes (incluido febrero bisiesto) y de año', () => {
  const mes = conDias({ '2026-02-27': 1, '2026-02-28': 1, '2026-03-01': 1 });
  const bisiesto = conDias({ '2028-02-28': 1, '2028-02-29': 1, '2028-03-01': 1 });
  const anio = conDias({ '2025-12-30': 1, '2025-12-31': 1, '2026-01-01': 1 });

  assert.equal(Progreso.racha(mes, '2026-03-01'), 3);
  assert.equal(Progreso.racha(bisiesto, '2028-03-01'), 3);
  assert.equal(Progreso.racha(anio, '2026-01-01'), 3);
});

test('actividadReciente devuelve los últimos días del más viejo al más nuevo', () => {
  const progreso = conDias({ '2025-12-31': 2, '2026-01-02': 1 });

  assert.deepEqual(Progreso.actividadReciente(progreso, '2026-01-02', 4), [
    { fecha: '2025-12-30', pasos: 0 },
    { fecha: '2025-12-31', pasos: 2 },
    { fecha: '2026-01-01', pasos: 0 },
    { fecha: '2026-01-02', pasos: 1 },
  ]);
  assert.equal(Progreso.actividadReciente(progreso, '2026-01-02', 7).length, 7);
});

test('puntos da 10 por cada paso completado', () => {
  const progreso = {
    ...Progreso.PROGRESO_VACIO,
    completados: { 'js/a/idea': true, 'js/a/reto': true, 'python/a/idea': true },
  };

  assert.equal(Progreso.puntos(progreso), 30);
  assert.equal(Progreso.puntos(Progreso.PROGRESO_VACIO), 0);
});

test('nivelDe: 100 puntos por nivel y el nivel empieza en 1', () => {
  assert.deepEqual(Progreso.nivelDe(0), { nivel: 1, puntosEnNivel: 0, puntosPorNivel: 100 });
  assert.deepEqual(Progreso.nivelDe(99), { nivel: 1, puntosEnNivel: 99, puntosPorNivel: 100 });
  assert.deepEqual(Progreso.nivelDe(100), { nivel: 2, puntosEnNivel: 0, puntosPorNivel: 100 });
  assert.deepEqual(Progreso.nivelDe(250), { nivel: 3, puntosEnNivel: 50, puntosPorNivel: 100 });
});

test('fechaLocal da AAAA-MM-DD con ceros a la izquierda', () => {
  assert.equal(Progreso.fechaLocal(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(Progreso.fechaLocal(new Date(2026, 11, 31, 0, 0)), '2026-12-31');
});

test('guardar devuelve false si el almacenamiento falla', () => {
  const almacenRoto = {
    setItem: () => {
      throw new Error('lleno');
    },
  };

  assert.equal(Progreso.guardar(almacenRoto, Progreso.PROGRESO_VACIO), false);
});

// ---------- rutas ----------

test('una ruta nueva empieza sin lecciones y agregarLeccion las suma en orden', () => {
  Rutas.definirRuta({ id: 'prueba-a', titulo: 'A', descripcion: 'd', motor: 'm' });
  const antes = Rutas.buscar('prueba-a');

  Rutas.agregarLeccion('prueba-a', { id: 'uno', pasos: [] });
  Rutas.agregarLeccion('prueba-a', { id: 'dos', pasos: [] });

  assert.deepEqual(antes.lecciones, []); // el objeto anterior no cambió
  assert.deepEqual(Rutas.buscar('prueba-a').lecciones.map((l) => l.id), ['uno', 'dos']);
});

test('no se puede definir dos veces la misma ruta ni usar un id inválido', () => {
  Rutas.definirRuta({ id: 'prueba-b', titulo: 'B', descripcion: 'd', motor: 'm' });

  assert.throws(() => Rutas.definirRuta({ id: 'prueba-b', titulo: 'B', descripcion: 'd', motor: 'm' }));
  assert.throws(() => Rutas.definirRuta({ id: 'Con Espacios', titulo: 'X', descripcion: 'd', motor: 'm' }));
});

test('agregarLeccion falla con un mensaje claro si la ruta no existe', () => {
  assert.throws(() => Rutas.agregarLeccion('no-existe', { id: 'x', pasos: [] }), /No existe la ruta/);
});

test('buscar devuelve null cuando la ruta no existe', () => {
  assert.equal(Rutas.buscar('tampoco-existe'), null);
});

// ---------- motores ----------

test('registrar y obtener un motor', () => {
  const motor = { ejecutar: async () => ({}), explicarError: () => '' };

  Motores.registrar('de-prueba', motor);

  assert.equal(typeof Motores.obtener('de-prueba').ejecutar, 'function');
});

test('obtener devuelve null para un motor que no existe', () => {
  assert.equal(Motores.obtener('inexistente'), null);
  assert.equal(Motores.obtener('toString'), null); // no confunde nombres internos de JavaScript
});

test('registrar rechaza un motor incompleto', () => {
  assert.throws(() => Motores.registrar('roto', { ejecutar: () => {} }));
});

// ---------- motor y etiqueta de cada paso (proyectos que mezclan lenguajes) ----------

const rutaDeProyecto = {
  id: 'proyecto',
  motor: 'javascript',
  lecciones: [
    {
      id: 'tienda',
      pasos: [
        { id: 'idea' },
        { id: 'base', motor: 'sql', etiqueta: 'Base de datos' },
        { id: 'pagina', motor: 'web', etiqueta: 'Página' },
        { id: 'logica' },
      ],
    },
  ],
};
const [pasoIdea, pasoBase, pasoPagina, pasoLogica] = rutaDeProyecto.lecciones[0].pasos;
const registroCon = (...ids) => ({ obtener: (id) => (ids.includes(id) ? {} : null) });

test('motorDelPaso usa el motor del paso y, si no tiene, el de la ruta', () => {
  assert.equal(Rutas.motorDelPaso(rutaDeProyecto, pasoBase), 'sql');
  assert.equal(Rutas.motorDelPaso(rutaDeProyecto, pasoPagina), 'web');
  assert.equal(Rutas.motorDelPaso(rutaDeProyecto, pasoLogica), 'javascript');
});

test('motoresDeLaRuta junta el de la ruta y los de los pasos, sin repetir', () => {
  assert.deepEqual(Rutas.motoresDeLaRuta(rutaDeProyecto), ['javascript', 'sql', 'web']);
});

test('rutaDisponible exige el motor de la ruta y el de cada paso', () => {
  assert.equal(Rutas.rutaDisponible(rutaDeProyecto, registroCon('javascript', 'sql', 'web')), true);
  assert.equal(Rutas.rutaDisponible(rutaDeProyecto, registroCon('javascript', 'sql')), false);
  assert.equal(Rutas.rutaDisponible(rutaDeProyecto, registroCon('sql', 'web')), false);
});

test('rutaDisponible: una ruta sin lecciones sigue en "Próximamente"', () => {
  const vacia = { id: 'vacia', motor: 'javascript', lecciones: [] };

  assert.equal(Rutas.rutaDisponible(vacia, registroCon('javascript')), false);
});

test('etiquetaDelPaso prefiere la etiqueta propia, luego el id y luego "Paso N"', () => {
  assert.equal(Rutas.etiquetaDelPaso(pasoBase, 1), 'Base de datos');
  assert.equal(Rutas.etiquetaDelPaso(pasoIdea, 0), 'Idea');
  assert.equal(Rutas.etiquetaDelPaso({ id: 'practica' }, 1), 'Práctica');
  assert.equal(Rutas.etiquetaDelPaso(pasoLogica, 3), 'Paso 4');
  assert.equal(Rutas.etiquetaDelPaso({ id: 'x', etiqueta: '' }, 0), 'Paso 1');
});

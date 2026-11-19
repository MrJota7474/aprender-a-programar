// rutas.js — Registro de las rutas de aprendizaje (JavaScript, Python, SQL…).
//
// Una ruta agrupa lecciones y dice con qué "motor" se ejecuta su código
// (un paso puede cambiarlo con su propio "motor"; ver motorDelPaso).
// La lista vive dentro de esta función: nadie de afuera puede cambiarla sin
// pasar por definirRuta o agregarLeccion, y cada cambio crea una lista nueva.

(function () {
  'use strict';

  let rutas = [];

  function buscar(id) {
    return rutas.find((ruta) => ruta.id === id) || null;
  }

  function definirRuta({ id, sigla = '', titulo, descripcion, motor }) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id)) {
      throw new Error('El id de la ruta debe ser texto en minúsculas sin espacios: ' + id);
    }
    if (buscar(id)) throw new Error('Ya existe una ruta con el id "' + id + '"');
    rutas = [...rutas, { id, sigla, titulo, descripcion, motor, lecciones: [] }];
  }

  function agregarLeccion(rutaId, leccion) {
    if (!buscar(rutaId)) {
      throw new Error('No existe la ruta "' + rutaId + '". Defínela primero en rutas/catalogo.js');
    }
    rutas = rutas.map((ruta) =>
      ruta.id === rutaId ? { ...ruta, lecciones: [...ruta.lecciones, leccion] } : ruta
    );
  }

  function todas() {
    return rutas;
  }

  // ---------- Motores y etiquetas de cada paso ----------
  // Son funciones "puras": solo leen lo que reciben y devuelven un valor
  // nuevo. Así se pueden probar en Node sin navegador.

  // Un proyecto puede mezclar lenguajes (paso 1 en SQL, paso 2 en HTML…).
  // Por eso un paso puede traer su propio "motor", que manda sobre el de la
  // ruta. Si no lo trae, se usa el de la ruta, como en las rutas normales.
  function motorDelPaso(ruta, paso) {
    return (paso && paso.motor) || ruta.motor;
  }

  // Todos los motores distintos que necesita una ruta: el suyo y los que
  // declaren sus pasos. Un Set descarta los repetidos.
  function motoresDeLaRuta(ruta) {
    const deLosPasos = ruta.lecciones.flatMap((leccion) =>
      leccion.pasos.filter((paso) => paso.motor).map((paso) => paso.motor)
    );
    return [...new Set([ruta.motor, ...deLosPasos])];
  }

  // Una ruta se puede abrir si ya tiene lecciones y existen TODOS los motores
  // que usa. Si faltara el de un solo paso, el estudiante llegaría a ese paso
  // y no podría ejecutarlo: mejor seguir mostrando "Próximamente".
  // "registro" es Motores (o cualquier objeto con obtener(id)).
  function rutaDisponible(ruta, registro) {
    return (
      ruta.lecciones.length > 0 &&
      motoresDeLaRuta(ruta).every((id) => registro.obtener(id) !== null)
    );
  }

  const ETIQUETAS_PASO = Object.freeze({ idea: 'Idea', practica: 'Práctica', reto: 'Reto' });

  // Texto de la pestaña de un paso (sin el número, que pone la interfaz).
  // Primero la etiqueta propia del paso ("Base de datos"); si no tiene, la
  // de los ids de siempre (idea, practica, reto); si tampoco, "Paso N".
  function etiquetaDelPaso(paso, indice) {
    if (typeof paso.etiqueta === 'string' && paso.etiqueta !== '') return paso.etiqueta;
    return ETIQUETAS_PASO[paso.id] || 'Paso ' + (indice + 1);
  }

  globalThis.Rutas = Object.freeze({
    definirRuta,
    agregarLeccion,
    todas,
    buscar,
    motorDelPaso,
    motoresDeLaRuta,
    rutaDisponible,
    etiquetaDelPaso,
  });
})();

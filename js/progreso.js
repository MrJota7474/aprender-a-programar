// progreso.js — Qué pasos completó el estudiante y qué código escribió,
// en cada ruta de aprendizaje.
//
// Todas las funciones devuelven un objeto NUEVO en vez de modificar el que
// reciben. Así nunca hay cambios "a escondidas" y es fácil de probar.

(function () {
  'use strict';

  // El número de versión permite cambiar el formato sin romper lo guardado.
  const CLAVE_ALMACEN = 'aprender:progreso:v2';

  // Formato viejo (cuando solo existía el curso de JavaScript). Se lee una
  // vez para migrarlo y nunca se borra: queda como respaldo.
  const CLAVE_V1 = 'aprender-js:progreso:v1';
  const RUTA_DE_V1 = 'javascript';

  const PROGRESO_VACIO = Object.freeze({
    completados: {},
    codigos: {},
    ubicaciones: {},
    rutaAbierta: null,
    dias: {},
    ultimaRuta: null,
  });

  const PUNTOS_POR_PASO = 10;
  const PUNTOS_POR_NIVEL = 100;
  const MS_POR_DIA = 24 * 60 * 60 * 1000;
  const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

  // La clave empieza por la ruta: así dos rutas pueden tener lecciones con
  // el mismo nombre ("variables" en JavaScript y en Python) sin mezclarse.
  function clavePaso(rutaId, leccionId, pasoId) {
    return rutaId + '/' + leccionId + '/' + pasoId;
  }

  // Si llega la fecha (AAAA-MM-DD) y el paso era nuevo, suma 1 a los pasos de
  // ese día. Repetir un paso ya hecho no suma: así la racha no se infla.
  function marcarCompletado(progreso, clave, fecha) {
    const nuevo = { ...progreso, completados: { ...progreso.completados, [clave]: true } };
    if (!fecha || progreso.completados[clave]) return nuevo;
    const dias = progreso.dias || {};
    return { ...nuevo, dias: { ...dias, [fecha]: (dias[fecha] || 0) + 1 } };
  }

  function guardarCodigo(progreso, clave, codigo) {
    return { ...progreso, codigos: { ...progreso.codigos, [clave]: codigo } };
  }

  function olvidarCodigo(progreso, clave) {
    const { [clave]: descartado, ...resto } = progreso.codigos;
    return { ...progreso, codigos: resto };
  }

  // Recuerda en qué paso iba el estudiante dentro de cada ruta, y cuál ruta
  // tenía abierta, para volver ahí la próxima vez.
  function recordarUbicacion(progreso, rutaId, leccionId, pasoId) {
    return {
      ...progreso,
      rutaAbierta: rutaId,
      ultimaRuta: rutaId,
      ubicaciones: { ...progreso.ubicaciones, [rutaId]: { leccionId, pasoId } },
    };
  }

  function cerrarRuta(progreso) {
    return { ...progreso, rutaAbierta: null };
  }

  function filtrarEntradas(objeto, condicion) {
    return Object.fromEntries(Object.entries(objeto).filter(condicion));
  }

  // Borra el avance de UNA ruta y deja intactas las demás.
  function borrarRuta(progreso, rutaId) {
    const deOtraRuta = ([clave]) => !clave.startsWith(rutaId + '/');
    return {
      ...progreso,
      completados: filtrarEntradas(progreso.completados, deOtraRuta),
      codigos: filtrarEntradas(progreso.codigos, deOtraRuta),
      ubicaciones: filtrarEntradas(progreso.ubicaciones, ([clave]) => clave !== rutaId),
      ultimaRuta: progreso.ultimaRuta === rutaId ? null : progreso.ultimaRuta,
    };
  }

  function contarCompletados(progreso, ruta) {
    return ruta.lecciones.reduce(
      (total, leccion) =>
        total +
        leccion.pasos.filter(
          (paso) => progreso.completados[clavePaso(ruta.id, leccion.id, paso.id)]
        ).length,
      0
    );
  }

  function esObjetoSimple(dato) {
    return typeof dato === 'object' && dato !== null && !Array.isArray(dato);
  }

  function esUbicacion(dato) {
    return (
      esObjetoSimple(dato) && typeof dato.leccionId === 'string' && typeof dato.pasoId === 'string'
    );
  }

  // Lo que viene de localStorage pudo ser editado o dañarse: se valida
  // pieza por pieza y lo que no sirva se descarta.
  function normalizar(dato) {
    if (!esObjetoSimple(dato)) return PROGRESO_VACIO;

    const completados = esObjetoSimple(dato.completados)
      ? filtrarEntradas(dato.completados, ([, valor]) => valor === true)
      : {};
    const codigos = esObjetoSimple(dato.codigos)
      ? filtrarEntradas(dato.codigos, ([, valor]) => typeof valor === 'string')
      : {};
    const ubicaciones = esObjetoSimple(dato.ubicaciones)
      ? Object.fromEntries(
          Object.entries(dato.ubicaciones)
            .filter(([, valor]) => esUbicacion(valor))
            .map(([clave, valor]) => [clave, { leccionId: valor.leccionId, pasoId: valor.pasoId }])
        )
      : {};
    const rutaAbierta = typeof dato.rutaAbierta === 'string' ? dato.rutaAbierta : null;

    const dias = esObjetoSimple(dato.dias)
      ? filtrarEntradas(
          dato.dias,
          ([fecha, pasos]) => FORMATO_FECHA.test(fecha) && Number.isInteger(pasos) && pasos > 0
        )
      : {};
    const ultimaRuta = typeof dato.ultimaRuta === 'string' ? dato.ultimaRuta : null;

    return { completados, codigos, ubicaciones, rutaAbierta, dias, ultimaRuta };
  }

  // ---------- motivación: días, racha, puntos y nivel ----------

  // Las fechas son texto "AAAA-MM-DD". Se calculan en UTC para que sumar o
  // restar días no dependa de la zona horaria ni del cambio de hora.
  function aDiaUtc(fecha) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return Date.UTC(anio, mes - 1, dia);
  }

  function sumarDias(fecha, cantidad) {
    return new Date(aDiaUtc(fecha) + cantidad * MS_POR_DIA).toISOString().slice(0, 10);
  }

  function pasosDelDia(progreso, fecha) {
    return (progreso.dias && progreso.dias[fecha]) || 0;
  }

  // Días seguidos con actividad. Si hoy aún no hay, se cuenta desde ayer para
  // que la racha no se "rompa" mientras el día sigue.
  function racha(progreso, hoy) {
    let dia = pasosDelDia(progreso, hoy) > 0 ? hoy : sumarDias(hoy, -1);
    let total = 0;
    while (pasosDelDia(progreso, dia) > 0) {
      total += 1;
      dia = sumarDias(dia, -1);
    }
    return total;
  }

  // Los últimos "cantidad" días, del más viejo al más nuevo (termina en hoy).
  function actividadReciente(progreso, hoy, cantidad) {
    return Array.from({ length: cantidad }, (_, i) => {
      const fecha = sumarDias(hoy, i - (cantidad - 1));
      return { fecha, pasos: pasosDelDia(progreso, fecha) };
    });
  }

  function puntos(progreso) {
    return Object.keys(progreso.completados).length * PUNTOS_POR_PASO;
  }

  function nivelDe(totalPuntos) {
    return {
      nivel: Math.floor(totalPuntos / PUNTOS_POR_NIVEL) + 1,
      puntosEnNivel: totalPuntos % PUNTOS_POR_NIVEL,
      puntosPorNivel: PUNTOS_POR_NIVEL,
    };
  }

  // Fecha LOCAL del computador (no UTC) como "AAAA-MM-DD".
  function fechaLocal(fecha) {
    const dos = (numero) => String(numero).padStart(2, '0');
    return fecha.getFullYear() + '-' + dos(fecha.getMonth() + 1) + '-' + dos(fecha.getDate());
  }

  // Convierte el progreso del formato viejo al nuevo: todo lo que había
  // pertenece a la ruta de JavaScript.
  function migrarDesdeV1(dato) {
    if (!esObjetoSimple(dato)) return PROGRESO_VACIO;

    const conRuta = (objeto) =>
      esObjetoSimple(objeto)
        ? Object.fromEntries(
            Object.entries(objeto).map(([clave, valor]) => [RUTA_DE_V1 + '/' + clave, valor])
          )
        : {};

    return normalizar({
      completados: conRuta(dato.completados),
      codigos: conRuta(dato.codigos),
      ubicaciones: { [RUTA_DE_V1]: dato.ultimo },
      rutaAbierta: esUbicacion(dato.ultimo) ? RUTA_DE_V1 : null,
    });
  }

  // "almacen" es localStorage en la página, y uno de mentiras en las pruebas.
  function cargar(almacen) {
    try {
      const guardado = almacen.getItem(CLAVE_ALMACEN);
      if (guardado !== null) return normalizar(JSON.parse(guardado));

      const viejo = almacen.getItem(CLAVE_V1);
      return viejo === null ? PROGRESO_VACIO : migrarDesdeV1(JSON.parse(viejo));
    } catch (error) {
      return PROGRESO_VACIO;
    }
  }

  // Devuelve false si no se pudo guardar (modo privado, almacenamiento lleno…)
  // para que la página le avise al estudiante.
  function guardar(almacen, progreso) {
    try {
      almacen.setItem(CLAVE_ALMACEN, JSON.stringify(progreso));
      return true;
    } catch (error) {
      return false;
    }
  }

  globalThis.Progreso = Object.freeze({
    CLAVE_ALMACEN,
    CLAVE_V1,
    PROGRESO_VACIO,
    clavePaso,
    marcarCompletado,
    guardarCodigo,
    olvidarCodigo,
    recordarUbicacion,
    cerrarRuta,
    borrarRuta,
    contarCompletados,
    racha,
    actividadReciente,
    puntos,
    nivelDe,
    fechaLocal,
    normalizar,
    migrarDesdeV1,
    cargar,
    guardar,
  });
})();

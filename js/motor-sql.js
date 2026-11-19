// motor-sql.js — El "motor" de SQL: habla con el Web Worker que tiene
// SQLite y cumple el mismo contrato que los demás motores.

(function () {
  'use strict';

  const TIEMPO_MAXIMO_MS = 5000;
  const TIEMPO_MAXIMO_CARGA_MS = 30000;

  const ERROR_TIEMPO = Object.freeze({
    nombre: 'TiempoAgotado',
    mensaje: 'Tu consulta tardó más de 5 segundos y la detuvimos. Revisa que no se repita sin fin.',
  });

  // ---------- Errores de SQLite explicados en español ----------

  const EXPLICACIONES = Object.freeze([
    {
      patron: /no such table: (\S+)/,
      explicar: (m) =>
        'No existe una tabla llamada "' + m[1] + '". Revisa el nombre en la lista de tablas de arriba.',
    },
    {
      patron: /no such column: (\S+)/,
      explicar: (m) =>
        'No existe una columna llamada "' + m[1] + '". Revisa cómo se llama en la tabla. ' +
        'Si era un texto, ponlo entre comillas simples: \'así\'.',
    },
    {
      patron: /near "(.+?)": syntax error/,
      explicar: (m) =>
        'Hay un error de escritura cerca de "' + m[1] + '". Revisa que no falte una coma, ' +
        'una palabra (FROM, WHERE…) o una comilla justo antes.',
    },
    {
      patron: /incomplete input/,
      explicar: () =>
        'La consulta quedó incompleta. Revisa que cada paréntesis y cada comilla que abriste esté cerrado.',
    },
    {
      patron: /ambiguous column name: (\S+)/,
      explicar: (m) =>
        'La columna "' + m[1] + '" existe en más de una tabla. Dile a SQL de cuál la quieres ' +
        'escribiendo la tabla antes: tabla.' + m[1],
    },
    {
      patron: /UNIQUE constraint failed/,
      explicar: () => 'Ya existe una fila con ese mismo valor en una columna que no admite repetidos (como el id).',
    },
    {
      patron: /NOT NULL constraint failed: (\S+)/,
      explicar: (m) => 'La columna "' + m[1] + '" es obligatoria y la dejaste sin valor.',
    },
    {
      patron: /table (\S+) already exists/,
      explicar: (m) => 'Ya existe una tabla llamada "' + m[1] + '". Elige otro nombre.',
    },
    {
      patron: /has (\d+) columns but (\d+) values were supplied/,
      explicar: (m) =>
        'La tabla o la lista de columnas tiene ' + m[1] + ' columnas, pero escribiste ' + m[2] +
        ' valores. Deben ser la misma cantidad y en el mismo orden.',
    },
    {
      patron: /(\d+) values for (\d+) columns/,
      explicar: (m) =>
        'Escribiste ' + m[1] + ' valores para ' + m[2] + ' columnas. Deben ser la misma ' +
        'cantidad y en el mismo orden.',
    },
    {
      patron: /misuse of aggregate/,
      explicar: () =>
        'Usaste una función de resumen (COUNT, SUM, AVG…) en un lugar donde no va. ' +
        'Para filtrar por un resumen se usa HAVING, no WHERE.',
    },
  ]);

  function explicarErrorSql(error) {
    if (error.nombre === 'TiempoAgotado' || error.nombre === 'MotorNoDisponible') {
      return error.mensaje;
    }
    const regla = EXPLICACIONES.find((candidata) => candidata.patron.test(error.mensaje));
    const explicacion = regla
      ? regla.explicar(error.mensaje.match(regla.patron))
      : 'Algo falló al ejecutar tu consulta.';
    // Mostramos también el mensaje original: aprender a leerlo es parte del oficio.
    return explicacion + ' (Mensaje original: ' + error.mensaje + ')';
  }

  // ---------- El motor ----------

  const conexion = globalThis.crearConexionConWorker({
    direccion: 'js/sql-trabajador.js',
    nombreMotor: 'SQL',
    tiempoMaximoMs: TIEMPO_MAXIMO_MS,
    tiempoMaximoCargaMs: TIEMPO_MAXIMO_CARGA_MS,
    errorTiempo: ERROR_TIEMPO,
  });

  // Cada paso puede decir qué base usa (paso.base); si no, es la de la ruta.
  // Las bases son texto SQL registrado en rutas/sql/00-base-tienda.js.
  function preparacionDe(paso) {
    const bases = globalThis.BASES_SQL || {};
    const nombre = (paso && paso.base) || globalThis.BASE_SQL_POR_DEFECTO;
    return Object.prototype.hasOwnProperty.call(bases, nombre) ? bases[nombre] : '';
  }

  function ejecutar(codigo, pruebas, avisar, paso) {
    return conexion.pedir({ accion: 'evaluar', codigo, pruebas, preparacion: preparacionDe(paso) }, avisar);
  }

  // Las tablas de una base no cambian: se piden una vez y se recuerdan.
  let descripciones = {};

  async function describir(paso) {
    const preparacion = preparacionDe(paso);
    if (!Object.prototype.hasOwnProperty.call(descripciones, preparacion)) {
      const respuesta = await conexion.pedir({ accion: 'describir', preparacion });
      if (!Array.isArray(respuesta.tablas) || respuesta.error) return { tablas: [] };
      descripciones = { ...descripciones, [preparacion]: respuesta };
    }
    return descripciones[preparacion];
  }

  globalThis.explicarErrorSql = explicarErrorSql;

  globalThis.Motores.registrar('sql', {
    ejecutar,
    describir,
    preparar: conexion.preparar,
    explicarError: explicarErrorSql,
    ayudaSinSalida:
      'Tu código no devolvió ninguna tabla. Termina con un SELECT para ver los datos aquí.',
    lenguaje: 'sql',
    nombreLenguaje: 'SQL',
    archivo: 'consulta.sql',
    sangria: '  ',
  });
})();

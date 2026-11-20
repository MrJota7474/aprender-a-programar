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
  // Cada explicación dice qué pasó y cómo arreglarlo, casi siempre con un
  // mini ejemplo de "antes" y "después". SQLite no dice la línea, pero sí la
  // palabra donde se perdió: se repite para que el estudiante la busque.

  // Un mini ejemplo en una sola línea: el error se pinta con textContent,
  // así que no lleva saltos de línea ni HTML, solo texto.
  function antesDespues(antes, despues) {
    return ' Antes: ' + antes + '  →  Después: ' + despues;
  }

  const EXPLICACIONES = Object.freeze([
    {
      patron: /no such table: (\S+)/,
      explicar: (m) =>
        'No existe una tabla llamada "' + m[1] + '". Revisa el nombre en la lista de tablas de arriba: ' +
        'tiene que estar escrito igual, letra por letra.' +
        antesDespues('SELECT * FROM producto', 'SELECT * FROM productos'),
    },
    {
      patron: /no such column: (\S+)/,
      explicar: (m) =>
        'No existe una columna llamada "' + m[1] + '". Revisa cómo se llama en la tabla. ' +
        'Si era un texto, ponlo entre comillas simples: \'así\'.' +
        antesDespues("WHERE categoria = Bebidas", "WHERE categoria = 'Bebidas'"),
    },
    {
      patron: /no such function: (\S+)/,
      explicar: (m) =>
        'SQL no tiene una función llamada ' + m[1] + '. Las de resumen se escriben en inglés: ' +
        'COUNT, SUM, AVG, MIN y MAX.' +
        antesDespues('SELECT SUMA(precio)', 'SELECT SUM(precio)'),
    },
    {
      patron: /wrong number of arguments to function (\S+?)\(/,
      explicar: (m) =>
        'Le pasaste a ' + m[1] + '( ) una cantidad de datos que no es la que recibe. Revisa qué va ' +
        'entre los paréntesis y sepáralo con comas.' +
        antesDespues('SUBSTR(nombre)', 'SUBSTR(nombre, 1, 3)'),
    },
    {
      patron: /unrecognized token: "(.*)"/,
      explicar: (m) =>
        'Hay algo que SQL no reconoce cerca de ' + m[1] + '. Casi siempre es una comilla sin cerrar: ' +
        'los textos van entre comillas simples, una al comienzo y otra al final.' +
        antesDespues("WHERE nombre = 'Mango", "WHERE nombre = 'Mango'"),
    },
    {
      patron: /near "(.+?)": syntax error/,
      explicar: (m) =>
        'Hay un error de escritura cerca de "' + m[1] + '". Revisa que no falte una coma, ' +
        'una palabra (FROM, WHERE, SET…) o una comilla justo antes, que las palabras clave estén bien ' +
        'escritas y que no sobre una coma antes de FROM.' +
        antesDespues('SELECT nombre, precio, FORM productos', 'SELECT nombre, precio FROM productos'),
    },
    {
      patron: /incomplete input/,
      explicar: () =>
        'La consulta quedó incompleta. Revisa que cada paréntesis y cada comilla que abriste esté ' +
        'cerrado, y que después de WHERE, LIMIT o ORDER BY venga lo que pide.' +
        antesDespues('SELECT * FROM productos WHERE', 'SELECT * FROM productos WHERE precio > 5000'),
    },
    {
      patron: /ambiguous column name: (\S+)/,
      explicar: (m) =>
        'La columna "' + m[1] + '" existe en más de una tabla. Dile a SQL de cuál la quieres ' +
        'escribiendo la tabla antes: tabla.' + m[1] + '.' +
        antesDespues('WHERE ' + m[1] + ' = 1', 'WHERE clientes.' + m[1] + ' = 1'),
    },
    {
      patron: /UNIQUE constraint failed/,
      explicar: () =>
        'Ya existe una fila con ese mismo valor en una columna que no admite repetidos (como el id). ' +
        'Usa otro valor, o no escribas el id y deja que la base lo ponga sola.' +
        antesDespues("INSERT INTO frutas (id, nombre) VALUES (1, 'Pera')", "INSERT INTO frutas (nombre) VALUES ('Pera')"),
    },
    {
      patron: /NOT NULL constraint failed: (\S+)/,
      explicar: (m) =>
        'La columna "' + m[1] + '" es obligatoria y la dejaste sin valor. Inclúyela en la lista de ' +
        'columnas y dale un valor en VALUES.',
    },
    {
      patron: /FOREIGN KEY constraint failed/,
      explicar: () =>
        'El id que escribiste apunta a una fila que no existe en la otra tabla (o intentaste borrar una ' +
        'fila que otra tabla todavía usa). Revisa que el id exista primero.',
    },
    {
      patron: /CHECK constraint failed/,
      explicar: () =>
        'El valor no cumple una regla de la tabla (un CHECK, como "el precio debe ser mayor que 0"). ' +
        'Revisa la regla en el CREATE TABLE y usa un valor que la cumpla.',
    },
    {
      patron: /datatype mismatch/,
      explicar: () =>
        'Guardaste un valor de un tipo que la columna no acepta, por ejemplo un texto donde va un número entero.',
    },
    {
      patron: /table (\S+) already exists/,
      explicar: (m) =>
        'Ya existe una tabla llamada "' + m[1] + '". Elige otro nombre, o escribe CREATE TABLE IF NOT EXISTS.',
    },
    {
      patron: /has (\d+) columns but (\d+) values were supplied/,
      explicar: (m) =>
        'La tabla o la lista de columnas tiene ' + m[1] + ' columnas, pero escribiste ' + m[2] +
        ' valores. Deben ser la misma cantidad y en el mismo orden. Lo más claro es nombrar las columnas.' +
        antesDespues("INSERT INTO frutas VALUES ('Pera')", "INSERT INTO frutas (nombre) VALUES ('Pera')"),
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
        'Para filtrar por un resumen se usa HAVING, no WHERE.' +
        antesDespues('WHERE COUNT(*) > 2', 'GROUP BY categoria HAVING COUNT(*) > 2'),
    },
    {
      patron: /GROUP BY clause is required before HAVING/,
      explicar: () =>
        'HAVING filtra grupos, así que necesita un GROUP BY antes.' +
        antesDespues('SELECT categoria FROM productos HAVING COUNT(*) > 2', 'SELECT categoria FROM productos GROUP BY categoria HAVING COUNT(*) > 2'),
    },
    {
      patron: /sub-select returns (\d+) columns - expected 1/,
      explicar: (m) =>
        'La subconsulta entre paréntesis devuelve ' + m[1] + ' columnas, pero en ese lugar solo cabe una. ' +
        'Deja una sola columna en su SELECT.' +
        antesDespues('WHERE id IN (SELECT id, nombre FROM clientes)', 'WHERE id IN (SELECT id FROM clientes)'),
    },
    {
      patron: /ORDER BY term out of range - should be between 1 and (\d+)/,
      explicar: (m) =>
        'Ordenaste por un número de columna que no existe: tu SELECT solo tiene ' + m[1] + '. ' +
        'Mejor ordena por el nombre de la columna.' +
        antesDespues('ORDER BY 9', 'ORDER BY precio'),
    },
    {
      patron: /do not have the same number of result columns/,
      explicar: () =>
        'Las consultas unidas con UNION deben devolver la misma cantidad de columnas, en el mismo orden.',
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

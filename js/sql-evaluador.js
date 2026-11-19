// sql-evaluador.js — El evaluador de la ruta de SQL.
//
// Usa sql.js: SQLite (una base de datos de verdad) funcionando dentro del
// navegador. Cada ejecución crea una base NUEVA en memoria, la llena con los
// datos de ejemplo ("preparacion"), corre lo que escribió el estudiante y
// revisa las pruebas. Al terminar la base se desecha: por eso un DELETE mal
// hecho no daña nada y siempre se puede volver a intentar.
//
// Este archivo no usa nada del navegador: lo comparten el Web Worker de la
// página y las pruebas automáticas que corren en Node.

globalThis.crearEvaluadorSql = function crearEvaluadorSql(SQL) {
  // sql.js entrega cada resultado como { columns, values }. Aquí se pasa a
  // nuestros nombres y las columnas quedan en minúscula, para que una prueba
  // no falle porque alguien escribió "Nombre" en vez de "nombre".
  const aTabla = (resultado) => ({
    columnas: resultado.columns.map((columna) => columna.toLowerCase()),
    filas: resultado.values,
  });

  // [{ nombre: 'Tinto', precio: 2000 }, …] : más cómodo para escribir pruebas.
  const aObjetos = (tabla) =>
    tabla.filas.map((fila) =>
      Object.fromEntries(tabla.columnas.map((columna, indice) => [columna, fila[indice]]))
    );

  const TABLA_VACIA = Object.freeze({ columnas: [], filas: [] });

  // A la página se envían como mucho estas filas por tabla (más el total
  // real). Las pruebas sí revisan el resultado completo, aquí adentro.
  const MAXIMO_FILAS_ENVIADAS = 200;
  const recortar = (tabla) => ({
    columnas: tabla.columnas,
    filas: tabla.filas.slice(0, MAXIMO_FILAS_ENVIADAS),
    total: tabla.filas.length,
  });

  // Sin comentarios y en mayúsculas: así una prueba puede preguntar
  // /\bWHERE\b/.test(codigo) sin importar cómo lo escribió el estudiante.
  const normalizar = (codigo) =>
    codigo
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .toUpperCase();

  // Lo que puede usar una prueba. "consulta" corre SQL sobre la base tal
  // como quedó DESPUÉS del código del estudiante (sirve para revisar un
  // INSERT o un UPDATE). igualA y mismasFilas comparan su resultado con el
  // de una consulta de referencia: con orden y sin importar el orden.
  function crearAyudas(db, ultima, codigo) {
    const consultarTabla = (sql) => {
      const resultados = db.exec(sql);
      return resultados.length > 0 ? aTabla(resultados[resultados.length - 1]) : TABLA_VACIA;
    };
    const comoTexto = (filas) => filas.map((fila) => JSON.stringify(fila));
    return {
      filas: ultima.filas,
      columnas: ultima.columnas,
      tabla: aObjetos(ultima),
      codigo: normalizar(codigo),
      consulta: (sql) => aObjetos(consultarTabla(sql)),
      igualA: (sql) =>
        comoTexto(ultima.filas).join('\n') === comoTexto(consultarTabla(sql).filas).join('\n'),
      mismasFilas: (sql) =>
        comoTexto(ultima.filas).sort().join('\n') ===
        comoTexto(consultarTabla(sql).filas).sort().join('\n'),
    };
  }

  function revisar(prueba, ayudas) {
    try {
      const nombres = Object.keys(ayudas);
      const condicion = new Function(...nombres, '"use strict"; return (' + prueba.condicion + ');');
      const aprobada = condicion(...nombres.map((nombre) => ayudas[nombre])) === true;
      return { descripcion: prueba.descripcion, aprobada };
    } catch (error) {
      // Si la prueba explota (p. ej. la tabla no existe), cuenta como no aprobada.
      return { descripcion: prueba.descripcion, aprobada: false };
    }
  }

  function evaluar(codigo, pruebas, preparacion) {
    const db = new SQL.Database();
    try {
      db.run(preparacion || '');

      let tablas;
      try {
        tablas = db.exec(codigo).map(aTabla);
      } catch (error) {
        const descrito = { nombre: 'ErrorSQL', mensaje: String((error && error.message) || error) };
        return { salida: [], tablas: [], error: descrito, resultados: [] };
      }

      const ultima = tablas.length > 0 ? tablas[tablas.length - 1] : TABLA_VACIA;
      const ayudas = crearAyudas(db, ultima, codigo);
      const resultados = pruebas.map((prueba) => revisar(prueba, ayudas));
      return { salida: [], tablas: tablas.map(recortar), error: null, resultados };
    } finally {
      db.close(); // libera la memoria de la base
    }
  }

  // Devuelve las tablas de una base con algunas filas de muestra, para
  // mostrárselas al estudiante junto al editor.
  function describir(preparacion, filasDeMuestra) {
    const db = new SQL.Database();
    try {
      db.run(preparacion || '');
      const nombres = db.exec(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid"
      );
      const tablas = (nombres.length > 0 ? nombres[0].values : []).map(([nombre]) => {
        // El nombre viene de la propia base (no del estudiante) y va entre
        // comillas dobles, que es como SQL escribe un nombre con seguridad.
        const identificador = '"' + String(nombre).replace(/"/g, '""') + '"';
        const muestra = db.exec('SELECT * FROM ' + identificador + ' LIMIT ' + Number(filasDeMuestra));
        const total = db.exec('SELECT COUNT(*) FROM ' + identificador)[0].values[0][0];
        const columnas = db.exec('PRAGMA table_info(' + identificador + ')')[0].values.map((c) => c[1]);
        return { nombre, total, columnas, filas: muestra.length > 0 ? muestra[0].values : [] };
      });
      return { tablas };
    } finally {
      db.close();
    }
  }

  return { evaluar, describir };
};

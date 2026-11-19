// sql-trabajador.js — Web Worker que tiene SQLite (sql.js) adentro.
//
// Es un Worker clásico: importScripts carga los archivos en orden, con
// direcciones relativas a ESTE archivo (por eso "../vendor").

importScripts('../vendor/sqljs/sql-wasm.js', 'sql-evaluador.js');

const FILAS_DE_MUESTRA = 5;

// sql.js necesita saber dónde está su archivo .wasm (el motor compilado).
const evaluadorListo = initSqlJs({
  locateFile: (archivo) => '../vendor/sqljs/' + archivo,
}).then(crearEvaluadorSql);

evaluadorListo.then(
  () => self.postMessage({ tipo: 'listo' }),
  (error) => self.postMessage({ tipo: 'fallo', mensaje: String((error && error.message) || error) })
);

self.onmessage = async (evento) => {
  const { accion, codigo, pruebas, preparacion } = evento.data;
  try {
    const evaluador = await evaluadorListo;
    const resultado =
      accion === 'describir'
        ? evaluador.describir(preparacion, FILAS_DE_MUESTRA)
        : evaluador.evaluar(codigo, pruebas, preparacion);
    self.postMessage({ tipo: 'resultado', resultado });
  } catch (error) {
    self.postMessage({
      tipo: 'resultado',
      resultado: {
        salida: [],
        tablas: [],
        error: { nombre: 'ErrorSQL', mensaje: String((error && error.message) || error) },
        resultados: [],
      },
    });
  }
};

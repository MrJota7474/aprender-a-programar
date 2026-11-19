// web-trabajador.js — Web Worker que revisa las páginas del estudiante.
//
// Analizar HTML y CSS es rápido y no necesitaría un hilo aparte. El Worker
// está por la lección de JavaScript: si el <script> del estudiante tiene un
// bucle infinito, aquí se puede cortar sin que la página se congele.
//
// Es un Worker clásico: importScripts carga los archivos en orden, con
// direcciones relativas a ESTE archivo.

importScripts('web-analizador.js', 'web-estilos.js', 'web-evaluador.js');

self.postMessage({ tipo: 'listo' });

self.onmessage = (evento) => {
  const { codigo, pruebas } = evento.data;
  try {
    self.postMessage({ tipo: 'resultado', resultado: evaluarWeb(codigo, pruebas) });
  } catch (error) {
    // Una falla nuestra (no del estudiante): se informa sin tumbar el Worker.
    self.postMessage({
      tipo: 'resultado',
      resultado: {
        salida: [],
        error: { nombre: 'ErrorInterno', mensaje: String((error && error.message) || error) },
        resultados: [],
      },
    });
  }
};

// python-trabajador.js — Web Worker que tiene Python (Pyodide) adentro.
//
// A diferencia del resto de la app, este archivo SÍ es un módulo (usa import),
// porque así se distribuye Pyodide. Por eso la ruta de Python necesita abrirse
// con el servidor local (iniciar.bat) y no con doble clic en index.html.
//
// Cargar Python tarda unos segundos, así que el Worker se queda vivo entre
// ejecuciones. Solo se reemplaza si hay que cortarlo por un bucle infinito.

import './python-evaluador.js';
import { loadPyodide } from '../vendor/pyodide/pyodide.mjs';

// Si el Worker se creó con "?datos" en su dirección (ver motor-python.js),
// carga numpy y pandas ANTES de avisar que está listo. Así esa espera cae en
// el tiempo de carga (hasta 60 segundos) y no en los 5 segundos que tiene
// cada ejecución: si no, el primer "import pandas" se cortaría por lento.
const conDatos = new URLSearchParams(self.location.search).has('datos');

async function preparar() {
  const pyodide = await loadPyodide();
  if (conDatos) {
    const codigo = 'import numpy, pandas';
    await pyodide.loadPackage(globalThis.paquetesQueFaltan(pyodide, codigo), { messageCallback: () => {} });
    // Importarlos una vez deja pandas en memoria: el import del estudiante
    // después es inmediato.
    pyodide.runPython(codigo);
  }
  return globalThis.crearEvaluadorPython(pyodide);
}

const evaluadorListo = preparar();

evaluadorListo.then(
  () => self.postMessage({ tipo: 'listo' }),
  (error) => self.postMessage({ tipo: 'fallo', mensaje: String((error && error.message) || error) })
);

self.onmessage = async (evento) => {
  try {
    const evaluar = await evaluadorListo;
    const resultado = await evaluar(evento.data.codigo, evento.data.pruebas, evento.data.modulos || {});
    self.postMessage({ tipo: 'resultado', resultado });
  } catch (error) {
    self.postMessage({
      tipo: 'resultado',
      resultado: {
        salida: [],
        error: { nombre: 'Error', mensaje: String((error && error.message) || error), linea: null },
        resultados: [],
      },
    });
  }
};

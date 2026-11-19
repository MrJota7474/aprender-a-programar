// motor-terminal.js — El "motor" de la terminal con Git simulado.
//
// A diferencia de Python o SQL, no necesita un Web Worker: el simulador
// (terminal-evaluador.js) no tiene bucles ni nada que pueda quedarse
// pegado, y cada comando tarda casi nada. Aun así "ejecutar" devuelve una
// promesa, porque ese es el contrato que la interfaz espera de todo motor.

(function () {
  'use strict';

  // Los mensajes ya nacen en español en el simulador; aquí solo se les
  // agrega en qué línea y con qué comando pasó, para encontrarlo rápido.
  function explicarErrorTerminal(error) {
    if (error.nombre === 'ErrorInterno') {
      return 'No pudimos correr tus comandos por una falla de la app, no tuya. (Mensaje original: ' + error.mensaje + ')';
    }
    if (error.linea) {
      return 'Línea ' + error.linea + ' (' + error.comando + '): ' + error.mensaje + ' Los comandos de después no se corrieron.';
    }
    return error.mensaje;
  }

  function ejecutar(codigo, pruebas, avisar, paso) {
    try {
      return Promise.resolve(globalThis.evaluarTerminal(codigo, pruebas, paso));
    } catch (error) {
      // Un fallo inesperado del simulador no debe dejar la página colgada.
      const mensaje = String((error && error.message) || error);
      return Promise.resolve({ salida: [], error: { nombre: 'ErrorInterno', mensaje }, resultados: [] });
    }
  }

  globalThis.explicarErrorTerminal = explicarErrorTerminal;

  globalThis.Motores.registrar('terminal', {
    ejecutar,
    explicarError: explicarErrorTerminal,
    ayudaSinSalida: 'No escribiste ningún comando. Escribe uno por línea, por ejemplo: git status',
    lenguaje: 'terminal',
    nombreLenguaje: 'Terminal',
    archivo: 'terminal',
    sangria: '  ',
  });
})();

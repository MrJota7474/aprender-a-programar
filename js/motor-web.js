// motor-web.js — El "motor" de HTML y CSS: habla con el Web Worker que
// revisa la página y cumple el mismo contrato que los demás motores.
//
// Lo distinto de este motor es el campo "vista" del resultado: el documento
// del estudiante, para que la interfaz lo muestre en una vista previa.

(function () {
  'use strict';

  const TIEMPO_MAXIMO_MS = 3000;
  const TIEMPO_MAXIMO_CARGA_MS = 15000;

  // Cuando esto pasa el resultado NO trae "vista": mostrar la página
  // volvería a correr el mismo bucle infinito, esta vez sin quién lo corte.
  const ERROR_TIEMPO = Object.freeze({
    nombre: 'TiempoAgotado',
    mensaje:
      'El JavaScript de tu página tardó más de 3 segundos y lo detuvimos. ' +
      '¿Será un bucle que nunca termina? Revisa la condición del for o del while.',
  });

  // Los errores de HTML y CSS ya nacen explicados en español (los escribe
  // nuestro analizador); solo se les agrega la línea. Los demás vienen del
  // <script> del estudiante y los traduce el mismo explicador de la ruta de
  // JavaScript (formato.js).
  function explicarErrorWeb(error) {
    if (error.nombre === 'TiempoAgotado' || error.nombre === 'MotorNoDisponible') {
      return error.mensaje;
    }
    if (error.nombre === 'ErrorHTML' || error.nombre === 'ErrorCSS') {
      return (error.linea ? 'Línea ' + error.linea + ': ' : '') + error.mensaje;
    }
    if (error.nombre === 'ErrorInterno') {
      return 'No pudimos revisar tu página por una falla de la app, no tuya. (Mensaje original: ' + error.mensaje + ')';
    }
    // El tropiezo más común al empezar: buscar un elemento que (todavía) no existe.
    if (/of null|is null/.test(error.mensaje)) {
      return (
        'En el JavaScript de tu página: buscaste un elemento y no se encontró (dio null). Revisa que el id ' +
        'esté escrito igual en el HTML y en el script, y que el <script> vaya al final del <body>: un script ' +
        'solo ve lo que está escrito antes que él. (Mensaje original: ' + error.nombre + ': ' + error.mensaje + ')'
      );
    }
    const explicacion =
      typeof globalThis.explicarError === 'function'
        ? globalThis.explicarError(error)
        : error.nombre + ': ' + error.mensaje;
    return 'En el JavaScript de tu página: ' + explicacion;
  }

  const conexion = globalThis.crearConexionConWorker({
    direccion: 'js/web-trabajador.js',
    nombreMotor: 'HTML y CSS',
    tiempoMaximoMs: TIEMPO_MAXIMO_MS,
    tiempoMaximoCargaMs: TIEMPO_MAXIMO_CARGA_MS,
    errorTiempo: ERROR_TIEMPO,
  });

  function ejecutar(codigo, pruebas, avisar) {
    return conexion.pedir({ codigo, pruebas }, avisar);
  }

  globalThis.explicarErrorWeb = explicarErrorWeb;

  globalThis.Motores.registrar('web', {
    ejecutar,
    preparar: conexion.preparar,
    explicarError: explicarErrorWeb,
    ayudaSinSalida:
      'Tu página no escribió nada en la consola. Eso es normal: el resultado de HTML y CSS se ve en la vista previa.',
    lenguaje: 'html',
    nombreLenguaje: 'HTML y CSS',
    archivo: 'index.html',
    sangria: '  ',
    // La interfaz muestra la página del estudiante en un iframe aislado.
    vistaPrevia: true,
  });
})();

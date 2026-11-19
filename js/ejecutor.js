// ejecutor.js — Corre el evaluador en un Web Worker (un hilo aparte).
//
// ¿Por qué un Worker? 1) Si el estudiante escribe un bucle infinito, la
// página no se congela: lo cortamos al pasar el tiempo límite. 2) Su código
// no puede tocar la página ni el progreso guardado.

(function () {
  'use strict';

  const TIEMPO_MAXIMO_MS = 3000;

  const ERROR_TIEMPO = Object.freeze({
    nombre: 'TiempoAgotado',
    mensaje:
      'Tu código tardó más de 3 segundos y lo detuvimos. ' +
      '¿Será un bucle que nunca termina? Revisa la condición del for.',
  });

  // El Worker se crea desde un texto (Blob) y no desde un archivo, porque
  // así también funciona al abrir index.html con doble clic (file://).
  // Lleva dos funciones copiadas con .toString(): el fetch simulado de la
  // tienda (api-tienda.js), que el evaluador usa si existe, y el evaluador.
  // evaluarCodigo devuelve una promesa: el Worker responde cuando se cumple.
  function crearFuenteDelTrabajador() {
    const fetchSimulado =
      typeof globalThis.crearFetchSimulado === 'function' ? globalThis.crearFetchSimulado.toString() : '';
    return (
      fetchSimulado +
      '\n' +
      globalThis.evaluarCodigo.toString() +
      '\nself.onmessage = (evento) => {' +
      '\n  evaluarCodigo(evento.data.codigo, evento.data.pruebas)' +
      '\n    .then((resultado) => self.postMessage(resultado));' +
      '\n};'
    );
  }

  function ejecutarEnAislamiento(codigo, pruebas) {
    return new Promise((resolver) => {
      let trabajador;
      let direccion;
      try {
        direccion = URL.createObjectURL(
          new Blob([crearFuenteDelTrabajador()], { type: 'text/javascript' })
        );
        trabajador = new Worker(direccion);
      } catch (error) {
        // Navegador sin Workers: plan B, ejecutar aquí mismo. Sin el límite de
        // 3 s contra bucles infinitos; el de las esperas (2 s) sí lo trae el evaluador.
        // evaluarCodigo da una promesa: resolver la adopta tal cual.
        if (direccion) URL.revokeObjectURL(direccion);
        resolver(globalThis.evaluarCodigo(codigo, pruebas));
        return;
      }

      let resuelto = false;
      const terminar = (resultado) => {
        if (resuelto) return; // solo vale la primera respuesta
        resuelto = true;
        clearTimeout(reloj);
        trabajador.terminate();
        URL.revokeObjectURL(direccion);
        resolver(resultado);
      };

      const reloj = setTimeout(
        () => terminar({ salida: [], error: ERROR_TIEMPO, resultados: [] }),
        TIEMPO_MAXIMO_MS
      );

      trabajador.onmessage = (evento) => terminar(evento.data);
      // Si el Worker mismo falla, plan B: evaluar aquí (terminar recibe la
      // promesa del evaluador y resolver espera a que se cumpla).
      trabajador.onerror = (evento) => {
        evento.preventDefault();
        if (!resuelto) terminar(globalThis.evaluarCodigo(codigo, pruebas));
      };

      try {
        trabajador.postMessage({ codigo, pruebas });
      } catch (error) {
        terminar({
          salida: [],
          error: { nombre: 'Error', mensaje: 'No se pudo enviar el código a ejecutar.' },
          resultados: [],
        });
      }
    });
  }

  // Este archivo es el "motor" de JavaScript: se registra para que la
  // interfaz lo use en las rutas que declaren motor: 'javascript'.
  globalThis.Motores.registrar('javascript', {
    ejecutar: ejecutarEnAislamiento,
    explicarError: globalThis.explicarError,
    ayudaSinSalida: 'Tu código no mostró nada. Usa console.log( ) para ver resultados aquí.',
    lenguaje: 'javascript',
    nombreLenguaje: 'JavaScript',
    archivo: 'tu-codigo.js',
    sangria: '  ',
  });
})();

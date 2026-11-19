// trabajadores.js — Manejo de un Web Worker "de larga vida", compartido por
// los motores que tardan en cargar (Python y SQL).
//
// Antes esta lógica vivía solo en motor-python.js. Al llegar SQL habría que
// copiarla, y dos copias terminan diferenciándose con el tiempo. Por eso se
// sacó aquí: cada motor solo dice qué Worker usar y cuánto esperar.
//
// El Worker debe hablar este protocolo:
//   al terminar de cargar →  { tipo: 'listo' }   o   { tipo: 'fallo', mensaje }
//   por cada pedido       →  { tipo: 'resultado', resultado }

(function () {
  'use strict';

  // El consejo depende de la causa más probable: abrir index.html con doble
  // clic (file:) es distinto de un fallo pasajero con el servidor ya andando.
  function crearErrorDeCarga(nombreMotor) {
    const abiertoConDobleClic = globalThis.location && globalThis.location.protocol === 'file:';
    return {
      nombre: 'MotorNoDisponible',
      mensaje: abiertoConDobleClic
        ? nombreMotor + ' no funciona al abrir index.html directamente. Cierra esta pestaña y ' +
          'abre la app con el archivo iniciar.bat (doble clic).'
        : 'No se pudo cargar ' + nombreMotor + '. Presiona Ejecutar otra vez; si sigue fallando, ' +
          'recarga la página y revisa que la ventana del servidor (iniciar.bat) siga abierta.',
    };
  }

  const resultadoFallido = (error) => ({ salida: [], error, resultados: [] });

  function crearConexionConWorker({
    direccion,
    opcionesWorker,
    nombreMotor,
    tiempoMaximoMs,
    tiempoMaximoCargaMs,
    errorTiempo,
  }) {
    // null mientras no haya Worker. "listo" es una promesa que se cumple
    // cuando el motor terminó de cargar, o se rechaza si no se pudo.
    let trabajador = null;
    let listo = null;
    // Los pedidos se atienden de a uno: el Worker solo tiene un "oído"
    // (onmessage), y dos pedidos a la vez se pisarían la respuesta.
    let cola = Promise.resolve();

    function arrancar() {
      listo = new Promise((cumplir, rechazar) => {
        // Si la carga falla se elimina el Worker roto, para que el siguiente
        // intento cree uno nuevo en vez de quedarse esperando a este.
        const fallar = (error) => {
          if (trabajador) trabajador.terminate();
          trabajador = null;
          rechazar(error);
        };
        try {
          trabajador = new Worker(direccion, opcionesWorker);
        } catch (error) {
          fallar(error);
          return;
        }
        trabajador.onmessage = (evento) => {
          if (evento.data.tipo === 'listo') cumplir();
          if (evento.data.tipo === 'fallo') fallar(new Error(evento.data.mensaje));
        };
        trabajador.onerror = (evento) => {
          evento.preventDefault();
          fallar(new Error('No se pudo iniciar el Worker de ' + nombreMotor));
        };
      });
      // Quien espere "listo" maneja el fallo; esto evita un aviso de promesa sin atender.
      listo.catch(() => {});
    }

    function descartar() {
      if (trabajador) trabajador.terminate();
      trabajador = null;
      listo = null;
    }

    // Empieza a cargar el motor antes de que haga falta.
    function preparar() {
      if (trabajador === null) arrancar();
    }

    async function esperarCarga() {
      let reloj;
      const demasiadaEspera = new Promise((_, rechazar) => {
        reloj = setTimeout(
          () => rechazar(new Error(nombreMotor + ' tardó demasiado en cargar')),
          tiempoMaximoCargaMs
        );
      });
      try {
        await Promise.race([listo, demasiadaEspera]);
      } finally {
        clearTimeout(reloj);
      }
    }

    async function enviar(mensaje, avisar) {
      preparar();
      try {
        avisar('Cargando ' + nombreMotor + '…');
        await esperarCarga();
      } catch (error) {
        descartar();
        return resultadoFallido(crearErrorDeCarga(nombreMotor));
      }

      avisar('Ejecutando…');
      return new Promise((resolver) => {
        let resuelto = false;
        const terminar = (resultado, cortar) => {
          if (resuelto) return;
          resuelto = true;
          clearTimeout(reloj);
          // Un bucle infinito solo se detiene eliminando el Worker. Se
          // arranca otro de una vez, para que el motor vaya cargando
          // mientras el estudiante corrige su código.
          if (cortar) {
            descartar();
            preparar();
          }
          resolver(resultado);
        };

        const reloj = setTimeout(() => terminar(resultadoFallido(errorTiempo), true), tiempoMaximoMs);
        trabajador.onmessage = (evento) => {
          if (evento.data.tipo === 'resultado') terminar(evento.data.resultado, false);
        };
        trabajador.onerror = (evento) => {
          evento.preventDefault();
          terminar(resultadoFallido(crearErrorDeCarga(nombreMotor)), true);
        };
        trabajador.postMessage(mensaje);
      });
    }

    // "avisar" es opcional: la interfaz lo usa para contarle al estudiante qué pasa.
    function pedir(mensaje, avisar = () => {}) {
      const respuesta = cola.then(() => enviar(mensaje, avisar));
      cola = respuesta.catch(() => {});
      return respuesta;
    }

    return Object.freeze({ preparar, pedir });
  }

  globalThis.crearConexionConWorker = crearConexionConWorker;
})();

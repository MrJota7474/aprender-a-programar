// motores.js — Registro de "motores": lo que sabe ejecutar cada lenguaje.
//
// La interfaz (app.js) no sabe nada de JavaScript, Python ni SQL. Solo le
// pide al motor del paso abierto que ejecute. Ese motor es el de la ruta,
// salvo que el paso traiga su propio "motor" (los proyectos mezclan
// lenguajes: ver Rutas.motorDelPaso en rutas.js). Por eso TODOS los motores cumplen
// el mismo contrato:
//
//   ejecutar(codigo, pruebas, avisar, paso)
//                              → Promesa de { salida, error, resultados, tablas?, vista? }
//       avisar:     función opcional para contar qué pasa ("Cargando Python…")
//       paso:       el paso de la lección, por si el motor necesita algo de él
//                   (el de SQL lee de ahí qué base de datos usar)
//       salida:     lista de líneas que mostró el programa
//       error:      null, o { nombre, mensaje }
//       resultados: lista de { descripcion, aprobada }
//       tablas:     opcional; lista de { columnas, filas } (resultados de SQL)
//       vista:      opcional; { html } con un documento HTML completo para
//                   mostrar como vista previa (motor "web"). Es código del
//                   estudiante: la interfaz debe pintarlo en un <iframe>
//                   aislado (sandbox), nunca con innerHTML en la página.
//                   Puede venir aunque haya error (el navegador tolera más
//                   que nuestro analizador). Si NO viene (p. ej. el script
//                   se quedó en un bucle infinito), no hay nada que pintar.
//   explicarError(error)       → texto en español para el estudiante
//   ayudaSinSalida             → qué decir cuando el programa no mostró nada
//   Opcionales: preparar() empieza a cargar el motor antes de usarlo;
//   describir(paso) devuelve material de consulta (las tablas de la base);
//   lenguaje, nombreLenguaje, archivo y sangria ajustan el editor.
//
// Agregar un lenguaje nuevo es registrar otro motor; la interfaz no cambia.

(function () {
  'use strict';

  let motores = {};

  function registrar(id, motor) {
    if (typeof motor.ejecutar !== 'function' || typeof motor.explicarError !== 'function') {
      throw new Error('El motor "' + id + '" debe tener las funciones ejecutar y explicarError');
    }
    motores = { ...motores, [id]: Object.freeze({ ...motor }) };
  }

  function obtener(id) {
    return Object.prototype.hasOwnProperty.call(motores, id) ? motores[id] : null;
  }

  globalThis.Motores = Object.freeze({ registrar, obtener });
})();

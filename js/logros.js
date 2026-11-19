// logros.js — Calcula qué logros ha conseguido el estudiante.
// Funciones puras: solo leen el progreso y las rutas, no guardan nada.
// Necesita que js/progreso.js se haya cargado antes.

(function () {
  'use strict';

  // El primer commit se hace en este paso de la lección de Git
  // (rutas/proyectos/01-guardar-con-git.js, paso "Preparar y guardar").
  const PASO_PRIMER_COMMIT = 'proyectos/guardar-con-git/preparar-y-guardar';

  function leccionCompleta(progreso, ruta, leccion) {
    return (
      leccion.pasos.length > 0 &&
      leccion.pasos.every(
        (paso) => progreso.completados[globalThis.Progreso.clavePaso(ruta.id, leccion.id, paso.id)]
      )
    );
  }

  function rutaCompleta(progreso, ruta) {
    return ruta.lecciones.every((leccion) => leccionCompleta(progreso, ruta, leccion));
  }

  function calcular(progreso, rutas, hoy) {
    const { Progreso } = globalThis;
    const seguidos = Progreso.racha(progreso, hoy);
    const rutasConLecciones = rutas.filter((ruta) => ruta.lecciones.length > 0);

    return [
      {
        id: 'primer-paso',
        titulo: 'Primer paso',
        descripcion: 'Completa tu primer ejercicio.',
        conseguido: Object.keys(progreso.completados).length > 0,
      },
      {
        id: 'primera-leccion',
        titulo: 'Lección completa',
        descripcion: 'Termina todos los pasos de una lección.',
        conseguido: rutas.some((ruta) =>
          ruta.lecciones.some((leccion) => leccionCompleta(progreso, ruta, leccion))
        ),
      },
      {
        id: 'racha-3',
        titulo: 'Tres días seguidos',
        descripcion: 'Practica tres días seguidos.',
        conseguido: seguidos >= 3,
      },
      {
        id: 'racha-7',
        titulo: 'Una semana seguida',
        descripcion: 'Practica siete días seguidos, sin fallar.',
        conseguido: seguidos >= 7,
      },
      {
        id: 'cien-puntos',
        titulo: '100 puntos',
        descripcion: 'Junta 100 puntos completando pasos.',
        conseguido: Progreso.puntos(progreso) >= 100,
      },
      ...rutasConLecciones.map((ruta) => ({
        id: 'ruta-' + ruta.id,
        titulo: 'Terminaste ' + ruta.titulo,
        descripcion: 'Completa todos los pasos de ' + ruta.titulo + '.',
        conseguido: rutaCompleta(progreso, ruta),
      })),
      {
        id: 'primer-commit',
        titulo: 'Primer commit',
        descripcion: 'Guarda tu primera foto del proyecto con Git.',
        conseguido: progreso.completados[PASO_PRIMER_COMMIT] === true,
      },
    ];
  }

  globalThis.Logros = Object.freeze({ PASO_PRIMER_COMMIT, calcular });
})();

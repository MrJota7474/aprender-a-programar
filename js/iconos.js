// iconos.js — Íconos SVG en línea, dibujados a mano: simples, de trazo y sin relleno.
//
// Los dibujos son texto fijo escrito aquí (nunca texto del estudiante), por eso
// app.js puede ponerlos con innerHTML sin riesgo. Todos miden 24×24, usan el
// color del texto que los rodea (currentColor) y llevan aria-hidden: son
// adorno, el significado siempre va escrito al lado.

(function () {
  'use strict';

  const CLASE = 'icono';

  // Solo el interior de cada dibujo; el envoltorio <svg> es común.
  const DIBUJOS = Object.freeze({
    // Rutas
    python: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M13 15h4"/>',
    javascript:
      '<path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 3-2 3 1 0 2 1.5 2 3v2c0 2 1 3 3 3"/>' +
      '<path d="M16 4c2 0 3 1 3 3v2c0 1.5 1 3 2 3-1 0-2 1.5-2 3v2c0 2-1 3-3 3"/>',
    sql:
      '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/>' +
      '<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    ia:
      '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/>' +
      '<path d="M19 15v5M16.5 17.5h5"/>',
    // Una ventana de terminal con su cursor: el agente trabaja escribiendo y corriendo código.
    'con-ia':
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10l3 2.5L7 15"/>' +
      '<path d="M12 15h5"/><path d="M17 7.5h.01"/>',
    // Un árbol de tres nodos: la estructura de datos más típica de la carrera.
    fundamentos:
      '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>' +
      '<path d="M11 7l-4 10M13 7l4 10"/>',
    web:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>' +
      '<path d="M6.5 6.5h.01M9.5 6.5h.01"/>',
    proyectos:
      '<path d="M12 3c3 2 5 5.5 5 9l-2 3H9l-2-3c0-3.5 2-7 5-9z"/><circle cx="12" cy="10" r="1.5"/>' +
      '<path d="M9 15l-2 4 3-1M15 15l2 4-3-1"/>',
    // Una pantalla de computador con su base: programar en tu propio PC.
    'tu-computador':
      '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>' +
      '<path d="M7 9l2 1.5L7 12M11 12h3"/>',
    // Un martillo: la herramienta del trabajo diario, como la sigla ⚒ de la ruta.
    oficio: '<path d="M4 20l9-9"/><path d="M10 8l4-4 6 6-4 4z"/>',
    // Una carpeta con < > adentro: un proyecto es una carpeta llena de código.
    'proyectos-ia':
      '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
      '<path d="M10 11l-2 2 2 2M14 11l2 2-2 2"/>',
    // Un maletín: el primer trabajo.
    'primer-trabajo':
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>' +
      '<path d="M3 13h18"/>',
    // Unas barras de gráfica sobre su eje: analizar datos es resumirlos en números.
    datos: '<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    // Tres nodos conectados a uno: la idea de un modelo que aprende de varias entradas.
    ml:
      '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="5" cy="12" r="2"/>' +
      '<circle cx="19" cy="12" r="2"/><path d="M7 6l10 6M7 12h10M7 18l10-6"/>',
    // El átomo del logo de React: un núcleo con órbitas cruzadas.
    react:
      '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/>' +
      '<ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/>' +
      '<ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/>',
    // Un escudo con un chulo: proteger la información.
    ciberseguridad:
      '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    // Interfaz
    llama: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
    estrella: '<path d="M12 3l2.8 5.8 6.2.8-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.8z"/>',
    trofeo:
      '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3"/>' +
      '<path d="M12 13v4M8 20h8M10 17h4"/>',
    candado: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  });

  function envolver(dibujo) {
    return (
      '<svg class="' + CLASE + '" viewBox="0 0 24 24" width="24" height="24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + dibujo + '</svg>'
    );
  }

  // Un ícono de interfaz por nombre ("llama", "estrella", "trofeo", "candado", "check").
  function de(nombre) {
    return envolver(DIBUJOS[nombre] || DIBUJOS.check);
  }

  // El ícono de una ruta por su id. Si la ruta es nueva y aún no tiene dibujo,
  // se usan las llaves para que nunca quede un hueco.
  function deRuta(id) {
    return envolver(DIBUJOS[id] || DIBUJOS.javascript);
  }

  globalThis.Iconos = Object.freeze({ de, deRuta });
})();

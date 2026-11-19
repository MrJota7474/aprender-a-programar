// formato.js — Convierte el texto de las lecciones en HTML seguro, y
// traduce los errores de JavaScript (que vienen en inglés) a español.

(function () {
  'use strict';

  const ENTIDADES = Object.freeze({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  });

  function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);
  }

  // Mini-formato de las lecciones: `código` y **negrita**.
  // Primero se escapa TODO y solo después se agregan nuestras dos etiquetas,
  // así ningún texto puede colar HTML propio en la página.
  function formatearTexto(texto) {
    return escaparHtml(texto)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  // Cada regla: un patrón del mensaje original y su explicación en español.
  const EXPLICACIONES = Object.freeze([
    {
      patron: /^(\S+) is not defined/,
      explicar: (coincidencia) =>
        'Usaste "' + coincidencia[1] + '", pero ese nombre no existe. Revisa que esté bien ' +
        'escrito (las mayúsculas cuentan) y que lo hayas creado con let o const.',
    },
    {
      patron: /constant variable|assignment to const/i,
      explicar: () =>
        'Intentaste cambiar un valor creado con const. Si necesitas cambiarlo, créalo con let.',
    },
    {
      patron: /has already been declared|redeclaration/i,
      explicar: () =>
        'Creaste dos veces el mismo nombre. Para cambiar su valor no repitas let: ' +
        'escribe solo nombre = nuevoValor.',
    },
    {
      patron: /is not a function/,
      explicar: () =>
        'Intentaste usar como función algo que no lo es. Revisa el nombre y los paréntesis.',
    },
    {
      patron: /Cannot read properties of (undefined|null)|is (undefined|null)$/,
      explicar: () =>
        'Intentaste leer algo dentro de un valor vacío (undefined). ' +
        'Revisa la posición del arreglo o el nombre de la propiedad.',
    },
    {
      patron: /before initialization/,
      explicar: () => 'Usaste una variable antes de la línea donde la creas. Créala primero.',
    },
    // ---------- código asíncrono y fetch ----------
    {
      patron: /await is only valid/,
      explicar: () =>
        'Usaste await dentro de una función que no es async. Escribe async antes de ' +
        'function (o antes de los paréntesis de una función flecha).',
    },
    {
      patron: /^Failed to fetch|NetworkError|fetch failed/,
      explicar: () =>
        'fetch no pudo conectarse con esa dirección. En esta app no hay internet: solo existe ' +
        'la API simulada de la tienda, en https://api.tienda-donpepe.co (por ejemplo /productos, ' +
        '/productos/1, /clientes o /pedidos). Revisa que la dirección esté bien escrita.',
    },
    {
      patron: /Failed to parse URL|Invalid URL/,
      explicar: () =>
        'La dirección no está completa. Escríbela entera, empezando por https:// ' +
        '(por ejemplo "https://api.tienda-donpepe.co/productos").',
    },
    {
      patron: /already been consumed|body used already|Body is unusable/i,
      explicar: () =>
        'Leíste dos veces el cuerpo de la misma respuesta. json() y text() solo se pueden usar ' +
        'una vez: guarda el resultado en una variable y úsala las veces que quieras.',
    },
    {
      patron: /cannot have body/i,
      explicar: () =>
        'Mandaste datos (body) en una petición GET: para enviar datos usa method: "POST".',
    },
    {
      patron: /"callback" argument must be of type function/,
      explicar: () =>
        'setTimeout y setInterval necesitan recibir una función. Si escribiste setTimeout(saludar(), 100), ' +
        'quita los paréntesis (setTimeout(saludar, 100)) o usa una flecha: setTimeout(() => saludar(), 100).',
    },
  ]);

  // Cuando una promesa falla y nadie la espera con await (ni le pone .catch),
  // el error aparece "suelto". Se avisa antes de explicar el error mismo.
  const AYUDA_SIN_ATRAPAR =
    'Una promesa falló y nadie atrapó su error: llama a esa función async con await ' +
    '(dentro de try / catch si el error puede pasar) o agrégale .catch( ). ';

  const AYUDA_SINTAXIS =
    'Hay un error de escritura. Revisa que cada paréntesis ( ), llave { } y comilla " " ' +
    'que abriste también esté cerrada.';

  function explicarError(error) {
    if (error.nombre === 'TiempoAgotado') return error.mensaje;

    const regla = EXPLICACIONES.find((candidata) => candidata.patron.test(error.mensaje));
    let explicacion = 'Algo falló al ejecutar tu código.';
    if (regla) {
      explicacion = regla.explicar(error.mensaje.match(regla.patron));
    } else if (error.nombre === 'SyntaxError') {
      explicacion = AYUDA_SINTAXIS;
    }

    const aviso = error.sinAtrapar ? AYUDA_SIN_ATRAPAR : '';
    // Mostramos también el mensaje original: aprender a leerlo es parte del oficio.
    return aviso + explicacion + ' (Mensaje original: ' + error.nombre + ': ' + error.mensaje + ')';
  }

  globalThis.escaparHtml = escaparHtml;
  globalThis.formatearTexto = formatearTexto;
  globalThis.explicarError = explicarError;
})();

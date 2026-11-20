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
  // Al final se marcan las palabras del glosario (ver marcarGlosario).
  //
  // El código se aparta antes de buscar la negrita: si no, los ** de un
  // ejemplo como `2 ** 3` se emparejarían con otros ** del párrafo y el HTML
  // quedaría mal anidado. Cada `…` se cambia por un marcador \u0000N\u0000
  // (un carácter que ningún texto de lección usa), se aplica la negrita sobre
  // lo que queda y al final cada marcador vuelve a ser su <code>.
  function formatearTexto(texto) {
    const codigos = [];
    // Los \u0000 que trajera el texto se quitan: así nadie puede fingir un marcador.
    const sinCodigo = escaparHtml(String(texto).replace(/\u0000/g, '')).replace(/`([^`]+)`/g, (_todo, contenido) => {
      codigos.push(contenido);
      return '\u0000' + (codigos.length - 1) + '\u0000';
    });
    const html = sinCodigo
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\u0000(\d+)\u0000/g, (_todo, indice) => '<code>' + codigos[Number(indice)] + '</code>');
    return marcarGlosario(html);
  }

  // ---------- Glosario dentro del texto ----------

  // Con más marcas el párrafo se vuelve difícil de leer.
  const MAXIMO_MARCAS_POR_PARRAFO = 3;

  // Cada definición necesita un id único en la página para que el término la
  // anuncie con aria-describedby. Un contador basta: el mismo término puede
  // salir en varios párrafos a la vez y cada aparición necesita su propio id.
  let contadorDefiniciones = 0;

  // Separa el HTML ya formateado en pedazos: etiquetas, bloques <code>…</code>
  // y entidades (&amp;, &#39;…) quedan enteros, y solo se buscan términos en
  // el texto suelto. Así nunca se marca dentro de un código ni se parte una
  // etiqueta o una entidad por la mitad.
  const PEDAZOS = /(<code>[\s\S]*?<\/code>|<[^>]*>|&#?\w+;)/;

  function marcarGlosario(html) {
    const glosario = globalThis.Glosario;
    // Sin glosario cargado (algunas pruebas, o si falla su archivo) el texto
    // queda igual que antes: la lección se sigue leyendo bien.
    if (!glosario) return html;

    const usados = new Set();
    return html
      .split(PEDAZOS)
      .map((pedazo, indice) => {
        // Los pedazos impares son los que capturó PEDAZOS: se dejan tal cual.
        if (indice % 2 === 1) return pedazo;
        return pedazo.replace(glosario.patron, (encontrado, _forma, posicion) => {
          const entrada = glosario.buscar(encontrado);
          if (!entrada || usados.has(entrada) || usados.size >= MAXIMO_MARCAS_POR_PARRAFO) {
            return encontrado;
          }
          // Algunas palabras también son palabras comunes ("ya está lista"):
          // el diccionario dice qué texto justo antes indica que no es el término.
          if (entrada.evitarTras && entrada.evitarTras.test(pedazo.slice(0, posicion))) {
            return encontrado;
          }
          usados.add(entrada);
          return marcaDeTermino(encontrado, entrada);
        });
      })
      .join('');
  }

  // Un <button> porque se puede enfocar con Tab y tocar en el celular sin
  // trucos; aria-describedby hace que un lector de pantalla lea la
  // definición al llegar al término. "encontrado" es texto ya escapado (sale
  // del pedazo escapado) y la definición viene del diccionario fijo de
  // glosario.js, que igual se escapa aquí: ningún texto entra crudo.
  function marcaDeTermino(encontrado, entrada) {
    contadorDefiniciones += 1;
    const id = 'glosario-def-' + contadorDefiniciones;
    const ejemplo = entrada.ejemplo
      ? ' <code class="glosario__ejemplo">' + escaparHtml(entrada.ejemplo) + '</code>'
      : '';
    return (
      '<span class="glosario">' +
      '<button type="button" class="glosario__termino" aria-expanded="false" aria-describedby="' + id + '">' +
      encontrado +
      '</button>' +
      '<span class="glosario__definicion" role="tooltip" id="' + id + '">' +
      '<strong class="glosario__nombre">' + escaparHtml(entrada.termino) + ':</strong> ' +
      escaparHtml(entrada.definicion) +
      ejemplo +
      '</span></span>'
    );
  }

  // Un mini ejemplo en una sola línea: los errores se pintan con
  // textContent, así que no llevan saltos de línea ni HTML, solo texto.
  function antesDespues(antes, despues) {
    return ' Antes: ' + antes + '  →  Después: ' + despues;
  }

  // Métodos de Python que el estudiante prueba en JavaScript por costumbre.
  const METODOS_DE_PYTHON = Object.freeze({
    append: ['push', 'frutas.append("mango")', 'frutas.push("mango")'],
    upper: ['toUpperCase', 'nombre.upper()', 'nombre.toUpperCase()'],
    lower: ['toLowerCase', 'nombre.lower()', 'nombre.toLowerCase()'],
    strip: ['trim', 'texto.strip()', 'texto.trim()'],
    len: ['.length', 'len(frutas)', 'frutas.length'],
  });

  // Cada regla: un patrón del mensaje original y su explicación en español.
  // Cada explicación dice qué pasó y cómo arreglarlo, con un mini ejemplo
  // cuando ayuda. Van de la más específica a la más general.
  const EXPLICACIONES = Object.freeze([
    {
      patron: /^(\S+) is not defined/,
      explicar: (coincidencia) => {
        const nombre = coincidencia[1];
        if (Object.prototype.hasOwnProperty.call(METODOS_DE_PYTHON, nombre)) {
          const [enJavaScript, antes, despues] = METODOS_DE_PYTHON[nombre];
          return nombre + ' es de Python; en JavaScript se usa ' + enJavaScript + '.' + antesDespues(antes, despues);
        }
        if (nombre === 'print') {
          return 'print es de Python; en JavaScript se muestra con console.log( ).' +
            antesDespues('print("hola")', 'console.log("hola")');
        }
        return (
          'Usaste "' + nombre + '", pero ese nombre no existe. Revisa que esté bien ' +
          'escrito (las mayúsculas cuentan) y que lo hayas creado con let o const. ' +
          'Si querías un texto, ponlo entre comillas.' +
          antesDespues('console.log(hola)', 'console.log("hola")')
        );
      },
    },
    {
      patron: /constant variable|assignment to const/i,
      explicar: () =>
        'Intentaste cambiar un valor creado con const. Si necesitas cambiarlo, créalo con let.' +
        antesDespues('const total = 0; total = 5;', 'let total = 0; total = 5;'),
    },
    {
      patron: /has already been declared|redeclaration/i,
      explicar: () =>
        'Creaste dos veces el mismo nombre. Para cambiar su valor no repitas let: ' +
        'escribe solo nombre = nuevoValor.' +
        antesDespues('let puntos = 1; let puntos = 2;', 'let puntos = 1; puntos = 2;'),
    },
    {
      patron: /^Class constructor (\S+) cannot be invoked without 'new'/,
      explicar: (coincidencia) =>
        'Para crear un objeto con la clase ' + coincidencia[1] + ' hay que escribir new antes.' +
        antesDespues('const p = ' + coincidencia[1] + '()', 'const p = new ' + coincidencia[1] + '()'),
    },
    {
      patron: /^(.+?) is not a function/,
      explicar: (coincidencia) => {
        const nombre = coincidencia[1];
        const metodo = (nombre.match(/\.(\w+)$/) || [])[1];
        if (metodo && Object.prototype.hasOwnProperty.call(METODOS_DE_PYTHON, metodo)) {
          const [enJavaScript, antes, despues] = METODOS_DE_PYTHON[metodo];
          return metodo + ' es de Python; en JavaScript se usa ' + enJavaScript + '.' + antesDespues(antes, despues);
        }
        return (
          '"' + nombre + '" no es una función, y le pusiste paréntesis como si lo fuera. Revisa que el ' +
          'nombre esté bien escrito (por ejemplo toUpperCase, con las mayúsculas en su sitio) y que ' +
          'ese valor sí tenga ese método: push es de los arreglos, no de los textos.'
        );
      },
    },
    {
      patron: /Cannot read properties of (undefined|null) \(reading '([^']*)'\)/,
      explicar: (coincidencia) =>
        'Intentaste leer "' + coincidencia[2] + '" dentro de un valor vacío (' + coincidencia[1] + '). ' +
        'Lo que va antes del punto no existe: revisa la posición del arreglo (se cuenta desde 0) o el ' +
        'nombre de la propiedad (por ejemplo, length y no lenght).' +
        antesDespues('frutas[3].nombre  (con 3 frutas)', 'frutas[2].nombre'),
    },
    {
      patron: /Cannot read properties of (undefined|null)|is (undefined|null)$/,
      explicar: () =>
        'Intentaste leer algo dentro de un valor vacío (undefined). ' +
        'Revisa la posición del arreglo o el nombre de la propiedad.',
    },
    {
      patron: /before initialization/,
      explicar: () =>
        'Usaste una variable antes de la línea donde la creas. Créala primero.' +
        antesDespues('console.log(x); let x = 1;', 'let x = 1; console.log(x);'),
    },
    // Va antes de los errores de escritura: JSON.parse también dice "Unexpected token".
    {
      patron: /JSON input|in JSON at position|is not valid JSON|JSON\.parse/,
      explicar: () =>
        'El texto que le pasaste a JSON.parse no es un JSON válido. En JSON las claves y los textos van ' +
        'con comillas dobles, y el texto no puede estar vacío.' +
        antesDespues("JSON.parse('{nombre: \"Ana\"}')", 'JSON.parse(\'{"nombre": "Ana"}\')'),
    },
    // ---------- errores de escritura ----------
    {
      patron: /^Invalid or unexpected token/,
      explicar: () =>
        'Hay un error de escritura: unas comillas sin cerrar, un signo raro (como las comillas “curvas” ' +
        'que pone Word) o un nombre que empieza con número, como 1precio. Cada texto necesita comillas ' +
        'rectas al comienzo y al final, y los nombres empiezan con una letra.' +
        antesDespues('console.log("hola)', 'console.log("hola")'),
    },
    {
      patron: /^Unexpected end of input/,
      explicar: () =>
        'Hay un error de escritura: el código se acabó y quedó algo abierto. Revisa que cada llave { , ' +
        'paréntesis ( y comilla (también la invertida `) tenga su cierre.' +
        antesDespues('function saludar() { console.log("hola");', 'function saludar() { console.log("hola"); }'),
    },
    {
      patron: /^Missing initializer in const declaration/,
      explicar: () =>
        'Una constante (const) necesita su valor en la misma línea donde la creas.' +
        antesDespues('const precio;', 'const precio = 2500;'),
    },
    {
      patron: /^Invalid left-hand side in assignment/,
      explicar: () =>
        'A la izquierda de un = hay algo que no puede guardar un valor. Si querías comparar, usa === en vez de =.' +
        antesDespues('if (edad + 1 = 18)', 'if (edad + 1 === 18)'),
    },
    {
      patron: /^Unexpected (identifier|string|number)/,
      explicar: () =>
        'Hay un error de escritura: aparece un nombre, un texto o un número donde no se esperaba. ' +
        'Casi siempre falta una coma, un + o un paréntesis entre dos valores.' +
        antesDespues('console.log("Total:" total)', 'console.log("Total:", total)'),
    },
    // Tu código corre dentro de una función nuestra (ver evaluador.js): si
    // te falta cerrar una llave, JavaScript tropieza con el ")" de nuestro
    // cierre y se queja de él. Por eso este caso habla de lo que falta.
    {
      patron: /^Unexpected token '?\)'?$/,
      explicar: () =>
        'Hay un error de escritura: o sobra un ")", o te falta cerrar una llave } de una función, ' +
        'un if o un for. Cuenta las llaves y los paréntesis que abres y cierras: debe haber los mismos.' +
        antesDespues('function saludar() { console.log("hola");', 'function saludar() { console.log("hola"); }'),
    },
    // Una palabra de JavaScript donde iba un nombre (let class = 2) también da
    // "Unexpected token", pero el consejo de los paréntesis no le sirve.
    {
      patron: /^Unexpected token '?(class|return|function|new|delete|typeof|switch|case|default|void|with|const|var|let|do|while|for|if|try|catch|finally|throw|break|continue|import|export|enum|super|extends|null|true|false)'?$/,
      explicar: (coincidencia) =>
        'Apareció la palabra "' + coincidencia[1] + '" donde no se esperaba. Si la usaste como nombre de una ' +
        'variable, cámbiala: las palabras de JavaScript (como let, class o return) no pueden ser nombres.' +
        antesDespues('let class = 2;', 'let clase = 2;'),
    },
    // Un ; justo después de un = o de un signo: falta el valor.
    {
      patron: /^Unexpected token '?;'?$/,
      explicar: () =>
        'Hay un error de escritura: falta un valor antes del ";". Después de un = o de un signo como + ' +
        'siempre va algo: un número, un texto o un nombre.' +
        antesDespues('let total = ;', 'let total = 0;'),
    },
    {
      patron: /^Unexpected token '?([^' ]+)'?/,
      explicar: (coincidencia) =>
        'Hay un error de escritura: sobra o está fuera de lugar un "' + coincidencia[1] + '". Cuenta los ' +
        'paréntesis y las llaves que abres y cierras: en un if o un for, primero se cierra el paréntesis ) y después se abre la llave {.' +
        antesDespues('if (edad > 18 {', 'if (edad > 18) {'),
    },
    {
      patron: /reserved word/,
      explicar: () =>
        'Usaste como nombre una palabra reservada de JavaScript (como await, yield o package). ' +
        'Los nombres no pueden ser palabras de JavaScript: elige otro.' +
        antesDespues('let package = 5;', 'let paquete = 5;'),
    },
    // ---------- datos ----------
    {
      patron: /^Reduce of empty array with no initial value/,
      explicar: () =>
        'Usaste reduce en un arreglo vacío sin valor inicial. Dale siempre el valor inicial como segundo dato.' +
        antesDespues('precios.reduce((a, b) => a + b)', 'precios.reduce((a, b) => a + b, 0)'),
    },
    {
      patron: /^Maximum call stack size exceeded/,
      explicar: () =>
        'Una función se llamó a sí misma demasiadas veces, sin parar. Toda función recursiva necesita ' +
        'un caso base: un if que devuelve un resultado sin volver a llamarse.',
    },
    {
      patron: /^Invalid array length/,
      explicar: () => 'Intentaste crear un arreglo con un tamaño negativo o no entero. Revisa el número que usas.',
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
    // JavaScript casi nunca trae la línea, pero si algún motor la manda se dice primero.
    const lugar = error.linea ? 'En la línea ' + error.linea + ': ' : '';
    // Mostramos también el mensaje original: aprender a leerlo es parte del oficio.
    return aviso + lugar + explicacion + ' (Mensaje original: ' + error.nombre + ': ' + error.mensaje + ')';
  }

  globalThis.escaparHtml = escaparHtml;
  globalThis.formatearTexto = formatearTexto;
  globalThis.explicarError = explicarError;
})();

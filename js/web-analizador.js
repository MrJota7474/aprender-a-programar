// web-analizador.js — Lee el HTML del estudiante y arma su "árbol": qué
// etiqueta está dentro de cuál. También entiende selectores (h1, .oferta,
// ul > li) para poder buscar en ese árbol.
//
// ¿Por qué un analizador propio y no el del navegador? Porque las pruebas de
// las lecciones también corren en Node (node --test), donde no existe
// "document". Además, el navegador perdona casi todo en silencio; este
// analizador es estricto a propósito y explica en español qué quedó mal
// (una etiqueta sin cerrar, unas comillas abiertas…), que es justo lo que un
// principiante necesita saber.
//
// Este archivo no usa nada del navegador: lo comparten el Web Worker de la
// página y las pruebas automáticas.

(function () {
  'use strict';

  // ---------- Errores del estudiante ----------

  // Un error "del estudiante" no es una falla del programa: es algo que hay
  // que explicarle. Lleva la descripcion lista para el contrato de los
  // motores: { nombre, mensaje, linea }.
  class ErrorDeEstudiante extends Error {
    constructor(nombre, mensaje, linea) {
      super(mensaje);
      this.descripcion = { nombre, mensaje, linea: linea || null };
    }
  }

  // Las líneas se cuentan desde 1, como en el editor.
  const lineaDe = (texto, posicion) => texto.slice(0, posicion).split('\n').length;

  // ---------- Texto ----------

  // &amp; &lt; &aacute;… El navegador las convierte en el carácter real.
  const ENTIDADES = Object.freeze({
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©', reg: '®',
    aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü',
    Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', Uuml: 'Ü',
    iquest: '¿', iexcl: '¡', hellip: '…', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
    euro: '€', times: '×', deg: '°',
  });

  function decodificar(texto) {
    return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (todo, clave) => {
      if (clave[0] === '#') {
        const esHexadecimal = clave[1].toLowerCase() === 'x';
        const numero = parseInt(clave.slice(esHexadecimal ? 2 : 1), esHexadecimal ? 16 : 10);
        return numero > 0 && numero <= 0x10ffff ? String.fromCodePoint(numero) : todo;
      }
      return Object.prototype.hasOwnProperty.call(ENTIDADES, clave) ? ENTIDADES[clave] : todo;
    });
  }

  // El navegador junta los espacios y saltos de línea seguidos en uno solo.
  const limpiarTexto = (texto) => texto.replace(/\s+/g, ' ').trim();

  // Parte un texto por un separador, pero sin cortar dentro de paréntesis,
  // corchetes o comillas: "rgb(1, 2, 3), red" son 2 pedazos, no 4.
  function dividir(texto, separador) {
    const pedazos = [];
    let actual = '';
    let profundidad = 0;
    let comilla = null;
    for (const caracter of texto) {
      if (comilla !== null) {
        if (caracter === comilla) comilla = null;
      } else if (caracter === '"' || caracter === "'") {
        comilla = caracter;
      } else if (caracter === '(' || caracter === '[') {
        profundidad += 1;
      } else if (caracter === ')' || caracter === ']') {
        profundidad -= 1;
      } else if (caracter === separador && profundidad === 0) {
        pedazos.push(actual);
        actual = '';
        continue;
      }
      actual += caracter;
    }
    pedazos.push(actual);
    return pedazos.map((pedazo) => pedazo.trim()).filter((pedazo) => pedazo !== '');
  }

  // ---------- El árbol ----------

  // Etiquetas que se escriben solas, sin cierre: <br>, <img …>.
  const VACIAS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
  ]);
  // Su contenido NO es HTML: va tal cual hasta la etiqueta de cierre.
  const DE_TEXTO_CRUDO = new Set(['script', 'style', 'textarea', 'title']);
  // Empiezan en renglón aparte: al leer el texto de la página cuentan como
  // un espacio ("<li>Pan</li><li>Leche</li>" se lee "Pan Leche").
  const DE_BLOQUE = new Set([
    'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figure',
    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol',
    'option', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
  ]);
  const SIN_TEXTO_VISIBLE = new Set(['script', 'style']);

  const RAIZ = '#documento';

  class Texto {
    constructor(valor) {
      this.valor = valor;
      this.padre = null;
    }
  }

  // Un elemento es una etiqueta con sus atributos y lo que tiene adentro.
  // A diferencia del resto del proyecto, estos objetos SÍ se modifican: en la
  // lección de JavaScript el programa del estudiante cambia la página
  // (un texto, una clase), y eso es cambiar el árbol.
  class Elemento {
    constructor(etiqueta, atributos, inicio, documento) {
      this.etiqueta = etiqueta;
      this.atributos = atributos; // Map: nombre en minúsculas → valor
      this.nodos = []; // elementos y textos, en orden
      this.padre = null;
      // Posición en el código donde empieza la etiqueta (-1 si la creó un
      // programa). Sirve para decir la línea en los errores y para que un
      // <script> solo vea lo que está escrito antes que él.
      this.inicio = inicio;
      this.documento = documento || this;
      this.estiloPropio = {}; // lo que un programa cambió con elemento.style
      this.oyentes = {}; // funciones que esperan un evento (clic…)
    }

    agregar(nodo) {
      nodo.padre = this;
      this.nodos.push(nodo);
      return nodo;
    }

    // ----- Lo que usan las pruebas de las lecciones -----

    get hijos() {
      return this.nodos.filter((nodo) => nodo instanceof Elemento);
    }

    // Todos los elementos de adentro, en el orden en que están escritos.
    get descendientes() {
      const limite = this.documento.limite;
      return this.hijos
        .filter((hijo) => hijo.inicio < limite)
        .flatMap((hijo) => [hijo, ...hijo.descendientes]);
    }

    // El texto que se ve en la página, con los espacios ya arreglados.
    get texto() {
      return limpiarTexto(textoDe(this, true));
    }

    get clases() {
      return (this.atributo('class') || '').split(/\s+/).filter(Boolean);
    }

    atributo(nombre) {
      const clave = String(nombre).toLowerCase();
      return this.atributos.has(clave) ? this.atributos.get(clave) : null;
    }

    todos(selector) {
      const cadenas = analizarSelector(selector);
      return this.descendientes.filter((elemento) =>
        cadenas.some((cadena) => coincide(elemento, cadena))
      );
    }

    uno(selector) {
      return this.todos(selector)[0] || null;
    }

    // El valor de una propiedad de CSS para este elemento. Lo calcula la
    // hoja de estilos del documento (web-estilos.js).
    estilo(propiedad) {
      return this.documento.estiloDe ? this.documento.estiloDe(this, propiedad) : '';
    }

    color(propiedad) {
      return this.documento.colorDe ? this.documento.colorDe(this, propiedad) : '';
    }
  }

  // soloVisible deja por fuera lo que hay en <script> y <style>.
  function textoDe(nodo, soloVisible) {
    if (nodo instanceof Texto) return nodo.valor;
    if (soloVisible && SIN_TEXTO_VISIBLE.has(nodo.etiqueta)) return '';
    const interior = nodo.nodos.map((hijo) => textoDe(hijo, soloVisible)).join('');
    return soloVisible && DE_BLOQUE.has(nodo.etiqueta) ? ' ' + interior + ' ' : interior;
  }

  // ---------- De texto a árbol ----------

  const R_APERTURA = /<([A-Za-z][A-Za-z0-9-]*)/y;
  const R_CIERRE = /<\/([A-Za-z][A-Za-z0-9-]*)\s*(>?)/y;
  const R_NOMBRE_ATRIBUTO = /[^\s"'=<>\/]+/y;
  const R_VALOR_SIN_COMILLAS = /[^\s"'<>]*/y;

  function buscarEn(patron, texto, posicion) {
    patron.lastIndex = posicion;
    return patron.exec(texto);
  }

  // Lee los atributos de una etiqueta, desde después del nombre hasta el ">".
  function leerAtributos(texto, desde, etiqueta, inicioEtiqueta) {
    const fallar = (mensaje) => {
      throw new ErrorDeEstudiante('ErrorHTML', mensaje, lineaDe(texto, inicioEtiqueta));
    };
    const atributos = new Map();
    let i = desde;
    for (;;) {
      while (i < texto.length && /\s/.test(texto[i])) i += 1;
      const caracter = texto[i];
      if (caracter === undefined || caracter === '<') {
        fallar(
          'A la etiqueta <' + etiqueta + ' le falta el > del final. ' +
          'Toda etiqueta empieza con < y termina con >.'
        );
      }
      if (caracter === '>') return { atributos, fin: i + 1 };
      if (caracter === '/') {
        i += 1;
        continue;
      }
      const nombre = buscarEn(R_NOMBRE_ATRIBUTO, texto, i);
      if (nombre === null) {
        fallar(
          'Dentro de la etiqueta <' + etiqueta + '> hay unas comillas o un signo = que no cuadran. ' +
          'Cada atributo se escribe así: nombre="valor".'
        );
      }
      i += nombre[0].length;
      let valor = '';
      const despuesDelNombre = /\s*=\s*/y;
      const igual = buscarEn(despuesDelNombre, texto, i);
      if (igual !== null) {
        i += igual[0].length;
        const comilla = texto[i];
        if (comilla === '"' || comilla === "'") {
          const cierre = texto.indexOf(comilla, i + 1);
          valor = cierre === -1 ? texto.slice(i + 1) : texto.slice(i + 1, cierre);
          // Si dentro del "valor" empieza otra etiqueta, lo más probable es
          // que las comillas nunca se cerraron y se tragaron lo que seguía.
          if (cierre === -1 || /<[A-Za-z\/!]/.test(valor)) {
            fallar(
              'En la etiqueta <' + etiqueta + '>, al atributo ' + nombre[0] + ' le falta cerrar las comillas. ' +
              'Se escribe así: ' + nombre[0] + '=' + comilla + 'valor' + comilla + '.'
            );
          }
          i = cierre + 1;
        } else {
          const suelto = buscarEn(R_VALOR_SIN_COMILLAS, texto, i);
          valor = suelto[0];
          i += valor.length;
        }
      }
      // Si un atributo se repite, vale el primero (así lo hace el navegador).
      const clave = nombre[0].toLowerCase();
      if (!atributos.has(clave)) atributos.set(clave, decodificar(valor));
    }
  }

  // Devuelve la raíz del árbol. Lanza ErrorDeEstudiante si el HTML está mal formado.
  function analizarHtml(texto) {
    const raiz = new Elemento(RAIZ, new Map(), 0);
    raiz.limite = Infinity;
    raiz.tieneDoctype = false;
    const fallar = (mensaje, posicion) => {
      throw new ErrorDeEstudiante('ErrorHTML', mensaje, lineaDe(texto, posicion));
    };

    // La "pila" son las etiquetas abiertas que faltan por cerrar; la última
    // es donde va cayendo lo que se lee.
    const pila = [raiz];
    const tope = () => pila[pila.length - 1];
    const agregarTexto = (valor) => {
      if (valor !== '') tope().agregar(new Texto(decodificar(valor)));
    };

    let i = 0;
    while (i < texto.length) {
      const menor = texto.indexOf('<', i);
      if (menor === -1) {
        agregarTexto(texto.slice(i));
        break;
      }
      agregarTexto(texto.slice(i, menor));
      i = menor;

      if (texto.startsWith('<!--', i)) {
        const fin = texto.indexOf('-->', i + 4);
        if (fin === -1) fallar('Este comentario no se cerró. Un comentario termina con -->', i);
        i = fin + 3;
        continue;
      }

      if (/^<!doctype/i.test(texto.slice(i, i + 9))) {
        const fin = texto.indexOf('>', i);
        if (fin === -1) fallar('A <!DOCTYPE html le falta el > del final.', i);
        raiz.tieneDoctype = true;
        i = fin + 1;
        continue;
      }

      const cierre = buscarEn(R_CIERRE, texto, i);
      if (cierre !== null) {
        const nombre = cierre[1].toLowerCase();
        if (cierre[2] !== '>') fallar('A la etiqueta de cierre </' + nombre + ' le falta el > del final.', i);
        if (VACIAS.has(nombre)) {
          fallar('<' + nombre + '> se escribe sola, sin etiqueta de cierre. Borra </' + nombre + '>.', i);
        }
        if (tope().etiqueta !== nombre) {
          const abierta = tope();
          if (pila.some((elemento) => elemento.etiqueta === nombre)) {
            fallar(
              'Cerraste </' + nombre + '>, pero adentro todavía está abierta <' + abierta.etiqueta +
              '> (línea ' + lineaDe(texto, abierta.inicio) + '). Cierra primero </' + abierta.etiqueta +
              '>: las etiquetas se cierran en el orden contrario al que se abrieron.',
              i
            );
          }
          fallar(
            'Encontré </' + nombre + '>, pero antes no hay ninguna <' + nombre + '> abierta. ' +
            'O sobra este cierre, o falta la etiqueta de apertura.',
            i
          );
        }
        pila.pop();
        i += cierre[0].length;
        continue;
      }

      const apertura = buscarEn(R_APERTURA, texto, i);
      if (apertura === null) {
        // Un "<" que no empieza una etiqueta (como en "2 < 3") es texto.
        agregarTexto('<');
        i += 1;
        continue;
      }

      const etiqueta = apertura[1].toLowerCase();
      const { atributos, fin } = leerAtributos(texto, i + apertura[0].length, etiqueta, i);
      const elemento = tope().agregar(new Elemento(etiqueta, atributos, i, raiz));
      i = fin;

      if (VACIAS.has(etiqueta)) continue;

      if (DE_TEXTO_CRUDO.has(etiqueta)) {
        const patronCierre = new RegExp('</' + etiqueta + '\\s*>', 'ig');
        const final = buscarEn(patronCierre, texto, i);
        if (final === null) {
          fallar('La etiqueta <' + etiqueta + '> no se cerró. Agrega </' + etiqueta + '> donde termina.', elemento.inicio);
        }
        const contenido = texto.slice(i, final.index);
        // Se anota dónde empieza el contenido para ubicar la línea de un error de CSS.
        elemento.inicioContenido = i;
        const esCodigo = etiqueta === 'script' || etiqueta === 'style';
        if (contenido !== '') elemento.agregar(new Texto(esCodigo ? contenido : decodificar(contenido)));
        i = final.index + final[0].length;
        continue;
      }

      pila.push(elemento);
    }

    if (pila.length > 1) {
      const abierta = tope();
      const nombre = abierta.etiqueta;
      // <h1>Hola<h1> : dos iguales abiertas, una dentro de otra, casi siempre
      // es una etiqueta de cierre a la que se le olvidó la barra.
      const faltoLaBarra = pila[pila.length - 2].etiqueta === nombre;
      fallar(
        faltoLaBarra
          ? 'La etiqueta <' + nombre + '> no se cerró. Parece que a la etiqueta de cierre le faltó ' +
            'la barra: se escribe </' + nombre + '>.'
          : 'La etiqueta <' + nombre + '> no se cerró. Agrega </' + nombre + '> donde termina su contenido.',
        abierta.inicio
      );
    }

    return raiz;
  }

  // ---------- Selectores ----------

  const NOMBRE = '[\\w\\u00C0-\\u024F-]+';
  const R_PARTE = new RegExp(
    '(\\*|[A-Za-z][\\w-]*)' + // 1: etiqueta
      '|#(' + NOMBRE + ')' + // 2: id
      '|\\.(' + NOMBRE + ')' + // 3: clase
      // 4, 5, 6: [atributo], [atributo="valor"], [atributo^="valor"]…
      '|\\[\\s*([\\w-]+)\\s*(?:([~^$*|]?=)\\s*("[^"]*"|\'[^\']*\'|[^\\]\\s]+)\\s*)?\\]' +
      '|(::?)([\\w-]+)(?:\\(([^)]*)\\))?', // 7, 8, 9: :primero, ::antes, :nth-child(2)
    'y'
  );
  const R_COMBINADOR = /\s*([>+~])?\s*/y;

  const selectorInvalido = (texto) => new Error('No entiendo el selector "' + texto + '"');

  // "ul > li.oferta" → [{ combinador: null, etiqueta: 'ul' }, { combinador: '>', etiqueta: 'li', clases: ['oferta'] }]
  function analizarCadena(texto) {
    const partes = [];
    let i = 0;
    for (;;) {
      const separador = buscarEn(R_COMBINADOR, texto, i);
      i += separador[0].length;
      if (i >= texto.length) {
        if (separador[1] || partes.length === 0) throw selectorInvalido(texto);
        return partes;
      }
      if (partes.length === 0 && separador[1]) throw selectorInvalido(texto);
      if (partes.length > 0 && separador[0] === '') throw selectorInvalido(texto);

      const parte = {
        combinador: partes.length === 0 ? null : separador[1] || ' ',
        etiqueta: null,
        id: null,
        clases: [],
        atributos: [],
        pseudos: [],
      };
      let leidas = 0;
      for (;;) {
        const m = buscarEn(R_PARTE, texto, i);
        if (m === null) break;
        if (m[1] !== undefined) {
          if (leidas > 0) throw selectorInvalido(texto);
          parte.etiqueta = m[1].toLowerCase();
        } else if (m[2] !== undefined) {
          parte.id = m[2];
        } else if (m[3] !== undefined) {
          parte.clases.push(m[3]);
        } else if (m[4] !== undefined) {
          const valor = m[6] === undefined ? null : m[6].replace(/^["']|["']$/g, '');
          parte.atributos.push({ nombre: m[4].toLowerCase(), operador: m[5] || null, valor });
        } else {
          parte.pseudos.push({ esElemento: m[7] === '::', nombre: m[8].toLowerCase(), argumento: m[9] });
        }
        leidas += 1;
        i += m[0].length;
      }
      if (leidas === 0) throw selectorInvalido(texto);
      partes.push(parte);
    }
  }

  // Analizar un selector cuesta; el mismo se usa muchas veces, así que se recuerda.
  const selectoresVistos = new Map();

  // Un selector puede ser una lista separada por comas: "h1, h2".
  function analizarSelector(selector) {
    if (selector instanceof Elemento) throw new Error('Aquí va un selector (texto), no un elemento');
    const texto = String(selector).trim();
    if (!selectoresVistos.has(texto)) {
      const cadenas = dividir(texto, ',').map(analizarCadena);
      if (cadenas.length === 0) throw selectorInvalido(texto);
      selectoresVistos.set(texto, cadenas);
    }
    return selectoresVistos.get(texto);
  }

  // :nth-child(2), :nth-child(odd), :nth-child(2n+1)
  function cumpleNth(argumento, posicion) {
    const texto = String(argumento || '').replace(/\s+/g, '').toLowerCase();
    if (texto === 'odd') return posicion % 2 === 1;
    if (texto === 'even') return posicion % 2 === 0;
    if (/^\d+$/.test(texto)) return posicion === Number(texto);
    const m = texto.match(/^([+-]?\d*)n([+-]\d+)?$/);
    if (m === null) return false;
    const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : Number(m[1]);
    const b = m[2] ? Number(m[2]) : 0;
    if (a === 0) return posicion === b;
    return (posicion - b) % a === 0 && (posicion - b) / a >= 0;
  }

  function cumplePseudo(elemento, pseudo) {
    // ::before y ::after no son elementos del árbol. Y :hover o :focus
    // dependen de lo que haga la persona con el ratón: aquí nunca aplican.
    if (pseudo.esElemento) return false;
    const hermanos = elemento.padre ? elemento.padre.hijos : [elemento];
    switch (pseudo.nombre) {
      case 'first-child':
        return hermanos[0] === elemento;
      case 'last-child':
        return hermanos[hermanos.length - 1] === elemento;
      case 'nth-child':
        return cumpleNth(pseudo.argumento, hermanos.indexOf(elemento) + 1);
      case 'not':
        return !analizarSelector(pseudo.argumento).some((cadena) => coincide(elemento, cadena));
      default:
        return false;
    }
  }

  function cumpleAtributo(elemento, { nombre, operador, valor }) {
    const real = elemento.atributo(nombre);
    if (real === null) return false;
    switch (operador) {
      case null:
        return true;
      case '=':
        return real === valor;
      case '~=':
        return real.split(/\s+/).includes(valor);
      case '^=':
        return valor !== '' && real.startsWith(valor);
      case '$=':
        return valor !== '' && real.endsWith(valor);
      case '*=':
        return valor !== '' && real.includes(valor);
      default: // |=
        return real === valor || real.startsWith(valor + '-');
    }
  }

  function cumpleParte(elemento, parte) {
    if (elemento.etiqueta === RAIZ) return false;
    if (parte.etiqueta !== null && parte.etiqueta !== '*' && parte.etiqueta !== elemento.etiqueta) return false;
    if (parte.id !== null && elemento.atributo('id') !== parte.id) return false;
    const clases = elemento.clases;
    return (
      parte.clases.every((clase) => clases.includes(clase)) &&
      parte.atributos.every((atributo) => cumpleAtributo(elemento, atributo)) &&
      parte.pseudos.every((pseudo) => cumplePseudo(elemento, pseudo))
    );
  }

  // Los selectores se revisan de derecha a izquierda: primero el elemento
  // mismo y después, según el combinador, su papá, sus abuelos o sus hermanos.
  function coincide(elemento, cadena, indice = cadena.length - 1) {
    const parte = cadena[indice];
    if (!cumpleParte(elemento, parte)) return false;
    if (indice === 0) return true;

    const hermanosAnteriores = () => {
      const hermanos = elemento.padre ? elemento.padre.hijos : [];
      return hermanos.slice(0, hermanos.indexOf(elemento));
    };
    switch (parte.combinador) {
      case '>':
        return elemento.padre !== null && coincide(elemento.padre, cadena, indice - 1);
      case '+': {
        const anteriores = hermanosAnteriores();
        return anteriores.length > 0 && coincide(anteriores[anteriores.length - 1], cadena, indice - 1);
      }
      case '~':
        return hermanosAnteriores().some((hermano) => coincide(hermano, cadena, indice - 1));
      default: // espacio: cualquier antepasado
        for (let ancestro = elemento.padre; ancestro !== null; ancestro = ancestro.padre) {
          if (coincide(ancestro, cadena, indice - 1)) return true;
        }
        return false;
    }
  }

  // Qué tan "fuerte" es un selector: [ids, clases, etiquetas]. Cuando dos
  // reglas chocan, gana la más específica (.oferta le gana a p).
  function especificidad(cadena) {
    return cadena.reduce(
      ([ids, clases, etiquetas], parte) => {
        const pseudoElementos = parte.pseudos.filter((pseudo) => pseudo.esElemento).length;
        return [
          ids + (parte.id !== null ? 1 : 0),
          clases + parte.clases.length + parte.atributos.length + parte.pseudos.length - pseudoElementos,
          etiquetas + (parte.etiqueta !== null && parte.etiqueta !== '*' ? 1 : 0) + pseudoElementos,
        ];
      },
      [0, 0, 0]
    );
  }

  globalThis.AnalizadorWeb = Object.freeze({
    ErrorDeEstudiante,
    Elemento,
    Texto,
    analizarHtml,
    analizarSelector,
    coincide,
    especificidad,
    dividir,
    limpiarTexto,
    lineaDe,
    textoDe,
    RAIZ,
  });
})();

// resaltado.js — Colorea el código del editor (palabras clave, textos,
// números y comentarios) para JavaScript, Python, SQL, HTML, CSS y la terminal.
//
// No es un analizador completo del lenguaje: reconoce "fichas" sencillas con
// una expresión regular. Para un editor de aprendizaje es suficiente y evita
// depender de una librería grande.

(function () {
  'use strict';

  // Se escriben como expresiones regulares normales y se toma su texto
  // (.source) para poder combinarlas en una sola.
  const CADENA = /"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|`(?:\\.|[^`\\])*`?/.source;
  const NUMERO = /\b\d+(?:\.\d+)?\b/.source;
  const NOMBRE = /[A-Za-z_$À-ɏ][\w$À-ɏ]*/.source;

  // "sinDistinguirMayusculas" es para SQL, donde SELECT y select son lo mismo:
  // sus palabras se guardan en mayúsculas y se compara en mayúsculas.
  function definirLenguaje({ comentario, palabras, valores, sinDistinguirMayusculas = false }) {
    return Object.freeze({
      sinDistinguirMayusculas,
      // Grupos: 1 comentario, 2 texto, 3 número, 4 nombre. El orden importa:
      // un "//" dentro de un texto no debe verse como comentario, y viceversa.
      patron: new RegExp(
        '(' + comentario + ')|(' + CADENA + ')|(' + NUMERO + ')|(' + NOMBRE + ')',
        'g'
      ),
      palabras: new Set(palabras),
      valores: new Set(valores),
    });
  }

  const LENGUAJES = Object.freeze({
    javascript: definirLenguaje({
      comentario: /\/\/.*|\/\*[\s\S]*?\*\//.source,
      palabras: [
        'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'of', 'in',
        'break', 'continue', 'new', 'typeof', 'class', 'switch', 'case', 'default', 'try', 'catch',
      ],
      valores: ['true', 'false', 'null', 'undefined'],
    }),
    python: definirLenguaje({
      comentario: /#.*/.source,
      palabras: [
        'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'import',
        'from', 'as', 'break', 'continue', 'pass', 'class', 'try', 'except', 'with', 'lambda', 'is',
      ],
      valores: ['True', 'False', 'None'],
    }),
    sql: definirLenguaje({
      comentario: /--.*|\/\*[\s\S]*?\*\//.source,
      sinDistinguirMayusculas: true,
      palabras: [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'AS', 'DISTINCT',
        'ORDER', 'GROUP', 'BY', 'HAVING', 'LIMIT', 'ASC', 'DESC', 'JOIN', 'LEFT', 'INNER', 'ON',
        'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'PRIMARY',
        'KEY', 'INTEGER', 'TEXT', 'REAL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
      ],
      valores: ['NULL', 'TRUE', 'FALSE'],
    }),
  });

  function claseDeFicha(coincidencia, lenguaje) {
    if (coincidencia[1] !== undefined) return 'comentario';
    if (coincidencia[2] !== undefined) return 'cadena';
    if (coincidencia[3] !== undefined) return 'numero';
    const nombre = lenguaje.sinDistinguirMayusculas
      ? coincidencia[4].toUpperCase()
      : coincidencia[4];
    if (lenguaje.palabras.has(nombre)) return 'palabra';
    if (lenguaje.valores.has(nombre)) return 'valor';
    return null;
  }

  // Todo lo que se pinta pasa por aquí: el texto del estudiante SIEMPRE se
  // escapa, y las únicas etiquetas que llegan a la página son estos <span>.
  const escapar = (texto) => globalThis.escaparHtml(texto);
  const pintar = (clase, texto) => '<span class="r-' + clase + '">' + escapar(texto) + '</span>';

  // Recorre el código buscando fichas con "patron". Lo que queda entre una
  // ficha y la siguiente se copia escapado; cada ficha la convierte
  // "pintarFicha", que debe devolver HTML ya seguro.
  function recorrer(codigo, patron, pintarFicha) {
    const partes = [];
    let ultimo = 0;
    for (const coincidencia of codigo.matchAll(patron)) {
      partes.push(escapar(codigo.slice(ultimo, coincidencia.index)));
      partes.push(pintarFicha(coincidencia));
      ultimo = coincidencia.index + coincidencia[0].length;
    }
    partes.push(escapar(codigo.slice(ultimo)));
    return partes.join('');
  }

  function resaltarCon(codigo, lenguaje) {
    return recorrer(codigo, lenguaje.patron, (coincidencia) => {
      const clase = claseDeFicha(coincidencia, lenguaje);
      return clase ? pintar(clase, coincidencia[0]) : escapar(coincidencia[0]);
    });
  }

  // ---------- CSS ----------

  // Grupos: 1 comentario, 2 texto, 3 llave, 4 número o color (#fff, 12px),
  // 5 nombre de propiedad (lo que va justo antes de los dos puntos).
  const PATRON_CSS =
    /(\/\*[\s\S]*?(?:\*\/|$))|("[^"\n]*"?|'[^'\n]*'?)|([{}])|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|vh|vw|fr|ms|s|deg|%)?)|([A-Za-z-]+)(?=\s*:)/g;

  function resaltarCss(codigo) {
    // Fuera de las llaves está el selector, y ahí "a:hover" o "#menu" no son
    // una propiedad ni un color: por eso se lleva la cuenta de las llaves.
    let profundidad = 0;
    return recorrer(codigo, PATRON_CSS, (m) => {
      if (m[1] !== undefined) return pintar('comentario', m[0]);
      if (m[2] !== undefined) return pintar('cadena', m[0]);
      if (m[3] !== undefined) {
        profundidad += m[3] === '{' ? 1 : -1;
        return escapar(m[0]);
      }
      if (profundidad <= 0) return escapar(m[0]);
      return pintar(m[4] !== undefined ? 'numero' : 'valor', m[0]);
    });
  }

  // ---------- HTML ----------

  // Grupos: 1 comentario; 2 etiqueta <style> o <script> (3 su nombre) y
  // 4 su contenido, que es otro lenguaje; 5 cualquier otra etiqueta; 6 doctype.
  const PATRON_HTML =
    /(<!--[\s\S]*?(?:-->|$))|(<(style|script)\b[^>]*>)([\s\S]*?)(?=<\/\3\s*>|$)|(<\/?[A-Za-z][^<>]*>?)|(<!doctype[^>]*>?)/gi;
  // Dentro de una etiqueta: un valor (va después de "=" o entre comillas) o
  // el nombre de un atributo.
  const PATRON_ATRIBUTOS = /(=\s*)?("[^"]*"?|'[^']*'?|[^\s"'=<>\/]+)/g;

  // <a href="x">: el nombre de la etiqueta como palabra clave, los atributos
  // como "valor" y lo que va entre comillas como texto.
  function resaltarEtiqueta(etiqueta) {
    const inicio = etiqueta.match(/^(<\/?)([A-Za-z][\w-]*)/);
    const resto = etiqueta.slice(inicio[0].length);
    return (
      escapar(inicio[1]) +
      pintar('palabra', inicio[2]) +
      recorrer(resto, PATRON_ATRIBUTOS, (m) => {
        const esValor = m[1] !== undefined || /^["']/.test(m[2]);
        return escapar(m[1] || '') + pintar(esValor ? 'cadena' : 'valor', m[2]);
      })
    );
  }

  function resaltarHtml(codigo) {
    return recorrer(codigo, PATRON_HTML, (m) => {
      if (m[1] !== undefined || m[6] !== undefined) return pintar('comentario', m[0]);
      if (m[5] !== undefined) return resaltarEtiqueta(m[5]);
      const interior =
        m[3].toLowerCase() === 'style' ? resaltarCss(m[4]) : resaltarCon(m[4], LENGUAJES.javascript);
      return resaltarEtiqueta(m[2]) + interior;
    });
  }

  // ---------- Terminal (comandos de Git) ----------

  // Grupos: 1 comentario (un # al comienzo o después de un espacio; pegado a
  // una palabra no lo es), 2 texto entre comillas, 3 opción (-m, --oneline),
  // 4 palabra suelta (comando, subcomando, archivo o rama).
  const PATRON_TERMINAL =
    /((?:^|(?<=\s))#.*)|("[^"\n]*"?|'[^'\n]*'?|“[^”\n]*”?)|((?:^|(?<=\s))--?[A-Za-z][\w-]*)|([\w.\/-]+)/gm;
  const COMANDOS_TERMINAL = new Set(['git', 'ls', 'cat', 'echo', 'touch', 'rm']);
  const SUBCOMANDOS_GIT = new Set([
    'init', 'status', 'add', 'commit', 'log', 'diff', 'branch', 'switch', 'checkout', 'merge',
  ]);

  function resaltarTerminal(codigo) {
    // Un subcomando ("commit") solo se colorea justo después de "git": en
    // "echo add" la palabra add es un texto cualquiera.
    let anterior = '';
    return recorrer(codigo, PATRON_TERMINAL, (m) => {
      const palabra = m[4];
      const despuesDeGit = anterior === 'git';
      anterior = palabra !== undefined ? palabra : '';
      if (m[1] !== undefined) return pintar('comentario', m[0]);
      if (m[2] !== undefined) return pintar('cadena', m[0]);
      if (m[3] !== undefined) return pintar('valor', m[0]);
      if (COMANDOS_TERMINAL.has(palabra) || (despuesDeGit && SUBCOMANDOS_GIT.has(palabra))) {
        return pintar('palabra', palabra);
      }
      return escapar(palabra);
    });
  }

  // Devuelve HTML seguro: TODO el texto del estudiante pasa por escaparHtml
  // y las únicas etiquetas son los <span> que se agregan aquí.
  function resaltar(codigo, nombreLenguaje) {
    // HTML, CSS y la terminal no caben en el molde de "palabras clave": tienen su propio recorrido.
    if (nombreLenguaje === 'html') return resaltarHtml(codigo);
    if (nombreLenguaje === 'css') return resaltarCss(codigo);
    if (nombreLenguaje === 'terminal') return resaltarTerminal(codigo);
    return Object.prototype.hasOwnProperty.call(LENGUAJES, nombreLenguaje)
      ? resaltarCon(codigo, LENGUAJES[nombreLenguaje])
      : escapar(codigo);
  }

  globalThis.resaltar = resaltar;
})();

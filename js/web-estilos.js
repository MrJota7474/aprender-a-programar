// web-estilos.js — Entiende el CSS del estudiante: lo separa en reglas
// (selector + propiedades) y calcula qué valor le queda a cada elemento.
//
// No dibuja nada (eso lo hace el navegador en la vista previa). Solo
// responde preguntas como "¿de qué color quedó el h1?", que es lo que
// revisan las pruebas de las lecciones.
//
// Como web-analizador.js, no usa nada del navegador.

(function () {
  'use strict';

  const { ErrorDeEstudiante, analizarSelector, coincide, especificidad, dividir, RAIZ } =
    globalThis.AnalizadorWeb;

  // ---------- Valores ----------

  // Deja un valor en una sola forma para poder compararlo: minúsculas, sin
  // comillas y sin espacios de más. "Arial ,  Sans-Serif" → "arial,sans-serif".
  function normalizarValor(valor) {
    return String(valor)
      .toLowerCase()
      .replace(/["']/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      // "grid-column: 1/3" y "1 / 3" son lo mismo para el navegador.
      .replace(/\s*\/\s*/g, '/')
      .trim();
  }

  // Los colores con nombre más usados. Si el estudiante usa uno que no está
  // aquí no pasa nada grave: color() devuelve el nombre tal cual.
  const COLORES = Object.freeze({
    black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff',
    yellow: '#ffff00', orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', gray: '#808080',
    grey: '#808080', brown: '#a52a2a', navy: '#000080', teal: '#008080', aqua: '#00ffff',
    cyan: '#00ffff', lime: '#00ff00', maroon: '#800000', olive: '#808000', silver: '#c0c0c0',
    fuchsia: '#ff00ff', magenta: '#ff00ff', gold: '#ffd700', tomato: '#ff6347', coral: '#ff7f50',
    salmon: '#fa8072', crimson: '#dc143c', indigo: '#4b0082', violet: '#ee82ee', turquoise: '#40e0d0',
    skyblue: '#87ceeb', lightblue: '#add8e6', darkblue: '#00008b', lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3', darkgray: '#a9a9a9', darkgrey: '#a9a9a9', lightgreen: '#90ee90',
    darkgreen: '#006400', darkred: '#8b0000', beige: '#f5f5dc', ivory: '#fffff0', khaki: '#f0e68c',
    lavender: '#e6e6fa', chocolate: '#d2691e', tan: '#d2b48c', steelblue: '#4682b4',
    royalblue: '#4169e1', dodgerblue: '#1e90ff', seagreen: '#2e8b57', forestgreen: '#228b22',
    limegreen: '#32cd32', orangered: '#ff4500', darkorange: '#ff8c00', hotpink: '#ff69b4',
    deeppink: '#ff1493', plum: '#dda0dd', orchid: '#da70d6', whitesmoke: '#f5f5f5',
    gainsboro: '#dcdcdc', dimgray: '#696969', slategray: '#708090', midnightblue: '#191970',
    firebrick: '#b22222', peru: '#cd853f', sienna: '#a0522d', wheat: '#f5deb3',
    lightyellow: '#ffffe0', lightpink: '#ffb6c1', aliceblue: '#f0f8ff', mintcream: '#f5fffa',
    honeydew: '#f0fff0', greenyellow: '#adff2f', yellowgreen: '#9acd32', darkviolet: '#9400d3',
    rebeccapurple: '#663399', lightcoral: '#f08080', lightsalmon: '#ffa07a', cornflowerblue: '#6495ed',
  });

  const dosCifras = (numero) => Math.max(0, Math.min(255, Math.round(numero))).toString(16).padStart(2, '0');

  // Un mismo color se puede escribir de muchas formas: red, #f00, #FF0000,
  // rgb(255, 0, 0). Esta función las lleva todas a "#ff0000". Si el texto no
  // es un color que conozca, devuelve null.
  function aHex(valor) {
    const texto = normalizarValor(valor);
    if (Object.prototype.hasOwnProperty.call(COLORES, texto)) return COLORES[texto];
    if (/^#[0-9a-f]{3,4}$/.test(texto)) {
      return '#' + [1, 2, 3].map((i) => texto[i] + texto[i]).join('');
    }
    if (/^#([0-9a-f]{6}|[0-9a-f]{8})$/.test(texto)) return texto.slice(0, 7);
    const rgb = texto.match(/^rgba?\(([^)]*)\)$/);
    if (rgb !== null) {
      const numeros = rgb[1].split(/[\s,\/]+/).filter(Boolean).slice(0, 3);
      if (numeros.length === 3 && numeros.every((numero) => /^\d+(\.\d+)?$/.test(numero))) {
        return '#' + numeros.map((numero) => dosCifras(Number(numero))).join('');
      }
    }
    return null;
  }

  // Qué tanto se distinguen dos colores, con la fórmula de las pautas de
  // accesibilidad (WCAG): de 1 (iguales) a 21 (negro sobre blanco). El texto
  // normal pide 4.5 o más. Devuelve null si alguno no es un color conocido.
  function contraste(colorA, colorB) {
    const luminancia = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const canal = parseInt(hex.slice(i, i + 2), 16) / 255;
        // Los canales se "deshacen" de la corrección gamma de la pantalla.
        return canal <= 0.03928 ? canal / 12.92 : Math.pow((canal + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const a = aHex(colorA);
    const b = aHex(colorB);
    if (a === null || b === null) return null;
    const [clara, oscura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (clara + 0.05) / (oscura + 0.05);
  }

  const esColor = (ficha) => aHex(ficha) !== null || ficha === 'transparent' || ficha === 'currentcolor';

  // ---------- Propiedades abreviadas ----------

  const LADOS = Object.freeze(['top', 'right', 'bottom', 'left']);
  const ESTILOS_DE_BORDE = new Set(['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']);

  const NOMBRES_NUEVOS_DEL_GAP = Object.freeze({
    'grid-gap': 'gap',
    'grid-row-gap': 'row-gap',
    'grid-column-gap': 'column-gap',
  });

  // "margin: 10px 20px" son en realidad cuatro propiedades. Se agregan las
  // largas para que una prueba pueda preguntar por margin-top sin importar
  // cómo lo escribió el estudiante. Devuelve pares [propiedad, valor].
  function expandir(propiedad, valor) {
    const propia = [[propiedad, valor]];
    const fichas = dividir(valor, ' ');
    if (propiedad === 'background') {
      const color = fichas.find(esColor);
      return color ? [...propia, ['background-color', color]] : propia;
    }
    if (propiedad === 'margin' || propiedad === 'padding') {
      // 1 valor: los cuatro lados. 2: arriba/abajo y lados. 3 y 4: en el orden del reloj.
      const [arriba, derecha = arriba, abajo = arriba, izquierda = derecha] = fichas;
      if (arriba === undefined) return propia;
      const valores = [arriba, derecha, abajo, izquierda];
      return [...propia, ...LADOS.map((lado, i) => [propiedad + '-' + lado, valores[i]])];
    }
    // grid-gap, grid-row-gap y grid-column-gap son los nombres viejos de gap,
    // row-gap y column-gap: el navegador los trata igual, así que una prueba
    // que pregunte por gap debe encontrarlos.
    if (NOMBRES_NUEVOS_DEL_GAP[propiedad]) return [...propia, [NOMBRES_NUEVOS_DEL_GAP[propiedad], valor]];
    if (propiedad === 'border') {
      const color = fichas.find(esColor);
      const estilo = fichas.find((ficha) => ESTILOS_DE_BORDE.has(ficha));
      const ancho = fichas.find((ficha) => /^(\d|\.\d|thin$|medium$|thick$)/.test(ficha));
      return [
        ...propia,
        ...(color ? [['border-color', color]] : []),
        ...(estilo ? [['border-style', estilo]] : []),
        ...(ancho ? [['border-width', ancho]] : []),
      ];
    }
    return propia;
  }

  // "color: red; margin: 0" → [{ propiedad, valor, importante }]. Lo que no
  // tenga la forma propiedad: valor se entrega aparte, en "raras", para que
  // quien llama decida si es un error (hoja de estilos) o se ignora (style="").
  function leerDeclaraciones(cuerpo) {
    const declaraciones = [];
    const raras = [];
    for (const trozo of dividir(cuerpo, ';')) {
      const dosPuntos = trozo.indexOf(':');
      const propiedad = dosPuntos === -1 ? '' : trozo.slice(0, dosPuntos).trim().toLowerCase();
      const crudo = dosPuntos === -1 ? '' : trozo.slice(dosPuntos + 1).trim();
      if (!/^-{0,2}[a-z][a-z0-9-]*$/.test(propiedad) || crudo === '') {
        raras.push(trozo);
        continue;
      }
      const importante = /!\s*important\s*$/i.test(crudo);
      const valor = normalizarValor(crudo.replace(/!\s*important\s*$/i, ''));
      // Un ":" suelto en el valor casi siempre es otra propiedad pegada
      // porque faltó el punto y coma. (En url(http://…) sí es normal.)
      const pegada = /:/.test(crudo.replace(/url\([^)]*\)|"[^"]*"|'[^']*'/g, ''));
      for (const [nombre, valorLargo] of expandir(propiedad, valor)) {
        declaraciones.push({ propiedad: nombre, valor: valorLargo, importante, pegada });
      }
    }
    return { declaraciones, raras };
  }

  // ---------- De texto a reglas ----------

  const normalizarSelector = (texto) =>
    texto
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s*(>|\+|~(?!=))\s*/g, ' $1 ')
      .replace(/\s*,\s*/g, ', ');

  const recortar = (texto) => {
    const limpio = texto.replace(/\s+/g, ' ').trim();
    return limpio.length > 40 ? limpio.slice(0, 40) + '…' : limpio;
  };

  // "ubicar" convierte una posición dentro del CSS en la línea del editor.
  // Devuelve [{ selector, selectores, cadenas, declaraciones }] en el orden escrito.
  function analizarCss(cssOriginal, ubicar = () => null) {
    // Los comentarios se cambian por espacios (y no se borran) para que las
    // posiciones, y con ellas las líneas de los errores, no se corran.
    const css = cssOriginal.replace(/\/\*[\s\S]*?(\*\/|$)/g, (comentario) => comentario.replace(/[^\n]/g, ' '));
    const fallar = (mensaje, posicion) => {
      throw new ErrorDeEstudiante('ErrorCSS', mensaje, ubicar(posicion));
    };
    const FORMA = ' Una regla de CSS se escribe así: selector { propiedad: valor; }';
    const reglas = [];

    let i = 0;
    for (;;) {
      while (i < css.length && /\s/.test(css[i])) i += 1;
      if (i >= css.length) return reglas;

      if (css[i] === '}') fallar('En el CSS sobra una llave de cierre }.', i);

      const abre = css.indexOf('{', i);

      if (css[i] === '@') {
        // @import, @keyframes y demás se saltan completas (con sus llaves de
        // adentro). @media sí se lee: sus reglas se guardan marcadas con la
        // condición, porque solo valen cuando la pantalla la cumple.
        const puntoYComa = css.indexOf(';', i);
        if (abre === -1 || (puntoYComa !== -1 && puntoYComa < abre)) {
          i = puntoYComa === -1 ? css.length : puntoYComa + 1;
          continue;
        }
        let profundidad = 0;
        let j = abre;
        do {
          if (css[j] === '{') profundidad += 1;
          if (css[j] === '}') profundidad -= 1;
          j += 1;
        } while (profundidad > 0 && j < css.length);
        if (profundidad > 0) fallar('A "' + recortar(css.slice(i, abre)) + '" le falta la llave de cierre }.', i);
        const encabezado = css.slice(i, abre).trim();
        if (/^@media\b/i.test(encabezado)) {
          const condicion = normalizarValor(encabezado.slice('@media'.length));
          // Lo de adentro es CSS normal: se lee con esta misma función. Las
          // posiciones se corren para que los errores digan la línea correcta.
          const internas = analizarCss(css.slice(abre + 1, j - 1), (posicion) => ubicar(abre + 1 + posicion));
          // Una @media dentro de otra acumula las dos condiciones.
          internas.forEach((regla) => reglas.push({ ...regla, media: [condicion, ...(regla.media || [])] }));
        }
        i = j;
        continue;
      }

      const preludio = (abre === -1 ? css.slice(i) : css.slice(i, abre)).trim();
      if (abre === -1 || /[;}]/.test(preludio)) {
        fallar('Encontré "' + recortar(preludio) + '" por fuera de las llaves.' + FORMA, i);
      }
      if (preludio === '') {
        fallar('Hay una llave { sin selector antes: falta decir a qué se aplica.' + FORMA, i);
      }

      const cierra = css.indexOf('}', abre);
      const otraAbre = css.indexOf('{', abre + 1);
      if (cierra === -1 || (otraAbre !== -1 && otraAbre < cierra)) {
        fallar('A la regla de "' + recortar(preludio) + '" le falta la llave de cierre }.', i);
      }

      const { declaraciones, raras } = leerDeclaraciones(css.slice(abre + 1, cierra));
      if (raras.length > 0) {
        const rara = recortar(raras[0]);
        fallar(
          rara.includes(':')
            ? 'En la regla de "' + recortar(preludio) + '" no entiendo "' + rara + '". Revisa el nombre de la ' +
              'propiedad (sin espacios) y que tenga un valor después de los dos puntos.'
            : 'En la regla de "' + recortar(preludio) + '", a "' + rara + '" le faltan los dos puntos. ' +
              'Se escribe así: propiedad: valor;',
          abre
        );
      }
      const pegada = declaraciones.find((declaracion) => declaracion.pegada);
      if (pegada !== undefined) {
        fallar(
          'En la regla de "' + recortar(preludio) + '" parece que falta un punto y coma (;) después del valor de ' +
            pegada.propiedad + '. Cada propiedad termina en punto y coma.',
          abre
        );
      }

      const selectores = dividir(preludio, ',').map(normalizarSelector);
      // Un selector que no entendemos se ignora, igual que hace el navegador.
      const cadenas = selectores.flatMap((selector) => {
        try {
          return analizarSelector(selector);
        } catch (error) {
          return [];
        }
      });
      reglas.push({ selector: selectores.join(', '), selectores, cadenas, declaraciones });
      i = cierra + 1;
    }
  }

  // ---------- La cascada ----------

  // Propiedades que un elemento recibe de su papá si nadie se las pone
  // (por eso basta darle la fuente al body para que toda la página la use).
  const HEREDABLES = new Set([
    'color', 'cursor', 'direction', 'font', 'font-family', 'font-size', 'font-style', 'font-variant',
    'font-weight', 'letter-spacing', 'line-height', 'list-style', 'list-style-position',
    'list-style-type', 'text-align', 'text-indent', 'text-transform', 'visibility', 'white-space',
    'word-spacing',
  ]);

  // Compara dos pesos (listas de números) de izquierda a derecha.
  function pesaMasOIgual(a, b) {
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return a[i] > b[i];
    }
    return true; // empate: gana la que se escribió después
  }

  // ---------- Media queries ----------

  // Pasa "600px" o "37.5em" a píxeles (1em = 16px, el tamaño de letra de
  // fábrica). Otras unidades no se entienden: null.
  function aPixeles(texto) {
    const partes = String(texto).trim().match(/^(\d+(?:\.\d+)?)(px|em|rem)$/);
    if (partes === null) return null;
    return Number(partes[1]) * (partes[2] === 'px' ? 1 : 16);
  }

  // ¿Una pantalla de "ancho" píxeles cumple la condición de un @media?
  // Solo se entienden screen/all, (min-width: …), (max-width: …) y (width >= …) unidos con
  // "and"; la coma significa "o". Lo que no se entiende se toma como que no
  // se cumple, que es lo más seguro para una prueba.
  const COMPARAR_ANCHO = Object.freeze({
    '>=': (ancho, limite) => ancho >= limite,
    '<=': (ancho, limite) => ancho <= limite,
    '>': (ancho, limite) => ancho > limite,
    '<': (ancho, limite) => ancho < limite,
  });

  function cumpleMedia(condicion, ancho) {
    return dividir(condicion, ',').some((opcion) =>
      opcion
        .replace(/^only\s+/, '')
        .split(/\s+and\s+/)
        .every((parte) => {
          const pedazo = parte.trim();
          if (pedazo === 'screen' || pedazo === 'all' || pedazo === '') return true;
          const medida = pedazo.match(/^\((min|max)-width:\s*([^)]*)\)$/);
          if (medida !== null) {
            const limite = aPixeles(medida[2]);
            if (limite === null) return false;
            return medida[1] === 'min' ? ancho >= limite : ancho <= limite;
          }
          // La forma moderna dice lo mismo con signos: (width >= 600px) es
          // (min-width: 600px). También permite > y <, que no incluyen el límite.
          const rango = pedazo.match(/^\(\s*width\s*(>=|<=|>|<)\s*([^)]*?)\s*\)$/);
          if (rango === null) return false;
          const limite = aPixeles(rango[2]);
          if (limite === null) return false;
          return COMPARAR_ANCHO[rango[1]](ancho, limite);
        })
    );
  }

  // Devuelve una función estiloDe(elemento, propiedad) → valor ('' si nadie
  // se lo dio). Solo conoce el CSS del estudiante: no sabe los valores que
  // el navegador trae de fábrica (por ejemplo, que un h1 es negrita).
  // "ancho" es el de una pantalla imaginaria en píxeles: decide qué reglas de
  // @media cuentan. Sin ancho (null) no cuenta ninguna, porque no sabemos en
  // qué pantalla está el estudiante.
  function crearCascada(todasLasReglas, ancho = null) {
    const reglas = todasLasReglas.filter(
      (regla) => !regla.media || (ancho !== null && regla.media.every((condicion) => cumpleMedia(condicion, ancho)))
    );
    function valorPropio(elemento, propiedad) {
      // Lo que cambió un programa (elemento.style.color = …) manda sobre todo.
      if (Object.prototype.hasOwnProperty.call(elemento.estiloPropio, propiedad)) {
        return elemento.estiloPropio[propiedad];
      }
      let mejor = null;
      // El peso: [!important, style="…", ids, clases, etiquetas]
      const proponer = (declaracion, peso) => {
        if (declaracion.propiedad !== propiedad) return;
        const completo = [declaracion.importante ? 1 : 0, ...peso];
        if (mejor === null || pesaMasOIgual(completo, mejor.peso)) mejor = { peso: completo, valor: declaracion.valor };
      };

      for (const regla of reglas) {
        const pesos = regla.cadenas.filter((cadena) => coincide(elemento, cadena)).map(especificidad);
        if (pesos.length === 0) continue;
        const mayor = pesos.reduce((a, b) => (pesaMasOIgual(a, b) ? a : b));
        regla.declaraciones.forEach((declaracion) => proponer(declaracion, [0, ...mayor]));
      }
      const enLinea = elemento.atributo('style');
      if (enLinea !== null) {
        leerDeclaraciones(enLinea).declaraciones.forEach((declaracion) => proponer(declaracion, [1, 0, 0, 0]));
      }
      return mejor === null ? null : mejor.valor;
    }

    return function estiloDe(elemento, propiedad) {
      const nombre = String(propiedad).trim().toLowerCase();
      for (let actual = elemento; actual !== null && actual.etiqueta !== RAIZ; actual = actual.padre) {
        const valor = valorPropio(actual, nombre);
        if (valor !== null && valor !== 'inherit') return valor;
        if (valor === null && !HEREDABLES.has(nombre)) return '';
      }
      return '';
    };
  }

  globalThis.EstilosWeb = Object.freeze({
    analizarCss,
    crearCascada,
    cumpleMedia,
    aPixeles,
    leerDeclaraciones,
    expandir,
    normalizarValor,
    normalizarSelector,
    aHex,
    contraste,
  });
})();

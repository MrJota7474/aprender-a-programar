// web-evaluador.js — El evaluador de la ruta "Páginas web: HTML y CSS".
//
// Recibe el documento que escribió el estudiante y las pruebas del paso, y
// devuelve lo mismo que los demás motores más un campo "vista" con el
// documento para la vista previa:
//   { salida, error, resultados, vista: { html } }
//
// Pasos: 1) arma el árbol del HTML (web-analizador.js), 2) lee el CSS de las
// etiquetas <style> (web-estilos.js), 3) si hay <script>, lo corre contra una
// página "de mentiras" (ver más abajo), y 4) revisa las pruebas.
//
// No usa nada del navegador: lo comparten el Web Worker de la página y las
// pruebas automáticas que corren en Node.

(function () {
  'use strict';

  const { ErrorDeEstudiante, Elemento, Texto, analizarHtml, lineaDe, textoDe, RAIZ } = globalThis.AnalizadorWeb;
  const { analizarCss, crearCascada, expandir, normalizarValor, normalizarSelector, aHex, contraste, aPixeles } =
    globalThis.EstilosWeb;

  // ---------- La página "de mentiras" para JavaScript ----------
  //
  // En Node no hay document ni botones. Para poder revisar la lección de
  // JavaScript ("un botón que cambia un texto") se le agregan al árbol los
  // nombres que usa el navegador: textContent, classList, addEventListener,
  // click()… Es una imitación pequeña, solo con lo que usa un principiante.

  const aGuiones = (nombre) => nombre.replace(/[A-Z]/g, (letra) => '-' + letra.toLowerCase());

  // Un elemento creado por un programa pasa a ser de este documento y se ve
  // siempre (inicio -1), sin importar en qué parte del código esté el <script>.
  function adoptar(nodo, documento) {
    if (!(nodo instanceof Elemento)) return nodo;
    nodo.documento = documento;
    nodo.inicio = -1;
    nodo.nodos.forEach((hijo) => adoptar(hijo, documento));
    return nodo;
  }

  const escapar = (texto) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function aHtml(nodo) {
    if (nodo instanceof Texto) return escapar(nodo.valor);
    const atributos = [...nodo.atributos].map(([nombre, valor]) => ' ' + nombre + '="' + valor.replace(/"/g, '&quot;') + '"');
    return '<' + nodo.etiqueta + atributos.join('') + '>' + nodo.nodos.map(aHtml).join('') + '</' + nodo.etiqueta + '>';
  }

  function reemplazarContenido(elemento, nodos) {
    elemento.nodos = [];
    nodos.forEach((nodo) => elemento.agregar(adoptar(nodo, elemento.documento)));
  }

  // Un evento sube desde el elemento hasta el documento (por eso un clic en
  // un botón también lo oye el <div> que lo contiene).
  function despachar(elemento, tipo, compilar) {
    const evento = {
      type: tipo,
      target: elemento,
      detenido: false,
      preventDefault() {},
      stopPropagation() {
        this.detenido = true;
      },
    };
    for (let actual = elemento; actual !== null && !evento.detenido; actual = actual.padre) {
      evento.currentTarget = actual;
      const propia = actual['on' + tipo];
      const escrita = actual.atributo('on' + tipo); // <button onclick="saludar()">
      if (typeof propia === 'function') propia.call(actual, evento);
      else if (escrita !== null) compilar(escrita).call(actual, evento);
      (actual.oyentes[tipo] || []).slice().forEach((oyente) => oyente.call(actual, evento));
    }
  }

  // Se instala una sola vez sobre la clase Elemento. Los nombres van en
  // inglés porque son los del navegador: es lo que escribe el estudiante.
  function instalarDom(compilarActual) {
    const reflejar = (atributo) => ({
      get() {
        return this.atributo(atributo) || '';
      },
      set(valor) {
        this.atributos.set(atributo, String(valor));
      },
    });
    const alternar = (atributo) => ({
      get() {
        return this.atributos.has(atributo);
      },
      set(valor) {
        if (valor) this.atributos.set(atributo, '');
        else this.atributos.delete(atributo);
      },
    });
    const textoCompleto = {
      get() {
        return textoDe(this, false);
      },
      set(valor) {
        reemplazarContenido(this, [new Texto(String(valor))]);
      },
    };

    Object.defineProperties(Elemento.prototype, {
      tagName: { get() { return this.etiqueta.toUpperCase(); } },
      id: reflejar('id'),
      className: reflejar('class'),
      value: reflejar('value'),
      href: reflejar('href'),
      src: reflejar('src'),
      alt: reflejar('alt'),
      title: reflejar('title'),
      hidden: alternar('hidden'),
      disabled: alternar('disabled'),
      checked: alternar('checked'),
      textContent: textoCompleto,
      innerText: textoCompleto,
      innerHTML: {
        get() {
          return this.nodos.map(aHtml).join('');
        },
        set(valor) {
          reemplazarContenido(this, analizarHtml(String(valor)).nodos);
        },
      },
      children: { get() { return this.hijos; } },
      parentElement: { get() { return this.padre && this.padre.etiqueta !== RAIZ ? this.padre : null; } },
      classList: {
        get() {
          const elemento = this;
          const guardar = (clases) => elemento.atributos.set('class', clases.join(' '));
          return {
            contains: (clase) => elemento.clases.includes(clase),
            add: (...nuevas) => guardar([...new Set([...elemento.clases, ...nuevas])]),
            remove: (...fuera) => guardar(elemento.clases.filter((clase) => !fuera.includes(clase))),
            toggle(clase) {
              const estaba = elemento.clases.includes(clase);
              if (estaba) this.remove(clase);
              else this.add(clase);
              return !estaba;
            },
          };
        },
      },
      // elemento.style.backgroundColor = 'red' se guarda como background-color.
      style: {
        get() {
          const propio = this.estiloPropio;
          return new Proxy(
            {},
            {
              get: (_, nombre) => (typeof nombre === 'string' ? propio[aGuiones(nombre)] || '' : undefined),
              set: (_, nombre, valor) => {
                const propiedad = aGuiones(String(nombre));
                if (valor === '' || valor === null) delete propio[propiedad];
                else expandir(propiedad, normalizarValor(valor)).forEach(([larga, v]) => { propio[larga] = v; });
                return true;
              },
            }
          );
        },
      },
    });

    Object.assign(Elemento.prototype, {
      getAttribute(nombre) { return this.atributo(nombre); },
      setAttribute(nombre, valor) { this.atributos.set(String(nombre).toLowerCase(), String(valor)); },
      removeAttribute(nombre) { this.atributos.delete(String(nombre).toLowerCase()); },
      hasAttribute(nombre) { return this.atributo(nombre) !== null; },
      // toggleAttribute(nombre) lo pone o lo quita; con un segundo valor lo obliga.
      toggleAttribute(nombre, forzar) {
        const clave = String(nombre).toLowerCase();
        const poner = forzar === undefined ? !this.atributos.has(clave) : Boolean(forzar);
        if (poner) {
          if (!this.atributos.has(clave)) this.atributos.set(clave, '');
        } else {
          this.atributos.delete(clave);
        }
        return poner;
      },
      querySelector(selector) { return this.uno(selector); },
      querySelectorAll(selector) { return this.todos(selector); },
      appendChild(nodo) {
        if (nodo.padre) nodo.padre.nodos = nodo.padre.nodos.filter((otro) => otro !== nodo);
        return this.agregar(adoptar(nodo, this.documento));
      },
      append(...nodos) {
        nodos.forEach((nodo) => this.appendChild(typeof nodo === 'string' ? new Texto(nodo) : nodo));
      },
      remove() {
        if (this.padre) this.padre.nodos = this.padre.nodos.filter((otro) => otro !== this);
        this.padre = null;
      },
      addEventListener(tipo, oyente) {
        this.oyentes = { ...this.oyentes, [tipo]: [...(this.oyentes[tipo] || []), oyente] };
      },
      removeEventListener(tipo, oyente) {
        this.oyentes = { ...this.oyentes, [tipo]: (this.oyentes[tipo] || []).filter((otro) => otro !== oyente) };
      },
      click() { despachar(this, 'click', compilarActual); },
    });
  }

  // Cada ejecución tiene su propio programa, y con él su propia forma de
  // "compilar" un onclick="…". La clase Elemento es una sola, así que apunta
  // siempre a la ejecución en curso.
  let compilarEnCurso = null;
  instalarDom((codigo) => compilarEnCurso(codigo));

  function crearDocumento(raiz) {
    return {
      getElementById: (id) => raiz.descendientes.find((elemento) => elemento.atributo('id') === String(id)) || null,
      querySelector: (selector) => raiz.uno(selector),
      querySelectorAll: (selector) => raiz.todos(selector),
      getElementsByTagName: (etiqueta) => raiz.todos(etiqueta),
      getElementsByClassName: (clase) => raiz.descendientes.filter((elemento) => elemento.clases.includes(clase)),
      createElement: (etiqueta) => new Elemento(String(etiqueta).toLowerCase(), new Map(), -1, raiz),
      createTextNode: (texto) => new Texto(String(texto)),
      addEventListener: (tipo, oyente) => raiz.addEventListener(tipo, oyente),
      get body() { return raiz.uno('body'); },
      get head() { return raiz.uno('head'); },
      get documentElement() { return raiz.uno('html'); },
      get title() { const titulo = raiz.uno('title'); return titulo ? titulo.texto : ''; },
    };
  }

  // Convierte cualquier valor en el texto que se verá en la consola.
  function aTexto(valor) {
    if (typeof valor === 'string') return valor;
    if (valor instanceof Elemento) return '<' + valor.etiqueta + '>';
    if (typeof valor === 'object' && valor !== null) {
      try {
        return JSON.stringify(valor);
      } catch (error) {
        return String(valor);
      }
    }
    return String(valor);
  }

  const MAXIMO_TEMPORIZADORES = 1000;

  // Convierte un error capturado en { nombre, mensaje, linea } para mostrarlo.
  function describirError(error) {
    return error instanceof ErrorDeEstudiante
      ? { ...error.descripcion, linea: null }
      : { nombre: (error && error.name) || 'Error', mensaje: (error && error.message) || String(error) };
  }

  // Corre los <script> de la página. Devuelve { error, despuesDeUnEvento }.
  function ejecutarScripts(raiz, salida) {
    // Los que traen src piden otro archivo, y aquí no hay de dónde cargarlo.
    const scripts = raiz.todos('script').filter((script) => script.atributo('src') === null);
    const anotar = (...valores) => salida.push(valores.map(aTexto).join(' '));
    const consola = { log: anotar, info: anotar, warn: anotar, error: anotar };

    // setTimeout no espera de verdad: las funciones quedan en fila y se
    // corren apenas termina el programa (o el clic) que las pidió.
    let pendientes = [];
    const programar = (funcion) => {
      if (typeof funcion === 'function') pendientes.push(funcion);
      return pendientes.length;
    };
    const correrPendientes = () => {
      for (let vuelta = 0; pendientes.length > 0 && vuelta < MAXIMO_TEMPORIZADORES; vuelta += 1) {
        const siguiente = pendientes[0];
        pendientes = pendientes.slice(1);
        siguiente();
      }
      pendientes = [];
    };

    const documento = crearDocumento(raiz);
    const oyentesDeVentana = [];
    const ventana = {
      document: documento,
      console: consola,
      alert: (mensaje) => anotar('[alerta] ' + aTexto(mensaje)),
      setTimeout: programar,
      setInterval: () => 0, // no se imita: se repetiría sin fin
      addEventListener: (tipo, oyente) => { if (tipo === 'load') oyentesDeVentana.push(oyente); },
      onload: null,
    };

    // Un <script> solo ve lo que está escrito ANTES que él, como en el
    // navegador: por eso se suele poner al final del <body>. "__avanzar"
    // mueve ese límite antes de cada script.
    const avanzar = (indice) => {
      raiz.limite = indice === -1 ? Infinity : scripts[indice].inicio;
    };
    const cuerpo =
      scripts.map((script, indice) => '__avanzar(' + indice + ');\n' + textoDe(script, false)).join('\n;\n') +
      // La "ventanita" del final deja evaluar código DENTRO del programa:
      // así un onclick="saludar()" encuentra la función saludar.
      '\n;__avanzar(-1);\nreturn (__expresion) => eval(__expresion);';

    try {
      const programa = new Function(
        'document', 'window', 'console', 'alert', 'setTimeout', 'setInterval', '__avanzar', cuerpo
      );
      const inspeccionar = programa(
        documento, ventana, consola, ventana.alert, programar, ventana.setInterval, avanzar
      );
      compilarEnCurso = (codigo) => inspeccionar('(function (event) {' + codigo + '\n})');
      // Con la página completa se avisa a quien esperaba que terminara de cargar.
      despachar(raiz, 'DOMContentLoaded', compilarEnCurso);
      [ventana.onload, ...oyentesDeVentana].forEach((oyente) => { if (typeof oyente === 'function') oyente({ type: 'load' }); });
      correrPendientes();
      return { error: null, despuesDeUnEvento: correrPendientes };
    } catch (error) {
      raiz.limite = Infinity;
      // Un innerHTML mal formado llega aquí ya explicado en español.
      return { error: describirError(error), despuesDeUnEvento: correrPendientes };
    }
  }

  // ---------- Lo que puede usar una prueba ----------

  // Sin tildes, sin mayúsculas, sin espacios de más y sin el punto final:
  // "  tienda don pepe." y "Tienda Don Pepe" cuentan como el mismo texto.
  const simplificar = (texto) =>
    String(texto)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.!¡]+$|^¡/g, '')
      .trim();

  function crearAyudas(raiz, reglas, codigo, salida, despuesDeUnEvento, errorDeEvento) {
    // Casi todas reciben un selector ("h1", ".oferta") o un elemento ya encontrado.
    const uno = (selector) => (selector instanceof Elemento ? selector : raiz.uno(selector));
    const colorDe = (elemento, propiedad) => {
      const valor = elemento.estilo(propiedad);
      return aHex(valor) || valor;
    };
    raiz.colorDe = colorDe;

    const visible = (regla) => ({
      selector: regla.selector,
      selectores: regla.selectores,
      propiedades: Object.fromEntries(regla.declaraciones.map((d) => [d.propiedad, d.valor])),
    });
    // "reglas" son las que valen siempre; las de @media van aparte, en
    // "medias", con su condición (varias si hay una @media dentro de otra).
    const reglasVisibles = reglas.filter((regla) => !regla.media).map(visible);
    const mediasVisibles = reglas
      .filter((regla) => regla.media)
      .map((regla) => ({ ...visible(regla), media: regla.media.join(' and ') }));
    // Una cascada por cada ancho de pantalla que pregunten las pruebas.
    const cascadas = new Map();
    const estiloEn = (ancho, selector, propiedad) => {
      const elemento = uno(selector);
      if (!elemento) return '';
      if (!cascadas.has(ancho)) cascadas.set(ancho, crearCascada(reglas, ancho));
      return cascadas.get(ancho)(elemento, propiedad);
    };

    // Si el manejador de un evento lanza un error, se guarda (el primero) para
    // que evaluarWeb se lo muestre al estudiante en vez de dejar solo pruebas en rojo.
    const nombreDe = (selector, elemento) =>
      typeof selector === 'string' ? selector : '<' + elemento.etiqueta + '>';
    const protegerEvento = (contexto, accion) => {
      try {
        accion();
        return true;
      } catch (error) {
        if (errorDeEvento.actual === null) {
          const descrito = describirError(error);
          errorDeEvento.actual = { ...descrito, mensaje: contexto + ': ' + descrito.mensaje };
        }
        return false;
      }
    };

    return {
      uno,
      todos: (selector) => raiz.todos(selector),
      cuenta: (selector) => raiz.todos(selector).length,
      texto: (selector) => { const e = uno(selector); return e ? e.texto : ''; },
      atributo: (selector, nombre) => { const e = uno(selector); return e ? e.atributo(nombre) : null; },
      estilo: (selector, propiedad) => { const e = uno(selector); return e ? e.estilo(propiedad) : ''; },
      color: (selector, propiedad) => { const e = uno(selector); return e ? colorDe(e, propiedad) : ''; },
      reglas: reglasVisibles,
      medias: mediasVisibles,
      estiloEn,
      // Las propiedades que el estudiante le puso a ESE selector exacto, o null.
      regla: (selector) => {
        const buscado = normalizarSelector(selector);
        const suyas = reglasVisibles.filter((regla) => regla.selectores.includes(buscado));
        return suyas.length === 0 ? null : Object.assign({}, ...suyas.map((regla) => regla.propiedades));
      },
      aHex,
      contraste,
      // "1rem" → 16, "10px" → 10: para comparar medidas escritas en unidades distintas.
      aPixeles,
      mismoTexto: (a, b) => simplificar(a) === simplificar(b),
      tieneDoctype: raiz.tieneDoctype,
      codigo,
      salida,
      // Para la lección de JavaScript: hacer clic o escribir en un campo.
      clic: (selector) => {
        const elemento = uno(selector);
        if (!elemento) return false;
        return protegerEvento('Al hacer clic en ' + nombreDe(selector, elemento), () => {
          elemento.click();
          despuesDeUnEvento();
        });
      },
      escribir: (selector, valor) => {
        const elemento = uno(selector);
        if (!elemento) return false;
        return protegerEvento('Al escribir en ' + nombreDe(selector, elemento), () => {
          elemento.value = valor;
          despachar(elemento, 'input', compilarEnCurso);
          despachar(elemento, 'change', compilarEnCurso);
          despuesDeUnEvento();
        });
      },
    };
  }

  function revisar(prueba, ayudas) {
    try {
      const nombres = Object.keys(ayudas);
      const condicion = new Function(...nombres, '"use strict"; return (' + prueba.condicion + ');');
      const aprobada = condicion(...nombres.map((nombre) => ayudas[nombre])) === true;
      return { descripcion: prueba.descripcion, aprobada };
    } catch (error) {
      // Si la prueba explota (p. ej. el elemento no existe), cuenta como no aprobada.
      return { descripcion: prueba.descripcion, aprobada: false };
    }
  }

  // Lee el CSS de todas las etiquetas <style>, en el orden en que aparecen.
  function leerEstilos(raiz, codigo) {
    return raiz.todos('style').flatMap((etiqueta) =>
      analizarCss(textoDe(etiqueta, false), (posicion) => lineaDe(codigo, etiqueta.inicioContenido + posicion))
    );
  }

  function evaluarWeb(codigo, pruebas) {
    // La vista previa se entrega siempre, incluso con errores: el navegador
    // es más tolerante que nosotros y ver la página ayuda a encontrar la falla.
    const vista = { html: codigo };
    const salida = [];
    const fallido = (error) => ({ salida, error, resultados: [], vista });

    let raiz;
    let reglas;
    try {
      raiz = analizarHtml(codigo);
      reglas = leerEstilos(raiz, codigo);
    } catch (error) {
      if (error instanceof ErrorDeEstudiante) return fallido(error.descripcion);
      throw error;
    }
    raiz.estiloDe = crearCascada(reglas);

    const programa = ejecutarScripts(raiz, salida);
    if (programa.error !== null) return fallido(programa.error);

    // Las pruebas que miran el texto del código no deben confundirse con lo
    // que el estudiante escriba en un comentario.
    const sinComentarios = codigo.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, '');
    const errorDeEvento = { actual: null };
    const ayudas = crearAyudas(raiz, reglas, sinComentarios, salida, programa.despuesDeUnEvento, errorDeEvento);
    // Las pruebas corren en orden sobre la MISMA página: si una hace clic,
    // la siguiente ve la página ya cambiada.
    const resultados = pruebas.map((prueba) => revisar(prueba, ayudas));
    if (errorDeEvento.actual !== null) return fallido(errorDeEvento.actual);
    return { salida, error: null, resultados, vista };
  }

  globalThis.evaluarWeb = evaluarWeb;
})();

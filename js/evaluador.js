// evaluador.js — Ejecuta el código del estudiante y revisa las pruebas.
//
// evaluarCodigo(codigo, pruebas, opciones?) → PROMESA de { salida, error, resultados }
//
// Es asíncrona para que el código del estudiante pueda usar await, promesas,
// setTimeout y fetch: antes de revisar las pruebas se espera a que el
// programa termine. "Terminar" significa dos cosas a la vez:
//   1. la promesa del programa (su código va dentro de una función async) se cumplió, y
//   2. no quedan setTimeout ni setInterval pendientes. Para saberlo, el
//      estudiante no usa los temporizadores reales sino unos nuestros que
//      llevan la cuenta (las respuestas de fetch también se programan así).
// Si eso no pasa antes de opciones.limiteMs (2 s por defecto) se responde
// con un error "TiempoAgotado" que explica qué quedó esperando. El ejecutor
// (ejecutor.js) tiene además su propio límite de 3 s, que es la red de
// seguridad para los bucles infinitos: esos no dejan correr ningún reloj.
// Los 2 s dejan margen frente a esos 3 s.
//
// Limitación: en el plan B (sin Worker) y en Node, el código puede llamar a
// globalThis.setTimeout (el real) y así saltarse la cuenta de pendientes.
//
// Las pruebas pueden devolver una promesa (p. ej. una función async que se
// llama a sí misma); se espera su valor, y aprueba solo si es exactamente true.
//
// IMPORTANTE: esta función debe ser autosuficiente (no usar nada definido
// fuera de ella). El ejecutor copia su texto con .toString() para llevarla
// a un Web Worker, y allá no existe el resto de la página. La única excepción
// es crearFetchSimulado (api-tienda.js), que el ejecutor copia junto con ella;
// si no está, fetch se comporta como un computador sin internet.

async function evaluarCodigo(codigo, pruebas, opciones = {}) {
  const LIMITE_MS = opciones.limiteMs || 2000;
  const inicio = Date.now();
  const salida = [];

  // Convierte cualquier valor en el texto que se verá en la consola.
  const aTexto = (valor) => {
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'function') return '[función ' + (valor.name || 'sin nombre') + ']';
    if (typeof valor === 'object' && valor !== null) {
      try {
        return JSON.stringify(valor);
      } catch (error) {
        return String(valor); // p. ej. objetos que se contienen a sí mismos
      }
    }
    return String(valor);
  };

  // Consola de mentiras: en vez de escribir en la consola real del
  // navegador, guarda cada línea para mostrarla en la página.
  const anotar = (...valores) => {
    salida.push(valores.map(aTexto).join(' '));
  };
  const consolaFalsa = { log: anotar, info: anotar, warn: anotar, error: anotar };

  const describirError = (error) => ({
    nombre: (error && error.name) || 'Error',
    mensaje: (error && error.message) || String(error),
  });

  // ---------- Temporizadores que llevan la cuenta ----------
  // Guardamos los relojes reales antes de que nadie los tape.
  const ponerReloj = globalThis.setTimeout.bind(globalThis);
  const quitarReloj = globalThis.clearTimeout.bind(globalThis);
  const ponerIntervalo = globalThis.setInterval.bind(globalThis);
  const quitarIntervalo = globalThis.clearInterval.bind(globalThis);

  const pendientes = new Map(); // id que ve el estudiante → cómo cancelar el reloj real
  let siguienteId = 1;
  let terminado = false; // al terminar, ningún reloj olvidado vuelve a correr
  let errorAsincrono = null; // el primer error que nadie atrapó
  let despertar = null; // quien espera a que "pase algo" (se vació la cuenta o hubo error)
  // Se cumple en cuanto aparece el primer error sin atrapar: así el programa
  // que espera una promesa que ya nadie resolverá no se queda esperando.
  let avisarHuboError;
  const huboError = new Promise((resolver) => (avisarHuboError = resolver));

  const avisar = () => {
    if (despertar) {
      const quien = despertar;
      despertar = null;
      quien();
    }
  };

  const anotarErrorAsincrono = (error, sinAtrapar) => {
    if (errorAsincrono === null) errorAsincrono = { ...describirError(error), sinAtrapar };
    avisarHuboError();
    avisar();
  };

  // Corre la función que el estudiante programó. Un error ahí no tiene a
  // nadie arriba que lo atrape (el resto del programa ya siguió), así que
  // lo guardamos para mostrarlo.
  const correr = (funcion, argumentos) => {
    if (terminado) return;
    try {
      funcion(...argumentos);
    } catch (error) {
      anotarErrorAsincrono(error, false);
    }
  };

  // Mismo mensaje que da Node cuando se escribe setTimeout(saludar(), 100).
  const exigirFuncion = (funcion) => {
    if (typeof funcion !== 'function') {
      throw new TypeError('The "callback" argument must be of type function. Received ' + typeof funcion);
    }
  };

  const setTimeoutFalso = (funcion, ms = 0, ...argumentos) => {
    exigirFuncion(funcion);
    const id = siguienteId++;
    const real = ponerReloj(() => {
      pendientes.delete(id);
      correr(funcion, argumentos);
      if (pendientes.size === 0) avisar();
    }, ms);
    pendientes.set(id, () => quitarReloj(real));
    return id;
  };

  const setIntervalFalso = (funcion, ms = 0, ...argumentos) => {
    exigirFuncion(funcion);
    const id = siguienteId++;
    const real = ponerIntervalo(() => correr(funcion, argumentos), ms);
    pendientes.set(id, () => quitarIntervalo(real));
    return id;
  };

  // clearTimeout y clearInterval son intercambiables, como en el navegador.
  const cancelarFalso = (id) => {
    const cancelar = pendientes.get(id);
    if (!cancelar) return;
    cancelar();
    pendientes.delete(id);
    if (pendientes.size === 0) avisar();
  };

  const fetchFalso =
    typeof crearFetchSimulado === 'function'
      ? crearFetchSimulado(setTimeoutFalso)
      : () => Promise.reject(new TypeError('Failed to fetch'));

  // ---------- Esperar con límite de tiempo ----------
  const AGOTADO = Symbol('agotado');

  // Devuelve lo que entregue la promesa, o AGOTADO si se acaba el tiempo.
  // Si la promesa falla, el error sigue hacia arriba.
  const esperarConLimite = (promesa) =>
    new Promise((resolver, rechazar) => {
      const restante = Math.max(0, LIMITE_MS - (Date.now() - inicio));
      const reloj = ponerReloj(() => resolver(AGOTADO), restante);
      Promise.resolve(promesa).then(
        (valor) => {
          quitarReloj(reloj);
          resolver(valor);
        },
        (error) => {
          quitarReloj(reloj);
          rechazar(error);
        }
      );
    });

  // Un turno del reloj real: antes de él corren todas las promesas que ya
  // estaban listas (las "microtareas"), y llegan los avisos de rechazos.
  const pausa = () => new Promise((resolver) => ponerReloj(resolver, 0));

  // Espera a que no quede ningún temporizador pendiente (o a que haya un error).
  // Se esperan DOS turnos: en el navegador, el aviso de una promesa rechazada
  // sin atrapar ("unhandledrejection") llega en una tarea aparte que puede
  // quedar detrás del primer turno. Con uno solo, ese error se perdía.
  const esperarPendientes = async () => {
    for (;;) {
      await pausa();
      await pausa();
      if (errorAsincrono || pendientes.size === 0) return true;
      const listo = await esperarConLimite(new Promise((resolver) => (despertar = resolver)));
      if (listo === AGOTADO) return false;
    }
  };

  const errorDeTiempo = () => ({
    nombre: 'TiempoAgotado',
    mensaje:
      pendientes.size > 0
        ? 'Tu código dejó un setTimeout o setInterval esperando más de ' + LIMITE_MS / 1000 +
          ' segundos y lo detuvimos. Usa esperas cortas (unos cientos de milisegundos) ' +
          'y detén cada setInterval con clearInterval.'
        : 'Tu código se quedó esperando una promesa que nunca terminó (nadie llamó a ' +
          'resolver ni a rechazar). Revisa que tu new Promise llame a resolver en algún momento.',
  });

  // Una promesa que falla sin que nadie la espere con await (ni .catch) no
  // detiene el programa, pero es un error. Lo escuchamos donde se pueda:
  // en el navegador (y su Worker) con "unhandledrejection"; en Node con process.
  // Igual que en Node, un rechazo que se atiende tarde (se espera con await
  // después de otro await) se marca como "sin atrapar".
  const escucharRechazos = () => {
    if (typeof globalThis.addEventListener === 'function') {
      const oyente = (evento) => {
        evento.preventDefault(); // ya lo mostramos nosotros, en español
        anotarErrorAsincrono(evento.reason, true);
      };
      globalThis.addEventListener('unhandledrejection', oyente);
      return () => globalThis.removeEventListener('unhandledrejection', oyente);
    }
    if (typeof process === 'object' && process && typeof process.on === 'function') {
      const oyente = (razon) => anotarErrorAsincrono(razon, true);
      process.on('unhandledRejection', oyente);
      return () => process.off('unhandledRejection', oyente);
    }
    return () => {};
  };

  // Las pruebas que miran el texto del código no deben dejarse engañar (ni
  // confundir) por lo que el estudiante escriba en un comentario.
  // Se recorre carácter por carácter para no tocar lo que va dentro de un
  // texto ('…', "…" o `…`): una URL como "https://..." lleva // y debe quedar.
  const quitarComentarios = (texto) => {
    let resultado = '';
    let i = 0;
    while (i < texto.length) {
      const c = texto[i];
      if (c === "'" || c === '"' || c === '`') {
        let j = i + 1;
        while (j < texto.length && texto[j] !== c) j += texto[j] === '\\' ? 2 : 1;
        resultado += texto.slice(i, j + 1);
        i = j + 1;
      } else if (c === '/' && texto[i + 1] === '/') {
        while (i < texto.length && texto[i] !== '\n') i++; // el salto de línea se conserva
      } else if (c === '/' && texto[i + 1] === '*') {
        const fin = texto.indexOf('*/', i + 2);
        i = fin === -1 ? texto.length : fin + 2;
      } else {
        resultado += c;
        i++;
      }
    }
    return resultado;
  };
  const codigoSinComentarios = quitarComentarios(codigo);

  // Corre el programa y espera a que termine. Devuelve { inspeccionar } o { error }.
  const correrPrograma = async () => {
    let programa;
    try {
      // Armamos una función async cuyo cuerpo es el código del estudiante
      // (por eso puede usar await en cualquier línea). Al final devuelve una
      // "ventanita" (inspeccionar) que evalúa expresiones DENTRO del mismo
      // ámbito; así las pruebas pueden ver sus let, const, function y class.
      // El código va dentro de un bloque { } y nuestros datos llevan nombres
      // raros (__salida) para no chocar con variables que el estudiante quiera
      // llamar "salida", "codigo" o "console". setTimeout, fetch y compañía
      // llegan como parámetros: tapan a los reales sin tocar globalThis.
      const FuncionAsync = Object.getPrototypeOf(async function () {}).constructor;
      programa = new FuncionAsync(
        'console', '__salida', '__codigo',
        'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'fetch',
        '"use strict";{\n' + codigo + '\n;return (__expresion) => eval(__expresion);}'
      );
    } catch (error) {
      return { error: describirError(error) }; // error de escritura
    }

    try {
      const promesaPrograma = programa(
        consolaFalsa, salida, codigoSinComentarios,
        setTimeoutFalso, cancelarFalso, setIntervalFalso, cancelarFalso, fetchFalso
      );
      // Si el programa falla después de que huboError ganó la carrera, su
      // rechazo ya quedó atendido por el race (no aparece suelto en Node).
      const inspeccionar = await esperarConLimite(Promise.race([promesaPrograma, huboError]));
      if (errorAsincrono) return { error: errorAsincrono };
      if (inspeccionar === AGOTADO) return { error: errorDeTiempo() };
      const termino = await esperarPendientes();
      if (errorAsincrono) return { error: errorAsincrono };
      if (!termino) return { error: errorDeTiempo() };
      return { inspeccionar };
    } catch (error) {
      return { error: describirError(error) }; // error al ejecutar (antes o después de un await)
    }
  };

  // Revisa las pruebas una por una (en orden, para que lo que muestren
  // salga en orden). Dentro de la condición, "salida" y "codigo" siempre
  // son los nuestros.
  const revisarPruebas = async (inspeccionar) => {
    const resultados = [];
    let sinTiempo = false;
    for (const prueba of pruebas) {
      let aprobada = false;
      try {
        const expresion = '((salida, codigo) => (' + prueba.condicion + '))(__salida, __codigo)';
        const valor = await esperarConLimite(inspeccionar(expresion));
        if (valor === AGOTADO) sinTiempo = true;
        aprobada = valor === true;
      } catch (error) {
        // Si la prueba explota (p. ej. la variable no existe), cuenta como no aprobada.
      }
      resultados.push({ descripcion: prueba.descripcion, aprobada });
    }
    return { resultados, sinTiempo };
  };

  const dejarDeEscuchar = escucharRechazos();
  try {
    const programa = await correrPrograma();
    if (programa.error) return { salida, error: programa.error, resultados: [] };
    const { resultados, sinTiempo } = await revisarPruebas(programa.inspeccionar);
    const error = sinTiempo
      ? {
          nombre: 'TiempoAgotado',
          mensaje: 'Una prueba no alcanzó a terminar: tu función tardó demasiado o se quedó esperando.',
        }
      : null;
    return { salida, error, resultados };
  } finally {
    // Limpieza: ningún reloj del estudiante debe seguir vivo (ni escribir en
    // una salida que ya entregamos) después de responder.
    terminado = true;
    pendientes.forEach((cancelar) => cancelar());
    pendientes.clear();
    dejarDeEscuchar();
  }
}

globalThis.evaluarCodigo = evaluarCodigo;

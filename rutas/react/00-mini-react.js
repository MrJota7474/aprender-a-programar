// Ruta "Interfaces con React": la mini versión de React que usan las lecciones.
//
// React real no se puede descargar sin internet, así que el estudiante
// practica con esta imitación hecha por nosotros. Copia los NOMBRES y la
// FORMA de la API de React (createElement, componentes, props, useState,
// key, onClick) para que la reconozca cuando use la de verdad, pero no es
// React: no dibuja en la página, solo produce el HTML como texto.
//
// El motor "javascript" no tiene módulos que se puedan importar, así que la
// mini librería se pega al comienzo del código de cada paso, separada del
// código del estudiante por un aviso. Este archivo solo guarda ese texto una
// vez, para no copiarlo en cada lección. Empieza por "00-": se carga antes
// que las lecciones y no cuenta como una de ellas.
//
// Las lecciones arman su código así:
//   MiniReact.armar('base', ['const x = 1;'])   → mini React básica + tu código
//   MiniReact.armar('estado', [...])            → además useState, montar y
//                                                  las ayudas clic/escribir

(function () {
  // Se escribe con String.raw para que el código se lea igual que como lo
  // verá el estudiante, sin tener que escapar comillas línea por línea.
  const ENCABEZADO = String.raw`// ═══════════ MINI REACT: hecha para esta app, NO es React ═══════════
// Imita los nombres de React para que lo reconozcas después. No necesitas
// cambiar nada de esta parte: tu código va abajo, después de "TU CÓDIGO".`;

  const BASE = String.raw`
const avisos = []; // avisos como los que React real muestra en la consola

// h(tipo, props, ...hijos) describe un elemento, todavía sin dibujarlo.
// Es lo que hace JSX por dentro. En React real se llama React.createElement.
function h(tipo, props, ...hijos) {
  for (const lista of hijos.filter(Array.isArray)) {
    if (lista.some((hijo) => hijo && typeof hijo === 'object' && hijo.props.key === undefined)) {
      avisos.push('Cada hijo de una lista necesita una "key" única.');
    }
  }
  return { tipo, props: props || {}, hijos: hijos.flat() };
}
const crearElemento = h;

// renderizar llama a los componentes (funciones) hasta que solo quedan etiquetas.
function renderizar(elemento) {
  if (elemento === null || elemento === undefined || elemento === false) return '';
  if (typeof elemento !== 'object') return String(elemento);
  if (typeof elemento.tipo === 'function') {
    const { key, ...props } = elemento.props; // la key es para React: no llega como prop
    return renderizar(elemento.tipo({ ...props, children: elemento.hijos }));
  }
  return { ...elemento, hijos: elemento.hijos.map(renderizar) };
}

const escapar = (texto) =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// aHtml convierte un elemento en el HTML que vería el navegador.
// (React real no te entrega el texto: dibuja directo en la página.)
function aHtml(elemento) {
  const nodo = renderizar(elemento);
  if (typeof nodo === 'string') return escapar(nodo);
  const atributos = Object.entries(nodo.props)
    .filter(([nombre, valor]) => nombre !== 'key' && !nombre.startsWith('on') && valor !== null && valor !== undefined && valor !== false)
    .map(([nombre, valor]) => ' ' + (nombre === 'className' ? 'class' : nombre) + '="' + escapar(valor) + '"')
    .join('');
  return '<' + nodo.tipo + atributos + '>' + nodo.hijos.map(aHtml).join('') + '</' + nodo.tipo + '>';
}`;

  const ESTADO = String.raw`
// ── Estado: un useState simplificado ──
// Guarda los valores de useState en el orden en que se piden. React real
// guarda una memoria por cada componente; aquí hay una sola para toda la app.
let memoriaActual = null;

// useState(inicial) → [valor, cambiarValor]. Mismo nombre y forma que en React.
function useState(inicial) {
  const memoria = memoriaActual;
  if (memoria === null) throw new Error('useState solo funciona dentro de un componente dibujado con montar().');
  const posicion = memoria.siguiente;
  memoria.siguiente += 1;
  if (posicion === memoria.valores.length) memoria.valores.push(inicial);
  const cambiar = (nuevo) => {
    // Como en React, se puede pasar el valor nuevo o una función que lo calcula.
    const anterior = memoria.valores[posicion];
    const siguiente = typeof nuevo === 'function' ? nuevo(anterior) : nuevo;
    // Como en React: si es el MISMO valor (o el mismo arreglo, aunque le hayas
    // hecho push), no redibuja. Por eso el estado se reemplaza, no se modifica.
    if (Object.is(siguiente, anterior)) return;
    memoria.valores[posicion] = siguiente;
    memoria.dibujar(); // cambiar el estado vuelve a dibujar la app
  };
  return [memoria.valores[posicion], cambiar];
}

// montar(App) dibuja la app y la vuelve a dibujar cada vez que cambia su estado.
// En React real: ReactDOM.createRoot(document.getElementById('root')).render(<App />)
function montar(Componente) {
  const memoria = { valores: [], siguiente: 0, arbol: null };
  memoria.dibujar = () => {
    memoriaActual = memoria;
    memoria.siguiente = 0;
    try {
      memoria.arbol = renderizar(h(Componente, null));
    } finally {
      memoriaActual = null;
    }
  };
  memoria.dibujar();
  return { html: () => aHtml(memoria.arbol), arbol: () => memoria.arbol };
}

// ── Para probar sin navegador (esto no es de React) ──
// clic(app, 'texto del botón') y escribir(app, 'name del campo', 'valor')
// hacen lo que haría una persona con el ratón y el teclado.
function textoDe(nodo) {
  return typeof nodo === 'string' ? nodo : nodo.hijos.map(textoDe).join('');
}
function buscarTodos(nodo, condicion) {
  if (typeof nodo === 'string') return [];
  const propio = condicion(nodo) ? [nodo] : [];
  return [...propio, ...nodo.hijos.flatMap((hijo) => buscarTodos(hijo, condicion))];
}
function clic(app, texto) {
  const boton = buscarTodos(app.arbol(), (nodo) => nodo.props.onClick && textoDe(nodo).trim() === texto)[0];
  if (!boton) throw new Error('No encontré nada con onClick y el texto "' + texto + '".');
  boton.props.onClick({ type: 'click' });
}
function escribir(app, nombre, valor) {
  const campo = buscarTodos(app.arbol(), (nodo) => nodo.props.name === nombre && nodo.props.onChange)[0];
  if (!campo) throw new Error('No encontré un campo con name="' + nombre + '" y onChange.');
  // React real también entrega un evento donde lo escrito está en evento.target.value.
  campo.props.onChange({ type: 'change', target: { value: valor } });
}`;

  const SEPARADOR = String.raw`
// ═══════════════════════════ TU CÓDIGO ═══════════════════════════
`;

  // Devuelve el código completo de un paso: la mini librería que pide
  // ("base" o "estado", que incluye la base) y luego las líneas del paso.
  function armar(nivel, lineas) {
    if (nivel !== 'base' && nivel !== 'estado') throw new Error('MiniReact.armar: nivel desconocido "' + nivel + '"');
    const libreria = nivel === 'estado' ? BASE + '\n' + ESTADO : BASE;
    return ENCABEZADO + '\n' + libreria + '\n' + SEPARADOR + '\n' + lineas.join('\n');
  }

  globalThis.MiniReact = Object.freeze({ armar });
})();

// Ruta "Interfaces con React", lección 2: componentes como funciones.
// Cómo se arma el código y qué pueden usar las pruebas: ver 01-crear-elementos.js.

(function () {
  const { armar } = globalThis.MiniReact;

  // Las piezas que el reto le da hechas al estudiante.
  const PIEZAS_DEL_RETO = [
    'function Encabezado() {',
    "  return h('header', null, 'Tienda Don Pepe');",
    '}',
    '',
    'function Pie() {',
    "  return h('footer', null, 'Abierto de 6 a. m. a 8 p. m.');",
    '}',
    '',
    'function Oferta() {',
    "  return h('p', { className: 'oferta' }, 'Hoy: pan a $250');",
    '}',
    '',
  ];

  globalThis.Rutas.agregarLeccion('react', {
    id: 'componentes',
    titulo: 'Componentes: piezas que se reutilizan',
    pasos: [
      {
        id: 'idea',
        titulo: 'Una función que devuelve elementos',
        texto: [
          'Una página real tiene cientos de elementos. Para no escribirlos todos en un solo lugar, React los agrupa en **componentes**: funciones que devuelven elementos. Un encabezado, una tarjeta de producto o un botón de compra pueden ser cada uno un componente.',
          'Dos reglas que React exige: el nombre del componente empieza con **mayúscula** (`Encabezado`, no `encabezado`), para distinguirlo de las etiquetas de HTML; y la función **devuelve** lo que se va a dibujar.',
          'Para usar un componente no lo llamas tú: se lo pasas a `h()` como tipo, sin comillas: `h(Encabezado, null)`. En JSX es `<Encabezado />`. React (y nuestra mini versión) se encarga de llamar a la función cuando dibuja.',
          'Así una página se arma como un árbol: el componente `App` usa a `Encabezado` y a `Pie`, que a su vez usan etiquetas normales. Ejecuta el ejemplo.',
        ],
        codigo: armar('base', [
          '// En React real con JSX:',
          '//   function Encabezado() { return <header>Tienda Don Pepe</header>; }',
          "function Encabezado() {",
          "  return h('header', null, 'Tienda Don Pepe');",
          '}',
          '',
          'function Pie() {',
          "  return h('footer', null, 'Calle 10 # 5-20');",
          '}',
          '',
          '// JSX: <div><Encabezado /><Pie /></div>',
          'function App() {',
          "  return h('div', null, h(Encabezado, null), h(Pie, null));",
          '}',
          '',
          'console.log(aHtml(h(App, null)));',
        ]),
      },
      {
        id: 'practica',
        titulo: 'El componente Oferta',
        texto: [
          'Completa el componente `Oferta` para que devuelva un párrafo con la clase `oferta` y el texto `Hoy: pan a $250`.',
          'En JSX sería: `function Oferta() { return <p className="oferta">Hoy: pan a $250</p>; }`',
        ],
        codigo: armar('base', [
          'function Oferta() {',
          '  // Devuelve aquí el párrafo de la oferta',
          '  return null;',
          '}',
          '',
          'console.log(aHtml(h(Oferta, null)));',
        ]),
        pruebas: [
          {
            descripcion: 'Oferta es una función',
            condicion: 'typeof Oferta === "function"',
          },
          {
            descripcion: 'Oferta devuelve un elemento p',
            condicion: 'Oferta() !== null && Oferta().tipo === "p"',
          },
          {
            descripcion: 'Dibuja <p class="oferta">Hoy: pan a $250</p>',
            condicion: 'aHtml(h(Oferta, null)) === \'<p class="oferta">Hoy: pan a $250</p>\'',
          },
        ],
        pistas: [
          'Cambia `return null;` por un `return` con un elemento hecho con `h()`.',
          "El elemento es un párrafo con props `{ className: 'oferta' }` y el texto `'Hoy: pan a $250'`.",
          "Queda así: `return h('p', { className: 'oferta' }, 'Hoy: pan a $250');`",
        ],
        solucion: armar('base', [
          'function Oferta() {',
          "  return h('p', { className: 'oferta' }, 'Hoy: pan a $250');",
          '}',
          '',
          'console.log(aHtml(h(Oferta, null)));',
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: armar la página con piezas',
        texto: [
          'Ya tienes tres componentes hechos: `Encabezado`, `Oferta` y `Pie`. Escribe el componente `App` para que devuelva un `div` con la clase `app` y, adentro y en este orden, el encabezado, la oferta **dos veces** (en la página de verdad irían en dos lugares) y el pie.',
          'En JSX sería:',
          '`<div className="app"><Encabezado /><Oferta /><Oferta /><Pie /></div>`',
          'No copies el contenido de los componentes: úsalos con `h(Oferta, null)`. Así, si mañana cambia la oferta, se cambia en un solo lugar.',
        ],
        codigo: armar('base', [
          ...PIEZAS_DEL_RETO,
          'function App() {',
          "  return h('div', { className: 'app' });",
          '}',
          '',
          'console.log(aHtml(h(App, null)));',
        ]),
        pruebas: [
          {
            descripcion: 'App devuelve un div con la clase app',
            condicion: 'App().tipo === "div" && App().props.className === "app"',
          },
          {
            descripcion: 'Adentro usa los componentes (no etiquetas copiadas)',
            // Se compara la función misma: un h('header', …) copiado no cuenta.
            condicion:
              '[Encabezado, Oferta, Oferta, Pie].every((componente, i) => App().hijos[i].tipo === componente) && ' +
              'App().hijos.length === 4',
          },
          {
            descripcion: 'La página completa sale en el orden pedido',
            condicion:
              'aHtml(h(App, null)) === \'<div class="app"><header>Tienda Don Pepe</header>\' + ' +
              '\'<p class="oferta">Hoy: pan a $250</p><p class="oferta">Hoy: pan a $250</p>\' + ' +
              '\'<footer>Abierto de 6 a. m. a 8 p. m.</footer></div>\'',
          },
        ],
        pistas: [
          'Los hijos del `div` van después de `{ className: "app" }`, separados por comas.',
          'Cada hijo es un componente pasado a `h` sin comillas: `h(Encabezado, null)`.',
          "Queda así: `return h('div', { className: 'app' }, h(Encabezado, null), h(Oferta, null), h(Oferta, null), h(Pie, null));`",
        ],
        solucion: armar('base', [
          ...PIEZAS_DEL_RETO,
          'function App() {',
          '  return h(',
          "    'div',",
          "    { className: 'app' },",
          '    h(Encabezado, null),',
          '    h(Oferta, null),',
          '    h(Oferta, null),',
          '    h(Pie, null)',
          '  );',
          '}',
          '',
          'console.log(aHtml(h(App, null)));',
        ]),
      },
    ],
  });
})();

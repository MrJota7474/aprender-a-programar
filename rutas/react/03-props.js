// Ruta "Interfaces con React", lección 3: props.
// Cómo se arma el código y qué pueden usar las pruebas: ver 01-crear-elementos.js.

(function () {
  const { armar } = globalThis.MiniReact;

  globalThis.Rutas.agregarLeccion('react', {
    id: 'props',
    titulo: 'Props: el mismo componente con otros datos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Los parámetros de un componente',
        texto: [
          'Un componente que siempre dice "Pan" no sirve de mucho. Las **props** (de *properties*, propiedades) son los datos que le pasas a un componente para que dibuje cosas distintas: el mismo molde de tarjeta sirve para el pan, la leche y el tinto.',
          'Se pasan en el segundo argumento de `h()`: `h(Producto, { nombre: "Pan", precio: 300 })`. En JSX: `<Producto nombre="Pan" precio={300} />` (las llaves `{}` son para valores de JavaScript, como números).',
          'El componente las recibe todas juntas en **un objeto**. Lo más común es desestructurarlo de una vez: `function Producto({ nombre, precio }) { … }`.',
          'Una regla importante de React: las props son **de solo lectura**. Un componente nunca modifica las props que recibe; si necesita algo distinto, lo calcula aparte. Ejecuta el ejemplo: un solo componente, tres productos.',
        ],
        codigo: armar('base', [
          '// JSX: function Producto({ nombre, precio }) { return <li>{nombre}: ${precio}</li>; }',
          'function Producto({ nombre, precio }) {',
          "  return h('li', null, nombre + ': $' + precio);",
          '}',
          '',
          '// JSX: <ul><Producto nombre="Pan" precio={300} /> … </ul>',
          'const lista = h(',
          "  'ul',",
          '  null,',
          "  h(Producto, { nombre: 'Pan', precio: 300 }),",
          "  h(Producto, { nombre: 'Leche', precio: 4200 }),",
          "  h(Producto, { nombre: 'Tinto', precio: 1500 })",
          ');',
          '',
          'console.log(aHtml(lista));',
        ]),
      },
      {
        id: 'practica',
        titulo: 'Un precio que cambia',
        texto: [
          'El componente `Precio` siempre muestra el pan, sin importar qué le pasen. Cámbialo para que use sus props `nombre` y `precio`.',
          'Con `{ nombre: "Queso", precio: 9000 }` debe dibujar `<li>Queso: $9000</li>`.',
        ],
        codigo: armar('base', [
          'function Precio({ nombre, precio }) {',
          "  return h('li', null, 'Pan: $300');",
          '}',
          '',
          "console.log(aHtml(h(Precio, { nombre: 'Pan', precio: 300 })));",
          "console.log(aHtml(h(Precio, { nombre: 'Queso', precio: 9000 })));",
        ]),
        pruebas: [
          {
            descripcion: 'Con Pan y 300 dibuja <li>Pan: $300</li>',
            condicion: 'aHtml(h(Precio, { nombre: "Pan", precio: 300 })) === "<li>Pan: $300</li>"',
          },
          {
            descripcion: 'Con Queso y 9000 dibuja <li>Queso: $9000</li>',
            condicion: 'aHtml(h(Precio, { nombre: "Queso", precio: 9000 })) === "<li>Queso: $9000</li>"',
          },
          {
            descripcion: 'Funciona con cualquier producto',
            condicion: 'aHtml(h(Precio, { nombre: "Arepa", precio: 1200 })) === "<li>Arepa: $1200</li>"',
          },
        ],
        pistas: [
          'El texto fijo `"Pan: $300"` es el problema: hay que armarlo con las props.',
          'Une los pedazos con `+`: el nombre, el texto `": $"` y el precio.',
          "Queda así: `return h('li', null, nombre + ': $' + precio);`",
        ],
        solucion: armar('base', [
          'function Precio({ nombre, precio }) {',
          "  return h('li', null, nombre + ': $' + precio);",
          '}',
          '',
          "console.log(aHtml(h(Precio, { nombre: 'Pan', precio: 300 })));",
          "console.log(aHtml(h(Precio, { nombre: 'Queso', precio: 9000 })));",
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: la tarjeta con oferta',
        texto: [
          'El componente `Tarjeta` recibe tres props: `nombre`, `precio` y `oferta` (`true` o `false`). Ya dibuja el nombre y el precio. Cámbialo para que, **solo cuando `oferta` sea `true`**:',
          '- el `div` tenga la clase `tarjeta oferta` (si no, solo `tarjeta`);',
          '- al final aparezca un `span` con el texto `¡Oferta!`.',
          'Un truco muy usado en React: `oferta && h("span", null, "¡Oferta!")`. Si `oferta` es `false`, la expresión da `false` y React no dibuja nada en ese lugar. En JSX: `{oferta && <span>¡Oferta!</span>}`.',
          'Recuerda que las props no se modifican: calcula la clase en una constante aparte.',
        ],
        codigo: armar('base', [
          'function Tarjeta({ nombre, precio, oferta }) {',
          '  return h(',
          "    'div',",
          "    { className: 'tarjeta' },",
          "    h('h3', null, nombre),",
          "    h('p', null, '$' + precio)",
          '  );',
          '}',
          '',
          "console.log(aHtml(h(Tarjeta, { nombre: 'Pan', precio: 300, oferta: true })));",
          "console.log(aHtml(h(Tarjeta, { nombre: 'Leche', precio: 4200, oferta: false })));",
        ]),
        pruebas: [
          {
            descripcion: 'Sin oferta: clase tarjeta y sin span',
            condicion:
              'aHtml(h(Tarjeta, { nombre: "Leche", precio: 4200, oferta: false })) === ' +
              '\'<div class="tarjeta"><h3>Leche</h3><p>$4200</p></div>\'',
          },
          {
            descripcion: 'Con oferta: clase "tarjeta oferta" y el span ¡Oferta! al final',
            condicion:
              'aHtml(h(Tarjeta, { nombre: "Pan", precio: 300, oferta: true })) === ' +
              '\'<div class="tarjeta oferta"><h3>Pan</h3><p>$300</p><span>¡Oferta!</span></div>\'',
          },
          {
            descripcion: 'Funciona con otro producto en oferta',
            condicion:
              'aHtml(h(Tarjeta, { nombre: "Tinto", precio: 1500, oferta: true })) === ' +
              '\'<div class="tarjeta oferta"><h3>Tinto</h3><p>$1500</p><span>¡Oferta!</span></div>\'',
          },
          {
            descripcion: 'No modifica las props que recibe',
            condicion:
              '(() => { const props = Object.freeze({ nombre: "Pan", precio: 300, oferta: true }); ' +
              'Tarjeta(props); return props.nombre === "Pan" && props.oferta === true; })()',
          },
        ],
        pistas: [
          "Antes del `return`, calcula la clase: `const clase = oferta ? 'tarjeta oferta' : 'tarjeta';` y úsala en `{ className: clase }`.",
          "El `span` va como último hijo del `div`, después del párrafo del precio: `oferta && h('span', null, '¡Oferta!')`.",
          "El `return` queda: `h('div', { className: clase }, h('h3', null, nombre), h('p', null, '$' + precio), oferta && h('span', null, '¡Oferta!'))`",
        ],
        solucion: armar('base', [
          'function Tarjeta({ nombre, precio, oferta }) {',
          "  const clase = oferta ? 'tarjeta oferta' : 'tarjeta';",
          '  return h(',
          "    'div',",
          '    { className: clase },',
          "    h('h3', null, nombre),",
          "    h('p', null, '$' + precio),",
          "    oferta && h('span', null, '¡Oferta!')",
          '  );',
          '}',
          '',
          "console.log(aHtml(h(Tarjeta, { nombre: 'Pan', precio: 300, oferta: true })));",
          "console.log(aHtml(h(Tarjeta, { nombre: 'Leche', precio: 4200, oferta: false })));",
        ]),
      },
    ],
  });
})();

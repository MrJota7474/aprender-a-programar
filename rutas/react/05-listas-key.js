// Ruta "Interfaces con React", lección 5: listas con map y key.
// Cómo se arma el código y qué pueden usar las pruebas: ver 01-crear-elementos.js.
// La mini React anota en "avisos" cuando una lista llega sin key, igual que
// React real avisa en la consola. Las pruebas miran si ese arreglo creció
// mientras se dibujaba, no su largo total (el código del estudiante también
// dibuja y pudo dejar avisos antes).

(function () {
  const { armar } = globalThis.MiniReact;

  const PRODUCTOS = [
    'const productos = [',
    "  { id: 1, nombre: 'Pan', precio: 300, oferta: true },",
    "  { id: 2, nombre: 'Leche', precio: 4200, oferta: false },",
    "  { id: 3, nombre: 'Tinto', precio: 1500, oferta: true },",
    '];',
    '',
  ];

  // ¿Dibujar "elemento" no dejó avisos nuevos de key?
  const sinAvisos = (elemento) =>
    '(() => { const antes = avisos.length; aHtml(' + elemento + '); return avisos.length === antes; })()';

  globalThis.Rutas.agregarLeccion('react', {
    id: 'listas-key',
    titulo: 'Listas: map y key',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un elemento por cada dato',
        texto: [
          'Los productos de la tienda vienen en un arreglo, y pueden ser 3 o 300. En React no se escribe un `h("li", …)` por cada uno: se usa `map`, que ya conoces, para convertir cada dato en un elemento. En JSX: `{productos.map((p) => <li key={p.id}>{p.nombre}</li>)}`.',
          'Fíjate en la prop **`key`**. Cuando la lista cambia (se agrega, se borra o se reordena un producto), React usa la `key` para saber cuál elemento es cuál y no volver a dibujar todo. Por eso cada `key` debe ser **única** dentro de la lista y no cambiar: lo ideal es el `id` del dato.',
          'Si falta la `key`, React real muestra un aviso en la consola. Nuestra mini versión lo anota en el arreglo `avisos`. La `key` es para React: el componente no la recibe como prop.',
          'Evita usar la posición (`(p, i) => … key: i`) cuando la lista puede cambiar de orden: si borras el primero, todos cambian de posición y React se confunde. Ejecuta el ejemplo: la primera lista no tiene key y deja un aviso.',
        ],
        codigo: armar('base', [
          ...PRODUCTOS,
          '// Sin key: funciona, pero React avisa',
          "const sinKey = h('ul', null, productos.map((p) => h('li', null, p.nombre)));",
          'console.log(aHtml(sinKey));',
          'console.log(avisos);',
          '',
          '// Con key: la forma correcta. JSX: <li key={p.id}>{p.nombre}</li>',
          "const conKey = h('ul', null, productos.map((p) => h('li', { key: p.id }, p.nombre)));",
          'console.log(aHtml(conKey));',
        ]),
      },
      {
        id: 'practica',
        titulo: 'La lista de precios',
        texto: [
          'El componente `ListaPrecios` recibe la prop `productos` (un arreglo como el de arriba). Hazlo devolver un `ul` con la clase `precios` y, por cada producto, un `li` con el texto `Nombre: $precio` y su `id` como `key`.',
          'Con los productos de arriba debe dibujar: `<ul class="precios"><li>Pan: $300</li><li>Leche: $4200</li><li>Tinto: $1500</li></ul>`.',
        ],
        codigo: armar('base', [
          ...PRODUCTOS,
          'function ListaPrecios({ productos }) {',
          "  return h('ul', { className: 'precios' });",
          '}',
          '',
          'console.log(aHtml(h(ListaPrecios, { productos })));',
        ]),
        pruebas: [
          {
            descripcion: 'Dibuja un li por producto, con nombre y precio',
            condicion:
              'aHtml(h(ListaPrecios, { productos })) === ' +
              '\'<ul class="precios"><li>Pan: $300</li><li>Leche: $4200</li><li>Tinto: $1500</li></ul>\'',
          },
          {
            descripcion: 'Funciona con otra lista',
            condicion:
              'aHtml(h(ListaPrecios, { productos: [{ id: 9, nombre: "Queso", precio: 9000 }] })) === ' +
              '\'<ul class="precios"><li>Queso: $9000</li></ul>\'',
          },
          {
            descripcion: 'Cada li tiene como key el id del producto',
            condicion: 'ListaPrecios({ productos }).hijos.map((li) => li.props.key).join(",") === "1,2,3"',
          },
          {
            descripcion: 'No deja avisos de key',
            condicion: sinAvisos('h(ListaPrecios, { productos })') + ' && ListaPrecios({ productos }).hijos.length === 3',
          },
        ],
        pistas: [
          'El tercer argumento del `h("ul", …)` es el arreglo que devuelve `productos.map(…)`.',
          "Dentro del `map`, cada producto `p` se vuelve `h('li', { key: p.id }, p.nombre + ': $' + p.precio)`.",
          "Queda así: `return h('ul', { className: 'precios' }, productos.map((p) => h('li', { key: p.id }, p.nombre + ': $' + p.precio)));`",
        ],
        solucion: armar('base', [
          ...PRODUCTOS,
          'function ListaPrecios({ productos }) {',
          '  return h(',
          "    'ul',",
          "    { className: 'precios' },",
          "    productos.map((p) => h('li', { key: p.id }, p.nombre + ': $' + p.precio))",
          '  );',
          '}',
          '',
          'console.log(aHtml(h(ListaPrecios, { productos })));',
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: la vitrina de ofertas',
        texto: [
          'El componente `Vitrina` recibe `productos` y `soloOfertas` (`true` o `false`). Ya existe `Producto`, que dibuja un producto. Escribe `Vitrina` para que:',
          '- Si `soloOfertas` es `true`, muestre solo los productos con `oferta: true` (usa `filter` antes del `map`). Si es `false`, todos.',
          '- Devuelva un `div` con la clase `vitrina` y un `Producto` por cada uno, pasándole sus datos como props y su `id` como `key`: `h(Producto, { key: p.id, nombre: p.nombre, precio: p.precio })`.',
          '- Si no queda ningún producto, devuelva en cambio `<p>No hay productos</p>`.',
        ],
        codigo: armar('base', [
          ...PRODUCTOS,
          'function Producto({ nombre, precio }) {',
          "  return h('article', null, nombre + ' a $' + precio);",
          '}',
          '',
          'function Vitrina({ productos, soloOfertas }) {',
          "  return h('div', { className: 'vitrina' });",
          '}',
          '',
          'console.log(aHtml(h(Vitrina, { productos, soloOfertas: true })));',
        ]),
        pruebas: [
          {
            descripcion: 'Con soloOfertas en false muestra los tres productos',
            condicion:
              'aHtml(h(Vitrina, { productos, soloOfertas: false })) === \'<div class="vitrina"><article>Pan a $300</article>\' + ' +
              '\'<article>Leche a $4200</article><article>Tinto a $1500</article></div>\'',
          },
          {
            descripcion: 'Con soloOfertas en true muestra solo Pan y Tinto',
            condicion:
              'aHtml(h(Vitrina, { productos, soloOfertas: true })) === ' +
              '\'<div class="vitrina"><article>Pan a $300</article><article>Tinto a $1500</article></div>\'',
          },
          {
            descripcion: 'Usa el componente Producto con el id como key',
            condicion:
              'Vitrina({ productos, soloOfertas: false }).hijos.every((hijo) => hijo.tipo === Producto) && ' +
              'Vitrina({ productos, soloOfertas: false }).hijos.map((hijo) => hijo.props.key).join(",") === "1,2,3"',
          },
          {
            descripcion: 'Sin productos que mostrar dice No hay productos',
            condicion:
              'aHtml(h(Vitrina, { productos: [{ id: 2, nombre: "Leche", precio: 4200, oferta: false }], soloOfertas: true })) === ' +
              '"<p>No hay productos</p>"',
          },
          {
            descripcion: 'No deja avisos de key',
            condicion: sinAvisos('h(Vitrina, { productos, soloOfertas: false })') + ' && Vitrina({ productos, soloOfertas: false }).hijos.length === 3',
          },
        ],
        pistas: [
          'Primero arma la lista que se va a mostrar: `const visibles = soloOfertas ? productos.filter((p) => p.oferta) : productos;`',
          "Si `visibles.length === 0`, devuelve `h('p', null, 'No hay productos')`. Si no, el `div` con `visibles.map(…)` como hijos.",
          "El `map` queda: `visibles.map((p) => h(Producto, { key: p.id, nombre: p.nombre, precio: p.precio }))`",
        ],
        solucion: armar('base', [
          ...PRODUCTOS,
          'function Producto({ nombre, precio }) {',
          "  return h('article', null, nombre + ' a $' + precio);",
          '}',
          '',
          'function Vitrina({ productos, soloOfertas }) {',
          '  const visibles = soloOfertas ? productos.filter((p) => p.oferta) : productos;',
          '  if (visibles.length === 0) {',
          "    return h('p', null, 'No hay productos');",
          '  }',
          '  return h(',
          "    'div',",
          "    { className: 'vitrina' },",
          '    visibles.map((p) => h(Producto, { key: p.id, nombre: p.nombre, precio: p.precio }))',
          '  );',
          '}',
          '',
          'console.log(aHtml(h(Vitrina, { productos, soloOfertas: true })));',
        ]),
      },
    ],
  });
})();

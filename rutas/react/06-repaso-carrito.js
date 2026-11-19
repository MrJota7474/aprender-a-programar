// Ruta "Interfaces con React", lección 6: repaso con el carrito de Don Pepe.
// Junta todo: elementos, componentes, props, estado, eventos y listas con key.
// Cómo se arma el código y qué pueden usar las pruebas: ver 01-crear-elementos.js
// y 04-estado-eventos.js (montar, clic). Cada prueba monta su propia tienda.

(function () {
  const { armar } = globalThis.MiniReact;

  const CATALOGO = [
    'const CATALOGO = [',
    "  { id: 1, nombre: 'Pan', precio: 300 },",
    "  { id: 2, nombre: 'Leche', precio: 4200 },",
    "  { id: 3, nombre: 'Tinto', precio: 1500 },",
    '];',
    '',
  ];

  // Los componentes de la práctica, que el reto ya trae hechos.
  const COMPONENTES = [
    '// Un botón para agregar un producto. JSX: <button onClick={alAgregar}>Agregar {producto.nombre}</button>',
    'function BotonProducto({ producto, alAgregar }) {',
    "  return h('button', { onClick: alAgregar }, 'Agregar ' + producto.nombre);",
    '}',
    '',
    '// Una línea del carrito. JSX: <li>{item.nombre} x{item.cantidad}: ${item.precio * item.cantidad}</li>',
    'function ItemCarrito({ item }) {',
    "  return h('li', null, item.nombre + ' x' + item.cantidad + ': $' + item.precio * item.cantidad);",
    '}',
    '',
  ];

  // Monta la tienda, hace clics y revisa el HTML que quedó.
  const tienda = (clics, ...esperados) =>
    '(() => { const app = montar(Tienda); ' +
    clics.map((texto) => 'clic(app, ' + JSON.stringify(texto) + '); ').join('') +
    'const html = app.html(); return ' +
    esperados.map((esperado) => 'html.includes(' + JSON.stringify(esperado) + ')').join(' && ') +
    '; })()';

  globalThis.Rutas.agregarLeccion('react', {
    id: 'repaso-carrito',
    titulo: 'Repaso: el carrito de Don Pepe',
    pasos: [
      {
        id: 'idea',
        titulo: 'Todo junto en una app pequeña',
        texto: [
          'Don Pepe quiere que sus clientes armen el pedido en la página: tocan "Agregar Pan", el carrito muestra "Pan x1", y el total se actualiza solo. Es el tipo de app que se pide en los proyectos de freeCodeCamp, y usa todo lo de esta ruta.',
          'Piensa primero en el **estado**: lo único que cambia es el contenido del carrito, un arreglo de `{ id, nombre, precio, cantidad }`. El total **no** es estado: se calcula del carrito cada vez que se dibuja, con `reduce`. Guardar en el estado solo lo necesario evita que dos datos se contradigan.',
          'Y una regla de React que importa mucho aquí: el estado **no se modifica**, se reemplaza. Para agregar no se usa `carrito.push(…)`: se crea un arreglo nuevo, con `[...carrito, nuevo]` o con `map`. React compara el arreglo viejo con el nuevo para saber si algo cambió; si modificas el mismo, puede no enterarse.',
          'Luego los **componentes**: `BotonProducto` (un botón por producto del catálogo) e `ItemCarrito` (una línea del carrito), y la `Tienda` que los junta. Ejecuta el ejemplo: es una versión con un solo botón.',
        ],
        codigo: armar('estado', [
          'function Tienda() {',
          '  const [carrito, setCarrito] = useState([]);',
          "  const agregarPan = () => setCarrito([...carrito, { id: 1, nombre: 'Pan', precio: 300, cantidad: 1 }]);",
          '  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('button', { onClick: agregarPan }, 'Agregar Pan'),",
          "    h('p', null, 'Productos: ' + carrito.length + '. Total: $' + total)",
          '  );',
          '}',
          '',
          'const app = montar(Tienda);',
          "clic(app, 'Agregar Pan');",
          "clic(app, 'Agregar Pan');",
          'console.log(app.html());',
          '// Fíjate: dice 2 productos porque cada clic agregó otra fila de Pan.',
          '// En el reto harás que el segundo clic sume a la cantidad.',
        ]),
      },
      {
        id: 'practica',
        titulo: 'Las piezas: el botón y la línea del carrito',
        texto: [
          'Escribe los dos componentes que usará la tienda. Solo reciben props, no tienen estado:',
          '- `BotonProducto({ producto, alAgregar })`: un `button` con el texto `Agregar ` + el nombre del producto, y `alAgregar` como su `onClick`.',
          '- `ItemCarrito({ item })`: un `li` con el texto `Nombre xCantidad: $subtotal`, donde el subtotal es precio por cantidad. Por ejemplo `Leche x2: $8400`.',
        ],
        codigo: armar('estado', [
          ...CATALOGO,
          'function BotonProducto({ producto, alAgregar }) {',
          "  return h('button', null, 'Agregar');",
          '}',
          '',
          'function ItemCarrito({ item }) {',
          "  return h('li', null, item.nombre);",
          '}',
          '',
          "console.log(aHtml(h(BotonProducto, { producto: CATALOGO[0], alAgregar: () => console.log('¡Clic!') })));",
          "console.log(aHtml(h(ItemCarrito, { item: { id: 2, nombre: 'Leche', precio: 4200, cantidad: 2 } })));",
        ]),
        pruebas: [
          {
            descripcion: 'BotonProducto dice Agregar y el nombre del producto',
            condicion: 'aHtml(h(BotonProducto, { producto: CATALOGO[2], alAgregar: () => {} })) === "<button>Agregar Tinto</button>"',
          },
          {
            descripcion: 'Al hacer clic, BotonProducto llama a alAgregar',
            condicion:
              '(() => { let veces = 0; const boton = BotonProducto({ producto: CATALOGO[0], alAgregar: () => { veces += 1; } }); ' +
              'boton.props.onClick(); return veces === 1; })()',
          },
          {
            descripcion: 'ItemCarrito muestra nombre, cantidad y subtotal',
            condicion:
              'aHtml(h(ItemCarrito, { item: { id: 2, nombre: "Leche", precio: 4200, cantidad: 2 } })) === "<li>Leche x2: $8400</li>"',
          },
          {
            descripcion: 'ItemCarrito funciona con otro producto',
            condicion:
              'aHtml(h(ItemCarrito, { item: { id: 1, nombre: "Pan", precio: 300, cantidad: 5 } })) === "<li>Pan x5: $1500</li>"',
          },
        ],
        pistas: [
          'En `BotonProducto`, las props del `button` son `{ onClick: alAgregar }` y el texto es `"Agregar " + producto.nombre`.',
          "En `ItemCarrito`, arma el texto con `+`: `item.nombre + ' x' + item.cantidad + ': $' + item.precio * item.cantidad`.",
          "Quedan: `return h('button', { onClick: alAgregar }, 'Agregar ' + producto.nombre);` y `return h('li', null, item.nombre + ' x' + item.cantidad + ': $' + item.precio * item.cantidad);`",
        ],
        solucion: armar('estado', [
          ...CATALOGO,
          ...COMPONENTES,
          "console.log(aHtml(h(BotonProducto, { producto: CATALOGO[0], alAgregar: () => console.log('¡Clic!') })));",
          "console.log(aHtml(h(ItemCarrito, { item: { id: 2, nombre: 'Leche', precio: 4200, cantidad: 2 } })));",
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: la tienda completa',
        texto: [
          'Escribe el componente `Tienda` con un estado `carrito` (empieza en `[]`). Debe devolver un `div` con:',
          '- Un `BotonProducto` por cada producto del `CATALOGO`, con su `id` como `key` y un `alAgregar` que llame a `agregar(producto)`.',
          '- Si el carrito está vacío, `<p>El carrito está vacío</p>`. Si no, un `ul` con un `ItemCarrito` por cada item, con su `id` como `key`.',
          '- Un párrafo con la clase `total` y el texto `Total: $` + el total.',
          '- Un botón `Vaciar` que deje el carrito en `[]`.',
          '`agregar(producto)`: si el producto **ya está** en el carrito, súmale 1 a su cantidad (con `map`, creando un objeto nuevo: `{ ...item, cantidad: item.cantidad + 1 }`); si no está, agrégalo al final con cantidad 1. En ningún caso modifiques el carrito que ya existe.',
        ],
        codigo: armar('estado', [
          ...CATALOGO,
          ...COMPONENTES,
          'function Tienda() {',
          '  const [carrito, setCarrito] = useState([]);',
          '',
          '  const agregar = (producto) => {',
          '    // Escribe aquí cómo se agrega un producto',
          '  };',
          '',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('p', { className: 'total' }, 'Total: $0')",
          '  );',
          '}',
          '',
          'const app = montar(Tienda);',
          'console.log(app.html());',
        ]),
        pruebas: [
          {
            descripcion: 'Al empezar: un botón por producto, carrito vacío y total $0',
            condicion: tienda(
              [],
              '<button>Agregar Pan</button><button>Agregar Leche</button><button>Agregar Tinto</button>',
              '<p>El carrito está vacío</p>',
              '<p class="total">Total: $0</p>'
            ),
          },
          {
            descripcion: 'Agregar Leche muestra Leche x1 y el total $4200',
            condicion: tienda(['Agregar Leche'], '<ul><li>Leche x1: $4200</li></ul>', '<p class="total">Total: $4200</p>'),
          },
          {
            descripcion: 'Agregar dos veces el mismo producto suma la cantidad (no repite la fila)',
            condicion: tienda(['Agregar Pan', 'Agregar Pan'], '<ul><li>Pan x2: $600</li></ul>', 'Total: $600'),
          },
          {
            descripcion: 'Varios productos salen en el orden en que se agregaron, con el total correcto',
            condicion: tienda(
              ['Agregar Tinto', 'Agregar Pan', 'Agregar Tinto'],
              '<ul><li>Tinto x2: $3000</li><li>Pan x1: $300</li></ul>',
              'Total: $3300'
            ),
          },
          {
            descripcion: 'Vaciar deja el carrito vacío y el total en $0',
            condicion: tienda(['Agregar Pan', 'Agregar Leche', 'Vaciar'], '<p>El carrito está vacío</p>', 'Total: $0'),
          },
          {
            descripcion: 'Los botones y las líneas del carrito tienen key (sin avisos)',
            condicion:
              '(() => { const antes = avisos.length; const app = montar(Tienda); clic(app, "Agregar Pan"); ' +
              'return avisos.length === antes && app.html().includes("Pan x1"); })()',
          },
          {
            descripcion: 'No modifica los productos del carrito: crea objetos nuevos',
            // Se espía a ItemCarrito para guardar el item que recibió en el primer
            // dibujo; si agregar() le cambió la cantidad a ese mismo objeto, se nota.
            condicion:
              '(() => { const original = ItemCarrito; const vistos = []; ' +
              'ItemCarrito = (props) => { vistos.push(props.item); return original(props); }; ' +
              'try { const app = montar(Tienda); clic(app, "Agregar Pan"); const primero = vistos[vistos.length - 1]; ' +
              'clic(app, "Agregar Pan"); return primero.cantidad === 1 && vistos[vistos.length - 1].cantidad === 2; } ' +
              'finally { ItemCarrito = original; } })()',
          },
        ],
        pistas: [
          "Para agregar: `const existe = carrito.some((item) => item.id === producto.id);`. Si existe, `setCarrito(carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))`; si no, `setCarrito([...carrito, { ...producto, cantidad: 1 }])`.",
          "El total: `const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);`. Los botones: `CATALOGO.map((p) => h(BotonProducto, { key: p.id, producto: p, alAgregar: () => agregar(p) }))`.",
          "La lista: `carrito.length === 0 ? h('p', null, 'El carrito está vacío') : h('ul', null, carrito.map((item) => h(ItemCarrito, { key: item.id, item })))`, y al final `h('button', { onClick: () => setCarrito([]) }, 'Vaciar')`.",
        ],
        solucion: armar('estado', [
          ...CATALOGO,
          ...COMPONENTES,
          'function Tienda() {',
          '  const [carrito, setCarrito] = useState([]);',
          '',
          '  // Nunca se toca el arreglo de antes: map y [...] crean uno nuevo.',
          '  const agregar = (producto) => {',
          '    const existe = carrito.some((item) => item.id === producto.id);',
          '    if (existe) {',
          '      setCarrito(',
          '        carrito.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))',
          '      );',
          '    } else {',
          '      setCarrito([...carrito, { ...producto, cantidad: 1 }]);',
          '    }',
          '  };',
          '',
          '  // El total no es estado: se calcula del carrito cada vez que se dibuja.',
          '  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);',
          '',
          '  const lista =',
          '    carrito.length === 0',
          "      ? h('p', null, 'El carrito está vacío')",
          "      : h('ul', null, carrito.map((item) => h(ItemCarrito, { key: item.id, item })));",
          '',
          '  return h(',
          "    'div',",
          '    null,',
          '    CATALOGO.map((p) => h(BotonProducto, { key: p.id, producto: p, alAgregar: () => agregar(p) })),',
          '    lista,',
          "    h('p', { className: 'total' }, 'Total: $' + total),",
          "    h('button', { onClick: () => setCarrito([]) }, 'Vaciar')",
          '  );',
          '}',
          '',
          'const app = montar(Tienda);',
          "clic(app, 'Agregar Pan');",
          "clic(app, 'Agregar Tinto');",
          "clic(app, 'Agregar Pan');",
          'console.log(app.html());',
        ]),
      },
    ],
  });
})();

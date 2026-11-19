globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'desestructuracion',
    titulo: 'Desestructuración y spread',
    pasos: [
      {
        id: 'idea',
        titulo: 'Sacar y copiar datos sin esfuerzo',
        texto: [
          'La **desestructuración** saca varias propiedades de un objeto (o varios elementos de un arreglo) en una sola línea. En vez de `const nombre = producto.nombre;` escribes `const { nombre } = producto;`.',
          'Con objetos se usan llaves y los **nombres de las propiedades**. Con arreglos se usan corchetes y cuenta el **orden**. Puedes dar un valor por defecto con `=`, que se usa si el dato no existe.',
          'El operador **spread** `...` "esparce" el contenido de un arreglo u objeto dentro de otro. Sirve para copiar o unir sin modificar el original: `{ ...producto, precio: 4000 }` es un objeto nuevo igual al producto, pero con otro precio.',
        ],
        codigo: [
          'const producto = { nombre: "Arepa", precio: 3000 };',
          'const { nombre, precio, stock = 0 } = producto; // stock no existe: vale 0',
          'console.log(nombre, precio, stock);',
          '',
          'const [primero, segundo] = ["tinto", "pan", "huevo"];',
          'console.log(primero, segundo);',
          '',
          'const frios = ["jugo", "limonada"];',
          'const menu = [...frios, "tinto"]; // arreglo nuevo, frios no cambia',
          'console.log(menu, frios);',
          '',
          'const conDescuento = { ...producto, precio: 2500 }; // copia con otro precio',
          'console.log(conDescuento, producto);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Nombre y precio de un golpe',
        texto: [
          'Del objeto `producto` saca `nombre` y `precio` en **una sola línea** usando desestructuración.',
          'Después muestra en la consola un mensaje que incluya los dos datos.',
        ],
        codigo: [
          'const producto = { nombre: "Buñuelo", precio: 1500, stock: 12 };',
          '',
          '// Saca nombre y precio con desestructuración y muéstralos',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'nombre vale "Buñuelo"', condicion: 'nombre === "Buñuelo"' },
          { descripcion: 'precio vale 1500', condicion: 'precio === 1500' },
          {
            descripcion: 'Usas desestructuración con llaves',
            condicion: '/\\b(const|let|var)\\s*\\{[^}]*\\}\\s*=\\s*producto/.test(codigo)',
          },
          {
            descripcion: 'Muestras el nombre y el precio',
            condicion:
              'salida.some((linea) => linea.includes("Buñuelo") && /1[.,]?500/.test(linea))',
          },
        ],
        pistas: [
          'Las llaves van al lado izquierdo: `const { nombre } = producto;`',
          'Para sacar dos propiedades las separas con coma: `const { nombre, precio } = producto;`',
          'Para mostrarlas juntas: `console.log(nombre, precio);`',
        ],
        solucion: [
          'const producto = { nombre: "Buñuelo", precio: 1500, stock: 12 };',
          '',
          'const { nombre, precio } = producto;',
          'console.log(nombre, precio);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: el precio nuevo',
        texto: [
          'Don Pepe sube los precios, pero quiere guardar el producto original tal como estaba.',
          'Crea la función `actualizarPrecio(producto, nuevoPrecio)` que devuelve una **copia** del producto con el precio nuevo. El producto original **no** debe cambiar.',
          'La copia debe conservar todas las demás propiedades, sean cuales sean.',
        ],
        codigo: [
          'const original = { nombre: "Tinto", precio: 1500, stock: 40 };',
          '',
          'function actualizarPrecio(producto, nuevoPrecio) {',
          '  // Devuelve una copia con el precio nuevo',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'actualizarPrecio es una función', condicion: 'typeof actualizarPrecio === "function"' },
          {
            descripcion: 'La copia trae el precio nuevo',
            condicion: 'actualizarPrecio(original, 2000).precio === 2000',
          },
          {
            descripcion: 'La copia conserva las demás propiedades',
            condicion:
              '(() => { const copia = actualizarPrecio({ nombre: "Café", precio: 900, stock: 3 }, 1000); return copia.nombre === "Café" && copia.stock === 3 && copia.precio === 1000; })()',
          },
          {
            descripcion: 'Devuelve un objeto distinto al original',
            condicion: 'actualizarPrecio(original, 2000) !== original',
          },
          {
            descripcion: 'El producto original no cambia',
            condicion:
              '(() => { const p = { nombre: "Arepa", precio: 3000, stock: 8 }; actualizarPrecio(p, 3500); return p.precio === 3000 && p.nombre === "Arepa" && p.stock === 8 && Object.keys(p).length === 3; })()',
          },
          {
            descripcion: 'Funciona con otro tipo de producto',
            condicion:
              '(() => { const copia = actualizarPrecio({ nombre: "Jugo", precio: 4500, sabor: "lulo" }, 5000); return copia.sabor === "lulo" && copia.precio === 5000; })()',
          },
        ],
        pistas: [
          'Copiar y cambiar una propiedad se hace en un solo paso con spread: `{ ...producto, precio: nuevoPrecio }`',
          'Lo que va después del spread tiene prioridad: pisa la propiedad `precio` de la copia.',
          'No escribas `producto.precio = ...`: eso cambiaría el original.',
        ],
        solucion: [
          'const original = { nombre: "Tinto", precio: 1500, stock: 40 };',
          '',
          'function actualizarPrecio(producto, nuevoPrecio) {',
          '  return { ...producto, precio: nuevoPrecio };',
          '}',
        ].join('\n'),
      },
    ],
  }
);

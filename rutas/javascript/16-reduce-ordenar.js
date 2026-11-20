globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'reduce-ordenar',
    titulo: 'Reduce y ordenar',
    pasos: [
      {
        id: 'idea',
        titulo: 'Juntar y ordenar',
        texto: [
          '`reduce` recorre un arreglo y lo **reduce a un solo valor**: una suma, un conteo, un objeto. Recibe una función con dos datos, el **acumulador** (lo que llevas hasta ahora) y el elemento actual, y un valor inicial: `ventas.reduce((suma, venta) => suma + venta, 0)`.',
          'También sirve para agrupar: el acumulador puede ser un objeto que va creciendo, por ejemplo un total por categoría.',
          '`sort` ordena con una **función de comparación** `(a, b) => a - b`: si devuelve un número negativo, `a` va primero; si es positivo, `b` va primero. Para ir de mayor a menor se invierte: `b - a`.',
          'Ojo: `sort` **modifica el arreglo original**. Para no dañarlo, copia antes con spread: `[...arreglo].sort(...)`.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 2: `suma` empieza en 0 (el valor inicial). Vuelta 1: 0 + 4500 = 4500. Vuelta 2: 4500 + 3000 = 7500. Vuelta 3: 7500 + 12000 = 19500. Es el mismo acumulador del `for...of`, en una línea.',
          'Líneas 10 a 12: aquí el acumulador `grupos` es un objeto que empieza vacío `{}`. Dos detalles nuevos: `[p.categoria]` entre corchetes usa el **valor** de la categoría ("comida") como nombre de propiedad, y `grupos[p.categoria] || 0` significa "lo que lleve esa categoría, o 0 si todavía no tiene nada". El resultado es `{ comida: 4500, bebida: 4500 }`.',
          'Línea 15: copia `ventas` y ordena la copia de menor a mayor. `ventas` queda como estaba.',
          '**Error común:** olvidar el valor inicial. `[].reduce((suma, venta) => suma + venta)` con una lista vacía falla con `Reduce of empty array with no initial value` ("reduce de un arreglo vacío sin valor inicial"). Solución: termina siempre con `, 0)` o el valor que corresponda.',
        ],
        codigo: [
          'const ventas = [4500, 3000, 12000];',
          'const total = ventas.reduce((suma, venta) => suma + venta, 0);',
          'console.log(total); // 19500',
          '',
          'const productos = [',
          '  { nombre: "Arepa", categoria: "comida", precio: 3000 },',
          '  { nombre: "Jugo", categoria: "bebida", precio: 4500 },',
          '  { nombre: "Buñuelo", categoria: "comida", precio: 1500 }',
          '];',
          'const porCategoria = productos.reduce((grupos, p) => {',
          '  return { ...grupos, [p.categoria]: (grupos[p.categoria] || 0) + p.precio };',
          '}, {});',
          'console.log(porCategoria);',
          '',
          'const copia = [...ventas].sort((a, b) => a - b); // ventas queda igual',
          'console.log(copia, ventas);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El total de ventas',
        texto: [
          'La lista `ventas` tiene lo vendido en cada pedido del día.',
          'Calcula en la constante `totalVentas` la suma de todas con `ventas.reduce(...)`. No olvides el valor inicial 0.',
        ],
        codigo: [
          'const ventas = [4500, 3000, 12000, 1500, 7000];',
          '',
          '// TODO: crea totalVentas con ventas.reduce( ... ).',
          '// La flecha recibe (suma, venta) y devuelve el acumulado nuevo.',
          '// No olvides el valor inicial al final.',
          '',
          '// Para revisar: console.log(totalVentas); debe mostrar 28000',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'totalVentas vale 28000', condicion: 'totalVentas === 28000' },
          { descripcion: 'Usas ventas.reduce', condicion: '/ventas\\s*\\.reduce\\s*\\(/.test(codigo)' },
          { descripcion: 'Das el valor inicial 0 a reduce', condicion: '/ventas\\s*\\.reduce\\s*\\([\\s\\S]*,\\s*0\\s*\\)/.test(codigo)' },
          {
            descripcion: 'La lista ventas no cambió',
            condicion: 'JSON.stringify(ventas) === "[4500,3000,12000,1500,7000]"',
          },
        ],
        pistas: [
          'Es casi igual a la línea 2 del ejemplo de la Idea. La forma es `ventas.reduce((suma, venta) => ..., 0)`.',
          'En cada vuelta devuelves el acumulado nuevo: `suma + venta`.',
          'Completa: `const totalVentas = ventas.reduce((suma, venta) => suma + venta, 0);`',
        ],
        solucion: [
          'const ventas = [4500, 3000, 12000, 1500, 7000];',
          '',
          'const totalVentas = ventas.reduce((suma, venta) => suma + venta, 0);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: de mayor a menor',
        texto: [
          'Crea la función `ordenarPorPrecio(productos)` que devuelve un arreglo nuevo con los productos ordenados por `precio`, del **más caro al más barato**.',
          'El arreglo original **no** debe cambiar de orden: copia antes de ordenar. Debe funcionar con una lista vacía.',
        ],
        codigo: [
          'const productos = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Café", precio: 18000 },',
          '  { nombre: "Buñuelo", precio: 1500 },',
          '  { nombre: "Jugo", precio: 4500 }',
          '];',
          '',
          'function ordenarPorPrecio(productos) {',
          '  // TODO 1: copia la lista con spread.',
          '  // TODO 2: ordena la copia comparando precios, del más caro al más barato.',
          '  // TODO 3: devuelve la copia ordenada.',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'ordenarPorPrecio es una función', condicion: 'typeof ordenarPorPrecio === "function"' },
          {
            descripcion: 'Ordena de mayor a menor',
            condicion:
              'ordenarPorPrecio(productos).map((p) => p.precio).join(",") === "18000,4500,3000,1500"',
          },
          {
            descripcion: 'Conserva los nombres junto a cada precio',
            condicion: 'ordenarPorPrecio(productos)[0].nombre === "Café"',
          },
          {
            descripcion: 'No modifica el arreglo original',
            condicion:
              '(() => { const lista = [{ precio: 1 }, { precio: 9 }, { precio: 5 }]; ordenarPorPrecio(lista); return lista.map((p) => p.precio).join(",") === "1,9,5"; })()',
          },
          {
            descripcion: 'Devuelve un arreglo distinto al original',
            condicion: 'ordenarPorPrecio(productos) !== productos',
          },
          {
            descripcion: 'Funciona con otra lista',
            condicion:
              'ordenarPorPrecio([{ precio: 10 }, { precio: 30 }, { precio: 20 }]).map((p) => p.precio).join(",") === "30,20,10"',
          },
          {
            descripcion: 'Con una lista vacía devuelve una lista vacía',
            condicion: 'Array.isArray(ordenarPorPrecio([])) && ordenarPorPrecio([]).length === 0',
          },
        ],
        pistas: [
          'Son dos pasos: copiar y ordenar la copia. "Del más caro al más barato" es de mayor a menor, así que la resta va al revés.',
          'Copia con `[...productos]` y ordena esa copia con `.sort((a, b) => b.precio - a.precio)`. Se resta `.precio` porque cada elemento es un objeto.',
          'Juntos: `return [...productos].sort((a, b) => b.precio - a.precio);`',
        ],
        solucion: [
          'const productos = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Café", precio: 18000 },',
          '  { nombre: "Buñuelo", precio: 1500 },',
          '  { nombre: "Jugo", precio: 4500 }',
          '];',
          '',
          'function ordenarPorPrecio(productos) {',
          '  return [...productos].sort((a, b) => b.precio - a.precio);',
          '}',
        ].join('\n'),
      },
    ],
  }
);

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
          '// Calcula aquí totalVentas con reduce',
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
          'La forma es `ventas.reduce((suma, venta) => ..., 0)`.',
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
          '  // Devuelve una copia ordenada de mayor a menor precio',
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
          'Primero copia: `[...productos]` es un arreglo nuevo con los mismos productos.',
          'Luego ordena la copia: `.sort((a, b) => b.precio - a.precio)`.',
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

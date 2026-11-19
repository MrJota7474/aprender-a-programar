globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'agrupar',
    titulo: 'Agrupar con GROUP BY',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un resumen por cada grupo',
        texto: [
          'Con `GROUP BY` SQL arma grupos con las filas que tienen el mismo valor en una columna, y calcula el resumen **de cada grupo**.',
          'Así, "cuántos productos hay por categoría" es: agrupar por `categoria` y contar.',
          'Para filtrar grupos según su resumen se usa `HAVING`. La diferencia: `WHERE` filtra filas antes de agrupar; `HAVING` filtra grupos después.',
        ],
        codigo: [
          'SELECT categoria, COUNT(*) AS cuantos',
          'FROM productos',
          'GROUP BY categoria;',
          '',
          'SELECT categoria, AVG(precio) AS promedio',
          'FROM productos',
          'GROUP BY categoria',
          'HAVING AVG(precio) > 3000;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Clientes por ciudad',
        texto: [
          'Muestra cuántos clientes hay en cada ciudad.',
          'Las columnas deben ser `ciudad` y `cuantos`.',
        ],
        codigo: '-- Cuántos clientes hay en cada ciudad\n',
        pruebas: [
          { descripcion: 'Las columnas son ciudad y cuantos', condicion: 'columnas.join() === "ciudad,cuantos"' },
          {
            descripcion: 'Cada ciudad aparece con su cantidad de clientes',
            condicion: 'mismasFilas("SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad")',
          },
          { descripcion: 'Usas GROUP BY', condicion: '/\\bGROUP\\s+BY\\b/.test(codigo)' },
        ],
        pistas: [
          'En el `SELECT` van la columna del grupo y el conteo: `ciudad, COUNT(*) AS cuantos`',
          'Al final se agrupa por la misma columna: `GROUP BY ciudad`',
          '`SELECT ciudad, COUNT(*) AS cuantos FROM clientes GROUP BY ciudad;`',
        ],
        solucion: ['SELECT ciudad, COUNT(*) AS cuantos', 'FROM clientes', 'GROUP BY ciudad;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los productos más pedidos',
        texto: [
          'En la tabla `pedidos`, suma la `cantidad` pedida de cada `producto_id`. Llama a esa columna `unidades`.',
          'Muestra solo los productos que suman **3 unidades o más**, del más pedido al menos pedido.',
          'Necesitas tres piezas, en este orden: `GROUP BY`, `HAVING` y `ORDER BY`.',
        ],
        codigo: '-- Unidades pedidas por producto (solo los de 3 o más)\n',
        pruebas: [
          {
            descripcion: 'Las columnas son producto_id y unidades',
            condicion: 'columnas.join() === "producto_id,unidades"',
          },
          {
            descripcion: 'Aparecen solo los productos con 3 unidades o más',
            condicion:
              'mismasFilas("SELECT producto_id, SUM(cantidad) FROM pedidos GROUP BY producto_id HAVING SUM(cantidad) >= 3")',
          },
          {
            descripcion: 'Van del más pedido al menos pedido',
            condicion: 'filas.length > 1 && filas.every((fila, i) => i === 0 || filas[i - 1][1] >= fila[1])',
          },
        ],
        pistas: [
          'Empieza con `SELECT producto_id, SUM(cantidad) AS unidades FROM pedidos GROUP BY producto_id`',
          'El filtro de grupos va después: `HAVING SUM(cantidad) >= 3`',
          'Y al final el orden: `ORDER BY unidades DESC`',
        ],
        solucion: [
          'SELECT producto_id, SUM(cantidad) AS unidades',
          'FROM pedidos',
          'GROUP BY producto_id',
          'HAVING SUM(cantidad) >= 3',
          'ORDER BY unidades DESC;',
        ].join('\n'),
      },
    ],
  }
);

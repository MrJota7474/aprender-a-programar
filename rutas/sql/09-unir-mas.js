globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'unir-mas',
    titulo: 'Uniones y resúmenes',
    pasos: [
      {
        id: 'idea',
        titulo: 'Tres tablas a la vez',
        texto: [
          'Un pedido conecta a un cliente con un producto. Para ver los dos nombres se usan dos `JOIN`, uno después del otro.',
          'Como las dos tablas tienen una columna `nombre`, se les pone un alias con `AS` para distinguirlas en el resultado.',
          'Y ya con las tablas unidas se puede calcular: la cantidad está en `pedidos` y el precio en `productos`, así que el valor del pedido es `pedidos.cantidad * productos.precio`.',
        ],
        codigo: [
          'SELECT clientes.nombre AS cliente,',
          '       productos.nombre AS producto,',
          '       pedidos.cantidad * productos.precio AS total',
          'FROM pedidos',
          'JOIN clientes ON pedidos.cliente_id = clientes.id',
          'JOIN productos ON pedidos.producto_id = productos.id;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El valor de cada pedido',
        texto: [
          'Muestra, para cada pedido: `pedidos.id`, `productos.nombre` y una columna `total` con el valor del pedido (cantidad por precio).',
          'Solo necesitas unir `pedidos` con `productos`.',
        ],
        codigo: '-- id del pedido, nombre del producto y total\n',
        pruebas: [
          { descripcion: 'La tercera columna se llama total', condicion: 'columnas[2] === "total"' },
          {
            descripcion: 'Cada pedido muestra su producto y su valor',
            condicion:
              'mismasFilas("SELECT pedidos.id, productos.nombre, pedidos.cantidad * productos.precio FROM pedidos JOIN productos ON pedidos.producto_id = productos.id")',
          },
        ],
        pistas: [
          'La unión es `FROM pedidos JOIN productos ON pedidos.producto_id = productos.id`',
          'La columna calculada es `pedidos.cantidad * productos.precio AS total`',
          'El `SELECT` completo: `SELECT pedidos.id, productos.nombre, pedidos.cantidad * productos.precio AS total`',
        ],
        solucion: [
          'SELECT pedidos.id, productos.nombre, pedidos.cantidad * productos.precio AS total',
          'FROM pedidos',
          'JOIN productos ON pedidos.producto_id = productos.id;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los mejores clientes',
        texto: [
          'Esta es una consulta como las que se hacen en un trabajo real: junta `JOIN`, `SUM`, `GROUP BY` y `ORDER BY`.',
          'Muestra cuánto ha gastado cada cliente que ha hecho pedidos: `clientes.nombre` y una columna `gastado` con la suma del valor de todos sus pedidos.',
          'Ordena del que más ha gastado al que menos.',
        ],
        codigo: '-- Cuánto ha gastado cada cliente, de mayor a menor\n',
        pruebas: [
          { descripcion: 'Las columnas son nombre y gastado', condicion: 'columnas.join() === "nombre,gastado"' },
          {
            descripcion: 'Cada cliente aparece con el total de sus pedidos, de mayor a menor',
            condicion:
              'igualA("SELECT clientes.nombre, SUM(pedidos.cantidad * productos.precio) AS gastado FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id JOIN productos ON pedidos.producto_id = productos.id GROUP BY clientes.id ORDER BY gastado DESC")',
          },
          { descripcion: 'Usas GROUP BY', condicion: '/\\bGROUP\\s+BY\\b/.test(codigo)' },
        ],
        pistas: [
          'Parte de la consulta del primer paso, con sus dos `JOIN`.',
          'En el `SELECT`: `clientes.nombre, SUM(pedidos.cantidad * productos.precio) AS gastado`',
          'Al final: `GROUP BY clientes.nombre` y después `ORDER BY gastado DESC`',
        ],
        solucion: [
          'SELECT clientes.nombre, SUM(pedidos.cantidad * productos.precio) AS gastado',
          'FROM pedidos',
          'JOIN clientes ON pedidos.cliente_id = clientes.id',
          'JOIN productos ON pedidos.producto_id = productos.id',
          'GROUP BY clientes.nombre',
          'ORDER BY gastado DESC;',
        ].join('\n'),
      },
    ],
  }
);

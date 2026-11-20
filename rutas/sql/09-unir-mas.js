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
          'Ejecuta el código: cada fila dice quién compró, qué compró y cuánto pagó. Esos tres datos viven en tres tablas distintas.',
          'Un pedido conecta a un cliente con un producto: guarda `cliente_id` y `producto_id`. Para ver los dos nombres se usan dos `JOIN`, uno después del otro.',
          '**Ejemplo explicado línea por línea:** `FROM pedidos` empieza por los pedidos. El primer `JOIN` pega los datos del cliente de cada pedido; el segundo, los del producto. En el `SELECT`, `clientes.nombre AS cliente` y `productos.nombre AS producto` llevan alias porque las dos columnas se llaman `nombre` y en el resultado no se distinguirían.',
          'Con las tablas unidas se puede calcular: la cantidad está en `pedidos` y el precio en `productos`, así que el valor del pedido es `pedidos.cantidad * productos.precio`.',
          '**Error común:** olvidar el `ON` de un `JOIN`. Sin él, SQL une **cada** pedido con **cada** producto y el resultado se llena de filas que no tienen sentido (10 pedidos por 10 productos dan 100 filas). Si ves muchas más filas de las esperadas, revisa los `ON`.',
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
        codigo: [
          '-- TODO: muestra pedidos.id, productos.nombre y la cuenta',
          '--       pedidos.cantidad * productos.precio con el alias total',
          '-- TODO: une pedidos con productos con JOIN ... ON ...',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'La tercera columna se llama total', condicion: 'columnas[2] === "total"' },
          {
            descripcion: 'Cada pedido muestra su producto y su valor',
            condicion:
              'mismasFilas("SELECT pedidos.id, productos.nombre, pedidos.cantidad * productos.precio FROM pedidos JOIN productos ON pedidos.producto_id = productos.id")',
          },
        ],
        pistas: [
          'Es el ejemplo con un solo `JOIN`: aquí no hace falta la tabla de clientes.',
          'La unión es `FROM pedidos JOIN productos ON pedidos.producto_id = productos.id`, y la columna calculada lleva `AS total`.',
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
        codigo: [
          '-- TODO: une pedidos con clientes y con productos (dos JOIN, como en el ejemplo)',
          '-- TODO: en el SELECT, clientes.nombre y la SUMA de cantidad * precio AS gastado',
          '-- TODO: agrupa por cliente con GROUP BY',
          '-- TODO: ordena por gastado de mayor a menor',
          '',
        ].join('\n'),
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
          'Parte de la consulta del ejemplo, con sus dos `JOIN`: ya tiene el valor de cada pedido. Falta juntar los pedidos de cada cliente.',
          'Juntar por cliente es `GROUP BY`, y sumar el valor de sus pedidos es `SUM(pedidos.cantidad * productos.precio)`.',
          'En el `SELECT`: `clientes.nombre, SUM(pedidos.cantidad * productos.precio) AS gastado`. Al final: `GROUP BY clientes.nombre` y `ORDER BY gastado DESC;`',
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

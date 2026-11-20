globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'unir',
    titulo: 'Unir tablas con JOIN',
    pasos: [
      {
        id: 'idea',
        titulo: 'Tablas que se conectan',
        texto: [
          'Mira la tabla `pedidos`: no guarda el nombre del cliente, sino `cliente_id`, un número. Si `cliente_id` es 2, el pedido es del cliente cuyo `id` es 2 en la tabla `clientes`. Así el nombre se guarda una sola vez, y si cambia, se corrige en un solo lugar.',
          'Para ver el nombre al lado del pedido hay que **unir** las dos tablas con `JOIN` ("juntar"). Después de `ON` ("en") se dice cómo se conectan: qué columna de una es igual a qué columna de la otra.',
          'Cuando hay dos tablas conviene escribir `tabla.columna` para que quede claro de dónde sale cada dato. Las dos tienen una columna `id`, y sin el nombre de la tabla SQL no sabría cuál quieres.',
          '**Ejemplo explicado línea por línea:** `FROM pedidos` empieza por los pedidos. `JOIN clientes ON pedidos.cliente_id = clientes.id` busca, para cada pedido, el cliente cuyo `id` coincide, y pega sus columnas al lado. Ahora el `SELECT` puede mostrar `clientes.nombre` junto a `pedidos.fecha`.',
          'Esta es la idea más importante de las bases de datos: las tablas se relacionan entre sí. Por eso se llaman **bases de datos relacionales**.',
          '**Error común:** escribir `id` sin decir de qué tabla. Si escribes `SELECT id, nombre ...` con dos tablas unidas, verás `ambiguous column name: id` (nombre de columna ambiguo). Escribe `pedidos.id` o `clientes.id`.',
        ],
        codigo: [
          'SELECT pedidos.id, clientes.nombre, pedidos.fecha',
          'FROM pedidos',
          'JOIN clientes ON pedidos.cliente_id = clientes.id;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Qué producto se pidió?',
        texto: [
          'La consulta muestra el `producto_id` de cada pedido, que es solo un número.',
          'Cámbiala para mostrar `pedidos.id`, el **nombre del producto** (`productos.nombre`) y `pedidos.cantidad`, uniendo `pedidos` con `productos`.',
        ],
        codigo: [
          'SELECT pedidos.id, pedidos.producto_id, pedidos.cantidad',
          'FROM pedidos;',
          '',
          '-- TODO 1: después de FROM pedidos, une la tabla productos con JOIN ... ON ...',
          '-- TODO 2: en el SELECT, cambia pedidos.producto_id por productos.nombre',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El resultado tiene los 10 pedidos', condicion: 'filas.length === 10' },
          {
            descripcion: 'Cada pedido muestra el nombre de su producto y la cantidad',
            condicion:
              'mismasFilas("SELECT pedidos.id, productos.nombre, pedidos.cantidad FROM pedidos JOIN productos ON pedidos.producto_id = productos.id")',
          },
          { descripcion: 'Usas JOIN para unir las tablas', condicion: '/\\bJOIN\\b/.test(codigo)' },
        ],
        pistas: [
          'Copia la forma del ejemplo, pero uniendo con `productos` en vez de con `clientes`.',
          'Las tablas se conectan con `ON pedidos.producto_id = productos.id`. Recuerda mover el punto y coma al final.',
          'Queda: `SELECT pedidos.id, productos.nombre, pedidos.cantidad FROM pedidos JOIN productos ON ...;`',
        ],
        solucion: [
          'SELECT pedidos.id, productos.nombre, pedidos.cantidad',
          'FROM pedidos',
          'JOIN productos ON pedidos.producto_id = productos.id;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los pedidos de Bogotá',
        texto: [
          'Un `JOIN` se combina con todo lo que ya sabes.',
          'Muestra `clientes.nombre` y `pedidos.fecha` de los pedidos hechos por clientes que viven en Bogotá.',
        ],
        codigo: [
          '-- TODO: muestra clientes.nombre y pedidos.fecha',
          '-- TODO: une pedidos con clientes (igual que en el ejemplo)',
          "-- TODO: filtra con WHERE los clientes cuya ciudad es 'Bogotá'",
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Aparecen solo los pedidos de clientes de Bogotá',
            condicion: `mismasFilas("SELECT clientes.nombre, pedidos.fecha FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE clientes.ciudad = 'Bogotá'")`,
          },
          { descripcion: 'Las columnas son nombre y fecha', condicion: 'columnas.join() === "nombre,fecha"' },
          { descripcion: 'Usas JOIN y WHERE', condicion: '/\\bJOIN\\b/.test(codigo) && /\\bWHERE\\b/.test(codigo)' },
        ],
        pistas: [
          'Parte de la consulta del ejemplo: ya une pedidos con clientes. Solo le faltan otras columnas y un filtro.',
          'El `WHERE` va al final, después del `JOIN`, y usa `clientes.ciudad`.',
          'Queda: `SELECT clientes.nombre, pedidos.fecha FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE clientes.ciudad = ...;`',
        ],
        solucion: [
          'SELECT clientes.nombre, pedidos.fecha',
          'FROM pedidos',
          'JOIN clientes ON pedidos.cliente_id = clientes.id',
          "WHERE clientes.ciudad = 'Bogotá';",
        ].join('\n'),
      },
    ],
  }
);

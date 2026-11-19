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
          'Mira la tabla `pedidos`: no guarda el nombre del cliente, sino `cliente_id`, un número que apunta al `id` de la tabla `clientes`. Así cada dato se guarda una sola vez.',
          'Para ver el nombre hay que **unir** las dos tablas con `JOIN`. Después de `ON` se dice cómo se conectan: qué columna de una es igual a qué columna de la otra.',
          'Cuando hay dos tablas conviene escribir `tabla.columna` para que quede claro de dónde sale cada dato. Las dos tienen una columna `id`, y sin el nombre de la tabla SQL no sabría cuál quieres.',
          'Esta es la idea más importante de las bases de datos: por eso se llaman **relacionales**.',
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
          '-- Une con la tabla productos y muestra el nombre en vez del número',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El resultado tiene los 10 pedidos', condicion: 'filas.length === 10' },
          {
            descripcion: 'Cada pedido muestra el nombre de su producto y la cantidad',
            condicion:
              'mismasFilas("SELECT pedidos.id, productos.nombre, pedidos.cantidad FROM pedidos JOIN productos ON pedidos.producto_id = productos.id")',
          },
          { descripcion: 'Usas JOIN', condicion: '/\\bJOIN\\b/.test(codigo)' },
        ],
        pistas: [
          'Después del `FROM pedidos` agrega `JOIN productos ON ...`',
          'Las tablas se conectan así: `pedidos.producto_id = productos.id`',
          'En el `SELECT`, cambia `pedidos.producto_id` por `productos.nombre`.',
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
        codigo: '-- Pedidos de los clientes de Bogotá\n',
        pruebas: [
          {
            descripcion: 'Aparecen solo los pedidos de clientes de Bogotá',
            condicion: `mismasFilas("SELECT clientes.nombre, pedidos.fecha FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id WHERE clientes.ciudad = 'Bogotá'")`,
          },
          { descripcion: 'Las columnas son nombre y fecha', condicion: 'columnas.join() === "nombre,fecha"' },
          { descripcion: 'Usas JOIN y WHERE', condicion: '/\\bJOIN\\b/.test(codigo) && /\\bWHERE\\b/.test(codigo)' },
        ],
        pistas: [
          'Empieza con la consulta del primer paso: `FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id`',
          'El filtro va al final, después del `JOIN`: `WHERE clientes.ciudad = \'Bogotá\'`',
          'En el `SELECT` van `clientes.nombre, pedidos.fecha`',
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

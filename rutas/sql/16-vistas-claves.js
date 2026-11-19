globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'vistas-claves',
    titulo: 'Vistas y claves foráneas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Guardar consultas y conectar tablas',
        texto: [
          'Una **vista** es una consulta guardada con un nombre. Se crea con `CREATE VIEW nombre AS SELECT ...` y después se usa como si fuera una tabla: `SELECT * FROM nombre`. No copia datos: cada vez que la consultas, corre la consulta de nuevo y te muestra los datos al día.',
          'Una **clave foránea** conecta una tabla con otra al diseñarlas. `producto_id INTEGER REFERENCES productos(id)` dice: "este valor tiene que ser el `id` de un producto que existe". Así nadie puede guardar un favorito de un producto inventado.',
          'Ojo con un detalle de SQLite: por defecto **no hace cumplir** las claves foráneas. Hay que encenderlas en cada conexión con `PRAGMA foreign_keys = ON;`, antes de insertar datos. Con eso activado, un `INSERT` con un producto que no existe da error.',
          'Ejecuta el ejemplo: crea una vista, una tabla con clave foránea y consulta las dos.',
        ],
        codigo: [
          'CREATE VIEW productos_caros AS',
          '  SELECT nombre, precio',
          '  FROM productos',
          '  WHERE precio >= 4000;',
          '',
          'PRAGMA foreign_keys = ON;',
          '',
          'CREATE TABLE favoritos (',
          '  id INTEGER PRIMARY KEY,',
          '  cliente_id INTEGER NOT NULL,',
          '  producto_id INTEGER NOT NULL,',
          '  FOREIGN KEY (producto_id) REFERENCES productos (id)',
          ');',
          '',
          'INSERT INTO favoritos (cliente_id, producto_id) VALUES (1, 5), (2, 7);',
          '',
          'SELECT * FROM productos_caros;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Una vista con el valor de cada pedido',
        texto: [
          'Crea una vista llamada `valor_pedidos` con tres columnas: `pedido` (el id del pedido), `cliente` (el nombre del cliente) y `total` (cantidad por precio).',
          'Después consúltala con `SELECT * FROM valor_pedidos;` para ver los 10 pedidos.',
        ],
        codigo: [
          '-- 1. Crea la vista valor_pedidos (pedido, cliente, total)',
          '',
          '-- 2. Consúltala',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Existe la vista valor_pedidos',
            condicion: `consulta("SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'valor_pedidos'").length === 1`,
          },
          {
            descripcion: 'La vista tiene el pedido, el cliente y el total de cada pedido',
            condicion:
              'JSON.stringify(consulta("SELECT pedido, cliente, total FROM valor_pedidos ORDER BY pedido")) === JSON.stringify(consulta("SELECT pedidos.id AS pedido, clientes.nombre AS cliente, pedidos.cantidad * productos.precio AS total FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id JOIN productos ON pedidos.producto_id = productos.id ORDER BY pedidos.id"))',
          },
          {
            descripcion: 'Consultas la vista y se ven los 10 pedidos',
            condicion: 'filas.length === 10 && columnas.includes("total")',
          },
        ],
        pistas: [
          'La vista empieza así: `CREATE VIEW valor_pedidos AS SELECT ...`, seguido de una consulta normal.',
          'La consulta es la de uniones de la lección 9, con alias: `pedidos.id AS pedido`, `clientes.nombre AS cliente` y `pedidos.cantidad * productos.precio AS total`.',
          'Al final, `SELECT * FROM valor_pedidos;` para mostrarla.',
        ],
        solucion: [
          'CREATE VIEW valor_pedidos AS',
          '  SELECT pedidos.id AS pedido,',
          '         clientes.nombre AS cliente,',
          '         pedidos.cantidad * productos.precio AS total',
          '  FROM pedidos',
          '  JOIN clientes ON pedidos.cliente_id = clientes.id',
          '  JOIN productos ON pedidos.producto_id = productos.id;',
          '',
          'SELECT * FROM valor_pedidos;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: reposiciones con clave foránea',
        texto: [
          'Don Pepe quiere anotar cada vez que repone mercancía. Diseña la tabla `reposiciones` con estas columnas:',
          '- `id`: entero y clave de la tabla.',
          '- `producto_id`: entero obligatorio, con clave foránea hacia `productos(id)`.',
          '- `cantidad`: entero obligatorio.',
          'Activa las claves foráneas con `PRAGMA foreign_keys = ON;`, inserta al menos 2 reposiciones de productos que existan y muestra la tabla.',
        ],
        codigo: [
          '-- 1. Activa las claves foráneas',
          '',
          '-- 2. Crea la tabla reposiciones',
          '',
          '-- 3. Inserta al menos 2 reposiciones',
          '',
          '-- 4. Muestra la tabla',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La tabla reposiciones tiene las columnas id, producto_id y cantidad',
            condicion: 'consulta("PRAGMA table_info(reposiciones)").map((c) => c.name).join() === "id,producto_id,cantidad"',
          },
          {
            descripcion: 'producto_id tiene una clave foránea hacia productos(id)',
            condicion:
              'consulta("PRAGMA foreign_key_list(reposiciones)").some((f) => f.table === "productos" && f.from === "producto_id" && (f.to === "id" || f.to === null))',
          },
          {
            descripcion: 'Activaste las claves foráneas con PRAGMA foreign_keys = ON',
            condicion: 'consulta("PRAGMA foreign_keys")[0].foreign_keys === 1',
          },
          {
            descripcion: 'El PRAGMA va antes del primer INSERT',
            condicion: 'codigo.search(/PRAGMA\\s+FOREIGN_KEYS/) >= 0 && codigo.search(/PRAGMA\\s+FOREIGN_KEYS/) < codigo.search(/\\bINSERT\\b/)',
          },
          {
            descripcion: 'Hay al menos 2 reposiciones y todas son de productos que existen',
            condicion:
              'consulta("SELECT COUNT(*) AS n FROM reposiciones")[0].n >= 2 && consulta("SELECT COUNT(*) AS n FROM reposiciones WHERE producto_id NOT IN (SELECT id FROM productos)")[0].n === 0',
          },
          { descripcion: 'Muestras la tabla', condicion: 'filas.length >= 2 && columnas.includes("producto_id")' },
        ],
        pistas: [
          'El `PRAGMA foreign_keys = ON;` va primero, antes de insertar. Hay que encenderlo en cada ejecución.',
          'La clave foránea puede ir al final de la tabla: `FOREIGN KEY (producto_id) REFERENCES productos (id)`.',
          'Inserta con ids de productos que existen (del 1 al 10): `INSERT INTO reposiciones (producto_id, cantidad) VALUES (4, 50), (7, 10);`',
        ],
        solucion: [
          'PRAGMA foreign_keys = ON;',
          '',
          'CREATE TABLE reposiciones (',
          '  id INTEGER PRIMARY KEY,',
          '  producto_id INTEGER NOT NULL,',
          '  cantidad INTEGER NOT NULL,',
          '  FOREIGN KEY (producto_id) REFERENCES productos (id)',
          ');',
          '',
          'INSERT INTO reposiciones (producto_id, cantidad) VALUES (4, 50), (7, 10);',
          '',
          'SELECT * FROM reposiciones;',
        ].join('\n'),
      },
    ],
  }
);

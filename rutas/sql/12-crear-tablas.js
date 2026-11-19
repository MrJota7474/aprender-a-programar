globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'crear-tablas',
    titulo: 'Crear tablas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Diseñar dónde se guardan los datos',
        texto: [
          'Con `CREATE TABLE` creas una tabla nueva. Entre paréntesis va cada columna con su nombre y su **tipo**: `INTEGER` (números enteros), `REAL` (números con decimales) o `TEXT` (textos).',
          '`PRIMARY KEY` marca la columna que identifica cada fila. Casi siempre es un `id`: no se repite y la base lo llena sola.',
          '`NOT NULL` significa que esa columna es obligatoria. Sin esa marca, la columna puede quedar vacía (aquí, el teléfono).',
          'Diseñar bien las tablas es de lo más valioso que se aprende en bases de datos: de eso depende que después sea fácil hacerles preguntas.',
        ],
        codigo: [
          'CREATE TABLE proveedores (',
          '  id INTEGER PRIMARY KEY,',
          '  nombre TEXT NOT NULL,',
          '  telefono TEXT,',
          '  ciudad TEXT NOT NULL',
          ');',
          '',
          'INSERT INTO proveedores (nombre, ciudad)',
          "VALUES ('Lácteos del Valle', 'Cali');",
          '',
          'SELECT * FROM proveedores;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Una tabla de categorías',
        texto: [
          'Crea una tabla llamada `categorias` con dos columnas: `id` (entero y clave de la tabla) y `nombre` (texto obligatorio).',
          'Después agrégale dos filas, `Comidas` y `Bebidas`, y muestra la tabla.',
        ],
        codigo: [
          '-- 1. Crea la tabla categorias',
          '',
          '-- 2. Agrega Comidas y Bebidas',
          '',
          '-- 3. Muestra la tabla',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La tabla categorias tiene las columnas id y nombre',
            condicion: 'consulta("PRAGMA table_info(categorias)").map((c) => c.name).join() === "id,nombre"',
          },
          {
            descripcion: 'id es la clave (PRIMARY KEY) y nombre es obligatorio (NOT NULL)',
            condicion:
              'consulta("PRAGMA table_info(categorias)").find((c) => c.name === "id").pk === 1 && consulta("PRAGMA table_info(categorias)").find((c) => c.name === "nombre").notnull === 1',
          },
          {
            descripcion: 'Tiene las filas Comidas y Bebidas',
            condicion: `consulta("SELECT COUNT(*) AS n FROM categorias WHERE nombre IN ('Comidas', 'Bebidas')")[0].n === 2 && consulta("SELECT COUNT(*) AS n FROM categorias")[0].n === 2`,
          },
          { descripcion: 'Muestras la tabla', condicion: 'filas.length === 2 && columnas.includes("nombre")' },
        ],
        pistas: [
          'La tabla: `CREATE TABLE categorias (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);`',
          'Las filas: `INSERT INTO categorias (nombre) VALUES (\'Comidas\'), (\'Bebidas\');`',
          'Y al final: `SELECT * FROM categorias;`',
        ],
        solucion: [
          'CREATE TABLE categorias (',
          '  id INTEGER PRIMARY KEY,',
          '  nombre TEXT NOT NULL',
          ');',
          '',
          "INSERT INTO categorias (nombre) VALUES ('Comidas'), ('Bebidas');",
          '',
          'SELECT * FROM categorias;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: las opiniones de los clientes',
        texto: [
          'Este reto recorre todo el camino: diseñar una tabla, llenarla y hacerle una pregunta junto con otra tabla.',
          '1. Crea la tabla `opiniones` con las columnas `id` (clave), `producto_id` (entero obligatorio), `estrellas` (entero obligatorio) y `comentario` (texto, puede quedar vacío).',
          '2. Agrega al menos 3 opiniones, y que por lo menos un producto tenga dos.',
          '3. Termina con una consulta que muestre el nombre de cada producto opinado (`productos.nombre`) y su `promedio` de estrellas. Necesitas `JOIN`, `AVG` y `GROUP BY`.',
        ],
        codigo: [
          '-- 1. Crea la tabla opiniones',
          '',
          '-- 2. Agrega al menos 3 opiniones',
          '',
          '-- 3. Nombre del producto y promedio de estrellas',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La tabla opiniones tiene las columnas id, producto_id, estrellas y comentario',
            condicion:
              'consulta("PRAGMA table_info(opiniones)").map((c) => c.name).join() === "id,producto_id,estrellas,comentario"',
          },
          {
            descripcion: 'producto_id y estrellas son obligatorios (NOT NULL)',
            condicion:
              'consulta("PRAGMA table_info(opiniones)").filter((c) => c.name === "producto_id" || c.name === "estrellas").every((c) => c.notnull === 1) && consulta("PRAGMA table_info(opiniones)").length === 4',
          },
          {
            descripcion: 'Hay al menos 3 opiniones y algún producto tiene dos o más',
            condicion:
              'consulta("SELECT COUNT(*) AS n FROM opiniones")[0].n >= 3 && consulta("SELECT COUNT(*) AS n FROM opiniones GROUP BY producto_id ORDER BY n DESC")[0].n >= 2',
          },
          { descripcion: 'Las columnas del resultado son nombre y promedio', condicion: 'columnas.join() === "nombre,promedio"' },
          {
            descripcion: 'Cada producto opinado aparece con su promedio de estrellas',
            condicion:
              'filas.length > 0 && mismasFilas("SELECT productos.nombre, AVG(opiniones.estrellas) FROM opiniones JOIN productos ON opiniones.producto_id = productos.id GROUP BY productos.id")',
          },
        ],
        pistas: [
          'La tabla: `CREATE TABLE opiniones (id INTEGER PRIMARY KEY, producto_id INTEGER NOT NULL, estrellas INTEGER NOT NULL, comentario TEXT);`',
          'Las filas: `INSERT INTO opiniones (producto_id, estrellas, comentario) VALUES (5, 5, \'Delicioso\'), (5, 4, \'Muy rico\'), (1, 3, \'Normal\');`',
          'La consulta: `SELECT productos.nombre, AVG(opiniones.estrellas) AS promedio FROM opiniones JOIN productos ON opiniones.producto_id = productos.id GROUP BY productos.nombre;`',
        ],
        solucion: [
          'CREATE TABLE opiniones (',
          '  id INTEGER PRIMARY KEY,',
          '  producto_id INTEGER NOT NULL,',
          '  estrellas INTEGER NOT NULL,',
          '  comentario TEXT',
          ');',
          '',
          'INSERT INTO opiniones (producto_id, estrellas, comentario)',
          'VALUES',
          "  (5, 5, 'Delicioso'),",
          "  (5, 4, 'Muy rico'),",
          "  (1, 3, 'Normal');",
          '',
          'SELECT productos.nombre, AVG(opiniones.estrellas) AS promedio',
          'FROM opiniones',
          'JOIN productos ON opiniones.producto_id = productos.id',
          'GROUP BY productos.nombre;',
        ].join('\n'),
      },
    ],
  }
);

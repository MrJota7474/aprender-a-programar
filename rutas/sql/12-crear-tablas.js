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
          'La tienda quiere anotar sus proveedores, pero no hay tabla para eso. Ejecuta el código: crea la tabla `proveedores`, le agrega una fila y la muestra.',
          'Con `CREATE TABLE` ("crear tabla") creas una tabla nueva. Entre paréntesis va cada columna con su nombre y su **tipo**: qué clase de dato guarda. `INTEGER` son números enteros, `REAL` números con decimales y `TEXT` textos.',
          '`PRIMARY KEY` ("clave principal") marca la columna que identifica cada fila. Casi siempre es un `id`: no se repite y la base lo llena sola.',
          '`NOT NULL` ("no vacío") significa que esa columna es obligatoria. Sin esa marca, la columna puede quedar vacía. Un dato vacío en SQL se llama `NULL`.',
          '**Ejemplo explicado línea por línea:** `id INTEGER PRIMARY KEY` es el número de cada proveedor. `nombre TEXT NOT NULL` es un texto obligatorio. `telefono TEXT` es opcional. Por eso el `INSERT` puede omitir el teléfono, y en la tabla aparece vacío.',
          'Diseñar bien las tablas es de lo más valioso que se aprende en bases de datos: de eso depende que después sea fácil hacerles preguntas.',
          '**Error común:** olvidar las comas entre columnas o poner una coma de más después de la última. Ambas cosas dan `syntax error`. Cada columna termina en coma, menos la última antes del `)`.',
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
          '-- TODO 1: CREATE TABLE categorias con id (INTEGER PRIMARY KEY)',
          '--         y nombre (TEXT NOT NULL)',
          '',
          '-- TODO 2: INSERT INTO categorias las filas Comidas y Bebidas',
          '',
          '-- TODO 3: muestra la tabla con SELECT',
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
          'Son tres instrucciones: crear, llenar y mostrar. Copia la forma del ejemplo de proveedores, con menos columnas.',
          'La tabla tiene dos columnas: `id INTEGER PRIMARY KEY` y `nombre TEXT NOT NULL`. Para las dos filas sirve un `INSERT` con dos paréntesis.',
          'Casi listo: `CREATE TABLE categorias (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);`, luego `INSERT INTO categorias (nombre) VALUES (\'Comidas\'), (...);` y `SELECT * FROM categorias;`',
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
          '-- TODO 1: crea la tabla opiniones (id, producto_id, estrellas, comentario)',
          '',
          '-- TODO 2: agrega al menos 3 opiniones; un mismo producto_id debe tener dos',
          '',
          '-- TODO 3: une opiniones con productos y muestra productos.nombre',
          '--         y AVG(estrellas) AS promedio, agrupando por producto',
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
          'Haz una parte a la vez y ejecuta después de cada una. La tabla es como la de proveedores; la consulta, como la de "los mejores clientes".',
          'La tabla: `CREATE TABLE opiniones (id INTEGER PRIMARY KEY, producto_id INTEGER NOT NULL, estrellas INTEGER NOT NULL, comentario TEXT);` Para las filas, un `INSERT` con varios paréntesis, como `(5, 5, \'Delicioso\'), (5, 4, \'Muy rico\'), ...`',
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

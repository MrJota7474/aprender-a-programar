globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'insertar',
    titulo: 'Agregar datos con INSERT',
    pasos: [
      {
        id: 'idea',
        titulo: 'Filas nuevas',
        texto: [
          'La tienda empezó a vender pandebono. Ejecuta el código y busca la última fila de la tabla: ahí está el producto nuevo.',
          'Hasta ahora solo leíste datos. Con `INSERT INTO` ("insertar en") agregas filas nuevas a una tabla.',
          '**Ejemplo explicado línea por línea:** `INSERT INTO productos (nombre, categoria, precio, existencias)` dice en qué tabla y qué columnas vas a llenar. `VALUES (\'Pandebono\', \'Comidas\', 2000, 50)` da los valores **en el mismo orden**: el primer valor va a la primera columna, y así. El `SELECT` de abajo solo sirve para ver cómo quedó la tabla.',
          'No hace falta poner el `id`: es el número que identifica cada fila (se llama **clave**), y la base le asigna el siguiente número automáticamente.',
          'En esta página la base vuelve a su estado original cada vez que presionas Ejecutar, así que puedes practicar sin miedo a dañar nada.',
          '**Error común:** dar más o menos valores que columnas. Si nombras 4 columnas y das 3 valores, verás `3 values for 4 columns` (3 valores para 4 columnas). Cuenta las dos listas: deben tener el mismo largo y el mismo orden.',
        ],
        codigo: [
          'INSERT INTO productos (nombre, categoria, precio, existencias)',
          "VALUES ('Pandebono', 'Comidas', 2000, 50);",
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Una clienta nueva',
        texto: [
          'Agrega a la tabla `clientes` una clienta llamada `Mariana Peña`, de la ciudad `Pereira`.',
          'Deja el `SELECT` del final: así ves cómo quedó la tabla.',
        ],
        codigo: [
          '-- TODO: agrega con INSERT INTO a la clienta Mariana Peña, de Pereira',
          '--       (columnas nombre y ciudad; el id lo pone la base)',
          '',
          '',
          'SELECT * FROM clientes;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Ahora hay 7 clientes',
            condicion: 'consulta("SELECT COUNT(*) AS n FROM clientes")[0].n === 7',
          },
          {
            descripcion: 'Mariana Peña quedó registrada en Pereira',
            condicion: `consulta("SELECT ciudad FROM clientes WHERE nombre = 'Mariana Peña'")[0].ciudad === "Pereira"`,
          },
          { descripcion: 'Muestras la tabla con los 7 clientes', condicion: 'filas.length === 7' },
        ],
        pistas: [
          'Copia la forma del ejemplo, pero con la tabla `clientes` y solo dos columnas.',
          'Las columnas son `(nombre, ciudad)`. Los dos valores son textos y van entre comillas simples, en ese mismo orden.',
          'Casi listo: `INSERT INTO clientes (nombre, ciudad) VALUES (\'Mariana Peña\', ...);`',
        ],
        solucion: [
          'INSERT INTO clientes (nombre, ciudad)',
          "VALUES ('Mariana Peña', 'Pereira');",
          '',
          'SELECT * FROM clientes;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: dos productos de una vez',
        texto: [
          'Un solo `INSERT` puede agregar varias filas: después de `VALUES` van varios paréntesis separados por comas.',
          'Agrega estos dos productos con **una sola** instrucción `INSERT`: `Almojábana` (Comidas, 2500 pesos, 30 unidades) y `Avena` (Bebidas, 3000 pesos, 20 unidades).',
        ],
        codigo: [
          '-- TODO: un solo INSERT INTO productos con las 4 columnas',
          '--       y, después de VALUES, un paréntesis por producto separados por coma',
          '',
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Ahora hay 12 productos',
            condicion: 'consulta("SELECT COUNT(*) AS n FROM productos")[0].n === 12',
          },
          {
            descripcion: 'La Almojábana quedó en Comidas, a 2500 y con 30 unidades',
            condicion: `consulta("SELECT COUNT(*) AS n FROM productos WHERE nombre = 'Almojábana' AND categoria = 'Comidas' AND precio = 2500 AND existencias = 30")[0].n === 1`,
          },
          {
            descripcion: 'La Avena quedó en Bebidas, a 3000 y con 20 unidades',
            condicion: `consulta("SELECT COUNT(*) AS n FROM productos WHERE nombre = 'Avena' AND categoria = 'Bebidas' AND precio = 3000 AND existencias = 20")[0].n === 1`,
          },
          {
            descripcion: 'Usas una sola instrucción INSERT',
            condicion: '(codigo.match(/\\bINSERT\\b/g) || []).length === 1',
          },
        ],
        pistas: [
          'Las columnas son `(nombre, categoria, precio, existencias)`.',
          'Después de `VALUES` va un paréntesis por producto, separados por una coma.',
          '`VALUES (\'Almojábana\', \'Comidas\', 2500, 30), (\'Avena\', \'Bebidas\', 3000, 20);`',
        ],
        solucion: [
          'INSERT INTO productos (nombre, categoria, precio, existencias)',
          'VALUES',
          "  ('Almojábana', 'Comidas', 2500, 30),",
          "  ('Avena', 'Bebidas', 3000, 20);",
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
      },
    ],
  }
);

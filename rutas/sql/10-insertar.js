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
          'Hasta ahora solo leíste datos. Con `INSERT INTO` agregas filas nuevas a una tabla.',
          'Primero van las columnas entre paréntesis y después, con `VALUES`, los valores **en el mismo orden**.',
          'No hace falta poner el `id`: como es la clave de la tabla, la base le asigna el siguiente número.',
          'En esta página la base vuelve a su estado original cada vez que presionas Ejecutar, así que puedes practicar sin miedo a dañar nada.',
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
        codigo: ['-- Agrega aquí a la clienta nueva', '', '', 'SELECT * FROM clientes;'].join('\n'),
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
          'La forma es `INSERT INTO clientes (nombre, ciudad) VALUES (..., ...);`',
          'Los dos valores son textos, van entre comillas simples.',
          '`INSERT INTO clientes (nombre, ciudad) VALUES (\'Mariana Peña\', \'Pereira\');`',
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
        codigo: ['-- Agrega aquí los dos productos', '', '', 'SELECT * FROM productos;'].join('\n'),
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

globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'calcular',
    titulo: 'Calcular columnas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cuentas, alias y valores sin repetir',
        texto: [
          'En el `SELECT` también puedes hacer cuentas con las columnas: `+`, `-`, `*` y `/`. El resultado aparece como una columna nueva.',
          'Con `AS` le pones nombre a esa columna. A ese nombre se le llama **alias**.',
          '`DISTINCT` quita las filas repetidas: sirve para ver qué valores diferentes hay en una columna.',
        ],
        codigo: [
          'SELECT nombre, precio, precio * 2 AS precio_de_dos',
          'FROM productos;',
          '',
          'SELECT DISTINCT categoria',
          'FROM productos;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El valor del inventario',
        texto: [
          'Muestra el `nombre` de cada producto y cuánto vale todo lo que hay de él en la tienda: el precio multiplicado por las existencias.',
          'Esa columna calculada debe llamarse `valor_inventario`.',
        ],
        codigo: ['SELECT nombre', 'FROM productos;', '', '-- Agrega la columna calculada'].join('\n'),
        pruebas: [
          {
            descripcion: 'Las columnas son nombre y valor_inventario',
            condicion: 'columnas.join() === "nombre,valor_inventario"',
          },
          {
            descripcion: 'El valor es precio por existencias',
            condicion: 'mismasFilas("SELECT nombre, precio * existencias FROM productos")',
          },
        ],
        pistas: [
          'La cuenta es `precio * existencias` y va en el `SELECT`, después de una coma.',
          'El nombre se pone con `AS valor_inventario` justo después de la cuenta.',
          '`SELECT nombre, precio * existencias AS valor_inventario`',
        ],
        solucion: ['SELECT nombre, precio * existencias AS valor_inventario', 'FROM productos;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿en qué ciudades hay clientes?',
        texto: [
          'Muestra las ciudades donde hay clientes, **sin repetir** ninguna y en orden alfabético.',
        ],
        codigo: ['SELECT ciudad', 'FROM clientes;'].join('\n'),
        pruebas: [
          {
            descripcion: 'Cada ciudad aparece una sola vez, en orden alfabético',
            condicion: 'igualA("SELECT DISTINCT ciudad FROM clientes ORDER BY ciudad")',
          },
          { descripcion: 'Usas DISTINCT', condicion: '/\\bDISTINCT\\b/.test(codigo)' },
        ],
        pistas: [
          '`DISTINCT` va justo después de `SELECT`.',
          'Para el orden alfabético agrega `ORDER BY ciudad` al final.',
          '`SELECT DISTINCT ciudad FROM clientes ORDER BY ciudad;`',
        ],
        solucion: ['SELECT DISTINCT ciudad', 'FROM clientes', 'ORDER BY ciudad;'].join('\n'),
      },
    ],
  }
);

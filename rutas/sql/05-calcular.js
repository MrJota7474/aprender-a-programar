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
          '¿Cuánto pagas si compras dos de cada producto? No hace falta sacar la calculadora: ejecuta el código y mira la columna `precio_de_dos`.',
          'En el `SELECT` puedes hacer cuentas con las columnas: `+`, `-`, `*` y `/`. SQL hace la cuenta en cada fila y el resultado aparece como una **columna calculada**: una columna nueva que no está guardada en la tabla.',
          'Con `AS` ("como") le pones nombre a esa columna. A ese nombre se le llama **alias**. Sin alias, la columna se llamaría `precio * 2`, que es difícil de leer.',
          '**Ejemplo explicado:** `precio * 2 AS precio_de_dos` significa "multiplica el precio de cada fila por 2 y llama a esa columna precio_de_dos".',
          '`DISTINCT` ("distinto") va justo después de `SELECT` y quita las filas repetidas. Sirve para ver qué valores diferentes hay en una columna: las 10 filas de productos tienen solo unas pocas categorías.',
          '**Error común:** poner espacios en el alias. `AS precio de dos` da `syntax error`: un alias es un solo nombre. Une las palabras con guion bajo, como en Python: `precio_de_dos`.',
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
        codigo: [
          'SELECT nombre',
          'FROM productos;',
          '',
          '-- TODO: en el SELECT, después de nombre y una coma, agrega la cuenta',
          '--       precio por existencias con el alias valor_inventario',
        ].join('\n'),
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
          'Fíjate en `precio * 2 AS precio_de_dos` del ejemplo: aquí es igual, pero multiplicando por otra columna.',
          'La cuenta es `precio * existencias` y el nombre se pone con `AS` justo después.',
          'Casi listo: `SELECT nombre, precio * existencias AS ...`',
        ],
        solucion: ['SELECT nombre, precio * existencias AS valor_inventario', 'FROM productos;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿en qué ciudades hay clientes?',
        texto: [
          'Muestra las ciudades donde hay clientes, **sin repetir** ninguna y en orden alfabético.',
        ],
        codigo: [
          '-- TODO: agrega DISTINCT para no repetir ciudades',
          '-- TODO: agrega ORDER BY para el orden alfabético',
          'SELECT ciudad',
          'FROM clientes;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Cada ciudad aparece una sola vez, en orden alfabético',
            condicion: 'igualA("SELECT DISTINCT ciudad FROM clientes ORDER BY ciudad")',
          },
          { descripcion: 'Usas DISTINCT', condicion: '/\\bDISTINCT\\b/.test(codigo)' },
        ],
        pistas: [
          'Ejecuta primero la consulta tal como está: verás ciudades repetidas y en desorden. Hay que arreglar las dos cosas.',
          '`DISTINCT` va justo después de `SELECT`, y `ORDER BY ciudad` va al final, antes del punto y coma.',
          'Casi listo: `SELECT DISTINCT ciudad FROM clientes ORDER BY ...;`',
        ],
        solucion: ['SELECT DISTINCT ciudad', 'FROM clientes', 'ORDER BY ciudad;'].join('\n'),
      },
    ],
  }
);

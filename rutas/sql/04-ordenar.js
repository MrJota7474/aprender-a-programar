globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'ordenar',
    titulo: 'Ordenar y limitar',
    pasos: [
      {
        id: 'idea',
        titulo: 'ORDER BY y LIMIT',
        texto: [
          'Una tabla no tiene un orden garantizado. Si lo necesitas, lo pides con `ORDER BY` y la columna.',
          'El orden normal es de menor a mayor (o de la A a la Z). Con `DESC` al final va al revés.',
          '`LIMIT` corta el resultado: `LIMIT 3` deja solo las primeras 3 filas. Juntos sirven para preguntas como "los 3 más baratos".',
          'El orden de las partes siempre es: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`.',
        ],
        codigo: [
          'SELECT nombre, precio',
          'FROM productos',
          'ORDER BY precio DESC;',
          '',
          'SELECT nombre, precio',
          'FROM productos',
          'ORDER BY precio',
          'LIMIT 3;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Clientes en orden alfabético',
        texto: ['Muestra el `nombre` y la `ciudad` de los clientes, ordenados por nombre de la A a la Z.'],
        codigo: ['SELECT nombre, ciudad', 'FROM clientes;', '', '-- Agrega el orden'].join('\n'),
        pruebas: [
          {
            descripcion: 'Los clientes salen en orden alfabético',
            condicion: 'igualA("SELECT nombre, ciudad FROM clientes ORDER BY nombre")',
          },
          { descripcion: 'Usas ORDER BY', condicion: '/\\bORDER\\s+BY\\b/.test(codigo)' },
        ],
        pistas: [
          'El `ORDER BY` va después del `FROM`.',
          'Se ordena por la columna `nombre`.',
          'La última línea queda: `ORDER BY nombre;`',
        ],
        solucion: ['SELECT nombre, ciudad', 'FROM clientes', 'ORDER BY nombre;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los tres con más existencias',
        texto: [
          'Muestra el `nombre` y las `existencias` de los **3 productos** con más unidades, del que más tiene al que menos.',
        ],
        codigo: '-- Los 3 productos con más existencias\n',
        pruebas: [
          { descripcion: 'El resultado tiene exactamente 3 filas', condicion: 'filas.length === 3' },
          {
            descripcion: 'Son los 3 con más existencias, de mayor a menor',
            condicion: 'igualA("SELECT nombre, existencias FROM productos ORDER BY existencias DESC LIMIT 3")',
          },
        ],
        pistas: [
          'Ordena por `existencias` de mayor a menor: eso es `DESC`.',
          'Después del orden, corta con `LIMIT 3`.',
          '`ORDER BY existencias DESC` y en la siguiente línea `LIMIT 3;`',
        ],
        solucion: ['SELECT nombre, existencias', 'FROM productos', 'ORDER BY existencias DESC', 'LIMIT 3;'].join('\n'),
      },
    ],
  }
);

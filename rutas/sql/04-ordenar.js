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
          '¿Cuáles son los 3 productos más baratos? Ejecuta el código: la segunda tabla responde justo eso.',
          'Una tabla no tiene un orden garantizado: las filas pueden salir en cualquier orden. Si lo necesitas, lo pides con `ORDER BY` ("ordenar por") y la columna.',
          'El orden normal es de menor a mayor (o de la A a la Z). Se llama **ascendente**. Con `DESC` (de **descendente**) al final, va al revés: de mayor a menor.',
          '`LIMIT` corta el resultado: `LIMIT 3` deja solo las primeras 3 filas.',
          '**Ejemplo explicado línea por línea:** en la segunda consulta, `ORDER BY precio` pone primero el más barato. Después, `LIMIT 3` se queda con las 3 primeras filas. Juntos responden "los 3 más baratos".',
          'El orden de las partes siempre es: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`.',
          '**Error común:** poner las partes en otro orden, como `LIMIT 3` antes de `ORDER BY`. SQL responde `near "ORDER": syntax error` (error de escritura cerca de ORDER). Sigue siempre el orden de arriba.',
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
        codigo: [
          'SELECT nombre, ciudad',
          'FROM clientes;',
          '',
          '-- TODO: agrega ORDER BY con la columna nombre (antes del punto y coma)',
        ].join('\n'),
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
        codigo: [
          '-- TODO: muestra nombre y existencias de productos',
          '-- TODO: ordena por existencias de mayor a menor',
          '-- TODO: deja solo las 3 primeras filas',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El resultado tiene exactamente 3 filas', condicion: 'filas.length === 3' },
          { descripcion: 'Usas ORDER BY y LIMIT', condicion: '/\\bORDER\\s+BY\\b/.test(codigo) && /\\bLIMIT\\b/.test(codigo)' },
          {
            descripcion: 'Son los 3 con más existencias, de mayor a menor',
            condicion: 'igualA("SELECT nombre, existencias FROM productos ORDER BY existencias DESC LIMIT 3")',
          },
        ],
        pistas: [
          'Es como "los 3 más baratos" del ejemplo, pero con otra columna y al revés.',
          'Ordena por `existencias` con `DESC` (de mayor a menor) y después corta con `LIMIT`.',
          'Casi listo: `SELECT nombre, existencias FROM productos ORDER BY existencias DESC LIMIT ...;`',
        ],
        solucion: ['SELECT nombre, existencias', 'FROM productos', 'ORDER BY existencias DESC', 'LIMIT 3;'].join('\n'),
      },
    ],
  }
);

globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'resumir',
    titulo: 'Resumir datos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Contar, sumar y promediar',
        texto: [
          'Las **funciones de resumen** toman muchas filas y devuelven un solo valor.',
          '`COUNT(*)` cuenta filas. `SUM()` suma, `AVG()` saca el promedio, y `MIN()` y `MAX()` dan el menor y el mayor valor de una columna.',
          'Se combinan con `WHERE`: primero se filtran las filas y después se resume lo que quedó.',
          'Con datos como estos se responden las preguntas de un negocio: cuánto se vendió, cuál es el precio promedio, cuántos clientes hay.',
        ],
        codigo: [
          'SELECT COUNT(*) AS cuantos',
          'FROM productos;',
          '',
          'SELECT MIN(precio) AS mas_barato, MAX(precio) AS mas_caro, AVG(precio) AS promedio',
          'FROM productos;',
          '',
          'SELECT SUM(existencias) AS unidades',
          'FROM productos',
          "WHERE categoria = 'Bebidas';",
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Cuántos clientes hay?',
        texto: [
          'Cuenta cuántos clientes tiene la tienda.',
          'El resultado debe ser una sola fila con una columna llamada `total`.',
        ],
        codigo: '-- Cuenta los clientes\n',
        pruebas: [
          {
            descripcion: 'El resultado es una sola fila con el número 6',
            condicion: 'filas.length === 1 && filas[0][0] === 6',
          },
          { descripcion: 'La columna se llama total', condicion: 'columnas[0] === "total"' },
          { descripcion: 'Usas COUNT', condicion: '/\\bCOUNT\\s*\\(/.test(codigo)' },
        ],
        pistas: [
          'Para contar filas se usa `COUNT(*)`.',
          'El nombre de la columna se pone con `AS total`.',
          '`SELECT COUNT(*) AS total FROM clientes;`',
        ],
        solucion: ['SELECT COUNT(*) AS total', 'FROM clientes;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el precio promedio de las comidas',
        texto: [
          'Calcula el precio promedio de los productos de la categoría `Comidas`.',
          'El resultado debe ser una sola fila con una columna llamada `promedio`.',
        ],
        codigo: '-- Precio promedio de las Comidas\n',
        pruebas: [
          {
            descripcion: 'El promedio es el de los productos de Comidas',
            condicion: `filas.length === 1 && igualA("SELECT AVG(precio) FROM productos WHERE categoria = 'Comidas'")`,
          },
          { descripcion: 'La columna se llama promedio', condicion: 'columnas[0] === "promedio"' },
          { descripcion: 'Usas AVG', condicion: '/\\bAVG\\s*\\(/.test(codigo)' },
        ],
        pistas: [
          'El promedio de una columna es `AVG(precio)`.',
          'Filtra antes de resumir: `WHERE categoria = \'Comidas\'`',
          '`SELECT AVG(precio) AS promedio FROM productos WHERE categoria = \'Comidas\';`',
        ],
        solucion: ['SELECT AVG(precio) AS promedio', 'FROM productos', "WHERE categoria = 'Comidas';"].join('\n'),
      },
    ],
  }
);

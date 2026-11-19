globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'condiciones',
    titulo: 'Varias condiciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'AND, OR y LIKE',
        texto: [
          'Con `AND` ("y") las dos condiciones deben cumplirse. Con `OR` ("o") basta con una.',
          '`LIKE` busca textos por un pedazo: el `%` es un comodín que significa "cualquier cosa". Así, `\'B%\'` son los textos que empiezan por B.',
          'Cuando mezcles `AND` y `OR`, usa paréntesis para dejar claro qué va junto, igual que en matemáticas.',
        ],
        codigo: [
          'SELECT nombre, categoria, precio',
          'FROM productos',
          "WHERE categoria = 'Comidas' AND precio < 3000;",
          '',
          'SELECT nombre, ciudad',
          'FROM clientes',
          "WHERE ciudad = 'Cali' OR ciudad = 'Barranquilla';",
          '',
          'SELECT nombre',
          'FROM productos',
          "WHERE nombre LIKE 'B%';",
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Bebidas económicas',
        texto: [
          'Muestra el `nombre` y el `precio` de los productos que son de la categoría `Bebidas` **y** cuestan 2500 o menos.',
        ],
        codigo: ['SELECT nombre, precio', 'FROM productos;', '', '-- Agrega las dos condiciones'].join('\n'),
        pruebas: [
          {
            descripcion: 'Aparecen solo las bebidas de 2500 o menos',
            condicion: `mismasFilas("SELECT nombre, precio FROM productos WHERE categoria = 'Bebidas' AND precio <= 2500")`,
          },
          { descripcion: 'Usas AND', condicion: '/\\bAND\\b/.test(codigo)' },
        ],
        pistas: [
          'Son dos condiciones unidas con `AND`, después de `WHERE`.',
          'La primera es `categoria = \'Bebidas\'` y la segunda `precio <= 2500`.',
          '`WHERE categoria = \'Bebidas\' AND precio <= 2500`',
        ],
        solucion: [
          'SELECT nombre, precio',
          'FROM productos',
          "WHERE categoria = 'Bebidas' AND precio <= 2500;",
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: dulces y mercado disponibles',
        texto: [
          'Muestra el `nombre` y la `categoria` de los productos que son de `Dulces` **o** de `Mercado`, y que además **sí tienen existencias** (más de 0).',
          'Aquí los paréntesis importan: primero va "Dulces o Mercado" entre paréntesis, y después el `AND`. Sin ellos se cuela un producto agotado.',
        ],
        codigo: '-- Dulces o Mercado, pero solo los que tienen existencias\n',
        pruebas: [
          {
            descripcion: 'Aparecen los productos correctos',
            condicion: `mismasFilas("SELECT nombre, categoria FROM productos WHERE categoria IN ('Dulces', 'Mercado') AND existencias > 0")`,
          },
          {
            descripcion: 'No aparece el Bocadillo veleño (está agotado)',
            condicion: 'filas.length > 0 && !tabla.some((fila) => fila.nombre === "Bocadillo veleño")',
          },
        ],
        pistas: [
          'La parte del "o" va entre paréntesis: `(categoria = \'Dulces\' OR categoria = \'Mercado\')`',
          'Después del paréntesis agrega `AND existencias > 0`',
          '`WHERE (categoria = \'Dulces\' OR categoria = \'Mercado\') AND existencias > 0`',
        ],
        solucion: [
          'SELECT nombre, categoria',
          'FROM productos',
          "WHERE (categoria = 'Dulces' OR categoria = 'Mercado') AND existencias > 0;",
        ].join('\n'),
      },
    ],
  }
);

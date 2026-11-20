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
          'Quieres las comidas **y** que además sean baratas. O los clientes de Cali **o** de Barranquilla. Una sola condición no alcanza: hay que unir dos.',
          'Con `AND` ("y") las dos condiciones deben cumplirse. Con `OR` ("o") basta con una. Es igual que `and` y `or` en Python.',
          '**Ejemplo explicado:** `WHERE categoria = \'Comidas\' AND precio < 3000` deja una fila solo si es comida y además cuesta menos de 3000. En cambio, `WHERE ciudad = \'Cali\' OR ciudad = \'Barranquilla\'` deja la fila si cumple cualquiera de las dos.',
          '`LIKE` busca textos por un pedazo. El `%` es un **comodín**: significa "cualquier cosa, o nada". Así, `\'B%\'` son los textos que empiezan por B, y `\'%queso%\'` los que tienen la palabra queso en cualquier parte.',
          'Cuando mezcles `AND` y `OR`, usa paréntesis para dejar claro qué va junto, igual que en matemáticas.',
          '**Error común:** escribir `WHERE ciudad = \'Cali\' OR \'Barranquilla\'`. En español suena bien, pero SQL necesita la comparación completa a cada lado del `OR`: `ciudad = \'Cali\' OR ciudad = \'Barranquilla\'`. La versión corta no da error, pero trae filas equivocadas.',
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
        codigo: [
          'SELECT nombre, precio',
          'FROM productos;',
          '',
          '-- TODO: agrega un WHERE con dos condiciones unidas con AND:',
          "--       la categoría es 'Bebidas' y el precio es 2500 o menos",
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Aparecen solo las bebidas de 2500 o menos',
            condicion: `mismasFilas("SELECT nombre, precio FROM productos WHERE categoria = 'Bebidas' AND precio <= 2500")`,
          },
          {
            descripcion: 'Unes con AND una condición de categoría y otra de precio',
            condicion: '/\\bAND\\b/.test(codigo) && /\\bCATEGORIA\\s*=/.test(codigo) && /\\bPRECIO\\s*(<=|<)/.test(codigo)',
          },
        ],
        pistas: [
          'Son dos condiciones unidas con `AND`, después de `WHERE`. Recuerda mover el punto y coma al final.',
          'La primera compara la categoría con el texto `\'Bebidas\'`. La segunda usa `<=` para "2500 o menos".',
          'Casi listo: `WHERE categoria = \'Bebidas\' AND precio ... 2500;`',
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
        codigo: [
          '-- TODO: muestra nombre y categoria de productos',
          "-- TODO: con WHERE, deja los de 'Dulces' o 'Mercado' (entre paréntesis)",
          '--       y además (AND) los que tienen existencias mayores que 0',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Aparecen los dulces y productos de mercado que tienen existencias',
            condicion: `mismasFilas("SELECT nombre, categoria FROM productos WHERE categoria IN ('Dulces', 'Mercado') AND existencias > 0")`,
          },
          {
            descripcion: 'No aparece el Bocadillo veleño (está agotado)',
            condicion: 'filas.length > 0 && !tabla.some((fila) => fila.nombre === "Bocadillo veleño")',
          },
          {
            descripcion: 'Filtras por las existencias, no por nombres escritos a mano',
            condicion: '/\\bEXISTENCIAS\\s*(>|>=|<>)/.test(codigo) && !/\\bNOMBRE\\s*(=|IN\\b)/.test(codigo)',
          },
        ],
        pistas: [
          'Piensa en dos partes: "Dulces o Mercado" y "tiene existencias". La primera va entre paréntesis.',
          'Dentro del paréntesis usa `OR` con la comparación completa a cada lado. Fuera, `AND existencias > 0`.',
          'Casi listo: `WHERE (categoria = \'Dulces\' OR categoria = ...) AND existencias > 0;`',
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

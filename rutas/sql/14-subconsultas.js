globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'subconsultas',
    titulo: 'Subconsultas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Una consulta dentro de otra',
        texto: [
          'A veces para responder una pregunta primero hay que responder otra. "¿Qué productos cuestan más que el promedio?" necesita saber cuánto es el promedio.',
          'Una **subconsulta** es un `SELECT` escrito entre paréntesis dentro de otra consulta. SQL resuelve primero la de adentro y usa su resultado en la de afuera.',
          'Cuando la subconsulta devuelve un solo valor (como un `AVG`), se compara con `>`, `<` o `=`. Cuando devuelve una lista de valores, se usa `IN`: "está dentro de esta lista".',
          '**Ejemplo explicado:** SQL resuelve primero `(SELECT AVG(precio) FROM productos)` y obtiene un número, digamos 4000. Entonces la consulta de afuera queda como `WHERE precio < 4000` y deja los productos más baratos que el promedio.',
          '`IN` se usa así: `WHERE id IN (1, 3, 5)` deja las filas cuyo `id` sea 1, 3 o 5. Con una subconsulta, la lista la calcula SQL: `WHERE id IN (SELECT cliente_id FROM pedidos)`.',
          '**Error común:** comparar con `=` una subconsulta que devuelve varias filas. `WHERE id = (SELECT cliente_id FROM pedidos)` no da error en SQLite, pero solo usa el primer valor de la lista y el resultado sale incompleto. Si la subconsulta puede traer varios valores, usa `IN`.',
        ],
        codigo: [
          'SELECT nombre, precio',
          'FROM productos',
          'WHERE precio < (SELECT AVG(precio) FROM productos);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Los productos más caros que el promedio',
        texto: [
          'Muestra el `nombre` y el `precio` de los productos que cuestan **más** que el precio promedio de todos los productos.',
          'Usa una subconsulta con `AVG` dentro del `WHERE`.',
        ],
        codigo: [
          '-- TODO: muestra nombre y precio de productos',
          '-- TODO: en el WHERE, compara precio con > contra una subconsulta',
          '--       entre paréntesis que calcule AVG(precio)',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Usas una subconsulta (un SELECT entre paréntesis)', condicion: '/\\(\\s*SELECT\\b/.test(codigo)' },
          { descripcion: 'La subconsulta calcula el promedio con AVG', condicion: '/\\(\\s*SELECT\\s+AVG\\b/.test(codigo)' },
          {
            descripcion: 'Muestras nombre y precio de los productos por encima del promedio',
            condicion:
              'mismasFilas("SELECT nombre, precio FROM productos WHERE precio > (SELECT AVG(precio) FROM productos)")',
          },
        ],
        pistas: [
          'Es la consulta del ejemplo, con el comparador al revés.',
          'El promedio se calcula con `SELECT AVG(precio) FROM productos`, y va entre paréntesis después del `>`.',
          'Casi listo: `SELECT nombre, precio FROM productos WHERE precio > (SELECT ...);`',
        ],
        solucion: [
          'SELECT nombre, precio',
          'FROM productos',
          'WHERE precio > (SELECT AVG(precio) FROM productos);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: quién ha pedido bebidas',
        texto: [
          'Don Pepe quiere saber qué clientes han pedido algún producto de la categoría `Bebidas`.',
          'Muestra solo el `nombre` de esos clientes, sin repetir ninguno. Con `IN` y subconsultas se resuelve en tres pasos: primero los productos de la categoría, luego los pedidos de esos productos y por último los clientes de esos pedidos.',
          'También vale resolverlo con `JOIN` y `DISTINCT`.',
        ],
        codigo: [
          "-- TODO paso 1 (lo de más adentro): los id de productos de categoría 'Bebidas'",
          '-- TODO paso 2: los cliente_id de pedidos cuyo producto_id está IN (paso 1)',
          '-- TODO paso 3: el nombre de clientes cuyo id está IN (paso 2)',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La consulta busca por la categoría Bebidas, no por nombres escritos a mano',
            condicion: "/'BEBIDAS'/.test(codigo) && !/\\bNOMBRE\\s*(=|IN\\b)/.test(codigo)",
          },
          {
            descripcion: 'Muestras solo el nombre de los clientes que han pedido bebidas, sin repetir',
            condicion: `mismasFilas("SELECT nombre FROM clientes WHERE id IN (SELECT cliente_id FROM pedidos WHERE producto_id IN (SELECT id FROM productos WHERE categoria = 'Bebidas'))")`,
          },
          { descripcion: 'La consulta devuelve 3 clientes', condicion: 'filas.length === 3 && columnas.length === 1' },
        ],
        pistas: [
          'Empieza por adentro: `SELECT id FROM productos WHERE categoria = \'Bebidas\'` da los productos de bebidas.',
          'Con esa lista: `SELECT cliente_id FROM pedidos WHERE producto_id IN (...)` da los clientes que los pidieron.',
          'Al final: `SELECT nombre FROM clientes WHERE id IN (...)`. Si prefieres `JOIN`, recuerda `SELECT DISTINCT` para no repetir a Laura.',
        ],
        solucion: [
          'SELECT nombre',
          'FROM clientes',
          'WHERE id IN (',
          '  SELECT cliente_id',
          '  FROM pedidos',
          '  WHERE producto_id IN (',
          "    SELECT id FROM productos WHERE categoria = 'Bebidas'",
          '  )',
          ');',
        ].join('\n'),
      },
    ],
  }
);

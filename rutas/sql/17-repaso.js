globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'repaso',
    titulo: 'Repaso: retos mezclados',
    pasos: [
      {
        id: 'reto-1',
        etiqueta: 'Reto 1',
        titulo: 'Las categorías que más se venden',
        texto: [
          'Don Pepe quiere saber qué categorías de productos le funcionan mejor. Junta `JOIN`, `GROUP BY` y `HAVING`.',
          'Muestra la `categoria` y la suma de unidades vendidas (`SUM(pedidos.cantidad)`) de las categorías que han vendido **5 unidades o más**.',
          'Ordénalas de la que más vendió a la que menos.',
        ],
        codigo: '-- Categorías con 5 o más unidades vendidas, de mayor a menor\n',
        pruebas: [
          { descripcion: 'Usas GROUP BY y HAVING', condicion: '/\\bGROUP\\s+BY\\b/.test(codigo) && /\\bHAVING\\b/.test(codigo)' },
          {
            descripcion: 'Aparecen las categorías con 5 o más unidades, con su total, de mayor a menor',
            condicion:
              'igualA("SELECT productos.categoria, SUM(pedidos.cantidad) AS unidades FROM pedidos JOIN productos ON pedidos.producto_id = productos.id GROUP BY productos.categoria HAVING SUM(pedidos.cantidad) >= 5 ORDER BY unidades DESC")',
          },
        ],
        pistas: [
          'Une `pedidos` con `productos` para llegar a la categoría y agrupa con `GROUP BY productos.categoria`.',
          '`HAVING` filtra los grupos ya sumados (`WHERE` filtra filas antes de agrupar): `HAVING SUM(pedidos.cantidad) >= 5`.',
          'Termina con `ORDER BY` sobre la suma, de mayor a menor (`DESC`).',
        ],
        solucion: [
          'SELECT productos.categoria, SUM(pedidos.cantidad) AS unidades',
          'FROM pedidos',
          'JOIN productos ON pedidos.producto_id = productos.id',
          'GROUP BY productos.categoria',
          'HAVING SUM(pedidos.cantidad) >= 5',
          'ORDER BY unidades DESC;',
        ].join('\n'),
      },
      {
        id: 'reto-2',
        etiqueta: 'Reto 2',
        titulo: 'Los pedidos grandes',
        texto: [
          'Un pedido "grande" es el que vale más que el valor promedio de todos los pedidos. El valor de un pedido es su cantidad por el precio del producto.',
          'Muestra, para cada pedido grande, el nombre del cliente, el nombre del producto y el valor del pedido. Necesitas dos `JOIN` y una subconsulta con `AVG` en el `WHERE`.',
          'El orden de las filas no importa.',
        ],
        codigo: '-- Cliente, producto y valor de los pedidos por encima del promedio\n',
        pruebas: [
          { descripcion: 'Usas una subconsulta (un SELECT entre paréntesis)', condicion: '/\\(\\s*SELECT\\b/.test(codigo)' },
          { descripcion: 'La subconsulta calcula el promedio con AVG', condicion: '/\\(\\s*SELECT\\s+AVG\\b/.test(codigo)' },
          {
            descripcion: 'Aparecen solo los pedidos que valen más que el promedio, con cliente, producto y valor',
            condicion:
              'mismasFilas("SELECT clientes.nombre, productos.nombre, pedidos.cantidad * productos.precio FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id JOIN productos ON pedidos.producto_id = productos.id WHERE pedidos.cantidad * productos.precio > (SELECT AVG(p.cantidad * pr.precio) FROM pedidos p JOIN productos pr ON p.producto_id = pr.id)")',
          },
        ],
        pistas: [
          'El promedio sale de otra consulta con `JOIN`: `SELECT AVG(p.cantidad * pr.precio) FROM pedidos p JOIN productos pr ON p.producto_id = pr.id`. Los alias `p` y `pr` evitan mezclarla con las tablas de afuera.',
          'En la consulta de afuera, une `pedidos`, `clientes` y `productos`, como en la lección 9.',
          'Compara en el `WHERE`: `pedidos.cantidad * productos.precio > (la subconsulta)`.',
        ],
        solucion: [
          'SELECT clientes.nombre AS cliente,',
          '       productos.nombre AS producto,',
          '       pedidos.cantidad * productos.precio AS total',
          'FROM pedidos',
          'JOIN clientes ON pedidos.cliente_id = clientes.id',
          'JOIN productos ON pedidos.producto_id = productos.id',
          'WHERE pedidos.cantidad * productos.precio > (',
          '  SELECT AVG(p.cantidad * pr.precio)',
          '  FROM pedidos p',
          '  JOIN productos pr ON p.producto_id = pr.id',
          ');',
        ].join('\n'),
      },
      {
        id: 'reto-3',
        etiqueta: 'Reto 3',
        titulo: 'Qué tan fiel es cada cliente',
        texto: [
          'Don Pepe quiere clasificar a todos sus clientes según lo que han gastado en total (cantidad por precio de todos sus pedidos):',
          '- `sin compras` si no han gastado nada.',
          '- `ocasional` si han gastado menos de 20000.',
          '- `fiel` si han gastado 20000 o más.',
          'Muestra el `nombre` y la clasificación de **los 6 clientes**. Piensa bien qué `JOIN` necesitas para que Andrés Mora no desaparezca, y usa `CASE`, `COALESCE` y `GROUP BY`.',
        ],
        codigo: '-- Nombre de cada cliente y su clasificación\n',
        pruebas: [
          { descripcion: 'Usas CASE y GROUP BY', condicion: '/\\bCASE\\b/.test(codigo) && /\\bGROUP\\s+BY\\b/.test(codigo)' },
          {
            descripcion: 'Aparecen los 6 clientes, cada uno con su clasificación',
            condicion: `mismasFilas("SELECT clientes.nombre, CASE WHEN COALESCE(SUM(pedidos.cantidad * productos.precio), 0) = 0 THEN 'sin compras' WHEN SUM(pedidos.cantidad * productos.precio) < 20000 THEN 'ocasional' ELSE 'fiel' END FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id LEFT JOIN productos ON pedidos.producto_id = productos.id GROUP BY clientes.id")`,
          },
        ],
        pistas: [
          'Parte de `FROM clientes LEFT JOIN pedidos ... LEFT JOIN productos ...`. Si el segundo es un `JOIN` normal, Andrés Mora se pierde.',
          'El gasto total es `COALESCE(SUM(pedidos.cantidad * productos.precio), 0)`; así Andrés queda en 0 y no en `NULL`.',
          'Con ese gasto resuelto: `CASE WHEN COALESCE(SUM(pedidos.cantidad * productos.precio), 0) = 0 THEN \'sin compras\' WHEN SUM(pedidos.cantidad * productos.precio) < 20000 THEN \'ocasional\' ELSE \'fiel\' END`, y cierra con `GROUP BY clientes.id`.',
        ],
        solucion: [
          'SELECT clientes.nombre,',
          '       CASE',
          '         WHEN COALESCE(SUM(pedidos.cantidad * productos.precio), 0) = 0 THEN \'sin compras\'',
          '         WHEN SUM(pedidos.cantidad * productos.precio) < 20000 THEN \'ocasional\'',
          '         ELSE \'fiel\'',
          '       END AS clasificacion',
          'FROM clientes',
          'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id',
          'LEFT JOIN productos ON pedidos.producto_id = productos.id',
          'GROUP BY clientes.id;',
        ].join('\n'),
      },
    ],
  }
);

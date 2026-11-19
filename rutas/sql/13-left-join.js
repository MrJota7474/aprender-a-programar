globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'left-join',
    titulo: 'LEFT JOIN y valores vacíos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Las filas que no tienen pareja',
        texto: [
          'El `JOIN` que ya conoces solo muestra las filas que tienen pareja en las dos tablas. Si Andrés Mora nunca ha hecho un pedido, con `JOIN` simplemente no aparece: es como si no existiera.',
          'Con `LEFT JOIN` salen **todas** las filas de la tabla de la izquierda (la que va después de `FROM`), tengan pareja o no. Cuando no hay pareja, las columnas de la otra tabla quedan en `NULL`.',
          '`NULL` significa "no hay dato", y no es lo mismo que `0` ni que un texto vacío. Por eso no se compara con `=`: se pregunta con `IS NULL` (está vacío) o `IS NOT NULL` (tiene algo).',
          'Si quieres mostrar otra cosa en vez de `NULL`, usa `COALESCE(valor, reemplazo)`: devuelve el primer valor que no sea `NULL`. Por ejemplo, `COALESCE(SUM(cantidad), 0)` muestra 0 en vez de vacío.',
          'Ejecuta la consulta y fíjate en la fila de Andrés Mora: su pedido y su fecha aparecen en `NULL`.',
        ],
        codigo: [
          'SELECT clientes.nombre, pedidos.id AS pedido, pedidos.fecha',
          'FROM clientes',
          'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id',
          'ORDER BY clientes.id;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Cuántos pedidos ha hecho cada cliente',
        texto: [
          'Muestra todos los clientes con la cantidad de pedidos que ha hecho cada uno: `clientes.nombre` y el número de pedidos. Andrés Mora debe aparecer con 0.',
          'Cuidado con una trampa: `COUNT(*)` cuenta filas, y Andrés tiene una fila (con pedido vacío). Cuenta mejor una columna de la tabla `pedidos`, como `COUNT(pedidos.id)`, que ignora los `NULL`.',
        ],
        codigo: '-- Cada cliente con su cantidad de pedidos (Andrés con 0)\n',
        pruebas: [
          { descripcion: 'Usas LEFT JOIN', condicion: '/\\bLEFT\\s+(OUTER\\s+)?JOIN\\b/.test(codigo)' },
          {
            descripcion: 'Aparecen los 6 clientes, cada uno con su cantidad de pedidos',
            condicion:
              'mismasFilas("SELECT clientes.nombre, COUNT(pedidos.id) FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id GROUP BY clientes.id")',
          },
          {
            descripcion: 'Andrés Mora aparece con 0 pedidos',
            condicion: 'filas.some((fila) => fila[0] === "Andrés Mora" && fila[1] === 0)',
          },
        ],
        pistas: [
          'Parte de `FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id`. Los clientes van a la izquierda porque son los que deben salir todos.',
          'Agrupa por cliente con `GROUP BY clientes.id` (o `clientes.nombre`) y cuenta con `COUNT(pedidos.id)`.',
          'La consulta completa: `SELECT clientes.nombre, COUNT(pedidos.id) AS cantidad FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id GROUP BY clientes.id;`',
        ],
        solucion: [
          'SELECT clientes.nombre, COUNT(pedidos.id) AS cantidad',
          'FROM clientes',
          'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id',
          'GROUP BY clientes.id;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los clientes que nunca han comprado',
        texto: [
          'Don Pepe quiere escribirles a los clientes que nunca han hecho un pedido para invitarlos a volver.',
          'Muestra solo el `nombre` de esos clientes. Usa un `LEFT JOIN` y, en el `WHERE`, quédate con las filas donde la pareja quedó vacía (`IS NULL`).',
        ],
        codigo: '-- Nombre de los clientes sin pedidos\n',
        pruebas: [
          { descripcion: 'Usas LEFT JOIN', condicion: '/\\bLEFT\\s+(OUTER\\s+)?JOIN\\b/.test(codigo)' },
          { descripcion: 'Usas IS NULL', condicion: '/\\bIS\\s+NULL\\b/.test(codigo)' },
          {
            descripcion: 'Muestras solo el nombre de los clientes sin pedidos',
            condicion:
              'mismasFilas("SELECT nombre FROM clientes WHERE id NOT IN (SELECT cliente_id FROM pedidos)")',
          },
          {
            descripcion: 'El resultado es Andrés Mora',
            condicion: 'filas.length === 1 && filas[0][0] === "Andrés Mora"',
          },
        ],
        pistas: [
          'Une igual que en el paso anterior: `FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id`.',
          'Los clientes sin pedidos son los que tienen `pedidos.id` vacío: `WHERE pedidos.id IS NULL`.',
          'La consulta completa: `SELECT clientes.nombre FROM clientes LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id WHERE pedidos.id IS NULL;`',
        ],
        solucion: [
          'SELECT clientes.nombre',
          'FROM clientes',
          'LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id',
          'WHERE pedidos.id IS NULL;',
        ].join('\n'),
      },
    ],
  }
);

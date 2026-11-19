globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'actualizar-borrar',
    titulo: 'Cambiar y borrar datos',
    pasos: [
      {
        id: 'idea',
        titulo: 'UPDATE y DELETE',
        texto: [
          '`UPDATE` cambia datos que ya existen: con `SET` dices qué columna y qué valor nuevo, y con `WHERE` a cuáles filas.',
          '`DELETE FROM` borra filas completas, también según un `WHERE`.',
          '**Lo más importante de esta lección:** un `UPDATE` o un `DELETE` sin `WHERE` afecta a TODAS las filas de la tabla. En una base real eso puede significar perder los datos de un negocio. Aquí no pasa nada porque la base se reinicia, así que es el mejor lugar para acostumbrarte a escribir siempre el `WHERE`.',
        ],
        codigo: [
          'UPDATE productos',
          'SET precio = 2200',
          "WHERE nombre = 'Tinto';",
          '',
          'DELETE FROM productos',
          'WHERE existencias = 0;',
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Subió la panela',
        texto: [
          'Cambia el precio de la `Panela` a `4500`.',
          'Solo debe cambiar ese producto: los demás precios quedan igual.',
        ],
        codigo: ['-- Cambia aquí el precio de la Panela', '', '', 'SELECT * FROM productos;'].join('\n'),
        pruebas: [
          {
            descripcion: 'La Panela ahora cuesta 4500',
            condicion: `consulta("SELECT precio FROM productos WHERE nombre = 'Panela'")[0].precio === 4500`,
          },
          {
            descripcion: 'Los demás precios no cambiaron',
            condicion: `consulta("SELECT SUM(precio) AS suma FROM productos WHERE nombre <> 'Panela'")[0].suma === 41000`,
          },
          { descripcion: 'Usas WHERE', condicion: '/\\bWHERE\\b/.test(codigo)' },
        ],
        pistas: [
          'La forma es `UPDATE productos SET ... WHERE ...;`',
          'Lo que cambia: `SET precio = 4500`',
          'A cuál fila: `WHERE nombre = \'Panela\'`',
        ],
        solucion: [
          'UPDATE productos',
          'SET precio = 4500',
          "WHERE nombre = 'Panela';",
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: llegó mercancía',
        texto: [
          'Dos tareas, dos instrucciones:',
          '1. Llegaron 24 unidades de `Bocadillo veleño`. Súmalas a sus existencias. En vez de escribir el número final, usa el valor que ya tiene: `SET existencias = existencias + 24`.',
          '2. El pedido con `id` 10 fue cancelado. Bórralo de la tabla `pedidos`.',
        ],
        codigo: [
          '-- 1. Suma 24 a las existencias del Bocadillo veleño',
          '',
          '-- 2. Borra el pedido 10',
          '',
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El Bocadillo veleño ahora tiene 24 unidades',
            condicion: `consulta("SELECT existencias FROM productos WHERE nombre = 'Bocadillo veleño'")[0].existencias === 24`,
          },
          {
            descripcion: 'Las existencias de los demás productos no cambiaron',
            condicion: `consulta("SELECT SUM(existencias) AS suma FROM productos WHERE nombre <> 'Bocadillo veleño'")[0].suma === 382`,
          },
          {
            descripcion: 'Sumas a partir del valor que ya tenía',
            condicion: '/EXISTENCIAS\\s*\\+\\s*24|24\\s*\\+\\s*EXISTENCIAS/.test(codigo)',
          },
          {
            descripcion: 'Se borró solo el pedido 10: quedan 9 pedidos',
            condicion:
              'consulta("SELECT COUNT(*) AS n FROM pedidos")[0].n === 9 && consulta("SELECT COUNT(*) AS n FROM pedidos WHERE id = 10")[0].n === 0',
          },
        ],
        pistas: [
          'La primera: `UPDATE productos SET existencias = existencias + 24 WHERE nombre = \'Bocadillo veleño\';`',
          'La segunda empieza con `DELETE FROM pedidos`',
          'Y termina con `WHERE id = 10;` Sin ese `WHERE` se borrarían todos los pedidos.',
        ],
        solucion: [
          'UPDATE productos',
          'SET existencias = existencias + 24',
          "WHERE nombre = 'Bocadillo veleño';",
          '',
          'DELETE FROM pedidos',
          'WHERE id = 10;',
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
      },
    ],
  }
);

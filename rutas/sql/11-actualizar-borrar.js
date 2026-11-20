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
          'El tinto subió a 2200 y hay productos agotados que ya no se venden. Ejecuta el código y mira la tabla: el tinto tiene precio nuevo y los agotados desaparecieron.',
          '`UPDATE` ("actualizar") cambia datos que ya existen. Con `SET` ("poner") dices qué columna y qué valor nuevo, y con `WHERE` a cuáles filas.',
          '`DELETE FROM` ("borrar de") borra filas completas, también según un `WHERE`.',
          '**Ejemplo explicado línea por línea:** `UPDATE productos` elige la tabla. `SET precio = 2200` dice qué cambiar. `WHERE nombre = \'Tinto\'` limita el cambio a la fila del tinto. Después, `DELETE FROM productos WHERE existencias = 0` borra todas las filas sin existencias.',
          '**Error común:** olvidar el `WHERE`. Un `UPDATE` o un `DELETE` sin `WHERE` no da ningún mensaje de error: simplemente afecta a TODAS las filas. `UPDATE productos SET precio = 2200;` deja todos los productos a 2200. En una base real eso puede significar perder los datos de un negocio. Aquí la base se reinicia, así que es el mejor lugar para acostumbrarte a escribir siempre el `WHERE`.',
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
        codigo: [
          '-- TODO: con UPDATE, pon el precio en 4500',
          "-- TODO: con WHERE, solo para el producto de nombre 'Panela'",
          '',
          '',
          'SELECT * FROM productos;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La Panela ahora cuesta 4500',
            condicion: `consulta("SELECT precio FROM productos WHERE nombre = 'Panela'")[0].precio === 4500`,
          },
          {
            descripcion: 'Los demás precios no cambiaron',
            condicion: `consulta("SELECT SUM(precio) AS suma FROM productos WHERE nombre <> 'Panela'")[0].suma === 41000`,
          },
          { descripcion: 'Usas WHERE para limitar el cambio', condicion: '/\\bWHERE\\b/.test(codigo)' },
        ],
        pistas: [
          'Es como el cambio del tinto en el ejemplo, con otro producto y otro precio.',
          'La forma es `UPDATE productos SET ... WHERE ...;` El nombre va entre comillas simples.',
          'Casi listo: `UPDATE productos SET precio = 4500 WHERE nombre = ...;`',
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
          '-- TODO 1: UPDATE que sume 24 a las existencias del Bocadillo veleño',
          '--         (usa existencias = existencias + 24, con su WHERE)',
          '',
          '-- TODO 2: DELETE que borre de pedidos solo el pedido con id 10',
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
          'Son dos instrucciones separadas, cada una con su propio `WHERE` y su punto y coma.',
          'La primera es un `UPDATE` con `SET existencias = existencias + 24`. La segunda empieza con `DELETE FROM pedidos`.',
          'Casi listo: `UPDATE productos SET existencias = existencias + 24 WHERE nombre = \'Bocadillo veleño\';` y `DELETE FROM pedidos WHERE id = ...;`',
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

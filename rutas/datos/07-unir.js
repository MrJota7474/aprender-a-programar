globalThis.Rutas.agregarLeccion(
  'datos',
  {
    id: 'unir',
    titulo: 'Unir tablas: merge',
    pasos: [
      {
        id: 'idea',
        titulo: 'El JOIN de pandas',
        texto: [
          'Los datos casi siempre vienen repartidos: en una tabla los pedidos con el número de cliente, y en otra los datos de cada cliente.',
          '`pd.merge(pedidos, clientes, on="cliente_id")` las une usando la columna que comparten. Es el mismo `JOIN` que viste en SQL.',
          'Por defecto solo quedan las filas que tienen pareja en las dos tablas (`INNER JOIN`). Con `how="left"` se conservan todas las de la izquierda, y lo que no encuentra pareja queda como `NaN` (como el `NULL` del `LEFT JOIN`).',
          'Fíjate en el pedido del cliente 9: no está en `clientes`, por eso desaparece en la primera unión y aparece con vacíos en la segunda.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'pedidos = pd.DataFrame({"pedido": [1, 2, 3, 4], "cliente_id": [10, 11, 10, 9], "valor": [25000, 8000, 12000, 5000]})',
          'clientes = pd.DataFrame({"cliente_id": [10, 11], "nombre": ["Ana", "Luis"], "barrio": ["San Fernando", "El Poblado"]})',
          '',
          'print(pd.merge(pedidos, clientes, on="cliente_id"))',
          'print(pd.merge(pedidos, clientes, on="cliente_id", how="left"))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Ponerle nombre a cada producto',
        texto: [
          'La tabla `ventas` solo tiene el código del producto. Únela con `productos` usando la columna `codigo` y guarda el resultado en `detalle`.',
          'Así cada venta queda con el nombre del producto al lado.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'ventas = pd.DataFrame({"codigo": ["A1", "B2", "A1"], "cantidad": [3, 1, 5]})',
          'productos = pd.DataFrame({"codigo": ["A1", "B2"], "nombre": ["arepa", "buñuelo"]})',
          '',
          '# Une ventas con productos en detalle',
          'detalle = ventas',
          'print(detalle)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'detalle tiene la columna nombre', condicion: '"nombre" in detalle.columns' },
          { descripcion: 'Siguen siendo 3 ventas', condicion: 'len(detalle) == 3' },
          {
            descripcion: 'Las 8 unidades vendidas son arepas',
            condicion: 'bool(detalle.loc[detalle["nombre"] == "arepa", "cantidad"].sum() == 8)',
          },
        ],
        pistas: [
          'La función es `pd.merge(izquierda, derecha, on="columna")`',
          'La columna que comparten las dos tablas es `codigo`',
          '`detalle = pd.merge(ventas, productos, on="codigo")`',
        ],
        solucion: [
          'import pandas as pd',
          '',
          'ventas = pd.DataFrame({"codigo": ["A1", "B2", "A1"], "cantidad": [3, 1, 5]})',
          'productos = pd.DataFrame({"codigo": ["A1", "B2"], "nombre": ["arepa", "buñuelo"]})',
          '',
          'detalle = pd.merge(ventas, productos, on="codigo")',
          'print(detalle)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: ventas por barrio',
        texto: [
          'Don Pepe hace domicilios y quiere saber en qué barrio le compran más.',
          'Crea la función `ventas_por_barrio(pedidos, clientes)` que une las dos tablas por `cliente_id` y devuelve una Series con la suma de `valor` por `barrio`.',
          'Es unir y luego agrupar: las dos cosas que ya sabes.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'pedidos = pd.DataFrame({"cliente_id": [10, 11, 10, 12, 11], "valor": [25000, 8000, 12000, 30000, 4000]})',
          'clientes = pd.DataFrame({"cliente_id": [10, 11, 12], "barrio": ["Chapinero", "Kennedy", "Chapinero"]})',
          '',
          '# Crea aquí la función ventas_por_barrio',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'ventas_por_barrio es una función', condicion: 'callable(ventas_por_barrio)' },
          {
            descripcion: 'En Chapinero se vendieron 67000',
            condicion: 'bool(ventas_por_barrio(pedidos, clientes)["Chapinero"] == 67000)',
          },
          {
            descripcion: 'En Kennedy se vendieron 12000',
            condicion: 'bool(ventas_por_barrio(pedidos, clientes)["Kennedy"] == 12000)',
          },
          {
            descripcion: 'Funciona con otras tablas',
            condicion:
              'bool(ventas_por_barrio(pd.DataFrame({"cliente_id": [1, 1], "valor": [5, 7]}), pd.DataFrame({"cliente_id": [1], "barrio": ["Belén"]}))["Belén"] == 12)',
          },
        ],
        pistas: [
          'Primero une: `unidas = pd.merge(pedidos, clientes, on="cliente_id")`',
          'Después agrupa la tabla unida por `barrio` y suma `valor`',
          '`return unidas.groupby("barrio")["valor"].sum()`',
        ],
        solucion: [
          'import pandas as pd',
          '',
          'pedidos = pd.DataFrame({"cliente_id": [10, 11, 10, 12, 11], "valor": [25000, 8000, 12000, 30000, 4000]})',
          'clientes = pd.DataFrame({"cliente_id": [10, 11, 12], "barrio": ["Chapinero", "Kennedy", "Chapinero"]})',
          '',
          '',
          'def ventas_por_barrio(pedidos, clientes):',
          '    unidas = pd.merge(pedidos, clientes, on="cliente_id")',
          '    return unidas.groupby("barrio")["valor"].sum()',
          '',
          '',
          'print(ventas_por_barrio(pedidos, clientes))',
        ].join('\n'),
      },
    ],
  }
);

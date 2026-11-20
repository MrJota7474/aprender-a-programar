globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'agrupar',
    titulo: 'Agrupar con GROUP BY',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un resumen por cada grupo',
        texto: [
          '`COUNT(*)` te dice que hay 10 productos. Pero ¿cuántos hay **de cada categoría**? Ejecuta el código: la primera tabla da una fila por categoría, con su cantidad.',
          'Con `GROUP BY` ("agrupar por") SQL junta en un **grupo** las filas que tienen el mismo valor en una columna, y calcula el resumen **de cada grupo**.',
          '**Ejemplo explicado línea por línea:** `GROUP BY categoria` pone todas las bebidas en un montón, todas las comidas en otro, y así. `SELECT categoria, COUNT(*)` muestra, por cada montón, su nombre y cuántas filas tiene.',
          'Para filtrar grupos según su resumen se usa `HAVING` ("que tenga"). La diferencia: `WHERE` filtra **filas** antes de agrupar; `HAVING` filtra **grupos** después. La segunda consulta deja solo las categorías cuyo precio promedio pasa de 3000.',
          'El orden de las partes es: `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`.',
          '**Error común:** usar `WHERE` para filtrar por un resumen, como `WHERE COUNT(*) > 2`. SQL responde `misuse of aggregate: COUNT()` (uso indebido de una función de resumen). Las condiciones con `COUNT`, `SUM` o `AVG` van en `HAVING`.',
        ],
        codigo: [
          'SELECT categoria, COUNT(*) AS cuantos',
          'FROM productos',
          'GROUP BY categoria;',
          '',
          'SELECT categoria, AVG(precio) AS promedio',
          'FROM productos',
          'GROUP BY categoria',
          'HAVING AVG(precio) > 3000;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Clientes por ciudad',
        texto: [
          'Muestra cuántos clientes hay en cada ciudad.',
          'Las columnas deben ser `ciudad` y `cuantos`.',
        ],
        codigo: [
          '-- TODO: en el SELECT, la ciudad y COUNT(*) con el alias cuantos',
          '-- TODO: agrupa las filas de clientes por ciudad con GROUP BY',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Las columnas son ciudad y cuantos', condicion: 'columnas.join() === "ciudad,cuantos"' },
          {
            descripcion: 'Cada ciudad aparece con su cantidad de clientes',
            condicion: 'mismasFilas("SELECT ciudad, COUNT(*) FROM clientes GROUP BY ciudad")',
          },
          { descripcion: 'Usas GROUP BY', condicion: '/\\bGROUP\\s+BY\\b/.test(codigo)' },
        ],
        pistas: [
          'Es la primera consulta del ejemplo, pero con la tabla `clientes` y la columna `ciudad`.',
          'En el `SELECT` van la columna del grupo y el conteo: `ciudad, COUNT(*) AS cuantos`. Al final, `GROUP BY` con la misma columna.',
          'Casi listo: `SELECT ciudad, COUNT(*) AS cuantos FROM clientes GROUP BY ...;`',
        ],
        solucion: ['SELECT ciudad, COUNT(*) AS cuantos', 'FROM clientes', 'GROUP BY ciudad;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: los productos más pedidos',
        texto: [
          'En la tabla `pedidos`, suma la `cantidad` pedida de cada `producto_id`. Llama a esa columna `unidades`.',
          'Muestra solo los productos que suman **3 unidades o más**, del más pedido al menos pedido.',
          'Necesitas tres piezas, en este orden: `GROUP BY`, `HAVING` y `ORDER BY`.',
        ],
        codigo: [
          '-- TODO: de la tabla pedidos, muestra producto_id y SUM(cantidad) AS unidades',
          '-- TODO: agrupa por producto_id',
          '-- TODO: con HAVING, deja los grupos que suman 3 o más',
          '-- TODO: ordena por unidades de mayor a menor',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Las columnas son producto_id y unidades',
            condicion: 'columnas.join() === "producto_id,unidades"',
          },
          {
            descripcion: 'Aparecen solo los productos con 3 unidades o más',
            condicion:
              'mismasFilas("SELECT producto_id, SUM(cantidad) FROM pedidos GROUP BY producto_id HAVING SUM(cantidad) >= 3")',
          },
          {
            descripcion: 'Van del más pedido al menos pedido',
            condicion: 'filas.length > 1 && filas.every((fila, i) => i === 0 || filas[i - 1][1] >= fila[1])',
          },
        ],
        pistas: [
          'Construye la consulta por partes y ejecútala en cada paso: primero solo el `GROUP BY`, luego agrega el `HAVING` y por último el orden.',
          'Empieza con `SELECT producto_id, SUM(cantidad) AS unidades FROM pedidos GROUP BY producto_id`. El filtro de grupos usa `HAVING` con `>=`.',
          'Las dos últimas líneas: `HAVING SUM(cantidad) >= 3` y `ORDER BY unidades DESC;`',
        ],
        solucion: [
          'SELECT producto_id, SUM(cantidad) AS unidades',
          'FROM pedidos',
          'GROUP BY producto_id',
          'HAVING SUM(cantidad) >= 3',
          'ORDER BY unidades DESC;',
        ].join('\n'),
      },
    ],
  }
);

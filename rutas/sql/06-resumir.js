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
          'El dueño de la tienda no quiere ver 10 filas: quiere una respuesta. "¿Cuántos productos tengo?" Ejecuta el código: la primera tabla responde con un solo número.',
          'Las **funciones de resumen** toman muchas filas y devuelven un solo valor.',
          '`COUNT(*)` cuenta filas. `SUM(columna)` suma, `AVG(columna)` saca el promedio (de *average*), y `MIN(columna)` y `MAX(columna)` dan el menor y el mayor valor.',
          '**Ejemplo explicado:** la última consulta primero filtra con `WHERE categoria = \'Bebidas\'` y después `SUM(existencias)` suma las unidades de las filas que quedaron. El orden es: filtrar y luego resumir.',
          'Con datos como estos se responden las preguntas de un negocio: cuánto se vendió, cuál es el precio promedio, cuántos clientes hay.',
          '**Error común:** mezclar una función de resumen con una columna normal, como `SELECT nombre, MAX(precio)`. SQLite lo resuelve con una regla especial (te muestra la fila del máximo), pero PostgreSQL da error y otras bases pueden mostrar el nombre de otra fila. Para ver "el nombre del más caro" usa `ORDER BY precio DESC LIMIT 1`, o espera a la lección de agrupar.',
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
        codigo: '-- TODO: cuenta las filas de la tabla clientes con COUNT(*) y llama la columna total\n',
        pruebas: [
          {
            descripcion: 'El resultado es una sola fila con el número de clientes (6)',
            condicion: 'filas.length === 1 && filas[0][0] === 6',
          },
          { descripcion: 'La columna se llama total', condicion: 'columnas[0] === "total"' },
          {
            descripcion: 'SQL cuenta los clientes con COUNT; el 6 no está escrito a mano',
            condicion: '/\\bCOUNT\\s*\\(/.test(codigo) && /\\bFROM\\s+CLIENTES\\b/.test(codigo) && !/\\b6\\b/.test(codigo)',
          },
        ],
        pistas: [
          'Mira la primera consulta del ejemplo: cuenta productos. Tú cuentas clientes.',
          'Para contar filas se usa `COUNT(*)`, y el nombre de la columna se pone con `AS total`.',
          'Casi listo: `SELECT COUNT(*) AS total FROM ...;`',
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
        codigo: [
          '-- TODO: calcula AVG(precio) con el alias promedio',
          "-- TODO: filtra con WHERE solo la categoría 'Comidas'",
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El promedio es el de los productos de Comidas',
            condicion: `filas.length === 1 && igualA("SELECT AVG(precio) FROM productos WHERE categoria = 'Comidas'")`,
          },
          { descripcion: 'La columna se llama promedio', condicion: 'columnas[0] === "promedio"' },
          { descripcion: 'Usas AVG', condicion: '/\\bAVG\\s*\\(/.test(codigo)' },
        ],
        pistas: [
          'Es como la última consulta del ejemplo: primero se filtra, después se resume. Solo cambia la función y la categoría.',
          'El promedio es `AVG(precio)`. El filtro es `WHERE categoria = \'Comidas\'`.',
          'Casi listo: `SELECT AVG(precio) AS promedio FROM productos WHERE ...;`',
        ],
        solucion: ['SELECT AVG(precio) AS promedio', 'FROM productos', "WHERE categoria = 'Comidas';"].join('\n'),
      },
    ],
  }
);

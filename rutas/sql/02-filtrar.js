globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'filtrar',
    titulo: 'Filtrar con WHERE',
    pasos: [
      {
        id: 'idea',
        titulo: 'Solo las filas que cumplen',
        texto: [
          'La tienda tiene 10 productos, pero tú solo quieres ver los que cuestan más de 3000. Ejecuta el código: la primera tabla trae solo esos.',
          'Lo hizo `WHERE precio > 3000`. `WHERE` significa "donde": le dice a SQL qué filas quieres. Solo aparecen las que cumplen la **condición**.',
          'Para comparar se usan: `=` (igual, con un solo signo), `<>` (diferente), `>` (mayor), `<` (menor), `>=` (mayor o igual) y `<=` (menor o igual).',
          'Los textos van entre **comillas simples**: `\'Bebidas\'`. Los números, sin comillas.',
          '**Ejemplo explicado línea por línea:** `SELECT nombre, precio` elige las columnas. `FROM productos` elige la tabla. `WHERE precio > 3000;` revisa fila por fila y deja solo las que cumplen. El orden siempre es ese: `SELECT`, `FROM`, `WHERE`.',
          'Una consulta se puede partir en varias líneas para leerla mejor. Aquí hay dos consultas: cada una muestra su propia tabla.',
          '**Error común:** olvidar las comillas en un texto. `WHERE categoria = Bebidas` da `no such column: Bebidas`: sin comillas, SQL cree que `Bebidas` es el nombre de una columna. Escríbelo así: `\'Bebidas\'`.',
        ],
        codigo: [
          'SELECT nombre, precio',
          'FROM productos',
          'WHERE precio > 3000;',
          '',
          'SELECT nombre, categoria',
          'FROM productos',
          "WHERE categoria = 'Bebidas';",
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Clientes de Bogotá',
        texto: [
          'Muestra el `nombre` y la `ciudad` de los clientes que viven en Bogotá.',
          'Ojo con la tilde y la mayúscula: para SQL, `\'Bogota\'` y `\'Bogotá\'` son textos distintos.',
        ],
        codigo: [
          'SELECT nombre, ciudad',
          'FROM clientes;',
          '',
          '-- TODO: agrega una línea WHERE que deje solo la ciudad Bogotá.',
          '-- Va después del FROM; mueve el punto y coma al final de todo.',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Solo aparecen los clientes de Bogotá',
            condicion: `mismasFilas("SELECT nombre, ciudad FROM clientes WHERE ciudad = 'Bogotá'")`,
          },
          { descripcion: 'Las columnas son nombre y ciudad', condicion: 'columnas.join() === "nombre,ciudad"' },
          { descripcion: 'Usas WHERE', condicion: '/\\bWHERE\\b/.test(codigo)' },
        ],
        pistas: [
          'El `WHERE` va después del `FROM`, y el punto y coma queda al final de todo.',
          'La condición compara la columna con el texto: `ciudad = \'Bogotá\'`',
          'La última línea queda: `WHERE ciudad = \'Bogotá\';`',
        ],
        solucion: ['SELECT nombre, ciudad', 'FROM clientes', "WHERE ciudad = 'Bogotá';"].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: lo que se está acabando',
        texto: [
          'El dueño quiere saber qué productos hay que volver a pedir.',
          'Muestra el `nombre` y las `existencias` de los productos que tienen **menos de 20** unidades.',
        ],
        codigo: [
          '-- TODO: muestra nombre y existencias de la tabla productos',
          '-- TODO: filtra con WHERE los que tienen menos de 20 unidades',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Aparecen solo los productos con menos de 20 unidades',
            condicion: 'mismasFilas("SELECT nombre, existencias FROM productos WHERE existencias < 20")',
          },
          {
            descripcion: 'Las columnas son nombre y existencias',
            condicion: 'columnas.join() === "nombre,existencias"',
          },
        ],
        pistas: [
          'Tiene la misma forma que la primera consulta del ejemplo: `SELECT`, `FROM` y `WHERE`.',
          'Las columnas son `nombre, existencias` y "menos de 20" se escribe con el comparador `<`.',
          'Casi listo: `SELECT nombre, existencias FROM productos WHERE existencias ...;`',
        ],
        solucion: ['SELECT nombre, existencias', 'FROM productos', 'WHERE existencias < 20;'].join('\n'),
      },
    ],
  }
);

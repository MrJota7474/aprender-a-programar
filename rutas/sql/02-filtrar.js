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
          'Con `WHERE` ("donde") le dices a SQL qué filas quieres: solo aparecen las que cumplen la condición.',
          'Comparadores: `=` (igual, con un solo signo), `<>` (diferente), `>`, `<`, `>=` y `<=`.',
          'Los textos van entre **comillas simples**: `\'Bebidas\'`. Los números, sin comillas.',
          'Una consulta se puede partir en varias líneas para leerla mejor. Aquí hay dos consultas: cada una muestra su propia tabla.',
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
        codigo: ['SELECT nombre, ciudad', 'FROM clientes;', '', '-- Agrega la condición antes del punto y coma'].join('\n'),
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
        codigo: '-- Productos con menos de 20 unidades\n',
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
          'Empieza con `SELECT nombre, existencias FROM productos`',
          '"Menos de 20" se escribe con el comparador `<`.',
          'La condición es `WHERE existencias < 20`',
        ],
        solucion: ['SELECT nombre, existencias', 'FROM productos', 'WHERE existencias < 20;'].join('\n'),
      },
    ],
  }
);

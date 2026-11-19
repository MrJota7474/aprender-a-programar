globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'funciones',
    titulo: 'Funciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Recetas que se reutilizan',
        texto: [
          'Una **función** es un pedazo de código con nombre que puedes usar todas las veces que quieras.',
          'Entre paréntesis recibe sus datos (se llaman **parámetros**) y con `return` devuelve un resultado.',
          'Crear la función no la ejecuta. Para usarla hay que **llamarla** escribiendo su nombre con paréntesis: `saludar("Juan")`.',
        ],
        codigo: [
          'function saludar(nombre) {',
          '  return "Hola, " + nombre;',
          '}',
          '',
          'console.log(saludar("Juan"));',
          'console.log(saludar("Mariana"));',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El doble',
        texto: [
          'Completa la función `doble` para que devuelva el número que recibe multiplicado por 2.',
          'Desde ahora las pruebas llaman a tu función con **varios valores distintos**, así que tiene que funcionar con cualquier número.',
        ],
        codigo: [
          'function doble(numero) {',
          '  // Devuelve el número multiplicado por 2',
          '}',
          '',
          'console.log(doble(4)); // debería mostrar 8',
        ].join('\n'),
        pruebas: [
          { descripcion: 'doble(4) devuelve 8', condicion: 'doble(4) === 8' },
          { descripcion: 'doble(0) devuelve 0', condicion: 'doble(0) === 0' },
          { descripcion: 'doble(-3) devuelve -6', condicion: 'doble(-3) === -6' },
        ],
        pistas: [
          'Para devolver un resultado se usa la palabra `return`.',
          'La operación es `numero * 2`.',
          'Dentro de la función escribe: `return numero * 2;`',
        ],
        solucion: [
          'function doble(numero) {',
          '  return numero * 2;',
          '}',
          '',
          'console.log(doble(4));',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la taquilla',
        texto: [
          'Crea desde cero la función `precioEntrada` que recibe una `edad` y devuelve el precio de la entrada.',
          'Los menores de 12 años pagan `8000`. Todos los demás pagan `15000`.',
          'Aquí se juntan dos cosas que ya sabes: funciones e `if`.',
        ],
        codigo: '// Crea aquí la función precioEntrada\n',
        pruebas: [
          { descripcion: 'precioEntrada es una función', condicion: 'typeof precioEntrada === "function"' },
          { descripcion: 'precioEntrada(8) devuelve 8000', condicion: 'precioEntrada(8) === 8000' },
          { descripcion: 'precioEntrada(11) devuelve 8000', condicion: 'precioEntrada(11) === 8000' },
          { descripcion: 'precioEntrada(12) devuelve 15000', condicion: 'precioEntrada(12) === 15000' },
          { descripcion: 'precioEntrada(30) devuelve 15000', condicion: 'precioEntrada(30) === 15000' },
        ],
        pistas: [
          'Empieza con el esqueleto: `function precioEntrada(edad) { }`',
          'Adentro usa un `if (edad < 12)` que haga `return 8000;`',
          'Después del `if`, escribe `return 15000;` para todos los demás.',
        ],
        solucion: [
          'function precioEntrada(edad) {',
          '  if (edad < 12) {',
          '    return 8000;',
          '  }',
          '  return 15000;',
          '}',
        ].join('\n'),
      },
    ],
  }
);

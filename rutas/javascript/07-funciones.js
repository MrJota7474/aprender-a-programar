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
          'Piensa en una receta de arepa: la escribes una vez y la usas cada mañana, cambiando solo el relleno. Las funciones son eso.',
          'Una **función** es un pedazo de código con nombre que puedes usar todas las veces que quieras. Ya usas una: `console.log()`.',
          'Entre paréntesis recibe sus datos. Esos nombres se llaman **parámetros**: son variables que solo existen dentro de la función.',
          'Con `return` la función **devuelve** un resultado: lo entrega a quien la llamó, que puede mostrarlo o guardarlo.',
          'Crear la función no la ejecuta. Para usarla hay que **llamarla** escribiendo su nombre con paréntesis: `saludar("Juan")`.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: crea la función `saludar` con un parámetro, `nombre`. Línea 2: devuelve "Hola, " unido con ese nombre. Línea 3: la llave cierra la función.',
          'Línea 5: llama a `saludar` con "Juan". Dentro, `nombre` vale "Juan", la función devuelve "Hola, Juan" y `console.log` lo muestra. Línea 6: la misma receta con otro dato.',
          '**Error común:** olvidar el `return`. Si la línea 2 fuera solo `"Hola, " + nombre;`, la función calcularía el saludo y lo botaría. La consola mostraría `undefined` ("sin definir"), que significa "no hay valor". Solución: escribe `return` antes del resultado.',
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
          '  // TODO: devuelve (con return) el parámetro numero multiplicado por 2.',
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
        codigo: [
          '// TODO 1: crea la función precioEntrada con un parámetro llamado edad.',
          '// TODO 2: si edad es menor que 12, devuelve 8000.',
          '// TODO 3: si no, devuelve 15000.',
          '',
          '// Cuando la tengas, prueba: console.log(precioEntrada(8));',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'precioEntrada es una función', condicion: 'typeof precioEntrada === "function"' },
          { descripcion: 'precioEntrada(8) devuelve 8000', condicion: 'precioEntrada(8) === 8000' },
          { descripcion: 'precioEntrada(11) devuelve 8000', condicion: 'precioEntrada(11) === 8000' },
          { descripcion: 'precioEntrada(12) devuelve 15000', condicion: 'precioEntrada(12) === 15000' },
          { descripcion: 'precioEntrada(30) devuelve 15000', condicion: 'precioEntrada(30) === 15000' },
        ],
        pistas: [
          'Empieza con el esqueleto: `function precioEntrada(edad) { }`. Todo lo demás va dentro de esas llaves.',
          'Adentro usa un `if (edad < 12)` que haga `return 8000;`. Cuando una función llega a un `return`, termina ahí.',
          'Después del `if`, escribe `return 15000;` para todos los demás: solo llega a esa línea quien no entró al `if`.',
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

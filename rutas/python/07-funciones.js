globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'funciones',
    titulo: 'Funciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Recetas que se reutilizan',
        texto: [
          'Una **función** es un pedazo de código con nombre que puedes usar todas las veces que quieras.',
          'Se crea con `def`, el nombre, los datos que recibe entre paréntesis (los **parámetros**) y dos puntos. Su contenido va con sangría, y con `return` devuelve un resultado.',
          'Crear la función no la ejecuta. Para usarla hay que **llamarla** escribiendo su nombre con paréntesis: `saludar("Juan")`.',
        ],
        codigo: [
          'def saludar(nombre):',
          '    return "Hola, " + nombre',
          '',
          '',
          'print(saludar("Juan"))',
          'print(saludar("Mariana"))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El doble',
        texto: [
          'Arregla la función `doble` para que devuelva el número que recibe multiplicado por 2. Ahora mismo siempre devuelve 0.',
          'Desde ahora las pruebas llaman a tu función con **varios valores distintos**, así que tiene que funcionar con cualquier número.',
        ],
        codigo: [
          'def doble(numero):',
          '    # Cambia el 0 por la operación correcta',
          '    return 0',
          '',
          '',
          'print(doble(4))  # debería mostrar 8',
        ].join('\n'),
        pruebas: [
          { descripcion: 'doble(4) devuelve 8', condicion: 'doble(4) == 8' },
          { descripcion: 'doble(0) devuelve 0', condicion: 'doble(0) == 0' },
          { descripcion: 'doble(-3) devuelve -6', condicion: 'doble(-3) == -6' },
        ],
        pistas: [
          'El parámetro `numero` trae el valor que le pasan a la función.',
          'La operación es `numero * 2`.',
          'La línea queda: `return numero * 2`',
        ],
        solucion: ['def doble(numero):', '    return numero * 2', '', '', 'print(doble(4))'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la taquilla',
        texto: [
          'Crea desde cero la función `precio_entrada` que recibe una `edad` y devuelve el precio de la entrada.',
          'Los menores de 12 años pagan `8000`. Todos los demás pagan `15000`.',
          'Aquí se juntan dos cosas que ya sabes: funciones e `if`.',
        ],
        codigo: '# Crea aquí la función precio_entrada\n',
        pruebas: [
          { descripcion: 'precio_entrada es una función', condicion: 'callable(precio_entrada)' },
          { descripcion: 'precio_entrada(8) devuelve 8000', condicion: 'precio_entrada(8) == 8000' },
          { descripcion: 'precio_entrada(11) devuelve 8000', condicion: 'precio_entrada(11) == 8000' },
          { descripcion: 'precio_entrada(12) devuelve 15000', condicion: 'precio_entrada(12) == 15000' },
          { descripcion: 'precio_entrada(30) devuelve 15000', condicion: 'precio_entrada(30) == 15000' },
        ],
        pistas: [
          'Empieza con la primera línea: `def precio_entrada(edad):`',
          'Adentro (con sangría) usa `if edad < 12:` y debajo, con más sangría, `return 8000`',
          'Después del `if`, a la altura del `if`, escribe `return 15000` para todos los demás.',
        ],
        solucion: [
          'def precio_entrada(edad):',
          '    if edad < 12:',
          '        return 8000',
          '    return 15000',
        ].join('\n'),
      },
    ],
  }
);

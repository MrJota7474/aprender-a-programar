globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'variables',
    titulo: 'Variables',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cajas con nombre',
        texto: [
          'Una **variable** es una caja con nombre donde guardas un valor para usarlo después.',
          'En Python se crea escribiendo el nombre, un `=` y el valor. No hace falta ninguna palabra especial.',
          'Los textos van entre comillas; los números, sin comillas.',
          'Cuando un nombre tiene varias palabras, en Python se separan con guion bajo: `comida_favorita`.',
        ],
        codigo: [
          'ciudad = "Medellín"',
          'print(ciudad)',
          '',
          'ciudad = "Cali"  # una variable puede cambiar de valor',
          'print(ciudad)',
          '',
          'comida_favorita = "sancocho"',
          'edad = 16  # los números van sin comillas',
          'print(comida_favorita)',
          'print(edad)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Tus datos',
        texto: [
          'Crea una variable `nombre` con tu nombre (un texto) y una variable `edad` con tu edad (un número).',
          'Después muestra las dos en la consola.',
        ],
        codigo: '# Crea aquí tus variables\n',
        pruebas: [
          {
            descripcion: 'Existe la variable nombre y es un texto',
            condicion: 'isinstance(nombre, str) and len(nombre) > 0',
          },
          { descripcion: 'Existe la variable edad y es un número', condicion: 'type(edad) in (int, float)' },
          { descripcion: 'Muestras el nombre en la consola', condicion: 'mostrado(nombre)' },
          { descripcion: 'Muestras la edad en la consola', condicion: 'mostrado(edad)' },
        ],
        pistas: [
          'Una variable se crea así: `nombre = "Valentina"`',
          'La edad es un número, va sin comillas: `edad = 16`',
          'Para mostrar una variable escribe su nombre sin comillas: `print(nombre)`',
        ],
        solucion: ['nombre = "Valentina"', 'edad = 16', 'print(nombre)', 'print(edad)'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: subió el tinto',
        texto: [
          'Un tinto costaba 1500 pesos, pero subió a 2000.',
          'Cambia el valor de `precio` a `2000` y muéstralo otra vez.',
          'Además crea una variable `moneda` con el texto `"COP"`.',
        ],
        codigo: ['precio = 1500', 'print(precio)', '', '# Cambia el precio a 2000 y muéstralo de nuevo', ''].join('\n'),
        pruebas: [
          { descripcion: 'El precio termina valiendo 2000', condicion: 'precio == 2000' },
          {
            descripcion: 'Muestras primero 1500 y después 2000',
            condicion: 'len(salida) >= 2 and salida[0] == "1500" and "2000" in salida',
          },
          { descripcion: 'Existe la variable moneda con el valor "COP"', condicion: 'moneda == "COP"' },
        ],
        pistas: [
          'Para cambiar una variable se le asigna otro valor: `precio = 2000`',
          'Después del cambio, vuelve a escribir `print(precio)`',
          'La otra variable se crea con `moneda = "COP"`',
        ],
        solucion: ['precio = 1500', 'print(precio)', '', 'precio = 2000', 'print(precio)', 'moneda = "COP"'].join('\n'),
      },
    ],
  }
);

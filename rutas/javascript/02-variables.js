globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'variables',
    titulo: 'Variables',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cajas con nombre',
        texto: [
          'Una **variable** es una caja con nombre donde guardas un valor para usarlo después.',
          'Con `let` creas una variable cuyo valor **puede cambiar**. Con `const` creas una que **no cambia**.',
          'Los textos van entre comillas; los números, sin comillas.',
          'Ejecuta el código y fíjate cómo `ciudad` cambia de valor.',
        ],
        codigo: [
          'let ciudad = "Medellín";',
          'console.log(ciudad);',
          '',
          'ciudad = "Cali"; // con let sí se puede cambiar',
          'console.log(ciudad);',
          '',
          'const pais = "Colombia"; // con const no se puede cambiar',
          'console.log(pais);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Tus datos',
        texto: [
          'Crea una variable `nombre` con tu nombre (un texto) y una variable `edad` con tu edad (un número).',
          'Después muestra las dos en la consola.',
        ],
        codigo: '// Crea aquí tus variables\n',
        pruebas: [
          {
            descripcion: 'Existe la variable nombre y es un texto',
            condicion: 'typeof nombre === "string" && nombre.length > 0',
          },
          { descripcion: 'Existe la variable edad y es un número', condicion: 'typeof edad === "number"' },
          { descripcion: 'Muestras el nombre en la consola', condicion: 'salida.includes(nombre)' },
          { descripcion: 'Muestras la edad en la consola', condicion: 'salida.includes(String(edad))' },
        ],
        pistas: [
          'Una variable se crea así: `let nombre = "Valentina";`',
          'La edad es un número, va sin comillas: `let edad = 16;`',
          'Para mostrar una variable escribe su nombre sin comillas: `console.log(nombre);`',
        ],
        solucion: [
          'let nombre = "Valentina";',
          'let edad = 16;',
          'console.log(nombre);',
          'console.log(edad);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: subió el tinto',
        texto: [
          'Un tinto costaba 1500 pesos, pero subió a 2000.',
          'Cambia el valor de `precio` a `2000` y muéstralo otra vez.',
          'Además crea una constante `moneda` con el texto `"COP"`.',
        ],
        codigo: [
          'let precio = 1500;',
          'console.log(precio);',
          '',
          '// Cambia el precio a 2000 y muéstralo de nuevo',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El precio termina valiendo 2000', condicion: 'precio === 2000' },
          {
            descripcion: 'Muestras primero 1500 y después 2000',
            condicion: 'salida[0] === "1500" && salida.includes("2000")',
          },
          { descripcion: 'Existe la constante moneda con el valor "COP"', condicion: 'moneda === "COP"' },
        ],
        pistas: [
          'Para cambiar una variable que ya existe no repitas `let`: escribe `precio = 2000;`',
          'Después del cambio, vuelve a escribir `console.log(precio);`',
          'La constante se crea con `const moneda = "COP";`',
        ],
        solucion: [
          'let precio = 1500;',
          'console.log(precio);',
          '',
          'precio = 2000;',
          'console.log(precio);',
          'const moneda = "COP";',
        ].join('\n'),
      },
    ],
  }
);

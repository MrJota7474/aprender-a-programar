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
          'Imagina una caja con una etiqueta que dice `ciudad`. Adentro guardas el texto "Medellín". Cuando necesites la ciudad, buscas la caja por su etiqueta.',
          'Eso es una **variable**: un nombre que guarda un **valor** (un dato: un texto, un número...) para usarlo después.',
          'Con `let` creas una variable cuyo valor **puede cambiar**. Con `const` creas una **constante**: una variable que **no cambia**.',
          'El signo `=` no significa "es igual" como en matemáticas. Significa "guarda": `let ciudad = "Medellín";` se lee "crea la caja ciudad y guarda Medellín adentro".',
          'Los textos van entre comillas; los números, sin comillas.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: crea la variable `ciudad` y guarda "Medellín". Línea 2: muestra lo que hay en la caja. Va **sin comillas**: con comillas mostraría la palabra ciudad.',
          'Línea 4: cambia el contenido de la caja a "Cali". No se repite `let`, porque la caja ya existe.',
          'Línea 7: crea la constante `pais`. Si después intentaras `pais = "Perú";`, JavaScript no lo permitiría.',
          '**Error común:** cambiar una constante. Si escribes `const pais = "Colombia";` y luego `pais = "Perú";`, verás `Assignment to constant variable` ("asignación a una variable constante"). Solución: si el valor debe cambiar, créalo con `let`.',
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
        codigo: [
          '// TODO 1: crea la variable nombre con tu nombre (entre comillas).',
          '',
          '// TODO 2: crea la variable edad con tu edad (sin comillas).',
          '',
          '// TODO 3: muestra las dos variables con console.log().',
          '',
        ].join('\n'),
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
          'Al ejecutar, la consola debe mostrar `1500` y debajo `2000`.',
        ],
        codigo: [
          'let precio = 1500;',
          'console.log(precio);',
          '',
          '// TODO 1: cambia el precio a 2000 (sin volver a escribir let).',
          '',
          '// TODO 2: muestra el precio otra vez.',
          '',
          '// TODO 3: crea la constante moneda con el texto "COP".',
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

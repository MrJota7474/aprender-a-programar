globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'textos',
    titulo: 'Textos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Unir y transformar textos',
        texto: [
          'Los textos (en inglés, **strings**) se pueden unir con `+`.',
          'Otra forma más cómoda: usar comillas invertidas y poner las variables dentro de `${ }`.',
          'Todo texto sabe cuántas letras tiene (`.length`) y puede pasarse a mayúsculas (`.toUpperCase()`).',
        ],
        codigo: [
          'const nombre = "Sofía";',
          '',
          'console.log("Hola, " + nombre);',
          'console.log(`Hola, ${nombre}`);',
          'console.log(nombre.length);',
          'console.log(nombre.toUpperCase());',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Arma una frase',
        texto: [
          'Crea la variable `saludo` uniendo las variables `nombre` y `ciudad` para formar esta frase:',
          '`Me llamo Camila y vivo en Bogotá`',
          'Después muestra `saludo` en la consola.',
        ],
        codigo: [
          'const nombre = "Camila";',
          'const ciudad = "Bogotá";',
          '',
          '// Crea la variable saludo usando las dos variables de arriba',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'saludo vale "Me llamo Camila y vivo en Bogotá"',
            condicion: 'saludo === "Me llamo Camila y vivo en Bogotá"',
          },
          { descripcion: 'Muestras el saludo en la consola', condicion: 'salida.includes(saludo)' },
          {
            descripcion: 'Usas las variables (no escribes el nombre a mano en la frase)',
            condicion: '!codigo.includes("Me llamo Camila")',
          },
        ],
        pistas: [
          'Puedes unir pedazos con `+`: `"Me llamo " + nombre + ...`',
          'Cuidado con los espacios dentro de las comillas: `" y vivo en "`',
          'Una solución: `const saludo = "Me llamo " + nombre + " y vivo en " + ciudad;`',
        ],
        solucion: [
          'const nombre = "Camila";',
          'const ciudad = "Bogotá";',
          '',
          'const saludo = `Me llamo ${nombre} y vivo en ${ciudad}`;',
          'console.log(saludo);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la barra',
        texto: [
          'Crea la variable `grito` con el texto `VAMOS, COLOMBIA`, pasando `equipo` a mayúsculas con `.toUpperCase()`.',
          'Crea la variable `letras` con la cantidad de letras que tiene `equipo`, usando `.length`.',
        ],
        codigo: ['const equipo = "Colombia";', '', '// Crea grito y letras', ''].join('\n'),
        pruebas: [
          { descripcion: 'grito vale "VAMOS, COLOMBIA"', condicion: 'grito === "VAMOS, COLOMBIA"' },
          { descripcion: 'letras vale 8', condicion: 'letras === 8' },
          { descripcion: 'Usas .toUpperCase()', condicion: 'codigo.includes(".toUpperCase()")' },
          { descripcion: 'Usas .length', condicion: 'codigo.includes(".length")' },
        ],
        pistas: [
          '`equipo.toUpperCase()` da como resultado `"COLOMBIA"`.',
          'Une el comienzo con el equipo en mayúsculas: `"VAMOS, " + equipo.toUpperCase()`',
          'Para las letras: `const letras = equipo.length;`',
        ],
        solucion: [
          'const equipo = "Colombia";',
          '',
          'const grito = "VAMOS, " + equipo.toUpperCase();',
          'const letras = equipo.length;',
        ].join('\n'),
      },
    ],
  }
);

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
          'Si `nombre` guarda "Sofía", `"Hola, " + nombre` da el texto `Hola, Sofía`. Con textos, el `+` no suma: **pega** un texto detrás del otro. A eso se le llama **concatenar**.',
          'Los textos (en inglés, **strings**) se pueden unir con `+`. Ojo con los espacios: `"Hola," + nombre` daría `Hola,Sofía`, todo pegado.',
          'Otra forma más cómoda es la **plantilla**: un texto entre comillas invertidas (la tecla junto al Enter o Alt+96) donde cada variable va dentro de `${ }`. JavaScript cambia cada `${nombre}` por su valor.',
          'Todo texto sabe cuántos caracteres tiene (`.length`) y puede pasarse a mayúsculas (`.toUpperCase()`). El punto significa "de este texto, dame...". Los espacios y las comas también cuentan como caracteres.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 3: une "Hola, " con el valor de `nombre`. Línea 4: hace lo mismo con una plantilla; el resultado es idéntico.',
          'Línea 5: `nombre.length` da `5`, porque "Sofía" tiene 5 letras. Línea 6: muestra SOFÍA. La variable `nombre` no cambia: `.toUpperCase()` entrega un texto nuevo.',
          '**Error común:** escribir la plantilla con comillas normales. `"Hola, ${nombre}"` muestra literalmente Hola, ${nombre}. Solución: cambia las dos comillas dobles por comillas invertidas, como en la línea 4 del ejemplo.',
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
          '// TODO 1: crea la variable saludo uniendo textos con nombre y ciudad.',
          '// No escribas "Camila" ni "Bogotá": usa las variables.',
          '',
          '// TODO 2: muestra saludo en la consola.',
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
        codigo: [
          'const equipo = "Colombia";',
          '',
          '// TODO 1: crea grito: "VAMOS, " seguido de equipo en mayúsculas.',
          '',
          '// TODO 2: crea letras: la cantidad de letras de equipo.',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'grito vale "VAMOS, COLOMBIA"', condicion: 'grito === "VAMOS, COLOMBIA"' },
          { descripcion: 'letras vale 8', condicion: 'letras === 8' },
          {
            descripcion: 'grito usa equipo.toUpperCase() (no escribes COLOMBIA a mano)',
            condicion: '/grito\\s*=[^;]*equipo\\.toUpperCase\\(\\)/.test(codigo) && !codigo.includes("COLOMBIA")',
          },
          {
            descripcion: 'letras se calcula con equipo.length (no escribes 8 a mano)',
            condicion: '/letras\\s*=\\s*equipo\\.length/.test(codigo)',
          },
        ],
        pistas: [
          'Necesitas dos herramientas de los textos: una para pasar a mayúsculas y otra para contar.',
          '`equipo.toUpperCase()` da `"COLOMBIA"` y `equipo.length` da cuántas letras tiene. Une el comienzo con `+`.',
          '`const grito = "VAMOS, " + equipo.toUpperCase();` y `const letras = equipo.length;`',
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

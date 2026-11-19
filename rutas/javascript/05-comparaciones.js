globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'comparaciones',
    titulo: 'Comparaciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Verdadero o falso',
        texto: [
          'Al comparar dos valores, el resultado es `true` (verdadero) o `false` (falso). A esos dos valores se les llama **booleanos**.',
          'Comparadores: `===` (igual), `!==` (diferente), `>` (mayor), `<` (menor), `>=` (mayor o igual), `<=` (menor o igual).',
          'Para unir comparaciones: `&&` significa **Y** (las dos deben cumplirse) y `||` significa **O** (basta con una).',
        ],
        codigo: [
          'console.log(5 > 3);',
          'console.log(5 === 5);',
          'console.log("café" === "cafe"); // la tilde cuenta',
          'console.log(10 >= 18);',
          'console.log(5 > 3 && 2 > 1); // Y: las dos se cumplen',
          'console.log(5 > 3 || 2 > 9); // O: basta con una',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Es mayor de edad?',
        texto: [
          'Crea la variable `esMayorDeEdad` comparando `edad` con 18.',
          'Debe quedar en `true` si la edad es 18 o más, y en `false` si no. No escribas `true` o `false` a mano: deja que la comparación lo calcule.',
        ],
        codigo: ['const edad = 17;', '', '// Crea esMayorDeEdad comparando la edad con 18', ''].join('\n'),
        pruebas: [
          { descripcion: 'esMayorDeEdad vale false (porque la edad es 17)', condicion: 'esMayorDeEdad === false' },
          {
            descripcion: 'El valor sale de una comparación con edad',
            condicion: '/esMayorDeEdad\\s*=[^;]*edad/.test(codigo)',
          },
          {
            descripcion: 'La comparación incluye el 18 ("18 o más")',
            condicion: '/>=\\s*18\\b|>\\s*17\\b|\\b18\\s*<=|\\b17\\s*</.test(codigo)',
          },
        ],
        pistas: [
          '"18 o más" se escribe con el comparador `>=`.',
          'La comparación es `edad >= 18`. Guárdala en la variable.',
          '`const esMayorDeEdad = edad >= 18;`',
        ],
        solucion: ['const edad = 17;', '', 'const esMayorDeEdad = edad >= 18;'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la entrada a cine',
        texto: [
          'Crea `puedeEntrar`: es verdadero si la persona tiene 14 años o más **y** además tiene boleta.',
          'Crea `pagaMenos`: es verdadero si la persona tiene menos de 12 años **o** tiene 60 o más.',
        ],
        codigo: [
          'const edad = 15;',
          'const tieneBoleta = true;',
          '',
          '// Crea puedeEntrar',
          '',
          '// Crea pagaMenos',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'puedeEntrar vale true', condicion: 'puedeEntrar === true' },
          { descripcion: 'pagaMenos vale false', condicion: 'pagaMenos === false' },
          { descripcion: 'Usas && para el "y"', condicion: 'codigo.includes("&&")' },
          { descripcion: 'Usas || para el "o"', condicion: 'codigo.includes("||")' },
        ],
        pistas: [
          'La primera une dos condiciones con `&&`: `edad >= 14 && tieneBoleta`',
          'La segunda une dos comparaciones con `||`: `edad < 12 || edad >= 60`',
          'Guarda cada una: `const puedeEntrar = edad >= 14 && tieneBoleta;`',
        ],
        solucion: [
          'const edad = 15;',
          'const tieneBoleta = true;',
          '',
          'const puedeEntrar = edad >= 14 && tieneBoleta;',
          'const pagaMenos = edad < 12 || edad >= 60;',
        ].join('\n'),
      },
    ],
  }
);

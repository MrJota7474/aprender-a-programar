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
          'Pregúntale al computador "¿5 es mayor que 3?" escribiendo `5 > 3`. Te responde `true`, que en inglés significa verdadero.',
          'Al comparar dos valores, el resultado siempre es `true` (verdadero) o `false` (falso). A esos dos valores se les llama **booleanos**.',
          'Los **comparadores** son: `===` (igual), `!==` (diferente), `>` (mayor), `<` (menor), `>=` (mayor o igual), `<=` (menor o igual).',
          'Para unir comparaciones: `&&` significa **Y** (las dos deben cumplirse) y `||` significa **O** (basta con una). El `|` es la barra vertical; en muchos teclados sale con AltGr + 1.',
          'El resultado de una comparación se puede guardar: `const llueve = false;` o `const esCaro = precio > 5000;`',
          '**Ejemplo explicado línea por línea:**',
          'Línea 3: "café" y "cafe" no son iguales porque uno tiene tilde, así que da `false`. Línea 4: 10 no es mayor o igual que 18, da `false`.',
          'Línea 5: las dos comparaciones son verdaderas, así que el **Y** da `true`. Línea 6: la segunda es falsa, pero con **O** basta la primera: da `true`.',
          '**Error común:** comparar con un solo `=`. `edad = 18` no pregunta nada: **guarda** 18 en `edad`. Para preguntar "¿es igual?" se usan tres: `edad === 18`.',
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
        codigo: [
          'const edad = 17;',
          '',
          '// TODO: crea esMayorDeEdad y guarda en ella la comparación',
          '// "¿edad es 18 o más?". El resultado debe salir solo: true o false.',
          '',
        ].join('\n'),
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
          '// TODO 1: crea puedeEntrar: 14 años o más Y tiene boleta.',
          '',
          '// TODO 2: crea pagaMenos: menos de 12 años O 60 o más.',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'puedeEntrar vale true (tiene 15 años y boleta)', condicion: 'puedeEntrar === true' },
          { descripcion: 'pagaMenos vale false (15 no es menor de 12 ni mayor de 60)', condicion: 'pagaMenos === false' },
          {
            descripcion: 'puedeEntrar se calcula con edad, tieneBoleta y && (no escribes true a mano)',
            condicion: '/puedeEntrar\\s*=[^;]*&&/.test(codigo) && /puedeEntrar\\s*=[^;]*edad/.test(codigo) && /puedeEntrar\\s*=[^;]*tieneBoleta/.test(codigo)',
          },
          {
            descripcion: 'pagaMenos se calcula con edad y || (no escribes false a mano)',
            condicion: '/pagaMenos\\s*=[^;]*edad[^;]*\\|\\|[^;]*edad/.test(codigo)',
          },
        ],
        pistas: [
          'Lee cada frase buscando la palabra **y** o la palabra **o**: te dice qué operador usar.',
          'La primera une dos condiciones con `&&`: `edad >= 14 && tieneBoleta`. La segunda une dos comparaciones con `||`: `edad < 12 || edad >= 60`',
          'Guarda cada una: `const puedeEntrar = edad >= 14 && tieneBoleta;` y `const pagaMenos = edad < 12 || edad >= 60;`',
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

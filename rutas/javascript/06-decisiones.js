globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'decisiones',
    titulo: 'Decisiones con if',
    pasos: [
      {
        id: 'idea',
        titulo: 'Si pasa esto, haz aquello',
        texto: [
          'Con `if` (que significa "si") el programa ejecuta un bloque de código **solo si** una condición es verdadera.',
          'Con `else` ("si no") le dices qué hacer cuando la condición es falsa.',
          'El bloque de cada caso va entre llaves `{ }`.',
          'Ejecuta el código. Después cambia la temperatura a 28 y ejecútalo otra vez.',
        ],
        codigo: [
          'const temperatura = 14;',
          '',
          'if (temperatura < 15) {',
          '  console.log("Hace frío, lleva saco");',
          '} else {',
          '  console.log("Está haciendo calor");',
          '}',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Pasó la materia?',
        texto: [
          'En el colegio se aprueba con nota de 3 o más.',
          'Escribe un `if` con su `else`: si `nota` es 3 o más, muestra `Aprobaste`. Si no, muestra `A recuperar`.',
        ],
        codigo: ['const nota = 3.5;', '', '// Escribe aquí tu decisión', ''].join('\n'),
        pruebas: [
          { descripcion: 'Con nota 3.5 muestra Aprobaste', condicion: 'salida.includes("Aprobaste")' },
          { descripcion: 'Con nota 3.5 no muestra A recuperar', condicion: '!salida.includes("A recuperar")' },
          {
            descripcion: 'Usas if y else',
            condicion: '/\\bif\\b/.test(codigo) && /\\belse\\b/.test(codigo)',
          },
          {
            descripcion: 'El caso contrario tiene listo el mensaje A recuperar',
            condicion: '/["\'`]A recuperar["\'`]/.test(codigo)',
          },
          {
            descripcion: 'La nota 3 exacta también aprueba ("3 o más")',
            condicion: '/>=\\s*3\\b|\\b3\\s*<=|<\\s*3\\b|\\b3\\s*>(?!=)/.test(codigo)',
          },
        ],
        pistas: [
          'La condición va entre paréntesis después de `if`: `if (nota >= 3) { ... }`',
          'Dentro de las primeras llaves va `console.log("Aprobaste");`',
          'Después de cerrar la llave escribe `else { console.log("A recuperar"); }`',
        ],
        solucion: [
          'const nota = 3.5;',
          '',
          'if (nota >= 3) {',
          '  console.log("Aprobaste");',
          '} else {',
          '  console.log("A recuperar");',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el saludo según la hora',
        texto: [
          'Cuando hay más de dos casos se usa `else if` para agregar otra condición en el medio.',
          'Muestra `Buenos días` si `hora` es menor que 12, `Buenas tardes` si es menor que 18, y `Buenas noches` en cualquier otro caso.',
        ],
        codigo: [
          'const hora = 20;',
          '',
          'if (hora < 12) {',
          '  console.log("Buenos días");',
          '}',
          '// Agrega aquí el else if y el else',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Con hora 20 muestra Buenas noches', condicion: 'salida.includes("Buenas noches")' },
          { descripcion: 'Muestra un solo saludo', condicion: 'salida.length === 1' },
          { descripcion: 'Usas else if', condicion: '/else\\s+if/.test(codigo)' },
          {
            descripcion: 'También tienes listo el caso de Buenas tardes',
            condicion: '/["\'`]Buenas tardes["\'`]/.test(codigo)',
          },
          {
            descripcion: 'Las tardes van hasta antes de las 18',
            condicion: '/<\\s*18\\b|<=\\s*17\\b|>=\\s*18\\b|>\\s*17\\b/.test(codigo)',
          },
        ],
        pistas: [
          'El `else if` va pegado a la llave que cierra el primer bloque: `} else if (hora < 18) {`',
          'Dentro del `else if` muestra `Buenas tardes`.',
          'Termina con `} else { console.log("Buenas noches"); }`',
        ],
        solucion: [
          'const hora = 20;',
          '',
          'if (hora < 12) {',
          '  console.log("Buenos días");',
          '} else if (hora < 18) {',
          '  console.log("Buenas tardes");',
          '} else {',
          '  console.log("Buenas noches");',
          '}',
        ].join('\n'),
      },
    ],
  }
);

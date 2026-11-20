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
          'Todos los días decides: "si hace frío, llevo saco; si no, salgo en camiseta". Un programa puede decidir igual.',
          'Con `if` (que significa "si") el programa ejecuta un bloque de código **solo si** una **condición** es verdadera. La condición es una comparación como las de la lección anterior y va entre paréntesis.',
          'Con `else` ("si no") le dices qué hacer cuando la condición es falsa.',
          'Un **bloque** es un grupo de instrucciones encerradas entre llaves `{ }`. Las líneas de adentro se corren dos espacios a la derecha (eso se llama **sangría**) para que se vea qué está dentro de qué.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 3: pregunta "¿la temperatura es menor que 15?". Como 14 < 15 es `true`, entra a la línea 4 y muestra "Hace frío, lleva saco".',
          'Línea 5: `else` es el camino contrario. Como ya entró por el `if`, la línea 6 se salta. Solo se ejecuta uno de los dos caminos, nunca ambos.',
          '**Error común:** poner punto y coma después del paréntesis: `if (temperatura < 15); {`. El `;` termina el `if` ahí mismo y el bloque se ejecuta siempre. Si hay `else`, verás `Unexpected token \'else\'` ("else inesperado"). Solución: después del `)` va directo la llave `{`.',
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
        codigo: [
          'const nota = 3.5;',
          '',
          '// TODO 1: escribe un if que pregunte si nota es 3 o más.',
          '//         Dentro de sus llaves, muestra Aprobaste.',
          '// TODO 2: agrega un else que muestre A recuperar.',
          '',
        ].join('\n'),
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
          'Copia la forma del ejemplo de la Idea: `if (...) { ... } else { ... }`. Solo cambian la condición y los mensajes.',
          '"3 o más" se escribe con `>=`. La condición va entre paréntesis después de `if`: `if (nota >= 3) {`',
          'Completo: `if (nota >= 3) { console.log("Aprobaste"); } else { console.log("A recuperar"); }`',
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
          'JavaScript revisa las condiciones en orden, de arriba hacia abajo, y entra **solo en la primera** que se cumpla. Por eso a las 10 no dice "Buenas tardes", aunque 10 también es menor que 18.',
          'Con `hora = 20` la consola debe mostrar un solo mensaje: `Buenas noches`.',
        ],
        codigo: [
          'const hora = 20;',
          '',
          'if (hora < 12) {',
          '  console.log("Buenos días");',
          '}',
          '// TODO 1: pega a la llave de arriba un else if para las horas antes de las 18.',
          '// TODO 2: termina con un else para todas las demás horas.',
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
          'Son tres caminos: mañana, tarde y noche. El primero ya está; te faltan el del medio y el último.',
          'El `else if` va pegado a la llave que cierra el primer bloque: `} else if (hora < 18) {` y adentro muestra `Buenas tardes`.',
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

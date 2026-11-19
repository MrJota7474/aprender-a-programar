globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'decisiones',
    titulo: 'Decisiones con if',
    pasos: [
      {
        id: 'idea',
        titulo: 'Si pasa esto, haz aquello',
        texto: [
          'Con `if` (que significa "si") el programa ejecuta un bloque de código **solo si** una condición es verdadera. Con `else` ("si no") le dices qué hacer en el caso contrario.',
          'La línea del `if` y la del `else` terminan en **dos puntos** `:`.',
          'Lo más importante de Python: el bloque se marca con **sangría**, es decir, 4 espacios al comienzo de la línea. En este editor la tecla Tab los escribe por ti.',
          'Ejecuta el código. Después cambia la temperatura a 28 y ejecútalo otra vez.',
        ],
        codigo: [
          'temperatura = 14',
          '',
          'if temperatura < 15:',
          '    print("Hace frío, lleva saco")',
          'else:',
          '    print("Está haciendo calor")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Pasó la materia?',
        texto: [
          'En el colegio se aprueba con nota de 3 o más.',
          'Escribe un `if` con su `else`: si `nota` es 3 o más, muestra `Aprobaste`. Si no, muestra `A recuperar`.',
        ],
        codigo: ['nota = 3.5', '', '# Escribe aquí tu decisión', ''].join('\n'),
        pruebas: [
          { descripcion: 'Con nota 3.5 muestra Aprobaste', condicion: '"Aprobaste" in salida' },
          { descripcion: 'Con nota 3.5 no muestra A recuperar', condicion: '"A recuperar" not in salida' },
          {
            descripcion: 'Usas if y else',
            condicion:
              're.search(r"\\bif\\b", codigo) is not None and re.search(r"\\belse\\b", codigo) is not None',
          },
          {
            descripcion: 'El caso contrario tiene listo el mensaje A recuperar',
            condicion: '"A recuperar" in codigo',
          },
          {
            descripcion: 'La nota 3 exacta también aprueba ("3 o más")',
            condicion: 're.search(r">=\\s*3(?![\\d.])|\\b3\\s*<=|<\\s*3(?![\\d.])|\\b3\\s*>(?!=)", codigo) is not None',
          },
        ],
        pistas: [
          'La primera línea es `if nota >= 3:` (no olvides los dos puntos).',
          'Debajo, con 4 espacios de sangría: `print("Aprobaste")`',
          'Después, sin sangría, escribe `else:` y debajo, con sangría, `print("A recuperar")`',
        ],
        solucion: [
          'nota = 3.5',
          '',
          'if nota >= 3:',
          '    print("Aprobaste")',
          'else:',
          '    print("A recuperar")',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el saludo según la hora',
        texto: [
          'Cuando hay más de dos casos se usa `elif` (abreviatura de "else if") para agregar otra condición en el medio.',
          'Muestra `Buenos días` si `hora` es menor que 12, `Buenas tardes` si es menor que 18, y `Buenas noches` en cualquier otro caso.',
        ],
        codigo: [
          'hora = 20',
          '',
          'if hora < 12:',
          '    print("Buenos días")',
          '# Agrega aquí el elif y el else',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Con hora 20 muestra Buenas noches', condicion: '"Buenas noches" in salida' },
          { descripcion: 'Muestra un solo saludo', condicion: 'len(salida) == 1' },
          { descripcion: 'Usas elif', condicion: 're.search(r"\\belif\\b", codigo) is not None' },
          {
            descripcion: 'También tienes listo el caso de Buenas tardes',
            condicion: '"Buenas tardes" in codigo',
          },
          {
            descripcion: 'Las tardes van hasta antes de las 18',
            condicion: 're.search(r"<\\s*18(?![\\d.])|<=\\s*17(?![\\d.])|>=\\s*18(?![\\d.])|>\\s*17(?![\\d.])", codigo) is not None',
          },
        ],
        pistas: [
          'El `elif` va sin sangría, a la misma altura del `if`: `elif hora < 18:`',
          'Debajo del `elif`, con sangría, muestra `Buenas tardes`.',
          'Termina con `else:` y debajo, con sangría, `print("Buenas noches")`',
        ],
        solucion: [
          'hora = 20',
          '',
          'if hora < 12:',
          '    print("Buenos días")',
          'elif hora < 18:',
          '    print("Buenas tardes")',
          'else:',
          '    print("Buenas noches")',
        ].join('\n'),
      },
    ],
  }
);

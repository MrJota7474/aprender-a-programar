globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'bucles',
    titulo: 'Bucles',
    pasos: [
      {
        id: 'idea',
        titulo: 'Repetir sin copiar y pegar',
        texto: [
          'Un **bucle** repite un bloque de código varias veces. En Python el más usado es `for`.',
          '`range(1, 6)` produce los números del 1 al 5: empieza en el primero y se detiene **antes** del segundo.',
          'Un `for` también recorre una lista directamente: en cada vuelta la variable toma el siguiente elemento.',
          'Si un bucle nunca termina, esta página lo detiene a los 5 segundos, así que puedes experimentar tranquilo.',
        ],
        codigo: [
          'for i in range(1, 6):',
          '    print("Vuelta número", i)',
          '',
          'frutas = ["mango", "lulo", "mora"]',
          'for fruta in frutas:',
          '    print(fruta)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Del 1 al 10',
        texto: [
          'Escribe un bucle `for` que muestre los números del 1 al 10, uno por línea.',
          'No vale escribir diez veces `print`.',
        ],
        codigo: '# Escribe aquí tu bucle\n',
        pruebas: [
          { descripcion: 'Muestra exactamente 10 líneas', condicion: 'len(salida) == 10' },
          {
            descripcion: 'Empieza en 1 y termina en 10',
            condicion: 'len(salida) == 10 and salida[0] == "1" and salida[9] == "10"',
          },
          { descripcion: 'Usas un bucle for', condicion: 're.search(r"\\bfor\\b", codigo) is not None' },
          {
            descripcion: 'Escribes print una sola vez',
            condicion: 'len(re.findall(r"\\bprint\\s*\\(", codigo)) == 1',
          },
        ],
        pistas: [
          'El bucle empieza así: `for i in range(1, 11):`',
          '¿Por qué 11? Porque `range` se detiene antes del segundo número.',
          'Debajo, con sangría, muestra la variable del bucle: `print(i)`',
        ],
        solucion: ['for i in range(1, 11):', '    print(i)'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: sumar la cuenta',
        texto: [
          'Recorre la lista `precios` con un bucle y ve sumando cada precio a la variable `total`.',
          'El bucle debe hacer la cuenta: no escribas el resultado a mano.',
        ],
        codigo: [
          'precios = [2500, 3000, 1500, 4000]',
          'total = 0',
          '',
          '# Recorre los precios y súmalos al total',
          '',
          'print(total)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'total vale 11000', condicion: 'total == 11000' },
          { descripcion: 'Usas un bucle for', condicion: 're.search(r"\\bfor\\b", codigo) is not None' },
          { descripcion: 'No escribes 11000 a mano', condicion: '"11000" not in codigo' },
        ],
        pistas: [
          'Recorre la lista con `for precio in precios:`',
          'Para acumular, dentro del bucle: `total = total + precio`',
          'Fíjate que `print(total)` quede sin sangría, para que se ejecute una sola vez al final.',
        ],
        solucion: [
          'precios = [2500, 3000, 1500, 4000]',
          'total = 0',
          '',
          'for precio in precios:',
          '    total = total + precio',
          '',
          'print(total)',
        ].join('\n'),
      },
    ],
  }
);

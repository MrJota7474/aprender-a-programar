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
          'Para mostrar los números del 1 al 5 podrías escribir cinco `print`. ¿Y del 1 al 1000? Para eso existen los bucles.',
          'Un **bucle** repite un bloque de código varias veces. Cada repetición se llama **vuelta**. En Python el bucle más usado es `for` ("para cada").',
          '`range(1, 6)` produce los números del 1 al 5: empieza en el primero y se detiene **antes** del segundo.',
          '**Ejemplo explicado línea por línea:** `for i in range(1, 6):` significa "para cada número `i` del 1 al 5". En la primera vuelta `i` vale 1 y se ejecuta la línea con sangría: `Vuelta número 1`. En la segunda `i` vale 2, y así hasta 5. Después el bucle termina solo.',
          'Un `for` también recorre una lista: `for fruta in frutas:` hace una vuelta por cada elemento, y en cada vuelta `fruta` toma el siguiente.',
          'Si un bucle nunca termina, esta página lo detiene a los 5 segundos, así que puedes experimentar tranquilo.',
          '**Error común:** olvidar la sangría de las líneas que se repiten. Solo se repiten las líneas con sangría. Si un `print` queda sin sangría, se ejecuta una sola vez, después del bucle. Y si la línea justo debajo del `for` no tiene sangría, verás `IndentationError: expected an indented block`.',
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
        codigo: [
          '# TODO: escribe un for con range() que vaya del 1 al 10',
          '#       y dentro, con sangría, un solo print del número',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'La consola muestra exactamente 10 líneas', condicion: 'len(salida) == 10' },
          {
            descripcion: 'Muestra los números en orden: 1, 2, 3... hasta 10',
            condicion: 'salida == [str(n) for n in range(1, 11)]',
          },
          { descripcion: 'Usas un bucle for', condicion: 're.search(r"\\bfor\\b", codigo) is not None' },
          {
            descripcion: 'Escribes print una sola vez (el bucle lo repite)',
            condicion: 'len(re.findall(r"\\bprint\\s*\\(", codigo)) == 1',
          },
        ],
        pistas: [
          'Mira el primer bucle del ejemplo: hace casi lo mismo, pero del 1 al 5.',
          'Usa `range(1, 11)`. ¿Por qué 11? Porque `range` se detiene antes del segundo número.',
          'Queda así: `for i in range(1, 11):` y debajo, con sangría, `print(i)`',
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
          '# TODO: recorre precios con un for',
          '#       y en cada vuelta suma el precio a total',
          '',
          'print(total)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El total de la cuenta es 11000', condicion: 'total == 11000' },
          { descripcion: 'Usas un bucle for que recorre precios', condicion: 're.search(r"\\bfor\\s+\\w+\\s+in\\s+precios\\b", codigo) is not None' },
          {
            descripcion: 'Dentro del bucle vas sumando al total, sin escribir los precios a mano',
            condicion: 're.search(r"total\\s*(\\+=|=\\s*total\\s*\\+)", codigo) is not None and "11000" not in codigo and "2500 +" not in codigo',
          },
        ],
        pistas: [
          'La idea es como sumar en la calculadora: empiezas en 0 y a cada precio le vas sumando el siguiente.',
          'Recorre la lista con `for precio in precios:` y dentro del bucle actualiza `total`.',
          'Dentro del bucle, con sangría: `total = total + precio`. Deja `print(total)` sin sangría, para que se muestre una sola vez al final.',
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

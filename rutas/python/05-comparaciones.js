globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'comparaciones',
    titulo: 'Comparaciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Verdadero o falso',
        texto: [
          'Pregúntale a Python "¿5 es mayor que 3?" escribiendo `print(5 > 3)`. Responde `True`, que significa **verdadero**. Si preguntas `print(10 >= 18)`, responde `False`: **falso**.',
          '`True` y `False` se escriben con la primera letra en mayúscula. A esos dos valores se les llama **booleanos**.',
          'Los signos para comparar son: `==` (igual), `!=` (diferente), `>` (mayor), `<` (menor), `>=` (mayor o igual) y `<=` (menor o igual).',
          'El resultado de una comparación se puede guardar en una variable: `es_alto = estatura > 180` deja en `es_alto` un `True` o un `False`.',
          'Para unir comparaciones Python usa palabras: `and` (**y**: las dos deben cumplirse), `or` (**o**: basta con una) y `not` (**no**: lo contrario).',
          '**Error común:** confundir `=` con `==`. Un solo `=` guarda un valor; dos `==` preguntan si son iguales. Si escribes `print(5 = 5)`, Python responde con un `SyntaxError` (un error de escritura). Lo correcto es `print(5 == 5)`.',
        ],
        codigo: [
          'print(5 > 3)',
          'print(5 == 5)',
          'print("café" == "cafe")  # la tilde cuenta',
          'print(10 >= 18)',
          'print(5 > 3 and 2 > 1)  # y: las dos se cumplen',
          'print(5 > 3 or 2 > 9)   # o: basta con una',
          'print(not True)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Es mayor de edad?',
        texto: [
          'Crea la variable `es_mayor_de_edad` comparando `edad` con 18.',
          'Debe quedar en `True` si la edad es 18 o más, y en `False` si no. No escribas `True` o `False` a mano: deja que la comparación lo calcule.',
        ],
        codigo: ['edad = 17', '', '# TODO: crea es_mayor_de_edad comparando edad con 18 (sin escribir True ni False)', ''].join('\n'),
        pruebas: [
          {
            descripcion: 'es_mayor_de_edad vale False (porque la edad es 17)',
            condicion: 'es_mayor_de_edad is False',
          },
          {
            descripcion: 'El valor sale de una comparación con edad',
            condicion: 're.search(r"es_mayor_de_edad\\s*=[^\\n]*edad", codigo) is not None',
          },
          {
            descripcion: 'La comparación incluye el 18 ("18 o más")',
            condicion: 're.search(r">=\\s*18(?![\\d.])|>\\s*17(?![\\d.])|\\b18\\s*<=|\\b17\\s*<", codigo) is not None',
          },
        ],
        pistas: [
          '"18 o más" se escribe con el comparador `>=`.',
          'La comparación es `edad >= 18`. Guárdala en la variable.',
          '`es_mayor_de_edad = edad >= 18`',
        ],
        solucion: ['edad = 17', '', 'es_mayor_de_edad = edad >= 18'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la entrada a cine',
        texto: [
          'Crea `puede_entrar`: es verdadero si la persona tiene 14 años o más **y** además tiene boleta.',
          'Crea `paga_menos`: es verdadero si la persona tiene menos de 12 años **o** tiene 60 o más.',
        ],
        codigo: [
          'edad = 15',
          'tiene_boleta = True',
          '',
          '# TODO: crea puede_entrar (14 años o más Y tiene boleta)',
          '',
          '# TODO: crea paga_menos (menos de 12 años O 60 o más)',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Una persona de 15 años con boleta puede entrar (True)', condicion: 'puede_entrar is True' },
          { descripcion: 'Una persona de 15 años no paga menos (False)', condicion: 'paga_menos is False' },
          {
            descripcion: 'puede_entrar se calcula con and, usando edad y tiene_boleta',
            condicion: 're.search(r"puede_entrar\\s*=[^\\n]*edad[^\\n]*\\band\\b|puede_entrar\\s*=[^\\n]*\\band\\b[^\\n]*edad", codigo) is not None',
          },
          {
            descripcion: 'paga_menos se calcula con or, comparando la edad dos veces',
            condicion: 're.search(r"paga_menos\\s*=[^\\n]*edad[^\\n]*\\bor\\b[^\\n]*edad", codigo) is not None',
          },
        ],
        pistas: [
          'Cada variable une dos condiciones. "Y" significa que deben cumplirse las dos; "o" que basta con una.',
          'Usa `and` para la primera y `or` para la segunda. Las comparaciones son `>=` y `<`.',
          'Casi listo: `puede_entrar = edad >= 14 and tiene_boleta` y `paga_menos = edad < 12 or edad >= ...`',
        ],
        solucion: [
          'edad = 15',
          'tiene_boleta = True',
          '',
          'puede_entrar = edad >= 14 and tiene_boleta',
          'paga_menos = edad < 12 or edad >= 60',
        ].join('\n'),
      },
    ],
  }
);

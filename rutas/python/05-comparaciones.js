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
          'Al comparar dos valores, el resultado es `True` (verdadero) o `False` (falso), con la primera letra en mayúscula. A esos dos valores se les llama **booleanos**.',
          'Comparadores: `==` (igual), `!=` (diferente), `>` (mayor), `<` (menor), `>=` (mayor o igual), `<=` (menor o igual).',
          'Ojo: un solo `=` guarda un valor; dos `==` preguntan si dos valores son iguales.',
          'Para unir comparaciones Python usa palabras: `and` (**y**: las dos deben cumplirse), `or` (**o**: basta con una) y `not` (**no**: lo contrario).',
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
        codigo: ['edad = 17', '', '# Crea es_mayor_de_edad comparando la edad con 18', ''].join('\n'),
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
          '# Crea puede_entrar',
          '',
          '# Crea paga_menos',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'puede_entrar vale True', condicion: 'puede_entrar is True' },
          { descripcion: 'paga_menos vale False', condicion: 'paga_menos is False' },
          { descripcion: 'Usas and para el "y"', condicion: 're.search(r"\\band\\b", codigo) is not None' },
          { descripcion: 'Usas or para el "o"', condicion: 're.search(r"\\bor\\b", codigo) is not None' },
        ],
        pistas: [
          'La primera une dos condiciones con `and`: `edad >= 14 and tiene_boleta`',
          'La segunda une dos comparaciones con `or`: `edad < 12 or edad >= 60`',
          'Guarda cada una: `puede_entrar = edad >= 14 and tiene_boleta`',
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

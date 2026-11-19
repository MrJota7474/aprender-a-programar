globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'textos',
    titulo: 'Textos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Unir y transformar textos',
        texto: [
          'Los textos (en inglés, **strings**) se pueden unir con `+`.',
          'Otra forma más cómoda es el **f-string**: una `f` antes de las comillas te deja poner variables dentro de llaves `{ }`.',
          '`len()` dice cuántas letras tiene un texto y `.upper()` lo pasa a mayúsculas.',
        ],
        codigo: [
          'nombre = "Sofía"',
          '',
          'print("Hola, " + nombre)',
          'print(f"Hola, {nombre}")  # f-string',
          'print(len(nombre))',
          'print(nombre.upper())',
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
          'nombre = "Camila"',
          'ciudad = "Bogotá"',
          '',
          '# Crea la variable saludo usando las dos variables de arriba',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'saludo vale "Me llamo Camila y vivo en Bogotá"',
            condicion: 'saludo == "Me llamo Camila y vivo en Bogotá"',
          },
          { descripcion: 'Muestras el saludo en la consola', condicion: 'mostrado(saludo)' },
          {
            descripcion: 'Usas las variables (no escribes el nombre a mano en la frase)',
            condicion: '"Me llamo Camila" not in codigo',
          },
        ],
        pistas: [
          'Con un f-string las variables van entre llaves: `f"Me llamo {nombre} ..."`',
          'Cuidado con los espacios alrededor de `y vivo en`.',
          'Una solución: `saludo = f"Me llamo {nombre} y vivo en {ciudad}"`',
        ],
        solucion: [
          'nombre = "Camila"',
          'ciudad = "Bogotá"',
          '',
          'saludo = f"Me llamo {nombre} y vivo en {ciudad}"',
          'print(saludo)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la barra',
        texto: [
          'Crea la variable `grito` con el texto `VAMOS, COLOMBIA`, pasando `equipo` a mayúsculas con `.upper()`.',
          'Crea la variable `letras` con la cantidad de letras que tiene `equipo`, usando `len()`.',
        ],
        codigo: ['equipo = "Colombia"', '', '# Crea grito y letras', ''].join('\n'),
        pruebas: [
          { descripcion: 'grito vale "VAMOS, COLOMBIA"', condicion: 'grito == "VAMOS, COLOMBIA"' },
          { descripcion: 'letras vale 8', condicion: 'letras == 8' },
          { descripcion: 'Usas .upper()', condicion: '".upper()" in codigo' },
          { descripcion: 'Usas len()', condicion: 're.search(r"\\blen\\s*\\(", codigo) is not None' },
        ],
        pistas: [
          '`equipo.upper()` da como resultado `"COLOMBIA"`.',
          'Une el comienzo con el equipo en mayúsculas: `"VAMOS, " + equipo.upper()`',
          'Para las letras: `letras = len(equipo)`',
        ],
        solucion: ['equipo = "Colombia"', '', 'grito = "VAMOS, " + equipo.upper()', 'letras = len(equipo)'].join('\n'),
      },
    ],
  }
);

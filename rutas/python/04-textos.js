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
          'Si `nombre = "Sofía"`, ¿cómo muestras `Hola, Sofía`? Hay que **unir** el texto `"Hola, "` con lo que hay en la variable.',
          'Un texto se llama en inglés **string**. Dos textos se unen con `+`: `"Hola, " + nombre` da `Hola, Sofía`. Fíjate en el espacio después de la coma: `+` no agrega espacios por su cuenta.',
          'Otra forma más cómoda es el **f-string**: pones una `f` justo antes de las comillas y escribes las variables dentro de llaves `{ }`. `f"Hola, {nombre}"` también da `Hola, Sofía`.',
          'Dos herramientas útiles: `len(nombre)` cuenta los caracteres (letras, espacios y signos) y da `5`. `nombre.upper()` devuelve el texto en mayúsculas: `SOFÍA`.',
          'A `.upper()` se le llama **método**: una acción que trae el texto y se escribe con un punto después de él. No cambia la variable: te da un texto nuevo.',
          '**Error común:** unir un texto con un número usando `+`. `"Tengo " + 16` falla con `TypeError: can only concatenate str (not "int") to str` (solo se puede unir texto con texto). Arréglalo con un f-string, `f"Tengo {16}"`, o convirtiendo el número a texto con `str(16)`.',
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
          '# TODO: crea la variable saludo con un f-string que use {nombre} y {ciudad}',
          '',
          '# TODO: muestra saludo con print()',
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
          'La frase tiene partes fijas ("Me llamo", "y vivo en") y partes que salen de las variables.',
          'Usa un f-string: una `f` antes de las comillas y las variables entre llaves, como `{nombre}`. Cuida los espacios.',
          'Casi listo: `saludo = f"Me llamo {nombre} y vivo en {...}"` y luego `print(saludo)`',
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
        codigo: [
          'equipo = "Colombia"',
          '',
          '# TODO: crea grito uniendo "VAMOS, " con equipo en mayúsculas',
          '',
          '# TODO: crea letras con la cantidad de letras de equipo',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'grito tiene el texto VAMOS, COLOMBIA', condicion: 'grito == "VAMOS, COLOMBIA"' },
          { descripcion: 'letras cuenta las 8 letras de Colombia', condicion: 'letras == 8' },
          {
            descripcion: 'Las mayúsculas salen de equipo.upper(), no escritas a mano',
            condicion: '"equipo.upper()" in codigo and "COLOMBIA" not in codigo',
          },
          {
            descripcion: 'La cantidad sale de len(equipo), no escrita a mano',
            condicion: 're.search(r"\\blen\\s*\\(\\s*equipo", codigo) is not None and re.search(r"letras\\s*=\\s*8", codigo) is None',
          },
        ],
        pistas: [
          'El grito tiene una parte fija (`"VAMOS, "`) y otra que sale de `equipo` en mayúsculas.',
          'Las herramientas son `.upper()` para las mayúsculas, `+` para unir y `len()` para contar.',
          'Casi listo: `grito = "VAMOS, " + equipo.upper()` y `letras = len(...)`',
        ],
        solucion: ['equipo = "Colombia"', '', 'grito = "VAMOS, " + equipo.upper()', 'letras = len(equipo)'].join('\n'),
      },
    ],
  }
);

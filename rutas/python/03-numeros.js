globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'numeros',
    titulo: 'Números y operaciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Python como calculadora',
        texto: [
          'Si una empanada vale 2000 y le sumas una salsa de 500, ¿cuánto pagas? Python lo calcula: `print(2000 + 500)` muestra `2500`.',
          'Los signos que hacen cuentas se llaman **operadores**: `+` suma, `-` resta, `*` multiplica (es el asterisco, no la x) y `/` divide.',
          'La división con `/` siempre da un número con decimales: `9000 / 3` da `3000.0`. Si quieres el resultado sin decimales, usa `//` (**división entera**): `9000 // 3` da `3000`.',
          'El operador `%` da el **residuo**: lo que sobra al repartir. `7 % 2` da `1`, porque al repartir 7 en grupos de 2 sobra 1. Y `**` es potencia: `2 ** 3` es 2 × 2 × 2 = 8.',
          'Las cuentas también funcionan con variables: si `precio = 2000`, entonces `precio * 3` da `6000`. Python respeta el orden de la matemática: primero multiplica y divide, después suma y resta.',
          '**Error común:** escribir los miles con punto o con coma, como en el papel: `2.500` o `2,500`. Para Python, `2.500` es dos punto cinco (2,5) y `2,500` son dos números separados. Escribe los números sin separadores: `2500`.',
        ],
        codigo: [
          'print(2000 + 500)',
          'print(3 * 2500)',
          'print(9000 / 3)   # siempre da decimales',
          'print(9000 // 3)  # división entera',
          'print(7 % 2)      # residuo de dividir 7 entre 2',
          'print(2 ** 3)     # 2 elevado a la 3',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'La cuenta de la tienda',
        texto: [
          'Compras **3 empanadas** y **1 gaseosa**.',
          'Usa las variables `precio_empanada` y `precio_gaseosa` para calcular el `total`.',
        ],
        codigo: [
          'precio_empanada = 2500',
          'precio_gaseosa = 3000',
          '',
          '# TODO: cambia el 0 por la cuenta de 3 empanadas más 1 gaseosa,',
          '# usando las dos variables de arriba',
          'total = 0',
          'print(total)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El total es 10500', condicion: 'total == 10500' },
          { descripcion: 'Muestras el total en la consola', condicion: 'mostrado(10500)' },
          {
            descripcion: 'Usas las variables de los precios en la operación',
            condicion: 'codigo.count("precio_empanada") >= 2 and "10500" not in codigo',
          },
        ],
        pistas: [
          'Tres empanadas cuestan `3 * precio_empanada`.',
          'A eso súmale la gaseosa: `3 * precio_empanada + precio_gaseosa`',
          'La línea queda: `total = 3 * precio_empanada + precio_gaseosa`',
        ],
        solucion: [
          'precio_empanada = 2500',
          'precio_gaseosa = 3000',
          '',
          'total = 3 * precio_empanada + precio_gaseosa',
          'print(total)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: las vueltas',
        texto: [
          'La cuenta fue de 10500 y pagas con un billete de 20000.',
          'Crea la variable `vueltas` con lo que te devuelven.',
          'Crea la variable `por_persona` con lo que paga cada uno si la cuenta se divide entre 3 amigos.',
        ],
        codigo: [
          'total = 10500',
          'billete = 20000',
          '',
          '# TODO 1: crea vueltas con lo que te devuelven (usa billete y total)',
          '',
          '# TODO 2: crea por_persona con lo que paga cada uno de los 3 amigos',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Las vueltas son 9500 pesos', condicion: 'vueltas == 9500' },
          { descripcion: 'Cada amigo paga 3500 pesos', condicion: 'por_persona == 3500' },
          {
            descripcion: 'Calculas con las variables billete y total, sin escribir el resultado a mano',
            condicion: 'codigo.count("billete") >= 2 and "9500" not in codigo and "3500" not in codigo',
          },
        ],
        pistas: [
          'Las vueltas son lo que pagaste menos lo que costaba. Para repartir entre 3, se divide.',
          'Usa `-` para restar y `//` para dividir sin decimales.',
          'Las líneas quedan casi así: `vueltas = billete - ...` y `por_persona = total // ...`',
        ],
        solucion: ['total = 10500', 'billete = 20000', '', 'vueltas = billete - total', 'por_persona = total // 3'].join('\n'),
      },
    ],
  }
);

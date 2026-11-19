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
          'Python hace cuentas con `+` (suma), `-` (resta), `*` (multiplicación) y `/` (división).',
          'La división con `/` siempre da un número con decimales (`3000.0`). Si quieres el resultado entero, usa `//`.',
          'El operador `%` da el **residuo** de una división y `**` eleva a una potencia.',
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
          '# Cambia el 0 por la operación correcta',
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
          '# 1. ¿Cuánto te devuelven?',
          '',
          '# 2. ¿Cuánto paga cada uno de los 3 amigos?',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'vueltas vale 9500', condicion: 'vueltas == 9500' },
          { descripcion: 'por_persona vale 3500', condicion: 'por_persona == 3500' },
        ],
        pistas: [
          'Las vueltas son el billete menos el total.',
          '`vueltas = billete - total`',
          'Para repartir se divide: `por_persona = total // 3`',
        ],
        solucion: ['total = 10500', 'billete = 20000', '', 'vueltas = billete - total', 'por_persona = total // 3'].join('\n'),
      },
    ],
  }
);

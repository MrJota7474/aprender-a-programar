globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'numeros',
    titulo: 'Números y operaciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'El computador como calculadora',
        texto: [
          'JavaScript hace cuentas con `+` (suma), `-` (resta), `*` (multiplicación) y `/` (división).',
          'El operador `%` da el **residuo** de una división. Sirve, por ejemplo, para saber si un número es par.',
          'Igual que en matemáticas, primero se multiplica y divide, y después se suma y resta. Los paréntesis cambian ese orden.',
        ],
        codigo: [
          'console.log(2000 + 500);',
          'console.log(10000 - 3500);',
          'console.log(3 * 2500);',
          'console.log(9000 / 3);',
          'console.log(7 % 2); // residuo de dividir 7 entre 2',
          'console.log((1000 + 500) * 2);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'La cuenta de la tienda',
        texto: [
          'Compras **3 empanadas** y **1 gaseosa**.',
          'Usa las variables `precioEmpanada` y `precioGaseosa` para calcular el `total`.',
        ],
        codigo: [
          'const precioEmpanada = 2500;',
          'const precioGaseosa = 3000;',
          '',
          '// Cambia el 0 por la operación correcta',
          'let total = 0;',
          'console.log(total);',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El total es 10500', condicion: 'total === 10500' },
          { descripcion: 'Muestras el total en la consola', condicion: 'salida.includes("10500")' },
          {
            descripcion: 'Usas las variables de los precios en la operación',
            condicion: '/total\\s*=[^;]*precioEmpanada/.test(codigo)',
          },
        ],
        pistas: [
          'Tres empanadas cuestan `3 * precioEmpanada`.',
          'A eso súmale la gaseosa: `3 * precioEmpanada + precioGaseosa`',
          'La línea queda: `let total = 3 * precioEmpanada + precioGaseosa;`',
        ],
        solucion: [
          'const precioEmpanada = 2500;',
          'const precioGaseosa = 3000;',
          '',
          'let total = 3 * precioEmpanada + precioGaseosa;',
          'console.log(total);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: las vueltas',
        texto: [
          'La cuenta fue de 10500 y pagas con un billete de 20000.',
          'Crea la variable `vueltas` con lo que te devuelven.',
          'Crea la variable `porPersona` con lo que paga cada uno si la cuenta se divide entre 3 amigos.',
        ],
        codigo: [
          'const total = 10500;',
          'const billete = 20000;',
          '',
          '// 1. ¿Cuánto te devuelven?',
          '',
          '// 2. ¿Cuánto paga cada uno de los 3 amigos?',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'vueltas vale 9500', condicion: 'vueltas === 9500' },
          { descripcion: 'porPersona vale 3500', condicion: 'porPersona === 3500' },
        ],
        pistas: [
          'Las vueltas son el billete menos el total.',
          '`const vueltas = billete - total;`',
          'Para repartir se divide: `const porPersona = total / 3;`',
        ],
        solucion: [
          'const total = 10500;',
          'const billete = 20000;',
          '',
          'const vueltas = billete - total;',
          'const porPersona = total / 3;',
        ].join('\n'),
      },
    ],
  }
);

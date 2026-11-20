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
          'Si un tinto vale 2000 y un pandebono 500, ¿cuánto pagas por los dos? `console.log(2000 + 500);` muestra `2500`. El computador hace la cuenta por ti.',
          'Los signos de las cuentas se llaman **operadores**: `+` (suma), `-` (resta), `*` (multiplicación, con asterisco, no con x) y `/` (división).',
          'El operador `%` da el **residuo**: lo que sobra de una división. 7 entre 2 da 3 y sobra 1, así que `7 % 2` es `1`. Sirve, por ejemplo, para saber si un número es par (el residuo entre 2 es 0).',
          'Igual que en matemáticas, primero se multiplica y divide, y después se suma y resta. Los paréntesis cambian ese orden: `1000 + 500 * 2` da 2000, pero `(1000 + 500) * 2` da 3000.',
          'Los números se escriben **sin puntos de miles**: `10000`, no `10.000`. En JavaScript el punto es la coma decimal: `2.5` es dos y medio.',
          '**Error común:** poner el número entre comillas. `"2000" + 500` no da 2500 sino `2000500`, porque con comillas es un texto y `+` lo pega con el otro. Solución: los números van sin comillas.',
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
          '// TODO: cambia el 0 por la operación: 3 empanadas más 1 gaseosa.',
          '// Usa los nombres de las variables, no los números.',
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
          'Calcula con las variables `total` y `billete`, no escribas el resultado a mano: si la cuenta cambia, tu programa debe seguir acertando.',
        ],
        codigo: [
          'const total = 10500;',
          'const billete = 20000;',
          '',
          '// TODO 1: crea vueltas: ¿cuánto te devuelven del billete?',
          '',
          '// TODO 2: crea porPersona: ¿cuánto paga cada uno de los 3 amigos?',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'vueltas vale 9500', condicion: 'vueltas === 9500' },
          {
            descripcion: 'Calculas vueltas con billete y total (no escribes 9500 a mano)',
            condicion: '/vueltas\\s*=[^;]*billete[^;]*total/.test(codigo)',
          },
          { descripcion: 'porPersona vale 3500', condicion: 'porPersona === 3500' },
          {
            descripcion: 'Calculas porPersona dividiendo el total',
            condicion: '/porPersona\\s*=[^;]*total\\s*\\//.test(codigo)',
          },
        ],
        pistas: [
          'Las vueltas son lo que sobra del billete después de pagar. Repartir entre 3 es dividir.',
          'Usa `-` para las vueltas y `/` para repartir, con los nombres `billete` y `total`.',
          'Las dos líneas son `const vueltas = billete - total;` y `const porPersona = total / 3;`',
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

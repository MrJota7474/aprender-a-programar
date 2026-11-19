globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'bucles',
    titulo: 'Bucles',
    pasos: [
      {
        id: 'idea',
        titulo: 'Repetir sin copiar y pegar',
        texto: [
          'Un **bucle** repite un bloque de código varias veces.',
          'El `for` clásico tiene tres partes separadas por punto y coma: dónde empieza (`let i = 1`), hasta cuándo sigue (`i <= 5`) y cómo avanza (`i++`, que le suma 1 a `i`).',
          'Para recorrer un arreglo hay una forma más corta: `for (const fruta of frutas)`.',
          'Si un bucle nunca termina, esta página lo detiene a los 3 segundos, así que puedes experimentar tranquilo.',
        ],
        codigo: [
          'for (let i = 1; i <= 5; i++) {',
          '  console.log("Vuelta número " + i);',
          '}',
          '',
          'const frutas = ["mango", "lulo", "mora"];',
          'for (const fruta of frutas) {',
          '  console.log(fruta);',
          '}',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Del 1 al 10',
        texto: [
          'Escribe un bucle `for` que muestre los números del 1 al 10, uno por línea.',
          'No vale escribir diez veces `console.log`.',
        ],
        codigo: '// Escribe aquí tu bucle\n',
        pruebas: [
          { descripcion: 'Muestra exactamente 10 líneas', condicion: 'salida.length === 10' },
          {
            descripcion: 'Empieza en 1 y termina en 10',
            condicion: 'salida[0] === "1" && salida[9] === "10"',
          },
          { descripcion: 'Usas un bucle for', condicion: '/\\bfor\\s*\\(/.test(codigo)' },
          {
            descripcion: 'Escribes console.log una sola vez',
            condicion: 'codigo.split("console.log").length === 2',
          },
        ],
        pistas: [
          'El esqueleto es: `for (let i = 1; i <= 10; i++) { }`',
          'Dentro de las llaves muestra la variable del bucle: `console.log(i);`',
        ],
        solucion: ['for (let i = 1; i <= 10; i++) {', '  console.log(i);', '}'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: sumar la cuenta',
        texto: [
          'Recorre el arreglo `precios` con un bucle y ve sumando cada precio a la variable `total`.',
          'El bucle debe hacer la cuenta: no escribas el resultado a mano.',
        ],
        codigo: [
          'const precios = [2500, 3000, 1500, 4000];',
          'let total = 0;',
          '',
          '// Recorre los precios y súmalos al total',
          '',
          'console.log(total);',
        ].join('\n'),
        pruebas: [
          { descripcion: 'total vale 11000', condicion: 'total === 11000' },
          { descripcion: 'Usas un bucle for', condicion: '/\\bfor\\s*\\(/.test(codigo)' },
          { descripcion: 'No escribes 11000 a mano', condicion: '!codigo.includes("11000")' },
        ],
        pistas: [
          'Recorre el arreglo con `for (const precio of precios) { }`',
          'Para acumular: `total = total + precio;`',
          'Completo: `for (const precio of precios) { total = total + precio; }`',
        ],
        solucion: [
          'const precios = [2500, 3000, 1500, 4000];',
          'let total = 0;',
          '',
          'for (const precio of precios) {',
          '  total = total + precio;',
          '}',
          '',
          'console.log(total);',
        ].join('\n'),
      },
    ],
  }
);

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
          'Para mostrar los números del 1 al 5 podrías escribir cinco veces `console.log`. Del 1 al 1000 ya no sería práctico. Un bucle lo hace por ti.',
          'Un **bucle** repite un bloque de código varias veces. Cada repetición se llama **vuelta** (o iteración).',
          'El `for` clásico tiene tres partes separadas por punto y coma: dónde empieza (`let i = 1`), hasta cuándo sigue (`i <= 5`) y cómo avanza (`i++`, que le suma 1 a `i`). La `i` es una variable contador; se llama así por costumbre.',
          'Para recorrer un arreglo hay una forma más corta: `for (const fruta of frutas)`. Se lee "por cada fruta de frutas": en cada vuelta, `fruta` vale el siguiente elemento.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: `i` empieza en 1. Antes de cada vuelta pregunta "¿i <= 5?". Si es `true`, ejecuta la línea 2; luego `i++` la sube a 2 y vuelve a preguntar. Cuando `i` llega a 6, la respuesta es `false` y el bucle termina.',
          'Línea 6: en la primera vuelta `fruta` vale "mango", en la segunda "lulo" y en la tercera "mora". Después se acaba la lista y el bucle para.',
          '**Error común:** un bucle que nunca termina. Si escribes `i--` en vez de `i++`, `i` baja y siempre será menor que 5. Esta página lo detiene a los 3 segundos y te avisa, así que puedes experimentar tranquilo.',
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
        codigo: [
          '// TODO 1: escribe un for con sus tres partes: empieza en 1,',
          '//         sigue mientras sea 10 o menos, y avanza de 1 en 1.',
          '// TODO 2: dentro de las llaves, muestra el contador.',
          '',
        ].join('\n'),
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
          'Copia el primer bucle del ejemplo de la Idea y cambia hasta dónde llega.',
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
          'El bucle debe hacer la cuenta: no escribas el resultado a mano. Al final la consola debe mostrar `11000`.',
          'La idea se llama **acumular**: `total` empieza en 0 y en cada vuelta le sumas un precio. Vuelta 1: 0 + 2500 = 2500. Vuelta 2: 2500 + 3000 = 5500. Y así hasta el final.',
        ],
        codigo: [
          'const precios = [2500, 3000, 1500, 4000];',
          'let total = 0;',
          '',
          '// TODO 1: recorre precios con un for...of.',
          '// TODO 2: en cada vuelta, súmale el precio actual a total.',
          '',
          'console.log(total);',
        ].join('\n'),
        pruebas: [
          { descripcion: 'total vale 11000', condicion: 'total === 11000' },
          { descripcion: 'Usas un bucle for', condicion: '/\\bfor\\s*\\(/.test(codigo)' },
          {
            descripcion: 'El bucle recorre el arreglo precios',
            condicion: '/for\\s*\\([^)]*\\bof\\s+precios\\b/.test(codigo) || /precios\\s*\\[/.test(codigo)',
          },
          {
            descripcion: 'Dentro del bucle le sumas algo a total',
            condicion: '/total\\s*(\\+=|=\\s*total\\s*\\+)/.test(codigo)',
          },
          { descripcion: 'No escribes 11000 a mano', condicion: '!codigo.includes("11000")' },
        ],
        pistas: [
          'Necesitas un bucle que pase por cada precio y, en cada vuelta, haga crecer `total`.',
          'Recorre el arreglo con `for (const precio of precios) { }` y adentro acumula con `total = total + precio;`',
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

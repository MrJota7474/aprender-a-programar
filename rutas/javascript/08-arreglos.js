globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'arreglos',
    titulo: 'Arreglos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Listas de valores',
        texto: [
          'Un **arreglo** (en inglés, **array**) es una lista de valores guardada en una sola variable. Se escribe entre corchetes `[ ]`, con los valores separados por comas.',
          'Cada valor tiene una posición, y se cuenta **desde 0**: el primero es `frutas[0]`.',
          '`.length` dice cuántos valores hay y `.push()` agrega uno al final.',
        ],
        codigo: [
          'const frutas = ["mango", "lulo", "guanábana"];',
          '',
          'console.log(frutas[0]); // el primero está en la posición 0',
          'console.log(frutas.length); // cuántos hay',
          '',
          'frutas.push("maracuyá"); // agrega uno al final',
          'console.log(frutas);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Tres ciudades',
        texto: [
          'Crea un arreglo `ciudades` con los nombres de tres ciudades de Colombia.',
          'Muestra la primera ciudad y después muestra cuántas ciudades hay usando `.length`.',
        ],
        codigo: '// Crea aquí el arreglo ciudades\n',
        pruebas: [
          {
            descripcion: 'ciudades es un arreglo con 3 elementos',
            condicion: 'Array.isArray(ciudades) && ciudades.length === 3',
          },
          { descripcion: 'Muestras la primera ciudad', condicion: 'salida.includes(ciudades[0])' },
          { descripcion: 'Muestras cuántas hay (3)', condicion: 'salida.includes("3")' },
          { descripcion: 'Usas .length', condicion: 'codigo.includes(".length")' },
        ],
        pistas: [
          'El arreglo se crea así: `const ciudades = ["Cali", "Tunja", "Leticia"];`',
          'La primera está en la posición 0: `console.log(ciudades[0]);`',
          'La cantidad: `console.log(ciudades.length);`',
        ],
        solucion: [
          'const ciudades = ["Cali", "Tunja", "Leticia"];',
          'console.log(ciudades[0]);',
          'console.log(ciudades.length);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la lista del mercado',
        texto: [
          'Agrega `"café"` y `"huevos"` (en ese orden) al final de `mercado` usando `.push()`.',
          'Después crea la variable `ultimo` con el último elemento de la lista. Como las posiciones empiezan en 0, el último siempre está en la posición `mercado.length - 1`.',
        ],
        codigo: [
          'const mercado = ["arroz", "panela"];',
          '',
          '// 1. Agrega "café" y "huevos"',
          '',
          '// 2. Guarda el último elemento en la variable ultimo',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'mercado tiene 4 elementos', condicion: 'mercado.length === 4' },
          {
            descripcion: 'Los dos últimos son "café" y "huevos"',
            condicion: 'mercado[2] === "café" && mercado[3] === "huevos"',
          },
          { descripcion: 'ultimo vale "huevos"', condicion: 'ultimo === "huevos"' },
          {
            descripcion: 'Calculas la última posición con length - 1',
            condicion: '/length\\s*-\\s*1/.test(codigo)',
          },
        ],
        pistas: [
          'Cada elemento se agrega con su propio push: `mercado.push("café");`',
          'La posición del último es `mercado.length - 1`.',
          '`const ultimo = mercado[mercado.length - 1];`',
        ],
        solucion: [
          'const mercado = ["arroz", "panela"];',
          '',
          'mercado.push("café");',
          'mercado.push("huevos");',
          '',
          'const ultimo = mercado[mercado.length - 1];',
        ].join('\n'),
      },
    ],
  }
);

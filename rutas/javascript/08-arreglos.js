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
          'Si quieres guardar tres frutas, podrías crear `fruta1`, `fruta2` y `fruta3`. Pero ¿y si son cien? Para eso hay listas.',
          'Un **arreglo** (en inglés, **array**) es una lista de valores guardada en una sola variable. Se escribe entre corchetes `[ ]`, con los valores separados por comas.',
          'Cada valor de la lista se llama **elemento** y tiene una **posición** (también se dice **índice**). Las posiciones se cuentan **desde 0**: el primero es `frutas[0]`, el segundo `frutas[1]`.',
          '`.length` dice cuántos elementos hay y `.push()` agrega uno al final.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: crea la lista con 3 frutas. Línea 3: `frutas[0]` es la posición 0, o sea "mango". Línea 4: muestra 3, la cantidad de elementos.',
          'Línea 6: agrega "maracuyá" al final; ahora la lista tiene 4. Aunque es `const`, la lista sí puede crecer: `const` solo impide cambiarla por **otra** lista.',
          '**Error común:** pedir una posición que no existe. Con 3 frutas, `frutas[3]` no da error: da `undefined` ("sin definir"), porque las posiciones van de 0 a 2. Si ves `undefined`, revisa que estés contando desde 0.',
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
        codigo: [
          '// TODO 1: crea el arreglo ciudades con tres ciudades de Colombia.',
          '',
          '// TODO 2: muestra la primera ciudad (recuerda: se cuenta desde 0).',
          '',
          '// TODO 3: muestra cuántas ciudades hay, con .length.',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'ciudades es un arreglo con 3 elementos',
            condicion: 'Array.isArray(ciudades) && ciudades.length === 3',
          },
          { descripcion: 'Muestras la primera ciudad', condicion: 'salida.includes(ciudades[0])' },
          { descripcion: 'Muestras cuántas hay (3)', condicion: 'salida.includes("3")' },
          {
            descripcion: 'La cantidad sale de ciudades.length (no escribes 3 a mano)',
            condicion: '/console\\.log\\(\\s*ciudades\\.length\\s*\\)/.test(codigo)',
          },
        ],
        pistas: [
          'Fíjate en la línea 1 del ejemplo de la Idea: un arreglo va entre corchetes y cada texto entre comillas.',
          'El arreglo se crea así: `const ciudades = ["Cali", "Tunja", "Leticia"];`',
          'La primera está en la posición 0: `console.log(ciudades[0]);` y la cantidad sale con `console.log(ciudades.length);`',
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
          '// TODO 1: agrega "café" y después "huevos" con .push().',
          '',
          '// TODO 2: crea ultimo con el último elemento, usando mercado.length - 1.',
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
          'Son dos tareas: primero agregar, después leer. Cada elemento se agrega con su propio push: `mercado.push("café");`',
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

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'metodos-arreglos',
    titulo: 'Métodos de arreglos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Filtrar, transformar y buscar',
        texto: [
          'Los arreglos traen herramientas que hacen el trabajo de un bucle en una sola línea. Las tres más usadas son `filter`, `map` y `find`.',
          '`filter` se queda con los valores que cumplen una condición, `map` transforma cada valor y `find` devuelve el primero que cumple.',
          'Cada una recibe una **función flecha**: una forma corta de escribir una función. `(precio) => precio > 3000` significa "dado un `precio`, devuelve si es mayor que 3000". Lo que va después de la flecha es lo que se devuelve.',
          'Ninguna de estas herramientas cambia el arreglo original: devuelven uno nuevo. Una herramienta que va pegada a un valor con un punto, como `precios.filter(...)`, se llama **método**.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 3: `filter` le pasa cada precio a la flecha. 4500 > 3000 es `true`: se queda. 2500 > 3000 es `false`: sale. Al final `caros` es `[4500, 8000]`.',
          'Línea 6: `map` multiplica cada precio por 1.19 (el IVA). El arreglo nuevo tiene los mismos 4 elementos, cada uno transformado.',
          'Línea 9: `find` revisa en orden y se detiene en el primero que cumple: 1500. Si ninguno cumpliera, daría `undefined`.',
          'Compara con lo que ya sabías: `filter` hace lo mismo que un `for...of` con un `if` y un `push`, pero en una sola línea.',
          '**Error común:** poner llaves en la flecha sin `return`. `(precio) => { precio > 3000 }` no devuelve nada, y `filter` termina con un arreglo vacío `[]`. Solución: quita las llaves, `(precio) => precio > 3000`, o escribe `return` adentro.',
        ],
        codigo: [
          'const precios = [4500, 2500, 8000, 1500];',
          '',
          'const caros = precios.filter((precio) => precio > 3000);',
          'console.log(caros); // [4500, 8000]',
          '',
          'const conIva = precios.map((precio) => precio * 1.19);',
          'console.log(conIva);',
          '',
          'const primeroBarato = precios.find((precio) => precio < 2000);',
          'console.log(primeroBarato); // 1500',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Solo los baratos',
        texto: [
          'En la tienda quieren una lista solo con lo que cuesta **menos de 3000**.',
          'Crea el arreglo `baratos` usando `precios.filter(...)` con una función flecha. No cambies `precios`.',
        ],
        codigo: [
          'const precios = [4500, 2500, 8000, 1500, 3000, 12000];',
          '',
          '// TODO: crea baratos con precios.filter( ... ).',
          '// Dentro va una función flecha que diga cuándo un precio se queda.',
          '',
          '// Para revisar: console.log(baratos); debe mostrar [2500, 1500]',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'baratos es un arreglo', condicion: 'Array.isArray(baratos)' },
          {
            descripcion: 'baratos tiene solo 2500 y 1500',
            condicion: 'baratos.length === 2 && baratos.includes(2500) && baratos.includes(1500)',
          },
          { descripcion: 'Todos cuestan menos de 3000', condicion: 'baratos.every((p) => p < 3000)' },
          { descripcion: 'Usas filter', condicion: 'codigo.includes(".filter(")' },
          { descripcion: 'precios sigue con sus 6 valores', condicion: 'precios.length === 6' },
        ],
        pistas: [
          '`filter` recibe una función que devuelve true para los valores que se quedan.',
          'La función flecha: `(precio) => precio < 3000`',
          'Completo: `const baratos = precios.filter((precio) => precio < 3000);`',
        ],
        solucion: [
          'const precios = [4500, 2500, 8000, 1500, 3000, 12000];',
          '',
          'const baratos = precios.filter((precio) => precio < 3000);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: nombres según el precio',
        texto: [
          'Crea la función `nombresBaratos` que recibe una lista de productos y un valor `maximo`, y devuelve un arreglo con los **nombres** de los productos que cuestan menos que `maximo`.',
          'Pista de método: primero `filter` para quedarte con los productos baratos y luego `map` para sacar solo el nombre.',
          'Debe funcionar con cualquier lista y cualquier valor, incluso una lista vacía (devuelve un arreglo vacío).',
        ],
        codigo: [
          'const productos = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Jugo de lulo", precio: 4500 },',
          '  { nombre: "Buñuelo", precio: 1500 },',
          '  { nombre: "Empanada", precio: 2500 }',
          '];',
          '',
          '// TODO 1: crea la función nombresBaratos(lista, maximo).',
          '// TODO 2: usa filter para quedarte con los que cuestan menos que maximo.',
          '// TODO 3: usa map sobre ese resultado para sacar solo el nombre, y devuélvelo.',
          '',
          '// Para revisar: console.log(nombresBaratos(productos, 3000));',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'nombresBaratos es una función', condicion: 'typeof nombresBaratos === "function"' },
          {
            descripcion: 'Con máximo 3000 devuelve Buñuelo y Empanada',
            condicion:
              'JSON.stringify(nombresBaratos(productos, 3000)) === JSON.stringify(["Buñuelo", "Empanada"])',
          },
          {
            descripcion: 'Con máximo 5000 devuelve los cuatro nombres, en orden',
            condicion:
              'JSON.stringify(nombresBaratos(productos, 5000)) === JSON.stringify(["Arepa", "Jugo de lulo", "Buñuelo", "Empanada"])',
          },
          {
            descripcion: 'Con máximo 1000 devuelve un arreglo vacío',
            condicion:
              'Array.isArray(nombresBaratos(productos, 1000)) && nombresBaratos(productos, 1000).length === 0',
          },
          {
            descripcion: 'Con una lista vacía devuelve un arreglo vacío',
            condicion:
              'Array.isArray(nombresBaratos([], 3000)) && nombresBaratos([], 3000).length === 0',
          },
          {
            descripcion: 'Funciona con cualquier otra lista',
            condicion:
              'JSON.stringify(nombresBaratos([{ nombre: "A", precio: 100 }, { nombre: "B", precio: 900 }], 500)) === JSON.stringify(["A"])',
          },
          { descripcion: 'No cambia la lista original', condicion: 'productos.length === 4' },
        ],
        pistas: [
          'Son dos pasos encadenados: primero escoger productos, después transformar cada producto en su nombre.',
          'Empieza así: `function nombresBaratos(lista, maximo) { ... }`. Para quedarte con los baratos: `lista.filter((producto) => producto.precio < maximo)`',
          'Sobre ese resultado usa `.map((producto) => producto.nombre)` y devuélvelo con `return`.',
        ],
        solucion: [
          'const productos = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Jugo de lulo", precio: 4500 },',
          '  { nombre: "Buñuelo", precio: 1500 },',
          '  { nombre: "Empanada", precio: 2500 }',
          '];',
          '',
          'function nombresBaratos(lista, maximo) {',
          '  return lista',
          '    .filter((producto) => producto.precio < maximo)',
          '    .map((producto) => producto.nombre);',
          '}',
        ].join('\n'),
      },
    ],
  }
);

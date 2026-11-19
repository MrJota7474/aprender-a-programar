globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'objetos',
    titulo: 'Objetos',
    pasos: [
      {
        id: 'idea',
        titulo: 'Datos que van juntos',
        texto: [
          'Un **objeto** agrupa varios datos sobre una misma cosa. Cada dato tiene un nombre (la **propiedad**) y un valor.',
          'Se escribe entre llaves `{ }`, con pares `propiedad: valor` separados por comas.',
          'Para leer o cambiar una propiedad se usa un punto: `estudiante.nombre`.',
        ],
        codigo: [
          'const estudiante = {',
          '  nombre: "Andrés",',
          '  edad: 16,',
          '  ciudad: "Barranquilla"',
          '};',
          '',
          'console.log(estudiante.nombre);',
          '',
          'estudiante.edad = 17; // cambiar una propiedad',
          'estudiante.grado = 11; // agregar una nueva',
          'console.log(estudiante);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un producto',
        texto: [
          'Crea un objeto `producto` con dos propiedades: `nombre` (un texto) y `precio` (un número).',
          'Después muestra en la consola solo el nombre del producto.',
        ],
        codigo: '// Crea aquí el objeto producto\n',
        pruebas: [
          {
            descripcion: 'producto es un objeto',
            condicion: 'typeof producto === "object" && producto !== null',
          },
          { descripcion: 'producto.nombre es un texto', condicion: 'typeof producto.nombre === "string"' },
          { descripcion: 'producto.precio es un número', condicion: 'typeof producto.precio === "number"' },
          { descripcion: 'Muestras el nombre del producto', condicion: 'salida.includes(producto.nombre)' },
        ],
        pistas: [
          'El objeto se crea con llaves: `const producto = { nombre: "Arepa", precio: 3000 };`',
          'Para mostrar solo el nombre: `console.log(producto.nombre);`',
        ],
        solucion: [
          'const producto = { nombre: "Arepa", precio: 3000 };',
          'console.log(producto.nombre);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: el carrito',
        texto: [
          'Este reto junta casi todo lo que aprendiste: funciones, arreglos, bucles y objetos.',
          'Crea la función `totalCarrito` que recibe una lista de productos y devuelve la suma de sus precios.',
          'Debe funcionar con **cualquier** lista, incluso una vacía (en ese caso devuelve 0).',
        ],
        codigo: [
          'const carrito = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Jugo de lulo", precio: 4500 },',
          '  { nombre: "Buñuelo", precio: 1500 }',
          '];',
          '',
          '// Crea aquí la función totalCarrito',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'totalCarrito es una función', condicion: 'typeof totalCarrito === "function"' },
          { descripcion: 'totalCarrito(carrito) devuelve 9000', condicion: 'totalCarrito(carrito) === 9000' },
          { descripcion: 'Con una lista vacía devuelve 0', condicion: 'totalCarrito([]) === 0' },
          {
            descripcion: 'Funciona con cualquier otra lista',
            condicion:
              'totalCarrito([{ nombre: "A", precio: 100 }, { nombre: "B", precio: 250 }]) === 350',
          },
        ],
        pistas: [
          'Empieza así: `function totalCarrito(lista) { let total = 0; ... return total; }`',
          'Recorre la lista con `for (const producto of lista) { }`',
          'En cada vuelta suma el precio: `total = total + producto.precio;`',
        ],
        solucion: [
          'const carrito = [',
          '  { nombre: "Arepa", precio: 3000 },',
          '  { nombre: "Jugo de lulo", precio: 4500 },',
          '  { nombre: "Buñuelo", precio: 1500 }',
          '];',
          '',
          'function totalCarrito(lista) {',
          '  let total = 0;',
          '  for (const producto of lista) {',
          '    total = total + producto.precio;',
          '  }',
          '  return total;',
          '}',
        ].join('\n'),
      },
    ],
  }
);

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'clases',
    titulo: 'Clases',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un molde para crear objetos',
        texto: [
          'Una **clase** es un molde para crear muchos objetos con la misma forma y los mismos comportamientos. Cada objeto creado con `new` se llama **instancia**.',
          'El `constructor` se ejecuta al crear la instancia y guarda los datos con `this`, que significa "este objeto". Las funciones dentro de la clase se llaman **métodos**.',
          'Un **getter** (`get`) es un método que se lee como si fuera una propiedad: `producto.etiqueta` en vez de `producto.etiqueta()`.',
        ],
        codigo: [
          'class Producto {',
          '  constructor(nombre, precio) {',
          '    this.nombre = nombre;',
          '    this.precio = precio;',
          '  }',
          '',
          '  conDescuento(porcentaje) {',
          '    return this.precio - (this.precio * porcentaje) / 100;',
          '  }',
          '',
          '  get etiqueta() {',
          '    return this.nombre + " $" + this.precio;',
          '  }',
          '}',
          '',
          'const arepa = new Producto("Arepa", 3000);',
          'console.log(arepa.conDescuento(10));',
          'console.log(arepa.etiqueta); // sin paréntesis',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El IVA de un producto',
        texto: [
          'La clase `Producto` ya guarda el nombre y el precio. Agrégale el método `conIva()`, que devuelve el precio más el 19% de IVA.',
          'Dentro del método usa `this.precio`. El método no debe cambiar el precio guardado.',
        ],
        codigo: [
          'class Producto {',
          '  constructor(nombre, precio) {',
          '    this.nombre = nombre;',
          '    this.precio = precio;',
          '  }',
          '',
          '  // Agrega aquí el método conIva',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Producto es una clase', condicion: 'typeof Producto === "function" && /class\\s+Producto/.test(codigo)' },
          {
            descripcion: 'conIva() de 10000 devuelve 11900',
            condicion: 'Math.abs(new Producto("Café", 10000).conIva() - 11900) < 0.01',
          },
          {
            descripcion: 'conIva() funciona con otro precio',
            condicion: 'Math.abs(new Producto("Arepa", 3000).conIva() - 3570) < 0.01',
          },
          {
            descripcion: 'conIva() no cambia el precio guardado',
            condicion:
              '(() => { const p = new Producto("Jugo", 4500); p.conIva(); return p.precio === 4500; })()',
          },
          {
            descripcion: 'Cada producto guarda su propio precio',
            condicion:
              '(() => { const a = new Producto("A", 100); const b = new Producto("B", 200); return a.conIva() < b.conIva(); })()',
          },
        ],
        pistas: [
          'Un método se escribe dentro de la clase, sin la palabra `function`: `conIva() { ... }`',
          'Dentro del método el precio se lee con `this.precio`.',
          'El IVA del 19% es multiplicar por 1.19: `return this.precio * 1.19;`',
        ],
        solucion: [
          'class Producto {',
          '  constructor(nombre, precio) {',
          '    this.nombre = nombre;',
          '    this.precio = precio;',
          '  }',
          '',
          '  conIva() {',
          '    return this.precio * 1.19;',
          '  }',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: la clase Carrito',
        texto: [
          'Crea la clase `Carrito`. Cada carrito empieza vacío y guarda sus propios productos (dos carritos no comparten nada).',
          'Debe tener el método `agregar(producto, cantidad)`, que recibe un objeto con `precio` y la cantidad de unidades, y el método `total()`, que devuelve la suma de `precio * cantidad` de todo lo agregado.',
          'Un carrito vacío tiene total 0.',
        ],
        codigo: [
          'class Carrito {',
          '  constructor() {',
          '    this.items = [];',
          '  }',
          '',
          '  // Agrega aquí los métodos agregar y total',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Carrito es una clase', condicion: 'typeof Carrito === "function" && /class\\s+Carrito/.test(codigo)' },
          { descripcion: 'Un carrito vacío tiene total 0', condicion: 'new Carrito().total() === 0' },
          {
            descripcion: 'Un producto con cantidad 2 suma el doble',
            condicion:
              '(() => { const c = new Carrito(); c.agregar({ nombre: "Arepa", precio: 3000 }, 2); return c.total() === 6000; })()',
          },
          {
            descripcion: 'Suma varios productos',
            condicion:
              '(() => { const c = new Carrito(); c.agregar({ nombre: "Arepa", precio: 3000 }, 2); c.agregar({ nombre: "Tinto", precio: 1500 }, 3); c.agregar({ nombre: "Jugo", precio: 4500 }, 1); return c.total() === 15000; })()',
          },
          {
            descripcion: 'total() se puede llamar varias veces con el mismo resultado',
            condicion:
              '(() => { const c = new Carrito(); c.agregar({ precio: 100 }, 5); return c.total() === 500 && c.total() === 500; })()',
          },
          {
            descripcion: 'Cada carrito es independiente',
            condicion:
              '(() => { const a = new Carrito(); const b = new Carrito(); a.agregar({ precio: 1000 }, 1); return a.total() === 1000 && b.total() === 0; })()',
          },
        ],
        pistas: [
          'En `agregar` guarda lo recibido en la lista del carrito: `this.items.push({ producto, cantidad });`',
          'En `total` empieza con `let suma = 0;` y recorre `this.items` con `for (const item of this.items)`.',
          'Cada vuelta suma `item.producto.precio * item.cantidad`. Al final `return suma;`',
        ],
        solucion: [
          'class Carrito {',
          '  constructor() {',
          '    this.items = [];',
          '  }',
          '',
          '  agregar(producto, cantidad) {',
          '    this.items.push({ producto, cantidad });',
          '  }',
          '',
          '  total() {',
          '    let suma = 0;',
          '    for (const item of this.items) {',
          '      suma = suma + item.producto.precio * item.cantidad;',
          '    }',
          '    return suma;',
          '  }',
          '}',
        ].join('\n'),
      },
    ],
  }
);

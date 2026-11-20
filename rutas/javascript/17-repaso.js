globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'repaso',
    titulo: 'Repaso: retos mezclados',
    pasos: [
      {
        id: 'reto1',
        etiqueta: 'Reto 1',
        titulo: 'Lo que se está agotando',
        texto: [
          'Don Pepe quiere saber qué pedir al proveedor. Cada producto tiene `nombre`, `precio` y `stock` (unidades que quedan).',
          'Crea la función `porPedir(productos, minimo)` que devuelve un arreglo con los **nombres** de los productos cuyo `stock` sea **menor que** `minimo`, en el mismo orden de la lista.',
          'Si ninguno está bajo, devuelve un arreglo vacío. La lista original no debe cambiar.',
          'Repasa: métodos de arreglos (lección 11). Ejemplo: con el inventario de la derecha y mínimo 10, la respuesta es `["Arepa", "Buñuelo", "Jugo"]`.',
        ],
        codigo: [
          'const inventario = [',
          '  { nombre: "Arepa", precio: 3000, stock: 4 },',
          '  { nombre: "Tinto", precio: 1500, stock: 40 },',
          '  { nombre: "Buñuelo", precio: 1500, stock: 0 },',
          '  { nombre: "Jugo", precio: 4500, stock: 9 }',
          '];',
          '',
          'function porPedir(productos, minimo) {',
          '  // TODO 1: quédate con los productos cuyo stock sea menor que minimo.',
          '  // TODO 2: de esos, saca solo el nombre y devuelve el arreglo.',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'porPedir es una función', condicion: 'typeof porPedir === "function"' },
          {
            descripcion: 'Con mínimo 10 devuelve Arepa, Buñuelo y Jugo',
            condicion: 'porPedir(inventario, 10).join(",") === "Arepa,Buñuelo,Jugo"',
          },
          {
            descripcion: 'Con mínimo 5 devuelve Arepa y Buñuelo',
            condicion: 'porPedir(inventario, 5).join(",") === "Arepa,Buñuelo"',
          },
          {
            descripcion: 'Un stock igual al mínimo no cuenta',
            condicion: 'porPedir([{ nombre: "A", precio: 1, stock: 5 }], 5).length === 0',
          },
          {
            descripcion: 'Si nada está bajo devuelve una lista vacía',
            condicion: 'Array.isArray(porPedir(inventario, 0)) && porPedir(inventario, 0).length === 0',
          },
          {
            descripcion: 'Con una lista vacía devuelve una lista vacía',
            condicion: 'Array.isArray(porPedir([], 10)) && porPedir([], 10).length === 0',
          },
          {
            descripcion: 'No cambia la lista original',
            condicion: '(() => { const antes = JSON.stringify(inventario); porPedir(inventario, 10); return JSON.stringify(inventario) === antes; })()',
          },
        ],
        pistas: [
          'Es el mismo patrón del reto de la lección 11: primero escoger, después transformar.',
          'Escoge con `productos.filter((p) => p.stock < minimo)` y transforma con `.map((p) => p.nombre)`.',
          'Encadena los dos en un solo `return`: `return productos.filter((p) => p.stock < minimo).map((p) => p.nombre);`',
        ],
        solucion: [
          'const inventario = [',
          '  { nombre: "Arepa", precio: 3000, stock: 4 },',
          '  { nombre: "Tinto", precio: 1500, stock: 40 },',
          '  { nombre: "Buñuelo", precio: 1500, stock: 0 },',
          '  { nombre: "Jugo", precio: 4500, stock: 9 }',
          '];',
          '',
          'function porPedir(productos, minimo) {',
          '  return productos.filter((p) => p.stock < minimo).map((p) => p.nombre);',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto2',
        etiqueta: 'Reto 2',
        titulo: 'La caja registradora',
        texto: [
          'Crea la clase `Caja`. Empieza vacía y tiene:',
          '- El método `registrar(venta)`, que recibe un objeto `{ nombre, precio, cantidad }`. Usa desestructuración y da a `cantidad` el valor por defecto 1.',
          '- Si `precio` no es un número mayor que 0, `registrar` lanza un `Error` y **no** guarda nada. Ojo: `NaN <= 0` es falso, así que conviene validar con `!(precio > 0)` o con `Number.isFinite`.',
          '- Para revisar si algo es un número se usa `typeof`: `typeof 5` da "number" y `typeof "mil"` da "string".',
          '- El getter `total` (se lee sin paréntesis: `caja.total`), que suma `precio * cantidad` de todas las ventas registradas. Una caja vacía tiene total 0.',
        ],
        codigo: [
          'class Caja {',
          '  constructor() {',
          '    this.ventas = [];',
          '  }',
          '',
          '  // TODO 1: método registrar({ nombre, precio, cantidad = 1 }).',
          '  //         Si el precio no sirve, lanza un Error; si sirve, guarda la venta.',
          '  // TODO 2: getter total: suma precio * cantidad de this.ventas.',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Caja es una clase', condicion: 'typeof Caja === "function" && /class\\s+Caja/.test(codigo)' },
          { descripcion: 'Una caja vacía tiene total 0', condicion: 'new Caja().total === 0' },
          {
            descripcion: 'Registra una venta con cantidad',
            condicion:
              '(() => { const c = new Caja(); c.registrar({ nombre: "Arepa", precio: 3000, cantidad: 2 }); return c.total === 6000; })()',
          },
          {
            descripcion: 'Sin cantidad se toma 1',
            condicion:
              '(() => { const c = new Caja(); c.registrar({ nombre: "Tinto", precio: 1500 }); return c.total === 1500; })()',
          },
          {
            descripcion: 'Suma varias ventas',
            condicion:
              '(() => { const c = new Caja(); c.registrar({ nombre: "Arepa", precio: 3000, cantidad: 2 }); c.registrar({ nombre: "Tinto", precio: 1500 }); c.registrar({ nombre: "Jugo", precio: 4500, cantidad: 3 }); return c.total === 21000; })()',
          },
          {
            descripcion: 'Un precio inválido (0, negativo, texto, sin precio o NaN) lanza un Error',
            condicion:
              '(() => { let lanzados = 0; for (const precio of [0, -500, "mil", undefined, NaN]) { try { new Caja().registrar({ nombre: "X", precio }); } catch (e) { if (e instanceof Error) lanzados++; } } return lanzados === 5; })()',
          },
          {
            descripcion: 'Una venta inválida no se guarda',
            condicion:
              '(() => { const c = new Caja(); c.registrar({ nombre: "Arepa", precio: 3000 }); try { c.registrar({ nombre: "Malo", precio: -1, cantidad: 5 }); } catch (e) {} return c.total === 3000; })()',
          },
          {
            descripcion: 'Cada caja es independiente',
            condicion:
              '(() => { const a = new Caja(); const b = new Caja(); a.registrar({ nombre: "A", precio: 100 }); return a.total === 100 && b.total === 0; })()',
          },
        ],
        pistas: [
          'Repasa clases (14), desestructuración (13) y errores (15). Empieza por la firma: `registrar({ nombre, precio, cantidad = 1 }) { ... }` saca los datos y pone la cantidad por defecto.',
          'Valida antes de guardar: `if (typeof precio !== "number" || !(precio > 0)) { throw new Error("..."); }`',
          'El getter se escribe `get total() { ... }` y recorre `this.ventas` sumando `precio * cantidad`.',
        ],
        solucion: [
          'class Caja {',
          '  constructor() {',
          '    this.ventas = [];',
          '  }',
          '',
          '  registrar({ nombre, precio, cantidad = 1 }) {',
          '    if (typeof precio !== "number" || !(precio > 0)) {',
          '      throw new Error("El precio de " + nombre + " debe ser un número mayor que 0");',
          '    }',
          '    this.ventas.push({ nombre, precio, cantidad });',
          '  }',
          '',
          '  get total() {',
          '    let suma = 0;',
          '    for (const venta of this.ventas) {',
          '      suma = suma + venta.precio * venta.cantidad;',
          '    }',
          '    return suma;',
          '  }',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto3',
        etiqueta: 'Reto 3',
        titulo: 'Total por categoría',
        texto: [
          'Al cerrar el día, Don Pepe quiere saber cuánto vendió por categoría. Cada venta tiene `categoria` y `valor`.',
          'Crea la función `totalPorCategoria(ventas)` que devuelve un **objeto nuevo** donde cada categoría es una propiedad y su valor es la suma de los `valor` de esa categoría. Ejemplo: `{ bebida: 6000, comida: 4500 }`.',
          'Con una lista vacía devuelve un objeto vacío `{}`. La lista original no debe cambiar.',
          'Repasa `reduce` (lección 16): el segundo ejemplo de esa Idea hace algo muy parecido.',
        ],
        codigo: [
          'const ventasDelDia = [',
          '  { categoria: "comida", valor: 3000 },',
          '  { categoria: "bebida", valor: 4500 },',
          '  { categoria: "comida", valor: 1500 },',
          '  { categoria: "bebida", valor: 1500 }',
          '];',
          '',
          'function totalPorCategoria(ventas) {',
          '  // TODO 1: usa ventas.reduce con un objeto vacío {} como valor inicial.',
          '  // TODO 2: en cada vuelta, devuelve un objeto nuevo con la categoría sumada.',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'totalPorCategoria es una función', condicion: 'typeof totalPorCategoria === "function"' },
          {
            descripcion: 'Suma comida y bebida por separado',
            condicion:
              '(() => { const r = totalPorCategoria(ventasDelDia); return r.comida === 4500 && r.bebida === 6000 && Object.keys(r).length === 2; })()',
          },
          {
            descripcion: 'Funciona con una sola categoría',
            condicion:
              '(() => { const r = totalPorCategoria([{ categoria: "aseo", valor: 800 }, { categoria: "aseo", valor: 200 }]); return r.aseo === 1000 && Object.keys(r).length === 1; })()',
          },
          {
            descripcion: 'Funciona con categorías nuevas',
            condicion:
              '(() => { const r = totalPorCategoria([{ categoria: "a", valor: 1 }, { categoria: "b", valor: 2 }, { categoria: "c", valor: 3 }, { categoria: "a", valor: 10 }]); return r.a === 11 && r.b === 2 && r.c === 3; })()',
          },
          {
            descripcion: 'Con una lista vacía devuelve {}',
            condicion:
              '(() => { const r = totalPorCategoria([]); return typeof r === "object" && r !== null && !Array.isArray(r) && Object.keys(r).length === 0; })()',
          },
          {
            descripcion: 'No cambia la lista original',
            condicion:
              '(() => { totalPorCategoria(ventasDelDia); return ventasDelDia.length === 4 && ventasDelDia[0].valor === 3000 && ventasDelDia[2].categoria === "comida"; })()',
          },
        ],
        pistas: [
          'Usa `reduce` con un objeto vacío `{}` como valor inicial.',
          'En cada vuelta toma lo que ya había de esa categoría (o 0): `(grupos[venta.categoria] || 0) + venta.valor`.',
          'Devuelve el objeto nuevo en cada vuelta: `{ ...grupos, [venta.categoria]: nuevoTotal }`. Los corchetes usan el valor de la variable como nombre de la propiedad.',
        ],
        solucion: [
          'const ventasDelDia = [',
          '  { categoria: "comida", valor: 3000 },',
          '  { categoria: "bebida", valor: 4500 },',
          '  { categoria: "comida", valor: 1500 },',
          '  { categoria: "bebida", valor: 1500 }',
          '];',
          '',
          'function totalPorCategoria(ventas) {',
          '  return ventas.reduce((grupos, venta) => {',
          '    const anterior = grupos[venta.categoria] || 0;',
          '    return { ...grupos, [venta.categoria]: anterior + venta.valor };',
          '  }, {});',
          '}',
        ].join('\n'),
      },
    ],
  }
);

// Ruta "Proyectos", lección 2: el catálogo de la tienda. Cada paso declara su
// propio motor (sql, web, javascript) y la etiqueta de su pestaña; las "condicion"
// de cada paso se escriben con las reglas de ESE motor (ver 01-hola-sql.js,
// 01-hola-html.js y 11-metodos-arreglos.js). El primer paso no tiene pruebas:
// es la explicación del plan.

globalThis.Rutas.agregarLeccion(
  'proyectos',
  {
    id: 'catalogo-tienda',
    titulo: 'El catálogo de la tienda',
    pasos: [
      {
        id: 'plan',
        etiqueta: 'El plan',
        titulo: 'Una aplicación tiene tres partes',
        texto: [
          'Don Pepe quiere mostrarle sus productos a los vecinos desde un celular. Para construir una aplicación real, sin importar qué haga, casi siempre necesitas **tres partes**.',
          '**1. Los datos.** Dónde se guarda la información: los productos, sus precios, cuántos quedan. Eso es una base de datos y se le pregunta con **SQL**.',
          '**2. La página.** Lo que ve la persona: títulos, tarjetas, colores. Eso es **HTML y CSS**.',
          '**3. La lógica.** Lo que hace la aplicación con los datos: sumar el carrito, aplicar un descuento. Eso lo hace **JavaScript**.',
          'En este proyecto harás un pedacito de cada parte, una por pestaña. Ejecuta el ejemplo para ver el plan y sigue con la pestaña **Base de datos**.',
        ],
        codigo: [
          'console.log("Proyecto: el catálogo de la tienda de Don Pepe");',
          'console.log("1. Base de datos: qué productos hay y cuánto cuestan");',
          'console.log("2. La página: un catálogo con tarjetas");',
          'console.log("3. El carrito: sumar lo que lleva el cliente");',
        ].join('\n'),
      },
      {
        id: 'base-de-datos',
        etiqueta: 'Base de datos',
        motor: 'sql',
        titulo: 'Los productos que hay en la tienda',
        texto: [
          'Primero los datos. La tabla `productos` tiene `nombre`, `categoria`, `precio` y `existencias` (cuántas unidades quedan).',
          'El catálogo solo debe mostrar lo que **sí hay**: los productos con existencias mayores que cero. Muestra el `nombre`, la `categoria` y el `precio`, en ese orden, ordenados por categoría y, dentro de cada categoría, del más barato al más caro.',
        ],
        codigo: '-- Productos con existencias: nombre, categoria y precio\n',
        pruebas: [
          { descripcion: 'Muestra tres columnas: nombre, categoría y precio', condicion: 'columnas.length === 3' },
          {
            descripcion: 'No aparecen los productos agotados (existencias en 0)',
            condicion: 'filas.length === 9',
          },
          {
            descripcion: 'Están ordenados por categoría y luego por precio',
            condicion:
              'igualA("SELECT nombre, categoria, precio FROM productos WHERE existencias > 0 ORDER BY categoria, precio")',
          },
        ],
        pistas: [
          'Las tres columnas van entre `SELECT` y `FROM`, separadas por comas.',
          'Para quedarte solo con lo que hay, usa `WHERE existencias > 0`.',
          'Para ordenar por dos criterios, sepáralos con coma: `ORDER BY categoria, precio`.',
        ],
        solucion: [
          'SELECT nombre, categoria, precio',
          'FROM productos',
          'WHERE existencias > 0',
          'ORDER BY categoria, precio;',
        ].join('\n'),
      },
      {
        id: 'la-pagina',
        etiqueta: 'La página',
        motor: 'web',
        titulo: 'El catálogo en pantalla',
        texto: [
          'Ahora lo que ve el cliente. Dentro del `<div class="catalogo">` crea **tres tarjetas** de productos. Cada tarjeta es un `<div class="tarjeta">` con un título `<h2>` (el nombre del producto) y un párrafo `<p class="precio">` con su precio.',
          'En la etiqueta `<style>` haz tres cosas: (1) que `.catalogo` sea `display: flex` para poner las tarjetas **en una fila**; (2) que `.tarjeta` tenga un color de fondo (`background-color`) y espacio interno (`padding`); (3) que `.precio` tenga su propio color.',
          'Los productos los escoges tú de la base de datos del paso anterior (la arepa de queso a 3500, el tinto a 2000...).',
        ],
        codigo: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title>Catálogo Don Pepe</title>',
          '    <style>',
          '      /* Escribe tus estilos aquí */',
          '    </style>',
          '  </head>',
          '  <body>',
          '    <h1>Catálogo de Don Pepe</h1>',
          '    <div class="catalogo">',
          '      <!-- Escribe aquí las tres tarjetas -->',
          '    </div>',
          '  </body>',
          '</html>',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Hay tres tarjetas dentro del catálogo', condicion: 'cuenta(".catalogo > .tarjeta") === 3' },
          {
            descripcion: 'Cada tarjeta tiene un título h2 y un precio con números',
            condicion:
              'todos(".tarjeta").length === 3 && todos(".tarjeta").every((t) => t.uno("h2") !== null && t.uno("h2").texto !== "" && t.uno(".precio") !== null && /[0-9]/.test(t.uno(".precio").texto))',
          },
          { descripcion: 'El catálogo usa Flexbox (display: flex)', condicion: 'estilo(".catalogo", "display") === "flex"' },
          {
            descripcion: 'Las tarjetas van en una fila (no en columna)',
            condicion: '["", "row", "row-reverse"].includes(estilo(".catalogo", "flex-direction"))',
          },
          {
            descripcion: 'Las tarjetas tienen color de fondo y espacio interno',
            condicion: 'estilo(".tarjeta", "background-color") !== "" && estilo(".tarjeta", "padding-top") !== ""',
          },
          { descripcion: 'El precio tiene su propio color', condicion: 'estilo(".precio", "color") !== ""' },
        ],
        pistas: [
          'Una tarjeta es: `<div class="tarjeta">`, un `<h2>`, un `<p class="precio">` y el cierre `</div>`. Copia ese bloque tres veces cambiando los textos.',
          'En el estilo: `.catalogo { display: flex; gap: 16px; }` pone las tarjetas una al lado de la otra.',
          'Para la tarjeta: `.tarjeta { background-color: #fff3cd; padding: 16px; }` y para el precio: `.precio { color: #b45309; }`',
        ],
        solucion: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title>Catálogo Don Pepe</title>',
          '    <style>',
          '      .catalogo { display: flex; gap: 16px; }',
          '      .tarjeta { background-color: #fff3cd; padding: 16px; border-radius: 8px; }',
          '      .precio { color: #b45309; font-weight: bold; }',
          '    </style>',
          '  </head>',
          '  <body>',
          '    <h1>Catálogo de Don Pepe</h1>',
          '    <div class="catalogo">',
          '      <div class="tarjeta">',
          '        <h2>Arepa de queso</h2>',
          '        <p class="precio">$3.500</p>',
          '      </div>',
          '      <div class="tarjeta">',
          '        <h2>Tinto</h2>',
          '        <p class="precio">$2.000</p>',
          '      </div>',
          '      <div class="tarjeta">',
          '        <h2>Jugo de lulo</h2>',
          '        <p class="precio">$4.500</p>',
          '      </div>',
          '    </div>',
          '  </body>',
          '</html>',
        ].join('\n'),
      },
      {
        id: 'el-carrito',
        etiqueta: 'El carrito',
        motor: 'javascript',
        titulo: 'Sumar lo que lleva el cliente',
        texto: [
          'La lógica del carrito. Crea la función `calcularTotal(productos)`. Recibe una lista de productos, cada uno con `precio` y `cantidad`, por ejemplo `{ nombre: "Tinto", precio: 2000, cantidad: 3 }`, y **devuelve** el total a pagar.',
          'Regla de Don Pepe: si el total es de **20000 o más**, se aplica un **10 % de descuento**. Con 19999 no hay descuento; con 20000 exactos, sí.',
          'Debe funcionar con cualquier lista, incluso vacía (el total es 0).',
        ],
        codigo: [
          'function calcularTotal(productos) {',
          '  // Escribe aquí tu código',
          '}',
          '',
          'console.log(calcularTotal([{ nombre: "Tinto", precio: 2000, cantidad: 3 }]));',
        ].join('\n'),
        pruebas: [
          { descripcion: 'calcularTotal es una función', condicion: 'typeof calcularTotal === "function"' },
          { descripcion: 'Una lista vacía da 0', condicion: 'calcularTotal([]) === 0' },
          {
            descripcion: 'Un producto: 3 tintos de 2000 dan 6000',
            condicion: 'calcularTotal([{ nombre: "Tinto", precio: 2000, cantidad: 3 }]) === 6000',
          },
          {
            descripcion: 'Varios productos se suman: 2 arepas (3500) y 1 jugo (4500) dan 11500',
            condicion:
              'calcularTotal([{ nombre: "Arepa", precio: 3500, cantidad: 2 }, { nombre: "Jugo", precio: 4500, cantidad: 1 }]) === 11500',
          },
          {
            descripcion: 'Con 19999 no hay descuento',
            condicion: 'calcularTotal([{ nombre: "Mercado", precio: 19999, cantidad: 1 }]) === 19999',
          },
          {
            descripcion: 'Con exactamente 20000 sí hay descuento: pagan 18000',
            condicion:
              'Math.abs(calcularTotal([{ nombre: "Café", precio: 18000, cantidad: 1 }, { nombre: "Panela", precio: 2000, cantidad: 1 }]) - 18000) < 0.01',
          },
          {
            descripcion: 'Con 25000 pagan 22500',
            condicion: 'Math.abs(calcularTotal([{ nombre: "Café", precio: 12500, cantidad: 2 }]) - 22500) < 0.01',
          },
          {
            descripcion: 'El descuento se aplica al final, sobre el total: 20000 y 5000 pagan 22500',
            condicion:
              'calcularTotal([{ nombre: "Café", precio: 20000, cantidad: 1 }, { nombre: "Panela", precio: 5000, cantidad: 1 }]) === 22500',
          },
        ],
        pistas: [
          'Empieza con `let total = 0;` y recorre la lista con `for (const producto of productos)`, sumando `producto.precio * producto.cantidad`.',
          'Después del ciclo pregunta: `if (total >= 20000) { total = total * 0.9; }`. Fíjate en el `>=`: el límite exacto también cuenta.',
          'Termina con `return total;` fuera del ciclo y del `if`.',
        ],
        solucion: [
          'function calcularTotal(productos) {',
          '  let total = 0;',
          '  for (const producto of productos) {',
          '    total += producto.precio * producto.cantidad;',
          '  }',
          '  if (total >= 20000) {',
          '    total = total * 0.9;',
          '  }',
          '  return total;',
          '}',
          '',
          'console.log(calcularTotal([{ nombre: "Tinto", precio: 2000, cantidad: 3 }]));',
        ].join('\n'),
      },
    ],
  }
);

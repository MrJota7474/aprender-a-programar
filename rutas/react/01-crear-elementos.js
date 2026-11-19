// Ruta "Interfaces con React", lección 1: describir la página con h().
// El código de cada paso empieza con la mini React de 00-mini-react.js
// (MiniReact.armar la pega antes de las líneas del paso). Las pruebas son
// JavaScript normal y pueden usar todo lo que define esa mini librería
// (h, aHtml, montar, clic, escribir, avisos…) y lo que escriba el estudiante.
// No se revisa el texto del código ("codigo"): la librería también está ahí.

(function () {
  const { armar } = globalThis.MiniReact;

  globalThis.Rutas.agregarLeccion('react', {
    id: 'crear-elementos',
    titulo: 'Elementos: lo que hay detrás de JSX',
    pasos: [
      {
        id: 'idea',
        titulo: 'Describir la página en vez de construirla',
        texto: [
          '**React** es una librería de JavaScript, creada en Facebook (hoy Meta), para armar interfaces: las pantallas de una página o de una app. La usan Instagram, WhatsApp Web, Netflix y miles de empresas, y es lo que pide la certificación **Front End Development Libraries** de freeCodeCamp.',
          'La idea central: en vez de cambiar la página a mano, como en la lección de JavaScript de la ruta web, **describes** cómo debe verse y React se encarga de dibujarla. Esa descripción se arma con **elementos**.',
          'En React real casi siempre se escribe **JSX**, que parece HTML dentro de JavaScript: `<h1 className="titulo">Tienda Don Pepe</h1>`. El navegador no entiende JSX; una herramienta lo traduce antes a una llamada de función: `React.createElement("h1", { className: "titulo" }, "Tienda Don Pepe")`.',
          'Aquí no hay internet para descargar React, así que usamos una **mini versión hecha por nosotros** (la parte de arriba del código). Su función `h(tipo, props, ...hijos)` hace lo mismo que `React.createElement`; también se llama `crearElemento`. Fíjate en `className`: en React se usa en vez de `class`, porque `class` es una palabra reservada de JavaScript.',
          '`aHtml()` es solo de nuestra mini versión: convierte el elemento en el HTML que vería el navegador, para que puedas leerlo en la consola. Ejecuta el ejemplo: primero verás el objeto que describe el elemento y luego su HTML.',
        ],
        codigo: armar('base', [
          '// En React real con JSX: const titulo = <h1 className="titulo">Tienda Don Pepe</h1>;',
          "const titulo = h('h1', { className: 'titulo' }, 'Tienda Don Pepe');",
          '',
          'console.log(titulo);        // el objeto que describe el elemento',
          'console.log(aHtml(titulo)); // el HTML que saldría en la página',
          '',
          '// Los hijos pueden ser otros elementos:',
          "const aviso = h('p', null, 'Hoy hay ', h('strong', null, 'arepas'), ' recién hechas');",
          'console.log(aHtml(aviso));',
        ]),
      },
      {
        id: 'practica',
        titulo: 'Tu primer elemento',
        texto: [
          'Crea la constante `saludo` con `h()`: un párrafo (`"p"`) con la clase `saludo` y el texto `Bienvenido a la tienda`.',
          'En JSX sería `<p className="saludo">Bienvenido a la tienda</p>`. Recuerda: primero el tipo, luego un objeto con las props y al final los hijos.',
        ],
        codigo: armar('base', [
          '// Cambia null por un elemento hecho con h()',
          'const saludo = null;',
          '',
          'console.log(aHtml(saludo));',
        ]),
        pruebas: [
          {
            descripcion: 'saludo es un párrafo',
            condicion: 'saludo !== null && saludo.tipo === "p"',
          },
          {
            descripcion: 'Tiene la clase saludo (con className)',
            condicion: 'saludo.props.className === "saludo"',
          },
          {
            descripcion: 'Produce <p class="saludo">Bienvenido a la tienda</p>',
            condicion: 'aHtml(saludo) === \'<p class="saludo">Bienvenido a la tienda</p>\'',
          },
        ],
        pistas: [
          'El primer argumento de `h` es el nombre de la etiqueta entre comillas: `"p"`.',
          'El segundo es un objeto con las props: `{ className: "saludo" }`. El tercero es el texto.',
          "La línea completa es: `const saludo = h('p', { className: 'saludo' }, 'Bienvenido a la tienda');`",
        ],
        solucion: armar('base', [
          "const saludo = h('p', { className: 'saludo' }, 'Bienvenido a la tienda');",
          '',
          'console.log(aHtml(saludo));',
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: el menú, elementos dentro de elementos',
        texto: [
          'Arma la constante `menu`: una lista `ul` con la clase `menu` y, adentro, tres `li` con los textos `Pan`, `Leche` y `Tinto`, en ese orden.',
          'En JSX se escribiría así:',
          '`<ul className="menu"><li>Pan</li><li>Leche</li><li>Tinto</li></ul>`',
          'Con `h()`, cada `li` es otro `h()` que va como hijo del `ul`. Cuando un elemento no tiene props, el segundo argumento es `null`.',
        ],
        codigo: armar('base', [
          "const menu = h('ul', { className: 'menu' });",
          '',
          'console.log(aHtml(menu));',
        ]),
        pruebas: [
          {
            descripcion: 'menu es una lista ul con la clase menu',
            condicion: 'menu.tipo === "ul" && menu.props.className === "menu"',
          },
          {
            descripcion: 'Tiene tres hijos li',
            condicion: 'menu.hijos.length === 3 && menu.hijos.every((hijo) => hijo.tipo === "li")',
          },
          {
            descripcion: 'Produce el HTML del menú con Pan, Leche y Tinto en orden',
            condicion: 'aHtml(menu) === \'<ul class="menu"><li>Pan</li><li>Leche</li><li>Tinto</li></ul>\'',
          },
        ],
        pistas: [
          'Después del objeto `{ className: "menu" }` van los hijos, separados por comas.',
          "Cada hijo es un elemento: `h('li', null, 'Pan')`.",
          "Queda así: `const menu = h('ul', { className: 'menu' }, h('li', null, 'Pan'), h('li', null, 'Leche'), h('li', null, 'Tinto'));`",
        ],
        solucion: armar('base', [
          'const menu = h(',
          "  'ul',",
          "  { className: 'menu' },",
          "  h('li', null, 'Pan'),",
          "  h('li', null, 'Leche'),",
          "  h('li', null, 'Tinto')",
          ');',
          '',
          'console.log(aHtml(menu));',
        ]),
      },
    ],
  });
})();

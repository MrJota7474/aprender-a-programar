// Lección 4 de la ruta "Páginas web: HTML y CSS". Lo que pueden usar las
// pruebas está explicado al comienzo de 01-hola-html.js.

globalThis.Rutas.agregarLeccion(
  'web',
  {
    id: 'estructura',
    titulo: 'Estructura de una página',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cajas con nombre: header, nav, main y footer',
        texto: [
          'Una página bien hecha no es una fila de etiquetas sueltas: está dividida en zonas, y cada zona tiene su propia etiqueta. Se llaman **etiquetas semánticas** porque su nombre dice para qué sirven.',
          '`<header>` es el encabezado: arriba, con el título y el nombre del sitio. `<nav>` es la zona de navegación, con los enlaces a las otras páginas. `<main>` guarda el contenido principal. `<footer>` es el pie de página, abajo, con datos como la dirección o el teléfono.',
          'Estas etiquetas no cambian cómo se ve la página; sirven para que **el código se entienda**, y para que los lectores de pantalla y Google sepan qué es cada parte. Todas van dentro del `<body>`.',
          'Piensa en un periódico: arriba el nombre (header), luego las secciones (nav), en el medio las noticias (main) y abajo los datos de contacto (footer).',
          '**Error común:** cerrar las zonas en desorden. Si abres `<main>` y adentro `<p>`, primero se cierra `</p>` y después `</main>`, como cajas una dentro de otra. Si escribes mal el nombre del cierre, como `</heder>`, verás: `Encontré </heder>, pero antes no hay ninguna <heder> abierta.`',
          'Ejecuta y fíjate en cómo cada zona envuelve su contenido.',
        ],
        codigo: [
          '<header>',
          '  <h1>Tienda Don Pepe</h1>',
          '</header>',
          '<nav>',
          '  <a href="#productos">Productos</a>',
          '  <a href="#contacto">Contacto</a>',
          '</nav>',
          '<main>',
          '  <p>Pan fresco, leche y tinto todos los días.</p>',
          '</main>',
          '<footer>',
          '  <p>Calle 10 con Carrera 5</p>',
          '</footer>',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Encabezado y contenido',
        texto: [
          'Esta página tiene el título y un párrafo sueltos. Organízala en dos zonas:',
          'Envuelve el `<h1>` en un `<header>` y envuelve el `<p>` en un `<main>`. Envolver es poner la etiqueta de apertura antes y la de cierre después.',
        ],
        codigo: [
          '<!-- TODO 1: envuelve este h1 en un header. -->',
          '<h1>Tienda Don Pepe</h1>',
          '<!-- TODO 2: envuelve este párrafo en un main. -->',
          '<p>Pan fresco, leche y tinto todos los días.</p>',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El h1 está dentro de un header',
            condicion: 'cuenta("header") === 1 && cuenta("header h1") === 1',
          },
          {
            descripcion: 'El párrafo está dentro de un main',
            condicion: 'cuenta("main") === 1 && cuenta("main p") === 1',
          },
          {
            descripcion: 'No quedó nada suelto fuera de las zonas',
            condicion: 'cuenta("h1") === 1 && cuenta("p") === 1 && uno("h1").padre.etiqueta === "header" && uno("p").padre.etiqueta === "main"',
          },
        ],
        pistas: [
          'Son dos zonas: cada una abre antes del contenido y cierra después.',
          'El `<header>` rodea al `<h1>` y el `<main>` rodea al `<p>`. Las etiquetas de abrir y cerrar son `<header>` y `</header>`.',
          'Escribe `<header>`, el `<h1>`, `</header>`, y debajo `<main>`, el `<p>` y `</main>`.',
        ],
        solucion: [
          '<header>',
          '  <h1>Tienda Don Pepe</h1>',
          '</header>',
          '<main>',
          '  <p>Pan fresco, leche y tinto todos los días.</p>',
          '</main>',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la página en cuatro zonas',
        texto: [
          'Ahora la página completa de Don Pepe, con las cuatro zonas. Todo el contenido está escrito, pero suelto y sin ninguna estructura.',
          'Organízalo así, en este orden: un `<header>` con el título, un `<nav>` con los dos enlaces, un `<main>` con el párrafo de los productos y un `<footer>` con la dirección. No cambies los textos.',
        ],
        codigo: [
          '<!-- TODO 1: header con el título. -->',
          '<h1>Tienda Don Pepe</h1>',
          '<!-- TODO 2: nav con los dos enlaces. -->',
          '<a href="#productos">Productos</a>',
          '<a href="#contacto">Contacto</a>',
          '<!-- TODO 3: main con el párrafo de los productos. -->',
          '<p>Pan fresco, leche y tinto todos los días.</p>',
          '<!-- TODO 4: footer con la dirección. -->',
          '<p>Calle 10 con Carrera 5</p>',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El h1 está dentro del header',
            condicion: 'cuenta("header") === 1 && cuenta("header h1") === 1',
          },
          {
            descripcion: 'Los dos enlaces están dentro del nav',
            condicion: 'cuenta("nav") === 1 && cuenta("nav a") === 2',
          },
          {
            descripcion: 'El párrafo de los productos está dentro del main',
            condicion: 'cuenta("main") === 1 && cuenta("main p") === 1 && /pan/i.test(texto("main p"))',
          },
          {
            descripcion: 'La dirección está dentro del footer',
            condicion: 'cuenta("footer") === 1 && /calle 10/i.test(texto("footer"))',
          },
          {
            descripcion: 'Las zonas están en orden: header, nav, main y footer',
            condicion: 'cuenta("header ~ nav") === 1 && cuenta("nav ~ main") === 1 && cuenta("main ~ footer") === 1',
          },
          {
            descripcion: 'Los enlaces y los textos siguen completos',
            condicion: 'cuenta("a") === 2 && cuenta("h1") === 1 && cuenta("p") === 2',
          },
        ],
        pistas: [
          'Cada zona rodea su contenido, y las cuatro quedan una debajo de la otra, en el orden del enunciado.',
          'Abre `<header>` antes del `<h1>`, ciérralo después. Haz igual con `<nav>` para los dos enlaces, `<main>` para el primer párrafo y `<footer>` para el segundo.',
          'El orden es: `<header>` con el h1; `<nav>` con los dos enlaces; `<main>` con el párrafo del pan; `<footer>` con el párrafo de la dirección.',
        ],
        solucion: [
          '<header>',
          '  <h1>Tienda Don Pepe</h1>',
          '</header>',
          '<nav>',
          '  <a href="#productos">Productos</a>',
          '  <a href="#contacto">Contacto</a>',
          '</nav>',
          '<main>',
          '  <p>Pan fresco, leche y tinto todos los días.</p>',
          '</main>',
          '<footer>',
          '  <p>Calle 10 con Carrera 5</p>',
          '</footer>',
        ].join('\n'),
      },
    ],
  }
);

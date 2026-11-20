// Lección 2 de la ruta "Páginas web: HTML y CSS". Lo que pueden usar las
// pruebas está explicado al comienzo de 01-hola-html.js.

globalThis.Rutas.agregarLeccion(
  'web',
  {
    id: 'listas-enlaces',
    titulo: 'Listas y enlaces',
    pasos: [
      {
        id: 'idea',
        titulo: 'Listas con viñetas, listas numeradas y enlaces',
        texto: [
          'Cuando tienes varias cosas del mismo tipo, como los productos de la tienda, lo mejor es una **lista**. Hay dos clases: `<ul>` (lista con viñetas, "unordered") y `<ol>` (lista numerada, "ordered"), para cuando el orden importa, como los pasos de una receta.',
          'Cada elemento de la lista va en su propia etiqueta `<li>`, y los `<li>` van **dentro** de la `<ul>` o la `<ol>`. Recuerda cerrar cada `<li>` con `</li>`.',
          'Un **enlace** se hace con la etiqueta `<a>` (de "anchor", ancla). El atributo `href` dice a dónde lleva, y el texto que queda en medio es lo que el usuario ve y toca: `<a href="contacto.html">Escríbenos</a>`.',
          'Un **atributo** es un dato extra que va dentro de la etiqueta de apertura, con la forma `nombre="valor"`. Ejecuta y mira cómo cambia la lista cuando agregas otro `<li>`.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 3: `<ul>` abre la lista. Líneas 4 a 6: un `<li>` por producto; cada uno sale con su viñeta. Línea 7: `</ul>` cierra la lista.',
          'Línea 8: dentro del párrafo, solo la palabra "escríbenos" es enlace. El resto del párrafo es texto normal.',
          '**Error común:** olvidar cerrar el enlace. Con `<a href="contacto.html">escríbenos` sin `</a>`, todo lo que sigue se volvería enlace. Aquí verás `Cerraste </p>, pero adentro todavía está abierta <a>`. Revisa que cada `<a>` tenga su `</a>` antes de cerrar el párrafo.',
        ],
        codigo: [
          '<h1>Tienda Don Pepe</h1>',
          '<p>Hoy tenemos:</p>',
          '<ul>',
          '  <li>Pan</li>',
          '  <li>Leche</li>',
          '  <li>Tinto</li>',
          '</ul>',
          '<p>Para pedidos, <a href="contacto.html">escríbenos</a>.</p>',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'La lista de mercado',
        texto: [
          'Doña Marta le pidió a Don Pepe su lista de productos. Escribe una lista con viñetas (`<ul>`) con **tres** productos de la tienda, cada uno en su `<li>`.',
          'Los `<li>` van dentro de la `<ul>`, nunca sueltos.',
        ],
        codigo: [
          '<h1>Productos de la tienda</h1>',
          '<!-- TODO 1: abre una lista con viñetas (ul). -->',
          '<!-- TODO 2: adentro, tres productos, cada uno en su li. -->',
          '<!-- TODO 3: cierra la lista. -->',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Hay una lista con viñetas (ul)', condicion: 'cuenta("ul") === 1' },
          { descripcion: 'La lista tiene tres elementos li', condicion: 'cuenta("ul > li") === 3' },
          {
            descripcion: 'Cada li dice el nombre de un producto',
            condicion: 'todos("ul > li").every((li) => li.texto !== "")',
          },
        ],
        pistas: [
          'La lista empieza con `<ul>` y termina con `</ul>`; los tres productos van entre las dos.',
          'Cada producto es una línea como `<li>Pan</li>`.',
          'Escribe: `<ul>`, luego `<li>Pan</li>`, `<li>Leche</li>` y `<li>Tinto</li>`, y al final `</ul>`.',
        ],
        solucion: [
          '<h1>Productos de la tienda</h1>',
          '<ul>',
          '  <li>Pan</li>',
          '  <li>Leche</li>',
          '  <li>Tinto</li>',
          '</ul>',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: receta y enlace',
        texto: [
          'Don Pepe quiere poner en su página cómo se prepara el tinto y un enlace para contactarlo. Ya está la lista de productos; no la cambies.',
          'Agrega una lista **numerada** (`<ol>`) con tres pasos para preparar el tinto, cada paso en un `<li>`.',
          'Y dentro del párrafo que ya está, convierte la palabra "escríbenos" en un enlace que lleve a `contacto.html`.',
          '(El `<h2>` que ya está es un **subtítulo**: un título de segundo nivel, más pequeño que el `<h1>`.)',
        ],
        codigo: [
          '<h1>Tienda Don Pepe</h1>',
          '<ul>',
          '  <li>Pan</li>',
          '  <li>Leche</li>',
          '  <li>Tinto</li>',
          '</ul>',
          '<h2>Cómo preparamos el tinto</h2>',
          '<!-- TODO 1: lista numerada (ol) con tres pasos, cada uno en su li. -->',
          '',
          '<!-- TODO 2: convierte "escríbenos" en un enlace a contacto.html. -->',
          '<p>Para pedidos, escríbenos.</p>',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La lista de productos sigue igual (ul con tres li)',
            condicion: 'cuenta("ul") === 1 && cuenta("ul > li") === 3',
          },
          { descripcion: 'Hay una lista numerada (ol)', condicion: 'cuenta("ol") === 1' },
          {
            descripcion: 'La ol tiene tres pasos li, todos con texto',
            condicion: 'cuenta("ol > li") === 3 && todos("ol > li").every((li) => li.texto !== "")',
          },
          {
            descripcion: 'Hay un enlace a contacto.html con texto para tocar',
            condicion: 'cuenta("a") === 1 && atributo("a", "href") === "contacto.html" && texto("a") !== ""',
          },
          {
            descripcion: 'El enlace está dentro del párrafo',
            condicion: 'cuenta("p a") === 1',
          },
        ],
        pistas: [
          'Son dos cambios: la lista `<ol>` en el lugar del comentario, y la etiqueta `<a>` rodeando una palabra del párrafo.',
          'La lista numerada tiene la misma forma que la `<ul>`, pero con `<ol>` y `</ol>`. El enlace es `<a href="contacto.html">escríbenos</a>`.',
          'Escribe `<ol>`, tres líneas como `<li>Hervir el agua</li>`, y `</ol>`. Después deja el párrafo así: `<p>Para pedidos, <a href="contacto.html">escríbenos</a>.</p>`',
        ],
        solucion: [
          '<h1>Tienda Don Pepe</h1>',
          '<ul>',
          '  <li>Pan</li>',
          '  <li>Leche</li>',
          '  <li>Tinto</li>',
          '</ul>',
          '<h2>Cómo preparamos el tinto</h2>',
          '<ol>',
          '  <li>Hervir el agua con panela.</li>',
          '  <li>Agregar el café molido.</li>',
          '  <li>Colar y servir caliente.</li>',
          '</ol>',
          '<p>Para pedidos, <a href="contacto.html">escríbenos</a>.</p>',
        ].join('\n'),
      },
    ],
  }
);

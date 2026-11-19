// Lección 13: accesibilidad. Lo que pueden usar las pruebas está explicado
// al comienzo de 01-hola-html.js; aquí se usa además contraste(a, b), que
// mide qué tanto se distinguen dos colores (de 1 a 21, el texto pide 4.5).
// Las pruebas revisan la página como lo haría un lector de pantalla: que
// cada imagen tenga alt, cada campo su <label>, los títulos en orden, y que
// lo que se puede tocar sea un <button> (que el teclado sí alcanza).

// Va dentro de una función para que sus constantes no choquen con las de
// otros archivos (en la página todos los scripts comparten el mismo espacio).
(function () {
  // El orden de los títulos, en una sola condición: el primero es h1 y nunca
  // se salta un nivel al bajar (de h2 a h4, por ejemplo). Se arma aparte para
  // que la lista de pruebas de abajo se lea mejor.
  const TITULOS_EN_ORDEN =
    '(() => { const niveles = todos("h1, h2, h3, h4, h5, h6").map((t) => Number(t.etiqueta[1])); ' +
    'return niveles[0] === 1 && niveles.filter((n) => n === 1).length === 1 && ' +
    'niveles.every((n, i) => i === 0 || n <= niveles[i - 1] + 1); })()';

  // Cada campo (menos los botones) tiene un <label for="…"> que apunta a su id.
  const CAMPOS_CON_LABEL =
    'todos("input, select, textarea").filter((c) => c.atributo("type") !== "submit").length > 0 && ' +
    'todos("input, select, textarea").filter((c) => c.atributo("type") !== "submit")' +
    '.every((c) => c.atributo("id") && cuenta(\'label[for="\' + c.atributo("id") + \'"]\') === 1)';

  globalThis.Rutas.agregarLeccion(
    'web',
    {
      id: 'accesibilidad',
      titulo: 'Accesibilidad: una página para todos',
      pasos: [
        {
          id: 'idea',
          titulo: 'Personas que usan la página de otra forma',
          texto: [
            'No todo el mundo usa una página con los ojos y el ratón. Una persona ciega la escucha con un **lector de pantalla**, que lee el HTML en voz alta. Otra no puede usar el ratón y se mueve con la tecla **Tab**. Alguien mayor necesita letras que se distingan bien del fondo. **Accesibilidad** es hacer que la página les sirva a todos (y además ayuda a que Google la entienda).',
            'Las reglas más importantes: `<html lang="es">` para que el lector use voz en español. Cada `<img>` lleva **`alt`** con lo que muestra (o `alt=""` si es solo adorno). Cada campo de un formulario tiene un **`<label for="id-del-campo">`**: así el lector dice "Nombre, campo de texto" en vez de solo "campo de texto".',
            '**Encabezados en orden**: un solo `<h1>`, y luego `<h2>`, `<h3>`… sin saltarse niveles. El lector los usa como índice para saltar de sección en sección. **Contraste**: el texto debe distinguirse del fondo; las pautas piden una relación de **4.5 a 1** o más. Gris claro sobre blanco no la cumple.',
            '**Teclado**: lo que se puede tocar debe ser un `<button>` o un `<a href>`, porque esos los alcanza la tecla Tab y se activan con Enter. Un `<div>` con un clic no se puede usar con el teclado. **ARIA**: atributos extra para cuando el HTML no alcanza. El más común es `aria-label`, que le da nombre a un botón que solo tiene un ícono: `<button aria-label="Ver carrito">🛒</button>`.',
            'La regla de oro de ARIA: primero usa la etiqueta correcta de HTML; ARIA es para lo que falta. Ejecuta el ejemplo: todo lo que acabas de leer está ahí.',
          ],
          codigo: [
            '<!DOCTYPE html>',
            '<html lang="es">',
            '  <head>',
            '    <title>Tienda Don Pepe</title>',
            '    <style>',
            '      body {',
            '        color: #222222;',
            '        background-color: #ffffff;',
            '      }',
            '    </style>',
            '  </head>',
            '  <body>',
            '    <header>',
            '      <h1>Tienda Don Pepe</h1>',
            '      <button aria-label="Ver carrito">🛒</button>',
            '    </header>',
            '    <main>',
            '      <h2>Productos</h2>',
            '      <img src="pan.png" alt="Pan francés recién horneado">',
            '      <h2>Contáctanos</h2>',
            '      <form>',
            '        <label for="nombre">Tu nombre</label>',
            '        <input type="text" id="nombre" name="nombre">',
            '        <button type="submit">Enviar</button>',
            '      </form>',
            '    </main>',
            '  </body>',
            '</html>',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Imágenes y campos con nombre',
          texto: [
            'Este formulario de pedidos es imposible de usar para alguien con lector de pantalla: las imágenes no dicen qué son y los campos no tienen etiqueta. Arréglalo:',
            '- Ponle a cada `<img>` un `alt` que describa el producto.',
            '- Agrega un `<label>` a cada campo, con `for` igual al `id` del campo. El campo del nombre tiene `id="nombre"` y el del teléfono `id="telefono"`.',
          ],
          codigo: [
            '<!DOCTYPE html>',
            '<html lang="es">',
            '  <head>',
            '    <title>Pedidos Don Pepe</title>',
            '  </head>',
            '  <body>',
            '    <h1>Haz tu pedido</h1>',
            '    <img src="pan.png">',
            '    <img src="leche.png">',
            '    <form>',
            '      <input type="text" id="nombre" name="nombre">',
            '      <input type="tel" id="telefono" name="telefono">',
            '      <button type="submit">Pedir</button>',
            '    </form>',
            '  </body>',
            '</html>',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Las dos imágenes tienen un alt con texto',
              condicion: 'cuenta("img") === 2 && todos("img").every((img) => (img.atributo("alt") || "").trim().length > 0)',
            },
            {
              descripcion: 'El campo del nombre tiene su label',
              condicion: 'cuenta(\'label[for="nombre"]\') === 1 && texto(\'label[for="nombre"]\') !== ""',
            },
            {
              descripcion: 'El campo del teléfono tiene su label',
              condicion: 'cuenta(\'label[for="telefono"]\') === 1 && texto(\'label[for="telefono"]\') !== ""',
            },
            {
              descripcion: 'Los campos conservan su id',
              condicion: 'cuenta("input#nombre") === 1 && cuenta("input#telefono") === 1',
            },
          ],
          pistas: [
            'El `alt` va dentro de la etiqueta de la imagen, como cualquier atributo: `<img src="pan.png" alt="…">`.',
            'El `<label>` va justo antes de su campo, y su `for` copia el `id` del campo: `<label for="telefono">Tu teléfono</label>`.',
            'Por ejemplo: `<img src="pan.png" alt="Pan francés">` y `<label for="nombre">Tu nombre</label>` antes de `<input type="text" id="nombre" name="nombre">`.',
          ],
          solucion: [
            '<!DOCTYPE html>',
            '<html lang="es">',
            '  <head>',
            '    <title>Pedidos Don Pepe</title>',
            '  </head>',
            '  <body>',
            '    <h1>Haz tu pedido</h1>',
            '    <img src="pan.png" alt="Pan francés">',
            '    <img src="leche.png" alt="Bolsa de leche entera">',
            '    <form>',
            '      <label for="nombre">Tu nombre</label>',
            '      <input type="text" id="nombre" name="nombre">',
            '      <label for="telefono">Tu teléfono</label>',
            '      <input type="tel" id="telefono" name="telefono">',
            '      <button type="submit">Pedir</button>',
            '    </form>',
            '  </body>',
            '</html>',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: la auditoría de accesibilidad',
          texto: [
            'Te contrataron para revisar la página de la tienda. Tiene seis problemas; arréglalos todos:',
            '- Falta el idioma: `<html lang="es">`.',
            '- Los títulos se saltan un nivel: después del `<h1>` viene un `<h3>`. Deben ir en orden (un solo `h1`, luego `h2`…).',
            '- El logo no tiene `alt`.',
            '- El campo de búsqueda no tiene `<label>` (su `id` es `buscar`).',
            '- El texto de `.aviso` es gris claro sobre blanco: dale un `color` más oscuro (por ejemplo `#333333`) para llegar a un contraste de 4.5 o más.',
            '- "Agregar al carrito" es un `<div>`: cámbialo por un `<button>` (con la misma clase) para que se pueda usar con el teclado. Y el botón del corazón, que solo tiene un ícono, necesita un `aria-label` (por ejemplo "Agregar a favoritos").',
          ],
          codigo: [
            '<!DOCTYPE html>',
            '<html>',
            '  <head>',
            '    <title>Tienda Don Pepe</title>',
            '    <style>',
            '      .aviso {',
            '        color: #aaaaaa;',
            '        background-color: #ffffff;',
            '      }',
            '    </style>',
            '  </head>',
            '  <body>',
            '    <h1>Tienda Don Pepe</h1>',
            '    <img src="logo.png">',
            '    <p class="aviso">Hoy hay domicilios gratis.</p>',
            '    <form>',
            '      <input type="search" id="buscar" name="buscar">',
            '    </form>',
            '    <h3>Pan francés</h3>',
            '    <div class="agregar">Agregar al carrito</div>',
            '    <button class="favorito">♥</button>',
            '  </body>',
            '</html>',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'La página dice que está en español (lang="es")',
              condicion: '/^es\\b/.test(atributo("html", "lang") || "")',
            },
            {
              descripcion: 'Los títulos van en orden: un h1 y sin saltarse niveles',
              condicion: TITULOS_EN_ORDEN,
            },
            {
              descripcion: 'El logo tiene un alt con texto',
              condicion: '(atributo("img", "alt") || "").trim().length > 0',
            },
            {
              descripcion: 'El campo de búsqueda tiene su label',
              condicion: CAMPOS_CON_LABEL,
            },
            {
              descripcion: 'El aviso tiene un contraste de 4.5 o más',
              condicion: 'contraste(color(".aviso", "color"), color(".aviso", "background-color")) >= 4.5',
            },
            {
              descripcion: '"Agregar al carrito" es un button y no un div',
              condicion: 'cuenta("div.agregar") === 0 && mismoTexto(texto("button.agregar"), "Agregar al carrito")',
            },
            {
              descripcion: 'El botón del corazón tiene un aria-label',
              condicion: '(atributo("button.favorito", "aria-label") || "").trim().length > 0',
            },
          ],
          pistas: [
            'Ve uno por uno: el `lang` va en la etiqueta `<html>`, el `alt` en el `<img>` y el `aria-label` en el `<button class="favorito">`.',
            'El `<h3>` pasa a ser `<h2>` (abre y cierra). El `<div class="agregar">` pasa a ser `<button class="agregar">`. Antes del campo de búsqueda va `<label for="buscar">Buscar productos</label>`.',
            'En el CSS, cambia `color: #aaaaaa;` por `color: #333333;` en la regla `.aviso`. Y el corazón queda: `<button class="favorito" aria-label="Agregar a favoritos">♥</button>`.',
          ],
          solucion: [
            '<!DOCTYPE html>',
            '<html lang="es">',
            '  <head>',
            '    <title>Tienda Don Pepe</title>',
            '    <style>',
            '      .aviso {',
            '        color: #333333;',
            '        background-color: #ffffff;',
            '      }',
            '    </style>',
            '  </head>',
            '  <body>',
            '    <h1>Tienda Don Pepe</h1>',
            '    <img src="logo.png" alt="Logo de la Tienda Don Pepe">',
            '    <p class="aviso">Hoy hay domicilios gratis.</p>',
            '    <form>',
            '      <label for="buscar">Buscar productos</label>',
            '      <input type="search" id="buscar" name="buscar">',
            '    </form>',
            '    <h2>Pan francés</h2>',
            '    <button class="agregar">Agregar al carrito</button>',
            '    <button class="favorito" aria-label="Agregar a favoritos">♥</button>',
            '  </body>',
            '</html>',
          ].join('\n'),
        },
      ],
    }
  );
})();

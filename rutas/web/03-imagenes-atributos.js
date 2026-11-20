// Lección 3 de la ruta "Páginas web: HTML y CSS". Lo que pueden usar las
// pruebas está explicado al comienzo de 01-hola-html.js.
//
// La app funciona sin internet, así que las imágenes no vienen de una
// dirección web: usan un "data:", una imagen diminuta escrita dentro del
// mismo atributo src. Va dentro de una función para no dejar variables sueltas
// en el espacio global.

(() => {
  const IMAGEN = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

  globalThis.Rutas.agregarLeccion(
    'web',
    {
      id: 'imagenes-atributos',
      titulo: 'Imágenes y atributos',
      pasos: [
        {
          id: 'idea',
          titulo: 'La etiqueta img y el texto alternativo',
          texto: [
            'Las imágenes se ponen con `<img>`. Es una etiqueta **vacía**: no tiene contenido en medio, así que no lleva etiqueta de cierre. Toda la información va en sus **atributos**.',
            'Los dos atributos principales son `src` (de "source": de dónde sale la imagen) y `alt` (el **texto alternativo**: una descripción corta de lo que muestra la imagen).',
            '¿Por qué importa `alt`? Si la imagen no carga (internet lento, mala dirección), el navegador muestra el `alt` en su lugar. Y las personas ciegas usan lectores de pantalla que **leen en voz alta** ese texto: sin `alt`, para ellas la imagen no existe.',
            'Aquí `src` trae una imagen diminuta escrita dentro de la misma etiqueta (empieza con `data:`), porque esta app funciona sin internet. Normalmente ahí va el nombre de un archivo, como `pan.png`. Con `width` y `height` se le da el tamaño en píxeles. Ejecuta y cambia el `alt`.',
            'Un **píxel** es cada puntico de la pantalla. `width="120"` significa "120 puntos de ancho".',
            '**Error común:** pegar los atributos o dejar el valor sin cerrar. `<img src="pan.png"alt="Pan">` (sin espacio) o `alt="Pan fresco` (sin la comilla final) confunden al navegador y el `alt` se pierde. Cada atributo va separado por un espacio, con su valor entre dos comillas.',
          ],
          codigo: [
            '<h1>Pan fresco</h1>',
            '<img src="' + IMAGEN + '" alt="Una canasta con pan recién horneado" width="120" height="80">',
            '<p>Lo horneamos cada mañana.</p>',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Dale voz a la imagen',
          texto: [
            'Esta imagen del pan no tiene texto alternativo, así que una persona ciega no sabría qué muestra.',
            'Agrega el atributo `alt` dentro de la etiqueta `<img>`, con una descripción que mencione el pan. Por ejemplo: `alt="Pan fresco"`. Los atributos se separan con un espacio y el valor va entre comillas.',
          ],
          codigo: [
            '<h1>Pan fresco</h1>',
            '<!-- TODO: agrega dentro de esta img un atributo alt que describa el pan. -->',
            '<img src="' + IMAGEN + '" width="120" height="80">',
            '<p>Lo horneamos cada mañana.</p>',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Sigue habiendo una sola imagen', condicion: 'cuenta("img") === 1' },
            {
              descripcion: 'La imagen conserva su src',
              condicion: '(atributo("img", "src") || "").length > 0',
            },
            {
              descripcion: 'La imagen tiene un alt con texto',
              condicion: '(atributo("img", "alt") || "").trim() !== ""',
            },
            {
              descripcion: 'El alt describe el pan',
              condicion: '/pan/i.test(atributo("img", "alt") || "")',
            },
          ],
          pistas: [
            'El `alt` va dentro de la etiqueta `<img ...>`, entre los demás atributos y antes del `>`.',
            'Un atributo se escribe `nombre="valor"`, así que quedaría `alt="..."` con tu descripción adentro.',
            'Agrega `alt="Pan fresco"` después del `src`, separado por un espacio.',
          ],
          solucion: [
            '<h1>Pan fresco</h1>',
            '<img src="' + IMAGEN + '" alt="Pan fresco" width="120" height="80">',
            '<p>Lo horneamos cada mañana.</p>',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: la vitrina',
          texto: [
            'Don Pepe puso dos fotos en la vitrina de su página: una del pan y otra de la leche. Las dos tienen `src`, pero les falta todo lo demás.',
            'A **cada** imagen ponle un `alt` que diga qué muestra (una menciona el pan y la otra la leche) y un `width="120"` para que las dos salgan del mismo ancho.',
          ],
          codigo: [
            '<h1>La vitrina</h1>',
            '<!-- TODO 1: a esta imagen (el pan) ponle alt y width="120". -->',
            '<img src="' + IMAGEN + '">',
            '<!-- TODO 2: a esta imagen (la leche) ponle alt y width="120". -->',
            '<img src="' + IMAGEN + '">',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Hay dos imágenes', condicion: 'cuenta("img") === 2' },
            {
              descripcion: 'Las dos imágenes tienen alt con texto',
              condicion: 'todos("img").every((i) => (i.atributo("alt") || "").trim() !== "")',
            },
            {
              descripcion: 'Un alt menciona el pan y el otro la leche',
              condicion:
                '(() => { const a = todos("img").map((i) => i.atributo("alt") || ""); return a.length === 2 && ((/pan/i.test(a[0]) && /leche/i.test(a[1])) || (/leche/i.test(a[0]) && /pan/i.test(a[1]))); })()',
            },
            {
              descripcion: 'Las dos imágenes tienen width="120"',
              condicion: 'todos("img").every((i) => i.atributo("width") === "120")',
            },
            {
              descripcion: 'Las dos imágenes siguen con su src',
              condicion: 'todos("img").every((i) => (i.atributo("src") || "").length > 0)',
            },
          ],
          pistas: [
            'Hay que editar las dos etiquetas `<img>`, agregándole dos atributos a cada una.',
            'La primera imagen es la del pan y la segunda la de la leche. Cada atributo se escribe `nombre="valor"`.',
            'Después del `src`, en la primera agrega `alt="Pan fresco" width="120"` y en la segunda `alt="Botella de leche" width="120"`.',
          ],
          solucion: [
            '<h1>La vitrina</h1>',
            '<img src="' + IMAGEN + '" alt="Pan fresco" width="120">',
            '<img src="' + IMAGEN + '" alt="Botella de leche" width="120">',
          ].join('\n'),
        },
      ],
    }
  );
})();

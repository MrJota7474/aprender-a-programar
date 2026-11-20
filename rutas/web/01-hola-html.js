// Ruta "Páginas web: HTML y CSS", lección 1. Mismo formato que las demás
// rutas. Diferencias:
// - El código es un documento HTML (el CSS va dentro de una etiqueta <style>).
//   Al ejecutar, la página se ve en la vista previa.
// - El HTML tiene que estar bien formado: toda etiqueta que se abre se
//   cierra (también <p> y <li>), y en orden. Si no, el estudiante ve un
//   error en español y las pruebas no corren. Por eso el "codigo" inicial de
//   cada paso también debe estar bien formado.
// - Las "condicion" de las pruebas son JavaScript y pueden usar:
//     cuenta(selector)          → cuántos elementos hay: cuenta("ul > li") === 3
//     texto(selector)           → el texto del primero, con los espacios arreglados
//                                 y sin etiquetas ("" si no existe)
//     atributo(selector, nombre)→ su valor, o null: atributo("a", "href")
//     uno(selector), todos(selector) → el elemento (o null) y la lista de elementos.
//                                 Cada elemento tiene: etiqueta, texto, clases, hijos,
//                                 padre, atributo(nombre), estilo(prop), color(prop),
//                                 uno(selector) y todos(selector) para buscar adentro
//     mismoTexto(a, b)          → compara sin importar mayúsculas, tildes, espacios
//                                 de más ni el punto final
//     tieneDoctype              → true si el documento empieza con <!DOCTYPE html>
//     estilo(selector, prop)    → el valor de CSS que le queda al elemento, en minúsculas,
//                                 sin comillas ni espacios junto a las comas:
//                                 estilo("body", "font-family") → "arial,sans-serif".
//                                 "" si nadie se lo dio. Tiene en cuenta la herencia, cuál
//                                 regla gana, style="…" y las abreviadas (margin → margin-top,
//                                 background → background-color, border → border-color…).
//                                 Solo conoce el CSS del estudiante, no lo que el navegador
//                                 trae de fábrica.
//     color(selector, prop)     → igual, pero el color siempre como "#rrggbb":
//                                 red, #f00, #FF0000 y rgb(255, 0, 0) dan "#ff0000"
//     aHex(valor)               → convierte un color suelto a "#rrggbb" (null si no es color)
//     contraste(a, b)           → contraste entre dos colores, de 1 a 21 (WCAG; el texto pide
//                                 4.5 o más): contraste(color("p", "color"), color("p", "background-color"))
//     reglas                    → las reglas de CSS: [{ selector, selectores, propiedades }]
//     regla(selector)           → las propiedades de ESE selector exacto, o null:
//                                 regla(".oferta")["background-color"]
//                                 (las de @media no están aquí: están en "medias")
//     medias                    → las reglas de dentro de @media: [{ media, selector,
//                                 selectores, propiedades }], media = "(min-width: 600px)"
//     estiloEn(ancho, selector, prop) → como estilo(), pero en una pantalla de "ancho"
//                                 píxeles: cuentan las @media con min-width/max-width que
//                                 se cumplan. estilo() a secas no aplica ninguna @media.
//     codigo                    → lo que escribió, sin comentarios
//     salida                    → lo que mostró con console.log (lección de JavaScript)
//     clic(selector), escribir(selector, valor) → hacen clic o escriben en un campo de la
//                                 página (lección de JavaScript). Devuelven true si el
//                                 elemento existe: clic("button") && texto("#saludo") === "Hola"
//   Los selectores son los de CSS: etiqueta, .clase, #id, [atributo="valor"],
//   "a b", "a > b", "a + b", "a ~ b", "a, b", :first-child, :last-child, :nth-child(n), :not(x).
//   Las pruebas corren en orden sobre la misma página (un clic se queda hecho).
// - Para aceptar respuestas razonables: los nombres de etiquetas y atributos
//   ya llegan en minúsculas y da igual el tipo de comillas o el orden de los
//   atributos; para textos usa mismoTexto, y para colores usa color().

globalThis.Rutas.agregarLeccion(
  'web',
  {
    id: 'hola-html',
    titulo: 'Hola, HTML',
    pasos: [
      {
        id: 'idea',
        titulo: 'Una página es texto con etiquetas',
        texto: [
          'Toda página web está escrita en **HTML**. No es un lenguaje para dar órdenes, como Python: sirve para **marcar** qué es cada pedazo de texto. Esto es un título, esto es un párrafo.',
          'Las marcas se llaman **etiquetas** y van entre `<` y `>`. Casi todas vienen en pareja: una abre (`<h1>`) y otra cierra, con una barra (`</h1>`). Lo que queda en medio es el contenido.',
          '`<h1>` es el título principal de la página y `<p>` es un párrafo.',
          'Un **elemento** es el conjunto completo: etiqueta que abre, contenido y etiqueta que cierra. `<p>Hola</p>` es un elemento párrafo.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: `<h1>` abre el título, "Tienda Don Pepe" es su contenido y `</h1>` lo cierra. El navegador lo muestra grande y en negrita.',
          'Líneas 2 y 3: dos párrafos. Cada uno sale en su propio renglón, con un espacio entre ellos.',
          '**Error común:** olvidar la barra al cerrar. Si escribes `<h1>Hola<h1>`, la segunda etiqueta abre otro título en vez de cerrar el primero. Aquí verás: `La etiqueta <h1> no se cerró. Parece que a la etiqueta de cierre le faltó la barra: se escribe </h1>.`',
          'Presiona **Ejecutar** para ver la página en la vista previa. Luego cambia los textos y ejecútala otra vez.',
        ],
        codigo: [
          '<h1>Tienda Don Pepe</h1>',
          '<p>Abrimos todos los días, de 6 de la mañana a 9 de la noche.</p>',
          '<p>Hoy hay pan fresco, leche y tinto recién hecho.</p>',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El letrero de la tienda',
        texto: [
          'Ahora tú. Escribe un título `<h1>` que diga `Tienda Don Pepe` y, debajo, un párrafo `<p>` que cuente dónde queda la tienda (inventa la dirección).',
          'Ojo con cerrar cada etiqueta: la de cierre lleva una barra, `</h1>` y `</p>`. Si se te olvida, el error te dice cuál faltó.',
        ],
        codigo: [
          '<!-- Esto es un comentario de HTML: el navegador no lo muestra. -->',
          '<!-- TODO 1: escribe un título h1 que diga Tienda Don Pepe. -->',
          '',
          '<!-- TODO 2: debajo, un párrafo p con la dirección de la tienda. -->',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Hay un solo título h1', condicion: 'cuenta("h1") === 1' },
          {
            descripcion: 'El título dice Tienda Don Pepe',
            condicion: 'mismoTexto(texto("h1"), "Tienda Don Pepe")',
          },
          {
            descripcion: 'Después del título hay un párrafo con la dirección',
            condicion: 'todos("h1 ~ p").some((p) => p.texto !== "")',
          },
        ],
        pistas: [
          'Son dos etiquetas, una debajo de la otra: primero el `<h1>` y después el `<p>`.',
          'El título queda así: `<h1>Tienda Don Pepe</h1>`. El párrafo tiene la misma forma, con `<p>` y `</p>`.',
          'Debajo del título escribe, por ejemplo: `<p>Estamos en la Calle 10 con Carrera 5.</p>`',
        ],
        solucion: ['<h1>Tienda Don Pepe</h1>', '<p>Estamos en la Calle 10 con Carrera 5.</p>'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la página completa',
        texto: [
          'Una página de verdad tiene un **esqueleto** que siempre es igual. Ya está escrito en el editor; léelo de arriba hacia abajo.',
          '`<!DOCTYPE html>` le avisa al navegador que esto es HTML. `<html>` envuelve toda la página y adentro tiene dos partes: `<head>`, con datos que no se ven en la página (como `<title>`, el nombre que sale en la pestaña), y `<body>`, con todo lo que sí se ve.',
          'Fíjate que unas etiquetas van **dentro** de otras. Por eso se escriben un poco más a la derecha: así se nota quién contiene a quién.',
          'Completa la página: en `<title>` escribe `Tienda Don Pepe`, y dentro de `<body>` pon un `<h1>` con el nombre de la tienda y **dos** párrafos: uno con el horario y otro con lo que venden.',
        ],
        codigo: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title></title>',
          '  </head>',
          '  <body>',
          '    <!-- TODO: aquí van un h1 con el nombre de la tienda y dos párrafos -->',
          '    <!-- (uno con el horario y otro con lo que venden). -->',
          '',
          '  </body>',
          '</html>',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El esqueleto sigue completo: <!DOCTYPE html>, html, head y body',
            condicion: 'tieneDoctype && cuenta("html > head") === 1 && cuenta("html > body") === 1',
          },
          {
            descripcion: 'El title (el nombre de la pestaña) dice Tienda Don Pepe',
            condicion: 'mismoTexto(texto("head > title"), "Tienda Don Pepe")',
          },
          {
            descripcion: 'Dentro del body hay un h1 con el nombre de la tienda',
            condicion: 'mismoTexto(texto("body h1"), "Tienda Don Pepe")',
          },
          {
            descripcion: 'Dentro del body hay al menos dos párrafos con texto',
            condicion: 'todos("body p").filter((p) => p.texto !== "").length >= 2',
          },
          {
            descripcion: 'Lo que se ve está en el body, no en el head',
            condicion: 'cuenta("head h1, head p") === 0',
          },
        ],
        pistas: [
          'El nombre de la pestaña va entre `<title>` y `</title>`, que ya están escritas dentro del `<head>`.',
          'El título y los párrafos van en la línea vacía que hay entre `<body>` y `</body>`.',
          'Dentro del body escribe tres líneas: `<h1>Tienda Don Pepe</h1>`, `<p>Abrimos de 6 a 9.</p>` y `<p>Vendemos pan, leche y tinto.</p>`',
        ],
        solucion: [
          '<!DOCTYPE html>',
          '<html>',
          '  <head>',
          '    <title>Tienda Don Pepe</title>',
          '  </head>',
          '  <body>',
          '    <h1>Tienda Don Pepe</h1>',
          '    <p>Abrimos todos los días, de 6 de la mañana a 9 de la noche.</p>',
          '    <p>Vendemos pan fresco, leche y tinto.</p>',
          '  </body>',
          '</html>',
        ].join('\n'),
      },
    ],
  }
);

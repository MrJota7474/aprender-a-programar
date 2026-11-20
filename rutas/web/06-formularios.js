// Lección 6 de la ruta "Páginas web: HTML y CSS". Lo que pueden usar las
// pruebas está explicado al comienzo de 01-hola-html.js.

globalThis.Rutas.agregarLeccion(
  'web',
  {
    id: 'formularios',
    titulo: 'Formularios',
    pasos: [
      {
        id: 'idea',
        titulo: 'Campos para que el usuario escriba',
        texto: [
          'Un **formulario** le permite al usuario escribir datos: su nombre, un pedido, un mensaje. Todo va dentro de una etiqueta `<form>`.',
          'Cada dato que pides lleva dos piezas. La primera es el campo, `<input>`: una etiqueta vacía (sin cierre) con tres atributos: `type` (la clase de dato: `text` para texto, `number` para números), `id` (un nombre único para encontrarlo) y `name` (el nombre con el que viaja el dato al enviarse).',
          'La segunda pieza es la **etiqueta** `<label>`: el texto que le dice al usuario qué escribir. Se conecta con su campo mediante el atributo `for`, que debe ser **igual al `id`** del campo. Así, al tocar el texto, el cursor salta al campo, y los lectores de pantalla saben qué campo es cuál.',
          'Por último, el `<button>` envía el formulario. Ejecuta y escribe en el campo.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 2: el texto "Tu nombre:" con `for="nombre"`: apunta al campo cuyo `id` es "nombre". Línea 3: ese campo. Fíjate que el `for` y el `id` son la misma palabra.',
          'Línea 4: el botón. Línea 5: `</form>` cierra el formulario; todo lo de adentro viaja junto al enviarlo.',
          '**Error común:** que el `for` y el `id` no coincidan, por ejemplo `for="Nombre"` con `id="nombre"` (una mayúscula de diferencia). No sale ningún error, pero el label queda desconectado: al tocarlo no pasa nada y un lector de pantalla no sabe qué pide el campo. Cópialos letra por letra.',
        ],
        codigo: [
          '<form>',
          '  <label for="nombre">Tu nombre:</label>',
          '  <input id="nombre" type="text" name="nombre">',
          '  <button>Enviar</button>',
          '</form>',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El campo del nombre',
        texto: [
          'Don Pepe quiere saber a nombre de quién anotar los pedidos.',
          'Dentro del `<form>`, escribe un `<label>` que diga "Nombre" y, conectado a él, un `<input>` de tipo `text`. Usa `nombre` como `id` y como `name`, y recuerda que el `for` del label debe ser igual al `id` del input.',
        ],
        codigo: [
          '<h1>Haz tu pedido</h1>',
          '<form>',
          '  <!-- TODO 1: un label que diga Nombre, con for="nombre". -->',
          '  <!-- TODO 2: un input de tipo text con id y name iguales a nombre. -->',
          '',
          '</form>',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Hay un campo input dentro del form', condicion: 'cuenta("form input") === 1' },
          {
            descripcion: 'El input es de tipo text',
            condicion: 'atributo("input", "type") === "text"',
          },
          {
            descripcion: 'El input tiene id y name',
            condicion: '(atributo("input", "id") || "") !== "" && (atributo("input", "name") || "") !== ""',
          },
          {
            descripcion: 'El label tiene texto y su for es igual al id del input',
            condicion:
              'cuenta("form label") === 1 && texto("label") !== "" && atributo("label", "for") === atributo("input", "id")',
          },
        ],
        pistas: [
          'Son dos etiquetas: el `<label>` (con texto en medio y su cierre) y el `<input>` (vacía, sin cierre).',
          'El label se escribe `<label for="nombre">Nombre</label>` y el input lleva tres atributos: `id`, `type` y `name`.',
          'Escribe `<label for="nombre">Nombre</label>` y debajo `<input id="nombre" type="text" name="nombre">`.',
        ],
        solucion: [
          '<h1>Haz tu pedido</h1>',
          '<form>',
          '  <label for="nombre">Nombre</label>',
          '  <input id="nombre" type="text" name="nombre">',
          '</form>',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el pedido completo',
        texto: [
          'Completa el formulario de pedidos. El campo del nombre ya está listo y es tu modelo.',
          'Agrega un segundo campo para la **cantidad** de panes: su `<label>` ("Cantidad"), y un `<input>` de tipo `number` con `id` y `name` iguales a `cantidad` (el `for` del label, igual al `id`). Después, al final del formulario, un `<button>` con el texto "Enviar pedido".',
        ],
        codigo: [
          '<h1>Haz tu pedido</h1>',
          '<form>',
          '  <label for="nombre">Nombre</label>',
          '  <input id="nombre" type="text" name="nombre">',
          '',
          '  <!-- TODO 1: label "Cantidad" conectado a un input de tipo number (id y name: cantidad). -->',
          '  <!-- TODO 2: al final, un button que diga Enviar pedido. -->',
          '',
          '</form>',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El formulario tiene dos campos input',
            condicion: 'cuenta("form input") === 2',
          },
          {
            descripcion: 'Hay un campo de tipo number con id y name',
            condicion:
              'cuenta("input[type=number]") === 1 && (atributo("input[type=number]", "id") || "") !== "" && (atributo("input[type=number]", "name") || "") !== ""',
          },
          {
            descripcion: 'Cada input tiene su propio label conectado con for = id',
            condicion:
              'cuenta("label") === 2 && todos("input").every((i) => (i.atributo("id") || "") !== "" && cuenta("label[for=\\"" + i.atributo("id") + "\\"]") === 1)',
          },
          {
            descripcion: 'Los dos labels tienen texto',
            condicion: 'todos("label").every((l) => l.texto !== "")',
          },
          {
            descripcion: 'Hay un botón dentro del form que dice Enviar pedido',
            condicion: 'cuenta("form button") === 1 && mismoTexto(texto("button"), "Enviar pedido")',
          },
        ],
        pistas: [
          'Te faltan tres etiquetas dentro del `<form>`: un `<label>`, un `<input>` y un `<button>`.',
          'Copia el label y el input del nombre y cambia `nombre` por `cantidad`; en el input cambia también el `type` a `number`.',
          'Debajo del nombre escribe: `<label for="cantidad">Cantidad</label>`, `<input id="cantidad" type="number" name="cantidad">` y `<button>Enviar pedido</button>`.',
        ],
        solucion: [
          '<h1>Haz tu pedido</h1>',
          '<form>',
          '  <label for="nombre">Nombre</label>',
          '  <input id="nombre" type="text" name="nombre">',
          '',
          '  <label for="cantidad">Cantidad</label>',
          '  <input id="cantidad" type="number" name="cantidad">',
          '',
          '  <button>Enviar pedido</button>',
          '</form>',
        ].join('\n'),
      },
    ],
  }
);

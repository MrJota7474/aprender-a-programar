// Ruta "Interfaces con React", lección 4: estado (useState) y eventos.
// Cómo se arma el código y qué pueden usar las pruebas: ver 01-crear-elementos.js.
// Desde aquí el código trae también la parte "estado" de la mini React:
// useState, montar(App) → { html(), arbol() }, clic(app, texto) y
// escribir(app, name, valor). Cada prueba monta su propia app, para que
// lo que haga una no cambie lo que ve la siguiente.

(function () {
  const { armar } = globalThis.MiniReact;

  // Abre la app, hace unas acciones y revisa el HTML que quedó. Se escribe
  // como texto porque las condiciones de las pruebas son texto.
  const despues = (acciones, esperado) =>
    '(() => { const app = montar(Domicilio); ' + acciones + ' return app.html().includes(' + JSON.stringify(esperado) + '); })()';

  globalThis.Rutas.agregarLeccion('react', {
    id: 'estado-eventos',
    titulo: 'Estado y eventos: una página que responde',
    pasos: [
      {
        id: 'idea',
        titulo: 'La memoria de un componente',
        texto: [
          'Hasta ahora los componentes dibujan siempre lo mismo para las mismas props. Pero un carrito cambia cuando tocas "Agregar". Lo que un componente **recuerda y puede cambiar** se llama **estado**.',
          'En React se crea con `useState`: `const [cantidad, setCantidad] = useState(0);`. Devuelve dos cosas: el valor actual (empieza en `0`) y una función para cambiarlo. Por costumbre la segunda se llama `set` + el nombre.',
          'La clave: nunca cambias el valor a mano (`cantidad = 5` no sirve). Llamas a `setCantidad(5)` y React **vuelve a dibujar** el componente con el valor nuevo. Tú solo describes cómo se ve para cada valor.',
          'Los **eventos** se conectan con props que empiezan por `on`: `onClick` para clics, `onChange` cuando escriben en un campo. En JSX: `<button onClick={() => setCantidad(cantidad + 1)}>Agregar</button>`.',
          'En React real, `useState` se importa (`import { useState } from "react"`) y la app se monta en la página con `createRoot(...).render(<App />)`. Aquí, `montar(App)` hace eso último, y como no hay ratón, `clic(app, "Agregar")` simula el clic. Ejecuta el ejemplo.',
        ],
        codigo: armar('estado', [
          'function Contador() {',
          '  const [cantidad, setCantidad] = useState(0);',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('p', null, 'Panes: ' + cantidad),",
          "    h('button', { onClick: () => setCantidad(cantidad + 1) }, 'Agregar')",
          '  );',
          '}',
          '',
          'const app = montar(Contador);',
          'console.log(app.html());',
          "clic(app, 'Agregar');",
          "clic(app, 'Agregar');",
          'console.log(app.html());',
        ]),
      },
      {
        id: 'practica',
        titulo: 'Agregar y vaciar',
        texto: [
          'El contador de panes tiene un botón "Agregar" que no hace nada. Arréglalo:',
          '- Que "Agregar" sume 1 a la cantidad con `setCantidad`.',
          '- Agrega un segundo botón con el texto `Vaciar` que deje la cantidad en `0`.',
        ],
        codigo: armar('estado', [
          'function Contador() {',
          '  const [cantidad, setCantidad] = useState(0);',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('p', null, 'Panes: ' + cantidad),",
          "    h('button', { onClick: () => {} }, 'Agregar')",
          '  );',
          '}',
          '',
          'const app = montar(Contador);',
          "clic(app, 'Agregar');",
          'console.log(app.html());',
        ]),
        pruebas: [
          {
            descripcion: 'Al empezar dice Panes: 0',
            condicion: 'montar(Contador).html().includes("<p>Panes: 0</p>")',
          },
          {
            descripcion: 'Dos clics en Agregar dejan Panes: 2',
            condicion:
              '(() => { const app = montar(Contador); clic(app, "Agregar"); clic(app, "Agregar"); ' +
              'return app.html().includes("<p>Panes: 2</p>"); })()',
          },
          {
            descripcion: 'Vaciar deja la cantidad en 0',
            condicion:
              '(() => { const app = montar(Contador); clic(app, "Agregar"); clic(app, "Vaciar"); ' +
              'return app.html().includes("<p>Panes: 0</p>"); })()',
          },
          {
            descripcion: 'Después de vaciar se puede volver a agregar',
            condicion:
              '(() => { const app = montar(Contador); clic(app, "Agregar"); clic(app, "Vaciar"); clic(app, "Agregar"); ' +
              'return app.html().includes("<p>Panes: 1</p>"); })()',
          },
        ],
        pistas: [
          'En el `onClick` de "Agregar", la función vacía `() => {}` debe llamar a `setCantidad` con la cantidad más uno.',
          "El botón nuevo es otro hijo del `div`: `h('button', { onClick: … }, 'Vaciar')`. Acuérdate de la coma antes.",
          "Los dos botones quedan: `h('button', { onClick: () => setCantidad(cantidad + 1) }, 'Agregar')` y `h('button', { onClick: () => setCantidad(0) }, 'Vaciar')`",
        ],
        solucion: armar('estado', [
          'function Contador() {',
          '  const [cantidad, setCantidad] = useState(0);',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('p', null, 'Panes: ' + cantidad),",
          "    h('button', { onClick: () => setCantidad(cantidad + 1) }, 'Agregar'),",
          "    h('button', { onClick: () => setCantidad(0) }, 'Vaciar')",
          '  );',
          '}',
          '',
          'const app = montar(Contador);',
          "clic(app, 'Agregar');",
          'console.log(app.html());',
        ]),
      },
      {
        id: 'reto',
        titulo: 'Reto: el pedido a domicilio',
        texto: [
          'El componente `Domicilio` pide la dirección del cliente. Tiene **dos** estados: `direccion` (lo escrito, empieza en `""`) y `confirmado` (empieza en `false`). Complétalo:',
          '- El `input` necesita `onChange`: cuando escriben, guarda lo escrito con `setDireccion(evento.target.value)`. Así funciona también en React real: lo escrito llega en `evento.target.value`.',
          '- El párrafo dice `Escribe tu dirección` si la dirección está vacía, y si no, `Enviar a: ` seguido de la dirección.',
          '- El botón `Confirmar` pone `confirmado` en `true`, **pero solo si hay una dirección**.',
          '- Cuando `confirmado` es `true`, en vez del párrafo de antes se muestra `<p>¡Pedido confirmado!</p>`.',
          'Las pruebas escriben en el campo con `escribir(app, "direccion", "Calle 10")`, que simula a una persona escribiendo.',
        ],
        codigo: armar('estado', [
          'function Domicilio() {',
          "  const [direccion, setDireccion] = useState('');",
          '  const [confirmado, setConfirmado] = useState(false);',
          '',
          "  const mensaje = 'Escribe tu dirección';",
          '',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('input', { name: 'direccion', value: direccion }),",
          "    h('p', null, mensaje),",
          "    h('button', { onClick: () => {} }, 'Confirmar')",
          '  );',
          '}',
          '',
          'const app = montar(Domicilio);',
          'console.log(app.html());',
        ]),
        pruebas: [
          {
            descripcion: 'Al empezar pide la dirección',
            condicion: despues('', '<p>Escribe tu dirección</p>'),
          },
          {
            descripcion: 'Al escribir, muestra Enviar a: y la dirección',
            condicion: despues('escribir(app, "direccion", "Calle 10 # 5-20");', '<p>Enviar a: Calle 10 # 5-20</p>'),
          },
          {
            descripcion: 'El campo muestra lo que se escribió (value)',
            condicion: despues('escribir(app, "direccion", "Carrera 7");', 'value="Carrera 7"'),
          },
          {
            descripcion: 'Confirmar con dirección muestra ¡Pedido confirmado!',
            condicion: despues('escribir(app, "direccion", "Calle 10"); clic(app, "Confirmar");', '<p>¡Pedido confirmado!</p>'),
          },
          {
            descripcion: 'Confirmar sin dirección no confirma',
            condicion: despues('clic(app, "Confirmar");', '<p>Escribe tu dirección</p>'),
          },
        ],
        pistas: [
          'Al `input` agrégale una prop más: `onChange: (evento) => setDireccion(evento.target.value)`.',
          "Calcula el mensaje con condiciones: si `confirmado`, `'¡Pedido confirmado!'`; si no, si `direccion === ''`, `'Escribe tu dirección'`; si no, `'Enviar a: ' + direccion`.",
          "El botón queda: `h('button', { onClick: () => { if (direccion !== '') setConfirmado(true); } }, 'Confirmar')`",
        ],
        solucion: armar('estado', [
          'function Domicilio() {',
          "  const [direccion, setDireccion] = useState('');",
          '  const [confirmado, setConfirmado] = useState(false);',
          '',
          '  let mensaje;',
          '  if (confirmado) {',
          "    mensaje = '¡Pedido confirmado!';",
          "  } else if (direccion === '') {",
          "    mensaje = 'Escribe tu dirección';",
          '  } else {',
          "    mensaje = 'Enviar a: ' + direccion;",
          '  }',
          '',
          '  const confirmar = () => {',
          "    if (direccion !== '') setConfirmado(true);",
          '  };',
          '',
          '  return h(',
          "    'div',",
          '    null,',
          "    h('input', { name: 'direccion', value: direccion, onChange: (evento) => setDireccion(evento.target.value) }),",
          "    h('p', null, mensaje),",
          "    h('button', { onClick: confirmar }, 'Confirmar')",
          '  );',
          '}',
          '',
          'const app = montar(Domicilio);',
          "escribir(app, 'direccion', 'Calle 10 # 5-20');",
          "clic(app, 'Confirmar');",
          'console.log(app.html());',
        ]),
      },
    ],
  });
})();

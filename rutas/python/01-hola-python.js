// Ruta de Python, lección 1. Mismo formato que las lecciones de JavaScript;
// la diferencia es que las "condicion" de las pruebas se escriben en Python.

globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'hola-python',
    titulo: 'Hola, Python',
    pasos: [
      {
        id: 'idea',
        titulo: 'Tu primera instrucción en Python',
        texto: [
          'Mira el código del editor. La línea `print("¡Hola, mundo!")` le pide a Python que muestre el mensaje `¡Hola, mundo!`. Presiona **Ejecutar** y míralo aparecer abajo. La primera vez tarda unos segundos mientras se carga Python.',
          'Un **programa** es una lista de instrucciones. Python las lee de arriba hacia abajo, una por una.',
          '`print()` es una **instrucción** que muestra un mensaje en la **consola**. La consola es el recuadro donde aparecen los resultados.',
          'El mensaje va entre comillas. Así Python sabe que es un **texto** y no una orden.',
          'Las líneas que empiezan con `#` son **comentarios**: notas para las personas. Python las ignora.',
          'Python es uno de los lenguajes más usados del mundo. Con él se analizan datos, se automatizan tareas y se construye casi toda la inteligencia artificial.',
          '**Error común:** olvidar las comillas. Si escribes `print(Hola)`, Python cree que `Hola` es un nombre que tú creaste y responde `NameError: name \'Hola\' is not defined` (el nombre no existe). La solución es `print("Hola")`. Lo mismo pasa si escribes `Print` con mayúscula: Python distingue mayúsculas de minúsculas.',
        ],
        codigo: [
          '# Esto es un comentario: Python lo ignora.',
          'print("¡Hola, mundo!")',
          'print("Estoy aprendiendo Python")',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Saluda a Colombia',
        texto: [
          'Ahora tú. Escribe una instrucción que muestre exactamente este mensaje: `Hola, Colombia`',
          'Ojo: el computador es muy estricto con las mayúsculas, la coma y los espacios.',
        ],
        codigo: '# Escribe tu código debajo de esta línea\n',
        pruebas: [
          { descripcion: 'Muestra el mensaje Hola, Colombia', condicion: '"Hola, Colombia" in salida' },
        ],
        pistas: [
          'Usa `print( )` y pon el mensaje dentro de los paréntesis.',
          'El mensaje va entre comillas: `"Hola, Colombia"`',
          'La línea completa es: `print("Hola, Colombia")`',
        ],
        solucion: 'print("Hola, Colombia")',
      },
      {
        id: 'reto',
        titulo: 'Reto: preséntate',
        texto: [
          'Muestra **tres mensajes**, uno por línea: tu ciudad, tu comida favorita y tu equipo o pasatiempo favorito.',
          'Necesitas una instrucción `print()` por cada mensaje.',
        ],
        codigo: [
          '# TODO: muestra tu ciudad',
          '',
          '# TODO: muestra tu comida favorita',
          '',
          '# TODO: muestra tu equipo o pasatiempo favorito',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Muestra al menos tres mensajes', condicion: 'len(salida) >= 3' },
          {
            descripcion: 'Ningún mensaje está vacío',
            condicion: 'len(salida) > 0 and all(linea.strip() != "" for linea in salida)',
          },
        ],
        pistas: [
          'Son tres mensajes, así que necesitas tres instrucciones, una debajo de cada `# TODO`.',
          'Cada mensaje usa `print("...")` con el texto entre comillas.',
          'Ejemplo de la primera línea: `print("Vivo en Manizales")` Ahora escribe las otras dos igual, con tu comida y tu pasatiempo.',
        ],
        solucion: [
          'print("Vivo en Manizales")',
          'print("Mi comida favorita es el ajiaco")',
          'print("Me gusta jugar microfútbol")',
        ].join('\n'),
      },
    ],
  }
);

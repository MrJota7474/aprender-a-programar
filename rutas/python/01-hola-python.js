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
          'Python es uno de los lenguajes más usados del mundo: con él se analizan datos, se automatizan tareas y se construye casi toda la inteligencia artificial.',
          'La instrucción `print()` muestra un mensaje en la **consola**. El texto siempre va entre comillas.',
          'Las líneas que empiezan con `#` son **comentarios**: notas para las personas, Python las ignora.',
          'Presiona **Ejecutar**. La primera vez tarda unos segundos mientras se carga Python.',
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
        codigo: '# Tres mensajes, tres líneas\n',
        pruebas: [
          { descripcion: 'Muestra al menos tres mensajes', condicion: 'len(salida) >= 3' },
          {
            descripcion: 'Ningún mensaje está vacío',
            condicion: 'len(salida) > 0 and all(linea.strip() != "" for linea in salida)',
          },
        ],
        pistas: [
          'Cada mensaje necesita su propia línea con `print("...")`',
          'Ejemplo de una línea: `print("Vivo en Manizales")` Ahora escribe dos más.',
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

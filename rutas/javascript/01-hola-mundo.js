// Lección 1. Cada lección se registra en su ruta con Rutas.agregarLeccion.
// El código va como lista de líneas unidas con "\n": así se pueden usar
// comillas dobles y `${}` adentro sin tener que escaparlos.

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'hola-mundo',
    titulo: 'Hola, mundo',
    pasos: [
      {
        id: 'idea',
        titulo: 'Tu primera instrucción',
        texto: [
          'Programar es darle instrucciones al computador, una por línea.',
          'La instrucción `console.log()` muestra un mensaje en la **consola**. El texto siempre va entre comillas.',
          'Las líneas que empiezan con `//` son **comentarios**: notas para las personas, el computador las ignora.',
          'Presiona **Ejecutar** para ver qué hace este código. Luego cambia los mensajes y ejecútalo otra vez.',
        ],
        codigo: [
          '// Esto es un comentario: el computador lo ignora.',
          'console.log("¡Hola, mundo!");',
          'console.log("Estoy aprendiendo JavaScript");',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Saluda a Colombia',
        texto: [
          'Ahora tú. Escribe una instrucción que muestre exactamente este mensaje: `Hola, Colombia`',
          'Ojo: el computador es muy estricto con las mayúsculas, la coma y los espacios.',
        ],
        codigo: '// Escribe tu código debajo de esta línea\n',
        pruebas: [
          {
            descripcion: 'Muestra el mensaje Hola, Colombia',
            condicion: 'salida.includes("Hola, Colombia")',
          },
        ],
        pistas: [
          'Usa `console.log( )` y pon el mensaje dentro de los paréntesis.',
          'El mensaje va entre comillas: `"Hola, Colombia"`',
          'La línea completa es: `console.log("Hola, Colombia");`',
        ],
        solucion: 'console.log("Hola, Colombia");',
      },
      {
        id: 'reto',
        titulo: 'Reto: preséntate',
        texto: [
          'Muestra **tres mensajes**, uno por línea: tu ciudad, tu comida favorita y tu equipo o pasatiempo favorito.',
          'Necesitas una instrucción `console.log()` por cada mensaje.',
        ],
        codigo: '// Tres mensajes, tres líneas\n',
        pruebas: [
          { descripcion: 'Muestra al menos tres mensajes', condicion: 'salida.length >= 3' },
          {
            descripcion: 'Ningún mensaje está vacío',
            condicion: 'salida.length > 0 && salida.every((linea) => linea.trim() !== "")',
          },
        ],
        pistas: [
          'Cada mensaje necesita su propia línea con `console.log("...");`',
          'Ejemplo de una línea: `console.log("Vivo en Pereira");` Ahora escribe dos más.',
        ],
        solucion: [
          'console.log("Vivo en Pereira");',
          'console.log("Mi comida favorita es la bandeja paisa");',
          'console.log("Me gusta montar bicicleta");',
        ].join('\n'),
      },
    ],
  }
);

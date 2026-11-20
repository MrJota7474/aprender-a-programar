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
          'Mira el código de la derecha. Tiene dos instrucciones y cada una muestra un mensaje.',
          '**Programar** es darle instrucciones al computador, una por línea. El computador las hace en orden, de arriba hacia abajo.',
          'La **consola** es el recuadro donde aparecen los mensajes que muestra tu programa.',
          'La instrucción `console.log()` muestra en la consola lo que pongas dentro de los paréntesis. Un texto siempre va entre comillas: `"así"`.',
          '**Ejemplo explicado línea por línea:**',
          'Línea 1: empieza con `//`, así que es un **comentario**: una nota para las personas. El computador la ignora.',
          'Línea 2: `console.log("¡Hola, mundo!");` muestra ¡Hola, mundo! en la consola. El `;` del final marca dónde termina la instrucción.',
          'Línea 3: hace lo mismo con otro mensaje. Por eso ves dos líneas en la consola.',
          '**Error común:** olvidar las comillas. Si escribes `console.log(Hola);`, JavaScript cree que `Hola` es el nombre de algo guardado y responde `Hola is not defined` ("Hola no está definido"). Solución: `console.log("Hola");`',
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
        codigo: [
          '// TODO: escribe aquí una línea con console.log()',
          '// que muestre el mensaje Hola, Colombia (entre comillas).',
          '',
        ].join('\n'),
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
        codigo: [
          '// TODO 1: muestra tu ciudad.',
          '',
          '// TODO 2: muestra tu comida favorita.',
          '',
          '// TODO 3: muestra tu equipo o pasatiempo favorito.',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Muestra al menos tres mensajes', condicion: 'salida.length >= 3' },
          {
            descripcion: 'Ningún mensaje está vacío',
            condicion: 'salida.length > 0 && salida.every((linea) => linea.trim() !== "")',
          },
        ],
        pistas: [
          'Son tres mensajes distintos, así que necesitas tres instrucciones, una debajo de otra.',
          'Cada mensaje necesita su propia línea con `console.log("...");`',
          'Ejemplo de una línea: `console.log("Vivo en Pereira");` Ahora escribe dos más con tus otros datos.',
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

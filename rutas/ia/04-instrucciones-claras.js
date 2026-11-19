globalThis.Rutas.agregarLeccion(
  'ia',
  {
    id: 'instrucciones-claras',
    titulo: 'Instrucciones claras',
    pasos: [
      {
        id: 'idea',
        titulo: 'Lo que pides es lo que recibes',
        texto: [
          'A escribir instrucciones para un modelo se le llama **prompting**. La regla más útil es simple: di exactamente **qué** quieres y **en qué formato**.',
          'Mira la diferencia. A la primera pregunta, vaga, el modelo responde con un párrafo amable. Para una persona está bien; para un programa es inservible, porque no puede hacer nada con ese texto.',
          'La segunda dice la tarea, las opciones permitidas y el formato ("solo con una palabra"). La respuesta ahora es un dato que tu programa puede usar en un `if`.',
          'Ojo: un modelo real casi siempre obedece una instrucción así, pero no siempre. Por eso un programa serio revisa que la respuesta sea una de las opciones antes de usarla.',
          'Otra buena costumbre: marcar con una etiqueta dónde empieza el texto a analizar, como `Reseña:`. Así el modelo no confunde tus instrucciones con los datos.',
        ],
        codigo: [
          'import ia',
          '',
          'resena = "La arepa estaba deliciosa y el domicilio llegó rápido."',
          '',
          'vaga = [',
          '    {"rol": "usuario", "contenido": "¿Qué opinas del sentimiento de esto? Reseña: " + resena},',
          ']',
          'print(ia.preguntar(vaga)["contenido"])',
          '',
          'clara = [',
          '    {"rol": "sistema", "contenido": "Clasificas el sentimiento de reseñas. Responde solo con una palabra: positivo, negativo o neutro."},',
          '    {"rol": "usuario", "contenido": "Reseña: " + resena},',
          ']',
          'print(ia.preguntar(clara)["contenido"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un clasificador de reseñas',
        texto: [
          'La función `clasificar` ya le envía la reseña al modelo, pero devuelve un párrafo.',
          'Agrégale un mensaje de `sistema` con una instrucción clara, para que devuelva **exactamente** una de estas palabras: `positivo`, `negativo` o `neutro`.',
        ],
        codigo: [
          'import ia',
          '',
          '',
          'def clasificar(resena):',
          '    mensajes = [',
          '        {"rol": "usuario", "contenido": "Reseña: " + resena},',
          '    ]',
          '    return ia.preguntar(mensajes)["contenido"]',
          '',
          '',
          'print(clasificar("La comida llegó fría y tarde."))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Una reseña buena da exactamente "positivo"',
            condicion: 'clasificar("El tinto estaba delicioso y la atención fue amable.") == "positivo"',
          },
          { descripcion: 'Una reseña mala da exactamente "negativo"', condicion: 'clasificar("La comida llegó fría y tarde.") == "negativo"' },
          { descripcion: 'Una reseña sin opinión da exactamente "neutro"', condicion: 'clasificar("Pedí dos empanadas.") == "neutro"' },
          { descripcion: 'La respuesta sale del modelo', condicion: '"ia.preguntar" in codigo' },
        ],
        pistas: [
          'El mensaje de sistema va de primero en la lista, antes del mensaje del usuario.',
          'La instrucción debe decir el formato: que responda **solo con una palabra** y cuáles son las tres opciones.',
          '`{"rol": "sistema", "contenido": "Clasifica el sentimiento. Responde solo con una palabra: positivo, negativo o neutro."},`',
        ],
        solucion: [
          'import ia',
          '',
          '',
          'def clasificar(resena):',
          '    mensajes = [',
          '        {"rol": "sistema", "contenido": "Clasifica el sentimiento. Responde solo con una palabra: positivo, negativo o neutro."},',
          '        {"rol": "usuario", "contenido": "Reseña: " + resena},',
          '    ]',
          '    return ia.preguntar(mensajes)["contenido"]',
          '',
          '',
          'print(clasificar("La comida llegó fría y tarde."))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: instrucciones con datos',
        texto: [
          'Las instrucciones también se arman con variables. Así una misma función sirve para muchos casos.',
          'Crea la función `resumir(texto, palabras)`: le pide al modelo un resumen del texto con un **máximo** de palabras, y devuelve ese resumen.',
          'La instrucción de sistema debe decir `Resume el texto en máximo N palabras.`, donde N es el número que recibe la función. Ármala con un f-string.',
        ],
        codigo: [
          'import ia',
          '',
          'texto = "La tienda de Don Pepe abrió en 1998 en el barrio La Candelaria. Hoy vende comida típica a domicilio en toda la ciudad."',
          '',
          '# Crea aquí la función resumir',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'resumir(texto, 5) devuelve un resumen de 5 palabras o menos',
            condicion:
              '0 < len(resumir("La tienda de Don Pepe abrió en 1998 en el barrio La Candelaria. Hoy vende comida típica.", 5).split()) <= 5',
          },
          {
            descripcion: 'Con un máximo de 12, el resumen es más largo (el número sí se usa)',
            condicion:
              '5 < len(resumir("La tienda de Don Pepe abrió en 1998 en el barrio La Candelaria. Hoy vende comida típica.", 12).split()) <= 12',
          },
          {
            descripcion: 'El resumen sale del texto, no de la instrucción',
            condicion:
              'resumir("La tienda de Don Pepe abrió en 1998 en el barrio La Candelaria. Hoy vende comida típica.", 5).startswith("La tienda")',
          },
          { descripcion: 'La respuesta sale del modelo', condicion: '"ia.preguntar" in codigo' },
        ],
        pistas: [
          'La instrucción con el número adentro: `f"Resume el texto en máximo {palabras} palabras."`',
          'Esa instrucción va en el mensaje de `sistema`, y el texto en el mensaje de `usuario`.',
          'Devuelve el contenido: `return ia.preguntar(mensajes)["contenido"]`',
        ],
        solucion: [
          'import ia',
          '',
          'texto = "La tienda de Don Pepe abrió en 1998 en el barrio La Candelaria. Hoy vende comida típica a domicilio en toda la ciudad."',
          '',
          '',
          'def resumir(texto, palabras):',
          '    mensajes = [',
          '        {"rol": "sistema", "contenido": f"Resume el texto en máximo {palabras} palabras."},',
          '        {"rol": "usuario", "contenido": texto},',
          '    ]',
          '    return ia.preguntar(mensajes)["contenido"]',
        ].join('\n'),
      },
    ],
  }
);

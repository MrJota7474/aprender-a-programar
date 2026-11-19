globalThis.Rutas.agregarLeccion(
  'ia',
  {
    id: 'memoria',
    titulo: 'La memoria de la conversación',
    pasos: [
      {
        id: 'idea',
        titulo: 'El modelo no recuerda nada',
        texto: [
          'Algo que sorprende: un modelo **no tiene memoria** entre una llamada y la siguiente. Cada vez que le preguntas, empieza de cero.',
          'Entonces, ¿cómo "recuerda" un asistente lo que le dijiste hace un rato? Porque el programa le **vuelve a enviar toda la conversación** en cada llamada: tus mensajes anteriores y también sus propias respuestas, con el rol `asistente`.',
          'Mira las tres llamadas. En la segunda no se envía lo anterior y el modelo no sabe el nombre. En la tercera va la conversación completa y sí puede responder.',
          'Por eso las conversaciones largas cuestan más: en cada mensaje se pagan otra vez los tokens de todo lo anterior.',
        ],
        codigo: [
          'import ia',
          '',
          'primera = [{"rol": "usuario", "contenido": "Hola, me llamo Camila."}]',
          'print(ia.preguntar(primera)["contenido"])',
          '',
          '# Otra llamada, sin enviar lo anterior: el modelo no recuerda nada.',
          'segunda = [{"rol": "usuario", "contenido": "¿Cómo me llamo?"}]',
          'print(ia.preguntar(segunda)["contenido"])',
          '',
          '# Enviando toda la conversación, sí puede responder.',
          'completa = [',
          '    {"rol": "usuario", "contenido": "Hola, me llamo Camila."},',
          '    {"rol": "asistente", "contenido": "¡Mucho gusto, Camila!"},',
          '    {"rol": "usuario", "contenido": "¿Cómo me llamo?"},',
          ']',
          'print(ia.preguntar(completa)["contenido"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Llevar el historial',
        texto: [
          'Crea la función `conversar(historial, texto)`, que es el corazón de cualquier chat:',
          '1. Agrega a `historial` el mensaje del usuario. 2. Le envía el historial completo al modelo. 3. Agrega a `historial` la respuesta, con el rol `asistente`. 4. Devuelve el texto de la respuesta.',
          'Aquí sí se modifica la lista con `.append()`: el historial es justamente lo que debe ir creciendo.',
        ],
        codigo: [
          'import ia',
          '',
          '',
          'def conversar(historial, texto):',
          '    # Completa los 4 pasos',
          '    return ""',
          '',
          '',
          'historial = []',
          'print(conversar(historial, "Hola, me llamo Mateo."))',
          'print(conversar(historial, "¿Cómo me llamo?"))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'En el segundo mensaje el modelo recuerda el nombre',
            condicion:
              '(lambda h: (conversar(h, "Hola, me llamo Mateo."), conversar(h, "¿Cómo me llamo?"))[1])([]) == "Te llamas Mateo."',
          },
          {
            descripcion: 'Después de un mensaje, el historial tiene dos: usuario y asistente',
            condicion: '(lambda h: (conversar(h, "Hola"), [m["rol"] for m in h])[1])([]) == ["usuario", "asistente"]',
          },
          {
            descripcion: 'La respuesta guardada es la misma que se devuelve',
            condicion: '(lambda h: conversar(h, "Hola") == h[-1]["contenido"])([])',
          },
        ],
        pistas: [
          'Primero: `historial.append({"rol": "usuario", "contenido": texto})`',
          'Después: `respuesta = ia.preguntar(historial)["contenido"]`',
          'Guarda y devuelve: `historial.append({"rol": "asistente", "contenido": respuesta})` y `return respuesta`',
        ],
        solucion: [
          'import ia',
          '',
          '',
          'def conversar(historial, texto):',
          '    historial.append({"rol": "usuario", "contenido": texto})',
          '    respuesta = ia.preguntar(historial)["contenido"]',
          '    historial.append({"rol": "asistente", "contenido": respuesta})',
          '    return respuesta',
          '',
          '',
          'historial = []',
          'print(conversar(historial, "Hola, me llamo Mateo."))',
          'print(conversar(historial, "¿Cómo me llamo?"))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: recortar una conversación larga',
        texto: [
          'Si el historial crece sin control, se pasa del límite de tokens y cada mensaje sale más caro. Una solución sencilla es enviar solo lo más reciente.',
          'Crea la función `recortar(historial, maximo)`: devuelve una lista **nueva** con todos los mensajes de `sistema` (las instrucciones nunca se deben perder) seguidos de los últimos `maximo` mensajes que no son de sistema.',
          'La lista original no debe cambiar. Para tomar los últimos elementos de una lista se usa `lista[-maximo:]` (funciona cuando `maximo` es 1 o más, que es como se usará aquí).',
        ],
        codigo: ['# Crea aquí la función recortar', ''].join('\n'),
        pruebas: [
          {
            descripcion: 'Conserva el mensaje de sistema y los últimos 2',
            condicion:
              '(lambda h: recortar(h, 2) == [h[0], h[4], h[5]])([{"rol": "sistema", "contenido": "s"}] + [{"rol": r, "contenido": str(i)} for i, r in enumerate(["usuario", "asistente", "usuario", "asistente", "usuario"])])',
          },
          {
            descripcion: 'Si el máximo es mayor que la conversación, la devuelve completa',
            condicion:
              '(lambda h: recortar(h, 10) == h)([{"rol": "sistema", "contenido": "s"}, {"rol": "usuario", "contenido": "a"}, {"rol": "asistente", "contenido": "b"}])',
          },
          {
            descripcion: 'Funciona sin mensaje de sistema',
            condicion:
              '(lambda h: recortar(h, 1) == [h[1]])([{"rol": "usuario", "contenido": "a"}, {"rol": "usuario", "contenido": "b"}])',
          },
          {
            descripcion: 'No modifica la lista original',
            condicion:
              '(lambda h: (recortar(h, 1), len(h))[1])([{"rol": "sistema", "contenido": "s"}, {"rol": "usuario", "contenido": "a"}, {"rol": "usuario", "contenido": "b"}]) == 3',
          },
        ],
        pistas: [
          'Separa en dos listas: `de_sistema = [m for m in historial if m["rol"] == "sistema"]` y otra con los demás, cambiando `==` por `!=`.',
          'Los últimos de la segunda lista: `los_demas[-maximo:]`',
          'Sumar listas crea una lista nueva: `return de_sistema + los_demas[-maximo:]`',
        ],
        solucion: [
          'def recortar(historial, maximo):',
          '    de_sistema = [m for m in historial if m["rol"] == "sistema"]',
          '    los_demas = [m for m in historial if m["rol"] != "sistema"]',
          '    return de_sistema + los_demas[-maximo:]',
        ].join('\n'),
      },
    ],
  }
);

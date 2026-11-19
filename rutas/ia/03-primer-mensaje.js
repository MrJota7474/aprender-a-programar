globalThis.Rutas.agregarLeccion(
  'ia',
  {
    id: 'primer-mensaje',
    titulo: 'Tu primer mensaje',
    pasos: [
      {
        id: 'idea',
        titulo: 'Una conversación es una lista',
        texto: [
          'Desde un programa, hablar con un modelo es enviarle una **lista de mensajes**. Cada mensaje es un diccionario con dos claves: `"rol"` (quién habla) y `"contenido"` (qué dice).',
          'Hay tres roles principales. `sistema`: las instrucciones generales que tú le das al modelo (quién es, cómo debe responder). `usuario`: lo que escribe la persona. `asistente`: lo que respondió el modelo.',
          'La respuesta también es un diccionario: trae el texto en `"contenido"` y además cuántos tokens se usaron.',
          'En los servicios reales los roles se escriben en inglés (`system`, `user`, `assistant`), pero la estructura es esta misma.',
          'Recuerda que `ia` es un modelo simulado: siempre responde lo mismo a la misma conversación. Un modelo real puede responder distinto cada vez.',
        ],
        codigo: [
          'import ia',
          '',
          'mensajes = [',
          '    {"rol": "sistema", "contenido": "Te llamas Lulo y atiendes una tienda."},',
          '    {"rol": "usuario", "contenido": "Hola"},',
          ']',
          '',
          'respuesta = ia.preguntar(mensajes)',
          '',
          'print(respuesta)',
          'print(respuesta["contenido"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Preséntale un nombre',
        texto: [
          'Crea la lista `mensajes` con dos mensajes: uno de `sistema` que diga `Te llamas Panela.` y uno de `usuario` que diga `Hola`.',
          'Envíala con `ia.preguntar()` y muestra **solo el contenido** de la respuesta.',
        ],
        codigo: ['import ia', '', '# Crea la lista mensajes, envíala y muestra el contenido de la respuesta', ''].join('\n'),
        pruebas: [
          {
            descripcion: 'mensajes tiene un mensaje de sistema y después uno de usuario',
            condicion: 'isinstance(mensajes, list) and [m["rol"] for m in mensajes] == ["sistema", "usuario"]',
          },
          { descripcion: 'El mensaje de sistema dice que se llama Panela', condicion: '"Te llamas Panela" in mensajes[0]["contenido"]' },
          { descripcion: 'Muestras el contenido de la respuesta', condicion: 'mostrado("Soy Panela")' },
          { descripcion: 'No muestras el diccionario completo', condicion: 'not mostrado("motivo_fin")' },
        ],
        pistas: [
          'Cada mensaje tiene esta forma: `{"rol": "sistema", "contenido": "Te llamas Panela."}`',
          'Envía la lista y guarda lo que devuelve: `respuesta = ia.preguntar(mensajes)`',
          'El texto está en una clave del diccionario: `print(respuesta["contenido"])`',
        ],
        solucion: [
          'import ia',
          '',
          'mensajes = [',
          '    {"rol": "sistema", "contenido": "Te llamas Panela."},',
          '    {"rol": "usuario", "contenido": "Hola"},',
          ']',
          '',
          'respuesta = ia.preguntar(mensajes)',
          'print(respuesta["contenido"])',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: tu propia función',
        texto: [
          'En un programa real no se repite la lista de mensajes cada vez: se envuelve en una función.',
          'Crea la función `preguntar(texto)`: recibe lo que dice el usuario y devuelve **el texto** de la respuesta del modelo.',
          'La función siempre debe incluir este mensaje de sistema: `Responde siempre en MAYÚSCULAS.`',
        ],
        codigo: ['import ia', '', '# Crea aquí la función preguntar', ''].join('\n'),
        pruebas: [
          { descripcion: 'preguntar("Hola") devuelve un texto', condicion: 'isinstance(preguntar("Hola"), str) and len(preguntar("Hola")) > 0' },
          {
            descripcion: 'La respuesta llega en mayúsculas (el modelo siguió la instrucción de sistema)',
            condicion: 'preguntar("Hola") == preguntar("Hola").upper()',
          },
          { descripcion: 'Usas ia.preguntar', condicion: '"ia.preguntar" in codigo' },
          {
            descripcion: 'Las mayúsculas las pide el mensaje de sistema (no usas .upper())',
            condicion: '"sistema" in codigo and ".upper(" not in codigo',
          },
        ],
        pistas: [
          'Dentro de la función arma la lista con los dos mensajes. El del usuario usa el parámetro: `{"rol": "usuario", "contenido": texto}`',
          'Llama al modelo: `respuesta = ia.preguntar(mensajes)`',
          'Devuelve solo el texto: `return respuesta["contenido"]`',
        ],
        solucion: [
          'import ia',
          '',
          '',
          'def preguntar(texto):',
          '    mensajes = [',
          '        {"rol": "sistema", "contenido": "Responde siempre en MAYÚSCULAS."},',
          '        {"rol": "usuario", "contenido": texto},',
          '    ]',
          '    respuesta = ia.preguntar(mensajes)',
          '    return respuesta["contenido"]',
        ].join('\n'),
      },
    ],
  }
);

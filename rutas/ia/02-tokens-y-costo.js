globalThis.Rutas.agregarLeccion(
  'ia',
  {
    id: 'tokens-y-costo',
    titulo: 'Tokens y costo',
    pasos: [
      {
        id: 'idea',
        titulo: 'La unidad con la que se mide todo',
        texto: [
          'Los modelos no leen letras ni palabras: leen **tokens**, que son pedazos de palabra. Como regla práctica, un token son unos 4 caracteres (en español suelen salir un poco más tokens que en inglés).',
          'Los tokens importan por dos razones. Primera: los servicios de inteligencia artificial **cobran por token**, tanto por lo que envías (entrada) como por lo que responden (salida). Segunda: cada modelo tiene un **límite** de tokens que puede leer de una vez, llamado ventana de contexto.',
          'Desde aquí vas a usar el módulo `ia`. Es un **modelo simulado**, hecho para esta ruta: responde con reglas fijas, sin internet y gratis. Lo que practiques con él se escribe casi igual con un modelo de verdad.',
        ],
        codigo: [
          'import ia',
          '',
          'print(ia.contar_tokens("Hola"))',
          'print(ia.contar_tokens("Hola, ¿cómo estás hoy?"))',
          'print(ia.contar_tokens("Explícame qué es una base de datos con el ejemplo de una tienda."))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Cuánto cuesta una llamada?',
        texto: [
          'Los precios se publican en dólares **por millón de tokens**, y la salida suele costar más que la entrada.',
          'Completa la función `costo` para que devuelva cuántos dólares cuesta una llamada, usando los dos precios de arriba.',
        ],
        codigo: [
          'PRECIO_ENTRADA = 3  # dólares por cada millón de tokens de entrada',
          'PRECIO_SALIDA = 15  # dólares por cada millón de tokens de salida',
          '',
          '',
          'def costo(tokens_entrada, tokens_salida):',
          '    # Cambia el 0 por el cálculo correcto',
          '    return 0',
          '',
          '',
          'print(costo(2000, 500))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Un millón de tokens de entrada cuesta 3 dólares', condicion: 'costo(1000000, 0) == 3' },
          { descripcion: 'Un millón de tokens de salida cuesta 15 dólares', condicion: 'costo(0, 1000000) == 15' },
          {
            descripcion: '2000 de entrada y 500 de salida cuestan 0.0135 dólares',
            condicion: 'abs(costo(2000, 500) - 0.0135) < 0.000001',
          },
        ],
        pistas: [
          'El costo de la entrada es `tokens_entrada * PRECIO_ENTRADA / 1000000`.',
          'El de la salida se calcula igual, con su propio precio.',
          'Suma los dos: `return (tokens_entrada * PRECIO_ENTRADA + tokens_salida * PRECIO_SALIDA) / 1000000`',
        ],
        solucion: [
          'PRECIO_ENTRADA = 3  # dólares por cada millón de tokens de entrada',
          'PRECIO_SALIDA = 15  # dólares por cada millón de tokens de salida',
          '',
          '',
          'def costo(tokens_entrada, tokens_salida):',
          '    return (tokens_entrada * PRECIO_ENTRADA + tokens_salida * PRECIO_SALIDA) / 1000000',
          '',
          '',
          'print(costo(2000, 500))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿cabe en el contexto?',
        texto: [
          'Antes de enviarle documentos a un modelo hay que saber si caben en su límite.',
          'Crea la función `cabe(textos, limite)`: recibe una lista de textos y un límite de tokens. Devuelve `True` si la suma de los tokens de todos los textos es menor o igual al límite, y `False` si se pasa.',
          'Usa `ia.contar_tokens()` para medir cada texto.',
        ],
        codigo: ['import ia', '', '# Crea aquí la función cabe', ''].join('\n'),
        pruebas: [
          { descripcion: 'Un texto corto cabe en un límite de 10', condicion: 'cabe(["Hola"], 10) is True' },
          { descripcion: '50 textos no caben en un límite de 20', condicion: 'cabe(["Hola"] * 50, 20) is False' },
          { descripcion: 'Si la suma es igual al límite, sí cabe', condicion: 'cabe(["Hola", "Hola"], 2) is True' },
          { descripcion: 'Una lista vacía siempre cabe', condicion: 'cabe([], 0) is True' },
          { descripcion: 'Usas ia.contar_tokens', condicion: '"contar_tokens" in codigo' },
        ],
        pistas: [
          'Empieza con `total = 0` y recorre la lista: `for texto in textos:`',
          'En cada vuelta: `total = total + ia.contar_tokens(texto)`',
          'Una comparación ya da `True` o `False`: `return total <= limite`',
        ],
        solucion: [
          'import ia',
          '',
          '',
          'def cabe(textos, limite):',
          '    total = 0',
          '    for texto in textos:',
          '        total = total + ia.contar_tokens(texto)',
          '    return total <= limite',
        ].join('\n'),
      },
    ],
  }
);

// Varias líneas de código de esta lección llevan comillas simples y dobles a
// la vez (así se escribe JSON dentro de Python); por eso van entre comillas
// invertidas en vez de comillas simples.

globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'modulos-json',
    titulo: 'Módulos y JSON',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cajas de herramientas',
        texto: [
          '¿Cómo sacas la raíz cuadrada de 81? No tienes que programarla: Python ya la trae en el módulo `math`. Escribes `import math` y luego `math.sqrt(81)`, que da `9.0`.',
          'Un **módulo** es una caja de herramientas que alguien ya programó. Se trae con `import` al comienzo del archivo, y sus herramientas se usan con un punto: `math.sqrt`.',
          '**JSON** es un formato de texto con el que los programas se envían datos entre sí. Se parece mucho a los diccionarios y listas de Python, pero es **solo texto**: no se le puede pedir una clave hasta convertirlo.',
          'El módulo `json` hace esa conversión. `json.loads()` convierte un texto JSON en un diccionario, y `json.dumps()` hace el camino contrario.',
          '**Ejemplo explicado línea por línea:** `texto` es un texto que parece diccionario (fíjate en las comillas simples por fuera). `datos = json.loads(texto)` lo convierte en un diccionario de verdad. Ahora sí `datos["ciudad"]` da `Cali`, y `datos["temperatura"] + 1` da `30` porque la temperatura ya es un número.',
          'Es justo lo que vas a necesitar más adelante: los servicios de inteligencia artificial reciben y responden en JSON.',
          '**Error común:** usar el módulo sin importarlo. Si olvidas `import json`, la línea `json.loads(texto)` falla con `NameError: name \'json\' is not defined`. Otro error frecuente es pedir una clave al texto sin convertirlo: `texto["ciudad"]` da `TypeError`, porque un texto no tiene claves.',
        ],
        codigo: [
          'import json',
          'import math',
          '',
          'print(math.sqrt(81))  # raíz cuadrada',
          '',
          `texto = '{"ciudad": "Cali", "temperatura": 29}'`,
          'datos = json.loads(texto)  # de texto a diccionario',
          'print(datos["ciudad"])',
          'print(datos["temperatura"] + 1)',
          '',
          'de_vuelta = json.dumps({"listo": True})  # de diccionario a texto',
          'print(de_vuelta)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Leer un JSON',
        texto: [
          'La variable `texto` tiene los datos de un producto en formato JSON. Por ahora es solo un texto: no se le puede pedir el precio.',
          'Conviértelo en un diccionario llamado `datos` con `json.loads()` y después muestra el precio.',
        ],
        codigo: [
          'import json',
          '',
          `texto = '{"producto": "Café", "precio": 18000, "disponible": true}'`,
          '',
          '# TODO: convierte texto en un diccionario llamado datos con json.loads()',
          '',
          '# TODO: muestra el precio leyendo la clave "precio" de datos',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'datos es un diccionario', condicion: 'isinstance(datos, dict)' },
          { descripcion: 'El precio dentro de datos es 18000', condicion: 'datos["precio"] == 18000' },
          { descripcion: 'La consola muestra el precio', condicion: 'mostrado(18000)' },
          {
            descripcion: 'datos sale de convertir texto con json.loads (no lo escribes a mano)',
            condicion: 're.search(r"datos\\s*=\\s*json\\.loads\\s*\\(\\s*texto\\s*\\)", codigo) is not None and codigo.count("18000") == 1',
          },
        ],
        pistas: [
          'Ahora `texto` es solo texto. Primero hay que convertirlo; después ya se le pueden pedir claves.',
          'La herramienta es `json.loads()`, igual que en el ejemplo. Guarda el resultado en `datos`.',
          'Casi listo: `datos = json.loads(texto)` y luego `print(datos[...])` con la clave del precio.',
        ],
        solucion: [
          'import json',
          '',
          `texto = '{"producto": "Café", "precio": 18000, "disponible": true}'`,
          '',
          'datos = json.loads(texto)',
          'print(datos["precio"])',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: la respuesta de un servicio',
        texto: [
          'Así se ve la respuesta de muchos servicios en internet: un JSON con una lista adentro.',
          'Crea la función `contar_palabras` que recibe un **texto JSON** como el de `respuesta` y devuelve la suma de las `"palabras"` de todos sus mensajes.',
          'Pasos: convertir el texto con `json.loads()`, recorrer la lista que está en la clave `"mensajes"` y sumar. Si no hay mensajes, devuelve 0.',
        ],
        codigo: [
          'import json',
          '',
          `respuesta = '{"usuario": "Valentina", "mensajes": [{"texto": "Hola", "palabras": 1}, {"texto": "Quiero aprender Python", "palabras": 3}]}'`,
          '',
          '# TODO: crea la función contar_palabras que recibe un texto JSON',
          '#   1. conviértelo en diccionario con json.loads()',
          '#   2. recorre la lista que está en la clave "mensajes"',
          '#   3. suma las "palabras" de cada mensaje y devuelve el total',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Creaste la función contar_palabras', condicion: 'callable(contar_palabras)' },
          { descripcion: 'La respuesta del ejemplo tiene 4 palabras (1 + 3)', condicion: 'contar_palabras(respuesta) == 4' },
          {
            descripcion: 'Una respuesta sin mensajes tiene 0 palabras',
            condicion: `contar_palabras('{"usuario": "X", "mensajes": []}') == 0`,
          },
          {
            descripcion: 'Funciona con otra respuesta distinta (2 + 5 = 7)',
            condicion: `contar_palabras('{"mensajes": [{"texto": "a b", "palabras": 2}, {"texto": "c", "palabras": 5}]}') == 7`,
          },
        ],
        pistas: [
          'Junta dos cosas que ya hiciste: leer un JSON (la práctica) y sumar un carrito (lección de diccionarios).',
          'Empieza con `def contar_palabras(texto_json):` y `datos = json.loads(texto_json)`. La lista está en `datos["mensajes"]`.',
          'Con `total = 0`, recorre `for mensaje in datos["mensajes"]:` y suma `mensaje["palabras"]`. Al final, `return total`.',
        ],
        solucion: [
          'import json',
          '',
          `respuesta = '{"usuario": "Valentina", "mensajes": [{"texto": "Hola", "palabras": 1}, {"texto": "Quiero aprender Python", "palabras": 3}]}'`,
          '',
          '',
          'def contar_palabras(texto_json):',
          '    datos = json.loads(texto_json)',
          '    total = 0',
          '    for mensaje in datos["mensajes"]:',
          '        total = total + mensaje["palabras"]',
          '    return total',
        ].join('\n'),
      },
    ],
  }
);

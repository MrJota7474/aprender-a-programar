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
          'Un **módulo** es una caja de herramientas que alguien ya programó. Se trae con `import` y sus herramientas se usan con un punto: `math.sqrt(81)`.',
          '**JSON** es el formato de texto con el que los programas se envían datos entre sí. Se parece mucho a los diccionarios y listas de Python.',
          'Es justo lo que vas a necesitar más adelante: los servicios de inteligencia artificial reciben y responden en JSON.',
          '`json.loads()` convierte un texto JSON en un diccionario, y `json.dumps()` hace el camino contrario.',
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
          '# Convierte el texto en un diccionario llamado datos y muestra el precio',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'datos es un diccionario', condicion: 'isinstance(datos, dict)' },
          { descripcion: 'datos["precio"] vale 18000', condicion: 'datos["precio"] == 18000' },
          { descripcion: 'Muestras el precio en la consola', condicion: 'mostrado(18000)' },
          { descripcion: 'Usas json.loads', condicion: '"json.loads" in codigo' },
        ],
        pistas: [
          'La conversión es: `datos = json.loads(texto)`',
          'Ahora `datos` es un diccionario y puedes pedirle una clave: `datos["precio"]`',
          'Para mostrarlo: `print(datos["precio"])`',
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
          '# Crea aquí la función contar_palabras',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'contar_palabras es una función', condicion: 'callable(contar_palabras)' },
          { descripcion: 'contar_palabras(respuesta) devuelve 4', condicion: 'contar_palabras(respuesta) == 4' },
          {
            descripcion: 'Sin mensajes devuelve 0',
            condicion: `contar_palabras('{"usuario": "X", "mensajes": []}') == 0`,
          },
          {
            descripcion: 'Funciona con cualquier otra respuesta',
            condicion: `contar_palabras('{"mensajes": [{"texto": "a b", "palabras": 2}, {"texto": "c", "palabras": 5}]}') == 7`,
          },
        ],
        pistas: [
          'Dentro de la función, lo primero es convertir: `datos = json.loads(texto_json)`',
          'La lista está en `datos["mensajes"]`. Recórrela con `for mensaje in datos["mensajes"]:`',
          'En cada vuelta: `total = total + mensaje["palabras"]`. Al final, `return total`',
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

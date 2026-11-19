// Ruta "Programar con IA", lección 1. El lenguaje es Python y las
// "condicion" de las pruebas también. Toda la ruta usa el módulo "agente":
// un agente de código simulado (ver 00-modulo-agente.js).
//
// Formato de cada lección (para copiarlo en las siguientes):
// - idea: un ejemplo que se ejecuta sin pruebas y muestra algo.
// - practica y reto: código inicial que NO pasa, pruebas, pistas y solución.
// - Las pruebas piden resultados, no una forma exacta de escribir el código,
//   salvo cuando lo que se enseña es justamente esa forma (como usar el modelo
//   en vez de escribir la respuesta a mano).

globalThis.Rutas.agregarLeccion(
  'con-ia',
  {
    id: 'que-es-un-agente',
    titulo: 'Qué es un agente',
    pasos: [
      {
        id: 'idea',
        titulo: 'Pensar, usar una herramienta, observar',
        texto: [
          'Un modelo de lenguaje, como Claude, solo produce texto: predice qué texto sigue. No "entiende" el código como una persona, no abre archivos ni corre programas. Entonces, ¿cómo arregla un error en un proyecto?',
          'Con un **agente**: un programa normal que rodea al modelo. El agente le da al modelo una tarea y una lista de **herramientas** (leer un archivo, escribirlo, buscar, correr las pruebas). El modelo responde pidiendo una; el agente la ejecuta y le devuelve lo que pasó. Eso se repite hasta que el modelo dice que terminó.',
          'El ciclo tiene tres partes: **pensar** (el modelo escribe qué va a hacer y por qué), **usar una herramienta** (el pedido) y **observar** (el resultado que le devuelve el agente). Así trabaja Claude Code, el agente con el que se construyó esta misma app: sus herramientas se llaman Read, Edit, Grep y Bash, pero la idea es igual.',
          'Corre el ejemplo. El módulo `agente` trae un agente simulado y un proyecto pequeño de la tienda de Don Pepe con un error. Lee el registro paso a paso: fíjate en que antes de cambiar algo, mira; y después de cambiarlo, comprueba.',
        ],
        codigo: [
          'import agente',
          '',
          'proyecto = agente.proyecto("tienda")',
          'resultado = agente.ejecutar("Arregla el error de la caja de Don Pepe", proyecto)',
          '',
          'agente.mostrar(resultado["registro"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Qué herramientas usó',
        texto: [
          '`resultado["registro"]` es una lista de pasos. Cada paso es un diccionario con `"numero"`, `"pensamiento"`, `"herramienta"` (el nombre de la que usó), `"argumentos"` y `"resultado"` (lo que vio).',
          'El último paso es distinto: ahí el modelo ya no usó ninguna herramienta, así que su `"herramienta"` vale `None` y su `"resultado"` es la respuesta final.',
          'Crea el cuerpo de `herramientas_usadas(registro)`: debe devolver una lista con los nombres de las herramientas, en orden, sin el `None` del final.',
        ],
        codigo: [
          'import agente',
          '',
          'resultado = agente.ejecutar("Arregla el error de la caja", agente.proyecto("tienda"))',
          'registro = resultado["registro"]',
          '',
          '',
          'def herramientas_usadas(registro):',
          '    nombres = []',
          '    # Recorre los pasos y guarda el nombre de cada herramienta usada',
          '    return nombres',
          '',
          '',
          'print(herramientas_usadas(registro))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Lista las herramientas del arreglo de la caja, en orden',
            condicion: 'herramientas_usadas(registro) == ["correr_pruebas", "buscar", "leer_archivo", "escribir_archivo", "correr_pruebas"]',
          },
          {
            descripcion: 'No incluye el None del último paso',
            condicion: 'None not in herramientas_usadas(registro) and len(herramientas_usadas(registro)) == len(registro) - 1',
          },
          {
            descripcion: 'Si no había nada que arreglar, solo corrió las pruebas',
            condicion: 'herramientas_usadas(agente.ejecutar("Arregla", resultado["proyecto"])["registro"]) == ["correr_pruebas"]',
          },
        ],
        pistas: [
          'Recorre la lista con `for paso in registro:`',
          'El nombre está en `paso["herramienta"]`. Antes de guardarlo, revisa que no sea `None`: `if paso["herramienta"] is not None:`',
          'Dentro del `if`: `nombres.append(paso["herramienta"])`',
        ],
        solucion: [
          'import agente',
          '',
          'resultado = agente.ejecutar("Arregla el error de la caja", agente.proyecto("tienda"))',
          'registro = resultado["registro"]',
          '',
          '',
          'def herramientas_usadas(registro):',
          '    nombres = []',
          '    for paso in registro:',
          '        if paso["herramienta"] is not None:',
          '            nombres.append(paso["herramienta"])',
          '    return nombres',
          '',
          '',
          'print(herramientas_usadas(registro))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿comprobó su trabajo?',
        texto: [
          'Un agente puede decir "listo" y estar equivocado: el modelo predice texto, y "listo, ya quedó" es un texto muy probable. Por eso no se le cree a la palabra: se mira el registro.',
          'Crea la función `comprobo_su_trabajo(registro)`. Debe devolver `True` solo si **la última vez que corrió las pruebas fue después de su último cambio, y pasaron** (el resultado empieza con `Pasaron` y no dice `FALLÓ`).',
          'Recorre los pasos llevando un estado: al ver `escribir_archivo`, el cambio queda "sin probar"; al ver `correr_pruebas`, queda "bien" solo si el resultado empieza con `"Pasaron"` y no contiene `"FALLÓ"`; si no, queda "mal". Al final, devuelve si quedó "bien". Si no cambió nada pero las pruebas pasaron, también cuenta como comprobado.',
        ],
        codigo: [
          'import agente',
          '',
          'resultado = agente.ejecutar("Arregla el error de la caja", agente.proyecto("tienda"))',
          'registro = resultado["registro"]',
          '',
          '',
          '# Crea aquí la función comprobo_su_trabajo',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'El registro completo sí está comprobado',
            condicion: 'comprobo_su_trabajo(registro) is True',
          },
          {
            descripcion: 'Si se corta justo después de escribir, no está comprobado',
            condicion: 'comprobo_su_trabajo(registro[:4]) is False',
          },
          {
            descripcion: 'Si las últimas pruebas fallaron, no está comprobado',
            condicion: 'comprobo_su_trabajo(registro[:1]) is False',
          },
          {
            descripcion: 'Sin cambios y con las pruebas pasando, sí está comprobado',
            condicion: 'comprobo_su_trabajo(agente.ejecutar("Arregla", resultado["proyecto"])["registro"]) is True',
          },
          {
            descripcion: 'Si el agente escribió y las pruebas siguen fallando, no está comprobado',
            condicion:
              'comprobo_su_trabajo(agente.ejecutar("Arregla", agente.escribir_archivo(agente.proyecto("tienda"), "prueba_tienda.py", agente.proyecto("tienda")["prueba_tienda.py"] + "\\n\\ndef prueba_imposible():\\n    assert total({}) == 1\\n"))["registro"]) is False',
          },
        ],
        pistas: [
          'Empieza con `estado = "sin probar"` y recorre con `for paso in registro:`',
          'Si `paso["herramienta"] == "escribir_archivo"`, cambia a `estado = "sin probar"`. Si es `"correr_pruebas"`, mira el texto de `paso["resultado"]`.',
          'Con pruebas: `estado = "bien"` solo si `paso["resultado"].startswith("Pasaron") and "FALLÓ" not in paso["resultado"]`; si no, `estado = "mal"`. Al final, `return estado == "bien"`',
        ],
        solucion: [
          'import agente',
          '',
          'resultado = agente.ejecutar("Arregla el error de la caja", agente.proyecto("tienda"))',
          'registro = resultado["registro"]',
          '',
          '',
          'def comprobo_su_trabajo(registro):',
          '    estado = "sin probar"',
          '    for paso in registro:',
          '        if paso["herramienta"] == "escribir_archivo":',
          '            estado = "sin probar"',
          '        elif paso["herramienta"] == "correr_pruebas":',
          '            if paso["resultado"].startswith("Pasaron") and "FALLÓ" not in paso["resultado"]:',
          '                estado = "bien"',
          '            else:',
          '                estado = "mal"',
          '    return estado == "bien"',
          '',
          '',
          'print(comprobo_su_trabajo(registro))',
        ].join('\n'),
      },
    ],
  }
);

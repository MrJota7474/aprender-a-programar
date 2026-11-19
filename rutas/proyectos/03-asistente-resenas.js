// Ruta "Proyectos", lección 3: el asistente de reseñas. Tres pasos con el motor
// "python-ia" (plan, clasificar y muchas reseñas; Python con el modelo simulado
// "ia", ver rutas/ia/00-modulo-ia.js) y uno con "sql". Las pruebas de cada paso usan las reglas de su motor.

globalThis.Rutas.agregarLeccion(
  'proyectos',
  {
    id: 'asistente-resenas',
    titulo: 'El asistente de reseñas',
    pasos: [
      {
        id: 'plan',
        etiqueta: 'El plan',
        titulo: 'Entender qué opinan los clientes',
        texto: [
          'A Don Pepe le llegan decenas de reseñas de los domicilios y no alcanza a leerlas todas. Quiere saber, de un vistazo, **cuántas son positivas, negativas o neutras**.',
          'Vas a construir un asistente en tres pasos. **1.** Una función que le pide al modelo de lenguaje clasificar **una** reseña. **2.** Un programa que recorre **muchas** reseñas y cuenta cuántas hay de cada sentimiento. **3.** Una base de datos donde se guardan ya clasificadas, para consultarlas cuando quieras.',
          'Fíjate que mezclas dos herramientas: la inteligencia artificial para entender el texto y SQL para guardar y contar los resultados. Ejecuta el ejemplo y sigue con la pestaña **Clasificar una reseña**.',
        ],
        motor: 'python-ia',
        codigo: [
          'print("Proyecto: el asistente de reseñas de Don Pepe")',
          'print("1. Clasificar una reseña con el modelo")',
          'print("2. Contar el sentimiento de muchas reseñas")',
          'print("3. Guardarlas y consultarlas con SQL")',
        ].join('\n'),
      },
      {
        id: 'clasificar',
        etiqueta: 'Clasificar una reseña',
        motor: 'python-ia',
        titulo: 'Una reseña, una palabra',
        texto: [
          'La función `clasificar` ya le envía la reseña al modelo, pero la respuesta es un párrafo conversado, que a un programa no le sirve para contar.',
          'Agrega un mensaje de `sistema` con una instrucción **clara**: que responda solo con una palabra, `positivo`, `negativo` o `neutro`. Recuerda que el mensaje de sistema va antes del mensaje del usuario.',
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
          {
            descripcion: 'Una reseña mala da exactamente "negativo"',
            condicion: 'clasificar("La comida llegó fría y tarde.") == "negativo"',
          },
          {
            descripcion: 'Una reseña sin opinión da exactamente "neutro"',
            condicion: 'clasificar("Pedí dos empanadas.") == "neutro"',
          },
          {
            descripcion: 'Funciona con reseñas nuevas, que no están en el enunciado',
            condicion:
              'clasificar("Todo fue perfecto, el domicilio llegó rapido.") == "positivo" and clasificar("El empaque estaba sucio y el repartidor fue grosero.") == "negativo"',
          },
          { descripcion: 'La respuesta sale del modelo', condicion: '"ia.preguntar" in codigo' },
        ],
        pistas: [
          'Agrega un diccionario con `"rol": "sistema"` al comienzo de la lista `mensajes`.',
          'La instrucción debe decir el formato: **solo una palabra**, y nombrar las tres opciones.',
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
        id: 'muchas-resenas',
        etiqueta: 'Muchas reseñas',
        motor: 'python-ia',
        titulo: 'Contar el sentimiento de una lista',
        texto: [
          'Ahora `clasificar` ya funciona. Crea la función `contar_sentimientos(resenas)`: recibe una **lista** de reseñas y devuelve un **diccionario** con cuántas hay de cada sentimiento, por ejemplo `{"positivo": 2, "negativo": 1}`.',
          'Solo deben aparecer en el diccionario los sentimientos que sí se encontraron, y con una lista vacía devuelve `{}`. Usa `clasificar` para cada reseña.',
        ],
        codigo: [
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
          '# Crea aquí la función contar_sentimientos',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Cuenta cada sentimiento: 2 positivas, 2 negativas y 1 neutra',
            condicion:
              'contar_sentimientos(["El tinto estaba delicioso y la atención fue amable.", "La comida llegó fría y tarde.", "Pedí dos empanadas.", "Excelente servicio, lo recomiendo.", "Horrible, nunca vuelvo."]) == {"positivo": 2, "negativo": 2, "neutro": 1}',
          },
          {
            descripcion: 'Solo aparecen los sentimientos que existen',
            condicion:
              'contar_sentimientos(["Excelente servicio, lo recomiendo.", "Todo estuvo delicioso."]) == {"positivo": 2}',
          },
          { descripcion: 'Con una lista vacía devuelve un diccionario vacío', condicion: 'contar_sentimientos([]) == {}' },
          {
            descripcion: 'Funciona con otra lista de reseñas (clasifica cada una con el modelo)',
            condicion:
              'contar_sentimientos(["Perfecto, muy amable.", "Estaba sucio y caro.", "Pedí una arepa.", "Genial, rapido.", "Pesima atención."]) == {"positivo": 2, "negativo": 2, "neutro": 1}',
          },
        ],
        pistas: [
          'Empieza con un diccionario vacío, `conteo = {}`, y recorre la lista con `for resena in resenas:`.',
          'Dentro del ciclo: `sentimiento = clasificar(resena)` y súmale uno a esa clave. Si la clave todavía no existe, parte de 0.',
          '`conteo[sentimiento] = conteo.get(sentimiento, 0) + 1` y al final `return conteo`.',
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
          'def contar_sentimientos(resenas):',
          '    conteo = {}',
          '    for resena in resenas:',
          '        sentimiento = clasificar(resena)',
          '        conteo[sentimiento] = conteo.get(sentimiento, 0) + 1',
          '    return conteo',
        ].join('\n'),
      },
      {
        id: 'guardar-consultar',
        etiqueta: 'Guardar y consultar',
        motor: 'sql',
        titulo: 'Guardar las reseñas ya clasificadas',
        texto: [
          'Para no volver a pagarle al modelo por las mismas reseñas, guardamos el resultado en una base de datos.',
          '**1.** Crea la tabla `resenas` con las columnas `id` (clave primaria), `texto` (texto, obligatorio) y `sentimiento` (texto, obligatorio).',
          '**2.** Inserta estas 6 reseñas ya clasificadas (texto y sentimiento): "Delicioso el tinto" (positivo), "Excelente atención" (positivo), "Lo recomiendo" (positivo), "Llegó fría y tarde" (negativo), "Horrible servicio" (negativo) y "Pedí dos empanadas" (neutro).',
          '**3.** Termina con una consulta que muestre cada sentimiento y cuántas reseñas tiene, con `GROUP BY`.',
        ],
        codigo: [
          '-- 1. Crea la tabla resenas',
          '',
          '-- 2. Inserta las 6 reseñas',
          '',
          '-- 3. Cuántas reseñas hay por sentimiento',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La tabla resenas tiene las columnas id, texto y sentimiento',
            condicion: 'consulta("PRAGMA table_info(resenas)").map((c) => c.name).join() === "id,texto,sentimiento"',
          },
          {
            descripcion: 'id es la clave primaria y sentimiento es obligatorio (NOT NULL)',
            condicion:
              'consulta("PRAGMA table_info(resenas)").some((c) => c.name === "id" && c.pk === 1) && consulta("PRAGMA table_info(resenas)").some((c) => c.name === "sentimiento" && c.notnull === 1)',
          },
          {
            descripcion: 'Hay 6 reseñas: 3 positivas, 2 negativas y 1 neutra',
            condicion:
              'JSON.stringify(consulta("SELECT sentimiento, COUNT(*) AS n FROM resenas GROUP BY sentimiento ORDER BY sentimiento")) === JSON.stringify([{ sentimiento: "negativo", n: 2 }, { sentimiento: "neutro", n: 1 }, { sentimiento: "positivo", n: 3 }])',
          },
          {
            descripcion: 'La consulta final muestra dos columnas: el sentimiento y la cantidad',
            condicion: 'columnas.length === 2 && filas.length === 3',
          },
          {
            descripcion: 'El resultado cuenta las reseñas de cada sentimiento',
            condicion: 'mismasFilas("SELECT sentimiento, COUNT(*) FROM resenas GROUP BY sentimiento")',
          },
          { descripcion: 'Usas GROUP BY', condicion: 'codigo.includes("GROUP BY")' },
        ],
        pistas: [
          'La tabla: `CREATE TABLE resenas (id INTEGER PRIMARY KEY, texto TEXT NOT NULL, sentimiento TEXT NOT NULL);`',
          'Las filas: `INSERT INTO resenas (texto, sentimiento) VALUES (\'Delicioso el tinto\', \'positivo\'), ...` con las 6 reseñas separadas por comas.',
          'La consulta: `SELECT sentimiento, COUNT(*) AS cantidad FROM resenas GROUP BY sentimiento;`',
        ],
        solucion: [
          'CREATE TABLE resenas (',
          '  id INTEGER PRIMARY KEY,',
          '  texto TEXT NOT NULL,',
          '  sentimiento TEXT NOT NULL',
          ');',
          '',
          'INSERT INTO resenas (texto, sentimiento) VALUES',
          "  ('Delicioso el tinto', 'positivo'),",
          "  ('Excelente atención', 'positivo'),",
          "  ('Lo recomiendo', 'positivo'),",
          "  ('Llegó fría y tarde', 'negativo'),",
          "  ('Horrible servicio', 'negativo'),",
          "  ('Pedí dos empanadas', 'neutro');",
          '',
          'SELECT sentimiento, COUNT(*) AS cantidad',
          'FROM resenas',
          'GROUP BY sentimiento;',
        ].join('\n'),
      },
    ],
  }
);

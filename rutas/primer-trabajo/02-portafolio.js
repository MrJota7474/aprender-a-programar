// Ruta "Tu primer trabajo", lección 2: el portafolio y su README.
// El README se revisa con una lista de chequeo escrita en Python: es el mismo
// tipo de revisión automática que hace una persona al abrir tu repositorio,
// y le muestra al estudiante que un "documento" también se puede validar.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    // README de ejemplo que cumple toda la lista de chequeo. En Python va
    // entre comillas triples; aquí cada línea es un elemento del arreglo.
    const README_BUENO = [
      'README_BUENO = """# Tienda de Don Pepe',
      '',
      'Página y servidor para que una tienda de barrio reciba pedidos.',
      '',
      '## Qué hace',
      'El cliente arma su pedido y el dueño lo ve en una lista.',
      '',
      '## Cómo correrlo',
      '```',
      'python servidor.py',
      '```',
      '',
      '## Tecnologías',
      'Python, SQLite, HTML, CSS y JavaScript.',
      '',
      '## Pruebas',
      '```',
      'python -m pytest',
      '```',
      '"""',
    ];

    const README_POBRE = ['README_POBRE = """Mi proyecto', '', '## Tecnologías', 'Python', '"""'];

    // La lista de chequeo del reto: el estudiante la recibe ya escrita y
    // escribe la función que la aplica.
    const LISTA = [
      '# Cada punto de la lista y las palabras con que puede aparecer su título',
      'LISTA_DE_CHEQUEO = {',
      '    "qué hace": ["qué hace", "descripción"],',
      '    "cómo correrlo": ["cómo correrlo", "cómo usarlo", "instalación"],',
      '    "tecnologías": ["tecnologías"],',
      '    "pruebas": ["pruebas"],',
      '}',
      '',
      '# En Markdown, un bloque de código empieza con una línea de tres comillas invertidas',
      'INICIO_DE_BLOQUE = "```"',
    ];

    const TITULOS_SOLUCION = [
      'def titulos(readme):',
      '    encontrados = []',
      '    for linea in readme.splitlines():',
      '        if linea.startswith("## "):',
      '            encontrados.append(linea[3:].strip().lower())',
      '    return encontrados',
    ];

    return {
      id: 'portafolio',
      titulo: 'Tu portafolio y un buen README',
      pasos: [
        {
          id: 'idea',
          titulo: 'Pocos proyectos, bien hechos',
          texto: [
            'Sin experiencia laboral, tu **portafolio** es tu experiencia: proyectos que alguien puede abrir, probar y leer. Vale más tener **tres proyectos terminados** que diez tutoriales copiados a medias.',
            'Un buen proyecto de portafolio **resuelve un problema real** (aunque sea pequeño), **funciona**, tiene un **README** claro, tiene **algunas pruebas** y, si se puede, está **publicado** para verlo sin instalar nada.',
            'No tienes que inventar desde cero: amplía lo que hiciste aquí. La tienda de Don Pepe (ruta Proyectos) puede guardar pedidos en una base de datos de verdad. El asistente de reseñas (ruta IA) puede leer reseñas desde un archivo. Las consultas de la ruta SQL pueden volverse un reporte de ventas del mes.',
            'El **README** es el archivo `README.md` que GitHub muestra al abrir el repositorio. Es lo **primero que lee** quien revisa tu trabajo, y muchas veces lo único. Debe decir qué hace el proyecto, cómo correrlo, con qué está hecho y cómo correr sus pruebas. Se escribe en **Markdown**: `#` para el título y `##` para cada sección.',
          ],
          codigo: [
            '# Tres proyectos de la app, ampliados para tu portafolio',
            'proyectos = [',
            '    ("Tienda de Don Pepe", "Guardar los pedidos en una base de datos y publicar la página"),',
            '    ("Asistente de reseñas", "Leer reseñas reales de un archivo y resumirlas por producto"),',
            '    ("Reporte de ventas", "Convertir las consultas SQL en un reporte del mes con gráficos"),',
            ']',
            '',
            'for numero, (nombre, como_ampliarlo) in enumerate(proyectos, start=1):',
            '    print(str(numero) + ".", nombre, "->", como_ampliarlo)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Leer los títulos de un README',
          texto: [
            'Para revisar un README con un programa, primero hay que encontrar sus **secciones**. En Markdown, una sección empieza con una línea que comienza con `## ` (dos numerales y un espacio).',
            'Completa `titulos(readme)`: recibe el texto completo del README y devuelve la lista de títulos de sección, **sin** el `## `, sin espacios sobrantes y en **minúsculas**, en el orden en que aparecen.',
            'El título principal (`# ` con un solo numeral) no cuenta: es el nombre del proyecto, no una sección.',
          ],
          codigo: [
            ...README_BUENO,
            '',
            '',
            'def titulos(readme):',
            '    # Recorre readme.splitlines() y guarda las líneas que empiezan con "## "',
            '    return []',
            '',
            '',
            'print(titulos(README_BUENO))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'titulos es una función', condicion: 'callable(titulos)' },
            {
              descripcion: 'Encuentra las cuatro secciones del README de ejemplo',
              condicion: 'titulos(README_BUENO) == ["qué hace", "cómo correrlo", "tecnologías", "pruebas"]',
            },
            { descripcion: 'Quita espacios sobrantes y pasa a minúsculas', condicion: 'titulos("## Qué Hace   \\ntexto") == ["qué hace"]' },
            { descripcion: 'El título principal (# ) no cuenta como sección', condicion: 'titulos("# Mi tienda\\n## Pruebas") == ["pruebas"]' },
            { descripcion: 'Un README sin secciones da una lista vacía', condicion: 'titulos("Solo texto") == []' },
          ],
          pistas: [
            'Recorre las líneas con `for linea in readme.splitlines():`.',
            '`linea.startswith("## ")` dice si es una sección. Fíjate que `"# Mi tienda"` no empieza con `"## "`, así que el título principal queda fuera solo.',
            'Quita los tres primeros caracteres con `linea[3:]` y después `.strip().lower()`.',
          ],
          solucion: [...README_BUENO, '', '', ...TITULOS_SOLUCION, '', '', 'print(titulos(README_BUENO))'].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: revisar un README',
          texto: [
            'Ahora la revisión completa. Crea `revisar_readme(readme)`, que devuelve la **lista de lo que falta**, en este orden:',
            '1. `"título"` si la primera línea **no vacía** no empieza con `# ` (el nombre del proyecto debe ir de primero). 2. Cada punto de `LISTA_DE_CHEQUEO` que no aparezca: un punto aparece si **alguno** de los títulos de sección **contiene** alguna de sus palabras (así «Cómo correrlo en tu computador» también cuenta). 3. `"ejemplo de comando"` si el README no tiene ningún bloque de código: una línea que empiece con `INICIO_DE_BLOQUE` (tres comillas invertidas).',
            'Si no falta nada, devuelve una lista vacía. Ya tienes `titulos` de la práctica: úsala. Después de este ejercicio, revisa con la misma lista el README de cada proyecto de tu portafolio.',
          ],
          codigo: [
            ...LISTA,
            '',
            ...README_BUENO,
            '',
            ...README_POBRE,
            '',
            '',
            ...TITULOS_SOLUCION,
            '',
            '',
            'def revisar_readme(readme):',
            '    faltan = []',
            '    # 1. ¿La primera línea no vacía empieza con "# "?',
            '    # 2. ¿Cada punto de LISTA_DE_CHEQUEO está en algún título?',
            '    # 3. ¿Hay alguna línea que empiece con INICIO_DE_BLOQUE?',
            '    return faltan',
            '',
            '',
            'print("Bueno:", revisar_readme(README_BUENO))',
            'print("Pobre:", revisar_readme(README_POBRE))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'revisar_readme es una función', condicion: 'callable(revisar_readme)' },
            { descripcion: 'Al README completo no le falta nada', condicion: 'revisar_readme(README_BUENO) == []' },
            {
              descripcion: 'Al README pobre le faltan título, qué hace, cómo correrlo, pruebas y el comando, en ese orden',
              condicion: 'revisar_readme(README_POBRE) == ["título", "qué hace", "cómo correrlo", "pruebas", "ejemplo de comando"]',
            },
            {
              descripcion: 'Acepta otras palabras de la lista y títulos más largos',
              condicion: 'revisar_readme("\\n# App\\n## Descripción\\n## Instalación en Windows\\n```\\npython app.py\\n```\\n## Tecnologías usadas\\n## Pruebas") == []',
            },
            {
              descripcion: 'Sin bloque de código avisa "ejemplo de comando"',
              condicion: 'revisar_readme("# App\\n## Qué hace\\n## Cómo usarlo\\n## Tecnologías\\n## Pruebas") == ["ejemplo de comando"]',
            },
            { descripcion: 'Un README vacío no tiene nada', condicion: 'len(revisar_readme("")) == 6' },
          ],
          pistas: [
            'Para el título: `lineas = [l for l in readme.splitlines() if l.strip()]` y revisa `if not lineas or not lineas[0].startswith("# "):`.',
            'Para la lista: con `secciones = titulos(readme)`, un punto está si `any(palabra in seccion for seccion in secciones for palabra in palabras)`. Recorre `for punto, palabras in LISTA_DE_CHEQUEO.items():`.',
            'Para el comando: `any(linea.startswith(INICIO_DE_BLOQUE) for linea in readme.splitlines())`. Si no hay ninguno, agrega `"ejemplo de comando"` al final.',
          ],
          solucion: [
            ...LISTA,
            '',
            ...README_BUENO,
            '',
            ...README_POBRE,
            '',
            '',
            ...TITULOS_SOLUCION,
            '',
            '',
            'def revisar_readme(readme):',
            '    faltan = []',
            '    lineas = [linea for linea in readme.splitlines() if linea.strip()]',
            '    if not lineas or not lineas[0].startswith("# "):',
            '        faltan.append("título")',
            '    secciones = titulos(readme)',
            '    for punto, palabras in LISTA_DE_CHEQUEO.items():',
            '        if not any(palabra in seccion for seccion in secciones for palabra in palabras):',
            '            faltan.append(punto)',
            '    if not any(linea.startswith(INICIO_DE_BLOQUE) for linea in readme.splitlines()):',
            '        faltan.append("ejemplo de comando")',
            '    return faltan',
            '',
            '',
            'print("Bueno:", revisar_readme(README_BUENO))',
            'print("Pobre:", revisar_readme(README_POBRE))',
          ].join('\n'),
        },
      ],
    };
  })()
);

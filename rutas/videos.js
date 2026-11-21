// Videos de YouTube para reforzar cada tema. No son lecciones: son un
// complemento para ver una explicación además de practicar. Se cargan
// después de rutas/puentes.js (ver index.html).
//
// Formato de los datos:
//
//   Videos.rutas['python'] = [
//     { titulo: 'Curso de Python desde cero', canal: 'Nombre del canal',
//       url: 'https://www.youtube.com/playlist?list=PL...', idioma: 'es',
//       nota: 'Opcional: por qué vale la pena o qué parte ver.' },
//   ];
//
//   Videos.lecciones['python/variables'] = [ ...mismo formato... ];
//
// - La clave de "rutas" es el id de la ruta (rutas/catalogo.js).
// - La clave de "lecciones" es 'idDeRuta/idDeLeccion'.
// - idioma es 'es' o 'en'; si es 'en', la pantalla lo marca "en inglés".
// - url solo puede tener una de estas formas (lo revisa esUrlDeYouTube):
//     https://www.youtube.com/watch?v=<11 caracteres>
//     https://youtu.be/<11 caracteres>
//     https://www.youtube.com/playlist?list=<id>
//
// Se usan enlaces y no videos incrustados (iframe): un enlace pesa casi
// nada, no carga los rastreadores de YouTube y en el celular abre la app.

(function () {
  // Los ids de video de YouTube siempre tienen 11 caracteres de este
  // alfabeto; los de listas son más largos y variables.
  const ID_VIDEO = '[A-Za-z0-9_-]{11}';
  const ID_LISTA = '[A-Za-z0-9_-]{2,64}';

  // Los patrones van anclados (^...$) para no aceptar nada extra: ni otro
  // dominio que "contenga" youtube.com, ni parámetros raros, ni javascript:.
  const FORMAS = [
    { tipo: 'video', patron: new RegExp('^https://www\\.youtube\\.com/watch\\?v=(' + ID_VIDEO + ')$') },
    { tipo: 'video', patron: new RegExp('^https://youtu\\.be/(' + ID_VIDEO + ')$') },
    { tipo: 'lista', patron: new RegExp('^https://www\\.youtube\\.com/playlist\\?list=(' + ID_LISTA + ')$') },
  ];

  // Devuelve { tipo: 'video' | 'lista', id } o null si la URL no es válida.
  // La interfaz usa el id para pedir la miniatura (solo existe para videos).
  function analizarUrlDeYouTube(url) {
    if (typeof url !== 'string') return null;
    for (const forma of FORMAS) {
      const coincidencia = url.match(forma.patron);
      if (coincidencia) return { tipo: forma.tipo, id: coincidencia[1] };
    }
    return null;
  }

  function esUrlDeYouTube(url) {
    return analizarUrlDeYouTube(url) !== null;
  }

  // Funciones puras: devuelven una copia de la lista para que quien la use
  // no pueda modificar los datos por accidente. Si no hay videos, [].
  function videosDeLeccion(rutaId, leccionId) {
    return [...(globalThis.Videos.lecciones[rutaId + '/' + leccionId] || [])];
  }

  function videosDeRuta(rutaId) {
    return [...(globalThis.Videos.rutas[rutaId] || [])];
  }

  globalThis.Videos = {
    // Datos buscados y verificados con el oEmbed de YouTube el 20 de noviembre de 2026.
    rutas: {
      "python": [
        {
          "titulo": "Curso COMPLETO de PYTHON desde CERO para PRINCIPIANTES",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=Kp4Mvapo5kc",
          "idioma": "es",
          "nota": "Curso completo y muy claro; sirve de columna vertebral para toda la ruta"
        },
        {
          "titulo": "Curso de PYTHON desde CERO (Completo)",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=nKPbfIU442g",
          "idioma": "es",
          "nota": "Curso completo con ejemplos; buena segunda explicación si algo no quedó claro"
        },
        {
          "titulo": "Aprende Python - Curso de Python desde Cero",
          "canal": "freeCodeCamp Español",
          "url": "https://www.youtube.com/watch?v=DLikpfc64cA",
          "idioma": "es",
          "nota": "Curso de freeCodeCamp en español, más corto (4,5 h)"
        },
        {
          "titulo": "Python desde cero en una hora para principiantes!",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=IimBRwHhW54",
          "idioma": "es",
          "nota": "Para arrancar: lo esencial de Python en una hora"
        }
      ],
      "fundamentos": [
        {
          "titulo": "Curso COMPLETO de LÓGICA DE PROGRAMACIÓN Desde Cero",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=TdITcVD64zI",
          "idioma": "es",
          "nota": "Lógica de programación desde cero, sin depender de un lenguaje"
        },
        {
          "titulo": "CS50 en Español - Clase 3 - Algoritmos",
          "canal": "CS50",
          "url": "https://www.youtube.com/watch?v=-H_Sra2oVr0",
          "idioma": "es",
          "nota": "Clase de algoritmos de CS50 (Harvard) en español: búsqueda, ordenamiento y cuánto tardan"
        },
        {
          "titulo": "¿Cómo piensa tu PC? Algoritmos de ordenación y complejidad temporal (Big O) explicados",
          "canal": "Nate Gentile",
          "url": "https://www.youtube.com/watch?v=TnTu1QWaWc0",
          "idioma": "es",
          "nota": "Ordenamiento y Big O explicados de forma visual"
        },
        {
          "titulo": "Estructuras de Datos | Primeros Pasos",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=Df-sgxGzyTg",
          "idioma": "es",
          "nota": "Primeros pasos en estructuras de datos"
        }
      ],
      "datos": [
        {
          "titulo": "Pandas en 30 minutos (Python)",
          "canal": "Leonardo Kuffo",
          "url": "https://www.youtube.com/watch?v=8ASjvOIyyl8",
          "idioma": "es",
          "nota": "Pandas en media hora: Series, DataFrame, filtros y agrupaciones"
        },
        {
          "titulo": "CURSO de ANÁLISIS DE DATOS desde CERO con PYTHON (Completo)",
          "canal": "Adrian Cancino",
          "url": "https://www.youtube.com/watch?v=EaHt4PvGY_A",
          "idioma": "es",
          "nota": "Curso completo de análisis de datos con Python (NumPy, Pandas y gráficos)"
        },
        {
          "titulo": "El tutorial más importante sobre NumPy  🥸",
          "canal": "A2 Ciencia de Datos",
          "url": "https://www.youtube.com/watch?v=cYm3DBG6KfI",
          "idioma": "es",
          "nota": "NumPy a fondo para entender arreglos y operaciones vectorizadas"
        }
      ],
      "ml": [
        {
          "titulo": "¿Qué es el Machine Learning?¿Y Deep Learning? Un mapa conceptual | DotCSV",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=KytW151dpqU",
          "idioma": "es",
          "nota": "Mapa general: qué es machine learning y deep learning"
        },
        {
          "titulo": "¿Qué es el Aprendizaje Supervisado y No Supervisado? | DotCSV",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=oT3arRRB2Cw",
          "idioma": "es",
          "nota": "Aprendizaje supervisado y no supervisado, la base de esta ruta"
        },
        {
          "titulo": "CURSO de MACHINE LEARNING desde CERO | (COMPLETO)",
          "canal": "Adrian Cancino",
          "url": "https://www.youtube.com/watch?v=xyU2pzKTQE0",
          "idioma": "es",
          "nota": "Curso completo de machine learning con Python y scikit-learn"
        }
      ],
      "sql": [
        {
          "titulo": "Curso COMPLETO de SQL y BASES DE DATOS Desde Cero para PRINCIPIANTES",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=OuJerKzV5T0",
          "idioma": "es",
          "nota": "Curso completo de SQL y bases de datos para principiantes"
        },
        {
          "titulo": "Curso de SQL desde CERO (Completo)",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=DFg1V-rO6Pg",
          "idioma": "es",
          "nota": "Curso completo de SQL con muchos ejemplos"
        },
        {
          "titulo": "Aprende SQL ahora! curso completo gratis desde cero",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=uUdKAYl-F7g",
          "idioma": "es",
          "nota": "Curso corto (2 h) para tener una visión general rápida"
        }
      ],
      "ia": [
        {
          "titulo": "¿Cómo funciona ChatGPT? La revolución de la Inteligencia Artificial",
          "canal": "Nate Gentile",
          "url": "https://www.youtube.com/watch?v=FdZ8LKiJBhQ",
          "idioma": "es",
          "nota": "Cómo funciona ChatGPT por dentro, explicado para todo público"
        },
        {
          "titulo": "¿Qué es un LLM? Enormes Modelos del Lenguaje | Large Language Models",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=Sz4qacFBHLk",
          "idioma": "es",
          "nota": "Qué es un LLM (modelo grande de lenguaje)"
        },
        {
          "titulo": "[1hr Talk] Intro to Large Language Models",
          "canal": "Andrej Karpathy",
          "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
          "idioma": "en",
          "nota": "Charla clásica de Karpathy sobre modelos de lenguaje (en inglés, con subtítulos)"
        },
        {
          "titulo": "Aprende Prompt Engineering ahora! curso tutorial gratuito desde cero",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=x-iTco25VGI",
          "idioma": "es",
          "nota": "Curso de ingeniería de prompts desde cero"
        }
      ],
      "con-ia": [
        {
          "titulo": "La forma REAL de programar con IA en 2026",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=uquw8yUKaYM",
          "idioma": "es",
          "nota": "Cómo programar con IA de verdad sin dejar de aprender"
        },
        {
          "titulo": "Claude Code: Curso completo desde cero en 3 horas (2026)",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=TCq7eZ9Lhc8",
          "idioma": "es",
          "nota": "Curso completo de Claude Code, la herramienta con la que se hizo esta app"
        },
        {
          "titulo": "Qué es un agente de AI",
          "canal": "Platzi",
          "url": "https://www.youtube.com/watch?v=4bXNYw_dTeY",
          "idioma": "es",
          "nota": "Qué es un agente de IA, explicado con calma"
        },
        {
          "titulo": "Mastering Claude Code in 30 minutes",
          "canal": "Anthropic",
          "url": "https://www.youtube.com/watch?v=6eBSHbLKuN0",
          "idioma": "en",
          "nota": "Taller oficial de Anthropic sobre Claude Code"
        }
      ],
      "ciberseguridad": [
        {
          "titulo": "Aprende CIBERSEGURIDAD desde CERO | Curso de Ciberseguridad y Privacidad 101 Completo",
          "canal": "Hixec",
          "url": "https://www.youtube.com/watch?v=spMYZHepjko",
          "idioma": "es",
          "nota": "Curso de ciberseguridad y privacidad para principiantes"
        },
        {
          "titulo": "Curso de CIBERSEGURIDAD desde cero 2027 COMPLETO",
          "canal": "RINKU",
          "url": "https://www.youtube.com/watch?v=rctz_w5SB3A",
          "idioma": "es",
          "nota": "Curso de ciberseguridad desde cero, más reciente"
        }
      ],
      "javascript": [
        {
          "titulo": "Curso COMPLETO de JavaScript DESDE CERO para Principiantes",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=1glVfFxj8a4",
          "idioma": "es",
          "nota": "Curso completo y ordenado de MoureDev; sirve para repasar cada tema de la ruta."
        },
        {
          "titulo": "Curso de JAVASCRIPT desde CERO (Completo) - Nivel JUNIOR",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=z95mZVUcJ-E",
          "idioma": "es",
          "nota": "El curso largo de Dalto, muy explicado y con humor; bueno para ver por partes."
        },
        {
          "titulo": "Aprende JavaScript Ahora! curso completo desde cero para principiantes",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=QoC4RxNIs5M",
          "idioma": "es",
          "nota": "HolaMundo en unas 4 horas: más corto si quieres una pasada rápida por todo."
        },
        {
          "titulo": "Aprende JavaScript - Curso Completo desde Cero",
          "canal": "freeCodeCamp Español",
          "url": "https://www.youtube.com/watch?v=ivdTnPl1ND0",
          "idioma": "es",
          "nota": "Curso de freeCodeCamp Español con ejercicios pequeños en cada tema."
        }
      ],
      "web": [
        {
          "titulo": "Curso de HTML y CSS desde CERO (Completo)",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=ELSm-G201Ls",
          "idioma": "es",
          "nota": "Curso muy completo de HTML y CSS de Dalto; ve las secciones que necesites."
        },
        {
          "titulo": "Aprende HTML y CSS - Curso Desde Cero",
          "canal": "freeCodeCamp Español",
          "url": "https://www.youtube.com/watch?v=XqFR2lqBYPs",
          "idioma": "es",
          "nota": "HTML y CSS de freeCodeCamp Español, paso a paso y sin prisa."
        },
        {
          "titulo": "Curso COMPLETO de HTML GRATIS desde cero: SEO, semántica y más",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=3nYLTiY5skU",
          "idioma": "es",
          "nota": "HTML desde cero con midudev, con énfasis en semántica y buenas prácticas."
        }
      ],
      "react": [
        {
          "titulo": "CURSO REACT.JS - Aprende desde cero",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=7iobxzd_2wY",
          "idioma": "es",
          "nota": "Curso de React de midudev: componentes, props, estado y un proyecto."
        },
        {
          "titulo": "Aprende React ahora! curso completo para crear aplicaciones",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=yIr_1CasXkM",
          "idioma": "es",
          "nota": "Curso de React de HolaMundo, buen complemento con otros ejemplos."
        },
        {
          "titulo": "REACT: Crea tu primera web DESDE CERO [para principiantes]",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=pFyAu4R684s",
          "idioma": "es",
          "nota": "Diez minutos para ver cómo se arma una primera página con React."
        }
      ],
      "proyectos": [
        {
          "titulo": "Curso COMPLETO de GIT y GITHUB desde CERO para PRINCIPIANTES",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=3GymExBkKjE",
          "idioma": "es",
          "nota": "Git y GitHub desde cero con MoureDev; lo que necesitas para guardar tus proyectos."
        },
        {
          "titulo": "Aprende Desarrollo Full-Stack desde Cero - Tutorial para Novatos a Avanzado",
          "canal": "midudev",
          "url": "https://www.youtube.com/watch?v=mXpWhmJXV0o",
          "idioma": "es",
          "nota": "Curso largo de desarrollo full-stack de midudev; úsalo como referencia para proyectos más grandes."
        }
      ],
      "tu-computador": [
        {
          "titulo": "VISUAL STUDIO CODE: Tutorial para principiantes",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=CxF3ykWP1H4",
          "idioma": "es",
          "nota": "Lo esencial de VS Code en menos de 10 minutos."
        },
        {
          "titulo": "Curso de GIT desde CERO (Completo)",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=9ZJ-K-zk_Go",
          "idioma": "es",
          "nota": "Curso de Git de Dalto, desde instalarlo hasta trabajar con GitHub."
        },
        {
          "titulo": "Claude Code: Curso completo desde cero en 3 horas (2026)",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=TCq7eZ9Lhc8",
          "idioma": "es",
          "nota": "Curso de Claude Code de MoureDev para usar la IA dentro de tu proyecto."
        }
      ],
      "oficio": [
        {
          "titulo": "Curso de GIT y GITHUB DESDE CERO Para Aportar a Proyectos",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=niPExbK8lSw",
          "idioma": "es",
          "nota": "Git y GitHub pensado en colaborar: ramas, forks y pull requests."
        },
        {
          "titulo": "10 BUENAS PRÁCTICAS para MEJORAR tu PROYECTO de SOFTWARE",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=Vd1H08L0nyY",
          "idioma": "es",
          "nota": "Buenas prácticas para que un proyecto de software se pueda mantener."
        }
      ],
      "proyectos-ia": [
        {
          "titulo": "Curso de Desarrollo con IA: el Nuevo Programador – Día 1 – De la idea a la instrucción perfecta",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=qHYi92zRn-s",
          "idioma": "es",
          "nota": "Primer día del curso de desarrollo con IA de MoureDev: de la idea al proyecto."
        },
        {
          "titulo": "¿Qué es BACKEND y FRONTEND? - La mejor explicación en español",
          "canal": "EDteam",
          "url": "https://www.youtube.com/watch?v=50RbVujPPGs",
          "idioma": "es",
          "nota": "La explicación de EDteam sobre frontend y backend, base para entender cualquier proyecto."
        }
      ],
      "primer-trabajo": [
        {
          "titulo": "La ruta que todo programador junior debería seguir en 2026",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=S3QKUYBvN-Q",
          "idioma": "es",
          "nota": "La ruta que recomienda MoureDev a un programador junior hoy."
        },
        {
          "titulo": "Conseguir trabajo como programador hoy",
          "canal": "midudev",
          "url": "https://www.youtube.com/watch?v=7z-sXVrampg",
          "idioma": "es",
          "nota": "midudev cuenta cómo está la búsqueda de trabajo y qué hacer para destacar."
        },
        {
          "titulo": "Así es una ENTREVISTA TÉCNICA para DESARROLLADOR JUNIOR",
          "canal": "diegoveloper",
          "url": "https://www.youtube.com/watch?v=QHhRaiDeAB8",
          "idioma": "es",
          "nota": "Una entrevista técnica junior de verdad, para saber qué esperar."
        }
      ]
    },
    lecciones: {
      "python/hola-python": [
        {
          "titulo": "HOLA MUNDO en Python 🐍 Tu primer programa 😃",
          "canal": "Charly Cimino",
          "url": "https://www.youtube.com/watch?v=lQy2urna3lA",
          "idioma": "es",
          "nota": "Tu primer programa con print, en 5 minutos"
        },
        {
          "titulo": "CURSO de Python (desde cero) visual studio code - Hola mundo #1",
          "canal": "Nikorasu Def",
          "url": "https://www.youtube.com/watch?v=-F2-CMWhmXw",
          "idioma": "es",
          "nota": "Hola mundo en Python con Visual Studio Code"
        }
      ],
      "python/variables": [
        {
          "titulo": "APRENDE TIPOS, VARIABLES y OPERADORES en PYTHON como NUNCA TE LO HAN EXPLICADO",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=numQzIgpOo0",
          "idioma": "es",
          "nota": "Variables, tipos y operadores bien explicados"
        },
        {
          "titulo": "3.- Curso Python - Variables",
          "canal": "codigofacilito",
          "url": "https://www.youtube.com/watch?v=vDa5Vt002IY",
          "idioma": "es",
          "nota": "Qué es una variable y cómo se nombra"
        }
      ],
      "python/numeros": [
        {
          "titulo": "Curso Python 3 desde cero #6 | Operadores aritméticos en Python",
          "canal": "La Geekipedia De Ernesto",
          "url": "https://www.youtube.com/watch?v=6sOEpHItJHs",
          "idioma": "es",
          "nota": "Suma, resta, división, //, % y potencias"
        },
        {
          "titulo": "OPERADORES ARITMÉTICOS en Python 🐍",
          "canal": "Charly Cimino",
          "url": "https://www.youtube.com/watch?v=uIYqLzM5yVM",
          "idioma": "es",
          "nota": "Operadores aritméticos con ejemplos cortos"
        }
      ],
      "python/textos": [
        {
          "titulo": "Curso Python 3 desde cero #4 | Manipulación de cadenas de caracteres (Strings)",
          "canal": "La Geekipedia De Ernesto",
          "url": "https://www.youtube.com/watch?v=1CDE1pdVDGw",
          "idioma": "es",
          "nota": "Cómo manipular cadenas de texto: índices, métodos y más"
        }
      ],
      "python/comparaciones": [
        {
          "titulo": "Operadores Lógicos (AND - OR - NOT) en Python | Curso Python 3 🐍 # 15",
          "canal": "UskoKruM2010",
          "url": "https://www.youtube.com/watch?v=vPbEBZb0mDY",
          "idioma": "es",
          "nota": "Operadores lógicos and, or y not"
        },
        {
          "titulo": "OPERADORES LÓGICOS en Python 🐍",
          "canal": "Charly Cimino",
          "url": "https://www.youtube.com/watch?v=C0w1PYYfYBA",
          "idioma": "es",
          "nota": "Operadores lógicos con ejemplos sencillos"
        }
      ],
      "python/decisiones": [
        {
          "titulo": "Estructura Condicional IF, ELSE, ELIF en Python | Curso Python 3 🐍 # 13",
          "canal": "UskoKruM2010",
          "url": "https://www.youtube.com/watch?v=UhK8TKkEoNI",
          "idioma": "es",
          "nota": "if, elif y else en 5 minutos"
        },
        {
          "titulo": "❤️ Condicionales en Python desde Cero [IF, ELIF, ELSE] # 009",
          "canal": "Sergio A. Castaño Giraldo",
          "url": "https://www.youtube.com/watch?v=iFBcCDDDsms",
          "idioma": "es",
          "nota": "Condicionales con varios ejemplos y ejercicios"
        }
      ],
      "python/funciones": [
        {
          "titulo": "APRENDE FUNCIONES en PYTHON: def, pass, sintaxis, None, return vs print, argumentos, scope y más",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=9k91jETchkI",
          "idioma": "es",
          "nota": "def, return vs print, argumentos y alcance de variables"
        }
      ],
      "python/listas": [
        {
          "titulo": "Curso Python 3 desde cero #45 | Listas",
          "canal": "La Geekipedia De Ernesto",
          "url": "https://www.youtube.com/watch?v=K7s5jLiat70",
          "idioma": "es",
          "nota": "Qué es una lista y cómo se usa"
        },
        {
          "titulo": "Curso Python. Sintaxis Básica V. Las listas. Vídeo 7",
          "canal": "pildorasinformaticas",
          "url": "https://www.youtube.com/watch?v=Q8hugySbLQQ",
          "idioma": "es",
          "nota": "Listas: índices, métodos y porciones"
        }
      ],
      "python/bucles": [
        {
          "titulo": "Estructuras de Control de Flujo en Python: if, else, elif, while, for, break, continue",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=w53HiWSZnzU",
          "idioma": "es",
          "nota": "if, while, for, break y continue en 10 minutos"
        }
      ],
      "python/diccionarios": [
        {
          "titulo": "Curso Python. Sintaxis Básica VII  Los diccionarios. Vídeo 9",
          "canal": "pildorasinformaticas",
          "url": "https://www.youtube.com/watch?v=2OmgHl8lp0I",
          "idioma": "es",
          "nota": "Diccionarios: claves, valores y métodos"
        },
        {
          "titulo": "Diccionarios en Python para principiantes | Aprende a programar desde 0",
          "canal": "SnekCato",
          "url": "https://www.youtube.com/watch?v=8lWHKzwssNk",
          "idioma": "es",
          "nota": "Diccionarios explicados para principiantes"
        }
      ],
      "python/datos": [
        {
          "titulo": "Estructuras de datos con Python en 8 minutos: Listas, Tuplas, Conjuntos y Diccionarios",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=v25-m1LOUiU",
          "idioma": "es",
          "nota": "Listas, tuplas, conjuntos y diccionarios en 8 minutos"
        }
      ],
      "python/modulos-json": [
        {
          "titulo": "Archivos JSON en Python 😎 - Curso de Python desde cero",
          "canal": "Argueta Lab",
          "url": "https://www.youtube.com/watch?v=PK624PcZKUY",
          "idioma": "es",
          "nota": "Leer y escribir JSON con el módulo json"
        },
        {
          "titulo": "Python Tutorial: Working with JSON Data using the json Module",
          "canal": "Corey Schafer",
          "url": "https://www.youtube.com/watch?v=9N6a-VLBa2I",
          "idioma": "en",
          "nota": "json.loads, json.dumps y archivos JSON (en inglés)"
        }
      ],
      "python/errores": [
        {
          "titulo": "CURSO DE PYTHON - Manejo de la EXCEPCIONES TRY | EXCEPT | FINALLY 🐍",
          "canal": "El Rincón del Hacker",
          "url": "https://www.youtube.com/watch?v=jJyKET9ZVdE",
          "idioma": "es",
          "nota": "try, except y finally en 10 minutos"
        },
        {
          "titulo": "Manejo de Excepciones en Python [try, except, else, finally, raise] 🕵🏻 # 027",
          "canal": "Sergio A. Castaño Giraldo",
          "url": "https://www.youtube.com/watch?v=QIAi0xfmQho",
          "idioma": "es",
          "nota": "Manejo de excepciones completo: else, finally y raise"
        }
      ],
      "python/clases": [
        {
          "titulo": "Programación Básica con Python | 7. Clases y Objetos",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=-E4O0mz-gGE",
          "idioma": "es",
          "nota": "Clases y objetos explicados con calma"
        },
        {
          "titulo": "CLASES en PYTHON, TODOS los pilares de POO aplicados a un EJEMPLO COMPLETO desde CERO",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=JVNirg9qs4M",
          "idioma": "es",
          "nota": "Programación orientada a objetos con un ejemplo completo"
        }
      ],
      "python/comprensiones": [
        {
          "titulo": "List Comprehension (Comprensión de Listas) en Python 3 | ¿Cómo funcionan? ✅ | Curso Python 3 🐍 # 58",
          "canal": "UskoKruM2010",
          "url": "https://www.youtube.com/watch?v=JYmgIMfKjTQ",
          "idioma": "es",
          "nota": "Cómo funcionan las comprensiones de listas"
        }
      ],
      "python/funciones-avanzadas": [
        {
          "titulo": "Python desde cero 48: Funciones Lambda",
          "canal": "Pildoras de programación",
          "url": "https://www.youtube.com/watch?v=9NX2rELl0hI",
          "idioma": "es",
          "nota": "Funciones lambda, útiles para ordenar con sorted(key=...)"
        },
        {
          "titulo": "¿Qué es args y kwargs en python?",
          "canal": "Mundo Python",
          "url": "https://www.youtube.com/watch?v=9iBRkmpav0Y",
          "idioma": "es",
          "nota": "Qué son *args y **kwargs"
        }
      ],
      "fundamentos/binario": [
        {
          "titulo": "Números Binarios | Introducción",
          "canal": "Matemáticas profe Alex",
          "url": "https://www.youtube.com/watch?v=F1xB6oxmMWQ",
          "idioma": "es",
          "nota": "Números binarios desde cero"
        },
        {
          "titulo": "Sistema BINARIO y Puertas Lógicas: La BASE de como funciona tu PC",
          "canal": "Nate Gentile",
          "url": "https://www.youtube.com/watch?v=RVGIXfC4Xeg",
          "idioma": "es",
          "nota": "El binario y las puertas lógicas: la base de cómo funciona tu PC"
        }
      ],
      "fundamentos/logica-booleana": [
        {
          "titulo": "Tablas de verdad | Ejemplo 1",
          "canal": "Matemáticas profe Alex",
          "url": "https://www.youtube.com/watch?v=ZK8QUphO4MA",
          "idioma": "es",
          "nota": "Cómo armar una tabla de verdad"
        }
      ],
      "fundamentos/busqueda": [
        {
          "titulo": "¿Qué es la BÚSQUEDA BINARIA y por qué es tan GENIAL?",
          "canal": "Coding Tree",
          "url": "https://www.youtube.com/watch?v=L7BPRzPzZtY",
          "idioma": "es",
          "nota": "Qué es la búsqueda binaria y por qué es tan rápida"
        },
        {
          "titulo": "Complejidad Computacional 101: Big O, Búsqueda Lineal y Búsqueda Binaria",
          "canal": "Victor Sanz",
          "url": "https://www.youtube.com/watch?v=JBm5OXbReQE",
          "idioma": "es",
          "nota": "Búsqueda lineal frente a binaria y su costo"
        }
      ],
      "fundamentos/cuanto-tarda": [
        {
          "titulo": "Notación Big O | Análisis de algoritmos de forma sencilla",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=MyAiCtuhiqQ",
          "idioma": "es",
          "nota": "Notación Big O de forma sencilla"
        },
        {
          "titulo": "Complejidad Algorítmica sin llorar - Notación Big O",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=UPDjjuz1Hkw",
          "idioma": "es",
          "nota": "Complejidad algorítmica sin complicaciones"
        }
      ],
      "fundamentos/recursion": [
        {
          "titulo": "Recursividad | FÁCIL de entender y visualizar | Recursión",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=YwRjEOFxvO0",
          "idioma": "es",
          "nota": "Recursividad fácil de visualizar"
        },
        {
          "titulo": "La MAGIA de la RECURSIVIDAD",
          "canal": "BettaTech",
          "url": "https://www.youtube.com/watch?v=yX5kR63Dpdw",
          "idioma": "es",
          "nota": "La idea de la recursividad con ejemplos"
        }
      ],
      "fundamentos/pilas-y-colas": [
        {
          "titulo": "Aprende a usar Pilas y Colas | Estructuras de Datos",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=x8pLMgtRXY0",
          "idioma": "es",
          "nota": "Pilas y colas explicadas"
        }
      ],
      "fundamentos/tablas-hash": [
        {
          "titulo": "¿Qué son las TABLAS de HASH? | Estructuras de Datos en Ingeniería Informática",
          "canal": "BettaTech",
          "url": "https://www.youtube.com/watch?v=LluB6jU-SwY",
          "idioma": "es",
          "nota": "Qué es una tabla hash, en 5 minutos"
        },
        {
          "titulo": "TABLA DE HASH: QUÉ ES Y CÓMO FUNCIONAN",
          "canal": "Vida MRR - Programacion web",
          "url": "https://www.youtube.com/watch?v=9tZsDJ3JBUA",
          "idioma": "es",
          "nota": "Cómo funcionan las tablas hash por dentro"
        }
      ],
      "fundamentos/ordenamiento": [
        {
          "titulo": "Ordenamiento Burbuja | Bubble Sort",
          "canal": "Chio Code",
          "url": "https://www.youtube.com/watch?v=pqZ04TT15PQ",
          "idioma": "es",
          "nota": "Ordenamiento burbuja paso a paso"
        }
      ],
      "fundamentos/arboles-y-grafos": [
        {
          "titulo": "¿Qué son y cómo funcionan los árboles? | Ejemplo de implementación",
          "canal": "Vida MRR - Programacion web",
          "url": "https://www.youtube.com/watch?v=tBaOQeyXYqg",
          "idioma": "es",
          "nota": "Qué son los árboles y cómo funcionan"
        },
        {
          "titulo": "APRENDE GRAFOS DESDE CERO: Grafos básicos, lista y matriz de adyacencia, definiciones y propiedades.",
          "canal": "BitBoss",
          "url": "https://www.youtube.com/watch?v=vnNFiNVy9KM",
          "idioma": "es",
          "nota": "Grafos desde cero"
        }
      ],
      "datos/numpy": [
        {
          "titulo": "NumPy en 19 minutos (Python en ESPAÑOL)",
          "canal": "Errodringer",
          "url": "https://www.youtube.com/watch?v=xTJ3uGJ_b7Q",
          "idioma": "es",
          "nota": "NumPy en 19 minutos"
        }
      ],
      "datos/series-dataframe": [
        {
          "titulo": "Pandas 🐼 en 14 minutos (Python en ESPAÑOL)",
          "canal": "Errodringer",
          "url": "https://www.youtube.com/watch?v=PvNKKrPE0AI",
          "idioma": "es",
          "nota": "Pandas en 14 minutos: Series y DataFrame"
        },
        {
          "titulo": "🐼¿Qué es un DATAFRAME? | Python PANDAS tutorial ESPAÑOL",
          "canal": "Dimas",
          "url": "https://www.youtube.com/watch?v=LnH_STJ2GXo",
          "idioma": "es",
          "nota": "Qué es un DataFrame, en 3 minutos"
        }
      ],
      "datos/leer-csv": [
        {
          "titulo": "¿CÓMO leer archivos CSV en PYTHON con PANDAS? +  2 TRUCOS 🤯",
          "canal": "Dimas",
          "url": "https://www.youtube.com/watch?v=i5hVOt9QOmc",
          "idioma": "es",
          "nota": "Leer un CSV con pandas y dos trucos útiles"
        }
      ],
      "datos/seleccionar": [
        {
          "titulo": "Pandas: Métodos ilos, loc | 15/77 | UPV",
          "canal": "Universitat Politècnica de València - UPV",
          "url": "https://www.youtube.com/watch?v=0ODs64dYw0Q",
          "idioma": "es",
          "nota": "Los métodos loc e iloc"
        }
      ],
      "datos/limpiar": [
        {
          "titulo": "Tutorial: LIMPIEZA DE DATOS con Python y Pandas",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=bGnD1Ki7j-g",
          "idioma": "es",
          "nota": "Limpieza de datos con Pandas: nulos, duplicados y tipos"
        }
      ],
      "datos/agrupar": [
        {
          "titulo": "Group By and Aggregate Functions in Pandas | Python Pandas Tutorials",
          "canal": "Alex The Analyst",
          "url": "https://www.youtube.com/watch?v=VRmXto2YA2I",
          "idioma": "en",
          "nota": "groupby y funciones de agregación (en inglés)"
        }
      ],
      "datos/unir": [
        {
          "titulo": "Pandas: Método Merge | 10/77 | UPV",
          "canal": "Universitat Politècnica de València - UPV",
          "url": "https://www.youtube.com/watch?v=yAo6QlSRXjA",
          "idioma": "es",
          "nota": "El método merge en 4 minutos"
        },
        {
          "titulo": "Merging DataFrames in Pandas | Python Pandas Tutorials",
          "canal": "Alex The Analyst",
          "url": "https://www.youtube.com/watch?v=TPivN7tpdwc",
          "idioma": "en",
          "nota": "merge con tipos de unión explicados (en inglés)"
        }
      ],
      "datos/fechas": [
        {
          "titulo": "Fechas con Timestamp en Pandas",
          "canal": "OpenWebinars",
          "url": "https://www.youtube.com/watch?v=BIOGd-wdky0",
          "idioma": "es",
          "nota": "Fechas con Timestamp en Pandas"
        }
      ],
      "datos/estadistica": [
        {
          "titulo": "MEDIA, MODA Y MEDIANA Super facil | Medidas de tendencia central",
          "canal": "Daniel Carreón",
          "url": "https://www.youtube.com/watch?v=0DA7Wtz1ddg",
          "idioma": "es",
          "nota": "Media, moda y mediana, súper fácil"
        },
        {
          "titulo": "Varianza y desviación estándar | Introducción",
          "canal": "Matemáticas profe Alex",
          "url": "https://www.youtube.com/watch?v=oZRaDwnpXkY",
          "idioma": "es",
          "nota": "Varianza y desviación estándar"
        }
      ],
      "ml/aprender-de-datos": [
        {
          "titulo": "¿Qué es el Aprendizaje Supervisado y No Supervisado? | DotCSV",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=oT3arRRB2Cw",
          "idioma": "es",
          "nota": "Aprendizaje supervisado: datos con etiqueta para predecir"
        }
      ],
      "ml/validacion": [
        {
          "titulo": "Los sets de entrenamiento, validación y prueba",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=79K93XBOsIg",
          "idioma": "es",
          "nota": "Los sets de entrenamiento, validación y prueba"
        }
      ],
      "ml/arbol": [
        {
          "titulo": "Clasificación con Árboles de Decisión ¡EN 15 MINUTOS!",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=kqaLlte6P6o",
          "idioma": "es",
          "nota": "Árboles de decisión en 15 minutos"
        }
      ],
      "ml/medir-error": [
        {
          "titulo": "Las Mejores Métricas para Evaluar Modelos de Regresión con Scikit-Learn: R2, MSE, RMSE, MAE y otras",
          "canal": "Codigo Maquina",
          "url": "https://www.youtube.com/watch?v=9IZ6OPQWtpw",
          "idioma": "es",
          "nota": "Métricas de regresión: MAE, MSE, RMSE y R2"
        }
      ],
      "ml/sobreajuste": [
        {
          "titulo": "Las Redes Neuronales... ¿Aprenden o Memorizan? - Overfitting y Underfitting - Parte 1",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=7-6X3DTt3R8",
          "idioma": "es",
          "nota": "¿Aprenden o memorizan? Sobreajuste y subajuste"
        },
        {
          "titulo": "Overfitting: Menos es más #aluramás",
          "canal": "Alura Latam",
          "url": "https://www.youtube.com/watch?v=seEwXsA9BW4",
          "idioma": "es",
          "nota": "Overfitting: menos es más"
        }
      ],
      "ml/bosque": [
        {
          "titulo": "BOSQUES ALEATORIOS: Clasificación y Regresión",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=3pa0vtW64Ic",
          "idioma": "es",
          "nota": "Bosques aleatorios para clasificación y regresión"
        }
      ],
      "ml/regresion-lineal": [
        {
          "titulo": "Regresión Lineal y Mínimos Cuadrados Ordinarios | DotCSV",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=k964_uNn3l0",
          "idioma": "es",
          "nota": "Regresión lineal y mínimos cuadrados, justo lo de esta lección"
        }
      ],
      "sql/hola-sql": [
        {
          "titulo": "SQL desde cero: Aprende SQL en 10 minutos",
          "canal": "The Coder Cave | Programación y Tecnología",
          "url": "https://www.youtube.com/watch?v=yLoh2sSDECw",
          "idioma": "es",
          "nota": "SQL desde cero en 10 minutos"
        },
        {
          "titulo": "💥 CONSULTAS SQL:  SELECT (Lectura) | Con EJERCICIO PRÁCTICO | BASES DE DATOS ✅ Explicación FÁCIL #5",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=WimSXuCam5g",
          "idioma": "es",
          "nota": "La consulta SELECT con ejercicio práctico"
        }
      ],
      "sql/filtrar": [
        {
          "titulo": "Cómo SELECCIONAR y FILTRAR datos en SQL",
          "canal": "Rafa Gonzalez Gouveia",
          "url": "https://www.youtube.com/watch?v=tex3fKmIjK4",
          "idioma": "es",
          "nota": "Seleccionar y filtrar datos con WHERE"
        }
      ],
      "sql/condiciones": [
        {
          "titulo": "CLASE#3: 📊SQL: BETWEEN, IN, LIKE (OPERADORES DE LÓGICA) | 🎯CURSO SQL AL GRANO! (con MySQL)",
          "canal": "Saitest",
          "url": "https://www.youtube.com/watch?v=xig5Q5qSQLU",
          "idioma": "es",
          "nota": "BETWEEN, IN y LIKE"
        }
      ],
      "sql/ordenar": [
        {
          "titulo": "Tutorial SQL Básico | Cláusula ORDER BY y LIMIT | 5/5",
          "canal": "Eze Talamona",
          "url": "https://www.youtube.com/watch?v=1Kt5HDyL8SY",
          "idioma": "es",
          "nota": "ORDER BY y LIMIT"
        }
      ],
      "sql/resumir": [
        {
          "titulo": "💥 CONSULTAS SQL: COUNT, SUM, MIN, MAX y AVG | CON PRÁCTICA| Bases de Datos ✅ Explicación FÁCIL #10",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=kQwDyx1wiXM",
          "idioma": "es",
          "nota": "COUNT, SUM, MIN, MAX y AVG con práctica"
        }
      ],
      "sql/agrupar": [
        {
          "titulo": "💥 CONSULTAS SQL: ORDER y GROUP BY | CON EJERCICIOS PRÁCTICOS | BASES DE DATOS  ✅Explicación FÁCIL #9",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=eVzmJv2B2wk",
          "idioma": "es",
          "nota": "ORDER BY y GROUP BY con ejercicios"
        },
        {
          "titulo": "CLASE#5: 📊SQL: GROUP BY, HAVING, ORDER BY (QUERY DE FILTROS) | 🎯CURSO SQL AL GRANO! (con MySQL)",
          "canal": "Saitest",
          "url": "https://www.youtube.com/watch?v=DeNHc_sEtdU",
          "idioma": "es",
          "nota": "GROUP BY y HAVING"
        }
      ],
      "sql/unir": [
        {
          "titulo": "💥 CONSULTAS SQL: INNER JOIN | CON PRÁCTICA | Bases de Datos ✅ Explicación FÁCIL #11",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=0BstRqp6Svg",
          "idioma": "es",
          "nota": "INNER JOIN con práctica"
        },
        {
          "titulo": "Qué son JOINS en SQL y cómo combinas tablas?",
          "canal": "Rafa Gonzalez Gouveia",
          "url": "https://www.youtube.com/watch?v=qCfMFF1SjjQ",
          "idioma": "es",
          "nota": "Qué son los JOIN y cómo combinan tablas"
        }
      ],
      "sql/insertar": [
        {
          "titulo": "SQL. Insert, Update, Delete | 11/25 | UPV",
          "canal": "Universitat Politècnica de València - UPV",
          "url": "https://www.youtube.com/watch?v=KkEzKNaQVvA",
          "idioma": "es",
          "nota": "INSERT, UPDATE y DELETE en 5 minutos"
        }
      ],
      "sql/actualizar-borrar": [
        {
          "titulo": "SQL. Insert, Update, Delete | 11/25 | UPV",
          "canal": "Universitat Politècnica de València - UPV",
          "url": "https://www.youtube.com/watch?v=KkEzKNaQVvA",
          "idioma": "es",
          "nota": "INSERT, UPDATE y DELETE en 5 minutos"
        }
      ],
      "sql/crear-tablas": [
        {
          "titulo": "🤖04: CREAR TABLA en SQL de forma sencilla. CREATE TABLE | @Ingenioteka",
          "canal": "Ingenioteka",
          "url": "https://www.youtube.com/watch?v=0JAu604p9V0",
          "idioma": "es",
          "nota": "CREATE TABLE de forma sencilla"
        }
      ],
      "sql/left-join": [
        {
          "titulo": "💥CONSULTAS SQL: LEFT y RIGHT JOIN | CON PRÁCTICA |  Bases de Datos ✅ Explicación FÁCIL #12",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=nw6tK0E5iyo",
          "idioma": "es",
          "nota": "LEFT JOIN y RIGHT JOIN con práctica"
        }
      ],
      "sql/subconsultas": [
        {
          "titulo": "💥SUBCONSULTAS SQL | CON PRÁCTICA | Bases de Datos | ✅ Explicación FÁCIL | #13",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=xuASGBwNboU",
          "idioma": "es",
          "nota": "Subconsultas con práctica"
        }
      ],
      "sql/case-funciones": [
        {
          "titulo": "Writing CASE WHEN Statements in SQL (IF/THEN)",
          "canal": "Becoming a Data Scientist",
          "url": "https://www.youtube.com/watch?v=mf_IFI3I7to",
          "idioma": "en",
          "nota": "CASE WHEN: lógica condicional en SQL (en inglés)"
        }
      ],
      "sql/vistas-claves": [
        {
          "titulo": "Las vistas de SQL: Explicado!",
          "canal": "CodelyTV - Redescubre la programación",
          "url": "https://www.youtube.com/watch?v=WWXFdIKr-ck",
          "idioma": "es",
          "nota": "Qué son las vistas en SQL"
        },
        {
          "titulo": "💥 FOREIGN y PRIMARY Key 🔑 | Con EJERCICIO PRÁCTICO |  BASES DE DATOS ✅ Explicación FÁCIL #4",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=tyyhIsDmVM0",
          "idioma": "es",
          "nota": "Claves primarias y foráneas con ejercicio práctico"
        }
      ],
      "sql/postgresql": [
        {
          "titulo": "PostgreSQL and SQLite: The Database War",
          "canal": "Source Compiler",
          "url": "https://www.youtube.com/watch?v=zqZO-PSNdrU",
          "idioma": "en",
          "nota": "PostgreSQL y SQLite: en qué se diferencian (en inglés)"
        }
      ],
      "sql/bash": [
        {
          "titulo": "+30 COMANDOS BÁSICOS PARA APRENDER BASH",
          "canal": "Vida MRR - Programacion web",
          "url": "https://www.youtube.com/watch?v=nlOUbDLEZfs",
          "idioma": "es",
          "nota": "Más de 30 comandos básicos de Bash"
        }
      ],
      "ia/como-piensa": [
        {
          "titulo": "Large Language Models explained briefly",
          "canal": "3Blue1Brown",
          "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
          "idioma": "en",
          "nota": "Cómo un modelo predice la palabra que sigue (en inglés, con subtítulos)"
        },
        {
          "titulo": "¿Qué es un LLM? Enormes Modelos del Lenguaje | Large Language Models",
          "canal": "Dot CSV",
          "url": "https://www.youtube.com/watch?v=Sz4qacFBHLk",
          "idioma": "es",
          "nota": "Qué es un LLM"
        }
      ],
      "ia/tokens-y-costo": [
        {
          "titulo": "¿Qué son los TOKENS? | Grandes Modelos de Lenguaje",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=p3cPzA4S_wk",
          "idioma": "es",
          "nota": "Qué son los tokens en los modelos de lenguaje"
        }
      ],
      "ia/instrucciones-claras": [
        {
          "titulo": "Prompting 101 | Code w/ Claude",
          "canal": "Anthropic",
          "url": "https://www.youtube.com/watch?v=ysPbXH0LpIE",
          "idioma": "en",
          "nota": "Prompting 101 de Anthropic: cómo escribir buenas instrucciones"
        }
      ],
      "ia/ejemplos": [
        {
          "titulo": "Prompt Engineering: Zero vs Few Shot vs Chain of Thought",
          "canal": "CodelyTV - Redescubre la programación",
          "url": "https://www.youtube.com/watch?v=AJuFk76r5WY",
          "idioma": "es",
          "nota": "Zero-shot, few-shot y chain of thought"
        }
      ],
      "ia/memoria": [
        {
          "titulo": "¿Qué es la VENTANA DE CONTEXTO de un Gran Modelo de Lenguaje?",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=0E-p4DlDysE",
          "idioma": "es",
          "nota": "La ventana de contexto: lo que el modelo puede ver de la conversación"
        }
      ],
      "ia/herramientas": [
        {
          "titulo": "AI + your code: Function Calling",
          "canal": "Google Cloud Tech",
          "url": "https://www.youtube.com/watch?v=NbAGbXr4DME",
          "idioma": "en",
          "nota": "Llamada de funciones: cómo un modelo usa tus herramientas"
        }
      ],
      "ia/mcp": [
        {
          "titulo": "Aprende MCP en 10 minutos y crea tu primero servidor desde Cero",
          "canal": "The Coder Cave | Programación y Tecnología",
          "url": "https://www.youtube.com/watch?v=k2jmYr1x5Tk",
          "idioma": "es",
          "nota": "MCP en 10 minutos y tu primer servidor"
        },
        {
          "titulo": "MCP desde cero: Conecta tu IA a cualquier dato",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=nqzVrkhmNTg",
          "idioma": "es",
          "nota": "MCP desde cero, más a fondo (1 h)"
        }
      ],
      "con-ia/que-es-un-agente": [
        {
          "titulo": "¿Qué son los Agentes de IA? Explicación sencilla",
          "canal": "Oliver Nabani",
          "url": "https://www.youtube.com/watch?v=Xh1Jv33RIKw",
          "idioma": "es",
          "nota": "Qué son los agentes de IA, explicación sencilla"
        },
        {
          "titulo": "Qué es un agente de AI",
          "canal": "Platzi",
          "url": "https://www.youtube.com/watch?v=4bXNYw_dTeY",
          "idioma": "es",
          "nota": "Qué es un agente de IA, más a fondo"
        }
      ],
      "con-ia/pedir-codigo-bien": [
        {
          "titulo": "Claude Code best practices | Code w/ Claude",
          "canal": "Anthropic",
          "url": "https://www.youtube.com/watch?v=gv0WHhKelSE",
          "idioma": "en",
          "nota": "Buenas prácticas de Anthropic para pedirle código a Claude Code"
        }
      ],
      "con-ia/revisar-lo-que-entrega-la-ia": [
        {
          "titulo": "El gran problema del Vibe Coding",
          "canal": "midudev",
          "url": "https://www.youtube.com/watch?v=TlKU1SwfY48",
          "idioma": "es",
          "nota": "El gran problema de aceptar código de la IA sin revisarlo"
        }
      ],
      "con-ia/las-pruebas-son-tu-red": [
        {
          "titulo": "La Realidad del Test-Driven Development (TDD)",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=eZzF0BDAfOg",
          "idioma": "es",
          "nota": "Qué es TDD y para qué sirve de verdad"
        }
      ],
      "con-ia/el-contexto": [
        {
          "titulo": "¿Qué es la VENTANA DE CONTEXTO de un Gran Modelo de Lenguaje?",
          "canal": "Codificando Bits",
          "url": "https://www.youtube.com/watch?v=0E-p4DlDysE",
          "idioma": "es",
          "nota": "Qué es la ventana de contexto y por qué tiene límite"
        }
      ],
      "con-ia/caso-real-esta-app": [
        {
          "titulo": "Mastering Claude Code in 30 minutes",
          "canal": "Anthropic",
          "url": "https://www.youtube.com/watch?v=6eBSHbLKuN0",
          "idioma": "en",
          "nota": "Taller oficial de Claude Code, la herramienta con la que se hizo esta app"
        }
      ],
      "con-ia/repaso-uso-responsable": [
        {
          "titulo": "La forma REAL de programar con IA en 2026",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=uquw8yUKaYM",
          "idioma": "es",
          "nota": "Cómo usar la IA para programar sin dejar de aprender"
        }
      ],
      "ciberseguridad/triada-cia": [
        {
          "titulo": "¿Qué es la triada CIA en ciberseguridad? | Curso CIBERSEGURIDAD desde 0 2025",
          "canal": "RINKU",
          "url": "https://www.youtube.com/watch?v=_MJt0ugOc_E",
          "idioma": "es",
          "nota": "Confidencialidad, integridad y disponibilidad en 5 minutos"
        }
      ],
      "ciberseguridad/contrasenas": [
        {
          "titulo": "3 errores con contraseñas que comete TODO EL MUNDO (no seas tú)",
          "canal": "María Aperador | Criminología y Ciberseguridad",
          "url": "https://www.youtube.com/watch?v=qcdOv9Isrtc",
          "idioma": "es",
          "nota": "Errores comunes con las contraseñas y cómo evitarlos"
        }
      ],
      "ciberseguridad/phishing": [
        {
          "titulo": "⚠️QUE es el PHISHING y CÓMO FUNCIONA⚠️ | Cómo evitar ataques de phishing",
          "canal": "Retro",
          "url": "https://www.youtube.com/watch?v=UuuAlP7ay6U",
          "idioma": "es",
          "nota": "Qué es el phishing y cómo evitarlo"
        },
        {
          "titulo": "⚠️ Así es Cómo un HACKER puede CREAR un PHISHING - ¿Qué es un Phishing y cómo Protegernos?",
          "canal": "El Pingüino de Mario",
          "url": "https://www.youtube.com/watch?v=GIxWzwxdH48",
          "idioma": "es",
          "nota": "Cómo se arma un phishing por dentro y cómo protegerte"
        }
      ],
      "ciberseguridad/malware-respaldos": [
        {
          "titulo": "Conoce qué es el ransomware y cómo puedes protegerte",
          "canal": "ESET Latinoamérica",
          "url": "https://www.youtube.com/watch?v=xpFU4n2iHN8",
          "idioma": "es",
          "nota": "Qué es el ransomware y cómo protegerte"
        },
        {
          "titulo": "Backup 3 - 2 - 1, el método definitivo para mantener a salvo tus datos",
          "canal": "Xataka",
          "url": "https://www.youtube.com/watch?v=PM_M4Iz6I4o",
          "idioma": "es",
          "nota": "La regla 3-2-1 de las copias de seguridad"
        }
      ],
      "ciberseguridad/dos-factores": [
        {
          "titulo": "Autenticador de GOOGLE ¿Cómo FUNCIONA? ¿Qué es? activar Authenticator",
          "canal": "Tu profe Mixto",
          "url": "https://www.youtube.com/watch?v=_7OUehOkeyo",
          "idioma": "es",
          "nota": "Cómo funciona una app autenticadora (códigos TOTP)"
        }
      ],
      "ciberseguridad/redes-https": [
        {
          "titulo": "SSL, TLS, HTTPS, HTTP - Explicado Fácilmente",
          "canal": "Profe Sang",
          "url": "https://www.youtube.com/watch?v=6HJAWFenYx8",
          "idioma": "es",
          "nota": "SSL, TLS, HTTP y HTTPS explicados fácil"
        },
        {
          "titulo": "¿Qué es una VPN y cómo funciona a favor de la privacidad de tu información?",
          "canal": "ESET Latinoamérica",
          "url": "https://www.youtube.com/watch?v=IzxC6UPilqQ",
          "idioma": "es",
          "nota": "Qué es una VPN y cómo protege tu información"
        }
      ],
      "javascript/variables": [
        {
          "titulo": "👩🏻‍💻 ¿Cuál es la DIFERENCIA ENTRE VAR, LET y CONST en JS?  | ⭐ Curso JAVASCRIPT DESDE CERO 🚀 #4",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=a8SJJPvkGIE",
          "idioma": "es",
          "nota": "Diferencia entre var, let y const."
        }
      ],
      "javascript/decisiones": [
        {
          "titulo": "👩🏻‍💻 CONDICIONALES IF + ELSE en JAVASCRIPT  + EJERCICIO | ⭐ Curso JAVASCRIPT DESDE CERO 🚀 #7",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=XYs3nHEKfeY",
          "idioma": "es",
          "nota": "if y else con un ejercicio al final."
        }
      ],
      "javascript/funciones": [
        {
          "titulo": "Funciones en Javascript | Parámetros y Return [Con Ejemplos]",
          "canal": "Code Hive",
          "url": "https://www.youtube.com/watch?v=e3EyqGnb6XM",
          "idioma": "es",
          "nota": "Parámetros y return con ejemplos claros."
        }
      ],
      "javascript/arreglos": [
        {
          "titulo": "Arrays y Objetos en JavaScript en 15 Minutos",
          "canal": "deivchoi",
          "url": "https://www.youtube.com/watch?v=5DaZXXbHI_U",
          "idioma": "es",
          "nota": "Arreglos y objetos en 15 minutos."
        }
      ],
      "javascript/bucles": [
        {
          "titulo": "👩🏻‍💻 ESTRUCTURA REPETITIVA FOR EN JAVASCRIPT | ⭐ Curso JAVASCRIPT DESDE CERO 🚀 #11",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=-0t2bLM4SD4",
          "idioma": "es",
          "nota": "Cómo funciona el bucle for, paso a paso."
        }
      ],
      "javascript/objetos": [
        {
          "titulo": "⭐[JS] 11 Aprende a CREAR OBJETOS en Javascript!!! - 📚 Curso JAVASCRIPT",
          "canal": "CodingTube",
          "url": "https://www.youtube.com/watch?v=rfm0lWiCk4k",
          "idioma": "es",
          "nota": "Crear objetos y usar sus propiedades."
        }
      ],
      "javascript/metodos-arreglos": [
        {
          "titulo": "7 MÉTODOS DE ARRAYS en JAVASCRIPT QUE DEBES CONOCER",
          "canal": "Carlos Azaustre - AprendiendoDEV",
          "url": "https://www.youtube.com/watch?v=5yPf74sCu2k",
          "idioma": "es",
          "nota": "map, filter, find y otros métodos que se usan todos los días."
        }
      ],
      "javascript/datos-json": [
        {
          "titulo": "⭐¿Qué es JSON? ¿Cuál es su SINTAXIS? 🖥️¿Cómo crear un archivo JSON? | DESARROLLO WEB 🌎",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=RhxOTqFbI5Q",
          "idioma": "es",
          "nota": "Qué es JSON y cómo se escribe."
        },
        {
          "titulo": "¿QUE ES JSON Y COMO FUNCIONA? - ANALIZANDO TECNOLOGÍAS",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=z8qk7T_2sWg",
          "idioma": "es",
          "nota": "Explicación corta de JSON en menos de 4 minutos."
        }
      ],
      "javascript/clases": [
        {
          "titulo": "⭐ [JS] 12 Aprende a CREAR CLASES en Javascript!!! - 📚 Curso JAVASCRIPT",
          "canal": "CodingTube",
          "url": "https://www.youtube.com/watch?v=9LH_1NDn2RU",
          "idioma": "es",
          "nota": "Crear clases con constructor y métodos."
        }
      ],
      "javascript/errores": [
        {
          "titulo": "¡Maneja los errores de JavaScript como un senior!",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=OhE-mEt37iA",
          "idioma": "es",
          "nota": "Manejar errores con try/catch y lanzar los propios."
        },
        {
          "titulo": "CÓMO Y CUANDO USAR TRY y CATCH EN JAVASCRIPT",
          "canal": "Vida MRR - Programacion web",
          "url": "https://www.youtube.com/watch?v=q809W40T-b8",
          "idioma": "es",
          "nota": "Cuándo vale la pena usar try y catch."
        }
      ],
      "javascript/reduce-ordenar": [
        {
          "titulo": "19. MAP, FILTER y REDUCE EN JAVASCRIPT",
          "canal": "La Cocina del Código",
          "url": "https://www.youtube.com/watch?v=tP8JiVUiyDo",
          "idioma": "es",
          "nota": "map, filter y reduce explicados con calma."
        }
      ],
      "javascript/async-await": [
        {
          "titulo": "Así funcionan las PROMESAS y ASYNC/AWAIT en JAVASCRIPT || Entiende la Asincronía",
          "canal": "Carlos Azaustre - AprendiendoDEV",
          "url": "https://www.youtube.com/watch?v=6O8ax3JYboc",
          "idioma": "es",
          "nota": "Promesas y async/await con ejemplos sencillos."
        },
        {
          "titulo": "Callbacks 🆚 Promises en JavaScript. ¡Entiende las diferencias y la importancia de cada una!",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=frm0CHyeSbE",
          "idioma": "es",
          "nota": "Por qué se pasó de callbacks a promesas."
        }
      ],
      "javascript/fetch": [
        {
          "titulo": "Cómo CONSUMIR una API REST con JAVASCRIPT y Fetch + Promises con gestión de Errores",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=FJ-w0tf3d_w",
          "idioma": "es",
          "nota": "Pedir datos a una API con fetch y manejar los errores."
        }
      ],
      "web/estructura": [
        {
          "titulo": "🧡 Todos los ELEMENTOS SEMÁNTICOS de HTML [Curso de HTML desde cero]",
          "canal": "Kiko Palomares",
          "url": "https://www.youtube.com/watch?v=FeXpLU515AI",
          "idioma": "es",
          "nota": "Las etiquetas semánticas de HTML en 5 minutos."
        },
        {
          "titulo": "HTML SEMÁNTICO y etiquetas semánticas 🤓 ¿Qué significa? ¿Para qué sirve?",
          "canal": "Carpi Coder",
          "url": "https://www.youtube.com/watch?v=wx92etmlHtc",
          "idioma": "es",
          "nota": "Por qué usar header, main, footer y no solo div."
        }
      ],
      "web/formularios": [
        {
          "titulo": "🧡 TODOS los Elementos de formularios en HTML [Curso de HTML desde cero]",
          "canal": "Kiko Palomares",
          "url": "https://www.youtube.com/watch?v=tpCOfg1FgPw",
          "idioma": "es",
          "nota": "Todos los elementos de un formulario en HTML."
        }
      ],
      "web/css-flexbox": [
        {
          "titulo": "Aprende CSS Flexbox en 15 Minutos 📘",
          "canal": "Victor Robles WEB",
          "url": "https://www.youtube.com/watch?v=QFXSgGg-HWo",
          "idioma": "es",
          "nota": "Flexbox en 15 minutos con ejemplos visuales."
        },
        {
          "titulo": "Aprende CSS Flexbox en 10 minutos 📚",
          "canal": "The Coder Cave | Programación y Tecnología",
          "url": "https://www.youtube.com/watch?v=rOQTEQkM96A",
          "idioma": "es",
          "nota": "Otra explicación corta de Flexbox."
        }
      ],
      "web/css-grid": [
        {
          "titulo": "Aprende CSS Grid Layout en 15 Minutos 📗",
          "canal": "Victor Robles WEB",
          "url": "https://www.youtube.com/watch?v=-kgGATnsPbs",
          "idioma": "es",
          "nota": "CSS Grid desde cero en unos 20 minutos."
        },
        {
          "titulo": "CSS Grid vs Flexbox - Cuando usar uno u otro.",
          "canal": "FalconMasters",
          "url": "https://www.youtube.com/watch?v=6qko7Nbe8YA",
          "idioma": "es",
          "nota": "Cuándo usar Grid y cuándo Flexbox."
        }
      ],
      "web/diseno-adaptable": [
        {
          "titulo": "💙 Cómo usar las MEDIA QUERIES en FLEXBOX CSS para crear layouts RESPONSIVE (ejemplo práctico!)",
          "canal": "Kiko Palomares",
          "url": "https://www.youtube.com/watch?v=pu6ArfDxxpE",
          "idioma": "es",
          "nota": "Media queries con Flexbox para que la página se adapte al celular."
        },
        {
          "titulo": "Learn CSS Media Query In 7 Minutes",
          "canal": "Web Dev Simplified",
          "url": "https://www.youtube.com/watch?v=yU7jJ3NbPdA",
          "idioma": "en",
          "nota": "Clásico en inglés: media queries en 7 minutos."
        }
      ],
      "web/javascript-pagina": [
        {
          "titulo": "¿Qué es el DOM? | ⭐ Curso JAVASCRIPT DESDE CERO 🚀 #28",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=4ILE0y58J00",
          "idioma": "es",
          "nota": "Qué es el DOM y cómo lo usa JavaScript."
        },
        {
          "titulo": "Cómo dominar el DOM en JavaScript en 30 minutos 🌳 2025",
          "canal": "Carlos Azaustre - AprendiendoDEV",
          "url": "https://www.youtube.com/watch?v=z1a0eHWn5ds",
          "idioma": "es",
          "nota": "Seleccionar y cambiar elementos de la página con JavaScript."
        }
      ],
      "web/accesibilidad": [
        {
          "titulo": "Como hacer PÁGINAS WEB INCLUSIVAS (Accesibilidad Web)",
          "canal": "Soy Dalto",
          "url": "https://www.youtube.com/watch?v=m67d6q_oYHo",
          "idioma": "es",
          "nota": "Cómo hacer páginas que todos puedan usar."
        },
        {
          "titulo": "Accesibilidad Web: Tutorial para hacer tu sitio web 100% accesible",
          "canal": "Programador X",
          "url": "https://www.youtube.com/watch?v=GqTU7qNHcO4",
          "idioma": "es",
          "nota": "Repaso práctico de accesibilidad web."
        }
      ],
      "react/crear-elementos": [
        {
          "titulo": "¿Qué es JSX? Todo lo que necesitas saber",
          "canal": "Carlos Azaustre - AprendiendoDEV",
          "url": "https://www.youtube.com/watch?v=oGSf4_bOzec",
          "idioma": "es",
          "nota": "Qué es JSX y en qué se convierte."
        }
      ],
      "react/props": [
        {
          "titulo": "Props | React JS Desde Cero (2021)",
          "canal": "Code Hive",
          "url": "https://www.youtube.com/watch?v=SxK_pgoticY",
          "idioma": "es",
          "nota": "Pasar datos a un componente con props."
        }
      ],
      "react/estado-eventos": [
        {
          "titulo": "React Hooks: useState fácil",
          "canal": "HolaMundo",
          "url": "https://www.youtube.com/watch?v=PIPC6kKR6Xw",
          "idioma": "es",
          "nota": "useState explicado de forma sencilla."
        }
      ],
      "react/listas-key": [
        {
          "titulo": "Renderizar Listas con Map | React JS Desde Cero (2021)",
          "canal": "Code Hive",
          "url": "https://www.youtube.com/watch?v=FOr6cIyCoBg",
          "idioma": "es",
          "nota": "Mostrar listas con map y por qué hace falta key."
        }
      ],
      "proyectos/guardar-con-git": [
        {
          "titulo": "🚀GIT ADD + GIT COMMIT + GIT PUSH TUTORIAL 💥| CONFIGURACIÓN FÁCIL | Introducción a GIT y GITHUB #4",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=osO_eYMIKxM",
          "idioma": "es",
          "nota": "git add, commit y push explicados paso a paso."
        },
        {
          "titulo": "Aprende Git en 15 Minutos",
          "canal": "deivchoi",
          "url": "https://www.youtube.com/watch?v=vlCXdvcgiE0",
          "idioma": "es",
          "nota": "Lo básico de Git en 15 minutos."
        }
      ],
      "proyectos/portafolio": [
        {
          "titulo": "Crea tu PORTAFOLIO y consigue trabajo como PROGRAMADOR [Parte 1]",
          "canal": "MoureDev TV",
          "url": "https://www.youtube.com/watch?v=oYBC7r5oSzk",
          "idioma": "es",
          "nota": "Qué poner en tu portafolio para que sirva en la búsqueda de trabajo."
        }
      ],
      "tu-computador/la-terminal": [
        {
          "titulo": "¿Cómo se usa la TERMINAL? | Tutorial de CMD/Powershell para PRINCIPIANTES",
          "canal": "LirloxArchives",
          "url": "https://www.youtube.com/watch?v=kfEpjj2NZxU",
          "idioma": "es",
          "nota": "Cómo se usa la terminal de Windows (CMD y PowerShell) desde cero."
        },
        {
          "titulo": "Como utilizar la Consola de Windows (Comandos básicos CMD)",
          "canal": "FalconMasters",
          "url": "https://www.youtube.com/watch?v=W6434nulBu8",
          "idioma": "es",
          "nota": "Comandos básicos de la consola de Windows."
        }
      ],
      "tu-computador/instalar-python-y-node": [
        {
          "titulo": "Cómo INSTALAR Python en Windows 10/11 🔽 Paso a Paso en 5 minutos🔥",
          "canal": "EdTics Academy",
          "url": "https://www.youtube.com/watch?v=xd_0RN2SyfI",
          "idioma": "es",
          "nota": "Instalar Python en Windows paso a paso (marca la casilla de PATH)."
        },
        {
          "titulo": "Como instalar Node.js paso a paso | Windows",
          "canal": "Códigos de Programación - MR",
          "url": "https://www.youtube.com/watch?v=4tT9x948VlE",
          "idioma": "es",
          "nota": "Instalar Node.js en Windows paso a paso."
        }
      ],
      "tu-computador/vs-code": [
        {
          "titulo": "VISUAL STUDIO CODE: Tutorial para principiantes",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=CxF3ykWP1H4",
          "idioma": "es",
          "nota": "Primeros pasos con VS Code."
        }
      ],
      "tu-computador/entornos-y-dependencias": [
        {
          "titulo": "Python VENV: Entornos Virtuales Explicados Fácil 🚀 (Guía Completa)",
          "canal": "Nico Dev",
          "url": "https://www.youtube.com/watch?v=qD8j5J6wFuw",
          "idioma": "es",
          "nota": "Entornos virtuales de Python con venv, explicados fácil."
        },
        {
          "titulo": "Curso de Node.js [ #03 Package.json y NPM ]",
          "canal": "Bluuweb",
          "url": "https://www.youtube.com/watch?v=w-hKkMQR5O8",
          "idioma": "es",
          "nota": "Qué son npm y package.json en Node."
        }
      ],
      "tu-computador/git-y-github": [
        {
          "titulo": "Te enseño Git y Github desde 0 en 15 minutos! | VTUBER ESP",
          "canal": "LirloxArchives",
          "url": "https://www.youtube.com/watch?v=H2h_ew9dc_0",
          "idioma": "es",
          "nota": "Git y GitHub desde cero en unos 15 minutos."
        }
      ],
      "tu-computador/claude-code": [
        {
          "titulo": "Aprende Claude Code en 15 Minutos 📙",
          "canal": "Victor Robles WEB",
          "url": "https://www.youtube.com/watch?v=EzLivtKeXNY",
          "idioma": "es",
          "nota": "Claude Code en 15 minutos."
        }
      ],
      "tu-computador/tu-pagina-publicada": [
        {
          "titulo": "Cómo publicar un sitio web gratis con Github pages - Actualizado!",
          "canal": "Programación Accesible",
          "url": "https://www.youtube.com/watch?v=8IdBAysf-U4",
          "idioma": "es",
          "nota": "Publicar una página gratis con GitHub Pages."
        }
      ],
      "oficio/depurar": [
        {
          "titulo": "Debugging JavaScript - Chrome DevTools 101",
          "canal": "Chrome for Developers",
          "url": "https://www.youtube.com/watch?v=H0XScE08hy8",
          "idioma": "en",
          "nota": "Clásico del equipo de Chrome: puntos de interrupción en DevTools."
        },
        {
          "titulo": "🛠️ Debugging como un profesional en JavaScript con DevTools del navegador - Programación en español",
          "canal": "Programación en español",
          "url": "https://www.youtube.com/watch?v=ps1WhgelV_E",
          "idioma": "es",
          "nota": "Depurar JavaScript con las DevTools del navegador."
        }
      ],
      "oficio/apis-rest": [
        {
          "titulo": "¿Qué es una API? - La mejor explicación en español",
          "canal": "EDteam",
          "url": "https://www.youtube.com/watch?v=u2Ms34GE14U",
          "idioma": "es",
          "nota": "Qué es una API, con una muy buena explicación."
        },
        {
          "titulo": "REST y RESTful APIs | Te lo explico en 5 minutos!",
          "canal": "Leonardo Kuffo",
          "url": "https://www.youtube.com/watch?v=JD6VNRdGl98",
          "idioma": "es",
          "nota": "REST y APIs RESTful en 5 minutos."
        }
      ],
      "oficio/inyeccion-sql": [
        {
          "titulo": "Inyección SQL: El Hackeo Más Sencillo y Peligroso que Existe",
          "canal": "Migma",
          "url": "https://www.youtube.com/watch?v=tdtAmH3ZSAI",
          "idioma": "es",
          "nota": "Qué es la inyección SQL y por qué es tan peligrosa."
        },
        {
          "titulo": "👉 SQL INJECTION (SQLi) Explicado Paso a Paso | Ciberseguridad🔒",
          "canal": "El Pingüino de Mario",
          "url": "https://www.youtube.com/watch?v=qLeeLRn9Z78",
          "idioma": "es",
          "nota": "La inyección SQL paso a paso."
        }
      ],
      "oficio/xss-claves-secretos": [
        {
          "titulo": "👉 ¿Qué es Cross-site Scripting (XSS)? Demostración y RIESGOS de esta VULNERABILIDAD",
          "canal": "El Pingüino de Mario",
          "url": "https://www.youtube.com/watch?v=lG2XpAgy0Ns",
          "idioma": "es",
          "nota": "Qué es XSS, con una demostración."
        },
        {
          "titulo": "Funciones Hash 101 | Ciberseguridad desde 0",
          "canal": "Ciberu",
          "url": "https://www.youtube.com/watch?v=o71IS0nk1Yw",
          "idioma": "es",
          "nota": "Funciones hash: la base para guardar contraseñas."
        }
      ],
      "oficio/git-en-equipo": [
        {
          "titulo": "🚀GIT: TODO LO QUE TENÉS QUE SABER SOBRE BRANCHES (RAMAS) 🌳🤩 | Introducción a GIT y GITHUB #6",
          "canal": "TodoCode",
          "url": "https://www.youtube.com/watch?v=gjKKtQVVCZU",
          "idioma": "es",
          "nota": "Ramas en Git: todo lo que necesitas."
        },
        {
          "titulo": "Qué es y cómo hacer un Pull Request",
          "canal": "codigofacilito",
          "url": "https://www.youtube.com/watch?v=Zqft6yNRuNs",
          "idioma": "es",
          "nota": "Qué es un pull request y cómo se hace."
        }
      ],
      "oficio/del-pedido-a-tareas": [
        {
          "titulo": "COMO CREAR HISTORIAS DE USUARIO EN SCRUM",
          "canal": "Ágil Es Por Cris Rúa",
          "url": "https://www.youtube.com/watch?v=ky6wFiF5vMk",
          "idioma": "es",
          "nota": "Cómo escribir historias de usuario."
        }
      ],
      "proyectos-ia/dependencias-y-versiones": [
        {
          "titulo": "La Mayoría No Sabe Cómo Funcionan Las Dependencias Del Package.JSON",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=IfqX8T_g2xA",
          "idioma": "es",
          "nota": "Cómo funcionan las dependencias y versiones del package.json."
        }
      ],
      "proyectos-ia/frameworks-sin-miedo": [
        {
          "titulo": "Framework vs Librería - La mejor explicación en español",
          "canal": "EDteam",
          "url": "https://www.youtube.com/watch?v=A-iKX8Shge4",
          "idioma": "es",
          "nota": "La diferencia entre framework y librería."
        }
      ],
      "proyectos-ia/variables-de-entorno": [
        {
          "titulo": "Variables de Entorno en Node.js (.env) | Paquete 'dotenv' | Curso Node.js # 29 ✅",
          "canal": "UskoKruM2010",
          "url": "https://www.youtube.com/watch?v=QVktixQBKEg",
          "idioma": "es",
          "nota": "Variables de entorno en Node con dotenv."
        },
        {
          "titulo": "Variables de Entorno con Python (.env) | python-dotenv | python-decouple ✅ | Curso Python 3 🐍 # 65",
          "canal": "UskoKruM2010",
          "url": "https://www.youtube.com/watch?v=E0Ys_ntvshY",
          "idioma": "es",
          "nota": "Lo mismo en Python con python-dotenv."
        }
      ],
      "proyectos-ia/frontend-y-backend": [
        {
          "titulo": "Qué es Frontend y Backend",
          "canal": "Platzi",
          "url": "https://www.youtube.com/watch?v=s95S1_vP-dQ",
          "idioma": "es",
          "nota": "Qué es frontend y qué es backend."
        }
      ],
      "proyectos-ia/como-llega-a-internet": [
        {
          "titulo": "Así funciona una PÁGINA WEB (hosting, dominio, DNS...)",
          "canal": "ChicaGeek",
          "url": "https://www.youtube.com/watch?v=zcvaQF1SdjM",
          "idioma": "es",
          "nota": "Hosting, dominio y DNS: cómo funciona una página web."
        },
        {
          "titulo": "🟣 ¿Qué es el DNS? Para qué sirve un servidor DNS? Tutorial BÁSICO",
          "canal": "Enreta Sistemas",
          "url": "https://www.youtube.com/watch?v=t7EGv2I5FpM",
          "idioma": "es",
          "nota": "Qué es el DNS y para qué sirve."
        }
      ],
      "proyectos-ia/dirigir-a-la-ia": [
        {
          "titulo": "🟡 Te Explico Cómo REALMENTE Debes Usar la IA para Programar",
          "canal": "aDevSays",
          "url": "https://www.youtube.com/watch?v=BdWfEZ2aTAw",
          "idioma": "es",
          "nota": "Cómo usar la IA para programar sin perder el control."
        }
      ],
      "proyectos-ia/revisar-y-cambiar": [
        {
          "titulo": "El fin del VIBE CODING: La realidad de la IA en 2026",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=jresR0hZ_Hs",
          "idioma": "es",
          "nota": "Por qué no basta con aceptar lo que escribe la IA."
        }
      ],
      "primer-trabajo/portafolio": [
        {
          "titulo": "Crea tu PORTAFOLIO y consigue trabajo como PROGRAMADOR [Parte 1]",
          "canal": "MoureDev TV",
          "url": "https://www.youtube.com/watch?v=oYBC7r5oSzk",
          "idioma": "es",
          "nota": "Cómo armar un portafolio que ayude a conseguir trabajo."
        },
        {
          "titulo": "DEJA DE MENTIR, La verdad sobre los portfolios web",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=n5cAxD137QM",
          "idioma": "es",
          "nota": "Lo que de verdad importa en un portafolio."
        }
      ],
      "primer-trabajo/github": [
        {
          "titulo": "Tu GitHub es BASURA - Cómo hacer un perfil profesional de GitHub",
          "canal": "Programación by AristiDevs",
          "url": "https://www.youtube.com/watch?v=ZUeklrWb_mE",
          "idioma": "es",
          "nota": "Cómo dejar tu perfil de GitHub presentable."
        }
      ],
      "primer-trabajo/hoja-de-vida": [
        {
          "titulo": "✅ Cómo crear el MEJOR CV para PROGRAMADOR o DESARROLLADOR JUNIOR (Éxito asegurado 🏆)",
          "canal": "Conquer Blocks",
          "url": "https://www.youtube.com/watch?v=uAUQ0XdQnGY",
          "idioma": "es",
          "nota": "Cómo armar la hoja de vida de un programador junior."
        }
      ],
      "primer-trabajo/que-busca-una-empresa": [
        {
          "titulo": "❌ 5 ERRORES al buscar tu primer trabajo en PROGRAMACIÓN",
          "canal": "midudev",
          "url": "https://www.youtube.com/watch?v=PTIHFyVu01Q",
          "idioma": "es",
          "nota": "Cinco errores comunes al buscar el primer trabajo."
        }
      ],
      "primer-trabajo/entrevista-ejercicios": [
        {
          "titulo": "Así es una ENTREVISTA TÉCNICA REAL de Programación",
          "canal": "diegoveloper",
          "url": "https://www.youtube.com/watch?v=e-yDDDW1SJM",
          "idioma": "es",
          "nota": "Una entrevista técnica real de programación."
        }
      ],
      "primer-trabajo/entrevista-conceptos": [
        {
          "titulo": "📒 20 Preguntas de JavaScript que te harán en Entrevistas de DESARROLLO WEB 💻 Entrevista Técnica #6",
          "canal": "Victor Robles WEB",
          "url": "https://www.youtube.com/watch?v=m6GKaw-u4pY",
          "idioma": "es",
          "nota": "20 preguntas de JavaScript que salen en entrevistas."
        },
        {
          "titulo": "ENTREVISTA de TRABAJO para PROGRAMADOR JUNIOR: 5 preguntas y cómo responderlas + Consejos Útiles",
          "canal": "Carlos Azaustre - AprendiendoDEV",
          "url": "https://www.youtube.com/watch?v=chWo9J7AoIs",
          "idioma": "es",
          "nota": "Cinco preguntas típicas a un junior y cómo responderlas."
        }
      ],
      "primer-trabajo/negocios-pequenos": [
        {
          "titulo": "Freelance vs Empleo como Programador",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=81VnO4puNkg",
          "idioma": "es",
          "nota": "Freelance o empleo: ventajas y riesgos de cada uno."
        }
      ],
      "primer-trabajo/cotizar": [
        {
          "titulo": "¿Cómo cobrar como programador Freelance?",
          "canal": "midulive",
          "url": "https://www.youtube.com/watch?v=_HiEIoCVLQY",
          "idioma": "es",
          "nota": "Cómo cobrar como programador freelance."
        }
      ],
      "primer-trabajo/ia-en-el-trabajo": [
        {
          "titulo": "La ventaja que la IA puede darte como programador junior",
          "canal": "MoureDev by Brais Moure",
          "url": "https://www.youtube.com/watch?v=Ex1x9EIPuo8",
          "idioma": "es",
          "nota": "Cómo puede aprovechar la IA un programador junior."
        }
      ]
    },
    videosDeLeccion,
    videosDeRuta,
    esUrlDeYouTube,
    analizarUrlDeYouTube,
  };
})();

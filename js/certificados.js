// certificados.js — La pantalla "Certificados gratis" (dirección #certificados).
//
// Reúne certificados gratuitos de los temas de la app: quién los da, qué piden,
// qué rutas de la app te preparan y qué temas todavía no cubre la app.
// Los datos se investigaron el 19 de noviembre de 2026. Solo se escribe lo que
// se pudo confirmar: si un dato (horas, nivel) no se conoce, no se pone.
// Todo el texto se pinta con textContent (a través de Mapa.crear).
// Las pruebas (pruebas/certificados.test.js) revisan que cada ruta enlazada
// exista, que cada URL sea https y que no haya ids repetidos.

(function () {
  'use strict';

  const VERIFICADO =
    'Verificado el 19 de noviembre de 2026. Las condiciones cambian: confirma en la página oficial antes de inscribirte.';

  // Los grupos en el orden en que se muestran.
  const GRUPOS = Object.freeze([
    { id: 'programacion', titulo: 'Programación y web' },
    { id: 'datos-ia', titulo: 'Datos e IA' },
    { id: 'bases', titulo: 'Bases de datos' },
    { id: 'seguridad', titulo: 'Seguridad' },
    { id: 'colombia', titulo: 'En Colombia' },
  ]);

  const NIVELES = Object.freeze({ cero: 'Desde cero', intermedio: 'Intermedio' });

  // Lo que comparten las certificaciones de freeCodeCamp: se escribe una vez
  // y cada una lo reutiliza.
  const URL_FCC = 'https://www.freecodecamp.org/learn';
  const PIDE_FCC = Object.freeze([
    'Construir proyectos',
    'Examen final en las certificaciones nuevas',
    'Válida 3 años',
    'En 2026 se renueva el currículo: algunas cambian de versión',
  ]);

  const fcc = (id, grupo, nombre, tema, nivel, rutas, faltan) =>
    Object.freeze({ id, grupo, entidad: 'freeCodeCamp', nombre, tema, nivel, pide: PIDE_FCC, url: URL_FCC, rutas, faltan });

  // Cada certificado: rutas = ids de rutas de la app que preparan para él;
  // faltan = ids de TEMAS_FALTANTES que pide y la app aún no enseña.
  const CERTIFICADOS = Object.freeze([
    // ---------- Programación y web ----------
    fcc('fcc-web', 'programacion', 'Responsive Web Design', 'HTML y CSS', 'cero', ['web'], []),
    fcc('fcc-js', 'programacion', 'JavaScript Algorithms and Data Structures', 'JavaScript y algoritmos', 'cero', ['javascript', 'fundamentos'], []),
    fcc('fcc-python', 'programacion', 'Scientific Computing with Python', 'Python', 'cero', ['python', 'fundamentos'], []),
    fcc('fcc-frontend', 'programacion', 'Front End Development Libraries', 'Interfaces con React', 'intermedio', ['web', 'javascript', 'react'], []),
    fcc('fcc-backend', 'programacion', 'Back End Development and APIs', 'Servidores y APIs', 'intermedio', ['javascript', 'oficio'], ['backend-api']),
    {
      id: 'cs50x',
      grupo: 'programacion',
      entidad: 'CS50 de Harvard',
      nombre: 'CS50x',
      tema: 'Introducción a la computación: C, Python, SQL y web',
      nivel: 'cero',
      pide: [
        'Registrarse en edX en modo gratuito',
        'Certificado de CS50 gratis; el verificado es pagado',
        'Está en inglés',
      ],
      url: 'https://cs50.harvard.edu',
      rutas: ['fundamentos', 'python', 'sql', 'web'],
      faltan: ['lenguaje-c'],
    },
    {
      id: 'cs50p',
      grupo: 'programacion',
      entidad: 'CS50 de Harvard',
      nombre: 'CS50P',
      tema: 'Python',
      nivel: 'cero',
      pide: [
        'Registrarse en edX en modo gratuito',
        'Certificado de CS50 gratis; el verificado es pagado',
        'Está en inglés',
      ],
      url: 'https://cs50.harvard.edu',
      rutas: ['python'],
      faltan: [],
    },
    {
      id: 'kaggle-python',
      grupo: 'programacion',
      entidad: 'Kaggle Learn',
      nombre: 'Python',
      tema: 'Python',
      nivel: 'cero',
      pide: ['Una cuenta de Kaggle', 'Curso corto: el certificado sale solo al completar los ejercicios'],
      url: 'https://www.kaggle.com/learn',
      rutas: ['python'],
      faltan: [],
    },
    {
      id: 'cisco-python',
      grupo: 'programacion',
      entidad: 'Cisco Networking Academy',
      nombre: 'Python Essentials 1',
      tema: 'Python, con el Python Institute',
      nivel: 'cero',
      pide: ['Unas 30 horas, a tu ritmo', 'Sin experiencia previa', 'Insignia digital (Credly)'],
      url: 'https://www.netacad.com',
      rutas: ['python'],
      faltan: [],
    },

    // ---------- Datos e IA ----------
    fcc('fcc-datos', 'datos-ia', 'Data Analysis with Python', 'Análisis de datos con NumPy y pandas', 'intermedio', ['python', 'datos', 'sql'], ['graficos']),
    fcc('fcc-ml', 'datos-ia', 'Machine Learning with Python', 'Aprendizaje automático', 'intermedio', ['python', 'datos', 'ml'], ['redes-neuronales']),
    {
      id: 'kaggle-pandas',
      grupo: 'datos-ia',
      entidad: 'Kaggle Learn',
      nombre: 'Pandas',
      tema: 'Tablas de datos con pandas',
      nivel: 'intermedio',
      pide: ['Una cuenta de Kaggle', 'Curso corto: el certificado sale solo al completar los ejercicios'],
      url: 'https://www.kaggle.com/learn',
      rutas: ['python', 'datos'],
      faltan: [],
    },
    {
      id: 'kaggle-ml',
      grupo: 'datos-ia',
      entidad: 'Kaggle Learn',
      nombre: 'Intro to Machine Learning',
      tema: 'Árboles de decisión, validación, sobreajuste y random forest',
      nivel: 'intermedio',
      pide: ['Unas 3 horas', 'Una cuenta de Kaggle', 'El certificado sale solo al completar los ejercicios'],
      url: 'https://www.kaggle.com/learn',
      rutas: ['python', 'datos', 'ml'],
      faltan: [],
    },
    {
      id: 'anthropic',
      grupo: 'datos-ia',
      entidad: 'Anthropic Academy',
      nombre: 'Claude Code in Action, la API de Claude y MCP',
      tema: 'Construir con Claude',
      nivel: 'intermedio',
      pide: ['Certificado de finalización', 'Algunos cursos piden saber programar'],
      url: 'https://anthropic.skilljar.com',
      rutas: ['ia', 'con-ia'],
      faltan: [],
    },
    {
      id: 'ibm-ia',
      grupo: 'datos-ia',
      entidad: 'IBM SkillsBuild',
      nombre: 'AI Fundamentals',
      tema: 'Fundamentos de inteligencia artificial',
      nivel: 'cero',
      pide: ['Insignia digital (Credly)'],
      url: 'https://skillsbuild.org',
      rutas: ['ia'],
      faltan: [],
    },
    {
      id: 'huggingface',
      grupo: 'datos-ia',
      entidad: 'Hugging Face',
      nombre: 'Curso de agentes',
      tema: 'Agentes de IA',
      nivel: 'intermedio',
      pide: ['Certificado gratuito al completar el curso'],
      url: 'https://huggingface.co/learn',
      rutas: ['ia', 'con-ia', 'python'],
      faltan: [],
    },
    {
      id: 'microsoft',
      grupo: 'datos-ia',
      entidad: 'Microsoft Applied Skills',
      nombre: 'Applied Skills',
      tema: 'Evaluaciones prácticas en Microsoft Learn',
      pide: ['Una evaluación práctica en un laboratorio', 'Gratuita'],
      url: 'https://learn.microsoft.com/credentials/applied-skills/',
      rutas: [],
      faltan: [],
    },

    // ---------- Bases de datos ----------
    fcc('fcc-bd', 'bases', 'Relational Database', 'PostgreSQL, Bash y Git', 'cero', ['sql', 'proyectos'], []),
    {
      id: 'kaggle-sql',
      grupo: 'bases',
      entidad: 'Kaggle Learn',
      nombre: 'Intro to SQL',
      tema: 'SQL con BigQuery',
      nivel: 'cero',
      pide: ['Una cuenta de Kaggle', 'Curso corto: el certificado sale solo al completar los ejercicios'],
      url: 'https://www.kaggle.com/learn',
      rutas: ['sql'],
      faltan: [],
    },
    {
      id: 'cs50-sql',
      grupo: 'bases',
      entidad: 'CS50 de Harvard',
      nombre: 'CS50 SQL',
      tema: 'Bases de datos',
      pide: [
        'Registrarse en edX en modo gratuito',
        'Certificado de CS50 gratis; el verificado es pagado',
        'Está en inglés',
      ],
      url: 'https://cs50.harvard.edu',
      rutas: ['sql'],
      faltan: [],
    },

    // ---------- Seguridad ----------
    fcc('fcc-seguridad', 'seguridad', 'Information Security', 'Seguridad de aplicaciones', 'intermedio', ['ciberseguridad', 'oficio', 'javascript'], ['backend-api']),
    {
      id: 'cisco-ciber',
      grupo: 'seguridad',
      entidad: 'Cisco Networking Academy',
      nombre: 'Introduction to Cybersecurity',
      tema: 'Ciberseguridad',
      nivel: 'cero',
      pide: ['Unas 15 horas, a tu ritmo', 'Examen final', 'Insignia digital (Credly)'],
      url: 'https://www.netacad.com',
      rutas: ['ciberseguridad', 'oficio'],
      faltan: [],
    },

    // ---------- En Colombia ----------
    {
      id: 'sena',
      grupo: 'colombia',
      entidad: 'SENA',
      nombre: 'Cursos virtuales complementarios',
      tema: 'Muchos temas, también programación',
      pide: [
        'Unas 40 horas por curso, con certificado',
        'Inscripción por Sofia Plus, que da acceso a la plataforma Betowa',
        'Los cupos se asignan por orden de inscripción y se agotan rápido',
      ],
      url: 'https://www.senasofiaplus.edu.co',
      rutas: ['python', 'web', 'sql'],
      faltan: [],
    },
    {
      id: 'talento-tech',
      grupo: 'colombia',
      entidad: 'MinTIC',
      nombre: 'Talento TECH',
      tema: 'IA, programación, ciberseguridad y analítica de datos',
      pide: [
        'Bootcamps y cursos con certificado',
        'Funciona por convocatorias: la última encontrada cerró a mediados de 2026, revisa si hay una nueva',
      ],
      url: 'https://talentotech.gov.co',
      rutas: ['python', 'ia', 'sql', 'datos', 'ciberseguridad', 'oficio'],
      faltan: [],
    },
    {
      id: 'avanzatec',
      grupo: 'colombia',
      entidad: 'MinTIC',
      nombre: 'AvanzaTEC',
      tema: 'IA, programación, ciberseguridad y analítica de datos',
      pide: [
        'Bootcamps y cursos con certificado',
        'Funciona por convocatorias: la última encontrada cerró a mediados de 2026, revisa si hay una nueva',
      ],
      url: 'https://avanzatec.gov.co',
      rutas: ['python', 'ia', 'sql', 'datos', 'ciberseguridad', 'oficio'],
      faltan: [],
    },
  ]);

  // Temas que piden los certificados y la app todavía no enseña. Era la lista
  // de trabajo de la fase 9: el 19 de noviembre de 2026 se cubrieron CSS Grid,
  // accesibilidad, React, PostgreSQL y Bash, pandas y NumPy, aprendizaje
  // automático, ciberseguridad y la API de Claude con MCP. Quedan estos.
  // "piden" son ids de CERTIFICADOS y "ruta" dice dónde se agregarían.
  const TEMAS_FALTANTES = Object.freeze([
    {
      id: 'backend-api',
      tema: 'Construir tu propio servidor y API',
      porque: 'La app enseña a usar y diseñar APIs; falta crear y publicar el servidor que las responde.',
      piden: ['fcc-backend', 'fcc-seguridad'],
      ruta: { existente: 'oficio' },
    },
    {
      id: 'lenguaje-c',
      tema: 'Lenguaje C y la memoria',
      porque: 'CS50x empieza con C antes de pasar a Python.',
      piden: ['cs50x'],
      ruta: { existente: 'fundamentos' },
    },
    {
      id: 'redes-neuronales',
      tema: 'Redes neuronales con TensorFlow',
      porque: 'La ruta de aprendizaje automático enseña árboles, bosques y regresión; los proyectos de freeCodeCamp piden además redes neuronales.',
      piden: ['fcc-ml'],
      ruta: { existente: 'ml' },
    },
    {
      id: 'graficos',
      tema: 'Gráficos con matplotlib y seaborn',
      porque: 'La ruta de datos enseña a resumir con pandas; los proyectos de freeCodeCamp piden además dibujar los resultados en gráficos.',
      piden: ['fcc-datos'],
      ruta: { existente: 'datos' },
    },
  ]);

  // Todos los ids de ruta que aparecen en esta pantalla (para las pruebas).
  function rutasUsadas() {
    const ids = new Set();
    CERTIFICADOS.forEach((c) => c.rutas.forEach((id) => ids.add(id)));
    TEMAS_FALTANTES.forEach((t) => t.ruta.existente && ids.add(t.ruta.existente));
    return [...ids];
  }

  // ---------- Pintado ----------

  const crear = (...args) => globalThis.Mapa.crear(...args);

  const temaPorId = (id) => TEMAS_FALTANTES.find((t) => t.id === id);
  const nombreCertificado = (id) => {
    const c = CERTIFICADOS.find((cert) => cert.id === id);
    return c ? c.entidad + ': ' + c.nombre : id;
  };

  function pintarCertificado(c) {
    const preparan =
      c.rutas.length > 0
        ? globalThis.Mapa.listaDeEnlaces(c.rutas)
        : crear('p', { clase: 'mapa__ejemplo', texto: 'Todavía ninguna ruta de la app prepara para este.' });
    const faltan =
      c.faltan.length > 0
        ? [
            crear('p', { clase: 'cert__etiqueta', texto: 'Pide y la app aún no tiene:' }),
            crear('ul', { clase: 'cert__lista', hijos: c.faltan.map((id) => crear('li', { texto: temaPorId(id).tema })) }),
          ]
        : [];
    return crear('li', {
      clase: 'mapa__tarjeta cert',
      hijos: [
        crear('p', { clase: 'cert__entidad', texto: c.entidad }),
        crear('h3', { texto: c.nombre }),
        crear('p', { texto: c.tema }),
        ...(c.nivel ? [crear('span', { clase: 'cert__nivel cert__nivel--' + c.nivel, texto: NIVELES[c.nivel] })] : []),
        crear('ul', { clase: 'cert__lista', hijos: c.pide.map((p) => crear('li', { texto: p })) }),
        crear('p', { clase: 'cert__etiqueta', texto: 'Te preparan en la app:' }),
        preparan,
        ...faltan,
        // noopener y noreferrer: la página nueva no puede controlar esta pestaña
        // ni saber desde dónde llegaste.
        crear('a', {
          clase: 'cert__oficial',
          texto: 'Página oficial ↗',
          atributos: { href: c.url, target: '_blank', rel: 'noopener noreferrer' },
        }),
      ],
    });
  }

  function pintarGrupo(grupo) {
    const idTitulo = 'cert-' + grupo.id;
    return crear('section', {
      clase: 'seccion',
      atributos: { 'aria-labelledby': idTitulo },
      hijos: [
        crear('h2', { clase: 'seccion__titulo', texto: grupo.titulo, atributos: { id: idTitulo } }),
        crear('ul', {
          clase: 'mapa__rejilla',
          hijos: CERTIFICADOS.filter((c) => c.grupo === grupo.id).map(pintarCertificado),
        }),
      ],
    });
  }

  function pintarFaltantes() {
    const ruta = (t) =>
      t.ruta.existente
        ? globalThis.Mapa.listaDeEnlaces([t.ruta.existente])
        : crear('p', { clase: 'mapa__ejemplo', texto: 'Ruta nueva: ' + t.ruta.nueva });
    return crear('section', {
      clase: 'seccion',
      atributos: { 'aria-labelledby': 'cert-faltantes' },
      hijos: [
        crear('h2', { clase: 'seccion__titulo', texto: 'Lo que vamos a agregar', atributos: { id: 'cert-faltantes' } }),
        crear('p', {
          clase: 'inicio__intro',
          texto: 'Temas que piden estos certificados y la app todavía no enseña. Se irán sumando como lecciones.',
        }),
        crear('ul', {
          clase: 'mapa__rejilla',
          hijos: TEMAS_FALTANTES.map((t) =>
            crear('li', {
              clase: 'mapa__tarjeta',
              hijos: [
                crear('h3', { texto: t.tema }),
                crear('p', { texto: t.porque }),
                crear('p', { clase: 'mapa__ejemplo', texto: 'Lo piden: ' + t.piden.map(nombreCertificado).join(', ') }),
                ruta(t),
              ],
            })
          ),
        }),
      ],
    });
  }

  // Pinta toda la pantalla dentro de "contenedor", reemplazando lo que tuviera.
  function pintar(contenedor) {
    const cabeza = crear('header', {
      clase: 'saludo',
      hijos: [
        crear('h1', { texto: 'Certificados gratis', atributos: { id: 'certificados-titulo', tabindex: '-1' } }),
        crear('p', {
          clase: 'inicio__resumen',
          texto: 'Certificados gratuitos de los temas de la app, y qué rutas te preparan para cada uno.',
        }),
        crear('p', { clase: 'mapa__aviso', texto: VERIFICADO }),
      ],
    });
    contenedor.replaceChildren(cabeza, ...GRUPOS.map(pintarGrupo), pintarFaltantes());
  }

  globalThis.Certificados = Object.freeze({ pintar, rutasUsadas, GRUPOS, NIVELES, CERTIFICADOS, TEMAS_FALTANTES });
})();

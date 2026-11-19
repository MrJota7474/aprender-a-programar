// catalogo.js — Las rutas que ofrece la app, en el orden en que se muestran.
//
// Una ruta sin lecciones (o sin motor registrado) aparece en el inicio como
// "Próximamente". Así el estudiante ve todo el camino desde el primer día.
// La "sigla" es el distintivo corto de la tarjeta; su color está en
// css/estilos.css (reglas [data-ruta='<id>']).

globalThis.Rutas.definirRuta({
  id: 'python',
  sigla: 'Py',
  titulo: 'Python',
  descripcion: 'El lenguaje más usado en inteligencia artificial y análisis de datos. Muy fácil de leer.',
  motor: 'python',
});

globalThis.Rutas.definirRuta({
  id: 'javascript',
  sigla: 'JS',
  titulo: 'JavaScript',
  descripcion: 'El lenguaje de las páginas web. Con él se construye lo que la gente ve y usa en internet.',
  motor: 'javascript',
});

globalThis.Rutas.definirRuta({
  id: 'sql',
  sigla: 'SQL',
  titulo: 'Bases de datos y SQL',
  descripcion: 'Guardar información en tablas y hacerle preguntas: consultar, filtrar y unir datos.',
  motor: 'sql',
});

globalThis.Rutas.definirRuta({
  id: 'ia',
  sigla: 'IA',
  titulo: 'Usar la inteligencia artificial',
  descripcion: 'Cómo funcionan los modelos, cómo pedirles bien las cosas y cómo usarlos desde tu código.',
  motor: 'python-ia',
});

// Va justo después de "ia" porque se apoya en ella (mensajes, herramientas).
// Usa el mismo motor: Python con los módulos "ia" y "agente".
globalThis.Rutas.definirRuta({
  id: 'con-ia',
  sigla: '>_',
  titulo: 'Programar con IA',
  descripcion: 'Cómo trabaja un agente como Claude: lee, cambia y prueba código con herramientas.',
  motor: 'python-ia',
});

// Las bases de computación de una carrera de Ingeniería de Sistemas, en Python.
globalThis.Rutas.definirRuta({
  id: 'fundamentos',
  sigla: '01',
  titulo: 'Fundamentos de computación',
  descripcion: 'Binario, lógica, algoritmos, recursión y estructuras de datos: las bases de Ingeniería de Sistemas.',
  motor: 'python',
});

globalThis.Rutas.definirRuta({
  id: 'web',
  sigla: '</>',
  titulo: 'Páginas web: HTML y CSS',
  descripcion: 'La estructura y el diseño de una página, para construir sitios completos.',
  motor: 'web',
});

globalThis.Rutas.definirRuta({
  id: 'proyectos',
  sigla: '★',
  titulo: 'Proyectos',
  descripcion: 'Proyectos que juntan varias rutas, como los que se hacen en un trabajo real.',
  motor: 'javascript',
});

// ---------- Fase 9: temas que piden los certificados gratuitos ----------

globalThis.Rutas.definirRuta({
  id: 'datos',
  sigla: 'pd',
  titulo: 'Análisis de datos con Python',
  descripcion: 'NumPy y pandas: cargar, limpiar, unir y resumir datos reales, como en Kaggle y freeCodeCamp.',
  motor: 'python-datos', // Worker con numpy y pandas desde que se abre la lección.
});

globalThis.Rutas.definirRuta({
  id: 'ml',
  sigla: 'ML',
  titulo: 'Aprendizaje automático',
  descripcion: 'Cómo aprende un modelo a partir de datos: árboles de decisión, validación y sobreajuste.',
  motor: 'python-datos',
});

globalThis.Rutas.definirRuta({
  id: 'react',
  sigla: '⚛',
  titulo: 'Interfaces con React',
  descripcion: 'Componentes, props y estado: la forma en que se arman hoy las páginas interactivas.',
  motor: 'javascript',
});

globalThis.Rutas.definirRuta({
  id: 'ciberseguridad',
  sigla: '🔒',
  titulo: 'Ciberseguridad básica',
  descripcion: 'Contraseñas, phishing, malware y cómo proteger a un negocio y a sus clientes.',
  motor: 'python',
});

// ---------- Fase 10: lo de la app, en tu propio computador ----------
// Va antes de "oficio": en un trabajo real se programa con herramientas
// instaladas (VS Code, Python, Node, la terminal, Git y GitHub), no en el
// navegador. Su motor es Python porque la mayoría de sus ejercicios lo son;
// los pasos de terminal declaran su propio motor.
globalThis.Rutas.definirRuta({
  id: 'tu-computador',
  sigla: 'PC',
  titulo: 'Programar en tu computador',
  descripcion: 'VS Code, la terminal, Python y Node instalados, Git y GitHub de verdad, Claude Code y tu página publicada.',
  motor: 'python',
});

// ---------- Fase 8: listo para trabajar ----------

globalThis.Rutas.definirRuta({
  id: 'oficio',
  sigla: '⚒',
  titulo: 'El oficio: trabajar en una empresa',
  descripcion: 'Lo que se hace en un trabajo real: código ajeno, errores, APIs, seguridad y datos de clientes.',
  motor: 'python',
});

globalThis.Rutas.definirRuta({
  id: 'proyectos-ia',
  sigla: '{ }',
  titulo: 'Entender proyectos hechos con IA',
  descripcion: 'Cómo está armado un proyecto real, qué son los frameworks y cómo dirigir a una IA para construirlo.',
  motor: 'python',
});

globalThis.Rutas.definirRuta({
  id: 'primer-trabajo',
  sigla: '✓',
  titulo: 'Tu primer trabajo',
  descripcion: 'Portafolio, entrevistas técnicas y cómo ofrecerle tus servicios a un negocio pequeño.',
  motor: 'python',
});

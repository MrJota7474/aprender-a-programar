// mapa.js — La pantalla "Mapa del oficio" (dirección #mapa).
//
// Explica cómo se conectan los lenguajes, qué se puede crear con ellos, los
// caminos de trabajo, el orden para quedar listo para trabajar y qué ve una carrera. Todo el contenido vive en las
// listas de abajo (texto fijo); pintar() lo convierte en elementos con
// textContent o con formatearTexto (que escapa el HTML).
// Cada enlace apunta a "#<id de ruta>": las pruebas revisan que existan.

(function () {
  'use strict';

  // El viaje de un pedido en la tienda de Don Pepe, de la pantalla a la base de datos.
  const VIAJE = Object.freeze([
    {
      ruta: 'web',
      lugar: 'El navegador',
      loQueHace:
        'Don Pepe abre la tienda en el celular. **HTML** pone la estructura, **CSS** el diseño y **JavaScript** el comportamiento.',
    },
    { enlace: 'fetch / HTTP', explica: 'JavaScript le manda el pedido al servidor con `fetch`.' },
    {
      ruta: 'python',
      lugar: 'El servidor',
      loQueHace: 'Un programa en **Python** recibe el pedido, revisa las reglas y decide qué hacer.',
    },
    { enlace: 'consulta', explica: 'El servidor le pregunta a la base de datos.' },
    {
      ruta: 'sql',
      lugar: 'La base de datos',
      loQueHace: '**SQL** guarda y busca clientes, productos y pedidos en tablas.',
    },
    { enlace: 'respuesta en JSON', explica: 'El servidor devuelve los datos como texto JSON.' },
    {
      ruta: 'javascript',
      lugar: 'De vuelta en la página',
      loQueHace: 'JavaScript lee el JSON y actualiza la pantalla sin recargarla.',
    },
  ]);

  const AL_LADO = Object.freeze([
    {
      ruta: 'proyectos',
      titulo: 'Git',
      texto: 'Guarda el historial de tu código: puedes volver atrás y trabajar en equipo.',
    },
    {
      ruta: 'ia',
      titulo: 'La IA es un servicio',
      texto:
        'Tu programa le habla por HTTP, como a cualquier otro servidor: le envía un mensaje y recibe una respuesta.',
    },
  ]);

  const CREACIONES = Object.freeze([
    {
      titulo: 'Páginas web',
      que: 'Páginas que se ven bien en celular y computador.',
      ejemplo: 'La página de un restaurante con su carta y su horario.',
      rutas: ['web', 'javascript'],
    },
    {
      titulo: 'Apps web completas',
      que: 'Página, servidor y base de datos trabajando juntos.',
      ejemplo: 'Una tienda en línea donde el cliente pide y el dueño ve los pedidos.',
      rutas: ['web', 'javascript', 'python', 'sql', 'proyectos'],
    },
    {
      titulo: 'Análisis de datos',
      que: 'Convertir miles de filas en respuestas claras.',
      ejemplo: 'Un tablero de ventas que muestra qué producto se vende más cada mes.',
      rutas: ['sql', 'python', 'datos', 'ml'],
    },
    {
      titulo: 'Automatizaciones',
      que: 'Programas pequeños que hacen el trabajo repetitivo.',
      ejemplo: 'Un script que lee las facturas del mes y arma el resumen.',
      rutas: ['python', 'proyectos'],
    },
    {
      titulo: 'Asistentes con IA',
      que: 'Programas que entienden texto y responden con un modelo de lenguaje.',
      ejemplo: 'Un bot que responde las preguntas de los clientes por WhatsApp.',
      rutas: ['ia', 'python', 'javascript'],
    },
    {
      titulo: 'Tu portafolio',
      que: 'Proyectos publicados que muestran lo que sabes hacer.',
      ejemplo: 'Una página con tus tres mejores proyectos y su código en Git.',
      rutas: ['proyectos', 'web'],
    },
  ]);

  const CAMINOS = Object.freeze([
    {
      titulo: 'Frontend',
      dia: 'Construye lo que el usuario ve y toca: pantallas, formularios, que todo funcione en el celular.',
      orden: ['web', 'javascript', 'react', 'proyectos'],
    },
    {
      titulo: 'Backend',
      dia: 'Construye lo que no se ve: las reglas del negocio, el servidor y los datos que guarda.',
      orden: ['python', 'sql', 'javascript', 'proyectos'],
    },
    {
      titulo: 'Datos',
      dia: 'Le hace preguntas a los datos y las responde con consultas, números y gráficos.',
      orden: ['sql', 'python', 'datos', 'ml', 'proyectos'],
    },
    {
      titulo: 'Inteligencia artificial',
      dia: 'Conecta modelos de lenguaje a productos reales y mide si responden bien.',
      orden: ['python', 'ia', 'con-ia', 'proyectos'],
    },
  ]);

  // Las rutas para salir a trabajar, en el orden en que conviene tomarlas. Van
  // después de las demás: se apoyan en Python, SQL, la web y los proyectos.
  // "tu-computador" (fase 10) va primero: las otras dan por hecho que ya
  // programas con tus propias herramientas instaladas.
  const LISTO = Object.freeze([
    {
      ruta: 'tu-computador',
      porque: 'Primero, tu propio equipo de trabajo: la terminal, Python y Node instalados, VS Code, Git y GitHub de verdad, Claude Code y tu primera página publicada.',
    },
    {
      ruta: 'oficio',
      porque: 'Después, el trabajo diario en una empresa: leer código ajeno, depurar, APIs, seguridad básica, datos de clientes y Git en equipo.',
    },
    {
      ruta: 'proyectos-ia',
      porque: 'Luego, cómo está armado un proyecto real (carpetas, frameworks, dependencias, publicarlo) y cómo dirigir a una IA para construirlo.',
    },
    {
      ruta: 'primer-trabajo',
      porque: 'Al final, mostrar lo que sabes: portafolio, GitHub, hoja de vida, entrevistas y cómo cotizarle a un negocio pequeño.',
    },
  ]);

  const ESTADOS = Object.freeze({
    ya: 'Ya está en la app',
    pronto: 'Próximamente',
    fuera: 'Fuera de la app',
  });

  // Áreas de una carrera de Ingeniería de Sistemas o Software en Colombia.
  const CARRERA = Object.freeze([
    { area: 'Programación básica', estado: 'ya', rutas: ['python', 'javascript'], nota: 'Variables, decisiones, bucles y funciones.' },
    { area: 'Programación orientada a objetos', estado: 'ya', rutas: ['python', 'javascript'], nota: 'Clases en Python y en JavaScript.' },
    { area: 'Estructuras de datos y algoritmos', estado: 'ya', rutas: ['fundamentos'], nota: 'Binario, lógica, recursión, pilas, colas, tablas hash, ordenamiento, árboles y grafos.' },
    { area: 'Bases de datos', estado: 'ya', rutas: ['sql'], nota: 'Consultas, uniones, tablas y claves; PostgreSQL y la terminal con Bash.' },
    { area: 'Desarrollo web', estado: 'ya', rutas: ['web', 'javascript', 'react'], nota: 'HTML, CSS con Grid y diseño adaptable, accesibilidad, JavaScript, fetch y React.' },
    {
      area: 'Ingeniería de software',
      estado: 'ya',
      rutas: ['proyectos', 'oficio', 'proyectos-ia'],
      nota: 'Git en equipo, leer y depurar código ajeno, diseñar APIs y la estructura de un proyecto real. Falta trabajar meses en equipo sobre un sistema grande.',
    },
    {
      area: 'Requisitos y gestión de proyectos',
      estado: 'ya',
      rutas: ['oficio', 'primer-trabajo'],
      nota: 'Del pedido del cliente a tareas, estimar, cotizar y acordar el alcance.',
    },
    {
      area: 'Seguridad informática',
      estado: 'ya',
      rutas: ['ciberseguridad', 'oficio'],
      nota: 'Lo básico: la tríada CIA, contraseñas, phishing, malware, dos factores y HTTPS; y en el código, inyección SQL, XSS y secretos. La especialidad va mucho más allá.',
    },
    { area: 'Redes', estado: 'fuera', rutas: [], nota: 'Aquí solo conocerás lo básico de HTTP y HTTPS, los dominios, el wifi público y cómo una página llega a internet.' },
    { area: 'Sistemas operativos', estado: 'fuera', rutas: [], nota: 'Procesos, memoria y archivos.' },
    { area: 'Matemáticas: discretas, cálculo, álgebra lineal y probabilidad', estado: 'fuera', rutas: [], nota: 'Base de la IA y de los algoritmos. Se estudian en la universidad.' },
    { area: 'Inteligencia artificial', estado: 'ya', rutas: ['ia', 'datos', 'ml'], nota: 'Usar modelos de lenguaje con la API de Claude y MCP, analizar datos y entrenar modelos clásicos (árboles, bosques, regresión). Las redes neuronales exigen más matemáticas.' },
    { area: 'Programar con IA', estado: 'ya', rutas: ['con-ia'], nota: 'Cómo trabaja un agente como Claude: herramientas, pruebas y revisión.' },
  ]);

  const AVISO_CARRERA =
    'Esta app te da bases y práctica. No reemplaza una carrera: allí también aprendes teoría, matemáticas y trabajo en equipo.';

  // Todos los ids de ruta que aparecen en el mapa (las pruebas los comparan con el catálogo).
  function rutasUsadas() {
    const ids = new Set();
    VIAJE.forEach((paso) => paso.ruta && ids.add(paso.ruta));
    AL_LADO.forEach((item) => ids.add(item.ruta));
    CREACIONES.forEach((c) => c.rutas.forEach((id) => ids.add(id)));
    CAMINOS.forEach((c) => c.orden.forEach((id) => ids.add(id)));
    LISTO.forEach((paso) => ids.add(paso.ruta));
    CARRERA.forEach((c) => c.rutas.forEach((id) => ids.add(id)));
    return [...ids];
  }

  // ---------- Pintado ----------

  function crear(etiqueta, opciones) {
    const { clase, texto, html, hijos, atributos } = opciones || {};
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    if (html !== undefined) nodo.innerHTML = html; // solo de formatearTexto, que escapa todo
    Object.entries(atributos || {}).forEach(([nombre, valor]) => nodo.setAttribute(nombre, valor));
    (hijos || []).forEach((hijo) => nodo.append(hijo));
    return nodo;
  }

  const conFormato = (clase, texto, etiqueta) =>
    crear(etiqueta || 'p', { clase, html: globalThis.formatearTexto(texto) });

  function tituloDeRuta(id) {
    const ruta = globalThis.Rutas.buscar(id);
    return ruta ? ruta.titulo : id;
  }

  // Un enlace a una ruta, con el color de la ruta (data-ruta).
  function enlaceRuta(id) {
    return crear('a', {
      clase: 'mapa__ruta',
      texto: tituloDeRuta(id),
      atributos: { href: '#' + id, 'data-ruta': id },
    });
  }

  function listaDeEnlaces(ids) {
    return crear('p', { clase: 'mapa__rutas', hijos: ids.map(enlaceRuta) });
  }

  function pintarNodo(paso) {
    const icono = crear('span', { clase: 'icono-ruta', atributos: { 'aria-hidden': 'true' } });
    icono.innerHTML = globalThis.Iconos.deRuta(paso.ruta); // dibujos fijos de iconos.js
    return crear('li', {
      clase: 'viaje__nodo',
      atributos: { 'data-ruta': paso.ruta },
      hijos: [
        icono,
        crear('div', {
          hijos: [
            crear('a', { clase: 'viaje__lugar', texto: paso.lugar, atributos: { href: '#' + paso.ruta } }),
            conFormato('viaje__texto', paso.loQueHace),
          ],
        }),
      ],
    });
  }

  function pintarFlecha(paso) {
    return crear('li', {
      clase: 'viaje__flecha',
      hijos: [
        crear('span', { clase: 'viaje__flecha-simbolo', texto: '↓', atributos: { 'aria-hidden': 'true' } }),
        crear('strong', { texto: paso.enlace }),
        conFormato('viaje__texto', paso.explica, 'span'),
      ],
    });
  }

  function pintarViaje() {
    const lista = crear('ol', {
      clase: 'viaje',
      atributos: { 'aria-label': 'El viaje de un pedido, paso a paso' },
      hijos: VIAJE.map((paso) => (paso.ruta ? pintarNodo(paso) : pintarFlecha(paso))),
    });
    const lado = crear('div', {
      clase: 'mapa__lado',
      hijos: AL_LADO.map((item) =>
        crear('div', {
          clase: 'mapa__nota',
          hijos: [crear('h3', { texto: item.titulo }), crear('p', { texto: item.texto }), enlaceRuta(item.ruta)],
        })
      ),
    });
    return crear('div', { clase: 'mapa__diagrama', hijos: [lista, lado] });
  }

  function pintarCreaciones() {
    return crear('ul', {
      clase: 'mapa__rejilla',
      hijos: CREACIONES.map((c) =>
        crear('li', {
          clase: 'mapa__tarjeta',
          hijos: [
            crear('h3', { texto: c.titulo }),
            crear('p', { texto: c.que }),
            crear('p', { clase: 'mapa__ejemplo', texto: 'En Colombia: ' + c.ejemplo }),
            listaDeEnlaces(c.rutas),
          ],
        })
      ),
    });
  }

  function pintarCaminos() {
    return crear('ul', {
      clase: 'mapa__rejilla',
      hijos: CAMINOS.map((c) =>
        crear('li', {
          clase: 'mapa__tarjeta',
          hijos: [
            crear('h3', { texto: c.titulo }),
            crear('p', { texto: c.dia }),
            crear('p', { clase: 'mapa__ejemplo', texto: 'Orden en la app:' }),
            crear('ol', {
              clase: 'mapa__orden',
              hijos: c.orden.map((id) => crear('li', { hijos: [enlaceRuta(id)] })),
            }),
          ],
        })
      ),
    });
  }

  // Una tarjeta por ruta, numeradas: el orden importa, por eso es una <ol>.
  function pintarListo() {
    return crear('ol', {
      clase: 'mapa__rejilla',
      hijos: LISTO.map((paso, posicion) =>
        crear('li', {
          clase: 'mapa__tarjeta mapa__tarjeta--paso',
          atributos: { 'data-ruta': paso.ruta },
          hijos: [
            crear('h3', { texto: 'Paso ' + (posicion + 1) }),
            crear('p', { texto: paso.porque }),
            listaDeEnlaces([paso.ruta]),
          ],
        })
      ),
    });
  }

  function pintarCarrera() {
    const lista = crear('ul', {
      clase: 'carrera',
      hijos: CARRERA.map((a) =>
        crear('li', {
          clase: 'carrera__area carrera__area--' + a.estado,
          hijos: [
            crear('div', {
              hijos: [
                crear('h3', { texto: a.area }),
                crear('p', { texto: a.nota }),
                ...(a.rutas.length > 0 ? [listaDeEnlaces(a.rutas)] : []),
              ],
            }),
            crear('span', { clase: 'carrera__estado', texto: ESTADOS[a.estado] }),
          ],
        })
      ),
    });
    return crear('div', { hijos: [crear('p', { clase: 'mapa__aviso', texto: AVISO_CARRERA }), lista] });
  }

  const SECCIONES = Object.freeze([
    ['mapa-conecta', 'Cómo se conectan las piezas', 'Sigue un pedido en la tienda de Don Pepe, de la pantalla a la base de datos y de vuelta.', pintarViaje],
    ['mapa-crear', 'Qué puedes crear', 'Cada tarjeta dice qué rutas de la app te enseñan lo que necesitas.', pintarCreaciones],
    ['mapa-caminos', 'Caminos de trabajo', 'No tienes que elegir hoy. Estos son los oficios y el orden que te sirve en cada uno.', pintarCaminos],
    [
      'mapa-listo',
      'Listo para trabajar',
      'Cuando termines el camino que elegiste, toma estas cuatro rutas en este orden: te llevan del código al primer trabajo.',
      pintarListo,
    ],
    ['mapa-carrera', 'Lo que ve una carrera', 'Ingeniería de Sistemas o de Software en Colombia, por áreas.', pintarCarrera],
  ]);

  // Pinta toda la pantalla dentro de "contenedor", reemplazando lo que tuviera.
  function pintar(contenedor) {
    const cabeza = crear('header', {
      clase: 'saludo',
      hijos: [
        crear('h1', { texto: 'Mapa del oficio', atributos: { id: 'mapa-titulo', tabindex: '-1' } }),
        crear('p', {
          clase: 'inicio__resumen',
          texto: '¿Cómo se conecta todo? Aquí ves cómo se relacionan los lenguajes y para qué sirven.',
        }),
      ],
    });
    const secciones = SECCIONES.map(([id, titulo, intro, pintarCuerpo]) =>
      crear('section', {
        clase: 'seccion',
        atributos: { 'aria-labelledby': id },
        hijos: [
          crear('h2', { clase: 'seccion__titulo', texto: titulo, atributos: { id } }),
          crear('p', { clase: 'inicio__intro', texto: intro }),
          pintarCuerpo(),
        ],
      })
    );
    contenedor.replaceChildren(cabeza, ...secciones);
  }

  // crear y listaDeEnlaces también los usa js/certificados.js: así las dos
  // pantallas pintan las tarjetas y los enlaces a rutas de la misma forma.
  globalThis.Mapa = Object.freeze({ pintar, rutasUsadas, crear, listaDeEnlaces, ESTADOS, CARRERA, LISTO });
})();

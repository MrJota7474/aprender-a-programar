# Plan: de "curso de JavaScript" a "varias rutas de aprendizaje"

Meta: aprender varios lenguajes y lo que más se usa hoy (Python, bases de datos,
uso de la inteligencia artificial, web), con el mismo formato en todas las rutas:
pasos cortos (Idea → Práctica → Reto), editor en la página, pruebas automáticas,
pistas y progreso guardado.

## Fases

- [x] **Fase 0 — Base multi-curso** (terminada el 15 de noviembre de 2026)
  - [x] Pantalla de inicio con las rutas
  - [x] Progreso guardado por ruta (sin perder lo ya hecho)
  - [x] Un "motor" intercambiable por lenguaje
  - [x] Las 10 lecciones de JavaScript funcionando dentro de la ruta JavaScript (hoy son 20)
- [x] **Fase 1 — Python** (terminada el 15 de noviembre de 2026)
  - [x] Motor con Pyodide 314.0.8 (Python 3.14 dentro del navegador), guardado en `vendor/pyodide/`
  - [x] Ruta desde cero: 12 lecciones, 36 pasos (de `print` a listas de diccionarios y JSON)
  - [x] Servidor local con un clic (`iniciar.bat`)
  - [x] Mejora de diseño: editor con colores, sangría automática, inicio y tarjetas nuevos
- [x] **Fase 2 — Bases de datos y SQL** (terminada el 15 de noviembre de 2026)
  - [x] Motor con sql.js 1.16.0 (SQLite dentro del navegador), guardado en `vendor/sqljs/`
  - [x] Base de datos de ejemplo "tienda" (productos, clientes, pedidos) visible junto al editor
  - [x] Ruta desde cero: 12 lecciones, 36 pasos (de `SELECT` a `JOIN`, `GROUP BY` y crear tablas)
  - [x] Resultados mostrados como tablas y colores de SQL en el editor
- [ ] **Fase 3 — Usar la inteligencia artificial**
  - [x] Parte A, sin clave (terminada el 16 de noviembre de 2026): 10 lecciones, 30 pasos, con un
    modelo simulado (módulo `ia` de Python). Cubre cómo predice un modelo, tokens y costo,
    mensajes y roles, instrucciones claras, ejemplos, respuestas en JSON, alucinaciones y
    contexto, memoria de la conversación, herramientas, reintentos y evaluación.
  - [ ] Parte B (opcional, con clave de API): llamar a un modelo real desde un programa local.
- [x] **Fase 4 — Web completa** (terminada el 16 de noviembre de 2026)
  - [x] JavaScript: lecciones 11 (métodos de arreglos) y 12 (datos y JSON)
  - [x] Ruta "Páginas web: HTML y CSS": 10 lecciones, 30 pasos, con vista previa en un iframe aislado.
    Motor propio que lee HTML y CSS sin librerías y simula la página para la lección de JavaScript.
  - [x] Rediseño "cuaderno de taller": letra con serifa para leer, bordes finos sin sombras,
    índice de rutas tipo libro y puntos de avance por lección
  - [x] Equipo de agentes: Opus planifica y hace de experto, Sonnet (programador), Haiku (revisor)
- [x] **Fase 5 — Proyectos integradores** (terminada el 17 de noviembre de 2026)
  - [x] Cada paso de una lección puede usar su propio motor y su propia etiqueta de pestaña
  - [x] Motor "terminal": Git simulado (init, status, add, commit, log, diff, ramas, merge) en español
  - [x] Ruta "Proyectos": 4 proyectos — Guardar tu trabajo con Git; El catálogo de la tienda
    (SQL → HTML/CSS → JavaScript); El asistente de reseñas (IA → SQL); Tu portafolio (HTML, CSS y JS)
- [x] **Fase 6 — Nivel intermedio** (terminada el 18 de noviembre de 2026; el estudiante eligió más contenido gratis antes que la IA real)
  - [x] Python 13 a 17: errores, clases y objetos, comprensiones, funciones avanzadas, repaso
  - [x] JavaScript 13 a 17: desestructuración y spread, clases, errores, reduce y ordenar, repaso
  - [x] SQL 13 a 17: LEFT JOIN y NULL, subconsultas, CASE y funciones, vistas y claves foráneas, repaso
  - [x] JavaScript 18 a 20: async/await, fetch y repaso async (motor con espera de promesas y fetch simulado)

- [x] **Fase 7 — El panorama completo** (terminada el 18 de noviembre de 2026, con revisión profunda y sus 10 arreglos; pedida para entender cómo se conecta
  todo, qué se puede crear, cómo programa una IA como Claude y las bases que pide una carrera)
  - [x] Parte A — Mapa del oficio (hecha el 18 de noviembre de 2026, en `#mapa`): pantalla nueva con cómo se conectan las piezas (HTML/CSS/JS,
    fetch y HTTP, Python en el servidor, SQL, Git, la IA como servicio), qué se puede crear con
    cada una, caminos de trabajo (frontend, backend, datos, IA) y qué ve una carrera de Ingeniería
    de Sistemas o Software, marcando qué cubre ya la app y qué no.
  - [x] Parte B — Programar con IA (hecha el 18 de noviembre de 2026, ruta `con-ia`, 10 lecciones) (cómo trabaja Claude): qué es un agente (pensar → usar una
    herramienta → observar), sus herramientas (leer, editar, correr pruebas), armar un mini agente,
    pedir código bien, revisar código generado, pruebas como red de seguridad, contexto (CLAUDE.md),
    y el caso real de cómo se construyó esta misma app.
    - [x] Módulo `agente` (agente simulado) y lecciones 1 a 3 (qué es un agente, herramientas, el ciclo)
    - [x] Lecciones 4 a 10 (pedir código, revisar, pruebas, contexto, errores del agente, el caso
      real de esta app, uso responsable)
  - [x] Parte C — Fundamentos de computación (hecha el 18 de noviembre de 2026, ruta `fundamentos`, 10 lecciones): binario, lógica,
    algoritmos de búsqueda, cuánto tarda un algoritmo, recursión, pilas y colas, tablas hash,
    ordenamiento, árboles y grafos.
  - [x] Parte D — Proyecto completo de punta a punta (hecha el 18 de noviembre de 2026, proyecto `tienda-completa`): base de datos (SQL) → lógica (Python) →
    página (HTML/CSS/JS con fetch) → con un asistente de IA.

- [x] **Fase 8 — Listo para trabajar** (terminada el 18 de noviembre de 2026, con revisión profunda y sus 10 arreglos; pedida el 18 de noviembre de 2026: poder entrar a trabajar en
  una empresa pequeña y entender los proyectos que el estudiante crea con IA. Por pedido del
  estudiante, esta fase la hace solo Opus: el `experto`, sin `programador`)
  - [x] Ruta "El oficio": leer código ajeno, depurar con errores reales, diseñar una API REST,
    seguridad básica (inyección SQL, XSS, contraseñas, secretos), datos de clientes (CSV/Excel),
    Git en equipo (ramas, pull requests), de pedido del cliente a tareas, y estimar.
  - [x] Ruta "Entender proyectos hechos con IA": estructura de un proyecto real (carpetas,
    package.json, requirements.txt, .env), qué son los frameworks (React, Express, Django/Flask),
    dependencias, cómo una página llega a internet (hosting, dominio, despliegue), dirigir a una IA
    para construir y cambiar un proyecto, y revisar lo que hace.
  - [x] Ruta "Tu primer trabajo": qué buscan en un junior, portafolio y GitHub, hoja de vida,
    entrevista técnica (ejercicios típicos), trabajos para negocios pequeños en Colombia, cotizar y
    acordar con un cliente, y un plan para seguir aprendiendo.

- [x] **Fase 9 — Todo conectado y certificable** (terminada el 19 de noviembre de 2026, con revisión profunda y sus arreglos; pedida el 19 de noviembre de 2026; solo Opus, ahorrando uso)
  - [x] Puentes entre lecciones (hechos el 19 de noviembre de 2026, `rutas/puentes.js`): cada lección dice de dónde viene, para qué sirve en la vida real
    y qué sigue; cada ruta abre con "qué vas a lograr". Explicaciones para quien empieza de cero.
  - [x] Panel de certificados gratuitos (`#certificados`): freeCodeCamp, Kaggle Learn, CS50 de Harvard,
    Cisco Networking Academy, Anthropic Academy, IBM SkillsBuild, Microsoft Applied Skills,
    Hugging Face, y en Colombia SENA (Sofia Plus/Betowa) y MinTIC (Talento TECH, AvanzaTEC). Cada uno
    con qué rutas de la app preparan para él. Verificado el 19 de noviembre de 2026: las condiciones
    cambian, por eso cada tarjeta enlaza a la página oficial.
  - [x] Lecciones para los temas que piden esos certificados y la app aún no cubre (hechas el 19 de noviembre de 2026):
    web +3 (Grid, diseño adaptable, accesibilidad), SQL +2 (PostgreSQL, Bash), IA +3 (API de Mensajes, tool use, MCP)
    y cuatro rutas nuevas: Análisis de datos (10, numpy y pandas), Aprendizaje automático (8), React (6) y Ciberseguridad (7).
    Siguen faltando: crear tu propio servidor y API, C y la memoria (CS50x) y redes neuronales (freeCodeCamp ML).

- [x] **Fase 10 — Programar en tu computador** (hecha el 19 de noviembre de 2026; pedida ese mismo día:
  todo lo de la app pasa en el navegador y en un trabajo real se usan herramientas instaladas)
  - [x] Ruta `tu-computador` (8 lecciones), primer paso de "Listo para trabajar", antes de El oficio:
    las herramientas, la terminal de Windows y el PATH, instalar Python y Node, VS Code, entornos y
    dependencias (venv, pip, npm), Git y GitHub de verdad (.gitignore, push, credenciales),
    Claude Code en tu proyecto y el proyecto final: tu página publicada con GitHub Pages.
    Lo que solo se hace en el PC va como "Hazlo en tu computador"; los ejercicios usan Python y la terminal simulada.
- [x] **Fase 11 — Gran mejora** (hecha el 19 de noviembre de 2026, solo Opus, con revisión profunda y sus 12 arreglos)
  - [x] Pantalla de lección rediseñada: dos columnas desde 1100 px, conmutador "Lección | Código" en
    pantallas chicas, puentes plegables, ayuda clara al fallar, "Siguiente paso" con Enter,
    confirmación antes de ver la solución, atajos visibles y estados de carga.
  - [x] Glosario interactivo (141 términos) y errores explicados en español (Python ~45, JS, SQL).
  - [x] Python, SQL, JavaScript y web reescritas para principiantes: ejemplo antes de la regla,
    "Error común" con el mensaje real, código inicial con TODO, pistas de menos a más y trampas cerradas.
  - [x] Listas y saltos de línea en el texto de las lecciones; arreglo de la vista previa en blanco.

## Decisiones tomadas

- Orden: fase 0 → Python → SQL → IA → Web → Proyectos. Python va antes que IA
  porque la ruta de IA se apoya en él.
- Se aceptan librerías descargadas (Pyodide, sql.js) guardadas dentro de la carpeta,
  para que siga funcionando sin internet.
- Desde la fase 1 el proyecto se abre con un servidor local (esas librerías no
  cargan con doble clic en `index.html`). Se arranca con doble clic en `iniciar.bat`.
- Python va de primero en el inicio, porque es la base de las rutas de datos e IA.

## Cómo se agrega una ruta nueva

1. Definirla en `rutas/catalogo.js` (id, título, descripción, motor).
2. Registrar su motor con `Motores.registrar(...)`. Todo motor recibe código y
   pruebas, y devuelve `{ salida, error, resultados }`.
3. Crear sus lecciones en `rutas/<id>/` con `Rutas.agregarLeccion('<id>', { ... })`.
4. Agregar sus `<script>` en `index.html` y correr las pruebas.

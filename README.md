# Aprender a programar

App interactiva en español con varias rutas de aprendizaje. Todas usan el mismo
formato: pasos cortos (Idea → Práctica → Reto), editor en la página, pruebas
automáticas, pistas y progreso guardado en el navegador.

**Úsala en línea:** https://mrjota7474.github.io/aprender-a-programar/ (publicada con GitHub Pages;
funciona en el celular y no necesita instalar nada).

Rutas disponibles hoy:

- **Python** — 17 lecciones, 51 pasos.
- **JavaScript** — 20 lecciones, 60 pasos.
- **Bases de datos y SQL** — 17 lecciones, 51 pasos.
- **Usar la inteligencia artificial** — 10 lecciones, 30 pasos (con un modelo simulado).
- **Páginas web: HTML y CSS** — 10 lecciones, 30 pasos (con vista previa de la página).

- **Proyectos** — 4 proyectos que juntan varias rutas: Git, una tienda con base de datos y página, un asistente de reseñas con IA y tu portafolio.
El camino completo está en [PLAN.md](PLAN.md).

## Cómo abrirlo

Haz doble clic en **`iniciar.bat`**. Se abre una ventana negra (el servidor local) y
luego el navegador con la app. Para apagarla, cierra esa ventana. No necesita internet;
solo necesita tener Python instalado en el computador.

Si abres `index.html` directamente con doble clic, la ruta de JavaScript funciona pero
las de Python, SQL e inteligencia artificial no: los navegadores solo dejan cargar esos motores desde un servidor.

## Cómo está organizado

| Archivo | Qué hace |
| --- | --- |
| `iniciar.bat`, `servidor.py` | Arrancan el servidor local y abren el navegador. |
| `index.html` | Las dos vistas (inicio y curso) y el orden en que se cargan los scripts. |
| `css/estilos.css` | Colores, tema claro/oscuro y diseño para computador y celular. |
| `js/rutas.js` | Registro de rutas de aprendizaje y sus lecciones. |
| `js/motores.js` | Registro de motores: lo que sabe ejecutar cada lenguaje. |
| `js/evaluador.js`, `js/ejecutor.js` | Motor de JavaScript (Web Worker con límite de 3 s); espera await, promesas y setTimeout (hasta 2 s). |
| `js/api-tienda.js` | `fetch` simulado: la API de la tienda de Don Pepe (sin internet, mismos datos que la base de SQL). |
| `js/python-evaluador.js` | El evaluador de Python, escrito en Python. |
| `js/python-trabajador.js` | Web Worker que carga Pyodide y ejecuta el evaluador. |
| `js/motor-python.js` | Motor de Python (límite de 5 s) y errores explicados en español. |
| `js/sql-evaluador.js` | El evaluador de SQL: crea la base, corre la consulta y revisa las pruebas. |
| `js/sql-trabajador.js` | Web Worker que carga SQLite (sql.js) y ejecuta el evaluador. |
| `js/motor-sql.js` | Motor de SQL y errores de SQLite explicados en español. |
| `js/trabajadores.js` | Manejo de Workers compartido por los motores de Python, SQL y web. |
| `js/web-analizador.js` | Lee el HTML del estudiante (estricto, con errores en español) y entiende selectores de CSS. |
| `js/web-estilos.js` | Lee el CSS: reglas, colores, herencia y cuál regla gana. |
| `js/web-evaluador.js` | El evaluador de la ruta web: revisa las pruebas y prepara la vista previa. |
| `js/web-trabajador.js`, `js/motor-web.js` | Web Worker (límite de 3 s) y motor de la ruta web. |
| `js/terminal-evaluador.js` | Terminal con Git simulado (init, add, commit, log, ramas, merge) y las ayudas de sus pruebas. |
| `js/motor-terminal.js` | Motor de la terminal: corre el simulador sin Worker y explica sus errores con la línea. |
| `js/resaltado.js` | Colores del código en el editor. |
| `js/progreso.js` | Guarda y carga el avance de cada ruta en `localStorage`, los días de actividad, la racha, los puntos y el nivel. |
| `js/logros.js` | Calcula los logros (primer paso, rachas, rutas terminadas, primer commit…). |
| `js/iconos.js` | Íconos dibujados en SVG: uno por ruta, más racha, puntos, logros, candado y check. |
| `js/formato.js` | Texto de lecciones a HTML seguro; errores de JavaScript en español. |
| `js/app.js` | La interfaz: une todo lo anterior. |
| `rutas/catalogo.js` | La lista de rutas (sigla, título, descripción, motor). |
| `rutas/<ruta>/*.js` | Un archivo por lección (solo datos). |
| `rutas/sql/00-base-tienda.js` | La base de datos de ejemplo de la ruta de SQL. |
| `rutas/ia/00-modulo-ia.js` | El modelo de lenguaje simulado de la ruta de IA (módulo `ia`, en Python). |
| `rutas/con-ia/00-modulo-agente.js` | El agente de código simulado de la ruta "Programar con IA" (módulo `agente`, en Python). |
| `rutas/proyectos-ia/00-modulo-proyecto.js` | El proyecto de ejemplo "Domicilios Don Pepe" (React + Flask simulado) de la ruta "Entender proyectos hechos con IA" (módulo `proyecto`, en Python). Pasa de 800 líneas porque trae los archivos del proyecto. |
| `js/etapas.js` | El camino del inicio: las rutas en cinco etapas (único lugar con ese orden) y la regla de "Sigue por aquí". |
| `js/mapa.js` | La pantalla "Mapa del oficio" (`#mapa`): cómo se conectan las piezas, qué crear y qué ve una carrera. |
| `rutas/react/00-mini-react.js` | La mini versión de React de la ruta "Interfaces con React": copia los nombres de la API (createElement, props, useState, key) y se pega al comienzo del código de cada paso. No es una lección. |
| `vendor/pyodide/`, `vendor/sqljs/` | Python y SQLite para el navegador (librerías descargadas; no se editan). `vendor/pyodide/` trae además los paquetes de numpy y pandas (con python_dateutil, pytz y six) para la ruta de análisis de datos; se cargan sin internet en un Worker aparte, solo cuando el código los importa (ver `vendor/pyodide/LEEME.txt`). |
| `pruebas/*.test.js` | Pruebas automáticas del proyecto. |

## Cómo agregar una lección

1. Copia un archivo de `rutas/python/` o `rutas/javascript/` y cámbiale el nombre
   (por ejemplo `13-mi-tema.js`).
2. Cambia el `id`, el `titulo` y los `pasos`. Un paso sin `pruebas` es un ejemplo para
   leer y ejecutar; un paso con `pruebas` es un ejercicio y necesita `pistas` y `solucion`.
3. Cada prueba es una expresión **en el lenguaje de la ruta** que debe dar verdadero
   (`true` en JavaScript, `True` en Python). Puede usar las variables y funciones del
   estudiante, `salida` (lista de líneas que mostró) y `codigo` (el texto que escribió,
   sin comentarios). En Python también están `mostrado(valor)` (verdadero si ese valor
   aparece en alguna línea de la consola) y el módulo `re`.
   En la ruta de SQL las pruebas se escriben en JavaScript; lo que pueden usar está
   explicado al comienzo de `rutas/sql/01-hola-sql.js`.
4. Opcional, para proyectos que mezclan lenguajes: un paso puede traer
   `motor: 'sql'` (o `'web'`, `'python'`…) y entonces se ejecuta con ese motor en vez
   del de la ruta; sus `pruebas` se escriben en el lenguaje de **ese** motor. También
   puede traer `etiqueta: 'Base de datos'`, el texto de su pestaña (si no la trae, sale
   del id: `idea`, `practica` y `reto` dicen Idea, Práctica y Reto; los demás, "Paso N").
   La ruta sigue diciendo "Próximamente" hasta que existan todos los motores que usan sus pasos.
5. Agrega la etiqueta `<script>` de la lección nueva en `index.html`.
6. Corre las pruebas: avisan si olvidaste el paso 4 o si la solución no pasa.

## Cómo agregar una ruta

1. Defínela en `rutas/catalogo.js` con `Rutas.definirRuta({ id, sigla, titulo, descripcion, motor })`
   y dale un color a su sigla en `css/estilos.css` (clase `.sigla--<id>`).
2. Si usa un lenguaje nuevo, registra su motor con `Motores.registrar(id, { ... })`.
   El contrato está explicado al comienzo de `js/motores.js`.
3. Crea la carpeta `rutas/<id>/` con sus lecciones, que se registran con
   `Rutas.agregarLeccion('<id>', { ... })`.
4. Agrega los `<script>` en `index.html`. La ruta deja de decir "Próximamente" cuando
   tiene lecciones y existen su motor y los que declaren sus pasos (`paso.motor`).
5. Agrega el evaluador del motor en `pruebas/lecciones.test.js` para que sus
   soluciones se comprueben solas.

## Cómo correr las pruebas

Necesitas Node.js 20 o superior. Tardan unos segundos porque cargan Python:

```bash
node --test "pruebas/*.test.js"
```

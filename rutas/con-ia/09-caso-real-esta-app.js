// Ruta "Programar con IA", lección 9. Los datos del texto son reales: salen de
// PLAN.md, CLAUDE.md, README.md y de la carpeta .claude/agents de este mismo
// proyecto. Mismo formato que la lección 1.
//
// Las pruebas del ordenamiento necesitan comprobar que una función LANZA un
// error. En una condición de una sola línea no cabe un try/except, así que se
// arma un trozo de Python con exec (igual que en rutas/python/13-errores.js).
globalThis.Rutas.agregarLeccion(
  'con-ia',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = str(e)\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    // Las tareas de una fase, escritas a propósito en desorden.
    const tareas = [
      'TAREAS = {',
      '    "revisión profunda de la fase": {"depende_de": ["agregar los script en index.html"], "dificultad": "dificil", "tamano": "corto"},',
      '    "agregar los script en index.html": {"depende_de": ["escribir las lecciones 1 a 3", "escribir las lecciones 4 a 10"], "dificultad": "rutina", "tamano": "corto"},',
      '    "escribir las lecciones 4 a 10": {"depende_de": ["escribir el módulo agente"], "dificultad": "rutina", "tamano": "largo"},',
      '    "escribir el módulo agente": {"depende_de": ["leer PLAN.md"], "dificultad": "dificil", "tamano": "largo"},',
      '    "escribir las lecciones 1 a 3": {"depende_de": ["escribir el módulo agente"], "dificultad": "rutina", "tamano": "largo"},',
      '    "leer PLAN.md": {"depende_de": [], "dificultad": "rutina", "tamano": "corto"},',
      '}',
    ];

    const ordenar = [
      'def ordenar(tareas):',
      '    orden = []',
      '    pendientes = list(tareas)',
      '    while pendientes:',
      '        listas = [t for t in pendientes if all(d in orden for d in tareas[t]["depende_de"])]',
      '        if not listas:',
      '            raise ValueError("Hay tareas que dependen unas de otras en círculo: " + ", ".join(pendientes))',
      '        orden = orden + [listas[0]]',
      '        pendientes = [t for t in pendientes if t != listas[0]]',
      '    return orden',
    ];

    return {
      id: 'caso-real-esta-app',
      titulo: 'El caso real: cómo se construyó esta app',
      pasos: [
        {
          id: 'idea',
          titulo: 'Así trabajó Claude Code en esta página',
          texto: [
            'La página que estás usando no la escribió una sola persona, ni una IA de un solo golpe. Se construyó con Claude Code, un agente como el que armaste, trabajando con un método. Estos son los datos reales de este proyecto.',
            '**Un plan por fases.** El archivo `PLAN.md` divide el trabajo: fase 0 (la base con varias rutas), Python, SQL, IA, web, proyectos, nivel intermedio y el panorama completo. Cada fase tiene casillas que se marcan al terminar. Un agente no recuerda lo de ayer; el plan escrito sí.',
            '**Reglas del proyecto.** El archivo `CLAUDE.md` le dice al agente cómo trabajar aquí: sin frameworks, scripts clásicos, nombres y comentarios en español, y el texto del estudiante siempre con `textContent`. Claude Code lo lee al empezar: es su "contexto fijo".',
            '**Un equipo de agentes.** Opus planifica, reparte tareas y verifica en el navegador. Un `programador` (Sonnet) escribe el código de rutina, como lecciones que siguen un formato. Un `experto` (Opus) toma lo más difícil, como los motores de ejecución. Al principio también había un `revisor` (Haiku) que revisaba cada cambio, pero aportaba poco y gastaba uso: ahora Opus corre las pruebas él mismo y el experto hace una revisión profunda solo al cerrar cada fase. Medir qué sirve y ajustar el equipo también es parte del oficio.',
            '**Pruebas automáticas.** Hay más de mil. Comprueban que cada lección tenga su forma, que el código inicial no pase y que la solución sí. Son la red de seguridad de un agente: el agente cambia algo y las pruebas dicen si se dañó otra cosa.',
            '**Motores por lenguaje.** Cada lenguaje tiene su "motor": JavaScript, Python, Python con IA, SQL, web y terminal. Todos cumplen el mismo contrato (reciben código y pruebas y devuelven la salida), así que la página trata igual a todos.',
            '**Un Web Worker.** Si escribes `while True:` o un bucle infinito, la página se congelaría. Por eso el código del estudiante corre en un Web Worker, un hilo aparte que corre en paralelo a la página, con un límite de tiempo (3 s en JavaScript, 5 s en Python). Si se pasa, la página lo apaga y te avisa.',
            'Corre el ejemplo para ver todo en una tabla.',
          ],
          codigo: [
            'piezas = [',
            '    ("PLAN.md", "las fases y sus casillas", "el agente no recuerda: el plan escrito sí"),',
            '    ("CLAUDE.md", "las reglas del proyecto", "cada sesión empieza sabiendo cómo trabajar aquí"),',
            '    ("programador (Sonnet)", "código de rutina", "rápido y barato para lo que ya tiene formato"),',
            '    ("experto (Opus)", "lo más difícil", "los motores y los fallos raros necesitan más razonamiento"),',
            '    ("revisor (Haiku)", "en reserva", "revisaba cada cambio, pero aportaba poco: se ajustó el equipo"),',
            '    ("pruebas automáticas", "más de mil", "avisan al instante si algo se dañó"),',
            '    ("motores por lenguaje", "JavaScript, Python, SQL, web...", "un contrato igual para todos"),',
            '    ("Web Worker", "ejecuta el código aparte", "un bucle infinito no congela la página"),',
            ']',
            '',
            'for nombre, que_es, por_que in piezas:',
            '    print(nombre + " -> " + que_es)',
            '    print("    porque: " + por_que)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Ordenar las tareas de una fase',
          texto: [
            'Antes de repartir el trabajo, Opus tiene que decidir en qué orden se hace. Escribir las lecciones antes de tener el módulo `agente` no tiene sentido: dependen de él. Eso es una **dependencia**: una tarea que no puede empezar hasta que otra termine.',
            'Aquí está una fase pequeña (la parte B de la fase 7), escrita en desorden a propósito. Cada tarea dice de qué depende, qué tan difícil es y qué tan larga es.',
            'Crea la función `ordenar(tareas)`: devuelve una lista con los nombres de las tareas, de modo que cada una aparezca **después** de todas aquellas de las que depende. Una forma: repite "elige una tarea cuyas dependencias ya están en el orden" hasta que no queden pendientes. Si en algún momento no hay ninguna lista para hacerse, hay dependencias en círculo (A espera a B y B espera a A): lanza un `ValueError` con un mensaje.',
          ],
          codigo: [
            ...tareas,
            '',
            '',
            'def ordenar(tareas):',
            '    # Devuelve los nombres de las tareas, cada una después de las que necesita',
            '    return []',
            '',
            '',
            'print(ordenar(TAREAS))',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Incluye todas las tareas, sin repetir ni inventar',
              condicion: 'sorted(ordenar(TAREAS)) == sorted(TAREAS)',
            },
            {
              descripcion: 'Cada tarea aparece después de las que necesita',
              condicion: 'len(ordenar(TAREAS)) == 6 and all(ordenar(TAREAS).index(d) < ordenar(TAREAS).index(t) for t in TAREAS for d in TAREAS[t]["depende_de"])',
            },
            {
              descripcion: 'Empieza leyendo el plan y termina con la revisión profunda',
              condicion: 'ordenar(TAREAS)[:1] == ["leer PLAN.md"] and ordenar(TAREAS)[-1:] == ["revisión profunda de la fase"]',
            },
            {
              descripcion: 'Una tarea sin dependencias queda sola',
              condicion: 'ordenar({"a": {"depende_de": []}}) == ["a"]',
            },
            {
              descripcion: 'Si dos tareas se esperan entre sí, lanza un ValueError',
              condicion: lanzaValueError('ordenar({"a": {"depende_de": ["b"]}, "b": {"depende_de": ["a"]}})'),
            },
          ],
          pistas: [
            'Lleva dos listas: `orden = []` (las ya ordenadas) y `pendientes = list(tareas)` (las que faltan). Repite con `while pendientes:`',
            'Una tarea está lista si todas sus dependencias ya están en `orden`: `[t for t in pendientes if all(d in orden for d in tareas[t]["depende_de"])]`',
            'Si esa lista queda vacía, haz `raise ValueError(...)`. Si no, pasa la primera a `orden` (`orden = orden + [listas[0]]`) y quítala de `pendientes`.',
          ],
          solucion: [
            ...tareas,
            '',
            '',
            ...ordenar,
            '',
            '',
            'print(ordenar(TAREAS))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: repartir el trabajo',
          texto: [
            'Ya hay orden. Falta decidir **quién** hace cada tarea, y por qué. En este proyecto la regla es simple, y se aplica en este orden:',
            '1. Si la tarea es **difícil**, va al `experto` (necesita más razonamiento).',
            '2. Si no, y es **corta**, la hace el `planificador` (Opus): delegar algo tan corto cuesta más de lo que ahorra.',
            '3. Si no (rutina y larga), va al `programador`: ahorra tiempo y plata.',
            'Crea `asignar(tarea)`, que recibe el diccionario de una tarea y devuelve `{"quien": ..., "porque": ...}`, con un `porque` escrito en palabras (no vacío). Después crea `plan(tareas)`: una lista, en el orden correcto, de diccionarios `{"tarea": nombre, "quien": ..., "porque": ...}`. Ya tienes `ordenar` escrita.',
            'Fíjate en una tarea corta **y** difícil, como la revisión profunda: el orden de las reglas decide quién la hace. Un buen plan explica sus decisiones, igual que un buen agente explica su pensamiento.',
          ],
          codigo: [
            ...tareas,
            '',
            '',
            ...ordenar,
            '',
            '',
            '# Crea aquí las funciones asignar y plan',
            '',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Lo difícil va al experto',
              condicion: 'asignar({"dificultad": "dificil", "tamano": "largo"})["quien"] == "experto"',
            },
            {
              descripcion: 'Lo difícil va al experto aunque sea corto (esa regla va primero)',
              condicion: 'asignar({"dificultad": "dificil", "tamano": "corto"})["quien"] == "experto"',
            },
            {
              descripcion: 'Lo corto de rutina lo hace quien planifica',
              condicion: 'asignar({"dificultad": "rutina", "tamano": "corto"})["quien"] == "planificador"',
            },
            {
              descripcion: 'Lo largo y de rutina va al programador',
              condicion: 'asignar({"dificultad": "rutina", "tamano": "largo"})["quien"] == "programador"',
            },
            {
              descripcion: 'Cada decisión trae su porqué, escrito en palabras',
              condicion: 'all(isinstance(asignar(t)["porque"], str) and len(asignar(t)["porque"]) > 10 for t in TAREAS.values())',
            },
            {
              descripcion: 'El plan sigue el orden de las dependencias',
              condicion: '[paso["tarea"] for paso in plan(TAREAS)] == ordenar(TAREAS)',
            },
            {
              descripcion: 'El plan reparte bien cada tarea de la fase',
              condicion: '{paso["tarea"]: paso["quien"] for paso in plan(TAREAS)} == {"leer PLAN.md": "planificador", "escribir el módulo agente": "experto", "escribir las lecciones 1 a 3": "programador", "escribir las lecciones 4 a 10": "programador", "agregar los script en index.html": "planificador", "revisión profunda de la fase": "experto"}',
            },
            {
              descripcion: 'Cada paso del plan explica su porqué',
              condicion: 'all(len(paso["porque"]) > 10 for paso in plan(TAREAS))',
            },
          ],
          pistas: [
            'En `asignar`, mira primero `tarea["dificultad"] == "dificil"`: devuelve `{"quien": "experto", "porque": "..."}`. Luego `tarea["tamano"] == "corto"` y, al final, el caso restante.',
            'El porqué es un texto corto que explique la regla, por ejemplo: `"Es difícil: necesita más razonamiento"`.',
            'En `plan`: `[{"tarea": nombre, **asignar(tareas[nombre])} for nombre in ordenar(tareas)]`. El `**` copia las claves `quien` y `porque` dentro del diccionario nuevo.',
          ],
          solucion: [
            ...tareas,
            '',
            '',
            ...ordenar,
            '',
            '',
            'def asignar(tarea):',
            '    if tarea["dificultad"] == "dificil":',
            '        return {"quien": "experto", "porque": "Es difícil: necesita más razonamiento"}',
            '    if tarea["tamano"] == "corto":',
            '        return {"quien": "planificador", "porque": "Es corta: delegarla cuesta más de lo que ahorra"}',
            '    return {"quien": "programador", "porque": "Es larga y de rutina: ahorra tiempo y plata"}',
            '',
            '',
            'def plan(tareas):',
            '    return [{"tarea": nombre, **asignar(tareas[nombre])} for nombre in ordenar(tareas)]',
            '',
            '',
            'for paso in plan(TAREAS):',
            '    print(paso["tarea"] + " -> " + paso["quien"] + " (" + paso["porque"] + ")")',
          ].join('\n'),
        },
      ],
    };
  })()
);

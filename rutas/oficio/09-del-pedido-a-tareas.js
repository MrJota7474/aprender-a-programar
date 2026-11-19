// Ruta "El oficio", lección 9: del pedido del cliente a tareas y estimaciones.
//
// Es una lección "de oficio" más que de código, pero se practica con código:
// un plan de trabajo es una estructura de datos (una lista de tareas, cada
// una un diccionario) y revisarlo, ordenarlo y estimarlo son funciones.
// El orden de trabajo es un orden topológico (fundamentos: grafos), escrito
// con la regla más simple que da siempre el mismo resultado.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  const lanzaValueError = (llamada) =>
    comprobar(['try:', '    ' + llamada, '    ok = False', 'except ValueError:', '    ok = True', 'except Exception:', '    ok = False']);

  // El plan de los domicilios, a propósito en desorden: así el orden de
  // trabajo no sale igual a la lista.
  const PLAN = [
    'PLAN = [',
    '    {"id": "T6", "nombre": "Probar con Don Pepe y publicar", "minimo": 2, "maximo": 4,',
    '     "criterios": ["Don Pepe hace un pedido de prueba de punta a punta"], "depende_de": ["T3", "T4", "T5"]},',
    '    {"id": "T3", "nombre": "Formulario de pedido en la página", "minimo": 4, "maximo": 6,',
    '     "criterios": ["Rechaza un celular inválido con un mensaje claro", "Muestra el total con el domicilio"], "depende_de": ["T2"]},',
    '    {"id": "T2", "nombre": "API: crear pedido y cobrar domicilio por barrio", "minimo": 4, "maximo": 8,',
    '     "criterios": ["POST /pedidos responde 201", "Un barrio sin cobertura responde 400"], "depende_de": ["T1"]},',
    '    {"id": "T5", "nombre": "Pantalla de pedidos del día para Don Pepe", "minimo": 4, "maximo": 8,',
    '     "criterios": ["Lista los pedidos de hoy, el más viejo primero"], "depende_de": ["T1"]},',
    '    {"id": "T1", "nombre": "Tablas de pedidos y barrios en la base de datos", "minimo": 2, "maximo": 4,',
    '     "criterios": ["Guarda un pedido con su barrio y su costo de domicilio"], "depende_de": []},',
    '    {"id": "T4", "nombre": "Aviso por WhatsApp a la tienda cuando llega un pedido", "minimo": 3, "maximo": 8,',
    '     "criterios": ["El celular de la tienda recibe el pedido en menos de un minuto"], "depende_de": ["T2"]},',
    ']',
  ];

  // ---------- Práctica ----------

  const PLAN_CON_PROBLEMAS = [
    'PLAN = [',
    '    {"id": "T1", "nombre": "Tablas de pedidos y barrios", "minimo": 2, "maximo": 4,',
    '     "criterios": ["Guarda un pedido con su barrio"]},',
    '    {"id": "T2", "nombre": "Toda la parte de la API", "minimo": 8, "maximo": 16,',
    '     "criterios": ["POST /pedidos responde 201"]},',
    '    {"id": "T3", "nombre": "Formulario de pedido", "minimo": 4, "maximo": 6,',
    '     "criterios": []},',
    '    {"id": "T4", "nombre": "Aviso por WhatsApp", "minimo": 6, "maximo": 3,',
    '     "criterios": ["Llega el mensaje a la tienda"]},',
    '    {"id": "T5", "nombre": "Pantalla de pedidos", "minimo": 4, "maximo": 8,',
    '     "criterios": ["Lista los pedidos de hoy", "Que funcione bien"]},',
    ']',
  ];

  const REVISAR_INICIAL = [
    'MAXIMO_HORAS_TAREA = 8',
    'CRITERIOS_VAGOS = {"que funcione bien", "que se vea bonito", "que sea rápido", "que quede bien"}',
    '',
    '',
    'def revisar_tareas(tareas):',
    '    problemas = []',
    '    # Revisa cada tarea y agrega aquí sus problemas',
    '    return problemas',
  ];
  const REVISAR = [
    'MAXIMO_HORAS_TAREA = 8',
    'CRITERIOS_VAGOS = {"que funcione bien", "que se vea bonito", "que sea rápido", "que quede bien"}',
    '',
    '',
    'def revisar_tareas(tareas):',
    '    problemas = []',
    '    for tarea in tareas:',
    '        id = tarea["id"]',
    '        if not tarea["criterios"]:',
    '            problemas.append(id + ": no tiene criterios de terminado")',
    '        for criterio in tarea["criterios"]:',
    '            if criterio.strip().lower() in CRITERIOS_VAGOS:',
    '                problemas.append(id + \': el criterio "\' + criterio + \'" no se puede comprobar\')',
    '        if tarea["minimo"] > tarea["maximo"]:',
    '            problemas.append(id + ": el rango es imposible (el mínimo es mayor que el máximo)")',
    '        if tarea["maximo"] > MAXIMO_HORAS_TAREA:',
    '            problemas.append(id + ": es muy grande, divídela")',
    '    return problemas',
  ];

  const practica = (revisar) =>
    [...PLAN_CON_PROBLEMAS, '', '', ...revisar, '', '', 'for problema in revisar_tareas(PLAN):', '    print(problema)'].join('\n');

  const tarea = (id, minimo, maximo, criterios) =>
    `{"id": "${id}", "nombre": "x", "minimo": ${minimo}, "maximo": ${maximo}, "criterios": ${criterios}}`;

  // ---------- Reto ----------

  const RETO_INICIAL = [
    'def estimar(tareas, horas_por_dia=6):',
    '    return {"horas": (0, 0), "dias": (0, 0)}',
    '',
    '',
    'def orden_de_trabajo(tareas):',
    '    return [tarea["id"] for tarea in tareas]',
  ];
  const RETO = [
    'import math',
    '',
    '',
    'def estimar(tareas, horas_por_dia=6):',
    '    minimo = sum(tarea["minimo"] for tarea in tareas)',
    '    maximo = sum(tarea["maximo"] for tarea in tareas)',
    '    # Un día empezado es un día: se redondea hacia arriba',
    '    dias = (math.ceil(minimo / horas_por_dia), math.ceil(maximo / horas_por_dia))',
    '    return {"horas": (minimo, maximo), "dias": dias}',
    '',
    '',
    'def orden_de_trabajo(tareas):',
    '    ids = {tarea["id"] for tarea in tareas}',
    '    for tarea in tareas:',
    '        for requisito in tarea["depende_de"]:',
    '            if requisito not in ids:',
    '                raise ValueError(tarea["id"] + " depende de " + requisito + ", que no existe")',
    '    hechas = []',
    '    while len(hechas) < len(tareas):',
    '        # La primera de la lista que ya se puede hacer',
    '        disponibles = [',
    '            tarea for tarea in tareas',
    '            if tarea["id"] not in hechas and all(r in hechas for r in tarea["depende_de"])',
    '        ]',
    '        if not disponibles:',
    '            raise ValueError("Hay dependencias en círculo: ninguna tarea puede empezar")',
    '        hechas = hechas + [disponibles[0]["id"]]',
    '    return hechas',
  ];

  const reto = (cuerpo) =>
    [
      ...PLAN,
      '',
      '',
      ...cuerpo,
      '',
      '',
      'print("Orden:", orden_de_trabajo(PLAN))',
      'print("Estimación:", estimar(PLAN))',
    ].join('\n');

  const conDependencias = (id, deps) => `{"id": "${id}", "minimo": 1, "maximo": 2, "depende_de": ${deps}}`;

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'del-pedido-a-tareas',
    titulo: 'Del pedido del cliente a tareas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Lo que el cliente pide y lo que de verdad necesita',
        texto: [
          'Don Pepe te dice: *"Quiero que mis clientes puedan pedir domicilios por la página"*. Parece una sola cosa, pero adentro hay muchas decisiones que él todavía no ha tomado. Antes de escribir una línea de código, **pregunta**: ¿a qué barrios llegan y cuánto cuesta cada uno? ¿Cómo pagan? ¿Quién recibe el pedido en la tienda y cómo se entera? ¿En qué horario? Cada respuesta se vuelve un **requisito**: algo concreto que el sistema debe poder hacer.',
          'Después, divide el trabajo en **tareas pequeñas**: ninguna de más de un día (unas 8 horas). Si no puedes estimar una tarea en menos de un día, todavía no la entiendes bien: divídela. Cada tarea lleva **criterios de terminado** que se puedan comprobar con un sí o un no: *"un barrio sin cobertura responde 400"* sirve; *"que funcione bien"* no le sirve a nadie.',
          'Y **estima con rangos honestos**: para cada tarea, cuánto tardarías si todo sale bien y cuánto si se complica. Al cliente se le da un rango ("entre 4 y 7 días"), nunca un solo número que después no se cumple. Casi todos los que empiezan se quedan cortos: cuenta las pruebas, las correcciones y el tiempo de hablar con el cliente. Y di qué queda **por fuera**: "el pago con tarjeta va en una segunda etapa" evita discusiones después.',
          'Ejecuta el ejemplo: es el plan de los domicilios convertido en datos.',
        ],
        codigo: [
          ...PLAN,
          '',
          'PREGUNTAS = [',
          '    "¿A qué barrios llegan y cuánto cuesta el domicilio a cada uno?",',
          '    "¿Cómo pagan: efectivo al recibir o transferencia?",',
          '    "¿Quién recibe el pedido en la tienda y cómo se entera?",',
          ']',
          'FUERA_DEL_ALCANCE = ["Pago con tarjeta (segunda etapa)", "App para el domiciliario"]',
          '',
          'print("Antes de empezar, preguntarle a Don Pepe:")',
          'for pregunta in PREGUNTAS:',
          '    print("  -", pregunta)',
          'print()',
          'for tarea in sorted(PLAN, key=lambda t: t["id"]):',
          '    print(tarea["id"], tarea["nombre"], "(" + str(tarea["minimo"]) + " a " + str(tarea["maximo"]) + " horas)")',
          '    for criterio in tarea["criterios"]:',
          '        print("     terminado si:", criterio)',
          'print()',
          'minimo = sum(t["minimo"] for t in PLAN)',
          'maximo = sum(t["maximo"] for t in PLAN)',
          'print("Total: entre", minimo, "y", maximo, "horas de trabajo")',
          'print("Por fuera de esta etapa:", ", ".join(FUERA_DEL_ALCANCE))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Revisar un plan antes de mostrarlo',
        texto: [
          'Un compañero armó un plan rápido y te pide que lo revises antes de mandárselo al cliente. Escribe `revisar_tareas(tareas)`, que devuelve la **lista de problemas** encontrados, recorriendo las tareas en orden y, dentro de cada una, revisando en este orden:',
          '**1.** Sin criterios: `"T3: no tiene criterios de terminado"`. **2.** Cada criterio vago (está en `CRITERIOS_VAGOS` sin importar mayúsculas ni espacios a los lados): `\'T5: el criterio "Que funcione bien" no se puede comprobar\'`, con el criterio tal como venía. **3.** Mínimo mayor que el máximo: `"T4: el rango es imposible (el mínimo es mayor que el máximo)"`. **4.** Máximo de más de `MAXIMO_HORAS_TAREA`: `"T2: es muy grande, divídela"`.',
          'Una tarea puede tener varios problemas a la vez. Un plan sano devuelve una lista vacía.',
        ],
        codigo: practica(REVISAR_INICIAL),
        pruebas: [
          {
            descripcion: 'Encuentra los cuatro problemas del plan, en orden',
            condicion:
              'revisar_tareas(PLAN) == ["T2: es muy grande, divídela", "T3: no tiene criterios de terminado", "T4: el rango es imposible (el mínimo es mayor que el máximo)", \'T5: el criterio "Que funcione bien" no se puede comprobar\']',
          },
          { descripcion: 'Un plan sano no tiene problemas', condicion: `revisar_tareas([${tarea('A', 1, 8, '["Responde 200"]')}]) == [] and revisar_tareas([]) == []` },
          {
            descripcion: 'Reconoce los criterios vagos aunque cambien mayúsculas o espacios',
            condicion: `revisar_tareas([${tarea('A', 1, 2, '["  QUE SE VEA BONITO ", "Responde 200"]')}]) == ['A: el criterio "  QUE SE VEA BONITO " no se puede comprobar']`,
          },
          {
            descripcion: 'Una tarea con varios problemas los muestra todos, en el orden pedido',
            condicion: `revisar_tareas([${tarea('B', 12, 10, '[]')}]) == ["B: no tiene criterios de terminado", "B: el rango es imposible (el mínimo es mayor que el máximo)", "B: es muy grande, divídela"]`,
          },
          {
            descripcion: 'Usa la constante MAXIMO_HORAS_TAREA (si cambia la regla, cambia la revisión)',
            condicion: comprobar([
              'g2 = revisar_tareas.__globals__',
              'antes = g2["MAXIMO_HORAS_TAREA"]',
              'g2["MAXIMO_HORAS_TAREA"] = 4',
              'try:',
              `    ok = revisar_tareas([${tarea('C', 1, 6, '["Responde 200"]')}]) == ["C: es muy grande, divídela"]`,
              'finally:',
              '    g2["MAXIMO_HORAS_TAREA"] = antes',
            ]),
          },
        ],
        pistas: [
          'Recorre con `for tarea in tareas:` y guarda `id = tarea["id"]`. El primer caso: `if not tarea["criterios"]: problemas.append(id + ": no tiene criterios de terminado")`.',
          'Para los vagos, otro `for criterio in tarea["criterios"]:` con `if criterio.strip().lower() in CRITERIOS_VAGOS:`. El mensaje lleva comillas dobles adentro: arma el texto con comillas simples, `id + \': el criterio "\' + criterio + \'" no se puede comprobar\'`.',
          'Los dos últimos son `if` independientes (no `elif`), para que se vean todos los problemas: `if tarea["minimo"] > tarea["maximo"]:` y `if tarea["maximo"] > MAXIMO_HORAS_TAREA:`.',
        ],
        solucion: practica(REVISAR),
      },
      {
        id: 'reto',
        titulo: 'Reto: en qué orden y cuánto tiempo',
        texto: [
          'El plan de los domicilios ya está sano. Faltan dos respuestas para Don Pepe: cuánto se demora y por dónde empezar.',
          '**1.** `estimar(tareas, horas_por_dia=6)` devuelve `{"horas": (mínimo, máximo), "dias": (mínimo, máximo)}`: las horas son las sumas de los mínimos y de los máximos, y los días se redondean **hacia arriba** (`math.ceil`), porque un día empezado es un día. ¿Por qué 6 horas y no 8? Porque nadie programa 8 horas seguidas: hay reuniones, correos y preguntas.',
          '**2.** `orden_de_trabajo(tareas)` devuelve los ids en un orden en que cada tarea va **después** de las que necesita (`depende_de`). La regla: cada vez, toma **la primera tarea de la lista** que todavía no está hecha y cuyas dependencias ya estén hechas. Si una tarea depende de un id que no existe, o si ninguna puede empezar porque se esperan en círculo (A espera a B y B espera a A), lanza `ValueError`. No modifiques la lista que recibes.',
        ],
        codigo: reto(RETO_INICIAL),
        pruebas: [
          { descripcion: 'Estima el plan: entre 19 y 38 horas, entre 4 y 7 días', condicion: 'estimar(PLAN) == {"horas": (19, 38), "dias": (4, 7)}' },
          {
            descripcion: 'Los días se redondean hacia arriba y respetan horas_por_dia',
            condicion: 'estimar(PLAN, 8) == {"horas": (19, 38), "dias": (3, 5)} and estimar([{"minimo": 1, "maximo": 7}], 6)["dias"] == (1, 2) and estimar([]) == {"horas": (0, 0), "dias": (0, 0)}',
          },
          { descripcion: 'Ordena el plan: T1, T2, T3, T5, T4, T6', condicion: 'orden_de_trabajo(PLAN) == ["T1", "T2", "T3", "T5", "T4", "T6"]' },
          {
            descripcion: 'Cada tarea va después de las que necesita (con otro plan)',
            condicion: `(lambda plan: (lambda orden: sorted(orden) == ["A", "B", "C", "D"] and all(orden.index(d) < orden.index(t["id"]) for t in plan for d in t["depende_de"]))(orden_de_trabajo(plan)))([${conDependencias('D', '["B", "C"]')}, ${conDependencias('C', '["A"]')}, ${conDependencias('B', '["A"]')}, ${conDependencias('A', '[]')}])`,
          },
          { descripcion: 'Sin dependencias, conserva el orden de la lista', condicion: `orden_de_trabajo([${conDependencias('X', '[]')}, ${conDependencias('Y', '[]')}]) == ["X", "Y"] and orden_de_trabajo([]) == []` },
          {
            descripcion: 'Dependencias en círculo o a una tarea que no existe lanzan ValueError',
            condicion:
              lanzaValueError(`orden_de_trabajo([${conDependencias('A', '["B"]')}, ${conDependencias('B', '["A"]')}])`) +
              ' and ' +
              lanzaValueError(`orden_de_trabajo([${conDependencias('A', '["Z"]')}])`),
          },
          { descripcion: 'No modifica la lista que recibe', condicion: comprobar(['import copy', 'copia = copy.deepcopy(PLAN)', 'orden_de_trabajo(PLAN)', 'estimar(PLAN)', 'ok = PLAN == copia']) },
        ],
        pistas: [
          'En `estimar`: `minimo = sum(t["minimo"] for t in tareas)`, igual con el máximo, y los días con `math.ceil(minimo / horas_por_dia)` (pon `import math` arriba).',
          'En `orden_de_trabajo`, primero revisa que cada id de `depende_de` exista (un conjunto con `{t["id"] for t in tareas}` ayuda). Luego lleva una lista `hechas = []` y repite `while len(hechas) < len(tareas):`.',
          'En cada vuelta, busca las que se pueden hacer: `[t for t in tareas if t["id"] not in hechas and all(d in hechas for d in t["depende_de"])]`. Si la lista está vacía, `raise ValueError(...)`; si no, agrega a `hechas` el id de la primera.',
        ],
        solucion: reto(RETO),
      },
    ],
  });
})();

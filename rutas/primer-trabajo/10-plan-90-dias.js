// Ruta "Tu primer trabajo", lección 10 (cierre de la ruta): un plan de 90 días
// para seguir aprendiendo. El reto es un planificador que reparte metas en
// semanas con un tope de horas: el estudiante termina la app con un programa
// que le sirve para organizar lo que sigue.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = True\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    const METAS = [
      '# Tus metas y las horas que crees que necesita cada una',
      'metas = [',
      '    ("Git y GitHub de verdad", 8),',
      '    ("Publicar el portafolio", 6),',
      '    ("Un framework", 20),',
      '    ("Base de datos real", 10),',
      ']',
      'SEMANAS_EN_90_DIAS = 13',
    ];

    const PLAN_ESPERADO =
      '[[("Git y GitHub de verdad", 8), ("Publicar el portafolio", 2)], ' +
      '[("Publicar el portafolio", 4), ("Un framework", 6)], ' +
      '[("Un framework", 10)], ' +
      '[("Un framework", 4), ("Base de datos real", 6)], ' +
      '[("Base de datos real", 4)]]';

    return {
      id: 'plan-90-dias',
      titulo: 'Tu plan de 90 días',
      pasos: [
        {
          id: 'idea',
          titulo: 'Qué sigue después de la app',
          texto: [
            'Terminaste las rutas: tienes bases que mucha gente no tiene al empezar. Lo que sigue es cerrar los huecos que viste en la lección 1, en unos **90 días** (unas 13 semanas), mientras ya te postulas. No esperes a «estar listo» para buscar: postularte también se aprende.',
            '**Qué estudiar, en este orden**: **1. Git y GitHub de verdad**, en tu computador, con tus proyectos subidos. **2. Un framework**, uno solo, según el camino que te guste: para frontend, React; para backend, Django o Flask (Python) o Express (JavaScript). **3. Una base de datos real**, como PostgreSQL o MySQL, instalada y conectada a un proyecto. **4. Desplegar**: que al menos un proyecto se pueda abrir desde cualquier celular. **5. Escribir tus propias pruebas**, con `pytest` en Python.',
            '**La comunidad**: busca grupos de programación de tu ciudad y comunidades en línea en español; ahí salen consejos, amigos y a veces trabajos. Contribuir a un proyecto de código abierto (empezando por arreglar su documentación) es una experiencia que puedes poner en la hoja de vida. Contar lo que aprendes, en una publicación corta o en el README de tus proyectos, también te hace visible.',
            '**La práctica constante** gana: una hora casi todos los días rinde más que un maratón el domingo, porque lo que no usas se olvida. Ejecuta el código para ver un plan de ejemplo.',
          ],
          codigo: [
            'plan = [',
            '    ("Semanas 1 a 3", "Git y GitHub de verdad; subir y documentar 3 proyectos"),',
            '    ("Semanas 4 a 7", "Un framework y una base de datos real, con un proyecto pequeño"),',
            '    ("Semanas 8 a 11", "Un proyecto para un negocio (real o de práctica), desplegado"),',
            '    ("Semanas 12 y 13", "Pruebas con pytest, repasar entrevistas y postularte más"),',
            '    ("Todas las semanas", "Postularte, practicar un ejercicio de entrevista y hablar con la comunidad"),',
            ']',
            '',
            'for cuando, que in plan:',
            '    print(cuando + ":", que)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Metas repartidas por semanas',
          texto: [
            'Un plan sirve si es concreto: «esta semana hago esto». Completa `dividir_en_semanas(metas, por_semana)`: recibe una lista de metas y cuántas caben por semana, y devuelve una **lista de semanas**, donde cada semana es una lista con hasta `por_semana` metas, en orden.',
            'Con 5 metas y 2 por semana quedan tres semanas: dos con 2 metas y la última con 1. Si `por_semana` es 0 o menos, lanza `ValueError`: ese plan nunca terminaría.',
          ],
          codigo: [
            'def dividir_en_semanas(metas, por_semana):',
            '    # Toma la lista de a pedazos de tamaño por_semana',
            '    return []',
            '',
            '',
            'pendientes = ["Instalar Git", "Subir la tienda", "README de la tienda", "Perfil de GitHub", "Primer PR"]',
            'for numero, semana in enumerate(dividir_en_semanas(pendientes, 2), start=1):',
            '    print("Semana", numero, "->", semana)',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Con 5 metas y 2 por semana da tres semanas',
              condicion: 'dividir_en_semanas(["a", "b", "c", "d", "e"], 2) == [["a", "b"], ["c", "d"], ["e"]]',
            },
            { descripcion: 'Si caben todas, queda una sola semana', condicion: 'dividir_en_semanas(["a", "b"], 5) == [["a", "b"]]' },
            { descripcion: 'Sin metas no hay semanas', condicion: 'dividir_en_semanas([], 3) == []' },
            { descripcion: 'Con 0 por semana lanza ValueError', condicion: lanzaValueError('dividir_en_semanas(["a"], 0)') },
          ],
          pistas: [
            'Valida primero: `if por_semana <= 0: raise ValueError("Debe caber al menos una meta por semana")`.',
            '`range(0, len(metas), por_semana)` da el comienzo de cada semana: 0, 2, 4…',
            'Cada semana es un pedazo: `[metas[inicio:inicio + por_semana] for inicio in range(0, len(metas), por_semana)]`.',
          ],
          solucion: [
            'def dividir_en_semanas(metas, por_semana):',
            '    if por_semana <= 0:',
            '        raise ValueError("Debe caber al menos una meta por semana")',
            '    # range salta de por_semana en por_semana: cada salto es el comienzo de una semana.',
            '    return [metas[inicio:inicio + por_semana] for inicio in range(0, len(metas), por_semana)]',
            '',
            '',
            'pendientes = ["Instalar Git", "Subir la tienda", "README de la tienda", "Perfil de GitHub", "Primer PR"]',
            'for numero, semana in enumerate(dividir_en_semanas(pendientes, 2), start=1):',
            '    print("Semana", numero, "->", semana)',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: un planificador por horas',
          texto: [
            'Las metas no pesan lo mismo: aprender un framework toma más que arreglar un README. Crea `planificar(metas, horas_por_semana)`, donde `metas` es una lista de parejas `(nombre, horas)`. Devuelve la lista de semanas; cada semana es una lista de parejas `(nombre, horas)` que suman como mucho `horas_por_semana`.',
            'Llena las semanas **en orden**. Si una meta no cabe en lo que queda de la semana, pon ahí lo que quepa y **sigue con el resto en la semana siguiente** (como «Un framework», que ocupa tres semanas en el ejemplo). No dejes semanas vacías al final.',
            'Si `horas_por_semana` o las horas de una meta son 0 o menos, lanza `ValueError`. Al final, el código te dice si tu plan cabe en 90 días: si no cabe, quita metas o dedica más horas; un plan imposible desanima más que uno pequeño.',
          ],
          codigo: [
            ...METAS,
            '',
            '',
            'def planificar(metas, horas_por_semana):',
            '    plan = []',
            '    # Lleva la semana actual y cuántas horas le quedan libres',
            '    return plan',
            '',
            '',
            'plan = planificar(metas, 10)',
            'for numero, semana in enumerate(plan, start=1):',
            '    print("Semana", numero, "->", semana)',
            'print("¿Cabe en 90 días?", len(plan) <= SEMANAS_EN_90_DIAS)',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Con las metas de ejemplo y 10 horas da el plan de 5 semanas', condicion: 'planificar(metas, 10) == ' + PLAN_ESPERADO },
            { descripcion: 'Ninguna semana pasa del tope de horas', condicion: 'all(sum(h for n, h in semana) <= 7 for semana in planificar(metas, 7))' },
            { descripcion: 'Se reparten todas las horas de todas las metas', condicion: 'sum(h for semana in planificar(metas, 7) for n, h in semana) == 44' },
            { descripcion: 'Si llenan justo, no queda una semana vacía', condicion: 'planificar([("A", 10), ("B", 10)], 10) == [[("A", 10)], [("B", 10)]]' },
            { descripcion: 'Sin metas, el plan está vacío', condicion: 'planificar([], 10) == []' },
            { descripcion: 'Con 0 horas por semana lanza ValueError', condicion: lanzaValueError('planificar([("A", 5)], 0)') },
            { descripcion: 'Una meta con 0 horas lanza ValueError', condicion: lanzaValueError('planificar([("A", 5), ("B", 0)], 10)') },
          ],
          pistas: [
            'Lleva tres cosas: `plan = []`, `semana = []` y `libre = horas_por_semana`. Para cada meta, `restantes = horas` y repite `while restantes > 0:`.',
            'Dentro del while: si `libre == 0`, guarda la semana (`plan.append(semana)`), empieza otra (`semana = []`) y `libre = horas_por_semana`. Luego `tomar = min(restantes, libre)`, agrega `(nombre, tomar)` y resta `tomar` de `restantes` y de `libre`.',
            'Al terminar todas las metas, la última semana todavía no está en el plan: `if semana: plan.append(semana)`. El `if` evita la semana vacía.',
          ],
          solucion: [
            ...METAS,
            '',
            '',
            'def planificar(metas, horas_por_semana):',
            '    if horas_por_semana <= 0:',
            '        raise ValueError("Necesitas al menos una hora por semana")',
            '    plan = []',
            '    semana = []',
            '    libre = horas_por_semana',
            '    for nombre, horas in metas:',
            '        if horas <= 0:',
            '            raise ValueError("Horas no válidas en: " + nombre)',
            '        restantes = horas',
            '        while restantes > 0:',
            '            # La semana se cierra solo cuando hace falta espacio: así nunca queda una vacía.',
            '            if libre == 0:',
            '                plan.append(semana)',
            '                semana = []',
            '                libre = horas_por_semana',
            '            tomar = min(restantes, libre)',
            '            semana.append((nombre, tomar))',
            '            restantes -= tomar',
            '            libre -= tomar',
            '    if semana:',
            '        plan.append(semana)',
            '    return plan',
            '',
            '',
            'plan = planificar(metas, 10)',
            'for numero, semana in enumerate(plan, start=1):',
            '    print("Semana", numero, "->", semana)',
            'print("¿Cabe en 90 días?", len(plan) <= SEMANAS_EN_90_DIAS)',
          ].join('\n'),
        },
      ],
    };
  })()
);

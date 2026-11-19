// Ruta "Tu primer trabajo", lección 8: cotizar y acordar con un cliente.
// Todos los valores en pesos son DE EJEMPLO, para practicar las cuentas: la
// app no sabe cuánto se cobra en el mercado y no lo inventa. El texto se lo
// dice al estudiante y le explica cómo calcular su propio valor.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = True\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    const TAREAS = [
      '# Las tareas de una página para una panadería, con las horas que estimaste',
      'tareas = [',
      '    ("Diseño y textos con el dueño", 6),',
      '    ("Página con horario y ubicación", 10),',
      '    ("Botón de WhatsApp", 2),',
      '    ("Publicar la página", 3),',
      ']',
      'VALOR_HORA = 30000  # valor de EJEMPLO para practicar, no es una tarifa del mercado',
    ];

    const COTIZAR_SOLUCION = [
      'MARGEN = 0.25  # 25 %: lo que siempre aparece y nadie previó',
      '',
      '',
      'def cotizar(tareas, valor_hora):',
      '    horas = 0',
      '    for nombre, horas_tarea in tareas:',
      '        if horas_tarea <= 0:',
      '            raise ValueError("Horas no válidas en: " + nombre)',
      '        horas += horas_tarea',
      '    # math.ceil redondea hacia arriba: un margen de 2,5 horas se cobra como 3.',
      '    margen = math.ceil(horas * MARGEN)',
      '    total_horas = horas + margen',
      '    return {"horas": horas, "margen": margen, "total_horas": total_horas, "valor": total_horas * valor_hora}',
    ];

    return {
      id: 'cotizar',
      titulo: 'Cotizar y acordar con un cliente',
      pasos: [
        {
          id: 'idea',
          titulo: 'Lo que se acuerda antes de empezar',
          texto: [
            'La mayoría de los problemas con un cliente no son de código: son de **lo que cada uno creía que se había acordado**. Por eso, antes de empezar, se escribe (aunque sea en un correo o un mensaje) un acuerdo con seis partes:',
            '**1. Alcance**: qué incluye y, sobre todo, qué **no** incluye. **2. Entregables**: lo concreto que vas a entregar («una página con cuatro secciones y botón de WhatsApp, publicada»). **3. Tiempos con margen**: estima cada tarea y súmale un margen, porque siempre aparece algo. **4. Pagos por etapas**: un anticipo al empezar y el resto por avances; así ninguno de los dos arriesga todo. **5. Mantenimiento**: qué cubre después de entregar (por ejemplo, corregir errores durante un tiempo acordado) y qué se cobra aparte (cosas nuevas). **6. Cambios**: todo cambio de alcance se cotiza aparte y por escrito.',
            '**Decir no** también es parte del oficio: «Eso no está en lo que acordamos; con gusto te lo cotizo aparte», o «Eso todavía no lo sé hacer bien y no quiero cobrarte por aprender; te puedo recomendar a alguien». Un no a tiempo cuida la relación más que un sí que no puedes cumplir.',
            '**Sobre el valor de tu hora**: esta app no conoce las tarifas del mercado y no las va a inventar. Los valores de los ejercicios son de ejemplo. Para calcular el tuyo, suma tus gastos del mes, mira cuántas horas puedes cobrar de verdad y pregúntales a personas que ya trabajan de independientes en tu ciudad. Para facturar como independiente en Colombia hay trámites (como el RUT ante la DIAN): averigua con la DIAN o con un contador cuáles te aplican.',
          ],
          codigo: [
            '# Una cotización de EJEMPLO (los valores son inventados para practicar)',
            'print("Alcance: página de la panadería con horario, ubicación y botón de WhatsApp")',
            'print("No incluye: tienda en línea, pagos por internet ni fotos profesionales")',
            'print("Entregables: la página publicada y su código")',
            'print("Tiempo: 21 horas estimadas + 6 de margen = 27 horas")',
            'print("Pagos: 40 % al empezar, 30 % al mostrar el avance, 30 % al entregar")',
            'print("Mantenimiento: corrección de errores durante el tiempo que acuerden; lo nuevo se cotiza aparte")',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'De tareas y horas a una cotización',
          texto: [
            'Cotizar bien empieza por **partir el trabajo en tareas** y estimar las horas de cada una. Estimar «la página entera» de un solo golpe casi siempre sale corto.',
            'Completa `cotizar(tareas, valor_hora)`. `tareas` es una lista de parejas `(nombre, horas)`. Devuelve un diccionario con `"horas"` (la suma), `"margen"` (el 25 % de las horas, redondeado **hacia arriba** con `math.ceil`), `"total_horas"` (horas + margen) y `"valor"` (total de horas por el valor de la hora).',
            'Si alguna tarea tiene 0 horas o menos, lanza `ValueError`: seguro es un error al escribirla. El 25 % de margen es una elección de ejemplo; con la experiencia ajustarás el tuyo comparando lo que estimaste con lo que de verdad tardaste.',
          ],
          codigo: [
            'import math',
            '',
            ...TAREAS,
            'MARGEN = 0.25  # 25 %: lo que siempre aparece y nadie previó',
            '',
            '',
            'def cotizar(tareas, valor_hora):',
            '    # Suma las horas, calcula el margen con math.ceil y arma el diccionario',
            '    return {}',
            '',
            '',
            'print(cotizar(tareas, VALOR_HORA))',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Con las tareas de ejemplo: 21 horas, 6 de margen, 27 en total',
              condicion: '{k: cotizar(tareas, 30000)[k] for k in ("horas", "margen", "total_horas")} == {"horas": 21, "margen": 6, "total_horas": 27}',
            },
            { descripcion: 'El valor es el total de horas por el valor de la hora', condicion: 'cotizar(tareas, 30000)["valor"] == 810000' },
            { descripcion: 'El margen se redondea hacia arriba (10 horas dan 3 de margen)', condicion: 'cotizar([("Página", 10)], 1000)["margen"] == 3' },
            { descripcion: 'Sin tareas, todo da 0', condicion: 'cotizar([], 1000) == {"horas": 0, "margen": 0, "total_horas": 0, "valor": 0}' },
            { descripcion: 'Una tarea con 0 horas lanza ValueError', condicion: lanzaValueError('cotizar([("Página", 10), ("Logo", 0)], 1000)') },
          ],
          pistas: [
            'Recorre `for nombre, horas_tarea in tareas:`: si `horas_tarea <= 0`, `raise ValueError(...)`; si no, súmala a `horas`.',
            '`margen = math.ceil(horas * MARGEN)` y `total_horas = horas + margen`.',
            'Devuelve `{"horas": horas, "margen": margen, "total_horas": total_horas, "valor": total_horas * valor_hora}`.',
          ],
          solucion: ['import math', '', ...TAREAS, ...COTIZAR_SOLUCION, '', '', 'print(cotizar(tareas, VALOR_HORA))'].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: pagos por etapas',
          texto: [
            'Con el valor listo, se acuerdan los pagos. Crea `plan_de_pagos(valor, etapas)`. `etapas` es una lista de parejas `(nombre, porcentaje)` con porcentajes enteros, como `[("Anticipo", 40), ("Avance", 30), ("Entrega", 30)]`. Devuelve una lista de parejas `(nombre, monto)` en pesos enteros.',
            'Los porcentajes deben sumar **exactamente 100** y cada uno debe ser mayor que 0; si no, lanza `ValueError`. Un plan que suma 90 % es un 10 % que nadie va a cobrar.',
            'El detalle que separa una cuenta de juguete de una real: al redondear, la suma de los pagos puede no dar el total. Calcula cada monto con `valor * porcentaje // 100` (división entera) **menos el último**, que se lleva **lo que falta** para completar el valor. Así la suma siempre da exacta y nadie discute por un peso.',
          ],
          codigo: [
            'import math',
            '',
            ...TAREAS,
            ...COTIZAR_SOLUCION,
            '',
            '',
            'def plan_de_pagos(valor, etapas):',
            '    # Valida los porcentajes, calcula cada monto y deja el resto para el último',
            '    return []',
            '',
            '',
            'valor = cotizar(tareas, VALOR_HORA)["valor"]',
            'for nombre, monto in plan_de_pagos(valor, [("Anticipo", 40), ("Avance", 30), ("Entrega", 30)]):',
            '    print(nombre + ":", monto)',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Reparte 810000 en 40 %, 30 % y 30 %',
              condicion: 'plan_de_pagos(810000, [("Anticipo", 40), ("Avance", 30), ("Entrega", 30)]) == [("Anticipo", 324000), ("Avance", 243000), ("Entrega", 243000)]',
            },
            {
              descripcion: 'El último se lleva lo que falta: la suma da exacta',
              condicion: 'plan_de_pagos(100001, [("Anticipo", 50), ("Entrega", 50)]) == [("Anticipo", 50000), ("Entrega", 50001)]',
            },
            {
              descripcion: 'Con tercios la suma también da exacta',
              condicion: 'sum(monto for nombre, monto in plan_de_pagos(1000000, [("A", 33), ("B", 33), ("C", 34)])) == 1000000',
            },
            { descripcion: 'Un solo pago del 100 % es el valor completo', condicion: 'plan_de_pagos(500000, [("Contra entrega", 100)]) == [("Contra entrega", 500000)]' },
            { descripcion: 'Si los porcentajes suman 90, lanza ValueError', condicion: lanzaValueError('plan_de_pagos(1000, [("A", 50), ("B", 40)])') },
            { descripcion: 'Un porcentaje de 0 lanza ValueError', condicion: lanzaValueError('plan_de_pagos(1000, [("A", 100), ("B", 0)])') },
          ],
          pistas: [
            'Valida primero: `if sum(p for nombre, p in etapas) != 100 or any(p <= 0 for nombre, p in etapas): raise ValueError(...)`.',
            'Recorre todas menos la última con `for nombre, porcentaje in etapas[:-1]:`, calcula `monto = valor * porcentaje // 100`, agrégalo a la lista y súmalo a `pagado`.',
            'La última: `nombre_final = etapas[-1][0]` y su monto es `valor - pagado`.',
          ],
          solucion: [
            'import math',
            '',
            ...TAREAS,
            ...COTIZAR_SOLUCION,
            '',
            '',
            'def plan_de_pagos(valor, etapas):',
            '    porcentajes = [porcentaje for nombre, porcentaje in etapas]',
            '    if sum(porcentajes) != 100 or any(porcentaje <= 0 for porcentaje in porcentajes):',
            '        raise ValueError("Los porcentajes deben ser positivos y sumar 100")',
            '    pagos = []',
            '    pagado = 0',
            '    for nombre, porcentaje in etapas[:-1]:',
            '        monto = valor * porcentaje // 100',
            '        pagos.append((nombre, monto))',
            '        pagado += monto',
            '    # El último se lleva lo que falta: así lo redondeado nunca deja un peso suelto.',
            '    pagos.append((etapas[-1][0], valor - pagado))',
            '    return pagos',
            '',
            '',
            'valor = cotizar(tareas, VALOR_HORA)["valor"]',
            'for nombre, monto in plan_de_pagos(valor, [("Anticipo", 40), ("Avance", 30), ("Entrega", 30)]):',
            '    print(nombre + ":", monto)',
          ].join('\n'),
        },
      ],
    };
  })()
);

// Ruta "El oficio", lección 10: repaso. Un ticket de punta a punta.
//
// Junta lo de la ruta en el orden en que se hace en un trabajo: leer el
// reporte, reproducir y aislar (lección 2), escribir la prueba primero,
// arreglar validando la entrada (lección 4) y dejarlo listo para revisión en
// una rama (lección 8).
//
// El código del sistema se arma con piezas compartidas: el último paso (la
// terminal) escribe en la carpeta del proyecto EXACTAMENTE la solución del
// reto, línea por línea con echo, para que lo que se sube a revisión sea lo
// mismo que el estudiante acaba de arreglar.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  const PRECIOS = ['PRECIOS = {"AR01": 3500, "TI01": 2000, "BU01": 1500, "CA01": 18000}'];

  const RESUMEN_CON_ERROR = [
    'def resumen_pedidos(pedidos):',
    '    # El resumen del día: unidades por producto y plata total',
    '    unidades = {}',
    '    total = 0',
    '    for pedido in pedidos:',
    '        codigo = pedido["codigo"]',
    '        unidades[codigo] = unidades.get(codigo, 0) + pedido["cantidad"]',
    '        total += PRECIOS[codigo] * pedido["cantidad"]',
    '    return {"unidades": unidades, "total": total}',
  ];

  const RESUMEN_ARREGLADO = [
    'def problema_del_pedido(pedido):',
    '    # None si el pedido está bien; si no, la razón para rechazarlo',
    '    if pedido.get("codigo") not in PRECIOS:',
    '        return "No existe el producto " + str(pedido.get("codigo"))',
    '    if "cantidad" not in pedido:',
    '        return "Falta la cantidad"',
    '    cantidad = pedido["cantidad"]',
    '    if not isinstance(cantidad, int) or isinstance(cantidad, bool):',
    '        return "La cantidad debe ser un número entero"',
    '    if cantidad < 1:',
    '        return "La cantidad debe ser mayor que cero"',
    '    return None',
    '',
    '',
    'def resumen_pedidos(pedidos):',
    '    # El resumen del día: unidades por producto y plata total.',
    '    # TIENDA-142: un pedido malo ya no tumba el resumen; se aparta en "rechazados".',
    '    unidades = {}',
    '    total = 0',
    '    rechazados = []',
    '    for pedido in pedidos:',
    '        razon = problema_del_pedido(pedido)',
    '        if razon is not None:',
    '            rechazados.append({"id": pedido.get("id"), "razon": razon})',
    '            continue',
    '        codigo = pedido["codigo"]',
    '        unidades[codigo] = unidades.get(codigo, 0) + pedido["cantidad"]',
    '        total += PRECIOS[codigo] * pedido["cantidad"]',
    '    return {"unidades": unidades, "total": total, "rechazados": rechazados}',
  ];

  const PRUEBA_VIEJA = [
    'def prueba_resumen_normal():',
    '    resumen = resumen_pedidos([',
    '        {"id": 1, "codigo": "AR01", "cantidad": 2},',
    '        {"id": 2, "codigo": "TI01", "cantidad": 3},',
    '        {"id": 3, "codigo": "AR01", "cantidad": 1},',
    '    ])',
    '    assert resumen["unidades"] == {"AR01": 3, "TI01": 3}',
    '    assert resumen["total"] == 16500',
  ];

  const PRUEBA_NUEVA = [
    'def prueba_pedido_sin_cantidad():',
    '    # TIENDA-142: el pedido 7 llegó sin cantidad y tumbó el resumen',
    '    resumen = resumen_pedidos([',
    '        {"id": 5, "codigo": "AR01", "cantidad": 2},',
    '        {"id": 7, "codigo": "TI01"},',
    '    ])',
    '    assert resumen["total"] == 7000',
    '    assert resumen["unidades"] == {"AR01": 2}',
    '    assert [r["id"] for r in resumen["rechazados"]] == [7]',
  ];

  const MANANA = [
    '# Los pedidos de la mañana, copiados del registro del servidor',
    'PEDIDOS_DE_LA_MANANA = [',
    '    {"id": 5, "codigo": "AR01", "cantidad": 2},',
    '    {"id": 6, "codigo": "CA01", "cantidad": 1},',
    '    {"id": 7, "codigo": "TI01"},',
    '    {"id": 8, "codigo": "BU01", "cantidad": "3"},',
    '    {"id": 9, "codigo": "XX99", "cantidad": 1},',
    '    {"id": 10, "codigo": "TI01", "cantidad": 0},',
    ']',
  ];

  const TICKET = [
    '# TICKET TIENDA-142 (prioridad alta), de Don Pepe:',
    '# "Desde que abrimos los pedidos por la página, el resumen del día se cae',
    '#  algunas veces. Hoy se cayó con los pedidos de la mañana y no pude cuadrar caja."',
    '# Acordado con Don Pepe: un pedido malo NO debe tumbar el resumen. Se deja por',
    '# fuera y se anota en "rechazados" con su id y la razón, para llamar al cliente.',
  ];

  // La prueba del estudiante se corre contra otra versión de resumen_pedidos
  // (cambiándola en el diccionario donde viven sus funciones) y se mira si pasa.
  const pruebaContra = (version, debePasar) =>
    comprobar([
      ...version,
      '',
      'g2 = prueba_pedido_sin_cantidad.__globals__',
      'real = g2["resumen_pedidos"]',
      'g2["resumen_pedidos"] = resumen_pedidos',
      'try:',
      '    prueba_pedido_sin_cantidad()',
      '    ok = ' + (debePasar ? 'True' : 'False'),
      'except Exception:',
      '    ok = ' + (debePasar ? 'False' : 'True'),
      'finally:',
      '    g2["resumen_pedidos"] = real',
    ]);

  // Un "arreglo" a medias: salta el pedido malo pero no lo anota. Una buena
  // prueba lo atrapa, porque el ticket pide anotarlo.
  const ARREGLO_A_MEDIAS = [
    'def resumen_pedidos(pedidos):',
    '    unidades = {}',
    '    total = 0',
    '    for pedido in pedidos:',
    '        if "cantidad" not in pedido:',
    '            continue',
    '        codigo = pedido["codigo"]',
    '        unidades[codigo] = unidades.get(codigo, 0) + pedido["cantidad"]',
    '        total += PRECIOS[codigo] * pedido["cantidad"]',
    '    return {"unidades": unidades, "total": total, "rechazados": []}',
  ];

  // Corre la prueba en un try, como en la lección de depurar: si explotara
  // suelta, el programa terminaría con error y no se revisaría nada.
  const CORRER_PRUEBA = [
    'try:',
    '    prueba_pedido_sin_cantidad()',
    '    print("La prueba pasó")',
    'except Exception as error:',
    '    print("La prueba falló con", type(error).__name__, "(¡bien!: atrapó el error)")',
  ];

  const practica = (pruebaNueva) =>
    [...TICKET, '', ...PRECIOS, '', '', ...RESUMEN_CON_ERROR, '', '', ...PRUEBA_VIEJA, '', '', ...pruebaNueva, '', '', 'prueba_resumen_normal()', ...CORRER_PRUEBA].join('\n');

  const reto = (resumen) =>
    [
      ...TICKET,
      '',
      ...PRECIOS,
      '',
      '',
      ...resumen,
      '',
      '',
      ...PRUEBA_VIEJA,
      '',
      '',
      ...PRUEBA_NUEVA,
      '',
      '',
      ...MANANA,
      '',
      'try:',
      '    prueba_resumen_normal()',
      '    prueba_pedido_sin_cantidad()',
      '    print("Las pruebas pasaron")',
      '    print(resumen_pedidos(PEDIDOS_DE_LA_MANANA))',
      'except Exception as error:',
      '    print("Algo falló:", type(error).__name__, error)',
    ].join('\n');

  const correSinError = (llamada) => comprobar(['try:', '    ' + llamada, '    ok = True', 'except Exception:', '    ok = False']);

  // ---------- Terminal: los archivos del proyecto ----------

  const REPORTE_VIEJO = [...PRECIOS, '', '', ...RESUMEN_CON_ERROR].join('\n');
  const REPORTE_NUEVO = [...PRECIOS, '', '', ...RESUMEN_ARREGLADO];
  const PRUEBAS_VIEJAS = ['from reporte import resumen_pedidos', '', '', ...PRUEBA_VIEJA].join('\n');
  const PRUEBAS_NUEVAS = ['from reporte import resumen_pedidos', '', '', ...PRUEBA_VIEJA, '', '', ...PRUEBA_NUEVA];

  // Escribe un archivo línea por línea con echo, entre comillas simples (el
  // código usa comillas dobles, así que no chocan).
  const escribirConEcho = (archivo, lineas) =>
    lineas.map((linea, i) => "echo '" + linea + "' " + (i === 0 ? '>' : '>>') + ' ' + archivo);

  const PREPARACION_TERMINAL = [
    'git init',
    'git add .',
    'git commit -m "Resumen de pedidos del día"',
    ...escribirConEcho('reporte.py', REPORTE_NUEVO),
    ...escribirConEcho('pruebas_reporte.py', PRUEBAS_NUEVAS),
  ].join('\n');

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'repaso-un-ticket',
    titulo: 'Repaso: un ticket de punta a punta',
    pasos: [
      {
        id: 'idea',
        titulo: 'El ticket: leer, reproducir y aislar',
        texto: [
          'Este es el trabajo de todos los días en una empresa: llega un **ticket**, lo resuelves y lo dejas listo para que otra persona lo revise. Lo vas a hacer completo, con todo lo de esta ruta. El ticket **TIENDA-142** está arriba del código.',
          'Primero **reproduce**: corre el resumen con los pedidos de la mañana y lee el traceback de abajo hacia arriba. Después **aísla**: en vez de adivinar cuál pedido lo tumba, corre cada pedido solo y mira cuáles fallan y con qué error. Ejecuta el ejemplo.',
          'Fíjate en tres cosas. **1.** No hay un solo culpable: hay tres pedidos que tumban el resumen, cada uno con un error distinto. Si arreglas solo el primero, mañana vuelve el ticket. **2.** El pedido 10 (cantidad 0) **no rompe nada**, y eso es peor: entra al resumen sin que nadie lo note. **3.** La causa de fondo no es una línea: es que el sistema **confía en lo que llega** de la página (lección 4).',
        ],
        codigo: [
          'import traceback',
          '',
          ...TICKET,
          '',
          ...PRECIOS,
          '',
          '',
          ...RESUMEN_CON_ERROR,
          '',
          '',
          ...MANANA,
          '',
          'print("1. Reproducir:")',
          'try:',
          '    resumen_pedidos(PEDIDOS_DE_LA_MANANA)',
          'except Exception:',
          '    print(traceback.format_exc())',
          '',
          'print("2. Aislar: cada pedido por separado")',
          'for pedido in PEDIDOS_DE_LA_MANANA:',
          '    try:',
          '        resumen = resumen_pedidos([pedido])',
          '        print("  pedido", pedido["id"], "bien:", resumen)',
          '    except Exception as error:',
          '        print("  pedido", pedido["id"], "FALLA:", type(error).__name__, error)',
        ].join('\n'),
      },
      {
        id: 'practica',
        etiqueta: 'La prueba',
        titulo: 'Primero, la prueba que atrapa el error',
        texto: [
          'Antes de tocar `resumen_pedidos`, escribe la prueba del ticket. Debe decir **cómo debería comportarse** el sistema según lo acordado con Don Pepe, no cómo se comporta hoy.',
          'Escribe `prueba_pedido_sin_cantidad()`: llama a `resumen_pedidos` con un pedido bueno (por ejemplo, el 5: 2 arepas) y el pedido 7 (sin cantidad), y con `assert` revisa que el total sea **7000**, que las unidades sean `{"AR01": 2}` y que los ids de `resumen["rechazados"]` sean `[7]`.',
          'Hoy tiene que **fallar** (el final del código ya la corre y te cuenta). Y revisa los rechazados, no solo el total: un arreglo a medias que salta el pedido malo sin anotarlo también debe hacerla fallar, porque Don Pepe necesita saber a quién llamar.',
        ],
        codigo: practica(['# Escribe aquí prueba_pedido_sin_cantidad']),
        pruebas: [
          { descripcion: 'Escribiste prueba_pedido_sin_cantidad', condicion: 'callable(prueba_pedido_sin_cantidad)' },
          { descripcion: 'Con el código de hoy, tu prueba falla', condicion: comprobar(['try:', '    prueba_pedido_sin_cantidad()', '    ok = False', 'except Exception:', '    ok = True']) },
          { descripcion: 'Con el arreglo acordado, tu prueba pasa', condicion: pruebaContra(RESUMEN_ARREGLADO, true) },
          { descripcion: 'Un arreglo a medias (que no anota el rechazado) no la pasa', condicion: pruebaContra(ARREGLO_A_MEDIAS, false) },
          { descripcion: 'La prueba vieja sigue pasando', condicion: correSinError('prueba_resumen_normal()') },
        ],
        pistas: [
          'Empieza así: `def prueba_pedido_sin_cantidad():` y adentro `resumen = resumen_pedidos([{"id": 5, "codigo": "AR01", "cantidad": 2}, {"id": 7, "codigo": "TI01"}])`.',
          'Luego tres `assert`: `assert resumen["total"] == 7000`, `assert resumen["unidades"] == {"AR01": 2}`.',
          'Y el de los rechazados: `assert [r["id"] for r in resumen["rechazados"]] == [7]`. Ejecuta: debe decir que la prueba falló con `KeyError`.',
        ],
        solucion: practica(PRUEBA_NUEVA),
      },
      {
        id: 'reto',
        etiqueta: 'El arreglo',
        titulo: 'Reto: arreglar validando la entrada',
        texto: [
          'Ya tienes la prueba (está en el código). Ahora arregla `resumen_pedidos` de raíz: **valida cada pedido** antes de usarlo. Escribe una función `problema_del_pedido(pedido)` que devuelva `None` si el pedido está bien, o la razón para rechazarlo, revisando en este orden y con estos mensajes:',
          'si el código no está en `PRECIOS`: `"No existe el producto XX99"` (con el código que llegó); si no trae cantidad: `"Falta la cantidad"`; si la cantidad no es un entero (ojo con el texto `"3"` y con `True`): `"La cantidad debe ser un número entero"`; si es menor que 1: `"La cantidad debe ser mayor que cero"`.',
          '`resumen_pedidos` aparta los pedidos con problema en `"rechazados"` (una lista de `{"id": ..., "razon": ...}`, en el orden en que llegaron) y suma solo los buenos. Al final deben pasar **las dos pruebas**: la nueva y la vieja.',
        ],
        codigo: reto(RESUMEN_CON_ERROR),
        pruebas: [
          { descripcion: 'Pasan las dos pruebas: la del ticket y la vieja', condicion: correSinError('prueba_pedido_sin_cantidad()') + ' and ' + correSinError('prueba_resumen_normal()') },
          {
            descripcion: 'Con los pedidos de la mañana, suma solo los buenos',
            condicion: '(lambda r: r["total"] == 25000 and r["unidades"] == {"AR01": 2, "CA01": 1})(resumen_pedidos(PEDIDOS_DE_LA_MANANA))',
          },
          {
            descripcion: 'Rechaza los pedidos 7, 8, 9 y 10, cada uno con su razón',
            condicion:
              'resumen_pedidos(PEDIDOS_DE_LA_MANANA)["rechazados"] == [{"id": 7, "razon": "Falta la cantidad"}, {"id": 8, "razon": "La cantidad debe ser un número entero"}, {"id": 9, "razon": "No existe el producto XX99"}, {"id": 10, "razon": "La cantidad debe ser mayor que cero"}]',
          },
          {
            descripcion: 'problema_del_pedido revisa en el orden pedido (también True y negativos)',
            condicion:
              'problema_del_pedido({"id": 1, "codigo": "AR01", "cantidad": 1}) is None and problema_del_pedido({"id": 1, "codigo": "AR01", "cantidad": True}) == "La cantidad debe ser un número entero" and problema_del_pedido({"id": 1, "codigo": "AR01", "cantidad": -2}) == "La cantidad debe ser mayor que cero" and problema_del_pedido({"id": 1, "codigo": "ZZ", "cantidad": "x"}) == "No existe el producto ZZ"',
          },
          { descripcion: 'Un día sin pedidos da un resumen vacío', condicion: 'resumen_pedidos([]) == {"unidades": {}, "total": 0, "rechazados": []}' },
        ],
        pistas: [
          'Empieza `problema_del_pedido` con `if pedido.get("codigo") not in PRECIOS: return "No existe el producto " + str(pedido.get("codigo"))`. `get` no se revienta si falta la clave.',
          'Sigue con `if "cantidad" not in pedido:`, luego `if not isinstance(pedido["cantidad"], int) or isinstance(pedido["cantidad"], bool):` y `if pedido["cantidad"] < 1:`. Al final, `return None`.',
          'En `resumen_pedidos`, crea `rechazados = []` y al comienzo del `for`: `razon = problema_del_pedido(pedido)`; si no es `None`, `rechazados.append({"id": pedido.get("id"), "razon": razon})` y `continue`. Devuelve también `"rechazados": rechazados`.',
        ],
        solucion: reto(RESUMEN_ARREGLADO),
      },
      {
        id: 'revision',
        etiqueta: 'A revisión',
        motor: 'terminal',
        titulo: 'Dejarlo listo para revisión',
        texto: [
          'El arreglo está hecho y las pruebas pasan: en la carpeta del proyecto ya están los cambios de `reporte.py` y `pruebas_reporte.py`, **sin guardar**. Mira con `git status` y `git diff` qué cambió. Un buen hábito antes de cada commit: leer tu propio diff como si fueras quien revisa.',
          'Déjalo listo para revisión: crea una rama para el ticket (por ejemplo `arreglo/tienda-142`; los cambios sin guardar viajan contigo a la rama nueva), prepara los dos archivos y haz un commit cuyo mensaje empiece con el número del ticket: `TIENDA-142: ...`. Así cualquiera que lea la historia sabe por qué se hizo cada cambio. Termina con `git diff main`, que es lo que verá quien revise. **No** fusiones con `main`: eso pasa cuando aprueben el PR.',
          'En GitHub, el PR llevaría una descripción como esta: *"Arregla TIENDA-142. Los pedidos con cantidad faltante, no entera o menor que 1, o con un producto que no existe, ya no tumban el resumen: se apartan en rechazados con su razón. Cómo probar: correr pruebas_reporte.py."* Con eso cerraste un ticket como en una empresa: entendiste, reprodujiste, probaste, arreglaste de raíz y lo entregaste para revisión.',
        ],
        archivos: { 'reporte.py': REPORTE_VIEJO, 'pruebas_reporte.py': PRUEBAS_VIEJAS },
        preparacion: PREPARACION_TERMINAL,
        codigo: ['git status', ''].join('\n'),
        pruebas: [
          { descripcion: 'Estás en una rama para el ticket, no en main', condicion: 'ramaActual() !== "main" && ramas().includes(ramaActual())' },
          {
            descripcion: 'El último commit de la rama guarda el arreglo y la prueba nueva',
            condicion: '(() => { const c = ultimoCommit(); return c !== null && /rechazados/.test(c.archivos["reporte.py"] || "") && /prueba_pedido_sin_cantidad/.test(c.archivos["pruebas_reporte.py"] || ""); })()',
          },
          { descripcion: 'El mensaje del commit empieza con TIENDA-142', condicion: 'ultimoCommit() !== null && /^TIENDA-142\\b/.test(ultimoCommit().mensaje)' },
          { descripcion: 'main no se tocó: el arreglo espera la revisión', condicion: 'commits("main").length === 1' },
          { descripcion: 'Revisaste lo que verá quien revise (git diff main)', condicion: 'comandos.some((c) => /^git diff main\\s*$/.test(c))' },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Mira los cambios con `git status` y `git diff`. Luego crea la rama: `git switch -c arreglo/tienda-142`.',
          'Prepara y guarda: `git add .` y `git commit -m "TIENDA-142: el resumen aparta los pedidos inválidos"`.',
          'Termina con `git diff main` y, si quieres, `git log --oneline` para ver tu commit encima del de `main`.',
        ],
        solucion: [
          'git status',
          'git diff',
          'git switch -c arreglo/tienda-142',
          'git add .',
          'git commit -m "TIENDA-142: el resumen aparta los pedidos inválidos"',
          'git diff main',
          'git log --oneline',
        ].join('\n'),
      },
    ],
  });
})();

// Ruta "Entender proyectos hechos con IA", lección 8. Mismo formato que
// 01-el-mapa-del-proyecto.js. En el reto el estudiante escribe una PRUEBA y
// se comprueba que atrapa cuatro implementaciones con errores típicos de una
// IA (y que deja pasar la correcta): es lo que significa "pedir pruebas".

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'dirigir-a-la-ia',
    titulo: 'Dirigir a la IA para construir',
    pasos: [
      {
        id: 'idea',
        titulo: 'Pedidos pequeños, con contexto y con prueba',
        texto: [
          'Don Pepe quiere **cupones de descuento**. Si le dices a la IA "agrega cupones", va a tocar diez archivos a la vez, adivinar las reglas y entregarte algo que no sabes revisar. El que dirige eres tú, y se dirige con tres hábitos.',
          '**1. Partir en pedidos pequeños**, cada uno verificable por separado. Primero la regla (backend, con su prueba), después la ruta de la API, al final la pantalla. Así, si algo falla, sabes en qué pedido fue.',
          '**2. Dar contexto**: qué archivos tocar, qué reglas seguir y un ejemplo de lo que esperas. Lo que siempre vale para el proyecto va en **`CLAUDE.md`**, que la IA lee al empezar: cómo correr las pruebas, convenciones ("precios en pesos, enteros"), qué no hacer. Así no lo repites en cada pedido. **3. Pedir pruebas, y correrlas**: "termina cuando las pruebas pasen" le da a la IA una forma de comprobarse a sí misma, y a ti una forma de saber que terminó de verdad.',
          'Corre el ejemplo: el `CLAUDE.md` de Don Pepe y un plan de pedidos bien armado para los cupones. Fíjate en que cada pedido dice qué archivos toca y cómo se comprueba, y en que el primero respeta una regla de `CLAUDE.md`: las reglas de cobro viven en `precios.py`.',
        ],
        codigo: [
          'import proyecto',
          '',
          'archivos = proyecto.abrir()',
          'print("--- CLAUDE.md (la IA lo lee al empezar) ---")',
          'print(archivos["CLAUDE.md"])',
          '',
          'PLAN = [',
          '    {',
          '        "pide": "Agrega aplicar_cupon(subtotal, codigo) en precios.py. DONPEPE10 da 10% de descuento.",',
          '        "archivos": ["backend/precios.py", "backend/tests/test_precios.py"],',
          '        "prueba": "pytest pasa, con un caso de cupón que no existe",',
          '    },',
          '    {',
          '        "pide": "Acepta un campo opcional cupon en POST /api/pedidos y úsalo para el total.",',
          '        "archivos": ["backend/app.py", "backend/tests/test_api.py"],',
          '        "prueba": "pytest pasa completo: las pruebas viejas siguen pasando",',
          '    },',
          '    {',
          '        "pide": "Agrega un campo de cupón en el carrito y mándalo en enviarPedido.",',
          '        "archivos": ["frontend/src/components/Carrito.jsx", "frontend/src/App.jsx", "frontend/src/api.js"],',
          '        "prueba": "En el navegador: con DONPEPE10 el total baja 10%",',
          '    },',
          ']',
          '',
          'for numero, pedido in enumerate(PLAN, start=1):',
          '    print("Pedido", numero, "-", pedido["pide"])',
          '    print("   Toca:", ", ".join(pedido["archivos"]))',
          '    print("   Se comprueba:", pedido["prueba"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Revisar un plan antes de mandarlo',
        texto: [
          'Crea el cuerpo de `revisar_plan(plan, archivos)`: revisa cada pedido y devuelve una lista de parejas `(número_de_pedido, problema)`, con los pedidos numerados desde 1. Para cada pedido, en este orden:',
          '**`"sin-archivos"`** si no dice qué archivos toca. **`"muy-grande"`** si toca más de 3. **`"ruta-inventada"`** si algún archivo está en una carpeta que **no existe** en el proyecto: un archivo nuevo en una carpeta que sí existe está bien (`backend/cupones.py`), pero `src/cupones.js` no, porque en Don Pepe no hay `src/` en la raíz (pasa mucho: la IA asume la estructura de otro proyecto). Los archivos de la raíz, como `README.md`, siempre están bien. **`"sin-prueba"`** si `"prueba"` está vacía o solo tiene espacios.',
          'Un mismo archivo inventado cuenta una sola vez por pedido: cada código aparece máximo una vez por pedido.',
        ],
        codigo: [
          'import proyecto',
          '',
          '',
          'def revisar_plan(plan, archivos):',
          '    problemas = []',
          '    for numero, pedido in enumerate(plan, start=1):',
          '        if len(pedido["archivos"]) == 0:',
          '            problemas.append((numero, "sin-archivos"))',
          '        # Faltan: muy-grande, ruta-inventada y sin-prueba',
          '    return problemas',
          '',
          '',
          'PLAN_APURADO = [',
          '    {"pide": "Agrega cupones", "archivos": ["src/cupones.js"], "prueba": ""},',
          '    {"pide": "Y que se vean bonitos", "archivos": [], "prueba": "que se vea bien"},',
          ']',
          'print(revisar_plan(PLAN_APURADO, proyecto.abrir()))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Un plan bien armado no tiene problemas',
            condicion:
              'revisar_plan([{"pide": "x", "archivos": ["backend/cupones.py", "backend/tests/test_cupones.py"], "prueba": "pytest"}, {"pide": "y", "archivos": ["README.md"], "prueba": "leerlo"}], __import__("proyecto").abrir()) == []',
          },
          {
            descripcion: 'Encuentra los problemas del plan apurado, con su número de pedido',
            condicion:
              'revisar_plan(PLAN_APURADO, __import__("proyecto").abrir()) == [(1, "ruta-inventada"), (1, "sin-prueba"), (2, "sin-archivos")]',
          },
          {
            descripcion: 'Más de 3 archivos es un pedido muy grande',
            condicion:
              'revisar_plan([{"pide": "todo", "archivos": ["backend/app.py", "backend/datos.py", "backend/precios.py", "frontend/src/App.jsx"], "prueba": "pytest"}], __import__("proyecto").abrir()) == [(1, "muy-grande")]',
          },
          {
            descripcion: 'Una prueba con solo espacios cuenta como vacía',
            condicion:
              'revisar_plan([{"pide": "x", "archivos": ["backend/app.py"], "prueba": "   "}], __import__("proyecto").abrir()) == [(1, "sin-prueba")]',
          },
          {
            descripcion: 'Varias rutas inventadas en un pedido cuentan una sola vez',
            condicion:
              'revisar_plan([{"pide": "x", "archivos": ["server/a.py", "web/b.js"], "prueba": "pytest"}], __import__("proyecto").abrir()) == [(1, "ruta-inventada")]',
          },
        ],
        pistas: [
          'La carpeta de un archivo es todo lo que va antes del último `/`: `carpeta = ruta.rsplit("/", 1)[0] if "/" in ruta else ""`.',
          'Esa carpeta existe si es `""` (la raíz) o si algún archivo del proyecto empieza con `carpeta + "/"`: `any(r.startswith(carpeta + "/") for r in archivos)`.',
          'Para que cuente una vez: `if any(not existe(ruta) for ruta in pedido["archivos"]):` con una función `existe` hecha con las dos pistas anteriores. Y la prueba: `if pedido["prueba"].strip() == "":`',
        ],
        solucion: [
          'import proyecto',
          '',
          '',
          'def carpeta_existe(ruta, archivos):',
          '    carpeta = ruta.rsplit("/", 1)[0] if "/" in ruta else ""',
          '    return carpeta == "" or any(r.startswith(carpeta + "/") for r in archivos)',
          '',
          '',
          'def revisar_plan(plan, archivos):',
          '    problemas = []',
          '    for numero, pedido in enumerate(plan, start=1):',
          '        if len(pedido["archivos"]) == 0:',
          '            problemas.append((numero, "sin-archivos"))',
          '        if len(pedido["archivos"]) > 3:',
          '            problemas.append((numero, "muy-grande"))',
          '        if any(not carpeta_existe(ruta, archivos) for ruta in pedido["archivos"]):',
          '            problemas.append((numero, "ruta-inventada"))',
          '        if pedido["prueba"].strip() == "":',
          '            problemas.append((numero, "sin-prueba"))',
          '    return problemas',
          '',
          '',
          'PLAN_APURADO = [',
          '    {"pide": "Agrega cupones", "archivos": ["src/cupones.js"], "prueba": ""},',
          '    {"pide": "Y que se vean bonitos", "archivos": [], "prueba": "que se vea bien"},',
          ']',
          'print(revisar_plan(PLAN_APURADO, proyecto.abrir()))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la prueba que le exiges a la IA',
        texto: [
          '"Pide pruebas" no sirve si la prueba no prueba nada. La mejor forma de dirigir a una IA es escribir **tú** la prueba de lo que quieres, y pedirle que haga el código que la pasa. Si tu prueba es floja, la IA puede entregar algo malo y la prueba igual pasa.',
          'La regla de Don Pepe: `aplicar_cupon(subtotal, codigo)` devuelve el subtotal con descuento. El cupón **DONPEPE10** da 10 % de descuento y se acepta en mayúsculas o minúsculas. El descuento es en pesos enteros, **redondeado hacia abajo** (de 12.345 el descuento es 1.234 y queda 11.111). Un código que no existe **no da error**: devuelve el subtotal igual.',
          'Escribe `prueba_cupon(aplicar_cupon)`: recibe una implementación y usa `assert` para revisarla. Las pruebas de esta lección le pasan la correcta (tu prueba no debe fallar) y **cuatro hechas por una IA con errores**: no acepta minúsculas, redondea mal, se cae con un código que no existe, y da descuento con cualquier código. Tu prueba debe atrapar a las cuatro. Pista general: los casos fáciles (10.000 → 9.000) no atrapan casi nada.',
        ],
        codigo: [
          'def prueba_cupon(aplicar_cupon):',
          '    assert aplicar_cupon(10000, "DONPEPE10") == 9000',
          '',
          '',
          '# La versión correcta, para que pruebes tu prueba con ella',
          'def cupon_correcto(subtotal, codigo):',
          '    if codigo.upper() == "DONPEPE10":',
          '        return subtotal - subtotal // 10',
          '    return subtotal',
          '',
          '',
          'prueba_cupon(cupon_correcto)',
          'print("Con la versión correcta, tu prueba pasa.")',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Con la versión correcta, tu prueba pasa',
            condicion: 'prueba_cupon(lambda s, c: s - s // 10 if c.upper() == "DONPEPE10" else s) is None',
          },
          {
            descripcion: 'Atrapa a la IA que no acepta minúsculas',
            condicion:
              'exec("def _atrapa(f):\\n    try:\\n        prueba_cupon(f)\\n    except Exception:\\n        return True\\n    return False", globals()) or _atrapa(lambda s, c: s - s // 10 if c == "DONPEPE10" else s)',
          },
          {
            descripcion: 'Atrapa a la IA que redondea mal (int(subtotal * 0.9))',
            condicion:
              'exec("def _atrapa(f):\\n    try:\\n        prueba_cupon(f)\\n    except Exception:\\n        return True\\n    return False", globals()) or _atrapa(lambda s, c: int(s * 0.9) if c.upper() == "DONPEPE10" else s)',
          },
          {
            descripcion: 'Atrapa a la IA que se cae con un código que no existe',
            condicion:
              'exec("def _atrapa(f):\\n    try:\\n        prueba_cupon(f)\\n    except Exception:\\n        return True\\n    return False", globals()) or _atrapa(lambda s, c: s - s // {"DONPEPE10": 10}[c.upper()])',
          },
          {
            descripcion: 'Atrapa a la IA que da descuento con cualquier código',
            condicion:
              'exec("def _atrapa(f):\\n    try:\\n        prueba_cupon(f)\\n    except Exception:\\n        return True\\n    return False", globals()) or _atrapa(lambda s, c: s - s // 10)',
          },
        ],
        pistas: [
          'Un caso por cada regla: `assert aplicar_cupon(10000, "donpepe10") == 9000` (minúsculas) y `assert aplicar_cupon(10000, "NOEXISTE") == 10000` (código que no existe: sin descuento y sin error).',
          'Para el redondeo usa un valor que no sea redondo: `assert aplicar_cupon(12345, "DONPEPE10") == 11111`. `int(12345 * 0.9)` da 11110: ahí se ve la diferencia.',
          'Con esas tres líneas más la que ya tenías atrapas a las cuatro versiones malas. Corre tu prueba con `cupon_correcto` para confirmar que la buena sí pasa.',
        ],
        solucion: [
          'def prueba_cupon(aplicar_cupon):',
          '    assert aplicar_cupon(10000, "DONPEPE10") == 9000',
          '    assert aplicar_cupon(10000, "donpepe10") == 9000',
          '    assert aplicar_cupon(12345, "DONPEPE10") == 11111',
          '    assert aplicar_cupon(10000, "NOEXISTE") == 10000',
          '',
          '',
          '# La versión correcta, para que pruebes tu prueba con ella',
          'def cupon_correcto(subtotal, codigo):',
          '    if codigo.upper() == "DONPEPE10":',
          '        return subtotal - subtotal // 10',
          '    return subtotal',
          '',
          '',
          'prueba_cupon(cupon_correcto)',
          'print("Con la versión correcta, tu prueba pasa.")',
        ].join('\n'),
      },
    ],
  }
);

// Ruta "Tu primer trabajo", lección 9: usar la IA en el trabajo sin poner en
// riesgo al cliente. Los ejercicios son las dos defensas prácticas antes de
// pegarle datos a una IA: tapar lo que se reconoce por su forma (correos,
// celulares) y, con datos en tabla, mandar solo lo necesario con alias.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = True\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    // Datos inventados de una panadería para el reto.
    const VENTAS = [
      'PERSONALES = {"nombre", "celular", "correo", "cedula", "direccion"}',
      '',
      'ventas = [',
      '    {"nombre": "Ana Gómez", "celular": "3001234567", "barrio": "Centro", "producto": "Pan", "valor": 8000},',
      '    {"nombre": "Luis Pérez", "celular": "3109876543", "barrio": "La Esperanza", "producto": "Torta", "valor": 45000},',
      '    {"nombre": "Ana Gómez", "celular": "3001234567", "barrio": "Centro", "producto": "Tinto", "valor": 2000},',
      ']',
    ];

    const CORREO = 'PATRON_CORREO = r"[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+"';

    return {
      id: 'ia-en-el-trabajo',
      titulo: 'Trabajar con IA sin poner en riesgo al cliente',
      pasos: [
        {
          id: 'idea',
          titulo: 'Tres reglas y una forma de aprender',
          texto: [
            'Usar IA en el trabajo es normal y te hace más rápido. Pero el cliente te paga a **ti**: tú respondes por lo que entregas. Tres reglas:',
            '**1. Sé transparente.** Si la empresa o el cliente preguntan, di que usas IA y para qué. Pregunta si hay herramientas que no se pueden usar: algunas empresas tienen reglas sobre esto. **2. Verifica todo.** Lee el código que te da, córrelo, pruébalo con casos raros. Si no lo puedes explicar, no lo entregues. **3. No subas datos privados.** Nombres, celulares, cédulas, correos, direcciones, contraseñas y claves de API de tus clientes no se pegan en una IA. En Colombia los datos personales están protegidos por ley (la Ley 1581 de 2012), y además es cuestión de confianza: el cliente no te dio sus datos para que los compartas.',
            'Para pedir ayuda con datos, usa **datos inventados** con la misma forma, o **anonimiza**: tapa lo que identifica a la persona y manda solo las columnas que la tarea necesita.',
            '**Aprender más rápido sin depender a ciegas**: pídele que te **explique** antes de que te dé la solución; escribe tú primero y pídele que **revise**; pregúntale «¿qué caso raro no estoy probando?»; y confirma lo importante en la **documentación oficial**. Una buena señal: cada semana necesitas preguntarle menos por lo mismo.',
          ],
          codigo: [
            'mal = "Revisa este error. El cliente es Ana Gómez, cel 300 123 4567, ana.gomez@correo.com"',
            'bien = "Revisa este error. El cliente es [CLIENTE], cel [CELULAR], [CORREO]"',
            '',
            'print("Así no:", mal)',
            'print("Así sí:", bien)',
            'print("Y después: leer la respuesta, correr el código y probarlo antes de entregarlo.")',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Tapar correos y celulares',
          texto: [
            'Antes de pegar un texto en una IA, tapa lo que se reconoce por su **forma**. Completa `anonimizar(texto)`: cambia cada correo por `[CORREO]` y cada celular colombiano por `[CELULAR]`, y devuelve el texto nuevo.',
            'El patrón del correo ya está en `PATRON_CORREO`. Tú escribe `PATRON_CELULAR`: un `3`, dos dígitos, tres dígitos y cuatro dígitos (10 en total), con espacios o guiones opcionales entre los grupos, y opcionalmente `+57` adelante (con o sin el `+`). Empieza con `(?<!\\d)` y termina con `(?!\\d)`: exigen que no haya un dígito justo antes ni justo después, para que no tape un pedazo de un número más largo y deje quietos los precios y los números de pedido.',
            'Fíjate en lo que **no** se puede tapar así: un nombre como «Ana Gómez» no tiene una forma fija. Por eso, cuando los datos vienen en tabla, es mejor elegir qué columnas mandar (eso es el reto).',
          ],
          codigo: [
            'import re',
            '',
            CORREO,
            'PATRON_CELULAR = r"ESCRIBE_AQUI_EL_PATRON"  # cámbialo por el patrón del celular',
            '',
            '',
            'def anonimizar(texto):',
            '    # Usa re.sub con cada patrón',
            '    return texto',
            '',
            '',
            'print(anonimizar("Ana (ana.gomez@correo.com, 300 123 4567) pidió el pedido 1234 por 45000"))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Tapa un correo', condicion: 'anonimizar("Escribir a ana.gomez@correo.com hoy") == "Escribir a [CORREO] hoy"' },
            { descripcion: 'Tapa un celular con espacios', condicion: 'anonimizar("Llamar al 300 123 4567") == "Llamar al [CELULAR]"' },
            { descripcion: 'Tapa un celular con +57 y guiones', condicion: 'anonimizar("Cel: +57 310-555-1234.") == "Cel: [CELULAR]."' },
            { descripcion: 'Tapa un celular escrito todo junto', condicion: 'anonimizar("3105551234") == "[CELULAR]"' },
            { descripcion: 'Tapa un celular con +57 pegado al número', condicion: 'anonimizar("Cel +573105551234") == "Cel [CELULAR]"' },
            { descripcion: 'No toca precios ni números de pedido', condicion: 'anonimizar("Pedido 1234 por 45000") == "Pedido 1234 por 45000"' },
            { descripcion: 'No toca un número largo que solo contiene un celular', condicion: 'anonimizar("Factura 9930012345678") == "Factura 9930012345678"' },
            {
              descripcion: 'Tapa varios datos en el mismo texto',
              condicion: 'anonimizar("Ana (ana@x.co, 3001234567) y Luis (luis@y.com)") == "Ana ([CORREO], [CELULAR]) y Luis ([CORREO])"',
            },
          ],
          pistas: [
            'La función es corta: `texto = re.sub(PATRON_CORREO, "[CORREO]", texto)`, lo mismo con `PATRON_CELULAR` y `"[CELULAR]"`, y `return texto`.',
            'Por partes: `3\\d{2}` son los tres primeros dígitos; `[\\s-]?` es un espacio o guion opcional; luego `\\d{3}`, otro separador y `\\d{4}`.',
            'El patrón completo: `r"(?<!\\d)(\\+?57[\\s-]?)?3\\d{2}[\\s-]?\\d{3}[\\s-]?\\d{4}(?!\\d)"`. ¿Por qué no `\\b`? En `+573105551234` el 7 y el 3 son dígitos pegados: no hay frontera de palabra entre ellos y `\\b3` no lo encontraría.',
          ],
          solucion: [
            'import re',
            '',
            CORREO,
            '# +57 opcional, y 3XX XXX XXXX con espacio o guion opcional entre grupos.',
            '# (?<!\\d) y (?!\\d): sin dígitos pegados antes ni después, para no tapar un pedazo',
            '# de un número más largo (una factura). \\b no sirve: en +573105551234 no hay',
            '# frontera de palabra entre el 57 y el 3.',
            'PATRON_CELULAR = r"(?<!\\d)(\\+?57[\\s-]?)?3\\d{2}[\\s-]?\\d{3}[\\s-]?\\d{4}(?!\\d)"',
            '',
            '',
            'def anonimizar(texto):',
            '    texto = re.sub(PATRON_CORREO, "[CORREO]", texto)',
            '    texto = re.sub(PATRON_CELULAR, "[CELULAR]", texto)',
            '    return texto',
            '',
            '',
            'print(anonimizar("Ana (ana.gomez@correo.com, 300 123 4567) pidió el pedido 1234 por 45000"))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: mandar solo lo necesario',
          texto: [
            'La panadería quiere que una IA le ayude a ver qué se vende en cada barrio. Para eso la IA **no necesita** nombres ni celulares. Crea `preparar_para_ia(filas, columnas)`, que devuelve una pareja `(filas_nuevas, alias)`.',
            'Cada fila nueva tiene `"cliente"` con un alias (`"Cliente 1"`, `"Cliente 2"`, …) y **solo** las columnas pedidas, en ese orden. El mismo nombre recibe siempre el mismo alias, numerado por orden de aparición: así la IA puede notar que un cliente compró dos veces sin saber quién es. `alias` es el diccionario `{nombre: alias}`, que **se queda en tu computador** para traducir la respuesta.',
            'Si alguna columna pedida está en `PERSONALES`, lanza `ValueError`: el programa no debe dejarte mandarla por descuido. No cambies las filas que recibes.',
          ],
          codigo: [
            ...VENTAS,
            '',
            '',
            'def preparar_para_ia(filas, columnas):',
            '    # Valida las columnas, asigna alias y arma filas nuevas',
            '    return [], {}',
            '',
            '',
            'filas_nuevas, alias = preparar_para_ia(ventas, ["barrio", "producto", "valor"])',
            'for fila in filas_nuevas:',
            '    print(fila)',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Arma las filas con alias y solo las columnas pedidas',
              condicion: 'preparar_para_ia(ventas, ["barrio", "producto"])[0] == [{"cliente": "Cliente 1", "barrio": "Centro", "producto": "Pan"}, {"cliente": "Cliente 2", "barrio": "La Esperanza", "producto": "Torta"}, {"cliente": "Cliente 1", "barrio": "Centro", "producto": "Tinto"}]',
            },
            { descripcion: 'Devuelve la tabla de alias', condicion: 'preparar_para_ia(ventas, ["valor"])[1] == {"Ana Gómez": "Cliente 1", "Luis Pérez": "Cliente 2"}' },
            {
              descripcion: 'Ningún nombre ni celular llega a las filas nuevas',
              condicion: 'all("Ana" not in str(f) and "300" not in str(f) for f in preparar_para_ia(ventas, ["barrio", "producto", "valor"])[0])',
            },
            { descripcion: 'Pedir el celular lanza ValueError', condicion: lanzaValueError('preparar_para_ia(ventas, ["producto", "celular"])') },
            {
              descripcion: 'No cambia las filas que recibe',
              condicion: '(lambda copia: (preparar_para_ia(ventas, ["valor"]), ventas == copia)[1])(__import__("copy").deepcopy(ventas))',
            },
            { descripcion: 'Sin filas devuelve listas vacías', condicion: 'preparar_para_ia([], ["valor"]) == ([], {})' },
          ],
          pistas: [
            'Valida primero: `prohibidas = [c for c in columnas if c in PERSONALES]` y, si hay alguna, `raise ValueError("No mandes datos personales: " + ", ".join(prohibidas))`.',
            'Para el alias: `if fila["nombre"] not in alias: alias[fila["nombre"]] = "Cliente " + str(len(alias) + 1)`.',
            'Cada fila nueva: `nueva = {"cliente": alias[fila["nombre"]]}` y luego `for columna in columnas: nueva[columna] = fila[columna]`.',
          ],
          solucion: [
            ...VENTAS,
            '',
            '',
            'def preparar_para_ia(filas, columnas):',
            '    prohibidas = [columna for columna in columnas if columna in PERSONALES]',
            '    if prohibidas:',
            '        raise ValueError("No mandes datos personales: " + ", ".join(prohibidas))',
            '    alias = {}',
            '    filas_nuevas = []',
            '    for fila in filas:',
            '        # El mismo nombre recibe el mismo alias: se conserva el patrón sin decir quién es.',
            '        if fila["nombre"] not in alias:',
            '            alias[fila["nombre"]] = "Cliente " + str(len(alias) + 1)',
            '        nueva = {"cliente": alias[fila["nombre"]]}',
            '        for columna in columnas:',
            '            nueva[columna] = fila[columna]',
            '        filas_nuevas.append(nueva)',
            '    return filas_nuevas, alias',
            '',
            '',
            'filas_nuevas, alias = preparar_para_ia(ventas, ["barrio", "producto", "valor"])',
            'for fila in filas_nuevas:',
            '    print(fila)',
          ].join('\n'),
        },
      ],
    };
  })()
);

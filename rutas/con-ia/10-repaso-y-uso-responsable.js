// Ruta "Programar con IA", lección 10 (cierre de la ruta). Mismo formato que la
// lección 1. El reto junta lo de la ruta: tapar secretos, correr el agente,
// revisar el diff, correr las pruebas y decidir. Las funciones diferencias y
// aceptar son las de la lección 8, copiadas para que esta lección se pueda
// hacer sola.
globalThis.Rutas.agregarLeccion(
  'con-ia',
  (() => {
    const tapar = [
      'def tapar_claves(texto):',
      '    texto = re.sub(r"\\bsk-[A-Za-z0-9_-]{8,}", "[TAPADO]", texto)',
      '    return re.sub(r"(clave|contraseña|password)\\s*=\\s*\\S+", r"\\1=[TAPADO]", texto, flags=re.IGNORECASE)',
    ];

    const ayudasDelReto = [
      'def diferencias(antes, despues):',
      '    cambios = {}',
      '    for ruta in sorted(set(antes) | set(despues)):',
      '        lineas_antes = antes.get(ruta, "").splitlines()',
      '        lineas_despues = despues.get(ruta, "").splitlines()',
      '        agregadas = [linea for linea in lineas_despues if linea not in lineas_antes]',
      '        quitadas = [linea for linea in lineas_antes if linea not in lineas_despues]',
      '        if agregadas or quitadas:',
      '            cambios[ruta] = {"agregadas": agregadas, "quitadas": quitadas}',
      '    return cambios',
      '',
      '',
      'def aceptar(antes, despues, prohibidos):',
      '    tocados = [ruta for ruta in prohibidos if antes.get(ruta) != despues.get(ruta)]',
      '    if tocados:',
      '        return {"aceptar": False, "motivo": "Tocó archivos prohibidos: " + ", ".join(tocados)}',
      '    pruebas = agente.correr_pruebas(despues)',
      '    if not pruebas.startswith("Pasaron") or "FALLÓ" in pruebas:',
      '        return {"aceptar": False, "motivo": "Las pruebas no pasan. " + pruebas}',
      '    return {"aceptar": True, "motivo": "Las pruebas pasan y no tocó archivos prohibidos."}',
      '',
      '',
      ...tapar,
    ];

    const datosDelReto = [
      'import re',
      'import agente',
      '',
      'TIENDA = agente.proyecto("tienda")',
      'PROHIBIDOS = ["prueba_tienda.py"]',
      'TAREA = "Arregla el error de la caja. Mi clave=abc123xyz es para el servidor"',
      '# Un proyecto cuyo error este agente no sabe arreglar',
      'ROTO = {**TIENDA, "tienda.py": "def total(pedido):\\n    return 0\\n"}',
    ];

    return {
      id: 'repaso-uso-responsable',
      titulo: 'Repaso y uso responsable',
      pasos: [
        {
          id: 'idea',
          titulo: 'Cuatro reglas para usar la IA bien',
          texto: [
            'Ya sabes cómo funciona un agente por dentro. Antes de cerrar la ruta, cuatro reglas para usarlo (a él y a cualquier IA, como Claude) sin hacerte daño.',
            '**1. Nunca le pegues claves ni contraseñas.** Todo lo que escribes viaja a servidores de otra empresa, y puede quedar guardado. Una clave de API, la contraseña de tu banco o los datos de un cliente no se pegan, ni "solo para que me ayude". Si alguna vez lo hiciste, cambia esa clave ya.',
            '**2. Verifica lo que dice.** Un modelo predice texto: puede inventar una función que no existe o sonar muy seguro estando equivocado (las alucinaciones). Compruébalo: corre el código, lee la documentación, pregunta en otra fuente.',
            '**3. Entiende el código antes de usarlo.** Si no sabes qué hace cada línea, no sabes qué más hace. Un agente que cambia archivos sin que lo revises es como dejar a un desconocido manejando tu tienda.',
            '**4. La IA ayuda a aprender, pero no reemplaza aprender.** Si le pides todo hecho, las pruebas de esta app pasarían, pero tú no sabrías hacerlo. Pídele que te explique, que te corrija o que te ponga ejercicios. Quien entiende, además, sabe cuándo la IA se equivoca.',
            'Una forma práctica de cumplir la primera regla: un programa que revisa tu texto **antes** de mandarlo y tapa lo que tiene forma de secreto. Corre el ejemplo: busca con `re.sub` algo que empiece por `sk-` (así empiezan muchas claves de API) y cualquier `clave=...` o `contraseña=...`.',
          ],
          codigo: [
            'import re',
            '',
            'mensaje = "Mi clave=abc123 no funciona y mi llave es sk-prueba1234567890. ¿Qué hago?"',
            '',
            '# Primero algo que empiece por "sk-" y siga con letras, números o guiones',
            'tapado = re.sub(r"\\bsk-[A-Za-z0-9_-]{8,}", "[TAPADO]", mensaje)',
            '# Después "clave=algo", "contraseña=algo" o "password=algo"',
            'tapado = re.sub(r"(clave|contraseña|password)\\s*=\\s*\\S+", r"\\1=[TAPADO]", tapado, flags=re.IGNORECASE)',
            '',
            'print("Antes:  ", mensaje)',
            'print("Después:", tapado)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Tapar los secretos',
          texto: [
            'Crea la función `tapar_claves(texto)`: devuelve el texto con los secretos reemplazados por `[TAPADO]`, y todo lo demás igual.',
            'Debe tapar dos cosas. Una: algo con forma de clave de API, que empiece por `sk-` y siga con ocho o más letras, números, `_` o `-`. Cuidado: la palabra "task-management" contiene `sk-`, pero no es una clave; por eso el patrón exige que `sk-` empiece una palabra (`\\b`). Dos: `clave=...`, `contraseña=...` o `password=...` (sin importar mayúsculas, y con espacios opcionales alrededor del `=`): se conserva el nombre y se tapa el valor, como en `clave=[TAPADO]`.',
            'Este programa no es perfecto: no atrapa todos los secretos posibles. Es una red de seguridad, no un permiso para pegar claves.',
          ],
          codigo: [
            'import re',
            '',
            '',
            'def tapar_claves(texto):',
            '    # Devuelve el texto con las claves tapadas con [TAPADO]',
            '    return texto',
            '',
            '',
            'print(tapar_claves("Mi clave=abc123 y mi llave sk-prueba1234567890"))',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Tapa una clave que empieza por sk-',
              condicion: 'tapar_claves("Usa sk-abc12345678 para entrar") == "Usa [TAPADO] para entrar"',
            },
            {
              descripcion: 'Tapa el valor de clave= y conserva el nombre',
              condicion: 'tapar_claves("clave=miSecreto99 y listo") == "clave=[TAPADO] y listo"',
            },
            {
              descripcion: 'Entiende contraseña y password, con espacios y mayúsculas',
              condicion: '"hola123" not in tapar_claves("Mi Contraseña = hola123") and "[TAPADO]" in tapar_claves("Mi Contraseña = hola123") and "xyz" not in tapar_claves("PASSWORD=xyz")',
            },
            {
              descripcion: 'Tapa las dos cosas en un mismo texto',
              condicion: 'tapar_claves("clave=xyz789 y sk-prueba1234567890") == "clave=[TAPADO] y [TAPADO]"',
            },
            {
              descripcion: 'Un texto sin secretos queda igual',
              condicion: 'tapar_claves("Arregla el error de la caja") == "Arregla el error de la caja"',
            },
            {
              descripcion: 'Una palabra que solo contiene sk- no es una clave',
              condicion: 'tapar_claves("el task-management-tool sirve") == "el task-management-tool sirve"',
            },
          ],
          pistas: [
            '`re.sub(patron, reemplazo, texto)` devuelve el texto con cada coincidencia del patrón cambiada por el reemplazo. Necesitas dos llamadas, una después de la otra.',
            'Para las claves de API: `texto = re.sub(r"\\bsk-[A-Za-z0-9_-]{8,}", "[TAPADO]", texto)`',
            'Para `clave=...`: `re.sub(r"(clave|contraseña|password)\\s*=\\s*\\S+", r"\\1=[TAPADO]", texto, flags=re.IGNORECASE)`. El `\\1` vuelve a escribir el nombre que coincidió.',
          ],
          solucion: [
            'import re',
            '',
            '',
            ...tapar,
            '',
            '',
            'print(tapar_claves("Mi clave=abc123 y mi llave sk-prueba1234567890"))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: del pedido a la decisión',
          texto: [
            'Es el reto final de la ruta: juntas todo lo que aprendiste en un solo flujo, como lo haría una persona responsable con un agente.',
            'Crea la función `revisar_trabajo(tarea, proyecto, prohibidos)`. Debe: **1.** tapar los secretos de la tarea con `tapar_claves` (antes de mandarla); **2.** correr el agente con `agente.ejecutar` y la tarea ya tapada; **3.** calcular el diff entre el proyecto original y el que quedó; **4.** correr las pruebas del proyecto nuevo; **5.** decidir con `aceptar`.',
            'Devuelve un diccionario con las claves `"tarea_enviada"` (el texto que de verdad se le mandó al agente), `"diff"`, `"pruebas"` (el texto de `agente.correr_pruebas`), `"aceptar"` y `"motivo"`. Las funciones `diferencias`, `aceptar` y `tapar_claves` ya están escritas arriba. Ojo: `diferencias` es un diff simplificado (compara líneas sin importar el orden), así que `aceptar` compara los archivos prohibidos completos.',
            'No devuelvas el proyecto como "aceptado" por confiar en lo que el agente responde. Mira el diff, mira las pruebas y decide tú: así se usa un agente.',
          ],
          codigo: [
            ...datosDelReto,
            '',
            '',
            ...ayudasDelReto,
            '',
            '',
            '# Crea aquí la función revisar_trabajo',
            '',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'La tarea que se le manda al agente ya no lleva la clave',
              condicion: '"abc123xyz" not in revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)["tarea_enviada"] and "[TAPADO]" in revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)["tarea_enviada"]',
            },
            {
              descripcion: 'Acepta el arreglo de la caja',
              condicion: 'revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)["aceptar"] is True',
            },
            {
              descripcion: 'El diff solo muestra tienda.py',
              condicion: 'list(revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)["diff"]) == ["tienda.py"]',
            },
            {
              descripcion: 'Trae el resultado de las pruebas',
              condicion: '"Pasaron 2 de 2" in revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)["pruebas"]',
            },
            {
              descripcion: 'Si el agente no logra arreglarlo, rechaza el cambio y lo explica',
              condicion: 'revisar_trabajo("Arregla", ROTO, PROHIBIDOS)["aceptar"] is False and "FALLÓ" in revisar_trabajo("Arregla", ROTO, PROHIBIDOS)["pruebas"] and len(revisar_trabajo("Arregla", ROTO, PROHIBIDOS)["motivo"]) > 0',
            },
            {
              descripcion: 'No modifica el proyecto original',
              condicion: '(revisar_trabajo(TAREA, TIENDA, PROHIBIDOS), TIENDA == agente.proyecto("tienda"))[1] is True',
            },
            {
              descripcion: 'Al agente le llega la tarea tapada, no la original',
              // Reemplaza agente.ejecutar por un espía que anota la tarea que recibe, y lo restaura siempre (try/finally).
              condicion:
                'exec("def _espiar():\\n    real = agente.ejecutar\\n    vistas = []\\n    def espia(tarea, *a, **k):\\n        vistas.append(tarea)\\n        return real(tarea, *a, **k)\\n    agente.ejecutar = espia\\n    try:\\n        revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)\\n    finally:\\n        agente.ejecutar = real\\n    return vistas", globals()) or (lambda v: len(v) >= 1 and all("abc123xyz" not in t for t in v))(_espiar())',
            },
            {
              descripcion: 'Tapa los secretos antes de correr el agente',
              condicion: '"tapar_claves(" in codigo.split("def revisar_trabajo")[-1] and "agente.ejecutar(" in codigo.split("def revisar_trabajo")[-1] and codigo.split("def revisar_trabajo")[-1].find("tapar_claves(") < codigo.split("def revisar_trabajo")[-1].find("agente.ejecutar(")',
            },
          ],
          pistas: [
            'Empieza por `tarea_enviada = tapar_claves(tarea)` y úsala (no `tarea`) en `agente.ejecutar(tarea_enviada, proyecto)`.',
            'El agente devuelve un diccionario: `resultado["proyecto"]` es el proyecto como quedó. Guárdalo en `nuevo`.',
            'Termina con `decision = aceptar(proyecto, nuevo, prohibidos)` y `return {"tarea_enviada": ..., "diff": diferencias(proyecto, nuevo), "pruebas": agente.correr_pruebas(nuevo), "aceptar": decision["aceptar"], "motivo": decision["motivo"]}`.',
          ],
          solucion: [
            ...datosDelReto,
            '',
            '',
            ...ayudasDelReto,
            '',
            '',
            'def revisar_trabajo(tarea, proyecto, prohibidos):',
            '    tarea_enviada = tapar_claves(tarea)',
            '    resultado = agente.ejecutar(tarea_enviada, proyecto)',
            '    nuevo = resultado["proyecto"]',
            '    decision = aceptar(proyecto, nuevo, prohibidos)',
            '    return {',
            '        "tarea_enviada": tarea_enviada,',
            '        "diff": diferencias(proyecto, nuevo),',
            '        "pruebas": agente.correr_pruebas(nuevo),',
            '        "aceptar": decision["aceptar"],',
            '        "motivo": decision["motivo"],',
            '    }',
            '',
            '',
            'informe = revisar_trabajo(TAREA, TIENDA, PROHIBIDOS)',
            'print("Se le mandó:", informe["tarea_enviada"])',
            'print("Cambió:", informe["diff"])',
            'print("¿Se acepta?", informe["aceptar"], "-", informe["motivo"])',
          ].join('\n'),
        },
      ],
    };
  })()
);

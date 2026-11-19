// Ruta "El oficio", lección 2: depurar en serio.
//
// Aquí el estudiante escribe sus propias pruebas (funciones con assert), así
// que las condiciones tienen que revisar una prueba: ¿falla con el código
// dañado y pasa con uno sano? Eso no cabe en una sola expresión, por eso
// comprobar() arma un trozo de Python que se ejecuta con exec y deja su
// respuesta en la variable "ok".
//
// Para "cambiar el código por debajo" se usa fn.__globals__: es el diccionario
// donde viven las funciones del estudiante. Cambiar una entrada ahí hace que su
// prueba llame a OTRA versión de la función (un arreglo correcto o la versión
// con el error). Siempre se restaura en el finally, pase lo que pase.

(function () {
  'use strict';

  // dict(globals()): una copia, así lo que defina el trozo no se mezcla con
  // las variables que ven las demás pruebas. "is True" porque el evaluador
  // solo aprueba con True exacto.
  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  // ---------- Práctica: el precio con puntos de miles ----------

  const PRECIO_CON_ERROR = [
    'def convertir_precio(texto):',
    '    # Convierte el precio que Don Pepe escribe en su hoja: "12.500" -> 12500',
    '    return int(float(texto))',
  ];

  // La prueba se corre dentro de un try: si la dejáramos explotar, el
  // programa se detendría con error y el evaluador no revisaría nada.
  const INICIO_PRACTICA = [
    '',
    '',
    '# Don Pepe dice que esto debería mostrar 12500',
    'print(convertir_precio("12.500"))',
    '',
    '# Corre tu prueba y cuenta si atrapó el error',
    'try:',
    '    prueba_precio_con_miles()',
    '    print("La prueba pasó")',
    'except Exception as error:',
    '    print("La prueba falló con", type(error).__name__, "(¡bien!: atrapó el error)")',
  ];

  // Corre la prueba del estudiante con otra versión de convertir_precio.
  // "esperado" dice si la prueba debe pasar (True) o fallar (False).
  const pruebaDelEstudianteCon = (version, esperado) =>
    comprobar([
      'g = prueba_precio_con_miles.__globals__',
      'real = g["convertir_precio"]',
      'g["convertir_precio"] = ' + version,
      'try:',
      '    prueba_precio_con_miles()',
      '    ok = ' + (esperado ? 'True' : 'False'),
      'except Exception:',
      '    ok = ' + (esperado ? 'False' : 'True'),
      'finally:',
      '    g["convertir_precio"] = real',
    ]);

  // ---------- Reto: el código que llega desordenado ----------

  const CATALOGO = [
    'PRODUCTOS = {',
    '    "AR01": {"nombre": "Arepa de queso", "precio": 3500},',
    '    "TI01": {"nombre": "Tinto", "precio": 2000},',
    '    "BU01": {"nombre": "Buñuelo", "precio": 1500},',
    '    "CA01": {"nombre": "Café en grano", "precio": 18000},',
    '}',
  ];

  const BUSCAR_CON_ERROR = ['def buscar_precio(codigo):', '    return PRODUCTOS[codigo]["precio"]'];

  const BUSCAR_ARREGLADO = [
    'def buscar_precio(codigo):',
    '    # Los clientes escriben el código como sea: " ti01", "Ar01 "...',
    '    limpio = codigo.strip().upper()',
    '    if limpio not in PRODUCTOS:',
    '        raise ValueError("No existe el producto " + limpio)',
    '    return PRODUCTOS[limpio]["precio"]',
  ];

  const TOTAL = [
    'def total_pedido(lineas):',
    '    total = 0',
    '    for linea in lineas:',
    '        total += buscar_precio(linea["codigo"]) * linea["cantidad"]',
    '    return total',
  ];

  const TICKET = [
    '# TICKET TIENDA-112: "Un cliente hizo un pedido por la página y salió esto:"',
    '#',
    '# Traceback (most recent call last):',
    '#   File "tienda.py", line 40, in <module>',
    '#     print(total_pedido(pedido_web))',
    '#   File "tienda.py", line 18, in total_pedido',
    '#     total += buscar_precio(linea["codigo"]) * linea["cantidad"]',
    '#   File "tienda.py", line 11, in buscar_precio',
    '#     return PRODUCTOS[codigo]["precio"]',
    "# KeyError: ' ti01'",
    '#',
    '# El pedido de la página era: [{"codigo": " ti01", "cantidad": 2}]',
  ];

  const PRUEBA_VIEJA = [
    '# Esta prueba ya existía: no la borres. Cuida que lo que servía siga sirviendo.',
    'def prueba_pedido_normal():',
    '    assert total_pedido([{"codigo": "AR01", "cantidad": 2}]) == 7000',
    '    assert total_pedido([]) == 0',
  ];

  const PRUEBA_NUEVA = [
    'def prueba_codigo_desordenado():',
    '    # El pedido del ticket, tal como llegó',
    '    assert total_pedido([{"codigo": " ti01", "cantidad": 2}]) == 4000',
    '    # Y otras formas de escribir mal un código que sí existe',
    '    assert total_pedido([{"codigo": "Ar01 ", "cantidad": 1}, {"codigo": "bu01", "cantidad": 2}]) == 6500',
  ];

  const retoCon = (buscar, pruebaNueva, llamadas) =>
    [
      ...TICKET,
      '',
      ...CATALOGO,
      '',
      '',
      ...buscar,
      '',
      '',
      ...TOTAL,
      '',
      '',
      ...PRUEBA_VIEJA,
      '',
      '',
      ...pruebaNueva,
      '',
      '',
      ...llamadas,
    ].join('\n');

  // La versión original (con el error) de las dos funciones, para revisar que
  // la prueba del estudiante la habría atrapado. Se cambian las dos porque el
  // arreglo puede estar en cualquiera de ellas.
  const pruebaContraLaVersionVieja = comprobar([
    ...BUSCAR_CON_ERROR,
    '',
    ...TOTAL,
    '',
    'g = prueba_codigo_desordenado.__globals__',
    'reales = (g["buscar_precio"], g["total_pedido"])',
    'g["buscar_precio"], g["total_pedido"] = buscar_precio, total_pedido',
    'try:',
    '    prueba_codigo_desordenado()',
    '    ok = False',
    'except Exception:',
    '    ok = True',
    'finally:',
    '    g["buscar_precio"], g["total_pedido"] = reales',
  ]);

  const correSinError = (llamada) => comprobar(['try:', '    ' + llamada, '    ok = True', 'except Exception:', '    ok = False']);

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'depurar',
    titulo: 'Depurar en serio',
    pasos: [
      {
        id: 'idea',
        titulo: 'Un traceback se lee de abajo hacia arriba',
        texto: [
          'Cuando un programa en Python se rompe, muestra un **traceback**: el camino que siguió hasta el error. Asusta al comienzo, pero es tu mejor pista. Se lee **de abajo hacia arriba**:',
          '**La última línea** dice qué pasó: el tipo de error y el dato culpable (`KeyError: \'ti01 \'` = "busqué la clave `\'ti01 \'` y no existe"). **Justo encima** está dónde explotó: archivo, línea y función. **Más arriba** está quién llamó a esa función, y quién llamó a esa otra, hasta llegar a tu código. Ojo: el lugar donde explota casi nunca es donde está la causa. Aquí `buscar_precio` está bien; el dato malo venía de afuera.',
          'Depurar no es cambiar cosas a ver si se arregla. Es un método: **1. Reproducir** el error con el caso más pequeño posible. **2. Aislar**: llamar directamente a la función sospechosa con ese dato. **3. Mirar los valores intermedios** con `print` (y `repr`, que muestra los espacios escondidos). **4. Escribir una prueba que falle** por culpa del error. **5. Arreglar**. **6. Ver la prueba pasar**: desde ahí, ese error no vuelve sin que alguien se entere.',
          'Ejecuta el ejemplo. El `try` solo está para que veas el traceback completo sin que el programa se detenga. Aquí cada renglón dice `tu_codigo.py` y el número de línea: búscalo en el editor (en tu computador, Python además copia debajo la línea de código). Fíjate en lo que muestra `repr`: el código del segundo producto trae minúsculas y un espacio al final.',
        ],
        codigo: [
          'import traceback',
          '',
          'PRODUCTOS = {',
          '    "AR01": {"nombre": "Arepa de queso", "precio": 3500},',
          '    "TI01": {"nombre": "Tinto", "precio": 2000},',
          '}',
          '',
          '',
          'def buscar_precio(codigo):',
          '    return PRODUCTOS[codigo]["precio"]',
          '',
          '',
          'def total_pedido(lineas):',
          '    total = 0',
          '    for linea in lineas:',
          '        total += buscar_precio(linea["codigo"]) * linea["cantidad"]',
          '    return total',
          '',
          '',
          '# El pedido llegó del formulario de la página: lo escribió un cliente',
          'pedido = [{"codigo": "AR01", "cantidad": 2}, {"codigo": "ti01 ", "cantidad": 1}]',
          '',
          'try:',
          '    print(total_pedido(pedido))',
          'except Exception:',
          '    # Sin el try, Python mostraría esto y se detendría.',
          '    print(traceback.format_exc())',
          '',
          '# Mirar los valores intermedios: ¿qué códigos llegaron exactamente?',
          'for linea in pedido:',
          '    print("Código recibido:", repr(linea["codigo"]))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Primero, una prueba que atrape el error',
        texto: [
          'Don Pepe reporta: *"Puse un producto de $12.500 y el sistema dice que vale $12"*. Ejecuta el código y lo verás. `float("12.500")` lee el punto como decimal (doce coma cinco), pero en Colombia ese punto separa los **miles**.',
          'Antes de arreglar, escribe una **prueba**: una función que use `assert` para decir qué **debería** pasar. `assert condición` no hace nada si la condición es verdadera, y lanza un `AssertionError` si es falsa. Por ejemplo: `assert convertir_precio("12.500") == 12500`.',
          'Completa `prueba_precio_con_miles()` con **al menos dos** `assert` con precios distintos (uno con puntos de miles). **No arregles todavía** `convertir_precio`: esta vez la prueba tiene que fallar, porque así sabes que de verdad atrapa el error. El final del código ya la corre y te cuenta si falló. Una prueba que nunca has visto fallar no te ha demostrado nada.',
        ],
        codigo: [
          ...PRECIO_CON_ERROR,
          '',
          '',
          'def prueba_precio_con_miles():',
          '    # Escribe aquí tus assert',
          '    pass',
          ...INICIO_PRACTICA,
        ].join('\n'),
        pruebas: [
          { descripcion: 'prueba_precio_con_miles es una función', condicion: 'callable(prueba_precio_con_miles)' },
          {
            descripcion: 'Con el código de hoy, tu prueba falla: atrapa el error',
            condicion: comprobar(['try:', '    prueba_precio_con_miles()', '    ok = False', 'except Exception:', '    ok = True']),
          },
          {
            descripcion: 'Con un arreglo correcto, tu prueba pasa',
            condicion: pruebaDelEstudianteCon('lambda texto: int(texto.replace(".", ""))', true),
          },
          {
            descripcion: 'Revisa más de un precio: un "arreglo" tramposo que siempre da 12500 no la pasa',
            condicion: pruebaDelEstudianteCon('lambda texto: 12500', false),
          },
          { descripcion: 'Usas assert', condicion: '"assert" in codigo' },
        ],
        pistas: [
          'Dentro de la función, cambia el `pass` por líneas que empiecen con `assert`, por ejemplo `assert convertir_precio("12.500") == 12500`.',
          'Agrega otro con un precio diferente, como `assert convertir_precio("800") == 800` o `assert convertir_precio("1.200.000") == 1200000`.',
          'Ejecuta: si la consola dice que la prueba falló con `AssertionError` (o `ValueError`), va bien. Si dice que pasó, tus `assert` no están revisando un precio con puntos de miles.',
        ],
        solucion: [
          ...PRECIO_CON_ERROR,
          '',
          '',
          'def prueba_precio_con_miles():',
          '    assert convertir_precio("12.500") == 12500',
          '    assert convertir_precio("800") == 800',
          '    assert convertir_precio("1.200.000") == 1200000',
          ...INICIO_PRACTICA,
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: del traceback al arreglo',
        texto: [
          'El ticket **TIENDA-112** está en los comentarios del código, con el traceback que vio el cliente. Léelo de abajo hacia arriba: ¿qué clave no existía? ¿En qué función explotó? ¿De dónde venía el dato?',
          'Haz el ciclo completo: **1.** Escribe `prueba_codigo_desordenado()` con el pedido del ticket (debe dar 4000) y al menos otro código mal escrito, como `"Ar01 "`. **2.** Arregla `buscar_precio` para que acepte el código con espacios y en minúsculas (`strip` y `upper`). **3.** Si el código de verdad no existe, en vez del `KeyError` confuso lanza un `ValueError` con un mensaje claro que incluya el código, por ejemplo `"No existe el producto ZZ99"`.',
          'Al final llama a las dos pruebas y muestra `"Las pruebas pasaron"`. La prueba vieja (`prueba_pedido_normal`) debe seguir pasando: arreglar algo y dañar otra cosa es el error más común en un trabajo.',
        ],
        codigo: retoCon(BUSCAR_CON_ERROR, ['# Escribe aquí prueba_codigo_desordenado'], [
          'prueba_pedido_normal()',
          'print("Las pruebas pasaron")',
        ]),
        pruebas: [
          { descripcion: 'Escribiste prueba_codigo_desordenado y ahora pasa', condicion: 'callable(prueba_codigo_desordenado) and ' + correSinError('prueba_codigo_desordenado()') },
          { descripcion: 'Tu prueba habría atrapado el error del ticket', condicion: pruebaContraLaVersionVieja },
          {
            descripcion: 'Los códigos con espacios o minúsculas funcionan',
            condicion: 'total_pedido([{"codigo": " ti01", "cantidad": 2}]) == 4000 and total_pedido([{"codigo": "ca01 ", "cantidad": 1}, {"codigo": "Bu01", "cantidad": 2}]) == 21000',
          },
          {
            descripcion: 'Un código que no existe lanza ValueError con un mensaje que lo nombra',
            condicion: comprobar(['try:', '    buscar_precio("zz99")', '    ok = False', 'except ValueError as error:', '    ok = "ZZ99" in str(error).upper()', 'except Exception:', '    ok = False']),
          },
          { descripcion: 'La prueba vieja sigue pasando', condicion: correSinError('prueba_pedido_normal()') },
          { descripcion: 'Al final corres las pruebas y muestras "Las pruebas pasaron"', condicion: '"prueba_codigo_desordenado()" in codigo and mostrado("Las pruebas pasaron")' },
        ],
        pistas: [
          'La prueba: `def prueba_codigo_desordenado():` y adentro `assert total_pedido([{"codigo": " ti01", "cantidad": 2}]) == 4000`, más otro `assert` con `"Ar01 "`.',
          'En `buscar_precio`, limpia primero: `limpio = codigo.strip().upper()`, y busca con `PRODUCTOS[limpio]`.',
          'Antes de buscar: `if limpio not in PRODUCTOS: raise ValueError("No existe el producto " + limpio)`. Y al final: `prueba_codigo_desordenado()` antes del `print`.',
        ],
        solucion: retoCon(BUSCAR_ARREGLADO, PRUEBA_NUEVA, [
          'prueba_pedido_normal()',
          'prueba_codigo_desordenado()',
          'print("Las pruebas pasaron")',
        ]),
      },
    ],
  });
})();

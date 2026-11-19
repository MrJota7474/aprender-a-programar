// Ruta "El oficio", lección 1: leer código que escribió otra persona.
//
// Los tres pasos usan el mismo "sistema de pedidos" de la tienda de Don Pepe,
// como pasa en una empresa: el código ya existe y tú llegas a cambiarlo. Por
// eso el sistema se arma una sola vez con piezas (las constantes de abajo) y
// cada paso le cambia solo lo que necesita.
//
// Va dentro de una función: en la página todas las lecciones son scripts
// clásicos que comparten el ámbito global, y dos "const" con el mismo nombre
// en archivos distintos romperían la página.

(function () {
  'use strict';

  const CATALOGO = [
    'PRODUCTOS = {',
    '    "AR01": {"nombre": "Arepa de queso", "precio": 3500},',
    '    "TI01": {"nombre": "Tinto", "precio": 2000},',
    '    "BU01": {"nombre": "Buñuelo", "precio": 1500},',
    '    "CA01": {"nombre": "Café en grano", "precio": 18000},',
    '}',
  ];

  // Las reglas del negocio, con el monto mínimo y el costo como parámetro:
  // la práctica le pide al estudiante cambiar justo estos dos valores.
  const reglas = (minimo, costo) => [
    'DESCUENTO_FRECUENTE = 0.10        # 10 % para clientes frecuentes',
    'COSTO_DOMICILIO = ' + costo,
    'MINIMO_DOMICILIO_GRATIS = ' + minimo + '   # desde este valor no se cobra domicilio',
  ];

  // El cuerpo de calcular_subtotal cambia en el reto: ahí está el error.
  const SUBTOTAL_BIEN = [
    'def calcular_subtotal(lineas):',
    '    subtotal = 0',
    '    for linea in lineas:',
    '        subtotal += buscar_precio(linea["codigo"]) * linea["cantidad"]',
    '    return subtotal',
  ];
  const SUBTOTAL_CON_ERROR = [
    'def calcular_subtotal(lineas):',
    '    subtotal = 0',
    '    for linea in lineas:',
    '        subtotal += buscar_precio(linea["codigo"]) * linea["cantidad"]',
    '        return subtotal',
  ];

  const funciones = (subtotal) => [
    'def buscar_precio(codigo):',
    '    return PRODUCTOS[codigo]["precio"]',
    '',
    '',
    ...subtotal,
    '',
    '',
    'def calcular_descuento(subtotal, es_frecuente):',
    '    if es_frecuente:',
    '        return round(subtotal * DESCUENTO_FRECUENTE)',
    '    return 0',
    '',
    '',
    'def calcular_domicilio(valor):',
    '    if valor >= MINIMO_DOMICILIO_GRATIS:',
    '        return 0',
    '    return COSTO_DOMICILIO',
    '',
    '',
    'def total_pedido(pedido):',
    '    subtotal = calcular_subtotal(pedido["lineas"])',
    '    con_descuento = subtotal - calcular_descuento(subtotal, pedido["frecuente"])',
    '    return con_descuento + calcular_domicilio(con_descuento)',
  ];

  const sistema = ({ minimo = 60000, costo = 5000, subtotal = SUBTOTAL_BIEN, encabezado }) =>
    [
      ...encabezado,
      '',
      ...CATALOGO,
      '',
      ...reglas(minimo, costo),
      '',
      '',
      ...funciones(subtotal),
    ].join('\n');

  const ENCABEZADO = [
    '# tienda.py — El sistema de pedidos de Don Pepe.',
    '# Lo escribió otra persona hace un año. Tú acabas de llegar.',
  ];

  // ---------- El reto: el recibo ----------
  // Dos funciones más, para que el sistema del reto se sienta como uno real:
  // más código del que hay que leer que del que hay que cambiar.
  const RECIBO = [
    '',
    '',
    'def formato_pesos(valor):',
    '    # 18000 -> "$18.000" (en Colombia los miles se separan con punto)',
    '    return "$" + f"{valor:,}".replace(",", ".")',
    '',
    '',
    'def recibo(pedido):',
    '    renglones = []',
    '    for linea in pedido["lineas"]:',
    '        producto = PRODUCTOS[linea["codigo"]]',
    '        valor = producto["precio"] * linea["cantidad"]',
    '        renglones.append(str(linea["cantidad"]) + " x " + producto["nombre"] + ": " + formato_pesos(valor))',
    '    renglones.append("Total: " + formato_pesos(total_pedido(pedido)))',
    '    return "\\n".join(renglones)',
  ];

  const INICIO_RETO = [
    '',
    '',
    '# ---- Punto de inicio ----',
    'pedido = {"lineas": [{"codigo": "AR01", "cantidad": 2}], "frecuente": False}',
    'print(recibo(pedido))',
  ];

  const sistemaDelReto = (subtotal) =>
    sistema({
      subtotal,
      encabezado: [
        ...ENCABEZADO,
        '#',
        '# TICKET TIENDA-87 (lo reportó Don Pepe):',
        '# "Una señora pidió 2 arepas de queso y 3 tintos. El recibo muestra',
        '#  bien cada producto, pero el total dice $12.000. ¡Le cobramos de menos!"',
      ],
    }) +
    '\n' +
    RECIBO.join('\n') +
    INICIO_RETO.join('\n');

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'leer-codigo-ajeno',
    titulo: 'Leer código ajeno',
    pasos: [
      {
        id: 'idea',
        titulo: 'Llegas y el código ya existe',
        texto: [
          'En tu primer trabajo casi nunca vas a empezar un proyecto desde cero. Vas a llegar a un sistema que ya funciona, que escribieron otras personas (algunas ya no están) y que tiene cientos o miles de líneas. Tu primera tarea real va a ser **entenderlo lo suficiente para cambiar una cosa sin dañar otra**.',
          'No se lee de arriba hacia abajo como un libro. Se lee como se sigue un mapa: **1. Busca el punto de inicio**: dónde empieza a correr el programa (el código suelto al final, un `main()`, el archivo que abre el servidor). **2. Sigue una sola función**: mira a quién llama, y entra solo a las que te importan para tu tarea. **3. Lee los nombres**: `calcular_domicilio` y `MINIMO_DOMICILIO_GRATIS` te dicen qué hacen antes de leer su cuerpo; para eso se escriben buenos nombres.',
          'Y la regla de oro: **pregúntale al código**. Si no sabes qué vale algo, no adivines: ejecútalo con un `print` y míralo. Leer y probar van juntos.',
          'Ejecuta este sistema. Empieza por el final (el punto de inicio), sigue `total_pedido` y fíjate en los `print` que muestran el camino del dato: así se ve por dentro lo que hace cada función.',
        ],
        codigo:
          sistema({ encabezado: ENCABEZADO }) +
          [
            '',
            '',
            '# ---- Punto de inicio: aquí empieza todo ----',
            'pedido = {"lineas": [{"codigo": "AR01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 3}], "frecuente": False}',
            '',
            '# Preguntarle al código: qué devuelve cada pieza por la que pasa el pedido',
            'subtotal = calcular_subtotal(pedido["lineas"])',
            'print("1. Subtotal:", subtotal)',
            'print("2. Descuento:", calcular_descuento(subtotal, pedido["frecuente"]))',
            'print("3. Domicilio:", calcular_domicilio(subtotal))',
            'print("Total del pedido:", total_pedido(pedido))',
          ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Cambiar una regla en el lugar correcto',
        texto: [
          'Don Pepe te escribe: *"Desde el lunes el domicilio cuesta $6.000, pero es gratis desde $50.000 (antes era desde $60.000)."*',
          'La tentación es meter un `if` nuevo donde primero se te ocurra. Lo profesional es **encontrar dónde vive esa regla** y cambiarla solo ahí. Lee el código: ¿qué nombres hablan del domicilio? Si la regla está en una constante con nombre, se cambia la constante y todo el sistema queda al día.',
          'Haz el cambio sin escribir números sueltos dentro de las funciones. Al final, ejecuta y mira que el pedido de ejemplo (que vale $52.000) ya no pague domicilio.',
        ],
        codigo:
          sistema({ encabezado: ENCABEZADO }) +
          [
            '',
            '',
            '# ---- Punto de inicio ----',
            'pedido = {"lineas": [{"codigo": "CA01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 8}], "frecuente": False}',
            'print("Total:", total_pedido(pedido))',
          ].join('\n'),
        pruebas: [
          { descripcion: 'El domicilio es gratis desde $50.000', condicion: 'calcular_domicilio(50000) == 0 and calcular_domicilio(52000) == 0' },
          { descripcion: 'Por debajo de $50.000 el domicilio cuesta $6.000', condicion: 'calcular_domicilio(49999) == 6000 and calcular_domicilio(0) == 6000' },
          {
            descripcion: 'El total de los pedidos ya usa la regla nueva',
            condicion:
              'total_pedido({"lineas": [{"codigo": "CA01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 8}], "frecuente": False}) == 52000 and total_pedido({"lineas": [{"codigo": "TI01", "cantidad": 1}], "frecuente": False}) == 8000',
          },
          {
            descripcion: 'Cambiaste las constantes, no metiste números sueltos en la función',
            condicion:
              'MINIMO_DOMICILIO_GRATIS == 50000 and COSTO_DOMICILIO == 6000 and not ({50000, 6000} & set(calcular_domicilio.__code__.co_consts))',
          },
        ],
        pistas: [
          'Busca los nombres en MAYÚSCULAS cerca del comienzo: en Python así se escriben las **constantes**, los valores que el resto del programa usa como reglas.',
          '`calcular_domicilio` compara contra `MINIMO_DOMICILIO_GRATIS` y devuelve `COSTO_DOMICILIO`. No hay que tocar la función.',
          'Cambia solo dos líneas: `COSTO_DOMICILIO = 6000` y `MINIMO_DOMICILIO_GRATIS = 50000`.',
        ],
        solucion:
          sistema({ encabezado: ENCABEZADO, minimo: 50000, costo: 6000 }) +
          [
            '',
            '',
            '# ---- Punto de inicio ----',
            'pedido = {"lineas": [{"codigo": "CA01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 8}], "frecuente": False}',
            'print("Total:", total_pedido(pedido))',
          ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el ticket del total equivocado',
        texto: [
          'Llega tu primer **ticket** (así se llama un reporte de un error o un pedido de cambio). Está arriba, en los comentarios del código: el recibo de 2 arepas y 3 tintos muestra bien cada producto, pero el total sale en $12.000.',
          'Haz las cuentas a mano: 2 × 3.500 + 3 × 2.000 = 13.000, más 5.000 de domicilio, son **$18.000**. Primero **reproduce** el error: cambia el pedido del punto de inicio por el del ticket y ejecuta. Luego sigue el camino del total: `recibo` → `total_pedido` → las funciones que llama. Usa `print` dentro de ellas si no ves el problema a simple vista.',
          'Arregla la causa (es un error de una sola línea) sin cambiar las reglas del negocio. Pregúntate también: ¿por qué nadie lo había notado en un año? Mira qué pedidos sí salían bien.',
        ],
        codigo: sistemaDelReto(SUBTOTAL_CON_ERROR),
        pruebas: [
          {
            descripcion: 'El pedido del ticket (2 arepas y 3 tintos) da $18.000',
            condicion: 'total_pedido({"lineas": [{"codigo": "AR01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 3}], "frecuente": False}) == 18000',
          },
          {
            descripcion: 'El subtotal suma todas las líneas del pedido',
            condicion:
              'calcular_subtotal([{"codigo": "BU01", "cantidad": 4}, {"codigo": "TI01", "cantidad": 1}, {"codigo": "CA01", "cantidad": 1}]) == 26000 and calcular_subtotal([]) == 0',
          },
          {
            descripcion: 'El recibo muestra el total correcto',
            condicion:
              'recibo({"lineas": [{"codigo": "AR01", "cantidad": 2}, {"codigo": "TI01", "cantidad": 3}], "frecuente": False}).endswith("Total: $18.000")',
          },
          {
            descripcion: 'Las reglas del negocio no cambiaron (descuento y domicilio)',
            condicion:
              'calcular_descuento(100000, True) == 10000 and calcular_descuento(100000, False) == 0 and calcular_domicilio(59999) == 5000 and calcular_domicilio(60000) == 0 and total_pedido({"lineas": [{"codigo": "CA01", "cantidad": 4}], "frecuente": True}) == 64800',
          },
        ],
        pistas: [
          '`recibo` arma bien cada renglón, así que el problema no está ahí: está en `total_pedido` o en alguna función que llama. Prueba `print(calcular_subtotal(pedido["lineas"]))` con el pedido del ticket.',
          'El subtotal da 7000: solo sumó la primera línea. En `calcular_subtotal`, mira con cuidado la **sangría** (los espacios al comienzo) del `return`.',
          'El `return` está dentro del `for`, así que la función termina en la primera vuelta. Quítale 4 espacios para que quede al nivel del `for`. Por eso nadie lo notó: los pedidos de un solo producto salían bien.',
        ],
        solucion: sistemaDelReto(SUBTOTAL_BIEN),
      },
    ],
  });
})();

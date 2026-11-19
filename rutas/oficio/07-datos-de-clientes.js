// Ruta "El oficio", lección 7: los datos de un cliente real (un CSV de Excel).
//
// El archivo va como texto dentro del código (el editor no tiene archivos),
// pero se lee con el módulo csv igual que si viniera de open(): por eso se
// envuelve en io.StringIO, que hace que un texto se comporte como un archivo.
//
// Los datos traen a propósito los problemas de siempre en un negocio pequeño:
// la marca invisible (BOM) que pone Excel, punto y coma como separador,
// puntos de miles, "$", espacios, mayúsculas mezcladas, filas vacías y un
// valor que no es un número.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  const PESOS_INICIAL = [
    'def pesos_a_entero(texto):',
    '    # "$ 12.500" -> 12500',
    '    return int(texto)',
  ];
  const PESOS = [
    'def pesos_a_entero(texto):',
    '    # "$ 12.500" -> 12500. En Colombia el punto separa los miles y la coma',
    '    # los centavos (que en pesos casi nunca se usan: se descartan).',
    '    limpio = texto.replace("$", "").replace(" ", "").replace(".", "")',
    '    limpio = limpio.split(",")[0]',
    '    return int(limpio)',
  ];

  const practica = (pesos) =>
    [
      ...pesos,
      '',
      '',
      'for valor in ["800", "12.500", "$ 1.200.000", " 3.500 ", "4.500,00", "sin dato"]:',
      '    try:',
      '        print(repr(valor), "->", pesos_a_entero(valor))',
      '    except ValueError:',
      '        print(repr(valor), "-> no es un número (ValueError)")',
    ].join('\n');

  // El archivo del reto. "﻿" se escribe así, como escape de Python,
  // porque es una letra invisible: en el editor no se vería.
  const VENTAS = [
    'import csv',
    'import io',
    '',
    '# ventas.csv, exportado de Excel por Don Pepe. "\\ufeff" es una marca',
    '# invisible (BOM) que Excel pone al comienzo del archivo.',
    'VENTAS = "\\ufeff" + """Vendedor;Fecha;Producto;Cantidad;Valor',
    ' maría gómez ;2026-11-02;Arepa de queso;3;10.500',
    'MARÍA GÓMEZ;2026-11-02;Tinto;5;$ 10.000',
    'Juan Pérez;2026-11-03;Café en grano;2;36.000',
    ';;;;',
    'juan pérez;2026-11-03;Buñuelo;4;sin dato',
    'Juan Pérez ;2026-11-04;"Jugo de lulo; grande";1;4.500,00',
    '"""',
  ];

  const REPORTE_INICIAL = [
    'def reporte_ventas(texto):',
    '    lector = csv.DictReader(io.StringIO(texto), delimiter=";")',
    '    for fila in lector:',
    '        # Antes de procesar, mira cómo llegan los datos',
    '        print(fila)',
    '    return {"total": 0, "por_vendedor": {}, "filas_con_error": []}',
  ];
  const REPORTE = [
    'def limpiar_nombre(nombre):',
    '    # " maría  gómez " -> "María Gómez": sin espacios de más y con mayúscula inicial',
    '    return " ".join(nombre.split()).title()',
    '',
    '',
    'def reporte_ventas(texto):',
    '    # Sin la marca invisible, la primera columna se llamaría "\\ufeffVendedor"',
    '    texto = texto.lstrip("\\ufeff")',
    '    lector = csv.DictReader(io.StringIO(texto), delimiter=";")',
    '    total = 0',
    '    por_vendedor = {}',
    '    filas_con_error = []',
    '    # El encabezado es la línea 1, así que la primera fila de datos es la 2',
    '    for numero, fila in enumerate(lector, start=2):',
    '        if all((valor or "").strip() == "" for valor in fila.values()):',
    '            continue  # fila vacía: Excel exporta ";;;;"',
    '        vendedor = limpiar_nombre(fila["Vendedor"])',
    '        try:',
    '            valor = pesos_a_entero(fila["Valor"])',
    '        except ValueError:',
    '            filas_con_error.append(numero)',
    '            continue',
    '        if vendedor == "":',
    '            filas_con_error.append(numero)',
    '            continue',
    '        total += valor',
    '        por_vendedor[vendedor] = por_vendedor.get(vendedor, 0) + valor',
    '    return {"total": total, "por_vendedor": por_vendedor, "filas_con_error": filas_con_error}',
  ];

  const reto = (reporte) =>
    [
      ...VENTAS,
      '',
      '',
      ...PESOS,
      '',
      '',
      ...reporte,
      '',
      '',
      'print(reporte_ventas(VENTAS))',
    ].join('\n');

  const lanzaValueError = (llamada) =>
    comprobar(['try:', '    ' + llamada, '    ok = False', 'except ValueError:', '    ok = True', 'except Exception:', '    ok = False']);

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'datos-de-clientes',
    titulo: 'Datos de clientes reales: CSV y Excel',
    pasos: [
      {
        id: 'idea',
        titulo: 'El archivo que te manda el cliente',
        texto: [
          'Uno de los trabajos más comunes para un negocio pequeño: *"Te mando el Excel de las ventas, ¿me sacas cuánto vendió cada quien?"*. Casi siempre llega como **CSV** (valores separados por comas): un archivo de texto con una fila por línea. Excel lo abre y lo guarda sin problema, y Python lo lee con el módulo `csv`.',
          'Ojo con lo que hace Excel en español: como la **coma** es el separador decimal, separa las columnas con **punto y coma** (`delimiter=";"`). Y los números llegan como **texto** y con formato colombiano: `"12.500"` es doce mil quinientos, no doce coma cinco.',
          '¿Por qué el módulo `csv` y no `linea.split(";")`? Porque un campo puede traer el separador adentro si va entre comillas (`"Jugo de lulo; grande"`), y `csv` lo entiende. `csv.DictReader` usa la primera fila como nombre de cada columna. Aquí el archivo va como texto en el código; en tu computador lo abrirías con `open("ventas.csv", encoding="utf-8-sig")`. Si sale `UnicodeDecodeError`, el archivo no está en UTF-8: el "CSV delimitado por comas" de Excel en Windows en español se guarda en Windows-1252. Pídele al cliente que lo guarde como **"CSV UTF-8"** o ábrelo con `encoding="cp1252"`.',
          'Una regla de oro: **nunca arregles a mano el archivo original**. Límpialo con código: el próximo mes llegará otro igual de desordenado, y tu programa lo arreglará en un segundo.',
        ],
        codigo: [
          'import csv',
          'import io',
          '',
          'VENTAS = """Vendedor;Fecha;Producto;Cantidad;Valor',
          'María Gómez;2026-11-02;Arepa de queso;3;10.500',
          'Juan Pérez;2026-11-02;"Jugo de lulo; grande";1;4.500',
          '"""',
          '',
          '# Cada fila como lista',
          'for fila in csv.reader(io.StringIO(VENTAS), delimiter=";"):',
          '    print(fila)',
          '',
          'print()',
          '# Cada fila como diccionario: la primera fila da los nombres',
          'for fila in csv.DictReader(io.StringIO(VENTAS), delimiter=";"):',
          '    print(fila["Vendedor"], "vendió", repr(fila["Valor"]))',
          '',
          'print()',
          'print("¿Por qué no split?", "Juan Pérez;2026-11-02;\\"Jugo de lulo; grande\\";1;4.500".split(";"))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Pesos colombianos a números',
        texto: [
          'Antes de sumar hay que convertir el texto en número. Completa `pesos_a_entero(texto)` para que entienda cómo escribe la plata un negocio en Colombia: `"800"` → 800, `"12.500"` → 12500, `"$ 1.200.000"` → 1200000, `" 3.500 "` → 3500.',
          'A veces Excel agrega centavos con coma: `"4.500,00"` → 4500 (quédate con lo que va antes de la coma). Y si el texto no es un número (`"sin dato"`, `""`), deja que `int` lance su `ValueError`: quien use la función decidirá qué hacer con esa fila. Es mejor un error claro que un 0 inventado que nadie nota en el reporte.',
        ],
        codigo: practica(PESOS_INICIAL),
        pruebas: [
          { descripcion: 'Convierte números con puntos de miles', condicion: 'pesos_a_entero("12.500") == 12500 and pesos_a_entero("1.200.000") == 1200000 and pesos_a_entero("800") == 800' },
          { descripcion: 'Ignora el signo $ y los espacios', condicion: 'pesos_a_entero("$ 1.200.000") == 1200000 and pesos_a_entero(" 3.500 ") == 3500 and pesos_a_entero("$18.000") == 18000' },
          { descripcion: 'Descarta los centavos que vienen después de la coma', condicion: 'pesos_a_entero("4.500,00") == 4500 and pesos_a_entero("$ 2.000,50") == 2000' },
          { descripcion: 'Devuelve un int (no un texto ni un decimal)', condicion: 'type(pesos_a_entero("12.500")) is int' },
          { descripcion: 'Un texto que no es número lanza ValueError', condicion: lanzaValueError('pesos_a_entero("sin dato")') + ' and ' + lanzaValueError('pesos_a_entero("")') },
        ],
        pistas: [
          'Quita lo que sobra con `replace`: `limpio = texto.replace("$", "").replace(" ", "").replace(".", "")`.',
          'Para los centavos, parte por la coma y quédate con lo primero: `limpio = limpio.split(",")[0]`.',
          'Termina con `return int(limpio)`. Con `"sin dato"` o `""`, `int` lanza `ValueError` sin que tengas que hacer nada.',
        ],
        solucion: practica(PESOS),
      },
      {
        id: 'reto',
        titulo: 'Reto: el reporte de ventas del mes',
        texto: [
          'Don Pepe te mandó `ventas.csv` (está en el código). Escribe `reporte_ventas(texto)` y devuelve un diccionario con: `"total"` (la suma de los valores que sí se pudieron leer), `"por_vendedor"` (cuánto vendió cada persona) y `"filas_con_error"` (los números de línea de las filas cuyo valor no se pudo leer o que no traen vendedor; el encabezado es la línea 1).',
          'Los problemas que vas a encontrar, como en un archivo real: **1.** La primera columna no se llama `"Vendedor"` sino `"\\ufeffVendedor"`, por la marca invisible de Excel: quítala con `texto.lstrip("\\ufeff")`. **2.** La misma persona aparece escrita de tres formas (`" maría gómez "`, `"MARÍA GÓMEZ"`): normaliza los nombres a `"María Gómez"`. **3.** Hay una fila vacía (`;;;;`): sáltala sin contarla como error. **4.** Un valor dice `"sin dato"`: anota su línea y sigue con las demás.',
          'Ejecuta primero el código tal como está: imprime cada fila como la entrega `DictReader`. Siempre mira los datos antes de procesarlos; fíjate bien en el nombre de la primera columna.',
        ],
        codigo: reto(REPORTE_INICIAL),
        pruebas: [
          { descripcion: 'El total suma solo los valores válidos: $61.000', condicion: 'reporte_ventas(VENTAS)["total"] == 61000' },
          {
            descripcion: 'Agrupa por vendedor aunque el nombre venga escrito distinto',
            condicion: 'reporte_ventas(VENTAS)["por_vendedor"] == {"María Gómez": 20500, "Juan Pérez": 40500}',
          },
          { descripcion: 'Anota la línea del valor que no se pudo leer (la 6), sin contar la fila vacía', condicion: 'reporte_ventas(VENTAS)["filas_con_error"] == [6]' },
          {
            descripcion: 'Funciona con otro archivo (sin la marca invisible y con una fila sin vendedor)',
            condicion:
              'reporte_ventas("Vendedor;Fecha;Producto;Cantidad;Valor\\nana ruiz;2026-11-05;Tinto;1;2.000\\n;2026-11-05;Tinto;1;2.000\\nANA RUIZ;2026-11-05;Pandebono;2;$ 5.000\\n") == {"total": 7000, "por_vendedor": {"Ana Ruiz": 7000}, "filas_con_error": [3]}',
          },
          { descripcion: 'Un archivo con solo el encabezado da un reporte vacío', condicion: 'reporte_ventas("Vendedor;Fecha;Producto;Cantidad;Valor\\n") == {"total": 0, "por_vendedor": {}, "filas_con_error": []}' },
        ],
        pistas: [
          'Al comenzar: `texto = texto.lstrip("\\ufeff")`. Para los nombres: `" ".join(nombre.split()).title()` quita los espacios de más y deja la mayúscula inicial.',
          'Para saber el número de línea, recorre con `for numero, fila in enumerate(lector, start=2):`. Una fila está vacía si `all(valor.strip() == "" for valor in fila.values())`: en ese caso, `continue`.',
          'Envuelve `pesos_a_entero(fila["Valor"])` en un `try`; en el `except ValueError:` haz `filas_con_error.append(numero)` y `continue`. Para sumar por vendedor: `por_vendedor[vendedor] = por_vendedor.get(vendedor, 0) + valor`.',
        ],
        solucion: reto(REPORTE),
      },
    ],
  });
})();

globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'comprensiones',
    titulo: 'Comprensiones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Listas y diccionarios en una línea',
        texto: [
          'Una **comprensión de lista** crea una lista nueva a partir de otra en una sola línea: `[expresión for elemento in lista]`.',
          'Si le agregas un `if` al final, solo entran los elementos que cumplen la condición: `[x for x in lista if x > 3]`.',
          'Con llaves y dos puntos se hace lo mismo para **diccionarios**: `{clave: valor for elemento in lista}`.',
          'Hacen lo mismo que un bucle con `append`, pero más corto una vez te acostumbras a leerlas: "dame X por cada elemento de la lista".',
        ],
        codigo: [
          'precios = [2500, 4000, 1500, 6000]',
          '',
          'dobles = [precio * 2 for precio in precios]',
          'print(dobles)',
          '',
          'baratos = [precio for precio in precios if precio < 3000]',
          'print(baratos)',
          '',
          'nombres = ["arepa", "tinto", "buñuelo"]',
          'largos = {nombre: len(nombre) for nombre in nombres}',
          'print(largos)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Los precios caros',
        texto: [
          'Con **una comprensión de lista** con `if`, crea la lista `caros` con los precios de más de 3000 de la lista `precios` (en el mismo orden).',
          'Después muestra `caros` en la consola.',
        ],
        codigo: [
          'precios = [2500, 4500, 1500, 3500, 3000, 5000]',
          '',
          'caros = []',
          '# Reemplaza la lista vacía por una comprensión con if',
          '',
          'print(caros)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'caros tiene 4500, 3500 y 5000, en ese orden', condicion: 'caros == [4500, 3500, 5000]' },
          {
            descripcion: 'Usas una comprensión de lista con for e if',
            condicion: 're.search(r"(?s)\\[.*\\bfor\\b.*\\bif\\b.*\\]", codigo) is not None',
          },
          { descripcion: 'No escribes los precios a mano en caros', condicion: 'codigo.count("4500") == 1' },
          { descripcion: 'Muestras la lista caros', condicion: 'mostrado([4500, 3500, 5000])' },
        ],
        pistas: [
          'La forma es `[precio for precio in precios if ...]`',
          'La condición es que el precio sea mayor que 3000 (3000 exacto no cuenta): `if precio > 3000`',
          'Completa: `caros = [precio for precio in precios if precio > 3000]`',
        ],
        solucion: [
          'precios = [2500, 4500, 1500, 3500, 3000, 5000]',
          '',
          'caros = [precio for precio in precios if precio > 3000]',
          '',
          'print(caros)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: precios con descuento',
        texto: [
          'Crea la función `precios_con_descuento` que recibe una lista de productos (diccionarios con `"nombre"` y `"precio"`) y devuelve un **diccionario** `{nombre: precio con descuento}`.',
          'El descuento es del 10 %: el precio final es el 90 % del original (`precio * 0.9`).',
          'Con una lista vacía devuelve un diccionario vacío. Lo ideal es usar una comprensión de diccionario, pero un bucle también vale.',
        ],
        codigo: [
          'productos = [',
          '    {"nombre": "Arepa", "precio": 3000},',
          '    {"nombre": "Jugo de lulo", "precio": 4500},',
          '    {"nombre": "Buñuelo", "precio": 1500},',
          ']',
          '',
          '# Crea aquí la función precios_con_descuento',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'precios_con_descuento es una función', condicion: 'callable(precios_con_descuento)' },
          {
            descripcion: 'Devuelve un diccionario con los tres nombres',
            condicion:
              'isinstance(precios_con_descuento(productos), dict) and sorted(precios_con_descuento(productos)) == ["Arepa", "Buñuelo", "Jugo de lulo"]',
          },
          {
            descripcion: 'La arepa queda en 2700 y el jugo en 4050',
            condicion:
              '(lambda r: abs(r["Arepa"] - 2700) < 0.01 and abs(r["Jugo de lulo"] - 4050) < 0.01 and abs(r["Buñuelo"] - 1350) < 0.01)(precios_con_descuento(productos))',
          },
          { descripcion: 'Con una lista vacía devuelve {}', condicion: 'precios_con_descuento([]) == {}' },
          {
            descripcion: 'Funciona con cualquier otra lista',
            condicion:
              '(lambda r: list(r) == ["Tinto"] and abs(r["Tinto"] - 900) < 0.01)(precios_con_descuento([{"nombre": "Tinto", "precio": 1000}]))',
          },
        ],
        pistas: [
          'La comprensión de diccionario tiene la forma `{clave: valor for elemento in lista}`',
          'La clave es `producto["nombre"]` y el valor es `producto["precio"] * 0.9`',
          'Todo junto: `return {producto["nombre"]: producto["precio"] * 0.9 for producto in lista}`',
        ],
        solucion: [
          'productos = [',
          '    {"nombre": "Arepa", "precio": 3000},',
          '    {"nombre": "Jugo de lulo", "precio": 4500},',
          '    {"nombre": "Buñuelo", "precio": 1500},',
          ']',
          '',
          '',
          'def precios_con_descuento(lista):',
          '    return {producto["nombre"]: producto["precio"] * 0.9 for producto in lista}',
        ].join('\n'),
      },
    ],
  }
);

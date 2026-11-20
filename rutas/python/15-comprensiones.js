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
          'Ya sabes duplicar cada precio con un bucle: creas `dobles = []`, recorres `precios` con `for` y haces `dobles.append(precio * 2)`. Son tres líneas. Python permite escribirlo en una: `dobles = [precio * 2 for precio in precios]`.',
          'Eso es una **comprensión de lista**: una lista nueva hecha a partir de otra, en una sola línea. La forma es `[qué_guardar for elemento in lista]`.',
          'Se lee casi en español: "dame `precio * 2` por cada `precio` de `precios`".',
          'Si le agregas un `if` al final, solo entran los elementos que cumplen la condición. `[precio for precio in precios if precio < 3000]` se lee: "dame cada precio de la lista, pero solo si es menor que 3000".',
          'Con llaves y dos puntos se hace lo mismo para **diccionarios**: `{nombre: len(nombre) for nombre in nombres}` crea un diccionario donde cada nombre es la clave y su largo es el valor.',
          'No hacen nada que un bucle no pueda hacer: son una forma más corta. Si te enredas, escribe primero el bucle y después conviértelo.',
          '**Error común:** poner el `if` en el lugar equivocado o usar paréntesis en vez de corchetes. `[precio if precio < 3000 for precio in precios]` da `SyntaxError`: el `if` que filtra va al final, después del `for`. Y `(precio for precio in precios)` no crea una lista: hacen falta los corchetes `[ ]`.',
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
          '# TODO: cambia [] por una comprensión que tome cada precio de precios',
          '#       solo si es mayor que 3000',
          '',
          'print(caros)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'caros tiene 4500, 3500 y 5000, en ese orden', condicion: 'caros == [4500, 3500, 5000]' },
          {
            descripcion: 'Usas una comprensión de lista con for e if',
            condicion: 're.search(r"(?s)\\[.*\\bfor\\b.*\\bif\\b.*\\]", codigo) is not None',
          },
          { descripcion: 'Los precios salen de la lista, no escritos a mano', condicion: 'codigo.count("4500") == 1' },
          { descripcion: 'La consola muestra la lista caros', condicion: 'mostrado([4500, 3500, 5000])' },
        ],
        pistas: [
          'Es como `baratos` en el ejemplo, pero con la condición al revés.',
          'La condición es "mayor que 3000" (3000 exacto no cuenta), así que usa `>` y no `>=`.',
          'Completa: `caros = [precio for precio in precios if precio ...]`',
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
          '# TODO: crea la función precios_con_descuento que recibe una lista',
          '#       y devuelve un diccionario {nombre: precio * 0.9}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Creaste la función precios_con_descuento', condicion: 'callable(precios_con_descuento)' },
          {
            descripcion: 'Devuelve un diccionario con los tres nombres',
            condicion:
              'isinstance(precios_con_descuento(productos), dict) and sorted(precios_con_descuento(productos)) == ["Arepa", "Buñuelo", "Jugo de lulo"]',
          },
          {
            descripcion: 'Con el 10 % de descuento: arepa 2700, jugo 4050 y buñuelo 1350',
            condicion:
              '(lambda r: abs(r["Arepa"] - 2700) < 0.01 and abs(r["Jugo de lulo"] - 4050) < 0.01 and abs(r["Buñuelo"] - 1350) < 0.01)(precios_con_descuento(productos))',
          },
          { descripcion: 'Con una lista vacía devuelve un diccionario vacío {}', condicion: 'precios_con_descuento([]) == {}' },
          {
            descripcion: 'Funciona con otra lista distinta (un tinto de 1000 queda en 900)',
            condicion:
              '(lambda r: list(r) == ["Tinto"] and abs(r["Tinto"] - 900) < 0.01)(precios_con_descuento([{"nombre": "Tinto", "precio": 1000}]))',
          },
        ],
        pistas: [
          'Piensa qué va a la izquierda de los dos puntos (la clave: el nombre) y qué a la derecha (el valor: el precio rebajado).',
          'Usa una comprensión de diccionario, `{clave: valor for producto in lista}`, como `largos` en el ejemplo. La clave es `producto["nombre"]`.',
          'Casi todo: `return {producto["nombre"]: producto["precio"] * ... for producto in lista}`',
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

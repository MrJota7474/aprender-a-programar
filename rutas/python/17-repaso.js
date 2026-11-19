// Igual que en la lección de errores: para comprobar que algo LANZA un
// ValueError se arma un trozo de Python con exec dentro de la condición.
globalThis.Rutas.agregarLeccion(
  'python',
  (() => {
    const lanzaValueError = (instrucciones) => {
      const trozo = 'try:\n    ' + instrucciones + '\nexcept ValueError as e:\n    ok = str(e)\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    return {
      id: 'repaso',
      titulo: 'Repaso: retos mezclados',
      pasos: [
        {
          id: 'reto-1',
          etiqueta: 'Reto 1',
          titulo: 'El inventario de Don Pepe',
          texto: [
            'Don Pepe quiere saber cómo está su inventario. Cada producto es un diccionario con `"nombre"`, `"precio"` y `"stock"` (cuántas unidades quedan).',
            'Crea la función `resumen_inventario` que recibe la lista y devuelve un diccionario con dos claves: `"agotados"`, la lista de nombres de los productos con stock 0 (en el mismo orden), y `"valor"`, lo que valen todas las unidades que hay (precio por stock de cada producto, sumado).',
            'Con una lista vacía devuelve `{"agotados": [], "valor": 0}`.',
          ],
          codigo: [
            'inventario = [',
            '    {"nombre": "Arepa", "precio": 3000, "stock": 10},',
            '    {"nombre": "Tinto", "precio": 1500, "stock": 0},',
            '    {"nombre": "Buñuelo", "precio": 1500, "stock": 4},',
            '    {"nombre": "Jugo de lulo", "precio": 4500, "stock": 0},',
            ']',
            '',
            '',
            'def resumen_inventario(productos):',
            '    # Devuelve {"agotados": [...], "valor": ...}',
            '    return None',
            '',
            '',
            'print(resumen_inventario(inventario))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'resumen_inventario es una función', condicion: 'callable(resumen_inventario)' },
            {
              descripcion: 'Devuelve un diccionario con "agotados" y "valor"',
              condicion:
                '(lambda r: isinstance(r, dict) and "agotados" in r and "valor" in r)(resumen_inventario(inventario))',
            },
            {
              descripcion: 'Los agotados son Tinto y Jugo de lulo, en ese orden',
              condicion: 'resumen_inventario(inventario)["agotados"] == ["Tinto", "Jugo de lulo"]',
            },
            { descripcion: 'El valor del inventario es 36000', condicion: 'resumen_inventario(inventario)["valor"] == 36000' },
            {
              descripcion: 'Con una lista vacía devuelve agotados vacío y valor 0',
              condicion: 'resumen_inventario([]) == {"agotados": [], "valor": 0}',
            },
            {
              descripcion: 'Funciona con otra lista',
              condicion:
                'resumen_inventario([{"nombre": "A", "precio": 100, "stock": 3}, {"nombre": "B", "precio": 50, "stock": 0}]) == {"agotados": ["B"], "valor": 300}',
            },
          ],
          pistas: [
            'Empieza con `agotados = []` y `valor = 0`, y recorre con `for producto in productos:`',
            'Si `producto["stock"] == 0`, agrega el nombre a `agotados`. Sin importar eso, suma `producto["precio"] * producto["stock"]` a `valor`.',
            'Al final: `return {"agotados": agotados, "valor": valor}`',
          ],
          solucion: [
            'inventario = [',
            '    {"nombre": "Arepa", "precio": 3000, "stock": 10},',
            '    {"nombre": "Tinto", "precio": 1500, "stock": 0},',
            '    {"nombre": "Buñuelo", "precio": 1500, "stock": 4},',
            '    {"nombre": "Jugo de lulo", "precio": 4500, "stock": 0},',
            ']',
            '',
            '',
            'def resumen_inventario(productos):',
            '    agotados = []',
            '    valor = 0',
            '    for producto in productos:',
            '        if producto["stock"] == 0:',
            '            agotados.append(producto["nombre"])',
            '        valor = valor + producto["precio"] * producto["stock"]',
            '    return {"agotados": agotados, "valor": valor}',
            '',
            '',
            'print(resumen_inventario(inventario))',
          ].join('\n'),
        },
        {
          id: 'reto-2',
          etiqueta: 'Reto 2',
          titulo: 'El cuaderno del fiado',
          texto: [
            'Don Pepe anota lo que le deben sus clientes. Crea la clase `Fiado` que recibe el `cliente` y guarda su nombre en `self.cliente` y una `self.deuda` que empieza en 0.',
            'El método `anotar(valor)` suma `valor` a la deuda. El método `abonar(valor)` la reduce.',
            '`abonar` debe lanzar un `ValueError` con mensaje claro si el valor es cero o negativo, o si es mayor que la deuda actual.',
          ],
          codigo: [
            '# Crea aquí la clase Fiado',
            'class Fiado:',
            '    pass',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Fiado es una clase', condicion: 'isinstance(Fiado, type)' },
            {
              descripcion: 'Guarda el cliente y la deuda empieza en 0',
              condicion: 'Fiado("Marta").cliente == "Marta" and Fiado("Marta").deuda == 0',
            },
            {
              descripcion: 'anotar suma a la deuda (5000 + 3000 = 8000)',
              condicion: '(lambda f: (f.anotar(5000), f.anotar(3000), f.deuda)[-1])(Fiado("Luis")) == 8000',
            },
            {
              descripcion: 'abonar resta de la deuda (5000 - 2000 = 3000)',
              condicion: '(lambda f: (f.anotar(5000), f.abonar(2000), f.deuda)[-1])(Fiado("Luis")) == 3000',
            },
            {
              descripcion: 'Se puede abonar toda la deuda',
              condicion: '(lambda f: (f.anotar(1000), f.abonar(1000), f.deuda)[-1])(Fiado("Luis")) == 0',
            },
            {
              descripcion: 'abonar(0) lanza ValueError con mensaje',
              condicion: lanzaValueError('f = Fiado("Ana"); f.anotar(1000); f.abonar(0)'),
            },
            {
              descripcion: 'abonar un valor negativo lanza ValueError',
              condicion: lanzaValueError('f = Fiado("Ana"); f.anotar(1000); f.abonar(-50)'),
            },
            {
              descripcion: 'Abonar más de lo que se debe lanza ValueError',
              condicion: lanzaValueError('f = Fiado("Ana"); f.anotar(1000); f.abonar(1500)'),
            },
            {
              descripcion: 'Un abono rechazado no cambia la deuda',
              condicion: `(lambda ns: (exec(${JSON.stringify("f = Fiado('A'); f.anotar(1000)\ntry:\n    f.abonar(1500)\nexcept ValueError:\n    pass")}, globals(), ns), ns["f"].deuda)[1])({}) == 1000`,
            },
            {
              descripcion: 'Cada cliente tiene su propia deuda',
              condicion: '(lambda a, b: (a.anotar(700), b.deuda)[-1])(Fiado("A"), Fiado("B")) == 0',
            },
          ],
          pistas: [
            'En `__init__(self, cliente)` guarda `self.cliente = cliente` y `self.deuda = 0`',
            '`anotar` es corto: `self.deuda = self.deuda + valor`',
            'En `abonar`, primero valida: `if valor <= 0 or valor > self.deuda:` y adentro `raise ValueError("...")`. Después resta.',
          ],
          solucion: [
            'class Fiado:',
            '    def __init__(self, cliente):',
            '        self.cliente = cliente',
            '        self.deuda = 0',
            '',
            '    def anotar(self, valor):',
            '        self.deuda = self.deuda + valor',
            '',
            '    def abonar(self, valor):',
            '        if valor <= 0 or valor > self.deuda:',
            '            raise ValueError("El abono debe ser positivo y no mayor que la deuda")',
            '        self.deuda = self.deuda - valor',
            '',
            '',
            'marta = Fiado("Marta")',
          ].join('\n'),
        },
        {
          id: 'reto-3',
          etiqueta: 'Reto 3',
          titulo: 'El producto más caro',
          texto: [
            'Crea la función `producto_mas_caro(productos, categoria=None)`. Recibe una lista de diccionarios con `"nombre"`, `"precio"` y `"categoria"`, y devuelve el **nombre** del producto con el precio más alto.',
            'Si se le pasa `categoria`, solo mira los productos de esa categoría. Si no hay ningún producto que revisar (lista vacía o categoría que no existe), devuelve `None`.',
            'Te sirven una comprensión de lista para filtrar y `max()` con `key=lambda`.',
          ],
          codigo: [
            'productos = [',
            '    {"nombre": "Arepa", "precio": 3000, "categoria": "comida"},',
            '    {"nombre": "Jugo de lulo", "precio": 4500, "categoria": "bebida"},',
            '    {"nombre": "Tinto", "precio": 1500, "categoria": "bebida"},',
            '    {"nombre": "Almojábana", "precio": 3500, "categoria": "comida"},',
            ']',
            '',
            '',
            'def producto_mas_caro(lista, categoria=None):',
            '    # Devuelve el nombre del más caro (o None si no hay)',
            '    return None',
            '',
            '',
            'print(producto_mas_caro(productos))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'producto_mas_caro es una función', condicion: 'callable(producto_mas_caro)' },
            {
              descripcion: 'Sin categoría devuelve "Jugo de lulo"',
              condicion: 'producto_mas_caro(productos) == "Jugo de lulo"',
            },
            {
              descripcion: 'En la categoría "comida" devuelve "Almojábana"',
              condicion: 'producto_mas_caro(productos, "comida") == "Almojábana"',
            },
            {
              descripcion: 'Acepta la categoría con nombre: categoria="bebida"',
              condicion: 'producto_mas_caro(productos, categoria="bebida") == "Jugo de lulo"',
            },
            { descripcion: 'Con una lista vacía devuelve None', condicion: 'producto_mas_caro([]) is None' },
            {
              descripcion: 'Con una categoría que no existe devuelve None',
              condicion: 'producto_mas_caro(productos, "postre") is None',
            },
            {
              descripcion: 'Funciona con otra lista',
              condicion:
                'producto_mas_caro([{"nombre": "X", "precio": 10, "categoria": "a"}, {"nombre": "Y", "precio": 99, "categoria": "a"}, {"nombre": "Z", "precio": 500, "categoria": "b"}], "a") == "Y"',
            },
          ],
          pistas: [
            'Si hay categoría, filtra: `candidatos = [p for p in lista if p["categoria"] == categoria]`. Si no, `candidatos = lista`.',
            'Si `candidatos` está vacía (`len(candidatos) == 0`), devuelve `None` antes de llamar a `max()`, porque `max()` de una lista vacía da error.',
            'El más caro: `max(candidatos, key=lambda p: p["precio"])["nombre"]`',
          ],
          solucion: [
            'productos = [',
            '    {"nombre": "Arepa", "precio": 3000, "categoria": "comida"},',
            '    {"nombre": "Jugo de lulo", "precio": 4500, "categoria": "bebida"},',
            '    {"nombre": "Tinto", "precio": 1500, "categoria": "bebida"},',
            '    {"nombre": "Almojábana", "precio": 3500, "categoria": "comida"},',
            ']',
            '',
            '',
            'def producto_mas_caro(lista, categoria=None):',
            '    if categoria is None:',
            '        candidatos = lista',
            '    else:',
            '        candidatos = [p for p in lista if p["categoria"] == categoria]',
            '    if len(candidatos) == 0:',
            '        return None',
            '    return max(candidatos, key=lambda p: p["precio"])["nombre"]',
            '',
            '',
            'print(producto_mas_caro(productos))',
          ].join('\n'),
        },
      ],
    };
  })()
);

globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'diccionarios',
    titulo: 'Diccionarios',
    pasos: [
      {
        id: 'idea',
        titulo: 'Datos con etiqueta',
        texto: [
          'Piensa en la ficha de un estudiante: dice "Nombre: Andrés", "Edad: 16", "Ciudad: Barranquilla". Cada dato tiene una etiqueta y un valor. En Python esa ficha es un diccionario.',
          'Un **diccionario** agrupa varios datos sobre una misma cosa. La etiqueta de cada dato se llama **clave** (`"nombre"`) y lo que guarda es su **valor** (`"Andrés"`).',
          'Se escribe entre llaves `{ }`, con pares `"clave": valor` separados por comas.',
          'Para leer un valor se escribe la clave entre corchetes: `estudiante["nombre"]` da `"Andrés"`. A diferencia de una lista, no se busca por posición sino por etiqueta.',
          'Con `=` se cambia un valor (`estudiante["edad"] = 17`). Si la clave no existía, se agrega (`estudiante["grado"] = 11`).',
          '**Error común:** pedir una clave que no existe o que está escrita distinto. `estudiante["Nombre"]` (con mayúscula) falla con `KeyError: \'Nombre\'` (esa clave no está). Las claves deben escribirse exactamente igual, con las mismas mayúsculas y tildes.',
        ],
        codigo: [
          'estudiante = {',
          '    "nombre": "Andrés",',
          '    "edad": 16,',
          '    "ciudad": "Barranquilla",',
          '}',
          '',
          'print(estudiante["nombre"])',
          '',
          'estudiante["edad"] = 17   # cambiar un valor',
          'estudiante["grado"] = 11  # agregar uno nuevo',
          'print(estudiante)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un producto',
        texto: [
          'Crea un diccionario `producto` con dos claves: `"nombre"` (un texto) y `"precio"` (un número).',
          'Después muestra en la consola solo el nombre del producto.',
        ],
        codigo: [
          '# TODO: crea el diccionario producto con las claves "nombre" y "precio"',
          '',
          '# TODO: muestra solo el nombre del producto',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'producto es un diccionario (va entre llaves)', condicion: 'isinstance(producto, dict)' },
          {
            descripcion: 'La clave "nombre" guarda un texto',
            condicion: 'isinstance(producto.get("nombre"), str)',
          },
          {
            descripcion: 'La clave "precio" guarda un número (sin comillas)',
            condicion: 'type(producto.get("precio")) in (int, float)',
          },
          {
            descripcion: 'La consola muestra el nombre, leído con producto["nombre"]',
            condicion: 'mostrado(producto["nombre"]) and re.search(r"producto\\s*\\[\\s*.nombre.\\s*\\]", codigo) is not None',
          },
        ],
        pistas: [
          'Copia la forma de `estudiante` del ejemplo, pero con solo dos datos.',
          'Va entre llaves, con pares `"clave": valor`. El texto lleva comillas; el precio no.',
          'Casi listo: `producto = {"nombre": "Arepa", "precio": 3000}` y luego `print(producto[...])`',
        ],
        solucion: ['producto = {"nombre": "Arepa", "precio": 3000}', 'print(producto["nombre"])'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: el carrito',
        texto: [
          'Este reto junta funciones, listas, bucles y diccionarios.',
          'Crea la función `total_carrito` que recibe una lista de productos y devuelve la suma de sus precios.',
          'Debe funcionar con **cualquier** lista, incluso una vacía (en ese caso devuelve 0).',
        ],
        codigo: [
          'carrito = [',
          '    {"nombre": "Arepa", "precio": 3000},',
          '    {"nombre": "Jugo de lulo", "precio": 4500},',
          '    {"nombre": "Buñuelo", "precio": 1500},',
          ']',
          '',
          '# TODO: crea la función total_carrito que recibe una lista',
          '#   1. empieza un total en 0',
          '#   2. recorre la lista con un for y suma el "precio" de cada producto',
          '#   3. devuelve el total con return',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Creaste la función total_carrito', condicion: 'callable(total_carrito)' },
          { descripcion: 'El carrito del ejemplo suma 9000', condicion: 'total_carrito(carrito) == 9000' },
          { descripcion: 'Un carrito vacío suma 0', condicion: 'total_carrito([]) == 0' },
          {
            descripcion: 'Funciona con otro carrito distinto (100 + 250 = 350)',
            condicion:
              'total_carrito([{"nombre": "A", "precio": 100}, {"nombre": "B", "precio": 250}]) == 350',
          },
        ],
        pistas: [
          'Es el mismo reto de sumar la cuenta de la lección de bucles, pero cada elemento es un diccionario y va dentro de una función.',
          'Empieza con `def total_carrito(lista):` y `total = 0`. Recorre con `for producto in lista:` y lee el precio con `producto["precio"]`.',
          'En cada vuelta: `total = total + producto["precio"]`. Al final, fuera del bucle pero dentro de la función, `return total`.',
        ],
        solucion: [
          'carrito = [',
          '    {"nombre": "Arepa", "precio": 3000},',
          '    {"nombre": "Jugo de lulo", "precio": 4500},',
          '    {"nombre": "Buñuelo", "precio": 1500},',
          ']',
          '',
          '',
          'def total_carrito(lista):',
          '    total = 0',
          '    for producto in lista:',
          '        total = total + producto["precio"]',
          '    return total',
        ].join('\n'),
      },
    ],
  }
);

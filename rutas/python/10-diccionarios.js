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
          'Un **diccionario** agrupa varios datos sobre una misma cosa. Cada dato tiene una etiqueta (la **clave**) y un valor.',
          'Se escribe entre llaves `{ }`, con pares `"clave": valor` separados por comas.',
          'Para leer o cambiar un valor se usa la clave entre corchetes: `estudiante["nombre"]`.',
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
        codigo: '# Crea aquí el diccionario producto\n',
        pruebas: [
          { descripcion: 'producto es un diccionario', condicion: 'isinstance(producto, dict)' },
          {
            descripcion: 'producto["nombre"] es un texto',
            condicion: 'isinstance(producto.get("nombre"), str)',
          },
          {
            descripcion: 'producto["precio"] es un número',
            condicion: 'type(producto.get("precio")) in (int, float)',
          },
          { descripcion: 'Muestras el nombre del producto', condicion: 'mostrado(producto["nombre"])' },
        ],
        pistas: [
          'El diccionario se crea con llaves: `producto = {"nombre": "Arepa", "precio": 3000}`',
          'Para mostrar solo el nombre: `print(producto["nombre"])`',
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
          '# Crea aquí la función total_carrito',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'total_carrito es una función', condicion: 'callable(total_carrito)' },
          { descripcion: 'total_carrito(carrito) devuelve 9000', condicion: 'total_carrito(carrito) == 9000' },
          { descripcion: 'Con una lista vacía devuelve 0', condicion: 'total_carrito([]) == 0' },
          {
            descripcion: 'Funciona con cualquier otra lista',
            condicion:
              'total_carrito([{"nombre": "A", "precio": 100}, {"nombre": "B", "precio": 250}]) == 350',
          },
        ],
        pistas: [
          'Empieza así: `def total_carrito(lista):` y adentro crea `total = 0`',
          'Recorre la lista con `for producto in lista:`',
          'En cada vuelta suma el precio: `total = total + producto["precio"]`. Al final, fuera del bucle, `return total`',
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

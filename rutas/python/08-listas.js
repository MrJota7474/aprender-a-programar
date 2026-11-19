globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'listas',
    titulo: 'Listas',
    pasos: [
      {
        id: 'idea',
        titulo: 'Varios valores en una variable',
        texto: [
          'Una **lista** guarda varios valores en orden. Se escribe entre corchetes `[ ]`, con los valores separados por comas.',
          'Cada valor tiene una posición, y se cuenta **desde 0**: el primero es `frutas[0]`. Con `-1` se pide el último.',
          '`len()` dice cuántos valores hay y `.append()` agrega uno al final.',
        ],
        codigo: [
          'frutas = ["mango", "lulo", "guanábana"]',
          '',
          'print(frutas[0])    # el primero está en la posición 0',
          'print(frutas[-1])   # el último',
          'print(len(frutas))  # cuántos hay',
          '',
          'frutas.append("maracuyá")  # agrega uno al final',
          'print(frutas)',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Tres ciudades',
        texto: [
          'Crea una lista `ciudades` con los nombres de tres ciudades de Colombia.',
          'Muestra la primera ciudad y después muestra cuántas ciudades hay usando `len()`.',
        ],
        codigo: '# Crea aquí la lista ciudades\n',
        pruebas: [
          {
            descripcion: 'ciudades es una lista con 3 elementos',
            condicion: 'isinstance(ciudades, list) and len(ciudades) == 3',
          },
          { descripcion: 'Muestras la primera ciudad', condicion: 'mostrado(ciudades[0])' },
          { descripcion: 'Muestras cuántas hay (3)', condicion: 'mostrado(3)' },
          { descripcion: 'Usas len()', condicion: 're.search(r"\\blen\\s*\\(", codigo) is not None' },
        ],
        pistas: [
          'La lista se crea así: `ciudades = ["Cali", "Tunja", "Leticia"]`',
          'La primera está en la posición 0: `print(ciudades[0])`',
          'La cantidad: `print(len(ciudades))`',
        ],
        solucion: [
          'ciudades = ["Cali", "Tunja", "Leticia"]',
          'print(ciudades[0])',
          'print(len(ciudades))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la lista del mercado',
        texto: [
          'Agrega `"café"` y `"huevos"` (en ese orden) al final de `mercado` usando `.append()`.',
          'Después crea la variable `ultimo` con el último elemento de la lista, usando la posición `-1`.',
        ],
        codigo: [
          'mercado = ["arroz", "panela"]',
          '',
          '# 1. Agrega "café" y "huevos"',
          '',
          '# 2. Guarda el último elemento en la variable ultimo',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'mercado tiene 4 elementos', condicion: 'len(mercado) == 4' },
          {
            descripcion: 'Los dos últimos son "café" y "huevos"',
            condicion: 'mercado[2:] == ["café", "huevos"]',
          },
          { descripcion: 'ultimo vale "huevos"', condicion: 'ultimo == "huevos"' },
          {
            descripcion: 'Tomas el último de la lista (no lo escribes a mano)',
            condicion: 're.search(r"ultimo\\s*=\\s*mercado\\s*\\[", codigo) is not None',
          },
        ],
        pistas: [
          'Cada elemento se agrega con su propio append: `mercado.append("café")`',
          'La posición `-1` siempre es el último elemento.',
          '`ultimo = mercado[-1]`',
        ],
        solucion: [
          'mercado = ["arroz", "panela"]',
          '',
          'mercado.append("café")',
          'mercado.append("huevos")',
          '',
          'ultimo = mercado[-1]',
        ].join('\n'),
      },
    ],
  }
);

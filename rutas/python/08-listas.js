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
          'Para guardar tres frutas podrías crear `fruta1`, `fruta2` y `fruta3`. Pero ¿y si son 100? Mejor guardarlas todas juntas: `frutas = ["mango", "lulo", "guanábana"]`.',
          'Eso es una **lista**: varios valores guardados en orden dentro de una sola variable. Se escribe entre corchetes `[ ]`, con los valores separados por comas. A cada valor se le llama **elemento**.',
          'Cada elemento tiene una **posición** (en inglés, índice), y se cuenta **desde 0**: el primero es `frutas[0]`, el segundo `frutas[1]`. Con `-1` se pide el último, sin importar cuántos haya.',
          '`len(frutas)` dice cuántos elementos hay. `frutas.append("maracuyá")` agrega uno al final: "append" significa "añadir".',
          '**Error común:** pedir una posición que no existe. La lista de arriba tiene 3 frutas, en las posiciones 0, 1 y 2. Si pides `frutas[3]` verás `IndexError: list index out of range` (posición fuera de la lista). Recuerda: el último está en `len(frutas) - 1`, o simplemente en `-1`.',
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
        codigo: [
          '# TODO: crea la lista ciudades con tres ciudades entre corchetes',
          '',
          '# TODO: muestra la primera ciudad (posición 0)',
          '',
          '# TODO: muestra cuántas ciudades hay, con len()',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'ciudades es una lista con 3 ciudades',
            condicion: 'isinstance(ciudades, list) and len(ciudades) == 3',
          },
          { descripcion: 'La consola muestra la primera ciudad de la lista', condicion: 'mostrado(ciudades[0])' },
          { descripcion: 'La consola muestra la cantidad de ciudades (3)', condicion: 'mostrado(3)' },
          {
            descripcion: 'La cantidad sale de len(ciudades), no escrita a mano',
            condicion: 're.search(r"\\blen\\s*\\(\\s*ciudades", codigo) is not None',
          },
        ],
        pistas: [
          'Una lista va entre corchetes y sus textos van entre comillas, separados por comas, como `frutas` en el ejemplo.',
          'La primera ciudad está en la posición `0`, y `len()` cuenta los elementos.',
          'Casi listo: `ciudades = ["Cali", "Tunja", "Leticia"]`, luego `print(ciudades[0])` y `print(len(...))`',
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
          '# TODO 1: agrega "café" y después "huevos" con .append()',
          '',
          '# TODO 2: guarda en ultimo el último elemento (posición -1)',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El mercado queda con 4 productos', condicion: 'len(mercado) == 4' },
          {
            descripcion: 'Los productos se agregan con .append(), sin reescribir la lista',
            condicion: 'codigo.count(".append(") >= 2',
          },
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
          'Primero agrega los dos productos; después pide el último. Si lo haces al revés, el último sería "panela".',
          'Cada producto se agrega con su propio `.append()`, y la posición `-1` siempre es el último elemento.',
          'Casi listo: `mercado.append("café")`, otra línea igual para los huevos y `ultimo = mercado[...]`',
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

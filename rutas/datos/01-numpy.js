globalThis.Rutas.agregarLeccion(
  'datos',
  {
    id: 'numpy',
    titulo: 'Por qué NumPy',
    pasos: [
      {
        id: 'idea',
        titulo: 'Operar con toda la lista de una vez',
        texto: [
          'Don Pepe quiere subirle el IVA (19 %) a todos sus precios. Con una lista de Python tendrías que recorrerla con un `for`.',
          '**NumPy** trae el **arreglo** (`np.array`): una lista de números que se opera **completa de una vez**. `precios * 1.19` multiplica cada precio, sin escribir el bucle. A eso se le llama operación **vectorizada**.',
          'Además es mucho más rápido: por dentro el bucle lo hace código en C. Por eso pandas, scikit-learn y casi toda la ciencia de datos en Python están construidos sobre NumPy.',
          'Un arreglo también sabe filtrarse: `precios > 3000` da un arreglo de `True` y `False`, y `precios[precios > 3000]` se queda solo con los `True`.',
          'La primera vez que ejecutes código con NumPy o pandas la app tarda unos segundos más: está cargando la librería.',
        ],
        codigo: [
          'import numpy as np  # "np" es el apodo que usa todo el mundo',
          '',
          'precios = np.array([2500, 1800, 4000, 3500])  # arepa, tinto, almuerzo, jugo',
          '',
          'print(precios * 1.19)       # el IVA a todos de una vez',
          'print(precios.sum())        # suma',
          'print(precios.mean())       # promedio',
          'print(precios > 3000)       # una pregunta para cada precio',
          'print(precios[precios > 3000])  # solo los que cumplen',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El IVA de Don Pepe',
        texto: [
          'La lista `precios` es una lista normal de Python. Conviértela en un arreglo y crea la variable `con_iva` con cada precio multiplicado por 1.19.',
          'Hazlo sin `for`: la gracia de NumPy es operar todo el arreglo de una vez.',
        ],
        codigo: [
          'import numpy as np',
          '',
          'precios = [2500, 1800, 4000]',
          '',
          '# Crea con_iva: un arreglo de NumPy con los precios más el 19 %',
          'con_iva = []',
          'print(con_iva)',
        ].join('\n'),
        pruebas: [
          { descripcion: 'con_iva es un arreglo de NumPy', condicion: 'isinstance(con_iva, np.ndarray)' },
          {
            descripcion: 'con_iva tiene 2975, 2142 y 4760',
            condicion: 'bool(np.allclose(con_iva, [2975, 2142, 4760]))',
          },
        ],
        pistas: [
          'Primero convierte: `np.array(precios)`',
          'Un arreglo se multiplica completo: `np.array(precios) * 1.19`',
          'Todo junto: `con_iva = np.array(precios) * 1.19`',
        ],
        solucion: [
          'import numpy as np',
          '',
          'precios = [2500, 1800, 4000]',
          '',
          'con_iva = np.array(precios) * 1.19',
          'print(con_iva)',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: los productos caros',
        texto: [
          'Crea la función `productos_caros(precios, limite)` que recibe una lista de precios y devuelve un **arreglo** solo con los precios mayores que `limite`, en el mismo orden.',
          'Usa un filtro de NumPy (`arreglo[arreglo > limite]`), no un `for`.',
        ],
        codigo: [
          'import numpy as np',
          '',
          '# Crea aquí la función productos_caros',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'productos_caros es una función', condicion: 'callable(productos_caros)' },
          {
            descripcion: 'Devuelve un arreglo de NumPy',
            condicion: 'isinstance(productos_caros([1000, 5000], 2000), np.ndarray)',
          },
          {
            descripcion: 'productos_caros([1000, 5000, 3000], 2500) da [5000, 3000]',
            condicion: 'list(productos_caros([1000, 5000, 3000], 2500)) == [5000, 3000]',
          },
          {
            descripcion: 'Si ninguno pasa el límite, el arreglo queda vacío',
            condicion: 'len(productos_caros([100, 200], 999)) == 0',
          },
        ],
        pistas: [
          'Dentro de la función, convierte primero: `arreglo = np.array(precios)`',
          'La pregunta `arreglo > limite` da un arreglo de `True` y `False`',
          'Úsala para filtrar: `return arreglo[arreglo > limite]`',
        ],
        solucion: [
          'import numpy as np',
          '',
          '',
          'def productos_caros(precios, limite):',
          '    arreglo = np.array(precios)',
          '    return arreglo[arreglo > limite]',
        ].join('\n'),
      },
    ],
  }
);

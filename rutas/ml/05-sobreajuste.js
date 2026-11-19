// El árbol que busca sus propias preguntas (construir_arbol) se repite en los
// tres pasos: cada paso empieza con un editor nuevo y debe funcionar solo.
// Va dentro de una función para no dejar la constante suelta en la página.

(function () {
  const ARBOL_Y_DATOS = [
    'import numpy as np',
    '',
    '',
    'def construir_arbol(x, y, profundidad):',
    '    # Devuelve una función que predice. x y y son arreglos de NumPy.',
    '    if profundidad == 0 or len(np.unique(x)) < 2:',
    '        hoja = y.mean()  # sin más preguntas: el promedio de lo que llegó aquí',
    '        return lambda valor: hoja',
    '    # Prueba cada corte posible y se queda con el que deja grupos más parejos',
    '    mejor_error, mejor_corte = None, None',
    '    for corte in np.unique(x)[:-1]:',
    '        izq = x <= corte',
    '        error = ((y[izq] - y[izq].mean()) ** 2).sum() + ((y[~izq] - y[~izq].mean()) ** 2).sum()',
    '        if mejor_error is None or error < mejor_error:',
    '            mejor_error, mejor_corte = error, corte',
    '    izq = x <= mejor_corte',
    '    rama_si = construir_arbol(x[izq], y[izq], profundidad - 1)',
    '    rama_no = construir_arbol(x[~izq], y[~izq], profundidad - 1)',
    '    return lambda valor: rama_si(valor) if valor <= mejor_corte else rama_no(valor)',
    '',
    '',
    'def mae(reales, predicciones):',
    '    return np.abs(np.array(reales) - np.array(predicciones)).mean()',
    '',
    '',
    '# 80 arriendos de ejemplo: unos 30 mil pesos por metro, más un ruido al azar',
    'azar = np.random.default_rng(7)',
    'metros = azar.integers(30, 130, 80)',
    'arriendo = metros * 30 + azar.normal(0, 400, 80)',
    'x_ent, y_ent = metros[:60], arriendo[:60]   # entrenamiento',
    'x_val, y_val = metros[60:], arriendo[60:]   # validación',
  ].join('\n');

  const CALCULAR_ERRORES = [
    'errores = {}',
    'for profundidad in [0, 1, 2, 3, 4, 5, 8]:',
    '    arbol = construir_arbol(x_ent, y_ent, profundidad)',
    '    errores[profundidad] = mae(y_val, [arbol(v) for v in x_val])',
  ].join('\n');

  globalThis.Rutas.agregarLeccion(
    'ml',
    {
      id: 'sobreajuste',
      titulo: 'Sobreajuste y subajuste',
      pasos: [
        {
          id: 'idea',
          titulo: 'Ni muy simple ni de memoria',
          texto: [
            '`construir_arbol` hace lo mismo que `DecisionTreeRegressor`: en cada rama prueba todos los cortes posibles y escoge el que deja los grupos más parejos. `profundidad` dice cuántas preguntas seguidas puede hacer.',
            'Con pocas preguntas el modelo es demasiado simple y se equivoca hasta con los datos de entrenamiento: eso es **subajuste** (underfitting).',
            'Con muchas preguntas, cada hoja termina con uno o dos apartamentos y el árbol se **memoriza** el entrenamiento, ruido incluido. Su error de entrenamiento baja mucho, pero con datos nuevos empeora: eso es **sobreajuste** (overfitting).',
            'Mira la tabla: el error de entrenamiento baja siempre al subir la profundidad, pero el de validación baja y luego vuelve a subir. El mejor modelo está en el punto más bajo de la validación. Por eso se elige con **validación**.',
            'En la lección de Kaggle el tamaño del árbol se controla con `max_leaf_nodes` (cuántas hojas puede tener); aquí con la profundidad, que en sklearn es `max_depth`. Es la misma idea.',
          ],
          codigo: [
            ARBOL_Y_DATOS,
            '',
            'print("profundidad | error entrenamiento | error validación")',
            'for profundidad in [0, 1, 2, 3, 4, 5, 8]:',
            '    arbol = construir_arbol(x_ent, y_ent, profundidad)',
            '    error_ent = mae(y_ent, [arbol(v) for v in x_ent])',
            '    error_val = mae(y_val, [arbol(v) for v in x_val])',
            '    print(profundidad, "|", round(error_ent), "|", round(error_val))',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Probar varias profundidades',
          texto: [
            'Es el ejercicio del curso de Kaggle: crea el diccionario `errores` donde cada clave es una profundidad de `[0, 1, 2, 3, 4, 5, 8]` y su valor es el **MAE en validación** del árbol entrenado con esa profundidad.',
            'Entrena con `x_ent` y `y_ent`; mide con `x_val` y `y_val`.',
          ],
          codigo: [
            ARBOL_Y_DATOS,
            '',
            '# Llena el diccionario errores: profundidad -> MAE en validación',
            'errores = {}',
            'print(errores)',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'errores tiene las profundidades 0, 1, 2, 3, 4, 5 y 8',
              condicion: 'sorted(errores) == [0, 1, 2, 3, 4, 5, 8]',
            },
            {
              descripcion: 'Con profundidad 0 el error es el de predecir siempre el promedio',
              condicion: 'bool(abs(errores[0] - mae(y_val, [y_ent.mean()] * len(y_val))) < 1e-6)',
            },
            {
              descripcion: 'Cada error se mide en validación, no en entrenamiento',
              condicion:
                'all(bool(abs(errores[p] - mae(y_val, [construir_arbol(x_ent, y_ent, p)(v) for v in x_val])) < 1e-6) for p in [1, 3, 8])',
            },
          ],
          pistas: [
            'Recorre las profundidades: `for profundidad in [0, 1, 2, 3, 4, 5, 8]:`',
            'Dentro: `arbol = construir_arbol(x_ent, y_ent, profundidad)` y las predicciones son `[arbol(v) for v in x_val]`',
            '`errores[profundidad] = mae(y_val, [arbol(v) for v in x_val])`',
          ],
          solucion: [
            ARBOL_Y_DATOS,
            '',
            CALCULAR_ERRORES,
            'print({p: round(float(error)) for p, error in errores.items()})',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto final: escoger la mejor profundidad',
          texto: [
            'Crea la función `mejor_profundidad(errores)` que recibe un diccionario como el de la práctica y devuelve **la profundidad** (la clave) con el menor error.',
            'Después guarda en `modelo_final` el árbol entrenado con esa profundidad. Así termina el ejercicio de Kaggle: con el tamaño ya elegido se entrena el modelo definitivo.',
          ],
          codigo: [ARBOL_Y_DATOS, '', CALCULAR_ERRORES, '', '# Crea mejor_profundidad y modelo_final', ''].join(
            '\n'
          ),
          pruebas: [
            { descripcion: 'mejor_profundidad es una función', condicion: 'callable(mejor_profundidad)' },
            {
              descripcion: 'Devuelve la clave del menor error',
              condicion: 'mejor_profundidad({1: 50.0, 4: 20.0, 9: 35.0}) == 4',
            },
            { descripcion: 'Con estos datos la mejor es 3', condicion: 'mejor_profundidad(errores) == 3' },
            {
              descripcion: 'modelo_final predice como el árbol de profundidad 3',
              condicion: 'bool(modelo_final(75) == construir_arbol(x_ent, y_ent, 3)(75))',
            },
          ],
          pistas: [
            '`min` acepta `key`: `min(errores, key=errores.get)` recorre las claves y compara sus valores',
            '`def mejor_profundidad(errores):` y adentro `return min(errores, key=errores.get)`',
            '`modelo_final = construir_arbol(x_ent, y_ent, mejor_profundidad(errores))`',
          ],
          solucion: [
            ARBOL_Y_DATOS,
            '',
            CALCULAR_ERRORES,
            '',
            '',
            'def mejor_profundidad(errores):',
            '    return min(errores, key=errores.get)',
            '',
            '',
            'modelo_final = construir_arbol(x_ent, y_ent, mejor_profundidad(errores))',
            'print(mejor_profundidad(errores), modelo_final(75))',
          ].join('\n'),
        },
      ],
    }
  );
})();

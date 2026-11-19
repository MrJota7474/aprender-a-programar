// Las pruebas del reto necesitan comprobar que una función LANZA un error.
// En una condición de una sola línea no cabe un try/except, así que se arma
// un pequeño trozo de Python con exec: devuelve True si la llamada lanzó un
// ValueError con mensaje, y deja pasar cualquier otro error (la prueba falla).
globalThis.Rutas.agregarLeccion(
  'python',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = str(e)\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    return {
      id: 'errores',
      titulo: 'Errores y excepciones',
      pasos: [
        {
          id: 'idea',
          titulo: 'Cuando algo sale mal',
          texto: [
            'A veces un programa se topa con algo imposible: dividir entre cero, convertir "tres" en número. Python lanza entonces un **error** (una *excepción*) y el programa se detiene.',
            'Con `try` y `except` lo atrapas: Python intenta lo que está en `try` y, si falla con ese tipo de error (`ValueError`, `ZeroDivisionError`...), salta al `except` en vez de romperse.',
            '`else` corre solo si **no** hubo error, y `finally` corre **siempre**, haya o no error.',
            'Tú también puedes lanzar un error con `raise`. Sirve para rechazar datos que no tienen sentido, con un mensaje claro de qué pasó.',
          ],
          codigo: [
            'def dividir(a, b):',
            '    return a / b',
            '',
            '',
            'try:',
            '    resultado = dividir(10, 0)',
            '    print(resultado)',
            'except ZeroDivisionError:',
            '    print("No se puede dividir entre cero")',
            'else:',
            '    print("Todo salió bien")',
            'finally:',
            '    print("Esto se muestra siempre")',
            '',
            'try:',
            '    cantidad = int("tres")',
            'except ValueError:',
            '    print("Eso no es un número")',
            '',
            '',
            'def cobrar(precio):',
            '    if precio < 0:',
            '        raise ValueError("El precio no puede ser negativo")',
            '    return precio',
            '',
            '',
            'try:',
            '    cobrar(-500)',
            'except ValueError as error:',
            '    print("Error:", error)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Texto a número, sin que se rompa',
          texto: [
            'Don Pepe recibe cantidades escritas a mano: `"25"`, `"abc"`, a veces nada. Completa la función `a_numero` para que convierta el texto con `int()`.',
            'Si el texto no se puede convertir, la función no debe romperse: debe devolver `None`.',
          ],
          codigo: [
            'def a_numero(texto):',
            '    # Intenta convertir con int() dentro de un try y atrapa el ValueError',
            '    return None',
            '',
            '',
            'print(a_numero("25"))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'a_numero es una función', condicion: 'callable(a_numero)' },
            { descripcion: 'a_numero("25") devuelve el número 25', condicion: 'a_numero("25") == 25' },
            { descripcion: 'a_numero("-4") devuelve -4', condicion: 'a_numero("-4") == -4' },
            { descripcion: 'a_numero("abc") devuelve None', condicion: 'a_numero("abc") is None' },
            { descripcion: 'a_numero("") devuelve None', condicion: 'a_numero("") is None' },
            { descripcion: 'Usas try y except', condicion: 're.search(r"^\\s*try\\s*:", codigo, re.M) is not None and "except" in codigo' },
          ],
          pistas: [
            'Empieza con `try:` y, con sangría, `return int(texto)`',
            'Después, a la altura del `try`, escribe `except ValueError:` y adentro `return None`',
            'Si el texto no es un número, `int()` lanza un `ValueError`, y ese `except` lo atrapa.',
          ],
          solucion: [
            'def a_numero(texto):',
            '    try:',
            '        return int(texto)',
            '    except ValueError:',
            '        return None',
            '',
            '',
            'print(a_numero("25"))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: validar un pedido',
          texto: [
            'Crea la función `validar_pedido` que recibe una `cantidad` y la devuelve si es un número **entero positivo**.',
            'Si no lo es (cero, negativo, decimal o un texto como `"dos"`), lanza un `ValueError` con un mensaje claro usando `raise`.',
            'Ojo: revisa primero que sea entero con `isinstance(cantidad, int)`; si no, comparar un texto con un número también da error.',
          ],
          codigo: [
            'def validar_pedido(cantidad):',
            '    # Si no es un entero positivo, lanza un ValueError con raise',
            '    return None',
            '',
            '',
            'print(validar_pedido(3))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'validar_pedido es una función', condicion: 'callable(validar_pedido)' },
            { descripcion: 'validar_pedido(3) devuelve 3', condicion: 'validar_pedido(3) == 3' },
            { descripcion: 'validar_pedido(1) devuelve 1', condicion: 'validar_pedido(1) == 1' },
            { descripcion: 'validar_pedido(250) devuelve 250', condicion: 'validar_pedido(250) == 250' },
            { descripcion: 'Con 0 lanza ValueError con un mensaje', condicion: lanzaValueError('validar_pedido(0)') },
            { descripcion: 'Con -2 lanza ValueError con un mensaje', condicion: lanzaValueError('validar_pedido(-2)') },
            { descripcion: 'Con 2.5 lanza ValueError con un mensaje', condicion: lanzaValueError('validar_pedido(2.5)') },
            { descripcion: 'Con "dos" lanza ValueError con un mensaje', condicion: lanzaValueError('validar_pedido("dos")') },
            { descripcion: 'Usas raise', condicion: 're.search(r"\\braise\\b", codigo) is not None' },
          ],
          pistas: [
            'La condición de rechazo: `if not isinstance(cantidad, int) or cantidad <= 0:`',
            'Adentro lanza el error: `raise ValueError("La cantidad debe ser un entero positivo")`',
            'Si pasa la validación, al final `return cantidad`.',
          ],
          solucion: [
            'def validar_pedido(cantidad):',
            '    if not isinstance(cantidad, int) or cantidad <= 0:',
            '        raise ValueError("La cantidad debe ser un entero positivo")',
            '    return cantidad',
            '',
            '',
            'print(validar_pedido(3))',
          ].join('\n'),
        },
      ],
    };
  })()
);

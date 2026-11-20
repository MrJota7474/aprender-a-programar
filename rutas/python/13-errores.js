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
            'Escribe `int("tres")` y Python se detiene con `ValueError: invalid literal for int()`: no sabe convertir la palabra "tres" en número. Lo mismo pasa al dividir entre cero.',
            'Ese aviso se llama **error** o **excepción**. Si nadie lo atiende, el programa se detiene ahí y no corre nada más.',
            'Con `try` ("intentar") y `except` ("excepto si") lo atrapas: Python intenta lo que está en el bloque `try` y, si falla con el tipo de error que nombraste (`ValueError`, `ZeroDivisionError`...), salta al bloque `except` en vez de romperse.',
            '**Ejemplo explicado línea por línea:** en el primer `try`, `dividir(10, 0)` falla. Python salta el `print(resultado)` y va directo a `except ZeroDivisionError:`, que muestra el aviso. El `else` no corre, porque solo corre cuando **no** hubo error. El `finally` corre **siempre**, haya o no error.',
            'Tú también puedes lanzar un error con `raise` ("levantar"). Sirve para rechazar datos que no tienen sentido, con un mensaje claro: así lo hace `cobrar(-500)` al final del ejemplo. `except ValueError as error` guarda el error en una variable para poder mostrar su mensaje.',
            '**Error común:** atrapar un tipo de error distinto al que ocurre. Si el código lanza `ValueError` pero escribiste `except ZeroDivisionError:`, ese `except` no lo atrapa y el programa igual se rompe. Mira el nombre del error en el mensaje y usa ese mismo.',
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
            '    # TODO: dentro de un try, devuelve el texto convertido con int()',
            '    # TODO: con except ValueError, devuelve None',
            '    return None',
            '',
            '',
            'print(a_numero("25"))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'a_numero sigue siendo una función', condicion: 'callable(a_numero)' },
            { descripcion: 'El texto "25" se convierte en el número 25', condicion: 'a_numero("25") == 25' },
            { descripcion: 'El texto "-4" se convierte en el número -4', condicion: 'a_numero("-4") == -4' },
            { descripcion: 'El texto "abc" no es un número: devuelve None sin romperse', condicion: 'a_numero("abc") is None' },
            { descripcion: 'Un texto vacío devuelve None sin romperse', condicion: 'a_numero("") is None' },
            { descripcion: 'Usas try y except', condicion: 're.search(r"^\\s*try\\s*:", codigo, re.M) is not None and "except" in codigo' },
          ],
          pistas: [
            'Lo que puede fallar es `int(texto)`. Eso es lo que va dentro del `try`.',
            'El error que lanza `int()` con un texto que no es número se llama `ValueError`. Atrápalo con `except ValueError:`.',
            'Queda: `try:` y, con sangría, `return int(texto)`. Luego, a la altura del `try`, `except ValueError:` y adentro `return None`.',
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
            '    # TODO: si cantidad no es entero (isinstance) o es 0 o menos,',
            '    #       lanza un ValueError con un mensaje usando raise',
            '    # TODO: si pasó la revisión, devuelve cantidad',
            '    return None',
            '',
            '',
            'print(validar_pedido(3))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'validar_pedido sigue siendo una función', condicion: 'callable(validar_pedido)' },
            { descripcion: 'Un pedido de 3 se acepta y devuelve 3', condicion: 'validar_pedido(3) == 3' },
            { descripcion: 'Un pedido de 1 se acepta y devuelve 1', condicion: 'validar_pedido(1) == 1' },
            { descripcion: 'Un pedido de 250 se acepta y devuelve 250', condicion: 'validar_pedido(250) == 250' },
            { descripcion: 'Un pedido de 0 se rechaza con ValueError y un mensaje', condicion: lanzaValueError('validar_pedido(0)') },
            { descripcion: 'Un pedido negativo (-2) se rechaza con ValueError', condicion: lanzaValueError('validar_pedido(-2)') },
            { descripcion: 'Un pedido decimal (2.5) se rechaza con ValueError', condicion: lanzaValueError('validar_pedido(2.5)') },
            { descripcion: 'Un texto ("dos") se rechaza con ValueError', condicion: lanzaValueError('validar_pedido("dos")') },
            { descripcion: 'Usas raise para lanzar el error', condicion: 're.search(r"\\braise\\b", codigo) is not None' },
          ],
          pistas: [
            'Hay dos razones para rechazar: que no sea entero, o que sea 0 o menos. Únelas con `or`.',
            'Revisa si es entero con `isinstance(cantidad, int)` y lanza el error con `raise ValueError("...")`, como en `cobrar` del ejemplo.',
            'Casi listo: `if not isinstance(cantidad, int) or cantidad <= 0:` y adentro `raise ValueError("La cantidad debe ser un entero positivo")`. Al final, `return cantidad`.',
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

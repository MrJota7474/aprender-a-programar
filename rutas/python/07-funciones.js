globalThis.Rutas.agregarLeccion(
  'python',
  {
    id: 'funciones',
    titulo: 'Funciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Recetas que se reutilizan',
        texto: [
          'Imagina que tienes que saludar a 50 personas. En vez de escribir 50 veces lo mismo, escribes la receta una vez y la usas con cada nombre. Eso es una función.',
          'Una **función** es un pedazo de código con nombre que puedes usar todas las veces que quieras. Ya usaste algunas que trae Python: `print()` y `len()`.',
          'Se crea con `def` (de "definir"), el nombre, los datos que recibe entre paréntesis y dos puntos. Esos datos se llaman **parámetros**. El contenido va con sangría.',
          '`return` ("devolver") entrega el resultado a quien llamó la función. Es distinto de `print`: `print` solo muestra en la consola; `return` te da un valor que puedes guardar o seguir usando.',
          '**Ejemplo explicado línea por línea:** `def saludar(nombre):` crea la receta; `nombre` es el dato que recibirá. `return "Hola, " + nombre` arma el saludo y lo devuelve. Hasta aquí no pasa nada visible: crear la función no la ejecuta. `saludar("Juan")` la **llama**: `nombre` vale `"Juan"` y la función devuelve `"Hola, Juan"`, que el `print` muestra.',
          '**Error común:** olvidar el `return`. Si la función no devuelve nada, Python entrega un valor vacío llamado `None`, y verás `None` en la consola o un error como `TypeError: ... \'NoneType\'`. Revisa que la última línea de tu función tenga `return`.',
        ],
        codigo: [
          'def saludar(nombre):',
          '    return "Hola, " + nombre',
          '',
          '',
          'print(saludar("Juan"))',
          'print(saludar("Mariana"))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'El doble',
        texto: [
          'Arregla la función `doble` para que devuelva el número que recibe multiplicado por 2. Ahora mismo siempre devuelve 0.',
          'Desde ahora las pruebas llaman a tu función con **varios valores distintos**, así que tiene que funcionar con cualquier número.',
        ],
        codigo: [
          'def doble(numero):',
          '    # TODO: cambia el 0 por el número que llega (numero) multiplicado por 2',
          '    return 0',
          '',
          '',
          'print(doble(4))  # debería mostrar 8',
        ].join('\n'),
        pruebas: [
          { descripcion: 'El doble de 4 es 8', condicion: 'doble(4) == 8' },
          { descripcion: 'El doble de 0 es 0', condicion: 'doble(0) == 0' },
          { descripcion: 'También funciona con negativos: el doble de -3 es -6', condicion: 'doble(-3) == -6' },
          { descripcion: 'Y con números que no están en el ejemplo: el doble de 125 es 250', condicion: 'doble(125) == 250' },
        ],
        pistas: [
          'El parámetro `numero` trae el valor que le pasan a la función. Cada vez que la llaman puede ser distinto.',
          'Para multiplicar se usa `*`. La cuenta usa `numero`, no un valor fijo.',
          'La línea queda: `return numero * 2`',
        ],
        solucion: ['def doble(numero):', '    return numero * 2', '', '', 'print(doble(4))'].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: la taquilla',
        texto: [
          'Crea desde cero la función `precio_entrada` que recibe una `edad` y devuelve el precio de la entrada.',
          'Los menores de 12 años pagan `8000`. Todos los demás pagan `15000`.',
          'Aquí se juntan dos cosas que ya sabes: funciones e `if`.',
        ],
        codigo: [
          '# TODO: crea la función precio_entrada que recibe edad',
          '#   - si edad es menor que 12, devuelve 8000',
          '#   - si no, devuelve 15000',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Creaste la función precio_entrada', condicion: 'callable(precio_entrada)' },
          { descripcion: 'Un niño de 8 años paga 8000', condicion: 'precio_entrada(8) == 8000' },
          { descripcion: 'Con 11 años todavía paga 8000', condicion: 'precio_entrada(11) == 8000' },
          { descripcion: 'Con 12 años ya paga 15000', condicion: 'precio_entrada(12) == 15000' },
          { descripcion: 'Un adulto de 30 años paga 15000', condicion: 'precio_entrada(30) == 15000' },
        ],
        pistas: [
          'Empieza con la primera línea, como en `saludar`: `def precio_entrada(edad):`',
          'Adentro de la función (con sangría) va un `if` que compara `edad` con 12, y cada caso hace su propio `return`.',
          'Queda así: `if edad < 12:` y debajo, con más sangría, `return 8000`. Luego, a la altura del `if`, `return 15000`.',
        ],
        solucion: [
          'def precio_entrada(edad):',
          '    if edad < 12:',
          '        return 8000',
          '    return 15000',
        ].join('\n'),
      },
    ],
  }
);

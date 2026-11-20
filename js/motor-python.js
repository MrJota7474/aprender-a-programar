// motor-python.js — El "motor" de Python: habla con el Web Worker que
// tiene Pyodide y cumple el mismo contrato que el motor de JavaScript.
// El manejo del Worker (cargar, esperar, cortar) está en trabajadores.js.

(function () {
  'use strict';

  const TIEMPO_MAXIMO_MS = 5000;
  const TIEMPO_MAXIMO_CARGA_MS = 60000;

  const ERROR_TIEMPO = Object.freeze({
    nombre: 'TiempoAgotado',
    mensaje:
      'Tu código tardó más de 5 segundos y lo detuvimos. ' +
      '¿Será un bucle que nunca termina? Revisa la condición del for o del while.',
  });

  // ---------- Errores de Python explicados en español ----------
  // Cada regla: cuándo aplica y qué decir. Cada explicación dice qué pasó y
  // cómo arreglarlo, casi siempre con un mini ejemplo de "antes" y "después".
  // Van de la más específica a la más general: gana la primera que aplica.

  // Un mini ejemplo en una sola línea: el error se pinta con textContent,
  // así que no lleva saltos de línea ni HTML, solo texto.
  function antesDespues(antes, despues) {
    return ' Antes: ' + antes + '  →  Después: ' + despues;
  }

  // Saca un dato entre comillas simples del mensaje: el nombre, la clave o
  // el tipo del que habla Python ('nombr', 'b', 'int'…).
  function entreComillas(mensaje, posicion = 0) {
    const encontrados = [...String(mensaje).matchAll(/'([^']*)'/g)].map((m) => m[1]);
    return encontrados[posicion];
  }

  // Los tipos de Python, con el nombre con que los conoce el estudiante.
  const TIPOS_PYTHON = Object.freeze({
    int: 'un número entero',
    float: 'un número decimal',
    str: 'un texto',
    list: 'una lista',
    dict: 'un diccionario',
    tuple: 'una tupla',
    set: 'un conjunto',
    bool: 'un booleano (True o False)',
    NoneType: 'None (un valor vacío)',
    function: 'una función',
  });

  function nombreDeTipo(tipo) {
    return Object.prototype.hasOwnProperty.call(TIPOS_PYTHON, tipo)
      ? TIPOS_PYTHON[tipo]
      : 'un valor de tipo ' + (tipo || 'desconocido');
  }

  // Nombres que vienen de otros lenguajes y en Python se escriben distinto.
  const NOMBRES_DE_OTRO_LENGUAJE = Object.freeze({
    true: 'True',
    false: 'False',
    null: 'None',
    none: 'None',
    undefined: 'None',
  });

  // Métodos de JavaScript que el estudiante prueba en Python por costumbre,
  // con lo que se usa en Python y un ejemplo.
  const METODOS_DE_JAVASCRIPT = Object.freeze({
    push: ['append', 'frutas.push("mango")', 'frutas.append("mango")'],
    length: ['len( )', 'frutas.length', 'len(frutas)'],
    toUpperCase: ['upper', 'nombre.toUpperCase()', 'nombre.upper()'],
    toLowerCase: ['lower', 'nombre.toLowerCase()', 'nombre.lower()'],
    trim: ['strip', 'texto.trim()', 'texto.strip()'],
    includes: ['in', 'frutas.includes("mango")', '"mango" in frutas'],
    forEach: ['un for', 'frutas.forEach(...)', 'for fruta in frutas:'],
  });

  const EXPLICACIONES = Object.freeze([
    // ---------- mensajes propios de la app (ya vienen en español) ----------
    {
      aplica: (error) => error.nombre === 'RuntimeError' && /no funciona en este editor/.test(error.mensaje),
      explicar: (error) => error.mensaje,
    },

    // ---------- nombres ----------
    {
      aplica: (error) => error.nombre === 'NameError',
      explicar: (error) => {
        const nombre = (error.mensaje.match(/name '(.+?)' is not defined/) || [])[1];
        const correcto = nombre && NOMBRES_DE_OTRO_LENGUAJE[nombre];
        if (correcto) {
          return (
            'Usaste "' + nombre + '", pero en Python se escribe ' + correcto + ', con la primera letra en mayúscula.' +
            antesDespues('activo = ' + nombre, 'activo = ' + correcto)
          );
        }
        return (
          (nombre ? 'Usaste "' + nombre + '", pero ese nombre no existe. ' : 'Usaste un nombre que no existe. ') +
          'Revisa que esté bien escrito (las mayúsculas cuentan) y que lo hayas creado antes de usarlo. ' +
          'Si querías un texto, ponlo entre comillas.' +
          antesDespues('print(hola)', 'print("hola")')
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'UnboundLocalError',
      explicar: (error) =>
        'Dentro de una función usaste "' + (entreComillas(error.mensaje) || 'una variable') + '" antes de darle ' +
        'un valor ahí mismo. Una función no cambia una variable de afuera solo con asignarla: recíbela como ' +
        'parámetro y devuelve el resultado.' +
        antesDespues('def sumar(): total = total + 1', 'def sumar(total): return total + 1'),
    },

    // ---------- sangría ----------
    {
      aplica: (error) => error.nombre === 'IndentationError' && /expected an indented block/.test(error.mensaje),
      explicar: () =>
        'Después de una línea que termina en dos puntos (if, for, while, def…) las líneas de adentro ' +
        'necesitan sangría: 4 espacios al comienzo. Por ejemplo, debajo de if edad > 18: escribe ' +
        '"    print("adulto")", con los 4 espacios.',
    },
    {
      aplica: (error) => error.nombre === 'IndentationError' && /unexpected indent/.test(error.mensaje),
      explicar: () =>
        'Esta línea tiene espacios de más al comienzo (sangría) y no está dentro de ningún if, for ni def. ' +
        'Bórrale los espacios del comienzo para que quede alineada con la línea de arriba.',
    },
    {
      aplica: (error) => error.nombre === 'IndentationError' && /unindent does not match/.test(error.mensaje),
      explicar: () =>
        'La sangría de esta línea no coincide con ninguna de las de arriba. Las líneas de un mismo ' +
        'bloque deben empezar con la misma cantidad de espacios: usa múltiplos de 4 (4, 8, 12…).',
    },
    {
      aplica: (error) => error.nombre === 'TabError',
      explicar: () =>
        'Mezclaste tabulaciones y espacios en la sangría. Python no sabe contarlos juntos: borra la ' +
        'sangría de esas líneas y escríbela de nuevo solo con espacios (4 por nivel).',
    },
    {
      aplica: (error) => error.nombre === 'IndentationError',
      explicar: () =>
        'Hay un problema con la sangría (los espacios al comienzo de la línea). En Python las ' +
        'líneas de un mismo bloque deben empezar con la misma cantidad de espacios: usa 4.',
    },

    // ---------- errores de escritura ----------
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /expected ':'/.test(error.mensaje),
      explicar: () =>
        'Falta el signo de dos puntos (:) al final de la línea. Las líneas con if, elif, else, for, ' +
        'while, def y class terminan en dos puntos.' +
        antesDespues('if edad > 18', 'if edad > 18:'),
    },
    {
      aplica: (error) =>
        error.nombre === 'SyntaxError' && /unterminated (triple-quoted )?string|EOL while scanning/.test(error.mensaje),
      explicar: () =>
        'Abriste unas comillas y no las cerraste. Todo texto necesita comillas al comienzo y al final, ' +
        'y del mismo tipo (las dos dobles o las dos simples).' +
        antesDespues('print("hola)', 'print("hola")'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /was never closed/.test(error.mensaje),
      explicar: (error) => {
        const signo = entreComillas(error.mensaje) || '(';
        const cierre = { '(': ')', '[': ']', '{': '}' }[signo] || ')';
        return (
          'Abriste un "' + signo + '" y nunca lo cerraste: agrega el "' + cierre + '" que falta. ' +
          'Cuenta los que abres y los que cierras: debe haber la misma cantidad.' +
          antesDespues('print(len(frutas)', 'print(len(frutas))')
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /unmatched|does not match opening/.test(error.mensaje),
      explicar: () =>
        'Sobra un signo de cierre — ), ] o } — o no corresponde con el que abriste. Cuenta los que ' +
        'abres y los que cierras en esa línea.' +
        antesDespues('print(precio))', 'print(precio)'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /forgot a comma/.test(error.mensaje),
      explicar: () =>
        'Parece que falta una coma entre dos valores. En las listas, los diccionarios y los ' +
        'argumentos de una función, cada valor se separa con coma.' +
        antesDespues('print("Total:" total)', 'print("Total:", total)'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /instead of '='/.test(error.mensaje),
      explicar: () =>
        'Usaste un solo = donde va una comparación. Un = guarda un valor; para preguntar "¿es igual?" se usan dos: ==.' +
        antesDespues('if edad = 18:', 'if edad == 18:'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /Missing parentheses in call to/.test(error.mensaje),
      explicar: () =>
        'En Python 3, print es una función: lo que quieres mostrar va entre paréntesis.' +
        antesDespues('print "hola"', 'print("hola")'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /'return' outside function/.test(error.mensaje),
      explicar: () =>
        'Usaste return fuera de una función. return solo va dentro de un def, con sangría. ' +
        'Si querías ver el valor, usa print( ).',
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /f-string/.test(error.mensaje),
      explicar: () =>
        'Hay un error dentro de un f-string. Revisa que cada { tenga su } y que adentro haya un nombre o una cuenta.' +
        antesDespues('f"Hola {nombre"', 'f"Hola {nombre}"'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError' && /leading zeros/.test(error.mensaje),
      explicar: () =>
        'Un número en Python no puede empezar con 0. Si es un código o un teléfono, guárdalo como texto.' +
        antesDespues('codigo = 0571', 'codigo = "0571"'),
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError',
      explicar: () =>
        'Hay un error de escritura. Revisa que cada paréntesis y comilla que abriste esté ' +
        'cerrado, y que las líneas con if, else, for y def terminen en dos puntos (:). ' +
        'Si la línea se ve bien, mira también la de arriba: a veces el error empieza ahí.',
    },

    // ---------- tipos que no se pueden mezclar ----------
    // None va primero: en '"a" + None' el problema no es el +, sino que el
    // valor quedó vacío, y el consejo de str( ) solo escondería el error.
    {
      aplica: (error) => /NoneType/.test(error.mensaje),
      explicar: () =>
        'Usaste un valor vacío (None). Suele pasar cuando una función no tiene return y se usa su ' +
        'resultado, o cuando guardas lo que devuelve un método que cambia la lista (como sort o append, ' +
        'que devuelven None).' +
        antesDespues('lista = lista.sort()', 'lista.sort()'),
    },
    // El mensaje dice qué había a cada lado del +: 'can only concatenate
    // list (not "int") to list'. El consejo depende de esa pareja.
    {
      aplica: (error) => error.nombre === 'TypeError' && /can only concatenate/.test(error.mensaje),
      explicar: (error) => {
        const [, base, otro] = error.mensaje.match(/can only concatenate (\w+) \(not "(\w+)"\)/) || [];
        if (base === 'list') {
          return (
            'A una lista solo se le puede sumar con + otra lista, y le estás sumando ' + nombreDeTipo(otro) +
            '. Para agregar un elemento, mételo entre corchetes o usa append.' +
            antesDespues('numeros + 4', 'numeros + [4]   o   numeros.append(4)')
          );
        }
        if (base === 'str' && (otro === 'int' || otro === 'float')) {
          return (
            'Intentaste unir con + un texto y un número. Python no los mezcla solo: convierte el número ' +
            'en texto con str( ) o usa un f-string.' +
            antesDespues('"Edad: " + 16', '"Edad: " + str(16)   o   f"Edad: {16}"')
          );
        }
        if (base === 'str' && otro === 'list') {
          return (
            'Intentaste unir con + un texto y una lista. Para volver la lista un texto, une sus ' +
            'elementos con join (si son textos) o usa un f-string.' +
            antesDespues('"Frutas: " + frutas', '"Frutas: " + ", ".join(frutas)')
          );
        }
        return (
          'Con + solo se unen dos valores del mismo tipo, y aquí hay ' + nombreDeTipo(base) + ' y ' +
          nombreDeTipo(otro) + '. Revisa qué guarda cada variable; un f-string sirve para armar un texto con cualquier valor.'
        );
      },
    },
    {
      aplica: (error) =>
        error.nombre === 'TypeError' && /unsupported operand/.test(error.mensaje) && /'str'/.test(error.mensaje),
      explicar: () =>
        'Intentaste hacer una cuenta entre un número y un texto. Si el texto tiene un número adentro ' +
        '(por ejemplo "16"), conviértelo con int( ) o float( ) antes de calcular.' +
        antesDespues('5 + "16"', '5 + int("16")'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /can't multiply sequence/.test(error.mensaje),
      explicar: () =>
        'Intentaste multiplicar dos textos (o una lista por un texto). Un texto solo se multiplica por un ' +
        'número entero; si los dos son números guardados como texto, conviértelos con int( ).' +
        antesDespues('"3" * "2"', 'int("3") * int("2")'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /takes \d+ positional arguments? but \d+/.test(error.mensaje),
      explicar: (error) => {
        const [, funcion, espera, recibe] = error.mensaje.match(/^(\S+?)\(\) takes (\d+) .* but (\d+)/) || [];
        const esMetodo = funcion && funcion.includes('.') ? ' (en un método, self cuenta como el primero)' : '';
        return (
          (funcion
            ? 'La función ' + funcion + '( ) recibe ' + espera + ' dato(s), pero le pasaste ' + recibe + esMetodo + '. '
            : 'Le pasaste a una función más datos de los que recibe. ') +
          'Revisa los paréntesis de la llamada y los parámetros del def.'
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /missing \d+ required positional argument/.test(error.mensaje),
      explicar: (error) => {
        const funcion = (error.mensaje.match(/^(\S+?)\(\)/) || [])[1];
        const faltan = [...error.mensaje.matchAll(/'([^']+)'/g)].map((m) => m[1]).join(', ');
        return (
          'Llamaste ' + (funcion ? 'a ' + funcion + '( ) ' : 'a una función ') + 'sin todos los datos que necesita' +
          (faltan ? ' (falta ' + faltan + ')' : '') + '. Pásale un valor por cada parámetro del def.' +
          antesDespues('sumar(5)', 'sumar(5, 3)')
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /object is not callable/.test(error.mensaje),
      explicar: (error) =>
        'Pusiste paréntesis después de algo que no es una función (' + nombreDeTipo(entreComillas(error.mensaje)) + '). ' +
        'Puede ser que una variable se llame igual que una función (como sum o list) o que falte un * en una cuenta.' +
        antesDespues('2(3 + 4)', '2 * (3 + 4)'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /is not subscriptable/.test(error.mensaje),
      explicar: (error) =>
        'Usaste corchetes [ ] en ' + nombreDeTipo(entreComillas(error.mensaje)) + ', y eso no tiene posiciones ' +
        'ni claves. Los corchetes son para listas, textos y diccionarios; si era una función, usa paréntesis.' +
        antesDespues('len[frutas]', 'len(frutas)'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /indices must be integers/.test(error.mensaje),
      explicar: () =>
        'Las posiciones de una lista son números enteros. Si querías buscar por nombre necesitas un ' +
        'diccionario; si la posición está en un texto, conviértela con int( ).' +
        antesDespues('frutas["1"]', 'frutas[1]'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /object is not iterable/.test(error.mensaje),
      explicar: (error) =>
        'Intentaste recorrer con for ' + nombreDeTipo(entreComillas(error.mensaje)) + ', y eso no tiene elementos. ' +
        'Para repetir algo un número de veces usa range( ).' +
        antesDespues('for i in 5:', 'for i in range(5):'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /does not support item assignment/.test(error.mensaje),
      explicar: () =>
        'Un texto (o una tupla) no se puede cambiar por partes. Crea uno nuevo con el cambio.' +
        antesDespues('texto[0] = "H"', 'texto = "H" + texto[1:]'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /has no len\(\)/.test(error.mensaje),
      explicar: (error) =>
        'len( ) cuenta los elementos de una lista, un texto o un diccionario, pero le pasaste ' +
        nombreDeTipo(entreComillas(error.mensaje)) + '. Para contar las cifras de un número, conviértelo en texto.' +
        antesDespues('len(2024)', 'len(str(2024))'),
    },
    {
      aplica: (error) => error.nombre === 'TypeError',
      explicar: () =>
        'Usaste un valor de una forma que no admite. Si llamaste una función, revisa cuántos ' +
        'datos le pasaste entre los paréntesis. Con print(type(valor)) ves qué tipo de dato tienes.',
    },

    // ---------- cuentas y posiciones ----------
    {
      aplica: (error) => error.nombre === 'ZeroDivisionError',
      explicar: () =>
        'No se puede dividir entre cero (tampoco sacar el residuo % de dividir entre cero). Revisa que ' +
        'el divisor no sea 0; si puede serlo, pregunta antes con un if.' +
        antesDespues('promedio = total / cantidad', 'promedio = total / cantidad if cantidad > 0 else 0'),
    },
    {
      aplica: (error) => error.nombre === 'IndexError',
      explicar: () =>
        'Pediste una posición que no existe. Se cuenta desde 0: en una lista de 3 elementos las ' +
        'posiciones son 0, 1 y 2. Para el último usa -1.' +
        antesDespues('frutas[3]', 'frutas[2]   o   frutas[-1]'),
    },
    {
      aplica: (error) => error.nombre === 'KeyError',
      explicar: (error) => {
        const clave = entreComillas(error.mensaje);
        return (
          'Pediste la clave ' + (clave !== undefined ? '"' + clave + '"' : error.mensaje) + ', pero no existe ' +
          'en el diccionario. Revisa cómo está escrita (las mayúsculas y las tildes cuentan). Si puede ' +
          'faltar, usa .get( ), que devuelve None en vez de fallar.' +
          antesDespues('cliente["correo"]', 'cliente.get("correo")')
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'AttributeError',
      explicar: (error) => {
        const tipo = entreComillas(error.mensaje, 0);
        const nombre = entreComillas(error.mensaje, 1);
        if (nombre && Object.prototype.hasOwnProperty.call(METODOS_DE_JAVASCRIPT, nombre)) {
          const [enPython, antes, despues] = METODOS_DE_JAVASCRIPT[nombre];
          return nombre + ' es de JavaScript; en Python se usa ' + enPython + '.' + antesDespues(antes, despues);
        }
        // "module 'math' has no attribute 'raiz'": lo primero entre comillas
        // es el nombre del módulo, no un tipo de dato.
        if (/^module '/.test(error.mensaje) && tipo && nombre) {
          return (
            'El módulo ' + tipo + ' no tiene "' + nombre + '". Revisa cómo se escribe (las mayúsculas cuentan). ' +
            'Con dir(' + tipo + ') ves todo lo que sí tiene.'
          );
        }
        const inicio = tipo && nombre
          ? nombreDeTipo(tipo).replace(/^./, (letra) => letra.toUpperCase()) + ' no tiene "' + nombre + '". '
          : 'Ese valor no tiene esa propiedad o acción. ';
        return inicio + 'Revisa el nombre que escribiste después del punto. Con dir(valor) ves todo lo que sí tiene.';
      },
    },

    // ---------- valores que no sirven ----------
    {
      aplica: (error) =>
        error.nombre === 'ValueError' && /invalid literal for int|could not convert string to float/.test(error.mensaje),
      explicar: (error) => {
        const texto = entreComillas(error.mensaje);
        // int("3.5") falla aunque "3.5" sí es un número: int( ) no acepta el
        // punto. Primero se pasa a decimal y luego a entero.
        if (/invalid literal for int/.test(error.mensaje) && texto !== undefined && /^\s*[-+]?(\d+\.\d*|\.\d+)\s*$/.test(texto)) {
          return (
            'El texto "' + texto + '" tiene un número decimal, y int( ) solo acepta enteros escritos como texto. ' +
            'Conviértelo primero con float( ) y después con int( ) (que quita los decimales).' +
            antesDespues('int("' + texto + '")', 'int(float("' + texto + '"))')
          );
        }
        return (
          'Intentaste convertir en número ' + (texto !== undefined ? 'el texto "' + texto + '"' : 'un texto') +
          ', pero no tiene forma de número. int( ) solo acepta cifras ("42") y float( ) usa punto, no coma ("3.5").' +
          antesDespues('float("3,5")', 'float("3.5")')
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'ValueError' && /values to unpack/.test(error.mensaje),
      explicar: () =>
        'La cantidad de variables a la izquierda del = no coincide con la cantidad de valores. ' +
        'Pon una variable por cada valor.' +
        antesDespues('a, b = [1, 2, 3]', 'a, b, c = [1, 2, 3]'),
    },
    {
      aplica: (error) => error.nombre === 'ValueError' && /empty sequence|argument is empty/.test(error.mensaje),
      explicar: () =>
        'Pediste el mayor o el menor (max o min) de una lista vacía. Revisa primero que tenga elementos.' +
        antesDespues('max(precios)', 'max(precios) if precios else 0'),
    },
    {
      aplica: (error) => error.nombre === 'ValueError' && /not in list/.test(error.mensaje),
      explicar: () =>
        'Buscaste con .index( ) o quitaste con .remove( ) algo que no está en la lista. Pregunta antes con in.' +
        antesDespues('frutas.remove("pera")', 'if "pera" in frutas: frutas.remove("pera")'),
    },

    // ---------- módulos, archivos y recursión ----------
    {
      aplica: (error) => error.nombre === 'ModuleNotFoundError',
      explicar: (error) =>
        'No existe un módulo llamado "' + (entreComillas(error.mensaje) || '') + '". Revisa cómo está escrito ' +
        '(por ejemplo math, json, random o pandas). En esta app solo están los módulos que trae Python, ' +
        'numpy, pandas y los de las lecciones.',
    },
    {
      aplica: (error) => error.nombre === 'ImportError',
      explicar: (error) =>
        'El módulo existe, pero no tiene nada llamado "' + (entreComillas(error.mensaje) || '') + '". ' +
        'Revisa el nombre que pusiste después de import.',
    },
    {
      aplica: (error) => error.nombre === 'FileNotFoundError',
      explicar: () =>
        'No se encontró ese archivo. Revisa el nombre y la extensión (.txt, .csv). En el editor de esta ' +
        'app no hay archivos de tu computador: los datos van en el mismo código.',
    },
    {
      aplica: (error) => error.nombre === 'RecursionError',
      explicar: () =>
        'Una función se llamó a sí misma demasiadas veces, sin parar. Toda función recursiva necesita ' +
        'un caso base: un if que devuelve un resultado sin volver a llamarse.' +
        antesDespues('def contar(n): return contar(n - 1)', 'def contar(n): return 0 if n == 0 else contar(n - 1)'),
    },
  ]);

  // La explicación empieza por la línea, cuando Python la sabe: es lo
  // primero que hay que buscar en el código.
  function explicarErrorPython(error) {
    if (error.nombre === 'TiempoAgotado' || error.nombre === 'MotorNoDisponible') {
      return error.mensaje;
    }
    const regla = EXPLICACIONES.find((candidata) => candidata.aplica(error));
    const explicacion = regla ? regla.explicar(error) : 'Algo falló al ejecutar tu código.';
    const lugar = error.linea ? 'En la línea ' + error.linea + ': ' : '';
    // Mostramos también el mensaje original: aprender a leerlo es parte del oficio.
    return lugar + explicacion + ' (Mensaje original: ' + error.nombre + ': ' + error.mensaje + ')';
  }

  // ---------- El motor ----------

  // El Worker de Python es un módulo (así se distribuye Pyodide) y se queda
  // vivo entre ejecuciones, porque cargar Python tarda unos segundos.
  const conexion = globalThis.crearConexionConWorker({
    direccion: 'js/python-trabajador.js',
    opcionesWorker: { type: 'module' },
    nombreMotor: 'Python',
    tiempoMaximoMs: TIEMPO_MAXIMO_MS,
    tiempoMaximoCargaMs: TIEMPO_MAXIMO_CARGA_MS,
    errorTiempo: ERROR_TIEMPO,
  });

  // Un segundo Worker, solo para el código que usa numpy o pandas. Carga
  // esas librerías antes de decir "listo" (ver python-trabajador.js), así que
  // su espera la cubren los 60 segundos de carga y no los 5 de cada ejecución.
  // Va aparte para que quien no usa pandas no pague esos segundos de más.
  // Se crea solo la primera vez que se ejecuta código con esos import.
  const conexionDatos = globalThis.crearConexionConWorker({
    direccion: 'js/python-trabajador.js?datos',
    opcionesWorker: { type: 'module' },
    nombreMotor: 'pandas',
    tiempoMaximoMs: TIEMPO_MAXIMO_MS,
    tiempoMaximoCargaMs: TIEMPO_MAXIMO_CARGA_MS,
    errorTiempo: ERROR_TIEMPO,
  });

  // ¿El código importa numpy o pandas? Basta una mirada a los import: si se
  // escapa un caso raro, el Worker normal igual sabe cargarlos (más lento).
  const IMPORTA_DATOS = /^\s*(?:import|from)\s+[^\n#]*\b(?:numpy|pandas)\b/m;

  globalThis.explicarErrorPython = explicarErrorPython;

  // Un motor de Python puede traer módulos propios de la app (texto con
  // código Python, registrado en globalThis.MODULOS_PYTHON). El estudiante
  // los usa con "import", igual que una librería de verdad.
  function modulosDe(nombres) {
    const disponibles = globalThis.MODULOS_PYTHON || {};
    return Object.fromEntries(
      nombres
        .filter((nombre) => Object.prototype.hasOwnProperty.call(disponibles, nombre))
        .map((nombre) => [nombre, disponibles[nombre]])
    );
  }

  // "siempreDatos" fija el Worker de numpy y pandas: así se calienta al abrir
  // la lección (en "preparar") y no cuando el estudiante pulsa Ejecutar.
  function crearMotor(nombresDeModulos, siempreDatos = false) {
    const elegirConexion = (codigo) =>
      siempreDatos || IMPORTA_DATOS.test(codigo) ? conexionDatos : conexion;
    return {
      ejecutar: (codigo, pruebas, avisar) =>
        elegirConexion(codigo).pedir({ codigo, pruebas, modulos: modulosDe(nombresDeModulos) }, avisar),
      preparar: siempreDatos ? conexionDatos.preparar : conexion.preparar,
      explicarError: explicarErrorPython,
      ayudaSinSalida: 'Tu código no mostró nada. Usa print( ) para ver resultados aquí.',
      lenguaje: 'python',
      nombreLenguaje: 'Python',
      archivo: 'tu_codigo.py',
      sangria: '    ',
    };
  }

  // El motor de Python trae el módulo "proyecto" (un proyecto web de
  // ejemplo con un Flask simulado) para la ruta "Entender proyectos hechos
  // con IA". Las demás rutas de Python no lo importan, así que no les cambia
  // nada; si su archivo no está cargado, modulosDe lo omite.
  globalThis.Motores.registrar('python', crearMotor(['proyecto']));
  // La ruta de inteligencia artificial es Python más el módulo "ia" (un
  // modelo de lenguaje simulado). Comparte el mismo Worker con la de Python.
  // También trae "agente" (un agente de código simulado) para la ruta
  // "Programar con IA"; si su archivo no está cargado, modulosDe lo omite.
  globalThis.Motores.registrar('python-ia', crearMotor(['ia', 'agente']));
  // Las rutas de análisis de datos y de aprendizaje automático usan pandas
  // en casi todos los pasos: su motor va siempre al Worker con numpy y pandas.
  globalThis.Motores.registrar('python-datos', crearMotor([], true));
})();

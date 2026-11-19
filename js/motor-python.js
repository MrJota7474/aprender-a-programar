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

  const EXPLICACIONES = Object.freeze([
    {
      aplica: (error) => error.nombre === 'NameError',
      explicar: (error) => {
        const nombre = (error.mensaje.match(/name '(.+?)' is not defined/) || [])[1];
        return (
          (nombre ? 'Usaste "' + nombre + '", pero ese nombre no existe. ' : 'Usaste un nombre que no existe. ') +
          'Revisa que esté bien escrito (las mayúsculas cuentan) y que lo hayas creado antes de usarlo.'
        );
      },
    },
    {
      aplica: (error) => error.nombre === 'IndentationError' || error.nombre === 'TabError',
      explicar: () =>
        'Hay un problema con la sangría (los espacios al comienzo de la línea). En Python las ' +
        'líneas de un mismo bloque deben empezar con la misma cantidad de espacios: usa 4.',
    },
    {
      aplica: (error) => error.nombre === 'SyntaxError',
      explicar: () =>
        'Hay un error de escritura. Revisa que cada paréntesis y comilla que abriste esté ' +
        'cerrado, y que las líneas con if, else, for y def terminen en dos puntos (:).',
    },
    {
      aplica: (error) => error.nombre === 'TypeError' && /NoneType/.test(error.mensaje),
      explicar: () =>
        'Usaste un valor vacío (None). Suele pasar cuando una función no tiene return ' +
        'y se usa su resultado.',
    },
    {
      aplica: (error) =>
        error.nombre === 'TypeError' &&
        /concatenate|unsupported operand/.test(error.mensaje) &&
        /'str'/.test(error.mensaje),
      explicar: () =>
        'Intentaste mezclar un texto con un número. Convierte el número con str( ) o usa un f-string.',
    },
    {
      aplica: (error) => error.nombre === 'TypeError',
      explicar: () =>
        'Usaste un valor de una forma que no admite. Si llamaste una función, revisa cuántos ' +
        'datos le pasaste entre los paréntesis.',
    },
    {
      aplica: (error) => error.nombre === 'ZeroDivisionError',
      explicar: () => 'No se puede dividir entre cero.',
    },
    {
      aplica: (error) => error.nombre === 'IndexError',
      explicar: () =>
        'Pediste una posición que no existe en la lista. Recuerda que se cuenta desde 0.',
    },
    {
      aplica: (error) => error.nombre === 'KeyError',
      explicar: () =>
        'Pediste una clave que no existe en el diccionario. Revisa cómo está escrita.',
    },
    {
      aplica: (error) => error.nombre === 'AttributeError',
      explicar: () =>
        'Ese valor no tiene esa propiedad o acción. Revisa el nombre que escribiste después del punto.',
    },
  ]);

  function explicarErrorPython(error) {
    if (error.nombre === 'TiempoAgotado' || error.nombre === 'MotorNoDisponible') {
      return error.mensaje;
    }
    const regla = EXPLICACIONES.find((candidata) => candidata.aplica(error));
    const explicacion = regla ? regla.explicar(error) : 'Algo falló al ejecutar tu código.';
    const lugar = error.linea ? ' Mira la línea ' + error.linea + '.' : '';
    // Mostramos también el mensaje original: aprender a leerlo es parte del oficio.
    return explicacion + lugar + ' (Mensaje original: ' + error.nombre + ': ' + error.mensaje + ')';
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

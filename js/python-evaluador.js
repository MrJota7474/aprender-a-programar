// python-evaluador.js — El evaluador de la ruta de Python.
//
// Hace lo mismo que evaluador.js, pero está escrito EN Python y corre dentro
// de Pyodide (un Python completo que funciona en el navegador). Va guardado
// como texto porque es Pyodide, no JavaScript, quien lo ejecuta.
//
// Este archivo no usa nada del navegador: por eso lo comparten el Web Worker
// de la página y las pruebas automáticas que corren en Node.

globalThis.EVALUADOR_PYTHON = String.raw`
import contextlib
import io
import json
import re
import sys
import tokenize
import traceback
import types

ARCHIVO = "tu_codigo.py"

# Nombres de los modulos de la app instalados en la ejecucion anterior.
_instalados = set()


def _instalar_modulos(modulos):
    # Los modulos de la app (como "ia") llegan como texto. Aqui se convierten
    # en modulos de verdad, para que el estudiante escriba "import ia".
    # Se crean de nuevo en cada ejecucion: asi no guardan nada de la anterior.
    for nombre in _instalados - set(modulos):
        sys.modules.pop(nombre, None)
    _instalados.clear()
    for nombre, fuente in modulos.items():
        modulo = types.ModuleType(nombre)
        exec(compile(fuente, nombre + ".py", "exec"), modulo.__dict__)
        sys.modules[nombre] = modulo
        _instalados.add(nombre)


def _sin_comentarios(codigo):
    # tokenize entiende Python de verdad: no confunde un "#" dentro de un texto.
    try:
        lector = io.StringIO(codigo).readline
        fichas = [f for f in tokenize.generate_tokens(lector) if f.type != tokenize.COMMENT]
        return tokenize.untokenize(fichas)
    except Exception:
        return codigo


def _entrada_no_disponible(*argumentos):
    raise RuntimeError("input() no funciona en este editor. Guarda el dato en una variable.")


def _crear_mostrado(salida):
    # Ayuda para las pruebas: mostrado(18000) es verdadero si ese valor aparece
    # en alguna linea de la consola, aunque venga acompanado de mas texto
    # ("Precio: 18000"). Asi no se castiga a quien escribe un mensaje mas claro.
    def mostrado(valor):
        texto = str(valor)
        return any(texto in linea for linea in salida)

    return mostrado


def _describir(error):
    linea = None
    if isinstance(error, SyntaxError):
        mensaje = error.msg
        linea = error.lineno
    else:
        mensaje = str(error)
        # La última línea del código del estudiante por la que pasó el error.
        for marco in traceback.extract_tb(error.__traceback__):
            if marco.filename == ARCHIVO:
                linea = marco.lineno
    return {"nombre": type(error).__name__, "mensaje": mensaje, "linea": linea}


def evaluar(codigo, pruebas_json, modulos_json="{}"):
    pruebas = json.loads(pruebas_json)
    _instalar_modulos(json.loads(modulos_json))
    # Cada ejecución empieza con un ambito nuevo: no queda nada de la anterior.
    ambito = {"__name__": "__main__", "input": _entrada_no_disponible}
    consola = io.StringIO()
    error = None

    with contextlib.redirect_stdout(consola), contextlib.redirect_stderr(consola):
        try:
            exec(compile(codigo, ARCHIVO, "exec"), ambito)
        except BaseException as problema:
            error = _describir(problema)

    salida = consola.getvalue().splitlines()
    resultados = []

    if error is None:
        # Las pruebas ven las variables del estudiante, mas "salida" (lo que
        # mostro), "codigo" (lo que escribio, sin comentarios), la ayuda
        # mostrado() y el modulo re.
        ambito_prueba = {
            **ambito,
            "salida": salida,
            "codigo": _sin_comentarios(codigo),
            "mostrado": _crear_mostrado(salida),
            "re": re,
        }
        for prueba in pruebas:
            try:
                # Si la prueba llama a una funcion que hace print, no debe
                # ensuciar la consola del estudiante.
                with contextlib.redirect_stdout(io.StringIO()):
                    aprobada = eval(prueba["condicion"], ambito_prueba) is True
            except BaseException:
                aprobada = False
            resultados.append({"descripcion": prueba["descripcion"], "aprobada": aprobada})

    return json.dumps({"salida": salida, "error": error, "resultados": resultados})
`;

// Recibe un Pyodide ya cargado y devuelve una función con el mismo contrato
// que evaluarCodigo: (codigo, pruebas) → { salida, error, resultados }.
// Los datos cruzan entre JavaScript y Python como texto JSON, que es simple
// y no deja objetos de Python "vivos" del lado de JavaScript.
globalThis.crearEvaluadorPython = function crearEvaluadorPython(pyodide) {
  pyodide.runPython(globalThis.EVALUADOR_PYTHON);
  const evaluar = pyodide.globals.get('evaluar');
  // "modulos" es opcional: { nombre: 'código Python del módulo' }.
  const ejecutar = (codigo, pruebas, modulos) =>
    JSON.parse(evaluar(codigo, JSON.stringify(pruebas), JSON.stringify(modulos)));
  // Si el código importa numpy o pandas y todavía no están cargados, hay que
  // esperar a que carguen: en ese caso (y solo en ese) se devuelve una
  // PROMESA del resultado. Lo normal sigue siendo inmediato, porque varias
  // pruebas usan el resultado sin await. Quien no sepa qué código le llega
  // debe usar await (o .then), que sirve para los dos casos.
  return (codigo, pruebas, modulos = {}) => {
    const faltan = globalThis.paquetesQueFaltan(pyodide, codigo);
    if (faltan.length === 0) return ejecutar(codigo, pruebas, modulos);
    return pyodide
      // messageCallback vacío: sin los avisos en inglés de Pyodide en la consola.
      .loadPackage(faltan, { messageCallback: () => {} })
      .then(() => ejecutar(codigo, pruebas, modulos));
  };
};

// Librerías de Pyodide guardadas en vendor/pyodide/ (ver su LEEME.txt), con
// las que cada una necesita para funcionar. Solo estas: Pyodide conoce cientos
// de paquetes más, pero los demás no están en la carpeta y pedirlos
// intentaría bajarlos de internet.
globalThis.PAQUETES_DE_DATOS = Object.freeze({
  numpy: Object.freeze(['numpy']),
  pandas: Object.freeze(['numpy', 'pandas', 'python-dateutil', 'pytz', 'six']),
});

// Los paquetes de PAQUETES_DE_DATOS que el código importa y Pyodide aún no
// ha cargado. No usamos loadPackagesFromImports a secas porque intentaría
// cargar cualquier paquete de la lista de Pyodide (y fallaría sin internet);
// find_imports es la herramienta que esa función usa por dentro para leer
// los import del código.
globalThis.paquetesQueFaltan = function paquetesQueFaltan(pyodide, codigo) {
  let importados;
  try {
    const lista = pyodide.pyimport('pyodide.code').find_imports(codigo);
    importados = lista.toJs();
    lista.destroy();
  } catch (error) {
    // Código con errores de escritura: no hay import que leer. El error de
    // verdad lo mostrará evaluar() con su explicación en español.
    return [];
  }
  const necesarios = importados.flatMap((nombre) => globalThis.PAQUETES_DE_DATOS[nombre] || []);
  return [...new Set(necesarios)].filter((paquete) => !(paquete in pyodide.loadedPackages));
};

// Ruta "Entender proyectos hechos con IA", lección 1. El lenguaje es Python y
// las "condicion" de las pruebas también. Toda la ruta usa el módulo
// "proyecto" (ver 00-modulo-proyecto.js): un proyecto web de verdad, con
// frontend en React y backend en Flask, guardado como {ruta: contenido}.
//
// Formato de cada lección (el mismo de las demás rutas):
// - idea: un ejemplo que se ejecuta sin pruebas y muestra algo.
// - practica y reto: código inicial que NO pasa, pruebas, 3 pistas y solución.
// - Las pruebas llaman las funciones del estudiante con datos distintos a los
//   del ejemplo: piden un comportamiento, no una forma de escribir el código.
// - Las pruebas usan __import__("proyecto") en vez de "proyecto" por si el
//   estudiante borra el import: así fallan con un mensaje, no con un error raro.

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'el-mapa-del-proyecto',
    titulo: 'El mapa de un proyecto',
    pasos: [
      {
        id: 'idea',
        titulo: 'Abrir un proyecto que no escribiste',
        texto: [
          'Cuando le pides a Claude Code "hazme una app de domicilios", en un minuto aparecen veinte archivos en diez carpetas. Funciona, pero si no sabes dónde vive cada cosa no puedes cambiarla, ni revisarla, ni explicarle a nadie qué hiciste. Esta ruta es para eso: entender el proyecto como si lo hubieras escrito tú.',
          'Casi todos los proyectos web siguen el mismo mapa. **`frontend/`** es la página que ve el cliente; **`backend/`** es el servidor que guarda y calcula. Dentro, **`src/`** (de *source*, fuente) es el código que tú escribes; **`public/`** son archivos que se entregan tal cual, como el logo; **`tests/`** son las pruebas. En la raíz, **`README.md`** explica qué es y cómo se arranca: es lo **primero** que se lee. **`CLAUDE.md`** son las instrucciones para la IA. Los que empiezan con punto (`.gitignore`, `.env.example`) son de configuración.',
          'El **punto de entrada** es el archivo donde todo empieza. En el frontend es `index.html`, que carga `src/main.jsx`, que pinta el componente `App`. En el backend es `app.py`. Desde ahí sigues los `import` y llegas a todo lo demás.',
          'Corre el ejemplo: `proyecto.abrir()` te da el proyecto "Domicilios Don Pepe" como un diccionario `{ruta: contenido}`, y `proyecto.arbol()` lo dibuja como el comando `tree`.',
        ],
        codigo: [
          'import proyecto',
          '',
          'archivos = proyecto.abrir()',
          'print(proyecto.arbol(archivos))',
          'print()',
          'print("El proyecto tiene", len(archivos), "archivos.")',
          'print()',
          'print("--- El punto de entrada del frontend: frontend/index.html ---")',
          'print(archivos["frontend/index.html"])',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: '¿Qué hay en esta carpeta?',
        texto: [
          'Lo primero que hace un agente como Claude Code al abrir un proyecto es listar carpetas. Crea el cuerpo de `archivos_en(archivos, carpeta)`: devuelve, **ordenadas**, las rutas de todos los archivos que están dentro de esa carpeta, a cualquier profundidad.',
          'Ojo con una trampa: `"src2/datos.js"` **no** está dentro de la carpeta `"src"`, aunque empiece con esas letras. Una ruta está dentro de `carpeta` si empieza con `carpeta + "/"`.',
        ],
        codigo: [
          'import proyecto',
          '',
          '',
          'def archivos_en(archivos, carpeta):',
          '    # Esta versión tiene dos fallas: búscalas con las pruebas',
          '    return [ruta for ruta in archivos if carpeta in ruta]',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(archivos_en(archivos, "backend/tests"))',
          'print(archivos_en(archivos, "frontend/src"))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Encuentra las pruebas del backend',
            condicion:
              'archivos_en(__import__("proyecto").abrir(), "backend/tests") == ["backend/tests/test_api.py", "backend/tests/test_precios.py"]',
          },
          {
            descripcion: 'Incluye las subcarpetas (los componentes están dentro de frontend/src)',
            condicion:
              'archivos_en(__import__("proyecto").abrir(), "frontend/src") == ["frontend/src/App.jsx", "frontend/src/api.js", "frontend/src/components/Carrito.jsx", "frontend/src/components/Menu.jsx", "frontend/src/estilos.css", "frontend/src/main.jsx"]',
          },
          {
            descripcion: '"src2/b.js" no está dentro de la carpeta "src"',
            condicion: 'archivos_en({"src/a.js": "", "src2/b.js": "", "otro/src/c.js": ""}, "src") == ["src/a.js"]',
          },
          {
            descripcion: 'Devuelve las rutas ordenadas',
            condicion: 'archivos_en({"api/z.py": "", "api/a.py": "", "api/m/b.py": ""}, "api") == ["api/a.py", "api/m/b.py", "api/z.py"]',
          },
          {
            descripcion: 'Una carpeta que no existe da una lista vacía',
            condicion: 'archivos_en(__import__("proyecto").abrir(), "docs") == []',
          },
        ],
        pistas: [
          '`carpeta in ruta` busca el texto en cualquier parte: `"src" in "otro/src/c.js"` es verdadero. Necesitas que la ruta **empiece** así.',
          'Usa `ruta.startswith(carpeta + "/")`: el `"/"` evita que `"src"` coincida con `"src2"`.',
          '`return sorted(ruta for ruta in archivos if ruta.startswith(carpeta + "/"))`',
        ],
        solucion: [
          'import proyecto',
          '',
          '',
          'def archivos_en(archivos, carpeta):',
          '    return sorted(ruta for ruta in archivos if ruta.startswith(carpeta + "/"))',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(archivos_en(archivos, "backend/tests"))',
          'print(archivos_en(archivos, "frontend/src"))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: ¿dónde vive esta función?',
        texto: [
          'La pregunta que más te vas a hacer en un proyecto ajeno: "¿dónde está definido `enviarPedido`?". Buscar el nombre no basta, porque aparece también donde se **usa** y donde se **importa**: en `App.jsx` sale dos veces y no está definido ahí.',
          'Crea `donde_se_define(archivos, nombre)`: recorre las rutas **en orden** y devuelve la primera donde aparezca `def nombre`, `function nombre` o `class nombre` (así se definen funciones y clases en Python y en JavaScript). Si no está en ningún archivo, devuelve `None`.',
          'Busca el nombre **completo**: `"ver"` no debe coincidir con `def ver_menu`. Las expresiones regulares tienen `\\b` (borde de palabra) justo para eso.',
        ],
        codigo: [
          'import proyecto',
          'import re',
          '',
          '',
          'def donde_se_define(archivos, nombre):',
          '    # Esta versión devuelve el primer archivo donde aparece el nombre',
          '    for ruta in archivos:',
          '        if nombre in archivos[ruta]:',
          '            return ruta',
          '    return None',
          '',
          '',
          'archivos = proyecto.abrir()',
          'for nombre in ["enviarPedido", "total", "Carrito"]:',
          '    print(nombre, "->", donde_se_define(archivos, nombre))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'enviarPedido se define en frontend/src/api.js (App.jsx solo lo usa)',
            condicion: 'donde_se_define(__import__("proyecto").abrir(), "enviarPedido") == "frontend/src/api.js"',
          },
          {
            descripcion: 'total se define en backend/precios.py (app.py solo lo importa)',
            condicion: 'donde_se_define(__import__("proyecto").abrir(), "total") == "backend/precios.py"',
          },
          {
            descripcion: 'El componente Carrito se define en su propio archivo',
            condicion: 'donde_se_define(__import__("proyecto").abrir(), "Carrito") == "frontend/src/components/Carrito.jsx"',
          },
          {
            descripcion: 'Encuentra clases, y busca el nombre completo ("ver" no es "ver_menu")',
            condicion:
              'donde_se_define({"b.py": "class Tienda:\\n    pass", "a.py": "def ver_menu():\\n    pass"}, "Tienda") == "b.py" and donde_se_define({"a.py": "def ver_menu():\\n    pass"}, "ver") is None',
          },
          {
            descripcion: 'Si nadie lo define, devuelve None',
            condicion: 'donde_se_define(__import__("proyecto").abrir(), "pagar_con_tarjeta") is None',
          },
        ],
        pistas: [
          'Recorre `sorted(archivos)` para ir en orden, y arma un patrón con las tres formas: `r"(def|function|class)\\s+" + nombre + r"\\b"`.',
          '`\\s+` son uno o más espacios y `\\b` exige que el nombre termine ahí. Si el nombre trajera símbolos raros, `re.escape(nombre)` los protege.',
          'Dentro del for: `if re.search(patron, archivos[ruta]): return ruta`. Después del for, `return None`.',
        ],
        solucion: [
          'import proyecto',
          'import re',
          '',
          '',
          'def donde_se_define(archivos, nombre):',
          '    patron = r"(def|function|class)\\s+" + re.escape(nombre) + r"\\b"',
          '    for ruta in sorted(archivos):',
          '        if re.search(patron, archivos[ruta]):',
          '            return ruta',
          '    return None',
          '',
          '',
          'archivos = proyecto.abrir()',
          'for nombre in ["enviarPedido", "total", "Carrito"]:',
          '    print(nombre, "->", donde_se_define(archivos, nombre))',
        ].join('\n'),
      },
    ],
  }
);

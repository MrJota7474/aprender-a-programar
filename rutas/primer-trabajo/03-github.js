// Ruta "Tu primer trabajo", lección 3: GitHub, buenos commits y pull requests.
// Mezcla motores: la idea y el reto usan la terminal con Git simulado
// (js/terminal-evaluador.js, donde están las ayudas commits(), ramas(), …) y
// la práctica es Python. paso.motor elige el motor de cada paso.
//
// Las pruebas de la terminal miran el ESTADO final (ramas, commits, archivos)
// y no el texto exacto: aprueban con cualquier nombre de rama o mensaje que
// cumpla las reglas.
(function () {
  'use strict';

  const PAGINA = ['<h1>Tienda de Don Pepe</h1>', '<p>Arepas, tinto y buñuelos</p>'].join('\n');
  const PRECIOS = ['Arepa de queso: 3500', 'Tinto: 2000', 'Buñuelo: 1500'].join('\n');
  const PRIMER_COMMIT = 'git init\ngit add .\ngit commit -m "Primera versión de la página y los precios"';

  // Las mismas reglas de la práctica, escritas en JavaScript para revisar el
  // mensaje del commit del reto. "m" es el mensaje del último commit de la rama.
  const MENSAJE_DE_LA_RAMA = 'ultimoCommit(ramas().find((r) => r !== "main")).mensaje';
  const MENSAJE_BUENO =
    `((m) => m.length >= 10 && m.length <= 72 && !m.endsWith(".") && ` +
    `!["cambios", "arreglos", "update", "fix", "wip", "varios", "asdf", "listo"].includes(m.toLowerCase()))` +
    `(${MENSAJE_DE_LA_RAMA}.split("\\n")[0].trim())`;

  const GENERICOS = 'GENERICOS = {"cambios", "arreglos", "update", "fix", "wip", "varios", "asdf", "listo"}';

  globalThis.Rutas.agregarLeccion('primer-trabajo', {
    id: 'github',
    titulo: 'GitHub: tu trabajo a la vista',
    pasos: [
      {
        id: 'idea',
        motor: 'terminal',
        titulo: 'Git, GitHub y una historia que se lee',
        texto: [
          '**Git** es la herramienta que guarda la historia de tu proyecto en tu computador. **GitHub** es un sitio en internet que guarda copias de tus repositorios para compartirlas y trabajar en equipo (hay otros parecidos, como GitLab). Quien te va a contratar casi siempre abre tu GitHub.',
          '**Tu perfil**: tu nombre, una frase sobre lo que haces, un enlace a tu portafolio y tus mejores proyectos **fijados** arriba (GitHub deja fijar hasta seis). Si creas un repositorio con tu mismo nombre de usuario, su README aparece en tu perfil como presentación.',
          '**Los commits**: pequeños, uno por cada cambio con sentido, y con mensajes que digan **qué** cambió, como «Agrega el horario de atención». La historia también es parte del portafolio: un historial de «cambios», «cambios2» y «ya» dice mucho de cómo trabajas.',
          '**El pull request** (PR): en un equipo nadie cambia `main` directamente. Trabajas en una **rama**, la subes a GitHub con `git push` y abres un PR: una solicitud para juntar tu rama con `main`. Otra persona revisa el código, comenta y lo aprueba; después se hace el merge en GitHub. La descripción del PR cuenta qué cambia, por qué y cómo probarlo.',
          'Este repositorio ya tiene dos commits. Ejecuta el código para ver su historia: cada línea es un commit, con su código corto y su mensaje.',
        ],
        archivos: { 'index.html': PAGINA, 'precios.txt': PRECIOS },
        preparacion: [
          PRIMER_COMMIT,
          'echo "<p>Abierto de 6 a. m. a 8 p. m.</p>" >> index.html',
          'git add .',
          'git commit -m "Agrega el horario de atención"',
        ].join('\n'),
        codigo: ['# Una historia con mensajes claros, del commit más nuevo al más viejo', 'git log --oneline'].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Revisar un mensaje de commit',
        texto: [
          'Hay reglas sencillas que usan muchos equipos para la **primera línea** de un mensaje de commit (el resumen que muestra `git log --oneline`): que tenga entre **10 y 72** caracteres, que diga qué cambió con un verbo («Agrega», «Corrige», «Quita»), que **no termine en punto** y que no sea una palabra genérica como «cambios» o «fix».',
          'Completa `problemas_del_mensaje(mensaje)`. Mira **solo la primera línea**, sin espacios sobrantes, y devuelve la lista de problemas en este orden: `"muy corto"` (menos de 10 caracteres), `"muy largo"` (más de 72), `"genérico"` (la línea en minúsculas está en `GENERICOS`) y `"termina en punto"`.',
          'Si el mensaje está vacío o solo tiene espacios, devuelve `["vacío"]` y nada más. Si está bien, devuelve una lista vacía.',
        ],
        codigo: [
          GENERICOS,
          '',
          '',
          'def problemas_del_mensaje(mensaje):',
          '    problemas = []',
          '    # Toma la primera línea con mensaje.strip().splitlines()[0] y revisa cada regla',
          '    return problemas',
          '',
          '',
          'for mensaje in ["Agrega el horario de atención", "fix", "Se corrigió el precio de la arepa."]:',
          '    print(repr(mensaje), "->", problemas_del_mensaje(mensaje))',
        ].join('\n'),
        pruebas: [
          { descripcion: 'problemas_del_mensaje es una función', condicion: 'callable(problemas_del_mensaje)' },
          { descripcion: 'Un buen mensaje no tiene problemas', condicion: 'problemas_del_mensaje("Agrega el horario de atención") == []' },
          { descripcion: '"fix" es muy corto y genérico', condicion: 'problemas_del_mensaje("fix") == ["muy corto", "genérico"]' },
          { descripcion: '"Cambios" (con mayúscula) también es genérico', condicion: '"genérico" in problemas_del_mensaje("Cambios")' },
          { descripcion: 'Avisa si termina en punto', condicion: 'problemas_del_mensaje("Se corrigió el precio de la arepa.") == ["termina en punto"]' },
          { descripcion: 'Avisa si pasa de 72 caracteres', condicion: 'problemas_del_mensaje("Agrega " + "a" * 70) == ["muy largo"]' },
          {
            descripcion: 'Solo mira la primera línea: el detalle puede ir debajo',
            condicion: 'problemas_del_mensaje("Corrige el total del pedido\\n\\nSumaba el envío dos veces. Ahora se suma una sola vez.") == []',
          },
          { descripcion: 'Un mensaje vacío da ["vacío"]', condicion: 'problemas_del_mensaje("   ") == ["vacío"]' },
        ],
        pistas: [
          'Primero: `if not mensaje.strip(): return ["vacío"]`. Después `linea = mensaje.strip().splitlines()[0].strip()`.',
          'Cada regla es un `if` que hace `problemas.append(...)`: `len(linea) < 10`, `len(linea) > 72`, `linea.lower() in GENERICOS` y `linea.endswith(".")`.',
          'Respeta el orden: corto, largo, genérico y punto. Así `"fix"` da `["muy corto", "genérico"]`.',
        ],
        solucion: [
          GENERICOS,
          '',
          '',
          'def problemas_del_mensaje(mensaje):',
          '    if not mensaje.strip():',
          '        return ["vacío"]',
          '    # Solo cuenta la primera línea: es el resumen que se ve en git log --oneline.',
          '    linea = mensaje.strip().splitlines()[0].strip()',
          '    problemas = []',
          '    if len(linea) < 10:',
          '        problemas.append("muy corto")',
          '    if len(linea) > 72:',
          '        problemas.append("muy largo")',
          '    if linea.lower() in GENERICOS:',
          '        problemas.append("genérico")',
          '    if linea.endswith("."):',
          '        problemas.append("termina en punto")',
          '    return problemas',
          '',
          '',
          'for mensaje in ["Agrega el horario de atención", "fix", "Se corrigió el precio de la arepa."]:',
          '    print(repr(mensaje), "->", problemas_del_mensaje(mensaje))',
        ].join('\n'),
      },
      {
        id: 'reto',
        motor: 'terminal',
        titulo: 'Reto: una rama lista para un pull request',
        texto: [
          'Don Pepe empezó a vender **empanadas** y quiere que aparezcan en la lista de precios. Vas a preparar el cambio como en un equipo: en una **rama propia**, con un buen commit, y **sin** juntarlo con `main`. El merge lo hace GitHub cuando alguien aprueba el pull request.',
          'Tu reto: crea una rama con un nombre descriptivo en minúsculas y con guiones (como `agrega-empanadas`), agrega la línea `Empanada: 2500` al final de `precios.txt` con `echo` y `>>`, y guárdala en un commit con un mensaje que cumpla las reglas de la práctica. El precio es de ejemplo.',
          'En tu computador seguirías con `git push -u origin agrega-empanadas` y abrirías el pull request en GitHub. Este simulador no tiene internet, así que `git push` no está; quédate con la rama lista.',
          'Una buena descripción de PR para este cambio: «**Qué**: agrega las empanadas a la lista de precios. **Por qué**: Don Pepe empezó a venderlas. **Cómo probarlo**: abrir `precios.txt` y ver la última línea».',
        ],
        archivos: { 'index.html': PAGINA, 'precios.txt': PRECIOS },
        preparacion: PRIMER_COMMIT,
        codigo: ['# Mira en qué rama estás', 'git branch', ''].join('\n'),
        pruebas: [
          { descripcion: 'Creaste una rama además de main', condicion: 'ramas().some((r) => r !== "main")' },
          {
            descripcion: 'La rama tiene un nombre descriptivo: minúsculas y guiones, sin espacios',
            condicion: 'ramas().some((r) => r !== "main" && /^[a-z0-9]+(-[a-z0-9]+)+$/.test(r))',
          },
          {
            descripcion: 'En la rama hay un commit con las empanadas en precios.txt',
            condicion: 'ramas().some((r) => r !== "main" && /Empanada/i.test(ultimoCommit(r).archivos["precios.txt"] || ""))',
          },
          {
            descripcion: 'Los precios de antes siguen ahí (usaste >>, no >)',
            condicion: 'ramas().some((r) => r !== "main" && (ultimoCommit(r).archivos["precios.txt"] || "").includes("Arepa de queso"))',
          },
          { descripcion: 'El mensaje del commit cumple las reglas de la práctica', condicion: 'ramas().some((r) => r !== "main") && ' + MENSAJE_BUENO },
          {
            descripcion: 'main sigue sin las empanadas: el merge lo hace el pull request',
            condicion: 'ramas().some((r) => r !== "main") && !/Empanada/i.test(ultimoCommit("main").archivos["precios.txt"] || "")',
          },
          { descripcion: 'No quedó nada sin guardar', condicion: 'limpio()' },
        ],
        pistas: [
          'Crea la rama y pásate a ella: `git switch -c agrega-empanadas`.',
          'Agrega la línea con `echo "Empanada: 2500" >> precios.txt`, y luego `git add precios.txt`.',
          'Guarda con un mensaje claro, sin punto final: `git commit -m "Agrega las empanadas a la lista de precios"`. No hagas `git merge`.',
        ],
        solucion: [
          'git branch',
          'git switch -c agrega-empanadas',
          'echo "Empanada: 2500" >> precios.txt',
          'git diff',
          'git add precios.txt',
          'git commit -m "Agrega las empanadas a la lista de precios"',
          'git log --oneline',
        ].join('\n'),
      },
    ],
  });
})();

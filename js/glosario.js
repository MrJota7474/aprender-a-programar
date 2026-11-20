// glosario.js — El diccionario de palabras técnicas de las lecciones y el
// panel "Glosario" con buscador.
//
// formato.js usa este diccionario para marcar la primera vez que aparece un
// término en un párrafo: al pasar el mouse, tocarlo o enfocarlo con el
// teclado se ve su definición. Las definiciones salen SOLO de esta lista fija
// (nunca del texto del estudiante), y formato.js igual las escapa al pintarlas.
//
// Los términos se eligieron contando las palabras técnicas más frecuentes en
// los textos de todas las lecciones (un script de Node que las recorre igual
// que pruebas/lecciones.test.js).
//
// Cada término:
//   termino     → como se muestra en el glosario.
//   formas      → otras maneras de escribirlo en las lecciones (plurales…).
//   definicion  → 1 o 2 frases sencillas.
//   ejemplo     → (opcional) un mini ejemplo de código.
//   evitarTras  → (opcional) expresión que, si calza con el texto justo antes,
//                 indica que la palabra no es el término ("ya está lista").
//   marcar      → (opcional) false si es tan común que marcarlo en cada
//                 párrafo estorbaría; igual aparece en el panel.
//
// Va antes de formato.js en index.html. Es un script clásico: en Node (las
// pruebas) solo registra el diccionario; el panel se arma solo si hay página.

(function () {
  'use strict';

  const TERMINOS = [
    // ---------- Lo básico de programar ----------
    { termino: 'código', marcar: false, definicion: 'Las instrucciones que escribes para que el computador las siga, en un lenguaje como Python o JavaScript.' },
    { termino: 'programa', formas: ['programas'], marcar: false, definicion: 'Un conjunto de instrucciones guardadas que el computador ejecuta de principio a fin.' },
    { termino: 'variable', formas: ['variables'], definicion: 'Una caja con nombre donde guardas un valor para usarlo después.', ejemplo: 'edad = 16' },
    { termino: 'constante', formas: ['constantes'], definicion: 'Una variable cuyo valor no debe cambiar. En JavaScript se crea con const.', ejemplo: 'const IVA = 0.19;' },
    { termino: 'valor', formas: ['valores'], definicion: 'Un dato concreto: un número, un texto, True o False, una lista…', ejemplo: '16, "Cali", True' },
    { termino: 'tipo de dato', formas: ['tipos de datos', 'tipo de datos', 'tipos de dato'], definicion: 'La clase de valor que es algo: número, texto, booleano, lista… El tipo decide qué operaciones se pueden hacer.', ejemplo: 'type(16)  # int' },
    { termino: 'string', formas: ['strings', 'cadena de texto', 'cadenas de texto'], definicion: 'Un texto dentro del programa. Va entre comillas para que el computador sepa que no es un nombre de variable.', ejemplo: '"Hola, Bogotá"' },
    { termino: 'entero', formas: ['enteros', 'número entero', 'números enteros'], definicion: 'Un número sin decimales, positivo o negativo. En Python su tipo se llama int.', ejemplo: '-3, 0, 42' },
    { termino: 'decimal', formas: ['decimales', 'número decimal', 'números decimales'], definicion: 'Un número con parte después del punto. En Python su tipo se llama float, y se escribe con punto, no con coma.', ejemplo: '3.5' },
    { termino: 'booleano', formas: ['booleanos', 'booleana', 'booleanas'], definicion: 'Un valor que solo puede ser verdadero o falso. Es lo que devuelve una comparación.', ejemplo: 'True, False (en JavaScript: true, false)' },
    { termino: 'None', formas: ['null', 'undefined'], definicion: 'El valor "nada": la caja existe pero está vacía. En Python es None; en JavaScript, null o undefined; en SQL, NULL.', ejemplo: 'resultado = None' },
    { termino: 'operador', formas: ['operadores'], definicion: 'Un símbolo que hace una operación con valores: sumar, comparar, unir…', ejemplo: '+  -  *  /  ==  >' },
    { termino: 'concatenar', formas: ['concatena', 'concatenación'], definicion: 'Unir textos uno detrás de otro, casi siempre con +.', ejemplo: '"Hola, " + nombre' },
    { termino: 'f-string', formas: ['f-strings'], definicion: 'Un texto de Python con una f antes de las comillas: lo que va entre llaves { } se reemplaza por su valor.', ejemplo: 'f"Tienes {edad} años"' },
    { termino: 'condición', formas: ['condiciones'], definicion: 'Una pregunta que da verdadero o falso y decide qué parte del código se ejecuta.', ejemplo: 'if edad >= 18:' },
    { termino: 'condicional', formas: ['condicionales'], definicion: 'Una instrucción (if, else) que ejecuta un bloque solo si se cumple una condición.', ejemplo: 'if precio > 5000:\n    print("caro")' },
    { termino: 'bucle', formas: ['bucles', 'ciclo for', 'ciclo while'], definicion: 'Un bloque de código que se repite: por cada elemento (for) o mientras algo sea cierto (while).', ejemplo: 'for fruta in frutas:\n    print(fruta)' },
    { termino: 'iterar', formas: ['iteración', 'iteraciones', 'itera'], definicion: 'Recorrer uno por uno los elementos de una lista, un texto u otra colección.', ejemplo: 'for letra in "sol":' },
    { termino: 'sangría', formas: ['sangrías', 'indentación'], definicion: 'Los espacios al comienzo de una línea. En Python marcan qué líneas van dentro de un if, for o def: usa 4 espacios.', ejemplo: 'if listo:\n    print("ya")' },
    { termino: 'comentario', formas: ['comentarios'], definicion: 'Una nota para personas que el computador ignora. En Python empieza con #; en JavaScript, con //.', ejemplo: '# esto no se ejecuta' },
    { termino: 'sintaxis', definicion: 'Las reglas de escritura de un lenguaje: dónde van los paréntesis, las comillas, los dos puntos…' },
    { termino: 'consola', formas: ['consolas'], definicion: 'El área donde aparece lo que tu programa muestra con print( ) o console.log( ).' },
    { termino: 'editor', formas: ['editores'], definicion: 'El programa (o el recuadro de la lección) donde escribes el código.' },

    // ---------- Funciones y estructuras ----------
    { termino: 'función', formas: ['funciones'], definicion: 'Un bloque de código con nombre que haces una vez y usas muchas. Puede recibir datos y devolver un resultado.', ejemplo: 'def saludar(nombre):\n    return "Hola " + nombre' },
    { termino: 'parámetro', formas: ['parámetros'], definicion: 'El nombre que recibe un dato dentro de una función. Se escribe entre los paréntesis al crearla.', ejemplo: 'def doble(numero):  # numero es el parámetro' },
    { termino: 'argumento', formas: ['argumentos'], definicion: 'El valor que le pasas a una función al llamarla.', ejemplo: 'doble(5)  # 5 es el argumento' },
    { termino: 'return', formas: ['retorno', 'devolver'], definicion: 'La instrucción que termina una función y entrega un resultado a quien la llamó.', ejemplo: 'return precio * 2' },
    { termino: 'lista', formas: ['listas'], evitarTras: /(?:^|\s)(?:está|están|esté|estará|estaba|estar|queda|quedan|quedó|quede|herramientas|rama)\s+$/i, definicion: 'Varios valores guardados en orden, entre corchetes. Cada uno tiene una posición que empieza en 0.', ejemplo: 'frutas = ["mango", "lulo"]' },
    { termino: 'arreglo', formas: ['arreglos', 'array', 'arrays'], definicion: 'El nombre de la lista en JavaScript: valores en orden, entre corchetes.', ejemplo: 'const notas = [4.5, 3.8];' },
    { termino: 'índice', formas: ['índices'], definicion: 'La posición de un elemento en una lista. Se cuenta desde 0: el primero es el 0.', ejemplo: 'frutas[0]  # el primero' },
    { termino: 'elemento', formas: ['elementos'], definicion: 'Cada valor dentro de una lista. En HTML, cada pieza de la página (un párrafo, un botón…).' },
    { termino: 'tupla', formas: ['tuplas'], definicion: 'Una lista de Python que no se puede cambiar. Va entre paréntesis.', ejemplo: 'punto = (3, 4)' },
    { termino: 'conjunto', formas: ['conjuntos', 'set'], definicion: 'Una colección sin repetidos y sin orden. En Python se escribe con llaves o con set( ).', ejemplo: 'set([1, 1, 2])  # {1, 2}' },
    { termino: 'diccionario', formas: ['diccionarios'], definicion: 'Datos guardados en parejas clave: valor, entre llaves. Buscas el valor por su clave, no por posición.', ejemplo: 'cliente = {"nombre": "Ana", "edad": 30}' },
    { termino: 'clave', formas: ['claves'], definicion: 'El nombre con el que se busca un valor en un diccionario (o en un objeto de JavaScript).', ejemplo: 'cliente["nombre"]' },
    { termino: 'comprensión de listas', formas: ['comprensión', 'comprensiones'], definicion: 'Una forma corta de Python para crear una lista a partir de otra en una sola línea.', ejemplo: '[n * 2 for n in numeros]' },
    { termino: 'recursión', formas: ['recursiva', 'recursivo', 'recursivas'], definicion: 'Cuando una función se llama a sí misma con un problema más pequeño, hasta llegar a un caso base que ya no se llama.' },
    { termino: 'módulo', formas: ['módulos'], definicion: 'Un archivo con funciones listas para usar que traes a tu programa con import.', ejemplo: 'import math' },
    { termino: 'librería', formas: ['librerías', 'biblioteca', 'bibliotecas'], definicion: 'Código que otras personas ya escribieron y compartieron para que no empieces de cero.', ejemplo: 'import pandas' },
    { termino: 'import', definicion: 'La instrucción que trae un módulo o una librería a tu programa.', ejemplo: 'from math import sqrt' },
    { termino: 'excepción', formas: ['excepciones'], definicion: 'Un error que ocurre mientras el programa corre. Si nadie lo atrapa, el programa se detiene.' },
    { termino: 'try', formas: ['try / except', 'try / catch'], definicion: 'Un bloque que intenta algo que puede fallar; si falla, salta a except (Python) o catch (JavaScript) en vez de detenerse.', ejemplo: 'try:\n    n = int(texto)\nexcept ValueError:\n    n = 0' },
    { termino: 'depurar', formas: ['depuración', 'depura'], definicion: 'Buscar y arreglar los errores de un programa: leer el mensaje, ubicar la línea, probar una idea.' },

    // ---------- Objetos y clases ----------
    { termino: 'objeto', formas: ['objetos'], definicion: 'Un valor que agrupa datos (propiedades) y acciones (métodos) bajo un mismo nombre.', ejemplo: 'const carro = { marca: "Renault" };' },
    { termino: 'propiedad', formas: ['propiedades'], definicion: 'Un dato que pertenece a un objeto. Se lee con un punto.', ejemplo: 'carro.marca' },
    { termino: 'método', formas: ['métodos'], definicion: 'Una función que pertenece a un valor u objeto. Se llama con un punto.', ejemplo: '"hola".upper()' },
    { termino: 'clase', formas: ['clases'], definicion: 'Un molde para crear objetos del mismo tipo, con sus datos y sus métodos.', ejemplo: 'class Producto:' },
    { termino: 'instancia', formas: ['instancias'], definicion: 'Un objeto concreto creado a partir de una clase.', ejemplo: 'arepa = Producto("Arepa", 2500)' },
    { termino: 'constructor', formas: ['constructores'], definicion: 'El método que prepara un objeto nuevo al crearlo: __init__ en Python, constructor en JavaScript.' },

    // ---------- JavaScript asíncrono ----------
    { termino: 'callback', formas: ['callbacks'], definicion: 'Una función que le pasas a otra para que la llame después.', ejemplo: 'setTimeout(saludar, 1000)' },
    { termino: 'asíncrono', formas: ['asíncrona', 'asíncronos', 'asíncronas', 'async'], definicion: 'Código que no espera de inmediato: pide algo lento (como datos de internet) y sigue cuando llega la respuesta.' },
    { termino: 'promesa', formas: ['promesas', 'Promise'], definicion: 'Un valor que todavía no está, pero llegará (o fallará) más tarde. Se espera con await.' },
    { termino: 'await', definicion: 'Espera a que una promesa termine y entrega su resultado. Solo se usa dentro de una función async.', ejemplo: 'const datos = await respuesta.json();' },
    { termino: 'fetch', definicion: 'La función de JavaScript que pide datos a una dirección de internet (a una API).', ejemplo: 'await fetch("https://api.tienda-donpepe.co/productos")' },

    // ---------- Web ----------
    { termino: 'HTML', definicion: 'El lenguaje que describe el contenido de una página: títulos, párrafos, imágenes, enlaces.', ejemplo: '<h1>Hola</h1>' },
    { termino: 'CSS', definicion: 'El lenguaje que le da estilo a una página: colores, tamaños, espacios y posiciones.', ejemplo: 'h1 { color: navy; }' },
    { termino: 'etiqueta', formas: ['etiquetas'], definicion: 'En HTML, la marca entre < > que dice qué es cada parte. En aprendizaje automático, la respuesta correcta de cada ejemplo.', ejemplo: '<p>Un párrafo</p>' },
    { termino: 'atributo', formas: ['atributos'], definicion: 'Un dato extra dentro de la etiqueta de apertura de HTML, con la forma nombre="valor".', ejemplo: '<img src="foto.jpg" alt="Mi perro">' },
    { termino: 'selector', formas: ['selectores'], definicion: 'La parte de una regla de CSS que dice a qué elementos se aplica.', ejemplo: '.precio { color: green; }' },
    { termino: 'DOM', definicion: 'La página convertida en objetos que JavaScript puede leer y cambiar.', ejemplo: 'document.querySelector("h1")' },
    { termino: 'evento', formas: ['eventos'], definicion: 'Algo que pasa en la página (un clic, una tecla) y que JavaScript puede escuchar para reaccionar.', ejemplo: 'boton.addEventListener("click", comprar)' },
    { termino: 'flexbox', definicion: 'Una forma de CSS para acomodar elementos en fila o en columna y repartir el espacio entre ellos.', ejemplo: 'display: flex;' },
    { termino: 'diseño adaptable', formas: ['responsive'], definicion: 'Una página que se acomoda bien a cualquier pantalla, del celular al computador.' },
    { termino: 'accesibilidad', definicion: 'Que la página la pueda usar todo el mundo, también quien usa lector de pantalla o solo el teclado.' },
    { termino: 'navegador', formas: ['navegadores'], definicion: 'El programa con el que abres páginas web: Chrome, Edge, Firefox, Safari.' },
    { termino: 'frontend', definicion: 'La parte de una aplicación que corre en el navegador y que la persona ve y toca.' },
    { termino: 'backend', definicion: 'La parte de una aplicación que corre en el servidor: guarda datos, aplica reglas y responde peticiones.' },
    { termino: 'servidor', formas: ['servidores'], definicion: 'Un computador (o programa) que recibe peticiones y responde con páginas o datos.' },
    { termino: 'URL', formas: ['URLs'], definicion: 'La dirección completa de algo en internet.', ejemplo: 'https://api.tienda-donpepe.co/productos' },
    { termino: 'HTTP', formas: ['HTTPS'], definicion: 'Las reglas con que el navegador y el servidor se hablan. HTTPS es la versión cifrada: nadie en el camino puede leer lo que viaja.' },
    { termino: 'petición', formas: ['peticiones', 'request'], definicion: 'Un mensaje que se le manda a un servidor para pedir o enviar datos (GET, POST…).' },
    { termino: 'código de estado', formas: ['códigos de estado'], definicion: 'El número con que el servidor dice cómo le fue a una petición: 200 bien, 404 no existe, 500 falló el servidor.' },
    { termino: 'API', formas: ['APIs'], definicion: 'Una puerta para que un programa le pida datos o servicios a otro, con reglas fijas.', ejemplo: 'GET /productos' },
    { termino: 'REST', definicion: 'Una forma ordenada de diseñar una API: cada cosa tiene su dirección y se usan GET, POST, PUT y DELETE.' },
    { termino: 'endpoint', formas: ['endpoints'], definicion: 'Cada dirección de una API que responde algo concreto.', ejemplo: '/productos/1' },
    { termino: 'JSON', definicion: 'Un formato de texto para guardar y enviar datos, con llaves y corchetes como los diccionarios y listas.', ejemplo: '{"nombre": "Ana", "edad": 30}' },
    { termino: 'componente', formas: ['componentes'], definicion: 'En React, una función que dibuja una parte de la página y se puede reusar.', ejemplo: 'function Tarjeta(props) { … }' },
    { termino: 'props', definicion: 'Los datos que un componente de React recibe desde afuera, como los argumentos de una función.' },
    { termino: 'React', definicion: 'Una librería de JavaScript para construir páginas a partir de componentes.' },
    { termino: 'framework', formas: ['frameworks'], definicion: 'Un esqueleto de aplicación ya armado (Django, Flask, Express) donde tú llenas las partes propias.' },

    // ---------- Bases de datos ----------
    { termino: 'SQL', definicion: 'El lenguaje para pedirle datos a una base de datos y cambiarlos.', ejemplo: 'SELECT nombre FROM productos;' },
    { termino: 'base de datos', formas: ['bases de datos'], definicion: 'Un lugar organizado donde se guardan datos en tablas, para buscarlos y cambiarlos rápido.' },
    { termino: 'tabla', formas: ['tablas'], definicion: 'Datos organizados en filas y columnas, en una base de datos o en una página.' },
    { termino: 'fila', formas: ['filas'], definicion: 'Un renglón de una tabla: un dato completo, como un producto o un cliente.' },
    { termino: 'columna', formas: ['columnas'], definicion: 'Una característica que tienen todas las filas de una tabla, como el nombre o el precio.' },
    { termino: 'consulta', formas: ['consultas', 'query'], definicion: 'Una pregunta escrita en SQL que le haces a la base de datos.', ejemplo: 'SELECT * FROM clientes;' },
    { termino: 'JOIN', definicion: 'Une filas de dos tablas que comparten un dato, como el id del cliente en sus pedidos.', ejemplo: 'FROM pedidos JOIN clientes ON pedidos.cliente_id = clientes.id' },
    { termino: 'clave primaria', formas: ['claves primarias', 'PRIMARY KEY'], definicion: 'La columna que identifica cada fila sin repetirse, casi siempre el id.' },
    { termino: 'clave foránea', formas: ['claves foráneas', 'FOREIGN KEY'], definicion: 'Una columna que guarda el id de una fila de otra tabla, para conectarlas.', ejemplo: 'cliente_id' },
    { termino: 'inyección SQL', definicion: 'Un ataque que mete SQL dentro de un dato escrito por el usuario. Se evita con consultas parametrizadas (con ?).' },
    { termino: 'CSV', definicion: 'Un archivo de texto con una tabla: cada línea es una fila y las columnas se separan con comas.', ejemplo: 'nombre,precio\nArepa,2500' },

    // ---------- Herramientas del oficio ----------
    { termino: 'terminal', formas: ['terminales', 'línea de comandos'], definicion: 'Una ventana donde le das órdenes al computador escribiendo comandos en vez de hacer clic.' },
    { termino: 'comando', formas: ['comandos'], definicion: 'Una orden escrita en la terminal.', ejemplo: 'git status' },
    { termino: 'PATH', definicion: 'La lista de carpetas donde el computador busca los programas que escribes en la terminal.' },
    { termino: 'Git', definicion: 'Un programa que guarda la historia de tu proyecto: puedes ver qué cambió y volver atrás.' },
    { termino: 'repositorio', formas: ['repositorios', 'repo'], definicion: 'Una carpeta de proyecto que Git vigila, con toda su historia.' },
    { termino: 'commit', formas: ['commits'], definicion: 'Una foto guardada del proyecto en Git, con un mensaje que dice qué cambió.', ejemplo: 'git commit -m "Agrega el carrito"' },
    { termino: 'rama', formas: ['ramas', 'branch'], definicion: 'Una línea de trabajo aparte en Git, para probar cambios sin dañar la principal.', ejemplo: 'git switch -c nueva-funcion' },
    { termino: 'merge', definicion: 'Juntar en una rama los cambios hechos en otra.', ejemplo: 'git merge nueva-funcion' },
    { termino: 'diff', definicion: 'La lista de diferencias entre dos versiones: qué líneas se agregaron y cuáles se quitaron.' },
    { termino: 'pull request', formas: ['pull requests'], definicion: 'Una solicitud en GitHub para que revisen tus cambios antes de juntarlos con la rama principal.' },
    { termino: 'GitHub', definicion: 'Un sitio web para guardar repositorios de Git en internet y trabajar en equipo.' },
    { termino: 'dependencia', formas: ['dependencias'], definicion: 'Una librería que tu proyecto necesita para funcionar.' },
    { termino: 'paquete', formas: ['paquetes'], definicion: 'Una librería empacada para instalarla con un solo comando.', ejemplo: 'pip install pandas' },
    { termino: 'pip', definicion: 'El instalador de paquetes de Python.', ejemplo: 'pip install requests' },
    { termino: 'npm', definicion: 'El instalador de paquetes de JavaScript (Node).', ejemplo: 'npm install' },
    { termino: 'entorno virtual', formas: ['entornos virtuales', 'venv'], definicion: 'Una carpeta con un Python propio para cada proyecto, para que sus paquetes no choquen con los de otro.' },
    { termino: 'variable de entorno', formas: ['variables de entorno', '.env'], definicion: 'Un dato de configuración (como una clave secreta) que se guarda fuera del código.', ejemplo: 'API_KEY=... en el archivo .env' },
    { termino: 'despliegue', formas: ['desplegar', 'deploy'], definicion: 'Subir tu aplicación a un servidor para que cualquiera la use desde internet.' },
    { termino: 'hosting', definicion: 'El servicio que te presta un computador encendido todo el tiempo para publicar tu página.' },
    { termino: 'dominio', formas: ['dominios'], definicion: 'El nombre fácil de recordar de un sitio web.', ejemplo: 'tienda-donpepe.co' },
    // Al comienzo de una frase, "Prueba" casi siempre es el verbo ("Prueba con 5").
    { termino: 'prueba', formas: ['pruebas', 'prueba automática', 'pruebas automáticas', 'test', 'tests'], evitarTras: /(?:^\s*|[.!?:]\s*|(?:^|\s)se\s+)$/i, definicion: 'Un pequeño programa que revisa solo si tu código hace lo que debe. Si algo se daña, avisa.' },

    // ---------- Fundamentos de computación ----------
    { termino: 'algoritmo', formas: ['algoritmos'], definicion: 'Una receta paso a paso para resolver un problema.' },
    { termino: 'binario', formas: ['binaria', 'binarios'], definicion: 'Un sistema de números con solo dos dígitos, 0 y 1: el que usa el computador por dentro.', ejemplo: '5 = 101' },
    { termino: 'bit', formas: ['bits'], definicion: 'La unidad mínima de información: un 0 o un 1.' },
    { termino: 'byte', formas: ['bytes'], definicion: 'Un grupo de 8 bits. Alcanza para guardar una letra sencilla.' },
    { termino: 'pila', formas: ['pilas'], definicion: 'Una estructura donde el último que entra es el primero que sale, como una pila de platos.' },
    { termino: 'cola', formas: ['colas'], definicion: 'Una estructura donde el primero que entra es el primero que sale, como la fila del banco.' },
    { termino: 'hash', formas: ['tabla hash', 'tablas hash'], definicion: 'Una función que convierte un dato en un número o código fijo. Sirve para buscar rápido y para guardar contraseñas sin dejarlas legibles.' },
    { termino: 'árbol', formas: ['árboles'], definicion: 'Datos organizados como ramas: un nodo raíz arriba y nodos hijos debajo.' },
    { termino: 'grafo', formas: ['grafos'], definicion: 'Puntos (nodos) unidos por líneas, como las ciudades y sus carreteras.' },

    // ---------- Inteligencia artificial y datos ----------
    { termino: 'inteligencia artificial', formas: ['IA'], definicion: 'Programas que aprenden patrones de muchos datos para predecir, clasificar o escribir.' },
    { termino: 'modelo', formas: ['modelos', 'modelo de lenguaje', 'modelos de lenguaje'], definicion: 'Un programa que aprendió patrones de muchos datos y con eso predice. Un modelo de lenguaje predice la siguiente palabra.' },
    { termino: 'token', formas: ['tokens'], definicion: 'Un pedacito de texto (una palabra o parte de ella) con que trabaja un modelo de lenguaje. Se cobra por tokens.' },
    { termino: 'prompt', formas: ['prompts'], definicion: 'Las instrucciones que le escribes a un modelo de IA.' },
    { termino: 'ventana de contexto', definicion: 'Todo lo que un modelo puede tener en cuenta a la vez: tus mensajes, sus respuestas y los documentos que le pases.' },
    { termino: 'alucinación', formas: ['alucinaciones', 'alucina'], definicion: 'Cuando una IA inventa algo que suena seguro pero es falso. Por eso hay que verificar.' },
    { termino: 'agente', formas: ['agentes'], definicion: 'Una IA que no solo responde: decide usar herramientas (leer, editar, correr pruebas), mira el resultado y repite.' },
    { termino: 'MCP', definicion: 'Un estándar para conectar herramientas y datos a un modelo de IA de la misma forma en cualquier aplicación.' },
    { termino: 'pandas', definicion: 'Una librería de Python para trabajar con tablas de datos (DataFrame).', ejemplo: 'import pandas as pd' },
    { termino: 'numpy', definicion: 'Una librería de Python para hacer cuentas rápidas con muchos números a la vez.' },
    { termino: 'DataFrame', formas: ['DataFrames'], definicion: 'Una tabla de pandas: filas y columnas con nombre, como una hoja de Excel dentro de Python.', ejemplo: 'df["precio"].mean()' },
    { termino: 'aprendizaje automático', formas: ['machine learning'], definicion: 'Enseñarle a un programa con ejemplos en vez de escribirle las reglas a mano.' },
    { termino: 'entrenar', formas: ['entrenamiento', 'entrena'], definicion: 'Mostrarle ejemplos a un modelo para que ajuste sus reglas.' },
    { termino: 'sobreajuste', definicion: 'Cuando un modelo se memoriza los ejemplos de entrenamiento y falla con datos nuevos.' },
    { termino: 'regresión lineal', definicion: 'Un modelo que predice un número trazando la recta que mejor pasa por los datos.' },

    // ---------- Seguridad ----------
    { termino: 'contraseña', formas: ['contraseñas'], definicion: 'Una clave secreta para entrar a una cuenta. Nunca se guarda tal cual: se guarda su hash.' },
    { termino: 'cifrado', formas: ['cifrar', 'cifrada'], definicion: 'Convertir datos en algo ilegible que solo puede leer quien tiene la llave.' },
    { termino: 'XSS', definicion: 'Un ataque que mete código JavaScript en una página a través de un texto que escribió alguien. Se evita mostrando los textos sin interpretarlos como HTML.' },
    { termino: 'phishing', definicion: 'Un engaño (correo, mensaje o página falsa) para que entregues tus claves o datos.' },
    { termino: 'malware', definicion: 'Un programa hecho para dañar o espiar tu equipo.' },
  ];

  // Se congelan para que nadie cambie el diccionario por accidente desde otro archivo.
  const terminos = Object.freeze(
    TERMINOS.map((entrada) => Object.freeze({ ...entrada, formas: Object.freeze(entrada.formas || []) }))
  );

  // Cada forma escrita (en minúscula) apunta a su término. Sirve para saber a
  // qué definición corresponde una palabra encontrada en el texto.
  const porForma = new Map(
    terminos.flatMap((entrada) => [entrada.termino, ...entrada.formas].map((forma) => [forma.toLowerCase(), entrada]))
  );

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Una sola expresión con todas las formas que se marcan. Van de la más
  // larga a la más corta: así "base de datos" gana sobre "base", y "clave
  // primaria" sobre "clave".
  // Los bordes evitan marcar pedazos de palabras ("rama" dentro de
  // "programa") y de direcciones o nombres compuestos ("api" en
  // "api.tienda-donpepe.co", "test" en "pytest").
  const formasMarcables = [...porForma.entries()]
    .filter(([, entrada]) => entrada.marcar !== false)
    .map(([forma]) => forma)
    .sort((a, b) => b.length - a.length);
  const patron = new RegExp(
    '(?<![\\p{L}\\p{N}_./\\-])(' +
      formasMarcables.map(escaparRegex).join('|') +
      ')(?![\\p{L}\\p{N}_\\-]|\\.[\\p{L}\\p{N}])',
    'giu'
  );

  function buscar(forma) {
    return porForma.get(String(forma).toLowerCase()) || null;
  }

  // Para el buscador del panel: sin tildes ni mayúsculas, así "funcion"
  // encuentra "función".
  function normalizar(texto) {
    return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  // Devuelve una lista NUEVA con los términos que coinciden, en orden alfabético.
  function filtrar(consulta) {
    const buscado = normalizar(consulta).trim();
    return terminos
      .filter(
        (entrada) =>
          buscado === '' ||
          normalizar([entrada.termino, ...entrada.formas].join(' ')).includes(buscado) ||
          normalizar(entrada.definicion).includes(buscado)
      )
      .sort((a, b) => a.termino.localeCompare(b.termino, 'es', { sensitivity: 'base' }));
  }

  globalThis.Glosario = Object.freeze({ terminos, patron, buscar, filtrar });

  // ---------- Comportamiento de las definiciones en la página ----------
  // Con el mouse y con el teclado basta el CSS (:hover y :focus-visible). En
  // un celular no hay "pasar el mouse", así que al tocar un término se abre
  // su definición y al tocar otra parte (o pulsar Escape) se cierra.
  // Se escucha en el documento entero (delegación de eventos): así sirve
  // para los párrafos que app.js pinte después, sin tocar app.js.

  if (typeof document === 'undefined') return;

  function cerrarDefiniciones(excepto) {
    document.querySelectorAll('.glosario__termino[aria-expanded="true"]').forEach((boton) => {
      if (boton !== excepto) boton.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest && evento.target.closest('.glosario__termino');
    cerrarDefiniciones(boton);
    if (boton) {
      delete boton.dataset.oculto;
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', abierto ? 'false' : 'true');
    }
  });

  // Escape esconde cualquier definición visible, también la que se ve por
  // tener el mouse encima o el foco (data-oculto la esconde en el CSS). Así
  // quien usa lupa o teclado puede quitarla sin mover el puntero.
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape') return;
    cerrarDefiniciones(null);
    document.querySelectorAll('.glosario__termino').forEach((boton) => {
      if (boton.matches(':focus') || boton.parentElement.matches(':hover')) boton.dataset.oculto = '';
    });
  });

  // Al salir del término con el mouse o con el foco, vuelve a funcionar normal.
  ['mouseout', 'focusout'].forEach((tipo) =>
    document.addEventListener(tipo, (evento) => {
      const marca = evento.target.closest && evento.target.closest('.glosario');
      if (marca) delete marca.querySelector('.glosario__termino').dataset.oculto;
    })
  );

  // ---------- Panel con el glosario completo ----------
  // Un botón fijo abre un <dialog> con buscador. <dialog> con showModal ya
  // trae lo difícil de la accesibilidad: atrapa el foco, se cierra con
  // Escape y devuelve el foco al botón. Todo el texto se pinta con
  // textContent.

  function crearNodo(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  function pintarTermino(entrada) {
    const item = crearNodo('div', 'glosario-panel__item');
    item.append(crearNodo('dt', 'glosario-panel__termino', entrada.termino));
    const descripcion = crearNodo('dd', 'glosario-panel__definicion', entrada.definicion);
    if (entrada.ejemplo) {
      descripcion.append(crearNodo('code', 'glosario-panel__ejemplo', entrada.ejemplo));
    }
    item.append(descripcion);
    return item;
  }

  function armarPanel() {
    const panel = crearNodo('dialog', 'glosario-panel');
    panel.setAttribute('aria-labelledby', 'glosario-panel-titulo');

    const cabecera = crearNodo('div', 'glosario-panel__cabecera');
    const titulo = crearNodo('h2', 'glosario-panel__titulo', 'Glosario');
    titulo.id = 'glosario-panel-titulo';
    const cerrar = crearNodo('button', 'glosario-panel__cerrar', 'Cerrar');
    cerrar.type = 'button';
    cerrar.addEventListener('click', () => panel.close());
    cabecera.append(titulo, cerrar);

    const etiqueta = crearNodo('label', 'glosario-panel__etiqueta', 'Buscar una palabra');
    const buscador = crearNodo('input', 'glosario-panel__buscador');
    buscador.type = 'search';
    buscador.id = 'glosario-panel-buscador';
    buscador.autocomplete = 'off';
    buscador.placeholder = 'Por ejemplo: función, API, commit…';
    etiqueta.htmlFor = buscador.id;

    const cuenta = crearNodo('p', 'glosario-panel__cuenta');
    cuenta.setAttribute('role', 'status');
    const lista = crearNodo('dl', 'glosario-panel__lista');

    function mostrar() {
      const encontrados = filtrar(buscador.value);
      lista.replaceChildren(...encontrados.map(pintarTermino));
      cuenta.textContent =
        encontrados.length === 0
          ? 'No hay palabras con esa búsqueda.'
          : encontrados.length + (encontrados.length === 1 ? ' palabra' : ' palabras');
    }
    buscador.addEventListener('input', mostrar);
    mostrar();

    // Un clic en el fondo oscuro (fuera de la caja) también cierra.
    panel.addEventListener('click', (evento) => {
      if (evento.target === panel) panel.close();
    });

    panel.append(cabecera, etiqueta, buscador, cuenta, lista);
    document.body.append(panel);
    return { panel, buscador };
  }

  function instalarBoton() {
    let armado = null;
    const abrir = crearNodo('button', 'glosario-abrir', 'Glosario');
    abrir.type = 'button';
    abrir.setAttribute('aria-haspopup', 'dialog');
    abrir.addEventListener('click', () => {
      // El panel se arma la primera vez que se abre: no cuesta nada si no se usa.
      armado = armado || armarPanel();
      armado.panel.showModal();
      armado.buscador.focus();
    });
    document.body.append(abrir);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instalarBoton);
  } else {
    instalarBoton();
  }
})();

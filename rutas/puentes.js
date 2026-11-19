// Puentes entre lecciones (fase 9).
//
// El estudiante sentía que cada lección era "otro tema diferente". Este
// archivo no cambia ninguna lección: solo guarda, para cada una, tres frases
// que la amarran con las demás:
//   - viene: en qué se apoya de lo que ya viste;
//   - sirve: para qué sirve en la vida real, con un ejemplo concreto;
//   - sigue: qué viene después y por qué.
// Cada ruta tiene además una "intro": qué vas a lograr y para qué te sirve.
//
// Se guarda aparte (y no dentro de cada lección) para poder revisar toda la
// historia de una ruta de corrido, en un solo lugar. Las claves son el id de
// la ruta y el id de la lección; pruebas/puentes.test.js revisa que ninguna
// lección se quede sin puente y que no sobre ninguno.
//
// Es texto fijo, sin formato: la página lo pinta con textContent.

globalThis.Puentes = {
  python: {
    intro:
      'En esta ruta aprendes a darle órdenes al computador con Python, desde mostrar un mensaje hasta manejar el inventario de una tienda. Python es la base de las rutas de datos, SQL e inteligencia artificial, y con él se automatizan tareas repetitivas en casi cualquier trabajo de oficina.',
    lecciones: {
      'hola-python': {
        viene: 'Es el punto de partida: no necesitas saber nada antes.',
        sirve: 'Mostrar un mensaje es lo primero que hace cualquier programa, desde el aviso de "pedido recibido" de una app de domicilios hasta el recibo de la caja de Don Pepe.',
        sigue: 'Ahora que el programa habla, toca que recuerde cosas: para eso están las variables.',
      },
      variables: {
        viene: 'Ya sabes mostrar mensajes con print; ahora vas a guardar datos para no repetirlos.',
        sirve: 'Don Pepe guarda el precio del tinto en una variable: si sube, lo cambia en un solo lugar y todo el programa usa el precio nuevo.',
        sigue: 'Con datos guardados ya puedes hacer cuentas con ellos, que es lo siguiente.',
      },
      numeros: {
        viene: 'Usas las variables de la lección anterior para guardar precios y cantidades.',
        sirve: 'Sumar la cuenta de un cliente, calcular las vueltas o el IVA: cualquier caja registradora hace estas mismas operaciones.',
        sigue: 'Los programas no solo manejan números, también nombres y mensajes: siguen los textos.',
      },
      textos: {
        viene: 'Ya guardas y calculas números; ahora haces lo mismo con palabras.',
        sirve: 'Armar el mensaje "Hola, Ana: tu pedido cuesta $12.000" juntando un nombre y un precio es algo que hacen las apps todo el tiempo.',
        sigue: 'Para que el programa decida algo, primero tiene que comparar valores: eso viene ahora.',
      },
      comparaciones: {
        viene: 'Comparas los números y textos que ya sabes guardar.',
        sirve: 'Saber si alguien es mayor de edad, si alcanza la plata o si un producto está agotado empieza siempre con una comparación.',
        sigue: 'Una comparación da verdadero o falso; en la siguiente lección usas ese resultado para tomar decisiones.',
      },
      decisiones: {
        viene: 'Usas las comparaciones de la lección anterior como condición del if.',
        sirve: 'Aplicar un descuento solo si la compra pasa de $50.000, o avisar cuando un producto se agota: así decide un programa real.',
        sigue: 'Tu código va creciendo; las funciones te ayudan a ordenarlo y reutilizarlo.',
      },
      funciones: {
        viene: 'Juntas en un bloque con nombre todo lo que ya sabes: variables, cuentas y decisiones.',
        sirve: 'Una función calcular_total() se escribe una vez y la usan la caja, el recibo y el reporte del día de la tienda.',
        sigue: 'Hasta ahora manejas un dato a la vez; con las listas manejas muchos juntos.',
      },
      listas: {
        viene: 'Antes cada variable guardaba un solo valor; ahora una sola guarda varios.',
        sirve: 'La lista de productos de la tienda o los pedidos del día se guardan en listas.',
        sigue: 'Para hacer algo con cada elemento de una lista sin copiar código, vienen los bucles.',
      },
      bucles: {
        viene: 'Recorres las listas de la lección anterior, un elemento a la vez.',
        sirve: 'Sumar todos los precios del carrito o mandarle un mensaje a cada cliente de la lista se hace con un bucle.',
        sigue: 'Un producto tiene nombre, precio y stock; para guardarlo todo junto están los diccionarios.',
      },
      diccionarios: {
        viene: 'Como las variables, pero con varios datos bajo etiquetas dentro de una sola caja.',
        sirve: 'Los datos de un cliente (nombre, celular, dirección) se guardan como un diccionario; así llegan también desde casi cualquier servicio de internet.',
        sigue: 'Juntando listas y diccionarios armas tablas de datos reales, que es lo siguiente.',
      },
      datos: {
        viene: 'Combinas listas, diccionarios, bucles y decisiones en un solo ejercicio.',
        sirve: 'Una lista de ventas donde cada venta es un diccionario es justo lo que analizas para saber qué se vende más en un negocio.',
        sigue: 'No tienes que programarlo todo tú: los módulos traen herramientas listas y JSON te deja leer datos de otros programas.',
      },
      'modulos-json': {
        viene: 'Los diccionarios y listas que ya manejas son casi idénticos a JSON.',
        sirve: 'Cuando una app consulta el clima o el precio del dólar, la respuesta llega en JSON y la lees con este módulo.',
        sigue: 'Los datos de afuera a veces llegan dañados; en la siguiente lección aprendes a que el programa no se caiga.',
      },
      errores: {
        viene: 'Ya lees datos de afuera; ahora te preparas para cuando vienen mal.',
        sirve: 'Si un cliente escribe "tres" en vez de 3 en un formulario, la tienda debe avisarle con calma en vez de romperse.',
        sigue: 'Con las clases organizas datos y acciones en un mismo molde, como hacen los proyectos grandes.',
      },
      clases: {
        viene: 'Une lo que ya sabes: un diccionario (los datos) y funciones (las acciones).',
        sirve: 'Un molde Producto con su precio y un método para calcular el IVA es como se organiza el código de un sistema de ventas real.',
        sigue: 'Ahora aprendes a escribir en una sola línea lo que hoy te toma un bucle entero.',
      },
      comprensiones: {
        viene: 'Es una forma corta de los bucles que llenan listas.',
        sirve: 'Sacar en una línea los productos de más de $10.000 o aplicar un descuento a todos los precios es muy común al analizar datos.',
        sigue: 'Las funciones también se pueden volver más flexibles; eso viene ahora.',
      },
      'funciones-avanzadas': {
        viene: 'Amplía las funciones de la lección 7 con valores por defecto y funciones como dato.',
        sirve: 'Ordenar productos por precio o tener un descuento que casi siempre es 0 pero a veces cambia son trucos de todos los días.',
        sigue: 'Cierras la ruta con un repaso que mezcla todo lo aprendido.',
      },
      repaso: {
        viene: 'Mezcla todo lo de la ruta: listas, diccionarios, bucles, decisiones y funciones.',
        sirve: 'Revisar el inventario y el fiado de Don Pepe es el tipo de tarea pequeña que un negocio sí le pagaría a alguien.',
        sigue: 'Con Python listo, puedes seguir con JavaScript para las páginas web o con SQL para guardar datos en serio.',
      },
    },
  },

  javascript: {
    intro:
      'En esta ruta aprendes JavaScript, el lenguaje que hace funcionar las páginas web y muchas apps. Al terminar sabrás manejar datos, pedirle información a un servicio de internet y entender el código que mueve casi cualquier sitio que usas.',
    lecciones: {
      'hola-mundo': {
        viene: 'Si ya hiciste la ruta de Python, verás que las ideas son las mismas con otra forma de escribir; si no, empiezas desde cero.',
        sirve: 'Todo botón, menú o aviso que se mueve en una página web lo controla JavaScript.',
        sigue: 'El programa ya habla; ahora le enseñas a recordar datos con variables.',
      },
      variables: {
        viene: 'Ya muestras mensajes con console.log; ahora guardas datos para usarlos después.',
        sirve: 'El precio del tinto o el nombre del cliente se guardan en variables para mostrarlos en la página sin repetirlos.',
        sigue: 'Con datos guardados ya puedes hacer cuentas, que es lo siguiente.',
      },
      numeros: {
        viene: 'Haces cuentas con las variables de la lección anterior.',
        sirve: 'El total del carrito, las vueltas o el IVA que ves en una tienda en línea se calculan así.',
        sigue: 'Además de números, una página muestra textos: siguen los strings.',
      },
      textos: {
        viene: 'Ya manejas números; ahora unes y transformas palabras.',
        sirve: 'El mensaje "Hola, Ana, tu pedido va en camino" se arma juntando textos y datos.',
        sigue: 'Para decidir algo, primero hay que comparar: eso viene ahora.',
      },
      comparaciones: {
        viene: 'Comparas los números y textos que ya sabes manejar.',
        sirve: 'Revisar si la contraseña es lo bastante larga o si el cliente tiene saldo empieza con una comparación.',
        sigue: 'Con ese verdadero o falso, en la siguiente lección tomas decisiones con if.',
      },
      decisiones: {
        viene: 'Usas las comparaciones como condición del if.',
        sirve: 'Mostrar "Agotado" en vez del botón de comprar, o un saludo distinto según la hora, se hace con decisiones.',
        sigue: 'Las funciones te dejan reutilizar ese código sin copiarlo.',
      },
      funciones: {
        viene: 'Guardas con un nombre lo que ya sabes hacer: cuentas, textos y decisiones.',
        sirve: 'En una página, cada botón llama a una función: "agregar al carrito", "pagar", "buscar".',
        sigue: 'Para manejar muchos datos a la vez, siguen los arreglos.',
      },
      arreglos: {
        viene: 'Antes cada variable guardaba un valor; un arreglo guarda varios.',
        sirve: 'Los productos de una tienda en línea o los mensajes de un chat viven en arreglos.',
        sigue: 'Para recorrer un arreglo sin copiar código vienen los bucles.',
      },
      bucles: {
        viene: 'Recorres los arreglos de la lección anterior.',
        sirve: 'Sumar todo el carrito o pintar una tarjeta por cada producto de la página se hace con un bucle.',
        sigue: 'Un producto tiene varios datos; para agruparlos están los objetos.',
      },
      objetos: {
        viene: 'Juntan varios datos con nombre, como las variables, en una sola cosa.',
        sirve: 'Un pedido con cliente, dirección y total es un objeto; así viajan los datos entre una página y su servidor.',
        sigue: 'Los arreglos traen herramientas que reemplazan muchos bucles: vienen ahora.',
      },
      'metodos-arreglos': {
        viene: 'Hacen en una línea lo que antes hacías con un bucle sobre arreglos de objetos.',
        sirve: 'El filtro "solo productos de menos de $5.000" de una tienda en línea es un filter.',
        sigue: 'Los programas se pasan datos en un formato de texto llamado JSON; eso sigue.',
      },
      'datos-json': {
        viene: 'JSON se parece mucho a los objetos y arreglos que ya conoces.',
        sirve: 'Cuando una app pide los pedidos del día a su servidor, la respuesta llega en JSON.',
        sigue: 'Ahora aprendes atajos para sacar y copiar datos de objetos sin escribir tanto.',
      },
      desestructuracion: {
        viene: 'Son atajos para trabajar con los objetos y arreglos que ya manejas.',
        sirve: 'Actualizar el precio de un producto sin dañar el original es muy común en las páginas modernas.',
        sigue: 'Con las clases creas muchos objetos con la misma forma.',
      },
      clases: {
        viene: 'Una clase es un molde para los objetos que ya conoces, con sus propias funciones.',
        sirve: 'Un Carrito que sabe agregar productos y calcular su total es como se organiza el código de una tienda en línea.',
        sigue: 'Los datos de afuera a veces llegan dañados; toca aprender a manejar errores.',
      },
      errores: {
        viene: 'Ya lees JSON; ahora te preparas para cuando llega mal.',
        sirve: 'Si un pedido llega incompleto, la página debe mostrar un aviso claro y no quedarse en blanco.',
        sigue: 'Ahora juntas y ordenas datos con reduce y sort.',
      },
      'reduce-ordenar': {
        viene: 'Completa los métodos de arreglos de la lección 11.',
        sirve: 'Sumar las ventas del día u ordenar productos del más vendido al menos vendido sirve para cualquier reporte de un negocio.',
        sigue: 'Antes de lo asíncrono, un repaso que mezcla todo.',
      },
      repaso: {
        viene: 'Mezcla todo lo de la ruta: arreglos, objetos, funciones y métodos.',
        sirve: 'Decidir qué pedirle al proveedor o cuadrar la caja son tareas reales de la tienda de Don Pepe.',
        sigue: 'Hasta ahora todo pasa al instante; ahora aprendes a esperar respuestas que tardan.',
      },
      'async-await': {
        viene: 'Usas funciones como siempre, pero ahora algunas tardan en responder.',
        sirve: 'Pedir datos a internet, guardar un archivo o cobrar con una pasarela de pagos tardan, y la página no puede congelarse mientras tanto.',
        sigue: 'Con async/await listo, ya puedes hablar con un servicio real usando fetch.',
      },
      fetch: {
        viene: 'Usa async/await y JSON de las lecciones anteriores.',
        sirve: 'Así una página de domicilios trae el menú del servidor y le manda el pedido nuevo.',
        sigue: 'Cierras con retos que juntan fetch, async y todo lo anterior.',
      },
      'repaso-async': {
        viene: 'Junta fetch, async, objetos y métodos de arreglos.',
        sirve: 'Calcular cuánta plata hay en inventario a partir de una API es un informe que un negocio sí necesita.',
        sigue: 'Con JavaScript listo, la ruta de Páginas web te enseña a armar la página donde vive este código.',
      },
    },
  },

  sql: {
    intro:
      'En esta ruta aprendes a guardar información en tablas y a hacerle preguntas con SQL. Es una de las habilidades más pedidas en los trabajos: casi toda empresa guarda sus clientes, ventas e inventario en una base de datos.',
    lecciones: {
      'hola-sql': {
        viene: 'En Python guardabas datos en listas de diccionarios; una tabla es la misma idea, pero guardada para siempre y lista para millones de filas.',
        sirve: 'Los clientes, productos y pedidos de la tienda de Don Pepe viven en una base de datos, igual que en un banco o en una app de domicilios.',
        sigue: 'Ya sabes pedir columnas; ahora vas a pedir solo las filas que te interesan.',
      },
      filtrar: {
        viene: 'Le agregas WHERE al SELECT de la lección anterior.',
        sirve: 'Ver solo los clientes de Bogotá o los productos que se están acabando es una consulta de todos los días.',
        sigue: 'A veces una condición no basta; vienen AND, OR y LIKE.',
      },
      condiciones: {
        viene: 'Amplía el WHERE con varias condiciones a la vez.',
        sirve: 'Buscar "bebidas de menos de $3.000" o "productos que empiezan por Pan" es lo que hace el buscador de una tienda.',
        sigue: 'Ahora le das orden a los resultados.',
      },
      ordenar: {
        viene: 'Usas las mismas consultas, ahora ordenadas y recortadas.',
        sirve: 'El top 3 de productos con más existencias o la lista de clientes en orden alfabético salen de aquí.',
        sigue: 'Además de leer columnas, puedes hacer cuentas con ellas.',
      },
      calcular: {
        viene: 'Haces en el SELECT las mismas cuentas que hacías en Python.',
        sirve: 'Precio por cantidad da cuánta plata hay en el inventario, sin sacar los datos de la base.',
        sigue: 'Ahora resumes muchas filas en un solo número.',
      },
      resumir: {
        viene: 'En vez de calcular fila por fila, juntas todas las filas en un resultado.',
        sirve: '¿Cuántos clientes hay? ¿Cuál es el precio promedio? Son las preguntas que hace un dueño de negocio.',
        sigue: 'El siguiente paso es sacar ese resumen por grupos.',
      },
      agrupar: {
        viene: 'Aplica los resúmenes de la lección anterior a cada grupo por separado.',
        sirve: 'Clientes por ciudad o ventas por producto son los reportes que piden en cualquier empresa.',
        sigue: 'Los datos están repartidos en varias tablas; con JOIN los juntas.',
      },
      unir: {
        viene: 'Hasta ahora consultabas una tabla a la vez; ahora conectas dos.',
        sirve: 'Un pedido guarda solo el número del cliente; con JOIN ves su nombre, como lo hace cualquier sistema de facturación.',
        sigue: 'Ahora unes tres tablas y además resumes.',
      },
      'unir-mas': {
        viene: 'Encadena varios JOIN y les suma GROUP BY.',
        sirve: 'Saber quiénes son los mejores clientes de la tienda sale de juntar clientes, pedidos y productos.',
        sigue: 'Ya sabes leer datos; ahora aprendes a agregarlos.',
      },
      insertar: {
        viene: 'Hasta ahora solo leíste; ahora escribes en las mismas tablas.',
        sirve: 'Cada vez que alguien se registra en una app, por detrás se hace un INSERT.',
        sigue: 'Los datos también cambian o se borran: siguen UPDATE y DELETE.',
      },
      'actualizar-borrar': {
        viene: 'Usa el mismo WHERE que aprendiste al filtrar, ahora para cambiar datos.',
        sirve: 'Subir el precio de la panela o descontar lo vendido del inventario es un UPDATE.',
        sigue: 'Ya manejas tablas hechas; ahora diseñas las tuyas.',
      },
      'crear-tablas': {
        viene: 'Conoces bien las tablas por dentro; ahora creas una desde cero.',
        sirve: 'Si un cliente quiere guardar las opiniones de sus compradores, primero toca diseñar la tabla donde van.',
        sigue: 'Volvemos al JOIN para ver qué pasa con las filas que no tienen pareja.',
      },
      'left-join': {
        viene: 'Amplía el JOIN de la lección 8.',
        sirve: 'Encontrar los clientes que nunca han comprado sirve para mandarles una promoción.',
        sigue: 'A veces una pregunta necesita otra pregunta adentro: vienen las subconsultas.',
      },
      subconsultas: {
        viene: 'Usas una consulta completa, de las que ya sabes escribir, dentro de otra.',
        sirve: '"Los productos más caros que el promedio" necesita calcular primero el promedio.',
        sigue: 'Ahora clasificas filas con CASE y transformas datos con funciones.',
      },
      'case-funciones': {
        viene: 'CASE es el if de Python, pero dentro de una consulta.',
        sirve: 'Etiquetar productos como baratos, medios o caros, o ver qué día de la semana se vende más, ayuda a decidir promociones.',
        sigue: 'Para cerrar, guardas consultas con nombre y conectas tablas de forma segura.',
      },
      'vistas-claves': {
        viene: 'Guarda con nombre las consultas que ya escribes y protege los JOIN.',
        sirve: 'Una vista evita repetir la misma consulta larga en cada reporte, y la clave foránea impide pedidos de clientes que no existen.',
        sigue: 'Terminas con un repaso que mezcla todo.',
      },
      repaso: {
        viene: 'Mezcla JOIN, GROUP BY, HAVING y todo lo de la ruta.',
        sirve: 'Qué categorías venden más y qué clientes son fieles son preguntas que un negocio de verdad te pagaría por responder.',
        sigue: 'Ahora ves PostgreSQL, la base de datos que más se usa en las empresas.',
      },
      postgresql: {
        viene: 'Todo el SQL que escribiste en SQLite sirve casi igual en PostgreSQL; solo cambian unos detalles.',
        sirve: 'Muchas empresas guardan sus datos en PostgreSQL, y es la base que pide el certificado Relational Database de freeCodeCamp.',
        sigue: 'Para cerrar, aprendes a manejar la base desde la terminal con Bash.',
      },
      bash: {
        viene: 'Usa los comandos de PostgreSQL de la lección anterior; de la terminal no necesitas saber nada antes, se explica desde cero.',
        sirve: 'Sacar copias de la base, correr scripts y abrir psql en un servidor se hace desde la terminal, todos los días.',
        sigue: 'Con datos y Python listos, la ruta de inteligencia artificial te enseña a usar modelos desde tu código.',
      },
    },
  },

  ia: {
    intro:
      'En esta ruta entiendes cómo funciona un modelo de inteligencia artificial y aprendes a usarlo desde Python: pedirle bien las cosas, recibir datos ordenados y no creerle todo. Es lo que se usa hoy para crear asistentes, clasificar mensajes de clientes y automatizar trabajo con texto.',
    lecciones: {
      'como-piensa': {
        viene: 'Usas lo que viste en Python (funciones, listas y diccionarios) para entender qué hace un modelo por dentro.',
        sirve: 'Saber que el modelo adivina la palabra más probable te explica por qué a veces inventa cosas y cómo pedirle mejor.',
        sigue: 'Ese texto se mide en tokens, y los tokens cuestan plata: eso sigue.',
      },
      'tokens-y-costo': {
        viene: 'Los tokens son los pedazos de texto con los que el modelo de la lección anterior lee y escribe.',
        sirve: 'Antes de montar un asistente para un negocio, toca calcular cuánto costará al mes.',
        sigue: 'Ahora le mandas tu primer mensaje a un modelo desde código.',
      },
      'primer-mensaje': {
        viene: 'Una conversación es una lista de diccionarios, como las que ya armaste en Python.',
        sirve: 'Así funciona por dentro el chat de atención al cliente de una empresa.',
        sigue: 'Ya le hablas al modelo; ahora aprendes a pedirle las cosas con claridad.',
      },
      'instrucciones-claras': {
        viene: 'Mejoras el contenido de los mensajes que ya sabes enviar.',
        sirve: 'Un buen prompt hace que el modelo clasifique reseñas siempre con la misma palabra, lista para contarla.',
        sigue: 'A veces mostrar es mejor que explicar: vienen los ejemplos.',
      },
      ejemplos: {
        viene: 'Agrega ejemplos a las instrucciones claras de la lección anterior.',
        sirve: 'Para clasificar tiquetes de soporte como "pago", "envío" o "otro", unos pocos ejemplos bastan.',
        sigue: 'Para que tu programa use la respuesta, el modelo debe contestar en JSON.',
      },
      'respuestas-json': {
        viene: 'Usa el JSON que aprendiste en Python, ahora en la respuesta del modelo.',
        sirve: 'Leer un WhatsApp desordenado de un cliente y sacar producto, cantidad y dirección para guardarlos es un uso muy real.',
        sigue: 'El modelo puede equivocarse con total seguridad; aprendes a no creerle todo.',
      },
      'no-creas-todo': {
        viene: 'Vuelve a la primera lección: el modelo continúa textos, no consulta hechos.',
        sirve: 'Un asistente de la tienda debe responder con los precios reales, no con unos que se inventó.',
        sigue: 'El modelo tampoco recuerda nada entre llamadas: lo manejas tú.',
      },
      memoria: {
        viene: 'Usa la lista de mensajes de la lección 3, ahora guardada entre turnos.',
        sirve: 'Para que un chat de soporte recuerde lo que el cliente dijo hace dos mensajes, tu programa debe guardar el historial.',
        sigue: 'Ahora le das manos al modelo con herramientas.',
      },
      herramientas: {
        viene: 'El modelo pide, tu código de Python ejecuta y le devuelve el resultado.',
        sirve: 'Así un asistente puede consultar el inventario real de la tienda o el estado de un pedido.',
        sigue: 'Ahora aprendes a medir si tu asistente funciona bien.',
      },
      medir: {
        viene: 'Es como las pruebas de los ejercicios, pero aplicadas a las respuestas del modelo.',
        sirve: 'Antes de entregarle un asistente a un cliente, demuestras con números que acierta y que aguanta cuando el servicio falla.',
        sigue: 'Ahora pasas de los nombres en español a la API de Mensajes real, la que usan las empresas.',
      },
      'api-mensajes': {
        viene: 'Es lo mismo que hacías con ia.preguntar(): rol, mensajes y respuesta, pero con los nombres en inglés de la API de Anthropic.',
        sirve: 'Es la forma en que una empresa conecta a Claude con su página o su app, y lo que enseña el curso de Anthropic Academy.',
        sigue: 'Luego le das herramientas al modelo, ahora con los nombres reales de la API.',
      },
      'tool-use-api': {
        viene: 'Repite la idea de la lección de Herramientas: el modelo pide y tu programa ejecuta, ahora con tools y tool_use.',
        sirve: 'Así un asistente de verdad consulta el inventario o el estado de un pedido sin inventarse los datos.',
        sigue: 'Para cerrar, conoces MCP: la forma de compartir esas herramientas con cualquier asistente.',
      },
      mcp: {
        viene: 'Saca las herramientas de la lección anterior de tu programa y las pone en un servidor aparte.',
        sirve: 'Con un servidor MCP, Claude Code, Claude Desktop y otros asistentes usan las mismas herramientas: la base de datos de la tienda, los archivos o los tiquetes.',
        sigue: 'La siguiente ruta, Programar con IA, muestra cómo un agente usa todo esto para escribir código.',
      },
    },
  },

  'con-ia': {
    intro:
      'En esta ruta entiendes cómo trabaja un agente de programación como Claude y aprendes a usarlo bien: pedirle código con claridad, revisar lo que entrega y protegerte con pruebas. Hoy casi todos los equipos programan con ayuda de la IA, y saber dirigirla es parte del trabajo.',
    lecciones: {
      'que-es-un-agente': {
        viene: 'En la ruta de IA viste que un modelo solo produce texto; aquí ves cómo se vuelve un agente que actúa.',
        sirve: 'Saber que el agente piensa, usa una herramienta y observa te ayuda a entender por qué a veces falla y cómo corregirlo.',
        sigue: 'Ahora miras de cerca las herramientas con las que el agente toca un proyecto.',
      },
      herramientas: {
        viene: 'Son las herramientas del ciclo de la lección anterior.',
        sirve: 'Leer y escribir archivos es lo que hace un asistente de código cuando le pides arreglar algo en tu proyecto.',
        sigue: 'Con las herramientas listas, armas tú mismo el ciclo completo.',
      },
      'el-ciclo': {
        viene: 'Junta las herramientas de la lección anterior en un ciclo que tú controlas.',
        sirve: 'Entender el ciclo por dentro te permite usar cualquier agente sin verlo como magia.',
        sigue: 'Ya sabes cómo trabaja; ahora aprendes a pedirle bien las cosas.',
      },
      'pedir-codigo-bien': {
        viene: 'Aplica las instrucciones claras de la ruta de IA a pedir código.',
        sirve: 'Una petición con el archivo, el error y lo que no puede cambiar te ahorra horas de idas y vueltas.',
        sigue: 'Aunque pidas bien, toca revisar lo que te entrega.',
      },
      'revisar-lo-que-entrega-la-ia': {
        viene: 'Revisas el código que salió de la petición de la lección anterior.',
        sirve: 'Si la IA cobra mal un domicilio en la tienda, quien responde ante el cliente eres tú, no la IA.',
        sigue: 'Las pruebas automáticas guardan esa revisión para siempre.',
      },
      'las-pruebas-son-tu-red': {
        viene: 'Convierte en código la revisión a mano que hiciste antes.',
        sirve: 'Con pruebas, cualquier cambio de la IA que rompa la caja de la tienda se nota en segundos.',
        sigue: 'Para que la IA acierte, tiene que ver la información correcta: el contexto.',
      },
      'el-contexto': {
        viene: 'Retoma la memoria y los tokens de la ruta de IA, aplicados a un proyecto.',
        sirve: 'Darle al agente solo los archivos que importan da mejores respuestas y cuesta menos.',
        sigue: 'Aun con buen contexto se equivoca; vienen los límites y la revisión humana.',
      },
      'cuando-se-equivoca': {
        viene: 'Junta la revisión, las pruebas y el contexto para decidir si aceptas un cambio.',
        sirve: 'Leer un diff antes de aceptar evita que la IA borre algo importante o "arregle" una prueba en vez del error.',
        sigue: 'Ahora ves un caso real: cómo se construyó esta misma app.',
      },
      'caso-real-esta-app': {
        viene: 'Todo lo de la ruta, aplicado a la página que estás usando.',
        sirve: 'Repartir tareas entre agentes y revisar cada entrega es como trabajan hoy muchos equipos.',
        sigue: 'Cierras con las reglas para usar la IA de forma responsable.',
      },
      'repaso-uso-responsable': {
        viene: 'Repasa toda la ruta y le suma el cuidado de los datos.',
        sirve: 'Tapar contraseñas y datos de clientes antes de pegarlos en una IA te evita un problema serio en el trabajo.',
        sigue: 'Con esto puedes seguir con Fundamentos de computación o con los proyectos.',
      },
    },
  },

  fundamentos: {
    intro:
      'En esta ruta ves las bases de Ingeniería de Sistemas: cómo guarda datos un computador, cómo se mide qué tan rápido es un algoritmo y qué estructuras de datos existen. Son temas que salen en entrevistas técnicas y que te ayudan a escoger la solución correcta cuando los datos crecen.',
    lecciones: {
      binario: {
        viene: 'Usas Python, que ya conoces, para ver lo que pasa por debajo de tus variables.',
        sirve: 'Entender bits y bytes te explica por qué una foto pesa más que un texto o cuánto cabe en una memoria.',
        sigue: 'Con unos y ceros se hace lógica: vienen los booleanos.',
      },
      'logica-booleana': {
        viene: 'Profundiza en el True y False de las comparaciones de Python.',
        sirve: 'Una regla como "se hace el domicilio si hay repartidor y la dirección está cerca" es lógica booleana.',
        sigue: 'Con decisiones claras ya puedes escribir algoritmos: el primero es buscar.',
      },
      busqueda: {
        viene: 'Usas bucles y decisiones para resolver un problema paso a paso.',
        sirve: 'Buscar un producto entre miles de la tienda puede tardar mucho o casi nada según el algoritmo.',
        sigue: 'Para comparar algoritmos, aprendes a medir cuánto tardan.',
      },
      'cuanto-tarda': {
        viene: 'Mide las búsquedas de la lección anterior contando operaciones.',
        sirve: 'Un programa que funciona con 10 clientes puede volverse lentísimo con 100.000; esto te ayuda a preverlo.',
        sigue: 'Ahora ves una forma distinta de repetir: la recursión.',
      },
      recursion: {
        viene: 'Es otra manera de repetir, distinta a los bucles que ya usas.',
        sirve: 'Recorrer carpetas dentro de carpetas o categorías dentro de categorías se hace fácil con recursión.',
        sigue: 'Siguen las primeras estructuras de datos: pilas y colas.',
      },
      'pilas-y-colas': {
        viene: 'Son listas de Python con reglas de quién entra y quién sale.',
        sirve: 'El botón de deshacer usa una pila y la fila de pedidos de un restaurante usa una cola.',
        sigue: 'Ahora ves cómo funciona por dentro el diccionario que tanto usas.',
      },
      'tablas-hash': {
        viene: 'Explica por qué los diccionarios de Python encuentran datos tan rápido.',
        sirve: 'Buscar un cliente por su cédula al instante, aunque haya millones, depende de una tabla hash.',
        sigue: 'Otro problema clásico: ordenar datos.',
      },
      ordenamiento: {
        viene: 'Usa bucles y el conteo de operaciones de la lección 4.',
        sirve: 'Ordenar precios o clientes es de lo más común, y elegir bien el método ahorra tiempo cuando hay muchos datos.',
        sigue: 'Terminas las estructuras con árboles y grafos.',
      },
      'arboles-y-grafos': {
        viene: 'Usa la recursión para recorrer datos con forma de ramas.',
        sirve: 'Las categorías de una tienda son un árbol, y el mapa de calles para un domicilio es un grafo.',
        sigue: 'Cierras con un repaso que te ayuda a elegir la estructura correcta.',
      },
      repaso: {
        viene: 'Junta todas las estructuras y algoritmos de la ruta.',
        sirve: 'Saber cuándo usar una cola, un diccionario o una búsqueda binaria es justo lo que preguntan en una entrevista técnica.',
        sigue: 'Con las bases claras, la ruta de Páginas web te enseña a construir lo que ve la gente.',
      },
    },
  },

  web: {
    intro:
      'En esta ruta construyes páginas web con HTML (la estructura), CSS (el diseño) y un poco de JavaScript (lo que responde a los clics). Al terminar puedes armar la página de un negocio pequeño o tu propio portafolio.',
    lecciones: {
      'hola-html': {
        viene: 'Hasta ahora escribías órdenes en Python o JavaScript; HTML no da órdenes, marca qué es cada parte de una página.',
        sirve: 'Toda página que abres en el celular, desde la del banco hasta la de una panadería, está hecha con HTML.',
        sigue: 'Ahora agregas listas y enlaces para conectar páginas.',
      },
      'listas-enlaces': {
        viene: 'Usa las etiquetas de la lección anterior para armar listas y enlaces.',
        sirve: 'El menú de un restaurante y el enlace "Escríbenos por WhatsApp" son listas y enlaces.',
        sigue: 'Una página sin imágenes se ve pobre: siguen las imágenes.',
      },
      'imagenes-atributos': {
        viene: 'Las etiquetas que ya usas pueden llevar atributos con información extra.',
        sirve: 'Las fotos de los productos, con su texto alternativo, ayudan a vender y a que personas ciegas también entiendan la página.',
        sigue: 'Con varias piezas sueltas, toca organizar la página por zonas.',
      },
      estructura: {
        viene: 'Organiza en zonas las etiquetas que ya conoces.',
        sirve: 'Casi toda página tiene encabezado, menú, contenido y pie, y Google y los lectores de pantalla las entienden mejor así.',
        sigue: 'Para datos con filas y columnas, siguen las tablas.',
      },
      tablas: {
        viene: 'Como las tablas de SQL, pero dibujadas en la página.',
        sirve: 'Una lista de precios o un horario de atención se muestran con una tabla.',
        sigue: 'Hasta ahora la página solo muestra; con formularios el usuario escribe.',
      },
      formularios: {
        viene: 'Agrega a la página campos donde el usuario escribe.',
        sirve: 'Pedir un domicilio, registrarse o mandar un mensaje de contacto se hace con un formulario.',
        sigue: 'Tu página ya tiene estructura; ahora le das color con CSS.',
      },
      'css-colores': {
        viene: 'HTML dice qué es cada cosa; CSS dice cómo se ve.',
        sirve: 'Los colores de la marca de un negocio y el botón de oferta que llama la atención se ponen con CSS.',
        sigue: 'Además del color, controlas la letra y los espacios.',
      },
      'css-texto-espacios': {
        viene: 'Sigue con CSS, ahora para la letra y la caja de cada elemento.',
        sirve: 'Una tarjeta de producto bien espaciada se lee mejor y se ve más profesional.',
        sigue: 'Para poner cosas lado a lado sin pelear, viene Flexbox.',
      },
      'css-flexbox': {
        viene: 'Acomoda las cajas que ya sabes estilizar.',
        sirve: 'El menú en una fila o la vitrina de productos que se acomoda al celular se hacen con Flexbox.',
        sigue: 'Ahora haces que la página responda a los clics con JavaScript.',
      },
      'javascript-pagina': {
        viene: 'Une el JavaScript de su ruta con el HTML y el CSS de esta.',
        sirve: 'El contador del carrito que sube cuando tocas "Agregar" es JavaScript cambiando la página.',
        sigue: 'Sigue con CSS Grid, para armar páginas completas en filas y columnas.',
      },
      'css-grid': {
        viene: 'Flexbox acomoda en una fila; Grid acomoda en filas y columnas a la vez.',
        sirve: 'La vitrina de productos en cuadrícula y el esqueleto de una página (encabezado, contenido, barra lateral, pie) se arman con Grid.',
        sigue: 'Luego haces que esa cuadrícula se acomode al celular con media queries.',
      },
      'diseno-adaptable': {
        viene: 'Usa Grid y Flexbox, y les cambia las columnas según el ancho de la pantalla.',
        sirve: 'La mayoría de los clientes entra desde el celular: una página que no se adapta los espanta. freeCodeCamp lo pide en todos sus proyectos.',
        sigue: 'Por último, haces que la página la pueda usar todo el mundo: accesibilidad.',
      },
      accesibilidad: {
        viene: 'Revisa con otros ojos el HTML y el CSS de toda la ruta.',
        sirve: 'Una página accesible la pueden usar personas ciegas, quienes navegan con teclado y los mayores; además Google la entiende mejor. Es parte de la certificación Responsive Web Design.',
        sigue: 'Con HTML, CSS y JavaScript ya puedes empezar los Proyectos, o aprender React para armar interfaces con componentes.',
      },
    },
  },

  proyectos: {
    intro:
      'En esta ruta juntas lo que aprendiste en varias rutas para construir proyectos completos, como en un trabajo real: un catálogo, un asistente con IA, tu portafolio y la tienda de Don Pepe de punta a punta. Estos proyectos son los que puedes mostrar cuando busques trabajo.',
    lecciones: {
      'guardar-con-git': {
        viene: 'Ya escribiste código en varias rutas; ahora aprendes a guardar su historia.',
        sirve: 'Git te deja volver atrás si algo se daña y es lo primero que te piden en cualquier equipo de programación.',
        sigue: 'Con tu trabajo protegido, construyes el primer proyecto: el catálogo de la tienda.',
      },
      'catalogo-tienda': {
        viene: 'Junta SQL para los datos, Python para la lógica y HTML para mostrarlos.',
        sirve: 'Un catálogo que los vecinos ven desde el celular es justo lo que le venderías a un negocio de barrio.',
        sigue: 'El siguiente proyecto le suma inteligencia artificial.',
      },
      'asistente-resenas': {
        viene: 'Usa lo de la ruta de IA junto con Python y SQL.',
        sirve: 'Clasificar cientos de reseñas en segundos le dice a Don Pepe qué le gusta y qué no a sus clientes.',
        sigue: 'Ahora construyes el proyecto que te representa: tu portafolio.',
      },
      portafolio: {
        viene: 'Usa HTML, CSS y JavaScript de las rutas de páginas web.',
        sirve: 'Es la página que mandas cuando buscas trabajo o clientes: muestra lo que sabes hacer.',
        sigue: 'Cierras juntando todo en la tienda completa, de la base de datos a la pantalla.',
      },
      'tienda-completa': {
        viene: 'Junta todas las rutas: SQL, Python, JavaScript, HTML e IA.',
        sirve: 'Seguir el viaje de un dato de la base de datos al celular del cliente es entender cómo funciona cualquier aplicación.',
        sigue: 'Ahora puedes profundizar en lo que más te guste (datos, aprendizaje automático, React o ciberseguridad) o pasar a Programar en tu computador, que lleva lo aprendido a tu propio PC, y después a El oficio, que te muestra cómo es trabajar en una empresa con proyectos así.',
      },
    },
  },

  datos: {
    intro:
      'En esta ruta aprendes a analizar datos con Python, usando NumPy y pandas: leer un archivo de Excel o CSV, limpiarlo, unir tablas, agrupar y sacar cuentas que respondan preguntas del negocio. Es lo que hace un analista de datos todos los días, y prepara para el curso de Pandas de Kaggle y para Data Analysis with Python de freeCodeCamp.',
    lecciones: {
      numpy: {
        viene: 'Usa las listas y los bucles de la ruta de Python, pero sin escribir el for.',
        sirve: 'Subirle el IVA a mil precios de una sola vez, o sacar el promedio de las ventas del mes, se hace con NumPy en una línea.',
        sigue: 'Ahora pasas de una lista de números a una tabla completa con pandas.',
      },
      'series-dataframe': {
        viene: 'Una Series es como un arreglo de NumPy con un nombre para cada fila; un DataFrame junta varias, como una hoja de Excel.',
        sirve: 'Las ventas, los clientes o los domicilios de un negocio caben en un DataFrame, listo para hacerle preguntas.',
        sigue: 'Los datos reales no se escriben a mano: siguen los archivos CSV.',
      },
      'leer-csv': {
        viene: 'Llena un DataFrame como el de la lección anterior, pero desde un archivo.',
        sirve: 'Casi todo sistema de ventas, banco o Excel exporta CSV: leerlo es el primer paso de cualquier análisis.',
        sigue: 'Con la tabla cargada, aprendes a sacar solo las filas y columnas que te interesan.',
      },
      seleccionar: {
        viene: 'Es como los corchetes de las listas y el WHERE de SQL, aplicados a una tabla de pandas.',
        sirve: 'Ver solo los pedidos de Bogotá o solo los productos de más de $10.000 es lo que más se le pregunta a una tabla.',
        sigue: 'Antes de sacar conclusiones, toca limpiar los datos.',
      },
      limpiar: {
        viene: 'Usa la selección de la lección anterior para encontrar celdas vacías, filas repetidas y números escritos como texto.',
        sirve: 'Si no limpias, una fila repetida te cuenta dos veces la misma venta y el informe sale mal.',
        sigue: 'Con los datos limpios ya puedes resumirlos por grupos.',
      },
      agrupar: {
        viene: 'Es el GROUP BY de SQL, ahora en pandas.',
        sirve: '¿Cuánto vendió cada vendedor? ¿Qué ciudad compra más? Son las preguntas que un jefe le hace a su analista.',
        sigue: 'Los datos casi nunca vienen en una sola tabla: ahora las unes.',
      },
      unir: {
        viene: 'Es el JOIN de SQL: une dos tablas por una columna que comparten.',
        sirve: 'Juntar los pedidos con los datos de cada cliente te dice quién compra qué y desde dónde.',
        sigue: 'Muchas preguntas dependen del tiempo: siguen las fechas.',
      },
      fechas: {
        viene: 'Convierte en fechas de verdad los textos de tus tablas, para poder agrupar por mes o por día.',
        sirve: 'Saber qué día de la semana se vende más o cuánto tardan los domicilios depende de manejar bien las fechas.',
        sigue: 'Ahora resumes los datos con estadística básica.',
      },
      estadistica: {
        viene: 'Usa el promedio que ya sabes calcular, y le suma la mediana para cuando hay datos raros.',
        sirve: 'Saber si "el domicilio tarda 30 minutos" es cierto para casi todos o solo en promedio cambia lo que le prometes al cliente.',
        sigue: 'Para cerrar, armas el informe completo de Don Pepe.',
      },
      repaso: {
        viene: 'Junta leer, limpiar, filtrar, agrupar, unir y resumir.',
        sirve: 'Es el formato de los proyectos de freeCodeCamp: funciones que devuelven resultados exactos y unas pruebas que los revisan.',
        sigue: 'Con los datos bajo control, la ruta de Aprendizaje automático te enseña a predecir con ellos.',
      },
    },
  },

  ml: {
    intro:
      'En esta ruta entiendes cómo aprende un modelo a partir de ejemplos: separar los datos, entrenar un árbol de decisión, medir cuánto se equivoca, evitar que se memorice las respuestas y juntar muchos árboles en un bosque. Lo construyes a mano para ver qué pasa por dentro, y prepara para el curso Intro to Machine Learning de Kaggle.',
    lecciones: {
      'aprender-de-datos': {
        viene: 'Usa las tablas de la ruta de Análisis de datos: cada fila es un ejemplo.',
        sirve: 'Adivinar el precio de un arriendo, o si un cliente va a volver, a partir de casos pasados es aprendizaje automático.',
        sigue: 'Antes de entrenar, aprendes a separar los datos para no hacerte trampa.',
      },
      validacion: {
        viene: 'Parte en dos los ejemplos de la lección anterior: unos para aprender y otros para examinar.',
        sirve: 'Así sabes si el modelo funciona con clientes nuevos y no solo con los que ya conocía.',
        sigue: 'Ahora construyes tu primer modelo: un árbol de decisión.',
      },
      arbol: {
        viene: 'Un árbol es un montón de if anidados, como los de la ruta de Python, pero que salen de los datos.',
        sirve: 'Un agente inmobiliario piensa así: "¿tiene más de 70 metros? ¿está en estrato 4?", y con eso calcula el arriendo.',
        sigue: 'Para saber si el árbol es bueno, necesitas medir su error.',
      },
      'medir-error': {
        viene: 'Compara las predicciones del árbol con las respuestas reales del grupo de validación.',
        sirve: 'Decir "el modelo se equivoca en promedio $150.000" le ayuda a un cliente a decidir si le sirve.',
        sigue: 'Ahora ves qué pasa cuando el árbol hace muy pocas o demasiadas preguntas.',
      },
      sobreajuste: {
        viene: 'Usa la medida del error para comparar árboles de distintas profundidades.',
        sirve: 'Un modelo que se memoriza los datos se ve perfecto en el computador y falla con clientes reales: aquí aprendes a evitarlo.',
        sigue: 'La solución más usada a ese problema es juntar muchos árboles: el bosque aleatorio.',
      },
      bosque: {
        viene: 'Entrena muchos árboles como los de las lecciones anteriores y junta sus respuestas.',
        sirve: 'El bosque aleatorio es de los modelos más usados en empresas y en las competencias de Kaggle, porque acierta bien sin mucho ajuste.',
        sigue: 'Ahora ves otro modelo clásico: la regresión lineal.',
      },
      'regresion-lineal': {
        viene: 'Usa el promedio y las cuentas de la ruta de Análisis de datos para trazar una recta.',
        sirve: 'Predecir cuántos jugos se venden según la temperatura se hace con una recta.',
        sigue: 'Para cerrar, haces un proyecto completo con todos los pasos.',
      },
      repaso: {
        viene: 'Junta separar, entrenar, validar y medir en un solo flujo.',
        sirve: 'Son los mismos pasos de cualquier proyecto de aprendizaje automático, y los que pide el curso de Kaggle.',
        sigue: 'Ya entiendes lo que hay detrás de los modelos de la ruta de IA, y puedes seguir con los cursos de Kaggle.',
      },
    },
  },

  react: {
    intro:
      'En esta ruta aprendes las ideas de React, la librería con la que se arman hoy las interfaces de Instagram, Netflix y miles de empresas: elementos, componentes, props, estado, eventos y listas. Practicas con una mini versión hecha para la app (sin internet) que usa los mismos nombres, y terminas con el carrito de Don Pepe. Prepara para Front End Development Libraries de freeCodeCamp.',
    lecciones: {
      'crear-elementos': {
        viene: 'Usa funciones y objetos de JavaScript, y el HTML de la ruta de Páginas web.',
        sirve: 'Todo lo que se ve en una app de React es un árbol de elementos; JSX es solo una forma cómoda de escribirlos.',
        sigue: 'Luego agrupas elementos en componentes que se reutilizan.',
      },
      componentes: {
        viene: 'Mete los elementos de la lección anterior dentro de funciones.',
        sirve: 'Un equipo divide una app grande en componentes: el encabezado, la tarjeta de producto, el botón de compra.',
        sigue: 'Después les pasas datos con props para que el mismo componente sirva para muchos productos.',
      },
      props: {
        viene: 'Las props son los parámetros de los componentes que ya escribiste.',
        sirve: 'Una sola tarjeta de producto, con props distintas, dibuja todo el catálogo.',
        sigue: 'Luego le das memoria al componente con useState y lo haces responder a los clics.',
      },
      'estado-eventos': {
        viene: 'Suma estado y eventos a los componentes con props.',
        sirve: 'El contador del carrito, un formulario que valida mientras escribes o un menú que se abre: todo es estado que cambia con eventos.',
        sigue: 'Después dibujas listas de datos con map y key.',
      },
      'listas-key': {
        viene: 'Usa map y filter de JavaScript dentro de los componentes.',
        sirve: 'Catálogos, pedidos, mensajes: casi toda pantalla real muestra una lista que sale de datos.',
        sigue: 'Para cerrar, juntas todo en el carrito de Don Pepe.',
      },
      'repaso-carrito': {
        viene: 'Junta elementos, componentes, props, estado, eventos y listas.',
        sirve: 'Es el tipo de app que piden los proyectos de freeCodeCamp y las pruebas técnicas de un primer trabajo.',
        sigue: 'El siguiente paso es instalar React de verdad (con internet) y repetir el carrito con JSX: ya conoces todas sus piezas.',
      },
    },
  },

  ciberseguridad: {
    intro:
      'En esta ruta aprendes a proteger la información de una persona y de un negocio: contraseñas fuertes, cómo reconocer un mensaje falso, qué hacer contra el malware, la verificación en dos pasos y cómo navegar seguro. No necesitas saber programar para empezar, y prepara para Introduction to Cybersecurity de Cisco y la parte de seguridad de freeCodeCamp.',
    lecciones: {
      'triada-cia': {
        viene: 'Es el punto de partida: no necesitas saber nada antes.',
        sirve: 'Con tres preguntas (¿quién lo puede ver?, ¿alguien lo cambió?, ¿está disponible cuando lo necesito?) sabes qué tan grave es un problema de seguridad.',
        sigue: 'El primer cuidado de la confidencialidad son las contraseñas.',
      },
      contrasenas: {
        viene: 'Protege la confidencialidad que viste en la tríada CIA.',
        sirve: 'Una contraseña larga y un gestor de contraseñas evitan que te roben el Nequi, el correo o el WhatsApp del negocio.',
        sigue: 'Pero la contraseña más fuerte no sirve si te la sacan con engaños: sigue el phishing.',
      },
      phishing: {
        viene: 'Muestra cómo los atacantes consiguen las contraseñas sin adivinarlas: engañando a una persona.',
        sirve: 'Reconocer el SMS falso del banco o la llamada del "asesor" evita la mayoría de los robos en Colombia.',
        sigue: 'Otra forma de ataque es meter programas dañinos en tu equipo: el malware.',
      },
      'malware-respaldos': {
        viene: 'Muchos programas dañinos entran por un enlace de phishing como los de la lección anterior.',
        sirve: 'Si un ransomware le bloquea el PC de la caja a Don Pepe, una copia 3-2-1 le salva los datos de sus clientes.',
        sigue: 'Para que una contraseña robada no baste, sigue la verificación en dos pasos.',
      },
      'dos-factores': {
        viene: 'Le suma un segundo candado a las contraseñas de la lección 2.',
        sirve: 'Con el código del celular activado, aunque alguien tenga tu clave del correo o del banco, no puede entrar.',
        sigue: 'Ahora ves cómo viajan tus datos por la red y cómo cuidarlos en el camino.',
      },
      'redes-https': {
        viene: 'Aplica la confidencialidad y la integridad de la tríada CIA a los datos que viajan por internet.',
        sirve: 'Saber qué protege el candado de HTTPS y qué no te evita pagar en una página falsa o exponerte en el wifi de un café.',
        sigue: 'Para cerrar, armas el plan de seguridad de la tienda de Don Pepe.',
      },
      'repaso-don-pepe': {
        viene: 'Junta todo lo de la ruta: CIA, contraseñas, phishing, respaldos, dos factores y redes.',
        sirve: 'Un plan sencillo de seguridad es algo que le puedes ofrecer a cualquier negocio pequeño.',
        sigue: 'Si programas, la ruta El oficio te enseña a proteger el código: inyección SQL, XSS y secretos.',
      },
    },
  },

  'tu-computador': {
    intro:
      'En esta ruta sacas la programación del navegador y la llevas a tu propio computador: instalas Python, Node, VS Code y Git, aprendes a usar la terminal de Windows, trabajas con Claude Code en tu carpeta y terminas con tu primera página publicada en internet, con su código en GitHub. Es como se trabaja en una empresa de verdad.',
    lecciones: {
      herramientas: {
        viene: 'Ya programaste en Python, JavaScript y la web dentro de la app; ahora ves qué herramientas hacen ese trabajo fuera de ella.',
        sirve: 'El primer día en un trabajo te piden "clona el repositorio y córrelo": eso exige editor, intérprete, terminal y Git listos en tu PC.',
        sigue: 'La herramienta que une a todas es la terminal: la siguiente lección te enseña a usarla en Windows.',
      },
      'la-terminal': {
        viene: 'Usas los comandos de la terminal simulada (pwd, ls, cd, mkdir) que ya conociste con Git.',
        sirve: 'Casi todo se instala, se corre y se publica escribiendo en la terminal, y entender el PATH resuelve el error más común al instalar.',
        sigue: 'Con la terminal y el PATH claros, toca instalar Python y Node y comprobar que quedaron bien.',
      },
      'instalar-python-y-node': {
        viene: 'Aplicas el PATH de la lección anterior: es justo lo que se daña cuando Python "no se reconoce".',
        sirve: 'Instalar y diagnosticar un entorno es lo que harás en cada computador nuevo, y lo que más te van a preguntar amigos y compañeros.',
        sigue: 'Ya tienes con qué correr el código; falta dónde escribirlo cómodo: VS Code.',
      },
      'vs-code': {
        viene: 'Corres en VS Code los mismos comandos de la terminal que ya conoces (python archivo.py, node archivo.js).',
        sirve: 'VS Code es el editor que usa la mayoría de los equipos; abrir una carpeta, la terminal integrada y el depurador son tu día a día.',
        sigue: 'Un proyecto real usa librerías de otros: sigue cómo instalarlas sin que choquen entre proyectos.',
      },
      'entornos-y-dependencias': {
        viene: 'Instalas en tu PC las librerías que antes venían listas dentro de la app; en Entender proyectos hechos con IA volverás a ver requirements.txt y package.json.',
        sirve: 'Con un entorno virtual y una lista de dependencias, cualquiera del equipo reconstruye tu proyecto con un solo comando.',
        sigue: 'Con el proyecto armado, toca guardarlo y subirlo: Git y GitHub de verdad.',
      },
      'git-y-github': {
        viene: 'Pasas del Git simulado de la ruta Proyectos al Git real, con GitHub y .gitignore.',
        sirve: 'Tu GitHub es tu hoja de vida técnica, y en cualquier empresa el código vive en un repositorio remoto.',
        sigue: 'Con Git como red de seguridad ya puedes dejar que una IA trabaje en tu carpeta: sigue Claude Code.',
      },
      'claude-code': {
        viene: 'Usas de verdad el agente que estudiaste en Programar con IA, y Git para revisar y deshacer lo que haga.',
        sirve: 'Trabajar con un agente en pasos pequeños, revisando cada diff, es cómo muchos equipos programan hoy.',
        sigue: 'Con todas las herramientas listas, cierras con tu proyecto: una página publicada en internet.',
      },
      'tu-pagina-publicada': {
        viene: 'Junta toda la ruta: VS Code, la terminal, Git, GitHub y Claude Code, más lo que sabes de HTML y CSS.',
        sirve: 'Un enlace a una página tuya, funcionando en el celular, es lo primero que se mira en un portafolio.',
        sigue: 'Con tu PC listo y un proyecto publicado, la ruta El oficio te muestra cómo es el trabajo diario en una empresa.',
      },
    },
  },

  oficio: {
    intro:
      'En esta ruta practicas lo que se hace en un trabajo real: leer código que escribió otra persona, encontrar errores, crear APIs, proteger los datos y trabajar en equipo con Git. Es lo que separa a quien sabe programar de quien está listo para su primer empleo.',
    lecciones: {
      'leer-codigo-ajeno': {
        viene: 'Ya escribiste tus programas; ahora te toca entender los de otros.',
        sirve: 'En tu primer trabajo casi siempre llegas a un sistema que ya existe, y tu primera tarea es cambiar algo sin dañar lo demás.',
        sigue: 'Cuando algo falla, toca saber depurar: eso sigue.',
      },
      depurar: {
        viene: 'Usa los errores y excepciones de Python que ya conoces.',
        sirve: 'Leer un traceback y escribir una prueba que atrape el error es lo que se hace con cada falla que reporta un cliente.',
        sigue: 'Ahora ves cómo hablan los programas entre sí: las APIs.',
      },
      'apis-rest': {
        viene: 'Ya consumiste una API con fetch; ahora ves también el lado del servidor.',
        sirve: 'La app del celular, la página y el sistema de facturación de una empresa se comunican por APIs.',
        sigue: 'Tu API recibe datos de afuera, así que toca validarlos.',
      },
      validar: {
        viene: 'Revisa los datos que llegan a la API de la lección anterior.',
        sirve: 'Un formulario de registro que acepta cualquier cosa termina llenando la base de datos de basura.',
        sigue: 'Hay datos que no solo están mal, sino que atacan: sigue la seguridad.',
      },
      'inyeccion-sql': {
        viene: 'Junta el SQL de su ruta con la validación de la lección anterior.',
        sirve: 'Pegar lo que escribe el usuario en una consulta deja abierta la puerta para robar los datos de todos los clientes.',
        sigue: 'Siguen otros ataques comunes y cómo cuidar contraseñas y claves.',
      },
      'xss-claves-secretos': {
        viene: 'Sigue con la seguridad, ahora en la página web.',
        sirve: 'Una reseña maliciosa mal pintada puede robarles la sesión a otros clientes; y una clave en el código puede costarle plata a la empresa.',
        sigue: 'Ahora trabajas con los archivos que de verdad mandan los clientes.',
      },
      'datos-de-clientes': {
        viene: 'Usa listas, diccionarios y el análisis de datos de Python.',
        sirve: '"Te mando el Excel de ventas, ¿me sacas cuánto vendió cada quien?" es de los encargos más comunes en un negocio.',
        sigue: 'En un equipo no trabajas solo: sigue Git en equipo.',
      },
      'git-en-equipo': {
        viene: 'Amplía el Git de la ruta de Proyectos al trabajo con otras personas.',
        sirve: 'Ramas, pull requests y revisión es como trabajan casi todas las empresas para no pisarse el código.',
        sigue: 'Antes de programar, toca entender qué quiere el cliente.',
      },
      'del-pedido-a-tareas': {
        viene: 'Organiza el trabajo antes de escribir código.',
        sirve: '"Quiero domicilios por la página" esconde muchas decisiones; partirlo en tareas evita prometer lo que no se puede.',
        sigue: 'Cierras resolviendo un ticket completo, de punta a punta.',
      },
      'repaso-un-ticket': {
        viene: 'Junta leer código, depurar, probar, validar y dejar listo para revisión.',
        sirve: 'Es exactamente lo que harás todos los días en una empresa.',
        sigue: 'La ruta Entender proyectos hechos con IA te prepara para los proyectos que hoy arma la IA.',
      },
    },
  },

  'proyectos-ia': {
    intro:
      'En esta ruta aprendes a entender un proyecto completo, aunque lo haya hecho una IA: qué hay en cada carpeta, qué son las dependencias y los frameworks, y cómo llega una página a internet. Así puedes dirigir a la IA para construir algo real y arreglarlo cuando falla.',
    lecciones: {
      'el-mapa-del-proyecto': {
        viene: 'En El oficio leíste código ajeno; ahora lees un proyecto entero.',
        sirve: 'Si le pides a una IA una app de domicilios, aparecen veinte archivos; saber dónde vive cada cosa te deja cambiarla tú.',
        sigue: 'Los archivos de configuración te dicen qué usa el proyecto y cómo arrancarlo.',
      },
      'archivos-de-configuracion': {
        viene: 'Son las primeras paradas del mapa de la lección anterior.',
        sirve: 'Leer package.json o requirements.txt te dice en un minuto cómo arrancar un proyecto que nunca habías visto.',
        sigue: 'Esos archivos listan dependencias; ahora entiendes cómo funcionan.',
      },
      'dependencias-y-versiones': {
        viene: 'Explica la lista de dependencias de los archivos de configuración.',
        sirve: 'Un "en mi computador sí funciona" casi siempre es una versión distinta de alguna dependencia.',
        sigue: 'Algunas dependencias son frameworks, que manejan tu programa por ti.',
      },
      'frameworks-sin-miedo': {
        viene: 'Distingue las dependencias que tú llamas de las que te llaman a ti.',
        sirve: 'React, Flask o Django aparecen en casi toda oferta de empleo; aquí ves que su idea es sencilla.',
        sigue: 'Los proyectos guardan claves secretas, y no van en el código: siguen las variables de entorno.',
      },
      'variables-de-entorno': {
        viene: 'Retoma el cuidado de claves de la ruta El oficio, ahora en el proyecto.',
        sirve: 'La clave de la pasarela de pagos de Don Pepe va en un .env; si se sube a internet, cualquiera puede cobrar a su nombre.',
        sigue: 'Ahora sigues el viaje de un clic entre la página y el servidor.',
      },
      'frontend-y-backend': {
        viene: 'Junta el fetch de JavaScript con las APIs de El oficio.',
        sirve: 'Cuando el botón "Pedir domicilio" no hace nada, seguir ese viaje te dice dónde se rompió.',
        sigue: 'Funciona en tu computador; ahora ves cómo llega a internet.',
      },
      'como-llega-a-internet': {
        viene: 'Saca de tu computador el proyecto que ya entiendes por dentro.',
        sirve: 'Publicar la página para que Don Pepe y sus clientes la abran desde el celular es el paso final de todo proyecto.',
        sigue: 'Ya entiendes el proyecto entero; ahora aprendes a dirigir a la IA para construirlo.',
      },
      'dirigir-a-la-ia': {
        viene: 'Aplica lo de Programar con IA a un proyecto completo.',
        sirve: 'Pedir los cupones de descuento en pasos pequeños, con contexto y con prueba, evita que la IA toque diez archivos a ciegas.',
        sigue: 'Lo que entrega la IA se revisa antes de aceptarlo: eso sigue.',
      },
      'revisar-y-cambiar': {
        viene: 'Usa el diff y las pruebas de Programar con IA.',
        sirve: 'Que "las pruebas pasan" no garantiza que no se haya borrado algo importante; leer el diff sí.',
        sigue: 'Cierras recibiendo un proyecto ajeno y dejándolo listo para trabajar.',
      },
      repaso: {
        viene: 'Junta todo lo de la ruta en tu primer día con un proyecto ajeno.',
        sirve: 'Recibir una app hecha a la carrera y dejarla funcionando es un encargo real de trabajo independiente.',
        sigue: 'La ruta Tu primer trabajo te ayuda a convertir todo esto en un empleo o en clientes.',
      },
    },
  },

  'primer-trabajo': {
    intro:
      'En esta ruta conviertes lo que aprendiste en trabajo: qué busca una empresa en alguien que empieza, cómo armar portafolio y hoja de vida, cómo pasar una entrevista técnica y cómo cobrarle a un negocio pequeño. Al final tienes un plan de 90 días para seguir.',
    lecciones: {
      'que-busca-una-empresa': {
        viene: 'Ya tienes bases en varias rutas; ahora ves cómo se ven desde el lado de quien contrata.',
        sirve: 'Saber que una empresa valora que aprendas rápido y avises a tiempo te ayuda a enfocar tu preparación.',
        sigue: 'Lo primero que miran es tu portafolio: eso sigue.',
      },
      portafolio: {
        viene: 'Retoma el portafolio de la ruta de Proyectos y le suma un buen README.',
        sirve: 'Sin experiencia laboral, tres proyectos terminados y bien explicados son tu experiencia.',
        sigue: 'Esos proyectos se muestran en GitHub.',
      },
      github: {
        viene: 'Sube a internet el Git que ya usas.',
        sirve: 'Quien te contrata abre tu GitHub para ver cómo trabajas: commits claros y ramas ordenadas hablan bien de ti.',
        sigue: 'Con proyectos a la vista, armas la hoja de vida.',
      },
      'hoja-de-vida': {
        viene: 'Usa los proyectos del portafolio y de GitHub como tu experiencia.',
        sirve: 'Una hoja de vida que muestra proyectos concretos pasa el primer filtro aunque nunca hayas trabajado programando.',
        sigue: 'Si te llaman, viene la entrevista técnica.',
      },
      'entrevista-ejercicios': {
        viene: 'Usa la lógica de Python y lo de Fundamentos.',
        sirve: 'FizzBuzz, palíndromos y contar palabras son los ejercicios que más ponen en entrevistas para junior.',
        sigue: 'Además del ejercicio, te harán preguntas de conceptos.',
      },
      'entrevista-conceptos': {
        viene: 'Repasa conceptos de todas las rutas y te enseña a explicarlos corto.',
        sirve: 'Explicar qué es una API con un ejemplo de algo que hiciste convence más que una definición de memoria.',
        sigue: 'No solo las empresas contratan: los negocios pequeños también necesitan ayuda.',
      },
      'negocios-pequenos': {
        viene: 'Aplica todo lo que sabes a lo que necesita un negocio de barrio.',
        sirve: 'Un botón de WhatsApp o un aviso de qué pedir al proveedor puede ser tu primer trabajo pagado.',
        sigue: 'Para cobrar bien, toca saber cotizar.',
      },
      cotizar: {
        viene: 'Convierte las tareas de El oficio en horas y en un precio.',
        sirve: 'Acordar por escrito qué se entrega y cuándo se paga evita la mayoría de los problemas con un cliente.',
        sigue: 'Usarás IA en esos trabajos, así que toca hacerlo sin poner en riesgo al cliente.',
      },
      'ia-en-el-trabajo': {
        viene: 'Retoma el uso responsable de Programar con IA, ahora con clientes reales.',
        sirve: 'Tapar correos y celulares antes de pegar datos en una IA protege a tu cliente y tu reputación.',
        sigue: 'Cierras con un plan para los próximos 90 días.',
      },
      'plan-90-dias': {
        viene: 'Usa la autoevaluación de la primera lección de esta ruta.',
        sirve: 'Un plan por semanas convierte "quiero trabajar programando" en metas que sí puedes cumplir.',
        sigue: 'Terminaste las rutas: lo que sigue es practicar con proyectos reales y volver a las lecciones cuando las necesites.',
      },
    },
  },
};

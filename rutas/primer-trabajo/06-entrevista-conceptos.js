// Ruta "Tu primer trabajo", lección 6: preguntas de conceptos en una
// entrevista. Cada concepto se practica con código para entenderlo de verdad
// y no solo memorizar la respuesta: la práctica separa una URL en partes (lo
// que hace el navegador) y el reto pasa datos de documentos (NoSQL) a tablas
// (SQL).
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const PEDIDOS = [
      '# Así guardaría los pedidos una base de documentos (NoSQL): cada pedido trae todo adentro',
      'pedidos = [',
      '    {"id": 1, "cliente": "Ana", "items": [{"producto": "Arepa", "cantidad": 2}, {"producto": "Tinto", "cantidad": 1}]},',
      '    {"id": 2, "cliente": "Luis", "items": [{"producto": "Buñuelo", "cantidad": 3}]},',
      '    {"id": 3, "cliente": "Ana", "items": [{"producto": "Tinto", "cantidad": 2}]},',
      ']',
    ];

    return {
      id: 'entrevista-conceptos',
      titulo: 'Entrevista técnica II: preguntas de conceptos',
      pasos: [
        {
          id: 'idea',
          titulo: 'Responder corto, con un ejemplo tuyo',
          texto: [
            'Además del ejercicio, suelen hacer preguntas de conceptos. Una buena respuesta tiene tres partes: **qué es en una frase**, **un ejemplo de algo que hiciste** y, si sabes, **cuándo no conviene**. Ejecuta el código para leer cuatro respuestas modelo.',
            '¿Qué pasa al escribir una URL? Es una pregunta clásica porque junta todo: el navegador separa la dirección, le pregunta al **DNS** qué dirección IP tiene el dominio, se conecta con el servidor (cifrado, si es **HTTPS**), pide la ruta con **HTTP**, recibe una respuesta con un código (200 si salió bien, 404 si no existe) y el HTML, y lo dibuja pidiendo además el CSS, el JavaScript y las imágenes.',
            'Y cuando no sabes algo, **no inventes**. Los entrevistadores lo notan y pesa más que no saber. La fórmula: «No lo he usado, así que no quiero inventar. Lo que sí sé es … , que se parece. Para averiguarlo leería la documentación oficial, haría un ejemplo pequeño y lo probaría». Muestra honestidad y que sabes aprender: dos de las cinco cosas que busca una empresa.',
          ],
          codigo: [
            'respuestas = {',
            '    "¿Qué es una API?":',
            '        "La forma acordada en que un programa le pide cosas a otro. En mi tienda, la página le pide los productos al servidor con fetch y recibe JSON.",',
            '    "¿SQL o NoSQL?":',
            '        "SQL guarda tablas con columnas fijas y relaciones: sirve si los datos tienen forma clara y hay que unirlos, como clientes y pedidos. NoSQL agrupa bases distintas; las de documentos guardan algo parecido a JSON, flexible, útil si la forma de los datos cambia.",',
            '    "¿Qué hace git merge?":',
            '        "Junta la historia de una rama con otra. Si las dos cambiaron la misma línea hay un conflicto, y yo decido qué queda.",',
            '    "¿Qué pasa al escribir una URL?":',
            '        "DNS da la IP del dominio, el navegador se conecta (con HTTPS, cifrado), pide la ruta por HTTP, recibe un código y el HTML, y dibuja la página.",',
            '}',
            '',
            'for pregunta, respuesta in respuestas.items():',
            '    print(pregunta)',
            '    print("  ", respuesta)',
            '',
            'print("Si no sé: No lo he usado y no quiero inventar. Lo averiguaría con la documentación y un ejemplo pequeño.")',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Las partes de una URL',
          texto: [
            'Para entender qué hace el navegador, haz lo primero que hace él: **separar la URL**. En `https://tienda.example.com/productos?categoria=arepas` el **protocolo** es `https`, el **dominio** es `tienda.example.com` (lo que se le pregunta al DNS), la **ruta** es `/productos` (lo que se le pide al servidor) y la **consulta** es `categoria=arepas` (los datos extra).',
            'Completa `partes_url(url)`, que devuelve un diccionario con `"protocolo"`, `"dominio"`, `"ruta"` y `"consulta"`. La consulta es otro diccionario: `"q=pan&pagina=2"` da `{"q": "pan", "pagina": "2"}` (los valores quedan como texto). Si no hay ruta, la ruta es `"/"`; si no hay consulta, es `{}`.',
            'En un trabajo real usarías `urllib.parse`, que ya trae Python y maneja muchos casos más. Hacerlo a mano una vez es lo que te deja explicarlo en una entrevista.',
          ],
          codigo: [
            'def partes_url(url):',
            '    # Corta en "://", luego en "?", luego en la primera "/"',
            '    return {}',
            '',
            '',
            'print(partes_url("https://tienda.example.com/productos?categoria=arepas"))',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Separa una URL completa',
              condicion: 'partes_url("https://tienda.example.com/productos?categoria=arepas") == {"protocolo": "https", "dominio": "tienda.example.com", "ruta": "/productos", "consulta": {"categoria": "arepas"}}',
            },
            {
              descripcion: 'Sin ruta ni consulta: ruta "/" y consulta vacía',
              condicion: 'partes_url("http://example.com") == {"protocolo": "http", "dominio": "example.com", "ruta": "/", "consulta": {}}',
            },
            {
              descripcion: 'Lee varios datos de la consulta',
              condicion: 'partes_url("https://example.com/buscar?q=pan&pagina=2")["consulta"] == {"q": "pan", "pagina": "2"}',
            },
            {
              descripcion: 'Conserva rutas largas',
              condicion: 'partes_url("https://example.com/tienda/productos/7")["ruta"] == "/tienda/productos/7"',
            },
            {
              descripcion: 'Con consulta pero sin ruta, la ruta es "/"',
              condicion: 'partes_url("https://example.com?q=pan") == {"protocolo": "https", "dominio": "example.com", "ruta": "/", "consulta": {"q": "pan"}}',
            },
          ],
          pistas: [
            '`protocolo, resto = url.split("://", 1)`. Después, si hay `"?"` en el resto: `resto, texto_consulta = resto.split("?", 1)`; si no, `texto_consulta = ""`.',
            'Si hay `"/"` en el resto, `posicion = resto.index("/")`: el dominio es `resto[:posicion]` y la ruta `resto[posicion:]`. Si no, el dominio es todo y la ruta `"/"`.',
            'Para la consulta: `for par in texto_consulta.split("&"):` y, si `par` no está vacío, `clave, valor = par.split("=", 1)`.',
          ],
          solucion: [
            'def partes_url(url):',
            '    protocolo, resto = url.split("://", 1)',
            '    texto_consulta = ""',
            '    if "?" in resto:',
            '        resto, texto_consulta = resto.split("?", 1)',
            '    if "/" in resto:',
            '        posicion = resto.index("/")',
            '        dominio, ruta = resto[:posicion], resto[posicion:]',
            '    else:',
            '        dominio, ruta = resto, "/"',
            '    consulta = {}',
            '    for par in texto_consulta.split("&"):',
            '        # "".split("&") da [""]: el if evita una clave vacía cuando no hay consulta.',
            '        if par:',
            '            clave, valor = par.split("=", 1)',
            '            consulta[clave] = valor',
            '    return {"protocolo": protocolo, "dominio": dominio, "ruta": ruta, "consulta": consulta}',
            '',
            '',
            'print(partes_url("https://tienda.example.com/productos?categoria=arepas"))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: de documentos a tablas',
          texto: [
            '«¿SQL o NoSQL?» se entiende mejor haciéndolo. En una base de **documentos**, cada pedido guarda adentro su cliente y sus productos, como la lista `pedidos` del código. En **SQL** eso se reparte en dos tablas: `pedidos (id, cliente)` e `items (pedido_id, producto, cantidad)`, unidas por el id del pedido.',
            'Crea `aplanar(pedidos)`, que devuelve `{"pedidos": [...], "items": [...]}`: en `"pedidos"` una tupla `(id, cliente)` por pedido y en `"items"` una tupla `(pedido_id, producto, cantidad)` por producto, en el orden original. No cambies la lista que recibes.',
            'Después crea `unidades_por_cliente(tablas)`, que recibe lo que devuelve `aplanar` y suma las unidades que pidió cada cliente: `{"Ana": 5, "Luis": 3}`. Fíjate que necesitas **unir** las dos tablas por el id: eso es un `JOIN` de SQL. Ese es el precio de las tablas (hay que unirlas) y su ventaja (cada dato vive en un solo lugar).',
          ],
          codigo: [
            ...PEDIDOS,
            '',
            '',
            'def aplanar(pedidos):',
            '    # Una tupla por pedido y una por cada producto de cada pedido',
            '    return {"pedidos": [], "items": []}',
            '',
            '',
            'def unidades_por_cliente(tablas):',
            '    # Primero un diccionario {id del pedido: cliente}, luego recorre los items',
            '    return {}',
            '',
            '',
            'tablas = aplanar(pedidos)',
            'print(tablas)',
            'print(unidades_por_cliente(tablas))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'La tabla de pedidos tiene (id, cliente)', condicion: 'aplanar(pedidos)["pedidos"] == [(1, "Ana"), (2, "Luis"), (3, "Ana")]' },
            {
              descripcion: 'La tabla de items tiene (pedido_id, producto, cantidad) en orden',
              condicion: 'aplanar(pedidos)["items"] == [(1, "Arepa", 2), (1, "Tinto", 1), (2, "Buñuelo", 3), (3, "Tinto", 2)]',
            },
            {
              descripcion: 'Un pedido sin productos queda en pedidos, no en items',
              condicion: 'aplanar([{"id": 9, "cliente": "Eva", "items": []}]) == {"pedidos": [(9, "Eva")], "items": []}',
            },
            {
              descripcion: 'No cambia la lista que recibe',
              condicion: '(lambda copia: (aplanar(pedidos), pedidos == copia)[1])(__import__("copy").deepcopy(pedidos))',
            },
            { descripcion: 'Suma las unidades de cada cliente uniendo las tablas', condicion: 'unidades_por_cliente(aplanar(pedidos)) == {"Ana": 5, "Luis": 3}' },
            {
              descripcion: 'Trabaja con las tablas y no con los documentos',
              condicion: 'unidades_por_cliente({"pedidos": [(1, "Ana"), (2, "Ana")], "items": [(2, "Tinto", 4)]}) == {"Ana": 4}',
            },
          ],
          pistas: [
            'En `aplanar`, recorre `for pedido in pedidos:`, agrega `(pedido["id"], pedido["cliente"])` a una lista y, adentro, `for item in pedido["items"]:` agrega `(pedido["id"], item["producto"], item["cantidad"])` a la otra.',
            'En `unidades_por_cliente`, arma primero `cliente_de = {id: cliente for id, cliente in tablas["pedidos"]}`.',
            'Luego `for pedido_id, producto, cantidad in tablas["items"]:` busca `cliente = cliente_de[pedido_id]` y suma con `total[cliente] = total.get(cliente, 0) + cantidad`.',
          ],
          solucion: [
            ...PEDIDOS,
            '',
            '',
            'def aplanar(pedidos):',
            '    filas_pedidos = []',
            '    filas_items = []',
            '    for pedido in pedidos:',
            '        filas_pedidos.append((pedido["id"], pedido["cliente"]))',
            '        for item in pedido["items"]:',
            '            # El id del pedido viaja en cada item: es la "clave foránea" que une las tablas.',
            '            filas_items.append((pedido["id"], item["producto"], item["cantidad"]))',
            '    return {"pedidos": filas_pedidos, "items": filas_items}',
            '',
            '',
            'def unidades_por_cliente(tablas):',
            '    # Esto es un JOIN: para cada item se busca su pedido por el id.',
            '    cliente_de = {pedido_id: cliente for pedido_id, cliente in tablas["pedidos"]}',
            '    total = {}',
            '    for pedido_id, producto, cantidad in tablas["items"]:',
            '        cliente = cliente_de[pedido_id]',
            '        total[cliente] = total.get(cliente, 0) + cantidad',
            '    return total',
            '',
            '',
            'tablas = aplanar(pedidos)',
            'print(tablas)',
            'print(unidades_por_cliente(tablas))',
          ].join('\n'),
        },
      ],
    };
  })()
);

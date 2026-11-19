// Ruta "Entender proyectos hechos con IA", lección 6. Mismo formato que
// 01-el-mapa-del-proyecto.js. Se sigue un clic de punta a punta dentro del
// proyecto; el backend corre de verdad (proyecto.servidor), así que las
// pruebas miran lo que el servidor guardó y contestó.

globalThis.Rutas.agregarLeccion(
  'proyectos-ia',
  {
    id: 'frontend-y-backend',
    titulo: 'Frontend y backend hablando',
    pasos: [
      {
        id: 'idea',
        titulo: 'El viaje de un clic',
        texto: [
          'El cliente toca **"Pedir domicilio"**. ¿Qué pasa? Seguir ese viaje es la mejor forma de entender un proyecto, y también la mejor forma de encontrar dónde se rompió algo.',
          '**1.** En `Carrito.jsx`, el botón tiene `onClick={onPedir}`: llama una función que le pasó `App`. **2.** `App.jsx` arma el pedido con el estado (dirección y productos) y llama `enviarPedido`. **3.** `api.js` hace un `fetch` con método **POST** a `/api/pedidos`, con el pedido convertido en **JSON**. Hasta aquí todo pasó en el navegador del cliente.',
          '**4.** La petición viaja por internet hasta el backend, y Flask busca la ruta `@app.post("/api/pedidos")`. **5.** `crear_pedido` **valida** (`validacion.py`), **calcula** (`precios.py`) y **guarda** (`datos.py`). **6.** Contesta con un **código de estado** y JSON: `201` (creado), `400` (el pedido viene mal), `404` (esa ruta no existe), `500` (el servidor falló). **7.** De vuelta en el navegador, `App` muestra el mensaje y React vuelve a pintar.',
          'Fíjate en la división: la página **nunca** toca la base de datos ni calcula el precio final, porque cualquiera puede alterar lo que corre en su navegador. Lo importante se decide en el backend. Corre el ejemplo: busca cada paso en el código y al final hace la misma petición que haría la página.',
        ],
        codigo: [
          'import proyecto',
          '',
          'archivos = proyecto.abrir()',
          'pasos = [',
          '    ("1. El botón", "onClick={onPedir}"),',
          '    ("2. App arma el pedido", "enviarPedido({"),',
          '    ("3. La página lo envía", \'fetch(API + "/api/pedidos"\'),',
          '    ("4. Flask encuentra la ruta", \'@app.post("/api/pedidos")\'),',
          '    ("5. Valida, calcula y guarda", "errores_del_pedido(pedido"),',
          '    ("", "guardar_pedido({"),',
          ']',
          'for titulo, texto in pasos:',
          '    if titulo:',
          '        print(titulo)',
          '    for linea in proyecto.buscar(archivos, texto):',
          '        print("   ", linea)',
          '',
          'cliente = proyecto.servidor(archivos)',
          'pedido = {"direccion": "Calle 10 # 5-20", "items": [{"id": 1, "cantidad": 2}]}',
          'respuesta = cliente.post("/api/pedidos", json=pedido)',
          'print("6. El backend contesta:", respuesta.status_code, respuesta.get_json())',
          '',
          'sin_direccion = {"direccion": "", "items": [{"id": 1, "cantidad": 2}]}',
          'respuesta = cliente.post("/api/pedidos", json=sin_direccion)',
          'print("   Y si viene mal:", respuesta.status_code, respuesta.get_json())',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Habla como la página',
        texto: [
          'El frontend y el backend tienen un **contrato**: la forma exacta de los datos que se mandan. Si no coinciden, nada funciona, aunque cada lado esté bien escrito. Es uno de los errores más comunes cuando una IA cambia un lado y se olvida del otro.',
          'Crea el cuerpo de `enviar_pedido(cliente, carrito, direccion)`, que hace lo mismo que la página. `carrito` es un diccionario `{id_producto: cantidad}`, como el estado de `App.jsx`. Mándale al backend un POST a `/api/pedidos` con el JSON que espera: `{"direccion": ..., "items": [{"id": ..., "cantidad": ...}, ...]}`.',
          'Si contesta `201`, devuelve `"Pedido #N confirmado. Total: $T"` (con el `numero` y el `total` que mandó el backend). Si no, devuelve `"No se pudo: "` y los errores que mandó, separados por `", "`.',
        ],
        codigo: [
          'import proyecto',
          '',
          '',
          'def enviar_pedido(cliente, carrito, direccion):',
          '    # Así lo mandaba la IA: el backend no entiende "carrito"',
          '    cuerpo = {"direccion": direccion, "carrito": carrito}',
          '    respuesta = cliente.post("/api/pedidos", json=cuerpo)',
          '    return "Respuesta " + str(respuesta.status_code)',
          '',
          '',
          'cliente = proyecto.servidor(proyecto.abrir())',
          'print(enviar_pedido(cliente, {1: 2, 3: 1}, "Calle 10 # 5-20"))',
          'print(enviar_pedido(cliente, {1: 2}, ""))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'Un pedido bien hecho queda confirmado con su número y total',
            condicion:
              'enviar_pedido(__import__("proyecto").servidor(__import__("proyecto").abrir()), {1: 2}, "Calle 10") == "Pedido #1 confirmado. Total: $11000"',
          },
          {
            descripcion: 'Manda todos los productos (con 53.500 el domicilio sale gratis)',
            condicion:
              'enviar_pedido(__import__("proyecto").servidor(__import__("proyecto").abrir()), {3: 20, 4: 3}, "Cra 7") == "Pedido #1 confirmado. Total: $53500"',
          },
          {
            descripcion: 'El pedido de verdad quedó guardado en el backend',
            condicion:
              '((c := __import__("proyecto").servidor(__import__("proyecto").abrir())), enviar_pedido(c, {2: 3}, "Calle 5"), c.get("/api/pedidos/1").get_json())[2]["items"] == [{"id": 2, "cantidad": 3}]',
          },
          {
            descripcion: 'Sin dirección, muestra el error que mandó el backend',
            condicion:
              'enviar_pedido(__import__("proyecto").servidor(__import__("proyecto").abrir()), {1: 2}, "") == "No se pudo: Falta la dirección"',
          },
          {
            descripcion: 'Con varios errores, los junta con comas',
            condicion:
              'enviar_pedido(__import__("proyecto").servidor(__import__("proyecto").abrir()), {}, "  ") == "No se pudo: Falta la dirección, El pedido no tiene productos"',
          },
        ],
        pistas: [
          'Convierte el carrito: `items = [{"id": id, "cantidad": cantidad} for id, cantidad in carrito.items()]`.',
          'Lee la respuesta con `datos = respuesta.get_json()` y pregunta `if respuesta.status_code == 201:`. El número está en `datos["numero"]` y el total en `datos["total"]`.',
          'Si falló: `return "No se pudo: " + ", ".join(datos["errores"])`.',
        ],
        solucion: [
          'import proyecto',
          '',
          '',
          'def enviar_pedido(cliente, carrito, direccion):',
          '    items = [{"id": id, "cantidad": cantidad} for id, cantidad in carrito.items()]',
          '    respuesta = cliente.post("/api/pedidos", json={"direccion": direccion, "items": items})',
          '    datos = respuesta.get_json()',
          '    if respuesta.status_code == 201:',
          '        return "Pedido #" + str(datos["numero"]) + " confirmado. Total: $" + str(datos["total"])',
          '    return "No se pudo: " + ", ".join(datos["errores"])',
          '',
          '',
          'cliente = proyecto.servidor(proyecto.abrir())',
          'print(enviar_pedido(cliente, {1: 2, 3: 1}, "Calle 10 # 5-20"))',
          'print(enviar_pedido(cliente, {1: 2}, ""))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: las rutas rotas',
        texto: [
          'Una IA cambió `@app.post("/api/pedidos")` por `@app.post("/api/pedido")` "para que quedara más bonito". Corrió las pruebas del backend y pasan, porque también las cambió. Pero en producción ningún cliente puede pedir: la página sigue llamando a la ruta vieja. Hay que revisar que **cada llamada del frontend tenga quien la conteste** en el backend.',
          '`proyecto.llamadas_fetch(archivos)` lee los `fetch` del frontend y te da una lista de parejas `(método, ruta)`, por ejemplo `("POST", "/api/pedidos")`. Crea `rutas_rotas(archivos)`: arranca el backend, prueba cada llamada con `cliente.open(ruta, method=metodo)` y devuelve una lista de `(método, ruta, código)` con las que contestan **404** (no existe) o **405** (existe, pero no con ese método).',
          'No importa que la llamada de prueba vaya sin datos: el backend contestará `415` o `400`, y eso significa que la ruta **sí** existe.',
        ],
        codigo: [
          'import proyecto',
          '',
          '',
          'def rutas_rotas(archivos):',
          '    rotas = []',
          '    return rotas',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(proyecto.llamadas_fetch(archivos))',
          'cambiado = proyecto.editar(archivos, "backend/app.py", \'@app.post("/api/pedidos")\', \'@app.post("/api/pedido")\')',
          'print(rutas_rotas(cambiado))',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'En el proyecto original no hay rutas rotas',
            condicion: 'rutas_rotas(__import__("proyecto").abrir()) == []',
          },
          {
            descripcion: 'Encuentra la ruta que la IA le cambió al backend (404)',
            condicion:
              'rutas_rotas(__import__("proyecto").editar(__import__("proyecto").abrir(), "backend/app.py", \'@app.post("/api/pedidos")\', \'@app.post("/api/pedido")\')) == [("POST", "/api/pedidos", 404)]',
          },
          {
            descripcion: 'También si el error está en el frontend',
            condicion:
              'rutas_rotas(__import__("proyecto").editar(__import__("proyecto").abrir(), "frontend/src/api.js", \'API + "/api/menu"\', \'API + "/api/carta"\')) == [("GET", "/api/carta", 404)]',
          },
          {
            descripcion: 'Un método equivocado da 405',
            condicion:
              'rutas_rotas(__import__("proyecto").editar(__import__("proyecto").abrir(), "frontend/src/api.js", \'method: "POST"\', \'method: "PUT"\')) == [("PUT", "/api/pedidos", 405)]',
          },
        ],
        pistas: [
          'Arranca el backend una sola vez: `cliente = proyecto.servidor(archivos)`, y recorre `for metodo, ruta in proyecto.llamadas_fetch(archivos):`.',
          'Por cada una: `codigo = cliente.open(ruta, method=metodo).status_code`.',
          '`if codigo in (404, 405): rotas.append((metodo, ruta, codigo))`.',
        ],
        solucion: [
          'import proyecto',
          '',
          '',
          'def rutas_rotas(archivos):',
          '    cliente = proyecto.servidor(archivos)',
          '    rotas = []',
          '    for metodo, ruta in proyecto.llamadas_fetch(archivos):',
          '        codigo = cliente.open(ruta, method=metodo).status_code',
          '        if codigo in (404, 405):',
          '            rotas.append((metodo, ruta, codigo))',
          '    return rotas',
          '',
          '',
          'archivos = proyecto.abrir()',
          'print(proyecto.llamadas_fetch(archivos))',
          'cambiado = proyecto.editar(archivos, "backend/app.py", \'@app.post("/api/pedidos")\', \'@app.post("/api/pedido")\')',
          'print(rutas_rotas(cambiado))',
        ].join('\n'),
      },
    ],
  }
);

// api-tienda.js — Un fetch SIMULADO: la API de la tienda de Don Pepe.
//
// ¿Por qué simulado? En la app no hay internet garantizado y las pruebas
// automáticas necesitan respuestas que sean siempre iguales. Este fetch
// responde como un servicio web de verdad (con una pequeña demora), pero
// todo pasa dentro del navegador. Los datos son los mismos de la base de
// SQL (rutas/sql/00-base-tienda.js); pruebas/motor.test.js revisa que
// sigan coincidiendo.
//
// Direcciones (todas en https://api.tienda-donpepe.co):
//
//   GET  /productos                 200: lista de productos
//                                   { id, nombre, categoria, precio, existencias }
//   GET  /productos?categoria=X     200: solo los de esa categoría
//   GET  /productos/<id>            200: un producto; 404 si ese id no existe
//   GET  /clientes                  200: lista de clientes { id, nombre, ciudad }
//   GET  /pedidos                   200: lista de pedidos
//                                   { id, cliente_id, producto_id, cantidad, fecha }
//   POST /pedidos                   201: crea un pedido (no se guarda: cada
//                                   ejecución empieza de cero). El cuerpo es
//                                   JSON con cliente_id, producto_id y cantidad;
//                                   400 si falta algo o no es válido.
//   GET  /ventas                    500: el servidor de ventas está caído
//                                   (para practicar qué hacer cuando falla).
//   Cualquier otra ruta             404. Un método que no aplica: 405
//                                   (salvo /ventas, que responde 500 a cualquier método).
//   Cualquier otro dominio          la promesa se rechaza con
//                                   TypeError: Failed to fetch (como un fetch
//                                   real sin internet).
//
// La respuesta se parece a la de fetch real: ok, status, statusText, url,
// headers.get(), y json() / text(), que devuelven promesas y solo se pueden
// leer una vez. Los errores de la API traen { error: "mensaje" }.
//
// IMPORTANTE: igual que evaluarCodigo, esta función es autosuficiente: el
// ejecutor copia su texto con .toString() para llevarla al Web Worker.
// "programarTarea" es el setTimeout que lleva la cuenta de lo pendiente,
// así el evaluador sabe que todavía hay una respuesta en camino.

function crearFetchSimulado(programarTarea) {
  const SERVIDOR = 'api.tienda-donpepe.co';
  const DEMORA_MS = 20; // lo justo para que de verdad haya que esperar
  const FECHA_DE_HOY = '2026-03-07'; // la que sigue a los pedidos de ejemplo

  const PRODUCTOS = [
    [1, 'Arepa de queso', 'Comidas', 3500, 40],
    [2, 'Empanada', 'Comidas', 2500, 60],
    [3, 'Buñuelo', 'Comidas', 1500, 80],
    [4, 'Tinto', 'Bebidas', 2000, 100],
    [5, 'Jugo de lulo', 'Bebidas', 4500, 25],
    [6, 'Aromática', 'Bebidas', 2500, 30],
    [7, 'Café en grano', 'Mercado', 18000, 12],
    [8, 'Panela', 'Mercado', 4000, 20],
    [9, 'Bocadillo veleño', 'Dulces', 3000, 0],
    [10, 'Oblea', 'Dulces', 3500, 15],
  ].map(([id, nombre, categoria, precio, existencias]) => ({ id, nombre, categoria, precio, existencias }));

  const CLIENTES = [
    [1, 'Laura Gómez', 'Bogotá'],
    [2, 'Mateo Ríos', 'Medellín'],
    [3, 'Isabela Torres', 'Cali'],
    [4, 'Samuel Díaz', 'Bogotá'],
    [5, 'Valentina Cruz', 'Barranquilla'],
    [6, 'Andrés Mora', 'Medellín'],
  ].map(([id, nombre, ciudad]) => ({ id, nombre, ciudad }));

  const PEDIDOS = [
    [1, 1, 1, 2, '2026-03-01'],
    [2, 1, 4, 2, '2026-03-01'],
    [3, 2, 7, 1, '2026-03-02'],
    [4, 3, 2, 6, '2026-03-02'],
    [5, 3, 5, 3, '2026-03-03'],
    [6, 4, 3, 10, '2026-03-04'],
    [7, 5, 10, 4, '2026-03-04'],
    [8, 2, 8, 2, '2026-03-05'],
    [9, 1, 5, 1, '2026-03-06'],
    [10, 4, 4, 3, '2026-03-06'],
  ].map(([id, cliente_id, producto_id, cantidad, fecha]) => ({ id, cliente_id, producto_id, cantidad, fecha }));

  const TEXTOS_DE_ESTADO = {
    200: 'OK', 201: 'Created', 400: 'Bad Request', 404: 'Not Found',
    405: 'Method Not Allowed', 500: 'Internal Server Error',
  };

  const respuesta = (status, datos) => ({ status, datos });
  const noExiste = (ruta) => respuesta(404, { error: 'No existe la dirección ' + ruta });

  // Valida el cuerpo de un pedido nuevo. Devuelve el mensaje de error o null.
  function problemaDelPedido(pedido) {
    if (!pedido || typeof pedido !== 'object') return 'El cuerpo debe ser un objeto JSON';
    if (!CLIENTES.some((c) => c.id === pedido.cliente_id)) return 'No existe el cliente ' + pedido.cliente_id;
    if (!PRODUCTOS.some((p) => p.id === pedido.producto_id)) return 'No existe el producto ' + pedido.producto_id;
    if (!Number.isInteger(pedido.cantidad) || pedido.cantidad <= 0) {
      return 'La cantidad debe ser un entero positivo';
    }
    return null;
  }

  function crearPedido(cuerpo) {
    let pedido;
    try {
      pedido = JSON.parse(cuerpo);
    } catch (error) {
      return respuesta(400, { error: 'El cuerpo no es JSON válido. ¿Olvidaste JSON.stringify?' });
    }
    const problema = problemaDelPedido(pedido);
    if (problema) return respuesta(400, { error: problema });
    return respuesta(201, {
      id: PEDIDOS.length + 1,
      cliente_id: pedido.cliente_id,
      producto_id: pedido.producto_id,
      cantidad: pedido.cantidad,
      fecha: FECHA_DE_HOY,
    });
  }

  // El "servidor": decide qué contestar según el método y la ruta.
  function atender(metodo, direccion, cuerpo) {
    const ruta = direccion.pathname.replace(/\/+$/, '') || '/';
    const soloGet = (contestar) => (metodo === 'GET' ? contestar() : respuesta(405, { error: 'Método no permitido' }));

    if (ruta === '/productos') {
      const categoria = direccion.searchParams.get('categoria');
      return soloGet(() =>
        respuesta(200, categoria === null ? PRODUCTOS : PRODUCTOS.filter((p) => p.categoria === categoria))
      );
    }
    const conId = ruta.match(/^\/productos\/([^/]+)$/);
    if (conId) {
      const producto = PRODUCTOS.find((p) => String(p.id) === conId[1]);
      return soloGet(() =>
        producto ? respuesta(200, producto) : respuesta(404, { error: 'No existe el producto ' + conId[1] })
      );
    }
    if (ruta === '/clientes') return soloGet(() => respuesta(200, CLIENTES));
    if (ruta === '/pedidos') {
      if (metodo === 'POST') return crearPedido(cuerpo);
      return soloGet(() => respuesta(200, PEDIDOS));
    }
    if (ruta === '/ventas') {
      return respuesta(500, { error: 'El servidor de ventas está caído. Intenta más tarde.' });
    }
    return noExiste(ruta);
  }

  // Arma un objeto parecido a Response. El cuerpo se guarda como texto en
  // este momento: así, si el estudiante cambia los datos que recibió, la
  // siguiente respuesta no se ve afectada (como en un servidor real).
  function crearRespuesta(url, { status, datos }) {
    const texto = JSON.stringify(datos);
    let usado = false;
    const leer = () => {
      if (usado) return Promise.reject(new TypeError('Body has already been consumed.'));
      usado = true;
      return Promise.resolve(texto);
    };
    return Object.freeze({
      ok: status >= 200 && status < 300,
      status,
      statusText: TEXTOS_DE_ESTADO[status] || '',
      url,
      headers: Object.freeze({
        get: (nombre) =>
          String(nombre).toLowerCase() === 'content-type' ? 'application/json; charset=utf-8' : null,
      }),
      get bodyUsed() {
        return usado;
      },
      text: leer,
      json: () => leer().then((contenido) => JSON.parse(contenido)),
    });
  }

  return function fetch(recurso, opciones = {}) {
    return new Promise((resolver, rechazar) => {
      let direccion;
      try {
        direccion = new URL(String(recurso));
      } catch (error) {
        // Mismo mensaje que da fetch con una dirección incompleta como "/productos".
        rechazar(new TypeError('Failed to parse URL from ' + String(recurso)));
        return;
      }
      const metodo = String((opciones && opciones.method) || 'GET').toUpperCase();
      const cuerpo = opciones && opciones.body !== undefined ? String(opciones.body) : '';
      // fetch real no deja mandar datos en un GET (ni en un HEAD).
      const traeCuerpo = opciones && opciones.body !== undefined && opciones.body !== null;
      if (traeCuerpo && (metodo === 'GET' || metodo === 'HEAD')) {
        rechazar(new TypeError('Request with GET/HEAD method cannot have body.'));
        return;
      }
      const esLaTienda = direccion.hostname === SERVIDOR && /^https?:$/.test(direccion.protocol);

      // La demora se programa siempre, también para fallar: un fetch real
      // sin internet tampoco responde al instante.
      programarTarea(() => {
        if (!esLaTienda) {
          rechazar(new TypeError('Failed to fetch'));
          return;
        }
        resolver(crearRespuesta(direccion.href, atender(metodo, direccion, cuerpo)));
      }, DEMORA_MS);
    });
  };
}

globalThis.crearFetchSimulado = crearFetchSimulado;

// El módulo "proyecto": un proyecto web como los que arma una IA (frontend en
// React y backend en Flask), para la ruta "Entender proyectos hechos con IA".
// El estudiante lo usa con "import proyecto", igual que "ia" y "agente".
//
// ¿Qué trae?
// - El proyecto "Domicilios Don Pepe" como un diccionario {ruta: contenido}
//   (igual que el agente simulado), más dos versiones con problemas: la que
//   cambió una IA ("cambio-ia") y la que hay que arreglar en el repaso.
// - Herramientas para recorrerlo: arbol, buscar, diff y editar (esta última
//   funciona como la herramienta Edit de Claude Code).
// - Un backend que SÍ corre: servidor() ejecuta backend/app.py con un Flask
//   simulado y correr_pruebas() ejecuta backend/tests, como haría pytest.
//
// ¿Por qué un Flask simulado? Pyodide no trae Flask, y una app de verdad
// abriría un puerto de red. El simulado responde con la misma forma que el
// cliente de pruebas de Flask (status_code, get_json()), así que el código
// del proyecto se lee igual que uno real. Y respeta requirements.txt: si una
// librería no está en la lista, importarla falla, como en un servidor nuevo.
//
// Todo pasa en memoria: no se toca ningún archivo de verdad.

globalThis.MODULOS_PYTHON = {
  ...(globalThis.MODULOS_PYTHON || {}),
  proyecto: String.raw`
"""proyecto: un proyecto web hecho por una IA, para leerlo, correrlo y cambiarlo."""

import ast
import copy
import difflib
import importlib
import importlib.abc
import importlib.util
import json as _json
import os
import re
import sys
import traceback
from contextlib import contextmanager


class ErrorDelProyecto(Exception):
    """El proyecto no arranca o no tiene lo que se necesita."""


# ---------- El proyecto: Domicilios Don Pepe ----------

_BASE = {
"README.md": r'''# Domicilios Don Pepe

App para pedir domicilios a la tienda de Don Pepe: el cliente ve el menú,
arma su pedido y lo envía a su casa.

## Cómo está armado

- frontend/: la página que ve el cliente (React + Vite).
- backend/: la API que recibe los pedidos y calcula el total (Flask).

## Cómo arrancarlo

Backend (en una terminal):

    cd backend
    pip install -r requirements.txt
    flask --app app run

Frontend (en otra terminal):

    cd frontend
    npm install
    npm run dev

## Pruebas

    cd backend
    pytest
''',
"CLAUDE.md": r'''# Domicilios Don Pepe

- Backend en Flask (backend/), frontend en React con Vite (frontend/).
- Pruebas: cd backend && pytest. Deben pasar antes de dar algo por terminado.
- Los precios van en pesos colombianos, enteros (sin decimales).
- Toda regla de cobro vive en backend/precios.py y tiene su prueba.
- Nunca escribas claves en el código: van en backend/.env (ver .env.example).
''',
".gitignore": r'''# Lo que NO se sube a GitHub
node_modules/
dist/
.env
__pycache__/
.venv/
''',
"frontend/package.json": r'''{
  "name": "domicilios-don-pepe",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    "vitest": "^2.0.5"
  }
}
''',
"frontend/package-lock.json": r'''{
  "name": "domicilios-don-pepe",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "domicilios-don-pepe",
      "version": "1.0.0",
      "dependencies": {
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
      },
      "devDependencies": {
        "@vitejs/plugin-react": "^4.3.1",
        "vite": "^5.4.2",
        "vitest": "^2.0.5"
      }
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.3.1.tgz",
      "dev": true
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz"
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz"
    },
    "node_modules/react-dom": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz"
    },
    "node_modules/scheduler": {
      "version": "0.23.2",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz"
    },
    "node_modules/vite": {
      "version": "5.4.8",
      "resolved": "https://registry.npmjs.org/vite/-/vite-5.4.8.tgz",
      "dev": true
    },
    "node_modules/vitest": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/vitest/-/vitest-2.1.1.tgz",
      "dev": true
    }
  }
}
''',
"frontend/.env.example": r'''# Dirección del backend. En tu computador es localhost;
# al publicar la página, pon aquí la dirección real de la API.
VITE_API_URL=http://localhost:5000
''',
"frontend/vite.config.js": r'''import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite sirve la página mientras programas (npm run dev) y la empaqueta
// en la carpeta dist/ para publicarla (npm run build).
export default defineConfig({
  plugins: [react()],
});
''',
"frontend/index.html": r'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/logo.svg" />
    <title>Domicilios Don Pepe</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
''',
"frontend/public/logo.svg": r'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#f59e0b"/></svg>
''',
"frontend/src/App.jsx": r'''import { useEffect, useState } from "react";
import { cargarMenu, enviarPedido } from "./api.js";
import Carrito from "./components/Carrito.jsx";
import Menu from "./components/Menu.jsx";

export default function App() {
  // Estado: datos que, cuando cambian, hacen que React vuelva a pintar.
  const [menu, setMenu] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarMenu().then(setMenu).catch(() => setMensaje("No se pudo cargar el menú"));
  }, []);

  function agregar(id) {
    setCarrito({ ...carrito, [id]: (carrito[id] || 0) + 1 });
  }

  async function pedir() {
    const items = Object.entries(carrito).map(([id, cantidad]) => ({ id: Number(id), cantidad }));
    try {
      const guardado = await enviarPedido({ direccion, items });
      setMensaje("Pedido #" + guardado.numero + " confirmado. Total: $" + guardado.total);
      setCarrito({});
    } catch (error) {
      setMensaje(error.message);
    }
  }

  return (
    <main>
      <h1>Domicilios Don Pepe</h1>
      <Menu productos={menu} onAgregar={agregar} />
      <Carrito
        carrito={carrito}
        productos={menu}
        direccion={direccion}
        onDireccion={setDireccion}
        onPedir={pedir}
      />
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </main>
  );
}
''',
"frontend/src/api.js": r'''// Todas las llamadas al backend pasan por aquí.
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function cargarMenu() {
  const respuesta = await fetch(API + "/api/menu");
  if (!respuesta.ok) throw new Error("No se pudo cargar el menú");
  return respuesta.json();
}

export async function enviarPedido(pedido) {
  const respuesta = await fetch(API + "/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  });
  if (!respuesta.ok) throw new Error("No se pudo enviar el pedido");
  return respuesta.json();
}
''',
"frontend/src/components/Carrito.jsx": r'''// Un componente: recibe datos (props) y devuelve lo que se ve.
export default function Carrito({ carrito, productos, direccion, onDireccion, onPedir }) {
  const elegidos = productos.filter((producto) => carrito[producto.id]);
  return (
    <section>
      <h2>Tu pedido</h2>
      {elegidos.map((producto) => (
        <p key={producto.id}>
          {carrito[producto.id]} x {producto.nombre}
        </p>
      ))}
      <input
        value={direccion}
        onChange={(evento) => onDireccion(evento.target.value)}
        placeholder="Dirección"
      />
      <button onClick={onPedir} disabled={elegidos.length === 0}>
        Pedir domicilio
      </button>
    </section>
  );
}
''',
"frontend/src/components/Menu.jsx": r'''export default function Menu({ productos, onAgregar }) {
  return (
    <section>
      <h2>Menú</h2>
      {productos.map((producto) => (
        <article key={producto.id} className="producto">
          <h3>{producto.nombre}</h3>
          <p>{"$" + producto.precio}</p>
          <button onClick={() => onAgregar(producto.id)}>Agregar</button>
        </article>
      ))}
    </section>
  );
}
''',
"frontend/src/estilos.css": r'''body { font-family: system-ui, sans-serif; margin: 0 auto; max-width: 720px; }
.producto { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
.mensaje { background: #fef3c7; padding: 12px; }
''',
"frontend/src/main.jsx": r'''import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./estilos.css";

// Punto de entrada del frontend: React toma el <div id="root"> de
// index.html y pinta ahí el componente App.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
''',
"backend/requirements.txt": r'''flask==3.0.3
flask-cors==4.0.1
python-dotenv==1.0.1
pytest==8.3.2
''',
"backend/.env.example": r'''# Copia este archivo como .env y pon tus valores reales.
# El .env NO se sube a GitHub (está en .gitignore).
CLAVE_PAGOS=
''',
"backend/pytest.ini": r'''[pytest]
# Para que las pruebas puedan hacer "from app import app".
pythonpath = .
testpaths = tests
''',
"backend/app.py": r'''# Punto de entrada del backend: crea la app de Flask y define sus rutas.
# Se arranca con: flask --app app run
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from datos import MENU, buscar_pedido, guardar_pedido
from precios import total
from validacion import errores_del_pedido

# Lee el archivo .env (si existe) y pasa sus valores a os.environ.
load_dotenv()

app = Flask(__name__)
# La página corre en otro puerto (5173) y el navegador bloquea las llamadas
# entre orígenes distintos. CORS le avisa al navegador que esta API lo permite.
CORS(app)

# La clave de la pasarela de pagos sale del entorno, nunca del código.
CLAVE_PAGOS = os.environ.get("CLAVE_PAGOS", "")


@app.get("/api/estado")
def estado():
    return jsonify({"ok": True, "pagos_configurados": CLAVE_PAGOS != ""})


@app.get("/api/menu")
def ver_menu():
    return jsonify(MENU)


@app.post("/api/pedidos")
def crear_pedido():
    pedido = request.get_json()
    errores = errores_del_pedido(pedido, MENU)
    if errores:
        return jsonify({"errores": errores}), 400
    guardado = guardar_pedido({**pedido, "total": total(pedido["items"], MENU)})
    return jsonify(guardado), 201


@app.get("/api/pedidos/<int:numero>")
def ver_pedido(numero):
    pedido = buscar_pedido(numero)
    if pedido is None:
        return jsonify({"error": "Ese pedido no existe"}), 404
    return jsonify(pedido)
''',
"backend/datos.py": r'''# La "base de datos" del proyecto. Para que el ejemplo sea corto vive en
# memoria; en un proyecto real sería SQLite o PostgreSQL.
MENU = [
    {"id": 1, "nombre": "Arepa de queso", "precio": 3500},
    {"id": 2, "nombre": "Empanada", "precio": 2500},
    {"id": 3, "nombre": "Tinto", "precio": 2000},
    {"id": 4, "nombre": "Jugo de lulo", "precio": 4500},
]

PEDIDOS = []


def guardar_pedido(pedido):
    guardado = {**pedido, "numero": len(PEDIDOS) + 1}
    PEDIDOS.append(guardado)
    return guardado


def buscar_pedido(numero):
    for pedido in PEDIDOS:
        if pedido["numero"] == numero:
            return pedido
    return None
''',
"backend/precios.py": r'''# Las reglas de cobro de Don Pepe. Todo en pesos, sin decimales.
COSTO_DOMICILIO = 4000
DOMICILIO_GRATIS_DESDE = 50000


def subtotal(items, menu):
    precios = {producto["id"]: producto["precio"] for producto in menu}
    return sum(precios[item["id"]] * item["cantidad"] for item in items)


def costo_domicilio(valor):
    if valor >= DOMICILIO_GRATIS_DESDE:
        return 0
    return COSTO_DOMICILIO


def total(items, menu):
    valor = subtotal(items, menu)
    return valor + costo_domicilio(valor)
''',
"backend/validacion.py": r'''# Revisa un pedido ANTES de guardarlo. Nunca confíes en lo que llega del
# navegador: cualquiera puede mandarle datos a la API sin usar la página.


def errores_del_pedido(pedido, menu):
    if not isinstance(pedido, dict):
        return ["El pedido debe ser un objeto JSON"]
    errores = []
    if not str(pedido.get("direccion", "")).strip():
        errores.append("Falta la dirección")
    items = pedido.get("items")
    if not isinstance(items, list) or len(items) == 0:
        errores.append("El pedido no tiene productos")
        return errores
    ids = {producto["id"] for producto in menu}
    for item in items:
        if not isinstance(item, dict) or isinstance(item.get("id"), bool) or item.get("id") not in ids:
            errores.append("Hay un producto que no existe")
        # En Python True es un int (True == 1), así que {"cantidad": true}
        # pasaría como 1. Por eso se descartan los bool a propósito.
        elif not isinstance(item.get("cantidad"), int) or isinstance(item["cantidad"], bool) or item["cantidad"] < 1:
            errores.append("Cada cantidad debe ser un número entero mayor que 0")
    return errores
''',
"backend/tests/test_api.py": r'''from app import app

cliente = app.test_client()

PEDIDO = {"direccion": "Calle 10 # 5-20", "items": [{"id": 1, "cantidad": 2}]}


def test_el_menu_trae_productos():
    respuesta = cliente.get("/api/menu")
    assert respuesta.status_code == 200
    assert len(respuesta.get_json()) > 0


def test_crear_pedido_calcula_el_total():
    respuesta = cliente.post("/api/pedidos", json=PEDIDO)
    assert respuesta.status_code == 201
    assert respuesta.get_json()["total"] == 11000


def test_pedido_sin_direccion_se_rechaza():
    respuesta = cliente.post("/api/pedidos", json={**PEDIDO, "direccion": ""})
    assert respuesta.status_code == 400


def test_producto_que_no_existe_se_rechaza():
    pedido = {"direccion": "Calle 1", "items": [{"id": 99, "cantidad": 1}]}
    respuesta = cliente.post("/api/pedidos", json=pedido)
    assert respuesta.status_code == 400
''',
"backend/tests/test_precios.py": r'''from precios import costo_domicilio, subtotal, total

MENU = [{"id": 1, "nombre": "Arepa", "precio": 3500}, {"id": 2, "nombre": "Tinto", "precio": 2000}]


def test_subtotal_suma_cada_producto():
    assert subtotal([{"id": 1, "cantidad": 2}, {"id": 2, "cantidad": 1}], MENU) == 9000


def test_domicilio_se_cobra_en_pedidos_pequenos():
    assert costo_domicilio(49999) == 4000


def test_domicilio_gratis_desde_50000():
    assert costo_domicilio(50000) == 0


def test_total_incluye_el_domicilio():
    assert total([{"id": 2, "cantidad": 1}], MENU) == 6000
''',
}


# ---------- Herramientas para recorrer y cambiar el proyecto ----------

def _validar(archivos):
    if not isinstance(archivos, dict):
        raise TypeError("El proyecto debe ser un diccionario {ruta: contenido}. Ábrelo con proyecto.abrir()")


def editar(archivos, ruta, viejo, nuevo):
    """Cambia un pedazo de texto de un archivo y devuelve un proyecto NUEVO.

    Funciona como la herramienta Edit de Claude Code: el texto viejo debe
    aparecer exactamente una vez; si no, no se adivina y se avisa.
    """
    _validar(archivos)
    if ruta not in archivos:
        raise ValueError("No existe el archivo " + str(ruta) + ". Mira los archivos con proyecto.arbol(archivos)")
    veces = archivos[ruta].count(viejo)
    if veces == 0:
        raise ValueError(
            "No encontré ese texto en " + ruta + ". Cópialo tal cual, con sus espacios y comillas."
        )
    if veces > 1:
        raise ValueError(
            "Ese texto aparece " + str(veces) + " veces en " + ruta
            + ". Incluye más texto alrededor para que sea uno solo."
        )
    return {**archivos, ruta: archivos[ruta].replace(viejo, nuevo, 1)}


def _sin_archivo(archivos, ruta):
    return {nombre: contenido for nombre, contenido in archivos.items() if nombre != ruta}


def _version_cambio_ia(base):
    # Le pidieron a una IA: "agrega el teléfono del cliente al pedido". La IA
    # CAMBIÓ la validación de la dirección por la del teléfono y, como la
    # prueba de la dirección empezó a fallar, también la cambió. Las pruebas
    # pasan... pero ahora se aceptan pedidos sin dirección.
    paso1 = editar(
        base, "backend/validacion.py",
        '    if not str(pedido.get("direccion", "")).strip():\n'
        '        errores.append("Falta la dirección")\n',
        '    if not str(pedido.get("telefono", "")).strip():\n'
        '        errores.append("Falta el teléfono")\n',
    )
    paso2 = editar(
        paso1, "backend/tests/test_api.py",
        'PEDIDO = {"direccion": "Calle 10 # 5-20", "items": [{"id": 1, "cantidad": 2}]}',
        'PEDIDO = {\n'
        '    "direccion": "Calle 10 # 5-20",\n'
        '    "telefono": "3001234567",\n'
        '    "items": [{"id": 1, "cantidad": 2}],\n'
        '}',
    )
    return editar(
        paso2, "backend/tests/test_api.py",
        'def test_pedido_sin_direccion_se_rechaza():\n'
        '    respuesta = cliente.post("/api/pedidos", json={**PEDIDO, "direccion": ""})\n',
        'def test_pedido_sin_telefono_se_rechaza():\n'
        '    respuesta = cliente.post("/api/pedidos", json={**PEDIDO, "telefono": ""})\n',
    )


def _version_repaso(base):
    # Tres problemas típicos de un proyecto entregado a la carrera: falta una
    # librería en requirements.txt, una clave quedó escrita en el código y
    # una ruta del backend cambió de nombre sin avisarle al frontend.
    # Además, una nota inofensiva en el README marca esta versión: así el
    # reto puede exigir que el resto del proyecto quede igual al entregado,
    # y no se vale "arreglarlo" abriendo el original ni tocando las pruebas.
    paso0 = editar(
        base, "README.md", "## Pruebas\n",
        "## Pendientes\n\n- Revisar antes de publicar: se hizo a la carrera.\n\n## Pruebas\n",
    )
    paso1 = editar(paso0, "backend/requirements.txt", "flask-cors==4.0.1\n", "")
    paso2 = editar(
        paso1, "backend/app.py",
        '# La clave de la pasarela de pagos sale del entorno, nunca del código.\n'
        'CLAVE_PAGOS = os.environ.get("CLAVE_PAGOS", "")\n',
        '# Clave de la pasarela de pagos\n'
        'CLAVE_PAGOS = "sk_live_EJEMPLO_no_es_real_9f8e7d"\n',
    )
    return editar(paso2, "backend/app.py", '@app.post("/api/pedidos")', '@app.post("/api/pedido")')


_VERSIONES = {
    "domicilios": _BASE,
    "cambio-ia": _version_cambio_ia(_BASE),
    "repaso": _version_repaso(_BASE),
}


def abrir(version="domicilios"):
    """Devuelve una copia del proyecto: un diccionario {ruta: contenido}."""
    if version not in _VERSIONES:
        raise ValueError('No hay una versión "' + str(version) + '". Hay: ' + ", ".join(_VERSIONES))
    # Una copia: cambiarla no daña el original.
    return dict(_VERSIONES[version])


def arbol(archivos, nombre="domicilios-don-pepe"):
    """Dibuja las carpetas y archivos como el comando tree."""
    _validar(archivos)
    raiz = {}
    for ruta in archivos:
        nodo = raiz
        partes = ruta.split("/")
        for carpeta in partes[:-1]:
            nodo = nodo.setdefault(carpeta + "/", {})
        nodo[partes[-1]] = None
    lineas = [nombre + "/"]

    def dibujar(nodo, prefijo):
        nombres = sorted(nodo)
        for posicion, hijo in enumerate(nombres):
            ultimo = posicion == len(nombres) - 1
            lineas.append(prefijo + ("└── " if ultimo else "├── ") + hijo)
            if nodo[hijo] is not None:
                dibujar(nodo[hijo], prefijo + ("    " if ultimo else "│   "))

    dibujar(raiz, "")
    return "\n".join(lineas)


def buscar(archivos, texto):
    """Busca un texto en todos los archivos, como Grep: devuelve "ruta:línea: contenido"."""
    _validar(archivos)
    return [
        ruta + ":" + str(numero) + ": " + linea.strip()
        for ruta in sorted(archivos)
        for numero, linea in enumerate(archivos[ruta].split("\n"), start=1)
        if texto in linea
    ]


def diff(antes, despues):
    """Muestra qué cambió entre dos versiones del proyecto, como git diff."""
    _validar(antes)
    _validar(despues)
    bloques = []
    for ruta in sorted(set(antes) | set(despues)):
        viejo, nuevo = antes.get(ruta), despues.get(ruta)
        if viejo == nuevo:
            continue
        cambios = difflib.unified_diff(
            (viejo or "").splitlines(),
            (nuevo or "").splitlines(),
            fromfile="a/" + ruta if viejo is not None else "/dev/null",
            tofile="b/" + ruta if nuevo is not None else "/dev/null",
            lineterm="",
            n=2,
        )
        bloques.append("diff --git a/" + ruta + " b/" + ruta + "\n" + "\n".join(cambios))
    return "\n".join(bloques)


def llamadas_fetch(archivos):
    """Las llamadas del frontend al backend: lista de (método, ruta).

    Lee cada fetch(...) de frontend/src y toma la primera ruta que empieza
    con "/" y el method: que aparezca antes del siguiente fetch (GET si no hay).
    """
    _validar(archivos)
    llamadas = []
    for ruta in sorted(archivos):
        if not ruta.startswith("frontend/src/"):
            continue
        trozos = archivos[ruta].split("fetch(")[1:]
        for trozo in trozos:
            direccion = re.search(r'"(/[^"]*)"', trozo.split("\n")[0])
            if direccion is None:
                continue
            metodo = re.search(r'method:\s*"(\w+)"', trozo)
            llamadas.append((metodo.group(1).upper() if metodo else "GET", direccion.group(1)))
    return llamadas


# ---------- Un Flask simulado ----------

_TEXTOS_DE_ESTADO = {
    400: "Bad Request",
    404: "Not Found",
    405: "Method Not Allowed",
    415: "Unsupported Media Type",
    500: "Internal Server Error",
}


class Respuesta:
    """Lo que contesta el servidor, con la misma forma que en Flask."""

    def __init__(self, status_code, text="", es_json=False):
        self.status_code = status_code
        self.text = text
        self._es_json = es_json

    def get_json(self):
        # Se lee del texto cada vez: igual que por internet, quien la reciba
        # obtiene datos nuevos y no puede dañar la "base de datos".
        return _json.loads(self.text) if self._es_json else None

    @property
    def json(self):
        return self.get_json()

    def __repr__(self):
        return "<Respuesta " + str(self.status_code) + ">"


def _respuesta_json(datos, codigo=200):
    return Respuesta(codigo, _json.dumps(datos, ensure_ascii=False), es_json=True)


def _respuesta_de_error(codigo):
    return Respuesta(codigo, _TEXTOS_DE_ESTADO.get(codigo, "Error"))


class _Abortar(Exception):
    def __init__(self, codigo):
        super().__init__(_TEXTOS_DE_ESTADO.get(codigo, "Error"))
        self.codigo = codigo


def _patron_de(ruta):
    # "/api/pedidos/<int:numero>" se vuelve una expresión regular con un
    # grupo por variable; los <int:...> solo aceptan dígitos.
    partes = []
    for trozo in re.split(r"(<[^>]+>)", ruta):
        variable = re.fullmatch(r"<(?:(int|string):)?(\w+)>", trozo)
        if variable:
            tipo, nombre = variable.groups()
            partes.append("(?P<" + nombre + ">" + (r"\d+" if tipo == "int" else "[^/]+") + ")")
        else:
            partes.append(re.escape(trozo))
    return re.compile("".join(partes))


def _a_respuesta(devuelto):
    # Flask acepta varias formas de contestar: una respuesta, una pareja
    # (respuesta, código), un trío (respuesta, código, cabeceras), un
    # diccionario o lista (los vuelve JSON) o texto. Las cabeceras se
    # ignoran: el cliente simulado no las usa.
    if isinstance(devuelto, tuple) and len(devuelto) in (2, 3):
        base = _a_respuesta(devuelto[0])
        return Respuesta(devuelto[1], base.text, base._es_json)
    if devuelto is None:
        # Como Flask: olvidar el return no es una respuesta vacía, es un error
        # (TypeError) que termina en 500.
        raise TypeError("la ruta no devolvió nada (None). ¿Le falta un return?")
    if isinstance(devuelto, Respuesta):
        return devuelto
    if isinstance(devuelto, (dict, list)):
        return _respuesta_json(devuelto)
    return Respuesta(200, str(devuelto))


def _crear_flask(archivos):
    # Recibe los archivos del proyecto para poder decir, cuando una ruta
    # falla, en qué archivo y línea pasó (como el Flask real en la consola).
    def crear(espacio):
        _llenar_flask(espacio, archivos)

    return crear


def _llenar_flask(espacio, archivos):
    peticion = {"metodo": None, "ruta": None, "json": None, "hay_json": False, "args": {}}

    class _Request:
        """El "request" de Flask: la petición que se está atendiendo."""

        method = property(lambda self: peticion["metodo"])
        path = property(lambda self: peticion["ruta"])
        args = property(lambda self: dict(peticion["args"]))

        def get_json(self, silent=False):
            if not peticion["hay_json"]:
                if silent:
                    return None
                raise _Abortar(415)
            return copy.deepcopy(peticion["json"])

        # request.json es lo mismo que request.get_json(): ambas formas
        # aparecen en el código que escribe una IA.
        json = property(lambda self: self.get_json())

    def jsonify(*datos, **claves):
        if len(datos) == 1:
            return _respuesta_json(datos[0])
        return _respuesta_json(list(datos) if datos else claves)

    def abort(codigo):
        raise _Abortar(codigo)

    class _Cliente:
        """El cliente de pruebas: hace peticiones sin abrir la red."""

        def __init__(self, app):
            self._app = app

        def open(self, ruta, method="GET", json=None):
            # El cuerpo viaja como texto JSON, igual que por internet.
            cuerpo = None if json is None else _json.loads(_json.dumps(json))
            return self._app._atender(str(method).upper(), ruta, cuerpo, json is not None)

        def get(self, ruta, **opciones):
            return self.open(ruta, "GET", **opciones)

        def post(self, ruta, **opciones):
            return self.open(ruta, "POST", **opciones)

        def put(self, ruta, **opciones):
            return self.open(ruta, "PUT", **opciones)

        def delete(self, ruta, **opciones):
            return self.open(ruta, "DELETE", **opciones)

    class Flask:
        def __init__(self, nombre):
            self.import_name = nombre
            self.rutas = []

        def route(self, ruta, methods=("GET",)):
            patron = _patron_de(ruta)

            def registrar(funcion):
                self.rutas = self.rutas + [(ruta, patron, tuple(m.upper() for m in methods), funcion)]
                return funcion

            return registrar

        def get(self, ruta):
            return self.route(ruta, ["GET"])

        def post(self, ruta):
            return self.route(ruta, ["POST"])

        def put(self, ruta):
            return self.route(ruta, ["PUT"])

        def delete(self, ruta):
            return self.route(ruta, ["DELETE"])

        def test_client(self):
            return _Cliente(self)

        def _atender(self, metodo, direccion, cuerpo, hay_json):
            ruta, _, consulta = direccion.partition("?")
            candidatas = [(r, r[1].fullmatch(ruta)) for r in self.rutas]
            candidatas = [(r, encontrada) for r, encontrada in candidatas if encontrada]
            if not candidatas:
                return _respuesta_de_error(404)
            elegida = next((c for c in candidatas if metodo in c[0][2]), None)
            if elegida is None:
                return _respuesta_de_error(405)
            (texto, _, _, funcion), encontrada = elegida
            argumentos = {
                nombre: int(valor) if ("<int:" + nombre + ">") in texto else valor
                for nombre, valor in encontrada.groupdict().items()
            }
            args = dict(par.split("=", 1) for par in consulta.split("&") if "=" in par)
            peticion.update(metodo=metodo, ruta=ruta, json=cuerpo, hay_json=hay_json, args=args)
            try:
                return _a_respuesta(funcion(**argumentos))
            except _Abortar as aborto:
                return _respuesta_de_error(aborto.codigo)
            except Exception as error:
                # Un error dentro de la ruta no tumba el servidor: contesta 500.
                # Pero, como el Flask real, deja el error en la consola: el 500
                # solo no dice qué pasó ni dónde.
                print("Error en " + metodo + " " + ruta + ": " + _describir(error, archivos))
                return _respuesta_de_error(500)

    espacio.update(Flask=Flask, jsonify=jsonify, request=_Request(), abort=abort, Response=Respuesta)


def _crear_flask_cors(espacio):
    espacio["CORS"] = lambda app, **opciones: app


def _leer_env(texto):
    valores = {}
    for linea in texto.split("\n"):
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        nombre, valor = linea.split("=", 1)
        valores[nombre.strip()] = valor.strip().strip('"').strip("'")
    return valores


def _crear_dotenv(archivos):
    def crear(espacio):
        def load_dotenv(dotenv_path=None, override=False):
            # Como el de verdad: no pisa lo que ya está en el entorno.
            texto = archivos.get(dotenv_path or "backend/.env")
            if texto is None:
                return False
            for nombre, valor in _leer_env(texto).items():
                if override or nombre not in os.environ:
                    os.environ[nombre] = valor
            return True

        espacio["load_dotenv"] = load_dotenv

    return crear


# Nombre en pip -> nombre con el que se importa. No siempre coinciden.
_PAQUETES_SIMULADOS = {"flask": "flask", "flask-cors": "flask_cors", "python-dotenv": "dotenv"}


def paquetes_instalados(archivos):
    """Los nombres de requirements.txt, como si se hubiera hecho pip install."""
    texto = archivos.get("backend/requirements.txt", "")
    nombres = []
    for linea in texto.split("\n"):
        nombre = re.match(r"\s*([A-Za-z0-9_.\-]+)", linea.split("#")[0])
        if nombre:
            nombres.append(nombre.group(1).lower().replace("_", "-"))
    return nombres


class _Importador(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    """Sirve los módulos del backend y las librerías simuladas instaladas."""

    def __init__(self, fuentes, fabricas):
        self.fuentes = fuentes
        self.fabricas = fabricas

    def find_spec(self, nombre, ruta=None, objetivo=None):
        if nombre in self.fuentes or nombre in self.fabricas:
            return importlib.util.spec_from_loader(nombre, self)
        return None

    def create_module(self, spec):
        return None

    def exec_module(self, modulo):
        nombre = modulo.__name__
        if nombre in self.fabricas:
            self.fabricas[nombre](modulo.__dict__)
            return
        ruta, codigo = self.fuentes[nombre]
        modulo.__file__ = ruta
        exec(compile(codigo, ruta, "exec"), modulo.__dict__)


@contextmanager
def _proyecto_cargado(archivos, entorno):
    _validar(archivos)
    entorno = dict(entorno or {})
    if not all(isinstance(v, str) for v in entorno.values()):
        raise TypeError("Los valores del entorno deben ser textos, como en un archivo .env")
    fuentes = {
        ruta[len("backend/"):-3]: (ruta, contenido)
        for ruta, contenido in archivos.items()
        if ruta.startswith("backend/") and ruta.count("/") == 1 and ruta.endswith(".py")
    }
    instalados = paquetes_instalados(archivos)
    simuladas = {
        "flask": _crear_flask(archivos),
        "flask_cors": _crear_flask_cors,
        "dotenv": _crear_dotenv(archivos),
    }
    # Solo se pueden importar las librerías que están en requirements.txt.
    fabricas = {
        importado: simuladas[importado]
        for pip, importado in _PAQUETES_SIMULADOS.items()
        if pip in instalados
    }
    nombres = set(fuentes) | set(_PAQUETES_SIMULADOS.values())
    anteriores = {nombre: sys.modules.pop(nombre) for nombre in list(nombres) if nombre in sys.modules}
    entorno_antes = dict(os.environ)
    importador = _Importador(fuentes, fabricas)
    os.environ.update(entorno)
    sys.meta_path.insert(0, importador)
    try:
        yield
    finally:
        # No queda rastro: ni módulos del proyecto ni variables de entorno.
        sys.meta_path.remove(importador)
        for nombre in nombres:
            sys.modules.pop(nombre, None)
        sys.modules.update(anteriores)
        os.environ.clear()
        os.environ.update(entorno_antes)


def _donde(error, archivos):
    if isinstance(error, SyntaxError) and error.filename in archivos:
        return " (" + error.filename + ", línea " + str(error.lineno) + ")"
    marcos = [m for m in traceback.extract_tb(error.__traceback__) if m.filename in archivos]
    if not marcos:
        return ""
    return " (" + marcos[-1].filename + ", línea " + str(marcos[-1].lineno) + ")"


def _describir(error, archivos):
    # De un SyntaxError basta el mensaje: el lugar ya lo agrega _donde.
    mensaje = error.msg if isinstance(error, SyntaxError) else str(error)
    return type(error).__name__ + ": " + mensaje + _donde(error, archivos)


def servidor(archivos, entorno=None):
    """Arranca backend/app.py y devuelve su cliente de pruebas (get, post, open...).

    "entorno" son variables de entorno extra, como las que pone el hosting.
    """
    if "backend/app.py" not in archivos:
        raise ErrorDelProyecto("No existe backend/app.py: es el punto de entrada del backend")
    with _proyecto_cargado(archivos, entorno):
        try:
            modulo = importlib.import_module("app")
        except Exception as error:
            raise ErrorDelProyecto("El backend no arranca. " + _describir(error, archivos)) from None
    app = getattr(modulo, "app", None)
    if not hasattr(app, "test_client"):
        raise ErrorDelProyecto("backend/app.py no crea una app de Flask llamada app")
    return app.test_client()


def _lo_que_dio(error, ruta, linea):
    # Como pytest: en un "assert x == y" que falla, muestra cuánto dio x.
    # Se vuelve a calcular x con las variables que tenía la prueba.
    comparacion = re.match(r"assert (.+?) == (.+)$", linea)
    marco = None
    paso = error.__traceback__
    while paso is not None:
        if paso.tb_frame.f_code.co_filename == ruta:
            marco = paso.tb_frame
        paso = paso.tb_next
    if comparacion is None or marco is None:
        return ""
    # Volver a calcular una llamada (cliente.post(...), guardar(...)) la
    # repetiría con sus efectos: otro pedido guardado, otro número. pytest no
    # repite nada; aquí, si hay una llamada, mejor no mostrar el valor.
    try:
        arbol_expresion = ast.parse(comparacion.group(1), mode="eval")
    except SyntaxError:
        return ""
    if any(isinstance(nodo, ast.Call) for nodo in ast.walk(arbol_expresion)):
        return ""
    try:
        valor = eval(comparacion.group(1), marco.f_globals, marco.f_locals)
    except Exception:
        return ""
    return "  (dio " + repr(valor) + ")"


def _falla(nombre, error, ruta, archivos):
    if isinstance(error, AssertionError) and not str(error):
        marcos = [m for m in traceback.extract_tb(error.__traceback__) if m.filename == ruta]
        if marcos:
            linea = archivos[ruta].split("\n")[marcos[-1].lineno - 1].strip()
            return (
                nombre + " (" + ruta + ", línea " + str(marcos[-1].lineno) + "): "
                + linea + _lo_que_dio(error, ruta, linea)
            )
    return nombre + ": " + _describir(error, archivos)


def correr_pruebas(archivos, entorno=None):
    """Corre backend/tests/test_*.py como pytest: {"pasaron", "total", "fallas"}."""
    rutas = sorted(
        r for r in archivos
        if r.startswith("backend/tests/") and r.split("/")[-1].startswith("test_") and r.endswith(".py")
    )
    pasaron, total, fallas = 0, 0, []
    with _proyecto_cargado(archivos, entorno):
        for ruta in rutas:
            ambito = {"__name__": ruta.split("/")[-1][:-3]}
            try:
                exec(compile(archivos[ruta], ruta, "exec"), ambito)
            except Exception as error:
                fallas = fallas + ["No carga " + ruta + ": " + _describir(error, archivos)]
                continue
            pruebas = [(n, f) for n, f in ambito.items() if n.startswith("test_") and callable(f)]
            for nombre, prueba in pruebas:
                total += 1
                try:
                    prueba()
                    pasaron += 1
                except Exception as error:
                    fallas = fallas + [_falla(nombre, error, ruta, archivos)]
    return {"pasaron": pasaron, "total": total, "fallas": fallas}


def mostrar_pruebas(resultado):
    """Imprime el resultado de correr_pruebas como lo haría pytest, en corto."""
    sin_cargar = len([f for f in resultado["fallas"] if f.startswith("No carga ")])
    aviso = "" if sin_cargar == 0 else " Además, " + str(sin_cargar) + " archivo(s) de pruebas no cargan."
    print("Pasaron " + str(resultado["pasaron"]) + " de " + str(resultado["total"]) + " pruebas." + aviso)
    for falla in resultado["fallas"]:
        print("  FALLÓ " + falla)
`,
};

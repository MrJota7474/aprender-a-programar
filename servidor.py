"""Servidor local de la app "Aprender a programar".

La ruta de Python necesita que la página se abra desde un servidor (con
http://) y no con doble clic (file://), porque así lo exigen los navegadores
para cargar Pyodide. Este archivo es ese servidor: solo usa lo que ya trae
Python, no instala nada y solo atiende a este mismo computador.

Uso normal: doble clic en iniciar.bat.
Uso manual:  python servidor.py [--puerto 8765] [--sin-navegador]
"""

import argparse
import functools
import http.server
import pathlib
import threading
import webbrowser

PUERTO_POR_DEFECTO = 8765
DIRECCION_LOCAL = "127.0.0.1"  # nadie más en la red puede entrar

# Se declara el tipo de cada archivo a mano. En algunos Windows, Python
# adivina mal el de los .js y el navegador se niega a ejecutarlos.
TIPOS = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".wasm": "application/wasm",
    ".zip": "application/zip",
    ".md": "text/plain; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
}


class Manejador(http.server.SimpleHTTPRequestHandler):
    # main() lo llena con las direcciones por las que se puede entrar.
    anfitriones_permitidos = frozenset()

    def do_GET(self):
        # Solo se atiende a quien pidió la página por su dirección local.
        # Evita que otro sitio web engañe al navegador para leer estos archivos.
        if self.headers.get("Host") not in self.anfitriones_permitidos:
            self.send_error(403, "Solo se puede entrar desde este computador")
            return
        super().do_GET()

    def guess_type(self, path):
        extension = pathlib.Path(path).suffix.lower()
        return TIPOS.get(extension, "application/octet-stream")

    def end_headers(self):
        # El navegador pregunta siempre si un archivo cambió: así, al editar
        # una lección, basta recargar la página para verla.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, formato, *argumentos):
        pass  # sin una línea en la ventana por cada archivo pedido


def leer_argumentos():
    lector = argparse.ArgumentParser(description="Servidor local de Aprender a programar")
    lector.add_argument("--puerto", type=int, default=PUERTO_POR_DEFECTO)
    lector.add_argument("--sin-navegador", action="store_true")
    return lector.parse_args()


def main():
    argumentos = leer_argumentos()
    carpeta = pathlib.Path(__file__).resolve().parent
    direccion = f"http://localhost:{argumentos.puerto}/"
    Manejador.anfitriones_permitidos = frozenset(
        {f"localhost:{argumentos.puerto}", f"{DIRECCION_LOCAL}:{argumentos.puerto}"}
    )
    manejador = functools.partial(Manejador, directory=str(carpeta))

    try:
        servidor = http.server.ThreadingHTTPServer((DIRECCION_LOCAL, argumentos.puerto), manejador)
    except OSError:
        # Lo más común: la app ya está abierta en otra ventana.
        print(f"El puerto {argumentos.puerto} ya está en uso. Quizá la app ya está abierta.")
        print(f"Abre {direccion} en tu navegador.")
        if not argumentos.sin_navegador:
            webbrowser.open(direccion)
        return

    print("Aprender a programar está funcionando.")
    print(f"Si el navegador no se abre solo, entra a: {direccion}")
    print("Para apagarlo, cierra esta ventana.")

    if not argumentos.sin_navegador:
        # Se espera medio segundo para que el servidor ya esté atendiendo.
        threading.Timer(0.5, webbrowser.open, [direccion]).start()

    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()

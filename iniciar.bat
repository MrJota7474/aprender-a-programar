@echo off
rem Abre "Aprender a programar" en el navegador usando el servidor local.
rem (Sin tildes a proposito: los .bat de Windows las muestran mal.)

title Aprender a programar
cd /d "%~dp0"

rem Se prueba que Python funcione de verdad (--version), no solo que exista
rem el nombre: Windows trae un "python" falso que solo abre la tienda.
py -3 --version >nul 2>nul
if not errorlevel 1 (
  py -3 servidor.py
  goto revisar
)

python --version >nul 2>nul
if not errorlevel 1 (
  python servidor.py
  goto revisar
)

echo No se encontro Python en este computador.
echo Instalalo desde https://www.python.org/downloads/ y marca la casilla
echo "Add python.exe to PATH" durante la instalacion. Luego abre este archivo otra vez.
pause
goto fin

:revisar
rem Si el servidor termino con un error, la ventana no se cierra sola:
rem asi se alcanza a leer que paso.
if errorlevel 1 (
  echo.
  echo El servidor se detuvo por un error. Lee el mensaje de arriba.
  pause
)

:fin

# Aprender a programar

App web en español para que un estudiante colombiano aprenda Python, JavaScript,
SQL e inteligencia artificial. El avance por fases está en `PLAN.md` y la
estructura de archivos en `README.md`.

- Abrir: `iniciar.bat` (servidor local en el puerto 8765).
- Pruebas: `node --test "pruebas/*.test.js"` (todas deben pasar antes de dar algo por terminado).
- Vista previa en Claude Code: configuración `aprender` de `.claude/launch.json` (puerto 4173).

## El equipo de agentes

Para aprovechar mejor el uso, cada modelo hace lo que mejor le sirve:

| Quién | Modelo | Qué hace |
| --- | --- | --- |
| Sesión principal | Opus 5.5 | Planifica, divide el trabajo, reparte las tareas, integra los resultados, verifica en el navegador y le explica las decisiones al estudiante. |
| `experto` | Opus 5.5 | Lo más difícil: motores de ejecución, arquitectura, fallos raros, módulos nuevos y lecciones con pruebas complicadas. |
| `programador` | Sonnet 5.5 | Código de rutina: lecciones que siguen un formato ya existente, cambios pequeños de interfaz, documentación y arreglos ya decididos. |
| `revisor` | Haiku 5.5 | En reserva: ya no se usa en cada tarea (aportó poco; las pruebas y la verificación de Opus lo cubren). Solo si se pide. |

Flujo de una tarea:

1. Opus lee `PLAN.md`, arma el plan y lo divide en tareas concretas.
2. Cada tarea va al agente que le corresponde, con lo necesario para hacerla sin
   tener que adivinar: archivos, formato a copiar y qué significa "terminado".
   Las tareas independientes se lanzan a la vez.
3. Al terminar, Opus corre las pruebas y verifica los cambios él mismo.
   Al cerrar cada fase (una vez, no en cada tarea), el `experto` hace una revisión
   profunda: es la que encuentra los errores sutiles. Opus verifica cada hallazgo
   antes de mandarlo a arreglar.
4. Opus prueba en el navegador y le explica al estudiante qué se hizo y por qué.

Cómo se ahorra uso (acordado con el estudiante el 18 de noviembre de 2026):
- El texto largo (lecciones, arreglos ya decididos) lo escribe el `programador`:
  cuesta menos y no infla la conversación principal.
- Lo pequeño (unas pocas líneas, una consulta, verificar) lo hace Opus directamente:
  cada agente arranca de cero y su arranque cuesta más de lo que ahorra en algo corto.
- No se lanzan revisiones de rutina con agentes.

## Reglas del código

- Sin frameworks ni dependencias nuevas; las librerías descargadas viven en `vendor/` y no se editan.
- Scripts clásicos (sin `import`), salvo el Worker de Python.
- Nombres y comentarios en español, explicando el porqué: el estudiante lee el código para aprender.
- Funciones que devuelven objetos nuevos en vez de modificar los que reciben.
- Texto del estudiante en pantalla siempre con `textContent`.

## El hook GateGuard

La primera vez que se crea o edita cada archivo en una sesión, el hook rechaza el
cambio y pide "hechos": quién usa el archivo, que no existe otro igual, si maneja
datos y la instrucción del usuario. Se responden en una línea y se reintenta.

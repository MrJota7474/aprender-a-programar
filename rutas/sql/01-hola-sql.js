// Ruta de SQL, lección 1. Mismo formato que las demás rutas. Diferencias:
// - El código es SQL y corre sobre la base "tienda" (00-base-tienda.js).
// - Las "condicion" de las pruebas son JavaScript y pueden usar:
//     filas, columnas, tabla  → el resultado de la última consulta del estudiante
//     codigo                  → lo que escribió, sin comentarios y EN MAYÚSCULAS
//     consulta(sql)           → corre SQL sobre la base como quedó
//     igualA(sql)             → ¿su resultado es igual al de esta consulta? (con orden)
//     mismasFilas(sql)        → igual, pero sin importar el orden de las filas

globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'hola-sql',
    titulo: 'Hola, SQL',
    pasos: [
      {
        id: 'idea',
        titulo: 'Preguntarle a una base de datos',
        texto: [
          'Presiona **Ejecutar**. Aparece una tabla con los productos de una tienda de barrio: cada renglón es un producto, con su nombre, su precio y más datos. Eso lo pidió la línea `SELECT * FROM productos;`.',
          'Una **base de datos** guarda información en **tablas**, como hojas de Excel. Cada tabla tiene **columnas** (qué datos se guardan: nombre, precio) y **filas** (un renglón por cada cosa: un producto, un cliente).',
          '**SQL** es el lenguaje para hacerle preguntas a esas tablas. Cada pregunta se llama **consulta**. Casi todas las aplicaciones que usas guardan sus datos así.',
          '**Ejemplo explicado palabra por palabra:** `SELECT` significa "selecciona" o "muestra". El `*` significa "todas las columnas". `FROM productos` dice de qué tabla. El `;` cierra la consulta, como el punto final de una frase.',
          'Arriba del editor puedes ver todas las tablas de esta base y sus columnas.',
          '**Error común:** escribir mal el nombre de la tabla. Si escribes `SELECT * FROM producto;` (sin la s), verás `no such table: producto`: esa tabla no existe. Copia el nombre exacto de la lista de tablas.',
        ],
        codigo: 'SELECT * FROM productos;',
      },
      {
        id: 'practica',
        titulo: 'Los clientes de la tienda',
        texto: [
          'Ahora tú. Muestra todas las columnas de la tabla `clientes`.',
          'Las palabras de SQL se suelen escribir en mayúsculas (`SELECT`, `FROM`) para distinguirlas, pero en minúsculas también funcionan.',
        ],
        codigo: [
          '-- Las líneas que empiezan con -- son comentarios: SQL las ignora.',
          '-- TODO: muestra todas las columnas (*) de la tabla clientes',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'Muestras los 6 clientes', condicion: 'mismasFilas("SELECT * FROM clientes")' },
          {
            descripcion: 'Con todas sus columnas: id, nombre y ciudad',
            condicion: 'columnas.join() === "id,nombre,ciudad"',
          },
        ],
        pistas: [
          'La consulta tiene la misma forma que la del paso anterior, cambiando la tabla.',
          'Empieza con `SELECT *` y sigue con `FROM` y el nombre de la tabla.',
          'La consulta completa es: `SELECT * FROM clientes;`',
        ],
        solucion: 'SELECT * FROM clientes;',
      },
      {
        id: 'reto',
        titulo: 'Reto: solo lo que necesito',
        texto: [
          'Casi nunca hacen falta todas las columnas. En vez de `*` puedes escribir las que quieres, separadas por comas.',
          'Muestra solo el `nombre` y el `precio` de los productos, en ese orden.',
        ],
        codigo: '-- TODO: en vez de *, escribe las columnas nombre y precio, separadas por coma\n',
        pruebas: [
          {
            descripcion: 'Las columnas son nombre y precio, en ese orden',
            condicion: 'columnas.join() === "nombre,precio"',
          },
          {
            descripcion: 'Aparecen los 10 productos',
            condicion: 'mismasFilas("SELECT nombre, precio FROM productos")',
          },
        ],
        pistas: [
          'Las columnas van entre `SELECT` y `FROM`, separadas por una coma.',
          '`SELECT nombre, precio` y después `FROM productos`',
          'La consulta completa es: `SELECT nombre, precio FROM productos;`',
        ],
        solucion: 'SELECT nombre, precio FROM productos;',
      },
    ],
  }
);

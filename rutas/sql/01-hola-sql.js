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
          'Una **base de datos** guarda información en **tablas**. Cada tabla tiene **columnas** (qué datos se guardan) y **filas** (un registro por cada cosa: un producto, un cliente).',
          '**SQL** es el lenguaje para hacerle preguntas a esas tablas. Casi todas las aplicaciones que usas guardan sus datos así.',
          'La pregunta más básica es `SELECT * FROM productos;` y se lee: "muestra todas las columnas de la tabla productos". El `*` significa "todas" y la consulta termina en punto y coma.',
          'Arriba del editor puedes ver las tablas de esta base: una tienda de barrio. Presiona **Ejecutar**.',
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
        codigo: '-- Escribe tu consulta debajo de esta línea\n',
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
        codigo: '-- Solo nombre y precio de los productos\n',
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

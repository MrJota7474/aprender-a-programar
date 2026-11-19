globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'postgresql',
    titulo: 'PostgreSQL frente a SQLite',
    pasos: [
      {
        id: 'idea',
        titulo: 'El mismo SQL, otro motor',
        texto: [
          'Todo lo que has escrito en esta ruta corre en **SQLite**: una base de datos que vive en un solo archivo, sin servidor. Es la que trae tu celular y la que usa esta app. En las empresas (y en el certificado "Relational Database" de freeCodeCamp) se usa mucho **PostgreSQL**: un servidor al que se conectan muchos programas a la vez, con usuarios y permisos.',
          'El SQL es casi el mismo: `SELECT`, `JOIN`, `GROUP BY`, `INSERT`, `ALTER TABLE ... ADD COLUMN` funcionan igual. Cambian sobre todo los **tipos**: para un id que se numera solo, PostgreSQL usa `SERIAL` (o la forma moderna `INTEGER GENERATED ALWAYS AS IDENTITY`) y SQLite usa `INTEGER PRIMARY KEY`. Para textos con límite, `VARCHAR(40)`: PostgreSQL no deja pasar el texto número 41; SQLite acepta el tipo pero **no** lo hace cumplir. `BOOLEAN` guarda `TRUE` o `FALSE` en PostgreSQL; SQLite lo acepta pero guarda 1 y 0.',
          'Otra diferencia que confunde: en PostgreSQL los textos van **siempre** entre comillas simples (`\'Bogotá\'`); las comillas dobles son para nombres de tablas y columnas. SQLite perdona ese error; PostgreSQL no.',
          'A PostgreSQL se entra desde la terminal con **psql**, por ejemplo `psql --username=freecodecamp --dbname=postgres` (así arranca el curso de freeCodeCamp). Dentro, además del SQL (que siempre termina en `;`), hay comandos con barra: `\\l` lista las bases, `\\c tienda` se conecta a una, `\\d` lista las tablas, `\\d productos` describe una tabla y `\\q` sale. **Aquí no hay un PostgreSQL de verdad**: los ejercicios corren en SQLite, y por eso practicamos justo lo que cambia al pasar de uno a otro.',
        ],
        codigo: [
          '-- SQLite acepta estos tipos de PostgreSQL (aunque no los cumpla igual)',
          'CREATE TABLE turnos (',
          '  turno_id INTEGER PRIMARY KEY,',
          '  empleado VARCHAR(40) NOT NULL,',
          '  abierto BOOLEAN DEFAULT FALSE',
          ');',
          '',
          "INSERT INTO turnos (empleado, abierto) VALUES ('Luisa', TRUE), ('Andrés', FALSE);",
          '',
          '-- Mira la columna abierto: SQLite guardó 1 y 0',
          'SELECT * FROM turnos;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Traducir una tabla de PostgreSQL',
        texto: [
          'Este `CREATE TABLE` está escrito para PostgreSQL. Córrelo tal cual: SQLite lo acepta sin quejarse… pero mira la columna `domiciliario_id`: quedó vacía (`NULL`). En SQLite, `SERIAL` es un nombre de tipo cualquiera y no numera nada.',
          'Tradúcelo a SQLite: cambia `SERIAL` por `INTEGER` para que `domiciliario_id` se numere solo. Deja `VARCHAR(40)` y `BOOLEAN DEFAULT TRUE`, que SQLite sí entiende. El resto (los dos `INSERT` y el `SELECT`) queda igual.',
        ],
        codigo: [
          'CREATE TABLE domiciliarios (',
          '  domiciliario_id SERIAL PRIMARY KEY,',
          '  nombre VARCHAR(40) NOT NULL,',
          '  activo BOOLEAN DEFAULT TRUE',
          ');',
          '',
          "INSERT INTO domiciliarios (nombre) VALUES ('Jhon');",
          "INSERT INTO domiciliarios (nombre) VALUES ('Yuli');",
          '',
          'SELECT * FROM domiciliarios;',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'La tabla tiene las columnas domiciliario_id, nombre y activo',
            condicion: 'consulta("PRAGMA table_info(domiciliarios)").map((c) => c.name).join() === "domiciliario_id,nombre,activo"',
          },
          {
            descripcion: 'domiciliario_id es INTEGER PRIMARY KEY',
            condicion: '(({ type, pk }) => type === "INTEGER" && pk === 1)(consulta("PRAGMA table_info(domiciliarios)")[0])',
          },
          {
            descripcion: 'Los ids se numeraron solos: 1 y 2',
            condicion: 'consulta("SELECT domiciliario_id AS id FROM domiciliarios ORDER BY 1").map((f) => f.id).join() === "1,2"',
          },
          {
            descripcion: 'activo quedó en verdadero (1) sin escribirlo',
            condicion: 'consulta("SELECT COUNT(*) AS n FROM domiciliarios WHERE activo = TRUE")[0].n === 2',
          },
          { descripcion: 'Muestras la tabla', condicion: 'filas.length === 2 && columnas.includes("nombre")' },
        ],
        pistas: [
          'Solo cambia una palabra, en la línea de `domiciliario_id`.',
          'En SQLite, una columna `INTEGER PRIMARY KEY` se llena sola con 1, 2, 3… cuando no le das un valor.',
          'La línea queda así: `domiciliario_id INTEGER PRIMARY KEY,`',
        ],
        solucion: [
          'CREATE TABLE domiciliarios (',
          '  domiciliario_id INTEGER PRIMARY KEY,',
          '  nombre VARCHAR(40) NOT NULL,',
          '  activo BOOLEAN DEFAULT TRUE',
          ');',
          '',
          "INSERT INTO domiciliarios (nombre) VALUES ('Jhon');",
          "INSERT INTO domiciliarios (nombre) VALUES ('Yuli');",
          '',
          'SELECT * FROM domiciliarios;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: una búsqueda que sirva en los dos',
        texto: [
          'Un cliente escribe "AREPA" en el buscador de la tienda. Esta consulta encuentra la arepa aquí, porque en SQLite `LIKE` no distingue mayúsculas de minúsculas. En PostgreSQL **no encontraría nada**: allá `LIKE` sí las distingue (y existe `ILIKE`, que no las distingue, pero SQLite no lo conoce).',
          'Reescríbela para que funcione **igual en los dos motores**: pasa a minúsculas tanto el nombre como lo que se busca, con la función `LOWER()`, que existe en ambos. Muestra las columnas `nombre` y `precio`.',
          'Un detalle: en SQLite `LOWER` solo cambia las letras sin tilde (ASCII), así que `PIÑA` queda `piÑa`; PostgreSQL sí convierte la Ñ y las vocales con tilde.',
        ],
        codigo: ["SELECT nombre, precio", 'FROM productos', "WHERE nombre LIKE '%AREPA%';"].join('\n'),
        pruebas: [
          { descripcion: 'Las columnas son nombre y precio', condicion: 'columnas.join() === "nombre,precio"' },
          {
            descripcion: 'Encuentra la arepa',
            condicion: `filas.length === 1 && mismasFilas("SELECT nombre, precio FROM productos WHERE nombre LIKE '%arepa%'")`,
          },
          { descripcion: 'Usa LOWER() para no depender de las mayúsculas', condicion: 'codigo.includes("LOWER(")' },
          { descripcion: 'No usa ILIKE (SQLite no lo tiene)', condicion: '!codigo.includes("ILIKE")' },
        ],
        pistas: [
          '`LOWER(nombre)` convierte el nombre a minúsculas: `Arepa de queso` → `arepa de queso`.',
          'Haz lo mismo con lo que se busca: `LOWER(\'%AREPA%\')` da `%arepa%`.',
          "La condición completa: `WHERE LOWER(nombre) LIKE LOWER('%AREPA%');`",
        ],
        solucion: ['SELECT nombre, precio', 'FROM productos', "WHERE LOWER(nombre) LIKE LOWER('%AREPA%');"].join('\n'),
      },
    ],
  }
);

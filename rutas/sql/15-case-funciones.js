globalThis.Rutas.agregarLeccion(
  'sql',
  {
    id: 'case-funciones',
    titulo: 'CASE y funciones',
    pasos: [
      {
        id: 'idea',
        titulo: 'Clasificar y transformar datos',
        texto: [
          '`CASE WHEN` es el "si... entonces..." de SQL. Se escribe `CASE WHEN condición THEN resultado ... ELSE otro END` y sirve para ponerle una etiqueta a cada fila. Se revisan las condiciones en orden y gana la primera que se cumpla.',
          'SQL también trae **funciones**. De texto: `UPPER(texto)` pasa a mayúsculas y `LENGTH(texto)` cuenta los caracteres (espacios incluidos). De números: `ROUND(número, decimales)` redondea.',
          'Para fechas, `strftime(formato, fecha)` extrae una parte: `\'%Y\'` es el año, `\'%m\'` el mes y `\'%w\'` el día de la semana (0 es domingo, 1 es lunes... 6 es sábado).',
          'Ejecuta la consulta y mira cada columna: cada una usa una de estas herramientas.',
        ],
        codigo: [
          'SELECT UPPER(nombre) AS grito,',
          '       LENGTH(nombre) AS letras,',
          '       ROUND(precio / 1000.0, 1) AS miles,',
          "       CASE WHEN existencias = 0 THEN 'agotado' ELSE 'hay' END AS estado",
          'FROM productos;',
          '',
          "SELECT id, fecha, strftime('%m', fecha) AS mes, strftime('%w', fecha) AS dia_semana",
          'FROM pedidos;',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Baratos, medios y caros',
        texto: [
          'Muestra el `nombre` de cada producto y una segunda columna que lo clasifique según su precio:',
          '- `barato` si cuesta menos de 3000.',
          '- `medio` si cuesta entre 3000 y 5000 (incluidos).',
          '- `caro` si cuesta más de 5000.',
          'Escribe las etiquetas exactamente así, en minúscula.',
        ],
        codigo: '-- Nombre y clasificación de cada producto\n',
        pruebas: [
          { descripcion: 'Usas CASE', condicion: '/\\bCASE\\b/.test(codigo)' },
          {
            descripcion: 'Cada producto aparece con su clasificación (barato, medio o caro)',
            condicion: `mismasFilas("SELECT nombre, CASE WHEN precio < 3000 THEN 'barato' WHEN precio <= 5000 THEN 'medio' ELSE 'caro' END FROM productos")`,
          },
        ],
        pistas: [
          'La estructura es `CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END`.',
          'Primero `WHEN precio < 3000 THEN \'barato\'`, luego `WHEN precio <= 5000 THEN \'medio\'`. Como se revisa en orden, lo que sobra es `caro`.',
          'La consulta completa: `SELECT nombre, CASE WHEN precio < 3000 THEN \'barato\' WHEN precio <= 5000 THEN \'medio\' ELSE \'caro\' END AS clase FROM productos;`',
        ],
        solucion: [
          'SELECT nombre,',
          '       CASE',
          "         WHEN precio < 3000 THEN 'barato'",
          "         WHEN precio <= 5000 THEN 'medio'",
          "         ELSE 'caro'",
          '       END AS clase',
          'FROM productos;',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto: pedidos por día de la semana',
        texto: [
          'Don Pepe quiere saber qué días de la semana recibe más pedidos.',
          'Muestra el día de la semana de cada pedido (con `strftime` y `\'%w\'` sobre la columna `fecha`) y cuántos pedidos hubo ese día. Agrupa con `GROUP BY`.',
          'Las columnas son el día y la cantidad, en ese orden. El orden de las filas no importa.',
        ],
        codigo: '-- Día de la semana y cantidad de pedidos\n',
        pruebas: [
          { descripcion: 'Usas strftime', condicion: '/\\bSTRFTIME\\s*\\(/.test(codigo)' },
          { descripcion: 'Usas GROUP BY', condicion: '/\\bGROUP\\s+BY\\b/.test(codigo)' },
          {
            descripcion: 'Cada día de la semana aparece con su cantidad de pedidos',
            condicion: `columnas.length === 2 && filas.map((f) => String(f[0]) + ":" + f[1]).sort().join() === consulta("SELECT strftime('%w', fecha) AS dia, COUNT(*) AS n FROM pedidos GROUP BY dia").map((f) => f.dia + ":" + f.n).sort().join()`,
          },
        ],
        pistas: [
          'El día de la semana se obtiene con `strftime(\'%w\', fecha)`.',
          'Cuenta con `COUNT(*)` y agrupa por la misma expresión: `GROUP BY strftime(\'%w\', fecha)` (también puedes agrupar por el alias).',
          'La consulta completa: `SELECT strftime(\'%w\', fecha) AS dia, COUNT(*) AS pedidos FROM pedidos GROUP BY dia;`',
        ],
        solucion: [
          "SELECT strftime('%w', fecha) AS dia, COUNT(*) AS pedidos",
          'FROM pedidos',
          'GROUP BY dia;',
        ].join('\n'),
      },
    ],
  }
);

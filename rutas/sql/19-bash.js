// Esta lección es de la ruta SQL pero se practica en la terminal simulada
// (motor "terminal"): el certificado de bases de datos de freeCodeCamp se
// hace en una terminal con Bash y psql, y moverse por carpetas es lo primero.
// Va dentro de una función para que la constante no choque con otros scripts.
(function () {
  const ARCHIVOS_DEL_PROYECTO = Object.freeze({
    'tienda.sql': 'CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio INTEGER);',
    'notas.txt': 'Pendiente: respaldar la base de la tienda cada semana.',
  });

  globalThis.Rutas.agregarLeccion(
    'sql',
    {
      id: 'bash',
      titulo: 'Bash para bases de datos',
      pasos: [
        {
          id: 'idea',
          titulo: 'Moverse por la terminal',
          motor: 'terminal',
          archivos: ARCHIVOS_DEL_PROYECTO,
          texto: [
            'Ejecuta el código y lee la respuesta de cada línea: `pwd` contesta en qué carpeta estás, `ls` muestra lo que hay y `cat notas.txt` muestra lo que dice ese archivo.',
            'Una **terminal** es una ventana donde le das órdenes al computador escribiendo, sin usar el mouse. **Bash** es el programa que lee esas órdenes, llamadas **comandos**. En el trabajo con bases de datos (y en el certificado "Relational Database" de freeCodeCamp) ahí abres `psql`, guardas copias de la base y corres scripts.',
            'Los comandos básicos:',
            '- `pwd` dice en qué carpeta estás.',
            '- `ls` lista lo que hay. Aquí las carpetas salen con una `/` al final, para distinguirlas.',
            '- `mkdir consultas` crea una carpeta llamada consultas.',
            '- `cd consultas` entra en ella. `cd ..` sube a la carpeta de arriba. `cd` solo vuelve a tu carpeta personal (aquí, /proyecto).',
            '- `cat archivo` muestra su contenido y `echo texto` repite un texto.',
            'La **redirección** es la idea más poderosa: `>` manda lo que un comando iba a mostrar a un archivo (lo crea o lo **reemplaza**), y `>>` lo **agrega** al final. Así se hacen los respaldos de verdad: `pg_dump tienda > tienda.sql` guarda toda la base en un archivo, y `psql --dbname=tienda < tienda.sql` la restaura.',
            'Esta es una terminal simulada dentro de la carpeta `/proyecto`: tiene `pwd`, `ls`, `cd`, `mkdir`, `cat`, `echo`, `touch`, `rm` y `git`. No corre `psql` ni scripts; eso lo harás en la terminal de freeCodeCamp con estos mismos movimientos. Escribe un comando por línea.',
            '**Error común:** escribir mal el nombre de una carpeta o entrar en una que no existe. `cd consulta` (sin la s) responde `No existe el archivo o el directorio` (directorio es otra forma de decir carpeta). Usa `ls` para ver los nombres exactos antes de entrar.',
          ],
          codigo: ['pwd', 'ls', 'mkdir consultas', 'cd consultas', 'pwd', 'cd ..', 'ls', 'cat notas.txt'].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Ordenar las consultas',
          motor: 'terminal',
          archivos: ARCHIVOS_DEL_PROYECTO,
          texto: [
            'Vas a guardar una consulta en su propia carpeta, como se hace en un proyecto ordenado.',
            '1. Crea la carpeta `consultas`. 2. Entra en ella. 3. Crea el archivo `ventas.sql` con el texto `SELECT * FROM pedidos;` usando `echo` y `>`. 4. Muéstralo con `cat`.',
            'Pon el texto entre comillas: sin ellas, la terminal tomaría el `;` como el final del comando.',
          ],
          codigo: [
            '# TODO 1: crea la carpeta consultas con mkdir',
            '',
            '# TODO 2: entra en ella con cd',
            '',
            '# TODO 3: crea ventas.sql con echo, el texto entre comillas y >',
            '',
            '# TODO 4: muéstralo con cat',
            '',
            'pwd',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Existe la carpeta consultas', condicion: 'carpetas().includes("consultas")' },
            {
              descripcion: 'consultas/ventas.sql tiene la consulta',
              condicion: 'archivo("consultas/ventas.sql") === "SELECT * FROM pedidos;\\n"',
            },
            { descripcion: 'Mostraste el archivo con cat', condicion: 'comandos.some((c) => c.startsWith("cat ")) && salida.includes("SELECT * FROM pedidos;")' },
          ],
          pistas: [
            'Los dos primeros pasos: `mkdir consultas` y luego `cd consultas`',
            'El archivo: `echo "SELECT * FROM pedidos;" > ventas.sql`',
            'Y para verlo: `cat ventas.sql`',
          ],
          solucion: ['mkdir consultas', 'cd consultas', 'echo "SELECT * FROM pedidos;" > ventas.sql', 'cat ventas.sql', 'pwd'].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: la carpeta de respaldos',
          motor: 'terminal',
          archivos: ARCHIVOS_DEL_PROYECTO,
          texto: [
            'Prepara el lugar donde irán los respaldos de la base, con instrucciones para quien llegue después:',
            '1. Crea la carpeta `respaldos` y entra en ella. 2. Crea `leeme.txt` con la línea `Respaldo de la tienda` (usa `>`). 3. **Agrégale** una segunda línea: `Restaurar con: psql --dbname=tienda < tienda.sql` (usa `>>`, y comillas). 4. Muestra el archivo con `cat`. 5. Vuelve a `/proyecto` y termina con `ls`.',
            'Si usas `>` en la segunda línea en vez de `>>`, borrarás la primera: es el error más común con la redirección, y en un respaldo real puede costar caro.',
          ],
          codigo: [
            '# TODO 1: crea la carpeta respaldos y entra en ella',
            '',
            '# TODO 2: crea leeme.txt con la primera línea (usa >)',
            '',
            '# TODO 3: agrega la segunda línea (usa >>, no >)',
            '',
            '# TODO 4: muestra el archivo, vuelve a /proyecto y termina con ls',
            '',
            'pwd',
          ].join('\n'),
          pruebas: [
            { descripcion: 'Existe la carpeta respaldos', condicion: 'carpetas().includes("respaldos")' },
            {
              descripcion: 'leeme.txt empieza con "Respaldo de la tienda"',
              condicion: '(archivo("respaldos/leeme.txt") || "").split("\\n")[0] === "Respaldo de la tienda"',
            },
            {
              descripcion: 'La segunda línea se agregó con >> y explica cómo restaurar',
              condicion: 'codigo.includes(">>") && (archivo("respaldos/leeme.txt") || "").split("\\n")[1] === "Restaurar con: psql --dbname=tienda < tienda.sql"',
            },
            { descripcion: 'Mostraste el archivo con cat', condicion: 'salida.includes("Respaldo de la tienda")' },
            { descripcion: 'Terminaste de nuevo en /proyecto', condicion: 'carpetaActual() === "/proyecto"' },
          ],
          pistas: [
            'Empieza con `mkdir respaldos` y `cd respaldos`',
            'Las dos líneas: `echo "Respaldo de la tienda" > leeme.txt` y `echo "Restaurar con: psql --dbname=tienda < tienda.sql" >> leeme.txt`',
            'Para terminar: `cat leeme.txt`, `cd ..` y `ls`',
          ],
          solucion: [
            'mkdir respaldos',
            'cd respaldos',
            'echo "Respaldo de la tienda" > leeme.txt',
            'echo "Restaurar con: psql --dbname=tienda < tienda.sql" >> leeme.txt',
            'cat leeme.txt',
            'cd ..',
            'ls',
          ].join('\n'),
        },
      ],
    }
  );
})();

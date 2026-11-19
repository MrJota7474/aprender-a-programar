// Ruta "El oficio", lección 5: seguridad I, la inyección SQL.
//
// Se usa Python con sqlite3 (viene dentro de Pyodide) y no el motor de SQL:
// la inyección no es un problema de SQL sino del programa que ARMA la
// consulta pegando texto. Hay que ver las dos cosas juntas.
//
// Para comprobar que el estudiante usa parámetros (y no, por ejemplo, un
// reemplazo de comillas hecho a mano), las pruebas le pasan una conexión
// "espía": se comporta igual que la real pero anota cada consulta y sus
// parámetros. Así se revisa el comportamiento, no el texto del código.

(function () {
  'use strict';

  const comprobar = (lineas) =>
    `(lambda g: (exec(${JSON.stringify(lineas.join('\n'))}, g), g.get("ok"))[1])(dict(globals())) is True`;

  // La conexión espía. "parametros" puede ser una tupla, una lista o un
  // diccionario (consultas con :nombre); en todos los casos se miran los valores.
  const ESPIA = [
    'class ConexionEspia:',
    '    def __init__(self, real):',
    '        self.real = real',
    '        self.consultas = []',
    '    def execute(self, consulta, parametros=()):',
    '        self.consultas.append((consulta, parametros))',
    '        return self.real.execute(consulta, parametros)',
    '',
    'def valores(parametros):',
    '    return list(parametros.values()) if isinstance(parametros, dict) else list(parametros)',
  ];

  // ---------- Práctica ----------

  const BASE_CLIENTES = [
    'import sqlite3',
    '',
    '',
    'def crear_base():',
    '    conexion = sqlite3.connect(":memory:")',
    '    conexion.executescript("""',
    '        CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, celular TEXT, deuda INTEGER);',
    '        INSERT INTO clientes (nombre, celular, deuda) VALUES',
    "            ('Ana Ruiz', '3001234567', 0),",
    "            ('Luis Mora', '3109876543', 45000),",
    "            ('Marco D''Angelo', '3155550000', 8000),",
    "            ('Carmen Díaz', '3205551234', 12000);",
    '    """)',
    '    return conexion',
  ];

  const buscarCliente = (cuerpo) =>
    [
      ...BASE_CLIENTES,
      '',
      '',
      'def buscar_cliente(conexion, nombre):',
      ...cuerpo,
      '',
      '',
      'conexion = crear_base()',
      'print(buscar_cliente(conexion, "Ana Ruiz"))',
      'print(buscar_cliente(conexion, "x\' OR \'1\'=\'1"))',
    ].join('\n');

  const CLIENTE_INSEGURO = [
    '    consulta = "SELECT nombre, celular, deuda FROM clientes WHERE nombre = \'" + nombre + "\'"',
    '    return conexion.execute(consulta).fetchall()',
  ];
  const CLIENTE_SEGURO = [
    '    consulta = "SELECT nombre, celular, deuda FROM clientes WHERE nombre = ?"',
    '    return conexion.execute(consulta, (nombre,)).fetchall()',
  ];

  // ---------- Reto ----------

  const BASE_PRODUCTOS = [
    'import sqlite3',
    '',
    '',
    'def crear_base():',
    '    conexion = sqlite3.connect(":memory:")',
    '    conexion.executescript("""',
    '        CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio INTEGER, existencias INTEGER);',
    '        INSERT INTO productos (nombre, precio, existencias) VALUES',
    "            ('Arepa de queso', 3500, 40),",
    "            ('Arepa de huevo', 4500, 15),",
    "            ('Tinto', 2000, 100),",
    "            ('Buñuelo', 1500, 60),",
    "            ('Pandebono', 2500, 30),",
    "            ('Café en grano', 18000, 12);",
    '    """)',
    '    return conexion',
  ];

  const buscarProductos = (cuerpo) =>
    [
      ...BASE_PRODUCTOS,
      '',
      '',
      ...cuerpo,
      '',
      '',
      'conexion = crear_base()',
      'print(buscar_productos(conexion, "arepa"))',
      'print(buscar_productos(conexion, "", "precio"))',
    ].join('\n');

  const PRODUCTOS_INSEGURO = [
    'def buscar_productos(conexion, texto, orden="nombre"):',
    '    # texto y orden llegan de la dirección: /productos?buscar=arepa&orden=precio',
    '    consulta = (',
    '        "SELECT nombre, precio FROM productos "',
    '        + "WHERE nombre LIKE \'%" + texto + "%\' "',
    '        + "ORDER BY " + orden',
    '    )',
    '    return conexion.execute(consulta).fetchall()',
  ];
  const PRODUCTOS_SEGURO = [
    '# Los nombres de columna NO se pueden pasar como parámetro (el ? es solo para',
    '# valores). Por eso el orden se elige de una lista blanca: lo que no está aquí',
    '# no llega nunca a la consulta.',
    'ORDENES = {',
    '    "nombre": "nombre",',
    '    "precio": "precio",',
    '    "precio_desc": "precio DESC",',
    '}',
    '',
    '',
    'def buscar_productos(conexion, texto, orden="nombre"):',
    '    # texto y orden llegan de la dirección: /productos?buscar=arepa&orden=precio',
    '    if orden not in ORDENES:',
    '        raise ValueError("No se puede ordenar por " + repr(orden))',
    '    consulta = "SELECT nombre, precio FROM productos WHERE nombre LIKE ? ORDER BY " + ORDENES[orden]',
    '    # Los % van dentro del VALOR, no en la consulta',
    '    return conexion.execute(consulta, ("%" + texto + "%",)).fetchall()',
  ];

  const lanzaValueError = (llamada) =>
    comprobar(['try:', '    ' + llamada, '    ok = False', 'except ValueError:', '    ok = True', 'except Exception:', '    ok = False']);

  globalThis.Rutas.agregarLeccion('oficio', {
    id: 'inyeccion-sql',
    titulo: 'Seguridad I: inyección SQL',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cuando el usuario escribe parte de tu consulta',
        texto: [
          'Muchos programas arman la consulta SQL **pegando** lo que escribió el usuario: `"... WHERE nombre = \'" + nombre + "\'"`. Funciona con datos normales. Pero si alguien escribe en la casilla `x\' OR \'1\'=\'1`, la comilla cierra el texto antes de tiempo y lo que sigue se vuelve **parte de la consulta**: `WHERE nombre = \'x\' OR \'1\'=\'1\'`. Como `\'1\'=\'1\'` siempre es verdad, la base devuelve **todos** los clientes, con su celular y su deuda.',
          'Eso es la **inyección SQL**: el atacante escribe código, no datos. Lleva más de 25 años en las listas de los ataques más comunes y con ella se han robado millones de cuentas. Con otras variantes se pueden borrar tablas o saltarse un inicio de sesión.',
          'La solución no es "limpiar las comillas" a mano (siempre se escapa algún caso). Es usar **consultas con parámetros**: escribes `?` donde va el dato y lo pasas aparte, `conexion.execute(consulta, (nombre,))`. La base recibe la consulta y el dato por separado, y el dato **nunca** se interpreta como SQL. Ejecuta el ejemplo y compara.',
        ],
        codigo: [
          ...BASE_CLIENTES,
          '',
          '',
          'conexion = crear_base()',
          '',
          '',
          'def buscar_inseguro(nombre):',
          '    consulta = "SELECT nombre, celular, deuda FROM clientes WHERE nombre = \'" + nombre + "\'"',
          '    print("  Consulta armada:", consulta)',
          '    return conexion.execute(consulta).fetchall()',
          '',
          '',
          'def buscar_seguro(nombre):',
          '    consulta = "SELECT nombre, celular, deuda FROM clientes WHERE nombre = ?"',
          '    return conexion.execute(consulta, (nombre,)).fetchall()',
          '',
          '',
          'print("Búsqueda normal:")',
          'print(" ", buscar_inseguro("Ana Ruiz"))',
          '',
          '# Lo que alguien escribió en la casilla de búsqueda:',
          'ataque = "x\' OR \'1\'=\'1"',
          'print("Con el ataque, versión insegura:")',
          'print(" ", buscar_inseguro(ataque))',
          'print("Con el ataque, versión con parámetros:")',
          'print(" ", buscar_seguro(ataque))',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Cambiar texto pegado por parámetros',
        texto: [
          '`buscar_cliente(conexion, nombre)` arma la consulta pegando el nombre. Ejecuta: con el ataque devuelve **todos** los clientes. Y hay un error que no es de seguridad: busca a `Marco D\'Angelo` y verás que se revienta, porque su apellido trae una comilla. Los datos reales tienen comillas, tildes y de todo.',
          'Reescríbela con un **parámetro**: en la consulta pon `?` donde va el nombre (sin comillas alrededor: el `?` no lleva comillas) y pasa el valor aparte, en una tupla: `conexion.execute(consulta, (nombre,))`. Ojo con la coma de `(nombre,)`: sin ella no es una tupla.',
        ],
        codigo: buscarCliente(CLIENTE_INSEGURO),
        pruebas: [
          { descripcion: 'Encuentra a un cliente por su nombre', condicion: 'buscar_cliente(crear_base(), "Ana Ruiz") == [("Ana Ruiz", "3001234567", 0)]' },
          { descripcion: 'El ataque no devuelve a nadie', condicion: 'buscar_cliente(crear_base(), "x\' OR \'1\'=\'1") == []' },
          { descripcion: 'Un nombre con comilla funciona (Marco D\'Angelo)', condicion: 'buscar_cliente(crear_base(), "Marco D\'Angelo") == [("Marco D\'Angelo", "3155550000", 8000)]' },
          {
            descripcion: 'El nombre viaja como parámetro, no pegado en la consulta',
            condicion: comprobar([
              ...ESPIA,
              'espia = ConexionEspia(crear_base())',
              'buscar_cliente(espia, "Luis Mora")',
              'consulta, parametros = espia.consultas[-1]',
              'ok = "Luis Mora" not in consulta and "Luis Mora" in valores(parametros)',
            ]),
          },
        ],
        pistas: [
          'La consulta queda así, sin comillas ni `+`: `"SELECT nombre, celular, deuda FROM clientes WHERE nombre = ?"`.',
          'El valor va como segundo argumento de `execute`, dentro de una tupla: `conexion.execute(consulta, (nombre,))`.',
          'La función completa son dos líneas: la consulta con `?` y `return conexion.execute(consulta, (nombre,)).fetchall()`.',
        ],
        solucion: buscarCliente(CLIENTE_SEGURO),
      },
      {
        id: 'reto',
        titulo: 'Reto: buscar y ordenar sin abrir la puerta',
        texto: [
          'La tienda tiene un buscador: `/productos?buscar=arepa&orden=precio`. `buscar_productos(conexion, texto, orden)` pega los dos valores en la consulta. Tiene **dos** huecos, y cada uno se tapa distinto.',
          '**1. El texto**: va en un `LIKE`, que busca con `%` (cualquier cosa antes o después). Usa un parámetro, y pon los `%` **en el valor**: `("%" + texto + "%",)`, no en la consulta. **2. El orden**: el `?` solo sirve para **valores**, no para nombres de columna. Para eso se usa una **lista blanca**: un diccionario con los órdenes permitidos (`"nombre"`, `"precio"` y `"precio_desc"`, que es `precio DESC`). Si piden otro, lanza `ValueError`, aunque sea una columna que sí existe: lo que no está en la lista no entra.',
          'Devuelve una lista de tuplas `(nombre, precio)`. Con el texto vacío se listan todos los productos.',
        ],
        codigo: buscarProductos(PRODUCTOS_INSEGURO),
        pruebas: [
          {
            descripcion: 'Busca por parte del nombre y ordena por nombre',
            condicion: 'buscar_productos(crear_base(), "arepa") == [("Arepa de huevo", 4500), ("Arepa de queso", 3500)]',
          },
          {
            descripcion: 'Ordena por precio, de menor a mayor y de mayor a menor',
            condicion: '[p for p, _ in buscar_productos(crear_base(), "", "precio")][:2] == ["Buñuelo", "Tinto"] and buscar_productos(crear_base(), "", "precio_desc")[0] == ("Café en grano", 18000)',
          },
          {
            descripcion: 'Un ataque en el texto de búsqueda no devuelve nada',
            condicion: 'buscar_productos(crear_base(), "zzz\' OR 1=1 OR nombre LIKE \'") == [] and buscar_productos(crear_base(), "x\') UNION SELECT nombre, deuda FROM clientes --") == []',
          },
          {
            descripcion: 'Un orden que no está en la lista blanca lanza ValueError',
            condicion: [
              lanzaValueError('buscar_productos(crear_base(), "", "existencias")'),
              lanzaValueError('buscar_productos(crear_base(), "", "precio; DROP TABLE productos")'),
              lanzaValueError('buscar_productos(crear_base(), "", "(SELECT 1)")'),
            ].join(' and '),
          },
          {
            descripcion: 'El texto viaja como parámetro, no pegado en la consulta',
            condicion: comprobar([
              ...ESPIA,
              'espia = ConexionEspia(crear_base())',
              'buscar_productos(espia, "bono")',
              'consulta, parametros = espia.consultas[-1]',
              'ok = "bono" not in consulta and any("bono" in str(v) for v in valores(parametros))',
            ]),
          },
        ],
        pistas: [
          'Arriba de la función crea la lista blanca: `ORDENES = {"nombre": "nombre", "precio": "precio", "precio_desc": "precio DESC"}`.',
          'Al comenzar la función: `if orden not in ORDENES: raise ValueError("No se puede ordenar por " + orden)`.',
          'La consulta: `"SELECT nombre, precio FROM productos WHERE nombre LIKE ? ORDER BY " + ORDENES[orden]` (eso sí se puede pegar, porque sale de TU diccionario). Y se ejecuta con `conexion.execute(consulta, ("%" + texto + "%",))`.',
        ],
        solucion: buscarProductos(PRODUCTOS_SEGURO),
      },
    ],
  });
})();

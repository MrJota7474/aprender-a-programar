// Varias líneas de código de esta lección llevan comillas simples y dobles a
// la vez (así se escribe JSON dentro de JavaScript); por eso van entre comillas
// invertidas en vez de comillas simples.

globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'datos-json',
    titulo: 'Datos y JSON',
    pasos: [
      {
        id: 'idea',
        titulo: 'El idioma con el que hablan los programas',
        texto: [
          '**JSON** es el formato de texto con el que los programas se envían datos entre sí. Se parece mucho a los objetos y arreglos de JavaScript, pero es solo texto: por eso se puede mandar por internet o guardar en un archivo.',
          'Es justo lo que vas a necesitar más adelante: los servicios de inteligencia artificial suelen recibir y responder en JSON.',
          '`JSON.parse()` convierte un texto JSON en un objeto, y `JSON.stringify()` hace el camino contrario.',
          'En JSON los nombres de las propiedades siempre van entre comillas dobles.',
        ],
        codigo: [
          `const texto = '{"ciudad": "Cali", "temperatura": 29}';`,
          'const datos = JSON.parse(texto); // de texto a objeto',
          'console.log(datos.ciudad);',
          'console.log(datos.temperatura + 1);',
          '',
          'const deVuelta = JSON.stringify({ listo: true }); // de objeto a texto',
          'console.log(deVuelta);',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Leer un JSON',
        texto: [
          'La variable `texto` tiene los datos de un producto en formato JSON. Por ahora es solo un texto: no se le puede pedir el precio.',
          'Conviértelo en un objeto llamado `datos` con `JSON.parse()` y después muestra el precio en la consola.',
        ],
        codigo: [
          `const texto = '{"producto": "Café", "precio": 18000, "disponible": true}';`,
          '',
          '// Convierte el texto en un objeto llamado datos y muestra el precio',
          '',
        ].join('\n'),
        pruebas: [
          {
            descripcion: 'datos es un objeto',
            condicion: 'typeof datos === "object" && datos !== null',
          },
          { descripcion: 'datos.precio vale 18000', condicion: 'datos.precio === 18000' },
          {
            descripcion: 'Muestras el precio en la consola',
            condicion: 'salida.some((linea) => /18[.,]?000/.test(linea))',
          },
          { descripcion: 'Usas JSON.parse', condicion: 'codigo.includes("JSON.parse")' },
        ],
        pistas: [
          'La conversión es: `const datos = JSON.parse(texto);`',
          'Ahora `datos` es un objeto y puedes pedirle una propiedad: `datos.precio`',
          'Para mostrarlo: `console.log(datos.precio);`',
        ],
        solucion: [
          `const texto = '{"producto": "Café", "precio": 18000, "disponible": true}';`,
          '',
          'const datos = JSON.parse(texto);',
          'console.log(datos.precio);',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: los pedidos del día',
        texto: [
          'Así llegan los datos de muchos servicios: un texto JSON con una lista adentro.',
          'Crea la función `totalVendido` que recibe un **texto JSON** como el de `pedidos` y devuelve la suma del `"valor"` de todos los pedidos.',
          'Pasos: convertir el texto con `JSON.parse()`, recorrer la lista y sumar. Debe funcionar con **cualquier** lista, incluso una vacía (en ese caso devuelve 0).',
        ],
        codigo: [
          `const pedidos = '[{"producto": "Café", "valor": 18000}, {"producto": "Arepa", "valor": 3000}, {"producto": "Jugo", "valor": 4500}]';`,
          '',
          '// Crea aquí la función totalVendido',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'totalVendido es una función', condicion: 'typeof totalVendido === "function"' },
          { descripcion: 'totalVendido(pedidos) devuelve 25500', condicion: 'totalVendido(pedidos) === 25500' },
          { descripcion: 'Con una lista vacía devuelve 0', condicion: `totalVendido('[]') === 0` },
          {
            descripcion: 'Con un solo pedido devuelve su valor',
            condicion: `totalVendido('[{"producto": "Tinto", "valor": 1200}]') === 1200`,
          },
          {
            descripcion: 'Funciona con cualquier otra lista',
            condicion: `totalVendido('[{"valor": 100}, {"valor": 250}]') === 350`,
          },
        ],
        pistas: [
          'Dentro de la función, lo primero es convertir: `const lista = JSON.parse(textoJson);`',
          'Recorre la lista con `for (const pedido of lista) { }` y suma `pedido.valor` a un `total` que empieza en 0.',
          'Al final, `return total;`. Si la lista está vacía, el bucle no da ninguna vuelta y el total se queda en 0.',
        ],
        solucion: [
          `const pedidos = '[{"producto": "Café", "valor": 18000}, {"producto": "Arepa", "valor": 3000}, {"producto": "Jugo", "valor": 4500}]';`,
          '',
          'function totalVendido(textoJson) {',
          '  const lista = JSON.parse(textoJson);',
          '  let total = 0;',
          '  for (const pedido of lista) {',
          '    total = total + pedido.valor;',
          '  }',
          '  return total;',
          '}',
        ].join('\n'),
      },
    ],
  }
);

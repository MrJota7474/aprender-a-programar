globalThis.Rutas.agregarLeccion(
  'javascript',
  {
    id: 'errores',
    titulo: 'Errores',
    pasos: [
      {
        id: 'idea',
        titulo: 'Cuando algo sale mal',
        texto: [
          'A veces un programa recibe datos dañados o inválidos y falla. Un **error** que nadie atiende detiene todo el programa.',
          'Con `try` pruebas un bloque de código; si algo falla, el programa salta al bloque `catch` en vez de caerse. El bloque `finally` (opcional) se ejecuta siempre, haya o no error.',
          'Tú también puedes **lanzar** un error con `throw new Error("mensaje")` cuando los datos no sirven. Un buen mensaje dice qué estuvo mal.',
        ],
        codigo: [
          'try {',
          '  const datos = JSON.parse("esto no es JSON");',
          '  console.log(datos);',
          '} catch (error) {',
          '  console.log("No se pudo leer:", error.message);',
          '} finally {',
          '  console.log("Esto se muestra siempre");',
          '}',
          '',
          'function dividir(a, b) {',
          '  if (b === 0) {',
          '    throw new Error("No se puede dividir entre cero");',
          '  }',
          '  return a / b;',
          '}',
          '',
          'try {',
          '  dividir(10, 0);',
          '} catch (error) {',
          '  console.log(error.message);',
          '}',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un JSON dañado',
        texto: [
          'Crea la función `leerJson(texto)`. Debe convertir el texto con `JSON.parse` y devolver el resultado.',
          'Si el texto está dañado, `JSON.parse` lanza un error: atrápalo con `try` / `catch` y devuelve `null` en vez de dejar que el programa se caiga.',
        ],
        codigo: [
          '// Crea aquí la función leerJson',
          'function leerJson(texto) {',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'leerJson es una función', condicion: 'typeof leerJson === "function"' },
          {
            descripcion: 'Convierte un JSON válido en objeto',
            condicion: `leerJson('{"producto": "Café", "precio": 18000}').precio === 18000`,
          },
          {
            descripcion: 'Convierte un arreglo JSON válido',
            condicion: `leerJson('[1, 2, 3]').length === 3`,
          },
          {
            descripcion: 'Un JSON dañado devuelve null sin romper el programa',
            condicion: `leerJson('{"producto": "Café", ') === null`,
          },
          { descripcion: 'Un texto vacío devuelve null', condicion: `leerJson('') === null` },
          {
            descripcion: 'Usas try y catch',
            condicion: '/try\\s*\\{/.test(codigo) && /catch/.test(codigo)',
          },
        ],
        pistas: [
          'La estructura es: `try { ... } catch (error) { ... }`',
          'Dentro del `try` haz `return JSON.parse(texto);`',
          'Dentro del `catch` devuelve `null`.',
        ],
        solucion: [
          'function leerJson(texto) {',
          '  try {',
          '    return JSON.parse(texto);',
          '  } catch (error) {',
          '    return null;',
          '  }',
          '}',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: validar un pedido',
        texto: [
          'Crea la función `validarPedido(producto, cantidad)`.',
          'Si `cantidad` **no** es un número entero positivo (0, negativos, decimales, textos, `NaN`...), la función debe lanzar un error con `throw new Error(...)`. El mensaje debe ser claro y mencionar la palabra "cantidad".',
          'Si todo está bien, devuelve el objeto `{ producto, cantidad }`.',
        ],
        codigo: [
          '// Crea aquí la función validarPedido',
          'function validarPedido(producto, cantidad) {',
          '  return null;',
          '}',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'validarPedido es una función', condicion: 'typeof validarPedido === "function"' },
          {
            descripcion: 'Un pedido válido devuelve producto y cantidad',
            condicion:
              '(() => { try { const p = validarPedido("Arepa", 3); return p.producto === "Arepa" && p.cantidad === 3; } catch (e) { return false; } })()',
          },
          {
            descripcion: 'Cantidad 1 también es válida',
            condicion:
              '(() => { try { return validarPedido("Tinto", 1).cantidad === 1; } catch (e) { return false; } })()',
          },
          {
            descripcion: 'Con cantidad 0 lanza un Error con mensaje sobre la cantidad',
            condicion:
              '(() => { try { validarPedido("Arepa", 0); return false; } catch (e) { return e instanceof Error && e.message.toLowerCase().includes("cantidad"); } })()',
          },
          {
            descripcion: 'Con cantidad negativa lanza un Error',
            condicion:
              '(() => { try { validarPedido("Arepa", -2); return false; } catch (e) { return e instanceof Error && e.message.length > 0; } })()',
          },
          {
            descripcion: 'Con cantidad decimal lanza un Error',
            condicion:
              '(() => { try { validarPedido("Arepa", 1.5); return false; } catch (e) { return e instanceof Error && e.message.length > 0; } })()',
          },
          {
            descripcion: 'Con cantidad en texto lanza un Error',
            condicion:
              '(() => { try { validarPedido("Arepa", "3"); return false; } catch (e) { return e instanceof Error && e.message.length > 0; } })()',
          },
          {
            descripcion: 'Con cantidad NaN o sin cantidad lanza un Error',
            condicion:
              '(() => { let lanzados = 0; try { validarPedido("Arepa", NaN); } catch (e) { lanzados++; } try { validarPedido("Arepa"); } catch (e) { lanzados++; } return lanzados === 2; })()',
          },
          { descripcion: 'Usas throw new Error', condicion: '/throw\\s+new\\s+Error/.test(codigo)' },
        ],
        pistas: [
          'Para saber si es un entero usa `Number.isInteger(cantidad)`; también debe ser mayor que 0.',
          'Si la validación falla: `throw new Error("La cantidad debe ser un entero positivo");`',
          'Si pasa la validación, `return { producto, cantidad };`',
        ],
        solucion: [
          'function validarPedido(producto, cantidad) {',
          '  if (!Number.isInteger(cantidad) || cantidad <= 0) {',
          '    throw new Error("La cantidad debe ser un entero positivo");',
          '  }',
          '  return { producto, cantidad };',
          '}',
        ].join('\n'),
      },
    ],
  }
);

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
          '**Ejemplo explicado línea por línea:**',
          'Línea 2: "esto no es JSON" no se puede leer, así que `JSON.parse` lanza un error. La línea 3 nunca se ejecuta: el programa salta directo al `catch`.',
          'Línea 4: `catch (error)` recibe el error en la variable `error`. Línea 5: `error.message` es el texto que explica qué pasó. Línea 7: el `finally` corre de todas formas.',
          'Líneas 10 a 15: `dividir` revisa sus datos antes de trabajar. Si `b` es 0, `throw` corta la función ahí mismo y el error viaja hasta el `catch` de la línea 19.',
          '**Error común:** creer que `catch` arregla el problema. Solo lo atrapa para que el programa no se caiga; tú decides qué hacer ahí (avisar, devolver `null`...). Y si no hay `try`, verás el error en rojo, por ejemplo `Unexpected token \'e\'... is not valid JSON`, y el programa se detiene.',
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
          'function leerJson(texto) {',
          '  // TODO 1: abre un try y, dentro, devuelve el resultado de JSON.parse(texto).',
          '  // TODO 2: en el catch, devuelve null.',
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
          'Mira el primer bloque del ejemplo de la Idea: tu función hace lo mismo, pero con `return` en vez de `console.log`.',
          'La estructura es: `try { ... } catch (error) { ... }`. Dentro del `try` haz `return JSON.parse(texto);`',
          'Completo: `try { return JSON.parse(texto); } catch (error) { return null; }`',
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
          'Dos herramientas nuevas: `Number.isInteger(x)` responde `true` si `x` es un número entero (3 sí; 1.5, "3" y `NaN` no). Y `!` significa **no**: le da la vuelta a un booleano, así que `!true` es `false`.',
        ],
        codigo: [
          'function validarPedido(producto, cantidad) {',
          '  // TODO 1: si cantidad NO es entera, o es 0 o menos, lanza un Error',
          '  //         con un mensaje que diga qué pasa con la cantidad.',
          '  // TODO 2: si pasa la revisión, devuelve { producto, cantidad }.',
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
          'Primero revisa y lanza el error si algo está mal; solo después devuelve el pedido. Es como `dividir` en la Idea.',
          'La condición une dos casos malos con `||`: `!Number.isInteger(cantidad) || cantidad <= 0`',
          '`if (...) { throw new Error("La cantidad debe ser un entero positivo"); }` y después `return { producto, cantidad };`',
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

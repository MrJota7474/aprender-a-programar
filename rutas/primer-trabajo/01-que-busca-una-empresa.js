// Ruta "Tu primer trabajo", lección 1: qué busca una empresa en alguien junior.
// Las lecciones de esta ruta hablan del oficio (portafolio, entrevistas,
// clientes), pero cada idea termina en código que se puede probar: así el
// estudiante practica Python mientras arma su plan para conseguir trabajo.
//
// Va dentro de una función: en la página todas las lecciones comparten el
// ámbito global, y dos "const" con el mismo nombre en archivos distintos la
// romperían.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    // Las pruebas son expresiones de Python y no admiten try. Este truco corre
    // la llamada dentro de un exec con try y devuelve True solo si lanzó
    // ValueError (el mismo que usa la lección de errores de la ruta Python).
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = True\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    const EJEMPLO_PREGUNTA = [
      'armar_pregunta(',
      '"El formulario de pedidos de la tienda", ',
      '"Que guardara el pedido", ',
      '"Sale KeyError: \'cantidad\'", ',
      '["Revisé el nombre del campo en el HTML", "Imprimí el diccionario que llega"])',
    ].join('');

    return {
      id: 'que-busca-una-empresa',
      titulo: 'Qué busca una empresa en un junior',
      pasos: [
        {
          id: 'idea',
          titulo: 'Las cinco cosas que miran',
          texto: [
            'Una empresa pequeña que contrata a alguien **junior** (la persona que empieza) no espera que sepa todo. Espera que **aprenda rápido**, que **avise a tiempo** cuando se atasca y que **no dañe** lo que ya funciona. En concreto, casi siempre miran cinco cosas:',
            '**1. Fundamentos**: variables, funciones, listas, diccionarios, SQL básico y cómo funciona una página. **2. Saber aprender**: leer documentación y mensajes de error sin entrar en pánico. **3. Comunicarse**: explicar qué hiciste, preguntar bien y decir «no sé» cuando no sabes. **4. Git**: guardar el trabajo con ramas y pull requests. **5. Pruebas**: comprobar que tu código hace lo que dices que hace.',
            'Lo que esta app **sí** te dio: fundamentos de Python, JavaScript y SQL; páginas con HTML y CSS; las bases de computación; usar modelos de IA desde tu código; Git en una terminal simulada; y cientos de pruebas automáticas que tu código tuvo que pasar.',
            'Lo que **no** te dio, y conviene saberlo antes de una entrevista: Git y GitHub de verdad (aquí todo pasa dentro de la página), proyectos publicados en internet, un framework (como React o Django), una base de datos instalada en tu computador, trabajar con otras personas sobre el mismo código y escribir tus propias pruebas con una herramienta como `pytest`. Esta ruta, la ruta «El oficio» y tu plan de 90 días (lección 10) apuntan justo a esos huecos.',
            'Ser honesto con esto te ayuda: en una entrevista vale más «esto lo sé hacer y esto lo estoy aprendiendo» que fingir.',
          ],
          codigo: [
            '# Las cinco cosas que mira una empresa y dónde las practicaste',
            'lo_que_buscan = {',
            '    "Fundamentos": "rutas Python, JavaScript, SQL y Fundamentos",',
            '    "Saber aprender": "cada mensaje de error que leíste y arreglaste",',
            '    "Comunicarse": "esta ruta: preguntar bien y explicar en entrevistas",',
            '    "Git": "Proyectos y El oficio (simulado: falta practicarlo de verdad)",',
            '    "Pruebas": "las de cada ejercicio (falta escribir las tuyas)",',
            '}',
            '',
            'for habilidad, donde in lo_que_buscan.items():',
            '    print(habilidad + ":", donde)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Tu autoevaluación',
          texto: [
            'Antes de buscar trabajo, mírate con honestidad. Ponte una nota de 0 a 3 en cada habilidad: **0** nunca lo he hecho, **1** lo vi, **2** lo hago con ayuda y **3** lo hago solo.',
            'Completa `que_reforzar(notas)`. Recibe un diccionario `{habilidad: nota}` y devuelve una **lista** con las habilidades que tienen nota **menor que 2**, de la nota más baja a la más alta. Si dos tienen la misma nota, van en orden alfabético.',
            'No debe cambiar el diccionario que recibe: crea una lista nueva.',
          ],
          codigo: [
            'def que_reforzar(notas):',
            '    # Guarda las que tienen nota menor que 2 y ordénalas por (nota, nombre)',
            '    return []',
            '',
            '',
            'mis_notas = {"Fundamentos": 3, "Git": 1, "Pruebas": 1, "Comunicarse": 2, "Saber aprender": 0}',
            'print("Para reforzar:", que_reforzar(mis_notas))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'que_reforzar es una función', condicion: 'callable(que_reforzar)' },
            {
              descripcion: 'Con el ejemplo devuelve Saber aprender, Git y Pruebas, en ese orden',
              condicion: 'que_reforzar({"Fundamentos": 3, "Git": 1, "Pruebas": 1, "Comunicarse": 2, "Saber aprender": 0}) == ["Saber aprender", "Git", "Pruebas"]',
            },
            { descripcion: 'Si todo está en 2 o más, devuelve una lista vacía', condicion: 'que_reforzar({"Git": 2, "SQL": 3}) == []' },
            { descripcion: 'Con un diccionario vacío devuelve una lista vacía', condicion: 'que_reforzar({}) == []' },
            {
              descripcion: 'No cambia el diccionario que recibe',
              condicion: '(lambda notas: (que_reforzar(notas), notas)[1] == {"Git": 0, "SQL": 3})({"Git": 0, "SQL": 3})',
            },
          ],
          pistas: [
            'Recorre con `for habilidad, nota in notas.items():` y guarda las que cumplan `nota < 2`.',
            'Si guardas parejas `(nota, habilidad)`, `sorted(...)` las ordena primero por nota y, si empatan, por nombre.',
            'Al final saca solo los nombres: `[habilidad for nota, habilidad in sorted(bajas)]`.',
          ],
          solucion: [
            'def que_reforzar(notas):',
            '    # Parejas (nota, habilidad): sorted ordena por nota y desempata por nombre.',
            '    bajas = [(nota, habilidad) for habilidad, nota in notas.items() if nota < 2]',
            '    return [habilidad for nota, habilidad in sorted(bajas)]',
            '',
            '',
            'mis_notas = {"Fundamentos": 3, "Git": 1, "Pruebas": 1, "Comunicarse": 2, "Saber aprender": 0}',
            'print("Para reforzar:", que_reforzar(mis_notas))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: preguntar bien',
          texto: [
            'En un trabajo te vas a atascar, y es normal. Lo que distingue a un buen junior es **cómo pide ayuda**: con el contexto, lo que esperaba, lo que pasó y lo que ya intentó. Así quien te ayuda no tiene que adivinar, y se nota que trabajaste antes de preguntar. Tampoco te quedes atascado días en silencio: acuerda con tu equipo cuánto tiempo intentar solo antes de avisar.',
            'Crea `armar_pregunta(contexto, esperaba, obtuve, intentos)`. Los tres primeros son textos e `intentos` es una lista de textos. Devuelve un solo texto con estas líneas, unidas con salto de línea (`"\\n"`):',
            '`Contexto: ...`, `Esperaba: ...`, `Obtuve: ...`, `Ya intenté:` y después una línea `- ...` por cada intento. Quita los espacios sobrantes al comienzo y al final de cada parte con `.strip()`.',
            'Si `intentos` está vacío, lanza `ValueError`: primero hay que intentar algo. Si el contexto, lo que esperabas o lo que obtuviste quedan vacíos, también lanza `ValueError`.',
          ],
          codigo: [
            'def armar_pregunta(contexto, esperaba, obtuve, intentos):',
            '    # Valida, arma una lista de líneas y únelas con "\\n".join(...)',
            '    return ""',
            '',
            '',
            'print(armar_pregunta(',
            '    "El formulario de pedidos de la tienda",',
            '    "Que guardara el pedido",',
            '    "Sale KeyError: \'cantidad\'",',
            '    ["Revisé el nombre del campo en el HTML", "Imprimí el diccionario que llega"],',
            '))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'armar_pregunta es una función', condicion: 'callable(armar_pregunta)' },
            {
              descripcion: 'Empieza con Contexto, Esperaba y Obtuve, en ese orden',
              condicion: EJEMPLO_PREGUNTA + '.splitlines()[:3] == ["Contexto: El formulario de pedidos de la tienda", "Esperaba: Que guardara el pedido", "Obtuve: Sale KeyError: \'cantidad\'"]',
            },
            {
              descripcion: 'Después dice "Ya intenté:" y un "- " por cada intento',
              condicion: EJEMPLO_PREGUNTA + '.splitlines()[3:] == ["Ya intenté:", "- Revisé el nombre del campo en el HTML", "- Imprimí el diccionario que llega"]',
            },
            {
              descripcion: 'Quita los espacios sobrantes de cada parte',
              condicion: 'armar_pregunta("  La caja ", " Total 100 ", "Total 0  ", ["  Leí el error "]) == "Contexto: La caja\\nEsperaba: Total 100\\nObtuve: Total 0\\nYa intenté:\\n- Leí el error"',
            },
            { descripcion: 'Sin intentos lanza ValueError', condicion: lanzaValueError('armar_pregunta("La caja", "100", "0", [])') },
            { descripcion: 'Con el contexto vacío lanza ValueError', condicion: lanzaValueError('armar_pregunta("   ", "100", "0", ["Leí el error"])') },
            { descripcion: 'Sin decir qué obtuviste lanza ValueError', condicion: lanzaValueError('armar_pregunta("La caja", "100", "", ["Leí el error"])') },
          ],
          pistas: [
            'Empieza validando: `if not intentos: raise ValueError("Primero intenta algo")`. Para los textos, `if not contexto.strip():` detecta que están vacíos o solo tienen espacios.',
            'Arma una lista: `lineas = ["Contexto: " + contexto.strip(), "Esperaba: " + esperaba.strip(), "Obtuve: " + obtuve.strip(), "Ya intenté:"]`.',
            'Agrega cada intento con `lineas.append("- " + intento.strip())` y termina con `return "\\n".join(lineas)`.',
          ],
          solucion: [
            'def armar_pregunta(contexto, esperaba, obtuve, intentos):',
            '    if not intentos:',
            '        raise ValueError("Antes de preguntar, intenta algo y cuéntalo")',
            '    for parte in (contexto, esperaba, obtuve):',
            '        if not parte.strip():',
            '            raise ValueError("Falta el contexto, lo que esperabas o lo que obtuviste")',
            '    lineas = [',
            '        "Contexto: " + contexto.strip(),',
            '        "Esperaba: " + esperaba.strip(),',
            '        "Obtuve: " + obtuve.strip(),',
            '        "Ya intenté:",',
            '    ]',
            '    for intento in intentos:',
            '        lineas.append("- " + intento.strip())',
            '    return "\\n".join(lineas)',
            '',
            '',
            'print(armar_pregunta(',
            '    "El formulario de pedidos de la tienda",',
            '    "Que guardara el pedido",',
            '    "Sale KeyError: \'cantidad\'",',
            '    ["Revisé el nombre del campo en el HTML", "Imprimí el diccionario que llega"],',
            '))',
          ].join('\n'),
        },
      ],
    };
  })()
);

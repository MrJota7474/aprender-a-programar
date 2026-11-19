// Ruta "Tu primer trabajo", lección 4: la hoja de vida sin experiencia.
// La hoja de vida se representa como un diccionario de Python: así el
// estudiante ve que "revisarla" es aplicar reglas claras, y las reglas son
// las mismas que usaría una persona al leerla.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const PROYECTO_TIENDA = [
      'tienda = {',
      '    "nombre": "Tienda de Don Pepe",',
      '    "problema": "pedidos en línea para una tienda de barrio",',
      '    "tecnologias": ["Python", "SQL", "HTML"],',
      '    "enlace": "https://github.com/tu-usuario/tienda",',
      '}',
    ];

    const LINEA_SOLUCION = [
      'def unir(palabras):',
      '    # "Python, SQL y HTML": comas entre todas menos las dos últimas, que van con "y".',
      '    if len(palabras) == 1:',
      '        return palabras[0]',
      '    return ", ".join(palabras[:-1]) + " y " + palabras[-1]',
      '',
      '',
      'def linea_de_proyecto(proyecto):',
      '    linea = proyecto["nombre"] + ": " + proyecto["problema"] + ". Hecho con " + unir(proyecto["tecnologias"]) + "."',
      '    if proyecto.get("enlace"):',
      '        linea += " Código: " + proyecto["enlace"]',
      '    return linea',
    ];

    // Hoja de vida de ejemplo para el reto: tiene varios problemas a propósito.
    const HOJA = [
      'hoja = {',
      '    "perfil": "Desarrollador junior. Hago páginas y automatizaciones para negocios pequeños.",',
      '    "contacto": {"correo": "tu.correo@ejemplo.com", "github": ""},',
      '    "habilidades": ["Python", "SQL", "Docker"],',
      '    "proyectos": [',
      '        {"nombre": "Tienda", "tecnologias": ["Python", "SQL"], "enlace": ""},',
      '    ],',
      '}',
    ];

    const DATOS = (perfil, github, habilidades, proyectos) =>
      `{"perfil": ${perfil}, "contacto": {"github": ${github}}, "habilidades": ${habilidades}, "proyectos": ${proyectos}}`;
    const DOS_PROYECTOS =
      '[{"nombre": "Tienda", "tecnologias": ["Python", "SQL"], "enlace": "https://a.example"}, ' +
      '{"nombre": "Reseñas", "tecnologias": ["python", "IA"], "enlace": "https://b.example"}]';

    return {
      id: 'hoja-de-vida',
      titulo: 'Hoja de vida sin experiencia',
      pasos: [
        {
          id: 'idea',
          titulo: 'Proyectos en vez de cargos',
          texto: [
            'Si nunca has trabajado programando, tu hoja de vida no debe esconderlo: debe **mostrar lo que sí has hecho**. La sección central no es «Experiencia» sino **«Proyectos»**: qué problema resuelve cada uno, con qué está hecho y un enlace para verlo.',
            'Un orden que funciona, en **una página**: **datos de contacto** (nombre, ciudad, correo, celular, GitHub y portafolio); un **perfil** de dos o tres líneas que diga qué haces y para quién; **proyectos** (dos a cuatro); **habilidades técnicas**; **formación** (estudios formales y lo que aprendiste por tu cuenta, dicho así, sin adornos); e **idiomas** con tu nivel real.',
            '**Habilidades**: pon solo las que puedas defender en una entrevista **con un proyecto**. Si escribes «Docker» y te preguntan dónde lo usaste, necesitas una respuesta. Nada de barras de porcentaje («Python 80 %»): no dicen nada concreto.',
            'Los trabajos que no son de programación **sí cuentan**: atender una tienda o un negocio familiar muestra responsabilidad y trato con clientes, justo lo que valora un negocio pequeño. Ponlos cortos, después de los proyectos.',
            'Muchas hojas de vida en Colombia llevan foto; si la pones, que sea sencilla. No hace falta poner tu número de cédula, tu dirección exacta ni tu estado civil. Y nunca inventes experiencia: se nota en la primera pregunta técnica.',
          ],
          codigo: [
            '# Lo mismo dicho de dos formas',
            'sin_experiencia = "Experiencia: ninguna"',
            'con_proyectos = "Proyectos: Tienda de Don Pepe: pedidos en línea para una tienda de barrio. Hecho con Python, SQL y HTML."',
            '',
            'print("Así no:", sin_experiencia)',
            'print("Así sí:", con_proyectos)',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'Una línea por proyecto',
          texto: [
            'Cada proyecto de tu hoja de vida cabe en una línea que siempre sigue la misma forma: `Nombre: problema. Hecho con A, B y C. Código: enlace`.',
            'Completa `linea_de_proyecto(proyecto)`. El proyecto es un diccionario con `"nombre"`, `"problema"`, `"tecnologias"` (una lista) y `"enlace"`. Las tecnologías se unen **como en español**: una sola queda sola (`Python`), dos van con «y» (`Python y SQL`) y tres o más llevan comas y una «y» antes de la última (`Python, SQL y HTML`).',
            'Si el enlace está vacío o no existe, la línea termina en el punto de las tecnologías, sin `Código:`. Para eso te sirve `proyecto.get("enlace")`.',
          ],
          codigo: [
            ...PROYECTO_TIENDA,
            '',
            '',
            'def linea_de_proyecto(proyecto):',
            '    # Arma: nombre + ": " + problema + ". Hecho con " + tecnologías unidas + "."',
            '    return ""',
            '',
            '',
            'print(linea_de_proyecto(tienda))',
          ].join('\n'),
          pruebas: [
            { descripcion: 'linea_de_proyecto es una función', condicion: 'callable(linea_de_proyecto)' },
            {
              descripcion: 'Arma la línea completa de la tienda',
              condicion: 'linea_de_proyecto(tienda) == "Tienda de Don Pepe: pedidos en línea para una tienda de barrio. Hecho con Python, SQL y HTML. Código: https://github.com/tu-usuario/tienda"',
            },
            {
              descripcion: 'Con dos tecnologías las une con "y"',
              condicion: 'linea_de_proyecto({"nombre": "Ventas", "problema": "reporte del mes", "tecnologias": ["SQL", "Python"], "enlace": "https://x.example"}) == "Ventas: reporte del mes. Hecho con SQL y Python. Código: https://x.example"',
            },
            {
              descripcion: 'Con una sola tecnología la deja sola',
              condicion: 'linea_de_proyecto({"nombre": "Bot", "problema": "responde preguntas", "tecnologias": ["Python"], "enlace": "https://y.example"}) == "Bot: responde preguntas. Hecho con Python. Código: https://y.example"',
            },
            {
              descripcion: 'Sin enlace no escribe "Código:"',
              condicion: 'linea_de_proyecto({"nombre": "Bot", "problema": "responde preguntas", "tecnologias": ["Python"], "enlace": ""}) == "Bot: responde preguntas. Hecho con Python."',
            },
            {
              descripcion: 'Funciona aunque el diccionario no traiga "enlace"',
              condicion: 'linea_de_proyecto({"nombre": "Bot", "problema": "responde preguntas", "tecnologias": ["Python"]}) == "Bot: responde preguntas. Hecho con Python."',
            },
          ],
          pistas: [
            'Para unir: si la lista tiene un elemento, es ese. Si no, `", ".join(lista[:-1]) + " y " + lista[-1]`: con dos elementos da «Python y SQL» y con tres «Python, SQL y HTML».',
            'La base es `proyecto["nombre"] + ": " + proyecto["problema"] + ". Hecho con " + tecnologias + "."`.',
            'Al final: `if proyecto.get("enlace"):` agrega `" Código: " + proyecto["enlace"]`. Un texto vacío cuenta como falso en el `if`.',
          ],
          solucion: [...PROYECTO_TIENDA, '', '', ...LINEA_SOLUCION, '', '', 'print(linea_de_proyecto(tienda))'].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: revisar la hoja antes de enviarla',
          texto: [
            'Antes de mandar tu hoja de vida, pásale una revisión. Crea `revisar_hoja(hoja)`, que devuelve una lista de avisos **en este orden**:',
            '1. `"perfil muy largo"` si el perfil pasa de 300 caracteres. 2. `"falta GitHub"` si el contacto no tiene `"github"` o está vacío. 3. `"pocos proyectos"` si hay menos de 2. 4. `"sin enlace: <nombre>"` por cada proyecto sin enlace, en el orden de la lista. 5. `"sin proyecto: <habilidad>"` por cada habilidad que **ningún** proyecto use, en el orden de las habilidades.',
            'La regla 5 es la más importante: si dices que sabes algo, un proyecto lo debe mostrar. Compara sin importar mayúsculas: «python» en un proyecto cuenta para «Python» en las habilidades.',
            'Si la hoja está bien, devuelve una lista vacía. No cambies el diccionario que recibes.',
          ],
          codigo: [
            ...HOJA,
            '',
            '',
            'def revisar_hoja(hoja):',
            '    avisos = []',
            '    # Revisa las cinco reglas en orden y agrega un aviso por cada problema',
            '    return avisos',
            '',
            '',
            'for aviso in revisar_hoja(hoja):',
            '    print("-", aviso)',
          ].join('\n'),
          pruebas: [
            { descripcion: 'revisar_hoja es una función', condicion: 'callable(revisar_hoja)' },
            {
              descripcion: 'Con la hoja de ejemplo da los cuatro avisos en orden',
              condicion: 'revisar_hoja(hoja) == ["falta GitHub", "pocos proyectos", "sin enlace: Tienda", "sin proyecto: Docker"]',
            },
            {
              descripcion: 'Una hoja bien hecha no tiene avisos (y no importan las mayúsculas)',
              condicion: 'revisar_hoja(' + DATOS('"Junior en Python."', '"https://github.com/yo"', '["Python", "SQL", "ia"]', DOS_PROYECTOS) + ') == []',
            },
            {
              descripcion: 'Avisa "perfil muy largo" si pasa de 300 caracteres',
              condicion: 'revisar_hoja(' + DATOS('"a" * 301', '"https://github.com/yo"', '[]', DOS_PROYECTOS) + ') == ["perfil muy largo"]',
            },
            {
              descripcion: 'Con 300 caracteres exactos todavía está bien',
              condicion: 'revisar_hoja(' + DATOS('"a" * 300', '"https://github.com/yo"', '[]', DOS_PROYECTOS) + ') == []',
            },
            {
              descripcion: 'Sin "github" en el contacto avisa "falta GitHub"',
              condicion: 'revisar_hoja({"perfil": "", "contacto": {}, "habilidades": [], "proyectos": ' + DOS_PROYECTOS + '}) == ["falta GitHub"]',
            },
            {
              descripcion: 'Avisa cada habilidad sin proyecto, en orden',
              condicion: 'revisar_hoja(' + DATOS('""', '"https://github.com/yo"', '["Docker", "SQL", "React"]', DOS_PROYECTOS) + ') == ["sin proyecto: Docker", "sin proyecto: React"]',
            },
            {
              descripcion: 'No cambia la hoja que recibe',
              condicion: '(lambda copia: (revisar_hoja(hoja), hoja == copia)[1])(__import__("copy").deepcopy(hoja))',
            },
          ],
          pistas: [
            'Las tres primeras reglas son un `if` cada una: `len(hoja["perfil"]) > 300`, `not hoja["contacto"].get("github")` y `len(hoja["proyectos"]) < 2`.',
            'Para la regla 4: `for proyecto in hoja["proyectos"]:` y `if not proyecto.get("enlace"): avisos.append("sin enlace: " + proyecto["nombre"])`.',
            'Para la regla 5, junta primero todas las tecnologías en minúsculas: `usadas = {t.lower() for p in hoja["proyectos"] for t in p["tecnologias"]}`. Después revisa `habilidad.lower() not in usadas`.',
          ],
          solucion: [
            ...HOJA,
            '',
            '',
            'def revisar_hoja(hoja):',
            '    avisos = []',
            '    if len(hoja["perfil"]) > 300:',
            '        avisos.append("perfil muy largo")',
            '    if not hoja["contacto"].get("github"):',
            '        avisos.append("falta GitHub")',
            '    if len(hoja["proyectos"]) < 2:',
            '        avisos.append("pocos proyectos")',
            '    for proyecto in hoja["proyectos"]:',
            '        if not proyecto.get("enlace"):',
            '            avisos.append("sin enlace: " + proyecto["nombre"])',
            '    # Un conjunto con todo lo que usan los proyectos, en minúsculas para comparar sin importar cómo se escribió.',
            '    usadas = {tecnologia.lower() for proyecto in hoja["proyectos"] for tecnologia in proyecto["tecnologias"]}',
            '    for habilidad in hoja["habilidades"]:',
            '        if habilidad.lower() not in usadas:',
            '            avisos.append("sin proyecto: " + habilidad)',
            '    return avisos',
            '',
            '',
            'for aviso in revisar_hoja(hoja):',
            '    print("-", aviso)',
          ].join('\n'),
        },
      ],
    };
  })()
);

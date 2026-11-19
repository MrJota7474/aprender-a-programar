// Ruta "Tu primer trabajo", lección 7: trabajos que se le pueden ofrecer a un
// negocio pequeño en Colombia, y qué rutas de la app sirven para cada uno.
// Los ejercicios son dos piezas reales de esos trabajos: el enlace de
// WhatsApp de una página y las alertas de un inventario en hoja de cálculo.
globalThis.Rutas.agregarLeccion(
  'primer-trabajo',
  (() => {
    const lanzaValueError = (llamada) => {
      const trozo = 'try:\n    ' + llamada + '\nexcept ValueError as e:\n    ok = True\n';
      return `bool((lambda ns: (exec(${JSON.stringify(trozo)}, globals(), ns), ns.get("ok"))[1])({}))`;
    };

    // El inventario como lo exporta una hoja de cálculo a CSV: con espacios
    // de más y una fila vacía, como pasa de verdad.
    const INVENTARIO = [
      'INVENTARIO = """producto,existencias,minimo',
      'Arepa de queso,4,10',
      'Tinto,50,20',
      'Buñuelo, 3 ,5',
      ',,',
      'Empanada,0,8',
      '"""',
    ];

    return {
      id: 'negocios-pequenos',
      titulo: 'Trabajos para negocios pequeños',
      pasos: [
        {
          id: 'idea',
          titulo: 'Lo que necesita un negocio de barrio',
          texto: [
            'Una panadería, una peluquería o una tienda no necesitan «una app». Necesitan **vender más o perder menos tiempo**. Si hablas en esos términos, te entienden; si hablas de frameworks, no.',
            'Cinco trabajos que puedes ofrecer con lo que aprendiste: **1. Página del negocio** con horario, ubicación y un botón de WhatsApp (rutas Páginas web y JavaScript). **2. Catálogo** de productos con precios que el dueño pueda actualizar (Páginas web, JavaScript y datos en JSON). **3. Inventario** en una hoja de cálculo, con un programa que avisa qué hay que pedir (Python). **4. Reporte de ventas** del mes: qué se vende más, qué días se vende menos (SQL y Python). **5. Citas o domicilios**: un formulario que guarda los pedidos y una lista para el negocio (todas las anteriores, como en la ruta Proyectos).',
            'Antes de ofrecer algo, pregunta cómo trabajan hoy: muchas veces el inventario ya vive en una hoja de cálculo o en un cuaderno, y lo mejor es **automatizar lo que ya usan** en vez de cambiarles todo. Lo que la app no te enseñó (publicar la página en internet, un dominio propio) lo ves en la ruta «Entender proyectos hechos con IA».',
            'Piensa también en quién lo va a mantener: algo sencillo que el dueño entiende vale más que algo impresionante que se daña y nadie sabe arreglar.',
          ],
          codigo: [
            'trabajos = [',
            '    ("Página con WhatsApp", "que lo encuentren y le escriban", ["Páginas web", "JavaScript"]),',
            '    ("Catálogo", "mostrar productos y precios al día", ["Páginas web", "JavaScript"]),',
            '    ("Inventario automatizado", "saber qué pedir sin contar a mano", ["Python"]),',
            '    ("Reporte de ventas", "ver qué se vende y cuándo", ["SQL", "Python"]),',
            '    ("Citas o domicilios", "recibir pedidos ordenados", ["Páginas web", "JavaScript", "Python", "SQL"]),',
            ']',
            '',
            'for nombre, para_que, rutas in trabajos:',
            '    print(nombre + ": para " + para_que + ". Rutas: " + ", ".join(rutas))',
          ].join('\n'),
        },
        {
          id: 'practica',
          titulo: 'El botón de WhatsApp',
          texto: [
            'El botón más pedido en una página de negocio abre WhatsApp con un mensaje listo. Es un enlace con esta forma: `https://wa.me/573001234567?text=Hola`. El número va **en formato internacional**: el código de Colombia (`57`) y el celular de 10 dígitos, sin `+`, espacios ni guiones.',
            'Completa `enlace_whatsapp(numero, mensaje)`. Quita del número todo lo que no sea dígito. Si quedan 10 dígitos que empiezan con `3`, agrégale `57` adelante; si quedan 12 que empiezan con `573`, ya está bien; cualquier otra cosa lanza `ValueError`. El número del ejemplo es inventado.',
            'El mensaje no puede ir con espacios ni tildes dentro de una URL: se **codifica** con `quote(mensaje, safe="")` (ya está importado), que convierte un espacio en `%20` y la ñ en `%C3%B1`. Si el mensaje está vacío, el enlace termina en el número, sin `?text=`.',
          ],
          codigo: [
            'from urllib.parse import quote',
            '',
            '',
            'def enlace_whatsapp(numero, mensaje):',
            '    # Deja solo los dígitos, valida, y arma el enlace',
            '    return ""',
            '',
            '',
            'print(enlace_whatsapp("300 123 4567", "Hola, quiero 2 arepas"))',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Arma el enlace con 57 y el mensaje codificado',
              condicion: 'enlace_whatsapp("300 123 4567", "Hola, quiero 2 arepas") == "https://wa.me/573001234567?text=Hola%2C%20quiero%202%20arepas"',
            },
            {
              descripcion: 'Acepta el número con +57 y guiones',
              condicion: 'enlace_whatsapp("+57 300-123-4567", "Hola") == "https://wa.me/573001234567?text=Hola"',
            },
            { descripcion: 'Codifica la ñ', condicion: 'enlace_whatsapp("3001234567", "Buñuelo") == "https://wa.me/573001234567?text=Bu%C3%B1uelo"' },
            { descripcion: 'Sin mensaje no pone ?text=', condicion: 'enlace_whatsapp("3001234567", "") == "https://wa.me/573001234567"' },
            { descripcion: 'Un número fijo de 7 dígitos lanza ValueError', condicion: lanzaValueError('enlace_whatsapp("6012345", "Hola")') },
            { descripcion: 'Un número de 10 dígitos que no empieza en 3 lanza ValueError', condicion: lanzaValueError('enlace_whatsapp("6011234567", "Hola")') },
          ],
          pistas: [
            'Para dejar solo los dígitos: `digitos = "".join(c for c in numero if c.isdigit())`.',
            'Valida con dos casos: `if len(digitos) == 10 and digitos.startswith("3"): digitos = "57" + digitos`, luego `elif not (len(digitos) == 12 and digitos.startswith("573")): raise ValueError("Número de celular no válido")`.',
            'Arma `enlace = "https://wa.me/" + digitos` y, `if mensaje:`, súmale `"?text=" + quote(mensaje, safe="")`.',
          ],
          solucion: [
            'from urllib.parse import quote',
            '',
            '',
            'def enlace_whatsapp(numero, mensaje):',
            '    digitos = "".join(caracter for caracter in numero if caracter.isdigit())',
            '    if len(digitos) == 10 and digitos.startswith("3"):',
            '        digitos = "57" + digitos',
            '    elif not (len(digitos) == 12 and digitos.startswith("573")):',
            '        raise ValueError("Número de celular no válido: " + numero)',
            '    enlace = "https://wa.me/" + digitos',
            '    if mensaje:',
            '        # safe="" codifica todo, incluso la "/" y la ",", para que la URL no se rompa.',
            '        enlace += "?text=" + quote(mensaje, safe="")',
            '    return enlace',
            '',
            '',
            'print(enlace_whatsapp("300 123 4567", "Hola, quiero 2 arepas"))',
          ].join('\n'),
        },
        {
          id: 'reto',
          titulo: 'Reto: qué pedir al proveedor',
          texto: [
            'El dueño lleva el inventario en una hoja de cálculo y la exporta como **CSV** (texto separado por comas). Cada fila tiene `producto`, `existencias` y `minimo`. Quiere saber cada mañana **qué pedir**, sin contar a mano.',
            'Crea `pedido_sugerido(texto_csv)`. Lee el CSV con `csv.DictReader(io.StringIO(texto_csv))`. Por cada producto con existencias **iguales o menores** que su mínimo, sugiere pedir lo necesario para llegar al **doble del mínimo**: `2 * minimo - existencias`. Devuelve una lista de tuplas `(producto, cantidad)` de la cantidad **mayor a la menor**; si empatan, por nombre.',
            'Los datos reales vienen sucios: quita los espacios de cada celda y salta las filas sin producto. Si una cantidad no es un número, lanza `ValueError` que diga en qué producto: es mejor avisar que adivinar. En un trabajo real, un programa así puede correr solo cada mañana y mandar la lista al dueño; Python también lee archivos de Excel con librerías como `openpyxl`.',
          ],
          codigo: [
            'import csv',
            'import io',
            '',
            ...INVENTARIO,
            '',
            '',
            'def pedido_sugerido(texto_csv):',
            '    sugerencias = []',
            '    # Recorre las filas, limpia, convierte a int y decide qué pedir',
            '    return sugerencias',
            '',
            '',
            'for producto, cantidad in pedido_sugerido(INVENTARIO):',
            '    print("Pedir", cantidad, "de", producto)',
          ].join('\n'),
          pruebas: [
            {
              descripcion: 'Con el inventario de ejemplo sugiere arepas, empanadas y buñuelos, en ese orden',
              condicion: 'pedido_sugerido(INVENTARIO) == [("Arepa de queso", 16), ("Empanada", 16), ("Buñuelo", 7)]',
            },
            { descripcion: 'Justo en el mínimo también hay que pedir', condicion: 'pedido_sugerido("producto,existencias,minimo\\nPan,5,5") == [("Pan", 5)]' },
            { descripcion: 'Si todo está sobre el mínimo, no pide nada', condicion: 'pedido_sugerido("producto,existencias,minimo\\nPan,9,5") == []' },
            { descripcion: 'Una cantidad que no es número lanza ValueError', condicion: lanzaValueError('pedido_sugerido("producto,existencias,minimo\\nPan,muchos,5")') },
            { descripcion: 'Un CSV solo con encabezados da una lista vacía', condicion: 'pedido_sugerido("producto,existencias,minimo\\n") == []' },
          ],
          pistas: [
            '`for fila in csv.DictReader(io.StringIO(texto_csv)):` y adentro `producto = (fila["producto"] or "").strip()`. Si queda vacío, `continue`.',
            'Convierte con `int(fila["existencias"].strip())` dentro de un `try`, y en el `except ValueError:` lanza `raise ValueError("Cantidad no válida en " + producto)`.',
            'Si `existencias <= minimo`, agrega `(producto, 2 * minimo - existencias)`. Al final ordena con `sorted(sugerencias, key=lambda s: (-s[1], s[0]))`: el signo menos pone primero las cantidades grandes.',
          ],
          solucion: [
            'import csv',
            'import io',
            '',
            ...INVENTARIO,
            '',
            '',
            'def pedido_sugerido(texto_csv):',
            '    sugerencias = []',
            '    for fila in csv.DictReader(io.StringIO(texto_csv)):',
            '        producto = (fila["producto"] or "").strip()',
            '        if not producto:',
            '            continue',
            '        try:',
            '            existencias = int(fila["existencias"].strip())',
            '            minimo = int(fila["minimo"].strip())',
            '        except ValueError:',
            '            # Mejor avisar que adivinar: una cantidad mal escrita puede costar un pedido.',
            '            raise ValueError("Cantidad no válida en " + producto)',
            '        if existencias <= minimo:',
            '            sugerencias.append((producto, 2 * minimo - existencias))',
            '    return sorted(sugerencias, key=lambda sugerencia: (-sugerencia[1], sugerencia[0]))',
            '',
            '',
            'for producto, cantidad in pedido_sugerido(INVENTARIO):',
            '    print("Pedir", cantidad, "de", producto)',
          ].join('\n'),
        },
      ],
    };
  })()
);

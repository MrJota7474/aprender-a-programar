// app.js — La interfaz: une rutas, lecciones, editor, motores y progreso.
//
// Idea central: hay UN solo objeto "estado" con todo lo que la página
// necesita saber. Cuando algo cambia, se crea un estado nuevo y se vuelve
// a pintar la parte de la pantalla que depende de él.
//
// Hay dos vistas: el inicio (todas las rutas) y el curso (una ruta abierta).
// La dirección de la página decide cuál se ve: "#javascript" abre esa ruta
// y sin "#" se ve el inicio. Así funcionan el botón Atrás y los enlaces.

(function () {
  'use strict';

  const { Rutas, Mapa, Certificados, Motores, Progreso, Logros, Iconos, formatearTexto, resaltar } = globalThis;

  const ESPERA_AUTOGUARDADO_MS = 400;
  const MAXIMO_LINEAS_CONSOLA = 200;
  const MAXIMO_FILAS_TABLA = 100;
  const SANGRIA_POR_DEFECTO = '  ';
  const TITULO_APP = 'Aprender a programar';

  const porId = (id) => document.getElementById(id);
  const nodos = Object.freeze({
    aviso: porId('aviso'),
    migaInicio: porId('miga-inicio'),
    migaSeparador: porId('miga-separador'),
    migaRuta: porId('miga-ruta'),
    avance: porId('avance'),
    avanceBarra: porId('avance-barra'),
    avanceTexto: porId('avance-texto'),
    resultados: porId('resultados'),
    zonaVista: porId('zona-vista'),
    vistaPrevia: porId('vista-previa'),
    vistaVacia: porId('vista-vacia'),
    inicioResumen: porId('inicio-resumen'),
    inicioSaludo: porId('inicio-saludo'),
    inicioEstadisticas: porId('inicio-estadisticas'),
    inicioContinuar: porId('inicio-continuar'),
    inicioActividad: porId('inicio-actividad'),
    seccionLogros: porId('seccion-logros'),
    listaLogros: porId('lista-logros'),
    cursoIcono: porId('curso-icono'),
    cursoRuta: porId('curso-ruta'),
    cursoPosicion: porId('curso-posicion'),
    cursoAnillo: porId('curso-anillo'),
    resaltado: porId('resaltado'),
    editorArchivo: porId('editor-archivo'),
    editorLenguaje: porId('editor-lenguaje'),
    pruebasResumen: porId('pruebas-resumen'),
    estadoEjecucion: porId('estado-ejecucion'),
    tablas: porId('tablas'),
    referencia: porId('referencia'),
    referenciaContenido: porId('referencia-contenido'),
    vistaInicio: porId('vista-inicio'),
    inicioTitulo: porId('inicio-titulo'),
    listaRutas: porId('lista-rutas'),
    vistaMapa: porId('vista-mapa'),
    vistaCertificados: porId('vista-certificados'),
    vistaCurso: porId('vista-curso'),
    menu: porId('menu'),
    listaLecciones: porId('lista-lecciones'),
    menuVideos: porId('menu-videos'),
    pestanas: porId('pestanas'),
    ubicacion: porId('paso-ubicacion'),
    titulo: porId('paso-titulo'),
    texto: porId('paso-texto'),
    numeros: porId('numeros'),
    codigo: porId('codigo'),
    pistas: porId('pistas'),
    consola: porId('consola'),
    error: porId('error'),
    zonaPruebas: porId('zona-pruebas'),
    pruebas: porId('pruebas'),
    felicitacion: porId('felicitacion'),
    botonMenu: porId('boton-menu'),
    botonEjecutar: porId('boton-ejecutar'),
    botonPista: porId('boton-pista'),
    botonReiniciar: porId('boton-reiniciar'),
    botonBorrar: porId('boton-borrar'),
    botonAnterior: porId('boton-anterior'),
    botonSiguiente: porId('boton-siguiente'),
    menuFondo: porId('menu-fondo'),
    contenido: porId('contenido'),
    columnaLeccion: porId('columna-leccion'),
    columnaTaller: porId('columna-taller'),
    verLeccion: porId('ver-leccion'),
    verCodigo: porId('ver-codigo'),
    irAlCodigo: porId('ir-al-codigo'),
    leccionSegmentos: porId('leccion-segmentos'),
    leccionCuenta: porId('leccion-cuenta'),
    ejecutarTexto: porId('ejecutar-texto'),
    ayudaResultado: porId('ayuda-resultado'),
  });

  // Desde este ancho la lección y el editor van lado a lado (cada uno con su
  // propio desplazamiento) y el menú es un cajón. Debe coincidir con el
  // @media de css/estilos.css. Se eligió 1100 px porque por debajo cada
  // columna quedaría de menos de 500 px y el editor se sentiría apretado.
  const PANTALLA_PARTIDA = window.matchMedia('(min-width: 1100px)');
  // Desde este ancho cabe además el menú de lecciones como columna fija.
  const PANTALLA_CON_MENU = window.matchMedia('(min-width: 1500px)');

  // En algunos navegadores (modo privado, permisos bloqueados) hasta LEER
  // localStorage lanza un error. En ese caso se usa un almacén que no guarda.
  function obtenerAlmacen() {
    try {
      return window.localStorage;
    } catch (error) {
      return {
        getItem: () => null,
        setItem: () => {
          throw new Error('Almacenamiento no disponible');
        },
      };
    }
  }

  const ALMACEN = obtenerAlmacen();

  // ruta === null significa "estamos en el inicio".
  let estado = {
    progreso: Progreso.cargar(ALMACEN),
    ruta: null,
    indiceLeccion: 0,
    indicePaso: 0,
    pistasVistas: 0,
    solucionVisible: false,
    // Antes de mostrar la solución se pide confirmar (es mejor intentarlo).
    confirmandoSolucion: false,
    // En pantallas angostas solo cabe una mitad: 'leccion' o 'codigo'.
    panel: 'leccion',
    ejecutando: false,
    // Sube cada vez que el estudiante cambia de paso, de ruta o reinicia.
    // Sirve para descartar el resultado de una ejecución que quedó vieja.
    turno: 0,
  };
  // Lo que se reinicia cada vez que se abre un paso: las pistas vistas, la
  // solución y la mitad visible en el celular (siempre se empieza leyendo).
  const AL_ABRIR_UN_PASO = Object.freeze({
    pistasVistas: 0,
    solucionVisible: false,
    confirmandoSolucion: false,
    panel: 'leccion',
  });
  let temporizadorGuardado = null;
  let tabuladorLibre = false;

  const leccionActual = () => estado.ruta.lecciones[estado.indiceLeccion];
  const pasoActual = () => leccionActual().pasos[estado.indicePaso];
  const claveDe = (leccion, paso) => Progreso.clavePaso(estado.ruta.id, leccion.id, paso.id);
  const claveActual = () => claveDe(leccionActual(), pasoActual());
  const pasoHecho = (ruta, leccion, paso) =>
    estado.progreso.completados[Progreso.clavePaso(ruta.id, leccion.id, paso.id)] === true;
  const estaHecho = (leccion, paso) => pasoHecho(estado.ruta, leccion, paso);
  // El motor sale del paso abierto, no de la ruta: en un proyecto cada paso
  // puede ser de un lenguaje distinto (Rutas.motorDelPaso explica la regla).
  // Por eso se pregunta cada vez y nunca se guarda "el motor de la ruta".
  const motorActual = () => Motores.obtener(Rutas.motorDelPaso(estado.ruta, pasoActual()));
  const contarPasos = (ruta) =>
    ruta.lecciones.reduce((suma, leccion) => suma + leccion.pasos.length, 0);

  // Una ruta se puede abrir si ya tiene lecciones y existen todos sus motores.
  const estaDisponible = (ruta) => Rutas.rutaDisponible(ruta, Motores);

  // Único lugar donde cambia el progreso: así siempre queda guardado.
  function actualizarProgreso(progreso) {
    estado = { ...estado, progreso };
    nodos.aviso.hidden = Progreso.guardar(ALMACEN, progreso);
  }

  // ---------- Pequeña ayuda para crear elementos ----------

  function crear(etiqueta, opciones = {}) {
    const nodo = document.createElement(etiqueta);
    if (opciones.clase) nodo.className = opciones.clase;
    if (opciones.texto !== undefined) nodo.textContent = opciones.texto;
    // htmlSeguro SOLO recibe texto que ya pasó por formatearTexto (escapado).
    if (opciones.htmlSeguro !== undefined) nodo.innerHTML = opciones.htmlSeguro;
    if (opciones.alHacerClic) nodo.addEventListener('click', opciones.alHacerClic);
    (opciones.hijos || []).forEach((hijo) => nodo.append(hijo));
    return nodo;
  }

  // La barra de avance es un <div> propio (y no <progress>) para que se vea
  // igual en todos los navegadores. Los atributos aria-* le cuentan el valor
  // a los lectores de pantalla.
  function ponerAvance(barra, valor, maximo) {
    const porcentaje = maximo === 0 ? 0 : (valor / maximo) * 100;
    barra.setAttribute('aria-valuemax', String(maximo));
    barra.setAttribute('aria-valuenow', String(valor));
    barra.firstElementChild.style.width = porcentaje + '%';
  }

  function crearBarra(valor, maximo, descripcion, claseExtra) {
    const barra = crear('div', {
      clase: 'barra' + (claseExtra ? ' ' + claseExtra : ''),
      hijos: [crear('div', { clase: 'barra__relleno' })],
    });
    barra.setAttribute('role', 'progressbar');
    barra.setAttribute('aria-valuemin', '0');
    barra.setAttribute('aria-label', descripcion);
    ponerAvance(barra, valor, maximo);
    return barra;
  }

  // ---------- Vista de inicio: un tablero ----------

  const plural = (cantidad, singular, pluralTexto) =>
    cantidad + ' ' + (cantidad === 1 ? singular : pluralTexto);

  const ESPACIO_SVG = 'http://www.w3.org/2000/svg';
  const SEMANAS_ACTIVIDAD = 12;
  const DIAS_POR_SEMANA = 7;
  const DIAS_ACTIVIDAD = SEMANAS_ACTIVIDAD * DIAS_POR_SEMANA;
  const RADIO_ANILLO = 18;
  const TEXTO_ESTADO_LECCION = Object.freeze({
    completa: 'completa',
    empezada: 'empezada',
    pendiente: 'sin empezar',
  });

  const hoyLocal = () => Progreso.fechaLocal(new Date());

  // Los íconos de iconos.js son texto fijo del código (nunca del estudiante),
  // por eso es seguro ponerlos con innerHTML.
  function crearIcono(clase, svg) {
    const nodo = crear('span', { clase });
    nodo.setAttribute('aria-hidden', 'true');
    nodo.innerHTML = svg;
    return nodo;
  }

  function crearSvg(etiqueta, atributos) {
    const nodo = document.createElementNS(ESPACIO_SVG, etiqueta);
    Object.entries(atributos).forEach(([nombre, valor]) => nodo.setAttribute(nombre, String(valor)));
    return nodo;
  }

  // Anillo de avance: un círculo gris (riel) y encima un arco de color que
  // crece con el avance. El porcentaje va en el centro y la descripción
  // completa en aria-label para los lectores de pantalla.
  function crearAnillo(hechos, total, descripcion) {
    const porcentaje = total === 0 ? 0 : Math.round((hechos / total) * 100);
    const circunferencia = 2 * Math.PI * RADIO_ANILLO;
    const comunes = { cx: 22, cy: 22, r: RADIO_ANILLO, fill: 'none', 'stroke-width': 5 };
    const svg = crearSvg('svg', {
      viewBox: '0 0 44 44',
      class: 'anillo',
      role: 'img',
      'aria-label': descripcion + ': ' + porcentaje + ' %, ' + hechos + ' de ' + total + ' pasos',
    });
    svg.append(crearSvg('circle', { ...comunes, class: 'anillo__riel' }));
    if (hechos > 0) {
      svg.append(
        crearSvg('circle', {
          ...comunes,
          class: 'anillo__relleno',
          'stroke-linecap': 'round',
          'stroke-dasharray': circunferencia,
          'stroke-dashoffset': circunferencia * (1 - hechos / total),
          transform: 'rotate(-90 22 22)',
        })
      );
    }
    const texto = crearSvg('text', {
      class: 'anillo__texto',
      x: 22,
      y: 22,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
    });
    texto.textContent = porcentaje + '%';
    svg.append(texto);
    return svg;
  }

  // "completa" si todos sus pasos están hechos, "empezada" si hay alguno, si no "pendiente".
  function estadoDeLeccion(ruta, leccion) {
    const hechos = leccion.pasos.filter((paso) => pasoHecho(ruta, leccion, paso)).length;
    if (hechos > 0 && hechos === leccion.pasos.length) return 'completa';
    return hechos > 0 ? 'empezada' : 'pendiente';
  }

  // "Vas en: Lección 4 · Instrucciones claras". Si la lección guardada ya no
  // existe, o la ruta no se ha abierto, devuelve texto vacío.
  function textoUbicacion(ruta) {
    const ubicacion = estado.progreso.ubicaciones[ruta.id];
    const indice = ubicacion
      ? ruta.lecciones.findIndex((leccion) => leccion.id === ubicacion.leccionId)
      : -1;
    return indice === -1 ? '' : 'Vas en: Lección ' + (indice + 1) + ' · ' + ruta.lecciones[indice].titulo;
  }

  // La racha puede llegar como número o como objeto con los días; se acepta
  // cualquiera de las dos formas para no depender de un detalle de progreso.js.
  function diasDeRacha(hoy) {
    const racha = Progreso.racha(estado.progreso, hoy);
    if (typeof racha === 'number') return racha;
    return (racha && (racha.dias ?? racha.actual)) || 0;
  }

  function saludoSegunHora(hora) {
    if (hora >= 5 && hora < 12) return 'Buenos días';
    if (hora >= 12 && hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  function pintarSaludo(pasosHoy) {
    nodos.inicioSaludo.textContent = saludoSegunHora(new Date().getHours());
    nodos.inicioResumen.textContent =
      pasosHoy > 0
        ? 'Hoy llevas ' + plural(pasosHoy, 'paso', 'pasos') + '.'
        : 'Hoy aún no has practicado: un paso corto basta.';
  }

  function crearEstadistica({ clase, icono, etiqueta, valor, nota, extra }) {
    const cuerpo = [
      crear('p', { clase: 'estadistica__etiqueta', texto: etiqueta }),
      crear('p', { clase: 'estadistica__valor', texto: valor }),
      crear('p', { clase: 'estadistica__nota', texto: nota }),
    ];
    if (extra) cuerpo.push(extra);
    return crear('div', {
      clase: 'estadistica ' + clase,
      hijos: [
        crearIcono('estadistica__icono', Iconos.de(icono)),
        crear('div', { clase: 'estadistica__cuerpo', hijos: cuerpo }),
      ],
    });
  }

  function pintarEstadisticas(hoy, pasosHoy, logros) {
    const racha = diasDeRacha(hoy);
    const puntos = Progreso.puntos(estado.progreso);
    const nivel = Progreso.nivelDe(puntos);
    const conseguidos = logros.filter((logro) => logro.conseguido).length;

    let notaRacha = 'Ya practicaste hoy';
    if (pasosHoy === 0) notaRacha = racha > 0 ? 'Practica hoy para mantenerla' : 'Practica hoy para empezar una';

    nodos.inicioEstadisticas.replaceChildren(
      crearEstadistica({
        clase: 'estadistica--racha',
        icono: 'llama',
        etiqueta: 'Racha',
        valor: plural(racha, 'día', 'días'),
        nota: notaRacha,
      }),
      crearEstadistica({
        clase: 'estadistica--puntos',
        icono: 'estrella',
        etiqueta: 'Puntos',
        valor: String(puntos),
        nota: 'Nivel ' + nivel.nivel + ' · ' + nivel.puntosEnNivel + ' de ' + nivel.puntosPorNivel,
        extra: crearBarra(
          nivel.puntosEnNivel,
          nivel.puntosPorNivel,
          'Avance hacia el nivel ' + (nivel.nivel + 1),
          'barra--puntos'
        ),
      }),
      crearEstadistica({
        clase: 'estadistica--logros',
        icono: 'trofeo',
        etiqueta: 'Logros',
        valor: conseguidos + ' de ' + logros.length,
        nota: conseguidos < logros.length ? 'Se desbloquean practicando' : '¡Los tienes todos!',
      })
    );
  }

  // ----- Continúa donde ibas -----

  // Pasos hechos, totales y si se puede abrir, de cada ruta: los datos que
  // necesita Etapas (js/etapas.js) para recomendar y sumar el avance por etapa.
  function avanceDeRutas() {
    return Object.fromEntries(
      Rutas.todas().map((ruta) => [
        ruta.id,
        {
          hechos: Progreso.contarCompletados(estado.progreso, ruta),
          total: contarPasos(ruta),
          disponible: estaDisponible(ruta),
        },
      ])
    );
  }

  // La ruta destacada. La regla vive en Etapas.recomendar (pura y probada):
  // la última ruta empezada o, si no, la primera sin terminar del camino.
  function rutaParaContinuar(avance) {
    const recomendada = Etapas.recomendar(avance, estado.progreso.ultimaRuta);
    if (recomendada === null) return null;
    const algunProgreso = Object.values(avance).some((dato) => dato.hechos > 0);
    return { ...recomendada, ruta: Rutas.buscar(recomendada.rutaId), algunProgreso };
  }

  // "Empieza aquí" al primer día; "Sigue por aquí" cuando la recomendada es la
  // siguiente del camino; "Continúa donde ibas" si ya va empezada.
  function etiquetaContinuar({ continuando, algunProgreso, rutaId }) {
    const texto = continuando ? 'Continúa donde ibas' : algunProgreso ? 'Sigue por aquí' : 'Empieza aquí';
    const etapa = Etapas.etapaDe(rutaId);
    if (!etapa) return texto;
    return texto + ' · Etapa ' + (Etapas.ETAPAS.indexOf(etapa) + 1) + ': ' + etapa.titulo;
  }

  function pintarContinuar(destino) {
    if (destino === null) {
      nodos.inicioContinuar.replaceChildren();
      return;
    }
    const { ruta, continuando } = destino;
    const total = contarPasos(ruta);
    const hechos = Progreso.contarCompletados(estado.progreso, ruta);
    const lugar = buscarUbicacion(ruta, estado.progreso.ubicaciones[ruta.id]);
    const leccion = ruta.lecciones[lugar.indiceLeccion];

    const enlace = crear('a', {
      clase: 'boton boton--ruta',
      texto: continuando ? 'Continuar' : 'Empezar',
    });
    enlace.href = '#' + ruta.id;
    enlace.setAttribute('aria-label', (continuando ? 'Continuar ' : 'Empezar ') + ruta.titulo);

    const tarjeta = crear('article', {
      clase: 'continuar',
      hijos: [
        crearIcono('icono-ruta icono-ruta--grande', Iconos.deRuta(ruta.id)),
        crear('div', {
          clase: 'continuar__texto',
          hijos: [
            crear('p', {
              clase: 'continuar__etiqueta',
              texto: etiquetaContinuar(destino),
            }),
            crear('h2', { clase: 'continuar__ruta', texto: ruta.titulo }),
            crear('p', {
              clase: 'continuar__lugar',
              texto:
                'Lección ' + (lugar.indiceLeccion + 1) + ' · ' + leccion.titulo +
                ' · Paso ' + (lugar.indicePaso + 1) + ' de ' + leccion.pasos.length,
            }),
            crear('div', {
              clase: 'continuar__avance',
              hijos: [
                crearBarra(hechos, total, 'Avance en ' + ruta.titulo, 'barra--ruta barra--gruesa'),
                crear('span', { clase: 'continuar__cuenta', texto: hechos + ' de ' + total + ' pasos' }),
              ],
            }),
          ],
        }),
        enlace,
      ],
    });
    tarjeta.dataset.ruta = ruta.id;
    nodos.inicioContinuar.replaceChildren(tarjeta);
  }

  // ----- Tu actividad: calendario de calor -----

  // 0 pasos, 1-2, 3-5 y 6 o más: cuatro intensidades.
  function intensidadDeDia(pasos) {
    if (pasos <= 0) return 0;
    if (pasos <= 2) return 1;
    return pasos <= 5 ? 2 : 3;
  }

  const fechaDeTexto = (texto) => {
    const [anio, mes, dia] = texto.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  };

  const textoFecha = (texto) =>
    fechaDeTexto(texto).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  function crearLeyendaActividad() {
    const cuadros = [0, 1, 2, 3].map((n) => crear('span', { clase: 'dia dia--n' + n }));
    const leyenda = crear('p', {
      clase: 'calendario__leyenda',
      hijos: [crear('span', { texto: 'Menos' }), ...cuadros, crear('span', { texto: 'Más' })],
    });
    leyenda.setAttribute('aria-hidden', 'true');
    return leyenda;
  }

  // Las columnas son semanas (lunes arriba, domingo abajo), como en GitHub.
  // El primer día casi nunca es lunes: se agregan huecos al principio para que
  // cada día caiga en su fila.
  function pintarActividad(dias) {
    if (dias.length === 0) {
      nodos.inicioActividad.replaceChildren();
      return;
    }
    const huecos = (fechaDeTexto(dias[0].fecha).getDay() + 6) % DIAS_POR_SEMANA;
    const celdas = Array.from({ length: huecos }, () => crear('span', { clase: 'dia dia--fuera' }));
    dias.forEach(({ fecha, pasos }) => {
      const celda = crear('span', { clase: 'dia dia--n' + intensidadDeDia(pasos) });
      celda.title = textoFecha(fecha) + ': ' + (pasos === 0 ? 'sin pasos' : plural(pasos, 'paso', 'pasos'));
      celdas.push(celda);
    });

    const diasActivos = dias.filter((dia) => dia.pasos > 0).length;
    const totalPasos = dias.reduce((suma, dia) => suma + dia.pasos, 0);
    const resumen =
      'En las últimas ' + SEMANAS_ACTIVIDAD + ' semanas practicaste ' +
      plural(diasActivos, 'día', 'días') + ' y completaste ' + plural(totalPasos, 'paso', 'pasos') + '.';

    const calendario = crear('div', { clase: 'calendario', hijos: celdas });
    calendario.style.setProperty('--semanas', String(Math.ceil(celdas.length / DIAS_POR_SEMANA)));
    calendario.setAttribute('role', 'img');
    calendario.setAttribute('aria-label', resumen);

    const pie = crear('div', {
      clase: 'actividad__pie',
      hijos: [crear('p', { clase: 'actividad__resumen', texto: resumen }), crearLeyendaActividad()],
    });
    const mapa = crear('div', { clase: 'actividad__mapa', hijos: [calendario, pie] });
    nodos.inicioActividad.replaceChildren(mapa, crearDatosActividad(dias, diasActivos));
  }

  // Al lado del calendario, tres datos concretos de la misma actividad: así el
  // espacio que sobra en pantallas anchas cuenta algo útil.
  function crearDatosActividad(dias, diasActivos) {
    const semana = dias.slice(-DIAS_POR_SEMANA).reduce((suma, dia) => suma + dia.pasos, 0);
    const mejor = dias.reduce((max, dia) => (dia.pasos > max.pasos ? dia : max), dias[0]);
    const dato = (titulo, valor, detalle) =>
      crear('div', {
        clase: 'actividad__dato',
        hijos: [
          crear('dt', { texto: titulo }),
          crear('dd', {
            hijos: [
              crear('span', { clase: 'actividad__valor', texto: valor }),
              crear('span', { clase: 'actividad__detalle', texto: detalle }),
            ],
          }),
        ],
      });
    return crear('dl', {
      clase: 'actividad__datos',
      hijos: [
        dato('Esta semana', plural(semana, 'paso', 'pasos'), 'en los últimos 7 días'),
        dato('Días activos', String(diasActivos), 'de ' + dias.length + ' días'),
        mejor.pasos > 0
          ? dato('Tu mejor día', plural(mejor.pasos, 'paso', 'pasos'), textoFecha(mejor.fecha))
          : dato('Tu mejor día', 'Aún no', 'Completa un paso para empezar'),
      ],
    });
  }

  // ----- Tus rutas -----

  function crearCuadritosDeLecciones(ruta) {
    const estados = ruta.lecciones.map((leccion) => estadoDeLeccion(ruta, leccion));
    const cuadritos = ruta.lecciones.map((leccion, indice) => {
      const cuadrito = crear('span', { clase: 'cuadrito cuadrito--' + estados[indice] });
      cuadrito.title =
        'Lección ' + (indice + 1) + ' · ' + leccion.titulo + ' (' + TEXTO_ESTADO_LECCION[estados[indice]] + ')';
      return cuadrito;
    });
    const contar = (nombre) => estados.filter((e) => e === nombre).length;
    const fila = crear('div', { clase: 'cuadritos', hijos: cuadritos });
    fila.setAttribute('role', 'img');
    fila.setAttribute(
      'aria-label',
      'Lecciones de ' + ruta.titulo + ': ' +
        plural(contar('completa'), 'completa', 'completas') + ', ' +
        plural(contar('empezada'), 'empezada', 'empezadas') + ', ' +
        contar('pendiente') + ' sin empezar'
    );
    return fila;
  }

  function crearPieDeRuta(ruta, disponible) {
    if (!disponible) {
      return crear('div', {
        clase: 'tarjeta__pie',
        hijos: [crear('span', { clase: 'tarjeta__proximamente', texto: 'Próximamente' })],
      });
    }
    const total = contarPasos(ruta);
    const hechos = Progreso.contarCompletados(estado.progreso, ruta);
    let accion = 'Continuar';
    if (hechos === 0) accion = 'Empezar';
    if (hechos === total) accion = 'Repasar';
    // Una vista de teclado ve muchos "Continuar": el aria-label dice cuál ruta.
    const enlace = crear('a', { clase: 'tarjeta__accion', texto: accion + ' →' });
    enlace.href = '#' + ruta.id;
    enlace.setAttribute('aria-label', accion + ' ' + ruta.titulo);
    const ubicacion = textoUbicacion(ruta);
    return crear('div', {
      clase: 'tarjeta__pie',
      hijos: [
        ...(ubicacion ? [crear('p', { clase: 'tarjeta__ubicacion', texto: ubicacion })] : []),
        enlace,
      ],
    });
  }

  function crearTarjetaRuta(ruta) {
    const disponible = estaDisponible(ruta);
    const cuerpo = [
      // h4 porque va dentro de una etapa, que ya tiene su h3.
      crear('h4', { clase: 'tarjeta__titulo', texto: ruta.titulo }),
      crear('p', { clase: 'tarjeta__descripcion', texto: ruta.descripcion }),
    ];
    if (disponible) {
      const total = contarPasos(ruta);
      const hechos = Progreso.contarCompletados(estado.progreso, ruta);
      cuerpo.push(
        crear('div', {
          clase: 'tarjeta__avance',
          hijos: [
            crearAnillo(hechos, total, 'Avance en ' + ruta.titulo),
            crear('p', {
              clase: 'tarjeta__datos',
              texto:
                plural(ruta.lecciones.length, 'lección', 'lecciones') + ' · ' + plural(total, 'paso', 'pasos'),
            }),
          ],
        }),
        crearCuadritosDeLecciones(ruta)
      );
    }
    const tarjeta = crear('li', {
      clase: 'tarjeta' + (disponible ? '' : ' tarjeta--proxima'),
      hijos: [
        crear('div', {
          clase: 'tarjeta__franja',
          hijos: [crearIcono('icono-ruta', Iconos.deRuta(ruta.id))],
        }),
        crear('div', { clase: 'tarjeta__cuerpo', hijos: cuerpo }),
        crearPieDeRuta(ruta, disponible),
      ],
    });
    tarjeta.dataset.ruta = ruta.id;
    return tarjeta;
  }

  // ----- El camino por etapas -----

  // Cada etapa es un <details>: se pliega y despliega con clic, Enter o
  // espacio sin código extra, y los lectores de pantalla anuncian si está
  // abierta. Solo va abierta la etapa de la ruta recomendada: así, en el
  // celular, la página no mide miles de píxeles. Las plegadas siguen
  // mostrando los nombres de sus rutas en el resumen: no se esconde ninguna.
  function crearEtapa(etapa, numero, avance, rutaRecomendada) {
    const rutas = etapa.rutas.map((id) => Rutas.buscar(id)).filter(Boolean);
    const { hechos, total } = Etapas.avanceDeEtapa(etapa, avance);
    const terminada = total > 0 && hechos === total;
    const cuenta = terminada ? 'Terminada · ' + total + ' pasos' : hechos + ' de ' + total + ' pasos';

    const resumen = crear('summary', {
      clase: 'camino__resumen',
      hijos: [
        crear('span', { clase: 'camino__numero', texto: terminada ? '✓' : String(numero) }),
        crear('div', {
          clase: 'camino__texto',
          hijos: [
            crear('h3', { clase: 'camino__titulo', texto: 'Etapa ' + numero + ': ' + etapa.titulo }),
            crear('p', { clase: 'camino__frase', texto: etapa.frase }),
            crear('p', { clase: 'camino__rutas', texto: rutas.map((ruta) => ruta.titulo).join(' · ') }),
            crear('div', {
              clase: 'camino__avance',
              hijos: [
                crearBarra(hechos, total, 'Avance en la etapa ' + etapa.titulo),
                crear('span', { clase: 'camino__cuenta', texto: cuenta }),
              ],
            }),
          ],
        }),
      ],
    });
    const detalles = crear('details', {
      clase: 'camino' + (terminada ? ' camino--terminado' : ''),
      hijos: [resumen, crear('ol', { clase: 'rutas', hijos: rutas.map(crearTarjetaRuta) })],
    });
    detalles.open = etapa.rutas.includes(rutaRecomendada);
    return crear('li', { hijos: [detalles] });
  }

  function pintarEtapas(avance, rutaRecomendada) {
    nodos.listaRutas.replaceChildren(
      ...Etapas.ETAPAS.map((etapa, indice) => crearEtapa(etapa, indice + 1, avance, rutaRecomendada))
    );
  }

  // ----- Logros -----

  function calcularLogros(hoy) {
    return Logros ? Logros.calcular(estado.progreso, Rutas.todas(), hoy) : [];
  }

  function pintarLogros(logros) {
    nodos.seccionLogros.hidden = logros.length === 0;
    nodos.listaLogros.replaceChildren(
      ...logros.map((logro) =>
        crear('li', {
          clase: 'logro' + (logro.conseguido ? ' logro--conseguido' : ''),
          hijos: [
            crearIcono('logro__icono', Iconos.de(logro.conseguido ? 'trofeo' : 'candado')),
            crear('div', {
              clase: 'logro__texto',
              hijos: [
                crear('p', { clase: 'logro__titulo', texto: logro.titulo }),
                crear('p', { clase: 'logro__descripcion', texto: logro.descripcion }),
                crear('span', {
                  clase: 'solo-lectores',
                  texto: logro.conseguido ? 'Conseguido' : 'Por conseguir',
                }),
              ],
            }),
          ],
        })
      )
    );
  }

  function pintarInicio() {
    const hoy = hoyLocal();
    const dias = Progreso.actividadReciente(estado.progreso, hoy, DIAS_ACTIVIDAD);
    const pasosHoy = dias.length > 0 ? dias[dias.length - 1].pasos : 0;
    const logros = calcularLogros(hoy);

    pintarSaludo(pasosHoy);
    pintarEstadisticas(hoy, pasosHoy, logros);
    const avance = avanceDeRutas();
    const destino = rutaParaContinuar(avance);
    pintarContinuar(destino);
    pintarActividad(dias);
    pintarEtapas(avance, destino ? destino.rutaId : null);
    pintarLogros(logros);
  }

  // ---------- Vista de curso ----------

  function pintarAvance() {
    const total = contarPasos(estado.ruta);
    const hechos = Progreso.contarCompletados(estado.progreso, estado.ruta);
    ponerAvance(nodos.avanceBarra, hechos, total);
    nodos.avanceTexto.textContent = hechos + ' de ' + total + ' pasos';
    pintarEncabezadoCurso(hechos, total);
  }

  // Encabezado de la ruta: ícono, nombre, dónde va el estudiante y el anillo de avance.
  function pintarEncabezadoCurso(hechos, total) {
    nodos.cursoIcono.innerHTML = Iconos.deRuta(estado.ruta.id);
    nodos.cursoRuta.textContent = estado.ruta.titulo;
    nodos.cursoPosicion.textContent =
      'Lección ' + (estado.indiceLeccion + 1) + ' de ' + estado.ruta.lecciones.length +
      ' · ' + leccionActual().titulo;
    nodos.cursoAnillo.replaceChildren(crearAnillo(hechos, total, 'Avance en ' + estado.ruta.titulo));
  }

  // Un punto por paso: relleno si el paso está hecho, solo borde si no.
  function crearPuntosDeAvance(leccion) {
    const puntos = crear('span', {
      clase: 'menu__puntos',
      hijos: leccion.pasos.map((paso) =>
        crear('span', { clase: 'punto' + (estaHecho(leccion, paso) ? ' punto--hecho' : '') })
      ),
    });
    puntos.setAttribute('aria-hidden', 'true');
    return puntos;
  }

  // El menú es un camino: cada lección es un nodo unido al siguiente por una
  // línea vertical (la dibuja el CSS). El nodo muestra si está completa
  // (check), empezada (medio relleno) o pendiente (vacío).
  function pintarMenu() {
    const elementos = estado.ruta.lecciones.map((leccion, indice) => {
      const hechos = leccion.pasos.filter((paso) => estaHecho(leccion, paso)).length;
      const estadoLeccion = estadoDeLeccion(estado.ruta, leccion);
      const nodo = crear('span', { clase: 'menu__nodo' });
      nodo.setAttribute('aria-hidden', 'true');
      if (estadoLeccion === 'completa') nodo.innerHTML = Iconos.de('check');
      const boton = crear('button', {
        clase: 'menu__leccion menu__leccion--' + estadoLeccion,
        alHacerClic: () => abrirLeccion(indice),
        hijos: [
          nodo,
          crear('span', {
            clase: 'menu__texto',
            hijos: [
              crear('span', {
                clase: 'menu__fila',
                hijos: [
                  crear('span', { clase: 'menu__numero', texto: String(indice + 1).padStart(2, '0') }),
                  crear('span', { clase: 'menu__titulo', texto: leccion.titulo }),
                ],
              }),
              crearPuntosDeAvance(leccion),
              // Los puntos son solo visuales: esto es lo que lee un lector de pantalla.
              crear('span', {
                clase: 'solo-lectores',
                texto: hechos + ' de ' + leccion.pasos.length + ' pasos completados',
              }),
            ],
          }),
        ],
      });
      if (indice === estado.indiceLeccion) boton.setAttribute('aria-current', 'true');
      return crear('li', { hijos: [boton] });
    });
    nodos.listaLecciones.replaceChildren(...elementos);
    pintarVideosDelMenu();
  }

  // ---------- Videos de YouTube (rutas/videos.js) ----------
  // Un complemento para ver una explicación además de practicar. Son
  // enlaces, no videos incrustados: pesan casi nada, no cargan rastreadores
  // y en el celular abren la app de YouTube.

  // Las funciones de videos.js, o unas vacías si el archivo no cargó: así
  // la lección se ve igual, solo que sin videos.
  function fuenteDeVideos() {
    return globalThis.Videos || {
      videosDeLeccion: () => [],
      videosDeRuta: () => [],
      analizarUrlDeYouTube: () => null,
    };
  }

  // Una tarjeta por video. La URL se vuelve a validar aquí (y no solo en
  // las pruebas) porque nunca se crea un enlace sin revisar a dónde lleva.
  // Devuelve null si la URL no es de YouTube: ese video no se muestra.
  function crearTarjetaDeVideo(video, conMiniatura) {
    const enlaceValido = fuenteDeVideos().analizarUrlDeYouTube(video.url);
    if (!enlaceValido) return null;

    const enlace = crear('a', {
      clase: 'video__enlace',
      hijos: [
        document.createTextNode('Ver en YouTube'),
        // El lector de pantalla oye a qué video lleva y que abre otra pestaña.
        crear('span', { clase: 'solo-lectores', texto: ': ' + video.titulo + ' (se abre en otra pestaña)' }),
      ],
    });
    enlace.href = video.url;
    enlace.target = '_blank';
    // noopener: la pestaña nueva no puede controlar esta; noreferrer: no le
    // dice a YouTube desde qué página llegó el estudiante.
    enlace.rel = 'noopener noreferrer';

    const texto = crear('div', {
      clase: 'video__texto',
      hijos: [
        crear('p', { clase: 'video__titulo', texto: video.titulo }),
        crear('p', {
          clase: 'video__canal',
          hijos: [
            crear('span', { texto: video.canal }),
            ...(video.idioma === 'en' ? [crear('span', { clase: 'video__idioma', texto: 'en inglés' })] : []),
          ],
        }),
        ...(video.nota ? [crear('p', { clase: 'video__nota', texto: video.nota })] : []),
        enlace,
      ],
    });

    // Las listas de reproducción no tienen una miniatura fija por id.
    const piezas = conMiniatura && enlaceValido.tipo === 'video'
      ? [crearMiniatura(enlaceValido.id), texto]
      : [texto];
    return crear('li', { clase: 'video' + (enlaceValido.tipo === 'lista' ? ' video--lista' : ''), hijos: piezas });
  }

  // El id ya pasó la validación (solo letras, números, "_" y "-"), así que
  // es seguro ponerlo en la dirección. width/height fijos reservan el
  // espacio y evitan que el texto salte cuando la imagen termina de cargar.
  function crearMiniatura(idVideo) {
    const imagen = document.createElement('img');
    imagen.className = 'video__miniatura';
    imagen.src = 'https://i.ytimg.com/vi/' + idVideo + '/mqdefault.jpg';
    imagen.alt = '';
    imagen.loading = 'lazy';
    imagen.width = 320;
    imagen.height = 180;
    return imagen;
  }

  function crearListaDeVideos(videos, conMiniaturas) {
    const tarjetas = videos.map((video) => crearTarjetaDeVideo(video, conMiniaturas)).filter(Boolean);
    return tarjetas.length ? crear('ul', { clase: 'videos', hijos: tarjetas }) : null;
  }

  // Plegado como los puentes: el estudiante lo abre si quiere ver un video,
  // y la explicación del paso sigue arriba, a la vista.
  function crearVideosPlegable(titulo, videos) {
    const lista = crearListaDeVideos(videos, true);
    if (!lista) return null;
    return crear('details', {
      clase: 'puente-plegable videos-plegable',
      hijos: [crear('summary', { texto: titulo + ' (' + lista.children.length + ')' }), lista],
    });
  }

  // Solo en el paso Idea (el primero). Si la lección no tiene videos
  // propios, la lección 1 muestra los cursos completos de la ruta: es el
  // mejor momento para descubrirlos.
  function videosAntesDelTexto() {
    if (estado.indicePaso !== 0) return [];
    const fuente = fuenteDeVideos();
    const propios = fuente.videosDeLeccion(estado.ruta.id, leccionActual().id);
    const deLaRuta = estado.indiceLeccion === 0 ? fuente.videosDeRuta(estado.ruta.id) : [];
    const plegable = propios.length
      ? crearVideosPlegable('Videos para reforzar', propios)
      : crearVideosPlegable('Cursos completos de esta ruta', deLaRuta);
    return plegable ? [plegable] : [];
  }

  // En el cajón de lecciones, sin miniaturas: el cajón es angosto y ahí
  // importa ver la lista completa de un vistazo.
  function pintarVideosDelMenu() {
    const lista = crearListaDeVideos(fuenteDeVideos().videosDeRuta(estado.ruta.id), false);
    nodos.menuVideos.hidden = !lista;
    nodos.menuVideos.replaceChildren(
      ...(lista ? [crear('h2', { clase: 'menu-videos__titulo', texto: 'Videos de esta ruta' }), lista] : [])
    );
  }

  // Los pasos son etapas: círculos numerados unidos por una línea, con la
  // etiqueta debajo. Un paso hecho muestra un check en lugar del número.
  function pintarPestanas() {
    const leccion = leccionActual();
    const elementos = leccion.pasos.map((paso, indice) => {
      const etiqueta = Rutas.etiquetaDelPaso(paso, indice);
      const hecho = estaHecho(leccion, paso);
      const circulo = crear('span', { clase: 'pestana__circulo' });
      circulo.setAttribute('aria-hidden', 'true');
      if (hecho) circulo.innerHTML = Iconos.de('check');
      else circulo.textContent = String(indice + 1);
      const boton = crear('button', {
        clase: 'pestana' + (hecho ? ' pestana--hecha' : ''),
        alHacerClic: () => irA(estado.indiceLeccion, indice),
        hijos: [
          circulo,
          crear('span', { clase: 'solo-lectores', texto: 'Paso ' + (indice + 1) + ': ' }),
          crear('span', { clase: 'pestana__etiqueta', texto: etiqueta }),
          ...(hecho ? [crear('span', { clase: 'solo-lectores', texto: ' (completado)' })] : []),
        ],
      });
      if (indice === estado.indicePaso) boton.setAttribute('aria-current', 'step');
      return crear('li', { clase: 'etapa' + (hecho ? ' etapa--hecha' : ''), hijos: [boton] });
    });
    nodos.pestanas.replaceChildren(...elementos);
    pintarAvanceDeLeccion();
  }

  // ---------- Puentes entre lecciones (rutas/puentes.js) ----------
  // Para que las lecciones no se sientan como temas sueltos, el primer paso
  // dice de dónde viene la lección y para qué sirve, y el último dice qué
  // sigue. Si una lección no tiene puente, simplemente no se muestra nada.

  function puenteActual() {
    const deLaRuta = (globalThis.Puentes || {})[estado.ruta.id];
    if (!deLaRuta) return { intro: '', leccion: null };
    return {
      intro: deLaRuta.intro || '',
      leccion: (deLaRuta.lecciones || {})[leccionActual().id] || null,
    };
  }

  // Un recuadro con filas "Etiqueta: texto". Todo con textContent (vía
  // crear), porque es texto plano y así no hay que escapar nada.
  function crearRecuadroPuente(clase, filas) {
    return crear('aside', {
      clase: 'puente ' + clase,
      hijos: filas
        .filter(([, texto]) => texto)
        .map(([etiqueta, texto]) =>
          crear('p', {
            clase: 'puente__fila',
            hijos: [crear('strong', { clase: 'puente__etiqueta', texto: etiqueta }), crear('span', { texto })],
          })
        ),
    });
  }

  // "En esta ruta" es una bienvenida: solo se muestra mientras el estudiante
  // no ha completado ningún paso de la ruta. Después ya la conoce y estorba.
  function introDeRutaVisible(intro) {
    return Boolean(intro) && estado.indiceLeccion === 0 &&
      Progreso.contarCompletados(estado.progreso, estado.ruta) === 0;
  }

  // "Viene de" y "Para qué sirve" van plegados: el estudiante los abre si
  // quiere el contexto, y la explicación del paso queda arriba, a la vista.
  function crearPuentePlegable(leccion) {
    const filas = [
      ['Viene de', leccion.viene],
      ['Para qué sirve', leccion.sirve],
    ];
    if (!filas.some(([, texto]) => texto)) return null;
    const recuadro = crearRecuadroPuente('puente--inicio', filas);
    return crear('details', {
      clase: 'puente-plegable',
      hijos: [
        crear('summary', { texto: '¿De dónde viene esta lección y para qué sirve?' }),
        recuadro,
      ],
    });
  }

  function puentesAntesDelTexto() {
    if (estado.indicePaso !== 0) return [];
    const { intro, leccion } = puenteActual();
    const piezas = [];
    if (introDeRutaVisible(intro)) {
      piezas.push(crearRecuadroPuente('puente--ruta', [['En esta ruta', intro]]));
    }
    const plegable = leccion ? crearPuentePlegable(leccion) : null;
    if (plegable) piezas.push(plegable);
    return piezas;
  }

  function puentesDespuesDelTexto() {
    if (estado.indicePaso !== leccionActual().pasos.length - 1) return [];
    const { leccion } = puenteActual();
    if (!leccion || !leccion.sigue) return [];
    return [crearRecuadroPuente('puente--sigue', [['Lo que sigue', leccion.sigue]])];
  }

  // Los textos seguidos que empiezan por "- " son una lista: se agrupan en un
  // solo <ul> para que se vean como viñetas y el lector de pantalla anuncie
  // "lista de 3 elementos". Lo demás es un párrafo. No se modifica "textos".
  function crearBloquesDeTexto(textos) {
    return textos.reduce((bloques, texto) => {
      if (!texto.startsWith('- ')) return [...bloques, crear('p', { htmlSeguro: formatearTexto(texto) })];
      const item = crear('li', { htmlSeguro: formatearTexto(texto.slice(2)) });
      const ultimo = bloques[bloques.length - 1];
      if (ultimo && ultimo.tagName === 'UL') {
        // La <ul> la acaba de crear esta misma función: agregarle un
        // elemento no toca nada que venga de afuera.
        ultimo.append(item);
        return bloques;
      }
      return [...bloques, crear('ul', { hijos: [item] })];
    }, []);
  }

  function pintarPaso() {
    const leccion = leccionActual();
    const paso = pasoActual();
    const codigoGuardado = estado.progreso.codigos[claveActual()];

    nodos.ubicacion.textContent =
      'Lección ' + (estado.indiceLeccion + 1) + ' · ' + leccion.titulo +
      ' · Paso ' + (estado.indicePaso + 1) + ' de ' + leccion.pasos.length;
    nodos.titulo.textContent = paso.titulo;
    nodos.texto.replaceChildren(
      ...puentesAntesDelTexto(),
      ...videosAntesDelTexto(),
      ...crearBloquesDeTexto(paso.texto),
      ...puentesDespuesDelTexto()
    );

    nodos.codigo.value = codigoGuardado !== undefined ? codigoGuardado : paso.codigo;
    pintarBarraEditor();
    pintarEditor();
    limpiarResultados();
    pintarPistas();
    pintarReferencia();

    nodos.botonAnterior.disabled = posicionVecina(-1) === null;
    nodos.botonSiguiente.disabled = posicionVecina(1) === null;
    pintarPanel();
    animarEntrada(nodos.columnaLeccion);
  }

  // En pantallas angostas se ve una sola mitad. El CSS lee data-panel y
  // aria-pressed le dice al lector de pantalla cuál botón está activo.
  function pintarPanel() {
    nodos.contenido.dataset.panel = estado.panel;
    nodos.verLeccion.setAttribute('aria-pressed', String(estado.panel === 'leccion'));
    nodos.verCodigo.setAttribute('aria-pressed', String(estado.panel === 'codigo'));
  }

  function cambiarPanel(panel) {
    if (estado.panel === panel) return;
    estado = { ...estado, panel };
    pintarPanel();
    window.scrollTo({ top: 0 });
    animarEntrada(panel === 'codigo' ? nodos.columnaTaller : nodos.columnaLeccion);
  }

  // Barra corta junto a los botones Lección/Código: un segmento por paso
  // (verde si está hecho, del color de la ruta si es el paso abierto). Así
  // el avance de la lección se ve siempre, aunque se haya bajado.
  function pintarAvanceDeLeccion() {
    const leccion = leccionActual();
    nodos.leccionSegmentos.replaceChildren(
      ...leccion.pasos.map((paso, indice) => {
        let clase = 'segmento';
        if (estaHecho(leccion, paso)) clase += ' segmento--hecho';
        if (indice === estado.indicePaso) clase += ' segmento--actual';
        return crear('span', { clase });
      })
    );
    nodos.leccionCuenta.textContent =
      'Paso ' + (estado.indicePaso + 1) + ' de ' + leccion.pasos.length;
  }

  // Aparición suave al cambiar de paso o de mitad. Quitar y volver a poner
  // la clase reinicia la animación; leer offsetWidth obliga al navegador a
  // notar que se quitó. El CSS solo la anima si no se pidió reducir el movimiento.
  function animarEntrada(nodo) {
    nodo.classList.remove('aparecer');
    void nodo.offsetWidth;
    nodo.classList.add('aparecer');
  }

  // El nombre del archivo y del lenguaje encima del editor. Va en cada paso
  // (y no una sola vez al abrir la ruta) porque en un proyecto el paso 1
  // puede ser "consulta.sql" y el paso 2 "index.html".
  function pintarBarraEditor() {
    const motor = motorActual();
    nodos.editorArchivo.textContent = motor.archivo || 'tu-codigo';
    nodos.editorLenguaje.textContent = motor.nombreLenguaje || estado.ruta.titulo;
  }

  // Algunos motores (Python) tardan en cargar: se les avisa desde que se abre
  // el paso para que el primer "Ejecutar" espere menos. Se llama en cada
  // cambio de paso porque el paso nuevo puede usar otro motor; preparar dos
  // veces el mismo motor no cuesta nada (cada motor recuerda si ya cargó).
  function prepararMotor() {
    const motor = motorActual();
    if (motor.preparar) motor.preparar();
  }

  // Repinta lo que acompaña al cuadro de texto: los números de línea y la
  // capa con colores que queda debajo de lo que se escribe.
  function pintarEditor() {
    const codigo = nodos.codigo.value;
    const cantidad = codigo.split('\n').length;
    nodos.numeros.textContent = Array.from({ length: cantidad }, (_, i) => i + 1).join('\n');
    // resaltar() devuelve HTML ya escapado. El salto final evita que la
    // última línea vacía se "coma" su altura.
    nodos.resaltado.innerHTML = resaltar(codigo, motorActual().lenguaje) + '\n';
    sincronizarDesplazamiento();
  }

  // Las tres piezas del editor deben moverse juntas al desplazarse.
  function sincronizarDesplazamiento() {
    nodos.numeros.scrollTop = nodos.codigo.scrollTop;
    nodos.resaltado.scrollTop = nodos.codigo.scrollTop;
    nodos.resaltado.scrollLeft = nodos.codigo.scrollLeft;
  }

  // Dibuja una tabla de datos (el resultado de una consulta SQL). Cada celda
  // se escribe con textContent: los datos nunca se interpretan como HTML.
  // "notaPropia" reemplaza la nota de abajo ("10 filas") cuando quien llama
  // tiene algo mejor que decir.
  function crearTabla({ columnas, filas, total = filas.length }, maximoFilas, notaPropia) {
    const celda = (etiqueta, valor) =>
      valor === null
        ? crear(etiqueta, { clase: 'tabla__vacio', texto: 'NULL' })
        : crear(etiqueta, { texto: String(valor) });
    // scope="col" le dice a un lector de pantalla que el encabezado es de la columna.
    const encabezado = (columna) => {
      const th = celda('th', columna);
      th.setAttribute('scope', 'col');
      return th;
    };
    const visibles = filas.slice(0, maximoFilas);
    const tabla = crear('table', {
      clase: 'tabla',
      hijos: [
        crear('thead', {
          hijos: [crear('tr', { hijos: columnas.map(encabezado) })],
        }),
        crear('tbody', {
          hijos: visibles.map((fila) => crear('tr', { hijos: fila.map((valor) => celda('td', valor)) })),
        }),
      ],
    });

    // "total" puede ser mayor que las filas recibidas: el motor de SQL no
    // envía a la página resultados gigantes.
    let nota = total + (total === 1 ? ' fila' : ' filas');
    if (total > visibles.length) nota = 'Se muestran ' + visibles.length + ' de ' + nota;
    nota = notaPropia || nota;

    // El marco permite deslizar la tabla si es muy ancha o larga. Con
    // tabindex también se puede deslizar con el teclado, y la etiqueta le
    // dice a un lector de pantalla qué es antes de leer las celdas.
    const marco = crear('div', { clase: 'tabla__marco', hijos: [tabla] });
    marco.setAttribute('tabindex', '0');
    marco.setAttribute('role', 'region');
    marco.setAttribute('aria-label', 'Tabla con columnas ' + columnas.join(', ') + '. ' + nota);
    return crear('div', {
      clase: 'tabla__bloque',
      hijos: [marco, crear('p', { clase: 'tabla__nota', texto: nota })],
    });
  }

  // Algunos motores tienen material de consulta para el paso (el de SQL, las
  // tablas de la base). Se pide aparte porque puede tardar: si el estudiante
  // ya cambió de paso cuando llega la respuesta, se descarta.
  async function pintarReferencia() {
    const motor = motorActual();
    nodos.referencia.hidden = !motor.describir;
    if (!motor.describir) return;

    const turno = estado.turno;
    if (nodos.referenciaContenido.children.length === 0) {
      nodos.referenciaContenido.replaceChildren(
        crear('p', { clase: 'tabla__nota', texto: 'Cargando las tablas…' })
      );
    }
    const descripcion = await motor.describir(pasoActual());
    if (turno !== estado.turno) return;

    if (descripcion.tablas.length === 0) {
      nodos.referenciaContenido.replaceChildren(
        crear('p', {
          clase: 'tabla__nota',
          texto: 'No se pudieron cargar las tablas. Presiona Ejecutar para ver por qué.',
        })
      );
      return;
    }

    nodos.referenciaContenido.replaceChildren(
      ...descripcion.tablas.map((tabla) =>
        crear('section', {
          clase: 'referencia__tabla',
          hijos: [
            crear('h3', { texto: tabla.nombre }),
            crearTabla(
              { columnas: tabla.columnas, filas: tabla.filas },
              tabla.filas.length,
              'Primeras ' + tabla.filas.length + ' filas de ' + tabla.total + '.'
            ),
          ],
        })
      )
    );
  }

  function pintarResumenPruebas(aprobadas, total) {
    nodos.pruebasResumen.textContent = total === 0 ? '' : '· ' + aprobadas + ' de ' + total;
  }

  // Las pruebas se muestran desde el principio: son la meta del ejercicio.
  function pintarPruebasPendientes() {
    const pruebas = pasoActual().pruebas || [];
    nodos.zonaPruebas.hidden = pruebas.length === 0;
    pintarResumenPruebas(0, pruebas.length);
    nodos.pruebas.replaceChildren(
      ...pruebas.map((prueba) => crear('li', { clase: 'prueba', texto: prueba.descripcion }))
    );
  }

  // La vista previa solo existe para motores que la piden (vistaPrevia: true).
  // Al cambiar de paso se vacía: así no queda la página del paso anterior.
  function limpiarVistaPrevia() {
    const conVista = motorActual().vistaPrevia === true;
    nodos.zonaVista.hidden = !conVista;
    nodos.resultados.classList.toggle('resultados--con-vista', conVista);
    nodos.vistaPrevia.srcdoc = '';
    nodos.vistaPrevia.hidden = true;
    nodos.vistaVacia.hidden = false;
  }

  // Prepara el documento para la vista previa sin cambiar lo que revisan las
  // pruebas. Dentro de un srcdoc, un enlace "#productos" apuntaría a la app y
  // la cargaría adentro de la vista previa; con <base href="about:srcdoc"> el
  // enlace se queda en la misma página, como en un archivo de verdad.
  function prepararDocumento(html) {
    const base = '<base href="about:srcdoc">';
    const doctype = html.match(/^\s*<!doctype[^>]*>/i);
    return doctype ? doctype[0] + base + html.slice(doctype[0].length) : base + html;
  }

  // "conScripts" es falso cuando el evaluador encontró un error: en ese caso
  // no alcanzó a correr los <script> (que podrían traer un bucle infinito y
  // congelar la app), así que la vista previa se muestra sin JavaScript.
  // El sandbox nuevo aplica en la siguiente carga, que la dispara el srcdoc.
  // Primero se muestra el iframe y DESPUÉS se le da el documento: si recibe
  // el srcdoc mientras está oculto (display: none), el navegador puede dejarlo
  // en blanco al mostrarlo, aunque el documento ya esté cargado.
  function pintarVistaPrevia(vista, conScripts) {
    nodos.vistaPrevia.hidden = false;
    nodos.vistaVacia.hidden = true;
    nodos.vistaPrevia.setAttribute('sandbox', conScripts ? 'allow-scripts' : '');
    nodos.vistaPrevia.srcdoc = prepararDocumento(vista.html);
  }

  function limpiarResultados() {
    limpiarVistaPrevia();
    nodos.consola.textContent = 'Aquí aparecerá lo que muestre tu código.';
    nodos.consola.classList.add('consola--vacia');
    nodos.tablas.replaceChildren();
    nodos.error.hidden = true;
    nodos.felicitacion.hidden = true;
    nodos.ayudaResultado.hidden = true;
    pintarPruebasPendientes();
  }

  function pintarPistas() {
    const paso = pasoActual();
    const pistas = paso.pistas || [];
    const elementos = pistas
      .slice(0, estado.pistasVistas)
      .map((pista, indice) =>
        crear('p', {
          clase: 'pista',
          htmlSeguro: '<strong>Pista ' + (indice + 1) + ':</strong> ' + formatearTexto(pista),
        })
      );

    if (estado.confirmandoSolucion) elementos.push(crearConfirmacionSolucion());

    if (estado.solucionVisible) {
      elementos.push(
        crear('p', {
          clase: 'pista',
          texto: 'Esta es una solución posible. Léela, entiéndela y escríbela tú mismo en el editor: se aprende mucho más que copiando y pegando.',
        }),
        crear('pre', { clase: 'solucion', texto: paso.solucion })
      );
    }
    nodos.pistas.replaceChildren(...elementos);

    const quedanPistas = estado.pistasVistas < pistas.length;
    nodos.botonPista.hidden =
      pistas.length === 0 || estado.solucionVisible || estado.confirmandoSolucion;
    nodos.botonPista.textContent = quedanPistas
      ? 'Dame una pista (' + estado.pistasVistas + '/' + pistas.length + ')'
      : 'Ver la solución';
  }

  function pintarResultado(resultado) {
    const motor = motorActual();
    const lineas = resultado.salida.slice(0, MAXIMO_LINEAS_CONSOLA);
    const sobrantes = resultado.salida.length - lineas.length;
    const tablas = resultado.tablas || [];
    const sinSalida = resultado.salida.length === 0 && tablas.length === 0;

    if (resultado.vista && typeof resultado.vista.html === 'string') {
      pintarVistaPrevia(resultado.vista, resultado.error === null);
    } else if (motor.vistaPrevia === true) {
      // Sin vista (por ejemplo, un bucle infinito que se cortó): no se deja
      // la página anterior junto al error, porque confundiría.
      limpiarVistaPrevia();
    }
    nodos.tablas.replaceChildren(...tablas.map((tabla) => crearTabla(tabla, MAXIMO_FILAS_TABLA)));
    // Si hubo un error, la ayuda de "no se mostró nada" sobra: el error ya
    // explica lo que pasó. La consola vacía se oculta sola con el CSS.
    let textoConsola = lineas.join('\n') + (sobrantes > 0 ? '\n… y ' + sobrantes + ' líneas más' : '');
    if (sinSalida) textoConsola = resultado.error ? '' : motor.ayudaSinSalida || 'Tu código no mostró nada.';
    nodos.consola.classList.toggle('consola--vacia', sinSalida);
    nodos.consola.textContent = textoConsola;

    nodos.error.hidden = resultado.error === null;
    if (resultado.error) nodos.error.textContent = motor.explicarError(resultado.error);

    // Si hubo un error no se revisó ninguna prueba: no deben quedar en
    // pantalla las marcas verdes de una ejecución anterior.
    if (resultado.resultados.length === 0) {
      pintarPruebasPendientes();
    } else {
      pintarResumenPruebas(
        resultado.resultados.filter((prueba) => prueba.aprobada).length,
        resultado.resultados.length
      );
      const primeraFallida = resultado.resultados.findIndex((prueba) => !prueba.aprobada);
      nodos.pruebas.replaceChildren(
        ...resultado.resultados.map((prueba, indice) => {
          const item = crear('li', {
            clase: 'prueba ' + (prueba.aprobada ? 'prueba--aprobada' : 'prueba--fallida') +
              (indice === primeraFallida ? ' prueba--primera' : ''),
            hijos: [crear('span', { texto: prueba.descripcion })],
          });
          // El ✓ y el ✗ los dibuja el CSS: esto es lo que oye un lector de pantalla.
          item.prepend(crear('span', {
            clase: 'solo-lectores',
            texto: prueba.aprobada ? 'Cumplida: ' : 'Falta: ',
          }));
          return item;
        })
      );
    }
    pintarAyudaResultado(resultado);
  }

  // Cuando algo no pasó, una nota corta dice qué hacer ahora: leer el error
  // o revisar la primera prueba que falta, y ofrece la pista siguiente.
  function pintarAyudaResultado(resultado) {
    const fallidas = resultado.resultados.filter((prueba) => !prueba.aprobada);
    const total = resultado.resultados.length;
    let titulo = '';
    let detalle = '';
    if (resultado.error) {
      titulo = 'Tu código tiene un error, y es normal.';
      detalle = 'Lee el recuadro rojo: dice qué pasó y casi siempre en qué línea. ' +
        'Corrígelo y vuelve a ejecutar.';
    } else if (fallidas.length > 0) {
      const cumplidas = total - fallidas.length;
      titulo = cumplidas === 0
        ? (total === 1 ? 'Todavía falta la prueba.' : 'Todavía faltan las ' + total + ' pruebas.')
        : 'Vas bien: ' + cumplidas + ' de ' + total + ' pruebas cumplidas.';
      detalle = 'Empieza por la que está en rojo: «' + fallidas[0].descripcion + '». ' +
        'Cambia tu código y vuelve a ejecutar.';
    }
    nodos.ayudaResultado.hidden = titulo === '';
    if (titulo === '') return;
    nodos.ayudaResultado.replaceChildren(
      crear('p', { clase: 'ayuda-resultado__titulo', texto: titulo }),
      crear('p', { texto: detalle }),
      ...crearBotonDeAyuda()
    );
  }

  // El mismo paso que el botón "Dame una pista", pero junto al resultado,
  // donde el estudiante está mirando cuando algo falla.
  function crearBotonDeAyuda() {
    const pistas = pasoActual().pistas || [];
    if (pistas.length === 0 || estado.solucionVisible || estado.confirmandoSolucion) return [];
    const quedan = estado.pistasVistas < pistas.length;
    return [
      crear('button', {
        clase: 'boton boton--pista',
        texto: quedan ? 'Ver la pista ' + (estado.pistasVistas + 1) : 'Ver la solución',
        alHacerClic: () => {
          nodos.ayudaResultado.hidden = true;
          alPedirPista();
        },
      }),
    ];
  }

  // "premio" dice lo que ganó el estudiante con este paso: { puntos, nivelNuevo }.
  // nivelNuevo es null si no subió de nivel.
  function pintarFelicitacion(premio) {
    const siguiente = posicionVecina(1);
    const mensaje = siguiente
      ? '¡Muy bien! Paso completado.'
      : '¡Felicitaciones! Terminaste la ruta de ' + estado.ruta.titulo + '.';
    const cuerpo = [crear('span', { texto: mensaje })];
    if (premio.puntos > 0) {
      cuerpo.push(crear('span', { clase: 'felicitacion__premio', texto: '+' + premio.puntos + ' puntos' }));
    }
    if (premio.nivelNuevo !== null) {
      cuerpo.push(
        crear('span', {
          clase: 'felicitacion__premio felicitacion__premio--nivel',
          texto: '¡Subiste al nivel ' + premio.nivelNuevo + '!',
        })
      );
    }
    const accion = siguiente
      ? crear('button', {
          clase: 'boton boton--principal boton--grande',
          texto: 'Siguiente paso →',
          alHacerClic: () => irA(siguiente.indiceLeccion, siguiente.indicePaso),
        })
      : crearEnlaceARutas();
    // Si el estudiante ejecutó con Ctrl+Enter desde el editor, sigue
    // escribiendo ahí: quitarle el foco haría que su siguiente Enter lo
    // mandara de paso sin querer. En ese caso el botón solo se muestra.
    const moverFoco = document.activeElement !== nodos.codigo;
    const pie = siguiente && moverFoco
      ? [crear('p', { clase: 'felicitacion__atajo', htmlSeguro: 'o presiona <kbd>Enter</kbd>' })]
      : [];
    nodos.felicitacion.replaceChildren(
      crear('div', { clase: 'felicitacion__cuerpo', hijos: cuerpo }),
      crear('div', { clase: 'felicitacion__accion', hijos: [accion, ...pie] })
    );
    nodos.felicitacion.hidden = false;
    // Con el foco en el botón, Enter avanza (lo hace el navegador solo) y
    // el botón queda a la vista aunque los resultados sean largos.
    if (moverFoco) enfocarYMostrar(accion);
    else accion.scrollIntoView({ block: 'nearest', behavior: comportamientoDeDesplazamiento() });
  }

  const COLORES_CONFETI = Object.freeze([
    '#fcd116', '#003893', '#ce1126', '#2f6fab', '#c98a00', '#0f766e', '#7c3aed', '#d9512c', '#be185d',
  ]);
  const CANTIDAD_CONFETI = 20;
  const DURACION_CONFETI_MS = 1500;

  // Lluvia corta de confeti hecha con CSS. Solo se crea si el estudiante no
  // pidió reducir el movimiento; los <span> se quitan solos al terminar.
  function lanzarConfeti() {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    document.querySelectorAll('.confeti').forEach((viejo) => viejo.remove());
    const piezas = Array.from({ length: CANTIDAD_CONFETI }, (_, i) => {
      const pieza = document.createElement('span');
      pieza.style.setProperty('--x', Math.round(Math.random() * 100) + '%');
      pieza.style.setProperty('--retraso', Math.round(Math.random() * 150) + 'ms');
      pieza.style.setProperty('--giro', Math.round(Math.random() * 720 - 360) + 'deg');
      pieza.style.setProperty('--color', COLORES_CONFETI[i % COLORES_CONFETI.length]);
      return pieza;
    });
    const lluvia = crear('div', { clase: 'confeti', hijos: piezas });
    lluvia.setAttribute('aria-hidden', 'true');
    document.body.append(lluvia);
    setTimeout(() => lluvia.remove(), DURACION_CONFETI_MS);
  }

  function crearEnlaceARutas() {
    const enlace = crear('a', { clase: 'boton boton--principal', texto: 'Ver las otras rutas' });
    enlace.href = '#';
    return enlace;
  }

  function pintarCurso() {
    pintarAvance();
    pintarMenu();
    pintarPestanas();
    pintarPaso();
  }

  // Muestra la vista que corresponde al estado y ajusta la cabecera.
  function pintarVista() {
    const enMapa = estado.ruta === null && direccionEsMapa();
    const enCertificados = estado.ruta === null && direccionEsCertificados();
    const enInicio = estado.ruta === null && !enMapa && !enCertificados;
    nodos.vistaInicio.hidden = !enInicio;
    nodos.vistaMapa.hidden = !enMapa;
    nodos.vistaCertificados.hidden = !enCertificados;
    nodos.vistaCurso.hidden = estado.ruta === null;
    nodos.botonMenu.hidden = estado.ruta === null;
    nodos.avance.hidden = estado.ruta === null;
    // Migas de pan: en el inicio solo se ve el nombre de la app (sin enlace);
    // dentro de una ruta es un enlace al inicio, seguido del nombre de la ruta.
    nodos.migaSeparador.hidden = enInicio;
    nodos.migaRuta.hidden = enInicio;
    // Las pantallas sin ruta (mapa, certificados) ponen su propio nombre en la miga y el título.
    const nombreVista = enMapa ? 'Mapa del oficio' : enCertificados ? 'Certificados gratis' : '';
    nodos.migaRuta.textContent = nombreVista || (enInicio ? '' : estado.ruta.titulo);
    if (enInicio) {
      nodos.migaInicio.removeAttribute('href');
      nodos.migaInicio.setAttribute('aria-current', 'page');
    } else {
      nodos.migaInicio.setAttribute('href', '#');
      nodos.migaInicio.removeAttribute('aria-current');
    }
    if (nombreVista) document.title = nombreVista + ' · ' + TITULO_APP;
    else document.title = enInicio ? TITULO_APP : estado.ruta.titulo + ' · ' + TITULO_APP;
    // El CSS usa este dato para acomodar la cabecera en pantallas pequeñas.
    document.body.dataset.vista = estado.ruta === null ? 'inicio' : 'curso';
    // El color de la ruta (--ruta) lo da este atributo a todo el curso.
    if (estado.ruta === null) delete nodos.vistaCurso.dataset.ruta;
    else nodos.vistaCurso.dataset.ruta = estado.ruta.id;

    if (enMapa) {
      Mapa.pintar(nodos.vistaMapa);
    } else if (enCertificados) {
      Certificados.pintar(nodos.vistaCertificados);
    } else if (enInicio) {
      pintarInicio();
    } else {
      pintarCurso();
    }
    volverArriba();
  }

  // Un paso nuevo empieza arriba: en la página y, en pantallas anchas, en
  // las dos columnas (cada una se desplaza por su lado).
  function volverArriba() {
    window.scrollTo({ top: 0 });
    nodos.columnaLeccion.scrollTop = 0;
    nodos.columnaTaller.scrollTop = 0;
  }

  // ---------- Navegación entre rutas ----------

  // Vuelve al último paso visitado de la ruta; si ya no existe, al principio.
  function buscarUbicacion(ruta, ultimo) {
    const inicio = { indiceLeccion: 0, indicePaso: 0 };
    if (!ultimo) return inicio;
    const indiceLeccion = ruta.lecciones.findIndex((leccion) => leccion.id === ultimo.leccionId);
    if (indiceLeccion === -1) return inicio;
    const indicePaso = ruta.lecciones[indiceLeccion].pasos.findIndex(
      (paso) => paso.id === ultimo.pasoId
    );
    return indicePaso === -1 ? { indiceLeccion, indicePaso: 0 } : { indiceLeccion, indicePaso };
  }

  // "#mapa" abre el Mapa del oficio (no es una ruta de lecciones).
  function direccionEsMapa() {
    return window.location.hash === '#mapa';
  }

  // "#certificados" abre el panel de certificados gratis (tampoco es una ruta).
  function direccionEsCertificados() {
    return window.location.hash === '#certificados';
  }

  function rutaDeLaDireccion() {
    let id = '';
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch (error) {
      return null; // dirección mal escrita: se trata como el inicio
    }
    const ruta = Rutas.buscar(id);
    return ruta && estaDisponible(ruta) ? ruta : null;
  }

  // Se llama al arrancar y cada vez que cambia el "#..." de la dirección.
  // "evento" solo existe cuando el cambio lo hizo el estudiante (no al arrancar).
  function alCambiarDireccion(evento) {
    guardarCodigoPendiente();
    const ruta = rutaDeLaDireccion();
    const turno = estado.turno + 1;

    if (ruta === null) {
      estado = { ...estado, ruta: null, turno };
      actualizarProgreso(Progreso.cerrarRuta(estado.progreso));
    } else {
      const ubicacion = buscarUbicacion(ruta, estado.progreso.ubicaciones[ruta.id]);
      estado = { ...estado, ruta, ...ubicacion, ...AL_ABRIR_UN_PASO, turno };
      actualizarProgreso(
        Progreso.recordarUbicacion(estado.progreso, ruta.id, leccionActual().id, pasoActual().id)
      );
      prepararMotor();
    }
    cerrarMenu();
    pintarVista();

    // El enlace que se usó para cambiar de vista quedó oculto: se lleva el
    // foco al título nuevo para quien usa teclado o lector de pantalla.
    if (evento) {
      const titulo =
        ruta !== null
          ? nodos.titulo
          : direccionEsMapa()
            ? porId('mapa-titulo')
            : direccionEsCertificados()
              ? porId('certificados-titulo')
              : nodos.inicioTitulo;
      titulo.focus({ preventScroll: true });
    }
  }

  // ---------- Navegación dentro de una ruta ----------

  // Devuelve la posición del paso siguiente (direccion 1) o anterior (-1),
  // saltando de lección cuando hace falta. Devuelve null si no hay más.
  function posicionVecina(direccion) {
    const lecciones = estado.ruta.lecciones;
    const indicePaso = estado.indicePaso + direccion;
    if (indicePaso >= 0 && indicePaso < leccionActual().pasos.length) {
      return { indiceLeccion: estado.indiceLeccion, indicePaso };
    }
    const indiceLeccion = estado.indiceLeccion + direccion;
    if (indiceLeccion < 0 || indiceLeccion >= lecciones.length) return null;
    return {
      indiceLeccion,
      indicePaso: direccion === 1 ? 0 : lecciones[indiceLeccion].pasos.length - 1,
    };
  }

  function irA(indiceLeccion, indicePaso) {
    guardarCodigoPendiente();
    estado = {
      ...estado,
      indiceLeccion,
      indicePaso,
      ...AL_ABRIR_UN_PASO,
      turno: estado.turno + 1,
    };
    actualizarProgreso(
      Progreso.recordarUbicacion(
        estado.progreso,
        estado.ruta.id,
        leccionActual().id,
        pasoActual().id
      )
    );
    cerrarMenu();
    prepararMotor();
    pintarCurso();
    volverArriba();
    // Los botones se vuelven a crear al pintar; sin esto, quien navega con
    // teclado o lector de pantalla quedaría "en el aire".
    nodos.titulo.focus({ preventScroll: true });
  }

  function irAVecino(direccion) {
    const posicion = posicionVecina(direccion);
    if (posicion) irA(posicion.indiceLeccion, posicion.indicePaso);
  }

  // Desde el menú se entra al primer paso que falte por completar.
  function abrirLeccion(indiceLeccion) {
    if (indiceLeccion === estado.indiceLeccion) {
      // No hay nada que pintar: solo se cierra el cajón y el foco vuelve al
      // botón del menú, para que no quede en un enlace que ya no se ve.
      cerrarMenuConTeclado();
      return;
    }
    const leccion = estado.ruta.lecciones[indiceLeccion];
    const pendiente = leccion.pasos.findIndex((paso) => !estaHecho(leccion, paso));
    irA(indiceLeccion, pendiente === -1 ? 0 : pendiente);
  }

  // El menú es un cajón que tapa la lección (salvo en pantallas muy anchas,
  // donde es una columna fija). Mientras está abierto, la lección queda
  // "inerte": el Tab no se escapa detrás del cajón y el lector de pantalla
  // solo lee el menú.
  function ponerMenuAbierto(abierto) {
    const comoCajon = abierto && !PANTALLA_CON_MENU.matches;
    nodos.menu.classList.toggle('menu--abierto', comoCajon);
    nodos.menuFondo.hidden = !comoCajon;
    nodos.contenido.inert = comoCajon;
    nodos.botonMenu.setAttribute('aria-expanded', String(comoCajon));
  }

  function cerrarMenu() {
    ponerMenuAbierto(false);
  }

  function alternarMenu() {
    const abrir = !nodos.menu.classList.contains('menu--abierto');
    ponerMenuAbierto(abrir);
    if (!abrir) return;
    // El foco entra al cajón, en la lección abierta: desde ahí se baja o sube.
    const actual = nodos.listaLecciones.querySelector('[aria-current="true"]');
    if (actual) {
      actual.focus({ preventScroll: true });
      actual.scrollIntoView({ block: 'center' });
    }
  }

  // Esc cierra el cajón y devuelve el foco al botón que lo abrió.
  function cerrarMenuConTeclado() {
    if (!nodos.menu.classList.contains('menu--abierto')) return false;
    cerrarMenu();
    nodos.botonMenu.focus();
    return true;
  }

  // Atajos que sirven en toda la vista del curso, no solo dentro del editor.
  function alPresionarTeclaEnLaPagina(evento) {
    if (estado.ruta === null) return;
    if (evento.key === 'Escape' && cerrarMenuConTeclado()) {
      evento.preventDefault();
      return;
    }
    // Ctrl+Enter ejecuta desde cualquier parte (el editor ya lo atiende).
    if (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey) && evento.target !== nodos.codigo) {
      // Con el cajón del menú o un diálogo abiertos, la lección está tapada:
      // ejecutar ahí sería un cambio que el estudiante no ve.
      if (nodos.contenido.inert || document.querySelector('dialog[open]')) return;
      evento.preventDefault();
      if (!PANTALLA_PARTIDA.matches) cambiarPanel('codigo');
      alEjecutar();
    }
  }

  // Si la app está abierta en dos pestañas, cada una se entera de lo que
  // guardó la otra y así no se pisan el progreso.
  function alCambiarAlmacen(evento) {
    // newValue === null significa que borraron la clave a mano: se ignora
    // para no volver a migrar el progreso del formato viejo.
    if (evento.key !== Progreso.CLAVE_ALMACEN || evento.newValue === null) return;
    estado = { ...estado, progreso: Progreso.cargar(ALMACEN) };
    if (estado.ruta === null) {
      pintarInicio();
      return;
    }
    pintarAvance();
    pintarMenu();
    pintarPestanas();
  }

  // ---------- Guardado del código ----------

  // No se guarda en cada tecla sino cuando el estudiante hace una pausa.
  function programarGuardado() {
    clearTimeout(temporizadorGuardado);
    temporizadorGuardado = setTimeout(guardarCodigoPendiente, ESPERA_AUTOGUARDADO_MS);
  }

  function cancelarGuardadoPendiente() {
    clearTimeout(temporizadorGuardado);
    temporizadorGuardado = null;
  }

  function guardarCodigoPendiente() {
    if (temporizadorGuardado === null || estado.ruta === null) return;
    cancelarGuardadoPendiente();
    actualizarProgreso(Progreso.guardarCodigo(estado.progreso, claveActual(), nodos.codigo.value));
  }

  // ---------- Acciones del estudiante ----------

  async function alEjecutar() {
    if (estado.ejecutando || estado.ruta === null) return;
    guardarCodigoPendiente();

    const clave = claveActual();
    const paso = pasoActual();
    const turno = estado.turno;
    estado = { ...estado, ejecutando: true };
    // aria-disabled (y no disabled): el botón se ve apagado pero conserva el
    // foco, así quien usa teclado no pierde su lugar mientras espera. Los
    // clics de más los frena la guarda de arriba.
    nodos.botonEjecutar.setAttribute('aria-disabled', 'true');
    nodos.botonEjecutar.classList.add('boton--cargando');
    nodos.ejecutarTexto.textContent = 'Ejecutando…';

    try {
      // El motor puede ir contando qué hace ("Cargando Python…").
      const avisar = (texto) => {
        if (turno !== estado.turno) return; // el estudiante ya está en otro paso
        nodos.ejecutarTexto.textContent = texto;
        nodos.estadoEjecucion.textContent = texto; // lo anuncian los lectores de pantalla
        // La primera vez Python tarda unos segundos: la consola lo dice para
        // que no parezca que la app se quedó quieta.
        nodos.consola.classList.add('consola--vacia', 'consola--cargando');
        nodos.consola.textContent = texto;
      };
      // El motor se toma del paso que se está ejecutando (guardado arriba en
      // "paso"), no del que esté abierto cuando llegue la respuesta.
      const motor = Motores.obtener(Rutas.motorDelPaso(estado.ruta, paso));
      const resultado = await motor.ejecutar(
        nodos.codigo.value,
        paso.pruebas || [],
        avisar,
        paso
      );
      // Si el estudiante cambió de paso o de ruta, o reinició, mientras
      // esperaba, el resultado ya no aplica.
      if (turno !== estado.turno) return;

      nodos.consola.classList.remove('consola--cargando');
      pintarResultado(resultado);
      const aprobado = resultado.error === null && resultado.resultados.every((r) => r.aprobada);
      if (aprobado) {
        const premio = completarPaso(clave);
        pintarAvance();
        pintarMenu();
        pintarPestanas();
        pintarFelicitacion(premio);
        if (premio.puntos > 0) lanzarConfeti();
      } else {
        nodos.felicitacion.hidden = true;
      }
    } finally {
      estado = { ...estado, ejecutando: false };
      nodos.botonEjecutar.removeAttribute('aria-disabled');
      nodos.botonEjecutar.classList.remove('boton--cargando');
      nodos.consola.classList.remove('consola--cargando');
      nodos.ejecutarTexto.textContent = '▶ Ejecutar';
      nodos.estadoEjecucion.textContent = '';
    }
  }

  // Marca el paso como hecho y calcula, con los números reales del progreso,
  // cuántos puntos dio y si con eso subió de nivel.
  function completarPaso(clave) {
    const antes = Progreso.puntos(estado.progreso);
    actualizarProgreso(
      Progreso.marcarCompletado(estado.progreso, clave, Progreso.fechaLocal(new Date()))
    );
    const despues = Progreso.puntos(estado.progreso);
    const nivelAntes = Progreso.nivelDe(antes).nivel;
    const nivelDespues = Progreso.nivelDe(despues).nivel;
    return {
      puntos: despues - antes,
      nivelNuevo: nivelDespues > nivelAntes ? nivelDespues : null,
    };
  }

  // Cada clic muestra una pista más. Cuando ya no quedan, el botón ofrece la
  // solución, pero primero pide confirmar: verla demasiado pronto quita la
  // parte del ejercicio donde más se aprende.
  function alPedirPista() {
    const total = (pasoActual().pistas || []).length;
    const quedanPistas = estado.pistasVistas < total;
    estado = quedanPistas
      ? { ...estado, pistasVistas: estado.pistasVistas + 1 }
      : { ...estado, confirmandoSolucion: true };
    pintarPistas();
    // El foco va a lo nuevo: así el teclado y el lector de pantalla lo encuentran.
    const nuevo = quedanPistas
      ? [...nodos.pistas.querySelectorAll('.pista')].pop()
      : nodos.pistas.querySelector('.confirmar button');
    if (nuevo) enfocarYMostrar(nuevo);
    refrescarBotonDeAyuda();
  }

  // El botón junto al resultado dice "Ver la pista N": tras pedir una pista
  // (o ver la solución) ese número ya no sirve, así que se cambia o se quita.
  function refrescarBotonDeAyuda() {
    if (nodos.ayudaResultado.hidden) return;
    const viejo = nodos.ayudaResultado.querySelector('.boton--pista');
    if (viejo) viejo.remove();
    // Va siempre al final de la nota, igual que en pintarAyudaResultado.
    nodos.ayudaResultado.append(...crearBotonDeAyuda());
  }

  function crearConfirmacionSolucion() {
    const caja = crear('div', {
      clase: 'confirmar',
      hijos: [
        crear('p', { clase: 'confirmar__titulo', texto: '¿Seguro que quieres ver la solución?' }),
        crear('p', {
          texto: 'Es mejor intentarlo un rato más: equivocarse y corregir es justo lo que te ' +
            'enseña. Si ya lo intentaste varias veces, mirarla y entenderla también sirve.',
        }),
        crear('div', {
          clase: 'confirmar__botones',
          hijos: [
            crear('button', {
              clase: 'boton boton--principal',
              texto: 'Sigo intentando',
              alHacerClic: () => responderSolucion(false),
            }),
            crear('button', {
              clase: 'boton',
              texto: 'Sí, ver la solución',
              alHacerClic: () => responderSolucion(true),
            }),
          ],
        }),
      ],
    });
    caja.setAttribute('role', 'group');
    caja.setAttribute('aria-label', 'Confirmar antes de ver la solución');
    return caja;
  }

  function responderSolucion(ver) {
    estado = { ...estado, confirmandoSolucion: false, solucionVisible: ver };
    pintarPistas();
    refrescarBotonDeAyuda();
    if (ver) enfocarYMostrar(nodos.pistas.querySelector('.solucion'));
    else nodos.codigo.focus();
  }

  // Lleva el foco a un elemento que no es un control (una pista, la
  // solución): tabindex="-1" deja enfocarlo por código sin meterlo en el Tab.
  function enfocarYMostrar(nodo) {
    if (!nodo.matches('button, a, textarea')) nodo.setAttribute('tabindex', '-1');
    nodo.focus({ preventScroll: true });
    nodo.scrollIntoView({ block: 'nearest', behavior: comportamientoDeDesplazamiento() });
  }

  // Desplazamiento suave solo si el estudiante no pidió reducir el movimiento.
  function comportamientoDeDesplazamiento() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function alReiniciarCodigo() {
    const seguro = window.confirm(
      '¿Borrar lo que escribiste en este paso y volver al código inicial?'
    );
    if (!seguro) return;
    cancelarGuardadoPendiente();
    estado = { ...estado, turno: estado.turno + 1 };
    actualizarProgreso(Progreso.olvidarCodigo(estado.progreso, claveActual()));
    pintarPaso();
  }

  // Borra solo la ruta abierta: el avance en las demás no se toca.
  function alBorrarProgreso() {
    const seguro = window.confirm(
      '¿Seguro que quieres borrar tu progreso y tu código de la ruta ' +
        estado.ruta.titulo + '? Esto no se puede deshacer. Las demás rutas no cambian.'
    );
    if (!seguro) return;
    cancelarGuardadoPendiente();
    actualizarProgreso(Progreso.borrarRuta(estado.progreso, estado.ruta.id));
    irA(0, 0);
  }

  function alEscribir() {
    pintarEditor();
    programarGuardado();
  }

  function alPresionarTecla(evento) {
    if (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey)) {
      evento.preventDefault();
      alEjecutar();
      return;
    }
    // Tab escribe espacios, pero eso atraparía a quien navega con teclado.
    // Por eso Esc "libera" el siguiente Tab para salir del editor.
    if (evento.key === 'Escape') {
      tabuladorLibre = true;
      return;
    }
    if (evento.key === 'Tab' && !evento.shiftKey && !tabuladorLibre) {
      evento.preventDefault();
      insertarEnEditor(sangriaActual());
      return;
    }
    // Enter conserva la sangría de la línea, y la aumenta si la línea abre
    // un bloque. (isComposing: no interrumpir al escribir tildes compuestas.)
    if (evento.key === 'Enter' && !evento.shiftKey && !evento.isComposing) {
      evento.preventDefault();
      insertarEnEditor('\n' + sangriaParaLineaNueva());
      return;
    }
    tabuladorLibre = false;
  }

  const sangriaActual = () => motorActual().sangria || SANGRIA_POR_DEFECTO;

  function sangriaParaLineaNueva() {
    const { selectionStart, value } = nodos.codigo;
    const inicioDeLinea = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const linea = value.slice(inicioDeLinea, selectionStart);
    const sangriaDeLinea = linea.match(/^[ \t]*/)[0];
    // En Python un bloque empieza con ":"; en JavaScript, con "{". En Python
    // se ignora lo que venga después de "#": un comentario que termina en
    // dos puntos no abre ningún bloque.
    const esPython = motorActual().lenguaje === 'python';
    const sinComentario = esPython ? linea.replace(/#.*$/, '') : linea;
    const abreBloque = esPython ? /[:([{]\s*$/ : /[([{]\s*$/;
    return sangriaDeLinea + (abreBloque.test(sinComentario) ? sangriaActual() : '');
  }

  // execCommand está marcado como antiguo, pero es la única forma de insertar
  // texto que conserva el Ctrl+Z del navegador. Si no existe, se usa el plan B.
  function insertarEnEditor(texto) {
    const insertado =
      typeof document.execCommand === 'function' && document.execCommand('insertText', false, texto);
    if (insertado) return; // execCommand ya disparó el evento "input"
    const { selectionStart, selectionEnd } = nodos.codigo;
    nodos.codigo.setRangeText(texto, selectionStart, selectionEnd, 'end');
    alEscribir();
  }

  // ---------- Arranque ----------

  function conectarEventos() {
    nodos.botonEjecutar.addEventListener('click', alEjecutar);
    nodos.botonPista.addEventListener('click', alPedirPista);
    nodos.botonReiniciar.addEventListener('click', alReiniciarCodigo);
    nodos.botonBorrar.addEventListener('click', alBorrarProgreso);
    nodos.botonMenu.addEventListener('click', alternarMenu);
    nodos.botonAnterior.addEventListener('click', () => irAVecino(-1));
    nodos.botonSiguiente.addEventListener('click', () => irAVecino(1));
    nodos.codigo.addEventListener('input', alEscribir);
    nodos.codigo.addEventListener('keydown', alPresionarTecla);
    nodos.codigo.addEventListener('scroll', sincronizarDesplazamiento);
    // Si cierran la pestaña justo después de escribir, no se pierde nada.
    window.addEventListener('pagehide', guardarCodigoPendiente);
    window.addEventListener('storage', alCambiarAlmacen);
    window.addEventListener('hashchange', alCambiarDireccion);
    document.addEventListener('keydown', alPresionarTeclaEnLaPagina);
    nodos.menuFondo.addEventListener('click', cerrarMenu);
    nodos.verLeccion.addEventListener('click', () => cambiarPanel('leccion'));
    nodos.verCodigo.addEventListener('click', () => cambiarPanel('codigo'));
    nodos.irAlCodigo.addEventListener('click', () => {
      cambiarPanel('codigo');
      nodos.verCodigo.focus();
    });
    // Si la ventana cambia de tamaño con el cajón abierto (por ejemplo, al
    // girar la tableta), se cierra: en la pantalla nueva podría no ser cajón.
    PANTALLA_CON_MENU.addEventListener('change', cerrarMenu);
    // Al angostarse la pantalla solo se ve una mitad. Si el foco estaba en el
    // editor y la mitad visible era la lección, el foco quedaría escondido.
    PANTALLA_PARTIDA.addEventListener('change', alCambiarPantallaPartida);
  }

  function alCambiarPantallaPartida() {
    if (PANTALLA_PARTIDA.matches) return;
    if (nodos.columnaTaller.contains(document.activeElement)) cambiarPanel('codigo');
  }

  // Si la dirección no pide ninguna ruta, se vuelve a la que el estudiante
  // tenía abierta la última vez (replaceState no agrega pasos al botón Atrás).
  function restaurarRutaAbierta() {
    const ruta = Rutas.buscar(estado.progreso.rutaAbierta || '');
    if (window.location.hash === '' && ruta && estaDisponible(ruta)) {
      window.history.replaceState(null, '', '#' + ruta.id);
    }
  }

  conectarEventos();
  restaurarRutaAbierta();
  alCambiarDireccion();
})();

// etapas.js — El camino recomendado: las rutas agrupadas en etapas, en orden.
//
// Un principiante no sabe por dónde empezar ni qué sigue. Por eso el inicio
// no muestra las 16 rutas sueltas, sino en etapas: primero las bases, luego
// la web, la IA, una especialidad y, al final, lo necesario para trabajar.
// Este archivo es el ÚNICO lugar donde vive ese orden (el inicio lo pinta y
// "Sigue por aquí" lo usa para recomendar). Las pruebas revisan que cada ruta
// del catálogo esté en exactamente una etapa.
//
// Todo aquí es "puro": no toca la página ni el progreso guardado. Recibe
// números y devuelve objetos nuevos, así se puede probar en Node.

(function () {
  'use strict';

  const ETAPAS = Object.freeze([
    Object.freeze({
      id: 'bases',
      titulo: 'Las bases',
      frase: 'Aprende a programar con Python y entiende cómo piensa un computador.',
      rutas: Object.freeze(['python', 'fundamentos']),
    }),
    Object.freeze({
      id: 'web',
      titulo: 'Construir para la web',
      frase: 'Haz páginas, dales vida con JavaScript, guarda datos con SQL y júntalo todo en proyectos.',
      rutas: Object.freeze(['web', 'javascript', 'sql', 'react', 'proyectos']),
    }),
    Object.freeze({
      id: 'ia',
      titulo: 'Trabajar con IA',
      frase: 'Usa modelos de lenguaje desde tu código y aprende a programar junto a un agente.',
      rutas: Object.freeze(['ia', 'con-ia']),
    }),
    Object.freeze({
      id: 'especialidad',
      titulo: 'Especialízate (elige)',
      frase: 'Escoge la que más te guste. Aprendizaje automático va mejor después de Análisis de datos.',
      rutas: Object.freeze(['datos', 'ml', 'ciberseguridad']),
    }),
    // Mismo orden que "Listo para trabajar" del Mapa (js/mapa.js, LISTO):
    // "proyectos-ia" va aquí y no en la etapa de IA porque da por hecho que ya
    // programas en tu computador, con tus herramientas instaladas.
    Object.freeze({
      id: 'trabajo',
      titulo: 'Listo para trabajar',
      frase: 'Tus propias herramientas, el día a día en una empresa, proyectos reales con IA y tu primer empleo.',
      rutas: Object.freeze(['tu-computador', 'oficio', 'proyectos-ia', 'primer-trabajo']),
    }),
  ]);

  // Todas las rutas en el orden del camino, de la primera a la última.
  const ORDEN = Object.freeze(ETAPAS.flatMap((etapa) => etapa.rutas));

  // "avance" es un objeto { idRuta: { hechos, total, disponible } } que arma
  // quien llama (app.js lo saca del progreso). Una ruta sin pasos (Próximamente)
  // nunca cuenta como terminada.
  const terminada = (dato) => dato.total > 0 && dato.hechos >= dato.total;
  const abrible = (dato) => Boolean(dato && dato.disponible);

  function etapaDe(rutaId) {
    return ETAPAS.find((etapa) => etapa.rutas.includes(rutaId)) || null;
  }

  // Pasos hechos y totales de una etapa, sumando solo las rutas que se pueden
  // abrir (las "Próximamente" no tienen pasos que hacer).
  function avanceDeEtapa(etapa, avance) {
    return etapa.rutas
      .map((id) => avance[id])
      .filter(abrible)
      .reduce((suma, dato) => ({ hechos: suma.hechos + dato.hechos, total: suma.total + dato.total }), {
        hechos: 0,
        total: 0,
      });
  }

  // Qué ruta recomendar en "Sigue por aquí". Devuelve { rutaId, continuando } o null.
  // 1. Si la última ruta abierta va empezada y sin terminar, se respeta: el
  //    estudiante eligió estar ahí (por ejemplo, una especialidad en otro orden).
  // 2. Si no, la primera ruta sin terminar siguiendo el camino. Sin progreso,
  //    esa es Python, la primera de "Las bases".
  // 3. Si ya terminó todo, se queda con la última abierta para repasar.
  function recomendar(avance, ultimaRuta) {
    const ultima = avance[ultimaRuta];
    if (abrible(ultima) && ultima.hechos > 0 && !terminada(ultima)) {
      return { rutaId: ultimaRuta, continuando: true };
    }
    const siguiente = ORDEN.find((id) => abrible(avance[id]) && !terminada(avance[id]));
    if (siguiente) return { rutaId: siguiente, continuando: avance[siguiente].hechos > 0 };
    if (abrible(ultima)) return { rutaId: ultimaRuta, continuando: true };
    const primera = ORDEN.find((id) => abrible(avance[id]));
    return primera ? { rutaId: primera, continuando: false } : null;
  }

  globalThis.Etapas = Object.freeze({ ETAPAS, ORDEN, etapaDe, avanceDeEtapa, recomendar });
})();

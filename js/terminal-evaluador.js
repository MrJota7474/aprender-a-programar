// terminal-evaluador.js — Una terminal de mentiras con un Git simulado.
//
// El navegador no puede ejecutar Git de verdad. Aquí se imita lo básico, con
// la misma salida (en español) que muestra Git, para aprender a guardar el
// trabajo: init, status, add, commit, log, diff (también git diff rama),
// branch, switch y merge. También los comandos básicos de Bash para moverse
// entre carpetas y archivos: pwd, ls, cd, mkdir, cat, echo (con > y >>),
// touch y rm.
//
// No usa nada del navegador: lo comparten el motor de la página
// (motor-terminal.js) y las pruebas automáticas que corren en Node.
//
// Pasa de 800 líneas a propósito: es un simulador completo en un solo archivo
// para que la página y las pruebas carguen exactamente lo mismo con un solo
// <script> o require, sin tener que mantener un orden entre varias piezas.
//
// ===================== CONTRATO =====================
//
// evaluarTerminal(codigo, pruebas, paso) → { salida, error, resultados }
//
//   codigo: los comandos del estudiante, uno por línea. Las líneas vacías y
//           las que empiezan con # (comentarios) se saltan. También se ignora
//           lo que va después de un # suelto: git add .  # todo
//   paso:   el paso de la lección. Puede traer:
//     paso.archivos    { "index.html": "<h1>Hola</h1>" } — la carpeta del
//                      proyecto al empezar (sin subcarpetas). Si un archivo no
//                      termina en salto de línea se le agrega, como hace echo.
//     paso.preparacion texto con comandos que se corren ANTES y en silencio
//                      (p. ej. "git init\ngit add .\ngit commit -m \"Inicio\""),
//                      para que un paso empiece con un repositorio ya armado.
//
//   salida: cada comando aparece como "$ comando" seguido de lo que mostró.
//   error:  null, o { nombre: 'ErrorTerminal', mensaje, linea, comando }.
//           Como en un script con "set -e", el PRIMER error detiene todo:
//           los comandos siguientes dependían de ese (no tiene sentido hacer
//           commit si el add falló) y un solo error claro enseña más que una
//           cascada. Si hubo error, no se revisan las pruebas (resultados: []),
//           igual que en los demás motores.
//           { nombre: 'ErrorInterno', mensaje } si falla la app o la preparación.
//
// Pruebas: cada { descripcion, condicion } es una expresión de JavaScript que
// debe dar true. Puede usar estos nombres (todos miran el estado FINAL):
//
//   salida            lista de líneas mostradas (incluye las "$ comando")
//   codigo            los comandos sin comentarios ni líneas vacías, en un texto
//   comandos          los mismos, como lista de textos
//   hayRepo()         true si se hizo git init
//   ramaActual()      'main', … (null sin git init)
//   ramas()           nombres de las ramas que ya existen, en orden alfabético
//                     (una rama nace con su primer commit, como en Git)
//   commits(rama?)    commits de la rama (o de la actual), del más nuevo al más
//                     viejo: [{ id, mensaje, padres, archivos }]. archivos es
//                     una copia de { nombre: contenido } guardada en ese commit.
//   ultimoCommit(rama?)  el más nuevo, o null
//   preparados()      archivos en el área de preparación (listos para commit)
//   archivos()        nombres de los archivos, con su carpeta: "datos/a.csv"
//   carpetas()        las subcarpetas que existen: ["datos"]
//   carpetaActual()   lo que mostraría pwd: "/proyecto/datos"
//   archivo(nombre)   su contenido actual, o null si no existe
//   estaGuardado(nombre)  true si el archivo está en el último commit de la
//                     rama actual y no tiene cambios sin guardar
//   limpio()          true si no queda nada sin guardar (lo que dice
//                     "nada para hacer commit, el árbol de trabajo está limpio")
//
// Consejo para escribir pruebas: revisar el ESTADO (commits().length >= 1,
// estaGuardado('index.html')) y no el texto exacto: así pasa igual quien usó
// otro mensaje de commit o "git add ." en vez del nombre del archivo.
//
// Los identificadores de commit son 7 letras hexadecimales calculadas con el
// contenido, el mensaje, el padre y el orden: siempre salen iguales para los
// mismos comandos, así las pruebas y las explicaciones no cambian.

(function () {
  'use strict';

  const CARPETA = '/proyecto';
  const RAMA_INICIAL = 'main';
  const AUTOR = 'Estudiante <estudiante@aprender.co>';
  // "cat a.txt >> a.txt" repetido duplica el archivo cada vez: sin este tope
  // unas pocas líneas llenarían la memoria.
  const MAXIMO_TAMANO_ARCHIVO = 20000;
  // Comparar dos archivos línea por línea cuesta (líneas de uno × líneas del
  // otro). Por encima de esto se muestra "todo se borró y todo se agregó".
  const MAXIMO_CELDAS_DIFERENCIA = 250000;
  // Esto corre en el hilo principal de la página: sin topes, unas pocas líneas
  // podrían congelarla (o llenar la memoria con millones de líneas de salida).
  const MAXIMO_LINEAS_SALIDA = 5000;
  const MAXIMO_COMANDOS = 500;
  const MAXIMO_COMMITS = 500;
  const COMANDOS_SHELL = ['git', 'pwd', 'ls', 'cd', 'mkdir', 'cat', 'echo', 'touch', 'rm'];
  const COMANDOS_GIT = ['init', 'status', 'add', 'commit', 'log', 'diff', 'branch', 'switch', 'checkout', 'merge'];
  const COMANDOS_REMOTOS = ['push', 'pull', 'clone', 'fetch', 'remote'];

  // Un error "del estudiante" (no de la app): se muestra con su línea y
  // detiene los comandos que siguen.
  class ErrorDeComando extends Error {}
  const fallar = (mensaje) => {
    throw new ErrorDeComando(mensaje);
  };

  // ---------- Herramientas para objetos { nombre: contenido } ----------

  // hasOwnProperty y no arbol[nombre]: un archivo llamado "constructor"
  // no debe confundirse con lo que todo objeto de JavaScript ya trae.
  const tiene = (objeto, clave) => Object.prototype.hasOwnProperty.call(objeto, clave);
  const leer = (objeto, clave) => (tiene(objeto, clave) ? objeto[clave] : undefined);
  const nombresDe = (objeto) => Object.keys(objeto).sort();
  const unionDeNombres = (...objetos) => [...new Set(objetos.flatMap(Object.keys))].sort();

  // Devuelve una copia con la clave cambiada (o quitada si el valor es undefined).
  function conValor(objeto, clave, valor) {
    if (valor !== undefined) return { ...objeto, [clave]: valor };
    return Object.fromEntries(Object.entries(objeto).filter(([nombre]) => nombre !== clave));
  }

  const plural = (cantidad, singular, varios) => cantidad + ' ' + (cantidad === 1 ? singular : varios);

  // Huella corta y siempre igual para el mismo texto (FNV-1a). Git usa SHA-1,
  // que es mucho más largo; para aprender basta con algo que no se repita.
  function huella(texto) {
    let valor = 0x811c9dc5;
    for (const letra of texto) {
      valor = Math.imul(valor ^ letra.codePointAt(0), 0x01000193) >>> 0;
    }
    return valor.toString(16).padStart(8, '0').slice(0, 7);
  }

  // Distancia de edición: cuántas letras hay que cambiar para pasar de una
  // palabra a otra. Sirve para sugerir "commit" cuando escriben "comit".
  function distancia(a, b) {
    let anterior = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const actual = [i];
      for (let j = 1; j <= b.length; j++) {
        actual[j] = Math.min(anterior[j] + 1, actual[j - 1] + 1, anterior[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      anterior = actual;
    }
    return anterior[b.length];
  }

  function parecido(palabra, opciones) {
    const candidatas = opciones
      .map((opcion) => ({ opcion, distancia: distancia(palabra.toLowerCase(), opcion) }))
      .filter((c) => c.distancia <= 2 && c.distancia < palabra.length)
      .sort((x, y) => x.distancia - y.distancia);
    return candidatas.length > 0 ? candidatas[0].opcion : null;
  }

  // ---------- Contenido de archivos y diferencias ----------

  const lineasDe = (contenido) => {
    if (contenido === undefined || contenido === '') return [];
    const lineas = contenido.split('\n');
    return lineas[lineas.length - 1] === '' ? lineas.slice(0, -1) : lineas;
  };

  // Compara dos listas de líneas (subsecuencia común más larga) y devuelve
  // [{ tipo: ' ' | '-' | '+', texto }], que es justo lo que imprime git diff.
  function diferencia(antes, despues) {
    if (antes.length * despues.length > MAXIMO_CELDAS_DIFERENCIA) {
      return [...antes.map((texto) => ({ tipo: '-', texto })), ...despues.map((texto) => ({ tipo: '+', texto }))];
    }
    const comun = Array.from({ length: antes.length + 1 }, () => new Array(despues.length + 1).fill(0));
    for (let i = antes.length - 1; i >= 0; i--) {
      for (let j = despues.length - 1; j >= 0; j--) {
        comun[i][j] = antes[i] === despues[j] ? comun[i + 1][j + 1] + 1 : Math.max(comun[i + 1][j], comun[i][j + 1]);
      }
    }
    const partes = [];
    let i = 0;
    let j = 0;
    while (i < antes.length || j < despues.length) {
      if (i < antes.length && j < despues.length && antes[i] === despues[j]) {
        partes.push({ tipo: ' ', texto: antes[i] });
        i++;
        j++;
      } else if (j >= despues.length || (i < antes.length && comun[i + 1][j] >= comun[i][j + 1])) {
        partes.push({ tipo: '-', texto: antes[i] });
        i++;
      } else {
        partes.push({ tipo: '+', texto: despues[j] });
        j++;
      }
    }
    return partes;
  }

  // " 1 archivo cambiado, 2 inserciones(+)" y " create mode 100644 index.html":
  // lo que Git imprime después de un commit o de un merge.
  function resumenDeCambios(antes, despues) {
    const cambiados = unionDeNombres(antes, despues).filter((n) => leer(antes, n) !== leer(despues, n));
    if (cambiados.length === 0) return [];
    const partes = cambiados.flatMap((n) => diferencia(lineasDe(leer(antes, n)), lineasDe(leer(despues, n))));
    const agregadas = partes.filter((p) => p.tipo === '+').length;
    const quitadas = partes.filter((p) => p.tipo === '-').length;
    const totales = [' ' + plural(cambiados.length, 'archivo cambiado', 'archivos cambiados')];
    if (agregadas > 0) totales.push(plural(agregadas, 'inserción(+)', 'inserciones(+)'));
    if (quitadas > 0) totales.push(plural(quitadas, 'eliminación(-)', 'eliminaciones(-)'));
    const modos = cambiados
      .filter((n) => !tiene(antes, n) || !tiene(despues, n))
      .map((n) => (tiene(antes, n) ? ' delete mode 100644 ' : ' create mode 100644 ') + n);
    return [totales.join(', '), ...modos];
  }

  // ---------- El repositorio ----------
  //
  // estado = { archivos, repo, carpetas, actual }
  //   archivos: la carpeta de trabajo, { nombre: contenido }; el nombre puede
  //             llevar carpetas delante ("datos/clientes.csv")
  //   carpetas: las subcarpetas que existen, ["datos", "datos/viejos"]
  //   actual:   la carpeta donde está parado el estudiante ('' = el proyecto)
  //   repo:     null antes de git init, o
  //             { rama, ramas: { nombre: idCommit }, commits: { id: commit }, totalCommits (cuántos van, para no contarlos cada vez), indice }
  //   indice:   el "área de preparación": la foto completa que guardará el
  //             próximo commit. git add copia ahí un archivo de la carpeta.
  //   commit:   { id, mensaje, padres: [id], arbol: { nombre: contenido }, numero }
  //
  // Ninguna función modifica el estado que recibe: devuelve uno nuevo.

  const REPO_VACIO = Object.freeze({ rama: RAMA_INICIAL, ramas: {}, commits: {}, totalCommits: 0, indice: {} });

  const idCabeza = (repo) => leer(repo.ramas, repo.rama) || null;
  const arbolDe = (repo, id) => (id ? repo.commits[id].arbol : {});
  const arbolCabeza = (repo) => arbolDe(repo, idCabeza(repo));

  // Todos los commits a los que se llega desde "id" yendo hacia atrás por los
  // padres, del más nuevo al más viejo (el número dice en qué orden se hicieron).
  function historia(repo, id) {
    const vistos = new Set();
    const pendientes = id ? [id] : [];
    while (pendientes.length > 0) {
      const actual = pendientes.pop();
      if (!vistos.has(actual)) {
        vistos.add(actual);
        pendientes.push(...repo.commits[actual].padres);
      }
    }
    return [...vistos].map((v) => repo.commits[v]).sort((a, b) => b.numero - a.numero);
  }

  const esAncestro = (repo, posible, de) => historia(repo, de).some((commit) => commit.id === posible);

  // Lo que mostraría git status, agrupado.
  function cambiosDe(estado) {
    const cabeza = arbolCabeza(estado.repo);
    const indice = estado.repo.indice;
    const tipo = (antes, despues) => (antes === undefined ? 'nuevo archivo' : despues === undefined ? 'borrado' : 'modificado');
    const preparados = unionDeNombres(cabeza, indice)
      .filter((n) => leer(cabeza, n) !== leer(indice, n))
      .map((nombre) => ({ nombre, tipo: tipo(leer(cabeza, nombre), leer(indice, nombre)) }));
    const sinPreparar = nombresDe(indice)
      .filter((n) => leer(indice, n) !== leer(estado.archivos, n))
      .map((nombre) => ({ nombre, tipo: tipo(leer(indice, nombre), leer(estado.archivos, nombre)) }));
    const sinSeguimiento = nombresDe(estado.archivos).filter((n) => !tiene(indice, n));
    return { preparados, sinPreparar, sinSeguimiento };
  }

  // Cambia la carpeta y el área de preparación a la foto "destino" (al
  // cambiar de rama o en un merge). Igual que Git, se niega si eso borraría
  // cambios que el estudiante no ha guardado.
  function moverA(estado, destino) {
    const cabeza = arbolCabeza(estado.repo);
    const { indice } = estado.repo;
    const cambian = unionDeNombres(cabeza, destino, estado.archivos).filter((n) => leer(cabeza, n) !== leer(destino, n));
    const enPeligro = cambian.filter(
      (n) =>
        (leer(indice, n) !== leer(cabeza, n) || leer(estado.archivos, n) !== leer(cabeza, n)) &&
        leer(estado.archivos, n) !== leer(destino, n)
    );
    if (enPeligro.length > 0) {
      fallar(
        'Tus cambios sin guardar en ' + enPeligro.join(', ') + ' se perderían. ' +
          'Guárdalos primero con git add y git commit, y vuelve a intentarlo.'
      );
    }
    return {
      archivos: cambian.reduce((archivos, n) => conValor(archivos, n, leer(destino, n)), estado.archivos),
      indice: cambian.reduce((nuevo, n) => conValor(nuevo, n, leer(destino, n)), indice),
    };
  }

  // ---------- Leer una línea ----------

  // Parte la línea en palabras como lo hace la terminal: lo que va entre
  // comillas es UNA sola palabra, y > o >> mandan la salida a un archivo.
  function partirLinea(linea) {
    const fichas = [];
    let i = 0;
    while (i < linea.length) {
      const letra = linea[i];
      if (/\s/.test(letra)) {
        i++;
      } else if (letra === '#') {
        break; // lo que sigue es un comentario
      } else if (letra === '>') {
        const doble = linea[i + 1] === '>';
        fichas.push({ texto: doble ? '>>' : '>', redireccion: true });
        i += doble ? 2 : 1;
      } else if ('|&;<'.includes(letra)) {
        fallar('Aquí no se puede usar "' + letra + '". Escribe un solo comando por línea.');
      } else {
        let texto = '';
        let conComillas = false;
        while (i < linea.length && !/\s/.test(linea[i]) && !'>|&;<'.includes(linea[i])) {
          const actual = linea[i];
          if (actual === '"' || actual === "'") {
            const cierre = linea.indexOf(actual, i + 1);
            if (cierre === -1) fallar('Abriste una comilla (' + actual + ') y no la cerraste.');
            texto += linea.slice(i + 1, cierre);
            conComillas = true;
            i = cierre + 1;
          } else {
            texto += actual;
            i++;
          }
        }
        fichas.push({ texto, conComillas });
      }
    }
    return fichas;
  }

  // Separa "comando > archivo" en el comando y a dónde va su salida.
  function separarRedireccion(fichas) {
    const posicion = fichas.findIndex((f) => f.redireccion);
    if (posicion === -1) return { fichas, destino: null };
    const archivo = fichas[posicion + 1];
    if (!archivo || archivo.redireccion || fichas.length > posicion + 2) {
      fallar('Después de ' + fichas[posicion].texto + ' va solo el nombre de un archivo, al final de la línea.');
    }
    return { fichas: fichas.slice(0, posicion), destino: { archivo: archivo.texto, agregar: fichas[posicion].texto === '>>' } };
  }

  function validarNombreArchivo(nombre) {
    if (!/^[\w.-]+$/.test(nombre) || nombre === '.' || nombre === '..' || nombre === '.git') {
      fallar('"' + nombre + '" no sirve como nombre de archivo o carpeta aquí: usa letras, números, punto, guion o guion bajo.');
    }
  }

  // ---------- Carpetas ----------
  //
  // Los archivos siguen guardados en un solo objeto, pero su nombre puede
  // llevar la carpeta delante: "datos/clientes.csv". Así Git (que también
  // guarda rutas así) no tuvo que cambiar. Las carpetas van aparte, en
  // estado.carpetas, porque una carpeta vacía (recién creada con mkdir) no
  // tiene archivos que la delaten. estado.actual es dónde está parado el
  // estudiante: '' es la carpeta del proyecto.

  const padreDe = (ruta) => (ruta.includes('/') ? ruta.slice(0, ruta.lastIndexOf('/')) : '');
  const ultimaParte = (ruta) => ruta.slice(ruta.lastIndexOf('/') + 1);
  const conCarpeta = (carpeta, nombre) => (carpeta ? carpeta + '/' + nombre : nombre);
  const esCarpeta = (estado, ruta) => ruta === '' || estado.carpetas.includes(ruta);
  const rutaCompleta = (ruta) => (ruta ? CARPETA + '/' + ruta : CARPETA);

  // Convierte lo que escribió el estudiante ("datos", "../notas.txt",
  // "/proyecto/datos") en una ruta desde la carpeta del proyecto.
  function resolver(estado, escrita) {
    let partes = estado.actual ? estado.actual.split('/') : [];
    let resto = escrita;
    if (escrita === CARPETA || escrita.startsWith(CARPETA + '/')) {
      partes = [];
      resto = escrita.slice(CARPETA.length);
    } else if (escrita.startsWith('/') || escrita.startsWith('~')) {
      fallar('En esta terminal solo existe la carpeta del proyecto (' + CARPETA + '): no puedes ir a "' + escrita + '".');
    }
    for (const parte of resto.split('/')) {
      if (parte === '' || parte === '.') continue;
      if (parte === '..') {
        if (partes.length === 0) fallar('No puedes salir de ' + CARPETA + ': en esta terminal es la carpeta más alta.');
        partes = partes.slice(0, -1);
      } else {
        validarNombreArchivo(parte);
        partes = [...partes, parte];
      }
    }
    return partes.join('/');
  }

  // La ruta de un archivo, revisando que su carpeta exista (como en Bash,
  // echo hola > nada/a.txt falla si la carpeta "nada" no existe).
  function rutaDeArchivo(estado, escrita, comando) {
    const ruta = resolver(estado, escrita);
    if (ruta === '' || esCarpeta(estado, ruta)) fallar(comando + ': ' + escrita + ': Es un directorio');
    if (!esCarpeta(estado, padreDe(ruta))) fallar(comando + ': ' + escrita + ': No existe el archivo o el directorio');
    return ruta;
  }

  // Todas las carpetas que hacen falta para llegar a una ruta: "a/b/c.txt" → ["a", "a/b"].
  const carpetasHasta = (ruta) =>
    ruta.split('/').slice(0, -1).map((_, i, partes) => partes.slice(0, i + 1).join('/'));

  function escribir(archivos, nombre, contenido) {
    nombre.split('/').forEach(validarNombreArchivo);
    if (contenido.length > MAXIMO_TAMANO_ARCHIVO) {
      fallar('El archivo ' + nombre + ' quedaría demasiado grande (más de ' + MAXIMO_TAMANO_ARCHIVO + ' letras).');
    }
    return conValor(archivos, nombre, contenido);
  }

  // ---------- Comandos de archivos ----------

  function avisarSiHayDemasiadasLineas(cantidad) {
    if (cantidad > MAXIMO_LINEAS_SALIDA) {
      fallar('Tus comandos mostraron demasiadas líneas (más de ' + MAXIMO_LINEAS_SALIDA + '). Muestra menos archivos a la vez o hazlos más cortos.');
    }
  }

  const sinOpciones = (comando, argumentos) => {
    const opcion = argumentos.find((a) => a.startsWith('-'));
    if (opcion) fallar(comando + ': la opción ' + opcion + ' no está disponible en esta terminal.');
  };

  const COMANDOS = {
    // pwd ("print working directory"): dice en qué carpeta estás parado.
    pwd(estado, argumentos) {
      sinOpciones('pwd', argumentos);
      return { estado, salida: [rutaCompleta(estado.actual)] };
    },

    // cd sin nada vuelve a la carpeta del proyecto (en Bash vuelve a tu
    // carpeta personal; aquí esa es la única "casa" que hay).
    cd(estado, argumentos) {
      if (argumentos.length > 1) fallar('cd recibe una sola carpeta, por ejemplo: cd datos');
      const destino = argumentos.length === 0 ? '' : resolver(estado, argumentos[0]);
      if (!esCarpeta(estado, destino)) {
        const motivo = tiene(estado.archivos, destino) ? 'No es un directorio' : 'No existe el archivo o el directorio';
        fallar('cd: ' + argumentos[0] + ': ' + motivo);
      }
      return { estado: { ...estado, actual: destino }, salida: [] };
    },

    mkdir(estado, argumentos) {
      sinOpciones('mkdir', argumentos);
      if (argumentos.length === 0) fallar('mkdir necesita el nombre de la carpeta que quieres crear, por ejemplo: mkdir datos');
      // Se van sumando de a una: "mkdir datos datos/viejos" crea las dos.
      const carpetas = argumentos.reduce((actuales, escrita) => {
        const vista = { ...estado, carpetas: actuales };
        const ruta = resolver(vista, escrita);
        if (ruta === '' || esCarpeta(vista, ruta) || tiene(estado.archivos, ruta)) {
          fallar("mkdir: no se puede crear el directorio '" + escrita + "': El archivo ya existe");
        }
        if (!esCarpeta(vista, padreDe(ruta))) {
          fallar("mkdir: no se puede crear el directorio '" + escrita + "': No existe el archivo o el directorio");
        }
        return [...actuales, ruta].sort();
      }, estado.carpetas);
      return { estado: { ...estado, carpetas }, salida: [] };
    },

    // Las carpetas salen con una / al final (como con "ls -F"): aquí no hay
    // colores que las distingan de los archivos.
    ls(estado, argumentos) {
      sinOpciones('ls', argumentos);
      if (argumentos.length > 1) fallar('ls recibe una sola carpeta a la vez, por ejemplo: ls datos');
      const donde = argumentos.length === 0 ? estado.actual : resolver(estado, argumentos[0]);
      if (!esCarpeta(estado, donde)) {
        if (tiene(estado.archivos, donde)) return { estado, salida: [argumentos[0]] };
        fallar("ls: no se puede acceder a '" + argumentos[0] + "': No existe el archivo o el directorio");
      }
      const hijos = (rutas) => rutas.filter((r) => padreDe(r) === donde).map(ultimaParte);
      const nombres = [...hijos(nombresDe(estado.archivos)), ...hijos(estado.carpetas).map((n) => n + '/')].sort();
      return { estado, salida: nombres.length > 0 ? [nombres.join('  ')] : [] };
    },

    cat(estado, argumentos) {
      if (argumentos.length === 0) fallar('cat necesita el nombre de un archivo, por ejemplo: cat index.html');
      const salida = [];
      for (const nombre of argumentos) {
        const ruta = resolver(estado, nombre);
        if (esCarpeta(estado, ruta)) fallar('cat: ' + nombre + ': Es un directorio');
        if (!tiene(estado.archivos, ruta)) fallar('cat: ' + nombre + ': No existe el archivo o el directorio');
        for (const linea of lineasDe(estado.archivos[ruta])) salida.push(linea);
        avisarSiHayDemasiadasLineas(salida.length);
      }
      return { estado, salida };
    },

    echo(estado, argumentos) {
      return { estado, salida: [argumentos.join(' ')] };
    },

    touch(estado, argumentos) {
      if (argumentos.length === 0) fallar('touch necesita el nombre del archivo que quieres crear.');
      const archivos = argumentos.reduce((actuales, nombre) => {
        const ruta = rutaDeArchivo(estado, nombre, 'touch');
        return tiene(actuales, ruta) ? actuales : escribir(actuales, ruta, '');
      }, estado.archivos);
      return { estado: { ...estado, archivos }, salida: [] };
    },

    rm(estado, argumentos) {
      sinOpciones('rm', argumentos);
      if (argumentos.length === 0) fallar('rm necesita el nombre del archivo que quieres borrar.');
      const archivos = argumentos.reduce((actuales, nombre) => {
        const ruta = resolver(estado, nombre);
        if (esCarpeta(estado, ruta)) fallar("rm: no se puede borrar '" + nombre + "': Es un directorio");
        if (!tiene(actuales, ruta)) fallar("rm: no se puede borrar '" + nombre + "': No existe el archivo o el directorio");
        return conValor(actuales, ruta, undefined);
      }, estado.archivos);
      return { estado: { ...estado, archivos }, salida: [] };
    },

    git(estado, argumentos, fichas) {
      // Los nombres que entiende Git aquí son rutas desde la carpeta del
      // proyecto; para no tener que traducirlas, git se usa desde ahí.
      if (estado.actual !== '') fallar('En esta terminal git se usa desde ' + CARPETA + '. Escribe cd para volver a ella.');
      return ejecutarGit(estado, argumentos, fichas);
    },
  };

  // ---------- Git ----------

  function validarNombreRama(nombre) {
    if (nombre.startsWith('-')) fallar('La opción ' + nombre + ' no está disponible en este simulador.');
    if (!/^[\w./-]+$/.test(nombre) || /\.\.|\/\/|^\/|\/$|\.$/.test(nombre)) {
      fallar('"' + nombre + '" no es un nombre válido para una rama. Usa letras, números y guiones, como: nueva-portada');
    }
  }

  // "(HEAD -> main, otra)": qué ramas señalan a este commit.
  function decoracion(repo, id) {
    const ramas = nombresDe(repo.ramas).filter((r) => repo.ramas[r] === id);
    if (ramas.length === 0) return '';
    const enCabeza = repo.ramas[repo.rama] === id;
    const nombres = enCabeza ? ['HEAD -> ' + repo.rama, ...ramas.filter((r) => r !== repo.rama)] : ramas;
    return ' (' + nombres.join(', ') + ')';
  }

  function nuevoCommit(repo, { mensaje, padres, arbol }) {
    if (repo.totalCommits >= MAXIMO_COMMITS) {
      fallar('Ya hay ' + MAXIMO_COMMITS + ' commits: este simulador no admite más. Empieza de nuevo con menos commits.');
    }
    const numero = repo.totalCommits + 1;
    const serializado = nombresDe(arbol).map((n) => n + '\u0000' + arbol[n]).join('\u0000');
    const id = huella([padres.join(','), mensaje, serializado, numero].join('\n'));
    const commit = Object.freeze({ id, mensaje, padres, arbol, numero });
    return {
      ...repo,
      commits: { ...repo.commits, [id]: commit },
      totalCommits: numero,
      ramas: { ...repo.ramas, [repo.rama]: id },
      indice: arbol,
    };
  }

  // Lo que va después de "-m": el mensaje. Si no iba entre comillas y le
  // siguen más palabras, la terminal lo partió: es el error más común.
  function leerOpcionesCommit(fichas) {
    let mensaje = null;
    let todos = false;
    for (let i = 0; i < fichas.length; i++) {
      const { texto, conComillas } = fichas[i];
      if (!conComillas && (texto === '-m' || texto === '-am' || texto === '-a')) {
        todos = todos || texto !== '-m';
        if (texto === '-a') continue;
        const siguiente = fichas[i + 1];
        if (!siguiente) fallar('Falta el mensaje después de -m. Escríbelo entre comillas: git commit -m "Describe tu cambio"');
        if (mensaje !== null) fallar('Usa un solo -m con todo el mensaje entre comillas.');
        if (!siguiente.conComillas && fichas.length > i + 2) {
          const palabras = fichas.slice(i + 1).map((f) => f.texto).join(' ');
          fallar('El mensaje del commit va entre comillas, así: git commit -m "' + palabras + '"');
        }
        mensaje = siguiente.texto;
        i++;
      } else {
        fallar('No entiendo "' + texto + '" en git commit. La forma es: git commit -m "Describe tu cambio"');
      }
    }
    if (mensaje === null) {
      fallar('Falta el mensaje del commit. Escríbelo con -m y entre comillas: git commit -m "Describe tu cambio"');
    }
    if (mensaje.trim() === '') {
      fallar('El mensaje del commit está vacío y Git no guarda un commit sin mensaje. Escribe qué cambiaste: git commit -m "Agrega el título"');
    }
    return { mensaje: mensaje.trim(), todos };
  }

  const GIT = {
    init(estado) {
      if (estado.repo) {
        return { estado, salida: ['Reinicializado el repositorio Git existente en ' + CARPETA + '/.git/'] };
      }
      return { estado: { ...estado, repo: REPO_VACIO }, salida: ['Inicializado repositorio Git vacío en ' + CARPETA + '/.git/'] };
    },

    status(estado, argumentos) {
      sinOpciones('git status', argumentos);
      const { repo } = estado;
      const { preparados, sinPreparar, sinSeguimiento } = cambiosDe(estado);
      const renglon = (c) => '        ' + (c.tipo + ':').padEnd(16) + c.nombre;
      const salida = ['En la rama ' + repo.rama];
      if (!idCabeza(repo)) salida.push('', 'No hay commits todavía');
      if (preparados.length > 0) {
        salida.push('', 'Cambios a ser confirmados:', ...preparados.map(renglon));
      }
      if (sinPreparar.length > 0) {
        salida.push('', 'Cambios no rastreados para el commit:', '  (usa "git add <archivo>..." para actualizar lo que será confirmado)', ...sinPreparar.map(renglon));
      }
      if (sinSeguimiento.length > 0) {
        salida.push('', 'Archivos sin seguimiento:', '  (usa "git add <archivo>..." para incluirlo a lo que será confirmado)', ...sinSeguimiento.map((n) => '        ' + n));
      }
      salida.push('');
      if (preparados.length > 0) return { estado, salida: salida.slice(0, -1) };
      if (sinPreparar.length > 0) salida.push('sin cambios agregados al commit (usa "git add" y/o "git commit -a")');
      else if (sinSeguimiento.length > 0) salida.push('no hay nada agregado al commit pero hay archivos sin seguimiento presentes (usa "git add" para hacerles seguimiento)');
      else if (!idCabeza(repo)) salida.push('nada para hacer commit (crea/copia archivos y usa "git add" para hacerles seguimiento)');
      else salida.push('nada para hacer commit, el árbol de trabajo está limpio');
      return { estado, salida };
    },

    add(estado, argumentos) {
      if (argumentos.length === 0) {
        fallar('Nada especificado, nada agregado. Di qué archivo quieres preparar (git add index.html) o usa git add . para todos.');
      }
      const { repo, archivos } = estado;
      // ".", "-A" y "--all" preparan toda la carpeta; "*" es lo que la terminal
      // convierte en la lista de archivos que hay.
      const nombres = argumentos.flatMap((argumento) => {
        if (argumento === '.' || argumento === '-A' || argumento === '--all') return unionDeNombres(archivos, repo.indice);
        if (argumento === '*') return nombresDe(archivos);
        if (argumento.startsWith('-')) fallar('La opción ' + argumento + ' de git add no está disponible en este simulador.');
        // Una carpeta ("datos" o "datos/") prepara todo lo que hay dentro,
        // como en Git real. Se mira también el índice para incluir los
        // archivos borrados de esa carpeta.
        const carpeta = argumento.replace(/\/+$/, '') + '/';
        const dentro = unionDeNombres(archivos, repo.indice).filter((n) => n.startsWith(carpeta));
        if (dentro.length > 0) return dentro;
        if (!tiene(archivos, argumento) && !tiene(repo.indice, argumento)) {
          const parecida = parecido(argumento, nombresDe(archivos));
          fallar(
            'No existe el archivo "' + argumento + '", así que no hay nada que agregar.' +
              (parecida ? ' ¿Quisiste decir ' + parecida + '?' : ' Revisa el nombre con ls.')
          );
        }
        return [argumento];
      });
      const indice = nombres.reduce((nuevo, n) => conValor(nuevo, n, leer(archivos, n)), repo.indice);
      return { estado: { ...estado, repo: { ...repo, indice } }, salida: [] };
    },

    commit(estado, argumentos, fichas) {
      const { mensaje, todos } = leerOpcionesCommit(fichas);
      // -a prepara solo los archivos que Git ya conocía (no los nuevos).
      const repo = todos
        ? { ...estado.repo, indice: nombresDe(estado.repo.indice).reduce((nuevo, n) => conValor(nuevo, n, leer(estado.archivos, n)), estado.repo.indice) }
        : estado.repo;
      const cabeza = idCabeza(repo);
      const antes = arbolDe(repo, cabeza);
      if (unionDeNombres(antes, repo.indice).every((n) => leer(antes, n) === leer(repo.indice, n))) {
        fallar(
          'No hay nada en el área de preparación, así que no hay nada que guardar. ' +
            'Primero prepara tus cambios con git add <archivo> (o git add . para todos) y después haz el commit.'
        );
      }
      const nuevo = nuevoCommit(repo, { mensaje, padres: cabeza ? [cabeza] : [], arbol: repo.indice });
      const id = nuevo.ramas[nuevo.rama];
      const encabezado = '[' + repo.rama + (cabeza ? '' : ' (commit-raíz)') + ' ' + id + '] ' + mensaje.split('\n')[0];
      return { estado: { ...estado, repo: nuevo }, salida: [encabezado, ...resumenDeCambios(antes, repo.indice)] };
    },

    log(estado, argumentos) {
      const { repo } = estado;
      const corto = argumentos.includes('--oneline');
      const otros = argumentos.filter((a) => a !== '--oneline');
      if (otros.length > 1 || (otros[0] && otros[0].startsWith('-'))) {
        fallar('Esa forma de git log no está disponible aquí. Prueba git log o git log --oneline.');
      }
      const rama = otros[0] || repo.rama;
      if (otros[0] && !tiene(repo.ramas, rama)) fallar('No existe la rama "' + rama + '". Mira cuáles hay con git branch.');
      const commits = historia(repo, leer(repo.ramas, rama));
      if (commits.length === 0) {
        fallar('Tu rama actual "' + rama + '" todavía no tiene commits. Haz el primero con git add y git commit -m "mensaje".');
      }
      const salida = commits.flatMap((c) =>
        corto
          ? [c.id + decoracion(repo, c.id) + ' ' + c.mensaje.split('\n')[0]]
          : [
              'commit ' + c.id + decoracion(repo, c.id),
              ...(c.padres.length > 1 ? ['Merge: ' + c.padres.join(' ')] : []),
              'Autor: ' + AUTOR,
              '',
              ...c.mensaje.split('\n').map((linea) => '    ' + linea),
              '',
            ]
      );
      return { estado, salida: corto ? salida : salida.slice(0, -1) };
    },

    diff(estado, argumentos) {
      const preparado = argumentos.some((a) => a === '--staged' || a === '--cached');
      const otros = argumentos.filter((a) => a !== '--staged' && a !== '--cached');
      const { repo } = estado;
      // "git diff main": tu carpeta frente a la última foto de otra rama. Es
      // lo que verá quien revise tu pull request (si tu rama ya trae lo
      // último de main). Solo se acepta un nombre de rama que exista.
      const rama = otros.length === 1 && !preparado && tiene(repo.ramas, otros[0]) ? otros[0] : null;
      if (otros.length > 0 && rama === null) {
        fallar(
          'git diff con un archivo o una opción no está disponible en este simulador. ' +
            'Usa git diff, git diff --staged o git diff nombre-de-una-rama (por ejemplo, git diff main).'
        );
      }
      // Sin opciones: lo que cambiaste y aún no preparas. Con --staged: lo
      // que ya preparaste y guardará el próximo commit. Con una rama: los
      // archivos que Git vigila (los del índice), como están en la carpeta.
      const vigilados = Object.fromEntries(
        nombresDe(repo.indice).filter((n) => tiene(estado.archivos, n)).map((n) => [n, estado.archivos[n]])
      );
      const antes = rama ? arbolDe(repo, repo.ramas[rama]) : preparado ? arbolCabeza(repo) : repo.indice;
      const despues = rama ? vigilados : preparado ? repo.indice : estado.archivos;
      const nombres = (rama || preparado ? unionDeNombres(antes, despues) : nombresDe(antes)).filter(
        (n) => leer(antes, n) !== leer(despues, n)
      );
      const salida = nombres.flatMap((n) => {
        const viejas = lineasDe(leer(antes, n));
        const nuevas = lineasDe(leer(despues, n));
        const rango = (lineas) => (lineas.length === 0 ? '0,0' : '1,' + lineas.length);
        return [
          'diff --git a/' + n + ' b/' + n,
          ...(tiene(antes, n) ? [] : ['new file mode 100644']),
          ...(tiene(despues, n) ? [] : ['deleted file mode 100644']),
          '--- ' + (tiene(antes, n) ? 'a/' + n : '/dev/null'),
          '+++ ' + (tiene(despues, n) ? 'b/' + n : '/dev/null'),
          ...(viejas.length === 0 && nuevas.length === 0
            ? []
            : ['@@ -' + rango(viejas) + ' +' + rango(nuevas) + ' @@', ...diferencia(viejas, nuevas).map((p) => p.tipo + p.texto)]),
        ];
      });
      return { estado, salida };
    },

    branch(estado, argumentos) {
      const { repo } = estado;
      if (argumentos.length === 0) {
        const lineas = nombresDe(repo.ramas).map((r) => (r === repo.rama ? '* ' : '  ') + r);
        return { estado, salida: lineas };
      }
      if (argumentos[0] === '-d' || argumentos[0] === '--delete') return borrarRama(estado, argumentos.slice(1));
      const opcion = argumentos.find((a) => a.startsWith('-'));
      if (opcion) fallar('La opción ' + opcion + ' de git branch no está disponible aquí. Puedes crear una rama (git branch nombre) o borrar una fusionada (git branch -d nombre).');
      if (argumentos.length > 1) fallar('git branch crea una rama a la vez: git branch nombre-de-la-rama');
      const nombre = argumentos[0];
      validarNombreRama(nombre);
      if (!idCabeza(repo)) fallar('Todavía no hay commits. Haz el primero antes de crear ramas: una rama apunta a un commit.');
      if (tiene(repo.ramas, nombre)) fallar('Ya existe una rama llamada "' + nombre + '".');
      return { estado: { ...estado, repo: { ...repo, ramas: { ...repo.ramas, [nombre]: idCabeza(repo) } } }, salida: [] };
    },

    switch(estado, argumentos) {
      return cambiarDeRama(estado, argumentos, '-c', 'switch');
    },

    checkout(estado, argumentos) {
      return cambiarDeRama(estado, argumentos, '-b', 'checkout');
    },

    merge(estado, argumentos) {
      const { repo } = estado;
      if (argumentos.length !== 1 || argumentos[0].startsWith('-')) {
        fallar('Escribe la rama que quieres traer a la actual: git merge nombre-de-la-rama');
      }
      const otra = argumentos[0];
      if (!tiene(repo.ramas, otra)) fallar('No existe la rama "' + otra + '". Mira cuáles hay con git branch.');
      const nuestro = idCabeza(repo);
      const suyo = repo.ramas[otra];
      if (nuestro && esAncestro(repo, suyo, nuestro)) return { estado, salida: ['Ya está actualizado.'] };

      // Avance rápido: la rama actual no tiene nada propio, así que basta con
      // moverla hasta el último commit de la otra.
      if (!nuestro || esAncestro(repo, nuestro, suyo)) {
        const movido = moverA(estado, arbolDe(repo, suyo));
        return {
          estado: { ...estado, archivos: movido.archivos, repo: { ...repo, indice: movido.indice, ramas: { ...repo.ramas, [repo.rama]: suyo } } },
          salida: [
            ...(nuestro ? ['Actualizando ' + nuestro + '..' + suyo] : []),
            'Fast-forward',
            ...resumenDeCambios(arbolDe(repo, nuestro), arbolDe(repo, suyo)),
          ],
        };
      }
      return fusionarDeVerdad(estado, otra);
    },
  };

  // git branch -d rama: borra una rama que ya está fusionada en la actual.
  function borrarRama(estado, nombres) {
    const { repo } = estado;
    if (nombres.length !== 1 || nombres[0].startsWith('-')) fallar('Escribe qué rama borrar, una a la vez: git branch -d nombre-de-la-rama');
    const nombre = nombres[0];
    if (!tiene(repo.ramas, nombre)) fallar('No existe la rama "' + nombre + '". Mira cuáles hay con git branch.');
    if (nombre === repo.rama) fallar('No puedes borrar la rama "' + nombre + '" porque es en la que estás. Cámbiate a otra con git switch.');
    const id = repo.ramas[nombre];
    if (!esAncestro(repo, id, idCabeza(repo))) {
      fallar('La rama "' + nombre + '" no está fusionada en "' + repo.rama + '": perderías sus commits. Primero haz git merge ' + nombre + '.');
    }
    const ramas = Object.fromEntries(Object.entries(repo.ramas).filter(([r]) => r !== nombre));
    return { estado: { ...estado, repo: { ...repo, ramas } }, salida: ['Rama ' + nombre + ' eliminada (era ' + id + ').'] };
  }

  // Las dos ramas avanzaron por su lado: se juntan los cambios de ambas
  // desde el commit en el que se separaron (la "base") en un commit nuevo.
  function fusionarDeVerdad(estado, otra) {
    const { repo } = estado;
    const nuestro = idCabeza(repo);
    const suyo = repo.ramas[otra];
    const comunes = new Set(historia(repo, nuestro).map((c) => c.id));
    const base = historia(repo, suyo).find((c) => comunes.has(c.id));
    const [b, o, t] = [arbolDe(repo, base && base.id), arbolDe(repo, nuestro), arbolDe(repo, suyo)];
    const nombres = unionDeNombres(b, o, t);
    const enConflicto = nombres.filter((n) => leer(o, n) !== leer(t, n) && leer(o, n) !== leer(b, n) && leer(t, n) !== leer(b, n));
    if (enConflicto.length > 0) {
      fallar(
        'CONFLICTO en ' + enConflicto.join(', ') + '. Las dos ramas cambiaron ' + (enConflicto.length === 1 ? 'el archivo ' : 'los archivos ') + enConflicto.join(', ') +
          '. Git real puede juntar los cambios si tocaron líneas distintas, pero este simulador todavía no lo hace: ' +
          'haz los cambios en una sola rama.'
      );
    }
    const fusion = nombres.reduce((arbol, n) => conValor(arbol, n, leer(o, n) === leer(b, n) ? leer(t, n) : leer(o, n)), {});
    if (cambiosDe(estado).preparados.length > 0) {
      fallar('Tienes cambios preparados que el merge pisaría. Guárdalos primero con git commit, y vuelve a intentarlo.');
    }
    const movido = moverA(estado, fusion);
    const nuevo = nuevoCommit({ ...repo, indice: movido.indice }, { mensaje: "Merge branch '" + otra + "'", padres: [nuestro, suyo], arbol: fusion });
    return {
      estado: { ...estado, archivos: movido.archivos, repo: nuevo },
      salida: ["Merge hecho por la estrategia 'ort'.", ...resumenDeCambios(o, fusion)],
    };
  }

  // git switch rama / git switch -c rama (y lo mismo con checkout y -b).
  function cambiarDeRama(estado, argumentos, opcionCrear, comando) {
    const { repo } = estado;
    const crear = argumentos[0] === opcionCrear;
    const nombres = crear ? argumentos.slice(1) : argumentos;
    if (nombres.length !== 1) {
      fallar('Escribe a qué rama quieres ir: git ' + comando + ' nombre-de-la-rama (o git ' + comando + ' ' + opcionCrear + ' nombre para crearla).');
    }
    const nombre = nombres[0];
    validarNombreRama(nombre);
    if (crear) {
      if (tiene(repo.ramas, nombre)) fallar('Ya existe una rama llamada "' + nombre + '". Para ir a ella usa git ' + comando + ' ' + nombre);
      const cabeza = idCabeza(repo);
      // Sin commits todavía la rama nueva solo cambia de nombre: nace con el primer commit.
      const ramas = cabeza ? { ...repo.ramas, [nombre]: cabeza } : repo.ramas;
      return { estado: { ...estado, repo: { ...repo, ramas, rama: nombre } }, salida: ["Cambiado a nueva rama '" + nombre + "'"] };
    }
    if (nombre === repo.rama) return { estado, salida: ["Ya en '" + nombre + "'"] };
    if (!tiene(repo.ramas, nombre)) {
      if (tiene(estado.archivos, nombre)) {
        fallar('Restaurar archivos con git ' + comando + ' no está disponible en este simulador. "' + nombre + '" es un archivo, no una rama.');
      }
      fallar('No existe la rama "' + nombre + '". Para crearla y pasarte a ella usa: git ' + comando + ' ' + opcionCrear + ' ' + nombre);
    }
    const movido = moverA(estado, arbolDe(repo, repo.ramas[nombre]));
    return {
      estado: { ...estado, archivos: movido.archivos, repo: { ...repo, indice: movido.indice, rama: nombre } },
      salida: ["Cambiado a rama '" + nombre + "'"],
    };
  }

  function ejecutarGit(estado, argumentos, fichas) {
    if (argumentos.length === 0) {
      fallar('Falta decir qué hacer con git. Por ejemplo: git init, git status, git add, git commit o git log.');
    }
    const [subcomando, ...resto] = argumentos;
    if (COMANDOS_REMOTOS.includes(subcomando)) {
      fallar('git ' + subcomando + ' habla con un repositorio en internet (como GitHub), y este simulador trabaja solo en tu carpeta.');
    }
    if (!COMANDOS_GIT.includes(subcomando)) {
      const sugerencia = parecido(subcomando, COMANDOS_GIT);
      fallar(
        '"' + subcomando + '" no es un comando de git.' +
          (sugerencia ? ' ¿Quisiste decir git ' + sugerencia + '?' : ' Los disponibles son: ' + COMANDOS_GIT.join(', ') + '.')
      );
    }
    if (subcomando !== 'init' && !estado.repo) {
      fallar('Esta carpeta todavía no es un repositorio de Git. Escribe primero git init.');
    }
    return GIT[subcomando](estado, resto, fichas.slice(2));
  }

  // ---------- Ejecutar ----------

  function ejecutarLinea(estado, linea) {
    // Las comillas "inteligentes" que ponen algunos teclados también valen.
    const { fichas, destino } = separarRedireccion(partirLinea(linea.replace(/[“”]/g, '"')));
    if (fichas.length === 0) fallar('Falta el comando antes de ' + (destino.agregar ? '>>' : '>') + '.');
    const [comando, ...argumentos] = fichas.map((f) => f.texto);
    if (!tiene(COMANDOS, comando)) {
      const sugerencia = parecido(comando, COMANDOS_SHELL);
      fallar(
        'No conozco el comando "' + comando + '".' +
          (sugerencia ? ' ¿Quisiste decir ' + sugerencia + '?' : ' En esta terminal puedes usar: ' + COMANDOS_SHELL.join(', ') + '.')
      );
    }
    const resultado = COMANDOS[comando](estado, argumentos, fichas);
    if (!destino) return resultado;
    // Con > o >> lo que el comando iba a mostrar se escribe en el archivo.
    const texto = resultado.salida.map((l) => l + '\n').join('');
    const ruta = rutaDeArchivo(resultado.estado, destino.archivo, 'bash');
    const previo = destino.agregar ? leer(resultado.estado.archivos, ruta) || '' : '';
    const archivos = escribir(resultado.estado.archivos, ruta, previo + texto);
    return { estado: { ...resultado.estado, archivos }, salida: [] };
  }

  const esComando = (linea) => linea !== '' && !linea.startsWith('#');

  function correr(estadoInicial, codigo) {
    let estado = estadoInicial;
    let corridos = 0;
    const salida = [];
    const lineas = codigo.split('\n');
    for (let numero = 1; numero <= lineas.length; numero++) {
      const linea = lineas[numero - 1].trim();
      if (!esComando(linea)) continue;
      salida.push('$ ' + linea);
      try {
        corridos++;
        if (corridos > MAXIMO_COMANDOS) fallar('Escribiste más de ' + MAXIMO_COMANDOS + ' comandos: son demasiados para este simulador.');
        const resultado = ejecutarLinea(estado, linea);
        estado = resultado.estado;
        avisarSiHayDemasiadasLineas(salida.length + resultado.salida.length);
        for (const texto of resultado.salida) salida.push(texto);
      } catch (error) {
        if (!(error instanceof ErrorDeComando)) throw error;
        return { estado, salida, error: { nombre: 'ErrorTerminal', mensaje: error.message, linea: numero, comando: linea } };
      }
    }
    return { estado, salida, error: null };
  }

  function estadoDelPaso(paso) {
    const iniciales = (paso && paso.archivos) || {};
    const archivos = Object.keys(iniciales).reduce((actuales, nombre) => {
      const contenido = String(iniciales[nombre]);
      return escribir(actuales, nombre, contenido === '' || contenido.endsWith('\n') ? contenido : contenido + '\n');
    }, {});
    // Si un archivo del paso viene dentro de una carpeta, esa carpeta existe.
    const carpetas = [...new Set(Object.keys(archivos).flatMap(carpetasHasta))].sort();
    const inicial = { archivos, repo: null, carpetas, actual: '' };
    if (!paso || !paso.preparacion) return inicial;
    const preparado = correr(inicial, paso.preparacion);
    if (preparado.error) {
      throw new Error('La preparación del paso falló en "' + preparado.error.comando + '": ' + preparado.error.mensaje);
    }
    return preparado.estado;
  }

  // ---------- Pruebas ----------

  const vistaDeCommit = (commit) =>
    Object.freeze({ id: commit.id, mensaje: commit.mensaje, padres: [...commit.padres], archivos: { ...commit.arbol } });

  function crearAyudas(estado, salida, codigo) {
    const { repo, archivos } = estado;
    const comandos = codigo.split('\n').map((l) => l.trim()).filter(esComando);
    const commits = (rama) => {
      if (!repo) return [];
      const nombre = rama === undefined ? repo.rama : rama;
      return historia(repo, leer(repo.ramas, nombre)).map(vistaDeCommit);
    };
    return {
      salida: [...salida],
      codigo: comandos.join('\n'),
      comandos,
      hayRepo: () => repo !== null,
      ramaActual: () => (repo ? repo.rama : null),
      ramas: () => (repo ? nombresDe(repo.ramas) : []),
      commits,
      ultimoCommit: (rama) => commits(rama)[0] || null,
      preparados: () => (repo ? cambiosDe(estado).preparados.map((c) => c.nombre) : []),
      archivos: () => nombresDe(archivos),
      carpetas: () => [...estado.carpetas],
      carpetaActual: () => rutaCompleta(estado.actual),
      archivo: (nombre) => (tiene(archivos, nombre) ? archivos[nombre] : null),
      estaGuardado: (nombre) =>
        repo !== null &&
        tiene(arbolCabeza(repo), nombre) &&
        leer(arbolCabeza(repo), nombre) === leer(repo.indice, nombre) &&
        leer(repo.indice, nombre) === leer(archivos, nombre),
      limpio: () => {
        if (!repo) return false;
        const cambios = cambiosDe(estado);
        return cambios.preparados.length + cambios.sinPreparar.length + cambios.sinSeguimiento.length === 0;
      },
    };
  }

  function revisar(prueba, ayudas) {
    try {
      const nombres = Object.keys(ayudas);
      const condicion = new Function(...nombres, '"use strict"; return (' + prueba.condicion + ');');
      return { descripcion: prueba.descripcion, aprobada: condicion(...nombres.map((n) => ayudas[n])) === true };
    } catch (error) {
      // Si la prueba explota (p. ej. todavía no hay commits), no se aprueba.
      return { descripcion: prueba.descripcion, aprobada: false };
    }
  }

  function evaluarTerminal(codigo, pruebas, paso) {
    let inicial;
    try {
      inicial = estadoDelPaso(paso);
    } catch (error) {
      return { salida: [], error: { nombre: 'ErrorInterno', mensaje: String(error.message || error) }, resultados: [] };
    }
    const { estado, salida, error } = correr(inicial, String(codigo));
    if (error) return { salida, error, resultados: [] };
    const ayudas = crearAyudas(estado, salida, String(codigo));
    return { salida, error: null, resultados: (pruebas || []).map((prueba) => revisar(prueba, ayudas)) };
  }

  globalThis.evaluarTerminal = evaluarTerminal;
})();

// Va dentro de una función para que sus constantes no choquen con las de
// otras lecciones: todos los scripts clásicos comparten el mismo espacio global.
(function () {
// Las cuatro hojas del reto: el ejemplo que se pregunta y las condiciones de
// su camino, escritas en pandas sobre una tabla llamada "t".
const HOJAS = [
  { nombre: 'Pequeño y estrato bajo', valor: 1000, metros: 50, estrato: 2, camino: '(t["metros"] <= 70) & (t["estrato"] <= 3)' },
  { nombre: 'Pequeño y estrato alto', valor: 1750, metros: 65, estrato: 4, camino: '(t["metros"] <= 70) & (t["estrato"] > 3)' },
  { nombre: 'Grande y estrato hasta 4', valor: 2200, metros: 85, estrato: 4, camino: '(t["metros"] > 70) & (t["estrato"] <= 4)' },
  { nombre: 'Grande y estrato alto', valor: 3225, metros: 110, estrato: 6, camino: '(t["metros"] > 70) & (t["estrato"] > 4)' },
];

// Una segunda tabla, distinta de la del enunciado. Si la función ignora la
// tabla que recibe (o devuelve números escritos a mano), aquí falla.
const OTRA_TABLA =
  '__import__("pandas").DataFrame({' +
  '"metros": [40, 50, 58, 62, 68, 75, 80, 95, 105, 130], ' +
  '"estrato": [1, 3, 2, 5, 4, 3, 4, 6, 5, 6], ' +
  '"arriendo": [600, 900, 800, 1700, 1500, 2000, 2100, 3300, 3600, 4200]})';

// La prueba llama al árbol con la tabla "t" y compara con el promedio que
// pandas calcula para esa hoja en la misma tabla.
function condicionDeHoja(hoja, tabla) {
  return (
    'bool((lambda t: abs(arbol_dos_niveles(' + hoja.metros + ', ' + hoja.estrato + ', t) - ' +
    't.loc[' + hoja.camino + ', "arriendo"].mean()) < 1e-9)(' + tabla + '))'
  );
}

globalThis.Rutas.agregarLeccion(
  'ml',
  {
    id: 'arbol',
    titulo: 'Un árbol de decisión a mano',
    pasos: [
      {
        id: 'idea',
        titulo: 'Preguntas de sí o no',
        texto: [
          'Un **árbol de decisión** predice haciendo preguntas de sí o no, como un agente inmobiliario con experiencia: "¿tiene más de 70 metros?". Según la respuesta, sigue por una rama.',
          'Al final de cada rama hay una **hoja**, y la hoja predice el **promedio** de los ejemplos de entrenamiento que cayeron ahí.',
          'Un árbol de **un nivel** hace una sola pregunta y tiene dos hojas. Uno de **dos niveles** vuelve a preguntar dentro de cada rama, y cada rama puede escoger su propia pregunta.',
          'En scikit-learn es `DecisionTreeRegressor` (el primer modelo del curso de Kaggle): `modelo.fit(X, y)` busca solo las mejores preguntas y `modelo.predict(X_nuevos)` predice. Aquí las preguntas te las damos; en la lección de sobreajuste verás cómo se buscan.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'datos = pd.DataFrame({',
          '    "metros": [35, 42, 48, 55, 60, 65, 70, 78, 85, 90, 100, 120],',
          '    "arriendo": [700, 950, 850, 1200, 1600, 1300, 1900, 2600, 2200, 3000, 3800, 3500],',
          '})',
          '',
          '# La pregunta: ¿tiene 70 metros o menos?',
          'pequenos = datos[datos["metros"] <= 70]',
          'grandes = datos[datos["metros"] > 70]',
          'print("Hoja de los pequeños:", pequenos["arriendo"].mean())',
          'print("Hoja de los grandes:", grandes["arriendo"].mean())',
        ].join('\n'),
      },
      {
        id: 'practica',
        titulo: 'Un árbol de un nivel',
        texto: [
          'Crea la función `arbol_un_nivel(metros)`: si `metros` es 70 o menos, devuelve el promedio de arriendo de los apartamentos de 70 metros o menos; si no, el promedio de los de más de 70.',
          'Calcula los dos promedios **desde los datos**, antes de la función, y guárdalos en variables.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'datos = pd.DataFrame({',
          '    "metros": [35, 42, 48, 55, 60, 65, 70, 78, 85, 90, 100, 120],',
          '    "arriendo": [700, 950, 850, 1200, 1600, 1300, 1900, 2600, 2200, 3000, 3800, 3500],',
          '})',
          '',
          '# Calcula los dos promedios y crea arbol_un_nivel',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'arbol_un_nivel es una función', condicion: 'callable(arbol_un_nivel)' },
          {
            descripcion: 'Para 50 metros predice el promedio de los pequeños',
            condicion: 'bool(abs(arbol_un_nivel(50) - datos.loc[datos["metros"] <= 70, "arriendo"].mean()) < 1e-9)',
          },
          {
            descripcion: 'Para 95 metros predice el promedio de los grandes',
            condicion: 'bool(abs(arbol_un_nivel(95) - datos.loc[datos["metros"] > 70, "arriendo"].mean()) < 1e-9)',
          },
          {
            descripcion: 'Justo 70 metros va a la rama de los pequeños',
            condicion: 'bool(arbol_un_nivel(70) == arbol_un_nivel(35))',
          },
        ],
        pistas: [
          '`hoja_pequenos = datos.loc[datos["metros"] <= 70, "arriendo"].mean()` y lo mismo con `> 70`',
          'La función solo hace la pregunta: `if metros <= 70:`',
          'En cada rama devuelve su hoja: `return hoja_pequenos` o `return hoja_grandes`',
        ],
        solucion: [
          'import pandas as pd',
          '',
          'datos = pd.DataFrame({',
          '    "metros": [35, 42, 48, 55, 60, 65, 70, 78, 85, 90, 100, 120],',
          '    "arriendo": [700, 950, 850, 1200, 1600, 1300, 1900, 2600, 2200, 3000, 3800, 3500],',
          '})',
          '',
          'hoja_pequenos = datos.loc[datos["metros"] <= 70, "arriendo"].mean()',
          'hoja_grandes = datos.loc[datos["metros"] > 70, "arriendo"].mean()',
          '',
          '',
          'def arbol_un_nivel(metros):',
          '    if metros <= 70:',
          '        return hoja_pequenos',
          '    return hoja_grandes',
          '',
          '',
          'print(arbol_un_nivel(50), arbol_un_nivel(95))',
        ].join('\n'),
      },
      {
        id: 'reto',
        titulo: 'Reto final: un árbol de dos niveles',
        texto: [
          'Ahora agrega el estrato. Crea `arbol_dos_niveles(metros, estrato, datos)` con este árbol:',
          '¿metros ≤ 70?\n· Sí → ¿estrato ≤ 3? Cada respuesta es una hoja.\n· No → ¿estrato ≤ 4? Cada respuesta es una hoja.',
          'Cada hoja predice el promedio de arriendo de los apartamentos que cumplen **las dos** condiciones de su camino. Calcula las cuatro hojas **dentro de la función**, con la tabla `datos` que recibe, uniendo condiciones con `&`.',
          '¿Por qué recibe la tabla? Porque un modelo no se sabe las respuestas de memoria: **aprende de los datos que le den**, como `modelo.fit(X, y)`. Con otra tabla, las hojas cambian. Las pruebas usan tu función con esta tabla y con otra distinta, así que escribir los números a mano no sirve.',
        ],
        codigo: [
          'import pandas as pd',
          '',
          'datos = pd.DataFrame({',
          '    "metros": [35, 42, 48, 55, 60, 65, 70, 78, 85, 90, 100, 120],',
          '    "estrato": [2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5],',
          '    "arriendo": [700, 950, 850, 1200, 1600, 1300, 1900, 2600, 2200, 3000, 3800, 3500],',
          '})',
          '',
          '',
          'def arbol_dos_niveles(metros, estrato, datos):',
          '    # Dentro de la función, "datos" es la tabla que recibes.',
          '    # Calcula con ella la hoja que corresponde y devuélvela.',
          '    pass',
          '',
          '',
          'print(arbol_dos_niveles(50, 2, datos))',
          '',
        ].join('\n'),
        pruebas: [
          { descripcion: 'arbol_dos_niveles es una función', condicion: 'callable(arbol_dos_niveles)' },
          ...HOJAS.map((hoja) => ({
            descripcion: hoja.nombre + ': el promedio de su hoja (' + hoja.valor + ')',
            condicion: condicionDeHoja(hoja, 'datos'),
          })),
          // La segunda tabla es la que atrapa los números escritos a mano: sus
          // hojas valen otra cosa (766,67, 1600, 2050 y 3700). Las descripciones
          // no dicen los valores para no regalarlos.
          ...HOJAS.map((hoja) => ({
            descripcion: 'Con otra tabla de arriendos, ' + hoja.nombre.toLowerCase() + ': el promedio de esa tabla',
            condicion: condicionDeHoja(hoja, OTRA_TABLA),
          })),
        ],
        pistas: [
          'Dentro de la función, las preguntas de cada camino van juntas: `pequeno = datos["metros"] <= 70` y `datos.loc[pequeno & (datos["estrato"] <= 3), "arriendo"].mean()`',
          'Para la rama de los grandes usa `~pequeno` (el `~` significa "no") y la pregunta `estrato <= 4`',
          'Luego un `if metros <= 70:` y, dentro de cada rama, otro `if` con su pregunta de estrato. Cada `return` devuelve el promedio de su hoja, calculado con la tabla `datos` que recibió la función',
        ],
        solucion: [
          'import pandas as pd',
          '',
          'datos = pd.DataFrame({',
          '    "metros": [35, 42, 48, 55, 60, 65, 70, 78, 85, 90, 100, 120],',
          '    "estrato": [2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5],',
          '    "arriendo": [700, 950, 850, 1200, 1600, 1300, 1900, 2600, 2200, 3000, 3800, 3500],',
          '})',
          '',
          '',
          'def arbol_dos_niveles(metros, estrato, datos):',
          '    pequeno = datos["metros"] <= 70',
          '    if metros <= 70:',
          '        if estrato <= 3:',
          '            return datos.loc[pequeno & (datos["estrato"] <= 3), "arriendo"].mean()',
          '        return datos.loc[pequeno & (datos["estrato"] > 3), "arriendo"].mean()',
          '    if estrato <= 4:',
          '        return datos.loc[~pequeno & (datos["estrato"] <= 4), "arriendo"].mean()',
          '    return datos.loc[~pequeno & (datos["estrato"] > 4), "arriendo"].mean()',
          '',
          '',
          'print(arbol_dos_niveles(50, 2, datos), arbol_dos_niveles(110, 6, datos))',
        ].join('\n'),
      },
    ],
  }
);
})();

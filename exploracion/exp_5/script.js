d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

// const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

const mapaFetch = d3.json('barrios.geojson')
const dataFetch = d3.csv('../../data/dataset_residuos.csv', d3.autoType)

console.log(mapaFetch)
console.log(dataFetch)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  console.log([barrios, data])

  const reclamosTop3 = data.filter(
    function(d){ 
      return  (
        d.prestacion == 'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR' ||
        d.prestacion == 'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR'
      ) 
    }
  )
  console.log('reclamosTop3',reclamosTop3)

  const reclamosPorBarrio = d3.group(reclamosTop3, d => d.domicilio_barrio) // crea un Map
  console.log('reclamosPorBarrio', reclamosPorBarrio)
  
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      type: 'quantize', 
      n: 10,
      scheme: 'ylorbr',
      label: 'Cantidad de denuncias',
      legend: true,
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => {
          let nombreBarrio = d.properties.BARRIO
          let cantReclamos = reclamosPorBarrio.get(nombreBarrio).length
          return cantReclamos
        },
        stroke: '#ccc',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
    ],
  })


  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart').append(() => chartMap)
})


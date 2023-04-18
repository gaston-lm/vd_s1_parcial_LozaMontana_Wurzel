d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

// const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

const mapaFetch = d3.json('comunas.geojson')
const dataFetch = d3.csv('../../data/dataset_residuos.csv', d3.autoType)

console.log(mapaFetch)
console.log(dataFetch)

Promise.all([mapaFetch, dataFetch]).then(([comunas, data]) => {
  console.log([comunas, data])

  const reclamosPorComuna = d3.group(data, d => d.domicilio_comuna) // crea un Map
  console.log('reclamosPorComuna', reclamosPorComuna)
  
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: comunas, // Objeto GeoJson a encuadrar
    },
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      type: 'quantize', 
      n: 5,
      scheme: 'ylorbr',
      label: 'Cantidad de denuncias',
      legend: true,
    },
    marks: [
      Plot.geo(comunas, {
        fill: d => {
          let numComuna = d.properties.COMUNAS
          let cantReclamos = reclamosPorComuna.get(numComuna).length
          return cantReclamos
        },
        stroke: '#ccc',
        title: d => {
          let numComuna = d.properties.COMUNAS
          let cantReclamos = reclamosPorComuna.get(numComuna).length
          return `Comuna ${numComuna}\n${cantReclamos} denuncias`
        }
      }),
    ],
  })


  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart').append(() => chartMap)
})


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
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    parent: "#mapa",
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    color: {
      scheme: 'ylorbr',
      legend: true,
    },
    marks: [
      Plot.density(data, { x: 'lon', y: 'lat', fill: 'density',bandwidth: 15, thresholds: 30 }),
      Plot.geo(barrios, {
        stroke: 'gray',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
    ],
  })
  

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart').append(() => chartMap)
})


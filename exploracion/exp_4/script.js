d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

// const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

const mapaFetch = d3.json('barrios.geojson')
const dataFetch = d3.csv('../../../dataset1_residuos.csv', d3.autoType)

console.log(mapaFetch)
console.log(dataFetch)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  console.log([barrios, data])
  /* Mapa Coroplético */
  let chartMap = Plot.plot({
    // https://github.com/observablehq/plot#projection-options
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    marks: [
      Plot.geo(barrios, {
        stroke: '#ddd',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
      Plot.dot(data, {
        filter: d => {
          return (
            d.prestacion == 'RECUPERADOR URBANO ACOPIANDO RESIDUOS EN ZONA NO PREVISTA' ||
            d.prestacion == 'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR' ||
            d.prestacion == 'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR'
          )
        },
        x: 'lon',
        y: 'lat',
        r: 1,
        stroke: 'none',
        fill: 'prestacion'
      }),
    ],
    color: {
      legend: true
    }
  })

  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart').append(() => chartMap)
})


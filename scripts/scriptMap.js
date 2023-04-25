const mapaFetch = d3.json('data/barrios.geojson')
const dataFetch = d3.csv('../../data/dataset_residuos.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  // console.log([barrios, data])
  let chartMap = Plot.plot({
    parent: "#mapa",
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      scheme: 'ylorbr',
      legend: false,
    },
    marks: [
      Plot.density(data, { x: 'lon', y: 'lat', fill: 'density',bandwidth: 15, thresholds: 30 }),
      Plot.geo(barrios, {
        stroke: 'gray',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
    ],
    width: 500,
  })
  /* Agregamos al DOM la visualización chartMap */
  d3.select('#chart_map').append(() => chartMap)
})


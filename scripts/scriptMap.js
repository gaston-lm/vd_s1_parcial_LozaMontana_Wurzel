const mapaFetch = d3.json('data/barrios.geojson')
const dataFetch = d3.csv('../../data/dataset_residuos.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {

  let chartMap = Plot.plot({
    parent: "#mapa",
    projection: {
      type: 'mercator',
      domain: barrios,
    },
    color: {
      scheme: 'ylorbr'
    },
    marks: [
      Plot.density(data, 
        {
          x: 'lon',
          y: 'lat', 
          fill: 'density',
          bandwidth: 15, 
          thresholds: 25 
        }
      ),
      Plot.geo(barrios, {
        stroke: '#858585e0',
        title: d => `${d.properties.BARRIO}\n${d.properties.DENUNCIAS} denuncias`,
      }),
    ],
    width: 500,
  })
  d3.select('#chart_map').append(() => chartMap)
})


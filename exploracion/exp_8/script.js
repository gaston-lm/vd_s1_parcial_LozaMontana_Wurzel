d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

const mapaFetch = d3.json('barrios.geojson')
const dataFetch = d3.csv('../../data/dataset_residuos.csv', d3.autoType)

Promise.all([mapaFetch, dataFetch]).then(([barrios, data]) => {
  console.log([barrios, data])
  data.forEach(d => {
    d.fecha_hora_ingreso = parseTime(d.fecha_hora_ingreso);
    d.fecha_hora_cierre = parseTime(d.fecha_hora_cierre);
  });

  data = data.filter(d => d.estado_del_contacto === "Cerrado" && d.fecha_hora_cierre);

  const promedioPorBarrio = d3.rollup(data,
    v => {
      const sum = d3.sum(v, d => (d.fecha_hora_cierre - d.fecha_hora_ingreso) / 86400000);
      const count = v.length;
      const promedioDias = Math.ceil(sum / count);
      return {promedioDias};
    },
    // agrupado por barrios
    d => d.domicilio_barrio
  );

  console.log('promedioPorBarrio', promedioPorBarrio)

  let chartMap = Plot.plot({
    projection: {
      type: 'mercator',
      domain: barrios, // Objeto GeoJson a encuadrar
    },
    color: {
      // Quantize continuo (cant. denuncias) -> discreto (cant. colores)
      type: 'quantize', 
      n: 10,
      scheme: 'ylorbr',
      label: 'Cantidad de dias promedio para cerrar caso',
      legend: true,
    },
    marks: [
      Plot.geo(barrios, {
        fill: d => {
          let nombreBarrio = d.properties.BARRIO
          let diasPromedio = promedioPorBarrio.get(nombreBarrio).promedioDias
          return diasPromedio
        },
        stroke: '#ccc',
        title: d => {
          let nombreBarrio = d.properties.BARRIO
          let diasPromedio = promedioPorBarrio.get(nombreBarrio).promedioDias
          return `${nombreBarrio}\n${diasPromedio} días`
        },
      }),
    ],
  })
  d3.select("#chart").append(()=> chartMap);
})

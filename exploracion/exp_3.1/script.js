d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

d3.csv("../../data/dataset_residuos.csv", d3.autoType).then((data)=>{
  const prestacionMapping = {
    'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR': 'Residuos fuera de contenedor/campana verde',
    'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR': 'Residuos fuera de contenedor/campana verde',
    'RESIDUOS ACUMULADOS O DISEMINADOS FUERA DE PUNTO VERDE': 'Residuos fuera de contenedor/campana verde',
    'VACIADO DE CAMPANA VERDE': 'Vaciado de conetenedor/campana verde',
    'VACIADO DE CONTENEDOR': 'Vaciado de conetenedor/campana verde',
  };
  
  data.forEach(d => {
    d.prestacion = prestacionMapping[d.prestacion];
  });
  console.log(data)
  let chart = Plot.plot({
    x: {
      type: 'time',
      tickFormat: d3.timeFormat('%m'),
      domain: [new Date(2021, 0, 1), new Date(2021, 11, 31)],
      tickSpacing: 60,
      line: true
    },
    y: {
      domain: [0, 800],
      grid: true
    },
    color: {
      legend: true,
    },
    marks: [
      Plot.line(data,
        Plot.binX(
          { y: 'count'},
          {
            x: d => parseTime(d.fecha_hora_ingreso),
            thresholds: d3.timeWeek,
            stroke: 'prestacion',
            filter: d => {
              return (
                (d.prestacion === 'Residuos fuera de contenedor/campana verde' ||
                d.prestacion === 'Vaciado de conetenedor/campana verde')
              )
            },
            z: 'prestacion'
          }
        )
      ),
    ],
  });
  d3.select("#chart").append(()=> chart);
})

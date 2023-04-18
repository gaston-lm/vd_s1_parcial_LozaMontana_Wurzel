d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

// agrupar por 1: "residuos fuera de contenedor/campana verde" 
// - LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR
// - RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR
// - RESIDUOS ACUMULADOS O DISEMINADOS FUERA DE PUNTO VERDE
// agrupar por 2: "vaciado de conetenedor/campana verde"
// - VACIADO DE CAMPANA VERDE
// - VACIADO DE CONTENEDOR

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
      // tickFormat: d3.timeFormat('%m'),
      domain: [new Date(2021, 0, 1), new Date(2022, 0, 1)]
    },
    color: {
      legend: true,
      range: ['red', 'orange']
    },
    marks: [
      Plot.areaY(data,
        Plot.binX(
          { y: 'count'},
          {
            x: d => parseTime(d.fecha_hora_ingreso),
            thresholds: d3.timeWeek,
            fill: 'prestacion',
            curve: "cardinal",
            fillOpacity: 0.7,
            filter: d => {
              return (
                d.prestacion === 'Residuos fuera de contenedor/campana verde'
              )
            },
          }
        )
      ),
      Plot.areaY(data,
        Plot.binX(
          { y: 'count'},
          {
            x: d => parseTime(d.fecha_hora_ingreso),
            thresholds: d3.timeWeek,
            fill: 'prestacion',
            curve: "cardinal",
            fillOpacity: 0.7,
            filter: d => {
              return (
                d.prestacion === 'Vaciado de conetenedor/campana verde'
              )
            },
          }
        )
      ),
    ],
  });
  d3.select("#chart").append(()=> chart);
})

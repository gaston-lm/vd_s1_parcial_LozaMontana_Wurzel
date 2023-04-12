d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
p = parseTime("2021-04-04 04:56:07");
console.log(p)

d3.csv("../../../dataset1_residuos.csv", d3.autoType).then((data)=>{
  let chart = Plot.plot({
    x: {
      type: 'time',
      // tickFormat: d3.timeFormat('%m'),
      domain: [new Date(2021, 0, 1), new Date(2022, 0, 1)]
    },
    color: {
      legend: true
    },
    marks: [
      Plot.areaY(data,
        Plot.binX(
          { y: 'count'},
          {
            filter: d => {
              return (
                d.prestacion == 'RECUPERADOR URBANO ACOPIANDO RESIDUOS EN ZONA NO PREVISTA' ||
                d.prestacion == 'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR' ||
                d.prestacion == 'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR'
              )
            },
            x: d => parseTime(d.fecha_hora_ingreso),
            thresholds: d3.timeWeek,
            fill: 'prestacion',
            fillOpacity: 0.7
          }
        )
      ),
    ],
  });
  d3.select("#chart").append(()=> chart);
})


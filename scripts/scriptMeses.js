d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

d3.csv("../../data/dataset_residuos.csv", d3.autoType).then((data)=>{
  const prestacionMapping = {
    'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR': 'Residuos fuera de contenedor/campana verde',
    'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR': 'Residuos fuera de contenedor/campana verde',
    'RESIDUOS ACUMULADOS O DISEMINADOS FUERA DE PUNTO VERDE': 'Residuos fuera de contenedor/campana verde',
    'VACIADO DE CAMPANA VERDE': 'Residuos fuera de contenedor/campana verde',
    'VACIADO DE CONTENEDOR': 'Residuos fuera de contenedor/campana verde',
  };
  
  data.forEach(d => {
    d.prestacion = prestacionMapping[d.prestacion];
  });
  console.log(data)
  let chart = Plot.plot({
    x: {
      type: 'time',
      domain: [new Date(2021, 0, 1), new Date(2021, 12, 1)],
      line: true,
      tickFormat: '',
    },
    y: {
      domain: [0, 1300],
      label: '',
      ticks:false,
    },
    color: {
      legend: false,
      range: ['black'],
      strokeWidth:10,
    },
    marks: [
      Plot.line(data,
        Plot.binX(
          { y: 'count'},
          {
            x: d => parseTime(d.fecha_hora_ingreso),
            thresholds: d3.timeWeek,
            stroke: 'prestacion',
            curve: 'cardinal',
            filter: d => {
              return (
                (d.prestacion === 'Residuos fuera de contenedor/campana verde')              )
            },
            z: 'prestacion'
          }
        )
      ),
      Plot.ruleX([new Date(2021, 2, 21)],{
        y1:0,
        y2:90,
        strokeDasharray:"2,0,2",
        strokeWidth: 1,
        stroke: '#EC7114',
      }),
      Plot.ruleX([new Date(2021, 2, 21)],{
        y1:150,
        y2:1300,
        strokeDasharray:"2,0,2",
        strokeWidth: 1,
        stroke: '#EC7114',
      }),
    ],
    width: 640
  });
  d3.select("#chart_meses").append(()=> chart);
})

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
  
  // 'Vaciado de conetenedor/campana verde'

  };
  
  data.forEach(d => {
    d.prestacion = prestacionMapping[d.prestacion];
  });

  // const groupedData = d3.group(data, d => d3.timeDay.floor(parseTime(d.fecha_hora_ingreso)));
  // const summedData = Array.from(groupedData, ([key, values]) => {
  //   return {fecha_hora_ingreso: key, count: d3.sum(values, d => d.count)};
  // });

  console.log(data)
  let chart = Plot.plot({
    x: {
      type: 'time',
      domain: [new Date(2021, 0, 1), new Date(2021, 12, 1)],
    //   tickFormat: function(d, i) {
    //   var format = d3.timeFormat("%b");
    //   var shift = i % 2 == 0 ? 0 : 0.5;
    //   return format(new Date(d.getTime() + shift * 15 * 24 * 60 * 60 * 1000));
    // },
    line: true,
    tickFormat: '',
      // type: 'time',
      // tickFormat: function(d) { return (d3.timeFormat('%b')(d).charAt(0)).toUpperCase(); },
      // domain: [new Date(2021, 0, 1), new Date(2021, 11, 31)],
      // line: true,
      //tickFormat: d3.timeFormat('%B'),
      //tickSpacing: 80,
      //tickCentered:true,
      //ticks:['E','F','M','A','M','J','J','A','S','O','N','D'],
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
        strokeWidth:0.8,
        stroke: '#993504',
      }),
      Plot.ruleX([new Date(2021, 2, 21)],{
        y1:150,
        y2:1300,
        strokeDasharray:"2,0,2",
        strokeWidth:0.8,
        stroke: '#993504',
      }),
    ],
    width: 640
  });
  d3.select("#chart_meses").append(()=> chart);
})

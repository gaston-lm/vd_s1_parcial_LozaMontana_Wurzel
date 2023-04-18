d3.json('https://cdn.jsdelivr.net/npm/d3-time-format@3/locale/es-ES.json').then(locale => {
  d3.timeFormatDefaultLocale(locale)
})

const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');

function categorizarHora(hora) {
  if (hora >= 6 && hora < 10) {
    return "6:00 - 10:00";
  } else if (hora >= 10 && hora < 14) {
    return "10:00 - 14:00";
  } else if (hora >= 14 && hora < 18) {
    return "14:00 - 18:00";
  } else if (hora >= 18 && hora < 22) {
    return "18:00 - 22:00";
  } else if (hora >= 22 && hora < 2) {
    return "22:00 - 02:00";
  } else {
    return "02:00 - 06:00";
  }
}

d3.csv("../../data/dataset_residuos.csv", d3.autoType).then((data)=>{
  const canalMapping = {
    'App BA 147': 'App BA 147',
    'Boti': 'Otros',
    'Call Center': 'Otros',
    'Comuna': 'Otros',
    'GCS Web': 'Línea teléfonica 147',
    'Mail 147': 'Otros',
    'Operador FIXIT': 'Otros',
    'Operador GCBA': 'Otros'
  };

  data.forEach(d => {
    d.fecha_hora_ingreso = parseTime(d.fecha_hora_ingreso);
    d.fecha_hora_ingreso = categorizarHora(d.fecha_hora_ingreso.getHours());
    d.canal = canalMapping[d.canal];
  });
  console.log(data)
  let chart = Plot.plot({
    color: {
      legend: true,
    },
    x: {
      tickRotate: 0,
    },
    y: {
      label: null,
      ticks: [0, 0.1, 0.2, 0.3],

    },
    marks: [
      Plot.barY(
        data,
        Plot.groupX(
          { y: 'proportion'},
          {
            x: 'fecha_hora_ingreso',
            fill: 'canal'
          },
        ),
      ),
    ],
    marginBottom: 80
  });
  d3.select("#chart").append(()=> chart);
})

function categorizarHora(hora) {
  if (hora >= 6 && hora < 10) {
    return "6:00 - 10:00";
  } else if (hora >= 10 && hora < 14) {
    return "10:00 - 14:00";
  } else if (hora >= 14 && hora < 18) {
    return "14:00 - 18:00";
  } else if (hora >= 18 && hora < 22) {
    return "18:00 - 22:00";
  } else if (hora === 22 || hora === 23 || hora === 0 || hora === 1) {
    return "22:00 - 02:00";
  } else if (hora === 2 || hora === 3 || hora === 4 || hora === 5) {
    return "02:00 - 06:00";
  }
}

d3.csv("../../data/dataset_residuos.csv", d3.autoType).then((data)=>{
  const canalMapping = {
    'App BA 147': 'App BA 147',
    'Boti': 'App BA 147',
    'Call Center': 'Otros canales',
    'Comuna': 'Otros canales',
    'GCS Web': 'Otros canales',
    'Mail 147': 'Otros canales',
    'Operador FIXIT': 'Otros canales',
    'Operador GCBA': 'Otros canales'
  };

  data.forEach(d => {
    d.fecha_hora_ingreso = parseTime(d.fecha_hora_ingreso);
    d.fecha_hora_ingreso = categorizarHora(d.fecha_hora_ingreso.getHours());
    d.canal = canalMapping[d.canal];
  });
    
  let chart = Plot.plot({
    color: {
      legend: false,
      range: ['#CC4C01', 'lightgray']
    },
    x: {
      tickRotate: 0,
      label: null,
      domain: ["6:00 - 10:00", "10:00 - 14:00", "14:00 - 18:00", "18:00 - 22:00", "22:00 - 02:00", "02:00 - 06:00"],
      tickSize: 0
    },
    y: {
      ticks: [],
      tickSize: 0,
      label: '',
    },
    marks: [
      Plot.barY(data,
        Plot.groupX(
          { y: 'proportion'},
          {
            x: 'fecha_hora_ingreso',
            fill: 'canal',
          },
        ),
      ),
    ],
    marginBottom: 80,
    style: {
      fontSize: 13
    }
  });
  d3.select("#chart_canales").append(()=> chart);

  d3.selectAll("#chart_canales rect")
  .attr("fill-opacity", function(d) {
    if (this.getAttribute("x") == "145") {
      return 0.9;
    } else {
      return 0.5;
    }
  }
);
})

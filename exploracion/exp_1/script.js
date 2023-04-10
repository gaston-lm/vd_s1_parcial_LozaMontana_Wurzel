d3.csv("../../../dataset1_residuos.csv", d3.autoType).then((data)=>{
    console.log(data);

    let chart = Plot.plot({
        marks: [
            Plot.barX(
                data,
                Plot.groupY(
                    { x: 'count' },
                    {
                        filter: d => {
                        return (
                            d.prestacion == 'RECOLECCIÓN DE RESIDUOS FUERA DEL CONTENEDOR' ||
                            d.prestacion == 'LIMPIEZA DE CAMPANA Y/O RESIDUOS DISEMINADOS ALREDEDOR' ||
                            d.prestacion == 'RETIRO DE RESIDUOS VOLUMINOSOS (MUEBLES Y ELECTRODOMÉSTICOS)' ||
                            d.prestacion == 'RECUPERADOR URBANO ACOPIANDO RESIDUOS EN ZONA NO PREVISTA'
                        )
                        },
                        y: 'domicilio_comuna',
                        sort: { y: 'x', reverse: true },
                    },
                ),
            ),
        ],
    });
    d3.select("#chart").append(()=> chart);
})


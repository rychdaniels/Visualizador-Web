/**
 * Funcion encargada de dibujar la grafica en base a los arreglos que recibe como 
 * parametro
 * @param RBarrierX es el punto X donde toco la particula en la barrera derecha(R) 
 * @param RBarrierY es el punto Y donde toco la particula en la barrera derecha(R)
 * @param LBarrierX es el punto X donde toco la particula en la barrera izquierda(L)
 * @param LBarrierY es el punto Y donde toco la particula en la barrera izquierda(L)
 * @param canvas es el lienzo donde se dibujara la grafica de la particula
 */
function graficador (RBarrierX,RBarrierY,LBarrierX,LBarrierY,canvas) {
    
    
    let ctx = canvas;//Donde se dibuja la grafica
    new Chart(ctx, {
   
        type: 'line',
        //Data es lo que permite que se dibuje la grafica  
        data: {
            labels: RBarrierX,//Elementos del eje X
            datasets: [
                {
                    
                    label:"RBarrier",//Etiqueta del conjunto de elementos
                    backgroundColor: "rgba(70,194,235,0.2)", //Color de fondo de la grafica
                    borderColor: "rgba(27,165,212)", //Contorno de las lineas de la grafica
                    data: RBarrierY //Elemetos del eje Y
                },
                {
                    labels: LBarrierX,
                    label:"LBarrier",
                    backgroundColor: "rgba(230,60,45,0.2)",
                    borderColor: "rgba(230,60,45)",
                    data: LBarrierY
                },
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Diagrama Linear'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales:{
                x: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Eje X'
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Eje Y'
                    }
                }
            }            
        },

    
    });
}
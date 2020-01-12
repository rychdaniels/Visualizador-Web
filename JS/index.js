var visualizador;
document.getElementById('exampleInputFile').onchange = function () {
      
    
    if (visualizador == null) {
        visualizador = new Visualizador();   
    }     
    visualizador.bandera = true;
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        json = JSON.parse(this.result);
        
        $('#espacio').empty();
        // Creo un objeto de tipo Particulas, RedPorosa, Voronoi, todo esto dependiendo de JSON
        console.log("JSON " + json.name);
        object =  eval("new " + json.name + "(visualizador,json)"); 
        object.draw(json);
        
    }

    reader.readAsText(file);
    
};
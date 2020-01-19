var visualizador;
document.getElementById('exampleInputFile').onchange = function () {
    
    // $('.container-fluid').empty();
    if (visualizador == null) {
        visualizador = new Visualizador();   
    }     
    visualizador.bandera = true;
    
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        json = JSON.parse(this.result);
    
        // Creo un objeto de tipo Particulas, RedPorosa, Voronoi, todo esto dependiendo de JSON
        object = {};
        object =  eval("new " + json.name + "(visualizador,json)"); 
        object.draw(json);
        
    }

    reader.readAsText(file);
    
};
document.getElementById('exampleInputFile').onchange = function () {
    var visualizador = new Visualizador();
    visualizador.bandera = true;
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        json = JSON.parse(this.result);
        
        $('#espacio').empty();
        object =  eval("new " + json.name + "(visualizador)"); 
        object.draw(json);
        
    }

    reader.readAsText(file);
};
const contenedor = document.getElementById('espacio');

document.getElementById('exampleInputFile').onchange = function () {

    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        json = JSON.parse(this.result);

        if (json.hasOwnProperty('particles')) {
            $('#menu').css({ "visibility": "visible", "height": "400px", "width": "200" })
            // $('div').remove('.voronoiMenu, .porosMenu');
            $('#voronoiMenu,#porosMenu').css({ "visibility": "hidden" })
            $('#particulasMenu').insertAfter('#titulo');
            $('#particulasMenu').css({ "visibility": "visible" })
            $('.botonera').css({ "visibility": "visible" })

            particula = new ParticulasN2();
            dibuja = new dibujar(particula, json).dibujaCanal();




        }

    }

    reader.readAsText(file);
};
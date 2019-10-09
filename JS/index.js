function Visualizador() {
  this.scene = 0;
  this.group = 0;
  this.camera = 0;
  this.renderer = 0;
  this.controls = 0;
  this.bandera = false;
  this.json = 0;
}
//funcion que coloca la escena en el navegador
Visualizador.prototype.animate = function () {
  if (vsym.bandera != false) {
    vsym.controls.update();
    vsym.renderer.render(vsym.scene, vsym.camera);
    console.log(vsym.camera);
    requestAnimationFrame(vsym.animate);
  }
};

var vsym = new Visualizador();


vsym.renderer = new THREE.WebGLRenderer();
vsym.renderer.setSize(1120, 800);


/* funcion para leer el archivo */
var uno = document.getElementById('exampleInputFile').onchange = function () {
  vsym.bandera = false;


  $('#menu').css({ "visibility": "hidden", "height": "0px", "width": "0px" });
  $("#progress").css({ "visibility": "visible", "height": "40px" });
  $("#progressBar").css({ "visibility": "visible", "width": "100%" }).text("Cargando..."); /*Muestra la barra de progreso*/

  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    vsym.json = JSON.parse(this.result);
    // console.log(vsym.json);
    vsym.bandera = true;
    if (JSON.parse(this.result).hasOwnProperty('p')) {
      var puntos = vsym.json.p;

      objVoronoi.drawVoronoi(puntos);  //llama funcion drawVoronoi encontrada en voronoi.js
      //muestra el menu para voronoi
      $('#menu').css({ "visibility": "visible", "height": "400px", "width": "200" })
      // $('div').remove('.particulasMenu, .porosMenu');      
      $('#particulasMenu,#porosMenu').css({ "visibility": "hidden" })
      $('#voronoiMenu').insertAfter('#titulo');
      $('#voronoiMenu').css({ "visibility": "visible" })
      $('.botonera').css({ "visibility": "hidden" })


    } else if (vsym.json.hasOwnProperty('particles')) {
      if (JSON.parse(this.result).type == "2D") {
        elemento = document.getElementById('espacio');
        particula = document.getElementById('particula');
        objParticulas.creaEscena(vsym.json, elemento, vsym); //llama funcion encontrada en particulas.js
        objParticulas.dibujar(vsym.json); //llama funcion encontrada en particulas.js

      } else {
        alert("3D");
      }


      $('#menu').css({ "visibility": "visible", "height": "400px", "width": "200" })
      // $('div').remove('.voronoiMenu, .porosMenu');
      $('#voronoiMenu,#porosMenu').css({ "visibility": "hidden" })
      $('#particulasMenu').insertAfter('#titulo');
      $('#particulasMenu').css({ "visibility": "visible" })
      $('.botonera').css({ "visibility": "visible" })



    } else if (vsym.json.hasOwnProperty('sitios')) {
      objRedp.drawRed(vsym.json);  //llama funcion encontrada en redporosa.js
      //muestra el menu para redes porosas
      $('#menu').css({ "visibility": "visible", "height": "400px", "width": "200" })
      // $('div').remove('.particulasMenu, .voronoiMenu');
      $('#particulasMenu,#voronoiMenu').css({ "visibility": "hidden" })
      $('#porosMenu').insertAfter('#titulo');
      $('#porosMenu').css({ "visibility": "visible" })
      $('.botonera').css({ "visibility": "hidden" })

    } else {
      //archivo invalido
      alert('Selecciona un archivo JSON valido');
    }

    $("#progressBar").css({ "visibility": "hidden" });
    $('#progress').css({ "visibility": "hidden", "height": "0px" });


  };

  reader.readAsText(file);
};



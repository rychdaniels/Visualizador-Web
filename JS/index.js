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
    requestAnimationFrame(vsym.animate);
  }
};

var vsym = new Visualizador();

vsym.renderer = new THREE.WebGLRenderer();
vsym.renderer.setSize(1000, 800);

/* funcion para leer el archivo */
document.getElementById('exampleInputFile').onchange = function () {
  vsym.bandera = false;
  $('#MenuVoronoi').css({ "visibility": "hidden", "height": "0px", "width": "0px" });
  $('#voronoiMenu').css({ "visibility": "hidden" });
  $('#MenuRedPorosa').css({ "visibility": "hidden", "height": "0px", "width": "0px" });
  $('#porosMenu').css({ "visibility": "hidden" });
  $('#MenuParticulas').css({ "visibility": "hidden", "height": "0px", "width": "0px" })
  $('#particulasMenu').css({ "visibility": "hidden" })
  $("#progress").css({ "visibility": "visible", "height": "40px" });
  $("#progressBar").css({ "visibility": "visible", "width": "100%" }).text("Cargando..."); /*Muestra la barra de progreso*/
  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    vsym.json = JSON.parse(this.result);
    console.log(vsym.json);
    vsym.bandera = true;
    if (vsym.json.hasOwnProperty('p')) {
      var puntos = vsym.json.p;
      console.log(puntos);
      objVoronoi.drawVoronoi(puntos);  //llama funcion drawVoronoi encontrada en voronoi.js
      //muestra el menu para voronoi
      $('#MenuVoronoi').css({ "visibility": "visible", "height": "300px", "width": "auto" })
      $('#voronoiMenu').css({ "visibility": "visible" })

    } else if (vsym.json.hasOwnProperty('particles')) {
      if (vsym.json.type == "2D") {
        objParticulas.creaEscena(vsym.json); //llama funcion encontrada en particulas.js
      } else {
        alert("3D");
      }

      $('#MenuParticulas').css({ "visibility": "visible", "height": "300px", "width": "auto" })
      $('#particulasMenu').css({ "visibility": "visible" })

    } else if (vsym.json.hasOwnProperty('sitios')) {
      objRedp.drawRed(vsym.json);  //llama funcion encontrada en redporosa.js
      //muestra el menu para redes porosas
      $('#MenuRedPorosa').css({ "visibility": "visible", "height": "300px", "width": "auto" })
      $('#porosMenu').css({ "visibility": "visible" })
    } else {
      //archivo invalido
      alert('Selecciona un archivo JSON valido');
    }

    $("#progressBar").css({ "visibility": "hidden" });

    $('#progress').css({ "visibility": "hidden", "height": "0px" });


  };

  reader.readAsText(file);
};

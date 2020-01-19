function Voronio(visualizador,json) {
    var mySelf = this;
    this.puntosred = []; //puntos (objetos)
    this.colors = {}; //colores (hexa)


    this.mostrarMenu = function () {
      $('.container-fluid').empty();
      var contenedor= "<div class='row' id='visualizador"+visualizador.id+"'"+">"+
                        " <div class='container col-sm-10' id='"+visualizador.id+"'"+"></div> " +
                         "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+visualizador.id+"'"+"></div>" +
                         "</div>";
      
      $('.container-fluid').append(contenedor);

      var item = "<h3 class='align-text-top' id='titulo'><span>Menu Voronoi</span></h3>" +
          "<div id = 'particulasMenu' class='particulasMenu' >" + 
         " <ul class='nav flex-column' id='vor'>"+
            "<li class='nav-item'>"+
              "<div class='form-check'>"+
                "<input type='checkbox' class='form-check-input' id='checkAzul'>"+
                "<label class='form-check-label' for='exampleCheck1'>Azul</label>"+
              "</div>"+
            "</li>"+

            "<li class='nav-item'>"+
              "<div class='form-check'>"+
                "<input type='checkbox' class='form-check-input' id='checkGris' >"+
                "<label class='form-check-label' for='exampleCheck1'>Grises</label>"+
              "</div>"+
            "</li>"+
            "<li class='nav-item'>"+
              "<div class='form-check'>"+
                "<input type='checkbox' class='form-check-input' id='autoRotar'>"+
                "<label class='form-check-label' for='exampleCheck1'>Auto Rotar</label>"+
              "</div>"+
            "</li>"+
          "</ul>"+
        "</div>"

      $('#menu'+visualizador.id).append(item);
      $('#menu'+visualizador.id).css({ "visibility": "visible", "height": "600px", "width": "250" })
  }
  this.mostrarMenu();
    /**recibe el checkbox que activo el evento y el RGB del color que se quiere la escala
    con el checkbox se determina la funcion que hara, si esta marcado
    cambia la escala al color del RGB recibo, si esta desmarcado regresa a su color original**/
    this.setColor = function (checkbox, r, g, b) {
      var coloraux, coloraux2, caux;
      
      if (checkbox.checked == true) {     
          mySelf.puntosred.forEach(function (punto) {
              coloraux = punto.material.color;
              coloraux2 = coloraux.getHex();
              caux = coloraux.r + coloraux.g + coloraux.b;
              coloraux.r = r / caux;
              coloraux.g = g / caux;
              coloraux.b = b / caux;
              punto.material.setValues({color: coloraux});
              mySelf.colors[coloraux.getHex()] = coloraux2;
          });
      } else {
        
          mySelf.puntosred.forEach(function (punto) {
              coloraux = punto.material.color;
              caux = mySelf.colors[coloraux.getHex()];              
              punto.material.setValues({ color: caux });
              
          });
          mySelf.colors = {};
      }
    }

  /**recibe desde index.html el RGB del color a convertir en este caso gris y
    se lo pasa a setColor junto al checkbox que invoco esta funcion**/
  //igual que setGris pero para azul
  this.setBlue = function (r, g, b) {
    var checkbox = document.getElementById("checkAzul");            
    mySelf.setColor(checkbox, r, g, b);
    
  } 
  
   this.setGris = function (r, g, b) {
    var checkbox = document.getElementById("checkGris");      
    mySelf.setColor(checkbox, r, g, b);
    
  }
  
  this.autoRotar = function (checkbox) {
    if (checkbox.checked == true) {
      // auto rotate
      visualizador.controls.autoRotate = true;
      visualizador.controls.autoRotateSpeed = 5;
    } else {
      visualizador.controls.autoRotate = false;
    }
  }

  
  
  this.draw = function() {
      
      puntos = json.p;
      /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
         se crean en conjunto de cada color y se agregan a escena**/
      var elemento = document.getElementById(visualizador.id.toString());
      visualizador.creaEscena(elemento);
      visualizador.camera.position.set(350,350,350);
      visualizador.controls = new THREE.OrbitControls(visualizador.camera, visualizador.renderer.domElement);
      visualizador.controls.maxDistance = 500;
      visualizador.controls.maxDistance = 1000;
      var group = new THREE.Group();
      visualizador.scene.add(group);
    
      //especifica las figuras y su material
      var colores = {};
      var cs = [];
      var mx = -10000, my = -10000, mz = -10000;
      puntos.forEach(function (punto) {
          var px = parseInt(punto.x);
          var py = parseInt(punto.y);
          var pz = parseInt(punto.z);
          if (!colores.hasOwnProperty('' + punto.sb)) {
              var p = new THREE.Geometry();
              colores['' + punto.sb] = p;
  
              cs.push(punto.sb);
          }
          var point = new THREE.Vector3();
          point.x = px;
          point.y = py;
          point.z = pz;
          if (px > mx) mx = px;
          if (py > my) my = py;
          if (pz > mz) mz = pz;
  
          colores['' + punto.sb].vertices.push(point);
      });
      cs.forEach(function (color) {
          var aux = color * 111111;
          var c = new THREE.PointsMaterial({ color: aux });
          var puntomesh = new THREE.Points(colores['' + color], c);
          group.add(puntomesh);
          mySelf.puntosred.push(puntomesh);
      });
      
      var centro = new THREE.Vector3();
      centro.x = mx / 2;
      centro.y = my / 2;
      centro.z = mz / 2;
      visualizador.controls.target = centro;
      visualizador.animate();
  
  };
  //EvenListeners: Se usa Jquery para capturar los eventos
  $('document').ready(
    // Al seleccionar el checkBox llamado Azul se pintara el diagrama de color azul
    $('#checkAzul').change(function(){
      if($(this).is(":checked")){          
        $('#checkGris').prop("checked",false);
        mySelf.setBlue(0,0,1);
      }else{
        mySelf.setColor(this,0,0,0);
      }
    }),
    // Al seleccionar el checkBox llamado Gris se pintara el diagrama de color gris
    $('#checkGris').change(function(){
      if($(this).is(":checked")){             
        $('#checkAzul').prop("checked",false);
        mySelf.setGris(1,1,1);
      }else{
        mySelf.setColor(this,0,0,0);
      }
    }),
    // Al seleccionar el checkBox llamado Rotar el diagrama comenzará a girar
    $('#autoRotar').change(function(){
      if($(this).is(":checked")){                     
        mySelf.autoRotar(this);
      }else{
        mySelf.autoRotar(this);
      }
    })    
  );

}





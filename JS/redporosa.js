function RedPorosa (visualizador,json){
  var mySelf = this;
  this.redporosa = [];
  this.colorsp = {};
  

  this.mostrarMenu = function () {
  
    // "<h3 class='align-text-top' id='titulo'><span>Menu Red Porosa</span></h3>" +
    var contenedor= "<div class='row' id='visualizador"+visualizador.id+"'"+">"+
                        " <div class='container col-sm-10' id='"+visualizador.id+"'"+"></div> " +
                         "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+visualizador.id+"'"+"></div>" +
                         "</div>";
        
    $('.container-fluid').append(contenedor);

    var item =           
        "<div id = 'particulasMenu'"+ "class='particulasMenu' >" +
        "<h3 class='align-text-top' id='titulo'><span>Menu Red Porosa</span></h3>"+
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


  this.draw = function() {
    var elemento = document.getElementById(visualizador.id.toString());       
    visualizador.creaEscena(elemento);
    visualizador.camera.position.set(350, 350, 700);      
    
    //scene.setValues( {background:''} );
    visualizador.controls = new THREE.OrbitControls( visualizador.camera, visualizador.renderer.domElement );
    visualizador.controls.enableDamping = true;
    visualizador.controls.dampingFactor = 0.25;
    visualizador.controls.minDistance = 25;
    visualizador.controls.maxDistance = 100;
    var group = new THREE.Group();
    visualizador.scene.add(group);
    //var colores = json.sitiosColor;
    var puntos = json.sitios;
    var x,y,z,radio,rotacion,radiomax = -1;
    var mx=-1000,my=-1000,mz=-1000;
    var minx=1000,miny=1000,minz=1000;
    for(var i = 0; i < puntos.length; i++){
      x=puntos[i].x;
      y=puntos[i].y;
      z=puntos[i].z;
      if(x>mx) mx=x;
      if(x<minx) minx=x;
      if(y>my) my=y;
      if(y<miny) miny=y;
      if(z>mz) mz=z;
      if(z<minz) minz=z;
      radio=puntos[i].r;
      if(radio>radiomax){
        radiomax=radio;
      }
      rotacion=puntos[i*5+4];
      var p = new THREE.SphereGeometry(radio, 10,10);
      if(puntos[i].color==0){
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      }else if(puntos[i].color==1){
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      }else if(puntos[i].color==2){
        var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
      }
      var sphere = new THREE.Mesh( p, material );
      sphere.position.x = parseInt(x);
      sphere.position.y = parseInt(y);
      sphere.position.z = parseInt(z);
      visualizador.scene.add( sphere );
      mySelf.redporosa.push(sphere);
    }
  
    //var enlacescolores = json.enlacesColor;
    if(json.hasOwnProperty('enlaces')){
      var enlaces = json.enlaces;
      for(var i = 0; i < enlaces.length; i++){
        x=enlaces[i].x;
        y=enlaces[i].y;
        z=enlaces[i].z;
        radio=enlaces[i].r;
        rotacion=enlaces[i].eje;
        var p = new THREE.CylinderGeometry(radio,radio,radiomax*3,10);
        if(enlaces[i].color==0){
          var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        }else if(enlaces[i].color==1){
          var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        }else if(enlaces[i].color==2){
          var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        }
        var cylinder = new THREE.Mesh( p, material );
        cylinder.position.x = parseInt(x);
        cylinder.position.y = parseInt(y);
        cylinder.position.z = parseInt(z);
        if(rotacion==0){
          cylinder.rotation.x=Math.PI/2;
          cylinder.rotation.y=0;
          cylinder.rotation.z=0;
        }else if(rotacion==1){
          cylinder.rotation.x=0;
          cylinder.rotation.y=Math.PI/2;
          cylinder.rotation.z=0;
        }else if(rotacion==2){
          cylinder.rotation.x=0;
          cylinder.rotation.y=0;
          cylinder.rotation.z=Math.PI/2;
        }
        visualizador.scene.add( cylinder );
        mySelf.redporosa.push(cylinder);
      }
    }
    
      var centro = new THREE.Vector3();
      centro.x = (mx+minx)/2;
      centro.y = (my+miny)/2;
      centro.z = (mz+minz)/2;
      visualizador.controls.target =  centro;
      visualizador.animate();
  }
  this.setGris = function(check,r,g,b){
      var checkbox = check;
      var coloraux, caux;
      if(checkbox.checked==true){
           mySelf.redporosa.forEach(function(punto){
             var aux = punto.material.color;
             coloraux  =punto.material.color;
             if(aux.r==1 && aux.g==0 && aux.b==0){
               aux.r = r; aux.g = r; aux.b = r;
             }else if(aux.r==0 && aux.g==1 && aux.b==0){
               aux.r = g; aux.g = g; aux.b = g;
             }else if(aux.r==0 && aux.g==0 && aux.b==1){
               aux.r = b; aux.g = b; aux.b = b;
             }
             punto.material.setValues({color : aux});
             mySelf.colorsp[aux.getHex()] = coloraux;
           });
      } else {
            mySelf.redporosa.forEach(function(punto){
              var aux = punto.material.color;
              coloraux  =punto.material.color;
              if(aux.r == r && aux.g == r && aux.b == r){
                aux.r=1, aux.g=0, aux.b=0;
              }else if(aux.r == g && aux.g == g && aux.b == g){
                aux.r=0, aux.g=1, aux.b=0;
              }else if(aux.r == b && aux.g == b && aux.b == b){
                aux.r=0, aux.g=0, aux.b=1;
              }
              punto.material.setValues({color : aux});

            });
            mySelf.colorsp = {};
      }
  }
  this.setBlue =function(check,r,g,b) {
      var checkbox = check;
      var coloraux;
      if(checkbox.checked==true){
           mySelf.redporosa.forEach(function(punto){
             coloraux = punto.material.color;
             if(coloraux.r!=0){coloraux.r =0, coloraux.b=r;}
             else if(coloraux.g!=0){coloraux.g =0,coloraux.b=g;}
             else if(coloraux.b!=0){coloraux.b =b;}
             punto.material.setValues({color : coloraux});
           });
      } else {
            mySelf.redporosa.forEach(function(punto){
              coloraux = punto.material.color;
              if(coloraux.b==r){coloraux.r =1, coloraux.b=0;}
              else if(coloraux.b==g){coloraux.g =1,coloraux.b=0;}
              else if(coloraux.b==b){coloraux.b =1;}
              punto.material.setValues({color : coloraux});

            });
            mySelf.colorsp = {};
      }
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
  //EvenListeners: Se usa Jquery para capturar los eventos
  $('document').ready(
    // Al seleccionar el checkBox llamado Azul se pintara el diagrama de color azul
    $('#checkAzul').change(function(){
      if($(this).is(":checked")){          
        $('#checkGris').prop("checked",false);
        mySelf.setBlue(this,0,0,1);
      }else{
        mySelf.setBlue(this,0,0,0);
      }
    }),
    // Al seleccionar el checkBox llamado Gris se pintara el diagrama de color gris
    $('#checkGris').change(function(){
      if($(this).is(":checked")){             
        $('#checkAzul').prop("checked",false);
        mySelf.setGris(this,1,1,1);
      }else{
        mySelf.setGris(this,0,0,0);
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
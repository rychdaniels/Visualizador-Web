function RedPorosa ( ){
    MenuRed.call(this);
    this.redporosa = [];
    this.colorsp = {};

    this.drawRed = function(json) {
      var aspect = 1000 / 800;
      vsym.camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );

      vsym.camera.position.set(350, 350, 700);
      vsym.camera.lookAt(0, 0, 0);
      vsym.scene = new THREE.Scene();
      vsym.scene.background = new THREE.Color( 0xD3D3D3 );
      espacio.appendChild( vsym.renderer.domElement );
      //scene.setValues( {background:''} );
      vsym.controls = new THREE.OrbitControls( vsym.camera, vsym.renderer.domElement );

      vsym.controls.enableDamping = true;
      vsym.controls.dampingFactor = 0.25;

      vsym.controls.minDistance = 25;
      vsym.controls.maxDistance = 100;

      var group = new THREE.Group();
      vsym.scene.add(group);

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

        vsym.scene.add( sphere );
        objRedp.redporosa.push(sphere);

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
          vsym.scene.add( cylinder );
          objRedp.redporosa.push(cylinder);

        }
      }

      console.log(vsym.scene);
      var centro = new THREE.Vector3();
      centro.x = (mx+minx)/2;
      centro.y = (my+miny)/2;
      centro.z = (mz+minz)/2;
      vsym.controls.target =  centro;

      vsym.animate();
    }

    this.setGris = function(r,g,b){
      var checkbox = document.getElementById("Checkrp2");
      var coloraux, caux;
      if(checkbox.checked==true){
           objRedp.redporosa.forEach(function(punto){
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
             objRedp.colorsp[aux.getHex()] = coloraux;
           });
      } else {
            objRedp.redporosa.forEach(function(punto){
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
            objRedp.colorsp = {};
      }
    }

    this.setBlue =function(r,g,b) {
      var checkbox = document.getElementById("Checkrp1");
      var coloraux;
      if(checkbox.checked==true){
           objRedp.redporosa.forEach(function(punto){
             coloraux = punto.material.color;
             if(coloraux.r!=0){coloraux.r =0, coloraux.b=r;}
             else if(coloraux.g!=0){coloraux.g =0,coloraux.b=g;}
             else if(coloraux.b!=0){coloraux.b =b;}
             punto.material.setValues({color : coloraux});
           });
      } else {
            objRedp.redporosa.forEach(function(punto){
              coloraux = punto.material.color;
              if(coloraux.b==r){coloraux.r =1, coloraux.b=0;}
              else if(coloraux.b==g){coloraux.g =1,coloraux.b=0;}
              else if(coloraux.b==b){coloraux.b =1;}
              punto.material.setValues({color : coloraux});

            });
            objRedp.colorsp = {};
      }
    }

    this.setColor = function(checkbox,r,g,b) {

    }

}
RedPorosa.prototype = new MenuRed();

var objRedp = new RedPorosa();

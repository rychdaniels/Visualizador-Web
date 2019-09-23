function Voronoi ( ){
    MenuRed.call(this);
    this.puntosred = []; //puntos (objetos)
    this.colors = {}; //colores (hexa)

    /**recibe desde index.html el RGB del color a convertir en este caso gris
    y  se lo pasa a setColor junto al checkbox que invoco esta funcion**/
    this.setGris = function(r,g,b) {
      var checkbox = document.getElementById("Check2");
      this.setColor(checkbox,r,g,b);
    }
    //igual que setGris pero para azul
    this.setBlue  = function(r,g,b){
      var checkbox = document.getElementById("Check1");
      this.setColor(checkbox,r,g,b);
    }

    /**recibe el checkbox que activo el evento y el RGB del color que se quiere la escala
    con el checkbox se determina la funcion que hara, si esta marcado
    cambia la escala al color del RGB recibo, si esta desmarcado regresa a su color original**/
    this.setColor = function(checkbox,r,g,b){
      var coloraux, coloraux2, caux;
      if(checkbox.checked==true){
           objVoronoi.puntosred.forEach(function(punto){
             coloraux = punto.material.color;
             coloraux2 = coloraux.getHex();
             caux = coloraux.r+ coloraux.g +coloraux.b;
             coloraux.r =r/caux;
             coloraux.g =g/caux;
             coloraux.b =b/caux;
             punto.material.setValues({color : coloraux});
             objVoronoi.colors[coloraux.getHex()] = coloraux2;
           });
      } else {
            objVoronoi.puntosred.forEach(function(punto){
              coloraux = punto.material.color;
              caux =objVoronoi.colors[coloraux.getHex()];
              punto.material.setValues({color : caux});
            });
            objVoronoi.colors = {};
      }
      console.log(objVoronoi.colors);
    }

    /**funcion llamada desde index.js recibe un arreglo con las posiciones y color de cada punto
    se crean en conjunto de cada color y se agregan a escena**/
    this.drawVoronoi = function(puntos){
      var aspect = 1000 / 800;
      vsym.camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );

      vsym.camera.position.set(350, 350, 350);

      vsym.scene = new THREE.Scene();
      vsym.scene.background = new THREE.Color( 0xD3D3D3 );
      espacio.appendChild( vsym.renderer.domElement );
      vsym.controls = new THREE.OrbitControls( vsym.camera, vsym.renderer.domElement );

      vsym.controls.maxDistance =500;
      vsym.controls.maxDistance = 1000;
      var group = new THREE.Group();
      vsym.scene.add(group);
      //}
      //especifica las figuras y su material
      var colores = {};
      var cs = [];
      var mx=-10000,my=-10000,mz=-10000;
      puntos.forEach(function(punto){
        var px = parseInt(punto.x);
        var py = parseInt(punto.y);
        var pz = parseInt(punto.z);
        if(!colores.hasOwnProperty(''+punto.sb)){
          var p = new THREE.Geometry();
          colores[''+punto.sb] = p ;

          cs.push(punto.sb);
        }
          var point = new THREE.Vector3();
          point.x=px;
          point.y=py;
          point.z=pz;
          if(px>mx) mx=px;
          if(py>my) my=py;
          if(pz>mz) mz=pz;

          colores[''+punto.sb].vertices.push(point);
      });
      cs.forEach(function(color){
        var aux =  color*111111;
        var c = new THREE.PointsMaterial( {color: aux}  );
        var puntomesh =  new THREE.Points( colores[''+color], c);
        group.add(puntomesh);
        objVoronoi.puntosred.push(puntomesh);
      });
      console.log(objVoronoi.puntosred);
      console.log(vsym.controls);
      var centro = new THREE.Vector3();
      centro.x = mx/2;
      centro.y = my/2;
      centro.z = mz/2;
      vsym.controls.target =  centro;

      vsym.animate();
    };

}
//recibe elementos de menured.js
Voronoi.prototype = new MenuRed();

var objVoronoi = new Voronoi();

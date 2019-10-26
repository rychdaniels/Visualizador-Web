function ParticulasN(json) {

    // creaEscena.call(this);
    var json = json;
    var paso = 1;
    var particulas = 0;
    var funciones = 0;
    var pars = [];//particulas (objetos)
    var color = [];//colores
    var trays = [];//posiciones
    var trayso = [];//lineas
    var play = false;
    // var scene = 0;
    var group = 0;
    // var camera = 0;
    // var renderer = 0;
    var controls = 0;
    var bandera = false;;

    var elemento = document.getElementById('espacio');
    creaEscena(elemento);
    play = true;
    this.dibujaCanal = function () {
        funciones = json.canal;

        var barizq = funciones.LBarrier.value;
        var barder = funciones.RBarrier.value;


        var xRange = barder - barizq;
        var h = xRange / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
        var x = barizq;
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 100 });//azul
        var mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 100 });//rojo

        var formaCanal = new THREE.Shape();

        //definiendo funciones
        var funciont = funciones.TWall.function;//Accedemos a la funcion
        var tWall = texttoFunction(funciont);//string --> js con ayuda del parser
        console.log(tWall);
        var funcionb = funciones.BWall.function;
        var bWall = texttoFunction(funcionb);

        //TWALL es la pared superior del canal
        var tgeometry = new THREE.Geometry();
        var p0 = tWall(x);
        formaCanal.moveTo(x + h, p0); // punto inicial de la forma del canal
        while (x < barder) {
            var y = tWall(x);
            tgeometry.vertices.push(new THREE.Vector3(x, y, 0));
            x += h;
            if (x <= barder) { formaCanal.lineTo(x, y - h); } //menos h para que no tape la linea de la frontera

        }
        if (funciones.TWall.isReflec) {
            var funt = new THREE.Line(tgeometry, material);//azul
        } else {
            var funt = new THREE.Line(tgeometry, mat2);//rojo
        }

        var y;
        //RBarrier
        y = tWall(barder);
        var rgeometry = new THREE.Geometry();
        rgeometry.vertices.push(new THREE.Vector3(barder, y, 0));
        formaCanal.lineTo(barder - h, y);
        y = bWall(barder);
        rgeometry.vertices.push(new THREE.Vector3(barder, y, 0));
        formaCanal.lineTo(barder - h, y);
        if (funciones.RBarrier.isReflec) {
            var barr = new THREE.Line(rgeometry, material);
        } else {
            var barr = new THREE.Line(rgeometry, mat2);
        }


        //BWALL
        var bgeometry = new THREE.Geometry();
        x = barder;
        while (x >= barizq - h) {
            var y = bWall(x);
            bgeometry.vertices.push(new THREE.Vector3(x, y, 0));
            x -= h;
            if (x >= barizq) { formaCanal.lineTo(x, y + 3 * h); }// mas 3h para que no tape la linea del canal
        }
        if (funciones.BWall.isReflec) {
            var funb = new THREE.Line(bgeometry, material);
        } else {
            var funb = new THREE.Line(bgeometry, mat2);
        }


        //LBarrier, solo cortan en twall y bwall
        y = bWall(barizq);
        var lgeometry = new THREE.Geometry();
        lgeometry.vertices.push(new THREE.Vector3(barizq, y, 0));
        formaCanal.lineTo(barizq + h, y);
        y = tWall(barizq);
        lgeometry.vertices.push(new THREE.Vector3(barizq, y, 0));
        formaCanal.lineTo(barizq + h, y);

        if (funciones.LBarrier.isReflec) {
            var barl = new THREE.Line(lgeometry, material);
        } else {
            var barl = new THREE.Line(lgeometry, mat2);
        }

        //crea canal y agrega a escena, luego agrega barreras del canal
        var cgeometry = new THREE.ShapeGeometry(formaCanal);
        var materialc = new THREE.MeshBasicMaterial({ color: 0x9B9B9B });
        var canal = new THREE.Mesh(cgeometry, materialc);
        scene.add(canal);
        scene.add(funt);//agrega a escena
        scene.add(barr);
        scene.add(funb);
        scene.add(barl);
        renderer.render(scene, camera);
    }

    // Funcion encargada de dibujar las particulas en la escena
    this.dibujar = function (json) {

        //dibuja particulas y las coloca en la primer posicion
        particulas = json.particles.particle;

        var colores = 1;
        particulas.forEach(function (particula) {//para cada particula se realiza
            var x = particula.pasos[0].x;
            var y = particula.pasos[0].y;
            var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
            var aux = colores * 111111;
            color.push(aux);
            var material = new THREE.MeshBasicMaterial({ color: aux });
            var sphere = new THREE.Mesh(p, material);
            sphere.position.x = parseInt(x);
            sphere.position.y = parseInt(y);
            scene.add(sphere);
            pars.push(sphere);

            trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
            colores += 100;

        });
        //console.log(scene);
        //console.log(trayso);
        avanza();
    }

    function avanza() {
        console.log(bandera);
        // if (bandera != false) {
        if (play != false) {
            paso++;
            setPos();
        }
        //objParticulas.paso++;
        // }
        renderer.render(scene, camera);
        requestAnimationFrame(avanza);
    }

    document.getElementById('pausa').onchange =
        //pausa la animacion
        function () {
            if (play == true) {
                play = false;

            } else {
                play = true;
            }
        }


    /**actualiza posiciones de las particulas si el paso actual
  esta dentro del rango de cada trayectoria
  tambien agrega las posiciones actuales al objeto trays para
  que se agregue al dibujo de las trayectorias**/
    function setPos() {
        for (var i = 0; i < particulas.length; i++) {
            if (paso < particulas[i].pasos.length) {
                var x = parseFloat(particulas[i].pasos[paso].x);
                var y = parseFloat(particulas[i].pasos[paso].y);
                pars[i].position.setX(x);
                pars[i].position.setY(y);
                trays[i].push({ "x": x, "y": y });
            } else if (paso == particulas[i].pasos.length) {
                console.log("terminó particula: " + i);
            }
        }
        checkbox = document.getElementById("Checkpt1");
        if (checkbox.checked == true) {
            muestraTray();
        }
        document.getElementById("paso").innerHTML = paso;
    }



};



// Funcion encargada de anirmar las particulas
// ParticulasN.prototype.animate = function () {




//convierte una funcion de texto a js
function texttoFunction(funcion) {
    return Parser.parse(funcion).toJSFunction(['x']);
}
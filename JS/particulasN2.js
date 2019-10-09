function ParticulasN2() {
    this.paso = 1;
    this.particulas = 0;
    this.funciones = 0;
    this.pars = [];//particulas (objetos)
    this.color = [];//colores
    this.trays = [];//posiciones
    this.trayso = [];//lineas
    this.play = false;

}


function dibujar(objParticulas, json) {

    dibujar.prototype.dibujaCanal = function () {
        var elemento = document.getElementById('espacio');
        creaEscena(elemento);
        objParticulas.funciones = json.canal;

        console.log(objParticulas);
        var barizq = objParticulas.funciones.LBarrier.value;
        var barder = objParticulas.funciones.RBarrier.value;


        var xRange = barder - barizq;
        var h = xRange / 1000; //si se requiere mas detalle en las funciones hacer mas pequeño este valor
        var x = barizq;
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 100 });//azul
        var mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 100 });//rojo

        var formaCanal = new THREE.Shape();

        //definiendo funciones
        var funciont = objParticulas.funciones.TWall.function;//Accedemos a la funcion
        var tWall = texttoFunction(funciont);//string --> js con ayuda del parser
        console.log(tWall);
        var funcionb = objParticulas.funciones.BWall.function;
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
        if (objParticulas.funciones.TWall.isReflec) {
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
        if (objParticulas.funciones.RBarrier.isReflec) {
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
        if (objParticulas.funciones.BWall.isReflec) {
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

        if (objParticulas.funciones.LBarrier.isReflec) {
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
}



//convierte una funcion de texto a js
function texttoFunction(funcion) {
    return Parser.parse(funcion).toJSFunction(['x']);
}
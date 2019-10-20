function ParticulasN2(visualizador) {

    var mySelf = this;
    this.paso = 1;
    this.particulas = 0;
    this.funciones = 0;
    this.pars = [];//particulas (objetos)
    this.color = [];//colores
    this.trays = [];//posiciones
    this.trayso = [];//lineas
    this.play = false;
	


    this.setPos = function () {
        for (var i = 0; i < this.particulas.length; i++) {
            if (this.paso < this.particulas[i].pasos.length) {
                var x = parseFloat(this.particulas[i].pasos[this.paso].x);
                var y = parseFloat(this.particulas[i].pasos[this.paso].y);
                this.pars[i].position.setX(x);
                this.pars[i].position.setY(y);
                this.trays[i].push({ "x": x, "y": y });
            } else if (this.paso == this.particulas[i].pasos.length) {
                console.log("terminó particula: " + i);
            }
        }
        checkbox = document.getElementById("Checkpt1");
        if (checkbox.checked == true) {
            this.muestraTray();
        }
        document.getElementById("paso").innerHTML = this.paso;

    }

    ///Aqui va muestraTrayectoria

    this.muestraTray = function () {
        checkbox = document.getElementById("Checkpt1");
        this.trayso.forEach(function (tray) {
            visualizador.scene.remove(tray);
        });
        this.trayso = [];
        if (checkbox.checked == true) {
            for (var i = 0; i < this.trays.length; i++) {
                var color = this.color[i];
                var geometry = new THREE.Geometry();
                var material = new THREE.LineBasicMaterial({ color: color });
                for (var j = 0; j < this.trays[i].length; j++) {
                    var x = this.trays[i][j].x;
                    var y = this.trays[i][j].y;
                    geometry.vertices.push(new THREE.Vector3(x, y, 0));

                }
                var tray = new THREE.Line(geometry, material);
                visualizador.scene.add(tray);
                this.trayso.push(tray);

            }
        }

    }

    this.pause = function () {
        console.log('click');
        if (this.play == true) {
            this.play = false;

        } else {
            this.play = true;
        }
    }

    this.mostrarMenu = function () {
        $('#menu').empty();
        var item = "<h3 class='align-text-top' id='titulo'><span>Menu Particulas</span></h3>" +
            "<div id = 'particulasMenu' class='particulasMenu' >" +
            "<ul class='nav flex-column' id='vor'>" +
            "<li class='nav-item'>" +
            "<div class='form-check'>" +
            "<button type='button' class='btn btn-success' onclick='mySelf.pause()' > Pausa</button > " +
            "</div>" +
            "</li>" +

            "<li class='nav-item'>" +
            "<div class='form-check'>" +
            "<button type='button' class='btn btn-success' onclick= + this.regresa() + >-5 pasos</button>" +
            "</div>" +
            "</li>" +
            "<li class='nav-item'>" +
            "<div class='form-check'>" +
            "<button type='button' class='btn btn-success' onclick= + this.avanzar() + >+5 pasos</button>" +
            "</div>" +
            "</li>" +
            "<li class='nav-item'>" +
            "<div class='form-check'>" +
            "<input type='checkbox' class='form-check-input' id='Checkpt1' onchange= 'this.muestraTray' >" +
            "<label class='form-check-label' for='exampleCheck1'>Trayectorias</label>" +
            "</div>" +
            "</li>" +
            "<li class='nav-item'>" +
            "<p>Paso: <output id='paso'></output></p>" +
            "</li>" +

            "<li class='nav-item'>" +
            "<div class='form-check'>" +
            "<input type='checkbox' class='form-check-input' id='particula1'" +
            "onchange='objParticulas.aislaParticula()'>" +
            "<label class='form-check-label' for='particula1'>Particula</label>" +
            "</div>" +
            "</li>" +
            "</ul>";
        $('#menu').append(item);
        $('#menu').css({ "visibility": "visible", "height": "600px", "width": "250" })

    }
    this.mostrarMenu();
 this.draw = function(json) {


    var objParticulas=mySelf;

    this.dibujaCanal = function () {
        var elemento = document.getElementById('espacio');
        visualizador.creaEscena(elemento);
        objParticulas.play = true; //Si la escena se ha creado correctamente podemos comenzar la animacion
        objParticulas.funciones = json.canal;
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
        visualizador.scene.add(canal);
        visualizador.scene.add(funt);//agrega a escena
        visualizador.scene.add(barr);
        visualizador.scene.add(funb);
        visualizador.scene.add(barl);


    }


    this.dibujaParticulas = function () {
        this.dibujaCanal();

        //dibuja particulas y las coloca en la primer posicion
        objParticulas.particulas = json.particles.particle;
        var color = 1;
        objParticulas.particulas.forEach(function (particula) {//para cada particula se realiza

            var x = particula.pasos[0].x;
            var y = particula.pasos[0].y;
            var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
            var aux = color * 111111;
            objParticulas.color.push(aux);

            var material = new THREE.MeshBasicMaterial({ color: aux });
            var sphere = new THREE.Mesh(p, material);
            sphere.position.x = parseInt(x);

            sphere.position.y = parseInt(y);
            visualizador.scene.add(sphere);
            objParticulas.pars.push(sphere);

            objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
            color += 100;


        });
        //console.log(scene);
        //console.log(trayso);

        objParticulas.animate(visualizador, objParticulas);
    }
    this.dibujaParticulas();
}
    


}


ParticulasN2.prototype.animate = function (visualizador, objParticulas) {

    function avanza() {
        if (visualizador.bandera != false) {
            if (objParticulas.play != false) {
                objParticulas.paso++;
                objParticulas.setPos();
            }
            //objParticulas.paso++;

        }
        visualizador.renderer.render(visualizador.scene, visualizador.camera);
        requestAnimationFrame(avanza);
    }

    requestAnimationFrame(avanza);
};




//convierte una funcion de texto a js
function texttoFunction(funcion) {
    return Parser.parse(funcion).toJSFunction(['x']);
}


function Particulas(visualizador,json) {

    var mySelf = this;
    this.paso = 1;
    this.particulas = 0;
    this.funciones = 0;
    this.pars = [];//particulas (objetos)
    this.color = [];//colores
    this.trays = [];//posiciones
    this.trayso = [];//lineas
    this.colorTrayectoria = [];
    this.play = false;
    this.aislar = false;
    this.numeroParticula = null;   

	
    this.mostrarMenu = function () {
        var contenedor= "<div class='row' id='visualizador"+visualizador.id+"'"+">"+
                        " <div class='container col-sm-10' id='"+visualizador.id+"'"+"></div> " +
                         "<div class='d-none d-md-block bg-light sidebar col-sm-2' id='menu"+visualizador.id+"'"+"></div>" +
                         "</div>";
        
        $('.container-fluid').append(contenedor);
        var item = 
            "<div id = 'particulasMenu"+visualizador.id+"'"+ "class='particulasMenu' >" +
            "<h3 class='align-text-top' id='titulo'><span>Menu Particulas</span></h3>"+
            "<ul class='nav flex-column'>" +

                "<li class='nav-item'>" +
                "<div class='form-check'>" +
                "<button type='button' class='btn btn-success' id = 'pausa"+visualizador.id+"'"+"> Pausa</button ></div>" +
                "</li>" +

                "<li class='nav-item'>" +
                "<div class='form-check'>" +
                "<button type='button' class='btn btn-success' id='regresar"+visualizador.id+"'" + ">-5 pasos</button>" +
                "</div>" +
                "</li>" +

                "<li class='nav-item'>" +
                "<div class='form-check'>" +
                "<button type='button' class='btn btn-success' id='avanzar"+visualizador.id+"'"+">+5 pasos</button>" +
                "</div>" +
                "</li>" +

                "<li class='nav-item'>" +
                "<p>Paso: <output id='pos"+visualizador.id+"'"+"></output></p>" +
                "</li>" +

                "<li class='nav-item'>" +
                "<div class='form-check'>" +
                "<input type='checkbox' class='form-check-input' id='Checkpt1"+visualizador.id+"'"+">" +
                "<label class='form-check-label' for='exampleCheck1'>Trayectorias</label></div>" +
                "</li>" +       
                
                "<div class='aisla-particula' id='aislaParticula"+visualizador.id+"'"+">"+
                    "<h2>Particula</h2>" +
                    "<input type='number' min='0' max='4' id='particula' placeholder='Elija particula'>" +
                    "<button class = 'btn-success' type='submit' id='aceptar'>Aceptar</button>" +
                   
                "</div>" +
            "</ul>";
            
        $("#menu"+visualizador.id).append(item);
        $("#menu"+visualizador.id).css({ "visibility": "visible", "height": "600px", "width": "250" })
        

    }
    
    this.mostrarMenu();

    this.draw = function() {
        var objParticulas=mySelf;
        
        this.dibujaCanal = function () {            
            
            var elemento = document.getElementById(visualizador.id.toString());   
            // console.log("visualizador desde dibuja canal"+ visualizador.id.toString());
            // console.log(typeof(visualizador.id.toString()));
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


        this.dibujaParticulas = function ( ) {
            this.dibujaCanal();
            
            var color = 1 + this.numeroParticula * 100;            
            objParticulas.particulas = {};
            if ( this.aislar ) {
                
                objParticulas.particulas = json.particles.particle[this.numeroParticula];
                                
                    var x = objParticulas.particulas.pasos[0].x;
                    var y = objParticulas.particulas.pasos[0].y;     
                         
                    var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var aux = color * 111111;
                    objParticulas.color.push(aux);
                    var material = new THREE.MeshBasicMaterial({ color: aux });
                    var sphere = new THREE.Mesh(p, material);
                    sphere.position.x = parseFloat(x);
                    sphere.position.y = parseFloat(y);                
                    visualizador.scene.add(sphere);
                    objParticulas.pars.push(sphere);    
                    objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    

            } else {
                objParticulas.particulas = json.particles.particle;
                
                //dibuja particulas y las coloca en la primer posicion
                objParticulas.particulas.forEach(function(particula) {//para cada particula se realiza
    
                    var x = particula.pasos[0].x;
                    var y = particula.pasos[0].y;
                    var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                    var aux = color * 111111;
                    objParticulas.color.push(aux);
    
                    var material = new THREE.MeshBasicMaterial({ color: aux });
                    var sphere = new THREE.Mesh(p, material);
                    
                    sphere.position.x = parseFloat(x);
                    sphere.position.y = parseFloat(y);                
                    visualizador.scene.add(sphere);
                    objParticulas.pars.push(sphere);
                    objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    console.log(objParticulas.trays);
                    color += 100;
                });
            }
            objParticulas.animate(visualizador, objParticulas);
            
        }
        this.dibujaParticulas();
    }

    this.setPos = function ( aislar = false, objParticulas) {
        
        
        if ( aislar == false ) {
            var pasoID = "pos"+visualizador.id;
            var checkID = "Checkpt1"+visualizador.id;
            
            for (var i = 0; i < this.particulas.length; i++) {
                if (this.paso < this.particulas[i].pasos.length) {
                    var x = parseFloat(this.particulas[i].pasos[this.paso].x);
                    var y = parseFloat(this.particulas[i].pasos[this.paso].y);
                    this.pars[i].position.setX(x);                    
                    this.pars[i].position.setY(y);
                    this.trays[i].push({ "x": x, "y": y });
                    
                }             
                
                
            }
            document.getElementById(pasoID).innerHTML = this.paso;
            checkbox = document.getElementById(checkID);        
            
            if (checkbox.checked == true) {
                this.muestraTray(objParticulas);
            }
        } else {            

            
            if (this.paso < this.particulas.pasos.length) {   
                var x = parseFloat(this.particulas.pasos[this.paso].x);
                var y = parseFloat(this.particulas.pasos[this.paso].y);                                
                this.pars[0].position.setX(x);
                this.pars[0].position.setY(y);
                this.trays[0].push({ "x": x, "y": y });
            }
            var pasoID = "pos"+visualizador.id;
            var checkID = "Checkpt1"+visualizador.id;
            
            checkbox = document.getElementById(checkID);        
            if (checkbox.checked == true) {
                this.muestraTray();
            }
            document.getElementById(pasoID).innerHTML = this.paso;
        }
        // console.log('Desde setPos, aislar = ' + this.aislar + "Visualizador " + visualizador.id);
    }

    

    this.muestraTray = function (objParticulas) {
        
        this.trayso.forEach(function (tray) {
            visualizador.scene.remove(tray);
        });
        this.trayso = [];
        let xP = 300;
        // console.log(this.aislar);
        if (checkbox.checked == true) {
            for (var i = 0; i < this.trays.length; i++) {               
                
                
                if( this.paso >= xP && this.aislar == true){
                    this.colorTrayectoria.push(0xFFE50E);                    
                    
                } else {
                    this.colorTrayectoria.push(this.color[i]);
                    
                    
                }
                var color =  { color: this.colorTrayectoria[this.colorTrayectoria.length-1]};
                // { linewidth: 10, color: 0xffffff, vertexColors: THREE.VertexColors, shading: THREE.FlatShading } 
                var geometry = new THREE.Geometry();
                var material = new THREE.LineBasicMaterial( color );
                
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
        // console.log('click de: ' + visualizador.id);
        if (this.play == true) {
            this.play = false;
            // console.log(this.play);
        } else {
            this.play = true;
        }
    }

    //regresa 5 pasos
    this.regresar = function () {
      this.play = false;
      this.paso -= 5;
      this.aislar = true;      
      this.setPos(this.aislar, this.numeroParticula);
      visualizador.renderer.render(visualizador.scene, visualizador.camera);
    }


    //avanza 5 pasos
    this.avanzar = function () {
      this.play = false;
      this.paso += 5;
      this.aislar = true;      
      this.setPos(this.aislar, this.numeroParticula);
      visualizador.renderer.render(visualizador.scene, visualizador.camera);
    }      
    
    
    
    this.aislaParticula = function (particula, nuevoVisualizador){      
        
        if( particula >= this.particulas.length ){
            const mensaje = "<div id = 'mensaje'>"+
                                "<h3>Valor inválido</h3>"
                            "</div>";
            
            $('#aceptar').after(mensaje); 
            setTimeout( () => {
                $('#mensaje').remove();   
                
            },1500 );
            
            return false;
        }
        this.colorTrayectoria=[];    
        nuevoVisualizador.bandera = true;
        

        var nuevoItem = "<div class='nuevo' id ='particula"+nuevoVisualizador.id+"'>"+
                            "<div class='row'>"+
                                "<button class='btn btn-block btn-info btn-titulo col-sm-8' disabled>Particula " + particula + "</button>" +
                                "<button class='btn btn-danger btn-titulo col-sm-4' id='quitar"+nuevoVisualizador.id+"'> Quitar </button>" +
                            "</div>"           
                        "</div>";         
        object =  eval("new " + json.name + "(nuevoVisualizador,json)");       
        object.aislar = true;
        object.numeroParticula = particula;
        object.draw(json);     
        
        // console.log('nuevoVisualizador' + nuevoVisualizador.id);
        $('#visualizador'+nuevoVisualizador.id).before(nuevoItem); 
        $('#aislaParticula'+nuevoVisualizador.id).remove();
        
        $('#quitar'+nuevoVisualizador.id).click(function(){
            // console.log('click');
            var respuesta = confirm("Desea eliminar el visualizador de particula #" + particula);
            if( respuesta ) {
                object = {};
                $('#particula'+nuevoVisualizador.id).remove();
                $('#visualizador'+nuevoVisualizador.id).remove();
            } else {
                return false;
            }
            
        })  
    }
    
    // this.buscaPosicion = function (objParticulas){
    //     let xP = 1000;
    //     console.log(this.particulas);
    //     for (var i = 0; i < this.particulas.length; i++) {
    //         if (this.paso < this.particulas[i].pasos.length) {

    //             if ( xP == this.particulas[i].pasos[this.paso].x) {
                    
                
    //                 objParticulas.color[i] = 00000;
                    
    //             }           
    //         }    
    //     }        
    // }
    
     
    //EvenListeners: Se usa Jquery para capturar los eventos
    $('document').ready(

        $('#pausa'+visualizador.id).click(function () {
            mySelf.pause();
            console.log(mySelf.aislar);
        }),

        $('#regresar'+visualizador.id).click(function () {
            mySelf.regresar();
        }),

        $('#avanzar'+visualizador.id).click(function () {
            mySelf.avanzar();
        }),

        $('#Checkpt1'+visualizador.id).change(function(){
            if($(this).is(":checked")){
                mySelf.muestraTray();
            }
        }),        

      

        $('#aceptar').click(function(e){
            
            var valor = $('#particula').val();            
            if( valor == ''){   
                              
                e.preventDefault();
            } else {         
                mySelf.aislaParticula(valor, new Visualizador());
                $('#particula').val('');                 
            }
        }),

        
    );

}


Particulas.prototype.animate = function (visualizador, objParticulas) {     
    
    function avanza() {
        if (visualizador.bandera != false) {
            if (objParticulas.play != false) {
                objParticulas.paso++;
                
                objParticulas.setPos(objParticulas.aislar, objParticulas);
                // console.log('me invocaron');
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


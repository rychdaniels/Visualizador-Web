function Particulas(visualizador,json) {

    var mySelf = this;
    this.paso = 1;
    this.particulas = 0;
    this.funciones = 0;
    this.pars = [];//particulas (objetos)
    this.color = [];//colores
    this.trays = [];//posiciones de cada particula
    this.trayso = [];//lineas
    this.colorTrayectoria = []; //rreglo para almacenar el color de la trayectoria de una particula aislada
    this.play = false; //Para detener o reanudar la simulacion
    this.aislar = false; //Guarda si la particula es sera aislada
    this.numeroParticula = null; //Numero de particula que ha sido aislada

	/**
     * Metodo encargado de crear el menu para cada una de las particulas,
     * se crea un menu por cada visualizador, cada menu tiene un 
     * identificador que corresponde a cada visualizador
     */
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
        
        /**
         * Metodo encargado de crear el lugar donde se visualizara la simulacion, este metodo crea
         * -> La escena
         * -> Las paredes del lugar de la visualizacion
         */
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

        /**
         * Metodo encargado de dibujar cada una de las particulas
         */
        this.dibujaParticulas = function ( ) {
            this.dibujaCanal();
            //Generamos un color pseudoaleatorio
            var color = 1 + this.numeroParticula * 100;            
            //Nos aseguramos que el objeto este vacio
            objParticulas.particulas = {};
            //Si la particula es aislada
            if ( this.aislar ) {
                
                //Leemos las propeidades de archivo JSON
                objParticulas.particulas = json.particles.particle[this.numeroParticula];
                //Obtenemos solo los pasos de una particula
                var x = objParticulas.particulas.pasos[0].x;
                var y = objParticulas.particulas.pasos[0].y;     
                //Creamos las esferas
                var p = new THREE.SphereGeometry(.01, 10, 10); //(radio, ..., ...)
                var aux = color * 111111; //Generamos el color
                objParticulas.color.push(aux);//Guardamos el color
                //Asignamos el color a la particula
                var material = new THREE.MeshBasicMaterial({ color: aux });
                //Creamos la esfera y le asignamos su tamaño y color
                var sphere = new THREE.Mesh(p, material);
                //Asignamos las posiciones para la esfera
                sphere.position.x = parseFloat(x);
                sphere.position.y = parseFloat(y);       
                //Agregamos la esfera al visualizador         
                visualizador.scene.add(sphere);
                objParticulas.pars.push(sphere);    
                //Guardamos las trayectorias de la esfera
                objParticulas.trays.push([{ "x": x, "y": y }]);//se guarda pos para las trayectorias
                    

            } else { //Si la particula no es aislada
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
                    color += 100;
                });
            }
            objParticulas.animate(visualizador, objParticulas);
            
        }
        this.dibujaParticulas();
    }

    /**
     * Metodo encargado de guardar cada una de la posiciones de las
     * particulas
     * @params
     * aislar : Indica si la particula sera aislada
     * objParticulas: Es el objeto que contiene toda la informacion de
     *                la particula.
     */
    this.setPos = function ( aislar = false, objParticulas) {
        
        //Si la particula NO es aislada
        if ( aislar == false ) {
            var pasoID = "pos"+visualizador.id;
            var checkID = "Checkpt1"+visualizador.id;
            
            //Recorremos el arreglo de cada una de las particulas
            for (var i = 0; i < this.particulas.length; i++) {
                if (this.paso < this.particulas[i].pasos.length) {
                    //Guardamos cada posicion
                    var x = parseFloat(this.particulas[i].pasos[this.paso].x);
                    var y = parseFloat(this.particulas[i].pasos[this.paso].y);
                    //Metemos cada posicion en el arreglo pars 
                    this.pars[i].position.setX(x);                    
                    this.pars[i].position.setY(y);
                    //Guardamos en el arreglo trays cada uno de los puntos
                    this.trays[i].push({ "x": x, "y": y });
                    
                }             
                
                
            }
            var pasoID = "pos"+visualizador.id;
            var checkID = "Checkpt1"+visualizador.id;
            //Se muestran cada uno de los pasos recorridos en el navegador
            document.getElementById(pasoID).innerHTML = this.paso;
            checkbox = document.getElementById(checkID);  
            
            //Si Trayectoria esta marcado, se mostraran las traqyectorias de las particulas
            if (checkbox.checked == true) {
                this.muestraTray(objParticulas);
            }
        } else {//La particula es aislada, repetimos el procedimiento anterior pero solo para una particula
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

    /**
     * Metodo encargado de mostrar las trayectoria de cada una de las
     * particulas, funciona para particula aislada y para todo el arreglo
     * de particulas
     */

    this.muestraTray = function () {
        
        this.trayso.forEach(function (tray) {
            visualizador.scene.remove(tray);
        });
        this.trayso = [];
        var vertices = [];//Puntos que seran unidos para generar la linea de la trayectoria
        
        let xP = 1000;//Punto en el que la particula cambiara de color su trayectoria
        // console.log(this.aislar);
        if (checkbox.checked == true) {
            for (var i = 0; i < this.trays.length; i++) {    
                
                if(this.trays.length==1){//Si la particula esta aislada
                    var geometry = new THREE.BufferGeometry();
                    
                    var colorLinea = [];
                    for (var j = 0; j < this.trays[i].length; j++) {
                        var x = this.trays[i][j].x;
                        var y = this.trays[i][j].y;
                        vertices.push( x, y, 0);
                        if(j < xP){
                            // Color de la linea: Rojo
                            colorLinea.push( 255, 0, 0 );
                        } else{
                            // Color de la linea: Blanco
                            colorLinea.push(51, 255, 85 );

                        }
                               
                    } 

                    //Pasamos las posiciones
                    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
                    // Pasamos el color
                    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colorLinea, 3 ) );

                    var material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors } );                                           
                    var tray = new THREE.Line(geometry, material);
                    visualizador.scene.add(tray);
                  

                }else{ //Si la particula no esta aislada
                    
                    var geometry = new THREE.Geometry();

                    var material = new THREE.LineBasicMaterial( {color:this.color[i]} );
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

    }

    // Metodo para pausar la simulacion
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
    
    
    /**
     * Metodo que crea un visulizador nuevo y ademas un menu cuando
     * la particula se aisla
     */
    this.aislaParticula = function (particula, nuevoVisualizador){      
        
        //Si la particula no existe en el arreglo
        if( particula >= this.particulas.length ){
            //Mensaje de error
            const mensaje = "<div id = 'mensaje'>"+
                                "<h3>Valor inválido</h3>"
                            "</div>";
            //Al presionar el boton aceptar aparecera el mensaje de error
            //y desaperecera despues de 1.5 seg.
            $('#aceptar').after(mensaje); 
            setTimeout( () => {
                $('#mensaje').remove();   
                
            },1500 );
            
            return false;
        }
        this.colorTrayectoria=[];
        //bandera=true para poder observar la visualizacion    
        nuevoVisualizador.bandera = true;

        //Se crea el menu de la particula
        var nuevoItem = "<div class='nuevo' id ='particula"+nuevoVisualizador.id+"'>"+
                            "<div class='row'>"+
                                "<button class='btn btn-block btn-info btn-titulo col-sm-8' disabled>Particula " + particula + "</button>" +
                                "<button class='btn btn-danger btn-titulo col-sm-4' id='quitar"+nuevoVisualizador.id+"'> Quitar </button>" +
                            "</div>"           
                        "</div>";        
        var btnGrafica = "<div class='btn-grafica'>" +
                            "<button  type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModalCenter' id='btngrafica"+nuevoVisualizador.id+"'> Generar grafica </button>" 
                        + "</div>";
        //Se crea el objeto en es te caso de tipo Particula
        object =  eval("new " + json.name + "(nuevoVisualizador,json)");
        //Se indica que la particula sera aislada
        object.aislar = true;
        //Guardamos el numero de la particula que ha sido aislada
        object.numeroParticula = particula;
        //Pasamos el metodo draw() el archivo JSON que contiene la informacion de la particula aislada
        object.draw(json);     
        
        // console.log('nuevoVisualizador' + nuevoVisualizador.id);
        //Agregamos el nuevo visualizador al nevagdor
        $('#visualizador'+nuevoVisualizador.id).before(nuevoItem); 
        $('#aislaParticula'+nuevoVisualizador.id).remove();//Quitamos los elementos que no deben estar en menus hijos
        $('#pos'+nuevoVisualizador.id).parent().parent().after(btnGrafica);//Boron encargado de generar la grafica de la particula
        
        //Envento click para el boton que genera la grafica
        $('#btngrafica'+nuevoVisualizador.id).click(function(){
            //Variable que guarda la estructura del modal encargado de mostrar la grafica de la particula
            var modal = "<div class='modal fade ' id='exampleModalCenter' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>" +
            "<div class='modal-dialog modal-lg' role='document'>"+
              "<div class='modal-content'>"+
                "<div class='modal-header'>"+
                  "<h5 class='modal-title' id='exampleModalLongTitle'>Particula "+particula+": Grafica de Lineas</h5>"+
                  "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                    "<span aria-hidden='true'>&times;</span>"+
                  "</button>"+
                "</div>"+
                "<div class='modal-body '>"+
                    "<canvas id='myChart"+nuevoVisualizador.id+"' width='1000' height='700'></canvas>"+                    
                "</div>"+
                "<div class='modal-footer'>"+
                  "<button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button>"+                  
                "</div>"+
              "</div>"+
            "</div>"+
          "</div>";

          //Agregamos al DOM el modal
          $('.container-fluid').append(modal);
          //Arreglos que almacenan los puntos donde toca la particula 
          let RBarrierX = [];
          let RBarrierY = [];
          let LBarrierX = [];
          let LBarrierY = [];
          for (let i= 0; i < 80; i++ ){
            var aleatorio = Math.round(Math.random()*100);
            RBarrierX.push(aleatorio*5);
            RBarrierY.push(aleatorio*2+1);
            LBarrierX.push(aleatorio+1);
            LBarrierY.push(aleatorio*3+2);
          }
        
        //Obtenemos el canvas que se ha creado en la variable modal, este canvas servira para poder pintar el modal
        let canvas = document.getElementById('myChart'+nuevoVisualizador.id).getContext('2d');
        
        //Creamos un nuevo graficador y pasamos los parametros necesarios
        new graficador(RBarrierX,RBarrierY,LBarrierX,LBarrierY, canvas);
            
            
         });

        //Con ayuda de Jquery capturamos el evento cuando el usuario desee elminar el visualizador
        //del navegador
        $('#quitar'+nuevoVisualizador.id).click(function(){
            // console.log('click');
            var respuesta = confirm("Desea eliminar el visualizador de particula #" + particula);
            //Si se recibe una respuesta
            if( respuesta ) {
                object = {};
                $('#particula'+nuevoVisualizador.id).remove();
                $('#visualizador'+nuevoVisualizador.id).remove();
            } else {//Si el usuario cancela sólo retornamos false
                return false;
            }
            
        });
    }
    
     
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
        //Si el checkbox esta marcado muestra las trayectorias
        $('#Checkpt1'+visualizador.id).change(function(){
            if($(this).is(":checked")){
                mySelf.muestraTray();
            }
        }),       
      
        $('#aceptar').click(function(e){
            
            var valor = $('#particula').val();
            //Si el input es vacio
            if( valor == ''){   
                e.preventDefault();//No mandamos nada
            } else {//En otro caso
                //Creasmo la nueva particula
                mySelf.aislaParticula(valor, new Visualizador());
                $('#particula').val('');//Limpiamos el campo para poder ingresar otra particula     
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
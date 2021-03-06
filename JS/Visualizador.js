function Visualizador() {
    var mySelf = this;
    this.scene;
    this.group;
    this.camera;
    this.renderer;
    this.controls;
    this.bandera = false;
    this.json;
    var vdate=  new Date();
    this.id= vdate.getTime();
    this.renderer = new THREE.WebGLRenderer();
    
    

    this.animate = function () {
        
        //Esta función sólo es uilizada por el diagrama Voronio        
        if (mySelf.bandera != false) {            
            mySelf.controls.update();
            mySelf.renderer.render(mySelf.scene, mySelf.camera);
            // console.log(mySelf.camera);
            requestAnimationFrame(mySelf.animate);
        }
    };

}


Visualizador.prototype.creaEscena = function (elemento) {   
    var aspect = elemento.clientWidth / elemento.clientHeight;
    
    this.renderer.setSize(elemento.clientWidth -30 , elemento.clientHeight - 20);


    //Crea la escena donde se mostrara la visualizacion
    this.scene = new THREE.Scene();
    
    // Será el color de fondo de la escena
    this.scene.background = new THREE.Color(0xD3D3D3);

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 1);
    elemento.appendChild(this.renderer.domElement);
}


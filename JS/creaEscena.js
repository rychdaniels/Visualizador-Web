function Visualizador() {
    this.scene = 0;
    this.group = 0;
    this.camera = 0;
    this.renderer = 0;
    this.controls = 0;
    this.bandera = false;
    this.json = 0;


}
Visualizador.prototype.creaEscena = function (elemento) {

    var aspect = elemento.clientWidth / elemento.clientHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(elemento.clientWidth, elemento.clientHeight - 20);


    //Crea la escena donde se mostrara la visulaizacion
    this.scene = new THREE.Scene();
    // Será el color de fondo de la escena
    this.scene.background = new THREE.Color(0xD3D3D3);

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 1);



    console.log(elemento);
    elemento.appendChild(this.renderer.domElement);
}


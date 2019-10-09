var camera, renderer, scene;
function creaEscena(elemento) {

    var aspect = elemento.clientWidth / elemento.clientHeight;

    //Crea la escena donde se mostrara la visulaizacion
    scene = new THREE.Scene();
    // Será el color de fondo de la escena
    scene.background = new THREE.Color(0xD3D3D3);

    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(elemento.clientWidth, elemento.clientHeight - 20);

    console.log(elemento);
    elemento.appendChild(renderer.domElement);
}

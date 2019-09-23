function MenuRed(){
  Visualizador.call(this);
  this.autoRotar = function(checkbox) {
    if(checkbox.checked==true){
      // auto rotate
      vsym.controls.autoRotate = true;
      vsym.controls.autoRotateSpeed = 5;
    }else{
      vsym.controls.autoRotate = false;
    }
  }
  this.setGris = function() {

  }
  this.setBlue = function() { /*SetEscalaColor*/

  }
  this.setColor = function() {

  }
}
MenuRed.prototype = new Visualizador();

/*control*/
function autoRot(checkid){
  var checkbox;
  if(checkid == 1){
    checkbox = document.getElementById("Check3");
  }else if(checkid == 2){
    checkbox = document.getElementById("Checkrp3");
  }
  objVoronoi.autoRotar(checkbox);
}

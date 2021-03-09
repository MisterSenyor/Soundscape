var canvas = document.querySelector(".canvas");

function randomBetween(min,max){
  return Math.random() * (max - min) + min;
}
function getImage(img){
  return document.getElementById(img);
}
// Keyboard and mouse stuff
document.body.onkeypress = function(e){
    if(e.keyCode == 32 && player.y >= player.begY){
      jump()
    }
}
document.querySelector(".canvas").onmousemove = function(e){
  var mouseX = parseInt(e.clientX), mouseY = parseInt(e.clientY);
  var rect = canvas.getBoundingClientRect();
  globalMouseX = mouseX - rect.left;
  globalMouseY = mouseY - rect.top;
}

var canvas = document.querySelector(".canvas");

function randomBetween(min,max){
  return Math.random() * (max - min) + min;
}
function getImage(img){
  return document.getElementById(img);
}
// Keyboard and mouse stuff
document.body.onkeypress = function(e){
    player.getKeys(e.keyCode);
}
document.querySelector(".canvas").onmousemove = function(e){
  var mouseX = parseInt(e.clientX), mouseY = parseInt(e.clientY);
  var rect = canvas.getBoundingClientRect();
  globalMouseX = mouseX - rect.left;
  globalMouseY = mouseY - rect.top;
}

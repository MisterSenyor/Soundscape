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
  var mouseX = e.x, mouseY = e.y;
  // console.log(e);
  var rect = canvas.getBoundingClientRect();
  globalMouseX = mouseX - rect.left;
  globalMouseY = mouseY - rect.top;
}
document.querySelector(".canvas").onclick = function(e){
  if(!started){
    audioa.src = "assets/music/startMusic.wav";
    audioa.load();
    audioa.play();
    audioa.volume = 0.3;
    visualizea(audioa);
    started = true;
  }else{
    console.log(e);
    for(var i = 0; i < menuTexts.length; i++){// && globalMouseX < menuTexts[i].x + menuTexts[i].width && globalMouseY > menuTexts[i].y && globalMouseY < menuTexts[i].y + menuTexts[i].size
      if(e.x > menuTexts[i].x-menuTexts[i].width/2 && e.x < menuTexts[i].x+menuTexts[i].width/2 && e.y < menuTexts[i].y && e.y > menuTexts[i].y - menuTexts[i].size){
        //menuTexts[i].isFocused = false;
          menuTexts[i].func();
      }else{
      }
    }
    globalClick = {x:e.x,y:e.y}
  }
}

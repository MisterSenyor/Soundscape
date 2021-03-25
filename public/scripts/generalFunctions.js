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
    console.log(e.keyCode);
    if(e.keyCode == 101){
      fuckUpFPS();
    }
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
    if(menuMode.mode == "intro"){
      introDisplay++;
      introNow = 0;
      resetZoom();
    }else{
      var aLength = activeTexts.length;
      console.log(aLength + " , " + activeTexts);
      for(var i = 0; i < menuTexts.length; i++){// && globalMouseX < menuTexts[i].x + menuTexts[i].width && globalMouseY > menuTexts[i].y && globalMouseY < menuTexts[i].y + menuTexts[i].size
        console.log(menuTexts[i].active);
        if(e.x > menuTexts[i].x-menuTexts[i].width/2 && e.x < menuTexts[i].x+menuTexts[i].width/2 && e.y < menuTexts[i].y && e.y > menuTexts[i].y - menuTexts[i].size){
          if(menuTexts[i].active){
            playSound("onclick.wav",0.2);
            console.log(menuTexts[i].func+", " +menuTexts[i].active);
            menuTexts[i].func();
          }
        }
      }
      for(var i = 0; i < aLength; i++){
        try{
          if(e.x > activeTexts[i].x-activeTexts[i].width/2 && e.x < activeTexts[i].x+activeTexts[i].width/2 && e.y < activeTexts[i].y && e.y > activeTexts[i].y - activeTexts[i].size){
            //menuTexts[i].isFocused = false;
            playSound("onclick.wav",0.2);
            activeTexts[i].func();
          }
        }catch(e){
          console.log(e);
        }

      }
    }
    globalClick = {x:e.x,y:e.y}
  }
}

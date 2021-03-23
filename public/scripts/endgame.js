var doneTexts = [
  new MenuText(0,0,"Back to Main",backToMain,"center",30,true,true)
]
function winGame(){
  deathSpeed = 1, frameCount = 0, drawX = 0,drawY = 0,drawDir = 1;
  // requestAnimationFrame(createEnd);
  ctx.shadowBlur = 0;
  // ctx.fillStyle = "rgba(0,0,0,0.8)";
  // ctx.fillRect(0,0,WIDTH,HEIGHT)
  // updateOverText();
  allParticleSystems = [];
  obstacles = [];
  // activeTexts = [];
  activeTexts.push(doneTexts[0])
  screenBlackAnimationWin();
  // updateWinText();
}
var colWidtha = 90, deathSpeeda = 1, frameCounta = 0, drawXa = 0,drawYa = 0,drawDira = 1;
function screenBlackAnimationWin() {
  // console.log("gg");
  var deda = requestAnimationFrame(screenBlackAnimationWin);
  frameCounta++;
  if(frameCounta % deathSpeeda == 0){
    ctx.fillStyle = "black";
    ctx.fillRect(drawXa*colWidtha,drawYa*colWidtha,colWidtha,colWidtha)
    drawXa+=drawDira;
    if(drawXa >= WIDTH/colWidtha || drawXa < 0){
      drawDira = drawDira == 1 ? -1 : 1;
      drawYa++;
      if(drawYa >= HEIGHT/colWidtha){
        cancelAnimationFrame(deda)
        updateWinText();
      }
    }
  }
}
function updateWinText(){
  ctx.shadowBlur = 10;
  ctx.fillStyle = "rgba(0,255,0,1)";
  ctx.shadowColor = "rgba(0,255,0,1)";
  ctx.textAlign = "center";
  ctx.font = "80px pixelated";
  ctx.fillText("YOU WON!", WIDTH / 2, HEIGHT / 2);
  for(var i = 1; i <= doneTexts.length; i++){
    doneTexts[i-1].x = WIDTH/2;
    doneTexts[i-1].y = HEIGHT/2 + 80 + i*60;
    doneTexts[i-1].draw();
  }
}

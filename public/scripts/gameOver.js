var isGameOver = false;

function playSounda() {
  var myAudioa = document.createElement("audio");
  myAudioa.src = "./assets/music/gameOver.mp3";
  myAudioa.play();
  // myAudioa.pause();
}
function playSound(sound) {
  var myAudioa = document.createElement("audio");
  myAudioa.src = "./assets/music/"+sound;
  myAudioa.play();
}
var retryTexts = [
  new MenuText(0,0,"Restart",restart,"center",30,true,true),
  new MenuText(0,0,"Back to Main",goToMain,"center",30,true,true)
]
function restart(){

}
function goToMain(){

}
function createEnd(){
  // requestAnimationFrame(createEnd);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0,0,WIDTH,HEIGHT)
  updateOverText();
}
function updateOverText(){
  // requestAnimationFrame(updateOverText);
  ctx.shadowBlur = 10;
  ctx.fillStyle = "rgba(0,255,0,1)";
  ctx.shadowColor = "rgba(0,255,0,1)";
  ctx.textAlign = "center";
  ctx.font = "80px pixelated";
  ctx.fillText("GAME OVER!", WIDTH / 2, HEIGHT / 2);
  for(var i = 1; i <= retryTexts.length; i++){
    retryTexts[i-1].x = WIDTH/2;
    retryTexts[i-1].y = HEIGHT/2 + 80 + i*60;
    retryTexts[i-1].draw();
  }
}

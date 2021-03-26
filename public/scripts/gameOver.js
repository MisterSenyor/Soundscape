var isGameOver = false;

lowLag.init();
function playSounda() {
  var myAudioa = document.createElement("audio");
  myAudioa.src = "./assets/music/gameOver.mp3";
  myAudioa.play();
  // myAudioa.pause();
}
function playSound(sound,volume) {
  var myAudioa = document.createElement("audio");
  myAudioa.volume = volume;
  myAudioa.src = "./assets/music/"+sound;
  myAudioa.play();
}
// var onclickSound = new Audio("./assets/music/hover.wav");
lowLag.load("./assets/music/hover.wav","hover");
function playClick() {
  lowLag.play("hover");
}
var retryTexts = [
  new MenuText(0,0,"Restart",restart,"center",30,true,true),
  new MenuText(0,0,"Back to Main",backToMain,"center",30,true,true)
]
function restart(){
  console.log("g");
  isGameOver = false;
  hearts = 3;
  score = 0;
  yoda = true;
  audio.currentTime = 0;
  delayedAudio.currentTime = secondsToGetToUser;
  delayedAudio.play();
  audio.play();
  visualize(audio);
  // getBeats(delayedAudio)
  obstacles = [];
  activeTexts = [];
}
function backToMain(){
  audioa.play();
  audioa.volume = 0.3;
  visualizea(audioa);
  started = true;
  console.log("b");
  activeTexts = [];
  menuTexts = [
    new MenuText(0,0,"START",goToStart,"center",30,true,true),
    new MenuText(0,0,"ABOUT",goToAbout,"center",30,true,true),
    new MenuText(0,0,"INSTRUCTIONS",goToInstruction,"center",20,true,true),
    new MenuText(0,0,"STORY",goToIntro,"center",20,true,true)
  ]
}
function createEnd(){
  deathSpeed = 1, frameCount = 0, drawX = 0,drawY = 0,drawDir = 1;
  // requestAnimationFrame(createEnd);
  ctx.shadowBlur = 0;
  // ctx.fillStyle = "rgba(0,0,0,0.8)";
  // ctx.fillRect(0,0,WIDTH,HEIGHT)
  // updateOverText();
  allParticleSystems = [];
  obstacles = [];
  activeTexts.push(retryTexts[0])
  activeTexts.push(retryTexts[1])
  screenBlackAnimation();
}
var colWidth = 90, deathSpeed = 1, frameCount = 0, drawX = 0,drawY = 0,drawDir = 1;
function screenBlackAnimation() {
  var ded = requestAnimationFrame(screenBlackAnimation);
  frameCount++;
  if(frameCount % deathSpeed == 0){
    ctx.fillStyle = "black";
    ctx.fillRect(drawX*colWidth,drawY*colWidth,colWidth,colWidth)
    drawX+=drawDir;
    if(drawX >= WIDTH/colWidth || drawX < 0){
      drawDir = drawDir == 1 ? -1 : 1;
      drawY++;
      if(drawY >= HEIGHT/colWidth){
        cancelAnimationFrame(ded)
        updateOverText();
      }
    }
  }
}
function updateOverText(){
  // requestAnimationFrame(updateOverText);
  ctx.shadowBlur = 10;
  ctx.fillStyle = "rgba(0,255,0,1)";
  ctx.shadowColor = "rgba(0,255,0,1)";
  ctx.textAlign = "center";
  ctx.font = "80px pixelated";
  ctx.fillText("GAME OVER!", WIDTH / 2, HEIGHT / 2);
  ctx.font = "30px pixelated";
  ctx.fillText("You Scored: " + score + " Points", WIDTH/2, HEIGHT/2 + 80)
  for(var i = 1; i <= retryTexts.length; i++){
    retryTexts[i-1].x = WIDTH/2;
    retryTexts[i-1].y = HEIGHT/2 + 100 + i*60;
    retryTexts[i-1].draw();
  }
}

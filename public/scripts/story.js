var counterX = 1, counterY = 1;

function drawIntro(imgName) {
    ctx.drawImage(getImage(imgName),0 - counterX, 0 - counterY, WIDTH * counterX, HEIGHT * counterY);
    counterX += 0.0001;
    counterY += 0.0001;
}
function resetZoom() {
  counterX = 1;
  counterY = 1;
}
var storyAudio = document.querySelector(".storyAudio");
function startStoryMusic() {
  storyAudio.currentTime = 0;
  storyAudio.volume = 0.3;
  storyAudio.play()
}
function stopStoryMusic(){
  storyAudio.pause();
}

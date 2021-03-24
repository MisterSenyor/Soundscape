var counterX = 1, counterY = 1;

function drawIntro(imgName) {
    ctx.drawImage(getImage(imgName),0 - counterX, 0 - counterY, WIDTH * counterX, HEIGHT * counterY);
    counterX += 0.0001;
    counterY += 0.0001;
}
var mainGameLoop;
var ctx = canvas.getContext("2d");
var started = false;

var gameName = "Name";

//setBackground
function mainScreen(){
  // ctx.fillStyle = "#0f0f0f";
  // ctx.fillRect(0,0,WIDTH,HEIGHT)

  //draw game name
  ctx.fillStyle = "white"
  ctx.font = HEIGHT/5+"px Roboto";
  var nameWidth = ctx.measureText(gameName);
  ctx.fillText(gameName,WIDTH/2-nameWidth.width/2,HEIGHT/20 + HEIGHT/6)

  //draw menu
  makeMenu(300,HEIGHT/2.5, ["Start","About","instructions"],WIDTH/2-300/2,HEIGHT/3,20)
}
mainScreen();
function makeMenu(width,height,words,x,y,padding){
  ctx.fillStyle = "rgba(0,0,0,0.8)"
  roundRect(ctx,x,y,width,height,25);
  ctx.font = "40px Roboto";
  // console.log(y);
  for(var i = 0; i < words.length; i++){
    ctx.fillStyle = "white";
    ctx.fillText(words[i],WIDTH/2-ctx.measureText(words[i]).width/2,y+padding*1.5+i*(height-padding)/words.length+30)
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  radius = {tl: radius, tr: radius, br: radius, bl: radius};
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

function startWholeGame(){
  var audioa = document.querySelector(".audioStart")
  if(!started){
    audioa.src = "assets/music/startMusic.wav";
    audioa.load();
    audioa.play();
    audioa.volume = 0.3;
    visualizea(audioa);
    started = true;
  }

}
var smootha = 0.9;
function visualizea(source) {
    var context = new AudioContext();
    var srca = context.createMediaElementSource(source);
    var analysera = context.createAnalyser();
    var listen = context.createGain();

    srca.connect(listen);
    listen.connect(analysera);
    analysera.connect(context.destination);
    analysera.fftSize = 2 ** 12;
    var frequencyBins = analysera.fftSize / 2;

    // length of data inside array
    var bufferLength = analysera.frequencyBinCount;
    var dataArrayb = new Uint8Array(bufferLength);
    renderFrame();
    function renderFrame() {
        // mandatory shit to set everything up
        mainGameLoop = requestAnimationFrame(renderFrame);
        analysera.smoothingTimeConstant = smootha;
        // TODO - recognize the volume before pplaying. DUCK YOU FUTURE US!
        listen.gain.setValueAtTime(1, context.currentTime);
        analysera.getByteFrequencyData(dataArrayb);
        allFreqs.push(dataArray);
        // vars
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var scale = bufferLength/WIDTH;
        var sectorLength = 0;
        var avgTimes = 0;
        currentAverage = 0;
        currentAverage/=avgTimes;
        // drawing each sector individually
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#0f0f0f";
        for (var i = 0; i < bufferLength; i++) {
            if (dataArrayb[i] != 0) {
                allHeights += dataArrayb[i];
                sectorLength++;
                currentAverage+=dataArrayb[i]
                avgTimes++;
            }

            if (i % (dataArrayb.length / times) == 0) {
                sectorVols.push(sectorLength == 0 ? 0 : (allHeights / sectorLength)*2);
                allHeights = 0, sectorLength = 0;
            }
        }
        for (var i = 0; i < sectorVols.length; i++) {
            // fill color
            // for(var i = 0)
            var floorY = player.begY+40;
            var heightOfBar = 0;
            for(var j = 0; j < sectorVols[i]; j++){
              heightOfBar++;
              //171-300
              if(j%5 == 0 || j == sectorVols[i]){
                var fillColor = j > 131 ? 131 : j;
                var fills = "hsla("+(171+fillColor)+",69%, 65%,1)";
                ctx.shadowColor = fills;
                ctx.fillStyle = fills;
                ctx.shadowColor = fills;
                ctx.fillStyle = fills;
                // filling the rect in the specific location
                ctx.fillRect(i * (WIDTH / (times - times / 4)), // x relative to i'th sector
                HEIGHT - j - j*2, // total y minus the height
                WIDTH / (times - times / 4), // width according to sector scale
                -(heightOfBar)); // height
                heightOfBar = 0;
              }
            }
        }
        mainScreen();
      sectorVols = [];
    }
}

var ctx = canvas.getContext("2d");
var started = false;
var audioa = document.querySelector(".audioStart")
var globalClick = {x:0,y:0};
var menuMode = {width:300,height:HEIGHT/2.5};

var gameName = "Name";
var srca;
//setBackground
var menuTexts = [
  new MenuText(0,0,"Start",goToStart,"center",40,true,true),
  new MenuText(0,0,"About",goToAbout,"center",40,true,true),
  new MenuText(0,0,"Instructions",goToInstruction,"center",40,true,true)
]
// var
function mainScreen(){
  // ctx.fillStyle = "#0f0f0f";
  // ctx.fillRect(0,0,WIDTH,HEIGHT)

  //draw game name
  ctx.fillStyle = "white"
  ctx.font = HEIGHT/5+"px Roboto";
  var nameWidth = ctx.measureText(gameName);
  ctx.fillText(gameName,WIDTH/2-nameWidth.width/2,HEIGHT/20 + HEIGHT/6)

  //draw menu
  makeMenu(menuMode.width,menuMode.height, menuTexts,WIDTH/2-menuMode.width/2,HEIGHT/3,20)
}
mainScreen();
var mainGameLoop;
function makeMenu(width,height,words,x,y,padding){
  ctx.fillStyle = "rgba(0,0,0,0.8)"
  roundRect(ctx,x,y,width,height,25);
  ctx.font = "40px Roboto";
  // console.log(y);
  for(var i = 0; i < words.length; i++){
    var currX = WIDTH/2;
    var currY = y+padding*1.5+i*(height-padding)/words.length+30;
    ctx.fillStyle = "white";
    words[i].x = currX;
    words[i].y = currY;
    words[i].draw();
  }
}
function grogu(){
  alert("grogu")
}
function goToStart(){
  menuMode.width = 700;
  startGame();
  cancelAnimationFrame(mainGameLoop)
  audioa.pause();
}
function goToAbout(){
  menuMode.width = 700;
}
function goToInstruction(){
  menuMode.width = 700;
  for(var i = 0; i < menuTexts.length; i++){
    menuTexts[i].active = false;
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

}

function MenuText(x,y,text,func,align,size,active,isFocusable){
  this.x = x,
  this.y = y,
  this.text = text,
  this.func = func,
  this.align = align,
  this.size = size,
  this.active = active,
  this.isFocused = false,
  this.isFocusable = isFocusable,
  this.draw = function(){
    ctx.font = this.size + "px Roboto";
    this.width = (ctx.measureText(this.text).width)
    if(this.active){
      if(!this.isFocused && this.isFocusable){
        this.focus();
      }else{
        this.write();
      }
    }
  },
  this.write = function(){
    ctx.fillStyle = this.size + "px Roboto"
    ctx.shadowBlur = 0;
    if(align == "center"){
      ctx.textAlign = "center";
      ctx.fillText(this.text,this.x,this.y);
      ctx.textAlign = "start";
    }
  },
  this.focus = function(){
    ctx.fillStyle = this.size + "px Roboto"
    ctx.shadowColor = "rgb(0,255,255)";
    ctx.shadowBlur = 15;
    if(align == "center"){
      ctx.textAlign = "center";
      ctx.fillText(this.text,this.x,this.y);
      ctx.textAlign = "start";
    }
    ctx.shadowBlur = 0;
  }
}

var smootha = 0.9;
function visualizea(source) {
    var context = new AudioContext();
    // var synthDelay = context.createDelay(5.0);
    srca = context.createMediaElementSource(source);

    var delay = context.createDelay(5.0);
    delay.delayTime.value = 1.0;

    var analysera = context.createAnalyser();
    var listen = context.createGain();

    // delay.connect(listen)
    // listen.connect(delay)
    // srca.connect(delay)
    // analysera.connect(delay);
    srca.connect(listen);
    console.log(context.destination);
    // srca.connect(delay)

    // delay.connect(listen)
    listen.connect(analysera);

    // delay.connect(listen)
    // listen.connect(delay)
    analysera.connect(context.destination);
    analysera.fftSize = 2 ** 12;
    var frequencyBins = analysera.fftSize / 2;

    // length of data inside array
    var bufferLength = analysera.frequencyBinCount;
    var dataArrayb = new Uint8Array(bufferLength);
    renderFramea();
    function renderFramea() {
        // mandatory shit to set everything up
        mainGameLoop = requestAnimationFrame(renderFramea);
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
        for(var i = 0; i < menuTexts.length; i++){
          if(globalMouseX > menuTexts[i].x-menuTexts[i].width/2 && globalMouseX < menuTexts[i].x+menuTexts[i].width/2 && globalMouseY < menuTexts[i].y && globalMouseY > menuTexts[i].y - menuTexts[i].size){
            menuTexts[i].isFocused = false;
          }else{
            menuTexts[i].isFocused = true;
          }
        }
        mainScreen();
      sectorVols = [];
    }
}

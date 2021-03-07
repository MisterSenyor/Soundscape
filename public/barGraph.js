// BORING MANDATORY STUFF
var audio = document.querySelector(".audio");
var canvas = document.querySelector(".canvas");
var WIDTH = (canvas.width = window.innerWidth);
var HEIGHT = (canvas.height = window.innerHeight);

var ctx = canvas.getContext("2d");

var fbtn = document.querySelector(".file");
fbtn.addEventListener("click", function () {
    var file = document.createElement("input");
    file.type = "file";
    file.accept = "audio/*";
    file.click();
    file.onchange = function () {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        audio.volume = 0.3;
        visualize(audio);
    };
});

// BORING VARS
var src;
var analyser;
var smooth = 0.9;
var dataArray;
var dataArraya;
var sectorVols = [];
var allFreqs = [];
var animationX = WIDTH, circleWidth = 200, animationSpeed = 2,animationIttrCount = 0;
// Particle vars
var amount = 150, lifetime = 200, particles = [],particle, spawnParticle = 0, toDrawParticles = true;
// change this to decide how many sectors there are
var times = 32;
var realTimes = times-times/4;
// beat recognition vars
var avg = 0, sum = 0, cmprsScale = 1, gsectorLength = 0, avgCounter = 0, currentAverage = 0,sensitivity = 0.8;
// rocks on route vars
var rocks = [], toGenerateRock = 0;
// Physics vars
var gravity = -9.8;
// setInterval(function(){

// },10)
var temp = 1;
function visualize(source) {
    var context = new AudioContext();
    src = context.createMediaElementSource(source);
    analyser = context.createAnalyser();
    var listen = context.createGain();
    // audio.playbackRate = 10;

    src.connect(listen);
    listen.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 2 ** 12;
    var frequencyBins = analyser.fftSize / 2;

    // length of data inside array
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    renderFrame();
    function renderFrame() {
        // mandatory shit to set everything up
        requestAnimationFrame(renderFrame);
        analyser.smoothingTimeConstant = smooth;
        // TODO - recognize the volume before pplaying. DUCK YOU FUTURE US!
        listen.gain.setValueAtTime(temp, context.currentTime);
        analyser.getByteFrequencyData(dataArray);
        allFreqs.push(dataArray);
        // vars
        var WIDTH = (canvas.width = window.innerWidth);
        var HEIGHT = (canvas.height = window.innerHeight);
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var scale = bufferLength/WIDTH;
        var allHeights = 0;
        var sectorLength = 0;
        var avgTimes = 0;
        currentAverage = 0;
        // getting all the values into sectorVols so it contains the avg height for each sector
        for (var i = 0; i < bufferLength; i++) {
            // incrementing allHeights to count the sum of all heights in each sector
            if (dataArray[i] != 0) {
                allHeights += dataArray[i];
                sectorLength++;
                currentAverage+=dataArray[i]
                avgTimes++;
            }

            if (i % (dataArray.length / times) == 0) {
                // if i has reached the end of the sector, it pushes the average sector height into allHeights
                sectorVols.push(sectorLength == 0 ? 0 : allHeights / sectorLength);
                // resetting allHeights
                allHeights = 0, sectorLength = 0;
            }
        }
        currentAverage/=avgTimes;
        // drawing each sector individually
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        animationIttrCount++;
        if(animationIttrCount%animationSpeed == 0){
          animationX--;
          if(animationX <= WIDTH - circleWidth-circleWidth/2){
            animationX = WIDTH+circleWidth/2;
          }
        }
        generateBackground()
        for (var i = 0; i < sectorVols.length; i++) {
            // fill color
            // for(var i = 0)
            var floorY = player.begY+40;
            var heightOfBar = 0;
            for(var j = 0; j < sectorVols[i]; j++){
              heightOfBar++;
              if(j%5 == 0 || j == sectorVols[i]){
                var fillColor = j*2 > 255 ? 255 : j*2;
                ctx.shadowColor = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,.5)";
                ctx.fillStyle = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,.5)";
                // filling the rect in the specific location
                ctx.fillRect(i * (WIDTH / realTimes), // x relative to i'th sector
                floorY - j - j*2, // total y minus the height
                WIDTH / realTimes, // width according to sector scale
                -heightOfBar); // height
                heightOfBar = 0;
              }
            }
        }
        refreshPlayer();
        //if(toDrawParticles){
          spreadParticles();
        //}

        // global avg and su vals
        getSpikeReference();
        generatePlayArea();
        function getSpikeReference() {
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i] != 0) {
                    sum += dataArray[i] / cmprsScale;
                    gsectorLength++;
                }
            }
            avg = sum / gsectorLength;
            avgCounter++;
            if (avgCounter > 200) {
                gsectorLength = 0;
                sum = 0;
                avgCounter = 0;
                //console.log("reset");
            }
            var sectorSum = 0
            for (var i = 0; i < sectorVols.length / 2; i++) {
                sectorSum += sectorVols[i];
            }
            if ((sectorSum * sensitivity) / (sectorVols.length / 2) > avg) {
                //console.log("beat");
            }
            sectorSum = 0;
            for (var i = sectorVols.length / 2; i < sectorVols.length; i++) {
                sectorSum += sectorVols[i];
            }
            if ((sectorSum * sensitivity) / (sectorVols.length / 2) > avg) {
                //console.log("beat");
            }
            sectorSum = 0;
        }
        sectorVols = [];

    }

}
function generateBackground(){
  for(var i = 0; i < (WIDTH/circleWidth)+10; i++){
    for(var j = 0; j < HEIGHT/circleWidth; j++){
      var coors = {x:animationX - i*circleWidth+20+circleWidth/3+circleWidth,y:j*circleWidth+20+circleWidth/3};
      var cHeight = circleWidth;
      ctx.beginPath();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,0,0,1)";
      var avgClr = Math.pow(currentAverage/30,3);
      var color = ((165-avgClr < 0) ? 0 : 165-avgClr);
      ctx.strokeStyle = "rgba(200,"+color+","+color/2+",1)";
      ctx.lineWidth = 10;
      ctx.arc(coors.x,coors.y , circleWidth/2-10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();

      ctx.lineWidth = currentAverage/10;
      ctx.strokeStyle = "rgba(0,255,255,1)";
      ctx.shadowColor = "rgba(0,255,255,1)";
      var size = currentAverage + currentAverage/2;
      ctx.beginPath();
      ctx.moveTo(coors.x,coors.y-size/4-10);
      ctx.lineTo(coors.x-size/4,coors.y+size/4-10);
      ctx.lineTo(coors.x+size/4,coors.y+size/4-10);
      ctx.lineTo(coors.x,coors.y-size/4-10)
      ctx.lineTo(coors.x-size/4,coors.y+size/4-10);
      ctx.stroke();
      ctx.closePath();
    }
  }

}
function Player(x,y,acceleration,color,size){
  this.x = x,
  this.y = y,
  this.begY = y,
  this.acceleration = acceleration,
  this.color = color,
  this.size = size,
  this.speedY = 0,
  this.gravity = 0.05;
  this.gravitySpeed = 0,
  this.airtime = 0,
  this.draw = function(){
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
  },
  this.updatePos = function(){
    // this.y = this.begY + .5*gravity*Math.pow(this.airtime,2);
    this.gravitySpeed += this.gravity;
    this.y -= (this.speedY + this.gravitySpeed);
    this.hitBottom();
  },
  this.hitBottom = function(){
    if(this.y >= this.begY){
      this.y = this.begY;
      this.gravitySpeed = 0;
      toDrawParticles = true;
      // console.log(toDrawParticles);
    }else{
      toDrawParticles = false;
    }
  }
}
var isJumping = false;
var player = new Player(WIDTH/7,HEIGHT-200-30,0,"#39ff14",30);
function refreshPlayer(){
  if(!isJumping){
    player.gravity = -0.1;
  }
  player.updatePos()
  player.draw();
}
function jump(){
  player.gravity = 0.5
  isJumping = true;
  setTimeout(function(){
    isJumping = false;
  },70);
}
document.body.onkeypress = function(e){
    if(e.keyCode == 32 && player.y >= player.begY){
      jump()
    }
}
function Rock(x,y,number,size){
  this.size = size,
  this.x = x,
  this.y = y,
  this.number = number,
  this.size = size,
  this.drawRock = function(){
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.beginPath();
    if(this.number == 1){
      ctx.arc(this.x,this.y,this.size,0,2*Math.PI)
    }else if(this.number == 2){
      ctx.arc(this.x-this.size/2,this.y,this.size,0,2*Math.PI)
      ctx.arc(this.x+this.size/2,this.y,this.size,0,2*Math.PI)
    }else{
      ctx.beginPath();
      ctx.arc(this.x,this.y-this.size/2,this.size,0,2*Math.PI)
      ctx.arc(this.x-this.size/2,this.y,this.size,0,2*Math.PI)
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(this.x+this.size/2,this.y,this.size,0,2*Math.PI)
      // ctx.arc(this.x+this.size/2,this.y,this.size,0,2*Math.PI)
    }
    ctx.fill();
    ctx.closePath();
  },
  this.updateRockPos = function(){
    this.x-=3;
  }
}
var generateRockFrqs = Math.floor(randomBetween(150,300));
function generatePlayArea(){
  toGenerateRock++;
  if(toGenerateRock%generateRockFrqs == 0){
    rocks.push(new Rock(WIDTH,HEIGHT-200,Math.floor(randomBetween(1,3)),10))
    generateRockFrqs = Math.floor(randomBetween(150,300));
  }
  for(var i = 0; i < rocks.length; i++){
    rocks[i].updateRockPos();
    rocks[i].drawRock();
  }
  ctx.fillStyle = "white";
  ctx.shadowColor = "white";
  ctx.fillRect(0, HEIGHT-200, WIDTH,10)
  ctx.fillStyle = "black";
  ctx.shadowColor = "black";
  ctx.fillRect(0, HEIGHT-190, WIDTH,200)
}
function Particle(size,colora,x,y,angle,speed,index,cycle,visible){
  this.size = size,
  this.colora = colora,
  this.x = x,
  this.y = y,
  this.angle = angle,
  this.speed = speed,
  this.index = index,
  this.visible = visible,
  this.cycle = cycle,
  this.draw = function(){
    if(visible){
      ctx.fillStyle = this.colora;
      ctx.shadowColor = this.colora;
    }else{
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.shadowColor = "rgba(0,0,0,0)";
    }
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
  },
  this.updatePos = function(){
    this.x-= this.speed*Math.sin(this.angle * Math.PI / 180);
    this.y-= this.speed*Math.cos(this.angle * Math.PI / 180);
    this.angle+=0.4;
    if(visible){
      ctx.fillStyle = this.colora;
      ctx.shadowColor = this.colora;
    }else{
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.shadowColor = "rgba(0,0,0,0)";
    }
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    this.cycle++;
    if(this.cycle == lifetime){
      // particles.splice(this.index,1);
      particles[this.index] = "";
    }
  }
}
function spreadParticles(){
  var partX = WIDTH/7-10;
  var partY = HEIGHT-200;
  //if(toDrawParticles){
    if(particles.length < 150){
      if(spawnParticle == 10){
        particle = new Particle(randomBetween(2,5),"hsl(20,100%,"+Math.floor(randomBetween(30,71))+"%)",partX,partY,Math.floor(randomBetween(40,80)),1.2,particles.length,0,toDrawParticles)
        particle.draw();
        particles.push(particle);
        spawnParticle = 0;
      }else{
        spawnParticle++;
      }
    }else{

    }
  //}
  for(var i = 0; i < particles.length; i++){
    if(particles[i] != ""){
      particles[i].updatePos();
    }else{
      if(spawnParticle == 10){
        particle = new Particle(randomBetween(2,5),"hsl(20,100%,"+Math.floor(randomBetween(30,71))+"%)",partX,partY,Math.floor(randomBetween(40,80)),1.2,i,0,toDrawParticles)
        particle.draw();
        particles[i] = particle;
        spawnParticle = 0;
      }else{
      // spawnParticle++;
      }
    }
  }
}
function randomBetween(min,max){
  return Math.random() * (max - min) + min;
}

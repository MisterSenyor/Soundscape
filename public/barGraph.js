// BORING MANDATORY STUFF
var audio = document.querySelector(".audio");
var canvas = document.querySelector(".canvas");
var WIDTH = (canvas.width = window.innerWidth);
var HEIGHT = (canvas.height = window.innerHeight);
var offsetX=canvas.offsetLeft;
var offsetY=canvas.offsetTop;

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
var avg = 0, sum = 0, cmprsScale = 1, gsectorLength = 0, avgCounter = 0, currentAverage = 0,sensitivity = 0.3, beat = false, frameCounter = 0, frameCountMax = 4;
var frameAvgs = [];
// beat recognition (delta) vars
var prevSectorVols = [], avgDelta = [], spikeDistance = 0;
// rocks on route vars
var rocks = [], toGenerateRock = 0;
// Physics vars
var gravity = -9.8;
// Mouse move vars
var globalMouseX = 0, globalMouseY = 0;
// Score
var score = 0;
// Explosions
var explosions = [];
//Global particle system
var allParticleSystems = [];
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
        for(var i = 0; i < diamonds.length; i++){//e.x > diamonds[i].x  && e.x < diamonds[i].x + 25
          if(diamonds[i] != "empty"){
            // console.log(globalMouseY > diamonds[i].y-25  && globalMouseY < diamonds[i].y + 50 && globalMouseX-25 > diamonds[i].x  && globalMouseX < diamonds[i].x + 50);
            if(globalMouseX > diamonds[i].x-25  && globalMouseX < diamonds[i].x + 50 && globalMouseY < diamonds[i].y-60+diamonds[i].height && globalMouseY > diamonds[i].y-70 - diamonds[i].height){// && globalMouseY > diamonds[i].y-70
              console.log("hover");
              score++;
              diamonds[i] = "empty";
            }
          }
        }
        generateBackground();
        generatePlayArea();
        refreshPlayer();
        // spreadParticles();
        generateDiamonds();
        updateScore();
        updateAllParticles();

        // global avg and su vals
        getSpikeReference();
        function getSpikeReference() {
          // TODO - make the sensitivity alter itself dynamically by the amount of beats recognized per TimeFrame
          sectorSum = 0;
          if (prevSectorVols.length > 0) {
              for (var i = 0; i < sectorVols.length; i++) {
                  sectorSum += sectorVols[i] - prevSectorVols[i];
              }

              avgDelta.push(sectorSum / sectorVols.length);

              if (avgDelta.length > 100) {
                  avgDelta.shift();
              }

              spikeDistance++;

              for (var i = 0; i < sectorVols.length; i++){
                  if ((sectorVols[i] - prevSectorVols[i]) * sensitivity > median(avgDelta) && spikeDistance > frameCountMax) {
                    createExplosion(WIDTH / 2, HEIGHT / 2);
                    console.log("beat")
                    spikeDistance = 0;
                  }
              }
          }

      }
      prevSectorVols = sectorVols;
      sectorVols = [];

    }

}
var diamonds = [];
var diamondColors = ["#8b32a8","#28ad64","#c8de4e","#d61313","#54ffeb","#2b88c2"];
var spawnDiamondsIn = 0;
function generateDiamonds(){
  spawnDiamondsIn++;
  var currGem = Math.floor(randomBetween(1,7));
  if(spawnDiamondsIn%100 == 0){
    if(diamonds.includes("empty")){
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.indexOf("empty"),25,25)
      diamonds[diamonds.indexOf("empty")]=gem;
    }else{
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.length,25,25)
      diamonds.push(gem);
    }
  }
  for(var j = 0; j < diamonds.length; j++){
    if(diamonds[j] != "empty"){
      diamonds[j].updatePos();
    }
  }
}
function createExplosion(x,y){
  var explosionSystem = new ParticleSystem(x,y,7,100,0,360,5,2,3,false,-7,10,true);
  allParticleSystems.push(explosionSystem)
}
function ParticleSystem(x,y,numberOfParticles,lifetime,beginAngle,finAngle,size,sizeRandomness,speed,gravity,frequency,stopAfter,fade,enabled){
  this.x = x,
  this.y = y,
  this.numberOfParticles = numberOfParticles,
  this.lifetime = lifetime,
  this.beginAngle = beginAngle,
  this.finAngle = finAngle,
  this.size = size,
  this.sizeRandomness = sizeRandomness,
  this.speed = speed,
  this.spawnParticle = 0,
  this.framesRan = 0,
  this.particles = [],
  this.frequency = frequency,
  this.stopAfter = stopAfter,
  this.opacity = 100,
  this.finished = false,
  this.enabled = true,
  this.gravity = gravity,
  this.fade = fade,
  this.addParticle = function(){
    if(this.enabled){
      if(!this.finished){
        for(var j = 0; j < (this.frequency > 0 ? 1 : Math.abs(this.frequency)); j++){
          if(this.spawnParticle == this.frequency || this.frequency < 0){
            var newParticle = new Particle(randomBetween(size-sizeRandomness,size+sizeRandomness),
            "hsla(20,100%,"+Math.floor(randomBetween(30,71))+"%,grogu)",
            this.x,
            this.y,
            Math.floor(randomBetween(this.beginAngle,this.finAngle)),
            this.speed,
            this.particles.length < this.numberOfParticles ? this.particles.length : this.particles.indexOf("empty"),
            0,
            true,
            this.gravity,
            this.lifetime,
            this)
            if(this.particles.length < numberOfParticles){
              this.particles.push(newParticle)
            }else{
              this.particles[this.particles.indexOf("empty")] = newParticle;
            }
            this.spawnParticle = 0;
          }
        }
        this.spawnParticle++;
      }
    }
  },
  this.drawParticles = function(){
    this.framesRan++;
    if(this.stopAfter == this.framesRan){
      this.finished = true;
    }
    for(var i = 0; i < this.particles.length; i++){
      if(this.particles[i] != "empty"){
        this.particles[i].updatePos();
      }
    }
  }
}
//Create player particles
var partX = WIDTH/7-10;
var partY = HEIGHT-200;
var playerParticles = new ParticleSystem(partX,partY,250,200,50,80,4,1,2,true,2,-1,false);
allParticleSystems.push(playerParticles)
function updateAllParticles(){
  for(var i = 0; i < allParticleSystems.length; i++){
    if(allParticleSystems[i] != "empty"){
      allParticleSystems[i].addParticle();
      allParticleSystems[i].drawParticles();
      for(var j = 0; j < allParticleSystems[i].particles.length; j++){
        if(allParticleSystems[i].particles[0] != "empty"){
          if(allParticleSystems[i].particles[0].opacity < 0.001){
            allParticleSystems[i] = "empty";
          }
          break;
        }
      }
    }
  }
}
document.querySelector(".canvas").onmousemove = function(e){
  var mouseX = parseInt(e.clientX), mouseY = parseInt(e.clientY);
  var rect = canvas.getBoundingClientRect();
  globalMouseX = mouseX - rect.left;
  globalMouseY = mouseY - rect.top;
}
function Gem(color,image,x,y,index,width,height){
  this.color = color,
  this.image = image,
  this.x = x,
  this.y = y,
  this.index = index,
  this.width = width,
  this.height = height,
  this.drawGem = function(){
    ctx.shadowColor = diamondColors[this.color];
    // ctx.fillRect(this.x-50,this.y,100,2);
    ctx.drawImage(getImage("gem" + this.image),this.x,this.y,this.width,this.height);
    // e.y > diamonds[i].y-25  && e.y < diamonds[i].y + 50 && e.x-25 > diamonds[i].x  && e.x < diamonds[i].x + 50
  },
  this.updatePos = function(){
    this.x-=2;
    this.drawGem();
    if(this.x+2*this.width < 0){
      diamonds[this.index] = "empty";
    }
  },
  this.kill = function(){
    diamonds[this.index] = "empty";
  }
}
var txtWidth;
function updateScore(){
  ctx.font = "30px numerals";
  var txt = "Score: " + score;
  var minus = 50;
  txtWidth = ctx.measureText(txt).width
  ctx.drawImage(getImage("tChest"),WIDTH-txtWidth-60-minus,20,50,50);
  ctx.fillStyle = "black";
  ctx.fillRect(WIDTH-txtWidth-minus,20,txtWidth+20,50)
  ctx.fillStyle = "green";
  ctx.shadowColor = "#00ff1a";
  ctx.fillText(txt,WIDTH-txtWidth-minus+10,55);
}
function getImage(img){
  return document.getElementById(img);
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
      playerParticles.enabled = true;
      // console.log(toDrawParticles);
    }else{
      toDrawParticles = false;
      playerParticles.enabled = false;
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
var avvg;
function Rock(x,y,size){
  this.size = size,
  this.x = x,
  this.y = y,
  this.color="red",
  this.size = size,
  this.drawRock = function(){
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y+10,this.size,0,2*Math.PI)
    ctx.fill();
    ctx.closePath();
  },
  this.updateRockPos = function(){
    avvg = Math.floor(currentAverage);
    // console.log(avvg + " | " + ((avvg/10)**4));
    this.color = "rgba(255,0,0,"+(1 - (50/currentAverage)**2 < 0.2 ? 0.2 : 1 - (50/currentAverage)**2)+")"
    this.x-=2;
  }
}
function generatePlayArea(){
  ctx.fillStyle = "white";
  ctx.shadowColor = "white";
  ctx.fillRect(0, HEIGHT-200, WIDTH,20)
  ctx.fillStyle = "black";
  ctx.shadowColor = "black";
  ctx.fillRect(0, HEIGHT-180, WIDTH,200)
  toGenerateRock++;
  if(toGenerateRock%50 == 0){
    rocks.push(new Rock(WIDTH,HEIGHT-200,7))
  }
  for(var i = 0; i < rocks.length; i++){
    rocks[i].updateRockPos();
    rocks[i].drawRock();
  }
}
function Particle(size,colora,x,y,angle,speed,index,cycle,visible,gravity,fade,system){
  this.size = size,
  this.colora = colora,
  this.x = x,
  this.y = y,
  this.angle = angle,
  this.speed = speed,
  this.index = index,
  this.visible = visible,
  this.gravity = gravity,
  this.cycle = cycle,
  this.fade = fade,
  this.system = system,
  this.opacity = 100,
  this.updatePos = function(){
    if(this.fade > 0){
      this.opacity = 1-this.cycle/this.fade;
    }
    this.x-= this.speed*Math.sin(this.angle * Math.PI / 180);
    this.y-= this.speed*Math.cos(this.angle * Math.PI / 180);
    if(this.gravity){
      this.angle+=0.4;
    }
    if(visible){
      ctx.fillStyle = this.colora.replace("grogu",this.opacity);
      ctx.shadowColor = this.colora.replace("grogu",this.opacity);
    }else{
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.shadowColor = "rgba(0,0,0,0)";
    }
    // console.log(this.colora.replace("grogu",this.opacity));
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    this.cycle++;
    if(this.cycle == lifetime){
      // particles.splice(this.index,1);
      (this.system).particles[this.index] = "empty";
    }
  }
}

function randomBetween(min,max){
  return Math.random() * (max - min) + min;
}
function average(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return arr.length == 0 ? 0 : sum / arr.length;
}
function median(arr) {
    arr = arr.sort(function(a, b){return a - b});

    if (arr.length == 0) {
        return 0;
    }
    else if (arr.length % 2 != 0) {
        return arr[Math.floor(arr.length / 2)];
    }
    else {
        return (arr[Math.floor(arr.length / 2)] + arr[Math.floor(arr.length / 2) + 1]) / 2;
    }
}
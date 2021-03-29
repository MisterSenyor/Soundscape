// BORING MANDATORY STUFF
var audio = document.querySelector(".audio");
var delayedAudio = document.querySelector(".delayedAudio");
var offsetX=canvas.offsetLeft;
var offsetY=canvas.offsetTop;
var WIDTH = (canvas.width = window.innerWidth);
var HEIGHT = (canvas.height = window.innerHeight);
var context;


// BORING VARS (basic setup)
var src, analyser, smooth = 0.9, dataArray, dataArraya, sectorVols = [], allFreqs = [];
var animationX = WIDTH, circleWidth = 200, animationSpeed = 2,animationIttrCount = 0;
// Particle vars
var amount = 150, lifetime = 200, particles = [],particle, spawnParticle = 0, toDrawParticles = true, allParticleSystems = [];
// change this to decide how many sectors there are
var times = 32;
// beat recognition vars
var sensitivity = 0.35, frameCountMax = 4, frameAvgs = [], prevSectorVols = [], avgDelta = [], spikeDistance = 0, beatCounter = 0, lastFrame = false;
// rocks on route vars
var rocks = [], toGenerateRock = 0;
// Physics vars
var gravity = -9.8;
// Mouse move vars
var globalMouseX = 0, globalMouseY = 0;
// Score
var score = 0, secondCounter = 0;
// Explosions
var explosions = [];
// Diamonds
var diamonds = [], diamondColors = ["#8b32a8","#28ad64","#c8de4e","#d61313","#54ffeb","#2b88c2"], spawnDiamondsIn = 0;
//Create player particles
var partX = WIDTH/7-10, partY = HEIGHT-200;
var playerParticles = new ParticleSystem(partX,partY,20,100,50,80,5,1,2,true,5,-1,false,true),
player = new Player(WIDTH/7,HEIGHT-200-30,"#39ff14",80);
allParticleSystems.push(playerParticles)
//Global thingies
var globalGameSpeed = 2;
//FPS calculate
var dinamicFPS = 80;
var fps = 0,lastTime = 0,showFps = 0, distanceToMove = WIDTH-WIDTH/7;
var secondsToGetToUser = 2, distanceTraveledFromBeat = 0;
//Hearts
var hearts = 3;
var yoda = true;

function startGame(filea = null){
  console.log(filea);
  if(filea == null){
    var file = document.createElement("input");
    file.type = "file";
    file.accept = "audio/*";
    file.click();
    file.onchange = function () {
      demAud.pause();
      isGameOver = false;
      hearts = 3;
      score = 0;
      yoda = true;
      cancelAnimationFrame(mainGameLoop)
      audioa.pause();
      var files = this.files;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.volume = 0.3;
      delayedAudio.src = URL.createObjectURL(files[0])
      delayedAudio.load();
      delayedAudio.volume = 0.3;
      delayedAudio.play();
      delayedAudio.currentTime = secondsToGetToUser;
      audio.play();
      document.querySelector(".musicSelect").style.display = "none";
      visualize(audio);
      getBeats(delayedAudio)
      menuTexts = []
    };
    hideMute();
  }else{
    hideMute();
    demAud.pause();
    isGameOver = false;
    hearts = 3;
    score = 0;
    yoda = true;
    cancelAnimationFrame(mainGameLoop)
    audioa.pause();
    var musicFile = "assets/music/ourMusic/"+filea;
    audio.src = musicFile;
    audio.load();
    audio.volume = 0.3;
    delayedAudio.src = musicFile;
    delayedAudio.load();
    delayedAudio.volume = 0.3;
    delayedAudio.play();
    delayedAudio.currentTime = secondsToGetToUser;
    audio.play();
    document.querySelector(".musicSelect").style.display = "none";
    visualize(audio);
    getBeats(delayedAudio)
    menuTexts = []
  }

}
var totalNumberOfFrames = 10;
var imageFrameNumber = 0;
var widthOfImage = 200;
var heightOfImage = 200;
var widthOfSingleImage = widthOfImage / totalNumberOfFrames;
function visualize(source) {
    if(!context){
      context = new AudioContext();
      src = context.createMediaElementSource(source);
    }
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
        if(!isGameOver){
          mainGameLoop = requestAnimationFrame(renderFrame);
        }

        analyser.smoothingTimeConstant = smooth;
        // TODO - recognize the volume before pplaying. DUCK YOU FUTURE US!
        listen.gain.setValueAtTime(1, context.currentTime);
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
        distanceTraveledFromBeat+=globalGameSpeed;
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
        // console.log(sectorVols.length);
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
                HEIGHT -190- j - j*2, // total y minus the height
                WIDTH / (times - times / 4), // width according to sector scale
                -(heightOfBar)); // height
                heightOfBar = 0;
              }
            }
        }
        for(var i = 0; i < diamonds.length; i++){//e.x > diamonds[i].x  && e.x < diamonds[i].x + 25
          if(diamonds[i] != "empty"){
            // console.log(globalMouseY > diamonds[i].y-25  && globalMouseY < diamonds[i].y + 50 && globalMouseX-25 > diamonds[i].x  && globalMouseX < diamonds[i].x + 50);
            if(globalMouseX > diamonds[i].x-25  && globalMouseX < diamonds[i].x + 50 && globalMouseY < diamonds[i].y+diamonds[i].height && globalMouseY > diamonds[i].y-70 - diamonds[i].height){// && globalMouseY > diamonds[i].y-70
              console.log("hover");
              score++;
              diamonds[i] = "empty";
            }
          }
        }
        // jumpEffect();
        generateBackground();
        refreshPlayer();
        generateDiamonds();
        updateHearts();
        updateScore();
        updateAllParticles();
        updateAllObstacles();
        drawSprite();

        if(isGameOver && yoda){
          cancelAnimationFrame(mainGameLoop);
          playSound("gameOver.mp3",0.4);
          audio.pause();
          delayedAudio.pause();
          yaddle();
        }
        // global avg and su vals
      prevSectorVols = sectorVols;
      sectorVols = [];
      if(showFps >= dinamicFPS){
        if (beatCounter > 20) {
          sensitivity = Math.abs(sensitivity - 0.3)
        }
        else if (beatCounter > 10) {
            sensitivity = Math.abs(sensitivity - 0.2)
        }
        else if (beatCounter > 6) {
            sensitivity = Math.abs(sensitivity - 0.1)
        }
        else if (beatCounter > 2) {
            sensitivity = Math.abs(sensitivity - 0.05)
        }
        else if (beatCounter < 2) {
            sensitivity += 0.1
        }
        secondCounter++;
        if (secondCounter % 3 == 0) {
          beatCounter = 0;
        }
        // distanceTraveledFromBeat = 0;
        document.querySelector(".fps").innerHTML = Math.floor(fps);
        showFps = 0;

      }else{
        showFps++;
      }
      var nowPerf = performance.now()
      var ms = nowPerf-lastTime
      fps = 1000/ms;
      dinamicFPS = fps;
      globalGameSpeed = distanceToMove/(fps*secondsToGetToUser);
      lastTime = nowPerf;
      if(audio.currentTime >= audio.duration){
        cancelAnimationFrame(mainGameLoop);
        playSound("finishedgame.wav",0.2);
        winGame();
        audio.pause();
        delayedAudio.pause();
        // yaddle();
      }
    }
    function yaddle() {
      yoda = false;
      renderFrame();
      createEnd();
    }
}
var spriteSpeed = 0;
function drawSprite() {
  // console.log("grogu");
  ctx.shadowBlur = 0;
  if(!player.isJumping){
    if(spriteSpeed == 2){
      imageFrameNumber++; // changes the sprite we look at
      spriteSpeed = 0;
    }else{
      spriteSpeed++;
    }
    imageFrameNumber = imageFrameNumber % totalNumberOfFrames;
  }else{
    imageFrameNumber = 5;
  }
// Change this from 0 to 1 to 2 ... upto 9 and back to 0 again, then 1...
  // ctx.drawImage(imga,
  //   imageFrameNumber * widthOfSingleImage, 0, // x and y - where in the sprite
  //   widthOfSingleImage, heightOfImage, // width and height
  //   50, 50, // x and y - where on the screen
  //   widthOfSingleImage, heightOfImage // width and height
  // );
  // ctx.drawImage(imga,
  //    imageFrameNumber * widthOfSingleImage,0, // x and y - where in the sprite
  //   widthOfSingleImage, heightOfImage, // width and height
  //   50, 50, // x and y - where on the screen
  //   widthOfSingleImage, heightOfImage // width and height
  // );
}
function jumpEffect(){
  if(player.isJumping){
    if(scaled <= 120){
      if(toScale == 0){
        canvas.width-=100;
        canvas.height-=100;
        scaled++;
        toScale = 0;
      }else{
        toScale++;
      }
    }
  }else{
    scaled = 0;
    // if(scaled >= 0){
    //   if(toScale == 1){
    //     canvas.width+=100;
    //     canvas.height+=100;
    //     scaled--;
    //     toScale = 0;
    //   }else{
    //     toScale++;
    //   }
    // }
  }
}
var beatLoop;
var sensitivitya = 0.35, frameCountMaxa = 4, prevSectorVolsa = [], avgDeltaa = [], spikeDistancea = 0, beatCountera = 0,sectorVolsa = [];
var srcb;
function getBeats(source) {
    if(!srcb){
      srcb = context.createMediaElementSource(source);
    }
    // var srcb = src;
    var analysera = context.createAnalyser();
    var listen = context.createGain();
    srcb.connect(listen);
    listen.connect(analysera);
    // analyser.connect(context.destination);
    analysera.fftSize = 2 ** 12;
    var frequencyBins = analysera.fftSize / 2;

    // length of data inside array
    var bufferLength = analysera.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    renderFrameb();
    function renderFrameb() {
      // mandatory shit to set everything up
      beatLoop = requestAnimationFrame(renderFrameb);
      analysera.smoothingTimeConstant = smooth;
      // TODO - recognize the volume before pplaying. DUCK YOU FUTURE US!
      listen.gain.setValueAtTime(1, context.currentTime);
      analysera.getByteFrequencyData(dataArray);
      allFreqs.push(dataArray);
      var sectorLength = 0;
      var avgTimes = 0;
      var currentAverage = 0;
      var allHeights = 0;
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
              sectorVolsa.push(sectorLength == 0 ? 0 : allHeights / sectorLength);
              // resetting allHeights
              allHeights = 0, sectorLength = 0;
          }
      }
      currentAverage/=avgTimes;
      // global avg and su vals
      // console.log("a");
    getSpikeReference(prevSectorVolsa,sectorVolsa,4);
      prevSectorVolsa = sectorVolsa;
      sectorVolsa = [];
    }
}
// createObstacles()

function fuckUpFPS(){
  for(var i = 0; i < 200; i++){
    var randX = -1000;
    var randY = -1000;
    var explosionSystem = new ParticleSystem(randX,randY,35,100,0,360,8,3,4,false,-11,10,true);
    allParticleSystems.push(explosionSystem)
  }
}

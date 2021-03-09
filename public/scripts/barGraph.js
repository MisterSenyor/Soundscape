// BORING MANDATORY STUFF
var audio = document.querySelector(".audio");
var offsetX=canvas.offsetLeft;
var offsetY=canvas.offsetTop;
var WIDTH = (canvas.width = window.innerWidth);
var HEIGHT = (canvas.height = window.innerHeight);

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

// BORING VARS (basic setup)
var src, analyser, smooth = 0.9, dataArray, dataArraya, sectorVols = [], allFreqs = [];
var animationX = WIDTH, circleWidth = 200, animationSpeed = 2,animationIttrCount = 0;
// Particle vars
var amount = 150, lifetime = 200, particles = [],particle, spawnParticle = 0, toDrawParticles = true, allParticleSystems = [];
// change this to decide how many sectors there are
var times = 32;
// beat recognition vars
var sensitivity = 0.35, frameCountMax = 4, frameAvgs = [], prevSectorVols = [], avgDelta = [], spikeDistance = 0, beatCounter = 0;
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
// Diamonds
var diamonds = [], diamondColors = ["#8b32a8","#28ad64","#c8de4e","#d61313","#54ffeb","#2b88c2"], spawnDiamondsIn = 0;
//Create player particles
var partX = WIDTH/7-10, partY = HEIGHT-200;
var playerParticles = new ParticleSystem(partX,partY,20,100,50,80,5,1,2,true,5,-1,false,true), player = new Player(WIDTH/7,HEIGHT-200-30,"#39ff14",30);
allParticleSystems.push(playerParticles)
//Hearts
var hearts = 3;



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
        mainGameLoop = requestAnimationFrame(renderFrame);
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
              //171-300
              if(j%5 == 0 || j == sectorVols[i]){
                var fillColor = j > 131 ? 131 : j;
                var fills = "hsla("+(171+fillColor)+",69%, 65%,1)";
                ctx.shadowColor = fills;
                ctx.fillStyle = fills;
                // ctx.shadowColor = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,.5)";
                // ctx.fillStyle = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,.5)";
                ctx.shadowColor = fills;
                ctx.fillStyle = fills;
                // filling the rect in the specific location
                ctx.fillRect(i * (WIDTH / (times - times / 4)), // x relative to i'th sector
                floorY - j - j*2, // total y minus the height
                WIDTH / (times - times / 4), // width according to sector scale
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
        generateDiamonds();
        updateScore();
        updateAllParticles();
        updateAllObstacles();

        // global avg and su vals
        getSpikeReference();
      prevSectorVols = sectorVols;
      sectorVols = [];

    }

}
createObstacles()

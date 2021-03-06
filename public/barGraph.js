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
        audio.volume = 1;
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
var animId;
var animIda;
// change this to decide how many sectors there are
var times = 32;
var realTimes = times-times/4;
// beat recognition vars
var avg = 0, sum = 0, cmprsScale = 1, gsectorLength = 0, avgCounter = 0;

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
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);
    renderFrame();
    function renderFrame() {
        // mandatory shit to set everything up
        requestAnimationFrame(renderFrame);
        analyser.smoothingTimeConstant = smooth;
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
        // getting all the values into sectorVols so it contains the avg height for each sector
        for (var i = 0; i < bufferLength; i++) {
            // incrementing allHeights to count the sum of all heights in each sector
            if (dataArray[i] != 0) {
                allHeights += dataArray[i];
                sectorLength++;
            }

            if (i % (dataArray.length / times) == 0) {
                // if i has reached the end of the sector, it pushes the average sector height into allHeights
                sectorVols.push(sectorLength == 0 ? 0 : allHeights / sectorLength);
                // resetting allHeights
                allHeights = 0, sectorLength = 0;
            }
        }

        // drawing each sector individually
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        generateBackground()
        // console.log(sectorVols[2]/5);
        for (var i = 0; i < sectorVols.length; i++) {
            // fill color
            // for(var i = 0)
            // console.log(sectorVols[i]);
            var heightOfBar = 0;
            for(var j = 0; j < sectorVols[i]; j++){
              heightOfBar++;
              if(j%5 == 0 || j == sectorVols[i]){
                var fillColor = j*2 > 255 ? 255 : j*2;
                ctx.shadowColor = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,1)";
                ctx.fillStyle = "rgba("+(fillColor)+", "+(255-(fillColor))+", 0,1)";
                // filling the rect in the specific location
                // console.log(j);
                ctx.fillRect(i * (WIDTH / realTimes), // x relative to i'th sector
                HEIGHT - j - j*2, // total y minus the height
                WIDTH / realTimes, // width according to sector scale
                -heightOfBar); // height
                heightOfBar = 0;
              }
            }
        }
        // global avg and su vals

        getSpikeReference();
        function getSpikeReference() {
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i] != 0) {
                    sum += dataArray[i] / cmprsScale;
                    gsectorLength++;
                }
            }
            avg = sum / gsectorLength;
            avgCounter++;
            if (avgCounter > 128) {
                gsectorLength = 0;
                sum = 0;
                avgCounter = 0;
                console.log("reset");
            }
            var sectorSum = 0
            for (var i = 0; i < sectorVols.length; i++) {
                sectorSum += sectorVols[i];
            }
            if (sectorSum / sectorVols.length > avg) {
                console.log("beat");
            }
            sectorSum = 0;
        }
        sectorVols = [];

    }

}
function generateBackground(){
  ctx.beginPath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgb(255,0,0,1)";
  // ctx.fillStyle = "rgb(255,0,0,1)"
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 3;
  ctx.fillStyle = "orange"
  ctx.arc(100, 75, 100, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

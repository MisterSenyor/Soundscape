// window.it = 0
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
        audio.volume = 0.01;
        visualize(audio);
    };
});
var src;
var analyser;
var smooth = 0.9;
var dataArray;
var dataArraya;
var fourVols = [];
var allFreqs = [];
var animId;
var animIda;
var times = 4;
// var j;
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

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    // dataArray = new Float32Array(bufferLength);
    dataArray = new Uint8Array(bufferLength);
    var scale = bufferLength/WIDTH;
    renderFrame();
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.smoothingTimeConstant = smooth;
        listen.gain.setValueAtTime(1, context.currentTime);
        var WIDTH = (canvas.width = window.innerWidth);
        var HEIGHT = (canvas.height = window.innerHeight);
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        // var scale = Math.log(frequencyBins - 1) / WIDTH;
        var scale = bufferLength/WIDTH;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        analyser.getByteFrequencyData(dataArray);
        allFreqs.push(dataArray);
        var allHeights = 0;
        // drawFreqs(dataArray)
        // dataArray = new Uint8Array(bufferLength);
        for (var i = 0; i < bufferLength; i++) {
          barHeight = Math.abs(dataArray[i]);
          allHeights+=dataArray[i];
          if(i%(dataArray.length/times) == 0){
            fourVols.push(allHeights);
            allHeights = 0;
          }
          // let x = i+scale;
          // var h = 300 - barHeight * 300 / 255;
          // var s = 100 + "%";
          // var l = barHeight < 64 ? barHeight * 50 / 64 + "%" : "50%";
          // ctx.fillStyle = "hsl("+h+",100%,50%)";
          // ctx.fillRect(x,HEIGHT - barHeight * HEIGHT / 255,scale,HEIGHT);
        }
        for(var i = 0; i < fourVols.length; i++){
          var barHeight = fourVols[i];
          scale = WIDTH/times;
          let x = i*WIDTH/times;
          var h = 300 - barHeight * 300 / 255;
          var s = 100 + "%";
          var l = barHeight < 64 ? barHeight * 50 / 64 + "%" : "50%";
          ctx.fillStyle = "hsl(40,100%,50%)";
          ctx.fillRect(x,HEIGHT,scale,-barHeight/5);
        }
        fourVols = [];
    }

}
// var g = 0;
// function renderFramea(){
//   animIda = requestAnimationFrame(renderFramea);
//   console.log(g);
//   drawFreqs(allFreqs[g])
//   if(g == allFreqs.length-1){
//     cancelAnimationFrame(animIda);
//   }
//   g++;
// }

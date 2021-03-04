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
var smooth = 0.5;
var dataArray;
var dataHistory;
var fourVols = [];
function visualize(source) {
    var context = new AudioContext();
    src = context.createMediaElementSource(source);
    analyser = context.createAnalyser();
    var listen = context.createGain();

    src.connect(listen);
    listen.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 2 ** 12;
    var frequencyBins = analyser.fftSize / 2;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);
    dataHistory = [];

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
        var allHeights = 0;
        for (var i = 0; i < bufferLength; i++) {
          // barHeight = dataArray[i];
          // allHeights+=barHeight;
          // if()
          let x = i+scale;
          var h = 300 - barHeight * 300 / 255;
          var s = 100 + "%";
          var l = barHeight < 64 ? barHeight * 50 / 64 + "%" : "50%";
          ctx.fillStyle = "hsl("+h+",100%,50%)";
          ctx.fillRect(x,HEIGHT - barHeight * HEIGHT / 255,scale,HEIGHT);
        }
    }
}

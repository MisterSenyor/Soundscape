analyser.getByteFrequencyData(dataArray);
let start = 0
analyser.getByteTimeDomainData(dataArray);
ctx.lineWidth = 1;
ctx.strokeStyle = "#fff";
ctx.beginPath();
x = 0;
for (var i = start; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT / 2;

    if (i === 0) {
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
    }

    x = i * sliceWidth
}
ctx.lineTo(WIDTH, dataArray[0] / 128.0 * HEIGHT / 2);
ctx.stroke();

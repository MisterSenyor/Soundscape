analyser.getByteFrequencyData(dataArray);
var imgData = ctx.createImageData(WIDTH, HEIGHT);
for (j = 0; j < imgData.data.length; j += 4) {
    let y = j / 4 / WIDTH;
    let x = Math.floor(((j / 4) % WIDTH) * bufferLength / WIDTH);
    imgData.data[j + 0] =
        255 - dataArray[x] <= y * (255 / HEIGHT) ? dataArray[x] : 0;
    imgData.data[j + 1] =
        255 - dataArray[x + 1] <= y * (255 / HEIGHT) ? dataArray[x + 1] : 0;
    imgData.data[j + 2] =
        255 - dataArray[x + 2] <= y * (255 / HEIGHT) ? dataArray[x + 2] : 0;
    imgData.data[j + 3] = 255;
}
ctx.putImageData(imgData, 0, 0);

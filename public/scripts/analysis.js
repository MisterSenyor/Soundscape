function getSpikeReference(prevSectorVols,sectorVols,frameCountMax) {
  // TODO - make the sensitivity alter itself dynamically by the amount of beats recognized per TimeFrame
  var sectorSum = 0;
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
          if ((sectorVols[i] - prevSectorVols[i]) * sensitivity > median(avgDelta) && !lastFrame) {
            createObstacles();
            var randomX = randomBetween(0+WIDTH/8,WIDTH-WIDTH/8)
            var randomY = randomBetween(0+HEIGHT/8,HEIGHT-HEIGHT/8-200)
            createExplosion(WIDTH / 2, HEIGHT / 2);
            // createExplosion(randomX,randomY);
            console.log("beat")
            spikeDistance = 0;
            beatCounter++;
            lastFrame = true;
          } else if (!((sectorVols[i] - prevSectorVols[i]) * sensitivity > median(avgDelta))){
              lastFrame = false;
          }
      }
    // if (sensitivity > 1) {
    //     sensitivity = sigmoid(sensitivity)
    // }
  }

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
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}
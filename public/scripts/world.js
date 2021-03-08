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

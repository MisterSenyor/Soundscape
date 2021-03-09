var avvg, triGrees = 0, rSpeed = 0.01;

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
  ctx.shadowBlur = 0;
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
var color;
var avgClr;
function generateBackground(){
  for(var i = 0; i < (WIDTH/circleWidth)+10; i++){
    for(var j = 0; j < HEIGHT/circleWidth; j++){
      var coors = {x:animationX - i*circleWidth+20+circleWidth/3+circleWidth,y:j*circleWidth+20+circleWidth/3};
      var cHeight = circleWidth;
      ctx.beginPath();
      ctx.shadowBlur = 10;
      avgClr = Math.pow(currentAverage/30,3);
      // color = ((165-avgClr < 0) ? 0 : 165-avgClr);
      color = avgClr;
      var valueOfClr = (color/5)**3 < 30 ? 30 : (color/5)**3;
      var rgbs = "rgba(0,"+valueOfClr+","+valueOfClr+",0.9)";
      ctx.shadowColor = rgbs;
      ctx.strokeStyle = rgbs;
      ctx.lineWidth = 10;
      ctx.arc(coors.x,coors.y , circleWidth/2-10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();

      ctx.lineWidth = currentAverage/10;

      ctx.strokeStyle = "#8D13F8";
      ctx.shadowColor = "#8D13F8";
      var size = currentAverage + currentAverage/2;
      ctx.save();
      ctx.translate(coors.x,coors.y);
      ctx.rotate(triGrees * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0,-size/4-10);
      ctx.lineTo(-size/4,size/4-10);
      ctx.lineTo(size/4,size/4-10);
      ctx.lineTo(0,-size/4-10)
      ctx.lineTo(-size/4,size/4-10);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      triGrees+=rSpeed;
      // if(triGrees == 360)

      /*
      Backup
      ctx.beginPath();
      ctx.moveTo(coors.x,coors.y-size/4-10);
      ctx.lineTo(coors.x-size/4,coors.y+size/4-10);
      ctx.lineTo(coors.x+size/4,coors.y+size/4-10);
      ctx.lineTo(coors.x,coors.y-size/4-10)
      ctx.lineTo(coors.x-size/4,coors.y+size/4-10);
      ctx.stroke();
      ctx.closePath();
      */
    }
  }
}

function makeJump(){

}

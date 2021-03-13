var obstacles = [];

function createObstacles(){
  var obstacle = new Obstacle(WIDTH,HEIGHT-200,100,30,"black");
  if(obstacles.includes("empty")){
    obstacles[obstacles.indexOf("empty")] = obstacle;
  }else{
    obstacles.push(obstacle);
  }
}

function Obstacle(x,y,width,height,color){
  this.y = y,
  this.width = width,
  this.height = height,
  this.color = color,
  this.arrowPos = 5,
  this.arrowUp = true,
  this.moveArrow = 0,
  this.used = false,
  this.arrowWidth = 70,
  this.x = x+this.arrowWidth+this.arrowWidth/2,
  this.draw = function(){
    ctx.fillStyle = color;
    ctx.shadowBlur = 0;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    this.drawJumpArrow();
  },
  this.drawJumpArrow = function(){
    ctx.fillStyle = "#03fc56";
    ctx.strokeStyle = "#04fc56";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#04fc56";
    ctx.lineWidth = 2;
    ctx.fillRect(this.x-this.arrowWidth,this.y,this.arrowWidth,this.height/2)
    for(var i = 1; i < 3;i++){
      ctx.beginPath();
      ctx.moveTo(this.x-this.arrowWidth+5,this.y-10*i-this.arrowPos+5);
      ctx.lineTo(this.x-this.arrowWidth/2,this.y-(10*i+10)-this.arrowPos+5);
      ctx.lineTo(this.x-5,this.y-10*i-this.arrowPos+5);
      ctx.stroke();
      ctx.closePath();
    }
    if(this.moveArrow == 6){
      if(this.arrowUp){
        this.arrowPos--;
        if(this.arrowPos == 0){
          this.arrowUp = false;
        }
      }else{
        this.arrowPos++;
        if(this.arrowPos == 9){
          this.arrowUp = true;
        }
      }
      this.moveArrow = 0;
    }else{
      this.moveArrow++;
    }
  },
  this.updatePos = function(){
    this.x-=globalGameSpeed;
    this.draw();
  }
}

function updateAllObstacles(){
  updateHearts();
  for(var i = 0; i < obstacles.length; i++){
    if(obstacles[i] != "empty"){
      obstacles[i].updatePos();
      if(obstacles[i].x < 0-obstacles[i].width){
        obstacles[i] = "empty";
      }
    }
    if(player.pos[1] == HEIGHT-230 && player.pos[0] > obstacles[i].x && !obstacles[i].used && player.pos[0] < obstacles[i].x + obstacles[i].width){
      hearts--;
      obstacles[i].used = true;
    }
  }
}
function updateHearts(){
  for(var i = 0; i < hearts; i++){
    ctx.shadowColor = "red";
    ctx.drawImage(getImage("heart"),WIDTH/30+30*i*1.5, 30, 30,30)
  }
}
function checkCollision(){

}

var obstacles = [];

function createObstacles(){
  var rand =Math.floor(randomBetween(1,3))
  var obstacle = new Obstacle(WIDTH,HEIGHT-200,100,30,"black",rand);
  if(obstacles.includes("empty")){
    obstacles[obstacles.indexOf("empty")] = obstacle;
  }else{
    obstacles.push(obstacle);
  }
}

function Obstacle(x,y,width,height,color,type){
  this.y = y,
  this.width = width,
  this.height = height,
  this.color = color,
  this.arrowPos = 5,
  this.arrowUp = true,
  this.moveArrow = 0,
  this.used = false,
  this.arrowWidth = 70,
  this.type = type,
  this.x = x+this.arrowWidth+this.arrowWidth/2,
  this.draw = function(){
    if(this.type == 1){
      this.firstType();
    }else if(this.type == 2){
      this.secondType();
      this.drawJumpArrow();
    }
  },
  this.secondType = function(){
    ctx.fillStyle = "red";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    for(var i = 0; i < this.width/20; i++){
      ctx.lineTo(this.x + i*20,this.y-15);
      ctx.lineTo(this.x + i*20+10,this.y);
    }
    ctx.closePath();
    ctx.fill();
  },
  this.firstType = function(){
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
    if(player.pos[1] == player.floor && player.pos[0]+player.size-player.size*(1/5) > obstacles[i].x && !obstacles[i].used && player.pos[0]+player.size/3 < obstacles[i].x + obstacles[i].width){
      hearts--;
      obstacles[i].used = true;
      if(hearts == 0){
        isGameOver = true;
        updateHearts();
      }
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

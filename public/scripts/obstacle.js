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
  this.x = x,
  this.y = y,
  this.width = width,
  this.height = height,
  this.color = color,
  this.draw = function(){
    ctx.fillStyle = color;
    ctx.shadowColor = "hsla(0,0,0,0)";
    ctx.shadowBlur = 0;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    this.drawJumpArrow();
  },
  this.drawJumpArrow = function(){
    ctx.fillStyle = "#03fc56";
    ctx.fillRect(this.x-50,this.y,50,this.height/2)
    
  },
  this.updatePos = function(){
    this.x-=2;
    this.draw();
  }
}

function updateAllObstacles(){
  for(var i = 0; i < obstacles.length; i++){
    if(obstacles[i] != "empty"){
      obstacles[i].updatePos();
      if(obstacles[i].x < 0-obstacles[i].width){
        obstacles[i] = "empty";
      }
    }
  }
}

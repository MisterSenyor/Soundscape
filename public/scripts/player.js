function Player(x,y,acceleration,color,size){
  this.x = x,
  this.y = y,
  this.begY = y,
  this.acceleration = acceleration,
  this.color = color,
  this.size = size,
  this.speedY = 0,
  this.gravity = 0.05;
  this.gravitySpeed = 0,
  this.airtime = 0,
  this.draw = function(){
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
  },
  this.updatePos = function(){
    // this.y = this.begY + .5*gravity*Math.pow(this.airtime,2);
    this.gravitySpeed += this.gravity;
    this.y -= (this.speedY + this.gravitySpeed);
    this.hitBottom();
  },
  this.hitBottom = function(){
    if(this.y >= this.begY){
      this.y = this.begY;
      this.gravitySpeed = 0;
      toDrawParticles = true;
      playerParticles.enabled = true;
      // console.log(toDrawParticles);
    }else{
      toDrawParticles = false;
      playerParticles.enabled = false;
    }
  }
}
function jump(){
  player.gravity = 0.5
  isJumping = true;
  setTimeout(function(){
    isJumping = false;
  },70);
}

var isJumping = false;
function refreshPlayer(){
  if(!isJumping){
    player.gravity = -0.1;
  }
  player.updatePos()
  player.draw();
}

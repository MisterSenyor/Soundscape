function generateDiamonds(){
  spawnDiamondsIn++;
  var currGem = Math.floor(randomBetween(1,7));
  if(spawnDiamondsIn%100 == 0){
    if(diamonds.includes("empty")){
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.indexOf("empty"),25,25)
      diamonds[diamonds.indexOf("empty")]=gem;
    }else{
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.length,25,25)
      diamonds.push(gem);
    }
  }
  for(var j = 0; j < diamonds.length; j++){
    if(diamonds[j] != "empty"){
      diamonds[j].updatePos();
    }
  }
}
var txtWidth;
function updateScore(){
  ctx.font = "30px numerals";
  var txt = "Score: " + score;
  var minus = 50;
  txtWidth = ctx.measureText(txt).width
  ctx.drawImage(getImage("tChest"),WIDTH-txtWidth-60-minus,20,50,50);
  ctx.fillStyle = "black";
  ctx.fillRect(WIDTH-txtWidth-minus,20,txtWidth+20,50)
  ctx.fillStyle = "green";
  ctx.shadowColor = "#00ff1a";
  ctx.fillText(txt,WIDTH-txtWidth-minus+10,55);
}
function Gem(color,image,x,y,index,width,height){
  this.color = color,
  this.image = image,
  this.x = x,
  this.y = y,
  this.index = index,
  this.width = width,
  this.height = height,
  this.drawGem = function(){
    ctx.shadowColor = diamondColors[this.color];
    // ctx.fillRect(this.x-50,this.y,100,2);
    ctx.drawImage(getImage("gem" + this.image),this.x,this.y,this.width,this.height);
    // e.y > diamonds[i].y-25  && e.y < diamonds[i].y + 50 && e.x-25 > diamonds[i].x  && e.x < diamonds[i].x + 50
  },
  this.updatePos = function(){
    this.x-=2;
    this.drawGem();
    if(this.x+2*this.width < 0){
      diamonds[this.index] = "empty";
    }
  },
  this.kill = function(){
    diamonds[this.index] = "empty";
  }
}
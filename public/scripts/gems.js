function generateDiamonds(){
  spawnDiamondsIn++;
  var currGem = Math.floor(randomBetween(1,7));
  if(spawnDiamondsIn >= fps){
    if(diamonds.includes("empty")){
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.indexOf("empty"),25,25)
      diamonds[diamonds.indexOf("empty")]=gem;
    }else{
      var gem = new Gem(diamondColors[currGem-1],currGem,WIDTH,HEIGHT-randomBetween(30,170),diamonds.length,25,25)
      diamonds.push(gem);
    }
    spawnDiamondsIn = 0;
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
var gemImages = [];
for(var i = 1; i <= 6; i++){
  gemImages.push(getImage("gem" + i));
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
    ctx.shadowBlur = 10;
    ctx.shadowColor = diamondColors[this.color];
    // console.log(this.image);
    ctx.drawImage(getImage("gem" + this.image),parseInt(this.x).toFixed(),parseInt(this.y).toFixed(),parseInt(this.width).toFixed(),parseInt(this.height).toFixed());
  },
  this.updatePos = function(){
    this.x-=globalGameSpeed;
    this.drawGem();
    if(this.x+2*this.width < 0){
      diamonds[this.index] = "empty";
    }
  },
  this.kill = function(){
    diamonds[this.index] = "empty";
  }
}

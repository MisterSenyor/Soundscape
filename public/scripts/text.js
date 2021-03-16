function hoverSound() {
  var myAudioa = document.createElement("audio");
  myAudioa.src = "./assets/music/hover.wav";
  myAudioa.play();
}
var activeTexts = [];
function MenuText(x,y,text,func,align,size,active,isFocusable){
  this.x = x,
  this.y = y,
  this.text = text,
  this.func = func,
  this.align = align,
  this.size = size,
  this.active = active,
  this.isFocused = false,
  this.soundPlay = false,
  this.isFocusable = isFocusable,
  this.draw = function(){
    ctx.font = this.size + "px pixelated";
    this.width = (ctx.measureText(this.text).width)
    if(this.active){
      if(!this.isFocused && this.isFocusable){
        this.focus();
      }else{
        this.write();
        this.soundPlay = true;
      }
    }
  },
  this.write = function(){
    ctx.fillStyle = this.size + "px Roboto"
    ctx.shadowBlur = 0;
    if(align == "center"){
      ctx.textAlign = "center";
      ctx.fillText(this.text,this.x,this.y);
      ctx.textAlign = "start";
    }
  },
  this.focus = function(){
    if(this.soundPlay){
      hoverSound();
      this.soundPlay = false;
    }
    ctx.fillStyle = this.size + "px Roboto"
    ctx.shadowColor = "rgb(0,255,255)";
    ctx.shadowBlur = 15;
    if(align == "center"){
      ctx.textAlign = "center";
      ctx.fillText(this.text,this.x,this.y);
      ctx.textAlign = "start";
    }
    ctx.shadowBlur = 0;
  }
}
function hoverSound() {
  var myAudioa = document.createElement("audio");
  myAudioa.src = "./assets/music/hover.wav";
  myAudioa.play();
}

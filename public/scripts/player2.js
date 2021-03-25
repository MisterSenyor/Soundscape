function Player(x, y, color, size) {
    this.pos = [x, y]
    this.color = color,
    this.size = size,
    this.gravity = 0.98, // acc, not vel
    this.vel = [0, 0],
    this.acc = [0, 0],
    this.startJumpTime = 0,
    this.startJumpPerf = 0,
    this.isJumping = false,
    this.jumpHeight = -18,
    this.jumpLength = 0,
    this.hangTime = 0,
    this.jumpStartTime = 0,
    this.floor = HEIGHT - 200 - this.size,
    this.draw = function() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "red";
        ctx.drawImage(imga,imageFrameNumber*416.6,0,416.6,421,this.pos[0],this.pos[1],this.size,this.size)
    },
    this.getKeys = function(e) {
        this.acc = [0, this.gravity];
        // console.log(e);
        if (e == 32 && !this.isJumping) {
          this.jumpStartTime = performance.now()
          this.vel[1] = this.jumpHeight;
          this.isJumping = true;
          playerParticles.enabled = false;
        }
    }
    this.collide = function() {
        if (this.pos[1] >= this.floor) {
            this.pos[1] = this.floor;
            this.isJumping = false;
            playerParticles.enabled = true;
        }
    }
    this.update = function() {
        // this.jumpHeight = -Math.abs(4.9 * (150 / globalGameSpeed) + 150 / (150 / globalGameSpeed));
        // this.jumpHeight = -(Math.sqrt(this.gravity) * 20);
        // this.jumpHeight = -(4+1/3) * globalGameSpeed;
        // this.jumpHeight = -30;
        this.getKeys(0);
        this.vel[0] += this.acc[0];
        // this.vel[1] += this.acc[1];
        this.pos[0] += this.vel[0] + 0.5 * this.acc[0];
        // this.pos[1] += this.vel[1] + 0.5 * this.acc[1];
        if(this.isJumping){
          // console.log("grogu");
          var nowPerfa = performance.now();
          this.startJumpTime+=(nowPerfa-this.startJumpPerf)/10;
          this.startJumpPerf = nowPerfa;
          this.jumpLength+=globalGameSpeed;
          // console.log(this.startJumpPerf + "," + this.startJumpTime);
          this.pos[1] = this.floor+this.jumpHeight*(this.startJumpTime) + 0.5*this.acc[1]*(this.startJumpTime)**2;
        }else{
          if(this.jumpLength > 0){
            // console.log(this.jumpLength + ", " + this.jumpHeight + ", " + this.hangTime);
            console.log(this.hangTime + ", " + this.startJumpTime + ", " + (performance.now()-this.jumpStartTime));
          }
          this.jumpLength = 0;
          this.startJumpTime = 0;
          this.startJumpPerf = performance.now();
          // this.hangTime = (175/globalGameSpeed);
          this.hangTime = 33;
          this.jumpHeight = -(this.gravity*(this.hangTime/2));
        }
        this.collide();
    }

}
function refreshPlayer() {
    player.update();
    player.draw();
}

function Player(x, y, color, size) {
    this.pos = [x, y]
    this.color = color,
    this.size = size,
    this.gravity = 9.8, // acc, not vel
    this.vel = [0, 0],
    this.acc = [0, 0],
    this.isJumping = false,
    this.jumpHeight = -105/globalGameSpeed,
    this.floor = HEIGHT - 200 - this.size,
    this.draw = function() {
        ctx.shadowBlur = 0;
        // ctx.shadowColor = this.color;
        // ctx.fillStyle = this.color;
        // ctx.beginPath();
        // ctx.arc(this.pos[0],this.pos[1],this.size,0,2*Math.PI);
        // ctx.fill();
        // ctx.closePath();
        ctx.drawImage(imga,imageFrameNumber*416.6,0,416.6,421,this.pos[0],this.pos[1],this.size,this.size)
    },
    this.getKeys = function(e) {
        this.acc = [0, this.gravity];
        // console.log(e);
        if (e == 32 && !this.isJumping) {
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
        this.jumpHeight = -1470/globalGameSpeed;
        this.getKeys(0);
        this.vel[0] += this.acc[0];
        this.vel[1] += this.acc[1];
        this.pos[0] += this.vel[0] + 0.5 * this.acc[0];
        this.pos[1] += this.vel[1] + 0.5 * this.acc[1];
        this.collide();
    }

}
function refreshPlayer() {
    player.update();
    player.draw();
}

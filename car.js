class Car{
  constructor(x,y,width,height){
    this.x = x;
    this.y = y
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;

    this.controls = new Controls();
  }

  update(){
    if(this.controls.forward) {
      this.speed += this.acceleration;
    }
    if(this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // avoid going too fast forward
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    // avoid going too fast in reverse:
    if (this.speed<-this.maxSpeed/2){
      this.speed=-this.maxSpeed/2;
    }

    if(this.speed>0){
      this.speed-=this.friction;
    }

    if (this.speed<0){
      this.speed+=this.friction;
    }

    if (Math.abs(this.speed)<this.friction){
      /* 
       * set speed to 0 if we're at 1/2 friction
       *  Otherwise the car may keep moving (slightly)
       */
     this.speed = 0;
    }

    // angle works based on a unit circle
    // that's rotated 90degrees counter-clockwise
    if(this.controls.left) {
      this.angle += 0.03;
    }

    if(this.controls.right) {
      this.angle -= 0.03;
    }

    //this.x -= this.angle;
    this.y -= this.speed;
  }
  draw(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(
      -this.width/2,
      -this.height/2,
      this.width,
      this.height
    );
    ctx.fill();

    ctx.restore();
  }
}


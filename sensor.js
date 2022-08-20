class Sensor{
  constructor(car) {
    this.car = car;

    // use these "rays" to detect stuff (i.e. cars & borders)
    this.rayCount = 5; // 30 for solid coverage; 1 produces narwhall effect (thx to single-line if in update's lerp call)
    this.rayLength = 150;
    this.raySpread = Math.PI/2; //narrow: PI/4; full 360 w/ PI*2

    this.rays=[];
  }

  update(roadBorders){
    this.#castRays()
    // get readings from the sensors..
  }

  #castRays(){
    this.rays=[];
    for(let i=0; i < this.rayCount; i++) {
      const rayAngle=lerp(
        this.raySpread/2,
        -this.raySpread/2,
        this.rayCount == 1 ? 0.5 : i/(this.rayCount-1) // max 'i' is rayCount - 1
      ) + this.car.angle;

      const start={x: this.car.x, y: this.car.y};
      const end={x: this.car.x - Math.sin(rayAngle)*this.rayLength,
        y: this.car.y - Math.cos(rayAngle)*this.rayLength
      };
      this.rays.push([start,end]);
    }
  }

  draw(ctx){
    if(this.rays.length == 0) {
      // console.warn("Sensor trying to draw before updating...")
      return false;
    }

    for(let i=0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y
      );

      ctx.lineTo(
        this.rays[i][1].x,
        this.rays[i][1].y
      );

      ctx.stroke();
    }
  }
}

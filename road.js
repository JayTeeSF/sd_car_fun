class Road{
  constructor(x,width,laneCount=3){
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width/2;
    this.right = x + width/2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  draw(ctx){
    ctx.lineWidth = 5;
    ctx.strokeStyle="white";

    for(let i = 0; i <= this.laneCount; i++) {
     
      const x=lerp(
        this.left,
        this.right,
        i / this.laneCount //ranges from 0 to 1
      );

      // use dashed-lines for middle lanes
      if(i>0 && i<this.laneCount) {
        // draw 20 pixels then insert a break of 20
        ctx.setLineDash([20,20]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }

  getLaneCenter(laneIndex){
    const laneWidth = this.width / this.laneCount;
    // an offset (1/2 the width of a lane)
    // from the left of any particular lane
    // could also use lerp and return some percentage..
    let shouldReturn =  this.left + laneWidth/2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    /*
    let percentOfALane = 0.5
    let lanePercent = (laneIndex + 1) / this.laneCount // lane 1 of 4 is 25%; lane 2 of 4 is 50%, etc...
    let p = percentOfALane * (lanePercent)
    let lerpReturn =  lerp(this.left, this.right,p)
    console.log(`shouldReturn: ${shouldReturn} ?= ${lerpReturn}: lerpReturn`)
    */
    return shouldReturn
  }

}

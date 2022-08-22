class Road{
  constructor(x,width,laneCount=3){
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;
    this.laneWidth = this.width / this.laneCount;

    this.left = x - width/2;
    this.right = x + width/2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = {x: this.left, y: this.top};
    const topRight = {x: this.right, y: this.top};
    const bottomLeft = {x: this.left, y: this.bottom};
    const bottomRight = {x: this.right, y: this.bottom};

    this.borders = [
      [topLeft, bottomLeft],
      [topRight,bottomRight]
    ];
  }

  draw(ctx){
    ctx.lineWidth = 5;
    ctx.strokeStyle="white";

    /*
     * avoid drawing the 0th and last line, since
     * those are borders
     * use dashed-lines for middle lanes
     * draw 20 pixels then insert a break of 20
     */
    for(let i = 1; i <= this.laneCount - 1; i++) {
      const x=lerp(
        this.left,
        this.right,
        i / this.laneCount //ranges from 0 to 1
      );

      ctx.setLineDash([20,20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    // now draw the borders
    ctx.setLineDash([]);
    this.borders.forEach(border =>{
      ctx.beginPath();
      ctx.moveTo(border[0].x,border[0].y);
      ctx.lineTo(border[1].x,border[1].y);
      ctx.stroke();
    });
  }

  getLaneCenter(laneIndex){
    // an offset (1/2 the width of a lane)
    // from the left of any particular lane
    // could also use lerp and return some percentage..
    let shouldReturn =  this.left + this.laneWidth/2 +
      Math.min(laneIndex, this.laneCount - 1) * this.laneWidth;
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

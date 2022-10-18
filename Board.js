export class Board {
  constructor(ctx, bw, bh, boxes) {
    this.ctx = ctx;
    this.bw = bw;
    this.bh = bh;
    this.boxes = boxes;
    this.box = this.bw / (this.boxes + 1);
    this.origin;
  }
  /* drawBoard: width, height, boxes in a row
  This functions draws the board with boxes
  */
  drawBoard(boxes) {
    // canvas dims
    this.boxes = boxes;
    this.box = this.bw / (this.boxes + 1);
    const lw = 1; // box border
    // box size
    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = "rgb(219, 213, 185)";
    //boxes
    this.drawBoxes(this.bw, this.bh, this.box);
    //numbers
    this.drawNumbers(this.bw, this.bh, this.box);
  }
  drawBoxes() {
    for (let x = this.box; x < this.bw; x += this.box) {
      for (let y = this.box; y < this.bh; y += this.box) {
        this.ctx.strokeRect(x, y, this.box, this.box);
      }
    }
  }
  drawNumbers() {
    for (let x = 0; x < this.bw; x += this.box) {
      //paint numbers
    }
  }
  clearBoard() {
    this.ctx.clearRect(0, 0, this.bw, this.bh);
  }
  /** This functions paints the origin in the drawboard */
  graphOrigin(origin) {
    this.origin = origin;
    if (this.origin == "Upper-left") {
      this.drawPoint(this.box, this.box, "red");
    } else if (this.origin == "Centered") {
      this.drawPoint(
        this.box * Math.ceil(this.boxes / 2),
        this.box * Math.ceil(this.boxes / 2),
        "red"
      );
    }
  }

  /** drawPoint
   * This functions paitns the whole box that starts at (x,y) with color indicated in style and height and width defined by box.
   */
  drawPoint(x, y, style) {
    this.ctx.fillStyle = style;
    this.ctx.fillRect(x, y, this.box, this.box);
  }
  /**
   * toDrawable: cartesian coordinates in JSON, origin in JSON-> drawable coordinates
   * @param {JSON} p
   * @param {JSON} origin
   * @param {number} box
   * This function converts from cartesian coordinates to canvas coordinates, in order to paint
   */
  toDrawable(p, origin) {
    return {
      x: p.x * this.box + origin.x,
      y: -p.y * this.box + origin.y,
    };
  }
}

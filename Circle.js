export class Circle {
  constructor(center, radius, board) {
    this.color = "black";
    this.board = board;
    this.boxes = this.board.boxes;
    this.origin = this.board.origin;
    this.box = this.board.box;
    //Calculate origin position in centered
    this.origin_pos = {
      x: this.box * Math.ceil(this.boxes / 2),
      y: this.box * Math.ceil(this.boxes / 2),
    };
    this.checkPoints(center);
    this.radius = radius;
  }
  //Check the points
  checkPoints(center) {
    //Check the coordinates in the correct range of numbers
    if (center.h > this.boxes - 1 || center.k > this.boxes - 1) {
      alert("Invalid coordinates");
      throw Error("Invalid coordinates");
    }
    if (this.origin == "Centered") {
      if (
        Math.abs(center.h) > Math.ceil(this.boxes / 2 - 1) ||
        Math.abs(center.k) > Math.ceil(this.boxes / 2 - 1)
      ) {
        alert("Invalid coordinates");
        throw Error("Invalid coordinates");
      }
    } else if (this.origin == "Upper-left") {
      if (center.h < 0 || center.k < 0) {
        alert("Invalid coordinates");
        throw Error("Invalid coordinates");
      }
    }
    this.center = center;
  }

  bresenhamsAlgorithm(){
    
  }
}

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


  midPointCircleAlgorithm() {
    if (this.origin == "Upper-left") {
      //List to keep track of the points in order to reflect them
      let listPoints = [];
      let x = 0;
      let y = this.radius;
      let pk = 1.25 - this.radius; //CHANGE
      listPoints.push({ x: x, y: y });
      for (let k = 0; x <= y; k++) {
        if (pk < 0) {
          pk = pk + 2 * x + 1;
        }
        else {
          pk = pk - 2 * y + 2 * x + 1; //CHANGE
          y--;
        }
        x++;

        listPoints.push({ x: x, y: y });
      }
      this.reflectInQuadrant(listPoints);
      this.graph(listPoints);
    }
  }

  reflectInQuadrant(listPoints) {
    let size = listPoints.length;
    for (let k = 0; k < size; k++) {
      listPoints.push({ x: listPoints[k].y, y: listPoints[k].x });
    }
    console.log(listPoints)
  }

  graph(listPoints) {
    listPoints.forEach(point => {
      this.board.drawPoint(this.box + point.x * this.box, this.box + point.y * this.box, this.color);
    });

  }
  bresenhamsAlgorithm() {

  }
}

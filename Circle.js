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
    //List to keep track of the points in order to reflect them
    let listPoints = [];
    let pk = 1.25 - this.radius; //CHANGE
    let x = 0;
    let y = this.radius;
    listPoints.push({ x: x, y: y });
    for (let k = 0; x <= y; k++) {
      if (pk < 0) {
        pk = pk + 2 * x + 1;
      } else {
        pk = pk - 2 * y + 2 * x + 1; //CHANGE
        y--;
      }
      x++;
      //Add point to the array
      listPoints.push({ x: x, y: y });
    }
    console.log(listPoints);
    this.reflectInQuadrant(listPoints);
    if (this.origin == "Centered") {
      this.reflectInX(listPoints);
      this.reflectInY(listPoints);
    }
    this.translateCenter(listPoints, this.origin);
    this.graph(listPoints);
  }
  /**
   * reflectInQuadrant
   * This function receives an array of points for the half of a quadrant, and reflects it in the same quadrant to complete it
   * @param {array} listPoints
   */
  reflectInQuadrant(listPoints) {
    let size = listPoints.length;
    for (let k = 0; k < size; k++) {
      listPoints.push({ x: listPoints[k].y, y: listPoints[k].x });
    }
  }

  /**
   * reflectInX:
   * Reflects the part of the circumference across the x-axis
   * @param {array} listPoints
   */
  reflectInX(listPoints) {
    let size = listPoints.length;
    for (let k = 0; k < size; k++) {
      listPoints.push({ x: listPoints[k].x, y: -listPoints[k].y });
    }
  }

  /**
   * reflectInY:
   * Reflects the part of the circumference across the y-axis
   * @param {array} listPoints
   */
  reflectInY(listPoints) {
    let size = listPoints.length;
    for (let k = 0; k < size; k++) {
      listPoints.push({ x: -listPoints[k].x, y: listPoints[k].y });
    }
  }

  /**
   * translateCenter:
   * This function translate the entire circumference moving it according to the specified center (h,k)
   * @param {array} listPoints
   */
  translateCenter(listPoints, origin) {
    console.log("translate to", this.center.h, this.center.k);
    console.log("origin", origin)
    if(origin == "Centered"){
      listPoints.forEach((point) => {
        point.x = point.x + this.center.h;
        point.y = point.y - this.center.k;
      });
    }
    else if(origin == "Upper-left"){
      listPoints.forEach((point) => {
        point.x = point.x + this.center.h;
        point.y = point.y + this.center.k;
      });
    }   
  }
  /**
   * listPoints:
   * This functions receives an array of all the points of the circle and paints it
   * @param {array} listPoints
   */
  graph(listPoints) {
    if (this.origin == "Upper-left") {
      listPoints.forEach((point) => {
        this.board.drawPoint(
          this.box + point.x * this.box,
          this.box + point.y * this.box,
          this.color
        );
      });
    } else if (this.origin == "Centered") {
      listPoints.forEach((point) => {
        this.board.drawPoint(
          this.origin_pos.x + point.x * this.box,
          this.origin_pos.y + point.y * this.box,
          this.color
        );
      });
    }
  }

  bresenhamsAlgorithm() {}
}

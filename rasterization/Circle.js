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
    console.log("center", this.center)
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
    console.log("array", listPoints)
    let notReflectedSize = listPoints.length;
    this.reflectInQuadrant(listPoints);
    if (this.origin == "Centered") {
      this.reflectInX(listPoints);
      this.reflectInY(listPoints);
    }
    this.translateCenter(listPoints, this.origin);
    //do not paint if there is not radius
    if (this.radius > 0) {
      this.graph(listPoints, notReflectedSize);
    }
  }
  /**
   * reflectInQuadrant
   * This function receives an array of points for the half of a quadrant, and reflects it in the same quadrant to complete it
   * @param {array} listPoints
   */
  reflectInQuadrant(listPoints) {
    let size = listPoints.length;
    for (let k = 0; k < size - 2; k++) {
      listPoints.push({ x: listPoints[k].y, y: listPoints[k].x });
    }
    return listPoints;
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
    for (let k = 1; k < size; k++) {
      listPoints.push({ x: -listPoints[k].x, y: listPoints[k].y });
    }
  }

  /**
   * translateCenter:
   * This function translate the entire circumference moving it according to the specified center (h,k)
   * @param {array} listPoints
   */
  translateCenter(listPoints, origin) {
    if (origin == "Centered") {
      listPoints.forEach((point) => {
        point.x = point.x + this.center.h;
        point.y = point.y + this.center.k;
      });
    }
    else if (origin == "Upper-left") {
      listPoints.forEach((point) => {
        point.x = point.x + this.center.h;
        point.y = point.y + this.center.k;
      });
    }
  }
  /**
   * listPoints:
   * This functions receives an array of all the points of the circle and paints them
   * @param {array} listPoints
   */
  graph(listPoints, notReflectedSize) {
    if (this.origin == "Upper-left") {
      listPoints.forEach((point, index) => {
        this.board.drawPoint(
          this.box + point.x * this.box,
          this.box + point.y * this.box,
          index < notReflectedSize ? "green" : this.color
        );
      });
    } else if (this.origin == "Centered") {
      console.log("origin", this.origin)
      listPoints.forEach((point, index) => {
        this.board.drawPoint(
          this.origin_pos.x + point.x * this.box,
          this.origin_pos.y - point.y * this.box,
          index < notReflectedSize ? "green" : this.color
        );
      });
    }
  }

  bresenhamsAlgorithm() {
    //List to keep track of the points in order to reflect them
    let listPoints = [];
    let x = 0;
    let y = this.radius;
    let d = 3 - (2 * this.radius);
    listPoints.push({ x: x, y: y });

    while (x <= y) {
      if (d < 0) {
        d = d + (4 * x) + 6;
      }
      else {
        d = d + 4 * (x - y) + 10;
        y--;
      }
      x++;
      listPoints.push({ x: x, y: y });
    }
    let notReflectedSize = listPoints.length;
    this.reflectInQuadrant(listPoints);
    if (this.origin == "Centered") {
      this.reflectInX(listPoints);
      this.reflectInY(listPoints);
    }
    this.translateCenter(listPoints, this.origin);
    //do not paint if there is not radius
    if (this.radius > 0) {
      this.graph(listPoints, notReflectedSize);
    }
  }

}

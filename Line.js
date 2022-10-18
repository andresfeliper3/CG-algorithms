export class Line {
    constructor(p1, p2, boxes, origin) {
        this.color = "black";
        this.boxes = boxes;
        this.origin = origin;
        this.checkPoints(p1, p2, origin);
    }
    //Check the points
    checkPoints(p1, p2) {
        //Check the coordinates in the correct range of numbers
        if (p1.x > this.boxes - 1 || p1.y > this.boxes - 1 || p2.x > this.boxes - 1 || p2.y > this.boxes - 1) {
            alert("Invalid coordinates");
            throw Error("Invalid coordinates");
        }
        if (this.origin == "Centered") {
            if (Math.abs(p1.x) > Math.ceil((this.boxes / 2) - 1) || Math.abs(p1.y) > Math.ceil((this.boxes / 2) - 1) ||
                Math.abs(p2.x) > Math.ceil((this.boxes / 2) - 1) || Math.abs(p2.y) > Math.ceil((this.boxes / 2)) - 1) {
                alert("Invalid coordinates");
                throw Error("Invalid coordinates");
            }
        }
        else if (this.origin == "Upper-left") {
            if (p1.x < 0 || p1.y < 0 || p2.x < 0 || p2.y < 0) {
                alert("Invalid coordinates");
                throw Error("Invalid coordinates");
            }
        }
        //Make p1 always be the point to the left and p2 to the right
        if (p2.x < p1.x) {
            console.log("change")
            this.p1 = p2;
            this.p2 = p1;
        }
        else {
            this.p1 = p1;
            this.p2 = p2;
        }
    }

    basicAlgorithm(box, origin) {
        const slope = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
        let x = this.p1.x;
        let y = this.p1.y;
        if (origin == "Upper-left") {
            do {
                drawPoint(box + x * box, box + Math.round(y) * box, this.color, box);
                y = y + slope;
                x++;
            } while (x <= this.p2.x);
        }
        else if (origin == "Centered") {
            //Calculate origin position in centered
            const origin_pos = {
                x: box * Math.ceil(this.boxes / 2),
                y: box * Math.ceil(this.boxes / 2)
            };
            do {
                //Transform from cartesian to canvas coordinates
                let point = toDrawable({ x: x, y: Math.round(y) }, origin_pos, box);
                drawPoint(point.x, point.y, this.color, box);
                y = y + slope;
                x++;
            } while (x <= this.p2.x);
        }
    }

    digitalDifferentialAnalyzer(box, origin) {
        let dx = Math.abs(this.p2.x - this.p1.x);
        let dy = Math.abs(this.p2.y - this.p1.y);
        let steps = dx > dy ? dx : dy;
        let xincr = dx / steps;
        let yincr = dy / steps;
        let x = this.p1.x;
        let y = this.p1.y;
        if (origin == "Upper-left") {
            drawPoint(box + Math.round(x) * box, box + Math.round(y) * box, this.color, box);
            for (let k = 1; k <= steps; k++) {
                x = x + xincr;
                y = y + yincr;
                drawPoint(box + Math.round(x) * box, box + Math.round(y) * box, this.color, box);
            }
        }
        else if (origin == "Centered") {
            //Calculate origin position in centered
            const origin_pos = {
                x: box * Math.ceil(this.boxes / 2),
                y: box * Math.ceil(this.boxes / 2)
            };
            let point = toDrawable({ x: Math.round(x), y: Math.round(y) }, origin_pos, box);
            drawPoint(point.x, point.y, this.color, box);
            for (let k = 1; k <= steps; k++) {
                x = x + xincr;
                y = y + yincr;
                point = toDrawable({ x: Math.round(x), y: Math.round(y) }, origin_pos, box);
                drawPoint(point.x, point.y, this.color, box);
            }
        }
    }

    bresenhamsAlgorithm(box, origin) {
        let dx = Math.abs(this.p2.x - this.p1.x);
        let dy = Math.abs(this.p2.y - this.p1.y);
        let x = this.p1.x;
        let y = this.p1.y;
        let pk = 2 * dy - dx;
        let counter = 0;
        if (origin == "Upper-left") {
            drawPoint(box + x * box, box + y * box, this.color, box)
            do {
                if (pk < 0) {
                    pk = pk + 2 * dy;
                }
                else {
                    pk = pk + 2 * dy - 2 * dx;
                    y++;
                }
                x++;
                counter++;
                drawPoint(box + x * box, box + y * box, this.color, box);
            } while ((x != this.p2.x && y != this.p2.y) || counter <= (dx - 1));
        }
        else if (origin == "Centered") {
            const origin_pos = {
                x: box * Math.ceil(this.boxes / 2),
                y: box * Math.ceil(this.boxes / 2)
            };
            let point = toDrawable({ x: Math.round(x), y: Math.round(y) }, origin_pos, box);
            drawPoint(point.x, point.y, this.color, box);
            do {
                if (pk < 0) {
                    pk = pk + 2 * dy;
                }
                else {
                    pk = pk + 2 * dy - 2 * dx;
                    y++;
                }
                x++;
                counter++;
                point = toDrawable({ x: Math.round(x), y: Math.round(y) }, origin_pos, box);
                drawPoint(point.x, point.y, this.color, box);
            } while ((x != this.p2.x && y != this.p2.y) || counter <= (dx - 1));
        }
    }
}


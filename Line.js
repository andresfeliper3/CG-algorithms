export class Line {
    constructor(p1, p2, board) {
        this.color = "black";
        this.board = board;
        this.boxes = this.board.boxes;
        this.origin = this.board.origin;
        this.box = this.board.box;
        //Calculate origin position in centered
        this.origin_pos = {
            x: this.box * Math.ceil(this.boxes / 2),
            y: this.box * Math.ceil(this.boxes / 2)
        };
        this.checkPoints(p1, p2);
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
                console.log(p1, p2);
                alert("Invalid coordinates");
                throw Error("Invalid coordinates");
            }
        }
        else if (this.origin == "Upper-left") {
            if (p1.x < 0 || p1.y < 0 || p2.x < 0 || p2.y < 0) {
                alert("Invalid coordinates"); Graph
                throw Error("Invalid coordinates");
            }
        }
        //Make p1 always be the point to the left and p2 to the right
        if (p2.x < p1.x) {
            this.p1 = p2;
            this.p2 = p1;
        }
        else {
            this.p1 = p1;
            this.p2 = p2;
        }
    }

    basicAlgorithm() {
        const slope = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
        let x = this.p1.x;
        let y = this.p1.y;
        if (this.origin == "Upper-left") {
            do {
                this.board.drawPoint(this.box + x * this.box, this.box + Math.round(y) * this.box, this.color);
                y = y + slope;
                x++;
            } while (x <= this.p2.x);
        }
        else if (this.origin == "Centered") {
            do {
                //Transform from cartesian to canvas coordinates
                let point = this.board.toDrawable({ x: x, y: Math.round(y) }, this.origin_pos);
                this.board.drawPoint(point.x, point.y, this.color);
                y = y + slope;
                x++;
            } while (x <= this.p2.x);
        }
    }

    digitalDifferentialAnalyzer() {
        let dx = this.p2.x - this.p1.x;
        let dy = this.p2.y - this.p1.y;
        let steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
        let xincr = dx / steps;
        let yincr = dy / steps;
        let x = this.p1.x;
        let y = this.p1.y;
        if (this.origin == "Upper-left") {
            this.board.drawPoint(this.box + Math.round(x) * this.box, this.box + Math.round(y) * this.box, this.color);
            for (let k = 1; k <= steps; k++) {
                x = x + xincr;
                y = y + yincr;
                this.board.drawPoint(this.box + Math.round(x) * this.box, this.box + Math.round(y) * this.box, this.color);
            }
        }
        else if (this.origin == "Centered") {
            let point = this.board.toDrawable({ x: Math.round(x), y: Math.round(y) }, this.origin_pos);
            this.board.drawPoint(point.x, point.y, this.color);
            for (let k = 1; k <= steps; k++) {
                x = x + xincr;
                y = y + yincr;
                point = this.board.toDrawable({ x: Math.round(x), y: Math.round(y) }, this.origin_pos);
                this.board.drawPoint(point.x, point.y, this.color);
            }
        }
    }

    bresenhamsAlgorithm() {
        let dx = Math.abs(this.p2.x - this.p1.x);
        let dy = Math.abs(this.p2.y - this.p1.y);
        let x = this.p1.x;
        let y = this.p1.y;
        let pk = 2 * dy - dx;
        let counter = 0;
        if (this.origin == "Upper-left") {
            this.board.drawPoint(this.box + x * this.box, this.box + y * this.box, this.color);
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
                this.board.drawPoint(this.box + x * this.box, this.box + y * this.box, this.color);
            } while ((x != this.p2.x && y != this.p2.y) || counter <= (dx - 1));
        }
        else if (this.origin == "Centered") {
            let point = this.board.toDrawable({ x: Math.round(x), y: Math.round(y) }, this.origin_pos);
            this.board.drawPoint(point.x, point.y, this.color);
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
                point = this.board.toDrawable({ x: Math.round(x), y: Math.round(y) }, this.origin_pos);
                this.board.drawPoint(point.x, point.y, this.color);
            } while ((x != this.p2.x && y != this.p2.y) || counter <= (dx - 1));
        }
    }
}


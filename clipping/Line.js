export class Line {
    constructor(p1, p2, board) {
        this.p1 = p1;
        this.p2 = p2;
        this.color = "black";
        this.board = board;
        this.box = this.board.box || null;
        // this.checkPoints(p1, p2);
    }

    // Implementing Cohen-Sutherland algorithm

    cohenSutherland() {
        // Compute region codes for P1, P2
        this.minMaxValues = this.board.minMaxValues;
        const INSIDE = 0; // 0000
        const LEFT = 1;   // 0001
        const RIGHT = 2;  // 0010
        const BOTTOM = 4; // 0100
        const TOP = 8;    // 1000
        const x_min = this.minMaxValues.xmin;
        const y_min = this.minMaxValues.ymin;
        const x_max = this.minMaxValues.xmax;
        const y_max = this.minMaxValues.ymax;

        let x1 = this.p1.x;
        let y1 = this.p1.y;
        let x2 = this.p2.x;
        let y2 = this.p2.y;

        const computeOutCode = (x, y) => {

            let code = INSIDE;

            if (x < x_min) { // to the left of clip window
                code |= LEFT;
            } else if (x > x_max) { // to the right of clip window
                code |= RIGHT;
            }
            if (y < y_min) { // below the clip window
                code |= BOTTOM;
            } else if (y > y_max) { // above the clip window
                code |= TOP;
            }
            return code;
        }

        let code1 = computeOutCode(x1, y1);
        let code2 = computeOutCode(x2, y2);

        // Initialize line as outside the rectangular window
        let accept = false;

        while (true) {
            if ((code1 == 0) && (code2 == 0)) {
                // If both endpoints lie within rectangle
                accept = true;
                break;
            }
            else if (code1 & code2) {
                // If both endpoints are outside rectangle,
                // in same region
                break;
            }
            else {
                // Some segment of line lies within the
                // rectangle
                let code_out;
                let x, y;

                // At least one endpoint is outside the
                // rectangle, pick it.
                if (code1 != 0)
                    code_out = code1;
                else
                    code_out = code2;

                // Find intersection point;
                // using formulas y = y1 + slope * (x - x1),
                // x = x1 + (1 / slope) * (y - y1)
                if (code_out & TOP) {
                    // point is above the clip rectangle
                    x = x1 + (x2 - x1) * (y_max - y1) / (y2 - y1);
                    y = y_max;
                }
                else if (code_out & BOTTOM) {
                    // point is below the rectangle
                    x = x1 + (x2 - x1) * (y_min - y1) / (y2 - y1);
                    y = y_min;
                }
                else if (code_out & RIGHT) {
                    // point is to the right of rectangle
                    y = y1 + (y2 - y1) * (x_max - x1) / (x2 - x1);
                    x = x_max;
                }
                else if (code_out & LEFT) {
                    // point is to the left of rectangle
                    y = y1 + (y2 - y1) * (x_min - x1) / (x2 - x1);
                    x = x_min;
                }

                // Now intersection point x, y is found
                // We replace point outside rectangle
                // by intersection point
                if (code_out == code1) {
                    x1 = x;
                    y1 = y;
                    code1 = computeOutCode(x1, y1);
                }
                else {
                    x2 = x;
                    y2 = y;
                    code2 = computeOutCode(x2, y2);
                }
            }
        }
        if (accept) {
            this.board.drawLine({ x: this.p1.x, y: this.board.bh - this.p1.y }, { x: this.p2.x, y: this.board.bh - this.p2.y }, "black");
            console.log("Line accepted from", x1, ",", y1, "to", x2, ",", y2);
            // Here the user can add code to display the rectangle
            // along with the accepted (portion of) lines
            //the y is graphed so that it increases from bottom to top of the canvas
            this.board.drawLine({ x: x1, y: this.board.bh - y1 }, { x: x2, y: this.board.bh - y2 }, "red");
        }
        else {
            console.log("Line rejected");
            this.board.drawLine({ x: this.p1.x, y: this.board.bh - this.p1.y }, { x: this.p2.x, y: this.board.bh - this.p2.y }, "black");
        }
    }


    cyrusBeck() {
        const algorithm = (line, clip_window) => {
            // Loop through each edge of the clip window
            for (let i = 0; i < clip_window.length; i++) {
                // Get the current edge
                this.edge = [clip_window[i], clip_window[(i + 1) % clip_window.length]];

                //Compute the normal vector to the edge
                this.normal = [this.edge[1][1] - this.edge[0][1], this.edge[0][0] - this.edge[1][0]];

                //Compute the dot product between the normal vector and the line vector
                this.dp = this.normal[0] * (line[1][0] - line[0][0]) + this.normal[1] * (line[1][1] - line[0][1]);

                // If the dot product is positive, the line is outside the clip window
                if (this.dp > 0) {
                    // Compute the intersection point between the line and the edge
                    this.t = this.normal[0] * (this.edge[0][0] - line[0][0]) + this.normal[1] * (this.edge[0][1] - line[0][1])
                    this.t = this.t / this.dp;

                    // If t is less than 0, the intersection point is outside the line
                    if (this.t < 0) continue

                    //If t is greater than 1, the intersection point is outside the line
                    if (this.t > 1) continue

                    // Compute the coordinates of the intersection point
                    this.intersection = [line[0][0] + this.t * (line[1][0] - line[0][0]), line[0][1] + this.t * (line[1][1] - line[0][1])]

                    // Update the line with the intersection point as one of its endpoints
                    if (this.dp <= 0) {
                        line = [this.intersection, line[1]]
                        //print(line)
                    }
                    else {
                        line = [line[0], this.intersection]
                        //print(line)
                    }
                }
            }
            return line;
        }
        let clip_window = [[this.box, this.box], [this.box * 2, this.box], [this.box * 2, this.box * 2], [this.box, this.box * 2]];
        let point1 = algorithm([[this.p2.x, this.p2.y], [this.p1.x, this.p1.y]], clip_window);
        let point2 = algorithm([[this.p1.x, this.p1.y], [this.p2.x, this.p2.y]], clip_window);
        let x1 = point1[1][0];
        let y1 = point1[1][1];
        let x2 = point2[1][0];
        let y2 = point2[1][1];
        console.log("original2", this.p1, this.p2)
        // this.board.drawLine({ x: this.p1.x, y: this.board.bh - this.p1.y }, { x: x1, y: this.board.bh - y1 }, "black");
        // this.board.drawLine({ x: x2, y: this.board.bh - y2 }, { x: this.p2.x, y: this.board.bh - this.p2.y }, "black");
        this.board.drawLine({ x: this.p1.x, y: this.board.bh - this.p1.y }, { x: this.p2.x, y: this.board.bh - this.p2.y }, "black");

        console.log(x1, y1, x2, y2)
        console.log(this.box, this.box * 2)
        if (x1 <= this.box * 2 + 1 && x1 >= this.box - 1 && y1 <= this.box * 2 + 1 && y1 >= this.box - 1 &&
            x2 <= this.box * 2 + 1 && x2 >= this.box - 1 && y2 <= this.box * 2 + 1 && y2 >= this.box - 1) {
            this.board.drawLine({ x: x1, y: this.board.bh - y1 }, { x: x2, y: this.board.bh - y2 }, "red")
        }

    }



    sutherlandHodgman(subjectPolygon, clipPolygon) {
        function inside(p, cp1, cp2) {
            return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0])
        }



        for (let i = 0; i < subjectPolygon.length - 1; i++) {
            this.board.drawLine({ x: subjectPolygon[i][0], y: subjectPolygon[i][1] }, { x: subjectPolygon[i + 1][0], y: subjectPolygon[i + 1][1] }, "black");
        }
        this.board.drawLine({ x: subjectPolygon[subjectPolygon.length - 1][0], y: subjectPolygon[subjectPolygon.length - 1][1] }, { x: subjectPolygon[0][0], y: subjectPolygon[0][1] }, "black");


        function computeIntersection(cp1, cp2, e, s) {
            let dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]]
            let dp = [s[0] - e[0], s[1] - e[1]]
            let n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0]
            let n2 = s[0] * e[1] - s[1] * e[0]
            let n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0])
            return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3]

        }



        this.outputList = subjectPolygon

        this.cp1 = clipPolygon[clipPolygon.length - 1];

        for (let clipVertex of clipPolygon) {
            this.cp2 = clipVertex
            this.inputList = this.outputList
            this.outputList = []
            this.s = this.inputList[this.inputList.length - 1]
            for (let subjectVertex of this.inputList) {
                this.e = subjectVertex
                if (inside(this.e, this.cp1, this.cp2)) {
                    if (!inside(this.s, this.cp1, this.cp2)) {
                        this.outputList.push(computeIntersection(this.cp1, this.cp2, this.e, this.s))
                    }
                    this.outputList.push(this.e)
                }

                else if (inside(this.s, this.cp1, this.cp2)) {
                    this.outputList.push(computeIntersection(this.cp1, this.cp2, this.e, this.s))
                }
                this.s = this.e
            }
            this.cp1 = this.cp2
        }



        for (let i = 0; i < this.outputList.length - 1; i++) {
            this.board.drawLine({ x: this.outputList[i][0], y: this.outputList[i][1] }, { x: this.outputList[i + 1][0], y: this.outputList[i + 1][1] }, "red");
        }
        this.board.drawLine({ x: this.outputList[this.outputList.length - 1][0], y: this.outputList[this.outputList.length - 1][1] }, { x: this.outputList[0][0], y: this.outputList[0][1] }, "red");


        return (this.outputList)

    }

}
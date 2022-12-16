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
            console.log("Line accepted from", x1, ",", y1, "to", x2, ",", y2);
            // Here the user can add code to display the rectangle
            // along with the accepted (portion of) lines
            //the y is graphed so that it increases from bottom to top of the canvas
            this.board.drawLine({ x: x1, y: this.board.bh - y1 }, { x: x2, y: this.board.bh - y2 }, "black");
        }
        else
            console.log("Line rejected");
    }


    cyrusBeck() {
        let subjectLine = [[this.p1.x, this.p1.y], [this.p2.x, this.p2.y]];
        let clipPolygon = [[this.box * 2, this.box], [this.box * 2, this.box * 2], [this.box, this.box * 2], [this.box, this.box]];
        console.log("line", subjectLine)
        console.log("polygon", clipPolygon)
        // Compute the direction of the subject line
        let lineDirection = [subjectLine[1][0] - subjectLine[0][0],
        subjectLine[1][1] - subjectLine[0][1]
        ];

        console.log("lineDirection", lineDirection)
        // Set the initial values of the start and end points of the clipped line
        let startPoint = subjectLine[0];
        let endPoint = subjectLine[1];

        // Loop through the edges of the clip polygon
        for (let i = 0; i < clipPolygon.length; i++) {
            let clipEdge = [clipPolygon[i], clipPolygon[(i + 1) % clipPolygon.length]];
            console.log("clip edge", clipEdge)
            // Compute the normal of the clip edge
            let normal = [clipEdge[0][1] - clipEdge[1][1],
            clipEdge[1][0] - clipEdge[0][0]
            ];
            // Compute the dot product of the line direction and the normal
            let d = lineDirection[0] * normal[0] + lineDirection[1] * normal[1];
            console.log("dot product", d)
            // If the dot product is less than or equal to zero,
            // the subject line is outside the clip edge and should be clipped
            if (d <= 0) {
                console.log("ACCEPT");
                // Compute the dot product of the vector from the start point to the first vertex
                // of the clip edge and the normal of the clip edge
                let t = (normal[0] * (clipEdge[0][0] - startPoint[0]) +
                    normal[1] * (clipEdge[0][1] - startPoint[1])) / d;
                console.log("t,", t)
                // If t is in the range [0, 1], the subject line intersects the clip edge
                if (t >= 0 && t <= 1) {
                    // Compute the intersection point
                    let intersection = [startPoint[0] + t * lineDirection[0],
                    startPoint[1] + t * lineDirection[1]
                    ];

                    // Set the intersection point as the new start point
                    startPoint = intersection;
                }
            } else {
                console.log("REJECT")
                // Compute the dot product of the vector from the end point to the first vertex
                // of the clip edge and the normal of the clip edge
                let t = (normal[0] * (clipEdge[0][0] - endPoint[0]) +
                    normal[1] * (clipEdge[0][1] - endPoint[1])) / d;

                // If t is in the range [0, 1], the subject line intersects the clip edge
                if (t >= 0 && t <= 1) {
                    // Compute the intersection point
                    let intersection = [endPoint[0] + t * lineDirection[0],
                    endPoint[1] + t * lineDirection[1]
                    ];

                    // Set the intersection point as the new end point
                    endPoint = intersection;
                }
            }
        }

        console.log("result", startPoint, endPoint)
        // Return the start and end points of the clipped line
        this.board.drawLine({ x: startPoint[0], y: this.board.bh - startPoint[1] }, { x: endPoint[0], y: this.board.bh - endPoint[1] }, "black");
    }

    sutherlandHodgman(subjectPolygon, clipPolygon) {
        function inside(p, cp1, cp2) {
            return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0])
        }


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

        return (this.outputList)

    }

}
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

    cyrusBeckAlgorithm(P, V, L) {

        // P is a point on the line
        // V is the direction vector of the line
        // L is an array of endpoints of the clipping window
        // var P = { x: -250, y: -60 };
        // var V = { x: 240, y: 0 };
        // var L = [
        //     { x: -86.66666666666666, y: -86.66666666666666 },
        //     { x: 86.66666666666669, y: -86.66666666666666 },
        //     { x: 86.66666666666669, y: 86.66666666666669 },
        //     { x: -86.66666666666666, y: 86.66666666666669 }
        // ];
        console.log("P", P);
        // console.log("P2", secondP)
        console.log("V", V)
        console.log("L", L)
        var tE = -Infinity;
        var tL = Infinity;
        var d, n, t;

        // Test against all edges of the clipping window
        for (var i = 0; i < L.length; i++) {
            // Current edge is L[i] to L[i + 1] (wraparound)
            var E = L[i];
            var F = L[(i + 1) % L.length];

            // Compute direction vector of current edge
            var D = {
                x: F.x - E.x,
                y: F.y - E.y
            };

            // Compute normal vector of current edge
            n = {
                x: D.y,
                y: -D.x
            };

            // Compute signed distance from P to current edge
            d = (P.x - E.x) * n.x + (P.y - E.y) * n.y;

            // Compute t for intersection with current edge
            if (V.x * n.x + V.y * n.y !== 0) {
                t = d / (V.x * n.x + V.y * n.y);
            } else {
                // Line is parallel to current edge
                if (d === 0) {
                    // Line is contained within the clipping window
                    return [P, P];
                } else {
                    // Line is outside the clipping window
                    continue;
                }
            }

            // Update tE and tL
            if (V.x * n.x + V.y * n.y > 0) {
                if (t > tE) {
                    tE = t;
                }
            } else {
                if (t < tL) {
                    tL = t;
                }
            }

            // If tE >= tL, line is outside the clipping window
            if (tE >= tL) {
                return false;
            }
        }

        // Compute the endpoints of the clipped line
        var P1 = {
            x: P.x + tE * V.x,
            y: P.y + tE * V.y
        };
        var P2 = {
            x: P.x + tL * V.x,
            y: P.y + tL * V.y
        };
        return [P1, P2];
    }

    cyrusBeck() {
        // Define the arguments
        var P = { x: -250, y: -60 };
        var V = { x: 240, y: 0 };
        var L = [
            { x: -86.66666666666666, y: -86.66666666666666 },
            { x: 86.66666666666669, y: -86.66666666666666 },
            { x: 86.66666666666669, y: 86.66666666666669 },
            { x: -86.66666666666666, y: 86.66666666666669 }
        ];
        let clippedLine = this.cyrusBeckAlgorithm(P, V, L);
        // Output the result
        if (clippedLine) {
            console.log("Clipped line:", clippedLine);
            this.board.drawLine({ x: clippedLine[0].x + this.board.bw / 2, y: clippedLine[0].y + this.board.bh / 2 }, { x: clippedLine[1].x + this.board.bw / 2, y: clippedLine[1].y + this.board.bh / 2 }, "black")
        } else {
            console.log("Line is outside the clipping window");
        }
    }






}
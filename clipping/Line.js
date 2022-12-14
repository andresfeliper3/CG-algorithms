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



}
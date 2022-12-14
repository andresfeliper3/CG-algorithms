export class Board {
    constructor(ctx, bw, bh) {
        this.ctx = ctx;
        this.bw = bw;
        this.bh = bh;
    }

    /* drawBoard: width, height, boxes in a row
    This functions draws the board with boxes
    */
    drawBoard(algorithm) {
        this.algorithm = algorithm;
        if (this.algorithm == "cohenSutherland") {
            this.box = this.bw / (2 + 1);
            this.minMaxValues = { xmin: this.box, xmax: this.box * 2, ymin: this.box, ymax: this.box * 2 }
            const lw = 1; // box border
            // box size
            this.ctx.lineWidth = lw;
            this.ctx.strokeStyle = "rgb(219, 213, 185)";
            //boxes
            this.drawBoxes(this.bw, this.bh, this.box);
        }
        else if (this.algorithm == "cyrusBeck" || this.algorithm == "sutherlandHodgman") {
            this.box = this.bw / (2 + 1);
            const lw = 1; // box border
            // box size
            this.ctx.lineWidth = lw;
            this.ctx.strokeStyle = "rgb(219, 213, 185)";
            //boxes
            this.drawBoxes(this.bw, this.bh, this.box);
        }

        //numbers
        //this.drawNumbers();
    }
    drawBoxes() {
        if (this.algorithm == "cohenSutherland") {
            for (let x = 0; x < this.bw; x += this.box) {
                for (let y = 0; y < this.bh; y += this.box) {
                    this.ctx.strokeRect(x, y, this.box, this.box);
                }
            }
        }
        else if (this.algorithm == "cyrusBeck" || this.algorithm == "sutherlandHodgman") {
            for (let x = 0; x < this.bw; x += this.box) {
                for (let y = 0; y < this.bh; y += this.box) {
                    if (x == this.box && y == this.box) {
                        this.ctx.strokeRect(x, y, this.box, this.box);
                    }
                }
            }
        }
    }
    // drawNumbers() {
    //     let size = 0.5 * this.box;
    //     this.ctx.font = `${size}px Arial`;
    //     this.ctx.fillStyle = "black";
    //     this.ctx.textAlign = "center";
    //     if (this.origin == "Upper-left") {
    //         let number = 0
    //         for (let i = this.box; i < this.bw; i += this.box) {
    //             //horizontal numbers
    //             this.ctx.fillText(number, i + (0.5 * this.box), this.box / 1.55);
    //             //vertical numbers
    //             this.ctx.fillText(number, this.box / 2.1, i + (0.65 * this.box));
    //             number++;
    //         }
    //     }
    //     else if (this.origin == "Centered") {
    //         let number = 0

    //         for (let i = this.box; i < this.bw / 2; i += this.box) {
    //             //horizontal positive numbers
    //             this.ctx.fillText(number, this.origin_pos.x - (0.5 * this.box) + i, this.box / 1.55);
    //             //horizontal negative numbers
    //             this.ctx.fillText(number * -1, this.origin_pos.x + this.box + (0.5 * this.box) - i, this.box / 1.55);
    //             //vertical negative numbers
    //             this.ctx.fillText(number * -1, this.box / 2.1, this.origin_pos.y - (0.3 * this.box) + i);
    //             //vertical positive numbers
    //             this.ctx.fillText(number, this.box / 2.1, this.origin_pos.x + this.box + (0.7 * this.box) - i);
    //             number++;


    //         }
    //     }
    // }
    clearBoard() {
        this.ctx.clearRect(0, 0, this.bw, this.bh);
        //clear numbers

        this.ctx.fillStyle = "#fff";
        for (let i = 0; i < this.bw; i += this.box) {
            //horizontal numbers
            this.ctx.fillRect(i, 0, this.box, this.box);
            //vertical numbers
            this.ctx.fillRect(0, i, this.box, this.box);
        }
    }


    /** drawPoint
     * This functions paitns the whole box that starts at (x,y) with color indicated in style and height and width defined by box.
     */
    drawPoint(x, y, style) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(x, y, 1, 1);
    }

    /**
     * drawLine
     * 
     */

    drawLine(p1, p2, style) {
        this.ctx.strokeStyle = style;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

    }
    /**
     * toDrawable: cartesian coordinates in JSON, origin in JSON-> drawable coordinates
     * @param {JSON} p
     * @param {JSON} origin
     * @param {number} box
     * This function converts from cartesian coordinates to canvas coordinates, in order to paint
     */
    toDrawable(p, origin) {
        return {
            x: p.x * this.box + origin.x,
            y: -p.y * this.box + origin.y,
        };
    }
}

export class Board {
    constructor(ctx, bw, bh, boxes, origin) {
        this.ctx = ctx;
        this.bw = bw;
        this.bh = bh;
        this.boxes = boxes;
        this.box = this.bw / (this.boxes + 1);
        this.origin = origin;
        //Calculate origin position in centered
        this.origin_pos = {
            x: this.box * Math.ceil(this.boxes / 2),
            y: this.box * Math.ceil(this.boxes / 2)
        };
    }
    /* drawBoard: width, height, boxes in a row
    This functions draws the board with boxes
    */
    drawBoard(origin, boxes) {
        this.origin = origin;
        // canvas dims
        this.boxes = boxes;
        this.box = this.bw / (this.boxes + 1);
        const lw = 1; // box border
        // box size
        this.ctx.lineWidth = lw;
        this.ctx.strokeStyle = "rgb(219, 213, 185)";
        //boxes
        this.drawBoxes(this.bw, this.bh, this.box);
        //numbers
        this.drawNumbers();
    }
    drawBoxes() {
        for (let x = this.box; x < this.bw; x += this.box) {
            for (let y = this.box; y < this.bh; y += this.box) {
                this.ctx.strokeRect(x, y, this.box, this.box);
            }
        }
    }
    drawNumbers() {
        let size = 0.5 * this.box;
        this.ctx.font = `${size}px Arial`;
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        if (this.origin == "Upper-left") {
            let number = 0
            for (let i = this.box; i < this.bw; i += this.box) {
                //horizontal numbers
                this.ctx.fillText(number, i + (0.5 * this.box), this.box / 1.55);
                //vertical numbers
                this.ctx.fillText(number, this.box / 2.1, i + (0.65 * this.box));
                number++;
            }
        }
        else if (this.origin == "Centered") {
            let number = 0

            for (let i = this.box; i < this.bw / 2; i += this.box) {
                //horizontal positive numbers
                this.ctx.fillText(number, this.origin_pos.x - (0.5 * this.box) + i, this.box / 1.55);
                //horizontal negative numbers
                this.ctx.fillText(number * -1, this.origin_pos.x + this.box + (0.5 * this.box) - i, this.box / 1.55);
                //vertical negative numbers
                this.ctx.fillText(number * -1, this.box / 2.1, this.origin_pos.y - (0.3 * this.box) + i);
                //vertical positive numbers
                this.ctx.fillText(number, this.box / 2.1, this.origin_pos.x + this.box + (0.7 * this.box) - i);
                number++;


            }
        }
    }
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
    /** This functions paints the origin in the drawboard */
    graphOrigin(origin) {
        this.origin = origin;
        if (this.origin == "Upper-left") {
            this.drawPoint(this.box, this.box, "red");
        } else if (this.origin == "Centered") {
            this.drawPoint(
                this.box * Math.ceil(this.boxes / 2),
                this.box * Math.ceil(this.boxes / 2),
                "red"
            );
        }
    }

    /** drawPoint
     * This functions paitns the whole box that starts at (x,y) with color indicated in style and height and width defined by box.
     */
    drawPoint(x, y, style) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(x, y, this.box, this.box);
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

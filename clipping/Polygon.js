export class Polygon {
    constructor(board) {
        this.color = "black";
        this.board = board;
        this.box = this.board.box || null;
        // this.checkPoints(p1, p2);
    }

    sutherlandHodgman(subjectPolygon, clipPolygon) {
        //draw original polygon
        for (let i = 0; i < subjectPolygon.length - 1; i++) {
            this.board.drawLine({ x: subjectPolygon[i][0], y: this.board.bh - subjectPolygon[i][1] }, { x: subjectPolygon[i + 1][0], y: this.board.bh - subjectPolygon[i + 1][1] }, "black");
        }
        this.board.drawLine({ x: subjectPolygon[subjectPolygon.length - 1][0], y: this.board.bh - subjectPolygon[subjectPolygon.length - 1][1] }, { x: subjectPolygon[0][0], y: this.board.bh - subjectPolygon[0][1] }, "black");

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
        for (let i = 0; i < this.outputList.length - 1; i++) {
            this.board.drawLine({ x: this.outputList[i][0], y: this.board.bh - this.outputList[i][1] }, { x: this.outputList[i + 1][0], y: this.board.bh - this.outputList[i + 1][1] }, "red");
        }
        this.board.drawLine({ x: this.outputList[this.outputList.length - 1][0], y: this.board.bh - this.outputList[this.outputList.length - 1][1] }, { x: this.outputList[0][0], y: this.board.bh - this.outputList[0][1] }, "red");
        return (this.outputList)
    }
}
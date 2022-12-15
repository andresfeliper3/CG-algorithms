import { Board } from "./Board.js";
import { Line } from "./Line.js";

/* CANVAS */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Graph
const graphType = document.getElementById('options__clipping-graph');
const algorithm = document.getElementById('options__algorithm');
const details = document.getElementById("details");
const details_p = document.getElementById("details-box__description");
const btn = document.getElementById("graph-button");


/* Canvas dimensions */
const bw = 520;
const bh = 520;

const board = new Board(ctx, bw, bh, algorithm.value);

/**
 * placeDetails:
 * @param {*} graphType
 * This function place the details inputs to select the parameters that must be used to graph
 */
function placeDetails(graphType) {
    //Remove the other details
    while (details.hasChildNodes()) {
        details.removeChild(details.lastChild);
    }
    //Place the new details
    if (graphType == "Line") {
        const x1 = document.createElement("input");
        const y1 = document.createElement("input");
        const x2 = document.createElement("input");
        const y2 = document.createElement("input");
        details_p.innerHTML =
            "In order to graph a line, you must specify two points P(x1, y1) and Q(x2, y2). Use coordinates in the interval (0-520).";
        x1.setAttribute("placeholder", "x1");
        y1.setAttribute("placeholder", "y1");
        x2.setAttribute("placeholder", "x2");
        y2.setAttribute("placeholder", "y2");
        x1.setAttribute("id", "x1");
        y1.setAttribute("id", "y1");
        x2.setAttribute("id", "x2");
        y2.setAttribute("id", "y2");
        details.appendChild(x1);
        details.appendChild(y1);
        details.appendChild(x2);
        details.appendChild(y2);
    } else if (graphType == "Polygon") {
        // const h = document.createElement("input");
        // const k = document.createElement("input");
        // const r = document.createElement("input");
        // details_p.innerHTML =
        //     "In order to graph a circumference, you must specify a center C(h, k) and a radius r.";
        // h.setAttribute("placeholder", "h");
        // k.setAttribute("placeholder", "k");
        // r.setAttribute("placeholder", "r");
        // h.setAttribute("id", "h");
        // k.setAttribute("id", "k");
        // r.setAttribute("id", "r");
        // //
        // if (originPosition.value == "Upper-left") {
        //     h.style.display = 'none';
        //     k.style.display = 'none';
        // }
        // details.appendChild(h);
        // details.appendChild(k);
        // details.appendChild(r);
    }
}

/** placeAlgorithms
 * This function place the correct algorithms in the select input according to the selected type of graph
 */
function placeAlgorithms(graphType) {
    //Remove the other algorithms
    while (algorithm.options.length > 0) {
        algorithm.remove(0);
    }
    //Show algorithms according to graph type
    if (graphType == "Line") {
        let cohenSutherland = new Option("Cohen-Sutherland", "cohenSutherland");
        let cyrusBeck = new Option("Cyrus-Beck", "cyrusBeck");
        algorithm.add(cyrusBeck);
        algorithm.add(cohenSutherland);

    } else if (graphType == "Polygon") {
        let sutherlandHodgman = new Option("Sutherland-Hodgman", "sutherlandHodgman");
        let weilerAtherton = new Option("Weiler-Atherton", "weilerAtherton");
        algorithm.add(sutherlandHodgman);
        algorithm.add(weilerAtherton);
    }
}


/*EVENTS */

graphType.addEventListener("change", () => {
    //Replace details options
    setup();
});

algorithm.addEventListener("change", () => {
    board.clearBoard();
    board.drawBoard(algorithm.value);
});

btn.addEventListener("click", () => {

    graph(
        graphType.value,
        algorithm.value,
    );
});



function setup() {
    placeAlgorithms(graphType.value);
    placeDetails(graphType.value);
    board.drawBoard(algorithm.value);
}
setup();

/**
 * useAlgorithm
 * @param {*} graphType
 * @param {*} algorithm
 * @param {*} box
 * This function graphs the figure according to the graph type, the algorithm and the length of a box
 */
function useAlgorithm(graphType, algorithm, board) {
    if (graphType == "Line") {
        const x1 = parseInt(document.getElementById("x1").value) || 0;
        const y1 = parseInt(document.getElementById("y1").value) || 0;
        const x2 = parseInt(document.getElementById("x2").value) || 0;
        const y2 = parseInt(document.getElementById("y2").value) || 0;
        const line = new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, board);
        if (algorithm == "cohenSutherland") {
            // board.ctx.setLineDash([5, 5]);
            // board.drawLine({ x: x1, y: board.bh - y1 }, { x: x2, y: board.bh - y2 }, "red");
            line.cohenSutherland();
        }
        else if (algorithm == "cyrusBeck") {
            line.cyrusBeck();
        }
    } else if (graphType == "Polygon") {
        //     const h = parseInt(document.getElementById("h").value) || 0;
        //     const k = parseInt(document.getElementById("k").value) || 0;
        //     const r = parseInt(document.getElementById("r").value) || 0;
        //     const circle = new Circle({ h: h, k: k }, r, board);
        //     if (algorithm == "bresenham") {
        //         circle.bresenhamsAlgorithm();
        //     } else if (algorithm == "mid-point") {
        //         circle.midPointCircleAlgorithm();
        //     }
    }
}

/** Graph
 * This functions graphs according to the options
 */
function graph(graphType, algorithm) {
    board.clearBoard();
    board.drawBoard(algorithm);
    useAlgorithm(graphType, algorithm, board);
}


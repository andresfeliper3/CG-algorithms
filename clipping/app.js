import { Board } from "./Board.js";
import { Line } from "./Line.js";
import { Polygon } from "./Polygon.js";

/* CANVAS */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Graph
const graphType = document.getElementById('options__clipping-graph');
const algorithm = document.getElementById('options__algorithm');
const details = document.getElementById("details");
const details_p = document.getElementById("details-box__description");
const btn = document.getElementById("graph-button");

//Polygons
const amount = document.createElement("input");
const amountBtn = document.createElement("button");

/* Canvas dimensions */
const bw = 520;
const bh = 520;

const board = new Board(ctx, bw, bh, algorithm.value);


function addAmountBtn() {
    amount.setAttribute("placeholder", "n");
    amountBtn.setAttribute("id", "amountBtn");
    amountBtn.innerHTML = "Add";
    details.appendChild(amount);
    details.appendChild(amountBtn);
}

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
        details_p.innerHTML = "Select the number of vertices and enter their coordinates. They must be between (0-520). The polygon is graphed in order."
        // const h = document.createElement("input");
        // const k = document.createElement("input");
        // const r = document.createElement("input");


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
        addAmountBtn();
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
        algorithm.add(cohenSutherland);
        algorithm.add(cyrusBeck);

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

let polygonVertices = [];
amountBtn.addEventListener("click", () => {
    details.innerHTML = "";
    addAmountBtn();
    for (let i = 0; i < parseInt(amount.value) * 2; i++) {
        polygonVertices.push(document.createElement("input"));
        polygonVertices[i].style.display = "inline-block";
        let placeholder = "";
        if (i % 2 == 0) {
            placeholder = `x${i / 2}`
        }
        else {
            placeholder = `y${(i - 1) / 2}`
        }
        polygonVertices[i].setAttribute("placeholder", placeholder);
        details.appendChild(polygonVertices[i]);
    }
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
            line.cyrusBeck()
        }
    } else if (graphType == "Polygon") {
        const polygon = new Polygon(board);
        if (algorithm == "sutherlandHodgman" || algorithm == "weilerAtherton") {
            //    # polígono sujeto
            // let subject_polygon = [[50, 150], [200, 50], [350, 150], [350, 300], [250, 300], [200, 250], [150, 350], [100, 250], [100, 200]]
            //polígono sujeto
            let verticesValues = polygonVertices.map(elem => parseInt(elem.value) || 0);
            let subject_polygon = [];
            for (let i = 0; i < verticesValues.length; i += 2) {
                subject_polygon.push([verticesValues[i], verticesValues[i + 1]]);
            }
            // # polígono de recorte
            let clip_polygon = [[board.box, board.box], [board.box * 2, board.box], [board.box * 2, board.box * 2], [board.box, board.box * 2]]

            // #Polígono resultante
            polygon.sutherlandHodgman(subject_polygon, clip_polygon)
        }

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


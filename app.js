


//CLASSES
import { Line } from "./Line.js";

/* CANVAS */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Button and graph
const btn = document.getElementById('graph-button');
const originPosition = document.getElementById('options__origin-position');
const graphType = document.getElementById('options__graph-type');
const algorithm = document.getElementById('options__algorithm');
const boxes = document.getElementById('options__boxes');
const details = document.getElementById('details')
const details_p = document.getElementById('details-box__description');

/* Canvas dimensions */
const bw = 520;
const bh = 520;
const box = bw / (boxes.value + 1);

/* drawBoard: width, height, boxes in a row
    This functions draws the board with boxes
*/
function drawBoard(bw, bh, box) {
    // canvas dims
    const lw = 1              // box border
    // box size
    ctx.lineWidth = lw
    ctx.strokeStyle = 'rgb(219, 213, 185)';
    //boxes
    drawBoxes(bw, bh, box);
    //numbers
    drawNumbers(bw, bh, box);
}

function drawBoxes(bw, bh, box) {
    for (let x = box; x < bw; x += box) {
        for (let y = box; y < bh; y += box) {
            ctx.strokeRect(x, y, box, box);
        }
    }
}

function drawNumbers(bw, bh, box) {
    for (let x = 0; x < bw; x += box) {
        //paint numbers
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
        let basic = new Option('Basic Algorithm', 'Basic');
        let dda = new Option('Digital differential analyzer', 'dda');
        let bresenham = new Option('Bresenham\'s algorithm', 'bresenham');
        algorithm.add(basic);
        algorithm.add(dda);
        algorithm.add(bresenham);
    }
    else if (graphType == "Circle") {
        let dda = new Option('Digital differential analyzer', 'dda');
        let bresenham = new Option('Bresenham\'s algorithm', 'bresenham');
        algorithm.add(dda);
        algorithm.add(bresenham);
    }
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
        const x1 = document.createElement('input');
        const y1 = document.createElement('input');
        const x2 = document.createElement('input');
        const y2 = document.createElement('input');
        details_p.innerHTML = "In order to graph a line, you must specify two points P(x1, y1) and Q(x2, y2).";
        x1.setAttribute('placeholder', "x1");
        y1.setAttribute('placeholder', "y1");
        x2.setAttribute('placeholder', "x2");
        y2.setAttribute('placeholder', "y2");
        x1.setAttribute('id', 'x1');
        y1.setAttribute('id', 'y1');
        x2.setAttribute('id', 'x2');
        y2.setAttribute('id', 'y2');
        details.appendChild(x1);
        details.appendChild(y1);
        details.appendChild(x2);
        details.appendChild(y2);
    }
    else if (graphType == "Circle") {
        const h = document.createElement('input');
        const k = document.createElement('input');
        const r = document.createElement('input');
        details_p.innerHTML = "In order to graph a circumference, you must specify a center C(h, k) and a radius r.";
        h.setAttribute('placeholder', "h");
        k.setAttribute('placeholder', "k");
        r.setAttribute('placeholder', "r");
        h.setAttribute('id', 'h');
        k.setAttribute('id', 'k');
        r.setAttribute('id', 'r');
        details.appendChild(h);
        details.appendChild(k);
        details.appendChild(r);
    }
}
function setup() {
    let box = bw / (parseInt(boxes.value) + 1);
    placeAlgorithms(graphType.value);
    placeDetails(graphType.value);
    drawBoard(bw, bh, box);
    graphOrigin(originPosition.value, parseInt(boxes.value));
}
setup();

/*EVENTS */
graphType.addEventListener('change', () => {
    placeAlgorithms(graphType.value);
    placeDetails(graphType.value);
});

btn.addEventListener('click', () => {
    graph(originPosition.value, graphType.value, algorithm.value, parseInt(boxes.value));
});

//YOU MUST CHECK THESE VALUES

/** Graph
 * This functions graphs according to the options
 */
function graph(origin, graphType, algorithm, boxes) {
    let box = bw / (boxes + 1);
    ctx.clearRect(0, 0, bw, bh);
    drawBoard(bw, bh, box);
    graphOrigin(origin, boxes);
    useAlgorithm(origin, graphType, algorithm, box, boxes);
}

/** This functions paints the origin in the drawboard */
function graphOrigin(origin, boxes) {
    let box = bw / (boxes + 1); //width of a box
    if (origin == "Upper-left") {
        drawPoint(box, box, "red", box);
    }
    else if (origin == "Centered") {
        drawPoint(box * Math.ceil(boxes / 2), box * Math.ceil(boxes / 2), "red", box);
    }
}

/** drawPoint
 * This functions paitns the whole box that starts at (x,y) with color indicated in style and height and width defined by box.
 */
function drawPoint(x, y, style, box) {
    ctx.fillStyle = style;
    ctx.fillRect(x, y, box, box);
}

/**
 * useAlgorithm
 * @param {*} graphType 
 * @param {*} algorithm 
 * @param {*} box 
 * This function graphs the figure according to the graph type, the algorithm and the length of a box
 */
function useAlgorithm(origin, graphType, algorithm, box, boxes) {
    if (graphType == "Line") {
        const x1 = parseInt(document.getElementById('x1').value);
        const y1 = parseInt(document.getElementById('y1').value);
        const x2 = parseInt(document.getElementById('x2').value);
        const y2 = parseInt(document.getElementById('y2').value);
        const line = new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, boxes, origin, toDrawable);
        if (algorithm == "Basic") {
            line.basicAlgorithm(box, origin);
        }
        else if (algorithm == "dda") {
            line.digitalDifferentialAnalyzer(box, origin);
        }
        else if (algorithm == "bresenham") {
            line.bresenhamsAlgorithm(box, origin);
        }
    }
}

/**
 * toDrawable: cartesian coordinates in JSON, origin in JSON-> drawable coordinates
 * @param {JSON} p 
 * @param {JSON} origin
 * @param {number} box
 * This function converts from cartesian coordinates to canvas coordinates, in order to paint
 */
function toDrawable(p, origin, box) {
    return {
        x: p.x * box + origin.x,
        y: -p.y * box + origin.y
    }
}

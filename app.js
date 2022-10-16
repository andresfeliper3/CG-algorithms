
/* CANVAS */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Button and graph
const btn = document.getElementById('options__graph-button');
const originPosition = document.getElementById('options__origin-position');
const graphType = document.getElementById('options__graph-type');
const algorithm = document.getElementById('options__algorithm');
const boxes = document.getElementById('options__boxes');

/* Canvas dimensions */
const bw = 500;
const bh = 500;
const DEFAULT_BOX = bw / 20;
/* drawBoard: width, height, boxes in a row
    This functions draws the board with boxes
*/
function drawBoard(bw, bh, box) {
    // canvas dims
    const lw = 1              // box border
    // box size
    ctx.lineWidth = lw
    ctx.strokeStyle = 'rgb(219, 213, 185)'
    for (let x = 0; x < bw; x += box) {
        for (let y = 0; y < bh; y += box) {
            ctx.strokeRect(x, y, box, box)
        }
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
        let midPoint = new Option('Mid-Point Line Generation Algorithm', 'Midpoint');
        let bresenham = new Option('Bresenham\'s algorithm', 'bresenham');
        algorithm.add(basic);
        algorithm.add(midPoint);
        algorithm.add(bresenham);
    }
    else if (graphType == "Circle") {
        let midPoint = new Option('Mid-Point Line Generation Algorithm', 'Midpoint');
        let bresenham = new Option('Bresenham\'s algorithm', 'bresenham');
        algorithm.add(midPoint);
        algorithm.add(bresenham);
    }
}

function setup() {
    placeAlgorithms(graphType.value);
    graph(originPosition.value, graphType.value, algorithm.value, parseInt(boxes.value));
}
setup();

/*EVENTS */
graphType.addEventListener('change', () => {
    placeAlgorithms(graphType.value);
})

btn.addEventListener('click', () => {
    graph(originPosition.value, graphType.value, algorithm.value, parseInt(boxes.value));
});

//YOU MUST CHECK THESE VALUES

/** Graph
 * This functions graphs according to the options
 */
function graph(origin, graphType, algorithm, boxes) {
    ctx.clearRect(0, 0, bw, bh);
    drawBoard(bw, bh, bw / boxes)
    graphOrigin(origin, boxes);
    useAlgorithm(graphType, algorithm);
}

/** This functions paints the origin in the drawboard */
function graphOrigin(origin, boxes) {
    let box = bw / boxes; //width of a box
    if (origin == "Upper-left") {
        drawPoint(0, 0, "red", box);
    }
    else if (origin == "Centered") {
        drawPoint(box * (boxes / 2), box * (boxes / 2), "red", box);
    }
}

/** drawPoint
 * This functions paitns the whole box that starts at (x,y) with color indicated in style and height and width defined by box.
 */
function drawPoint(x, y, style, box) {
    console.log(x, y, style, box)
    ctx.fillStyle = style;
    ctx.fillRect(x, y, box, box);
}

/**
 * 
 * @param {*} algorithm 
 * 
 */
function useAlgorithm(graphType, algorithm) {
    if (graphType == "Line") {

    }
}
const INSIDE = 0; // 0000
const LEFT = 1;   // 0001
const RIGHT = 2;  // 0010
const BOTTOM = 4; // 0100
const TOP = 8;    // 1000

const x_min = 0;
const y_min = 0;
const x_max = 100;
const y_max = 100;

function computeOutCode(x, y) {
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

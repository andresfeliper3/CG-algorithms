const typeColor1 = document.getElementById('typeColor1');
const typeColor2 = document.getElementById('typeColor2');
const typeColor3 = document.getElementById('typeColor3');
const chooseColor = document.getElementById('chooseColor');
const colorTransformation = document.getElementById('color-transformation');
const btn = document.getElementById('graph-button');
const result = document.getElementById('result-text');


/*
change event
*/
colorTransformation.addEventListener('change', () => {
    const selectedTransformation = colorTransformation.options[colorTransformation.selectedIndex].value;
    const options = {
        "rgbToHsv": ["R", "G", "B"],
        "rgbToHsl": ["R", "G", "B"],
        "rgbToCmy": ["R", "G", "B"],
        "hsvToRgb": ["H", "S", "V"],
        "hslToRgb": ["H", "S", "L"],
        "cmyToRgb": ["C", "M", "Y"],
    }
    typeColor1.placeholder = options[selectedTransformation][0];
    typeColor2.placeholder = options[selectedTransformation][1];
    typeColor3.placeholder = options[selectedTransformation][2];

});


/*
CLICK EVENT
*/
btn.addEventListener('click', () => {
    const selectedTransformation = colorTransformation.options[colorTransformation.selectedIndex].value;
    result.innerHTML = transform([typeColor1.value, typeColor2.value, typeColor3.value], selectedTransformation);
});

function transform(colorElems, transformation) {
    console.log(chooseColor.value)
    console.log("transformation", transformation)
    const options = {
        "rgbToHsl": () => rgbToHsl(colorElems[0], colorElems[1], colorElems[2]),
        "rgbToHsv": () => rgbToHsv(colorElems[0], colorElems[1], colorElems[2]),
        "rgbToCmy": () => rgbToCmy(colorElems[0], colorElems[1], colorElems[2]),
        "hsvToRgb": () => hsv2rgb(colorElems[0], colorElems[1], colorElems[2]),
        "hslToRgb": () => hsl2rgb(colorElems[0], colorElems[1], colorElems[2]),
        "cmyToRgb": () => cmyToRgb(colorElems[0], colorElems[1], colorElems[2])
    }
    const result = options[transformation]();
    return resultFormat(result);
}

function resultFormat(resultList) {
    const roundedResultList = resultList.map(e => e.toFixed(2));
    return roundedResultList.join(', ');
}

function rgbToHsv(R, G, B) {
    let r_prim = R / 255;
    let g_prim = G / 255;
    let b_prim = B / 255;

    let cMax = Math.max(r_prim, g_prim, b_prim);
    let cMin = Math.min(r_prim, g_prim, b_prim);
    let delta = cMax - cMin;

    let H = 0;
    let S = cMax == 0 ? 0 : delta / cMax;
    let V = cMax;

    if (delta == 0) {
        H = 0;
    } else if (cMax == r_prim) {
        H = (60 * ((g_prim - b_prim) / delta)) % 6;
    } else if (cMax == g_prim) {
        H = 60 * ((b_prim - r_prim) / delta + 2);
    } else {
        H = 60 * ((r_prim - g_prim) / delta + 4);
    }

    return [H, S * 100, V * 100];
}

function rgbToHsl(R, G, B) {
    let r_prim = R / 255;
    let g_prim = G / 255;
    let b_prim = B / 255;

    let cMax = Math.max(r_prim, g_prim, b_prim);
    let cMin = Math.min(r_prim, g_prim, b_prim);
    let delta = cMax - cMin;

    let H = 0;
    let L = (cMax + cMin) / 2;
    let S = cMax == 0 ? 0 : delta / (1 - Math.abs(2 * L - 1));

    if (delta == 0) {
        H = 0;
    } else if (cMax == r_prim) {
        H = (60 * ((g_prim - b_prim) / delta)) % 6;
    } else if (cMax == g_prim) {
        H = 60 * ((b_prim - r_prim) / delta + 2);
    } else {
        H = 60 * ((r_prim - g_prim) / delta + 4);
    }

    return [H, S * 100, L * 100];
}

function rgbToCmy(R, G, B) {
    let r_prim = R / 255;
    let g_prim = G / 255;
    let b_prim = B / 255;

    let C = 1 - r_prim;
    let M = 1 - g_prim;
    let Y = 1 - b_prim;

    return [C, M, Y];
}

function hsv2rgb(H, S, V) {
    const s = S / 100;
    const v = V / 100;
    const C = s * v;
    const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    const m = v - C;
    let r;
    let g;
    let b;
    if (H >= 0 && H < 60) {
        r = C;
        g = X;
        b = 0;
    }
    else if (H >= 60 && H < 120) {
        r = X;
        g = C;
        b = 0;
    }
    else if (H >= 120 && H < 180) {
        r = 0;
        g = C;
        b = X;
    }
    else if (H >= 180 && H < 240) {
        r = 0;
        g = X;
        b = C;
    }
    else if (H >= 240 && H < 300) {
        r = X;
        g = 0;
        b = C;
    }
    else if (H >= 300 && H < 360) {
        r = C;
        g = 0;
        b = X;
    }
    const R = (r + m) * 255;
    const G = (g + m) * 255;
    const B = (b + m) * 255;
    console.log("r", r, "g", g, "b", b, "m", m);
    console.log("show", R, G, B);
    return [R, G, B];
}

function hsl2rgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
}


function cmyToRgb(C, M, Y) {
    const r = Math.round((1 - C) * 255);
    const g = Math.round((1 - M) * 255);
    const b = Math.round((1 - Y) * 255);
    return [r, g, b];
}

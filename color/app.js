


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

    let K = 1 - Math.max(r_prim, g_prim, b_prim);
    let C = (1 - r_prim - K) / (1 - K);
    let M = (1 - g_prim - K) / (1 - K);
    let Y = (1 - b_prim - K) / (1 - K);

    return [C * 100, M * 100, Y * 100];
}

function hsv2rgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5) * 100, f(3) * 100, f(1) * 100];
}

function hsl2rgb(h, s, l) {
    let a = s * Math.min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0) * 255, f(8) * 255, f(4) * 255];
}


function cmyToRgb(C, M, Y) {
    let K = Math.min(C, M, Y);
    let r = 255 * (1 - C) * (1 - K);
    let g = 255 * (1 - M) * (1 - K);
    let b = 255 * (1 - Y) * (1 - K);

    return [r, g, b];
}

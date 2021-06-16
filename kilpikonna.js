const canvas = document.getElementById("canvas");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

/**
 * 
 * @param {function([number, number, number][]): [number, number]} strategy 
 * @param {[number, number, number]} trigrams 
 */
export function drawWithTrigrams(strategy, trigrams, config) {
    let points = strategy(trigrams);
    draw(points, config);
}

/**
 * 
 * @param {Array<[number, number]>} points 
 * @param {{
 *  color: string | number;
 *  drawPoints: boolean;
 *  drawLines: boolean;
 * }} config 
 */
function draw(points, config) {
    let min_x = 0,
        min_y = 0,
        max_x = 0,
        max_y = 0;
    for (let [x, y] of points) {
        min_x = Math.min(min_x, x);
        min_y = Math.min(min_y, y);
        max_x = Math.max(max_x, x);
        max_y = Math.max(max_y, y);
    }
    // Add a little padding
    min_x *= 1.1;
    max_x *= 1.1;
    min_y *= 1.1;
    max_y *= 1.1;

    ctx.save();
    // Make those the corners of the canvas
    // thank god i took linear algebra
    let centerX = (max_x + min_x) / 2;
    let centerY = (max_y + min_y) / 2;
    ctx.translate(canvas.clientWidth / 2 - centerX, canvas.clientHeight / 2 - centerY);

    // We want maxX to be scaled to the width, and -minX to be the width.
    // the largest wins.
    let xDim = Math.max(max_x, -min_x);
    let xScale = canvas.clientWidth / xDim / 2;
    let yDim = Math.max(max_y, -min_y);
    let yScale = canvas.clientHeight / yDim / 2;
    ctx.scale(xScale, yScale);

    let color;
    if (typeof config.color == "number") {
        color = indexedColor(config.color);
    } else {
        color = config.color;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(xDim, yDim) / 400;

    for (let i = 0; i < points.length; i++) {
        let [x, y] = points[i];
        if (config.drawPoints) {
            ctx.beginPath();
            ctx.arc(x, y, ctx.lineWidth * 5, 0, 6.29);
            ctx.fill();
        }
        if (config.drawLines && i > 0) {
            let [prevX, prevY] = points[i - 1];
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    ctx.restore();

}

// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function indexedColor(idx) {
    const goldenRatio = 0.618033988749895;
    let hue = Math.trunc(idx * goldenRatio);
    let {
        r,
        g,
        b
    } = HSVtoRGB(hue, 0.9, 1.0);
    return `rgb(${r}, ${g}, ${b})`;
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
 */
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
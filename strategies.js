/**
 * Strategies take lists of either 3-tuples of numbers (for trigrams)
 * or single numbers (for rows).
 * The numbers should be in the format the game uses:
 * - 0 = center
 * - 1 = up
 * - 2 = right
 * - 3 = left
 * - 4 = down
 * 
 * It should return a list of 2-tuples of numbers in order.
 * Kilpikonna will draw lines between those points.
 * (Magnitude doesn't matter, it will scale them accordingly.)
 */

/**
 * Use each trigram as a coordinate system.
 * - The first eye gives the first sector
 * - The second eye gives a subsector
 * - and the third eye gives a sub-subsector. 
 * 
 * @param {Array<[number, number, number]>} trigrams
 */
export function absoluteTrigrams(trigrams) {
    return trigrams.map((tri) => {
        let out = [0, 0];
        for (let i = 0; i < 3; i++) {
            let coord = eyeToCoord(tri[i]);
            let magnitude = 1 / Math.pow(3, i);
            out[0] += coord[0] * magnitude;
            out[1] += coord[1] * magnitude;
        }
        return out;
    })
}

/**
 * Like `absoluteTrigrams`, but moves relative to the last point, like a turtle from Logo 
 * 
 * @param {Array<[number, number, number]>} trigrams
 */
export function relativeTrigrams(trigrams) {
    let currX = 0,
        currY = 0;
    return trigrams.map((tri) => {
        let offset = [0, 0];
        for (let i = 0; i < 3; i++) {
            let coord = eyeToCoord(tri[i]);
            let magnitude = 1 / Math.pow(3, i);
            offset[0] += coord[0] * magnitude;
            offset[1] += coord[1] * magnitude;
        }
        let out = [currX, currY];
        currX += offset[0];
        currY += offset[1];

        return out;
    })
}

/**
 * Helper function that takes an eye number and returns a 2-tuple
 * for the coordinate.
 * 
 * @param {number} eye
 */
function eyeToCoord(eye) {
    let out = {
        0: [0, 0],
        1: [0, -1],
        2: [1, 0],
        3: [0, 1],
        4: [-1, 0]
    } [eye];
    if (out === undefined) {
        throw `unknown eye coordinate ${eye}`;
    } else {
        return out;
    }
}
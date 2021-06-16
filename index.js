import {
    drawWithTrigrams,
} from "./kilpikonna.js";
import * as Strategies from "./strategies.js";
import * as Patterns from "./patterns.js";

drawWithTrigrams(
    Strategies.relativeTrigrams,
    Patterns.EAST_1_TRIGRAMS, {
        color: 1,
        drawPoints: false,
        drawLines: true,
    }
);
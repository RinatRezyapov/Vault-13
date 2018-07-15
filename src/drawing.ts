import { Point, Hex, PointWithAngle } from "./domain/entities";
import { State } from "./main";
import { getHexCornerCoord } from "./hex";
import { hexToPixel, hexToString } from "./converters";

export const drawHex = (canvasID: HTMLCanvasElement, center: Point, lineWidth: number, lineColor: string, fillColor: string): void => {
    for (let i = 0; i <= 5; i++) {
        let start = getHexCornerCoord(center, i);
        let end = getHexCornerCoord(center, i + 1);
        fillHex(canvasID, center, fillColor);
        drawLine(canvasID, start, end, lineWidth, lineColor);
    }
}

const fillHex = (canvasID: HTMLCanvasElement, center: Point, fillColor: string): void => {
    let c0 = getHexCornerCoord(center, 0);
    let c1 = getHexCornerCoord(center, 1);
    let c2 = getHexCornerCoord(center, 2);
    let c3 = getHexCornerCoord(center, 3);
    let c4 = getHexCornerCoord(center, 4);
    let c5 = getHexCornerCoord(center, 5);
    const ctx = canvasID.getContext("2d");
    if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.moveTo(c0.x, c0.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.lineTo(c4.x, c4.y);
        ctx.lineTo(c5.x, c5.y);
        ctx.closePath();
        ctx.fill();
    }
}


export const drawLine = (canvasID: HTMLCanvasElement, start: Point, end: Point, lineWidth: number, lineColor: string): void => {
    const ctx = canvasID.getContext("2d");
    if (ctx) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }
}

export const drawPoint = (canvasID: HTMLCanvasElement, start: Point): void => {
    const ctx = canvasID.getContext("2d");
    if (ctx) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.lineTo(start.x + 1, start.y + 1);
        ctx.stroke();
        ctx.closePath();
    }
}

export const drawOnCanvas = (state: State): void => {
    if (!state.canvases.canvasHex) return
    if (!state.canvases.canvasInteraction) return
    if (!state.canvases.canvasInteractionOffscreen) return
    if (!state.canvases.canvasHexOffscreen) return


    const ctxCanvasHex = state.canvases.canvasHex.getContext('2d');
    const ctxCanvasInteraction = state.canvases.canvasInteraction.getContext("2d");
    const ctxCanvasInteractionOffscreen = state.canvases.canvasInteractionOffscreen.getContext("2d");

    if (ctxCanvasHex) {
        ctxCanvasHex.clearRect(0, 0, state.canvasParametres.width, state.canvasParametres.height);
        ctxCanvasHex.drawImage(state.canvases.canvasHexOffscreen, state.canvasX, state.canvasY, state.canvasParametres.width, state.canvasParametres.height, 0, 0, state.canvasParametres.width, state.canvasParametres.height);
    }

    if (ctxCanvasInteraction) {
        ctxCanvasInteraction.clearRect(0, 0, state.canvasParametres.width, state.canvasParametres.height);
        ctxCanvasInteraction.drawImage(state.canvases.canvasInteractionOffscreen, state.canvasX, state.canvasY, state.canvasParametres.width, state.canvasParametres.height, 0, 0, state.canvasParametres.width, state.canvasParametres.height);    
    }
 
    if (ctxCanvasInteractionOffscreen) {
        ctxCanvasInteractionOffscreen.clearRect(0, 0, state.canvasParametres.offscreenWidth, state.canvasParametres.offscreenHeight);
        drawHex(state.canvases.canvasInteractionOffscreen, hexToPixel(state.currentHex), 1, "yellow", "transparent");
        const currentHexPoint = hexToPixel(state.currentHex);
        ctxCanvasInteractionOffscreen.fillStyle = "white";
        ctxCanvasInteractionOffscreen.fillText(hexToString(state.currentHex),currentHexPoint.x+20, currentHexPoint.y);

    }
}

export const drawFOV = (state: State, endPointsObject: {[key: string]: PointWithAngle}) => {
    const endPoints = Object.values(endPointsObject);
    for (let i = 0, len = endPoints.length; i < len; i++) {
        if (state.canvases.canvasInteractionOffscreen) {
            if (endPoints[i] && endPoints[i + 1]) {
                drawLine(state.canvases.canvasInteractionOffscreen, endPoints[i], endPoints[i + 1], 1, "pink");
            } else {
                drawLine(state.canvases.canvasInteractionOffscreen, endPoints[i], endPoints[0], 1, "pink");
            }
        }
    }
}


export const drawFOVWithFill = (state: State,  endPointsObject: {[key: string]: PointWithAngle}) => {
    const endPoints = Object.values(endPointsObject);
    if (state.canvases.canvasInteractionOffscreen) {
        const ctx = state.canvases.canvasInteractionOffscreen.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
            ctx.moveTo(endPoints[0].x, endPoints[0].y);
            for (let i = 0, len = endPoints.length; i < len; i++) {
                if (ctx) {
                    if (endPoints[i] && endPoints[i + 1]) {
                        ctx.lineTo(endPoints[i].x, endPoints[i].y)
                    } else {
                        ctx.lineTo(endPoints[i].x, endPoints[i].y)
                    }
                }
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}
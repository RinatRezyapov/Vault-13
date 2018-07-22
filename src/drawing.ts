import { Point, Hex, PointWithAngle, MapObject } from "./domain/entities";
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
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        ctx.lineTo(start.x + 1, start.y + 1);
        ctx.stroke();
        ctx.closePath();
    }
}

export const animateCurrentHex = (state: State) => {
    if (state.canvases.canvasInteractionOffscreen) {
        drawHex(state.canvases.canvasInteractionOffscreen, hexToPixel(state.currentHex), 1, "#6bff02", "transparent");
    }
}

export const animateCurrentHexCoords = (state: State) => {
    if (!state.canvases.canvasInteractionOffscreen) return
    const ctxCanvasInteractionOffscreen = state.canvases.canvasInteractionOffscreen.getContext("2d");
    if (!ctxCanvasInteractionOffscreen) return

    const currentHexPoint = hexToPixel(state.currentHex);
    ctxCanvasInteractionOffscreen.fillStyle = "#6bff02";
    ctxCanvasInteractionOffscreen.fillText(hexToString(state.currentHex),currentHexPoint.x+20, currentHexPoint.y);

}

export const drawCanvas = (state: State): void => {
    if (!state.canvases.canvasHex) return
    if (!state.canvases.canvasInteraction) return
    if (!state.canvases.canvasInteractionOffscreen) return
    if (!state.canvases.canvasHexOffscreen) return

    const ctxCanvasHex = state.canvases.canvasHex.getContext('2d');
    const ctxCanvasInteraction = state.canvases.canvasInteraction.getContext("2d");
    const ctxCanvasInteractionOffscreen = state.canvases.canvasInteractionOffscreen.getContext("2d");

    if (!ctxCanvasHex) return
    if (!ctxCanvasInteraction) return
    if (!ctxCanvasInteractionOffscreen) return

    ctxCanvasHex.clearRect(0, 0, state.canvasParametres.width, state.canvasParametres.height);
    ctxCanvasHex.drawImage(state.canvases.canvasHexOffscreen, state.canvasX, state.canvasY, state.canvasParametres.width, state.canvasParametres.height, 0, 0, state.canvasParametres.width, state.canvasParametres.height);

    ctxCanvasInteraction.clearRect(0, 0, state.canvasParametres.width, state.canvasParametres.height);
    ctxCanvasInteraction.drawImage(state.canvases.canvasInteractionOffscreen, state.canvasX, state.canvasY, state.canvasParametres.width, state.canvasParametres.height, 0, 0, state.canvasParametres.width, state.canvasParametres.height);    

    ctxCanvasInteractionOffscreen.clearRect(0, 0, state.canvasParametres.offscreenWidth, state.canvasParametres.offscreenHeight);
}

export const animateMapObject = (state: State, object: MapObject) => {
    if (state.canvases.canvasInteractionOffscreen) {
        drawHex(state.canvases.canvasInteractionOffscreen, hexToPixel(object.position), 1, "transparent", object.id === 0 ? "yellow" : "rgba(255,0,0,0.1)");
    }
}

export const drawFOVPoligon = (state: State,  endPoints: Array<PointWithAngle>, player: MapObject) => {
    if (state.canvases.canvasInteractionOffscreen) {
        const ctx = state.canvases.canvasInteractionOffscreen.getContext("2d");
            if (ctx) {
                endPoints = endPoints.sort((pointA, pointB) => pointA.a - pointB.a);
                ctx.fillStyle = "rgb(255,255,0, 0.5)";
                ctx.beginPath();
                ctx.moveTo(endPoints[0].x,endPoints[0].y);
                for(let i=1; i<endPoints.length; i++) {
                    const intersect = endPoints[i];
                    ctx.lineTo(intersect.x,intersect.y);
                }
                ctx.fill();
            }
    }
}

export const drawFOVRays = (state: State,  endPoints: Array<PointWithAngle>, player: MapObject) => {
    if (state.canvases.canvasInteractionOffscreen) {
        const ctx = state.canvases.canvasInteractionOffscreen.getContext("2d");
        if (ctx) {
            const playerPosition = hexToPixel(player.position)
            ctx.strokeStyle = "rgb(255,255,0)";
            ctx.fillStyle = "rgb(173,255,47)";
            ctx.lineWidth = 0.1;
            for (let i=0; i < endPoints.length; i++) {
                const intersect = endPoints[i];

                ctx.beginPath();
                ctx.moveTo(playerPosition.x,playerPosition.y);
                ctx.lineTo(intersect.x,intersect.y);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(intersect.x, intersect.y, 1, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }
    }
}

export const drawFOV = (state: State,  endPoints: Array<PointWithAngle>, player: MapObject) => {
    if (state.endPoints.length > 0) {
        drawFOVPoligon(state, endPoints, player);
        drawFOVRays(state, endPoints, player);
    }
}
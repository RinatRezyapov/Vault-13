import { Point } from "./domain/entities";

export const config = {
    canvasWidth: 800,
    canvasHeight: 600,
    offscreenCanvasWidth: 2000,
    offscreenCanvasHeight: 2000,
    hexOrigin: new Point(0, 0),
    hexSizeX: 18.477,
    hexSizeY: 8,
    hexHeight: 18.477 * 2,
    hexWidth: 32,
    hexVertDist: 16,
    hexHorizDist: 32,
}
import { Point } from "./domain/entities";

export const config = {
  canvasWidth: 1024,
  canvasHeight: 768,
  offscreenCanvasWidth: 2000,
  offscreenCanvasHeight: 1000,
  hexOrigin: new Point(0, 250),
  hexSizeX: 18.477,
  hexSizeY: 8,
  hexHeight: 18.477 * 2,
  hexWidth: 32,
  hexVertDist: 16,
  hexHorizDist: 32,
  scrollSpeed: 10,
  scrollActivationArea: 50
}
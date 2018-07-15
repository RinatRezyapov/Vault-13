import { Point, PointWithAngle, Hex, MapObject } from "./domain/entities";
import { hexToPixel, stringToHex, hexToString } from "./converters";
import { getCubeNeighbor, getHexCornerCoord, getHexCornerCoordWithAngle } from "./hex";
import { State } from "./main";
import { drawLine, drawPoint } from "./drawing";
import { config } from "./config";

export const getDistance = (a: Point, b: Point): number => {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

const between = (a: number, b: number, c: number): boolean => {
    let eps = 0.0000001;
    return a - eps <= b && b <= c + eps;
}

export const lineIntersect = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    x3: number, 
    y3: number, 
    x4: number, 
    y4: number): Point | undefined => 
    {
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return undefined;
    }
    else {
        if (x1 >= x2) {
            if (!between(x2, x, x1)) {
                return undefined;
            }
        }
        else {
            if (!between(x1, x, x2)) {
                return undefined;
            }
        }
        if (y1 >= y2) {
            if (!between(y2, y, y1)) {
                return undefined;
            }
        }
        else {
            if (!between(y1, y, y2)) {
                return undefined;
            }
        }
        if (x3 >= x4) {
            if (!between(x4, x, x3)) {
                return undefined;
            }
        }
        else {
            if (!between(x3, x, x4)) {
                return undefined;
            }
        }
        if (y3 >= y4) {
            if (!between(y4, y, y3)) {
                return undefined;
            }
        }
        else {
            if (!between(y3, y, y4)) {
                return undefined;
            }
        }
    }
    return new Point(x, y);
}

export const getObstacleBeams = (center: Point, i: number, range: number): Point => {
    let angle_deg = 30 * i;
    let angle_rad = Math.PI / 180 * angle_deg;
    let x = center.x + range * Math.cos(angle_rad);
    let y = center.y + range * Math.sin(angle_rad);
    return new Point(x, y);
}

export const getHexBeamsCoord = (center: Point, i: number, range: number): Point => {
    let angle_deg = 4 * i + 30;
    let angle_rad = Math.PI / 180 * angle_deg;
    let x = center.x + range * Math.cos(angle_rad);
    let y = center.y + range * Math.sin(angle_rad);
    return new Point(x, y);
}

export const getBeamsCoord = (center: Point, i: number, range: number): PointWithAngle => {
    let angle_deg = 1 * i;
    let angle_rad = Math.PI / 180 * angle_deg;
    let x = center.x + range * Math.cos(angle_rad);
    let y = center.y + range * Math.sin(angle_rad);
    return new PointWithAngle(x, y, angle_deg);
}

export const getBeam = (center: Point, i: number): PointWithAngle => {
    const horizontalDistance = config.hexWidth * 7 + config.hexWidth/2;
    const verticalDistance = config.hexVertDist * 6;
    const angle_deg = 60 * i;
    const angle_rad = Math.PI / 180 * angle_deg;
    const x = center.x + horizontalDistance * Math.cos(angle_rad);
    const y = center.y + verticalDistance * Math.sin(angle_rad);

    return new PointWithAngle(x, y, angle_deg);
}

export const updateNearestObstacles = (state: State, player: MapObject, object: MapObject): {[key: string]: boolean} => {
    if (object.type === "wall") {
            if (getDistance(hexToPixel(player.position), hexToPixel(object.position)) < 200) {

                //***draw*** line from player to obstacle
                /*if (state.canvases.canvasInteractionOffscreen) {
                    drawLine(state.canvases.canvasInteractionOffscreen, hexToPixel(player.position), hexToPixel(object.position), 1, "yellow");
                }*/
                if (!state.nearestObstacles.hasOwnProperty(hexToString(object.position))) {
                    return {...state.nearestObstacles, [hexToString(object.position)]: true};
                    
                }
            } else {
                const {[hexToString(object.position)]: any, ...rest} = state.nearestObstacles;
                return rest;
            }
    }
    return state.nearestObstacles;
}

export const getObstacleSides = (state: State, player: MapObject): Array<{}> => {
    const playerPositionCenter = hexToPixel(player.position);
    let obstacleSides: Array<{}> = [];
    const nearestObstacles = Object.keys(state.nearestObstacles);

    for (let i = 0, len = nearestObstacles.length; i < len; i++) {
        let hexCenter = hexToPixel(stringToHex(nearestObstacles[i]));
        let fromPlayerToHex = Math.floor(getDistance(playerPositionCenter, hexCenter));

        for (let j = 0; j < 6; j++) {
            let neighbor = hexToString(getCubeNeighbor(stringToHex(nearestObstacles[i]), j));
            if (!nearestObstacles.includes(neighbor)) {
                let start = getHexCornerCoord(hexCenter, j);
                let end = getHexCornerCoord(hexCenter, j + 1);
                let center = {
                    x: ((start.x + end.x) / 2),
                    y: ((start.y + end.y) / 2)
                };

                let fromPlayerToSide = Math.floor(getDistance(playerPositionCenter, center));

                let side = {start, end}
                if (fromPlayerToSide <= fromPlayerToHex) {
                        //***draw*** Sides
                        /*if (state.canvases.canvasInteractionOffscreen) {
                            drawLine(state.canvases.canvasInteractionOffscreen, side.start, side.end, 1, "yellow");
                        }*/
                        obstacleSides.push(side);
                }
                else {
                    continue;
                }
            }

        }
    }
    return obstacleSides;
}

export const visibleField = (state: State, object: MapObject) => {
    let endPoints: {[key: string]: PointWithAngle} = {};
    let center = hexToPixel(object.position);
    if (state.canvases.canvasInteractionOffscreen) {
            for (let i = 0; i < 360; i++) {
                let beam = getBeamsCoord(center, i, 200);
                endPoints[beam.a] = beam
                for (let i = 0; i < state.obstacleSides.length; i++) {
                    let side = state.obstacleSides[i] as {start: Point, end: Point};
                    let intersect = lineIntersect(center.x, center.y, beam.x, beam.y, side.start.x, side.start.y, side.end.x, side.end.y);
                    if (intersect) {
                            const point = new PointWithAngle(intersect.x, intersect.y, beam.a)
                            endPoints[beam.a] = point
                    }
                }
        }
    }
    return endPoints
}
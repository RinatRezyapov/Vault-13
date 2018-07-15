import { Point, Hex, MapObject, PointWithAngle } from "./domain/entities";
import { hexToString, hexToPixel, axialToCube, cubeToOddr } from "./converters";
import { State } from "./main";
import { mergeToState } from "./stateHandlers";
import { drawHex, drawLine } from "./drawing";
import { config } from "./config";
import { getDistance } from "./geometry";

export const getHexPathMap = (state: State): State => {

    let hexPathMap: {[key: string]: Array<string> | null} = {};

    const horizontalHexes = Math.round((state.canvasParametres.offscreenWidth)/config.hexHorizDist);
    const verticalHexes = Math.round((state.canvasParametres.offscreenHeight)/12);


     for (let r = 0; r <= verticalHexes; r++) {
        for(let q=0; q <= horizontalHexes; q++) {
            var cube = axialToCube(new Hex(q, r, -q - r));
            var h = cubeToOddr(cube);
            hexPathMap[hexToString(h)] = getNeighbors(h);
            var center = hexToPixel(h);
            if (state.canvases.canvasHexOffscreen) {
                drawHex(state.canvases.canvasHexOffscreen, center, 0.3, "#6bff02", "transparent");
            }
        }  
    }

    if (state.canvases.canvasHex && state.canvases.canvasHexOffscreen) {
        const ctx = state.canvases.canvasHex.getContext('2d');
        if (ctx) {
            ctx.drawImage(state.canvases.canvasHexOffscreen, 0, 0, state.canvasParametres.width, state.canvasParametres.height, 0, 0, state.canvasParametres.width, state.canvasParametres.height);
        }
    }

    for (let i = 0, len = state.mapObjects.length; i < len; i++) {
        const newHexPathMap = state.mapObjects[i].type === "wall" ? {...hexPathMap, [hexToString(state.mapObjects[i].position)]: null} : hexPathMap
        hexPathMap = newHexPathMap
    }

    return mergeToState(state, {hexPathMap: hexPathMap})
}

export const getHexCornerCoord = (center: Point, i: number) => {
    const angle_deg = 60 * i + 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    const x = center.x + config.hexSizeX * Math.cos(angle_rad);
    const y = center.y + config.hexSizeY * Math.sin(angle_rad);

    return new Point(x, y);
}

export const getHexCornerCoordWithAngle = (center: Point, i: number) => {
    const angle_deg = 60 * i + 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    const x = center.x + config.hexSizeX * Math.cos(angle_rad);
    const y = center.y + config.hexSizeY * Math.sin(angle_rad);

    return new PointWithAngle(x, y, angle_deg);
}

export const cubeDirection = (direction: number): Hex => {
        const cubeDirections = [new Hex(0, 1, -1), new Hex(-1, 1, 0), new Hex(-1, 0, 1),
            new Hex(0, -1, 1), new Hex(1, -1, 0), new Hex(1, 0, -1)
        ];
        return cubeDirections[direction];
    }

export const cubeAdd = (a: Hex, b: Hex): Hex => {
        return new Hex(a.q + b.q, a.r + b.r, a.s + b.s);
    }

export const cubeSubstract = (a: Hex, b: Hex): Hex => {
        return new Hex(a.q - b.q, a.r - b.r, a.s - b.s);
    }

export const getCubeNeighbor = (h: Hex, direction: number): Hex => {
        return cubeAdd(h, cubeDirection(direction));
    }

export const getNeighbors = (h: Hex): Array<string> => {
        var arr = [];
            for (let i = 0; i <= 5; i++) {
                const {
                    q,
                    r,
                    s
                } = getCubeNeighbor(new Hex(h.q, h.r, h.s), i);
                arr.push(hexToString(new Hex(q, r, s)));
            }
            return arr;
    }

export const cubeRound = (cube: Hex) => {
        var rx = Math.round(cube.q)
        var ry = Math.round(cube.r)
        var rz = Math.round(cube.s)

        var x_diff = Math.abs(rx - cube.q)
        var y_diff = Math.abs(ry - cube.r)
        var z_diff = Math.abs(rz - cube.s)

        if (x_diff > y_diff && x_diff > z_diff) {
            rx = -ry - rz;
        }
        else if (y_diff > z_diff) {
            ry = -rx - rz
        }
        else {
            rz = -rx - ry
        }
        return new Hex(rx, ry, rz)
    }

export const getDistanceLine = (a: Hex, b: Hex) => {
        const dist = cubeDistance(a, b);
        let arr: Array<Point> = [];
        for (let i = 0; i <= dist; i++) {
            let center = hexToPixel(cubeRound(cubeLinearInt(a, b, 1.0 / dist * i)));
            arr = [...arr, center];
        }
        return arr
    }

export const cubeDistance = (a: Hex, b: Hex): number => {
        const {
            q,
            r,
            s
        } = cubeSubstract(a, b);
        return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
    }

export const cubeLinearInt = (a: Hex, b: Hex, t: number): Hex => {
        return new Hex(linearInt(a.q, b.q, t), linearInt(a.r, b.r, t), linearInt(a.s, b.s, t));
    }

export const linearInt = (a: number, b: number, t: number): number => {
        return (a + (b - a) * t)
    }

export const areHexesEqual = (a: Hex, b: Hex) => {
        return a.q === b.q && a.r === b.r && a.s === b.s;
    }

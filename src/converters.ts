import { 
    Point, 
    Hex,
} from "./domain/entities";
import { config } from "./config";

export const cubeToOddr = (c: {x: number, z: number}): Hex => {
    const q = c.x - (c.z - (c.z & 1)) / 2;
    const r = c.z;
    return new Hex(q, r, -q - r)
};

export const axialToCube = (h: Hex) => {
    const x = h.q;
    const z = h.r;
    const y = -x-z;
    return {x: x, y: y, z: z}
};

export const hexToPixel = (h: Hex): Point => {
    const x = config.hexSizeX * Math.sqrt(3) * (h.q + h.r / 2) + config.hexOrigin.x;
    const y = config.hexSizeY * 3 / 2 * h.r + config.hexOrigin.y;
    return new Point(x, y)
}

export const pixelToHex = (p: Point): Hex => {
    const q = (((p.x - config.hexOrigin.x) * Math.sqrt(3) / 3) / config.hexSizeX  - ((p.y - config.hexOrigin.y) / 3) / config.hexSizeY)
    const r = (p.y - config.hexOrigin.y) * 2 / 3 / config.hexSizeY
    return new Hex(q, r, -q - r);
}

export const hexToString = (hex: Hex): string => {
    return `${hex.q}:${hex.r}:${hex.s}`;
}

export const stringToHex = (str: string): Hex => {
    const arr = str.split(":");
    return {q: Number.parseInt(arr[0]), r: Number.parseInt(arr[1]), s: Number.parseInt(arr[2])}
}

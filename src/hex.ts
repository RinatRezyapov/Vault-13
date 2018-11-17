import update from 'immutability-helper';
import { Point, Hex, PointWithAngle } from "./domain/entities";
import { hexToString, hexToPixel } from "./converters";
import { State } from "./main";
import { drawHex, drawImage, drawTile } from "./cnv";
import { config } from "./config";

export const initHexPathMap = (state: State): State => {
  let hexPathMap: { [key: string]: Array<string> } = {};
  const horizontalHexes = Math.round((config.offscreenCanvasWidth) / 48);
  const verticalHexes = Math.round((config.offscreenCanvasHeight) / 20);

  let maxX = 0;
  let maxY = 0;
  for (let q = 0; q <= horizontalHexes; q++) {
    for (let r = 0; r <= verticalHexes; r++) {
      const h = new Hex(q, r, -q - r);
      if (h.q % 2 === 0 && h.r % 2 === 0) {
        const tileAttachHex = new Hex(h.q, h.r - h.q / 2, h.s + h.q / 2);
        hexPathMap[hexToString(tileAttachHex)] = getNeighbors(tileAttachHex);
        const tileAttachHexCenter = hexToPixel(tileAttachHex);
        maxX = tileAttachHexCenter.x > maxX ? tileAttachHexCenter.x : maxX;
        maxY = tileAttachHexCenter.y > maxY ? tileAttachHexCenter.y : maxY;
        drawTile(tileAttachHexCenter);
      }
      if (h.q % 2 === 0) {
        const evenColCenterHex = new Hex(h.q, h.r - h.q / 2, h.s + h.q / 2);
        hexPathMap[hexToString(evenColCenterHex)] = getNeighbors(evenColCenterHex);
        const evenColCenter = hexToPixel(evenColCenterHex);
        maxX = evenColCenter.x > maxX ? evenColCenter.x : maxX;
        maxY = evenColCenter.y > maxY ? evenColCenter.y : maxY;
        drawHex("canvasHexOffscreen", evenColCenter, 0.5, "#6bff02", "transparent");
      } else {
        const oddColCenterHex = new Hex(h.q, h.r - ((h.q - 1) / 2), h.s + ((h.q - 1) / 2));
        hexPathMap[hexToString(oddColCenterHex)] = getNeighbors(oddColCenterHex);
        const oddColCenter = hexToPixel(oddColCenterHex);
        maxX = oddColCenter.x > maxX ? oddColCenter.x : maxX;
        maxY = oddColCenter.y > maxY ? oddColCenter.y : maxY;
        drawHex("canvasHexOffscreen", oddColCenter, 0.5, "#6bff02", "transparent");
      }
    }
  }

  return update(state, {
    hexPathMap: {
      $set: hexPathMap
    }
  })
}

export const getHexCornerCoord = (center: Point, i: number) => {
  const angleDeg = 60 * i + 30;
  const angleRad = Math.PI / 180 * angleDeg;
  const x = center.x + config.hexSizeX * Math.cos(angleRad);
  const y = center.y + config.hexSizeY * Math.sin(angleRad);

  return new PointWithAngle(x, y, 0, 0);
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
  let arr = [];
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
  let rX = Math.round(cube.q)
  let rY = Math.round(cube.r)
  let rZ = Math.round(cube.s)
  const xDiff = Math.abs(rX - cube.q)
  const yDiff = Math.abs(rY - cube.r)
  const zDiff = Math.abs(rZ - cube.s)
  if (xDiff > yDiff && xDiff > zDiff) {
    rX = -rY - rZ;
  }
  else if (yDiff > zDiff) {
    rY = -rX - rZ
  }
  else {
    rZ = -rX - rY
  }
  return new Hex(rX, rY, rZ)
}

export const getDistanceLine = (a: Hex, b: Hex) => {
  const dist = cubeDistance(a, b);
  let arr: Array<Point> = [];
  for (let i = 0; i <= dist; i++) {
    const center = hexToPixel(cubeRound(cubeLinearInt(a, b, 1.0 / dist * i)));
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


export const getFovCornerCoord = (center: Point, i: number) => {
  const angleDeg = 60 * i + 30;
  const angleRad = Math.PI / 180 * angleDeg;
  const x = center.x + 200 * Math.cos(angleRad);
  const y = center.y + 200 * Math.sin(angleRad);
  return new PointWithAngle(x, y, 0, 0);
}
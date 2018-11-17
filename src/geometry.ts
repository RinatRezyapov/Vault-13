import { drawDynamicObjects } from './cnv';
import { State } from './main';
import { Point, PointWithAngle, MapObject, Segment } from "./domain/entities";
import { hexToPixel } from "./converters";
import { getHexCornerCoord, getFovCornerCoord } from "./hex";
import update from 'immutability-helper';


export const getDistance = (a: Point, b: Point): number => {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const getIntersection = (ray: Segment, segment: Segment): PointWithAngle | null => {
  const rPx = ray.a.x;
  const rPy = ray.a.y;
  const rDx = ray.b.x - ray.a.x;
  const rDy = ray.b.y - ray.a.y;
  const sPx = segment.a.x;
  const sPy = segment.a.y;
  const sDx = segment.b.x - segment.a.x;
  const sDy = segment.b.y - segment.a.y;
  const rMag = Math.sqrt(rDx * rDx + rDy * rDy);
  const sMag = Math.sqrt(sDx * sDx + sDy * sDy);
  if (rDx / rMag == sDx / sMag && rDy / rMag == sDy / sMag) return null;
  const T2 = (rDx * (sPy - rPy) + rDy * (rPx - sPx)) / (sDx * rDy - sDy * rDx);
  const T1 = (sPx + sDx * T2 - rPx) / rDx;
  if (T1 < 0) return null;
  if (T2 < 0 || T2 > 1) return null;
  return new PointWithAngle(rPx + rDx * T1, rPy + rDy * T1, 0, T1);
}

export const getObstacles = (nearestObstacles: { [key: string]: MapObject }, object: MapObject, playerObject: MapObject): { [key: string]: MapObject } => {
  if (object.id === playerObject.id) return nearestObstacles;
  if (object.type === "wall" || object.type === "player") {
    if (getDistance(hexToPixel(object.position), hexToPixel(playerObject.position)) > 200) {
      delete nearestObstacles[object.id];
      return nearestObstacles;
    }
    return update(nearestObstacles, {
      [object.id]: {
        $set: object
      }
    });
  }
  return nearestObstacles;
}

export const getObstaclesSegments = (nearestObstaclesArg: { [key: string]: MapObject }, object: MapObject): Array<Segment> => {
  let obstacleSides: Array<Segment> = [];
  const nearestObstaclesObject = Object.values(nearestObstaclesArg);
  const nearestObstaclesPosition = Object.values(nearestObstaclesArg).map(v => v.position);
  for (let i = 0, len = nearestObstaclesPosition.length; i < len; i++) {
    const hexCenter = hexToPixel(nearestObstaclesPosition[i]);
    for (let j = 0; j < 6; j++) {
      const a = getHexCornerCoord(hexCenter, j);
      const b = getHexCornerCoord(hexCenter, j + 1);
      const side = new Segment(a, b, nearestObstaclesObject[i]);
      obstacleSides.push(side);
    }
  }
  const objectPosition = hexToPixel(object.position);
  for (let j = 0; j < 6; j++) {
    const a = getFovCornerCoord(objectPosition, j);
    const b = getFovCornerCoord(objectPosition, j + 1);
    const side = new Segment(a, b, object);
    obstacleSides.push(side);
  }
  return obstacleSides;
}

export const visibleField = (state: State, obstacleSides: Array<Segment>, object: MapObject) => {
  const objectCoords = hexToPixel(object.position);
  const points = (segments => {
    const a: Array<PointWithAngle> = [];
    segments.forEach(seg => a.push(seg.a, seg.b));
    return a;
  })(obstacleSides);
  const uniquePoints = (points => {
    let set: { [key: string]: boolean } = {};
    return points.filter(p => {
      const key = `${p.x},${p.y}`;
      if (key in set) {
        return false;
      } else {
        set[key] = true;
        return true;
      }
    });
  })(points);
  let uniqueAngles = [];
  for (let j = 0; j < uniquePoints.length; j++) {
    let uniquePoint = uniquePoints[j];
    const angle = Math.atan2(uniquePoint.y - objectCoords.y, uniquePoint.x - objectCoords.x);
    uniquePoint.a = angle;
    uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
  }
  let endPoints: Array<PointWithAngle> = [];
  let drawnedObjects = {} as any;
  for (let j = 0; j < uniqueAngles.length; j++) {
    const angle = uniqueAngles[j];
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const ray = new Segment(
      new PointWithAngle(objectCoords.x, objectCoords.y, 0, 0),
      new PointWithAngle(objectCoords.x + dx, objectCoords.y + dy, 0, 0),
      object
    )
    let closestIntersect = null;
    for (let i = 0; i < obstacleSides.length; i++) {
      const intersect = getIntersection(ray, obstacleSides[i]);
      if (!intersect) continue;
      if (!closestIntersect || intersect.param < closestIntersect.param) {
        closestIntersect = new PointWithAngle(intersect.x, intersect.y, 0, intersect.param);
        drawDynamicObjects(obstacleSides[i], closestIntersect, object, drawnedObjects);
      }
    }
    if (!closestIntersect) continue
    closestIntersect.a = angle;
    endPoints.push(closestIntersect)
  }
  return endPoints
}
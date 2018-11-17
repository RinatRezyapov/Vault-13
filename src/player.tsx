import update from "immutability-helper";
import { areHexesEqual } from "./hex";
import { getPath, BFS } from "./bfs";
import { MapObject, Hex } from "./domain/entities";
import { getTime } from "./clocks";
import { stringToHex } from "./converters";
import { updatePlayerPositionDb } from "./utils/writeDbUtils";
import { dSE, dW, dE, dSW, dNE, dNW } from "./utils/constants";

export const getDirection = (prevPath: Array<string>, nextPath: Array<string>, lastDirection: string) => {
  if (prevPath[prevPath.length - 1] && nextPath[nextPath.length - 1]) {
    const prevPosition = stringToHex(prevPath[prevPath.length - 1]);
    const nextPosition = stringToHex(nextPath[nextPath.length - 1]);
    const prevQ = Math.abs(prevPosition.q);
    const nextQ = Math.abs(nextPosition.q);
    const prevR = Math.abs(prevPosition.r);
    const nextR = Math.abs(nextPosition.r);
    const prevS = Math.abs(prevPosition.s);
    const nextS = Math.abs(nextPosition.s);
    if (prevQ > nextQ && prevS > nextS) {
      return dW;
    } else if (prevQ < nextQ && prevS < nextS) {
      return dE;
    } else if (prevQ > nextQ && prevR < nextR) {
      return dSW;
    } else if (prevQ < nextQ && prevR > nextR) {
      return dNE;
    } else if (prevR > nextR && prevS > nextS) {
      return dNW;
    } else if (prevR < nextR && prevS < nextS) {
      return dSE;
    }
  }
  return lastDirection
}

export const getFrameOffset = (direction: string) => {
  switch (direction) {
    case dNE:
      return 0;
    case dE:
      return 1;
    case dSE:
      return 2;
    case dSW:
      return 3;
    case dW:
      return 4;
    case dNW:
      return 5;
  }
}

export const makeMovement = (object: MapObject, hexPathMap: { [key: string]: Array<string> }): MapObject => {
  if (!areHexesEqual(object.position, object.targetPosition)) {
    if (object.path.length === 0) {
      const newPath = getPath(object.position, object.targetPosition, BFS(object.position, hexPathMap));
      return update(object, {
        path: {
          $set: newPath
        }
      });
    } else {
  
        if (object.path.length === 1) {
          updatePlayerPositionDb(object.id, getCurrentPosition(object.path))
        }
        const newPath = makeStep(object.path);       
        const direction = getDirection(object.path, newPath, object.direction);
        return update(object, {
          $merge: {
            path: newPath,
            position: getCurrentPosition(object.path),
            direction: direction
          }
        });
      
    }
  }
  return object;
}

const getCurrentPosition = (path: Array<string>): Hex => {
  return stringToHex(path.slice(path.length - 1, path.length)[0]);
}

const makeStep = (path: Array<string>): Array<string> => {
  return path.slice(0, -1);
}

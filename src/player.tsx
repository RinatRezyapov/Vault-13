import { areHexesEqual } from "./hex";
import { getPath, BFS } from "./bfs";
import { MapObject, Hex } from "./domain/entities";
import { getTime } from "./clocks";
import { stringToHex } from "./converters";

export const makeMovement = (object: MapObject, hexPathMap: {[key: string]: Array<string>}): MapObject => {
    if (!areHexesEqual(object.position, object.targetPosition)) {
        if (object.path.length === 0) {
            const newPath = getPath(object.position, object.targetPosition, BFS(object.position, hexPathMap));
            return Object.assign({}, object, {path: newPath});
        } else {
            if (getTime() - object.lastFrameTime > 1000 / object.fps) {
                const newPath = critterMakeStep(object.path);
                return Object.assign({}, object, {
                    path: newPath,
                    lastFrameTime: getTime(),
                    position: getCurrentPosition(object.path)
                });
            }
        }
    }
    return object;
}

const getCurrentPosition = (path: Array<string>): Hex => {
    return stringToHex(path.slice(path.length - 1, path.length)[0]);
}

const critterMakeStep = (path: Array<string>): Array<string> => {
    return path.slice(0, -1);
}

import { Hex } from "./domain/entities";
import { hexToString } from "./converters";
import { areHexesEqual } from "./hex";

export const BFS = (playerPosition: Hex, hexPathMap: { [key: string]: Array<string> }) => {
  let frontier = [hexToString(playerPosition)];
  let cameFrom: { [key: string]: string } = {};
  cameFrom[hexToString(playerPosition)] = hexToString(playerPosition);
  while (frontier.length != 0) {
    const current = frontier.shift();
    if (current) {
      let arr: Array<string> = hexPathMap[current];
      if (arr) {
        for (let i = 0, len = arr.length; i < len; i++) {
          if (!cameFrom.hasOwnProperty(arr[i])) {
            frontier.push(arr[i]);
            cameFrom[arr[i]] = current;
          }
        }
      }
    }
  }
  return cameFrom
}

export const getPath = (start: Hex, end: Hex, cameFrom: { [key: string]: string }): Array<string> => {
  if (areHexesEqual(start, end)) return [];
  const strStart = hexToString(start);
  let strCurrent = hexToString(end);
  let path: Array<string> = [];
  if (cameFrom[strCurrent] != undefined) {
    path = [strCurrent];
    while (strCurrent != strStart) {
      strCurrent = cameFrom[strCurrent];
      path.push(strCurrent);
    }
  }
  return path;
}
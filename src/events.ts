import update from 'immutability-helper';

import { updatePlayerTargetPositionDb } from './utils/writeDbUtils';
import { dSE } from './utils/constants';
import { State } from "./main";

import { Point, Hex, MapObject } from "./domain/entities";
import { pixelToHex, hexToPixel, hexToString } from "./converters";
import { cubeRound, getNeighbors, areHexesEqual } from "./hex";
import { updateState } from "./main";
import { getPath, BFS } from "./bfs";
import { config } from "./config";
import { canvasInteraction } from './cnv';
import { fromNullable } from 'fp-ts/lib/Option';

export const onMouseMove = (state: State): void => {
  canvasInteraction.map(canvas => {
    canvas.onmousemove = (evt: MouseEvent) => {
      const canvasParametres = state.canvasParametres;
      const offsetX = evt.pageX - canvasParametres.left;
      const offsetY = evt.pageY - canvasParametres.top;
      const hex = cubeRound(pixelToHex(new Point(offsetX + state.canvasX, offsetY + state.canvasY)));
      const point = hexToPixel(hex);
      const withinCanvas = (point.x > config.hexWidth / 2 && point.x < config.offscreenCanvasWidth - config.hexWidth / 2)
        && (point.y > config.hexHeight / 2 && point.y < config.offscreenCanvasHeight - config.hexHeight / 2);
      const currentHex = withinCanvas ? hex : new Hex(0, 0, 0);
      updateState(state, update(state, {
        $merge: {
          mouseX: offsetX,
          mouseY: offsetY,
          currentHex: currentHex
        }
      }))
    }
  })
}

export const onMouseDown = (state: State): void => {
  canvasInteraction.map(canvas => {
    canvas.onmousedown = (evt: MouseEvent) => {

    }
  })
}

export const onMouseUp = (state: State): void => {
  canvasInteraction.map(canvas => {
    canvas.onmouseup = (evt: MouseEvent) => {
      switch (evt.button) {
        case 0:
          if (state.hexPathMap[hexToString(state.currentHex)].length > 0) {
            state.userId.map(userId => {
              const idx = state.mapObjects.findIndex(el => el.id === userId);
              const bfs = BFS(state.mapObjects[idx].position, state.hexPathMap);
              const path = getPath(state.mapObjects[idx].position, state.currentHex, bfs);
              fromNullable(state.mapObjects[idx]).map(v => updatePlayerTargetPositionDb(userId, state.currentHex));
              const object = update(state.mapObjects[idx], {
                  $merge: {
                    path: path,
                    targetPosition: state.currentHex
                  }
              });
              updateState(state, update(state, { 
                mapObjects: {$set: update(state.mapObjects, {
                  $splice: [[idx, 1, object]]
                })}
              }))
            })
          }
          break;
        /*case 1:
          const newHexPathMap = { ...state.hexPathMap, [hexToString(state.currentHex)]: getNeighbors(state.currentHex) };
          const idx = state.mapObjects.findIndex(el => areHexesEqual(el.position, state.currentHex));
          updateState(state, update(state, {
            mapObjects: {
              $splice: [[idx, 1]]
            },
            $merge: {
              hexPathMap: newHexPathMap
            }
          }));
          break;
        case 2:
          const object = new MapObject(
            `${state.mapObjects.length}`,
            "wall",
            "wall",
            state.currentHex,
            state.currentHex,
            [],
            0,
            20,
            0,
            0,
            dSE
          )
          const newMapObjects1 = update(state.mapObjects, {
            $splice: [[state.mapObjects.length + 1, 1, object]]
          });
          const newHexPathMap1 = { ...state.hexPathMap, [hexToString(state.currentHex)]: [] }
          const stateWithMapObjects = update(state, {
            $merge: {
              mapObjects: newMapObjects1,
              hexPathMap: newHexPathMap1
            }
          });
          updateState(state, stateWithMapObjects);
          break;*/
      }
    }
  })
}

export const handleMouseOut = (state: State): void => {
  canvasInteraction.map(canvas => {
    canvas.onmouseover = (evt: MouseEvent) => {
      updateState(state, update(state, {
        mouseOut: {$set: true}
      }))
    }
  })
}

export const handleMouseOver = (state: State): void => {
  canvasInteraction.map(canvas => {
    canvas.onmouseover = (evt: MouseEvent) => {
      updateState(state, update(state, {
        mouseOut: {$set: false}
      }))
    }
  })
}

export const scrollByPointer = (state: State): void => {
  if (state.mouseOut) return;
  const right = state.mouseX > config.canvasWidth - config.scrollActivationArea && state.canvasX < config.offscreenCanvasWidth - config.canvasWidth;
  const left = state.mouseX < config.scrollActivationArea && state.canvasX > 0;
  const bottom = state.mouseY > config.canvasHeight - config.scrollActivationArea && state.canvasY < config.offscreenCanvasHeight - config.canvasHeight;
  const top = state.mouseY < config.scrollActivationArea && state.canvasY > 0;
  const mouseX = right ? state.mouseX + config.scrollSpeed : left ? state.mouseX - config.scrollSpeed : state.mouseX;
  const mouseY = bottom ? state.mouseY + config.scrollSpeed : top ? state.mouseY - config.scrollSpeed : state.mouseY;
  const canvasX = right ? state.canvasX + config.scrollSpeed : left ? state.canvasX - config.scrollSpeed : state.canvasX;
  const canvasY = bottom ? state.canvasY + config.scrollSpeed : top ? state.canvasY - config.scrollSpeed : state.canvasY;

  updateState(state, update(state, {
    $merge: {
      mouseX: mouseX,
      mouseY: mouseY,
      canvasX: canvasX,
      canvasY: canvasY,
      cameraMoved: state.canvasX !== canvasX || state.canvasY !== canvasY
    }
  }));
}
import update from "immutability-helper";

import { drawStaticObjects, drawPlayer, getImageMap } from "./cnv";
import { updateState, prevState } from "./main";
import { getTime } from "./clocks";
import { drawFOV } from "./cnv";
import { makeMovement, getFrameOffset } from "./player";
import { visibleField, getObstacles, getObstaclesSegments } from "./geometry";
import { State } from "./main";
import { hexToString } from "./converters";

export const updateObjectsData = (state: State) => {
  state.userId.map(userId => {
    const playerIdx = state.mapObjects.findIndex(el => el.id === userId);
    const playerObj = state.mapObjects[playerIdx];
    for (let i = 0, len = state.mapObjects.length; i < len; i++) {

      let hexPathMap: { [key: string]: Array<string> } = {};
      if (state.mapObjects[i].type === "wall") {
        hexPathMap[hexToString(state.mapObjects[i].position)] = []
      }


      drawStaticObjects(state.mapObjects[i]);
      if (i === playerIdx) {
        const playerObject = state.mapObjects[i];
        drawFOV(state.endPoints, playerObject);
        drawPlayer(state, playerObject, i);

        if (getTime() - playerObject.stepLastFrameTime > 1000 / playerObject.fps) {
          updateState(state, update(state, {
            $merge: {
              mapObjects: update(state.mapObjects, {
                $splice: [[i, 1, update(makeMovement(playerObject, state.hexPathMap), {
                  $merge: {
                    stepLastFrameTime: getTime(),
                  }
                })]]
              })
            }
          }))
        }
      } else {
        const object = state.mapObjects[i];
        if (getTime() - object.stepLastFrameTime > 1000 / object.fps) {
          updateState(state, update(state, {
            $merge: {
              mapObjects: update(state.mapObjects, {
                $splice: [[i, 1, update(makeMovement(object, state.hexPathMap), {
                  $merge: {
                    stepLastFrameTime: getTime(),
                  }
                })]]
              })
            }
          }));
        }
      }
      updateState(state, update(state, {
        $merge: {
          nearestObstacles: getObstacles(state.nearestObstacles, state.mapObjects[i], playerObj),
          endPoints: i === playerIdx ? visibleField(state, getObstaclesSegments(state.nearestObstacles, playerObj), playerObj) : state.endPoints,
          hexPathMap: update(state.hexPathMap, {
            $merge: hexPathMap
          })
        }
      }));
    }
  })
}
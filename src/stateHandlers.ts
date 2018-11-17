import update from 'immutability-helper';

import { State } from "./main";
import { MapObject } from './domain/entities';
import { dSE } from './utils/constants';

export const updateMapObjects = (state: State, response: any) => {
  return update(state, {
    mapObjects: {
      $set: [
        ...state.mapObjects,
        ...response.map((obj: any) => {
          const data = obj.data;
          return new MapObject(data.id, data.nickname, data.type, data.position, data.position, [], 0, data.fps, 0, 0, dSE)
        })
      ]
    }
  })
}
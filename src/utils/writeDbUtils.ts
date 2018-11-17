import { mergeDoc } from './firebase';
import Hex from '../domain/Hex';

export const updatePlayerPositionDb = (objectId: string, position: Hex) => {
  mergeDoc("players", objectId, {
    position: { q: position.q, r: position.r, s: position.s },
  })
}

export const updatePlayerTargetPositionDb = (objectId: string, position: Hex) => {
  mergeDoc("players", objectId, {
    targetPosition: { q: position.q, r: position.r, s: position.s },
  })
}
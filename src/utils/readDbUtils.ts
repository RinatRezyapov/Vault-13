import { getCollection, listen } from "../utils/firebase";
import { State } from "../main";

export const getMapObjectsFromDB = (state: State) => {
  return getCollection("players")
}

export const listenToPlayers = (state: State) => {
  state.userId.map(userId => {
    const mapObjectsWithoutPlayer = state.mapObjects.filter(mapObject => mapObject.id !== userId);
    mapObjectsWithoutPlayer.forEach(object => {
        if (object.type === "player") {
            listen(State, object.id)
        }
    })
  })
}
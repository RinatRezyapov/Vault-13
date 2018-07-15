import { State, setLastState } from "./main";
import { MapObject } from "./domain/entities";

export const mergeToState = (state: State, statePart: {}) => {
    return Object.assign({}, state, statePart)
}

export const updateState = (globalState: State, newState: State) => {
    setLastState(globalState);
    globalState = Object.assign(globalState, newState);
}

export const updateMapObjects = (state: State, object: MapObject, idx: number) => [
    ...state.mapObjects.slice(0, idx),
    Object.assign({}, object),
    ...state.mapObjects.slice(idx + 1)
];
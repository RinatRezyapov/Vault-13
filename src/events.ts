import { State } from "./main";
import { Point, Hex, MapObject } from "./domain/entities";
import { pixelToHex, hexToPixel, hexToString } from "./converters";
import { cubeRound, getNeighbors, areHexesEqual } from "./hex";
import { mergeToState, updateState } from "./stateHandlers";
import { getPath, BFS } from "./bfs";
import { config } from "./config";

export const onMouseMove = (state: State): void => {
    const canvasParametres = state.canvasParametres;

    if (!state.canvases.canvasInteraction) return

    state.canvases.canvasInteraction.onmousemove = (evt: MouseEvent) => {
        let offsetX = evt.pageX - canvasParametres.left;
        let offsetY = evt.pageY - canvasParametres.top;

        const hex = cubeRound(pixelToHex(new Point(offsetX + state.canvasX, offsetY + state.canvasY)));
        const point = hexToPixel(hex);
    
        const inCanvas = (point.x > config.hexWidth / 2 && point.x < canvasParametres.offscreenWidth - config.hexWidth / 2) 
        && (point.y > config.hexHeight / 2 && point.y < canvasParametres.offscreenHeight - config.hexHeight / 2);

        const currentHex = inCanvas ? hex : new Hex(0, 0, 0);

        updateState(state, mergeToState(state, {
            mouseX: offsetX,
            mouseY: offsetY,
            currentHex: currentHex
        }))
    }
}


export const onMouseDown = (state: State): void => {

    if (!state.canvases.canvasInteraction) return

    state.canvases.canvasInteraction.onmousedown = (evt: MouseEvent) => {

    }
}

export const onMouseUp = (state: State): void => {

    if (!state.canvases.canvasInteraction) return

    state.canvases.canvasInteraction.onmouseup = (evt: MouseEvent) => {
        if (evt.button === 0) {
            if (state.hexPathMap[hexToString(state.currentHex)]) {
                const idx = state.mapObjects.findIndex(el => el.id === 0);
                const bfs = BFS(state.mapObjects[idx].position, state.hexPathMap);
                const path = getPath(state.mapObjects[idx].position, state.currentHex, bfs);
                const object = {...state.mapObjects[idx], targetPosition: state.currentHex, path: path};
                const newMapObjects = [
                    ...state.mapObjects.slice(0, idx),
                    object,
                    ...state.mapObjects.slice(idx + 1)
                ]
                const stateWithMapObjects = mergeToState(state, {mapObjects: newMapObjects});
                updateState(state, stateWithMapObjects)
            }
        }
        if (evt.button === 1) {
            const newHexPathMap = {...state.hexPathMap, [hexToString(state.currentHex)]: getNeighbors(state.currentHex)};
            const idx = state.mapObjects.findIndex(el => areHexesEqual(el.position, state.currentHex));
            const newMapObjects = [
                ...state.mapObjects.slice(0, idx),
                ...state.mapObjects.slice(idx + 1)
            ]
            const stateWithMapObjects = mergeToState(state, {
                mapObjects: newMapObjects,
                hexPathMap: newHexPathMap
            });
            updateState(state, stateWithMapObjects);
        }
        if (evt.button === 2) {
            const newMapObjects = [
                ...state.mapObjects,
                new MapObject(
                    state.mapObjects.length, 
                    "wall", 
                    state.currentHex, 
                    state.currentHex,
                    [],
                    0,
                    20
                )
            ]
            const newHexPathMap = {...state.hexPathMap, [hexToString(state.currentHex)]: null}
            const stateWithMapObjects = mergeToState(state, {
                mapObjects: newMapObjects,
                hexPathMap: newHexPathMap
            });
            updateState(state, stateWithMapObjects);
        }
    }
}


export const handleMouseOut = (state: State): void => {

    if (!state.canvases.canvasInteraction) return

    state.canvases.canvasInteraction.onmouseout = (evt: MouseEvent) => {
        updateState(state, mergeToState(state, {
            mouseOut: true
        }))
    }
}

export const handleMouseOver = (state: State): void => {

    if (!state.canvases.canvasInteraction) return

    state.canvases.canvasInteraction.onmouseover = (evt: MouseEvent) => {
        updateState(state, mergeToState(state, {
            mouseOut: false
        }))
    }
}

export const scrollByPointer = (state: State): State => {

    if (state.mouseOut) return state;

    const right = state.mouseX > state.canvasParametres.width - 50 && state.canvasX < state.canvasParametres.offscreenWidth - state.canvasParametres.width;
    const left = state.mouseX < 50 && state.canvasX > 0;
    const bottom = state.mouseY > state.canvasParametres.height - 50 && state.canvasY < state.canvasParametres.offscreenHeight - state.canvasParametres.height;
    const top = state.mouseY < 50 && state.canvasY > 0;
 
    const mouseX = right ? state.mouseX + 10 : left ? state.mouseX - 10 : state.mouseX;
    const mouseY = bottom ? state.mouseY + 10 : top ? state.mouseY - 10 : state.mouseY;

    const canvasX = right ? state.canvasX + 10 : left ? state.canvasX - 10 : state.canvasX;
    const canvasY = bottom ? state.canvasY + 10 : top ? state.canvasY - 10 : state.canvasY;

    return mergeToState(state, {
        mouseX: mouseX,
        mouseY: mouseY,
        canvasX: canvasX,
        canvasY: canvasY,
    })
}
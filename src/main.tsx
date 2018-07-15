import { 
    Hex, 
    MapObject,
    PointWithAngle,
    Point,
} from "./domain/entities";
import {
    getHexPathMap,
} from "./hex";
import { getCanvas } from "./cnv";
import { onMouseMove, handleMouseOut, handleMouseOver, scrollByPointer, onMouseDown, onMouseUp } from "./events";
import { mergeToState, updateState, updateMapObjects } from "./stateHandlers";
import { clocks } from "./clocks";
import { drawOnCanvas, drawHex, drawLine, drawFOV, drawFOVWithFill, } from "./drawing";
import { makeMovement } from "./player";
import { config } from "./config";
import { hexToPixel, hexToString } from "./converters";
import { getObstacleSides, updateNearestObstacles, visibleField } from "./geometry";

export interface State {
    hexPathMap: {[key: string]: Array<string>},
    nearestObstacles: {[key: string]: boolean},
    obstacleSides: Array<{}>,
    obstacleCorners: Array<PointWithAngle>,
    currentHex: Hex,
    endPoints: {[key: string]: PointWithAngle},
    fov: {[key: string]: boolean},
    canvases: {
        canvasHex: HTMLCanvasElement | undefined,
        canvasHexOffscreen: HTMLCanvasElement | undefined,
        canvasInteraction: HTMLCanvasElement | undefined,
        canvasInteractionOffscreen: HTMLCanvasElement | undefined,
    },
    canvasParametres: {
        width: number,
        height: number,
        offscreenWidth: number,
        offscreenHeight: number,
        left: number,
        right: number,
        top: number,
        bottom: number
    },
    mouseX: number,
    mouseY: number,
    canvasX: number,
    canvasY: number,
    mouseOut: boolean,
    //clocks
    currentFrameTime: number,
    lastFrameTime: number,
    targetFrameTime: number,
    lastFPSTime: number,
    targetFPS: number,
    currentFPS: number,
    numFrames: number,
    mapObjects: Array<MapObject>;
}

export const globalState: State = {
    currentHex: new Hex(0, 0, 0),
    hexPathMap: {},
    nearestObstacles: {},
    obstacleSides: [],
    obstacleCorners: [],
    endPoints: {},
    fov: {},
    canvases: {
        canvasHex: undefined,
        canvasHexOffscreen: undefined,
        canvasInteraction: undefined,
        canvasInteractionOffscreen: undefined,
    },
    canvasParametres: {
        width: config.canvasWidth,
        height: config.canvasHeight,
        offscreenWidth: config.offscreenCanvasWidth,
        offscreenHeight: config.offscreenCanvasHeight,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
    mouseOut: false,
    //clocks
    currentFrameTime: 0,
    lastFrameTime: window.performance.now(),
    targetFrameTime: 1000 / 30,
    lastFPSTime: 0,
    targetFPS: 30,
    currentFPS: 0,
    numFrames: 0,
    mapObjects: [
        new MapObject(0, "player", new Hex(0, 0, 0), new Hex(0, 0, 0), [], 0, 60),
        new MapObject(1, "wall", new Hex(0, 18, -18), new Hex(0, 18, -18), [], 0, 0),
        new MapObject(2, "wall", new Hex(1, 18, -19), new Hex(1, 18, -19), [], 0, 0),
        new MapObject(3, "wall", new Hex(2, 18, -20), new Hex(2, 18, -20), [], 0, 0),
        new MapObject(4, "wall", new Hex(3, 18, -21), new Hex(3, 18, -21), [], 0, 0),
        new MapObject(5, "wall", new Hex(4, 18, -22), new Hex(4, 18, -22), [], 0, 0),
        new MapObject(6, "wall", new Hex(3, 19, -22), new Hex(3, 19, -22), [], 0, 0),
        new MapObject(7, "wall", new Hex(2, 20, -22), new Hex(2, 20, -22), [], 0, 0),
        new MapObject(8, "wall", new Hex(1, 21, -22), new Hex(1, 21, -22), [], 0, 0),
        new MapObject(9, "wall", new Hex(0, 22, -22), new Hex(0, 22, -22), [], 0, 0),
        new MapObject(10, "wall", new Hex(-1, 22, -21), new Hex(-1, 22, -21), [], 0, 0),
        new MapObject(11, "wall", new Hex(-2, 22, -20), new Hex(-2, 22, -20), [], 0, 0),
        new MapObject(12, "wall", new Hex(-3, 22, -19), new Hex(-3, 22, -19), [], 0, 0),
        new MapObject(13, "wall", new Hex(-4, 22, -18), new Hex(-4, 22, -18), [], 0, 0),
        new MapObject(14, "wall", new Hex(-1, 19, -18), new Hex(-1, 19, -18), [], 0, 0),
        new MapObject(15, "wall", new Hex(-3, 21, -18), new Hex(-3, 21, -18), [], 0, 0),
    ],
}

export let lastGlobalState: State;

export const setLastState = (state: State) => {
    lastGlobalState = Object.assign({}, state);
}

const animate = (state: State, object: MapObject) => {
    if (state.canvases.canvasInteractionOffscreen) {
        drawHex(state.canvases.canvasInteractionOffscreen, hexToPixel(object.position), 1, "transparent", object.id === 0 ? "yellow" : "rgba(255,0,0,0.1)");
    }
}

export const update = (state: State) => {
    updateState(state, mergeToState(state, scrollByPointer(state)));
    drawOnCanvas(state);

    const playerIdx = state.mapObjects.findIndex(el => el.id === 0);

    for (let i = 0, len = state.mapObjects.length; i < len; i++) {
 
        const endPoints = i === playerIdx ? visibleField(state, state.mapObjects[playerIdx]) : state.endPoints;
        const obstacleSides = i === playerIdx ? getObstacleSides(state, state.mapObjects[playerIdx]) : state.obstacleSides;

        if (i === playerIdx) {
            drawFOVWithFill(state, endPoints);
        }

        animate(state, state.mapObjects[i]);
        const newState = mergeToState(state, {
            mapObjects: updateMapObjects(state, makeMovement(state.mapObjects[i], state.hexPathMap), i),
            nearestObstacles: updateNearestObstacles(state, state.mapObjects[playerIdx], state.mapObjects[i]),
            obstacleSides: i === playerIdx ? getObstacleSides(state, state.mapObjects[playerIdx]) : state.obstacleSides,
            endPoints: endPoints,
        });
        updateState(state, newState);

    }
} 

const init = (state: State) => {
    
    //initialazing state
    let stateWithHexPathMap = getHexPathMap(getCanvas(state));

    updateState(state, stateWithHexPathMap)

    //attach eventlisteners
    //these don't return state, they update it in place
    onMouseMove(state);
    onMouseDown(state);
    onMouseUp(state);
    handleMouseOut(state);
    handleMouseOver(state);

    //launch game clocks
    clocks(window.performance.now(), globalState)
}

init(globalState);

import { Option, none } from "fp-ts/lib/Option";
import {
  Hex,
  MapObject,
  PointWithAngle,
  Point,
  Segment,
} from "./domain/entities";
import { initHexPathMap } from "./hex";
import { initCanvas, loadAssets } from "./cnv";
import { onMouseMove, handleMouseOut, handleMouseOver, scrollByPointer, onMouseDown, onMouseUp } from "./events";
import { updateMapObjects } from "./stateHandlers";
import { clocks } from "./clocks";
import { drawCanvas, animateCurrentHex } from "./cnv";
import { initUI } from "./ui/initUI";
import { dSE } from "./utils/constants";
import { getMapObjectsFromDB, listenToPlayers } from "./utils/readDbUtils";
import { updateObjectsData } from "./objects";

export interface State {
  userId: Option<string>,
  hexPathMap: { [key: string]: Array<string> },
  nearestObstacles: { [key: string]: MapObject },
  obstacleSides: Array<Segment>,
  obstacleCorners: Array<Point>,
  currentHex: Hex,
  endPoints: Array<PointWithAngle>,
  fov: { [key: string]: boolean },
  canvases: {
    canvasHex: Option<HTMLCanvasElement>,
    canvasHexOffscreen: Option<HTMLCanvasElement>,
    canvasInteraction: Option<HTMLCanvasElement>,
    canvasInteractionOffscreen: Option<HTMLCanvasElement>,
  },
  canvasParametres: {
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
  mapObjects: Array<MapObject>,
  cameraMoved: boolean,
}

export let State: State = {
  userId: none,
  currentHex: new Hex(0, 0, 0),
  hexPathMap: {},
  nearestObstacles: {},
  obstacleSides: [],
  obstacleCorners: [],
  endPoints: [],
  fov: {},
  canvases: {
    canvasHex: none,
    canvasHexOffscreen: none,
    canvasInteraction: none,
    canvasInteractionOffscreen: none,
  },
  canvasParametres: {
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
  cameraMoved: false,
  mapObjects: [
    new MapObject("5", "wall", "wall", new Hex(4, 18, -22), new Hex(4, 18, -22), [], 0, 0, 0, 0, dSE),
  ],
}

export let prevState: State;

export const updateState = (state: State, newState: State) => {
  State = Object.assign(state, newState);
}

export const renderGame = (state: State) => {
  scrollByPointer(state);
  animateCurrentHex(state.currentHex);
  drawCanvas(state);
  updateObjectsData(state);
}

export const initGame = (state: State) => {
  loadAssets(() => {
    getMapObjectsFromDB(state).then((response: any) => {
      updateState(state, updateMapObjects(initHexPathMap(initCanvas(state)), response));
      listenToPlayers(state);
      //attach event listeners
      onMouseMove(state);
      onMouseDown(state);
      onMouseUp(state);
      handleMouseOut(state);
      handleMouseOver(state);
      //launch game clocks
      clocks(window.performance.now(), State)
    })
  });
}

initUI(State);

import { State, update } from "./main";
import { mergeToState, updateState } from "./stateHandlers";

export const clocks = (timestamp: number, state: State): any => {

    const currentFrameTime = timestamp - state.lastFrameTime;

    if (currentFrameTime > state.targetFrameTime) {
        
        const lastFrameTime = timestamp - (currentFrameTime % state.targetFrameTime);

            const timeToUpdateFPSInfo = timestamp - state.lastFPSTime >= 1000;
            const currentFPS = timeToUpdateFPSInfo ? state.numFrames + 1 / (timestamp - state.lastFPSTime) * 1000 : state.currentFPS;
            const lastFPSTime = timeToUpdateFPSInfo ? timestamp : state.lastFPSTime;
            const numFrames = timeToUpdateFPSInfo ? 0 : state.numFrames + 1;

            
        update(state);
 
        
        updateState(state, mergeToState(state, {
            currentFrameTime: currentFrameTime,
            lastFrameTime: lastFrameTime,
            numFrames: numFrames,
            currentFPS: currentFPS,
            lastFPSTime: lastFPSTime
        }));
    }

    window.requestAnimationFrame((timestamp) => clocks(timestamp, state))
}

export const getTime = () => {
    return window.performance.now();
}
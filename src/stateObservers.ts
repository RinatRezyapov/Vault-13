import { State, prevState } from './main';

export const isCameraMoving = (state: State) => {
  return state.canvasX !== prevState.canvasX
}
import { Hex } from "./entities";

export default class MapObject {
    constructor(
        public id: string,
        public nickname: string,
        public type: string,
        public position: Hex,
        public targetPosition: Hex,
        public path: Array<string>,
        public lastFrameTime: number,
        public fps: number,
        public frame: number,
        public frameOffset: number,
        public direction: string,
        public stepLastFrameTime: number = 0,
    ) {
    }
}
import { Point, Hex } from "./entities";

export default class MapObject {
    constructor(
        public id: number,
        public type: string,
        public position: Hex,
        public targetPosition: Hex,
        public path: Array<string>,
        public lastFrameTime: number,
        public fps: number
    ) {
    }
}
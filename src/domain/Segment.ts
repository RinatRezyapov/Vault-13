import { Point, PointWithAngle } from "./entities";
import MapObject from "./MapObject";

export default class Segment {
    constructor(public a: PointWithAngle,
                public b: PointWithAngle,
                public object: MapObject
                ) {
    }
}
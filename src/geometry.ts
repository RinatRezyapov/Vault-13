import { Point, PointWithAngle, MapObject, Segment } from "./domain/entities";
import { hexToPixel, stringToHex, hexToString } from "./converters";
import { getHexCornerCoord } from "./hex";


export const getDistance = (a: Point, b: Point): number => {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

const getIntersection = (ray: Segment, segment: Segment): PointWithAngle | null => {

	const r_px = ray.a.x;
	const r_py = ray.a.y;
	const r_dx = ray.b.x-ray.a.x;
	const r_dy = ray.b.y-ray.a.y;

	const s_px = segment.a.x;
	const s_py = segment.a.y;
	const s_dx = segment.b.x-segment.a.x;
	const s_dy = segment.b.y-segment.a.y;

	const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
	const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
	if(r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag){
		return null;
	}

	const T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
	const T1 = (s_px + s_dx * T2 - r_px) / r_dx;

	if (T1 < 0) return null;
	if (T2 < 0 || T2 > 1) return null;

	return new PointWithAngle(r_px + r_dx  *T1, r_py + r_dy * T1, 0, T1)
}

export const getObstacles = (nearestObstacles: {[key: string]: boolean}, object: MapObject): {[key: string]: boolean} => {
    if (object.type === "wall") {
        if (!nearestObstacles.hasOwnProperty(hexToString(object.position))) {
            return {...nearestObstacles, [hexToString(object.position)]: true};
            
        }
    }
    return nearestObstacles;
}

export const getObstaclesSegments = (nearestObstaclesArg: {[key: string]: boolean}): Array<Segment> => {
    let obstacleSides: Array<Segment> = [];
    const nearestObstacles = Object.keys(nearestObstaclesArg);

    for (let i = 0, len = nearestObstacles.length; i < len; i++) {
        const hexCenter = hexToPixel(stringToHex(nearestObstacles[i]));

        for (let j = 0; j < 6; j++) {
            const a = getHexCornerCoord(hexCenter, j);
            const b = getHexCornerCoord(hexCenter, j + 1);
            const side = new Segment(a, b);
            obstacleSides.push(side);
        }
    }

   return obstacleSides.concat([
        new Segment(new PointWithAngle(0, 0, 0, 0), new PointWithAngle(2000, 0, 0, 0)),
        new Segment(new PointWithAngle(2000, 0, 0, 0), new PointWithAngle(2000, 2000, 0, 0)),
        new Segment(new PointWithAngle(2000, 2000, 0, 0), new PointWithAngle(0, 2000, 0, 0)),
        new Segment(new PointWithAngle(0, 2000, 0, 0), new PointWithAngle(0, 0, 0, 0))
    ]);
}

export const visibleField = (obstacleSides: Array<Segment>, object: MapObject) => {

    const objectCoords = hexToPixel(object.position);

    const points = (segments => {
        const a: Array<PointWithAngle> = [];
        segments.forEach(seg => a.push(seg.a, seg.b));
        return a;
    })(obstacleSides);

    const uniquePoints = (points => {
        let set: {[key: string]: boolean} = {};
        return points.filter(p => {
            const key = `${p.x},${p.y}`;
            if (key in set) {
                return false;
            } else {
                set[key] = true;
                return true;
            }
        });
    })(points);

    let uniqueAngles = [];
    for (let j=0; j<uniquePoints.length; j++) {
        let uniquePoint = uniquePoints[j];
        const angle = Math.atan2(uniquePoint.y - objectCoords.y, uniquePoint.x - objectCoords.x);
        uniquePoint.a = angle;
        uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
    }

    let endPoints: Array<PointWithAngle> = [];
    for (let j=0; j < uniqueAngles.length; j++) {

        const angle = uniqueAngles[j];

        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        
        const ray = {
			a: new PointWithAngle(objectCoords.x, objectCoords.y, 0, 0),
			b: new PointWithAngle(objectCoords.x + dx, objectCoords.y + dy, 0, 0)
        };
        
        let closestIntersect = null;
		for(var i = 0; i < obstacleSides.length; i++){
            
			const intersect = getIntersection(ray, obstacleSides[i]);
			if (!intersect) continue;
			if (!closestIntersect || intersect.param< closestIntersect.param) {
				closestIntersect = new PointWithAngle(intersect.x, intersect.y, 0, intersect.param);
			}
        }
        if (!closestIntersect) continue
            closestIntersect.a = angle;
            endPoints.push(closestIntersect)
    }
    return endPoints
}
import React from 'react';
import { dummyObstacles } from './entities/constants.js';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.state = {
            hexSize: 20,
            hexSizeX: 18.477,
            hexSizeY: 8, 
            hexOrigin: {
                x: 400,
                y: 300
            },
            currentHex: {
                q: 0,
                r: 0,
                s: 0,
                x: 0,
                y: 0
            },
            playerPosition: {
                q: 0,
                r: 0,
                s: 0
            },
            enemyPosition: {
                q: 0,
                r: 0,
                s: 0
            },
            obstacles: dummyObstacles,
            cameFrom: {},
            hexPathMap: [],
            path: [],
            hexSides: [],
            nearestObstacles: [],
            endPoints: [],
            playerSight: 200,
            canvasSize: {
                canvasWidth: 800,
                canvasHeight: 600,
                offscreenCanvasWidth: 2000,
                offscreenCanvasHeight: 2000
            },
            mouseX: 0,
            mouseY: 0,
            canvasX: 0,
            canvasY: 0,
            mouseOut: false
        }
    }
    componentWillMount() {
        let hexParametres = this.getHexParametres();
        this.setState({
            hexParametres: hexParametres
        })
    } 

    componentDidMount() {
        const {
            canvasWidth,
            canvasHeight,
            offscreenCanvasWidth,
            offscreenCanvasHeight
        } = this.state.canvasSize;
        this.canvasHex.width = canvasWidth;
        this.canvasHex.height = canvasHeight;
        this.canvasView.width = canvasWidth;
        this.canvasView.height = canvasHeight;
        this.canvasInteraction.width = canvasWidth;
        this.canvasInteraction.height = canvasHeight;
        this.canvasFog.width = canvasWidth;
        this.canvasFog.height = canvasHeight;
        this.canvasFogHide.width = canvasWidth;
        this.canvasFogHide.height = canvasHeight;
        this.canvasHexOffscreen = new OffscreenCanvas(offscreenCanvasWidth, offscreenCanvasHeight);
        this.getCanvasPosition(this.canvasInteraction);
        this.drawHex(this.canvasInteraction, this.hexToPixel(this.state.playerPosition), 1, "grey", "yellow", 0.2);
        this.drawHexes();
        //this.addFogOfWar(this.canvasFog);
        setInterval(() => this.getRandomPosition(), 100);
        setInterval(() => this.scrollByPointer(), 1);
    }

    getRandomPosition() {
        const neighbors = this.getNeighbors(this.state.enemyPosition);
        const randomNeighbor = Math.floor(Math.random() * (6 - 0)) + 0;
        if (!this.isHexIncluded(this.state.obstacles, neighbors[randomNeighbor])) {
            this.setState({
                enemyPosition: neighbors[randomNeighbor]
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.areHexesEqual(this.state.enemyPosition, nextState.enemyPosition)) {
            const ctx = this.canvasView.getContext("2d");
            if (this.isHexVisible(nextState.enemyPosition, this.state.endPoints)) {
                ctx.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight)
                this.drawHex(this.canvasView, this.hexToPixel(nextState.enemyPosition), 1, "black", "yellow");
            }
        }
        return false;
    }

    addFogOfWar(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
        ctx.globalCompositeOperation = "destination-out";
    }

    drawHexes() {
        const {
            canvasWidth,
            canvasHeight,
            offscreenCanvasWidth,
            offscreenCanvasHeight
        } = this.state.canvasSize;
        const {
            hexWidth,
            hexHeight,
            vertDist,
            horizDist
        } = this.state.hexParametres;
        const hexOrigin = this.state.hexOrigin;
        let qLeftSide = Math.round(hexOrigin.x / horizDist);
        let qRightSide = Math.round((offscreenCanvasWidth - hexOrigin.x) / horizDist);
        let rTopSide = Math.round(hexOrigin.y / vertDist);
        let rBottomSide = Math.round((offscreenCanvasHeight - hexOrigin.y) / vertDist);
        var hexPathMap = [];
        let obstacles = [];
        var p = 0;
        for (let r = 0; r <= rBottomSide; r++) {
            if (r % 2 == 0 && r !== 0) {
                p++;
            }
            for (let q = -qLeftSide; q <= qRightSide; q++) {
                const {
                    x,
                    y
                } = this.hexToPixel(this.Hex(q - p, r));
                if ((x > hexWidth / 2 && x < offscreenCanvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < offscreenCanvasHeight - hexHeight / 2)) {
                    this.drawHex(this.canvasHexOffscreen, this.Point(x, y), 0.3, "#6bff02", "transparent");
                    var bottomH = this.Hex(q - p, r, -(q - p) - r);
                    if (!this.isHexIncluded(this.state.obstacles, bottomH)) {
                        hexPathMap.push(this.Hex(q - p, r, -(q - p) - r));
                    } else {
                        
                    }
                }
            }
        }

        var n = 0;
        for (let r = -1; r >= -rTopSide; r--) {
            if (r % 2 !== 0) {
                n++;
            }
            for (let q = -qLeftSide; q <= qRightSide; q++) {
                const {
                    x,
                    y
                } = this.hexToPixel(this.Hex(q + n, r));
                if ((x > hexWidth / 2 && x < offscreenCanvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < offscreenCanvasHeight - hexHeight / 2)) {
                    this.drawHex(this.canvasHexOffscreen, this.Point(x, y), 0.3, "#6bff02", "transparent");
                    var topH = this.Hex(q + n, r, -(q + n) - r);
                    if (!this.isHexIncluded(this.state.obstacles, topH)) {
                        hexPathMap.push(this.Hex(q + n, r, -(q + n) - r));
                    }
                }
            }
        }
        const ctx = this.canvasHex.getContext('2d');
        ctx.drawImage(this.canvasHexOffscreen, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
        this.setState({
            hexPathMap: [...hexPathMap],
            //obstacles: [...obstacles]
        },
        this.breadthFirstSearchCallback = () => this.breadthFirstSearch(this.state.playerPosition)
        )
    }


    drawHex(canvasID, center, lineWidth, lineColor, fillColor) {
        for (let i = 0; i <= 5; i++) {
            let start = this.getHexCornerCoord(center, i);
            let end = this.getHexCornerCoord(center, i + 1);
            this.fillHex(canvasID, center, fillColor);
            this.drawLine(canvasID, start, end, lineWidth, lineColor);
        }
    }

    getHexCornerCoord(center, i) {
        let angle_deg = 60 * i + 30;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = center.x + this.state.hexSizeX * Math.cos(angle_rad);
        let y = center.y + this.state.hexSizeY * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    getHexParametres() {
        let hexHeight = this.state.hexSizeY * 2;
        let hexWidth = 32;
        let vertDist = hexHeight * 3 / 4;
        let horizDist = hexWidth;
        return {
            hexWidth,
            hexHeight,
            vertDist,
            horizDist
        }
    }

    getCanvasPosition(canvasID) {
        let rect = canvasID.getBoundingClientRect();
        this.setState({
            canvasPosition: {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            }
        })
    }

    hexToPixel(h) {
        let hexOrigin = this.state.hexOrigin;
        let x = this.state.hexSizeX * Math.sqrt(3) * (h.q + h.r / 2) + hexOrigin.x;
        let y = this.state.hexSizeY * 3 / 2 * h.r + hexOrigin.y;
        return this.Point(x, y)
    }

    pixelToHex(p) {
        let size = this.state.hexSize;
        let origin = this.state.hexOrigin;
        let q = (((p.x - origin.x) * Math.sqrt(3) / 3) / this.state.hexSizeX  - ((p.y - origin.y) / 3) / this.state.hexSizeY)
        let r = (p.y - origin.y) * 2 / 3 / this.state.hexSizeY
        return this.Hex(q, r, -q - r);
    }

    cubeDirection(direction) {
        const cubeDirections = [this.Hex(0, 1, -1), this.Hex(-1, 1, 0), this.Hex(-1, 0, 1),
            this.Hex(0, -1, 1), this.Hex(1, -1, 0), this.Hex(1, 0, -1)
        ];
        return cubeDirections[direction];
    }

    cubeAdd(a, b) {
        return this.Hex(a.q + b.q, a.r + b.r, a.s + b.s);
    }

    cubeSubstract(hexA, hexB) {
        return this.Hex(hexA.q - hexB.q, hexA.r - hexB.r, hexA.s - hexB.s);
    }

    getCubeNeighbor(h, direction) {
        return this.cubeAdd(h, this.cubeDirection(direction));
    }

    getNeighbors(h) {
        var arr = [];
        for (let i = 0; i <= 5; i++) {
            const {
                q,
                r,
                s
            } = this.getCubeNeighbor(this.Hex(h.q, h.r, h.s), i);
            arr.push(this.Hex(q, r, s));
        }
        return arr;
    }


    cubeRound(cube) {
        var rx = Math.round(cube.q)
        var ry = Math.round(cube.r)
        var rz = Math.round(cube.s)

        var x_diff = Math.abs(rx - cube.q)
        var y_diff = Math.abs(ry - cube.r)
        var z_diff = Math.abs(rz - cube.s)

        if (x_diff > y_diff && x_diff > z_diff) {
            rx = -ry - rz;
        }
        else if (y_diff > z_diff) {
            ry = -rx - rz
        }
        else {
            rz = -rx - ry
        }
        return this.Hex(rx, ry, rz)
    }

    getDistanceLine(hexA, hexB) {
        let dist = this.cubeDistance(hexA, hexB);
        var arr = [];
        for (let i = 0; i <= dist; i++) {
            let center = this.hexToPixel(this.cubeRound(this.cubeLinearInt(hexA, hexB, 1.0 / dist * i)));
            arr = [].concat(arr, center);
        }
        this.setState({
            currentDistanceLine: arr
        })
    }

    cubeDistance(hexA, hexB) {
        const {
            q,
            r,
            s
        } = this.cubeSubstract(hexA, hexB);
        return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
    }

    cubeLinearInt(hexA, hexB, t) {
        return this.Hex(this.linearInt(hexA.q, hexB.q, t), this.linearInt(hexA.r, hexB.r, t), this.linearInt(hexA.s, hexB.s, t));
    }

    linearInt(a, b, t) {
        return (a + (b - a) * t)
    }


    Point(x, y) {
        return {
            x: x,
            y: y
        }
    }

    PointWithAngle(x, y, a) {
        return {
            x: x,
            y: y,
            a: a,
        }
    }

    Hex(q, r, s) {
        return {
            q: q,
            r: r,
            s: s
        }
    }

    drawLine(canvasID, start, end, lineWidth, lineColor) {
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    fillHex(canvasID, center, fillColor) {
        let c0 = this.getHexCornerCoord(center, 0);
        let c1 = this.getHexCornerCoord(center, 1);
        let c2 = this.getHexCornerCoord(center, 2);
        let c3 = this.getHexCornerCoord(center, 3);
        let c4 = this.getHexCornerCoord(center, 4);
        let c5 = this.getHexCornerCoord(center, 5);
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.moveTo(c0.x, c0.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.lineTo(c4.x, c4.y);
        ctx.lineTo(c5.x, c5.y);
        ctx.closePath();
        ctx.fill();
    }

    drawHexCoordinates(canvasID, center, h) {
        const ctx = canvasID.getContext("2d");
        ctx.fillText(h.q, center.x + 6, center.y);
        ctx.fillText(h.r, center.x - 3, center.y + 15);
        ctx.fillText(h.s, center.x - 12, center.y);
    }

    drawNeighbors(h) {
        for (let i = 0; i <= 5; i++) {
            const {
                q,
                r,
                s
            } = this.getCubeNeighbor(this.Hex(h.q, h.r, h.s), i);
            const {
                x,
                y
            } = this.hexToPixel(this.Hex(q, r, s));
            this.drawHex(this.canvasInteraction, this.Point(x, y), "red", 2);
        }
    }

    handleMouseMove(e) {
        const {
            canvasWidth,
            canvasHeight
        } = this.state.canvasSize;
        const {
            hexWidth,
            hexHeight,
            vertDist,
            horizDist
        } = this.state.hexParametres;
        const {
            left,
            right,
            top,
            bottom
        } = this.state.canvasPosition;
        let offsetX = e.pageX - left;
        let offsetY = e.pageY - top;
        this.setState({
            mouseX: offsetX,
            mouseY: offsetY
        })
        const {
            q,
            r,
            s
        } = this.cubeRound(this.pixelToHex(this.Point(offsetX, offsetY)));
        const {
            x,
            y
        } = this.hexToPixel(this.Hex(q, r, s));
        let playerPosition = this.state.playerPosition;
        this.getPath(this.Hex(playerPosition.q, playerPosition.r, playerPosition.s), this.Hex(q, r, s));
        if ((x > hexWidth / 2 && x < canvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < canvasHeight - hexHeight / 2)) {
            this.setState({
                currentHex: {
                    q,
                    r,
                    s,
                    x,
                    y
                }
            })
        }
    }

    scrollByPointer() {
        const {
            canvasWidth,
            canvasHeight,
            offscreenCanvasWidth,
            offscreenCanvasHeight
        } = this.state.canvasSize;
        const ctx = this.canvasHex.getContext('2d');
        if (this.state.mouseOut) return
        if (this.state.mouseX > canvasWidth - 50 && this.state.canvasX < offscreenCanvasWidth - canvasWidth) {
            this.setState({
                mouseX: this.state.mouseX + 1,
                canvasX: this.state.canvasX + 1
            },
            () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(this.canvasHexOffscreen, this.state.canvasX, this.state.canvasY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
            })
        }
        if (this.state.mouseX < 50 && this.state.canvasX > 0) {
            this.setState({
                mouseX: this.state.mouseX - 1,
                canvasX: this.state.canvasX - 1
            },
            () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(this.canvasHexOffscreen, this.state.canvasX, this.state.canvasY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
            })
        }
        if (this.state.mouseY > canvasHeight - 50 && this.state.canvasY < offscreenCanvasHeight - canvasHeight) {
            this.setState({
                mouseY: this.state.mouseY + 1,
                canvasY: this.state.canvasY + 1
            },
            () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(this.canvasHexOffscreen, this.state.canvasX, this.state.canvasY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
            })
        }
        if (this.state.mouseY < 50 && this.state.canvasY > 0) {
            this.setState({
                mouseY: this.state.mouseY - 1,
                canvasY: this.state.canvasY - 1
            },
            () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(this.canvasHexOffscreen, this.state.canvasX, this.state.canvasY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
            })
        }
    }

    handleMouseOut() {
        this.setState({
            mouseOut: true
        })
    }

    handleMouseOver() {
        this.setState({
            mouseOut: false
        })
    }

    getPath(start, current) {
        const {
            cameFrom
        } = this.state;
        start = JSON.stringify(start);
        current = JSON.stringify(current);
        if (cameFrom[current] != undefined) {
            var path = [current];
            while (current != start) {
                current = cameFrom[current];
                path.push(current);
            }
            path = [].concat(path);
            this.setState({
                path: path
            })
        }
    }

    drawPath() {
        let path = this.state.path;
        for (let i = 0; i <= path.length - 1; i++) {
            const {
                q,
                r
            } = JSON.parse(path[i]);
            const {
                x,
                y
            } = this.hexToPixel(this.Hex(q, r));
            this.drawHex(this.canvasInteraction, this.Point(x, y), 1, "black", "red");
        }
    }


    handleClick() {
        const {
            currentHex,
            cameFrom
        } = this.state;
        const {
            q,
            r,
            s
        } = currentHex;
        clearInterval(this.intervalId);
        if (cameFrom[JSON.stringify(this.Hex(q, r, s))]) {
            let path = this.state.path;
            path.pop();
            this.intervalId = setInterval(this.startMoving.bind(this, path), 100)

        }
    }

    startMoving(path) {
        if (path == 0) {
            clearInterval(this.intervalId);
        }
        else {
            const {
                canvasWidth,
                canvasHeight
            } = this.state.canvasSize;
            const ctx = this.canvasInteraction.getContext("2d");
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            let current = path.pop();
            const {
                q,
                r,
                s
            } = JSON.parse(current);
            const {
                x,
                y
            } = this.hexToPixel(this.Hex(q, r, s));
            this.drawHex(this.canvasInteraction, this.Point(x, y), 1, "black", "yellow", 0.1);
            this.setState({
                    playerPosition: this.Hex(q, r, s)
                },
                this.breadthFirstSearchCallback = () => this.breadthFirstSearch(this.state.playerPosition)
            )
        }
    }

    visibleField() {
        const {
            playerPosition,
            hexSides
        } = this.state;
        let endPoints = [];
        let center = this.hexToPixel(playerPosition);
        for (let i = 0; i < 360; i++) {
            let beam = this.getBeamsCoord(center, i, 800);
            for (let i = 0; i < hexSides.length; i++) {
                let side = hexSides[i];
                let intersect = this.lineIntersect(center.x, center.y, beam.x, beam.y, side.start.x, side.start.y, side.end.x, side.end.y);
                if (intersect) {
                    const distance = this.getDistance(center, intersect);
                    if (distance < this.state.playerSight) {
                        const point = this.PointWithAngle(intersect.x, intersect.y, beam.a)
                        endPoints.push(point)
                    } else {
                        const t = this.state.playerSight / distance;
                        const point = this.PointWithAngle((1 - t) * center.x + t * intersect.x, (1 - t) * center.y + t * intersect.y, beam.a);
                        endPoints.push(point)
                    }
                    break;
                }
            }
        }
        this.setState({
            endPoints: endPoints
        })
        //this.clearFogOfWar(endPoints);
        //this.drawObstacles(endPoints);
    }

    isHexVisible(hex, endPoints) {
        const playerCenter = this.hexToPixel(this.state.playerPosition);
        const hexCenter = this.hexToPixel(hex);
        for (let i = 0; i < 6; i++) {
            const start = this.getHexCornerCoord(hexCenter, i);
            const end =this.getHexCornerCoord(hexCenter, i + 1);
            const sideCenter = {
                x: (start.x + end.x) / 2,
                y: (start.y + end.y) /2,
            }
            const deltaX = sideCenter.x - playerCenter.x;
            const deltaY = sideCenter.y - playerCenter.y;
            let angle = Math.round(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
            if (angle < 0) angle = angle + 360;
            let beams = [];
            for (let i = 0, len = endPoints.length; i < len; i++) {
                if (endPoints[i].a === angle) {
                    beams.push(endPoints[i])
                }
            }
            const beam = beams[0]
            if (beam) {
                for (let i = 0; i < 6; i++) {
                    const start = this.getHexCornerCoord(hexCenter, i);
                    const end =this.getHexCornerCoord(hexCenter, i + 1);
                    const intersect = this.lineIntersect(playerCenter.x, playerCenter.y, beam.x, beam.y, start.x, start.y, end.x, end.y);
                    if (intersect !== false) {
                        return true
                    }
                }
            }
        }
        return false;
    }

    clearFogOfWar(endPoints) {
        const { playerPosition } = this.state;
        const center = this.hexToPixel(playerPosition);
        const ctxCanvasFog = this.canvasFog.getContext("2d");
        const rGCanvasFog = ctxCanvasFog.createRadialGradient(center.x, center.y, this.state.playerSight - 100, center.x, center.y, this.state.playerSight);
        rGCanvasFog.addColorStop(0, "rgba(0, 0, 0, 1)");
        rGCanvasFog.addColorStop(0.9, "rgba(0, 0, 0, 0.1)");
        rGCanvasFog.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctxCanvasFog.fillStyle = rGCanvasFog;

        const ctxCanvasFogHide = this.canvasFogHide.getContext("2d");
        ctxCanvasFogHide.globalCompositeOperation = "source-out";
        ctxCanvasFogHide.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
        ctxCanvasFogHide.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctxCanvasFogHide.fillRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);

        const rGCanvasFogHide = ctxCanvasFogHide.createRadialGradient(center.x, center.y, this.state.playerSight - 100, center.x, center.y, this.state.playerSight);
        rGCanvasFogHide.addColorStop(0, "rgba(0, 0, 0, 1)");
        rGCanvasFogHide.addColorStop(0.9, "rgba(0, 0, 0, 0.1)");
        rGCanvasFogHide.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctxCanvasFogHide.globalCompositeOperation = "destination-out";
        ctxCanvasFogHide.fillStyle = rGCanvasFogHide;

        if (endPoints.length > 0) {
            ctxCanvasFog.beginPath();
            ctxCanvasFog.moveTo(endPoints[0].x, endPoints[0].y);
            ctxCanvasFogHide.beginPath();
            ctxCanvasFogHide.moveTo(endPoints[0].x, endPoints[0].y);
    
            for (let i = 0; i < endPoints.length; i++) {
                if (i + 1 === 360) {
                    ctxCanvasFog.lineTo(endPoints[i].x, endPoints[i].y)
                    ctxCanvasFogHide.lineTo(endPoints[i].x, endPoints[i].y)
                } else {
                    ctxCanvasFog.lineTo(endPoints[i].x, endPoints[i].y)
                    ctxCanvasFogHide.lineTo(endPoints[i].x, endPoints[i].y)
                }
            }
    
            ctxCanvasFogHide.closePath();
            ctxCanvasFogHide.fill();
    
            ctxCanvasFog.closePath();
            ctxCanvasFog.fill();
        } else {
            ctxCanvasFog.beginPath();
            ctxCanvasFog.arc(center.x, center.y, this.state.playerSight, 0, 2 * Math.PI)
            ctxCanvasFog.closePath();
            ctxCanvasFog.fill();

            ctxCanvasFogHide.beginPath();
            ctxCanvasFogHide.arc(center.x, center.y, this.state.playerSight, 0, 2 * Math.PI)
            ctxCanvasFogHide.closePath();
            ctxCanvasFogHide.fill();
        }
    }
 
    getObstacleSides() {
        const {
            nearestObstacles,
            playerPosition
        } = this.state;
        const {
            q,
            r,
            s
        } = playerPosition;
        const playerPositionCenter = this.hexToPixel(this.Hex(q, r, s));
        let arr = [];
        for (let i = 0, len = nearestObstacles.length; i < len; i++) {
            let hexCenter = this.hexToPixel(nearestObstacles[i]);
            let fromPlayerToHex = Math.floor(this.getDistance(playerPositionCenter, hexCenter));
            for (let i = 0; i < 6; i++) {
                let neighbor = this.getCubeNeighbor(nearestObstacles[i], i);
                if (!this.isHexIncluded(nearestObstacles, neighbor)) {
                    let start = this.getHexCornerCoord(hexCenter, i);
                    let end = this.getHexCornerCoord(hexCenter, i + 1);
                    let center = {
                        x: ((start.x + end.x) / 2),
                        y: ((start.y + end.y) / 2)
                    };
                    let fromPlayerToSide = Math.floor(this.getDistance(playerPositionCenter, center));
                    let side = {start, end}
                    if (fromPlayerToSide <= fromPlayerToHex) {
                        arr.push(side);
                    }
                    else {
                        continue;
                    }
                }

            }
        }
        this.setState({
                hexSides: arr
            },
            this.visibleFieldCallback = () => this.visibleField()
        )

    }

    getDistance(L1, L2) {
        return Math.hypot(L2.x - L1.x, L2.y - L1.y);
    }

    between(a, b, c) {
        let eps = 0.0000001;
        return a - eps <= b && b <= c + eps;
    }

    lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
            return false;
        }
        else {
            if (x1 >= x2) {
                if (!this.between(x2, x, x1)) {
                    return false;
                }
            }
            else {
                if (!this.between(x1, x, x2)) {
                    return false;
                }
            }
            if (y1 >= y2) {
                if (!this.between(y2, y, y1)) {
                    return false;
                }
            }
            else {
                if (!this.between(y1, y, y2)) {
                    return false;
                }
            }
            if (x3 >= x4) {
                if (!this.between(x4, x, x3)) {
                    return false;
                }
            }
            else {
                if (!this.between(x3, x, x4)) {
                    return false;
                }
            }
            if (y3 >= y4) {
                if (!this.between(y4, y, y3)) {
                    return false;
                }
            }
            else {
                if (!this.between(y3, y, y4)) {
                    return false;
                }
            }
        }
        return {
            x: x,
            y: y
        };
    }

    getHexBeamsCoord(center, i, range) {
        let angle_deg = 1 * i + 30;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = center.x + range * Math.cos(angle_rad);
        let y = center.y + range * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    getBeamsCoord(center, i, range) {
        let angle_deg = 1 * i;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = center.x + range * Math.cos(angle_rad);
        let y = center.y + range * Math.sin(angle_rad);
        return this.PointWithAngle(x, y, angle_deg);
    }

    /*drawObstacles(endPoints) {
        for (let i = 0; i < this.state.obstacles.length; i++) {
            if (this.isHexVisible(this.state.obstacles[i], endPoints)) {
                this.drawHex(this.canvasView, this.hexToPixel(this.state.obstacles[i]), 1, "black", "red");
                this.drawHex(this.canvasFog, this.hexToPixel(this.state.obstacles[i]), 1, "black", "red");
                this.drawHex(this.canvasFogHide, this.hexToPixel(this.state.obstacles[i]), 1, "black", "red");
            }
        }
    }*/

    breadthFirstSearch(playerPosition) {
        let {
            obstacles,
            hexPathMap
        } = this.state;
        var frontier = [playerPosition];
        var cameFrom = {};
        var nearestObstacles = [];
        cameFrom[JSON.stringify(playerPosition)] = JSON.stringify(playerPosition);
        while (frontier.length != 0) {
            var current = frontier.shift();
            let arr = this.getNeighbors(current);
            for (let i = 0, len = arr.length; i < len; i++) {
                if (!cameFrom.hasOwnProperty(JSON.stringify(arr[i])) && this.isHexIncluded(hexPathMap, arr[i])) {
                    frontier.push(arr[i]);
                    cameFrom[JSON.stringify(arr[i])] = JSON.stringify(current);
                }
                if (this.isHexIncluded(obstacles, arr[i])) {
                    nearestObstacles.push(arr[i])
                }
            }
        }
        cameFrom = Object.assign({}, cameFrom);
        this.setState({
                cameFrom: cameFrom,
                nearestObstacles: [...nearestObstacles]
            },
            this.getObstacleSidesCallback = () => this.getObstacleSides()
        )
    }

    isHexIncluded(arr, hex) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].q === hex.q && arr[i].r === hex.r && arr[i].s === hex.s) return true
        }
    }

    isHexSideIncluded(arr, hexSide) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].start.x === hexSide.start.x 
                && arr[i].start.y === hexSide.start.y 
                && arr[i].end.x === hexSide.end.x 
                && arr[i].end.y === hexSide.end.y) {
                    return true
                }
        }
        return false
    }

    areHexesEqual(h1, h2) {
        return h1.q === h2.q && h1.r === h2.r && h1.s === h2.s;
    }

    render() {
        return (
            <React.Fragment>
                <canvas ref={canvasHex => this.canvasHex = canvasHex }> </canvas>
                <canvas ref={canvasView => this.canvasView = canvasView }> </canvas>
                <canvas ref={canvasFog => this.canvasFog = canvasFog}></canvas>
                <canvas ref={canvasFogHide => this.canvasFogHide = canvasFogHide}></canvas>
                <canvas 
                    ref={canvasInteraction => this.canvasInteraction = canvasInteraction} 
                    onMouseMove = {this.handleMouseMove} 
                    onClick={this.handleClick}
                    onMouseOut = {this.handleMouseOut}
                    onMouseOver = {this.handleMouseOver}
                    > 
                </canvas>
          </React.Fragment>
        )
    }
}
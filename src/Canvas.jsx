import React from 'react';

var DUMMY_OBSTACLES = ['{"q":4,"r":-2,"s":-2}', '{"q":4,"r":-1,"s":-3}', '{"q":4,"r":0,"s":-4}', '{"q":4,"r":1,"s":-5}', '{"q":3,"r":2,"s":-5}', '{"q":2,"r":3,"s":-5}', '{"q":1,"r":4,"s":-5}', '{"q":0,"r":5,"s":-5}', '{"q":-1,"r":6,"s":-5}', '{"q":-2,"r":7,"s":-5}', '{"q":4,"r":-4,"s":0}', '{"q":3,"r":-4,"s":1}', '{"q":2,"r":-4,"s":2}', '{"q":1,"r":-4,"s":3}', '{"q":2,"r":-5,"s":3}', '{"q":3,"r":-6,"s":3}', '{"q":4,"r":-7,"s":3}', '{"q":5,"r":-9,"s":4}', '{"q":6,"r":-9,"s":3}', '{"q":7,"r":-9,"s":2}', '{"q":8,"r":-9,"s":1}', '{"q":9,"r":-9,"s":0}', '{"q":10,"r":-9,"s":-1}', '{"q":11,"r":-9,"s":-2}', '{"q":12,"r":-9,"s":-3}', '{"q":13,"r":-9,"s":-4}', '{"q":14,"r":-9,"s":-5}', '{"q":15,"r":-9,"s":-6}', '{"q":15,"r":-8,"s":-7}', '{"q":14,"r":-7,"s":-7}', '{"q":14,"r":-6,"s":-8}', '{"q":13,"r":-5,"s":-8}', '{"q":13,"r":-4,"s":-9}', '{"q":12,"r":-3,"s":-9}', '{"q":12,"r":-2,"s":-10}', '{"q":11,"r":-1,"s":-10}', '{"q":11,"r":0,"s":-11}', '{"q":10,"r":1,"s":-11}', '{"q":10,"r":2,"s":-12}', '{"q":9,"r":3,"s":-12}', '{"q":9,"r":4,"s":-13}', '{"q":8,"r":5,"s":-13}', '{"q":8,"r":6,"s":-14}', '{"q":7,"r":7,"s":-14}', '{"q":7,"r":8,"s":-15}', '{"q":6,"r":9,"s":-15}', '{"q":5,"r":9,"s":-14}', '{"q":4,"r":9,"s":-13}', '{"q":3,"r":9,"s":-12}', '{"q":2,"r":9,"s":-11}', '{"q":1,"r":9,"s":-10}', '{"q":0,"r":9,"s":-9}', '{"q":-1,"r":9,"s":-8}', '{"q":-2,"r":9,"s":-7}', '{"q":-3,"r":9,"s":-6}', '{"q":-4,"r":9,"s":-5}', '{"q":-5,"r":9,"s":-4}', '{"q":-5,"r":8,"s":-3}', '{"q":-5,"r":7,"s":-2}', '{"q":-5,"r":6,"s":-1}', '{"q":-5,"r":5,"s":0}', '{"q":-4,"r":4,"s":0}', '{"q":-3,"r":3,"s":0}', '{"q":-2,"r":-1,"s":3}', '{"q":-2,"r":-2,"s":4}', '{"q":-4,"r":1,"s":3}', '{"q":-4,"r":2,"s":2}', '{"q":-5,"r":3,"s":2}', '{"q":-7,"r":4,"s":3}', '{"q":-6,"r":4,"s":2}', '{"q":-8,"r":4,"s":4}', '{"q":-9,"r":4,"s":5}', '{"q":-10,"r":4,"s":6}', '{"q":-11,"r":4,"s":7}', '{"q":-12,"r":4,"s":8}', '{"q":-12,"r":2,"s":10}', '{"q":-12,"r":3,"s":9}', '{"q":-13,"r":4,"s":9}', '{"q":-13,"r":5,"s":8}', '{"q":-14,"r":6,"s":8}', '{"q":-14,"r":7,"s":7}', '{"q":-15,"r":8,"s":7}', '{"q":-15,"r":9,"s":6}', '{"q":-14,"r":9,"s":5}', '{"q":-13,"r":9,"s":4}', '{"q":-12,"r":9,"s":3}', '{"q":-11,"r":9,"s":2}', '{"q":-10,"r":9,"s":1}', '{"q":-9,"r":9,"s":0}', '{"q":-8,"r":9,"s":-1}', '{"q":-7,"r":9,"s":-2}', '{"q":-6,"r":9,"s":-3}', '{"q":-11,"r":1,"s":10}', '{"q":-11,"r":0,"s":11}', '{"q":-10,"r":-1,"s":11}', '{"q":-10,"r":-2,"s":12}', '{"q":-9,"r":-3,"s":12}', '{"q":-9,"r":-4,"s":13}', '{"q":-8,"r":-5,"s":13}', '{"q":-8,"r":-6,"s":14}', '{"q":-7,"r":-7,"s":14}', '{"q":-7,"r":-8,"s":15}', '{"q":-6,"r":-9,"s":15}', '{"q":-5,"r":-9,"s":14}', '{"q":-4,"r":-9,"s":13}', '{"q":-3,"r":-9,"s":12}', '{"q":-2,"r":-9,"s":11}', '{"q":-1,"r":-9,"s":10}', '{"q":0,"r":-9,"s":9}', '{"q":1,"r":-9,"s":8}', '{"q":2,"r":-9,"s":7}', '{"q":3,"r":-9,"s":6}', '{"q":4,"r":-9,"s":5}', '{"q":-2,"r":-8,"s":10}', '{"q":-3,"r":-7,"s":10}', '{"q":-4,"r":-6,"s":10}', '{"q":-5,"r":-5,"s":10}', '{"q":-6,"r":-4,"s":10}', '{"q":-7,"r":-4,"s":11}', '{"q":-6,"r":-2,"s":8}', '{"q":-6,"r":-1,"s":7}', '{"q":-6,"r":0,"s":6}', '{"q":-6,"r":1,"s":5}', '{"q":7,"r":-2,"s":-5}', '{"q":8,"r":-2,"s":-6}', '{"q":9,"r":-3,"s":-6}', '{"q":10,"r":-3,"s":-7}', '{"q":4,"r":5,"s":-9}', '{"q":4,"r":6,"s":-10}', '{"q":5,"r":6,"s":-11}', '{"q":5,"r":7,"s":-12}']


export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            hexSize: 20,
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
            obstacles: DUMMY_OBSTACLES,
            cameFrom: {},
            hexPathMap: [],
            path: [],
            hexSides: [],
            nearestObstacles: [],
            playerSight: 200
        }
    }
    componentWillMount() {
        let hexParametres = this.getHexParametres();
        this.setState({
            canvasSize: {
                canvasWidth: 800,
                canvasHeight: 600
            },
            hexParametres: hexParametres
        })
    }

    componentDidMount() {
        const {
            canvasWidth,
            canvasHeight
        } = this.state.canvasSize;
        this.canvasHex.width = canvasWidth;
        this.canvasHex.height = canvasHeight;
        this.canvasInteraction.width = canvasWidth;
        this.canvasInteraction.height = canvasHeight;
        this.canvasView.width = canvasWidth;
        this.canvasView.height = canvasHeight;
        this.canvasCoordinates.width = canvasWidth;
        this.canvasCoordinates.height = canvasHeight;
        this.getCanvasPosition(this.canvasInteraction);
        this.drawHex(this.canvasInteraction, this.hexToPixel(this.state.playerPosition), 1, "grey", "yellow", 0.2);
        this.drawHexes();
        this.drawObstacles();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.cameFrom !== this.state.cameFrom) {
            const {
                canvasWidth,
                canvasHeight
            } = this.state.canvasSize;
            const ctx = this.canvasView.getContext("2d");
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            for (let l in nextState.cameFrom) {
                const {
                    q,
                    r,
                    s
                } = JSON.parse(l);
                const {
                    x,
                    y
                } = this.hexToPixel(this.Hex(q, r));
                this.drawHex(this.canvasView, this.Point(x, y), 1, "black", "green", 0.1);
            }
            return true;
        }


        return false;
    }

    drawHexes() {
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
        const hexOrigin = this.state.hexOrigin;
        let qLeftSide = Math.round(hexOrigin.x / horizDist);
        let qRightSide = Math.round((canvasWidth - hexOrigin.x) / horizDist);
        let rTopSide = Math.round(hexOrigin.y / vertDist);
        let rBottomSide = Math.round((canvasHeight - hexOrigin.y) / vertDist);
        var hexPathMap = [];
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
                if ((x > hexWidth / 2 && x < canvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < canvasHeight - hexHeight / 2)) {
                    this.drawHex(this.canvasHex, this.Point(x, y), 1, "black", "grey");
                    this.drawHexCoordinates(this.canvasCoordinates, this.Point(x, y), this.Hex(q - p, r, -(q - p) - r));
                    var bottomH = JSON.stringify(this.Hex(q - p, r, -(q - p) - r));
                    if (!this.state.obstacles.includes(bottomH)) {
                        hexPathMap.push(bottomH);
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
                if ((x > hexWidth / 2 && x < canvasWidth - hexWidth / 2) && (y > hexHeight / 2 && y < canvasHeight - hexHeight / 2)) {
                    this.drawHex(this.canvasHex, this.Point(x, y), 1, "black", "grey");
                    this.drawHexCoordinates(this.canvasCoordinates, this.Point(x, y), this.Hex(q + n, r, -(q + n) - r));
                    var topH = JSON.stringify(this.Hex(q + n, r, -(q + n) - r));
                    if (!this.state.obstacles.includes(topH)) {
                        hexPathMap.push(topH);
                    }
                }
            }
        }
        hexPathMap = [].concat(hexPathMap);
        this.setState({
                hexPathMap: hexPathMap
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
        let x = center.x + this.state.hexSize * Math.cos(angle_rad);
        let y = center.y + this.state.hexSize * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    getHexParametres() {
        let hexHeight = this.state.hexSize * 2;
        let hexWidth = Math.sqrt(3) / 2 * hexHeight;
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
        let x = this.state.hexSize * Math.sqrt(3) * (h.q + h.r / 2) + hexOrigin.x;
        let y = this.state.hexSize * 3 / 2 * h.r + hexOrigin.y;
        return this.Point(x, y)
    }

    pixelToHex(p) {
        let size = this.state.hexSize;
        let origin = this.state.hexOrigin;
        let q = ((p.x - origin.x) * Math.sqrt(3) / 3 - (p.y - origin.y) / 3) / size
        let r = (p.y - origin.y) * 2 / 3 / size
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
        ctx.globalAlpha = 0.5;
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
            let beam = this.getHexBeamsCoord(center, i, 800);
            for (let i = 0; i < hexSides.length; i++) {
                let side = JSON.parse(hexSides[i]);

                let intersect = this.lineIntersect(center.x, center.y, beam.x, beam.y, side.start.x, side.start.y, side.end.x, side.end.y);
                if (intersect) {
                    const distance = this.getDistance(center, intersect);
                    if (distance < this.state.playerSight) {
                        //this.drawLine(this.canvasInteraction, center, intersect, 1, "yellow");
                        endPoints.push(intersect)
                    } else {
                        const t = this.state.playerSight / distance;
                        const point = this.Point((1 - t) * center.x + t * intersect.x, (1 - t) * center.y + t * intersect.y);
                        //this.drawLine(this.canvasInteraction, center, point, 1, "yellow");
                        endPoints.push(point)
                    }
                    break;
                }
            }
        }
        for (let i = 0; i < endPoints.length; i++) {
            if (i + 1 === 360) {
                this.drawLine(this.canvasInteraction, endPoints[i], endPoints[0], 1, "yellow");
            } else {
                this.drawLine(this.canvasInteraction, endPoints[i], endPoints[i + 1], 1, "yellow");
            }
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
        nearestObstacles.map((l) => {
            let hexCenter = this.hexToPixel(JSON.parse(l));
            let fromPlayerToHex = Math.floor(this.getDistance(playerPositionCenter, hexCenter));
            for (let i = 0; i < 6; i++) {
                let neighbor = JSON.stringify(this.getCubeNeighbor(JSON.parse(l), i));
                if (!nearestObstacles.includes(neighbor)) {
                    let start = this.getHexCornerCoord(hexCenter, i);
                    let end = this.getHexCornerCoord(hexCenter, i + 1);
                    let center = {
                        x: ((start.x + end.x) / 2),
                        y: ((start.y + end.y) / 2)
                    };
                    let fromPlayerToSide = Math.floor(this.getDistance(playerPositionCenter, center));
                    let side = JSON.stringify({
                        start,
                        end
                    });
                    if (fromPlayerToSide <= fromPlayerToHex && !arr.includes(side)) {
                        arr.push(side);
                    }
                    else {
                        continue;
                    }
                }

            }
        })
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

    drawObstacles() {
        this.state.obstacles.map((l) => {
            const {
                q,
                r,
                s
            } = JSON.parse(l);
            const {
                x,
                y
            } = this.hexToPixel(this.Hex(q, r, s));
            this.drawHex(this.canvasHex, this.Point(x, y), 1, "black", "black");
        })
    }

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
            arr.map((l) => {
                if (!cameFrom.hasOwnProperty(JSON.stringify(l)) && hexPathMap.includes(JSON.stringify(l))) {
                    frontier.push(l);
                    cameFrom[JSON.stringify(l)] = JSON.stringify(current);
                }
                if (obstacles.includes(JSON.stringify(l))) {
                    nearestObstacles.push(JSON.stringify(l))
                }
            })
        }
        cameFrom = Object.assign({}, cameFrom);
        this.setState({
                cameFrom: cameFrom,
                nearestObstacles: nearestObstacles
            },
            this.getObstacleSidesCallback = () => this.getObstacleSides()
        )
    }

    render() {
        return (
            <React.Fragment>
                <canvas ref={canvasHex => this.canvasHex = canvasHex }> </canvas>
                <canvas ref={canvasCoordinates => this.canvasCoordinates = canvasCoordinates }> </canvas>
                <canvas ref={canvasView => this.canvasView = canvasView }> </canvas>
                <canvas ref={canvasInteraction => this.canvasInteraction = canvasInteraction} onMouseMove = {this.handleMouseMove} onClick={this.handleClick}> </canvas>
          </React.Fragment>
        )
    }
}
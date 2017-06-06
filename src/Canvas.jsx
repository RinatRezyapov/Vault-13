import React from 'react';
import '../styles/index.scss';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hexSize: 20,
      hexOrigin: {x: 400, y: 300 }
    }
  }
  componentWillMount() {
  let hexParametres =  this.getHexParametres();
    this.setState({
      canvasSize: { canvasWidth: 800, canvasHeight: 600 },
      hexParametres: hexParametres
    })
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasHex.width = canvasWidth;
    this.canvasHex.height = canvasHeight;
    this.drawHexes();
  }

drawHexes() {
  const { canvasWidth, canvasHeight } = this.state.canvasSize;
  const { hexWidth, hexHeight, vertDist, horizDist } = this.state.hexParametres;
  const hexOrigin = this.state.hexOrigin;
  let qLeftSide = Math.round(hexOrigin.x/horizDist);
  let qRightSide = Math.round((canvasWidth - hexOrigin.x)/horizDist);
  let rTopSide = Math.round(hexOrigin.y/vertDist);
  let rBottomSide = Math.round((canvasHeight - hexOrigin.y)/vertDist);
  console.log(qLeftSide, qRightSide, rTopSide, rBottomSide)
  var p = 0;
  for (let r = 0; r <= rBottomSide; r++) {
    if(r%2 == 0 && r !==0) {
      p++;
    }
    for (let q = -qLeftSide; q <= qRightSide; q++) {
        const { x, y } = this.hexToPixel(this.Hex(q-p, r));
        if ((x >hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
          this.drawHex(this.canvasHex, this.Point(x,y));
          this.drawHexCoordinates(this.canvasHex, this.Point(x,y), this.Hex(q-p, r));
        }
    }
  }

var n = 0;
  for (let r = -1; r >= -rTopSide; r--) {
    if(r%2 !== 0) {
      n++;
    }
    for (let q = -qLeftSide; q <= qRightSide; q++) {
        const { x, y } = this.hexToPixel(this.Hex(q+n, r));
          if ((x >hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
        this.drawHex(this.canvasHex, this.Point(x,y));
        this.drawHexCoordinates(this.canvasHex, this.Point(x,y), this.Hex(q+n, r));
      }
    }
  }
}
  /*drawHexes() {
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    const { hexWidth, hexHeight, vertDist, horizDist } = this.state.hexParametres;
    const hexOrigin = this.state.hexOrigin;
    let qLeftSide = Math.round(hexOrigin.x/hexWidth)*4;
    let qRightSide = Math.round(canvasWidth - hexOrigin.x)/hexWidth*2;
    let rTopSide = Math.round(hexOrigin.y/(hexHeight/2));
    let rBottomSide = Math.round((canvasHeight - hexOrigin.y)/(hexHeight/2));
    for (let r = -rTopSide; r <= rBottomSide; r++) {
      for (let q = -qLeftSide; q <= qRightSide; q++) {
        let center = this.hexToPixel(this.Hex(q, r));
        if ((center.x >hexWidth/2 && center.x < canvasWidth - hexWidth/2) && (center.y > hexHeight/2 && center.y < canvasHeight - hexHeight/2)) {
          this.drawHex(this.canvasHex, center);
          this.drawHexCoordinates(this.canvasHex, center, this.Hex(q, r));
        }
      }
    }
  }*/

drawHex(canvasID, center) {
  for (let i = 0; i <= 5; i++) {
    let start = this.getHexCornerCoord(center, i);
    let end = this.getHexCornerCoord(center, i + 1);
    this.drawLine(canvasID, { x: start.x, y: start.y }, { x: end.x, y: end.y });
  }
}

   getHexCornerCoord(center, i) {
     let angle_deg = 60 * i   + 30;
     let angle_rad = Math.PI / 180 * angle_deg;
     let x = center.x + this.state.hexSize * Math.cos(angle_rad);
    let y = center.y + this.state.hexSize * Math.sin(angle_rad);
    return this.Point(x, y);
   }

getHexParametres() {
  let hexHeight = this.state.hexSize * 2;
  let hexWidth = Math.sqrt(3)/2 * hexHeight;
  let vertDist = hexHeight * 3/4;
  let horizDist = hexWidth;
  return { hexWidth, hexHeight, vertDist, horizDist }
}
   hexToPixel(h) {
     let hexOrigin = this.state.hexOrigin;
     let x = this.state.hexSize * Math.sqrt(3) * (h.q + h.r/2) + hexOrigin.x;
     let y = this.state.hexSize * 3/2 * h.r + hexOrigin.y;
     return this.Point(x, y)
   }

   Point(x, y) {
     return {x: x, y: y}
   }

   Hex(q, r) {
     return {q: q, r: r}
   }

   drawLine(canvasID, start, end) {
     const ctx = canvasID.getContext("2d");
     ctx.beginPath();
     ctx.moveTo(start.x, start.y);
     ctx.lineTo(end.x, end.y);
     ctx.stroke();
     ctx.closePath();
   }

   drawHexCoordinates(canvasID, center, h) {
     const ctx = canvasID.getContext("2d");
     ctx.fillText(h.q, center.x-10, center.y);
     ctx.fillText(h.r, center.x+7, center.y);
   }

  render() {
    return (
      <div>
      <canvas ref={canvasHex => this.canvasHex = canvasHex }> </canvas>
      </div>
    )
  }
}

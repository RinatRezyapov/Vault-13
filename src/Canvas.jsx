import React from 'react';
import '../styles/index.scss';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hexSize: 20
    }
  }
  componentWillMount() {
    this.setState({
      canvasSize: { canvasWidth: 800, canvasHeight: 600 }
    })
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasHex.width = canvasWidth;
    this.canvasHex.height = canvasHeight;
    this.drawHex(this.canvasHex, { x: 50, y: 50 })
  }

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

   Point(x, y) {
     return {x: x, y: y}
   }

   drawLine(canvasID, start, end) {
     const ctx = canvasID.getContext("2d");
     ctx.beginPath();
     ctx.moveTo(start.x, start.y);
     ctx.lineTo(end.x, end.y);
     ctx.stroke();
     ctx.closePath();
   }

  render() {
    return (
      <div>
      <canvas ref={canvasHex => this.canvasHex = canvasHex }> </canvas>
      </div>
    )
  }
}

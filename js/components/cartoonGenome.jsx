import React from 'react';
import * as helper from '../misc/helperFunctions';

/*
  cartoon genome
*/
export const Cartoon = React.createClass({
  propTypes: {
    visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    genomeLength: React.PropTypes.number.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  componentDidMount: function () {
    this.redraw(this.props);
  },

  componentWillUpdate(props) {
    this.redraw(props);
  },

  render() {
    return (
      <div>
        <canvas
          id="Blocks"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  redraw: function (props) {
    this.initCanvasXY(); // expensive way to handle resizing
    this.clearCanvas(); // needed????
    const gutter = 10; // pixels of blank space on either side
    const yMiddle = parseInt(this.canvas.height / 2, 10);
    const xStartLine  = gutter;
    const xLineFinish = parseInt(this.canvas.width, 10) - gutter;
    const xLineLength = parseInt(this.canvas.width, 10) - 2 * gutter;
    const xViewStart = parseInt(props.visibleGenome[0] / props.genomeLength * xLineLength + xStartLine, 10);
    let xViewLength = parseInt((props.visibleGenome[1] - props.visibleGenome[0]) / props.genomeLength * xLineLength, 10);
    if (xViewLength < 1) {
      xViewLength = 1;
    }
    const context = this.canvas.getContext('2d');
    context.save();
    // draw a horisontal line
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(xStartLine, yMiddle);
    context.lineTo(xLineFinish, yMiddle);
    context.stroke();

    // shade a box
    context.globalAlpha = 0.2;
    context.fillStyle = 'black';
    context.fillRect(xViewStart, parseInt(this.canvas.height / 4, 10), xViewLength, parseInt(this.canvas.height / 2, 10));
    context.globalAlpha = 1;

    context.restore();
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,

});

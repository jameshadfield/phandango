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
    this.initCanvasXY(); // expensive way to handle resizing
    this.redraw(this.canvas.getContext('2d'), this.props);
    window.addEventListener('pdf', this.svgdraw, false);
  },

  componentWillUpdate(props) {
    this.initCanvasXY(); // expensive way to handle resizing
    this.clearCanvas(); // needed????
    this.redraw(this.canvas.getContext('2d'), props);
  },


  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
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

  svgdraw() {
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log('printing cartoon to SVG');
    window.svgCtx.save();
    window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
    window.svgCtx.stroke();
    window.svgCtx.clip();
    this.redraw(window.svgCtx, this.props);
    window.svgCtx.restore();
  },


  redraw: function (context, props) {
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

    context.save();
    context.translate(0.5, 0.5);
    // draw a horizontal line
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

import React from 'react';
// import { initCanvasXY, clearCanvas } from '../misc/helperFunctions';
import * as helper from '../misc/helperFunctions';

/*
  The Metadata Key canvas
  Perhaps this would be better of as a series of divs or as a SVG rather than canvas
  TO DO: don't display columns which are toggled off!
*/
export const MetadataKey = React.createClass({
  propTypes: {
    metadata: React.PropTypes.object.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  componentDidMount: function () { // don't use fat arrow
    this.forceUpdate();
    window.addEventListener('pdf', this.svgdraw, false);
  },


  componentWillUpdate(props) {
    if (!props.metadata.toggles) {
      return;
    }
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();
    const blockWidth = 50;
    const numCols = props.metadata.toggles.reduce((pv, cv) => cv ? pv + 1 : pv, 0);
    const xVals = this.calculateXValuesForColumns(this.canvas, numCols, blockWidth);
    this.draw(this.canvas.getContext('2d'), this.canvas.width, this.canvas.height, props.metadata, xVals, blockWidth);
  },

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
  },

  render() {
    return (
      <div>
        <canvas
          id="MetadataKey"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  svgdraw() {
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log('printing metadata key to SVG');
    window.svgCtx.save();
    window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
    window.svgCtx.stroke();
    window.svgCtx.clip();

    // now the bits specific to metadata key
    const blockWidth = 50;
    const numCols = this.props.metadata.toggles.reduce((pv, cv) => cv ? pv + 1 : pv, 0);
    const xVals = this.calculateXValuesForColumns(this.canvas, numCols, blockWidth);
    this.draw(window.svgCtx, this.canvas.width, this.canvas.height, this.props.metadata, xVals, blockWidth);

    window.svgCtx.restore();
  },

  /* draw() draws the coloured squares and text which form the metadata key (canvas)
   * {int} colIdx - index of active columns to draw (xVals gives offsets)
   * {int} headerIdx - index of header in metadata (may be toggled off / on)
   * {int} valueIdx - index of the value within each header
   */
  draw(context, canvasWidth, canvasHeight, metadata, xVals, blockWidth) {
    let colIdx = 0; // like headerIdx but doesn't increase if toggled off
    for (let headerIdx = 0; headerIdx < metadata.toggles.length; headerIdx++) {
      if (metadata.toggles[headerIdx]) {
        let yTopPx = 40;
        // header text
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.textAlign = 'left';

        const headerName = metadata.headerNames[headerIdx];

        let headerFontSize = 18;
        context.font = String(headerFontSize) + 'px Helvetica';

        const availableLengthForHeader = parseInt(canvasWidth / metadata.toggles.length, 10);

        while (context.measureText(headerName).width > availableLengthForHeader && headerFontSize >= 12) {
          headerFontSize -= 1;
          context.font = String(headerFontSize) + 'px Helvetica';
        }

        context.fillText(headerName, xVals[colIdx][0], 20);

        const numVals = metadata.values[headerIdx].length;
        const yHeight = parseInt( (canvasHeight - yTopPx) / numVals, 10);

        for (let valueIdx = 0; valueIdx < numVals; valueIdx++) {
          // console.log(xVals[colIdx])
          context.save(); // needed?
          context.fillStyle = metadata.colours[headerIdx][valueIdx];
          // context.globalAlpha = 0.3;
          context.fillRect(xVals[colIdx][0], yTopPx, blockWidth, yHeight);
          context.restore();

          // now for the text
          context.fillStyle = 'black';
          context.textBaseline = 'middle';
          context.textAlign = 'left';
          context.font = '12px Helvetica';
          const text = metadata.values[headerIdx][valueIdx];
          context.fillText(text, xVals[colIdx][1], yTopPx + yHeight / 2);
          yTopPx += yHeight;
        }
        colIdx++;
      }
    }
  },


  calculateXValuesForColumns(canvas, numColumns, blockWidth) {
    const pxPerCol = parseInt(canvas.width / numColumns, 10);
    const ret = [];
    for (let i = 0; i < numColumns; i++) {
      const leftPx = i * pxPerCol;
      ret.push([ leftPx, leftPx + blockWidth + 10 ]);
    }
    return ret;
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,

});

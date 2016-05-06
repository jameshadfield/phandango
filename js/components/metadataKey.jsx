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
    window.addEventListener('resize', this.resizeFn, false);
  },

  componentWillUpdate(props) {
    if (!props.metadata.toggles) {
      return;
    }
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();

    const colIdxsToUse = this.columnIndexesToDisplay(this.canvas, props.metadata.toggles, props.metadata.info);
    const [ blockwidth, blockStartValuesX, textStartValuesX ] = this.calculateWidthsOfColumns(this.canvas, colIdxsToUse.length);
    this.draw(
      this.canvas.getContext('2d'),
      this.canvas.width,
      this.canvas.height,
      props.metadata,
      colIdxsToUse,
      blockwidth,
      blockStartValuesX,
      textStartValuesX
    );
  },

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
    window.removeEventListener('resize', this.resizeFn, false);
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

  resizeFn: function () {
    this.forceUpdate();
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
    const colIdxsToUse = this.columnIndexesToDisplay(this.canvas, this.props.metadata.toggles, this.props.metadata.info);
    const [ blockwidth, blockStartValuesX, textStartValuesX ] = this.calculateWidthsOfColumns(this.canvas, colIdxsToUse.length);
    this.draw(
      window.svgCtx,
      this.canvas.width,
      this.canvas.height,
      this.props.metadata,
      colIdxsToUse,
      blockwidth,
      blockStartValuesX,
      textStartValuesX
    );
    window.svgCtx.restore();
  },

  /* draw() draws the coloured squares and text which form the metadata key (canvas)
   *
   * indicies:
   * countIdx - the column count as displayed on the screen (left -> right)
   * headerIdx - the index of the header in the metadata
   *
   * {array of ints} colIdxsToUse - indexes of active columns to draw (values are headerIdxs)
   * {int} blockwidth - width of coloured block
   * {array of ints} blockStartValuesX - pixel start values for block in each column (use countIdx)
   * {array of ints} textStartValuesX - pixel start values for text in each column (use countIdx)
   */
  draw(context, canvasWidth, canvasHeight, metadata, colIdxsToUse, blockwidth, blockStartValuesX, textStartValuesX) {
    for (let countIdx = 0; countIdx < colIdxsToUse.length; countIdx++) {
      const headerIdx = colIdxsToUse[countIdx];

      /* start by printing the headers for each column */
      let headerName = metadata.headerNames[headerIdx];
      if (metadata.info[headerIdx].inGroup) {
        headerName = 'group ' + String(metadata.info[headerIdx].groupId);
        // metadata.info[headerIdx].type + ' ' + );
      }
      let yTopPx = 40; /* margin to print column headers */
      context.fillStyle = 'black';
      context.textBaseline = 'middle';
      context.textAlign = 'left';
      let headerFontSize = 18;
      context.font = String(headerFontSize) + 'px Helvetica';
      const availableLengthForHeader = parseInt(canvasWidth / colIdxsToUse.length, 10);
      while (context.measureText(headerName).width > availableLengthForHeader && headerFontSize >= 12) {
        headerFontSize -= 1;
        context.font = String(headerFontSize) + 'px Helvetica';
      }
      context.fillText(headerName, blockStartValuesX[countIdx], 20); /* blockStart... not textStart for header */

      /* now move onto printing the column of coloured blocks */
      let numVals;
      if (metadata.info[headerIdx].inGroup) {
        numVals = metadata.groups[metadata.info[headerIdx].groupId].values.length;
      } else {
        numVals = metadata.values[headerIdx].length;
      }
      const yHeight = parseInt( (canvasHeight - yTopPx) / numVals, 10);

      /* the column comprises rows for each value */
      for (let valueIdx = 0; valueIdx < numVals; valueIdx++) {
        /* the text */
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.textAlign = 'left';
        context.font = '12px Helvetica';
        let text;
        if (metadata.info[headerIdx].inGroup) {
          text = metadata.groups[metadata.info[headerIdx].groupId].values[valueIdx];
        } else {
          text = metadata.values[headerIdx][valueIdx];
        }
        context.fillText(text, textStartValuesX[countIdx], yTopPx + yHeight / 2);

        /* the block */
        context.save(); // needed?
        if (metadata.info[headerIdx].inGroup) {
          context.fillStyle = metadata.groups[metadata.info[headerIdx].groupId].colours[valueIdx];
        } else {
          context.fillStyle = metadata.colours[headerIdx][valueIdx];
        }
        context.fillRect(blockStartValuesX[countIdx], yTopPx, blockwidth, yHeight);
        context.restore();

        yTopPx += yHeight;
      }
    }
  },

  columnIndexesToDisplay(canvas, toggles, info) {
    const minPixelsPerColumn = 100;
    const maximumAllowableNumColumns = parseInt(canvas.width / minPixelsPerColumn, 10);
    let colIdxsToUse = [];
    const groupsSeen = [];

    // first, try to display groups (over individual columns):
    for (let idx = 0; idx < toggles.length; idx++) {
      if (toggles[idx]) {
        if (info[idx].inGroup) {
          // seen already?
          if (groupsSeen.indexOf(info[idx].groupId) === -1) {
            groupsSeen.push(info[idx].groupId);
            colIdxsToUse.push(idx);
          }
        }
      }
    }

    // now use the other columns
    for (let idx = 0; idx < toggles.length; idx++) {
      if (toggles[idx] && colIdxsToUse.indexOf(idx) === -1 && !info[idx].inGroup) {
        colIdxsToUse.push(idx);
      }
    }

    if (colIdxsToUse.length > maximumAllowableNumColumns) {
      colIdxsToUse = colIdxsToUse.slice(0, maximumAllowableNumColumns);
    }
    return (colIdxsToUse);
  },

  calculateWidthsOfColumns(canvas, numCols) {
    const pixelsPerColumn = parseInt(canvas.width / numCols, 10);
    let blockwidth = parseInt(pixelsPerColumn / 4, 10);
    if (blockwidth > 50) {
      blockwidth = 50;
    }
    const blockStartValuesX = [];
    const textStartValuesX = [];
    for (let i = 0; i < numCols; i++) {
      const leftPx = i * pixelsPerColumn;
      blockStartValuesX.push(leftPx);
      textStartValuesX.push(leftPx + blockwidth + 10);
    }
    return [ blockwidth, blockStartValuesX, textStartValuesX ];
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,

});

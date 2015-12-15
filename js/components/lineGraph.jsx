import React from 'react';
// import { Mouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';

/*
  The Annotation component
  The only state here is the gene that's currently selected (and even this is a bad idea!)
*/
export const Line = React.createClass({
  propTypes: {
    // visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    // dispatch: React.PropTypes.func.isRequired,
    // data: React.PropTypes.array.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  componentDidMount: function () { // don't use fat arrow
    this.initCanvasXY();
    this.redraw(this.props);
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props) {
    this.redraw(props);
  },

  render() {
    return (
      <div>
        <canvas
          id="recombGraphDiv"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  redraw: function (props) {
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();
    this.drawLineGraph(this.canvas, props.visibleGenome, props.values, props.max);
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
  // drawAxis: _drawAxis,
  drawLineGraph: _drawLineGraph,

});

/* incoming state (connected)
values, max, visibleGenome

*/

function _drawLineGraph(canvas, visibleGenome, values, max) {
  const colour = 'orange';
  const context = canvas.getContext('2d');
  const yScaleMultiplier = parseFloat( canvas.height / max );

  context.save();
  context.strokeStyle = colour;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, canvas.height);
  // crawl across the x axis by pixel :)
  for (let x = 1; x <= canvas.width; x++) {
    const genomeX = parseInt(visibleGenome[0] + (x / canvas.width) * (visibleGenome[1] - visibleGenome[0]), 10);
    const y = canvas.height - (values[genomeX] * yScaleMultiplier);
    context.lineTo(x, y );
  }
  context.stroke();
  context.restore();
}

// function drawAxis(canvas) {
//   const context = canvas.getContext('2d');
//   // const myState = this;
//   const maximumYvalue = PlotStore.getPlotMaxY(plotName);
//   // console.log('maximumYvalue',maximumYvalue)
//   const yScaleMultiplier = parseFloat( canvas.height / maximumYvalue ); // double up!
//   // console.log('this:', this)
//   function drawTicks(vals, tickLengthPx, valsArePerc) {
//     if (valsArePerc) {
//       for (let i = 0; i < vals.length; i++) {
//         vals[i] = canvas.height * (1 - (100 - vals[i]) / 100);
//       }
//     }
//     // we are starting at 0,0 (i.e. TOP LEFT)
//     context.beginPath();
//     context.moveTo(0, 0);
//     for (let i = 0; i < vals.length; i++) {
//       context.lineTo(0, vals[i]);
//       context.lineTo(tickLengthPx, vals[i]);
//       context.lineTo(0, vals[i]);
//     }
//     context.stroke();
//   }
//   function getYPixelValsForGivenVals(vals) {
//     // N.B. these are measured from the top!!!!
//     const ret = [];
//     for (let i = 0; i < vals.length; i++) {
//       ret.push(canvas.height - (vals[i] * yScaleMultiplier));
//     }
//     return ret;
//   }
//   function drawDottedLine(yValPx) {
//     context.save();
//     context.strokeStyle = 'red';
//     context.setLineDash([ 5, 10 ]);
//     context.beginPath();
//     context.moveTo(0, yValPx);
//     context.lineTo(canvas.width, yValPx);
//     context.stroke();
//     context.restore();
//   }
//   context.save();
//   context.beginPath();
//   context.moveTo(canvas.width, canvas.height);
//   context.lineTo(0, canvas.height); // bottom line :)
//   context.lineTo(0, 0); // left hand axis (now at top left)
//   context.stroke();
//   context.restore();

//   if (plotName === 'GWAS') {
//     drawDottedLine(getYPixelValsForGivenVals([ 5 ])[0]);
//   } else if (RawDataStore.getGenomicDatasetType() === 'roary') {
//     drawDottedLine(parseInt(canvas.height * 0.25, 10));
//     drawDottedLine(parseInt(canvas.height * 0.05, 10));
//   }

//   // some text :)
//   context.save();
//   context.fillStyle = 'black';
//   context.textBaseline = 'middle';
//   context.textAlign = 'left';
//   context.font = '12px Helvetica';
//   if (plotName === 'GWAS') {
//     const yVals = Array.apply(0, Array(Math.floor(maximumYvalue))).map(function (_, b) {return (b + 1);});
//     const yValsPx = getYPixelValsForGivenVals(yVals);
//     drawTicks(yValsPx, 5, false);
//     for (let i = 0; i < yVals.length; i++) {
//       context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i], 10));
//     }
//   } else {
//     if (RawDataStore.getGenomicDatasetType() === 'gubbins') {
//       const numTicks = 4;
//       const yVals = Array.apply(0, Array(numTicks)).map(function (_, b) {
//         return (Math.floor(maximumYvalue * (b + 1) / numTicks));
//       });
//       const yValsPx = getYPixelValsForGivenVals(yVals);
//       drawTicks(yValsPx, 5, false);
//       for (let i = 0; i < yVals.length; i++) {
//         context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i], 10));
//       }
//     } else { // R O A R Y
//       drawTicks([ 100, 75, 50, 25 ], 5, true);
//       context.fillText('100%', 5, 5);
//       context.fillText('75%', 5, parseInt(canvas.height * 0.25, 10));
//       context.fillText('50%', 5, parseInt(canvas.height * 0.5, 10));
//       context.fillText('25%', 5, parseInt(canvas.height * 0.75, 10));
//     }
//   }
//   context.restore();
// }

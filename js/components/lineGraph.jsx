import React from 'react';
import { Mouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { drawGraphAxis } from './graphAxis';


export const Line = React.createClass({
  propTypes: {
    /* props not validated due to speed:
     * values {array of array of nums} - the main line graph
     * subValues {array of nums | undefined}
     */
    max: React.PropTypes.number.isRequired,
    visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    style: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    lineColours: React.PropTypes.array.isRequired,
  },

  componentDidMount: function () { // don't use fat arrow
    this.mouse = new Mouse(this.canvas, this.props.dispatch, function () {}); // set up listeners
    this.initCanvasXY();
    this.drawWrapper(this.props);
    window.addEventListener('pdf', this.svgdraw, false);
    window.addEventListener('resize', this.resizeFn, false);
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props) {
    this.initCanvasXY(); // expensive way to handle resizing
    this.clearCanvas();
    this.drawWrapper(props);
  },

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
    window.removeEventListener('resize', this.resizeFn, false);
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

  resizeFn: function () {
    this.forceUpdate();
  },

  svgdraw() {
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log('printing line graph to SVG');
    window.svgCtx.save();
    window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
    window.svgCtx.stroke();
    window.svgCtx.clip();
    this.drawWrapper(this.props, true);
    window.svgCtx.restore();
  },

  drawWrapper(props, pdfoutput = false) {
    for (let idx = 0; idx < props.values.length; idx++) {
      this.drawLineGraph(this.canvas, props.visibleGenome, props.values[idx], props.max, props.lineColours[idx], pdfoutput);
    }
    // if (props.subValues && props.subValues.length!=0) {
    //   this.drawLineGraph(this.canvas, props.visibleGenome, props.subValues, props.max, 'gray', pdfoutput);
    // }
    this.drawGraphAxis(this.canvas, {
      yMaxValue: props.max,
      numTicks: 4,
      pdfoutput,
    });
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
  drawGraphAxis: drawGraphAxis,

  drawLineGraph(canvas, visibleGenome, values, max, colour = 'orange', pdfoutput = false) {
    let context = this.canvas.getContext('2d');
    if (pdfoutput) {
      context = window.svgCtx;
    }
    const yScaleMultiplier = parseFloat( canvas.height / max );

    context.save();
    context.lineWidth = 2;
    context.strokeStyle = colour;
    context.beginPath();
    context.moveTo(0, canvas.height);
    // crawl across the x axis by pixel :)
    for (let x = 1; x <= canvas.width; x++) {
      const genomeX = parseInt((visibleGenome[0] + (x / canvas.width) * (visibleGenome[1] - visibleGenome[0])) - 1, 10);
      const y = canvas.height - (values[genomeX] * yScaleMultiplier);
      context.lineTo(x, y );
    }
    context.stroke();
    context.restore();
  },

});



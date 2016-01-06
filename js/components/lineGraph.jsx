import React from 'react';
import { Mouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { drawGraphAxis } from './graphAxis';
/*
  The Annotation component
  The only state here is the gene that's currently selected (and even this is a bad idea!)
*/
export const Line = React.createClass({
  propTypes: {
    /* props not validated due to speed:
     * values {array of nums} - the main line graph
     * subValues {array of nums | undefined} - the subgraph values OR undefined
     */
    max: React.PropTypes.number.isRequired,
    visibleGenome: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    style: React.PropTypes.object.isRequired,
  },

  componentDidMount: function () { // don't use fat arrow
    this.mouse = new Mouse(this.canvas, this.props.dispatch, this.onClickCallback); // set up listeners
    this.forceUpdate();
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props) {
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();
    this.drawLineGraph(this.canvas, props.visibleGenome, props.values, props.max);
    if (props.subValues) {
      this.drawLineGraph(this.canvas, props.visibleGenome, props.subValues, props.max, 'purple');
    }
    this.drawGraphAxis(this.canvas, {
      yMaxValue: props.max,
      numTicks: 4,
    });
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

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
  drawGraphAxis: drawGraphAxis,

  drawLineGraph(canvas, visibleGenome, values, max, colour = 'orange') {
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
  },

});



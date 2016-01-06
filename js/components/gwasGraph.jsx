import React from 'react';
import { Mouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { drawGraphAxis } from './graphAxis';

/*
  The GWAS graph component
  The only state here is the point that's currently selected
*/
export const Gwas = React.createClass({
  propTypes: {
    // do not validate values -- it's way too slow
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
    this.drawData(this.canvas, props.visibleGenome, props.values, props.max);
    this.drawGraphAxis(this.canvas, {
      yMaxValue: props.max,
      numTicks: 4,
      dottedLines: [ 5 ],
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

  drawData(canvas, visibleGenome, shapes, max) {
    const context = canvas.getContext('2d');
    const yScaleMultiplier = parseFloat( (canvas.height - 5) / max );
    const basesVisible = visibleGenome[1] - visibleGenome[0];
    for (let i = 0; i < shapes.length; i++) {
      // only draw if in view!
      if (shapes[i].featurex > visibleGenome[0]
        && shapes[i].featurex < visibleGenome[1]
      ) {
        // what are the (canvas) co-ords to draw to?
        const x = parseInt(( shapes[i].featurex - visibleGenome[0] ) / basesVisible * canvas.width, 10);
        const y = canvas.height - (shapes[i].featurey * yScaleMultiplier);
        const rY = basesVisible > 1000000 ? 1 : basesVisible > 100000 ? 2 : basesVisible > 50000 ? 3 : basesVisible > 10000 ? 4 : 5; // eslint-disable-line no-nested-ternary
        let rX;
        if (shapes[i].radiusX) {
          rX = parseInt(shapes[i].radiusX / basesVisible * canvas.width, 10);
          if (rX < 1) {
            rX = 1;
          }
        } else {
          rX = rY;
        }
        this.drawEllipse(context, x, y, rX, rY, shapes[i].fill);
      }
    }
  },

  drawEllipse(context, x, y, rX, rY, fill) {
    context.fillStyle = fill;
    // context.strokeStyle = this.stroke;
    // context.lineWidth = this.strokeWidth;
    context.beginPath();
    // void ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
    context.ellipse(x, y, rX, rY, 0, 0, 2 * Math.PI);
    // context.arc(x, y, rX, 0, 2 * Math.PI, false);
    // if (this.selected) {
      // context.stroke();
    // }
    context.fill();
  },

});

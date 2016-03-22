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
    if (this.props.visibleGenome[1]) {
      this.drawWrapper(this.props);
      window.addEventListener('pdf', this.svgdraw, false);
    }
  },

  shouldComponentUpdate() {
    return true;
  },

  componentWillUpdate(props) {
    // expensive way to handle resizing
    if (props.visibleGenome[1]) {
      this.drawWrapper(props);
    }
  },

  svgdraw: function(){
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log("printing GWAS plot");
    window.svgCtx.save();
    var currentWidth=window.svgCtx.width;
    window.svgCtx.width=this.canvas.width;
    window.svgCtx.translate(this.canvasPos.left,this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right-this.canvasPos.left, this.canvasPos.bottom-this.canvasPos.top);
    window.svgCtx.stroke();
    window.svgCtx.clip();
    this.drawWrapper(this.props, "svg");
    window.svgCtx.restore();
    window.svgCtx.width=currentWidth;
  },

  drawWrapper(props, pdfoutput=false) {
    this.initCanvasXY();
    this.clearCanvas();
    this.drawData(this.canvas, props.visibleGenome, props.values, props.max, pdfoutput);
    this.drawGraphAxis(this.canvas, {
      yMaxValue: props.max,
      numTicks: 4,
      dottedLines: [ 5 ],
      pdfoutput: pdfoutput,
    });
  },


  render() {
    return (
      <div>
        <canvas
          id="GWASGraphDiv"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
      </div>
    );
  },

  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
  drawGraphAxis: drawGraphAxis,

  drawData(canvas, visibleGenome, shapes, max, pdfoutput=false) {
    let context = canvas.getContext('2d');
    if (pdfoutput==="svg"){
      context=window.svgCtx;
    }
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
        const rY = basesVisible > 100000 ? 1 : basesVisible > 10000 ? 2 : basesVisible > 1000 ? 3 : 4; // eslint-disable-line no-nested-ternary
        let rX;
        if (shapes[i].radiusX) {
          rX = parseInt(shapes[i].radiusX / basesVisible * canvas.width, 10);
          if (rX < 1) {
            rX = 1;
          }
        } else {
          rX = rY;
        }
        // if (pdfoutput) {
        //  console.log(window.svgCtx.getSerializedSvg(true));
        // }
        this.drawEllipse(context, x, y, rX, shapes[i].fill);
        // if (pdfoutput) {
        //  console.log(window.svgCtx.getSerializedSvg(true));
        // }
      }
    }
  },

  drawEllipse(context, x, y, rX, fill) {
    context.fillStyle = fill;
    // context.strokeStyle = this.stroke;
    // context.lineWidth = this.strokeWidth;
    context.beginPath();
    // void ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
    context.arc(x, y, rX, 0, 2 * Math.PI);
    // context.arc(x, y, rX, 0, 2 * Math.PI, false);
    // if (this.selected) {
      // context.stroke();
    // }
    context.fill();
  },

});

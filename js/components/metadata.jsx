import React from 'react';
import { getMouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { InfoTip } from './infoTip';

/*
  The Metadata component
*/
export const Metadata = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    metadata: React.PropTypes.object.isRequired,
    style: React.PropTypes.object.isRequired,
    activeTaxa: React.PropTypes.object.isRequired,
  },

  getInitialState: function () {
    return ({
      displayInfoActive: false,
      displayInfo: {},
    });
  },

  /* forceUpdate must be called by componentDidMount
   * in order to both call componentWillUpdate (which draws)
   * and so that <Headers> can read this.canvas, which is set in
   * the initial render()
   */
  componentDidMount: function () { // don't use fat arrow
    // this.canvas = ReactDOM.findDOMNode(this); // replaced by ref
    // this.initCanvasXY();
    this.canvas.addEventListener('mousemove', this.mouseMove, true);
    // when the mouse leaves we need to remove any selection
    this.canvas.addEventListener('mouseout',
      () => {this.setState({ displayInfoActive: false });},
      true);
    window.addEventListener('pdf', this.svgdraw, false);
    this.forceUpdate();
  },

  componentWillUpdate(props) {
    if (!props.metadata.toggles) {
      return;
    }
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();
    this.numActiveHeaders = props.metadata.toggles.filter((e)=>e).length;
    this.calculateXOffsets = this.calculateXOffsetsMaker(this.numActiveHeaders);
    this.drawSquares(this.canvas.getContext('2d'), props.activeTaxa, props.metadata.toggles, props.metadata.data, props.metadata.colours);
  },

  render() {
    let info = false;
    if (this.state.displayInfoActive) {
      const disp = {
        taxa: this.state.displayInfo.taxa,
        // this.state.displayInfo.header: this.state.displayInfo.value,
        // header: this.state.displayInfo.header,
        // value: this.state.displayInfo.value,
        // type: this.state.displayInfo.info,
      };
      disp[this.state.displayInfo.header] = this.state.displayInfo.value;
      info = (
        <InfoTip
          x={this.state.displayInfo.x}
          y={this.state.displayInfo.y}
          disp={disp}
        />
      );
    }
    return (
      <div>
        <canvas
          id="GenomeAnnotation"
          ref={(c) => this.canvas = c}
          style={this.props.style}
        />
        {info}
        <Headers
          y={0}
          toggles={this.props.metadata.toggles}
          headerNames={this.props.metadata.headerNames}
          calculateXOffsets={this.calculateXOffsets}
          canvas={this.canvas}
        />
      </div>
    );
  },

  svgdraw() {
    this.canvasPos = this.canvas.getBoundingClientRect();
    console.log('printing metadata to SVG');
    window.svgCtx.save();
    window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
    window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
    window.svgCtx.stroke();
    window.svgCtx.clip();
    this.drawSquares(window.svgCtx, this.props.activeTaxa, this.props.metadata.toggles, this.props.metadata.data, this.props.metadata.colours);
    window.svgCtx.restore();
  },

  // by specifying the funtions here
  // react auto-binds 'this'
  // and it also allows changes in these functions
  // to be hot-reloaded
  findTaxaGivenYPosition: _findTaxaGivenYPosition,
  findHeaderGivenXPosition: _findHeaderGivenXPosition,
  mouseMove: mouseMove,
  initCanvasXY: helper.initCanvasXY,
  clearCanvas: helper.clearCanvas,
  calculateXOffsetsMaker: _calculateXOffsetsMaker,
  drawSquares: _drawSquares,

});


/*  Headers
stateless component
*/
const Headers = React.createClass({
  propTypes: {
    y: React.PropTypes.number,
    toggles: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    headerNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    canvas: React.PropTypes.object,
    calculateXOffsets: React.PropTypes.func,
  },

  render() {
    if (!this.props.canvas) {return false;}
    const offsetLeft = this.props.canvas.offsetLeft;
    const offsetTop = this.props.canvas.offsetTop;
    const heightOfOneLineDiv = 20; // ummm
    const headers = [];
    for (let i = 0; i < this.props.toggles.length; i++) {
      if (this.props.toggles[i]) {
        headers.push(this.props.headerNames[i]);
      }
    }
    const divs = headers.map((cv, idx) => {
      const [ xOffset, blocksize ] = this.props.calculateXOffsets(idx);
      const style = {
        position: 'absolute',
        zIndex: 10,
        left: xOffset + parseInt(blocksize / 2, 10) + offsetLeft + heightOfOneLineDiv / 2,
        top: offsetTop + this.props.y - heightOfOneLineDiv,
        // background: 'black',
        // color: 'white',
        pointerEvents: 'none',
        transform: 'rotate(270deg)',
        transformOrigin: 'left bottom 0',
      };
      return <div key={idx} style={style}>{cv}</div>;
    });

    return (
      <div>
        {divs}
      </div>
    );
  },
});

/*
x position in pixels to corresponding columns header (or undefined)
*/
function _findHeaderGivenXPosition(x, calculateXOffsets, numActiveHeaders) {
  for (let i = 0; i < numActiveHeaders; i++) {
    const colData = calculateXOffsets(i);
    if (x >= colData[0] && x <= colData[0] + colData[1]) {
      // i: i-th active header
      return this.props.metadata.headerNames.filter(
        (e, j)=>this.props.metadata.toggles[j]
        )[i];
    }
  }
  return (undefined);
}

/*
y position in pixels to corresponding taxa in phylocanvas (or undefined)
*/
function _findTaxaGivenYPosition(y, activeTaxa) {
  for (const taxa in activeTaxa) {
    const yValues = activeTaxa[taxa];
    if (y >= yValues[0] && y <= yValues[1]) {
      return (taxa);
    }
  }
  return (undefined);
}

/*
called when mouse move detected
finds which metadata square the mouse is hovering over
@returns - nothinng
@sideEffects - state
*/
function mouseMove(e) {
  const mouse = getMouse(e, this.canvas);
  const taxa = this.findTaxaGivenYPosition(mouse.y, this.props.activeTaxa);
  const header = this.findHeaderGivenXPosition(mouse.x, this.calculateXOffsets, this.numActiveHeaders);
  if (taxa && header && this.props.metadata.data[taxa]) {
    const headerIdx = this.props.metadata.headerNames.indexOf(header);
    const valueIdx = this.props.metadata.data[taxa][headerIdx];
    const value = this.props.metadata.values[headerIdx][valueIdx];
    let iinfo = '';
    if (this.props.metadata.info[headerIdx].binary) {
      iinfo += ' binary ';
    }
    iinfo += this.props.metadata.info[headerIdx].type;
    const info = { x: mouse.fixedX, y: mouse.fixedY, taxa, header, value, info: iinfo };
    this.setState({
      displayInfoActive: true,
      displayInfo: info,
    });
  } else {
    this.setState({
      displayInfoActive: false,
    });
  }
}

/*    calculateXOffsetsMaker
closure. returns @fn@ with
  @param@ index
  @returns@ leftXposition (pixels), blockWidth (pixels)
*/
function _calculateXOffsetsMaker(numActiveHeaders) { // closure
  const betweenColPadding = numActiveHeaders * 2 < this.canvas.width ? 1 : 0;
  const blockWidth = parseInt(this.canvas.width / numActiveHeaders, 10) - betweenColPadding;
  return function (idx) {
    const xOffset = parseInt(idx * blockWidth + idx * betweenColPadding, 10);
    return ([ xOffset, blockWidth ]);
  };
}

// outer loop: vertical (taxa in tree), inner loop: horisontal (meta column)
function _drawSquares(context, activeTaxa, toggles, data, colours) {
  // console.log(context, activeTaxa, toggles, data, colours);
  const taxas = Object.keys(activeTaxa);
  for (let i = 0; i < taxas.length; i++) {
    const taxa = taxas[i];
    // console.log('taxa:', taxa);
    const yValues = activeTaxa[taxa];

    let xIdx = 0;
    for (let j = 0; j < toggles.length; j++) {
      if (!toggles[j]) {
        // console.log('continue hit at index ', j)
        continue;
      }
      const [ xLeft, blockWidth ] = this.calculateXOffsets(xIdx);
      if (data[taxa] && data[taxa][j] !== undefined) { // taxa may not have metadata!
        context.save();
        context.fillStyle = colours[j][data[taxa][j]];
        context.fillRect(xLeft, yValues[0], blockWidth, yValues[1] - yValues[0]);
        context.restore();
      // } else if (data[taxa]) {
      //   console.log('no tip data for: ', taxa, 'idx', xIdx);
      // } else {
      //   console.log('no data at all for: ', taxa);
      }
      xIdx++;
    }
  }
}

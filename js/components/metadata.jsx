import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { getMouse } from '../misc/mouse';
import * as helper from '../misc/helperFunctions';
import { InfoTip } from './infoTip';
import { dom2svg } from '../misc/html2svg';

/*
  The Metadata component
*/
@connect((state)=>({
  activeTaxa: state.phylogeny.activeTaxa,
  metadata: state.metadata,
}))
export class Metadata extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    metadata: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    activeTaxa: PropTypes.object.isRequired,
  }
  constructor(...args) {
    super(...args);
    this.state = {
      displayInfoActive: false,
      displayInfo: {},
    };
    this.resizeFn = () => {this.forceUpdate();};

    /* y position in pixels to corresponding taxa in phylocanvas (or undefined) */
    this.findTaxaGivenYPosition = (y, activeTaxa) => {
      for (const taxa in activeTaxa) {
        const yValues = activeTaxa[taxa];
        if (y >= yValues[0] && y <= yValues[1]) {
          return (taxa);
        }
      }
      return (undefined);
    };

    /* x position in pixels to corresponding columns header (or undefined)  */
    this.findHeaderGivenXPosition = (x, calculateXOffsets, numActiveHeaders) => {
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
    };

    /* when mouse move detected, find which metadata square the mouse is hovering over. MOdifies state */
    this.mouseMove = (e) => {
      const mouse = getMouse(e, this.canvas);
      const taxa = this.findTaxaGivenYPosition(mouse.y, this.props.activeTaxa);
      const header = this.findHeaderGivenXPosition(mouse.x, this.calculateXOffsets, this.numActiveHeaders);
      if (taxa && header && this.props.metadata.data[taxa]) {
        const headerIdx = this.props.metadata.headerNames.indexOf(header);
        const valueIdx = this.props.metadata.data[taxa][headerIdx];
        let value;
        if (this.props.metadata.info[headerIdx].inGroup) {
          const groupId = this.props.metadata.info[headerIdx].groupId;
          value = this.props.metadata.groups[groupId].values[valueIdx];
        } else {
          value = this.props.metadata.values[headerIdx][valueIdx];
        }
        const info = { x: mouse.fixedX, y: mouse.fixedY, taxa, header, value };
        if (this.props.metadata.info[headerIdx].inGroup) {
          info.group = this.props.metadata.info[headerIdx].type + ' ' + String(this.props.metadata.info[headerIdx].groupId);
        }
        this.setState({
          displayInfoActive: true,
          displayInfo: info,
        });
      } else {
        this.setState({
          displayInfoActive: false,
        });
      }
    };
    this.initCanvasXY = helper.initCanvasXY;
    this.clearCanvas = helper.clearCanvas;

    /* closure. returns @func */
    this.calculateXOffsetsMaker = (numActiveHeaders) => {
      const betweenColPadding = numActiveHeaders * 2 < this.canvas.width ? 1 : 0;
      const blockWidth = parseInt(this.canvas.width / numActiveHeaders, 10) - betweenColPadding;
      return function (idx) {
        const xOffset = parseInt(idx * blockWidth + idx * betweenColPadding, 10);
        return ([ xOffset, blockWidth ]);
      };
    };

    this.drawSquares = (context, activeTaxa, toggles, data, colours, groups, info) => {
      // outer loop: vertical (taxa in tree), inner loop: horisontal (meta column)
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
          // data format: data[taxon][headerIdx] = index of value in value/colour array
          if (data[taxa] && data[taxa][j] !== undefined) { // taxa may not have metadata!
            context.save();
            if (info[j].inGroup) {
              context.fillStyle = groups[info[j].groupId].colours[data[taxa][j]];
            } else {
              context.fillStyle = colours[j][data[taxa][j]];
            }
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
    };

    this.svgdraw = () => {
      this.canvasPos = this.canvas.getBoundingClientRect();
      console.log('printing metadata to SVG');
      window.svgCtx.save();
      window.svgCtx.translate(this.canvasPos.left, this.canvasPos.top);
      window.svgCtx.rect(0, 0, this.canvasPos.right - this.canvasPos.left, this.canvasPos.bottom - this.canvasPos.top);
      window.svgCtx.stroke();
      window.svgCtx.clip();
      this.drawSquares(window.svgCtx, this.props.activeTaxa, this.props.metadata.toggles, this.props.metadata.data, this.props.metadata.colours, this.props.metadata.groups, this.props.metadata.info);
      window.svgCtx.restore();

      /* draw the headers by serializing the HTML element and injecting it into
       * canvas2svg
       */
      // const headerHtmlString = (new XMLSerializer).serializeToString(ReactDOM.findDOMNode(this._headerDiv));
      // window.svgCtx.injectHTML(headerHtmlString);

      /* draw the headers by parsing the DOM element
       * turning the divs into SVG code
       * and injecting this via a custom functino in
       * canvas2svg
       */
      // console.log(ReactDOM.findDOMNode(this._headerDiv));
      // console.log(headerHtmlString);
      const svgString = dom2svg(ReactDOM.findDOMNode(this._headerDiv));
      window.svgCtx.injectSVG(svgString);
    };
  }

  /* forceUpdate must be called by componentDidMount
   * in order to both call componentWillUpdate (which draws)
   * and so that <Headers> can read this.canvas, which is set in
   * the initial render()
   */
  componentDidMount() { // don't use fat arrow
    this.canvas.addEventListener('mousemove', this.mouseMove, true);
    // when the mouse leaves we need to remove any selection
    this.canvas.addEventListener('mouseout',
      () => {this.setState({ displayInfoActive: false });},
      true);
    window.addEventListener('pdf', this.svgdraw, false);
    window.addEventListener('resize', this.resizeFn, false);
    this.forceUpdate();
  }

  componentWillUpdate(props) {
    if (!props.metadata.toggles) {
      return;
    }
    // expensive way to handle resizing
    this.initCanvasXY();
    this.clearCanvas();
    this.numActiveHeaders = props.metadata.toggles.filter((e)=>e).length;
    this.calculateXOffsets = this.calculateXOffsetsMaker(this.numActiveHeaders);
    this.drawSquares(this.canvas.getContext('2d'), props.activeTaxa, props.metadata.toggles, props.metadata.data, props.metadata.colours, props.metadata.groups, props.metadata.info);
  }

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
    window.removeEventListener('resize', this.resizeFn, false);
  }

  render() {
    let info = false;
    if (this.state.displayInfoActive) {
      const disp = {
        taxon: this.state.displayInfo.taxa,
        // this.state.displayInfo.header: this.state.displayInfo.value,
        // header: this.state.displayInfo.header,
        // value: this.state.displayInfo.value,
        // type: this.state.displayInfo.info,
      };
      if (this.state.displayInfo.group) {
        disp.group = this.state.displayInfo.group;
      }
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
          ref={(d) => this._headerDiv = d}
          y={0}
          toggles={this.props.metadata.toggles}
          headerNames={this.props.metadata.headerNames}
          calculateXOffsets={this.calculateXOffsets}
          canvas={this.canvas}
        />
      </div>
    );
  }
}

/*  Headers
stateless component
*/
export class Headers extends React.Component {
  constructor(...args) {
    super(...args);
  }
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
        height: heightOfOneLineDiv,
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
  }
}

Headers.propTypes = {
  y: PropTypes.number,
  toggles: PropTypes.arrayOf(PropTypes.bool).isRequired,
  headerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  canvas: PropTypes.object,
  calculateXOffsets: PropTypes.func,
};

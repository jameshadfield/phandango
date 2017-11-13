import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Annotation } from '../components/annotation';
import { Drag } from '../components/resize';
import { Phylogeny } from '../components/phylogeny';
import { Blocks } from '../components/blocks';
import { Metadata } from '../components/metadata';
import { MetadataKey } from '../components/metadataKey';
import { Line } from '../components/lineGraph';
import { Gwas } from '../components/gwasGraph';
import { Cartoon } from '../components/cartoonGenome';
import { StaticLogo } from '../components/logo';
import { Settings } from './settings';

@connect((state)=>({
  active: state.layout.active,
  colPercs: state.layout.colPercs,
  rowPercs: state.layout.rowPercs,
  logoIsOn: state.layout.logoIsOn,
}))
export class Main extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    colPercs: PropTypes.arrayOf(PropTypes.number).isRequired,
    rowPercs: PropTypes.array.isRequired,
    logoIsOn: PropTypes.bool.isRequired,
  };
  constructor(...args) {
    super(...args);
    this.displayName = 'CanvasContainer';
    this.keyIdx = 0;
    this.key = 'canvases0';
    this.resizeFn = () => {
      this.forceUpdate(); // is this enough?
    };
    this.percentize = (n) => {
      return (n.toString() + '%');
    };
    this.makeVh = (n) => {
      return (n.toString() + 'vh');
    };
    this.getStyle = (colIdx, rowIdx) => {
      const sty = {
        width: this.percentize(this.props.colPercs[colIdx]),
        height: 'calc(' + this.makeVh(this.props.rowPercs[rowIdx]) + ' - 3px)',
        position: 'relative',
        margin: '0px',
      };
      if (colIdx < 2) {
        sty.float = 'left';
      } else {
        sty.float = 'right';
      }
      if (colIdx === 0 && rowIdx === 2) {
        sty.position = 'absolute';
        sty.bottom = '30px';
        sty.left = '10px';
      }
      return (sty);
    };
  }
  // componentDidMount() {
  //   window.addEventListener('resize', this.resizeFn, false);
  //   document.documentElement.style.overflow = 'hidden';  // firefox, chrome
  //   document.body.scroll = "no"; // ie only
  // }

  // componentWillUpdate() {
  //   /* changing the key apparently causes
  //    * all the children to re-render
  //    * thus avoiding any canvas stretching when things update
  //    * https://github.com/facebook/react/issues/3038
  //    */
  //   this.keyIdx += 1;
  //   this.key = 'canvases' + this.keyIdx;
  // }
  componentDidUpdate() {
    // console.log('canvases.jsx did update');
    window.dispatchEvent(new Event('resize')); // same event as window resizing :)
  }
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.resizeFn, false);
  // }
  render() {
    const active = this.props.active;
    // deebug this
    if (!Object.keys(active).some((e)=>active[e])) {
      return false;
    }
    // top row (small genome / ??? / annotation)
    const topRow = [];
    if (active.blocks || active.annotation) {
      topRow[0] = <Cartoon style={this.getStyle(0, 0)} key={'cartoon'} />;
    } else {
      topRow[0] = <div style={this.getStyle(0, 0)} key={'cartoon'} />;
    }
    topRow[1] = <div style={this.getStyle(1, 0)} key={'aboveMeta'} />;
    if (active.annotation) {
      topRow[2] = <Annotation style={this.getStyle(2, 0)} key={'annotation'} />;
    } else {
      topRow[2] = <div style={this.getStyle(2, 0)} key={'annotation'} />;
    }
    const middleRow = [];
    // tree
    if (active.tree) {
      middleRow[0] = <Phylogeny style={this.getStyle(0, 1)} key={'tree'} />;
    } else {
      middleRow[0] = <div style={this.getStyle(0, 1)} key={'tree'} />;
    }
    // metadata
    if (active.meta) {
      middleRow[1] = <Metadata style={this.getStyle(1, 1)} key={'meta'} />;
    } else {
      middleRow[1] = <div style={this.getStyle(1, 1)} key={'meta'} />;
    }
    // blocks / metadata key
    if (active.metaKey) {
      middleRow[2] = <MetadataKey style={this.getStyle(2, 1)} key={'metaKey'} />;
    } else if (active.blocks) {
      middleRow[2] = <Blocks style={this.getStyle(2, 1)} key={'blocks'} />;
    } else {
      middleRow[2] = <div style={this.getStyle(2, 1)} key={'blocks'} />;
    }

    // needs improvement
    const plots = [];
    if ('gwas' in active.plots ) {
      plots[0] = <Gwas style={this.getStyle(2, 2)} key={'gwas'} />;
    } else if ('line' in active.plots ) {
      plots[0] = <Line style={this.getStyle(2, 2)} key={'line'} />;
    }

    // logo on / off
    let logo = null;
    if (this.props.logoIsOn) {
      logo = (
        <div id="staticLogo" style={{
          position: 'absolute',
          bottom: '5px',
          width: '200px',
          left: '5px',
          height: '100px',
        }}>
          <StaticLogo />
        </div>
      );
    }

    /* resizing divs */
    const vresizers = [];
    let numResizers = 2; // default
    if (!this.props.active.tree) {
      numResizers -= 1;
    }
    for (let i = 0; i < numResizers; i++) {
      vresizers[i] = (
        <Drag index={i} isCol={false} key={'row' + i.toString() + 'drag'}/>
      );
    }
    const hresizers = [];
    numResizers = 2; // default
    if (!this.props.active.meta) {
      numResizers -= 1;
    }
    if (!this.props.active.blocks && !this.props.active.annotation && !this.props.active.metaKey) {
      numResizers -= 1;
    }
    for (let i = 0; i < numResizers; i++) {
      hresizers[i] = (
        <Drag index={i} isCol={true} key={'col' + i.toString() + 'drag'}/>
      );
    }

    return (
      <div>
        <Settings/>
        <div id="canvassesDiv" ref={(c) => this.node = c} key={this.key}>
          <div className="newline" />
          {topRow}
          <div className="newline" />
          {middleRow}
          <div className="newline" />
          {plots}

          {logo}

          {vresizers}
          {hresizers}
        </div>
      </div>
    );
  }
}

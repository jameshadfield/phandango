import { connect } from 'react-redux';
import React from 'react';
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
import { layoutChange } from '../actions/general';

/*
The children of this component are top level components that
render to the screen (e.g. Annotation, Blocks, Phylogeny)
These connect statements control which props they get
*/
const ConnectedDrag = connect(
    (state)=>({
      rowPercs: state.layout.rowPercs,
      colPercs: state.layout.colPercs,
    })
    // (dispatch)=>({
    //   onYChange: (col, idx, e, value) =>
    //   dispatch(layoutChange(col, idx, parseInt(value, 10))),
    // })
  )(Drag);
const ConnectedAnnotation = connect((state)=>({
  visibleGenome: state.genomeInfo.visibleGenome,
  data: state.annotation.data,
}))(Annotation);
const ConnectedPhylogeny = connect((state)=>({
  newickString: state.phylogeny.newickString,
}))(Phylogeny);
const ConnectedBlocks = connect((state)=>({
  visibleGenome: state.genomeInfo.visibleGenome,
  data: state.blocks.blocks,
  activeTaxa: state.phylogeny.activeTaxa,
  shouldMouseOver: state.blocks.shouldMouseOver,
  blocksArePerTaxa: state.blocks.blocksArePerTaxa,
  blockFillAlpha: state.blocks.blockFillAlpha,
}))(Blocks);
const ConnectedMetadata = connect((state)=>({
  activeTaxa: state.phylogeny.activeTaxa,
  metadata: state.metadata,
}))(Metadata);
const ConnectedMetadataKey = connect((state)=>({
  metadata: state.metadata,
}))(MetadataKey);
const ConnectedLine = connect((state)=>({
  visibleGenome: state.genomeInfo.visibleGenome,
  values: state.lineGraph.values,
  lineColours: state.lineGraph.lineColours,
  subValues: state.lineGraph.subValues,
  max: state.lineGraph.max,
}))(Line);
const ConnectedGwas = connect((state)=>({
  visibleGenome: state.genomeInfo.visibleGenome,
  values: state.gwasGraph.values,
  max: state.gwasGraph.max,
}))(Gwas);
const ConnectedCartoon = connect((state)=>({
  visibleGenome: state.genomeInfo.visibleGenome,
  genomeLength: state.genomeInfo.genomeLength,
}))(Cartoon);

export const CanvasContainer = React.createClass({ displayName: 'CanvasContainer',
  propTypes: {
    active: React.PropTypes.object.isRequired,
    colPercs: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    rowPercs: React.PropTypes.array.isRequired,
    logoIsOn: React.PropTypes.bool.isRequired,
  },

  componentDidMount: function () {
    window.onresize = this._resizeFn;
  },
  componentWillUnmount: function () {
    window.onresize = null;
  },
  getStyle: function (colIdx, rowIdx) {
    const sty = {
      width: this.percentize(this.props.colPercs[colIdx]),
      height: 'calc(' + this.makeVh(this.props.rowPercs[rowIdx]) + ' - 7px)',
      position: 'relative',
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
  },

  render: function () {
    const active = this.props.active;
    // deebug this
    if (!Object.keys(active).some((e)=>active[e])) {
      return false;
    }


    // top row (small genome / ??? / annotation)
    const topRow = [];
    if (active.blocks || active.annotation) {
      topRow[0] = <ConnectedCartoon style={this.getStyle(0, 0)} key={'cartoon'} />;
    } else {
      topRow[0] = <div style={this.getStyle(0, 0)} key={'cartoon'} />;
    }
    topRow[1] = <div style={this.getStyle(1, 0)} key={'aboveMeta'} />;
    if (active.annotation) {
      topRow[2] = <ConnectedAnnotation style={this.getStyle(2, 0)} key={'annotation'} />;
    } else {
      topRow[2] = <div style={this.getStyle(2, 0)} key={'annotation'} />;
    }


    const middleRow = [];
    // tree
    if (active.tree) {
      middleRow[0] = <ConnectedPhylogeny style={this.getStyle(0, 1)} key={'tree'} />;
    } else {
      middleRow[0] = <div style={this.getStyle(0, 1)} key={'tree'} />;
    }
    // metadata
    if (active.meta) {
      middleRow[1] = <ConnectedMetadata style={this.getStyle(1, 1)} key={'meta'} />;
    } else {
      middleRow[1] = <div style={this.getStyle(1, 1)} key={'meta'} />;
    }
    // blocks / metadata key
    if (active.metaKey) {
      middleRow[2] = <ConnectedMetadataKey style={this.getStyle(2, 1)} key={'metaKey'} />;
    } else if (active.blocks) {
      middleRow[2] = <ConnectedBlocks style={this.getStyle(2, 1)} key={'blocks'} />;
    } else {
      middleRow[2] = <div style={this.getStyle(2, 1)} key={'blocks'} />;
    }

    // needs improvement
    const plots = [];
    if ('gwas' in active.plots ) {
      plots[0] = <ConnectedGwas style={this.getStyle(2, 2)} key={'gwas'} />;
    } else if ('line' in active.plots ) {
      plots[0] = <ConnectedLine style={this.getStyle(2, 2)} key={'line'} />;
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

    // vertical resizer divs
    const vresizers = [];
    const vresizertops = [];
    let count = 0;
    const numVResizers = 2;
    var iconOffset=7.5
    if (numVResizers % 2 == 0){
      iconOffset=(numVResizers/2)*15;
    }
    for (let i = 0; i < numVResizers + 1; i++) {
      const vresizertop = this.props.rowPercs[i] + count;
      const toremove = ((i + 1) * 7) - 4;
      var leftPos = ((window.innerWidth/2)-iconOffset)+(i*15);
      var background= "url('img/Drag_circle_both.png') no-repeat center center";
      if (i===0){
        background= "url('img/Drag_circle_up.png') no-repeat center center";
      }
      else if (i===numVResizers-1){
        background= "url('img/Drag_circle_down.png') no-repeat center center";
      }
      vresizertops[i] = 'calc(' + this.makeVh(vresizertop) + ' - ' + toremove.toString() + 'px)';
      vresizers[i] = (
        <ConnectedDrag
          style={{ position: 'absolute', width: '15', height: '15', cursor: 'row-resize', background: background, left:leftPos, top: vresizertops[i] }}
          index={i}
          isCol={false}
          key={'row' + i.toString() + 'drag'}
          />
      );
      count = vresizertop;
    }

    // horizontal resizer divs
    const hresizers = [];
    const hresizerlefts = [];
    count = 0;
    const numHResizers = 2;
    var iconOffset=7.5
    if (numVResizers % 2 == 0){
      iconOffset=(numHResizers/2)*15;
    }
    for (let i = 0; i < numHResizers + 1; i++) {
      hresizerlefts[i] = this.props.colPercs[i] + count;
      var topPos = ((window.innerHeight/2)-iconOffset)+(i*15);
      var background= "url('img/Drag_circle_both.png') no-repeat center center";
      if (i===0){
        background= "url('img/Drag_circle_left.png') no-repeat center center";
      }
      else if (i===numHResizers-1){
        background= "url('img/Drag_circle_right.png') no-repeat center center";
      }
      var leftPos = (window.innerWidth*(hresizerlefts[i]/100))-7.5;
      hresizers[i] = (
        <ConnectedDrag
          style={{ position: 'absolute', width: '15', height: '15', cursor: 'col-resize', background: background, left: leftPos, top: topPos }}
          index={i}
          isCol={true}
          key={'column' + i.toString() + 'drag'}
        />
      );
      count = hresizerlefts[i];
    }

    return (
      <div id="canvassesDiv" ref={(c) => this.node = c}>
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
    );
  },

  _resizeFn: function () {
    this.forceUpdate(); // is this enough?
  },

  percentize: function (n) {
    return (n.toString() + '%');
  },

  makeVh: function (n) {
    return (n.toString() + 'vh');
  },

});

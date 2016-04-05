import { connect } from 'react-redux';
import React from 'react';
import { Annotation } from '../components/annotation';
import { Row1Drag } from '../components/resize';
import { Phylogeny } from '../components/phylogeny';
import { Blocks } from '../components/blocks';
import { Metadata } from '../components/metadata';
import { MetadataKey } from '../components/metadataKey';
import { Line } from '../components/lineGraph';
import { Gwas } from '../components/gwasGraph';
import { Cartoon } from '../components/cartoonGenome';
import { StaticLogo } from '../components/logo';

/*
The children of this component are top level components that
render to the screen (e.g. Annotation, Blocks, Phylogeny)
These connect statements control which props they get
*/
const ConnectedRow1Drag = connect((state)=>({
  initialPosPerc: state.layout.rowPercs[0],
  maxPosPerc: state.layout.rowPercs[1]+state.layout.rowPercs[0],
}))(Row1Drag);
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


    const vresizers = [];
    const vresizertops=[];
    var count=0;
    for (var i=0; i<3; i++){
      var vresizertop=this.props.rowPercs[i]+count;
      var toremove=((i+1)*7)-4
      vresizertops[i]='calc('+this.makeVh(vresizertop)+' - '+toremove.toString()+'px)'
      count=vresizertop;
    }
    vresizers[0]= <ConnectedRow1Drag style={{position: "absolute", width: "100%", height:"8", cursor: "row-resize", left:"0", top: vresizertops[0]}} key={'row1drag'} />;
    vresizers[1]= <div style={{position: "absolute", width: "100%", height:"8", cursor: "row-resize", left:"0", top: vresizertops[1]}} key={'row2drag'} />;


    const hresizers = [];
    const hresizerlefts=[];
    var count=0;
    for (var i=0; i<3; i++){
      hresizerlefts[i]=this.props.colPercs[i]+count;
      count=hresizerlefts[i];
    }
    hresizers[0]= <div style={{position: "absolute", width: "8", height:"100%", cursor: "col-resize", left: this.percentize(hresizerlefts[0]), top: "0"}} key={'column1drag'} />;
    hresizers[1]= <div style={{position: "absolute", width: "8", height:"100%", cursor: "col-resize", left: this.percentize(hresizerlefts[1]), top: "0"}} key={'column2drag'} />;
    // debugger;

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

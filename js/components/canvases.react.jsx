const React = require('react');
const GenomicCanvas = require('./genomic/genomic.react.jsx');
const Graphs = require('./graphs/graphs.react.jsx');
const MetaReact = require('./meta/meta.react.jsx');
const PhyloReact = require('./phylo.react.jsx');
const Extras = require('./extras.react.jsx');

// Props passed here are:
//  divPerc  ->  col -> [col1, col2, col3]
//       ->  row -> [row1, row2, row3]
//  router   ->  STRING // string is which "page" to render (i.e. if ! then render null)
//  canvasOn ->  [strings] // strings match set of components which can be turned on / off (e.g. "meta")
const CanvasDivs = React.createClass({ displayName: 'Main_React_Element',
  propTypes: {
    on: React.PropTypes.bool.isRequired,
    logoClick: React.PropTypes.func.isRequired,
    dataLoaded: React.PropTypes.object.isRequired,
    elementsOn: React.PropTypes.object.isRequired,
    divPerc: React.PropTypes.object.isRequired,
  },

  render: function () {
    if (!this.props.on) {
      return null;
    }
    // have things been loaded?
    const metaTextDiv = this.props.elementsOn.col[1] ? <MetaReact.MetaTextClass/> : <div/>;
    const genomicDiv = this.props.dataLoaded.genomic ? <GenomicCanvas.GenomicCanvasClass/> : <div/>;
    const metaDiv = this.props.elementsOn.col[1] ? <MetaReact.MetaCanvasClass/> : <div/>;
    // var treeDiv = this.props.dataLoaded.tree ? <PhyloReact/> : <div/>;
    const treeDiv = <PhyloReact/>; // always on
    const annotationDiv = this.props.dataLoaded.annotation ? <Extras.GenomeAnnotation/> : <div/>;

    // console.log("RENDER:",this.props.divPerc.col[0],this.props.divPerc.col[1],this.props.divPerc.col[2])
    return (
      <div id="canvassesDiv">

        {/* TOP ROW (annotation etc) */}
        <div className="newline"/>
        <div className="blue" style={this.styleize(1, 1)}><Extras.SmallGenome/></div>
        <div className="red" style={this.styleize(2, 1)}>{metaTextDiv}</div>
        <div className="blue" style={this.styleize(3, 1)}>{annotationDiv}</div>

        {/* MIDDLE ROW (tree & gubbins & meta) */}
        <div className="newline"/>
        <div className="green" style={this.styleize(1, 2)}>{treeDiv}</div>
        <div className="blue" style={this.styleize(2, 2)}>{metaDiv}</div>
        <div className="green" style={this.styleize(3, 2)}>{genomicDiv}</div>

        {/* BOTTOM ROW (only plot at the moment) */}
        <div className="newline"/>
        <div style={this.styleize(1, 3)} className="pointer" onClick={this.props.logoClick}><Logo/></div>
        <div style={this.styleize(2, 3)}></div>
        <div className="blue" style={this.styleize(3, 3)}><Graphs/></div>

      </div>
    );
  },

  percentize: function (n) {
    return (n.toString() + '%');
  },

  makeVh: function (n) {
    return (n.toString() + 'vh');
  },

  styleize: function (colNum, rowNum) {
    const sty = {
      width: this.percentize(this.props.divPerc.col[colNum - 1]),
      height: 'calc(' + this.makeVh(this.props.divPerc.row[rowNum - 1]) + ' - 7px)',
      position: 'relative',
    };
    if (colNum < 3) {
      sty.float = 'left';
    } else {
      sty.float = 'right';
    }
    return (sty);
  },

});


const Logo = React.createClass({ displayName: 'displayName',
  render: function () {
    return (
      <img src="img/JScandy.v2.svg" id="logoMainPage"/>
    );
  },
});

module.exports = CanvasDivs;

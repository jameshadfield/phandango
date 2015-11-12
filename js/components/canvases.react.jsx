var React = require('react');
var ReactDOM = require('react-dom');
var GenomicCanvas = require('./genomic/genomic.react.jsx');
var Graphs = require('./graphs/graphs.react.jsx');
var MetaReact = require('./meta/meta.react.jsx');
var PhyloReact = require('./phylo.react.jsx');
var Extras = require('./extras.react.jsx');
var Actions = require('../actions/actions.js');
var misc = require('./misc.js')


// Props passed here are:
//	divPerc  ->  col -> [col1, col2, col3]
// 			 ->  row -> [row1, row2, row3]
//	router   ->  STRING // string is which "page" to render (i.e. if ! then render null)
//  canvasOn ->  [strings] // strings match set of components which can be turned on / off (e.g. "meta")
var CanvasDivs = React.createClass({displayName: "Main_React_Element",
	percentize: function(n) {
		return(n.toString()+'%')
	},
	makeVh: function(n) {
		return(n.toString()+'vh')
	},
	styleize: function(colNum,rowNum) {
		var sty = {
			width: this.percentize(this.props.divPerc.col[colNum-1]),
			height: 'calc('+this.makeVh(this.props.divPerc.row[rowNum-1])+' - 7px)',
			position: 'relative'
		};
		if (colNum<3) {
			sty['float'] = 'left'
		} else {
			sty['float'] = 'right'
		}
		return(sty);
	},
	render: function() {
		if (!this.props.on) {
			return null
		}
		// have things been loaded?
		var metaTextDiv = this.props.elementsOn.col[1] ? <MetaReact.MetaTextClass/> : <div/>;
		var genomicDiv = this.props.dataLoaded.genomic ? <GenomicCanvas.GenomicCanvasClass/> : <div/>;
		var metaDiv = this.props.elementsOn.col[1] ? <MetaReact.MetaCanvasClass/> : <div/>;
		// var treeDiv = this.props.dataLoaded.tree ? <PhyloReact/> : <div/>;
		var treeDiv = <PhyloReact/>; // always on
		var annotationDiv = this.props.dataLoaded.annotation ? <Extras.GenomeAnnotation/> : <div/>;

		// console.log("RENDER:",this.props.divPerc.col[0],this.props.divPerc.col[1],this.props.divPerc.col[2])
		return(
			<div id="canvassesDiv">

				{/* TOP ROW (annotation etc) */}
				<div className="newline"/>
				<div className="blue" style={this.styleize(1,1)}><Extras.SmallGenome/></div>
				<div className="red" style={this.styleize(2,1)}>{metaTextDiv}</div>
				<div className="blue" style={this.styleize(3,1)}>{annotationDiv}</div>

				{/* MIDDLE ROW (tree & gubbins & meta) */}
				<div className="newline"/>
				<div className="green" style={this.styleize(1,2)}>{treeDiv}</div>
				<div className="blue" style={this.styleize(2,2)}>{metaDiv}</div>
				<div className="green" style={this.styleize(3,2)}>{genomicDiv}</div>

				{/* BOTTOM ROW (only plot at the moment) */}
				<div className="newline"/>
				<div style={this.styleize(1,3)} className="pointer" onClick={this.props.logoClick}><Logo/></div>
				<div style={this.styleize(2,3)}></div>
				<div className="blue" style={this.styleize(3,3)}><Graphs/></div>

			</div>
		)
	}
})


var ReactCanvas = React.createClass({displayName: "displayName",
	componentDidMount: function() {
		misc.initCanvasXY(this);
	},

	render: function() {
		return (
			<canvas id={this.props.id} className="inContainer">
			</canvas>
		);
	}
});

var ReactDiv = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<div className="inContainer"></div>
		);
	}
});

var Logo = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<img src="img/JScandy.v2.svg" id="logoMainPage"/>
		);
	}
});

module.exports = CanvasDivs;




var React = require('react/addons');
var GubbinsCanvas = require('./gubbins.react.jsx');
var MetaReact = require('./meta.react.jsx');
var PhyloReact = require('./phylo.react.jsx');
var Extras = require('./extras.react.jsx');
var Actions = require('../actions/actions.js');

// Props passed here are:
//	divPerc -> col -> [col1, col2, col3]
// 			-> row -> [row1, row2, row3]
//	router -> STRING // string is which "page" to render (i.e. if ! then render null)
//  canvasOn -> [strings] // strings match set of components which can be turned on / off (e.g. "meta")
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
			height: this.makeVh(this.props.divPerc.row[rowNum-1]),
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
		// console.log("RENDER:",this.props.divPerc.col[0],this.props.divPerc.col[1],this.props.divPerc.col[2])
		return(
			<div id="canvassesDiv">

				{/* TOP ROW (annotation etc) */}
				<div className="newline"/>
				<div className="blue" style={this.styleize(1,1)}><Extras.SmallGenome/></div>
				<div className="red" style={this.styleize(2,1)}><ReactCanvas id="col1-row2"/></div>
				<div className="blue" style={this.styleize(3,1)}><Extras.GenomeAnnotation/></div>

				{/* MIDDLE ROW (tree & gubbins & meta) */}
				<div className="newline"/>
				<div className="green" style={this.styleize(1,2)}><PhyloReact/></div>
				<div className="blue" style={this.styleize(2,2)}><MetaReact.MetaCanvasClass on={this.props.elementsOn.col[1]}/></div>
				<div className="green" style={this.styleize(3,2)}><GubbinsCanvas.GubbinsCanvasClass/></div>

				{/* BOTTOM ROW (only plot at the moment) */}
				<div className="newline"/>
				<div style={this.styleize(1,3)}></div>
				<div style={this.styleize(2,3)}></div>
				<div className="blue" style={this.styleize(3,3)}><GubbinsCanvas.RecombGraphClass/></div>

			</div>
		)
	}
})


var ReactCanvas = React.createClass({displayName: "displayName",
	componentDidMount: function() {
		this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
		this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
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


module.exports = CanvasDivs;




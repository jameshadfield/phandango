// canvas stuff here: http://jsfiddle.net/JMZc5/1/

var React = require('react');
var GubbinsCanvas = require('./gubbins.react.js');
var MetaReact = require('./meta.react.js');
var CanvasStore = require('../stores/CanvasStore.js');
var PhyloReact = require('./phylo.react.js');
var ButtonPanel = require('./ui.react.js');
var Extras = require('./extras.react.js');
var Actions = require('../actions/actions.js');




var Main_React_Element = React.createClass({displayName: "Main_React_Element",
	getInitialState: function() {
		return {canvas_on_off: CanvasStore.getAll()}
	},

	// Invoked once, immediately after the initial rendering
	componentDidMount: function() {
		CanvasStore.addChangeListener(this.blah);
		console.log(this.getDOMNode())

		this.getDOMNode().addEventListener("dragover", function(event) {
		    event.preventDefault();
		}, false);
		this.getDOMNode().addEventListener("drop", function(event) {
		    event.preventDefault();
			var files = event.dataTransfer.files;
			// if files.length>1 then do some carny
			// apply trick to call multiple actions
			Actions.files_dropped(files)
		}, false);
	},

	blah: function() {
		this.setState({canvas_on_off: CanvasStore.getAll()})
	},


	render: function() {
		return(

			<div className="mainDiv">
				<ButtonPanel/>
				{/* TOP ROW */}
				<div>
					<Extras.BlankDivAboveTree/>
					{/* <canvas id="blankDivAboveMeta"></canvas> */}
					<canvas className="row-1 col-2"></canvas>
					<Extras.GenomeAnnotation/>
				</div>
				{/* MIDDLE ROW (TREE / GUBBINS) */}
				<div>
					<PhyloReact/>
					<MetaReact.MetaCanvasClass/>
					<GubbinsCanvas.GubbinsCanvasClass/>
				</div>
				{/* BOTTOM ROW */}
				<div className="newline"></div>
				<GubbinsCanvas.RecombGraphClass/>

			</div>

			);
	}
});

// window.onload = function() {
// 	Actions.loadDefaultData();
// }



window.onresize = function() {
	// console.log("window.onresize");
	// var canvas = new Array();
	// canvas[0] = document.getElementById('GenomeAnnotation'),
	// canvas[1] = document.getElementById('gubbinsCanvas'),
	// canvas[2] = document.getElementById('BlankDivAboveTree');
	// canvas[3] = document.getElementById('recombGraphDiv');
	// canvas[4] = document.getElementById('metaCanvas');

	// for (var i = canvas.length - 1; i >= 0; i--) {
	// 	var width = canvas[i].clientWidth;
	// 	var height = canvas[i].clientHeight;
	// 	if (canvas[i].width != width ||
	// 	   canvas[i].height != height) {
	// 	 // Change the size of the canvas to match the size it's being displayed
	// 	 canvas[i].width = width;
	// 	 canvas[i].height = height;
	// 	 // console.log(canvas[i].id, ' resized');
	// 	 // Trigger a change so that all the canvas is rendered
	// 	 Actions.phylocanvas_changed();
	// 	}
	// };
	// phylocanvas.fitInPanel();
}

module.exports = Main_React_Element;

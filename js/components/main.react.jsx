// canvas stuff here: http://jsfiddle.net/JMZc5/1/

var React = require('react');
var GubbinsCanvas = require('./gubbins.react.jsx');
var MetaReact = require('./meta.react.jsx');
var CanvasStore = require('../stores/CanvasStore.js');
var PhyloReact = require('./phylo.react.jsx');
var Extras = require('./extras.react.jsx');
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
				{/* TOP ROW */}
				<div className="newline">

					<div id="smallGenomeContainer" className="col-1 row-1 red">
						<Extras.SmallGenome/>
						<div id="settingsSmall" className="inContainer settings">main settings here</div>
					</div>

					<div id="annotationContainer" className="col-3 row-1 blue">
						<Extras.GenomeAnnotation/>
						<div id="settingsAnnotation" className="inContainer settings">GFF settings here</div>
					</div>

				</div>
				{/* MIDDLE ROW (TREE / GUBBINS) */}

				<div className="newline">

					<div id="gubbinsContainer" className="col-1 row-2 green">
						<PhyloReact/>
						<div id="settingsPhylo" className="inContainer settings">phylocanvas settings here</div>
					</div>

					<div id="gubbinsContainer" className="col-2 row-2 red">
						<MetaReact.MetaCanvasClass/>
						<div id="settingsMeta" className="inContainer settings">meta settings here</div>
					</div>


					<div id="gubbinsContainer" className="col-3 row-2 green">
						<GubbinsCanvas.GubbinsCanvasClass/>
	                	<div id="settingsGubbins" className="inContainer settings">gubbins settings here</div>
					</div>


				</div>
				{/* BOTTOM ROW */}
				<div className="newline"></div>

	            <div id="graphContainer" className="col-3 row-3 blue">
	                <GubbinsCanvas.RecombGraphClass/>
	                <div id="settingsGraph" className="inContainer settings">graph settings here</div>
	            </div>

			</div>

			);
	}
});

// window.onload = function() {
// 	Actions.loadDefaultData();
// }

// LISTEN FOR SHIFT KEY AND TOGGLE SETTINGS DIV
// http://stackoverflow.com/questions/11101364/javascript-detect-shift-key-down-within-another-function
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
var setShiftDown = function(event){
    if(event.keyCode === 16 || event.charCode === 16){
        console.log("SHIFT DOWN")
        var settingsPanels = document.getElementsByClassName('settings'), i;
		for (var i = 0; i < settingsPanels.length; i ++) {
		    settingsPanels[i].style.display = 'flex';
		}
    }
    else if (event.keyCode === 68 || event.charCode === 68){
    	Actions.loadDefaultData();
    }


};
var setShiftUp = function(event){
    if(event.keyCode === 16 || event.charCode === 16){
        console.log("SHIFT UP")
        var settingsPanels = document.getElementsByClassName('settings'), i;
		for (var i = 0; i < settingsPanels.length; i ++) {
		    settingsPanels[i].style.display = 'none';
		}
    }
};
window.addEventListener ? document.addEventListener('keydown', setShiftDown) : document.attachEvent('keydown', setShiftDown);
window.addEventListener ? document.addEventListener('keyup', setShiftUp) : document.attachEvent('keyup', setShiftUp);




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

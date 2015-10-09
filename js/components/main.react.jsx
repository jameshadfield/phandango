// canvas stuff here: http://jsfiddle.net/JMZc5/1/

var React = require('react');
var GubbinsCanvas = require('./gubbins.react.jsx');
var MetaReact = require('./meta.react.jsx');
var PhyloReact = require('./phylo.react.jsx');
var Extras = require('./extras.react.jsx');
var Actions = require('../actions/actions.js');

var keystrokes = require('./keystrokes.jsx');



var Main_React_Element = React.createClass({displayName: "Main_React_Element",

	// Invoked once, immediately after the initial rendering
	componentDidMount: function() {
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

	render: function() {
		return(
			<div id="mainDiv" className="mainDiv">

				{/* settings are injected here via keystrokes.jsx */}
				<div id="settingsContainer"/>

				{/* TOP ROW */}
				<div className="newline">

					<div id="smallGenomeContainer" className="col-1 row-1 red">
						<Extras.SmallGenome/>
					</div>

					<div id="annotationContainer" className="col-3 row-1 blue">
						<Extras.GenomeAnnotation/>
					</div>

				</div>
				{/* MIDDLE ROW (TREE / GUBBINS) */}

				<div className="newline">

					<div id="gubbinsContainer" className="col-1 row-2 green">
						<PhyloReact/>
					</div>

					<div id="gubbinsContainer" className="col-2 row-2 red">
						<MetaReact.MetaCanvasClass/>
					</div>


					<div id="gubbinsContainer" className="col-3 row-2 green">
						<GubbinsCanvas.GubbinsCanvasClass/>
					</div>


				</div>
				{/* BOTTOM ROW */}
				<div className="newline">

		            <div id="graphContainer" className="col-3 row-3 blue">
		                <GubbinsCanvas.RecombGraphClass/>
		            </div>
	            </div>

			</div>

			);
	}
});

window.onload = function() {
	// Actions.loadDefaultData();
	// document.getElementById('landing').style.display="none";

}


// React.renderComponent(<SampleComponent />, document.getElementById('container'));

// setTimeout(function() {
// 	console.log("RENDERING SETTINGS");
//     React.render(<Settings />, document.getElementById('settingsContainer'));
// }, 1000);

// setTimeout(function() {
// 	console.log("REMOVING SETTINGS");
//     React.unmountComponentAtNode(document.getElementById('settingsContainer'));
// }, 3000);


// a function to scale the canvas' on a resize
window.onresize = function() {
	console.log("RESIZE DETECTED");
	var canvases = document.getElementsByTagName("canvas");
	for (var i = canvases.length - 1; i >= 0; i--) {
		var width = canvases[i].clientWidth;
		var height = canvases[i].clientHeight;
		if (canvases[i].width != width || canvases[i].height != height) {
		 	// Change the size of the canvas to match the size it's being displayed
		 	canvases[i].width = width;
		 	canvases[i].height = height;
		 	console.log("\t", canvases[i].id, ' resized');
		 	// now we need to redraw the canvas
		 	// hack: fake a phylocanvas change --> cause a redraw nearly everywhere
			Actions.phylocanvas_changed();
		}
	};
	phylocanvas.fitInPanel();
}

module.exports = Main_React_Element;

var Actions = require('../actions/actions.js');
var ReactDOM = require('react-dom');


var rescaleCanvases = function() {
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
		}
	};
 	// now we need to redraw the canvas
 	// hack: fake a phylocanvas change --> cause a redraw nearly everywhere
	Actions.phylocanvas_changed();
	// phylocanvas.fitInPanel();
}

// the CSS scales the canvas, but we have to set the correct width and height here as well, and this must be updated upon resizes (and then a redraw triggered)
var initCanvasXY = function(myState) {
    ReactDOM.findDOMNode(myState).setAttribute('width', window.getComputedStyle(ReactDOM.findDOMNode(myState)).width);
    ReactDOM.findDOMNode(myState).setAttribute('height', window.getComputedStyle(ReactDOM.findDOMNode(myState)).height);
}

module.exports = {'rescaleCanvases': rescaleCanvases, 'initCanvasXY': initCanvasXY};

var Actions = require('../actions/actions.js');


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

module.exports = {'rescaleCanvases': rescaleCanvases};

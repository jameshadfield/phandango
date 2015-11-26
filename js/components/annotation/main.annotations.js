

var parser = require('./parse.annotations.js');
var draw = require('./draw.annotations.js')
var Taxa_Locations = require('../../stores/Taxa_Locations.js')
var GenomeStore = require('../../stores/genome.js')
var mouse_moves = require('../mouse_moves.js')
var RegionSelectedStore = require('../../stores/RegionSelectedStore.js')
var Actions = require('../../actions/actions.js');
var MiscStore = require('../../stores/misc.Store.js');
var RawDataStore = require('../../stores/RawDataStore.js');


function annotationTrack(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners
	// var arrows = undefined;
	this.currently_selected = undefined;

	window.addEventListener('resize', function(){myState.redraw()}, true);

	this.loadRawData = function() {
		myState.arrows =  RawDataStore.getParsedData('annotation');
		myState.scaleType = RawDataStore.getGenomicDatasetType()==='gubbins' ? 'bp' : 'num';
		myState.currently_selected =  undefined;
		myState.redraw();
	}

	this.redraw = function() {
		// is anything loaded (else we can't redraw!)
		if (myState.arrows===undefined) {
			return
		}
		// trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
		var visible_genome = GenomeStore.getVisible()
		// console.log(arrows)
		var current_arrows = draw.get_arrows_in_scope(myState.arrows, visible_genome, myState.canvas)
		// console.log(current_arrows)
		// console.log("DRAW ANNOTATION")
		draw.clearCanvas(myState.canvas);
		draw.drawArrows(myState.context, current_arrows, visible_genome[1] - visible_genome[0] < 100000);
		draw.drawScale(myState.context, myState.canvas.width, visible_genome, parseInt(myState.canvas.height/2));
		if (myState.currently_selected !== undefined) {
			if (draw.get_arrows_in_scope([myState.currently_selected], visible_genome, myState.canvas).length > 0) {
				// draw
				draw.drawBorderAndText(myState.context, myState.currently_selected, parseInt(myState.canvas.width / 2, 10), parseInt(myState.canvas.height / 2, 10));
			}
		}
	}


	this.checkForClick = function() {
		if (RegionSelectedStore.getID()!==canvas.id) {
			return;
		}
		// console.log("Click taken by annotations")
		var mouse = RegionSelectedStore.getClickXY()
		// console.log("RegionSelectedStore change detected. Mouse x: "+mouse[0]+" y: "+mouse[1])
		var visible_genome = GenomeStore.getVisible()
		var current_arrows = draw.get_arrows_in_scope(myState.arrows, visible_genome, myState.canvas)
		for (var i=0; i<current_arrows.length; i++) {
			if ( mouse[0] >= current_arrows[i].x && mouse[0] <= (current_arrows[i].x + current_arrows[i].w) && mouse[1] >= current_arrows[i].y && mouse[1] <= (current_arrows[i].y + current_arrows[i].h)) {
				myState.currently_selected = current_arrows[i];
				myState.redraw();
				// draw.drawBorderAndText(myState.context, current_arrows[i], parseInt(myState.canvas.width/2), parseInt(myState.canvas.height/2));
				// console.log(current_arrows[i]);
				return;
			}
		}
		// nothing selected! (fallthrough)
		myState.currently_selected =  undefined;
		myState.redraw();
	}

	// whenever the Taxa_locations store changes (e.g. someones done something to the tree)
	// we should re-draw. umm no, we shouldnt
	// Taxa_Locations.addChangeListener(this.redraw);

	// likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
	GenomeStore.addChangeListener(this.redraw);

	RegionSelectedStore.addChangeListener(this.checkForClick);

	MiscStore.addChangeListener(this.redraw);

	RawDataStore.addChangeListener(this.loadRawData);

	this.loadRawData();

}


module.exports = annotationTrack;


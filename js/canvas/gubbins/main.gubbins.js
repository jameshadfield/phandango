
var parser = require('./parse.gubbins.js');
var draw = require('./draw.gubbins.js')
var Taxa_Locations = require('../../stores/Taxa_Locations.js')
var GenomeStore = require('../../stores/genome.js')
var trim_blocks = require('./trim_blocks.gubbins.js')
var mouse_moves = require('./mouse_moves.gubbins.js')
var Actions = require('../../actions/actions.js')


function gubbins(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners

	var gff_returned = parser.parse_gff(); // tmp value as cant allocate array return in a single go :(
	// var genome_coords = gff_returned[0];
	Actions.set_genome_length(gff_returned[0][1]);
	var raw_blocks = gff_returned[1];

	this.redraw = function() {
		// trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
		var visible_genome = GenomeStore.getVisible()
		var blocks = trim_blocks(raw_blocks, visible_genome, myState.canvas)
		draw.clearCanvas(myState.canvas)
		draw.drawBlocks(myState.context, blocks);
	}

	// whenever the Taxa_locations store changes (e.g. someones done something to the tree)
	// we should re-draw
	Taxa_Locations.addChangeListener(this.redraw);

	// likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
	GenomeStore.addChangeListener(this.redraw);


	this.redraw();
}


module.exports = gubbins;


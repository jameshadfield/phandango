
var parser = require('./parse.gubbins.js');
var draw = require('./draw.gubbins.js')
var Taxa_Locations = require('../../stores/Taxa_Locations.js')
var GenomeStore = require('../../stores/genome.js')
var trim_blocks = require('./trim_blocks.gubbins.js')
var mouse_moves = require('./mouse_moves.gubbins.js')
var Actions = require('../../actions/actions.js')
var RegionSelectedStore = require('../../stores/RegionSelectedStore.js')


function gubbins(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners

	var gff_returned = parser.parse_gff(); // tmp value as cant allocate array return in a single go :(
	// var genome_coords = gff_returned[0];
	Actions.set_genome_length(gff_returned[0][1]);
	var raw_blocks = gff_returned[1];
	var blocks;
	this.selected_block = undefined;

	this.redraw = function() {
		// trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
		var visible_genome = GenomeStore.getVisible()
		// we should work out if anything has actually changed -- kind of similar to react
		// i.e. store the values of visible_genome and selected_block and,
		// if they haven't changed, there's no need to redraw

		blocks = trim_blocks(raw_blocks, visible_genome, myState.canvas)
		draw.clearCanvas(myState.canvas)
		draw.highlightSelectedNodes(myState.canvas, myState.context, GenomeStore.getSelectedTaxaY())
		draw.drawBlocks(myState.context, blocks);
		// console.log(blocks)
		if (myState.selected_block!==undefined) {
			// why does this not update? It should be a reference to the block, not a copy?
			// because the block (inside )
			draw.displayBlockInfo(myState.context, myState.selected_block);
		}
	}

	this.checkForClick = function() {
		if (RegionSelectedStore.getID()===canvas.id) {
			// console.log("Click taken by gubbins")
			myState.selected_block = getSelectedBlock(blocks,RegionSelectedStore.getClickXY())
			// myState.selected_block.fill="orange";
			// console.log(myState.selected_block)
			myState.redraw() // will pick up the block :)
		}
	}

	// whenever the Taxa_locations store changes (e.g. someones done something to the tree)
	// we should re-draw
	Taxa_Locations.addChangeListener(this.redraw);

	// likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
	GenomeStore.addChangeListener(this.redraw);

	// clicks
	RegionSelectedStore.addChangeListener(this.checkForClick);

	this.redraw();
}

function getSelectedBlock(blocks, mouse) {
	// console.log(mouse)
	for (i=0; i<blocks.length; i++) {
		// console.log(blocks[i])
		if ( mouse[0] >= blocks[i].x1 && mouse[0] <= blocks[i].x2 && mouse[1] >= blocks[i].y1 && mouse[1] <= blocks[i].y2) {
			return blocks[i];
		}
	}
	return undefined;
}

module.exports = gubbins;



var parser = require('./parse.gubbins.js');
var draw = require('./draw.js')
var Taxa_Locations = require('../../stores/Taxa_Locations.js')
var GenomeStore = require('../../stores/genome.js')
var trim_blocks = require('./trim_blocks.js')
var mouse_moves = require('../mouse_moves.js')
var Actions = require('../../actions/actions.js')
var RegionSelectedStore = require('../../stores/RegionSelectedStore.js')
var MiscStore = require('../../stores/misc.Store.js');
var RawDataStore = require('../../stores/RawDataStore.js');



function gubbins(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners

	// var gff_returned = parser.parse_gff(); // tmp value as cant allocate array return in a single go :(
	// var genome_coords = gff_returned[0];
	// Actions.set_genome_length(gff_returned[0][1]);
	// var raw_blocks = gff_returned[1];

	// var raw_blocks = RawDataStore.getParsedData('genomic')[1]
	var raw_blocks;
	var blocks;
	this.selected_block = undefined;

	this.loadRawData = function() {
		myState.raw_blocks = RawDataStore.getParsedData('genomic')[1];
		myState.redraw();
	}

	// window.addEventListener('resize', function(){myState.redraw()}, true);

	// this.canvas.addEventListener("onresize", function() {
	// 		console.log("resize detected")
	// 	    this.redraw()
	// 	}, false
	// );

	Actions.set_genome_length(RawDataStore.getParsedData('genomic')[0][1])


	// this.load = function(gff_string) {
	// 	var parsed = parser.parse_gff(gff_string);
	// 	// this may well FAIL and, if so, we should return false or something
	// 	if (parsed===false) {
	// 		// console.log("gubbins parsing failed")
	// 		return false
	// 	}
	// 	// console.log(parsed[0])
	// 	console.log("gubbins parsing successful")
	// 	raw_blocks = parsed[1]
	// 	Actions.set_genome_length(parsed[0][1])
	// 	this.redraw()
	// 	// this action will cause a redraw!
	// }

	this.redraw = function() {
 		// redraws are expensive. We need to work out if we redraw.
 		// we only redraw if 	* viewport (visible_genome) has changed <- taken care of in the store
 		// 						* click has selected / deseleced a block (myState.selected_block) <-
 		//						* Taxa_Locations have changed (i.e. y values are different) <-- this is taken care of in the store
		// is anything actually loaded?
		if (myState.raw_blocks===undefined) {return false}
		// trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
		var visible_genome = GenomeStore.getVisible()
		// console.log("DRAW GUBBINS over visible_genome",visible_genome)
		blocks = trim_blocks(myState.raw_blocks, visible_genome, myState.canvas)
		draw.clearCanvas(myState.canvas)
		// console.log(GenomeStore.getSelectedTaxaY())
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
			var new_selected_block = getSelectedBlock(blocks,RegionSelectedStore.getClickXY())
			if (
				(myState.selected_block===undefined && new_selected_block!==undefined ) ||
				(myState.selected_block!==undefined && new_selected_block===undefined ) ||
				((myState.selected_block!==undefined && new_selected_block!==undefined) && myState.selected_block.id!==new_selected_block.id )
				) {
				myState.selected_block = new_selected_block
				myState.redraw() // will pick up the block :)
			}
		}
	}

	// whenever the Taxa_locations store changes (e.g. someones done something to the tree)
	// we should re-draw
	Taxa_Locations.addChangeListener(this.redraw);

	// likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
	GenomeStore.addChangeListener(this.redraw);

	// clicks
	RegionSelectedStore.addChangeListener(this.checkForClick);

	MiscStore.addChangeListener(this.redraw);

	RawDataStore.addChangeListener(this.loadRawData);

	this.loadRawData(); // forces this.redraw()
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



var parser = require('./parse.gubbins.js');
var draw = require('./draw.gubbins.js')
var Taxa_Locations = require('../../stores/Taxa_Locations.js')

// hack. rewrite.
function associate_taxa_with_dummy_y_values(blocks, canvas_height) {
	// console.log("hack fn associate_taxa_with_dummy_y_values called")
	var taxa = []
	for (i=0; i<blocks.length; i++){
		for (j=0; j<blocks[i].taxa.length; j++){
			if (taxa.indexOf(blocks[i].taxa[j]) === -1) { // i.e. not counted yet!
				taxa.push(blocks[i].taxa[j]);
			}
		}
	}
	var taxa_y_value = [];
	for (k=0; k<taxa.length; k++) {
		taxa_y_value[taxa[k]] = parseInt( (k+1)/taxa.length * canvas_height );
	}
	// console.log(taxa_y_value)
	return(taxa_y_value);
}

function trim_blocks(raw_blocks, genome_coords, canvas) {
	var trimmed_blocks = [];
	var active_taxa = []; // all taxa which are currently "active"
	var is_phylotree_active = Taxa_Locations.loaded()
	if (is_phylotree_active===false) {
		console.log('[BUG] phylocanvas not initialised and we\'re trying to start up gubbins. Problems to follow...')
		// create a dummy mapping. This should be a call to the store to do this but oh well.
		var taxa_y_value = associate_taxa_with_dummy_y_values(raw_blocks, canvas.height);
		console.log(taxa_y_value)
	}

	console.log("Is tree loaded???? "+is_phylotree_active)
	for (var i=0; i<raw_blocks.length; i++){
		// check if in view here

		// this is fucking stupid -- we need to clone the object instead
		var new_block = new parser.Block( //start_base, end_base, taxa, node, nll, snps
				raw_blocks[i].start_base, raw_blocks[i].end_base, raw_blocks[i].taxa, raw_blocks[i].node, raw_blocks[i].nll, raw_blocks[i].snps
				)
		new_block.x1 = parseInt( new_block.start_base / genome_coords[1] * canvas.width );
		new_block.x2 = parseInt( new_block.end_base   / genome_coords[1] * canvas.width );

		// calculate the y-values
		if (is_phylotree_active) {
			var tmp = Taxa_Locations.getTaxaY(new_block.taxa)
			new_block.y1 = tmp[0];
			new_block.y2 = tmp[1];
		}
		else { // no phylocanvas!!!!!!!!!!
			var center_y_coords = []; // y-coords of all taxa in block (could be only one if blue)
			for (var key in taxa_y_value) {
				if ( new_block.taxa.indexOf(key) > -1 ) { // HIT
					center_y_coords.push( taxa_y_value[key] )
				}
			}
			new_block.y1 = Math.min.apply(null,center_y_coords) - 5
			new_block.y2 = Math.max.apply(null,center_y_coords) + 5
		}

		trimmed_blocks.push(new_block)

	}
	return(trimmed_blocks)

}


function gubbins(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	var myState = this;

	// console.log("context upper left: "+this.canvas.offsetLeft)
	// console.log("main() in main.gubbins.js triggered")

	// var genome_coords, raw_blocks;
	var gff_returned = parser.parse_gff(); // tmp value as cant allocate array return in a single go :(
	var genome_coords = gff_returned[0];
	var raw_blocks = gff_returned[1];

	this.redraw = function() {
		// trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
		var blocks = trim_blocks(raw_blocks, genome_coords, myState.canvas)
		draw(myState.canvas, myState.context, blocks); // only once at the moment
	}

	// whenever the Taxa_locations store changes (e.g. someones done something to the tree)
	// we should re-draw
	Taxa_Locations.addChangeListener(this.redraw);

	// likewise, whenever anybody changes the genome-position of the viewport, we should re-draw

	this.redraw();
}


module.exports = gubbins;


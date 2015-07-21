var Taxa_Locations = require('../../stores/Taxa_Locations.js')
var parser = require('./parse.gubbins.js');


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
		taxa_y_value[taxa[k]] = parseInt( (k+1)/taxa.length * (canvas_height-50)  )+25; // the -50 and -25 to create a buffer.
	}
	// console.log(taxa_y_value)
	return(taxa_y_value);
}

// Given a massive list of blocks, we can remove those which fall outside the current genome view
// Now is also the time to add in x and y values for each block which are in pixels relartive to the canvas
// so that the draw() funciton becomes trivial
function trim_blocks(raw_blocks, visible_genome_coords, canvas) {
	var bases_visible = visible_genome_coords[1] - visible_genome_coords[0];
	var trimmed_blocks = [];
	var active_taxa = Object.keys(Taxa_Locations.getAll()) ; // all taxa which are currently "active"
	// active_taxa = ['ST1_8','ST1_43']; // JAMES
	var is_phylotree_active = Taxa_Locations.loaded()
	if (is_phylotree_active===false) {
		// console.log('[BUG] phylocanvas not initialised and we\'re trying to start up gubbins. Problems to follow...')
		// create a dummy mapping. This should be a call to the store to do this but oh well.
		var taxa_y_value = associate_taxa_with_dummy_y_values(raw_blocks, canvas.height);
		// console.log(taxa_y_value)
	}

	// console.log("Is tree loaded???? "+is_phylotree_active)
	for (var i=0; i<raw_blocks.length; i++){
		// check if in view here
		if (raw_blocks[i].start_base >= visible_genome_coords[1] || raw_blocks[i].end_base <= visible_genome_coords[0]) {
			continue;
		}
		var any_taxa_in_view = false;
		for (var j=0; j<raw_blocks[i].taxa.length; j++) {
			if (active_taxa.indexOf(raw_blocks[i].taxa[j]) > -1) {
				any_taxa_in_view = true;
				break;
			}
		}
		if (any_taxa_in_view===false) {continue};

		// this is fucking stupid -- we need to clone the object instead
		// var new_block = new parser.Block( //start_base, end_base, taxa, node, nll, snps
		// 		raw_blocks[i].start_base, raw_blocks[i].end_base, raw_blocks[i].taxa, raw_blocks[i].node, raw_blocks[i].nll, raw_blocks[i].snps
		// 		)

		var new_block = raw_blocks[i] // pass by reference
		new_block.x1 = parseInt( (new_block.start_base - visible_genome_coords[0]) / bases_visible * canvas.width );
		new_block.x2 = parseInt( (new_block.end_base - visible_genome_coords[0])  / bases_visible * canvas.width );

		// calculate the y-values
		if (is_phylotree_active) {
			var tmp = Taxa_Locations.getTaxaY(new_block.taxa)
			if (tmp===null) {
				continue;
			}
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

module.exports = trim_blocks;

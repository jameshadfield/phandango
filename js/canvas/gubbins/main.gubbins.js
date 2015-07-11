
var parser = require('./parse.gubbins.js');
var draw = require('./draw.gubbins.js')

var hardcoded_cavas_width = 400; //bad. clearly
var hardcoded_cavas_height = 600;


// hack. rewrite.
function associate_taxa_with_y_values(blocks) {
	console.log("hack fn associate_taxa_with_y_values called")
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
		taxa_y_value[taxa[k]] = parseInt( (k+1)/taxa.length * hardcoded_cavas_height );
	}
	console.log(taxa_y_value)
	return(taxa_y_value);
}

// hack. rewrite
function trim_blocks(blocks, genome_coords, taxa_y_value) {
	var trimmed_blocks = [];
	for (i=0; i<blocks.length; i++){
		// check if in view here

		// this is fucking stupid -- we need to clone the object instead
		var new_block = new parser.Block( //start_base, end_base, taxa, node, nll, snps
				blocks[i].start_base, blocks[i].end_base, blocks[i].taxa, blocks[i].node, blocks[i].nll, blocks[i].snps
				)
		new_block.x1 = parseInt( new_block.start_base / genome_coords[1] * hardcoded_cavas_width );
		new_block.x2 = parseInt( new_block.end_base   / genome_coords[1] * hardcoded_cavas_width );

		// for all the taxa in this block, get an array of all of the y values. We then choose the biggest and smallest to draw for the block
		var center_y_coords = []; // y-coords of all taxa in block (could be only one if blue)
		for (var key in taxa_y_value) {
			if ( new_block.taxa.indexOf(key) > -1 ) { // HIT
				center_y_coords.push( taxa_y_value[key] )
			}
		}
		new_block.y1 = Math.min.apply(null,center_y_coords) - 5
		new_block.y2 = Math.max.apply(null,center_y_coords) + 5

		trimmed_blocks.push(new_block)
	}
	return(trimmed_blocks)

}

function gubbins(context) {
	console.log("main() in main.gubbins.js triggered")
	// console.log("parser: ",parser);
	// console.log("parser.parse_gff: ", parser.parse_gff);
	// // console.log("parser.parse_gff(): ", parser.parse_gff());
	// console.log("parser(): ",parser());

	// var genome_coords, raw_blocks;
	var genome_coords = parser.parse_gff()[0];
	var raw_blocks = parser.parse_gff()[1];

	var taxa_y_value = associate_taxa_with_y_values(raw_blocks);
	var blocks = trim_blocks(raw_blocks,genome_coords,taxa_y_value)

	draw(context, blocks); // only once at the moment

	// console.log(raw_blocks);
}

module.exports = gubbins;


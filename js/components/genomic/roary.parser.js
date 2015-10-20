var Actions = require('../../actions/actions.js')
var gubbinsParser = require('./parse.gubbins.js');
var gffParser = require('../annotation/parse.annotations.js');


function parseCSV(gff_string) {
	// header is an array of hashes with different keys (gene name, genomic region, genomic number)
	// this header can be sorted (e.g. by region then number) to produce an array of indexes (of the array)
	// each region has a set number of pixels
	// parse the CSV such that hash.laneName = [binary]
	// now when we call up the draw function we just crawl the array (for each taxa) along (adding 10px to the draw call)
	// and we traverse this array by the index array already generated
	// if 1 then set x1 or +10 to x1
	// if 0 then draw if in cache or +10 to pixel count

	// the gff parsing uses Arrow from parse.annotations.js
	// we create the arrow from crawling the generated index and making arrows out of each one (adding 10px to each)
	//

	// columns:
	// [0] gene name
	// [2] annotation
	// [6] genome fragment
	// [7] order within fragment
	// [11-...] genes


	var splitLines = gff_string.split("\n").map(function(x){return x.replace(/"/g, '').trim().split(',')})
	var maxColIdx = splitLines[0].length, maxRowIdx = splitLines.length;
	// note that they're not all the same length due to CSV parsing difficulties (the last columns dissapear if empty etc)


	var roary = {};
	var header = [];

	// H E A D E R
	for (var i=1; i<maxRowIdx; i++) {
		header.push({'annotation':splitLines[i][2],'name':splitLines[i][0],'fragment':splitLines[i][6],'order':splitLines[i][7]});
	}

	// P O P U L A T E    H A S H
	for (var colNum=11; colNum<maxColIdx; colNum++) {
		var taxaName = splitLines[0][colNum];
		roary[taxaName] = []; // will be populated with binary
		for (var rowNum=1; rowNum<maxRowIdx; rowNum++) {
			roary[taxaName].push(splitLines[rowNum][colNum] ? 1 : 0); // seems to catch everything... i think
		}
	}
	return ([header,roary]);
}

function generateRoary(roary,header,geneLen) {
	var blocks = makeBlocks(roary);
	var arrows = makeAnnotation(header);
	var genomeLength = geneLen * header.length;
	return([blocks,arrows,genomeLength]);
};


function makeBlocks(roary) {
	var ret = [];
	Object.keys(roary).forEach( function(taxa) {
		console.log("key of roary: ",taxa)
		var maxIdx = roary[taxa].length, inBlock=false, blockOpen=0, blockClose=0, xPos=0, geneLen=100;
		for (var i=0; i<maxIdx-1; i++) {
			if (roary[taxa][i]) { // i.e. gene "present"
				if (!inBlock) { // but we wern't in a block --> open one
					inBlock=true, blockOpen=xPos;
				} // else we were in a block --> extend the block (nothing needed)
			}
			else { // gene not present
				if (inBlock) { // we were in a block --> close (create) block
					inBlock = false;
					// new Block(start_base, end_base, taxa, node, nll, snps, id)
					ret.push(new gubbinsParser.Block(blockOpen,xPos,[taxa],0,0,0,0));
				}
				// else we wern't in a block anyway so nothing changes
			}

			if (taxa==='PT4') {
				console.log(ret[-1])
			}


			xPos += geneLen; // basically a counter
		}
		// final case (i==maxIdx-1 i.e. final column)
		if (roary[taxa][maxIdx-1] && inBlock) { // still in block
			ret.push(new gubbinsParser.Block(blockOpen,xPos+geneLen,[taxa],0,0,0,0))
		} else if (roary[taxa][maxIdx-1] && !inBlock) { // wern't in block but now are
			ret.push(new gubbinsParser.Block(xPos,xPos+geneLen,[taxa],0,0,0,0))
		} else if (!roary[taxa][maxIdx-1] && inBlock) { // were in block but now arent
			ret.push(new gubbinsParser.Block(blockOpen,xPos,[taxa],0,0,0,0))
		}
	} );
	return(ret);
}

function makeAnnotation(header) {
	var ret=[], geneLen=100;
	for (var i=0; i<header.length; i++) {
		// Arrow(featurestart, featureend, direction, fill, stroke, strokeWidth, info)
		ret.push(new gffParser.Arrow(i*geneLen,(i+1)*geneLen, i%2===0 ? '+' : '-',"#318DCC", "black", 1,header[i].name))
	}
	return ret;
}


module.exports = {'parseCSV':parseCSV, 'generateRoary':generateRoary};





























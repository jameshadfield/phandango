var Actions = require('../../actions/actions.js')
// This module exports the parse_gff function
// at the moment it reads a hardcoded gff

// Block: this is an object / container contstructor
function Block(start_base, end_base, taxa, node, nll, snps, id){
    // This is a very simple and unsafe constructor.
    // All we're doing is checking if the values exist.
    // if this.node is false then it's a leaf (croucher's version would display blue)
    this.start_base = start_base;
    this.end_base = end_base;
    this.taxa = taxa;
    this.node = node;
    this.nll = nll; // neg-log-likelihood
    this.snps = snps;
    if (this.node) {
    	this.fill = "red"; // you can change this with another function
    }
    else {
    	this.fill = "blue";
    }
    this.fillAlpha = 1;
    // the following are measured in pixels relative to the canvas (and therefore unknown at the moment)
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.id = id; // unique ID
}


// helper function: parses gubbins gff file and returns a list of Blocks by taxa ID
// we MUST think of a clever-er way of doing this, but this is the most basic (and stupid)
// if we make this a bunch of call-backs, can we stop the browser from blocking?
// Or is this so fast that we don't need to bother?
function parse_gff(gff_string) {
	// console.log("*** gubbins gff parser called ****")
	var genome_coords = null;
	var lines = gff_string.split("\n") // TO DO
	var blocks=[];

	for (var i=0; i<lines.length; i++){
		var words=lines[i].split("\t");
		if (words[0][0]=="#"){
			var hwords=words[0].split(" ");
			if (hwords[0]=="##sequence-region") {
				genome_coords = [parseInt(hwords[2])-1, parseInt(hwords[3])];
			}
		}
		else {
	    	if (words[1]=="GUBBINS"){
	    		// next few lines, replace lines[i] with words[10] ???
	    		var taxa = lines[i].split("taxa=\"")[1].split("\"")[0].split(/\s+/).filter(Boolean);
                if (taxa.length>1) {
		    		var node = lines[i].split("node=\"")[1].split("\"")[0].split("->");
	    		} else {
	    			var node = false;
	    		}
	    		var nll = lines[i].split("neg_log_likelihood=\"")[1].split("\"")[0];
	    		var num_snps =  lines[i].split("snp_count=\"")[1].split("\"")[0];
	    		blocks.push(
	    			new Block( //start_base, end_base, taxa, node, nll, snps, uniq_ID
	    				words[3], words[4], taxa, node, nll, num_snps, i
	    				)
	    			)
	    	}
    	}
    }

    //       Y    V A L U E S    (for plotting)
    // the following can be a setTimeout i think...
    if (blocks.length>0) {
    	// console.log("STARTING PLOT CALC")
    	// initialise array the correct length
    	var plotYvalues = [];
		for(var i = 0; i < genome_coords[1]; i++){
		    plotYvalues.push(0);
		}
    	// var plotYvalues = Array.apply(null, Array(genome_coords[1])).map(Number.prototype.valueOf,0);

    	// each block change plotYvalues :)
    	for (var i=0; i<blocks.length; i++) {
    		for (var j=blocks[i].start_base; j<=blocks[i].end_base; j++) {
    			plotYvalues[j] += 1
    		}
    	}
    	// console.log("FINISHED PLOT CALC")
    	Actions.save_plotYvalues(plotYvalues, "recombGraph")

    }


    if (blocks.length>0) {
	    return([genome_coords, blocks]);
	}
	else {
		return false;
	}
}

// return_gubbins_string moved to DefaultData

module.exports = {'parse_gff': parse_gff , 'Block': Block};

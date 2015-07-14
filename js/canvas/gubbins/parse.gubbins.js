 // does not require anything I don't think.
// This module exports the parse_gff function
// at the moment it reads a hardcoded gff

// Block: this is an object / container contstructor
function Block(start_base, end_base, taxa, node, nll, snps){
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
}


// helper function: parses gubbins gff file and returns a list of Blocks by taxa ID
// we MUST think of a clever-er way of doing this, but this is the most basic (and stupid)
// if we make this a bunch of call-backs, can we stop the browser from blocking?
// Or is this so fast that we don't need to bother?
function parse_gff() {
	console.log("*** parse_gff called ****")
	var genome_coords = null;
	var lines = return_gubbins_string().split("\n") // TO DO
	var blocks=[];

	for (i=0; i<lines.length; i++){
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
	    			new Block( //start_base, end_base, taxa, node, nll, snps
	    				words[3], words[4], taxa, node, nll, num_snps
	    				)
	    			)
	    	}
    	}
    }
    return([genome_coords, blocks]);
}


function return_gubbins_string() {
	return ("##gff-version 3\n##sequence-region SEQUENCE 1 2221315\nSEQUENCE	GUBBINS	CDS	2171296	2172189	0.000	.	0	node=\"N4->4021_6_9\";neg_log_likelihood=\"112.814876\"taxa=\"4021_6_9\";snp_count=\"11\"\nSEQUENCE	GUBBINS	CDS	124659	124841	0.000	.	0	node=\"N4->4075_8_8\";neg_log_likelihood=\"112.668874\"taxa=\"4075_8_8\";snp_count=\"5\"\nSEQUENCE	GUBBINS	CDS	2171296	2172189	0.000	.	0	node=\"N7->N8\";neg_log_likelihood=\"79.942492\"taxa=\" 4021_8_1 4270_2_10\";snp_count=\"13\"\nSEQUENCE	GUBBINS	CDS	437571	440668	0.000	.	0	node=\"N6->4270_2_1\";neg_log_likelihood=\"240.931449\"taxa=\"4270_2_1\";snp_count=\"17\"\nSEQUENCE	GUBBINS	CDS	1154011	1154158	0.000	.	0	node=\"N6->4270_2_1\";neg_log_likelihood=\"171.290791\"taxa=\"4270_2_1\";snp_count=\"8\"\nSEQUENCE	GUBBINS	CDS	1163601	1165278	0.000	.	0	node=\"N6->4270_2_1\";neg_log_likelihood=\"133.891856\"taxa=\"4270_2_1\";snp_count=\"10\"\nSEQUENCE	GUBBINS	CDS	698236	702632	0.000	.	0	node=\"N6->4270_2_1\";neg_log_likelihood=\"83.175499\"taxa=\"4270_2_1\";snp_count=\"11\"\nSEQUENCE	GUBBINS	CDS	124572	124732	0.000	.	0	node=\"N9->4270_2_9\";neg_log_likelihood=\"145.728895\"taxa=\"4270_2_9\";snp_count=\"11\"\nSEQUENCE	GUBBINS	CDS	411129	411387	0.000	.	0	node=\"N9->4270_2_9\";neg_log_likelihood=\"110.129249\"taxa=\"4270_2_9\";snp_count=\"6\"\nSEQUENCE	GUBBINS	CDS	285069	305751	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"3122.873387\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"443\"\nSEQUENCE	GUBBINS	CDS	1620528	1649446	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"1954.362151\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"209\"\nSEQUENCE	GUBBINS	CDS	336730	352271	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"1207.946274\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"143\"\nSEQUENCE	GUBBINS	CDS	732987	743877	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"739.889084\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"74\"\nSEQUENCE	GUBBINS	CDS	323721	325108	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"461.506098\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"37\"\nSEQUENCE	GUBBINS	CDS	2104999	2113473	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"328.464323\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"34\"\nSEQUENCE	GUBBINS	CDS	2133459	2134136	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"180.038280\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"19\"\nSEQUENCE	GUBBINS	CDS	73625	76475	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"115.119798\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"12\"\nSEQUENCE	GUBBINS	CDS	1156704	1158831	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"64.718723\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"7\"\nSEQUENCE	GUBBINS	CDS	1722140	1722157	0.000	.	0	node=\"N1->N2\";neg_log_likelihood=\"28.082579\"taxa=\"   4021_6_9 4075_8_8  4021_6_8  4270_2_1  4021_6_10  4021_8_1 4270_2_10  4270_2_9 4270_2_8\";snp_count=\"4\"\nSEQUENCE	GUBBINS	CDS	601344	604237	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"1148.251501\"taxa=\"4270_2_7\";snp_count=\"147\"\nSEQUENCE	GUBBINS	CDS	1533749	1535866	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"704.647749\"taxa=\"4270_2_7\";snp_count=\"83\"\nSEQUENCE	GUBBINS	CDS	1165107	1166407	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"411.172874\"taxa=\"4270_2_7\";snp_count=\"55\"\nSEQUENCE	GUBBINS	CDS	2171136	2171346	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"277.292990\"taxa=\"4270_2_7\";snp_count=\"12\"\nSEQUENCE	GUBBINS	CDS	2107108	2107183	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"238.559237\"taxa=\"4270_2_7\";snp_count=\"6\"\nSEQUENCE	GUBBINS	CDS	292266	294385	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"212.704938\"taxa=\"4270_2_7\";snp_count=\"8\"\nSEQUENCE	GUBBINS	CDS	1722646	1722763	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"175.327891\"taxa=\"4270_2_7\";snp_count=\"5\"\nSEQUENCE	GUBBINS	CDS	340597	344860	0.000	.	0	node=\"N1->4270_2_7\";neg_log_likelihood=\"156.202154\"taxa=\"4270_2_7\";snp_count=\"6\"")
}

module.exports = {'parse_gff': parse_gff , 'Block': Block};

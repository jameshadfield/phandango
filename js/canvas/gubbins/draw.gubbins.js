// does not require anything I don't think.
// This module exports the draw() function
// input: canvas context, array of BLOCKS, associative_array linking taxa to y-co-ord in canvas
// note that it draws EVERYTHING it's given!

// the other way of doing this is to add a draw() prototype to Blocks
// then this method just calls blocks[i].draw()
// but this would put the draw method inside parser.gubbins.js which is bad

function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawBlocks(context, blocks) {
	for (i=0; i<blocks.length; i++) {
		context.save();
		// context.beginPath() // does what?
		context.fillStyle = blocks[i].fill;
		context.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].x2-blocks[i].x1, blocks[i].y2-blocks[i].y1);
		context.restore();
	}

}

function highlightSelectedNodes(canvas,context,Yvalues) {
	if (Yvalues!==undefined) {
		// console.log("gubbins background Y values")
		// console.log(Yvalues)
		context.save();
		context.fillStyle = "#E0E0E0";
		context.fillRect(0, Yvalues[0], canvas.width, Yvalues[1]-Yvalues[0]);
		context.restore();
	}
}

function displayBlockInfo(context, block) {
	var hLine = 12; // http://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
	var yDispPos = block.y1>50 ? block.y1-3*hLine : 50;
	var xDispPos = parseInt(block.x1 + (block.x2-block.x1)/2)
	context.fillStyle = "black";
	context.textBaseline="middle";
	context.textAlign = "center";
	context.font="12px Helvetica";
	var text = "SNPs: "+block.snps
	context.fillText(text, xDispPos, yDispPos);
	// var text = "Neg Log Likelihood: "+block.nll
	var len = block.end_base - block.start_base
	if (len>=1000) { 	// kb?
		len=len/1000
		len=String(+ len.toFixed(2))+"kb";
	}
	else {
		len=String(+ len.toFixed(2))+"bp";
	}
	var text = "length: "+len
	context.fillText(text, xDispPos, yDispPos+hLine);
	var text = "n(taxa): "+block.taxa.length
	context.fillText(text, xDispPos, yDispPos+2*hLine);

}


module.exports = {'drawBlocks': drawBlocks, 'clearCanvas': clearCanvas, 'highlightSelectedNodes': highlightSelectedNodes, 'displayBlockInfo': displayBlockInfo};




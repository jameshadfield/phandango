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
		context.save();
		context.fillStyle = "#E0E0E0";
		context.fillRect(0, Yvalues[0], canvas.width, Yvalues[1]-Yvalues[0]);
		context.restore();
	}
}


module.exports = {'drawBlocks': drawBlocks, 'clearCanvas': clearCanvas, 'highlightSelectedNodes': highlightSelectedNodes};




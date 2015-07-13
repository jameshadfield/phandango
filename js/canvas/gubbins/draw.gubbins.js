// does not require anything I don't think.
// This module exports the draw() function
// input: canvas context, array of BLOCKS, associative_array linking taxa to y-co-ord in canvas
// note that it draws EVERYTHING it's given!

// the other way of doing this is to add a draw() prototype to Blocks
// then this method just calls blocks[i].draw()
// but this would put the draw method inside parser.gubbins.js which is bad

function draw(canvas, context, blocks) {
	// clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	for (i=0; i<blocks.length; i++) {
		context.save();
		// context.beginPath() // does what?
		context.fillStyle = blocks[i].fill;
		context.fillRect(blocks[i].x1, blocks[i].y1, blocks[i].x2-blocks[i].x1, blocks[i].y2-blocks[i].y1);
		context.restore();
	}

}

module.exports = draw;




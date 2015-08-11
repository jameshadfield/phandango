var mouse_moves = require('../gubbins/mouse_moves.gubbins.js')
var GenomeStore = require('../../stores/genome.js')


function small_genome(canvas) {
	this.canvas = canvas;
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners

	this.redraw = function() {
		// console.log("SMALL GENOME REDRAW")
		var genome_length = GenomeStore.getGenomeLength();
		var visible_genome = GenomeStore.getVisible()
		clearCanvas(myState.canvas);
		draw(myState.canvas, genome_length, visible_genome);
	}

	// whenever anybody changes the genome-position of the viewport, we should re-draw
	GenomeStore.addChangeListener(this.redraw);

}



function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function draw(canvas, genome_length, visible_genome) {
	var context = canvas.getContext('2d');
	var horBufferFrac = 0.1; // percent of blank space on either side
	var yMiddle = parseInt(canvas.height/2);
	var xStartLine  = parseInt(horBufferFrac*canvas.width)
	var xLineFinish = parseInt(canvas.width*(1 - horBufferFrac))
	var xLineLength = parseInt(canvas.width*(1 - 2*horBufferFrac))
	var xViewStart = parseInt(visible_genome[0]/genome_length*xLineLength + xStartLine);
	var xViewLength = parseInt((visible_genome[1]-visible_genome[0])/genome_length*xLineLength);
	if (xViewLength<1) {
		xViewLength = 1
	}


	// draw a horisontal line
	context.strokeStyle="black";
	context.lineWidth=1;
	context.beginPath();
	context.moveTo(xStartLine, yMiddle);
	context.lineTo(xLineFinish, yMiddle);
	context.stroke();

	// shade a box
	context.globalAlpha=0.2;
	context.fillStyle="black";
	context.fillRect(xViewStart,parseInt(canvas.height/4),xViewLength,parseInt(canvas.height/2));
	context.globalAlpha=1;
}



module.exports = small_genome;

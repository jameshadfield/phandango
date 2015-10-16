var PlotStore = require('../../stores/PlotStore.js')
var GenomeStore = require('../../stores/genome.js')
var MiscStore = require('../../stores/misc.Store.js');



function plotter(canvas, plotName) {
	console.log("PLOTTER INITIALISED")
	this.canvas = canvas;
	this.plotName = plotName;
	this.context = canvas.getContext('2d');
	var myState = this;

	window.addEventListener('resize', function(){myState.redraw()}, true); // don;t forget teardown

	this.redraw = function() {
		// console.log("PLOT REDRAW")
		var genome_length = GenomeStore.getGenomeLength();
		var visible_genome = GenomeStore.getVisible()

		if (!PlotStore.isPlotActive(myState.plotName)) {
			// console.log('PLOT NOT ACTIVE')
			return;
		}

		var plotYvalues = PlotStore.getPlotYvalues(myState.plotName)
		var maximumYvalue = PlotStore.getPlotMaxY(myState.plotName)
		var y_scale_multiplier = parseFloat( canvas.height / maximumYvalue )

		// console.log("in plot object, got len: ",plotYvalues.length," and max Y: ",maximumYvalue)

		clearCanvas(myState.canvas);
		// draw
		myState.context.strokeStyle="black";
		myState.context.lineWidth=1;
		myState.context.beginPath();
		myState.context.moveTo(0,canvas.height);
		// crawl across the x axis by pixel :)
		for (var x=1; x<=canvas.width; x++) {
			var genome_x = parseInt( visible_genome[0] + (x / canvas.width)*(visible_genome[1] - visible_genome[0]) )
			var y = canvas.height - (plotYvalues[genome_x] * y_scale_multiplier)
			myState.context.lineTo(x, y )
			// console.log("pixel x: ",x," genome x: ", genome_x," genome y: ",plotYvalues[genome_x]," pixel y: ",y)
		}
		myState.context.moveTo(canvas.width,canvas.height);
		myState.context.lineTo(0,canvas.height) // bottom line :)
		myState.context.lineTo(0,0) // left hand axis
		myState.context.lineTo(5,0) // axis tick
		myState.context.moveTo(0,canvas.height/2);
		myState.context.lineTo(5,canvas.height/2) // axis tick
		myState.context.stroke();

		// some text :)
		myState.context.fillStyle = "black";
		myState.context.textBaseline="middle";
		myState.context.textAlign = "left";
		myState.context.font="12px Helvetica";
		myState.context.fillText(maximumYvalue.toString() , 5, 5);
		myState.context.fillText((maximumYvalue/2).toString() , 5, parseInt(canvas.height/2));

	}

	GenomeStore.addChangeListener(this.redraw);
	PlotStore.addChangeListener(this.redraw);
	MiscStore.addChangeListener(this.redraw);

}


function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}


module.exports = plotter;

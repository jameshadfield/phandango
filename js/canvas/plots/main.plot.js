var PlotStore = require('../../stores/PlotStore.js')
var GenomeStore = require('../../stores/genome.js')
var MiscStore = require('../../stores/misc.Store.js');
var RawDataStore = require('../../stores/RawDataStore.js');



function plotter(canvas, plotName) {
	// console.log("PLOTTER INITIALISED")
	this.canvas = canvas;
	this.plotName = plotName;
	this.context = canvas.getContext('2d');
	var myState = this;

	window.addEventListener('resize', function(){myState.redraw()}, true); // don;t forget teardown

	this.redraw = function() {
		// console.log("PLOT REDRAW")
		var genome_length = GenomeStore.getGenomeLength();
		var visible_genome = GenomeStore.getVisible()
		var isGubbins = RawDataStore.getGenomicDatasetType()==='gubbins';

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

		drawAxis(myState.canvas,myState.context,maximumYvalue,isGubbins);

	}

	GenomeStore.addChangeListener(this.redraw);
	PlotStore.addChangeListener(this.redraw);
	MiscStore.addChangeListener(this.redraw);

}

function drawAxis(canvas,context,maximumYvalue,isGubbins) {
	var myState = this;
	this.drawTicks = function(canvas,context,tickPercs,tickLength) {
		// we are starting at 0,0 (i.e. TOP LEFT)
		context.moveTo(0,0);
		for (var i=0; i<tickPercs.length;i++) {
			perc=(100-tickPercs[i])/100;
			context.lineTo(0,canvas.height*(1-perc))
			context.lineTo(tickLength,canvas.height*(1-perc))
			context.lineTo(0,canvas.height*(1-perc))
		}
		context.stroke();
	}
	context.moveTo(canvas.width,canvas.height);
	context.lineTo(0,canvas.height) // bottom line :)
	context.lineTo(0,0) // left hand axis (now at top left)
	context.stroke();


	// some text :)
	context.fillStyle = "black";
	context.textBaseline="middle";
	context.textAlign = "left";
	context.font="12px Helvetica";
	if (isGubbins) {
		this.drawTicks(canvas,context,[100,75,50,25],5);
		context.fillText(maximumYvalue.toString() , 5, 5);
		context.fillText((maximumYvalue*.75).toString() , 5, parseInt(canvas.height*.25));
		context.fillText((maximumYvalue*.50).toString() , 5, parseInt(canvas.height*.5));
		context.fillText((maximumYvalue*.25).toString() , 5, parseInt(canvas.height*.75));
	}
	else { // R O A R Y
		this.drawTicks(canvas,context,[100,75,50,25],5);
		context.fillText('100%' , 5, 5);
		context.fillText('75%' , 5, parseInt(canvas.height*.25));
		context.fillText('50%' , 5, parseInt(canvas.height*.5));
		context.fillText('25%' , 5, parseInt(canvas.height*.75));
	}
}

function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}


module.exports = plotter;

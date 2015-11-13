var PlotStore = require('../../stores/PlotStore.js');
var GenomeStore = require('../../stores/genome.js');
var RawDataStore = require('../../stores/RawDataStore.js');
var MiscStore = require('../../stores/misc.Store.js');
var mouse_moves = require('../mouse_moves.js')
var RegionSelectedStore = require('../../stores/RegionSelectedStore.js')


function plotter(canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	var myState = this;
	this.mouse_moves = new mouse_moves(canvas); // set up listeners
	window.addEventListener('resize', function(){myState.redraw()}, true);
	this.redraw = function() {
		console.log('graphs.js REDRAW.',RawDataStore.getDataLoaded('GWAS'),RawDataStore.getDataLoaded('genomic'))
		// what type of plot is it?
		// this needs to be re-written
		if (RawDataStore.getDataLoaded('GWAS')) {
			drawScatterGraph(myState.canvas,myState.context);
			drawAxis(myState.canvas,myState.context,'GWAS');
		} else if (RawDataStore.getDataLoaded('genomic')) {
			clearCanvas(myState.canvas);
			drawLineGraph(myState.canvas,myState.context,'recombGraph','black');
			if (PlotStore.getPlotMaxY('subtree')) {
				drawLineGraph(myState.canvas,myState.context,'subtree','#fd8d3c');
			}
			drawAxis(myState.canvas,myState.context,'recombGraph');
		}
	}

	this.checkForClick = function() {
		if (RegionSelectedStore.getID()!==canvas.id || !RawDataStore.getDataLoaded('GWAS')) {
			return;
		}
		var mouse = RegionSelectedStore.getClickXY()
		var visible_genome = GenomeStore.getVisible()
		var circles = RawDataStore.getParsedData('GWAS');
		// E X P E N S I V E
		for (var i=0; i<circles.length; i++) {
			if (circles[i].selected) {
				circles[i].selected = false;
			}
		}
		for (var i=0; i<circles.length; i++) {
			if (circles[i].x - circles[i].r < mouse[0] &&  circles[i].x + circles[i].r > mouse[0] && circles[i].y - circles[i].r < mouse[1] &&  circles[i].y + circles[i].r > mouse[1]) {
				circles[i].selected = true;
				break;
			}
		}
		myState.redraw();
	}
	RawDataStore.addChangeListener(this.redraw); // initial load
	GenomeStore.addChangeListener(this.redraw);
	PlotStore.addChangeListener(this.redraw);
	MiscStore.addChangeListener(this.redraw);
	RegionSelectedStore.addChangeListener(this.checkForClick);
}



function drawScatterGraph(canvas,context){
	var visible_genome_coords = GenomeStore.getVisible();
	var bases_visible = visible_genome_coords[1] - visible_genome_coords[0];
	if (!bases_visible) {
		// nothing in view (due to no gubbins/annotation)
		return;
	}
	clearCanvas(canvas);
	var maximumYvalue = PlotStore.getPlotMaxY('GWAS')
	var y_scale_multiplier = parseFloat( (canvas.height-5) / maximumYvalue )
	var r = bases_visible > 1000000 ? 1 : bases_visible > 100000 ? 2 : bases_visible > 50000 ? 3 : bases_visible > 10000 ? 4 : 5;
	var circles = RawDataStore.getParsedData('GWAS');
	for (var i=0; i<circles.length; i++) {
		// only draw if in view!
		if (circles[i].featurex > visible_genome_coords[0] && circles[i].featurex < visible_genome_coords[1]) {
			// what are the (canvas) co-ords to draw to?
			circles[i].x = parseInt(( circles[i].featurex - visible_genome_coords[0] ) / bases_visible * canvas.width);
			circles[i].y = canvas.height - (circles[i].featurey * y_scale_multiplier);
			circles[i].r = r;
			circles[i].draw(context) // r not contained in object!
		}
		else {
			circles[i].x = undefined;
			circles[i].y = undefined;
			circles[i].selected = false;
		}
	}
};


function drawLineGraph(canvas,context,plotName,colour) {
	console.log("PLOT REDRAW. colour:",colour)
	var genome_length = GenomeStore.getGenomeLength();
	var visible_genome = GenomeStore.getVisible()


	if (!PlotStore.isPlotActive(plotName)) {
		// console.log('PLOT NOT ACTIVE')
		return;
	}
	var plotYvalues = PlotStore.getPlotYvalues(plotName)
	var maximumYvalue = PlotStore.getPlotMaxY('recombGraph')
	var y_scale_multiplier = parseFloat( canvas.height / maximumYvalue )
	// console.log("in plot object, got len: ",plotYvalues.length," and max Y: ",maximumYvalue)

	// clearCanvas(canvas);
	// draw
	context.save();
	context.strokeStyle=colour;
	context.lineWidth=1;
	context.beginPath();
	context.moveTo(0,canvas.height);
	// crawl across the x axis by pixel :)
	for (var x=1; x<=canvas.width; x++) {
		var genome_x = parseInt( visible_genome[0] + (x / canvas.width)*(visible_genome[1] - visible_genome[0]) )
		var y = canvas.height - (plotYvalues[genome_x] * y_scale_multiplier)
		context.lineTo(x, y )
		// console.log("pixel x: ",x," genome x: ", genome_x," genome y: ",plotYvalues[genome_x]," pixel y: ",y)
	}
	context.stroke();
	context.restore();
}




function drawAxis(canvas,context,plotName) {
	var myState = this;
	var maximumYvalue = PlotStore.getPlotMaxY(plotName);
	console.log('maximumYvalue',maximumYvalue)
	var y_scale_multiplier = parseFloat( canvas.height / maximumYvalue ); //double up!
	this.drawTicks = function(canvas,context,vals,tickLengthPx,valsArePerc) {
		if (valsArePerc) {
			for (var i=0; i<vals.length;i++) {
				vals[i] = canvas.height*(1- (100-vals[i])/100 )
			}
		}
		// we are starting at 0,0 (i.e. TOP LEFT)
		context.beginPath();
		context.moveTo(0,0);
		for (var i=0; i<vals.length; i++) {
			context.lineTo(0,vals[i])
			context.lineTo(tickLengthPx,vals[i])
			context.lineTo(0,vals[i])
		}
		context.stroke();
	}
	this.getYPixelValsForGivenVals = function(vals) {
		// N.B. these are measured from the top!!!!
		ret = [];
		for (var i=0; i<vals.length; i++) {
			ret.push(canvas.height - (vals[i] * y_scale_multiplier));
		}
		return ret;
	}
	this.drawDottedLine = function(yValPx) {
		context.save();
		context.strokeStyle = 'red';
		context.setLineDash([5,10]);
		context.beginPath();
		context.moveTo(0,yValPx);
		context.lineTo(canvas.width,yValPx);
		context.stroke();
		context.restore();
	}
	context.save();
	context.beginPath();
	context.moveTo(canvas.width,canvas.height);
	context.lineTo(0,canvas.height) // bottom line :)
	context.lineTo(0,0) // left hand axis (now at top left)
	context.stroke();
	context.restore();

	if (plotName==='GWAS') {
		this.drawDottedLine(getYPixelValsForGivenVals([5])[0])
	}
	else if (RawDataStore.getGenomicDatasetType()==='roary') {
		this.drawDottedLine(parseInt(canvas.height*.25))
		this.drawDottedLine(parseInt(canvas.height*.05))
	}

	// some text :)
	context.save();
	context.fillStyle = "black";
	context.textBaseline="middle";
	context.textAlign = "left";
	context.font="12px Helvetica";
	if (plotName==='GWAS'){
		var yVals = Array.apply(0, Array(Math.floor(maximumYvalue))).map(function(_,b) { return b + 1; })
		var yValsPx = this.getYPixelValsForGivenVals(yVals)
		this.drawTicks(canvas,context,yValsPx,5,false);
		for (var i=0; i<yVals.length; i++) {
			context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i]));
		}
	}
	else {
		if (RawDataStore.getGenomicDatasetType()==='gubbins') {
			var numTicks = 4;
			var yVals = Array.apply(0, Array(numTicks)).map(function(_,b) { return Math.floor(maximumYvalue * (b + 1)/numTicks); })
			var yValsPx = this.getYPixelValsForGivenVals(yVals)
			this.drawTicks(canvas,context,yValsPx,5,false);
			for (var i=0; i<yVals.length; i++) {
				context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i]));
			}
		}
		else { // R O A R Y
			this.drawTicks(canvas,context,[100,75,50,25],5,true);
			context.fillText('100%' , 5, 5);
			context.fillText('75%' , 5, parseInt(canvas.height*.25));
			context.fillText('50%' , 5, parseInt(canvas.height*.5));
			context.fillText('25%' , 5, parseInt(canvas.height*.75));
		}
	}
	context.restore();
}

function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}





module.exports = plotter;

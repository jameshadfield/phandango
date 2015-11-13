var Actions = require('../../actions/actions.js')
// this, at the moment, is for GWAS plots (CHR	SNP	BP	-log_10(p)	R^2)

function Circle(featurex, featurey, val1, val2){
	this.fill = '#AAAAAA';
	this.stroke = 'black';
	this.strokeWidth = 1;
	this.featurex=featurex;
	this.featurey=featurey;
	this.x = undefined;
	this.y = undefined;
	this.r = undefined;
	this.rSquared = val1;
	this.selected = false;
	if (val1>0.8){
		this.fill = '#FF0000';
	}
	else if (val1>0.6){
		this.fill = '#FFA500';
	}
	else if (val1>0.4){
		this.fill = '#32CD32';
	}
	else if (val1>0.2){
		this.fill = '#87CEFA';
	}
	else if (val1>=0){
		this.fill = '#0000FF';
	}
};

// Sets the x and w of the block feature
// Circle.prototype.set_wxy = function(maxy) {
// 	this.x=xscalingfactor*(this.featurex-start)+canvasstart;
// 	this.w=xscalingfactor*30.0;
// 	if (this.w>5){
// 		this.w=5;
// 	}
// 	if (this.w<1){
// 		this.w=1;
// 	}
// 	this.y=canvas.height-(((this.featurey/maxy)*(GWAS_track_height-6))+6)
// }

// Draws this circle to a given context
Circle.prototype.draw = function(ctx) {
	ctx.fillStyle = this.fill;
	ctx.strokeStyle = this.stroke;
	ctx.lineWidth = this.strokeWidth;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	if (this.selected){
		ctx.stroke();
	}
	ctx.fill();
	ctx.save();
	if (this.selected) {
		ctx.save();
		ctx.fillStyle = "black";
		ctx.textBaseline="middle";
		ctx.textAlign = "center";
		ctx.font="12px Helvetica";
		var text = "-log10(p)="+this.featurey.toFixed(2).toString()+" R^2="+this.rSquared.toFixed(2).toString();
		ctx.fillText(text, this.x, this.y-this.r*4 < 15 ? this.y+this.r*4 : this.y-this.r*4);
		ctx.restore();
	}
}


// merge this into an axis.js file // import it from blocks.js
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
}



// Parse .plot file and return an array of circles and a max length (should we even use this? I think not...)

function parser(stringIn) {
	var lines = stringIn.split("\n");
	var circles = [];
	var data_end = 0;
	var yValues = [];
	for (var i=0; i<lines.length; i++){
		var words=lines[i].split("\t");
		// words: CHR	SNP	BP	-log_10(p)	R^2
		//			0	1	2		3		4
		if (!isNaN(parseFloat(words[3], 10))){
			if (parseFloat(words[2])>data_end){
				data_end=parseFloat(words[2]);
			}
			yValues.push(parseFloat(words[3]));
			circles.push(new Circle(parseFloat(words[2]),parseFloat(words[3]), parseFloat(words[4]), parseFloat(words[5])));
		}
	}
	Actions.save_plotYvalues(yValues, "GWAS")
	return circles;
}

module.exports = parser;

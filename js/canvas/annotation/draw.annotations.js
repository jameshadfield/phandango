var parser = require('./parse.annotations.js');


function clearCanvas(canvas) {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawArrows(context, arrows) {
	for (var i=0; i<arrows.length; i++) {
		context.fillStyle = arrows[i].fill;
		context.strokeStyle = arrows[i].stroke;
		context.lineWidth = arrows[i].strokeWidth;
		context.beginPath()

		for (var j=0; j<arrows[i].coordinates.length; j++) {
			context.lineTo(arrows[i].coordinates[j][0], arrows[i].coordinates[j][1])
		}


		context.closePath();
		context.fill();

	}

}

function drawBorderAndText(context, arrow, middleCanvasWidth, scaleYvalue) {
	context.strokeStyle = '#CC302E';
	context.lineWidth = 2;

	context.beginPath();
	context.moveTo(arrow.coordinates[0][0], arrow.coordinates[0][1]);
	for (var j = 0; j < arrow.coordinates.length; j++) {
		context.lineTo(arrow.coordinates[j][0], arrow.coordinates[j][1]);
	}
	context.closePath();
	context.stroke();
	// TEXT
	context.fillStyle = "black";
	context.textBaseline="middle";
	context.textAlign = "center";
	context.font="12px Helvetica";
	var text = arrow.locus_tag+" // "+arrow.product;
	context.fillText(text, middleCanvasWidth, scaleYvalue-40);
	// context.fillText(arrow.ID, arrow.x+(arrow.w/2), scaleYvalue-69);
	// context.fillText(arrow.locus_tag, arrow.x+(arrow.w/2), scaleYvalue-52);
	// context.fillText(arrow.product, arrow.x+(arrow.w/2), scaleYvalue-35);

}


function get_arrows_in_scope(arrows, visible_genome, canvas) {
	var canvas_width = canvas.width;
	var arrows_in_scope = []
	var middle_height = parseInt(canvas.height/2);
	var gap_to_arrows = 10;
	for (var i=0; i<arrows.length; i++) {
		if (arrows[i].featurestart > visible_genome[1] || arrows[i].featureend < visible_genome[0]) {
			// ignore
		}
		else {
			arrows_in_scope.push( arrows[i] )
		}
	}
	for (var i=0; i<arrows_in_scope.length; i++) {
		arrows_in_scope[i].x = (arrows_in_scope[i].featurestart - visible_genome[0]) / (visible_genome[1] - visible_genome[0]) * canvas_width;
		arrows_in_scope[i].w = (arrows_in_scope[i].featureend - arrows_in_scope[i].featurestart) / (visible_genome[1] - visible_genome[0]) * canvas_width;
		var arrowtype = "rectangle"
		// arrows_in_scope[i].y  is the value of the minimum y, and .h will be added to this (.h>0)
		if (arrows_in_scope[i].direction=="+") {
			arrows_in_scope[i].y = middle_height - (arrows_in_scope[i].h + gap_to_arrows)
		}
		else if (arrows_in_scope[i].direction=="-") {
			arrows_in_scope[i].y = middle_height + gap_to_arrows
		}
		else {
			arrows_in_scope[i].y = middle_height - arrows_in_scope[i].y/2
		}
		arrows_in_scope[i].coordinates = []
		arrows_in_scope[i].coordinates.push([arrows_in_scope[i].x, arrows_in_scope[i].y]);
		arrows_in_scope[i].coordinates.push([arrows_in_scope[i].x, arrows_in_scope[i].y+arrows_in_scope[i].h]);
		arrows_in_scope[i].coordinates.push([arrows_in_scope[i].x+arrows_in_scope[i].w, arrows_in_scope[i].y+arrows_in_scope[i].h]);
		arrows_in_scope[i].coordinates.push([arrows_in_scope[i].x+arrows_in_scope[i].w, arrows_in_scope[i].y]);
	}
	return arrows_in_scope;
}


function drawScale(context, canvas_width, visible_genome, scaleYvalue, numticks) {
	// console.log(context)
	context.strokeStyle="black";
	context.lineWidth=1;
	// draw the horisontal line
	context.beginPath();
	context.moveTo(0, scaleYvalue);
	// console.log("context.lineTo("+canvas_width+","+scaleYvalue+")")

	context.lineTo(canvas_width, scaleYvalue);
	context.stroke();


	// draw the tick marks
	var numticks = numticks || 6;
	var tickDistancePixels=parseInt(canvas_width/(numticks-1));
	var tickDistanceBases =parseInt((visible_genome[1]-visible_genome[0])/(numticks-1));
	for(var ticknum= 0; ticknum < numticks; ticknum++){
		var tickpos=tickDistancePixels*ticknum;
		var tickval=visible_genome[0]+tickDistanceBases*ticknum;
		var roundto=2
		// measured in megabases?
		if (tickval>=1000000) {
			tickval=tickval/1000000
			tickval=String(+ tickval.toFixed(roundto))+"Mb";
			}
		// kb?
		else if (tickval>=1000) {
			tickval=tickval/1000
			tickval=String(+ tickval.toFixed(2))+"kb";
			}
		// bp?
		else {
			tickval=String(+ tickval.toFixed(2))+"bp";
			}
		// console.log("tick position: "+tickpos+" tick value "+tickval)
		context.beginPath();
		context.moveTo(tickpos, scaleYvalue);
		context.lineTo(tickpos, scaleYvalue+10);
		context.stroke();
		context.save();
		context.translate(tickpos, scaleYvalue+10 );
		context.fillStyle = "black";
		context.textBaseline="middle";
		context.textAlign = "left";
		context.rotate(Math.PI*0.5);
		context.font="12px Helvetica";
		context.fillText(tickval, 0, 0);
		context.restore();

	}
}

module.exports = {'drawArrows': drawArrows, 'get_arrows_in_scope': get_arrows_in_scope, 'clearCanvas': clearCanvas, 'drawScale': drawScale, 'drawBorderAndText': drawBorderAndText};

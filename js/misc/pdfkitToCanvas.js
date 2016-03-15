

if (!CanvasRenderingContext2D.prototype.fillColor) {
	CanvasRenderingContext2D.prototype.fillColor = function(colour) { 
		return	this.fillStyle = colour;
	};
}

if (!CanvasRenderingContext2D.prototype.strokeColor) {
	CanvasRenderingContext2D.prototype.strokeColor = function(colour) { 
		return	this.strokeStyle = colour;
	};
}



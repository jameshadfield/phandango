var Actions = require('../../actions/actions.js');



mouse_moves = function(canvas) {
	var myState = this;

	canvas.addEventListener('mousedown', function(e) {
		// console.log("MOUSE DOWN")
		var mouse = myState.getMouse(e, canvas);
		Actions.click(canvas.id, mouse.x, mouse.y);
	}, true);

}


mouse_moves.prototype.getMouse = function(e, canvas) {
	// console.log("getting mouse")
	// console.log(e)
	var element = canvas, offsetX = 0, offsetY = 0, mx, my;
	// console.log(element)
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	// TO DO
	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	// offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	// offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	// We return a simple javascript object (a hash) with x and y defined
	// console.log("got mouse position x: "+mx+" y: "+my)

	// draw green dot on mouse hit
	// ctx = canvas.getContext('2d');
	// ctx.beginPath();
 //    ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
 //    ctx.fillStyle = 'green';
 //    ctx.fill();
 //    ctx.closePath();
	return {x: mx, y: my};
}


module.exports = mouse_moves;

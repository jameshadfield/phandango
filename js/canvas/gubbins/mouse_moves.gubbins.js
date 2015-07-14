// time to attach listeners to the gubbins canvas
var Actions = require('../../actions/actions.js')

mouse_moves = function(canvas) {
	var myState = this;
	this.dragging = false

	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	canvas.addEventListener('mousedown', function(e) {
		// console.log("MOUSE DOWN")
	    var dragStart = e.clientX; // relative to window, not canvas!
	    var mouse = myState.getMouse(e, canvas);
	    // mx and my are in pixels relative to the canvas
		var mx = mouse.x;
		var my = mouse.y;

		myState.dragoffx = mx;
		myState.dragoffy = my;
		myState.dragging = true;
	}, true);

	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener ("mouseout", function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener('mousemove', function(e) {
		if (myState.dragging){
			// console.log("DRAGGING")
			var mouse = myState.getMouse(e, canvas);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			var mx = mouse.x;
			var my = mouse.y;
			var dragOffsetx = mx - myState.dragoffx;
			var dragOffsety = my - myState.dragoffy;

			// only go further if we're dragging more than 3 pixels!
			// if (dragOffsetx>3) {return}

			// we modify the genome store
			// all we have to tell it is what % of the viewport (the canvas)
			// we've just moved, and it will scale accordingly

			Actions.genome_pan(-dragOffsetx / canvas.width);
			// WHY IS THE FOLLOWING NECESSARY????
			Actions.phylocanvas_changed();


			// var length=myState.end-myState.start

			// var dragproportionx=(dragOffsetx/canvaslength)*length // the fraction of the canvas moved by the mouse in this capture scaled by the length of the observed region (in genome co-ords)
			// so in otherwords, the number of bases to shift things!

			// console.log("moved "+dragOffsetx+" "+dragOffsety+" dragproportionx: "+dragproportionx)
			// myState.start=(myState.start-dragproportionx);
			// myState.end=(myState.end-dragproportionx);


			// if (((myState.start-dragproportionx)>0) && ((myState.end-dragproportionx)<genomelength)) {
			// 	// console.log("111")
			// 	myState.start=(myState.start-dragproportionx);
			// 	myState.end=(myState.end-dragproportionx);
			// }
			// else if ((myState.end-dragproportionx)<genomelength) {
			// 	// console.log("222")
			// 	myState.start=0;
			// 	myState.end=myState.start+length;
			// }
			// else if ((myState.start-dragproportionx)>0) {
			// 	// console.log("333")
			// 	myState.end=genomelength;
			// 	myState.start=myState.end-length;
			// }
		    myState.dragoffx = mx;
			myState.dragoffy = my;

			// myState.somethings_changed = true // Something's dragging so we must redraw
			return;
		}
	}, true);

	canvas.addEventListener ("mousewheel", function(e) {
		e.preventDefault();
		var mouse = myState.getMouse(e, canvas);
		var mx = mouse.x;
		var my = mouse.y;
	    var mousex = mx - canvas.offsetLeft;
	    var mousey = my - canvas.offsetTop;
		var delta = 0; // 1 || -1. 1: zoom in
		var scale = 1;
        if (e.wheelDelta) { /* IE/Opera. */
                delta = e.wheelDelta/120;
        }
        else if (e.detail) { /** Mozilla case. */
                delta = -e.detail/3;
        }
        delta = delta>0 ? 1 : -1;

		// console.log('delta '+delta+' mx '+mx+' canvas.width '+canvas.width+' frac '+mx/canvas.width)

		Actions.genome_zoom(delta, mx/canvas.width);
		// WHY IS THE FOLLOWING NECESSARY????
		Actions.phylocanvas_changed();

	}, false);

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
	ctx = canvas.getContext('2d');
	ctx.beginPath();
    ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
	return {x: mx, y: my};
}




module.exports = mouse_moves;

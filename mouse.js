// james hadfield / simon harris / WTSI

function interaction(canvas) {
	// mouse events e.t.c.
	// changes the internal variable xcalefactor
	var myState = this;

	canvas.width = window.innerWidth-30;
	canvas.height = window.innerHeight-30;

	if (canvas.width>1000){
		myState.canvasstart=20
		myState.canvasend=canvas.width-20
	}
	else {
		myState.canvasstart=canvas.width/50
		myState.canvasend=canvas.width-(canvas.width/50)
	}
	var genomelength=3000000
	var canvaslength=myState.canvasend-myState.canvasstart
	var scale=1
	myState.start=0
	myState.end=genomelength
	this.xscalingfactor=canvaslength/(myState.end-myState.start)
	this.dragging = false
	this.dragoffx = 0; // See mousedown and mousemove events for explanation
	this.dragoffy = 0;


	myState.somethings_changed = false
	this.width = canvas.width;
	this.height = canvas.height;
	if (document.defaultView && document.defaultView.getComputedStyle) {
	this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
	this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
	this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
	this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
	}
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	this.html = document.body.parentNode;
	this.htmlTop = this.html.offsetTop;
	this.htmlLeft = this.html.offsetLeft;

	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);


	canvas.addEventListener('mousedown', function(e) {
	    vardragStart = e.clientX;
	    var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var ctrlPressed=0;
		var altPressed=0;
		var shiftPressed=0;

		if (parseInt(navigator.appVersion)>3) {

			var evt = e ? e:window.event;

		   shiftPressed=evt.shiftKey;
		   altPressed  =evt.altKey;
		   ctrlPressed =evt.ctrlKey;
		   self.status=""+  "shiftKey="+shiftPressed+", altKey="  +altPressed+", ctrlKey=" +ctrlPressed

		}


		// var arrows = myState.arrows;
		// myState.dragoffx = mx;
		// myState.dragoffy = my;
		// myState.dragging = true;
		// var l = arrows.length;
		// for (var i = l-1; i >= 0; i--) {
		// 	var mySel = arrows[i];
		// 	if (arrows[i].contains(mx, my)) {
		// 		// Keep track of where in the object we clicked
		// 		// so we can move it smoothly (see mousemove)
		// 		if (shiftPressed){

		// 			var myindex=myState.selection.contains(mySel)

		// 			if (myindex>-1){
		// 				myState.selection.splice(myindex, 1);
		// 			}
		// 			else{
		// 				myState.selection.push(mySel);
		// 			}
		// 		}
		// 		else{
		// 			myState.selection = [mySel];
		// 		}
		// 		myState.valid = false;
		// 		return;
		// 	}
		// }


		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		// if (myState.selection.length>0) {
		// 	myState.selection = [];

		// 	myState.valid = false; // Need to clear the old selection border
		// }
	}, true);


	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);


	canvas.addEventListener ("mouseout", function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener('mousemove', function(e) {
		if (myState.dragging){
			var mouse = myState.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			var mx = mouse.x;
			var my = mouse.y;
			var dragOffsetx = mx - myState.dragoffx;
			var dragOffsety = my - myState.dragoffy;

			var length=myState.end-myState.start

			var dragproportionx=(dragOffsetx/canvaslength)*length

			if (((myState.start-dragproportionx)>0) && ((end-dragproportionx)<genomelength)) {
				myState.start=(myState.start-dragproportionx);
				myState.end=(myState.end-dragproportionx);
			}
			else if ((end-dragproportionx)<genomelength) {
				myState.start=0;
				myState.end=myState.start+length;
			}
			else if ((myState.start-dragproportionx)>0) {
				myState.end=genomelength;
				myState.start=myState.end-length;
			}
		    myState.dragoffx = mx;
			myState.dragoffy = my;

			myState.somethings_changed = true // Something's dragging so we must redraw
			return;
		}
	}, true);


	function MouseScroll (e) {

		e.preventDefault();
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
	    var mousex = mx - canvas.offsetLeft;
	    var mousey = my - canvas.offsetTop;

		var delta = 0;


        if (!e){ /* For IE. */
            e = window.event;
        }
        if (e.wheelDelta) { /* IE/Opera. */
                delta = e.wheelDelta/120;
        }
        else if (e.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = -e.detail/3;
        }

		if (delta>0){
			delta=1;
		}
		else{
			delta=-1;
		}

	    var zoom = 1 + delta/2;
	    if (delta>0) {
	    	scale-=scale/2;
	    }
	    else if (delta<0) {
	    	scale+=scale;
	    }

		if (scale>1)	{
			scale=1
		}
		else if (scale*genomelength<500)	{
			scale=500/genomelength
		}

		if (mousex<myState.canvasstart){
			mousex=myState.canvasstart;
		}
		else if (mousex>myState.canvasend){
			mousex=myState.canvasend;
		}
		mousex-=myState.canvasstart;

		var mouse_proportion_of_canvas=(mousex/canvaslength)
		var unzoomed_length=myState.end-myState.start
	    var mouse_genome_position=(mouse_proportion_of_canvas*unzoomed_length)+myState.start;

	    var zoomed_length=genomelength*scale;

	    myState.start=mouse_genome_position-(zoomed_length*mouse_proportion_of_canvas);

		myState.end=mouse_genome_position+(zoomed_length*(1-mouse_proportion_of_canvas));

		if (myState.start<0){
			myState.start=0;
			myState.end=zoomed_length;
		}
		else if (myState.end>genomelength){
			myState.end=genomelength;
			myState.start=myState.end-zoomed_length;
		}

	    myState.xscalingfactor=canvaslength/(myState.end-myState.start)
	    console.log("xscalingfactor: "+myState.xscalingfactor)
		myState.somethings_changed = true

	}

	if (canvas.addEventListener) {    // all browsers except IE before version 9
               // Internet Explorer, Opera, Google Chrome and Safari
           canvas.addEventListener ("mousewheel", MouseScroll, false);
               // Firefox
           canvas.addEventListener ("DOMMouseScroll", MouseScroll, false);
    }
    else {
        if (canvas.attachEvent) { // IE before version 9
            canvas.attachEvent ("onmousewheel", MouseScroll, false);
        }
    }


} // end of interaction() definition

interaction.prototype.getMouse = function(e) {
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
	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	// We return a simple javascript object (a hash) with x and y defined
	console.log("got mouse position x: "+mx+" y: "+my)
	return {x: mx, y: my};
}


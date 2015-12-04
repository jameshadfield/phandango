// time to attach listeners to the gubbins canvas
const Actions = require('../actions/actions.js');

function MouseMoves(canvas) {
  const myState = this;
  this.dragging = false;
  this.zooming = false;

  canvas.addEventListener('selectstart', function (e) {
    e.preventDefault(); return false;
  }, false);

  canvas.addEventListener('mousedown', function (e) {
    // console.log("MOUSE DOWN")
      // var dragStart = e.clientX; // relative to window, not canvas!
    const mouse = myState.getMouse(e, canvas);
      // mouse.x and mouse.y are in pixels relative to the canvas
    myState.clickPositionX = mouse.x; // used to work out if a click should be fired
    myState.dragoffx = mouse.x; // constantly updated under mousemove
    myState.dragoffy = mouse.y;
    myState.dragging = true;
  }, true);

  canvas.addEventListener('mouseup', function (e) {
    myState.dragging = false;
    // how far have we moved? if it's within delta (i.e. )
    // then consider it not to be a drag event (even tho it may have dragged)
    const mouse = myState.getMouse(e, canvas);
    // console.log("original x: "+myState.clickPositionX+" now: "+mouse.x)
    if (Math.abs(mouse.x - myState.clickPositionX) < 5) {
      Actions.click(canvas.id, mouse.x, mouse.y);
    }
    // console.log("UP")
  }, true);

  canvas.addEventListener('mouseout', function () {
    myState.dragging = false;
  }, true);

  canvas.addEventListener('mousemove', function (e) {
    if (myState.dragging) {
      // console.log("DRAGGING")
      const mouse = myState.getMouse(e, canvas);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      const mx = mouse.x;
      const my = mouse.y;
      const dragOffsetx = mx - myState.dragoffx;
      // var dragOffsety = my - myState.dragoffy;

      // only go further if we're dragging more than 3 pixels!
      // if (dragOffsetx<3) {return} // DOESN'T WORK!

      // we modify the genome store
      // all we have to tell it is what % of the viewport (the canvas)
      // we've just moved, and it will scale accordingly

      Actions.genome_pan(-dragOffsetx / canvas.width);
      // WHY IS THE FOLLOWING NECESSARY????
      Actions.phylocanvas_changed();


      // var length=myState.end-myState.start

      // var dragproportionx=(dragOffsetx/canvaslength)*length
      // the fraction of the canvas moved by the mouse in this capture
      // scaled by the length of the observed region (in genome co-ords)
      // so in otherwords, the number of bases to shift things!

      // console.log("moved "+dragOffsetx+" "+dragOffsety+" dragproportionx: "+dragproportionx)
      // myState.start=(myState.start-dragproportionx);
      // myState.end=(myState.end-dragproportionx);


      // if (((myState.start-dragproportionx)>0) && ((myState.end-dragproportionx)<genomelength)) {
      //   // console.log("111")
      //   myState.start=(myState.start-dragproportionx);
      //   myState.end=(myState.end-dragproportionx);
      // }
      // else if ((myState.end-dragproportionx)<genomelength) {
      //   // console.log("222")
      //   myState.start=0;
      //   myState.end=myState.start+length;
      // }
      // else if ((myState.start-dragproportionx)>0) {
      //   // console.log("333")
      //   myState.end=genomelength;
      //   myState.start=myState.end-length;
      // }
      myState.dragoffx = mx;
      myState.dragoffy = my;

      // myState.somethings_changed = true // Something's dragging so we must redraw
      return;
    }
  }, true);

  canvas.addEventListener('mousewheel', function (e) {
    e.preventDefault();
    if (myState.zooming) return;
    const mouse = myState.getMouse(e, canvas);
    const mx = mouse.x;
    // const my = mouse.y;
    // var mousex = mx - canvas.offsetLeft;
    // var mousey = my - canvas.offsetTop;
    let delta = 0; // 1 || -1. 1: zoom in
    if (e.wheelDelta) { /* IE/Opera. */
      delta = e.wheelDelta / 120;
    } else if (e.detail) { /** Mozilla case. */
      delta = -e.detail / 3;
    }
    delta = delta > 0 ? 1 : -1;
    myState.zooming = true;
    Actions.genome_zoom(delta, mx / canvas.width);
    // WHY IS THE FOLLOWING NECESSARY????
    Actions.phylocanvas_changed();

    // change this timeout function to change the responsiveness of the zoom. The timeout is here to stop trackpad movements being impossible to control.
    setTimeout(function () {
      myState.zooming = false;
    }, 40);
  }, false);
}

MouseMoves.prototype.getMouse = function (e, canvas) {
  let element = canvas;
  let offsetX = 0;
  let offsetY = 0;
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do { // eslint-disable-line no-cond-assign
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // TO DO
  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  const mx = e.pageX - offsetX;
  const my = e.pageY - offsetY;
  // We return a simple javascript object (a hash) with x and y defined
  // console.log("got mouse position x: "+mx+" y: "+my)

  // draw green dot on mouse hit
  // var ctx = canvas.getContext('2d');
  // ctx.beginPath();
 //    ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
 //    ctx.fillStyle = 'green';
 //    ctx.fill();
 //    ctx.closePath();
  return { x: mx, y: my };
};

module.exports = MouseMoves;

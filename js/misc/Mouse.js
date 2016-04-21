// time to attach listeners to the gubbins canvas
import { genomePan, genomeZoom } from '../actions/movement';

export function Mouse(canvas, dispatch, onClickCallback, smallGenome = false) {
  const myState = this;
  this.dragging = false;
  this.zooming = false;
  this.debounceTimer = null;
  this.shouldZoom = true;

  this.debounce = function (time = 100) {
    this.shouldZoom = false;
    // clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.shouldZoom = true, time);
  };

  canvas.addEventListener('selectstart', function (e) {
    e.preventDefault(); return false;
  }, false);

  canvas.addEventListener('mousedown', function (e) {
    const mouse = myState.getMouse(e, canvas);
    // mouse.x and mouse.y are in pixels relative to the canvas
    myState.clickPositionX = mouse.x; // used to work out if a click should be fired
    myState.dragoffx = mouse.x; // constantly updated under mousemove
    myState.dragoffy = mouse.y;
    myState.dragging = true;
  }, true);

  canvas.addEventListener('mouseup', function (e) {
    myState.dragging = false;
    // how far have we moved? if move is within delta
    // then consider it not to be a drag event
    const mouse = myState.getMouse(e, canvas);
    if (Math.abs(mouse.x - myState.clickPositionX) < 5) {
      onClickCallback(mouse.x, mouse.y);
    }
  }, true);

  canvas.addEventListener('mouseout', function () {
    myState.dragging = false;
  }, true);

  canvas.addEventListener('mousemove', function (e) {
    myState.getMouse(e, canvas);
    if (myState.dragging) {
      const mouse = myState.getMouse(e, canvas);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      const mx = mouse.x;
      const my = mouse.y;
      const dragOffsetx = mx - myState.dragoffx;
      if (smallGenome) {
        dispatch(genomePan(dragOffsetx / (canvas.width - 20), true));
      } else {
        dispatch(genomePan(-dragOffsetx / canvas.width));
      }
      myState.dragoffx = mx;
      myState.dragoffy = my;
      return;
    }
  }, true);

  var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  
  canvas.addEventListener(mousewheelevt, function (e) {
    e.preventDefault();
    if (myState.zooming) return;
    const mouse = myState.getMouse(e, canvas);
    const mx = mouse.x;
    // const my = mouse.y;
    // var mousex = mx - canvas.offsetLeft;
    // var mousey = my - canvas.offsetTop;
    // let delta = 0; // 1 || -1. 1: zoom in
    // if (e.wheelDelta) { /* IE/Opera. */
    //   delta = e.wheelDelta / 120;
    // } else if (e.detail) { /** Mozilla case. */
    //   delta = -e.detail / 3;
    // }
    // // console.log('zooming! original mouse delta:', delta, 'e:', e);
    // delta = delta > 0 ? 1 : -1; // 1: zoom in, -1: out
    const delta = normalizeMousewheel(e);
    // console.log('delta:', delta);
    myState.zooming = true;

    if (myState.shouldZoom) {
      if (smallGenome) {
        dispatch(genomeZoom(delta, 0.5)); /* always zoom into center of visible */
      } else {
        dispatch(genomeZoom(delta, mx / canvas.width));
      }
    }
    myState.debounce(30); // modify myState.shouldZoom on a bounce timer
    myState.zooming = false;
  }, false);
}


// http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
function normalizeMousewheel(e) {
  let d = e.detail;
  let w = e.wheelDelta;
  const n = 225;
  const n1 = n - 1;

  // Normalize delta
  const f = w / d;
  d = d ? w ? d / f : -d / 1.35 : w / 120;
  // Quadratic scale if |d| > 1
  d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;
  // Delta *should* not be greater than 2...
  return (Math.min(Math.max(d / 2, -1), 1));
}


export function getMouse(e, canvas, deebug = false) {
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
  const mx = e.pageX - offsetX;
  const my = e.pageY - offsetY;

  if (deebug) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }
  return { x: mx, y: my, fixedY: e.pageY, fixedX: e.pageX };
}

Mouse.prototype.getMouse = getMouse;

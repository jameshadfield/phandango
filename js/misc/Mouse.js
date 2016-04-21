// time to attach listeners to the gubbins canvas
import { genomePan, genomeZoom } from '../actions/movement';

export function Mouse(canvas, dispatch, onClickCallback, smallGenome = false) {
  const myState = this;
  this.dragging = false;
  this.zooming = false;

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
    // console.log('zooming! original mouse delta:', delta, 'e:', e);
    delta = delta > 0 ? 1 : -1; // 1: zoom in, -1: out
    myState.zooming = true;
    if (smallGenome) {
      dispatch(genomeZoom(delta, 0.5)); /* always zoom into center of visible */
    } else {
      dispatch(genomeZoom(delta, mx / canvas.width));
    }
    myState.zooming = false;
  }, false);
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

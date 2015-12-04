const Actions = require('../actions/actions.js');
const ReactDOM = require('react-dom');


function rescaleCanvases() {
  // console.log('RESIZE DETECTED');
  const canvases = document.getElementsByTagName('canvas');
  for (let i = canvases.length - 1; i >= 0; i--) {
    const width = canvases[i].clientWidth;
    const height = canvases[i].clientHeight;
    if (canvases[i].width !== width || canvases[i].height !== height) {
      // Change the size of the canvas to match the size it's being displayed
      canvases[i].width = width;
      canvases[i].height = height;
      // console.log('\t', canvases[i].id, ' resized');
    }
  }
  // now we need to redraw the canvas
  // hack: fake a phylocanvas change --> cause a redraw nearly everywhere
  Actions.phylocanvas_changed();
  // phylocanvas.fitInPanel();
}

// the CSS scales the canvas, but we have to set the correct width and height here as well, and this must be updated upon resizes (and then a redraw triggered)
function initCanvasXY(myState) {
  ReactDOM.findDOMNode(myState).setAttribute('width', window.getComputedStyle(ReactDOM.findDOMNode(myState)).width);
  ReactDOM.findDOMNode(myState).setAttribute('height', window.getComputedStyle(ReactDOM.findDOMNode(myState)).height);
}

module.exports = {
  rescaleCanvases: rescaleCanvases,
  initCanvasXY: initCanvasXY,
};

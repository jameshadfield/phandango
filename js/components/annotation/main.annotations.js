const draw = require('./draw.annotations.js');
const GenomeStore = require('../../stores/genome.js');
const MouseMoves = require('../mouse_moves.js');
const RegionSelectedStore = require('../../stores/RegionSelectedStore.js');
const MiscStore = require('../../stores/misc.Store.js');
const RawDataStore = require('../../stores/RawDataStore.js');

var x;

function annotationTrack(canvas) {
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  const myState = this;
  this.mouseMoves = new MouseMoves(canvas); // set up listeners
  // var arrows = undefined;
  this.currently_selected = undefined;

  window.addEventListener('resize', function () {myState.redraw();}, true);

  this.loadRawData = function () {
    myState.arrows =  RawDataStore.getParsedData('annotation');
    myState.scaleType = RawDataStore.getGenomicDatasetType() === 'gubbins' ? 'bp' : 'num';
    myState.currently_selected =  undefined;
    myState.redraw();
  };

  this.redraw = function () {
    // is anything loaded (else we can't redraw!)
    if (myState.arrows === undefined) {
      return;
    }
    // trim_blocks() will limit blocks to our viewport and also associate the x and y values in pixels
    const visibleGenome = GenomeStore.getVisible();
    // console.log(arrows)
    const currentArrows = draw.getArrowsInScope(myState.arrows, visibleGenome, myState.canvas);
    // console.log(currentArrows)
    // console.log("DRAW ANNOTATION")
    draw.clearCanvas(myState.canvas);
    draw.drawArrows(myState.context, currentArrows, visibleGenome[1] - visibleGenome[0] < 100000);
    draw.drawScale(myState.context, myState.canvas.width, visibleGenome, parseInt(myState.canvas.height / 2, 10));
    if (myState.currently_selected !== undefined) {
      if (draw.getArrowsInScope([ myState.currently_selected ], visibleGenome, myState.canvas).length > 0) {
        draw.drawBorderAndText(myState.context, myState.currently_selected, parseInt(myState.canvas.width / 2, 10), parseInt(myState.canvas.height / 2, 10));
      }
    }
  };

  this.checkForClick = function () {
    if (RegionSelectedStore.getID() !== canvas.id) {
      return;
    }
    const mouse = RegionSelectedStore.getClickXY();
    const visibleGenome = GenomeStore.getVisible();
    const currentArrows = draw.getArrowsInScope(myState.arrows, visibleGenome, myState.canvas);
    for (let i = 0; i < currentArrows.length; i++) {
      if (
        mouse[0] >= currentArrows[i].x &&
        mouse[0] <= (currentArrows[i].x + currentArrows[i].w) &&
        mouse[1] >= currentArrows[i].y &&
        mouse[1] <= (currentArrows[i].y + currentArrows[i].h)
        ) {
        myState.currently_selected = currentArrows[i];
        myState.redraw();
        // draw.drawBorderAndText(myState.context, currentArrows[i], parseInt(myState.canvas.width/2), parseInt(myState.canvas.height/2));
        // console.log(currentArrows[i]);
        return;
      }
    }
    // nothing selected! (fallthrough)
    myState.currently_selected =  undefined;
    myState.redraw();
  };

  // whenever the Taxa_locations store changes (e.g. someones done something to the tree)
  // we should re-draw. umm no, we shouldnt
  // Taxa_Locations.addChangeListener(this.redraw);

  // likewise, whenever anybody changes the genome-position of the viewport, we should re-draw
  GenomeStore.addChangeListener(this.redraw);

  RegionSelectedStore.addChangeListener(this.checkForClick);

  MiscStore.addChangeListener(this.redraw);

  RawDataStore.addChangeListener(this.loadRawData);

  this.loadRawData();
}

module.exports = annotationTrack;

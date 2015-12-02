const MouseMoves = require('../../components/mouse_moves.js');
const GenomeStore = require('../../stores/genome.js');
const MiscStore = require('../../stores/misc.Store.js');

function smallGenome(canvas) {
  this.canvas = canvas;
  const myState = this;
  this.mouseMoves = new MouseMoves(canvas); // set up listeners
  window.addEventListener('resize', function () {myState.redraw();}, true);

  this.redraw = function () {
    // console.log("SMALL GENOME REDRAW")
    const genomeLength = GenomeStore.getGenomeLength();
    const visibleGenome = GenomeStore.getVisible();
    clearCanvas(myState.canvas);
    draw(myState.canvas, genomeLength, visibleGenome);
  };

  // whenever anybody changes the genome-position of the viewport, we should re-draw
  GenomeStore.addChangeListener(this.redraw);
  MiscStore.addChangeListener(this.redraw);
}

function clearCanvas(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function draw(canvas, genomeLength, visibleGenome) {
  const context = canvas.getContext('2d');
  const horBufferFrac = 0.1; // percent of blank space on either side
  const yMiddle = parseInt(canvas.height / 2, 10);
  const xStartLine  = parseInt(horBufferFrac * canvas.width, 10);
  const xLineFinish = parseInt(canvas.width * (1 - horBufferFrac), 10);
  const xLineLength = parseInt(canvas.width * (1 - 2 * horBufferFrac), 10);
  const xViewStart = parseInt(visibleGenome[0] / genomeLength * xLineLength + xStartLine, 10);
  let xViewLength = parseInt((visibleGenome[1] - visibleGenome[0]) / genomeLength * xLineLength, 10);
  if (xViewLength < 1) {
    xViewLength = 1;
  }


  // draw a horisontal line
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(xStartLine, yMiddle);
  context.lineTo(xLineFinish, yMiddle);
  context.stroke();

  // shade a box
  context.globalAlpha = 0.2;
  context.fillStyle = 'black';
  context.fillRect(xViewStart, parseInt(canvas.height / 4, 10), xViewLength, parseInt(canvas.height / 2, 10));
  context.globalAlpha = 1;
}


module.exports = smallGenome;

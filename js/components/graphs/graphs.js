const PlotStore = require('../../stores/PlotStore.js');
const GenomeStore = require('../../stores/genome.js');
const RawDataStore = require('../../stores/RawDataStore.js');
const MiscStore = require('../../stores/misc.Store.js');
const MouseMoves = require('../mouse_moves.js');
const RegionSelectedStore = require('../../stores/RegionSelectedStore.js');


function plotter(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  const myState = this;
  this.mouseMoves = new MouseMoves(canvas); // set up listeners
  window.addEventListener('resize', function () {myState.redraw();}, true);
  this.redraw = function () {
    // console.log('graphs.js REDRAW.',RawDataStore.getDataLoaded('GWAS'),RawDataStore.getDataLoaded('genomic'))
    // what type of plot is it?
    // this needs to be re-written
    if (RawDataStore.getDataLoaded('GWAS')) {
      drawScatterGraph(myState.canvas, myState.context);
      drawAxis(myState.canvas, myState.context, 'GWAS');
    } else if (RawDataStore.getDataLoaded('genomic')) {
      clearCanvas(myState.canvas);
      drawLineGraph(myState.canvas, 'recombGraph', 'black');
      if (PlotStore.getPlotMaxY('subtree')) {
        drawLineGraph(myState.canvas, 'subtree', '#fd8d3c');
      }
      drawAxis(myState.canvas, myState.context, 'recombGraph');
    }
  };

  this.checkForClick = function () {
    if (RegionSelectedStore.getID() !== canvas.id || !RawDataStore.getDataLoaded('GWAS')) {
      return;
    }
    const mouse = RegionSelectedStore.getClickXY();
    // const visibleGenome = GenomeStore.getVisible();
    const circles = RawDataStore.getParsedData('GWAS');
    // E X P E N S I V E
    for (let i = 0; i < circles.length; i++) {
      if (circles[i].selected) {
        circles[i].selected = false;
      }
    }
    for (let i = 0; i < circles.length; i++) {
      if (
        circles[i].x - circles[i].r < mouse[0] &&
        circles[i].x + circles[i].r > mouse[0] &&
        circles[i].y - circles[i].r < mouse[1] &&
        circles[i].y + circles[i].r > mouse[1]
      ) {
        circles[i].selected = true;
        break;
      }
    }
    myState.redraw();
  };
  RawDataStore.addChangeListener(this.redraw); // initial load
  GenomeStore.addChangeListener(this.redraw);
  PlotStore.addChangeListener(this.redraw);
  MiscStore.addChangeListener(this.redraw);
  RegionSelectedStore.addChangeListener(this.checkForClick);
}


function drawScatterGraph(canvas, context) {
  const visibleGenomeCoords = GenomeStore.getVisible();
  const basesVisible = visibleGenomeCoords[1] - visibleGenomeCoords[0];
  if (!basesVisible) {
    // nothing in view (due to no gubbins/annotation)
    return;
  }
  clearCanvas(canvas);
  const maximumYvalue = PlotStore.getPlotMaxY('GWAS');
  const yScaleMultiplier = parseFloat( (canvas.height - 5) / maximumYvalue );
  const circles = RawDataStore.getParsedData('GWAS');
  for (let i = 0; i < circles.length; i++) {
    // only draw if in view!
    if (circles[i].featurex > visibleGenomeCoords[0] && circles[i].featurex < visibleGenomeCoords[1]) {
      // what are the (canvas) co-ords to draw to?
      circles[i].x = parseInt(( circles[i].featurex - visibleGenomeCoords[0] ) / basesVisible * canvas.width, 10);
      circles[i].y = canvas.height - (circles[i].featurey * yScaleMultiplier);
      circles[i].r = basesVisible > 1000000 ? 1 : basesVisible > 100000 ? 2 : basesVisible > 50000 ? 3 : basesVisible > 10000 ? 4 : 5; // eslint-disable-line no-nested-ternary
      circles[i].draw(context); // r not contained in object!
    } else {
      circles[i].x = undefined;
      circles[i].y = undefined;
      circles[i].selected = false;
    }
  }
}

function drawLineGraph(canvas, plotName, colour) {
  const context = canvas.getContext('2d');
  const visibleGenome = GenomeStore.getVisible();
  if (!PlotStore.isPlotActive(plotName)) {
    return;
  }
  const plotYvalues = PlotStore.getPlotYvalues(plotName);
  const maximumYvalue = PlotStore.getPlotMaxY('recombGraph');
  const yScaleMultiplier = parseFloat( canvas.height / maximumYvalue );
  // console.log("in plot object, got len: ",plotYvalues.length," and max Y: ",maximumYvalue)

  // clearCanvas(canvas);
  // draw
  context.save();
  context.strokeStyle = colour;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, canvas.height);
  // crawl across the x axis by pixel :)
  for (let x = 1; x <= canvas.width; x++) {
    const genomeX = parseInt(visibleGenome[0] + (x / canvas.width) * (visibleGenome[1] - visibleGenome[0]), 10);
    const y = canvas.height - (plotYvalues[genomeX] * yScaleMultiplier);
    context.lineTo(x, y );
    // console.log("pixel x: ",x," genome x: ", genomeX," genome y: ",plotYvalues[genomeX]," pixel y: ",y)
  }
  context.stroke();
  context.restore();
}


function drawAxis(canvas, context, plotName) {
  // const myState = this;
  const maximumYvalue = PlotStore.getPlotMaxY(plotName);
  // console.log('maximumYvalue',maximumYvalue)
  const yScaleMultiplier = parseFloat( canvas.height / maximumYvalue ); // double up!
  // console.log('this:', this)
  function drawTicks(vals, tickLengthPx, valsArePerc) {
    if (valsArePerc) {
      for (let i = 0; i < vals.length; i++) {
        vals[i] = canvas.height * (1 - (100 - vals[i]) / 100);
      }
    }
    // we are starting at 0,0 (i.e. TOP LEFT)
    context.beginPath();
    context.moveTo(0, 0);
    for (let i = 0; i < vals.length; i++) {
      context.lineTo(0, vals[i]);
      context.lineTo(tickLengthPx, vals[i]);
      context.lineTo(0, vals[i]);
    }
    context.stroke();
  }
  function getYPixelValsForGivenVals(vals) {
    // N.B. these are measured from the top!!!!
    const ret = [];
    for (let i = 0; i < vals.length; i++) {
      ret.push(canvas.height - (vals[i] * yScaleMultiplier));
    }
    return ret;
  }
  function drawDottedLine(yValPx) {
    context.save();
    context.strokeStyle = 'red';
    context.setLineDash([ 5, 10 ]);
    context.beginPath();
    context.moveTo(0, yValPx);
    context.lineTo(canvas.width, yValPx);
    context.stroke();
    context.restore();
  }
  context.save();
  context.beginPath();
  context.moveTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height); // bottom line :)
  context.lineTo(0, 0); // left hand axis (now at top left)
  context.stroke();
  context.restore();

  if (plotName === 'GWAS') {
    drawDottedLine(getYPixelValsForGivenVals([ 5 ])[0]);
  } else if (RawDataStore.getGenomicDatasetType() === 'roary') {
    drawDottedLine(parseInt(canvas.height * 0.25, 10));
    drawDottedLine(parseInt(canvas.height * 0.05, 10));
  }

  // some text :)
  context.save();
  context.fillStyle = 'black';
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.font = '12px Helvetica';
  if (plotName === 'GWAS') {
    const yVals = Array.apply(0, Array(Math.floor(maximumYvalue))).map(function (_, b) {return (b + 1);});
    const yValsPx = getYPixelValsForGivenVals(yVals);
    drawTicks(yValsPx, 5, false);
    for (let i = 0; i < yVals.length; i++) {
      context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i], 10));
    }
  } else {
    if (RawDataStore.getGenomicDatasetType() === 'gubbins') {
      const numTicks = 4;
      const yVals = Array.apply(0, Array(numTicks)).map(function (_, b) {
        return (Math.floor(maximumYvalue * (b + 1) / numTicks));
      });
      const yValsPx = getYPixelValsForGivenVals(yVals);
      drawTicks(yValsPx, 5, false);
      for (let i = 0; i < yVals.length; i++) {
        context.fillText(yVals[i].toString(), 5, parseInt(yValsPx[i], 10));
      }
    } else { // R O A R Y
      drawTicks([ 100, 75, 50, 25 ], 5, true);
      context.fillText('100%', 5, 5);
      context.fillText('75%', 5, parseInt(canvas.height * 0.25, 10));
      context.fillText('50%', 5, parseInt(canvas.height * 0.5, 10));
      context.fillText('25%', 5, parseInt(canvas.height * 0.75, 10));
    }
  }
  context.restore();
}

function clearCanvas(canvas) {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}


module.exports = plotter;

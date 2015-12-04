const React = require('react');
const ReactDOM = require('react-dom');
const MetadataStore = require('../../stores/MetadataStore.js');
const TaxaLocations = require('../../stores/Taxa_Locations.js');
const MiscStore = require('../../stores/misc.Store.js');
const misc = require('../misc.js');

/*
The parsing of the csv file is done in the metadata store!
A click / mouseover is interpreted here as to what square (of metadata) we are in
    If there is a change in this "state" an action is triggered
    MetadataStore interprets this square and tells us what text to display :)
The Y values are from TaxaLocations
They X values are calculated here
The colours are given from MetadataStore

This is currently a self contained thing, but we should really make it part of react!

*/

const MetaTextClass = React.createClass({ displayName: 'displayName',
  componentDidMount: function () { // Invoked once, immediately after the initial rendering
    misc.initCanvasXY(this);
    const metaInstance = new MetaText(ReactDOM.findDOMNode(this)); // eslint-disable-line no-unused-vars
  },
  render: function () {
    return (
      <canvas id="metaTextCanvas" className="inContainer"></canvas>
      );
  },
});

const MetaCanvasClass = React.createClass({ displayName: 'displayName',
  componentDidMount: function () { // Invoked once, immediately after the initial rendering
    misc.initCanvasXY(this);
    const metaInstance = new Meta(ReactDOM.findDOMNode(this)); // eslint-disable-line no-unused-vars
  },
  render: function () {
    return (
      <canvas id="metaCanvas" className="inContainer"></canvas>
      );
  },
});

function xOffsetForColumnGenerator(canvas) { // closure
  const activeHeaders = MetadataStore.getActiveHeaders(); // eval @ funct creation
  const betweenColPadding = activeHeaders.length * 2 < canvas.width ? 1 : 0;
  const blockWidth = parseInt(canvas.width / activeHeaders.length, 10) - betweenColPadding;
  return function (idx) {
    const xOffset = parseInt(idx * blockWidth + idx * betweenColPadding, 10);
    return ([ xOffset, blockWidth ]);
  };
}

function MetaText(canvas) {
  const myState  =  this;
  this.canvas  =  canvas;
  this.context =  this.canvas.getContext('2d');

  this.redraw = function () {
    const yDispPos   =  myState.canvas.height - 5;
    const headers    =  MetadataStore.getActiveHeaders();
    const xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas);
    let x; // x value in pixels

    myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);

    for (let i = 0; i < headers.length; i++) {
      myState.context.save();
      myState.context.fillStyle    = 'black';
      myState.context.textBaseline = 'left';
      myState.context.textAlign    = 'left';
      myState.context.font         = '12px Helvetica';
      myState.context.textBaseline = 'middle';
      x = xOffsetForColumn(i)[0] + xOffsetForColumn(i)[1] / 2;
      myState.context.translate(x, yDispPos);
      myState.context.rotate(-Math.PI / 2);
      myState.context.fillText(headers[i], 0, 0);
      myState.context.restore();
    }
  };

  // whenever the taxaLocations store changes (e.g. someones done something to the tree) we should re-draw
  TaxaLocations.addChangeListener(this.redraw);

  // whenever the MetadataStore store changes we should re-draw
  MetadataStore.addChangeListener(this.redraw);

  MiscStore.addChangeListener(this.redraw);

  window.addEventListener('resize', function () {myState.redraw();}, true);
}

function Meta(canvas) {
  const myState = this;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.mouseIsOver = [ undefined, undefined ];
  this.blockWidth;
  window.addEventListener('resize', function () {myState.redraw();}, true);

  this.y_to_taxa = function (y) {
    // given a y position what taxa are we in? return undefined if no taxa
    const activeTaxa = TaxaLocations.getActiveTaxa();
    for (let i = 0; i < activeTaxa.length; i++) {
      const yValues = TaxaLocations.getTaxaY([ activeTaxa[i] ]);
      if (y >= yValues[0] && y <= yValues[1]) {
        return (activeTaxa[i]);
      }
    }
    return (undefined);
  };
  this.x_to_columnNum = function (x) {
    const xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas);
    for (let j = 0; j < MetadataStore.getActiveHeaders().length; j++) {
      const colData = xOffsetForColumn(j);
      if (x >= colData[0] && x <= colData[0] + colData[1]) {
        return (j);
      }
    }
    return (undefined);
  };

  this.mouseMoveDetected = function (e) {
    // console.log("MOUSE DOWN")
    const mouse = myState.getMouse(e, myState.canvas);
    const newMouseOver = [ myState.x_to_columnNum(mouse.x), myState.y_to_taxa(mouse.y) ];
    if (
      ( (newMouseOver[0] === undefined || newMouseOver[1] === undefined) &&
        (myState.mouseIsOver[0] === undefined || myState.mouseIsOver[1] === undefined) )
      ||
      (newMouseOver[0] === myState.mouseIsOver[0] && newMouseOver[1] === myState.mouseIsOver[1])
      ) {
      // no change
    } else {
      myState.mouseIsOver[0] = newMouseOver[0];
      myState.mouseIsOver[1] = newMouseOver[1];
      myState.redraw();
    }
  };

  this.redraw = function () {
    let display = false; // hack for speed increase -- is a block selected?
    const activeTaxa = TaxaLocations.getActiveTaxa();
    const xOffsetForColumn = xOffsetForColumnGenerator(myState.canvas); // closure
    const blockWidth = xOffsetForColumn(0)[1];
    myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);

    if (! MetadataStore.shouldWeDisplay()) {
      return;
    }
    // myState.blockWidth = myState.canvas.width / MetadataStore.getActiveHeaders().length;
    if (myState.mouseIsOver[0] !== undefined && myState.mouseIsOver[1] !== undefined) {
      display = true;
    }

    // outer loop: vertical (taxa), inner lop: horisontal (meta column)
    for (let i = 0; i < activeTaxa.length; i++) {
      const yValues = TaxaLocations.getTaxaY([ activeTaxa[i] ]);
      const blockColours = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'colour');
      if (blockColours) { // may return null --> don't draw!
        for (let j = 0; j < blockColours.length; j++) {
          const x = xOffsetForColumn(j)[0];
          // draw the block
          myState.context.save();
          myState.context.fillStyle = blockColours[j];
          myState.context.fillRect(x, yValues[0], blockWidth, yValues[1] - yValues[0]);
          myState.context.restore();

          if (display && j === myState.mouseIsOver[0] && activeTaxa[i] === myState.mouseIsOver[1]) {
            myState.context.save();
            myState.context.textAlign    =  'center';
            myState.context.textBaseline =  'bottom';
            myState.context.fillStyle    =  'black';
            myState.context.font         =  '12px Helvetica';
            const text = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'value')[j];
            // testing only -- display headers as well to check alignment
            // text = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'value')[j] + ' ' + MetadataStore.getActiveHeaders()[j];
            myState.context.fillText(text, xOffsetForColumn(j)[0] + xOffsetForColumn(j)[1] / 2, yValues[0]);
            myState.context.restore();

            // border -- used as a hack for testing really
            myState.context.save();
            myState.context.strokeStyle = 'black';
            myState.context.beginPath();
            myState.context.moveTo(x, yValues[0]); //  top left
            myState.context.lineTo(x + blockWidth, yValues[0]); // top right
            myState.context.lineTo(x + blockWidth, yValues[1]); // bottom right
            myState.context.lineTo(x, yValues[1]); // bottom left
            myState.context.lineTo(x, yValues[0]); // top left
            myState.context.stroke();
            myState.context.restore();
          }
        }
      }
    }
  };

  // whenever the TaxaLocations store changes (e.g. someones done something to the tree) we should re-draw
  TaxaLocations.addChangeListener(this.redraw);

  // whenever the MetadataStore store changes we should re-draw
  MetadataStore.addChangeListener(this.redraw);

  MiscStore.addChangeListener(this.redraw);

  this.canvas.addEventListener('mousemove', this.mouseMoveDetected, true);

  this.canvas.addEventListener('mouseout', this.mouseMoveDetected, true);

  window.addEventListener('resize', function () {myState.redraw();}, true);
}


Meta.prototype.getMouse = function (e, canvas) {
  let element = canvas;
  let offsetY = 0;
  let offsetX = 0;
  if (element.offsetParent !== undefined) {
    do { // eslint-disable-line no-cond-assign
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  const mx = e.pageX - offsetX;
  const my = e.pageY - offsetY;
  // const ctx = canvas.getContext('2d');
  // ctx.beginPath();
  // ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
  // ctx.fillStyle = 'black';
  // ctx.fill();
  // ctx.closePath();
  return ({ x: mx, y: my });
};

module.exports = {
  MetaCanvasClass: MetaCanvasClass,
  MetaTextClass: MetaTextClass,
};


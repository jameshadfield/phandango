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

function MetaText(canvas) {
  const myState  =  this;
  this.canvas  =  canvas;
  this.context =  this.canvas.getContext('2d');

  this.redraw = function () {
    myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);
    const blockWidth =  myState.canvas.width / MetadataStore.getActiveHeaders().length;
    const yDispPos   =  myState.canvas.height - 5;
    const headers    =  MetadataStore.getActiveHeaders();
    let xDispPos   =  parseInt(blockWidth / 2, 10);
    for (let i = 0; i < headers.length; i++) {
      myState.context.save();
      myState.context.fillStyle    = 'black';
      myState.context.textBaseline = 'left';
      myState.context.textAlign    = 'left';
      myState.context.font         = '12px Helvetica';
      myState.context.translate(xDispPos, yDispPos);
      myState.context.rotate(-Math.PI / 2);
      myState.context.fillText(headers[i], 0, 0);
      myState.context.restore();
      xDispPos += parseInt(blockWidth, 10);
    }
  };

  // whenever the TaxaLocations store changes (e.g. someones done something to the tree) we should re-draw
  TaxaLocations.addChangeListener(this.redraw);

  // whenever the MetadataStore store changes we should re-draw
  MetadataStore.addChangeListener(this.redraw);

  MiscStore.addChangeListener(this.redraw);
}

function Meta(canvas) {
  // console.log("i'm alive!")
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.mouseIsOver = [ undefined, undefined ];
  // this.blockWidth
  const myState = this;
  // this.mouse_moves = new mouse_moves(this.canvas);
  window.addEventListener('resize', function () {myState.redraw();}, true);

  this.y_to_taxa = function (y) {
    // given an X position what taxa are we in? return undefined if no taxa
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
    let xStart = 0;
    for (let j = 0; j < MetadataStore.getActiveHeaders().length; j++) {
      if (x >= xStart && x <= xStart + myState.blockWidth) {
        return (j);
      }
      xStart += myState.blockWidth;
    }
    return (undefined);
  };

  this.canvas.addEventListener('mousemove', function (e) {
    const mouse = myState.getMouse(e, myState.canvas);
    const newMouseOver = [ myState.x_to_columnNum(mouse.x), myState.y_to_taxa(mouse.y) ];
    if (
      ( (newMouseOver[0] === undefined || newMouseOver[1] === undefined) &&
        (myState.mouseIsOver[0] === undefined || myState.mouseIsOver[1] === undefined)
      ) ||
      (newMouseOver[0] === myState.mouseIsOver[0] && newMouseOver[1] === myState.mouseIsOver[1])
    ) {
        // no change
    } else {
      myState.mouseIsOver[0] = newMouseOver[0];
      myState.mouseIsOver[1] = newMouseOver[1];
      myState.redraw();
    }
  }, true);

  this.redraw = function () {
    // console.log("myState:",myState)
    // console.log("myState.context",myState.context)
    myState.context.clearRect(0, 0, myState.canvas.width, myState.canvas.height);
    if (! MetadataStore.shouldWeDisplay()) {
      return;
    }
    /* redraws are expensive. We need to work out if we redraw.
    we only redraw if   * TaxaLocations have changed (i.e. y values are different) <-- this is taken care of in the store
                        * Click in this region
                        * CSV file parsed (MetadataStore emission)
    */
    // console.log("active headers are: ",MetadataStore.getActiveHeaders())
    // console.log("active taxa are: ",TaxaLocations.getActiveTaxa())

    // we start by using the whole X width available
    myState.blockWidth = myState.canvas.width / MetadataStore.getActiveHeaders().length;

    let display = false;
    if (myState.mouseIsOver[0] !== undefined && myState.mouseIsOver[1] !== undefined) {
      display = true;
    }

    // draw each (active) taxa
    const activeTaxa = TaxaLocations.getActiveTaxa();
    for (let i = 0; i < activeTaxa.length; i++) {
      const yValues = TaxaLocations.getTaxaY([ activeTaxa[i] ]);
      let xStart = 0;
      const blockColours = MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'colour');
      if (blockColours) { // may return null --> don't draw!
        for (let j = 0; j < blockColours.length; j++) {
          myState.context.save();
          myState.context.fillStyle = blockColours[j];
          // myState.context.globalAlpha=
          myState.context.fillRect(xStart, yValues[0], myState.blockWidth, yValues[1] - yValues[0]);
          myState.context.restore();

          if (display && j === myState.mouseIsOver[0] && activeTaxa[i] === myState.mouseIsOver[1]) {
            myState.context.save();
            myState.context.textAlign    =  'centre';
            myState.context.textBaseline =  'bottom';
            myState.context.fillStyle    =  'black';
            myState.context.font         =  '12px Helvetica';
            myState.context.fillText(
              MetadataStore.getDataForGivenTaxa(activeTaxa[i], 'value')[j],
              parseInt(xStart + (myState.blockWidth / 2), 10),
              yValues[0]
            );
            myState.context.restore();
          }
          xStart += myState.blockWidth;
        }
      }
    }
  };

  // whenever the TaxaLocations store changes (e.g. someones done something to the tree) we should re-draw
  TaxaLocations.addChangeListener(this.redraw);

  // whenever the MetadataStore store changes we should re-draw
  MetadataStore.addChangeListener(this.redraw);

  MiscStore.addChangeListener(this.redraw);
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
  // ctx = canvas.getContext('2d');
  // ctx.beginPath();
  // ctx.arc(mx, my, 5, 0, 2 * Math.PI, false);
  // ctx.fillStyle = 'green';
  // ctx.fill();
  // ctx.closePath();
  return ({ x: mx, y: my });
};

module.exports = {
  MetaCanvasClass: MetaCanvasClass,
  MetaTextClass: MetaTextClass,
};


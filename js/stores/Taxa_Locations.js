const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');

let taxaPositions = {};
let activeTaxa = [];
let selectedTaxa = undefined;

const TaxaLocations = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },

  getAll: function () {
    return taxaPositions;
  },

  getSelectedTaxa: function () {
    return selectedTaxa;
  },

  getActiveTaxa: function () {
    return activeTaxa;
  },

  getTaxaY: function (listOfTaxaUnchecked) {
    // the taxa coming in might be a subset of what's displayed by the tree
    // or they might be nothing!
    let ret;
    const listOfTaxa = [];
    for (let i = 0; i < listOfTaxaUnchecked.length; i++) {
      if (activeTaxa.indexOf(listOfTaxaUnchecked[i]) >= 0) {
        listOfTaxa.push(listOfTaxaUnchecked[i]);
      }
    }

    if (listOfTaxa.length === 0) {
      ret = null; // DONT DISPLAY ANYTHING
    } else if (listOfTaxa.length === 1) {
      // blue
      ret = taxaPositions[listOfTaxa[0]];
    } else {
      // red
      const minmax = [];
      minmax[0] = taxaPositions[listOfTaxa[0]][0];
      minmax[1] = taxaPositions[listOfTaxa[0]][1];
      // console.log('minmax', taxaPositions)
      for (let i = 1; i < listOfTaxa.length; i++) {
        // console.log(taxaPositions[listOfTaxa[i]][0]+" -- "+taxaPositions[listOfTaxa[i]][1])
        if (taxaPositions[listOfTaxa[i]][1] > minmax[1]) {
          minmax[1] = taxaPositions[listOfTaxa[i]][1];
        } else if (taxaPositions[listOfTaxa[i]][0] < minmax[0]) {
          minmax[0] = taxaPositions[listOfTaxa[i]][0];
        }
      }
      ret = minmax;
    }
    return ret;
  },

  loaded: function () {
    let ret = false;
    if (Object.keys(taxaPositions).length) {
      ret = true;
    }
    return ret;
  },
});

function getBackingStorePixelRatio(context) { // PhyloCanvas code
  return (
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    1
  );
}

function getPixelRatio(canvas) { // PhyloCanvas code
  return (window.devicePixelRatio || 1) / getBackingStorePixelRatio(canvas);
}


function setYValues() {
  activeTaxa = new Array(); // dev only
  for (let i = 0; i < window.phylocanvas.leaves.length; i++) {
    activeTaxa.push( window.phylocanvas.leaves[i].id );
  }
  taxaPositions = {}; // declared above. closure
  const pixelRatio = getPixelRatio(window.phylocanvas.canvas.canvas);
  const translate = function (y) {
    // this. is. complicated.
    // i'm sort of undoing the translateClick function (of PhyloCanvas)
    let ret = y;
    ret *= window.phylocanvas.zoom;
    ret += window.phylocanvas.offsety;
    ret += window.phylocanvas.canvas.canvas.height / 2;
    ret  = ret / pixelRatio;
    return ret;
  };

  const heightHalf = window.phylocanvas.textSize / 2 * window.phylocanvas.zoom;
  for (let i = 0; i < activeTaxa.length; i++) {
    const centerY = translate(window.phylocanvas.branches[activeTaxa[i]].centery);
    taxaPositions[activeTaxa[i]] = [ centerY - heightHalf, centerY + heightHalf ];
  }
}

TaxaLocations.dispatchToken = Dispatcher.register(function (payload) {
  switch (payload.actionType) {

  case 'phylocanvas_changed':
    // a lot of this block is only necessary as phylocanvas has an action every fucking time
    // we want to check if anything's actually changed
    const oldActiveTaxa = []; // oldActiveTaxa is not a reference, it is a true copy
    const oldMinYValues = [];
    for (let i = 0; i < activeTaxa.length; i++) {
      oldActiveTaxa.push(activeTaxa[i]);
      oldMinYValues.push(taxaPositions[activeTaxa[i]][0]);
    }

    setYValues();
    // Taxa_Locations.emitChange(); // now conditionally triggered -- see below

    // has the length of activeTaxa changed?
    if (oldActiveTaxa.length !== activeTaxa.length) {
      TaxaLocations.emitChange();
      return;
    }
    for (let i = 0; i < oldActiveTaxa.length; i++) {
      // if new minY of taxaX != old minY then emit
      if (taxaPositions[oldActiveTaxa[i]][0] !== oldMinYValues[i] ) {
        // console.log("taxa ",oldActiveTaxa[i],oldMinYValues[i]," -> ",taxaPositions[oldActiveTaxa[i]][0]," (i: ",i,")")
        TaxaLocations.emitChange();
        return;
      }
    }
    break;

  case 'phylocanvas_loaded':
    setYValues();
    TaxaLocations.emitChange();
    break;

  case 'phylocanvas_nodes_selected':
    selectedTaxa = payload.taxa.length === 0 ? undefined : payload.taxa;
    // console.log("Taxa_Loactions store: selected taxa: "+selectedTaxa)
    TaxaLocations.emitChange();
    break;

  default:
    break;
  }
});


module.exports = TaxaLocations;

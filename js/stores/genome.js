const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');
const TaxaLocations = require('./Taxa_Locations.js');
const Actions = require('../actions/actions.js');
const ErrStruct = require('../structs/errStruct.js');

// this store is simple
// it contains the length of the genome
// and the x-coordinates of the genome currently on display in the canvas(es)

let genomeLength = undefined;
let visibleGenome = [ 0, 0 ];
let selectedTaxaYCoords = undefined;
let selectedTaxa = undefined;

const GenomeStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },
  addChangeListener: function (callback) {
    this.on('change', callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },
  getVisible: function () {
    return visibleGenome;
  },
  getGenomeLength: function () {
    return genomeLength;
  },
  getSelectedTaxaY: function () {
    return selectedTaxaYCoords;
  },
  getSelectedTaxaNames: function () {
    return selectedTaxa;
  },
});

function setGenomeLength(x) {
  if (x !== genomeLength) { // note that genome length may be currently undefined
    const prevGenomeLength = genomeLength; // copy not ref
    genomeLength = x;
    visibleGenome = [ 0, x ]; // any change resets this...
    GenomeStore.emitChange();
    // if we changed the genome length (as opposed
    // to setting it) then display an error!
    if (prevGenomeLength !== undefined) {
      // console.error('genome length changed from ' + prevGenomeLength + 'bp to ' + genomeLength + 'bp');
      // create error
      const errStr = [
        'Genome length has changed from ', prevGenomeLength, 'bp to ',
        genomeLength, 'bp. This means that the blocks and annotation',
        ' display will be out of sync!',
      ];
      const errObj = new ErrStruct(true, 'ERROR: Genome length change.', errStr);
      setTimeout(function () {Actions.newErr([ errObj ]);}, 0); // TO FIX
    }
  }
}

function showHelperMessage(msg) {
  const errObj = new ErrStruct(false, msg);
  // TO DO -- TO FIX
  setTimeout(function () {Actions.newErr([ errObj ]);}, 0);
}

function pan(fracCanvasPan) {
  if (visibleGenome[0] === 0 && visibleGenome[1] === genomeLength) {
    showHelperMessage('can\'t drag (whole genome in view)');
    return false;
  }
  const bpToMove = (visibleGenome[1] - visibleGenome[0]) * fracCanvasPan;
  const newLeft = visibleGenome[0] + bpToMove;
  const newRight = visibleGenome[1] + bpToMove;
  if (newLeft < 0 || newRight > genomeLength) {
    showHelperMessage('can\'t drag (already at edge of genome)');
    return false;
  }
  visibleGenome = [ newLeft, newRight ];
  return true;
}

function zoom(delta, fracInCanvas) {
  const multiplier = 2;   // each zoom shows X times as much / half as much of the viewport
  // console.log('ZOOM delta '+delta+' fracInCanvas '+fracInCanvas)
  const bpLeftOfMouseX = fracInCanvas * (visibleGenome[1] - visibleGenome[0]);
  const bpRightOfMouseX = (visibleGenome[1] - visibleGenome[0]) - bpLeftOfMouseX;
  const baseAtMouseX = bpLeftOfMouseX + visibleGenome[0];
  let newVisibleGenome;
  if (delta > 0) {
    newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX / multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX / multiplier, 10) ];
  } else {
    newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX * multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX * multiplier, 10) ];
  }
  // need some checking here -- don't want to zoom in too much and don't want to zoom out too much!
  if (newVisibleGenome[1] - newVisibleGenome[0] < 1000) {
    showHelperMessage('can\'t zoom in to less than 1000bp');
    return;
  }
  if (newVisibleGenome[0] < 0) {newVisibleGenome[0] = 0;}
  if (newVisibleGenome[1] > genomeLength) {newVisibleGenome[1] = genomeLength;}
  // console.log("Now viewing "+newVisibleGenome[0]+' - '+newVisibleGenome[1]+'bp')
  visibleGenome = newVisibleGenome;
}


function setMinMaxOfSelectedTaxa(taxa) {
  selectedTaxa = taxa;
  if (taxa === undefined) {
    if (selectedTaxaYCoords === undefined) {
      // do nothing
    } else {
      selectedTaxaYCoords = undefined;
      // plot data will update here (it listens to the same action but waits for the token)
      GenomeStore.emitChange();
    }
  } else {
    const newSelectedTaxaYCoords = TaxaLocations.getTaxaY(taxa);
    // console.log('newSelectedTaxaYCoords',newSelectedTaxaYCoords)
    if (selectedTaxaYCoords === undefined || (newSelectedTaxaYCoords[0] !== selectedTaxaYCoords[0] || newSelectedTaxaYCoords[1] !== selectedTaxaYCoords[1])) {
      selectedTaxaYCoords = newSelectedTaxaYCoords;
      // plot data will update here (it listens to the same action but waits for the token)
      GenomeStore.emitChange();
    }
  }
}


// register this store with the dispatcher (here, not in actions)
GenomeStore.dispatchToken = Dispatcher.register(function (payload) {
  if (payload.actionType === 'genome_pan') {
    const update = pan(payload.fracCanvasPan);
    update ? GenomeStore.emitChange() : null;
  } else if (payload.actionType === 'setGenomeLength') {
    setGenomeLength(payload.x);
    // GenomeStore.emitChange(); // no need to emit
  } else if (payload.actionType === 'genome_zoom') {
    zoom(payload.delta, payload.fracInCanvas);
    GenomeStore.emitChange();
  } else if (payload.actionType === 'phylocanvas_nodes_selected') {
    // WAIT FOR TAXA_LOCATIONS TO UPDATE FIRST
    Dispatcher.waitFor([ TaxaLocations.dispatchToken ]);
    setMinMaxOfSelectedTaxa(TaxaLocations.getSelectedTaxa());
    // changes emitted in above fn
  } else if (payload.actionType === 'phylocanvas_changed') {
    setMinMaxOfSelectedTaxa(TaxaLocations.getSelectedTaxa());
    // changes emitted in above fn
  }
});

module.exports = GenomeStore;

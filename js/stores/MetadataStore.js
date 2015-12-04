const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');
const ColorBrewerStatic = require('../static/colorBrewer.js');

// HERE IS THE "STATE" which is accessable via "get" calls to the store
let header = [];
let activeIndexes = [];
let metadata = {}; // metadata -> taxaName -> headerPosition -> {value: Paris, 'colour': #121212}
let loaded = false;
let display = false;

// here is internal "state" which is private
// because no get method accesses it directly
let columnsOnOff = [];
const colorBrewer = new ColorBrewerStatic();


const MetadataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },
  addChangeListener: function (callback) {
    this.on('change', callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },
  getActiveHeaders: function () {
    const ret = [];
    for (let i = 0; i < activeIndexes.length; i++) {
      ret.push(header[activeIndexes[i]]);
    }
    return (ret);
  },
  shouldWeDisplay: function () {
    return (display);
  },
  getDataForSettings: function () {
    const ret = [];
    for (let i = 0; i < columnsOnOff.length; i++) {
      ret.push({
        header: header[i],
        isChecked: Boolean(columnsOnOff[i]),
        id: i,
      });
    }
    return (ret);
  },
  isLoaded: function () {
    return (loaded);
  },
  getDataForGivenTaxa: function (taxa, datatype) {
    // returns a list of colours corresponding to those of the active headers
    let ret;
    if (taxa in metadata) {
      ret = [];
      for (let i = 0; i < activeIndexes.length; i++) {
        ret.push(metadata[taxa][activeIndexes[i]][datatype]);
      }
    } else {
      ret = null;
    }
    return ret;
  },
  getInfoForSelectedCell: function () {
    // nothing yet
  },
});

function sortNumber(a, b) {
  return a - b;
}

function isNumeric(element, index, array) {
  return (!isNaN(element));
}

function setColours() {
  for (let headerIdx = 1; headerIdx < header.length; headerIdx++) {
    // what are all the values here???
    const values = [];
    for (const taxa in metadata) {
      if (metadata[taxa][headerIdx].value) {
        if (values.indexOf(metadata[taxa][headerIdx].value) === -1) {
          values.push(metadata[taxa][headerIdx].value);
        }
      }
    }
    // is values numeric or alphabetical?
    let numeric = false;
    if (values.every(isNumeric)) {     // returns true if the variable does NOT contain a valid number
      values.sort(sortNumber);
      numeric = true;
    } else {
      values.sort();
    }
    // we now have a sorted array. but how long is it???
    let numColours = values.length;
    if (numColours > 11) {
      console.error('metadata column (', header[headerIdx], ') with more than 11 entries... expect problems!');
      numColours = 11; // colorBrewer maximum
    } else if (numColours < 3) {
      numColours = 3; // colorBrewer minimum
    }
    let colourspace;
    if (values.length === 2) { // binary
      colourspace = [ colorBrewer.PuOr[3][0], colorBrewer.PuOr[3][2] ];
    } else if (numeric) {
      colourspace = colorBrewer.RdYlBu[numColours];
    } else {
      colourspace = colorBrewer.Spectral[numColours];
    }
    // assign the colours back to the metadata object
    for (const taxa in metadata) {
      if (metadata[taxa][headerIdx].value) {
        let idxOfEntry = values.indexOf(metadata[taxa][headerIdx].value);
        if (idxOfEntry > numColours) {
          idxOfEntry = idxOfEntry % numColours;
        }
        if (idxOfEntry === -1) {
          metadata[taxa][headerIdx].colour = '#FFFFFF';
        } else {
          metadata[taxa][headerIdx].colour = colourspace[idxOfEntry];
        }
      }
    }
  }
  // return metadata;
}

function setActiveIndicies() {
  // http://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-an-element-in-array
  activeIndexes = columnsOnOff.reduce(
    function (a, e, i) {if (e === 1) {a.push(i);} return (a);},
    []
  );
}


Dispatcher.register(function (payload) {
  switch (payload.actionType) {

  case 'toggleMetaDisplay':
    const oldVal = display;
    display = payload.newDisplayBool;
    if (display === oldVal) {
      console.log('we tried to toggle meta display but the value hasn\'t changed!!!!!');
    }
    MetadataStore.emitChange();
    break;

  case 'toggleMetadataColumn':
    // console.log("current cols on off: ",columnsOnOff)
    columnsOnOff[payload.colNumToToggle] = columnsOnOff[payload.colNumToToggle] ? 0 : 1;
    setActiveIndicies();
    // console.log("new cols on off: ",columnsOnOff)
    MetadataStore.emitChange();
    break;

  case 'hereIsMetadata':
    header = payload.data[0];
    columnsOnOff = payload.data[1];
    metadata = payload.data[2];
    setActiveIndicies();
    setColours(payload.data[2]);
    loaded = true;
    display = true;
    MetadataStore.emitChange();
    break;

  default:
    // do nothing
  }
});

module.exports = MetadataStore;

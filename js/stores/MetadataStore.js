var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var colorBrewerStatic = require('../static/colorBrewer.js');

// HERE IS THE "STATE" which is accessable via "get" calls to the store
var header = [];
var active_indexes = [];
var metaNamesByTaxa = {};
var metadata = {}; // metadata -> taxaName -> headerPosition -> {value: Paris, 'colour': #121212}
var loaded = false; // used by settings
var display = false; // used by settings & meta.react.jsx

// here is internal "state" that is inaccessable from other components
var columns_on_off = []; // isn't used except to set active_indexes
var colorBrewer = new colorBrewerStatic();


var MetadataStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getActiveHeaders: function() {
		var ret = []
		for (var i=0; i<active_indexes.length; i++) {
			ret.push(header[active_indexes[i]])
		}
		return(ret)
	},
	shouldWeDisplay: function() {
		return(display)
	},
	getDataForSettings: function() {
		var ret = []
		for (var i=0; i<columns_on_off.length; i++) {
			ret.push({header:header[i], isChecked:Boolean(columns_on_off[i]), id:i});
		}
		return(ret);
	},
	isLoaded: function() {
		return(loaded)
	},
	getDataForGivenTaxa: function(taxa,datatype) {
		// returns a list of colours corresponding to those of the active headers
		if (taxa in metadata) {
			var ret = []
			for (var i=0; i<active_indexes.length; i++) {
				// console.log("metadata for taxa ",taxa," header idx ",active_indexes[i]," (name: ",header[active_indexes[i]],") has colour: ",metadata[taxa][active_indexes[i]]['colour'])
				ret.push(metadata[taxa][active_indexes[i]][datatype])
			}
			// console.log(ret)
			return(ret)
		}
		else {
			return null;
			// return (Array.apply(null, new Array(header.length)).map(function () {return '#1a1a1a'}))
		}

	},
	getInfoForSelectedCell: function() {
		// nothing yet
	}
})

function sortNumber(a,b) {
    return a - b;
}

function isNumeric(element, index, array) {
  return( ! isNaN(element) );
}

function set_colours(header,metadata) {
	for (var headerIdx=1; headerIdx<header.length; headerIdx++) {

		// what are all the values here???
		var values = [];
		for (var taxa in metadata) {
			if (metadata[taxa][headerIdx]['value']) {
				if (values.indexOf(metadata[taxa][headerIdx]['value']) === -1) {
					values.push(metadata[taxa][headerIdx]['value'])
				}
			}
		}
		// is values numeric or alphabetical?
		var numeric = false;
		if (values.every(isNumeric)) {     // returns true if the variable does NOT contain a valid number
			values.sort(sortNumber)
			numeric = true
		} else {
			values.sort()
		}
		// we now have a sorted array. but how long is it???
		var numColours = values.length
		if (numColours>11) {
			console.log("metadata column (",header[headerIdx],") with more than 11 entries... expect problems!")
			numColours = 11; // colorBrewer maximum
		}
		else if (numColours<3) {
			numColours = 3; // colorBrewer minimum
		}
		var colourspace;
		if (values.length===2) { // binary
			colourspace = [colorBrewer.Set2[3][0], colorBrewer.Set2[3][1]]
		}
		else if (numeric) {
			colourspace = colorBrewer.RdYlBu[numColours]
		}
		else {
			colourspace = colorBrewer.Spectral[numColours]
		}
		// assign the colours back to the metadata object
		for (var taxa in metadata) {
			// console.log("assigning colours")
			// console.log("numeric??? ",numeric)
			// console.log("colourspace: ",colourspace)
			// console.log("taxa: ",taxa)
			// console.log("header idx: ",headerIdx)
			// console.log("header: ",header[headerIdx])
			// console.log("idx of colour:",values.indexOf(metadata[taxa][headerIdx]['value']))
			// console.log("colour: ",colourspace[values.indexOf(metadata[taxa][headerIdx]['value'])])
			idxOfEntry = values.indexOf(metadata[taxa][headerIdx]['value'])
			if (idxOfEntry > numColours) {
				idxOfEntry = idxOfEntry % numColours;
			}
			// console.log("taxa:",taxa,"value:",metadata[taxa][headerIdx]['value'],"oldIdx=",values.indexOf(metadata[taxa][headerIdx]['value']),"newIdx",idxOfEntry)
			if (idxOfEntry === -1) {
				metadata[taxa][headerIdx]['colour'] = "#FFFFFF"
			}
			else {
				metadata[taxa][headerIdx]['colour'] = colourspace[idxOfEntry]
			}
		}
	}
	return metadata
}

function set_active_indicies() {
	//http://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-an-element-in-array
	active_indexes = columns_on_off.reduce(function(a,e,i) {if (e===1) {a.push(i)}; return(a)},[])
}


Dispatcher.register(function(payload) {
	switch(payload.actionType) {
		case 'toggleMetaDisplay':
			var oldVal = display;
			display = payload.newDisplayBool;
			if (display===oldVal) {
				console.log("we tried to toggle meta display but the value hasn't changed!!!!!")
			}
			MetadataStore.emitChange();
			break;
		//case
		case 'toggleMetadataColumn':
			// console.log("current cols on off: ",columns_on_off)
			columns_on_off[payload.colNumToToggle] = columns_on_off[payload.colNumToToggle] ? 0 : 1;
			set_active_indicies()
			// console.log("new cols on off: ",columns_on_off)
			MetadataStore.emitChange();
			break;
		case 'csvStringReceived':
			var blah = parse_csv(payload.csvString)
			// check if parsing successful
			header = blah[0]
			columns_on_off = blah[1]
			set_active_indicies() // uses the now updated columns_on_off
			// metadata = blah[2]
			// console.log(header)
			metadata = set_colours(header,blah[2]) // modifies metadata

			loaded = true;
			display = true;
			MetadataStore.emitChange();
			break;

		case 'hereIsMetadata':
			// dump any information currently loaded
			header = [];
			active_indexes = [];
			metaNamesByTaxa = {};
			metadata = {}
			// load the new data
			var blah = payload.data;
			header = blah[0]
			columns_on_off = blah[1]
			set_active_indicies() // uses the now updated columns_on_off
			// metadata = blah[2]
			// console.log(header)
			metadata = set_colours(header,blah[2]) // modifies metadata
			loaded = true;
			display = true;
			MetadataStore.emitChange();
			break;

		//case
		default:
			// do nothing
		}
	});




module.exports = MetadataStore;


























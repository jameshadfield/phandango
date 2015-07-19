var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var DefaultData = require('../static/DefaultData.js');

// the idea is that we store the files here as strings e.t.c.

// when this store updates, if (e.g.) the tree file hasn't changed, we want
// the phylocanvas updater (which listens for emissions here) to know
// that it doesn't need to change... can this be done with custom emissions?


var gffs = [];
var trees = [];

var RawDataStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getTrees: function() {
		return trees; // reference (to array)
	},
	getGFFs: function() {
		return gffs; // reference
	}
})


Dispatcher.register(function(payload) {
  	// useful for debugging
  	console.log("action triggered: "+payload.actionType)

	if (payload.actionType === 'file_dropped') {
		setData(payload.file);
		RawDataStore.emitChange();
	}
	else if (payload.actionType === 'loadDefaultData') {
		gffs = [DefaultData.return_annotation_string(), DefaultData.return_gubbins_string()];
		trees = [DefaultData.return_newick_string()];
		RawDataStore.emitChange();
	}
})

module.exports = RawDataStore;

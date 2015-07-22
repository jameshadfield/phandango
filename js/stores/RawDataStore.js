var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var DefaultData = require('../static/DefaultData.js');

// the idea is that we store the files here as strings e.t.c.

// when this store updates, if (e.g.) the tree file hasn't changed, we want
// the phylocanvas updater (which listens for emissions here) to know
// that it doesn't need to change... can this be done with custom emissions?


// var gffs = [];
// var trees = [];
// var plots = [];

var data = {};

var RawDataStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		// console.log("raw data store store emission")
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	// getTrees: function() {
	// 	return trees; // reference (to array)
	// },
	// getGFFs: function() {
	// 	return gffs; // reference
	// }
	getData: function() {
		return data; // reference
	}
})

function incomingData(files) {
	data = {}; // clear cache
	// using the idea of a barrier from
	// http://stackoverflow.com/questions/7957952/detecting-when-javascript-is-done-executing
	// to know when all the IO is done!
	// only when all IO is done do we emit an event that the components pick up
	var EmitWhenIOFinished = function() {
		this.stillToReturn = files.length
		var myState = this;
		this.IOdone = function() {
			myState.stillToReturn -= 1;
			// console.log("emitWhenIOFinished.IOdone called. "+this.stillToReturn+" still to return")
			if (myState.stillToReturn === 0) {
				myState.done()
			}
		}
		this.done = function() {
			console.log("all IO done")
			// console.log(data)
			RawDataStore.emitChange();
		}
	}

	emitWhenIOFinished = new EmitWhenIOFinished()

	console.log("RawDataStore: "+files.length+" incoming file(s)")
	for (var i=0; i<files.length; i++) {
		// console.log("Filename: " + files[i].name + " " + parseInt(files[i].size/1024) + " kb");
		reader = new FileReader();
		var file_extension = files[i].name.split(".").slice(-1)[0]
		// onload, being sent to the event loop, needs a closure to bind certain variables to it (in this case, file_extension)
		reader.onload = function(file_extension) {
			return function(event) {
				// console.log("reader.onload started (new tick?)")
				// console.log("file extension: "+file_extension)
				if (file_extension in data) {
					data[file_extension].unshift(event.target.result)
				}
				else {
					data[file_extension] = [event.target.result];
				}
				emitWhenIOFinished.IOdone();
			};
		}(file_extension);

		reader.onerror = function(event) {
		    console.error("File could not be read! Code " + event.target.error.code);
		};
		reader.readAsText(files[i]);
	}
}


Dispatcher.register(function(payload) {
  	// useful for debugging
  	// console.log("action triggered: "+payload.actionType)

	if (payload.actionType === 'files_dropped') {
		incomingData(payload.files);
	}
	else if (payload.actionType === 'loadDefaultData') {
		data = {}
		data["gff"] = [DefaultData.return_annotation_string(), DefaultData.return_gubbins_string()];
		data["tre"] = [DefaultData.return_newick_string()];
		RawDataStore.emitChange();
	}
})

module.exports = RawDataStore;

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var DefaultData = require('../static/DefaultData.js');
var Actions = require('../actions/actions.js');

// P A R S E R S
var gubbinsParser = require('../components/genomic/parse.gubbins.js');
var metaParser = require('../components/meta/parse.csv.js');
var annotationParser = require('../components/annotation/parse.annotations.js');
var roaryParser = require('../components/genomic/roary.parser.js');


var loaded = {'genomic':false, 'tree':false, 'meta':false, 'annotaion':false, 'roary':false, 'SNPs':false};
var parsed = {};
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
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getData: function() {
		return data; // reference
	},
	getLoadedStatus: function(name) {
		return name ? loaded[name] : loaded;
	},
	getParsedData: function(name) {
		return parsed[name];
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
				if (file_extension=="roary") {
					console.log("ROARY IN")
					var roaryData = roaryParser.parseCSV(event.target.result);
					var roaryObjs = roaryParser.generateRoary(roaryData[1],roaryData[0],100)
					//; roaryObjs = [blocks,arrows,genome_length]

					// console.log("here's the roary header objects",roaryObjs[1]);
					// console.log("here's the roary data objects",roaryObjs[0]);
					// console.log("here's the (fake) genome lentgh",roaryObjs[2]);

					// TODO
					parsed['genomic'] = [[0,roaryObjs[2]],roaryObjs[0]];
					parsed['annotation'] = roaryObjs[1];
					loaded.genomic = true;
					loaded.annotation = true;
					Actions.set_genome_length(roaryObjs[2]);
					Actions.save_plotYvalues(roaryObjs[3], "recombGraph")
				}
				else if (file_extension=="gubbins") {
					console.log("Starting parsing of gubbins")
					var aaa = gubbinsParser.parse_gff(event.target.result);
					// this may well FAIL
					if (aaa===false) {
						console.log("gubbins parsing failed")
						// return false
					}
					else {
						console.log("here's the gubbins data",aaa)
						loaded.genomic = true;
						parsed['genomic'] = aaa;
					}
				}
				else if (file_extension==="csv") {
					var res = metaParser(event.target.result);
					console.log('parsed metadata', res)
					loaded.meta = true;
					if (res) {
						Actions.hereIsMetadata(res)
					}
					// Actions.csvStringReceived(event.target.result)
				}
				else if (file_extension==="tre") {
					// error checking handled by PhyloCanvas
					loaded.tree = true;
					parsed['tree'] = event.target.result;
				}

				else if (file_extension==="gff") {
					var res = annotationParser.parse_gff(event.target.result);
					if (res===false) {
						return false;
					}
					Actions.set_genome_length(res[0][1]);
					parsed['annotation'] = res[1];
					loaded.annotation = true;
				}

				else if (file_extension in data) {
					data[file_extension].unshift(event.target.result) // adds to beginning
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

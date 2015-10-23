var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
// var DefaultData = require('../static/DefaultData.js');
var Actions = require('../actions/actions.js');

// P A R S E R S
// all parsers return null / false upon failure
var gubbinsParser = require('../components/genomic/parse.gubbins.js');
var metaParser = require('../components/meta/parse.csv.js');
var annotationParser = require('../components/annotation/parse.annotations.js');
var roaryParser = require('../components/genomic/roary.parser.js');


var loaded = {'genomic':false, 'tree':false, 'meta':false, 'annotaion':false, 'roary':false, 'SNPs':false, 'gubbins':false};
var parsed = {};
var rawData = {}; // internal ONLY
var misc = {'roarySortCode':'asIs'};


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
	},
	getRoarySortCode: function(name) {
		return misc.roarySortCode;
	}
})

function incomingData(files) {
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
				switch(file_extension) {


					case 'gff':
						// could be gubbins OR annotation
						console.log("trying gubbins parsing")
						var gubbins = gubbinsParser.parse_gff(event.target.result);
						if (gubbins===false) {
							console.log("gubbins parsing failed")
						}
						else{
							console.log("gubbins parsing success")
							loaded.genomic = true;
							parsed['genomic'] = gubbins;
							break;
						}

						// try annotation now
						console.log("trying annotation parsing")
						var res = annotationParser.parse_gff(event.target.result);
						if (res===false) {
							console.log("annotation parsing failed")
						} else {
							console.log("annotation parsing success")
							Actions.set_genome_length(res[0][1]);
							parsed['annotation'] = res[1];
							loaded.annotation = true;
						}
						break;


					case 'tre':
						// basically palm this off to PhyloCanvas
						loaded.tree = true;
						parsed['tree'] = event.target.result;
						break;


					case 'csv':
						// could be roary OR metadata
						console.log("trying metadata parsing")
						var res = metaParser(event.target.result);
						if (res===false) {
							console.log("metadata parsing failed")
						}
						else{
							console.log("metadata parsing success")
							loaded.meta = true;
							Actions.hereIsMetadata(res)
							break;
						}

						// try ROARY now
						console.log("trying ROARY parsing")
						var res = roaryParser.parseCSV(event.target.result);
						if (res===false) {
							console.log("ROARY parsing failed")
						}
						else{
							console.log("ROARY parsing success")
							rawData['roary'] = res;
							saveRoaryAsData(rawData['roary'][0],rawData['roary'][1],100,misc.roarySortCode)
						}
						break;


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

function saveRoaryAsData(headerData,roaryData,geneLen,sortCode) {
	var roaryObjs = roaryParser.generateRoary(headerData,roaryData,geneLen,sortCode)
	if (!roaryObjs) {
		console.log("roary data conversion failed!")
		return;
	}
	parsed['genomic'] = [[0,roaryObjs[2]],roaryObjs[0]]; // FIX
	parsed['annotation'] = roaryObjs[1];
	loaded.genomic = true;
	loaded.roary = true;
	loaded.annotation = true;
	setTimeout(function() {
		Actions.set_genome_length(roaryObjs[2])},0);
	setTimeout(function() {
		Actions.save_plotYvalues(roaryObjs[3], "recombGraph")},0);
	setTimeout(function() {
		RawDataStore.emitChange()},0);
}


Dispatcher.register(function(payload) {
  	// useful for debugging
  	// console.log("action triggered: "+payload.actionType)

	if (payload.actionType === 'files_dropped') {
		incomingData(payload.files);
	}
	else if (payload.actionType === 'loadDefaultData') {
		console.log("default data broken")
		// loaded.tree = true;
		// parsed['tree'] = DefaultData.return_newick_string();
		// loaded.genomic = true;
		// parsed['genomic'] = gubbinsParser.parse_gff(DefaultData.return_gubbins_string());
		// loaded.annotation = true;
		// var res = annotationParser.parse_gff(DefaultData.return_annotation_string());
		// // Actions.set_genome_length(res[0][1]);
		// parsed['annotation'] = res[1];
		// RawDataStore.emitChange();
	}
	else if (payload.actionType === 'sortRoary') {
		console.log("ACTION SORT WITH CODE",payload.sortCode)
		saveRoaryAsData(rawData['roary'][0],rawData['roary'][1],100,payload.sortCode)
		misc.roarySortCode = payload.sortCode;
	}
})

module.exports = RawDataStore;

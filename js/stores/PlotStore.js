var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

var allYvalues = {};
var maxYvalues = {};

var PlotStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getPlotYvalues: function(plotName) {
		return allYvalues[plotName];
	},

	getPlotMaxY: function(plotName) {
		return maxYvalues[plotName];
	},

	isPlotActive: function(plotName) {
		return plotName in maxYvalues ? true : false;
	}

})


Dispatcher.register(function(payload) {
  if (payload.actionType === 'save_plotYvalues') {
  	allYvalues[payload.plotName] = payload.plotYvalues
  	// setTimeout????
  	maxYvalues[payload.plotName] = 1;
  	for (var i=0; i<payload.plotYvalues.length; i++) {
  		if (payload.plotYvalues[i]>maxYvalues[payload.plotName]) {
  			maxYvalues[payload.plotName] = payload.plotYvalues[i]
  			// console.log("max updated at pos",i,"to",maxYvalues[payload.plotName])
  		}
  	}
    PlotStore.emitChange();
  }
})

module.exports = PlotStore;

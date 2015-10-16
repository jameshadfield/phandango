var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

var MiscStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		console.log("change emitted");
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
})

// register this store with the dispatcher (here, not in actions)

Dispatcher.register(function(payload) {
  if (payload.actionType === 'redrawAll') {
    MiscStore.emitChange();
  }
})

module.exports = MiscStore;

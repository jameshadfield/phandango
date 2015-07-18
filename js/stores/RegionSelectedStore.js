var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

var location_clicked = [0,0];
var canvas_id = undefined;

var RegionSelectedStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getClickXY: function() {
		return location_clicked;
	},
	getID: function() {
		return canvas_id;
	}
})


Dispatcher.register(function(payload) {
	if (payload.actionType === 'click') {
		canvas_id = payload.id;
		location_clicked = [payload.mx, payload.my]
		// console.log('action received. location_clicked = ['+payload.mx+', '+payload.my+']')
		RegionSelectedStore.emitChange()
	}
})

module.exports = RegionSelectedStore;

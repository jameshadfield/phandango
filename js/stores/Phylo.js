
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
// var Dispatcher = require('../dispatcher/dispatcher');

var newick_string = "((((4021_6_9:17.872482,4075_8_8:19.341156):0.000139,(4021_6_8:11.013665,(4270_2_1:8.249511,(4021_6_10:6.043164,(4021_8_1:2.25319,4270_2_10:1.16899):9.411273):8.183347):0.000139):0.000139):2.623347,(4270_2_9:18.112116,4270_2_8:3.05522):6.76513):16.404085,4270_2_7:25.893198,4075_8_7:9.66467):0.0;";


var PhyloStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getAll: function() {
		return newick_string;
	}
})


module.exports = PhyloStore;

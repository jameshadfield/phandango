var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

// this store is simple
// it contains the length of the genome
// and the x-coordinates of the genome currently on display in the canvas(es)

genome_length = undefined;
visible_genome = [0,0];

var GenomeStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getVisible: function() {
		return visible_genome;
	},
	getGenomeLength: function() {
		return genome_length;
	}
})

function set_genome_length(x) {
	genome_length = x;
	visible_genome = [0,x]; // to start with!
}
function pan(fracCanvasPan) {
	if (visible_genome[0]===0 && visible_genome[1]===genome_length) {console.log("no pan (whole genome visible)"); return false}; //
	var bp_to_move = (visible_genome[1]-visible_genome[0]) * fracCanvasPan;
	var newLeft = visible_genome[0] + bp_to_move;
	var newRight = visible_genome[1] + bp_to_move;
	if (newLeft<0) {console.log("no pan, would move out of view (L)"); return false};
	if (newRight>genome_length) {console.log("no pan, would move out of view (R)"); return false};
	// console.log("bases to move: "+bp_to_move+" new visible view: "+newLeft+" - "+newRight)
	visible_genome = [newLeft, newRight];
	return true;
}
function zoom(delta, fracInCanvas) {
	var multiplier = 1.1; 	// each zoom shows X times as much / half as much of the viewport
	console.log('ZOOM delta '+delta+' fracInCanvas '+fracInCanvas)
	var bp_left_of_mx = fracInCanvas * (visible_genome[1] - visible_genome[0]);
	var bp_right_of_mx = (visible_genome[1] - visible_genome[0]) - bp_left_of_mx;
	var base_at_mx = bp_left_of_mx + visible_genome[0];
	var new_visible_genome;
	if (delta>0){
		new_visible_genome = [base_at_mx - parseInt(bp_left_of_mx/multiplier), base_at_mx + parseInt(bp_right_of_mx/multiplier)]
	}
	else {
		new_visible_genome = [base_at_mx - parseInt(bp_left_of_mx*multiplier), base_at_mx + parseInt(bp_right_of_mx*multiplier)]
	}
	// need some checking here -- don't want to zoom in too much and don't want to zoom out too much!
	if (new_visible_genome[1] - new_visible_genome[0] < 1000) {
		console.log("Won't zoom in to less than 1000bp");
		return;
	}
	if (new_visible_genome[0]<0) {new_visible_genome[0]=0}
	if (new_visible_genome[1]>genome_length) {new_visible_genome[1]=genome_length}
	// console.log("Now viewing "+new_visible_genome[0]+' - '+new_visible_genome[1]+'bp')
	visible_genome = new_visible_genome;
}


// register this store with the dispatcher (here, not in actions)

Dispatcher.register(function(payload) {
  if (payload.actionType === 'genome_pan') {
  	var update = pan(payload.fracCanvasPan)
  	update ? GenomeStore.emitChange() : null;
  }
  else if (payload.actionType === 'set_genome_length') {
    set_genome_length(payload.x);
    // GenomeStore.emitChange(); // no need to emit
  }
  else if (payload.actionType === 'genome_zoom') {
  	zoom(payload.delta,payload.fracInCanvas)
  	GenomeStore.emitChange()
  }
})

module.exports = GenomeStore;

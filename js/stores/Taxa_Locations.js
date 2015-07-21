var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

// there is a bug in this file -- taxa_positions changes
// between redraws
// to recreate: comment out set_y_values() from payload.actionType === 'phylocanvas_changed'
// and when gubbins zooms / pans, the y-values get all screwd up
// i've had to hack it to update the y-values every time gubbins pans and zooms
// but clearly this shouldn't be necessary

var taxa_positions = [];
var activeTaxa = [];
var selectedTaxa = undefined;

var Taxa_Locations = assign({}, EventEmitter.prototype, {
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
		return taxa_positions;
	},

	getSelectedTaxa: function() {
		return selectedTaxa;
	},

	getTaxaY: function(listOfTaxaUnchecked) {
		// var listOfTaxa = listOfTaxaUnchecked;
		// the taxa coming in might be a subset of what's displayed by the tree
		// or they might be nothing!
		var listOfTaxa = []
		for (var i=0; i<listOfTaxaUnchecked.length; i++) {
			if (activeTaxa.indexOf(listOfTaxaUnchecked[i]) >= 0) {
				listOfTaxa.push(listOfTaxaUnchecked[i]);
			}
		}
		if (listOfTaxa.length===0) {
			return null; // DONT DISPLAY ANYTHING
		}

		if (listOfTaxa.length===1) {
			// blue
			return (taxa_positions[listOfTaxa[0]]);
		} else {
			// red
			var minmax = taxa_positions[listOfTaxa[0]];
			for (var i=1; i<listOfTaxa.length; i++) {
				if (taxa_positions[listOfTaxa[i]][1] > minmax[1]) {
					minmax[1] = taxa_positions[listOfTaxa[i]][1]
				}
				else if (taxa_positions[listOfTaxa[i]][0] < minmax[0]) {
					minmax[0] = taxa_positions[listOfTaxa[i]][0]
				}
			}
			return minmax
		}
	},

	loaded: function() {
		if (Object.keys(taxa_positions).length) {
			return true;
		}
		else {
			return false;
		}
	}

})


function set_y_values() {
	// console.log('[DEV] nodes selected --> set_y_values() in Taxa_Loactions store');

	var dummy_list_of_taxa = []; // dev only
	for (i=0; i<phylocanvas.leaves.length; i++) {
		dummy_list_of_taxa.push( phylocanvas.leaves[i].id );
	}
	activeTaxa = dummy_list_of_taxa;
	taxa_positions = []; // declared above. closure
	var translate = function(y) {
		// this. is. complicated.
		// i'm sort of undoing the translateClick function really
		y *= phylocanvas.zoom;
		y += phylocanvas.offsety;
		y += phylocanvas.canvas.canvas.height / 2;
		// y = y / phylocanvas. WHAT IS PIXELRATIO???? TO DO
		// y += // y = (y - getY(this.canvas.canvas) + window.pageYOffset); // account for positioning and scroll
		// y = y / 2; // RETINA PIXEL RATIO
		return y;
	};

	// var height_half = translate(phylocanvas.textSize/2);

	for (i=0; i<dummy_list_of_taxa.length; i++) {
		// var centery = translate(phylocanvas.branches[dummy_list_of_taxa[i]].centery);
		// taxa_positions[dummy_list_of_taxa[i]] = [centery-height_half, centery+height_half];
		taxa_positions[dummy_list_of_taxa[i]] = [translate(phylocanvas.branches[dummy_list_of_taxa[i]].miny), translate(phylocanvas.branches[dummy_list_of_taxa[i]].maxy)]
	}
};

// register this store with the dispatcher (here, not in actions)

Taxa_Locations.dispatchToken = Dispatcher.register(function(payload) {
// Dispatcher.register(function(payload) {
  if (payload.actionType === 'phylo_taxa_change') {
    get_taxa_and_y_coord();
    Taxa_Locations.emitChange();
  }
  // TESTING ONLY
  else if (payload.actionType === 'phylocanvas_changed') {
    set_y_values();
    Taxa_Locations.emitChange();
  }
  else if (payload.actionType === 'phylocanvas_loaded') {
    set_y_values();
    Taxa_Locations.emitChange();
  }
  else if (payload.actionType === 'phylocanvas_nodes_selected') {
  	selectedTaxa = payload.taxa.length===0 ? undefined : payload.taxa;
  	// console.log("Taxa_Loactions store: selected taxa: "+selectedTaxa)
  	// no need to emit a change, no view looks for this!
  }
})


module.exports = Taxa_Locations;

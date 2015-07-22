var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');

// there is a bug in this file -- taxa_positions changes
// between redraws
// to recreate: comment out set_y_values() from payload.actionType === 'phylocanvas_changed'
// and when gubbins zooms / pans, the y-values get all screwd up
// i've had to hack it to update the y-values every time gubbins pans and zooms
// but clearly this shouldn't be necessary

var taxa_positions = {};
var activeTaxa = [];
var selectedTaxa = undefined;

var Taxa_Locations = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		// console.log("taxa locations store emission")
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

		// console.log(listOfTaxa)
		if (listOfTaxa.length===0) {
			return null; // DONT DISPLAY ANYTHING
		}

		if (listOfTaxa.length===1) {
			// blue
			return (taxa_positions[listOfTaxa[0]]);
		} else {
			// red
			var minmax = [];
			minmax[0] = taxa_positions[listOfTaxa[0]][0];
			minmax[1] = taxa_positions[listOfTaxa[0]][1];
			// console.log('minmax', taxa_positions)
			for (var i=1; i<listOfTaxa.length; i++) {
				// console.log(taxa_positions[listOfTaxa[i]][0]+" -- "+taxa_positions[listOfTaxa[i]][1])
				if (taxa_positions[listOfTaxa[i]][1] > minmax[1]) {
					minmax[1] = taxa_positions[listOfTaxa[i]][1]
				}
				else if (taxa_positions[listOfTaxa[i]][0] < minmax[0]) {
					minmax[0] = taxa_positions[listOfTaxa[i]][0]
				}
			}
			// console.log(minmax)
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
	activeTaxa = new Array(); // dev only
	for (var i=0; i<phylocanvas.leaves.length; i++) {
		activeTaxa.push( phylocanvas.leaves[i].id );
	}
	taxa_positions = {}; // declared above. closure
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

	var height_half = phylocanvas.textSize/2 * phylocanvas.zoom;
	for (var i=0; i<activeTaxa.length; i++) {
		var centery = translate(phylocanvas.branches[activeTaxa[i]].centery);
		taxa_positions[activeTaxa[i]] = [centery-height_half, centery+height_half];
		// taxa_positions[activeTaxa[i]] = [translate(phylocanvas.branches[activeTaxa[i]].miny), translate(phylocanvas.branches[dummy_list_of_taxa[i]].maxy)]
	}
};

// register this store with the dispatcher (here, not in actions)

Taxa_Locations.dispatchToken = Dispatcher.register(function(payload) {
// Dispatcher.register(function(payload) {
  if (payload.actionType === 'phylo_taxa_change') {
    get_taxa_and_y_coord();
    Taxa_Locations.emitChange();
  }
  else if (payload.actionType === 'phylocanvas_changed') {
  	// a lot of this block is only necessary as phylocanvas has an action every fucking time
  	// we want to check if anything's actually changed
  	var old_activeTaxa = [] // old_activeTaxa is not a reference, it is a true copy
  	var old_minYvalues = []
  	for (var i=0; i<activeTaxa.length; i++) {
  		old_activeTaxa.push(activeTaxa[i])
  		old_minYvalues.push(taxa_positions[activeTaxa[i]][0])
  	}

    set_y_values();
    // Taxa_Locations.emitChange(); // now conditionally triggered -- see below

    // has the length of activeTaxa changed?
    if (old_activeTaxa.length!==activeTaxa.length) {
    	Taxa_Locations.emitChange();
    	return
    }
   	for (var i=0; i<old_activeTaxa.length; i++) {
   		// if new minY of taxaX != old minY then emit
   		if (taxa_positions[old_activeTaxa[i]][0] !== old_minYvalues[i] ) {
   			// console.log("taxa ",old_activeTaxa[i],old_minYvalues[i]," -> ",taxa_positions[old_activeTaxa[i]][0]," (i: ",i,")")
	    	Taxa_Locations.emitChange();
	    	return
   		}
  	}

  }
  else if (payload.actionType === 'phylocanvas_loaded') {
    set_y_values();
    Taxa_Locations.emitChange();
  }
  else if (payload.actionType === 'phylocanvas_nodes_selected') {
  	selectedTaxa = payload.taxa.length===0 ? undefined : payload.taxa;
  	// console.log("Taxa_Loactions store: selected taxa: "+selectedTaxa)
    Taxa_Locations.emitChange();

  }
})


module.exports = Taxa_Locations;

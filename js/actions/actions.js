
var Dispatcher = require('../dispatcher/dispatcher');

// user inputs trugger one of these functions (e.g. Actions.increase())
// and we send off a dispatch to be picked up by the dispatcher



module.exports = {
  increase: function() {
    Dispatcher.dispatch({
      actionType: 'counter-increment'
    });
  },

  startCanvas: function(canvasName) {
    Dispatcher.dispatch({
      actionType: 'turn-on-canvas',
      canvasName: canvasName
    });
  },

  stopCanvas: function(canvasName) {
    Dispatcher.dispatch({
      actionType: 'turn-off-canvas',
      canvasName: canvasName
    });
  },

  toggleCanvas: function(canvasName) {
    Dispatcher.dispatch({
      actionType: 'toggle-canvas',
      canvasName: canvasName
    });
  },

  loadTree: function(not_sure) {
    Dispatcher.dispatch({
      actionType: 'loadTree'
      // tree file? tree string? pass this information through the Dispatcher and to a store
    })
  },

  phylocanvas_subtree_drawn: function(nodeID) {
    console.log('[Action triggered] Subtree drawn from node '+nodeID+' and (but no store attached)');
    Dispatcher.dispatch({
      actionType: 'phylocanvas_subtree_drawn',
      nodeID: nodeID
    });
  },

  phylocanvas_nodes_selected: function(taxa) {
    console.log('[Action triggered] Nodes '+taxa+' selected (but no store attached)');
    Dispatcher.dispatch({
      actionType: 'phylocanvas_nodes_selected',
      taxa: taxa
    });
  },

  genome_pan: function(x) {
    // console.log('[Action triggered] Genome panned by '+x*100+'% of the canvas');
    Dispatcher.dispatch({
      actionType: 'genome_pan',
      fracCanvasPan: x
    });
  },

  genome_zoom: function(delta, fracInCanvas) {
    Dispatcher.dispatch({
      actionType: 'genome_zoom',
      delta: delta,
      fracInCanvas: fracInCanvas
    });
  },

  set_genome_length: function(x) {
    Dispatcher.dispatch({
      actionType: 'set_genome_length',
      x: x
    });
  },

  phylocanvas_changed: function(x) {
    Dispatcher.dispatch({
      actionType: 'phylocanvas_changed'
    });
  }


};


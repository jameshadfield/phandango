
var Dispatcher = require('../dispatcher/dispatcher');

// user inputs trugger one of these functions (e.g. Actions.increase())
// and we send off a dispatch to be picked up by the dispatcher



module.exports = {
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
    // console.log('[Action triggered] Subtree drawn from node '+nodeID+'');
    Dispatcher.dispatch({
      actionType: 'phylocanvas_subtree_drawn',
      nodeID: nodeID
    });
  },

  phylocanvas_nodes_selected: function(taxa) {
    // console.log('[Action triggered] Nodes '+taxa+' selected');
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
  },
  phylocanvas_loaded: function(x) {
    Dispatcher.dispatch({
      actionType: 'phylocanvas_loaded'
    });
  },

  // annotation_click: function(x,y) {
  //   // console.log("action triggered")
  //   Dispatcher.dispatch({
  //     actionType: 'annotation_click',
  //     mx: x,
  //     my: y
  //   });
  // },
  click: function(id, x, y) {
    // console.log("action triggered")
    Dispatcher.dispatch({
      actionType: 'click',
      id: id,
      mx: x,
      my: y
    });
  },

  selected_taxa_updated: function() {
    Dispatcher.dispatch({
      actionType: 'selected_taxa_updated'
    });
  },

  loadDefaultData: function() {
    Dispatcher.dispatch({
      actionType: 'loadDefaultData'
    });
  },

  files_dropped: function(files) {
    Dispatcher.dispatch({
      actionType: 'files_dropped',
      files: files
    });
  },


  save_plotYvalues: function(plotYvalues,plotName) {
    console.log("saving plot values. Length: ",plotYvalues.length)
    Dispatcher.dispatch({
      actionType: 'save_plotYvalues',
      plotYvalues: plotYvalues,
      plotName: plotName
    });
  },

  csvStringReceived: function(csvString) {
    Dispatcher.dispatch({
      actionType: 'csvStringReceived',
      csvString: csvString
    });
  }

};


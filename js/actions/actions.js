const Dispatcher = require('../dispatcher/dispatcher');

// user inputs trugger one of these functions (e.g. Actions.increase())
// and we send off a dispatch to be picked up by the dispatcher

module.exports = {
  phylocanvas_subtree_drawn: function (nodeID) {
    // console.log('[Action triggered] Subtree drawn from node '+nodeID+'');
    Dispatcher.dispatch({
      actionType: 'phylocanvas_subtree_drawn',
      nodeID: nodeID,
    });
  },

  phylocanvas_nodes_selected: function (taxa) {
    // console.log('[Action triggered] Nodes '+taxa+' selected');
    Dispatcher.dispatch({
      actionType: 'phylocanvas_nodes_selected',
      taxa: taxa,
    });
  },

  genome_pan: function (x) {
    // console.log('[Action triggered] Genome panned by '+x*100+'% of the canvas');
    Dispatcher.dispatch({
      actionType: 'genome_pan',
      fracCanvasPan: x,
    });
  },

  genome_zoom: function (delta, fracInCanvas) {
    Dispatcher.dispatch({
      actionType: 'genome_zoom',
      delta: delta,
      fracInCanvas: fracInCanvas,
    });
  },

  set_genome_length: function (x) {
    Dispatcher.dispatch({
      actionType: 'setGenomeLength',
      x: x,
    });
  },

  phylocanvas_changed: function () {
    Dispatcher.dispatch({
      actionType: 'phylocanvas_changed',
    });
  },

  phylocanvas_loaded: function () {
    Dispatcher.dispatch({
      actionType: 'phylocanvas_loaded',
    });
  },

  click: function (id, x, y) {
    // console.log("click in",id,"at x:",x,"y:",y)
    Dispatcher.dispatch({
      actionType: 'click',
      id: id,
      mx: x,
      my: y,
    });
  },

  selected_taxa_updated: function () {
    Dispatcher.dispatch({
      actionType: 'selected_taxa_updated',
    });
  },

  files_dropped: function (files) {
    Dispatcher.dispatch({
      actionType: 'files_dropped',
      files: files,
    });
  },

  save_plotYvalues: function (plotYvalues, plotName) {
    // console.log("saving plot values. Length: ",plotYvalues.length)
    Dispatcher.dispatch({
      actionType: 'save_plotYvalues',
      plotYvalues: plotYvalues,
      plotName: plotName,
    });
  },

  hereIsMetadata: function (data) {
    Dispatcher.dispatch({
      actionType: 'hereIsMetadata',
      data: data,
    });
  },

  toggleMetadataColumn: function (i) {
    // console.log("action picked up to toggle column, ", i)
    Dispatcher.dispatch({
      actionType: 'toggleMetadataColumn',
      colNumToToggle: i,
    });
  },

  toggleMetaDisplay: function (i) {
    // console.log("action picked up to toggle metadata display to ", i)
    Dispatcher.dispatch({
      actionType: 'toggleMetaDisplay',
      newDisplayBool: i,
    });
  },

  redrawAll: function () {
    Dispatcher.dispatch({
      actionType: 'redrawAll',
    });
  },
  sortRoary: function (x) {
    Dispatcher.dispatch({
      actionType: 'sortRoary',
      sortCode: x,
    });
  },

  loadDefaultData: function (x) {
    // console.log("ACTION: loadDefaultData",x);
    Dispatcher.dispatch({
      actionType: 'loadDefaultData',
      dataset: x,
    });
  },

  newErr: function (x) {
    Dispatcher.dispatch({
      actionType: 'newErr',
      errObj: x,
    });
  },

};


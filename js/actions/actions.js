
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
  }


};


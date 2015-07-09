
// already defined: dispatcher

// user inputs trugger one of these functions (e.g. Actions.increase())
// and we send off a dispatch to be picked up by the dispatcher

var Actions = {
  increase: function() {
    dispatcher.dispatch({
      actionType: 'counter-increment'
    });
  },

  startCanvas: function(canvasName) {
    dispatcher.dispatch({
      actionType: 'turn-on-canvas',
      canvasName: canvasName
    });
  },

  stopCanvas: function(canvasName) {
    dispatcher.dispatch({
      actionType: 'turn-off-canvas',
      canvasName: canvasName
    });
  },

  toggleCanvas: function(canvasName) {
    dispatcher.dispatch({
      actionType: 'toggle-canvas',
      canvasName: canvasName
    });
  },

  loadTree: function(not_sure) {
    dispatcher.dispatch({
      actionType: 'loadTree'
      // tree file? tree string? pass this information through the dispatcher and to a store
    })
  }


};

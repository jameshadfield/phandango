// TO DO: rewrite this like phylo.react.js (it's horrible at the moment)

var React = require('react');
var CanvasOracle = require('../stores/CanvasOracle.js');
var gubbins = require('../canvas/gubbins/main.gubbins.js');


var GubbinsCanvas = React.createClass({displayName: "displayName",

  getInitialState: function() {
 	  return {};
  },

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
    gubbinsInstance = new gubbins(this.getDOMNode());
  },


  render: function() {
    return React.createElement("canvas", {width: 600, height: 600, id:"gubbinsCanvas"}); //
  }
});


module.exports = GubbinsCanvas;

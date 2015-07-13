// TO DO: rewrite this like phylo.react.js (it's horrible at the moment)

var React = require('react');
var CanvasOracle = require('../stores/CanvasOracle.js');
var gubbins = require('../canvas/gubbins/main.gubbins.js');
var GubbinsCanvas = React.createClass({displayName: "displayName",

  getInitialState: function() {
 	  return {on: CanvasOracle.getAll()['gubbins']};
  },

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
  	CanvasOracle.addChangeListener(this._onChange_react);
  },

  //Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
  componentDidUpdate: function() {
  	if (this.state.on) {
	    // var context = this.getDOMNode().getContext('2d');
      var canvas = this.getDOMNode();
	    gubbinsInstance = new gubbins(canvas);
	   }
  },

  _onChange_react: function() {
	   this.setState({on: CanvasOracle.getAll()['gubbins']});
  },

 //  paint: function(context) {
 //  	context.save();
 //  	context.fillStyle = '#F00';
 //  	context.fillRect(50, 50, 100, 100);
 //  	context.restore();
 //  },

  render: function() {
  	// console.log("Rendering GubbinsCanvas. ON??? "+this.state.on)
  	if (this.state.on) {
  		return React.createElement("canvas", {width: 800, height: 800, id:"gubbinsCanvas"}); //
  	}
  	else {
  		return null
  	}
  }
});


module.exports = GubbinsCanvas;

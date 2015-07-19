
var React = require('react');
var gubbins = require('../canvas/gubbins/main.gubbins.js');
var RawDataStore = require('../stores/RawDataStore.js');


var GubbinsCanvas = React.createClass({displayName: "displayName",

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
  	// Canvas grid is set here, and we want this to be the same as the CSS...
  	// the CSS scales the canvas, but we have to set the correct width and height here as well
  	// see
    this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
    this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
    gubbinsInstance = new gubbins(this.getDOMNode());

    RawDataStore.addChangeListener(function() {
      console.log('gubbins.react responding to store emission')
      setTimeout(function() {gubbinsInstance.load(RawDataStore.getGFFs()[1]);},0)
    });
  },

  render: function() {
    return React.createElement("canvas", {id:"gubbinsCanvas"}); //
  }
});


module.exports = GubbinsCanvas;

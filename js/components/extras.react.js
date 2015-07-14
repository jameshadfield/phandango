
var React = require('react');
var annotationTrack = require('../canvas/annotation/main.annotations.js');
var small_genome = require('../canvas/small_genome/main.js');

var BlankDivAboveTree = React.createClass({displayName: "displayName",
  componentDidMount: function() { // Invoked once, immediately after the initial rendering
    this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
    this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
    smallGenomeInstance = new small_genome(this.getDOMNode());
  },

  render: function() {
    return React.createElement("canvas", {id:"BlankDivAboveTree"}); //
  }
});


var GenomeAnnotation = React.createClass({displayName: "displayName",

  // getInitialState: function() {
 	//   return {};
  // },

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
    this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
    this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
    annotationInstance = new annotationTrack(this.getDOMNode());
  },

  render: function() {
    return React.createElement("canvas", {id:"GenomeAnnotation"}); //
  }
});


module.exports = {'GenomeAnnotation': GenomeAnnotation, 'BlankDivAboveTree': BlankDivAboveTree};

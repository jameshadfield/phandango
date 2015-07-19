
var React = require('react');
var annotationTrack = require('../canvas/annotation/main.annotations.js');
var small_genome = require('../canvas/small_genome/main.js');
var RawDataStore = require('../stores/RawDataStore.js');

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

  componentDidMount: function() { // Invoked once, immediately after the initial rendering
    this.getDOMNode().setAttribute('width', window.getComputedStyle(this.getDOMNode()).width)
    this.getDOMNode().setAttribute('height', window.getComputedStyle(this.getDOMNode()).height)
    annotationInstance = new annotationTrack(this.getDOMNode());
    // at the moment no tree is "loaded"
    // we listen for an event from RawDataStore (i.e. tree file dropped)
    RawDataStore.addChangeListener(function() {
      console.log('extras.react responding to store emission')
      setTimeout(function() {annotationInstance.load(RawDataStore.getGFFs()[0]);},0)
    });

  },

  render: function() {
    return React.createElement("canvas", {id:"GenomeAnnotation"}); //
  }
});


module.exports = {'GenomeAnnotation': GenomeAnnotation, 'BlankDivAboveTree': BlankDivAboveTree};

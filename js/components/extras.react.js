
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
			var incomingData = RawDataStore.getData() // reference
			if ("gff" in incomingData) {
				// the following is added to the event loop else we get Dispatch errors
				// we need the nested functions as javascript doesn't have block scope
				// it only has function scope
				for (var i=0; i<incomingData["gff"].length; i++) {
					// console.log('extras.react respose -> event loop')
					setTimeout(function(j) {
						return function() {
							// console.log(incomingData["gff"][j].substring(0,100))
							annotationInstance.load(incomingData["gff"][j])
						}
					}(i), 0);
				}
			}
		});
	},

	render: function() {
		return React.createElement("canvas", {id:"GenomeAnnotation"}); //
	}
});


module.exports = {'GenomeAnnotation': GenomeAnnotation, 'BlankDivAboveTree': BlankDivAboveTree};

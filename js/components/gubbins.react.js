
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
            var incomingData = RawDataStore.getData() // reference
            if ("gff" in incomingData) {
                // the following is added to the event loop else we get Dispatch errors
                // we need the nested functions as javascript doesn't have block scope
                // it only has function scope
                for (var i=0; i<incomingData["gff"].length; i++) {
                    // console.log('gubbins.react respose -> event loop')
                    setTimeout(function(j) {
                        return function() {
                            // console.log(incomingData["gff"][j].substring(0,100))
                            gubbinsInstance.load(incomingData["gff"][j])
                        }
                    }(i), 0);
                }
            }
        });


	},

	render: function() {
		return React.createElement("canvas", {id:"gubbinsCanvas"}); //
	}
});


module.exports = GubbinsCanvas;

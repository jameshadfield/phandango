var React = require('react');
var annotationTrack = require('./annotation/main.annotations.js');
var small_genome = require('../canvas/small_genome/main.js');
var RawDataStore = require('../stores/RawDataStore.js');
var ReactDOM = require('react-dom');
var misc = require('./misc.js')

var SmallGenome = React.createClass({displayName: "displayName",
	componentDidMount: function() { // Invoked once, immediately after the initial rendering
	    misc.initCanvasXY(this);
		smallGenomeInstance = new small_genome(ReactDOM.findDOMNode(this));
	},
    render: function() {
        return (
            <canvas id="SmallGenome"  className="inContainer"></canvas>
        );
    }
});


var GenomeAnnotation = React.createClass({displayName: "displayName",
	componentDidMount: function() { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
		annotationInstance = new annotationTrack(ReactDOM.findDOMNode(this));
		annotationInstance.redraw();
	},
    render: function() {
        return (
            <canvas id="GenomeAnnotation"  className="inContainer"></canvas>
        );
    }
});


module.exports = {'GenomeAnnotation': GenomeAnnotation, 'SmallGenome': SmallGenome};

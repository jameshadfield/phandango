var ReactDOM = require('react-dom');
var React = require('react');
var gubbins = require('./genomic.canvas.js');
var graph = require('../../canvas/plots/main.plot.js');
var RawDataStore = require('../../stores/RawDataStore.js');
var misc = require('../misc.js')


var GenomicCanvasClass = React.createClass({displayName: "displayName",
	componentDidMount: function() { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
		gubbinsInstance = new gubbins(ReactDOM.findDOMNode(this));
        gubbinsInstance.redraw();
	},
	render: function() {
        return(
            <canvas id="gubbinsCanvas" className="inContainer"/>
        );
	}
});

var RecombGraphClass = React.createClass({displayName: "displayName",
    componentDidMount: function() { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
        var recombGraph = new graph(ReactDOM.findDOMNode(this), "recombGraph");
    },
    render: function() {
        return (
            <canvas id="recombGraphDiv" className="inContainer"></canvas>
        );
    }
});

module.exports = {'RecombGraphClass': RecombGraphClass, 'GenomicCanvasClass': GenomicCanvasClass};



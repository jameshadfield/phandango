var ReactDOM = require('react-dom');
var React = require('react');
var gubbins = require('./genomic.canvas.js');
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

module.exports = {'GenomicCanvasClass': GenomicCanvasClass};



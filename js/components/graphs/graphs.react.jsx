var ReactDOM = require('react-dom');
var React = require('react');
var misc = require('../misc.js'); // basic functions
// GRAPHS
var Graph    = require('./graphs.js');

var RecombGraphClass = React.createClass({displayName: "displayName",
    componentDidMount: function() { // Invoked once, immediately after the initial rendering
        misc.initCanvasXY(this);
        var graph = new Graph(ReactDOM.findDOMNode(this));
    },
    render: function() {
        return (
            <canvas id="recombGraphDiv" className="inContainer"></canvas>
        );
    }
});


module.exports = RecombGraphClass;


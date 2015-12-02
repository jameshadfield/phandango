const ReactDOM = require('react-dom');
const React = require('react');
const misc = require('../misc.js'); // basic functions
// GRAPHS
const Graph = require('./graphs.js');

const RecombGraphClass = React.createClass({ displayName: 'displayName',
  componentDidMount: function () { // Invoked once, immediately after the initial rendering
    misc.initCanvasXY(this);
    const graph = new Graph(ReactDOM.findDOMNode(this)); // eslint-disable-line no-unused-vars
  },
  render: function () {
    return (
        <canvas id="recombGraphDiv" className="inContainer"></canvas>
    );
  },
});


module.exports = RecombGraphClass;


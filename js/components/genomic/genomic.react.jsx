const ReactDOM = require('react-dom');
const React = require('react');
const Gubbins = require('./genomic.canvas.js');
const misc = require('../misc.js');

const GenomicCanvasClass = React.createClass({ displayName: 'displayName',
  componentDidMount: function () { // Invoked once, immediately after the initial rendering
    misc.initCanvasXY(this);
    const gubbinsInstance = new Gubbins(ReactDOM.findDOMNode(this));
    gubbinsInstance.redraw();
  },
  render: function () {
    return (
      <canvas id="gubbinsCanvas" className="inContainer"/>
    );
  },
});

module.exports = { GenomicCanvasClass: GenomicCanvasClass };



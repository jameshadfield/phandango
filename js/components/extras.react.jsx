const React = require('react');
const SmallGenomeApp = require('../canvas/small_genome/main.js');
const ReactDOM = require('react-dom');
const misc = require('./misc.js');

export class SmallGenome extends React.Component {
  constructor(...args) {
    super(...args);
  }
  componentDidMount() {
    misc.initCanvasXY(this);
    const smallGenomeInstance = new SmallGenomeApp(ReactDOM.findDOMNode(this)); // eslint-disable-line no-unused-vars
  }
  render() {
    return (
      <canvas id="SmallGenome"  className="inContainer"></canvas>
    );
  }
}

module.exports = {
  SmallGenome: SmallGenome,
};

const React = require('react');
// const AnnotationTrack = require('./annotation/main.annotations.js');
const SmallGenomeApp = require('../canvas/small_genome/main.js');
const ReactDOM = require('react-dom');
const misc = require('./misc.js');

const SmallGenome = React.createClass({ displayName: 'displayName',
  componentDidMount: function () { // Invoked once, immediately after the initial rendering
    misc.initCanvasXY(this);
    const smallGenomeInstance = new SmallGenomeApp(ReactDOM.findDOMNode(this)); // eslint-disable-line no-unused-vars
  },
  render: function () {
    return (
      <canvas id="SmallGenome"  className="inContainer"></canvas>
    );
  },
});


// const GenomeAnnotation = React.createClass({ displayName: 'displayName',
//   componentDidMount: function () { // Invoked once, immediately after the initial rendering
//     misc.initCanvasXY(this);
//     const annotationInstance = new AnnotationTrack(ReactDOM.findDOMNode(this));
//     annotationInstance.redraw();
//   },
//   render: function () {
//     return (
//       <canvas id="GenomeAnnotation"  className="inContainer"></canvas>
//     );
//   },
// });

module.exports = {
  // GenomeAnnotation: GenomeAnnotation,
  SmallGenome: SmallGenome,
};

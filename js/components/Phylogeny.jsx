import React from 'react';
import ReactDOM from 'react-dom';
import { setYValues } from '../actions/phylocanvasBridge';
import { computeSubLineGraph } from '../actions/lineGraph';
import PhyloCanvas from 'phylocanvas';
import ContextMenuPlugin from 'phylocanvas-plugin-context-menu';
PhyloCanvas.plugin(ContextMenuPlugin);


export const Phylogeny = React.createClass({
  propTypes: {
    newickString: React.PropTypes.string,
    style: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
  },

  componentDidMount: function () {
    this.phylocanvas = PhyloCanvas.createTree(ReactDOM.findDOMNode(this), { fillCanvas: true });
    this.phylocanvas.setTreeType('rectangular');
    this.phylocanvas.setNodeSize(0);
    this.phylocanvas.nodeAlign = true;
    this.phylocanvas.padding = 0;
    this.phylocanvas.resizeToContainer();
    this.attachListenersToPhylocanvas(this.props.dispatch);
    window.addEventListener('pdf', this.svgdraw, false);
    if (this.props.newickString) {
      this.phylocanvas.load(this.props.newickString);
    }
  },

  componentWillUpdate(props) {
    if (props.newickString) {
      this.phylocanvas.load(props.newickString);
    }
  },

  componentDidUpdate() {
    // this.phylocanvas.resizeToContainer();
    this.phylocanvas.draw(true);  // forces phylocanvas.fitInPanel()
  },

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
  },

  render: function () {
    return (
      <div style={this.props.style} id="phyloDiv"></div>
    );
  },

  svgdraw() {
    function setCanvasToBranches(branch, newCanvas) {
      branch.canvas = newCanvas;
      for (let i = 0; i < branch.children.length; i++) {
        setCanvasToBranches(branch.children[i], newCanvas);
      }
    }

    this.canvasPos = this.phylocanvas.canvas.canvas.getBoundingClientRect();
    // console.log("printing tree (SVG)");

    window.svgCtx.save();
    const tempPhylocanvas = this.phylocanvas.canvas;
    const currentWidth = window.svgCtx.width;
    const currentHeight = window.svgCtx.height;
    this.phylocanvas.canvas = window.svgCtx;

    // Have to change the font to Helvetica or it won't open in Illustrator
    this.phylocanvas.font = 'Helvetica';

    // Have to change the sie of the canvas so that phylocanvas draws the tree the right shape
    this.phylocanvas.canvas.width = this.canvasPos.width;
    this.phylocanvas.canvas.height = this.canvasPos.height;
    // Translate and slip must happen after phylocanvas clears the rectangle, so has been added to this.phylocanvas.draw code

    this.phylocanvas.canvas.translate(this.canvasPos.left, this.canvasPos.top);
    // const current = this.phylocanvas.canvas.__closestGroupOrSvg();
    // const transform = current.getAttribute('transform');
    this.phylocanvas.canvas.rect(0, 0, this.canvasPos.width, this.canvasPos.height);
    this.phylocanvas.canvas.stroke();
    this.phylocanvas.canvas.clip();
    // this.phylocanvas.canvas.__addTransform(transform);

    setCanvasToBranches(this.phylocanvas.root, this.phylocanvas.canvas);
    this.phylocanvas.canvas.canvas.onselectstart = function () {
      return false;
    };
    this.phylocanvas.canvas.fillStyle = '#000000';
    this.phylocanvas.canvas.strokeStyle = '#000000';
    this.phylocanvas.canvas.save();
    this.phylocanvas.branchColour = 'black';

    this.phylocanvas.draw(true, true, this.canvasPos.left, this.canvasPos.top, this.canvasPos.width, this.canvasPos.height);

    window.svgCtx.restore();
    // Need to restore the size of the canvas
    window.svgCtx.width = currentWidth;
    window.svgCtx.height = currentHeight;

    this.phylocanvas.canvas = tempPhylocanvas;
    setCanvasToBranches(this.phylocanvas.root, this.phylocanvas.canvas);
  },

  attachListenersToPhylocanvas: function (dispatch) {
    // once phylocanvas is live we want to have a bunch of listeners which, when subtrees e.t.c. are selected they will update the store Taxa_Locations
    // or when zoom happens then we should do the same!
    // we update the store by listening to an event, triggering an action, dispatching the action e.t.c. (FLUX)

    // can we not use ref here, instead of document.getElem... ??

    document.getElementById('phyloDiv').addEventListener('updated', function (e) {
      if (e.property === 'selected') {
        dispatch(computeSubLineGraph(e.nodeIds));
        // dispatch(setYValues(this.phylocanvas));
      }
    }, false);

    document.getElementById('phyloDiv').addEventListener('subtree', (e) => {
      // console.log('TO DO: subtree drawn. e:', e);
      dispatch(setYValues(this.phylocanvas));
    }, false);

    document.getElementById('phyloDiv').addEventListener('loaded', () => {
      dispatch(setYValues(this.phylocanvas));
    }, false);

    // phylocanvas should trigger an event when it
    // actually redraws something
    // but we check for changes in the dispatch
    this.phylocanvas.on('mousewheel', () => {
      dispatch(setYValues(this.phylocanvas));
    });
    this.phylocanvas.on('mousemove', () => {
      dispatch(setYValues(this.phylocanvas));
    });
  },

});


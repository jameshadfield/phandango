import React from 'react';
import ReactDOM from 'react-dom';
import { setYValues } from '../actions/phylocanvasBridge';
import { computeSubLineGraph, updateLineGraphData } from '../actions/lineGraph';
import PhyloCanvas from 'phylocanvas';
import ContextMenuPlugin from 'phylocanvas-plugin-context-menu';
import isEqual from 'lodash/isEqual';
PhyloCanvas.plugin(ContextMenuPlugin);

export const Phylogeny = React.createClass({
  propTypes: {
    newickString: React.PropTypes.string,
    style: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
    active: React.PropTypes.object.isRequired,
  },

  // getInitialState: function () {
  //   return ({ shouldFitToPanel: false });
  // },

  componentDidMount: function () {
    // console.log('phylocanvas did mount -- loading in tree!');
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

  componentWillReceiveProps(nextProps) {
    // fires before shouldComponentUpdate
    // console.log('PC will receive props');
    // we only need to re-draw phylocanvas here (pre DOM mutation) if
    // a new newick string
    if (!isEqual(nextProps.newickString, this.props.newickString)) {
      // console.log('PC will receive props -> loading new newick string');
      this.phylocanvas.load(nextProps.newickString);
      this.props.dispatch(setYValues(this.phylocanvas));
    // } else if (!isEqual(nextProps.active, this.props.active)) {
      // console.log('PC will receive props -> active panels changed');
      // ideally this would be in componentDidUpdate
      // but then we can't compare props!
      // window.requestAnimationFrame(this.resizePhylocanvas);
      // solution: modify state
      // this.setState({ shouldFitToPanel: true });
    }
  },

  shouldComponentUpdate(nextProps) {
    // we only need to re-render phylocanvas when
    // the div style (percentages) change
    // or when the window is resized
    if (!isEqual(this.props.style, nextProps.style)) {
      // console.log('phylocanvas. style change -> should update: true');
      return true;
    }
    // console.log('phylocanvas. new props but no style change -> should update: false');
    return false;
  },

  // componentDidUpdate() {
  //   // console.log('phylocanvas did update');
  //   if (this.state.shouldFitToPanel) {
  //     window.requestAnimationFrame(this.resizePhylocanvas);
  //   }
  //   this.setState({ shouldFitToPanel: false }); // no infinite loop as shouldComponentUpdate ret false
  // },

  componentDidUpdate() {
    // console.log('phylocanvas did update');
    window.requestAnimationFrame(this.resizePhylocanvas);
  },

  componentWillUnmount() {
    window.removeEventListener('pdf', this.svgdraw, false);
  },

  render: function () {
    // console.log('phylocanvas DOM render');
    return (
      <div style={this.props.style} id="phyloDiv"></div>
    );
  },

  resizePhylocanvas() {
    // console.log('phylocanvas fit to panel');
    // this.phylocanvas.resizeToContainer();
    this.phylocanvas.draw(true); // true -> fitToPanel (i think)
    this.props.dispatch(setYValues(this.phylocanvas));
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

    // console.log('old device pixel ratio:', window.devicePixelRatio);
    // console.log('old PC backing store pixel ratio:', this.phylocanvas.canvas.canvas.backingStorePixelRatio);
    // this.phylocanvas.canvas.backingStorePixelRatio = 1;
    const oldWindowDevicePixelRatio = window.devicePixelRatio;
    window.devicePixelRatio = 1;

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
    window.devicePixelRatio = oldWindowDevicePixelRatio;
    setCanvasToBranches(this.phylocanvas.root, this.phylocanvas.canvas);
    this.phylocanvas.draw(true);
  },

  attachListenersToPhylocanvas: function (dispatch) {
    // once phylocanvas is live we want to have a bunch of listeners which, when subtrees e.t.c. are selected they will update the store Taxa_Locations
    // or when zoom happens then we should do the same!
    // we update the store by listening to an event, triggering an action, dispatching the action e.t.c. (FLUX)

    // can we not use ref here, instead of document.getElem... ??

    document.getElementById('phyloDiv').addEventListener('updated', function (e) {
      if (e.property === 'selected') {
        dispatch(computeSubLineGraph(e.nodeIds));
      }
    }, false);

    document.getElementById('phyloDiv').addEventListener('originalTreeRedrawn', function (e) {
      // for some unknown reason, this.phylocanvas is undefined here. WTF.
      dispatch(setYValues(e));
      dispatch(updateLineGraphData());
    }, false);

    document.getElementById('phyloDiv').addEventListener('subtree', (e) => {
      // console.log('TO DO: subtree drawn. e:', e);
      dispatch(setYValues(this.phylocanvas));
      dispatch(updateLineGraphData());
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


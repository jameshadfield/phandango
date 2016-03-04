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

  render: function () {
    return (
      <div style={this.props.style} id="phyloDiv"></div>
    );
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


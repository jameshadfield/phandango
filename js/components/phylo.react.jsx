var React = require('react');
var ReactDOM = require('react-dom');
var Actions = require('../actions/actions.js');
var RawDataStore = require('../stores/RawDataStore.js');
var RawDataStore = require('../stores/RawDataStore.js');
var PhyloCanvas = require('PhyloCanvas').default;
var ContextMenuPlugin = require('phylocanvas-plugin-context-menu').default;
PhyloCanvas.plugin(ContextMenuPlugin);




var PhyloReact = React.createClass({displayName: "displayName",

	componentDidMount: function() { // Invoked once, immediately after the initial rendering
		// initialise phylocanvas and basic info about how we want the tree to look
		phylocanvas = PhyloCanvas.createTree(ReactDOM.findDOMNode(this)) //GLOBAL
		phylocanvas.setTreeType('rectangular')
		phylocanvas.nodeAlign = true;
		this.attachListenersToPhylocanvas()
		// phylocanvas.load(RawDataStore.getParsedData('tree'))
		RawDataStore.addChangeListener(this.loadTree);

	},

	loadTree: function() {
		var treeData = RawDataStore.getParsedData('tree')
		if (treeData) {
			phylocanvas.load(treeData)
		}
	},


	shouldComponentUpdate: function() {return false},

	attachListenersToPhylocanvas: function () {
		// once phylocanvas is live we want to have a bunch of listeners which, when subtrees e.t.c. are selected they will update the store Taxa_Locations
		// or when zoom happens then we should do the same!
		// we update the store by listening to an event, triggering an action, dispatching the action e.t.c. (FLUX)

		document.getElementById("phyloDiv").addEventListener('updated', function(e){if (e.property=='selected') Actions.phylocanvas_nodes_selected(e.nodeIds)}, false);

		document.getElementById("phyloDiv").addEventListener('subtree', function(e){Actions.phylocanvas_subtree_drawn(e.node)}, false);

		document.getElementById("phyloDiv").addEventListener('loaded', function(e){Actions.phylocanvas_loaded()}, false);

		// the following is not ideal
		// following commit 835228f222e2917d22b31ade17b6ccc79cd1721f
		// phylocanvas should trigger an event when it actually redraws something
		phylocanvas.on('mousewheel', function(){
			Actions.phylocanvas_changed()
		})
		phylocanvas.on('mousemove', function(){
			Actions.phylocanvas_changed()
		})

	},
	render: function() {
        return(
            <div id="phyloDiv" className="inContainer"></div>
        );
	}
});

module.exports = PhyloReact;

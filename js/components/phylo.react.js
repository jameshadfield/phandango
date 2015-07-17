
var React = require('react');
var PhyloStore = require('../stores/Phylo.js');
var PhyloCanvas = require('../static/PhyloCanvas.js');
var Actions = require('../actions/actions.js');

var PhyloReact = React.createClass({displayName: "displayName",
	getInitialState: function() {
		return {tree_string : PhyloStore.getAll()};
	},

	componentDidMount: function() { // Invoked once, immediately after the initial rendering
		// if anything ever changed in PhyloStore then we could make it do something...
		// PhyloStore.addChangeListener(this._onChange_phylo_react);
		this._start_phylocanvas()

	},

	_start_phylocanvas: function() {
		// global_div_object = this.getDOMNode();
		phylocanvas = new PhyloCanvas.Tree(this.getDOMNode()) //GLOBAL
		phylocanvas.setTreeType('rectangular')
		phylocanvas.nodeAlign = true;
		// console.log("phylocanvas should be live on div... ")
		// console.log(this.getDOMNode())
		// console.log(phylocanvas)
		this.attachListenersToPhylocanvas()
		phylocanvas.load(this.state.tree_string);

	},


	attachListenersToPhylocanvas: function () {
		// once phylocanvas is live we want to have a bunch of listeners which, when subtrees e.t.c. are selected they will update the store Taxa_Locations
		// or when zoom happens then we should do the same!
		// we update the store by listening to an event, triggering an action, dispatching the action e.t.c. (FLUX)

		document.getElementById("phyloDiv").addEventListener('selected', function(e){Actions.phylocanvas_nodes_selected(e.nodeIds)}, false);

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

	// _onChange_phylo_react: function() {
	//  null; // nothing yet
	// },

	render: function() {
		return React.createElement("div", {id: "phyloDiv"});
	}
});

module.exports = PhyloReact;

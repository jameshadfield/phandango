
var React = require('react');
var RawDataStore = require('../stores/RawDataStore.js');
var PhyloCanvas = require('../static/PhyloCanvas.js');
var Actions = require('../actions/actions.js');

var PhyloReact = React.createClass({displayName: "displayName",

	componentDidMount: function() { // Invoked once, immediately after the initial rendering
		// initialise phylocanvas and basic info about how we want the tree to look
		phylocanvas = new PhyloCanvas.Tree(this.getDOMNode()) //GLOBAL
		phylocanvas.setTreeType('rectangular')
		phylocanvas.nodeAlign = true;
		this.attachListenersToPhylocanvas()
		// at the moment no tree is "loaded"
		// we listen for an event from RawDataStore (i.e. tree file dropped)
		RawDataStore.addChangeListener(function() {
			var incomingData = RawDataStore.getData() // reference
			// console.log(incomingData)
			// what are we being given? a tree?
			if ("tre" in incomingData) {
				console.log('phylo.react respose -> event loop')
				if (incomingData["tre"].length>1) {
					console.error("More than one tree file added!")
				}
				// the following is added to the event loop else we get Dispatch errors
				setTimeout(function() {phylocanvas.load(incomingData["tre"][0])},0);
			}
			// setTimeout(function() {phylocanvas.load(RawDataStore.getTrees()[0]);},0);
		});
	},

	shouldComponentUpdate: function() {return false},

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

	render: function() {
		return React.createElement("div", {id: "phyloDiv"});
	}
});

module.exports = PhyloReact;


var PhyloReact = React.createClass({displayName: "displayName",
	getInitialState: function() {
		return {tree_string : PhyloStore.getAll()};
	},

 componentDidMount: function() { // Invoked once, immediately after the initial rendering
	PhyloStore.addChangeListener(this._onChange_phylo_react);
  this._start_phylocanvas()
},

 _start_phylocanvas: function() {
    // global_div_object = this.getDOMNode();
		phylocanvas = new PhyloCanvas.Tree(this.getDOMNode()) //GLOBAL
		phylocanvas.load(this.state.tree_string);
		phylocanvas.setTreeType('rectangular')
		phylocanvas.nodeAlign = true;
		console.log("phylocanvas should be live on div... ")
    console.log(this.getDOMNode())
    console.log(phylocanvas)
 },

 _onChange_phylo_react: function() {
	 null; // nothing yet
 },

 render: function() {
		return React.createElement("div", {width:400, height: 800,id: "phyloDiv"});
	}
});

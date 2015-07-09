// canvas stuff here: http://jsfiddle.net/JMZc5/1/


function getCountState() {
	return {
		count: SimpleStore.getAll()
	};
}


var Main_React_Element = React.createClass({displayName: "Main_React_Element",

	render: function() {
		return (
			React.createElement("div", {className: "main_react_element"},
				React.createElement(ButtonPanel, null),
				// now time for the two canvases (gubbins + phylo)
				// how to get them to line up constantly? who knows
				// React.createElement("div", null,
 				   React.createElement(React_Live_Canvases, null),
				   React.createElement(GubbinsCanvas,null) // should be injected by the button
				// )
			)
		);
	}
});

// here is a class which has knowledge about what canvases are active (via CanvasOracle store)
// when triggered (instantiated?) it returns Elements of the respective react classes
var React_Live_Canvases = React.createClass({
	getInitialState: function() {
		return {canvas_on_off: CanvasOracle.getAll()}
	},
	componentDidMount: function() { // Invoked once, immediately after the initial rendering
		CanvasOracle.addChangeListener(this._onChange_react);
	},
 	_onChange_react: function() {
		this.setState({canvas_on_off: CanvasOracle.getAll()});
  	},
 	render: function() {
 		// console.log("React_Live_Canvases render triggered. State is: ")
 		// console.log(this.state)
 		if (this.state.canvas_on_off.phylo) {
 			// console.log("Triggering phylo react component")
 			return( React.createElement(PhyloReact,null) )
 		} else {
 			return null;
 		}
 	}
});







React.render(React.createElement(Main_React_Element, null), document.getElementById('react') );


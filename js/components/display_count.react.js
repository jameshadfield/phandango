
function getCountState() {
	return {
		count: SimpleStore.getAll()
	};
}


var A_React_Element = React.createClass({displayName: "A_React_Element",

	getInitialState: function() {
		return getCountState();
	},

	// register an event listener in SimpleStore using it's method componentDidMount(),
	componentDidMount: function() {
		SimpleStore.addChangeListener(this._onChange_react);
	},

	_onChange_react: function() {
		this.setState(getCountState());
	},


	render: function() {
		return (
			React.createElement("div", {className: "a_react_element"},
				React.createElement("h1", null, "Current number: "+this.state.count)
				)
			);
	}

});


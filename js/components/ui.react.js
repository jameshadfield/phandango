
var React = require('react');
var SimpleStore = require('../stores/simple_counter.js');
var Actions = require('../actions/actions.js');

var ButtonPanel = React.createClass({
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
			React.createElement("div", null,
				React.createElement(ButtonToPress, {current_state: this.state.count}),
				React.createElement("h1",null,""),
				React.createElement(LaunchGubbinsCanvasButton, null),
				React.createElement(LaunchPhyloCanvasButton, null),
				React.createElement("h1",null,"")
			)
		)
	}

});


function getCountState() {
	return {
		count: SimpleStore.getAll()
	};
}

var ButtonToPress = React.createClass({
	handleClick: function() {
		Actions.increase();
	},
	render: function() {
		return (
			React.createElement("button", {onClick: this.handleClick}, "current number: "+this.props.current_state)
		);
	}
});

var LaunchGubbinsCanvasButton = React.createClass({
	handleClick: function() {
		Actions.toggleCanvas('gubbins');
	},
	render: function() {
		return (
			React.createElement("button", {onClick: this.handleClick}, "TOGGLE GUBBINS CANVAS")
		);
	}
});

var LaunchPhyloCanvasButton = React.createClass({
	handleClick: function() {
		Actions.toggleCanvas('phylo');
	},
	render: function() {
		return (
			React.createElement("button", {onClick: this.handleClick}, "TOGGLE PHYLOCANVAS")
		);
	}
});

module.exports = ButtonPanel;


var React = require('react');
var Actions = require('../actions/actions.js');

var ButtonPanel = React.createClass({
	render: function() {
		return (
			React.createElement("div", null,
				React.createElement("h1",null,""),
				React.createElement(LaunchGubbinsCanvasButton, null),
				React.createElement(LaunchPhyloCanvasButton, null),
				React.createElement(LaunchAnnotationButton, null),
				React.createElement("h1",null,"")
			)
		)
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

var LaunchAnnotationButton = React.createClass({
	handleClick: function() {
		Actions.toggleCanvas('annotation');
	},
	render: function() {
		return (
			React.createElement("button", {onClick: this.handleClick}, "TOGGLE ANNOTATION")
		);
	}
});

module.exports = ButtonPanel;

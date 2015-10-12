var React = require('react');



var notChrome = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<div className="fullpage">
				<h1>JScandy only works in Chrome</h1>
				<p>Sorry :(</p>
				<p><a href="https://www.google.com/chrome/browser/desktop/">Download Chrome here</a></p>
			</div>
		);
	}
});


module.exports = notChrome;



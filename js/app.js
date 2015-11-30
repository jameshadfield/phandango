// This file bootstraps the entire application.
(function () {
	var React = require('react');
	var ReactDOM = require('react-dom');
	var Main_React_Element = require('./components/main.react.jsx')
	var injectTapEventPlugin = require('react-tap-event-plugin');
	injectTapEventPlugin()

	window.React = React; // for react chrome extension debugger

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


	// test to see if the user is using chrome
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		ReactDOM.render(React.createElement(Main_React_Element, null), document.getElementById('react') );
	} else {
		ReactDOM.render(React.createElement(notChrome, null), document.getElementById('react') );
	}
})();

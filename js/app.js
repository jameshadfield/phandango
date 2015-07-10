

// This file bootstraps the entire application.

var React = require('react');
// var dispatcher = new Dispatcher();
var Main_React_Element = require('./components/main.react.js')

React.render(React.createElement(Main_React_Element, null), document.getElementById('react') );

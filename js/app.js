

// This file bootstraps the entire application.

var React = require('react');
// var dispatcher = new Dispatcher();
var Main_React_Element = require('./components/main.react.js')

// not sure if we should be loading stores here (maybe a react component should do it?
var Taxa_Locations = require('./stores/Taxa_Locations.js')

React.render(React.createElement(Main_React_Element, null), document.getElementById('react') );


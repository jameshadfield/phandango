
// the following just for development //
globalLog = {'redraw_gubbins':0, 'redraw_annotation':0, 'redraw_small_genome':0, 'redraw_phylocanvas':0}


// This file bootstraps the entire application.

var React = require('react');
// var dispatcher = new Dispatcher();
var Main_React_Element = require('./components/main.react.jsx')

// not sure if we should be loading stores here (maybe a react component should do it?
var Taxa_Locations = require('./stores/Taxa_Locations.js')

React.render(React.createElement(Main_React_Element, null), document.getElementById('react') );

// developent only // see above //
// setInterval

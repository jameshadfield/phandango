var Actions = require('../actions/actions.js');
var React = require('react');
var Settings = require('./settings.react.jsx');

// LISTEN FOR KEY AND TOGGLE SETTINGS DIV / LANDING DIVS
// http://stackoverflow.com/questions/11101364/javascript-detect-shift-key-down-within-another-function
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// these should all be actions, but why should a store carry this out? i guess that could store state

var showSettings = false;
var showLanding = false;

var keyPressed = function(event){
    if (event.keyCode === 83 || event.charCode === 83){
        // console.log("s key hit and is now ",showSettings)
        showSettings = !showSettings;
        showSettings ? React.render(<Settings />, document.getElementById('settingsContainer')) : React.unmountComponentAtNode(document.getElementById('settingsContainer'));
    }
};
window.addEventListener ? document.addEventListener('keyup', keyPressed) : document.attachEvent('keyup', keyPressed);


var Actions = require('../actions/actions.js');
var React = require('react');
var Settings = require('./settings.react.jsx');
var Landing = require('./landing.react.jsx');


// LISTEN FOR KEY AND TOGGLE SETTINGS DIV / LANDING DIVS
// http://stackoverflow.com/questions/11101364/javascript-detect-shift-key-down-within-another-function
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// these should all be actions, but why should a store carry this out? i guess that could store state

var showSettings = false;
var showLanding = true;

var keyPressed = function(event){

	// s -> show / hide settings
    if ( (event.keyCode === 83 || event.charCode === 83) && !showLanding){
        showSettings = !showSettings;
        showSettings ? React.render(<Settings />, document.getElementById('settingsContainer')) : React.unmountComponentAtNode(document.getElementById('settingsContainer'));
    }
    // d -> load default data
    else if ( (event.keyCode === 68 || event.charCode === 68) && !showSettings && !showLanding) {
       Actions.loadDefaultData();
    }
	// l -> show / hide landing page
    else if ( ( event.keyCode === 76 || event.charCode === 76 ) && !showSettings){
        showLanding = !showLanding;
        // console.log("l key hit. Landing page should be ",showLanding)
        showLanding ? React.render(<Landing />, document.getElementById('landingContainer')) : React.unmountComponentAtNode(document.getElementById('landingContainer'));
    }
};



window.addEventListener ? document.addEventListener('keyup', keyPressed) : document.attachEvent('keyup', keyPressed);

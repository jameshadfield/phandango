import '../css/JScandy.css';
import React from 'react';
import ReactDOM from 'react-dom';
const MainReactElement = require('./components/main.react.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

window.React = React; // for react chrome extension debugger

const notChrome = React.createClass({ displayName: 'displayName',
  render: function () {
    return (
      <div className="fullpage">
        <h1>JScandy only works in Chrome</h1>
        <p>Sorry :(</p>
        <p><a href="https://www.google.com/chrome/browser/desktop/">Download Chrome here</a></p>
      </div>
    );
  },
});


// test to see if the user is using chrome
if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
  ReactDOM.render(React.createElement(MainReactElement, null), document.getElementById('react') );
} else {
  ReactDOM.render(React.createElement(notChrome, null), document.getElementById('react') );
}

import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { UnsupportedBrowser } from '../components/UnsupportedBrowser';
import { getBrowser } from '../misc/helperFunctions';


// const browser = getBrowser();
// console.log(browser);
// let elements;
//
// if (browser.mobile) {
//   window.ga('send', 'pageview', '/unsupportedBrowser');
//   elements = <UnsupportedBrowser msg="mobile devices are not yet supported"/>;
// } else if (browser.name === 'Firefox' && browser.version < 45) {
//   window.ga('send', 'pageview', '/unsupportedBrowser');
//   const msg = 'Firefox is only supported for versions 45 and above (you have version ' + browser.version.toString() + ')';
//   elements = <UnsupportedBrowser msg={msg}/>;
// } else {
//   const store = configureStore();
//   const ConnectedMainReactElement = connect((state)=>({
//     page: state.router,
//     spinner: state.spinner,
//   }))(MainReactElement);
//
//   let browserMessage = null;
//   if ([ 'Chrome', 'Safari', 'Firefox' ].indexOf((browser.name)) === -1) {
//     browserMessage = browser.name + ' version ' + browser.version.toString();
//   }

// if (navigator.userAgent.match(/WebKit/i)) {
//   window.ga('send', 'pageview', '/unsupportedBrowser');
//   elements = <UnsupportedBrowser msg="mobile devices are not yet supported"/>;
// }

class MonitorUnconnected extends React.Component {
  constructor(props) {
    super(props);
    console.log("Monitor online")
    console.log(this.props.layout)
  }

  render() {
    return null;
  }
}

const Monitor = connect(
  (state)=>({
    layout: state.layout
  })
)(MonitorUnconnected);


export default Monitor;

/* efforts to get fonts working... i think (SH16)
// function base64ToArrayBuffer(base64) {
//   const binaryString =  window.atob(base64);
//   const len = binaryString.length;
//   const bytes = new Uint8Array( len );
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

// function registerFonts() {
//   window.pdfdoc.registerFont('Lato-Light', base64ToArrayBuffer(require("base64!../../font/lato/Lato-Light.ttf")));
// }


// import pdfkit from 'pdfkit';
// import pdfkit from 'transform?brfs!pdfkit';

// let window.pdfdoc;

// const xhr = new XMLHttpRequest();
// xhr.open("GET", "/font/lato/Lato-Light.ttf", true);
// xhr.responseType = "arraybuffer";
// let latoFont;
// xhr.onload = function(oEvent) {
//     latoFont = xhr.response; // Note: not xhr.responseText
// };

// xhr.send(null);

*/
// ents = <UnsupportedBrowser msg={msg}/>;

import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { UnsupportedBrowser } from '../components/UnsupportedBrowser';
import { getBrowser } from '../misc/helperFunctions';
import { Spinner } from '../components/spinner';
import { notificationNew, notificationSeen, checkLoadedDataIsComplete } from '../actions/notifications';
import { goToPage, toggleMetaKey, showBlocks, increaseSpinner } from '../actions/general';
import { incomingFile } from '../actions/fileInput';


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

@connect((state) => ({
  layout: state.layout,
  spinner: state.spinner,
}))
class Monitor extends React.Component {
  constructor(props) {
    super(props);
    console.log("Monitor online")
    console.log(this.props)
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    document.addEventListener('dragover', (e) => {e.preventDefault();}, false);
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      this.filesDropped(e);
    }, false);
    document.addEventListener('keyup', this.keyIncoming.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.spinner !== nextProps.spinner && nextProps.spinner === 0) {
      this.props.dispatch(checkLoadedDataIsComplete());
    }
  }
  render() {
    if (this.props.spinner) {
      return (<Spinner/>);
    }
    return null;
  }
  filesDropped(e) {
    // window.ga('send', 'pageview', '/filesDropped');
    // this.props.dispatch(goToPage('loading'));
    // this.props.dispatch(notificationNew(showHelp());
    this.props.dispatch(notificationNew('press \'s\' to show settings'));
    const files = e.dataTransfer.files;
    e.preventDefault();
    this.props.dispatch(increaseSpinner(files.length));
    for (let i = 0; i < files.length; i++) {
      this.props.dispatch(incomingFile(files[i]));
    }
  }
  keyIncoming(event) {
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    const key = event.keyCode || event.charCode;
    switch (key) {
    case 83: // s
      this.context.router.history.push('/settings');
      break;
    case 77: // m
      this.context.router.history.push('/main');
      break;
    case 76: // l
      this.context.router.history.push('/');
      break;
    case 69: // e
      this.context.router.history.push('/examples');
      break;
    case 90: // z
      this.props.dispatch(showBlocks('gubbins'));
      break;
    case 88: // x
      this.props.dispatch(showBlocks('gubbinsPerTaxa'));
      break;
    case 67: // c
      this.props.dispatch(showBlocks('bratNextGen'));
      break;
    case 86: // v
      this.props.dispatch(showBlocks('merged'));
      break;
    case 75: // k
      this.props.dispatch(toggleMetaKey());
      break;
    // pdf / svg triggered via 'p'
    case 80: // p
      this.produceSVG();
      break;
    // for testing only:
    // case 27: // esc
    //   this.props.dispatch({ type: 'clearAllData' });
    //   break;
    default:
      return;
    }
  }
}


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

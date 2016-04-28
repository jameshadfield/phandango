import { incomingFile } from '../actions/fileInput';
import { connect } from 'react-redux';
import React from 'react';
import { NotificationDisplay } from '../components/notification';

// Pages to display
import { CanvasContainer } from './canvases';
import { Settings } from './settings';
import { LandingPage } from './landingPage';
import { ExamplesPage } from './examplesPage';

// misc
import { Header } from '../components/header';
import { Spinner } from '../components/spinner';

// Actions to be dispatched upon key presses
import { notificationNew, notificationSeen } from '../actions/notifications';
import { goToPage, toggleMetaKey, showBlocks, increaseSpinner } from '../actions/general';

import C2S from '../misc/canvas2svg';

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

/*
Connect the containers which will be displayed here to redux store / dispatch etc
Note that the MainReactElement doesn't itself access store/state as it itself
displays nothing apart from child containers (which need display information)
*/
// the main display!
const ConnectedCanvasContainer = connect((state)=>({
  active: state.layout.active,
  colPercs: state.layout.colPercs,
  rowPercs: state.layout.rowPercs,
  logoIsOn: state.layout.logoIsOn,
}))(CanvasContainer);
const ConnectedSettings = connect()(Settings);
const ConnectedLandingPage = connect(
  () =>({}),
  (dispatch) => ({
    goToPage: (name) => {dispatch(goToPage(name));},
  })
)(LandingPage);
/* notifications is always displayed and it pops up when needed */
const ConnectedNotifications = connect(
  (state)=>({
    title: state.notifications.active.title,
    message: state.notifications.active.message,
    dialog: state.notifications.active.dialog,
    open: state.notifications.active.open,
    counter: state.notifications.counter,
  }),
  (dispatch)=>({
    notificationSeen: () => {dispatch(notificationSeen());},
  })
)(NotificationDisplay);

const ConnectedExamples = connect()(ExamplesPage); // dispatch is used
const ConnectedHeader = connect(
  (state)=>({
    pageName: state.router,
    treeActive: state.layout.active.tree,
    annotationActive: state.layout.active.annotation,
  }),
  (dispatch) => ({
    goToPage: (name) => {dispatch(goToPage(name));},
  })
)(Header);

/* PDF event
https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
This is a one-off thing and so it uses events rather than the flux approach
*/
const pdfEvent = new Event('pdf');

/*
The purposes of the MainReactElement:
* add global listeners
* read the current page (@props) and choose display containers accordingly
*/
export const MainReactElement = React.createClass({ displayName: 'Main_React_Element',
  propTypes: {
    page: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    spinner: React.PropTypes.number,
    browserMessage: React.PropTypes.string,
  },
  componentDidMount: function () {
    document.addEventListener('dragover', (e) => {e.preventDefault();}, false);
    document.addEventListener('drop', this.filesDropped, false);
    document.addEventListener('keyup', this.keyIncoming);
  },
  render: function () {
    let injectedPage;
    switch (this.props.page) {
    case 'landing':
      window.ga('send', 'pageview', '/landing');
      injectedPage = <ConnectedLandingPage browserMessage={this.props.browserMessage}/>;
      break;
    case 'settings':
      window.ga('send', 'pageview', '/settings');
      injectedPage = [
        <ConnectedSettings key="settings"/>,
        <ConnectedCanvasContainer key="canvases"/>,
      ];
      break;
    case 'examples':
      window.ga('send', 'pageview', '/examples');
      injectedPage = <ConnectedExamples />;
      break;
    case 'main':
      injectedPage = <ConnectedCanvasContainer />;
      break;
    default:
      injectedPage = false;
    }
    return (
      <div id="mainDiv" ref={(c) => this.node = c}>
        <ConnectedHeader />
        <Spinner key="spinner" active={this.props.spinner} />
        {injectedPage}
        <ConnectedNotifications />
      </div>
    );
  },

  keyIncoming: function (event) {
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    const key = event.keyCode || event.charCode;
    switch (key) {
    case 83: // s
      const p = this.props.page === 'settings' ? 'main' : 'settings';
      this.props.dispatch(goToPage(p));
      break;
    case 77: // m
      this.props.dispatch(goToPage('main'));
      break;
    case 76: // l
      this.props.dispatch(goToPage('landing'));
      break;
    case 69: // e
      this.props.dispatch(goToPage('examples'));
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
  },

  produceSVG() {
    window.svgCtx = new C2S(window.innerWidth, window.innerHeight);
    window.dispatchEvent(pdfEvent);

    const mySVG = window.svgCtx.getSerializedSvg(true);
    let myURL = undefined;
    const a = document.createElement('a');
    if (a.download !== undefined) {
      const blob = new Blob([ mySVG ], { type: 'text/plain;charset=utf-8' });
      myURL = window.URL.createObjectURL(blob);
      a.setAttribute('href', myURL);
      a.download = 'Phandango.svg';
    } else {
      const svgData = 'data:application/svg;charset=utf-8,' + encodeURIComponent(mySVG);
      a.setAttribute('href', svgData);
    }

    // a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (myURL) {
        window.URL.revokeObjectURL(myURL);
      }
      document.body.removeChild(a);
    }, 100);
  },

  filesDropped(e) {
    window.ga('send', 'pageview', '/filesDropped');
    // this.props.dispatch(goToPage('loading'));
    // this.props.dispatch(notificationNew(showHelp());
    this.props.dispatch(notificationNew('press \'h\' for help!'));
    const files = e.dataTransfer.files;
    e.preventDefault();
    this.props.dispatch(increaseSpinner(files.length));
    for (let i = 0; i < files.length; i++) {
      this.props.dispatch(incomingFile(files[i]));
    }
  },
});


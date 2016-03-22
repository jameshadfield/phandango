import { incomingFile } from '../actions/fileInput';
import { connect } from 'react-redux';
import React from 'react';
import { NotificationDisplay } from '../components/notification';

// Pages to display
import { CanvasContainer } from './canvases';
import { Settings } from './settings';
import { LandingPage } from './landingPage';
import { AboutPage } from './aboutPage';
import { ExamplesPage } from './examplesPage';
import { HelpPanel } from '../components/helpPanel';

// misc
import { Header } from '../components/header';
import { Spinner } from '../components/spinner';

// Actions to be dispatched upon key presses
import { notificationNew, notificationSeen } from '../actions/notifications';
import { goToPage, toggleMetaKey, showBlocks, increaseSpinner } from '../actions/general';

import C2S from '../misc/canvas2svg';


function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// function registerFonts() {
//   window.pdfdoc.registerFont('Lato-Light', base64ToArrayBuffer(require("base64!../../font/lato/Lato-Light.ttf")));
// }


// import pdfkit from 'pdfkit';
// import pdfkit from 'transform?brfs!pdfkit';



//let window.pdfdoc;

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

// const xhr = new XMLHttpRequest();
// xhr.open("GET", "/font/lato/Lato-Light.ttf", true);
// xhr.responseType = "arraybuffer";
// let latoFont;
// xhr.onload = function(oEvent) {
//     latoFont = xhr.response; // Note: not xhr.responseText
// };

// xhr.send(null);

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
      injectedPage = <ConnectedLandingPage />;
      break;
    case 'about':
      window.ga('send', 'pageview', '/about');
      injectedPage = <AboutPage />;
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
    case 'help':
      window.ga('send', 'pageview', '/help');
      injectedPage = <HelpPanel />;
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
    case 72: // h
      this.props.dispatch(goToPage('help'));
      break;
    case 76: // l
      this.props.dispatch(goToPage('landing'));
      break;
    case 65: // a
      this.props.dispatch(goToPage('about'));
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
    // pdf triggered via 'p'
    case 80: // p



      window.svgCtx = new C2S(window.innerWidth, window.innerHeight);

      //Add logo in canvas. Would be better to include as an image or exclude. Using non-standard fonts is not ideal.

      window.svgCtx.save();
      window.svgCtx.globalAlpha=0.8;
      window.svgCtx.translate(5,window.innerHeight-105);
      window.svgCtx.fillStyle = "#ED1C24";
      window.svgCtx.fillRect(0,11.844,38.904,65.98);
      window.svgCtx.fillStyle = "#ED1C24";
      window.svgCtx.fillRect(40.019,23.688,36.052,64.949);
      window.svgCtx.fillStyle = "#1C75BC";
      window.svgCtx.fillRect(77.071,11.844,18.5,54.137);
      window.svgCtx.fillStyle = "#1C75BC";
      window.svgCtx.fillRect(96.585,23.688,16.652,64.949);
      window.svgCtx.fillStyle = "#1C75BC";
      window.svgCtx.fillRect(114.758,0,18.146,65.98);
      window.svgCtx.fillStyle = "#ED1C24";
      window.svgCtx.fillRect(133.969,11.844,39.768,65.465);
      window.svgCtx.globalAlpha=1.0;
      window.svgCtx.font="36px Lato";
      //window.svgCtx.font="36px Helvetica";
      window.svgCtx.textBaseline = 'middle';
      window.svgCtx.textAlign = 'left';
      window.svgCtx.fillStyle = "#FFFFFF";
      window.svgCtx.fillText("phandango", 0, 55);
      window.svgCtx.restore();

      window.dispatchEvent(pdfEvent);

      // // Clip a rectangular area
      // window.svgCtx.rect(50,20,200,120);
      // window.svgCtx.stroke();
      // window.svgCtx.clip();
      // // Draw red rectangle after clip()
      // window.svgCtx.fillStyle="red";
      // window.svgCtx.fillRect(0,0,150,100);


      var mySVG = window.svgCtx.getSerializedSvg(true);

      //console.log(mySVG);
      var a = document.createElement("a");
      const windowURL = window.URL || window.webkitURL;
      var myURL = windowURL.createObjectURL(new Blob([mySVG], {type: 'text/plain;charset=utf-8'}));
      a.href = myURL;
      a.download="Phandango.svg";
      a.click();
      // window.open(a);
      window.URL.revokeObjectURL(myURL);
      //window.location.href = myURL;
      //debugger;
      break;
    // for testing only:
    // case 27: // esc
    //   this.props.dispatch({ type: 'clearAllData' });
    //   break;
    default:
      return;
    }
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


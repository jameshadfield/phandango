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
import { notificationNew, notificationSeen, showHelp } from '../actions/notifications';
import { goToPage, toggleMetaKey, showBlocks, increaseSpinner } from '../actions/general';

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
      injectedPage = <ConnectedLandingPage />;
      break;
    case 'about':
      injectedPage = <AboutPage />;
      break;
    case 'settings':
      injectedPage = [
        <ConnectedSettings key="settings"/>,
        <ConnectedCanvasContainer key="canvases"/>,
      ];
      break;
    case 'examples':
      injectedPage = <ConnectedExamples />;
      break;
    case 'main':
      injectedPage = <ConnectedCanvasContainer />;
      break;
    case 'help':
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
    default:
      return;
    }
  },

  filesDropped(e) {
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


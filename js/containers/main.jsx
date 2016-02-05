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

// misc
import { Spinner } from '../components/spinner';
import { Header } from '../components/header';

// Actions to be dispatched upon key presses
import { notificationNew, notificationSeen, showHelp } from '../actions/notifications';
import { goToPage, toggleMetaKey } from '../actions/general';

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
    default:
      injectedPage = false;
    }
    return (
      <div id="mainDiv" ref={(c) => this.node = c}>
        <ConnectedHeader />
        {injectedPage}
        <ConnectedNotifications />
      </div>
    );
  },

  keyIncoming: function (event) {
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    if (event.keyCode === 83 || event.charCode === 83) { // 's'
      this.props.dispatch(goToPage('settings'));
    } else if (event.keyCode === 77 || event.charCode === 77) { // 'm'
      this.props.dispatch(goToPage('canvases'));
    } else if (event.keyCode === 69 || event.charCode === 69) { // 'e'
      this.props.dispatch(notificationNew('error key pressed', 'time: ' + Date()));
    } else if (event.keyCode === 82 || event.charCode === 82) { // 'r'
      this.props.dispatch(notificationNew('snack error'));
    } else if (event.keyCode === 72 || event.charCode === 72) { // 'h'
      this.props.dispatch(showHelp());
    } else if (event.keyCode === 75 || event.charCode === 75) { // 'k'
      this.props.dispatch(toggleMetaKey());
    }
  },

  filesDropped(e) {
    this.props.dispatch(goToPage('loading'));
    // this.props.dispatch(notificationNew(showHelp());
    this.props.dispatch(notificationNew('press \'h\' for help!'));
    const files = e.dataTransfer.files;
    e.preventDefault();
    for (let i = 0; i < files.length; i++) {
      this.props.dispatch(incomingFile(files[i]));
    }
  },
});

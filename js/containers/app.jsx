import 'babel-polyfill';
import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PropTypes from 'prop-types';
import { NotificationDisplay } from '../components/notification';
import Spinner from '../components/spinner';

import Monitor from './monitor';

// Pages to display
import { CanvasContainer } from './canvases';
import { Settings } from './settings';
import { LandingPage } from './landingPage';
import { ExamplesPage } from './examplesPage';

// misc
import { Header } from '../components/header';
import { notificationSeen } from '../actions/notifications';

// Actions to be dispatched upon key presses

import C2S from '../misc/canvas2svg';



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
  // (dispatch) => ({
  //   goToPage: (name) => {dispatch(goToPage(name));},
  // })
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
//
// export class MainReactElement extends React.Component {
//   constructor(...args) {
//     super(...args);
//     this.displayName = 'Main_React_Element';
//   }



//     case 'settings':
//       window.ga('send', 'pageview', '/settings');
//       injectedPage = [
//         <ConnectedSettings key="settings"/>,
//         <ConnectedCanvasContainer key="canvases"/>,
//       ];
//       break;
//     case 'main':
//       injectedPage = <ConnectedCanvasContainer />;
//       break;

//   }
//

//
//   produceSVG() {
//     window.svgCtx = new C2S(window.innerWidth, window.innerHeight);
//     window.dispatchEvent(pdfEvent);
//
//     const mySVG = window.svgCtx.getSerializedSvg(true);
//     let myURL = undefined;
//     const a = document.createElement('a');
//     if (a.download !== undefined) {
//       const blob = new Blob([ mySVG ], { type: 'text/plain;charset=utf-8' });
//       myURL = window.URL.createObjectURL(blob);
//       a.setAttribute('href', myURL);
//       a.download = 'Phandango.svg';
//     } else {
//       const svgData = 'data:application/svg;charset=utf-8,' + encodeURIComponent(mySVG);
//       a.setAttribute('href', svgData);
//     }
//
//     // a.setAttribute('target', '_blank');
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function () {
//       if (myURL) {
//         window.URL.revokeObjectURL(myURL);
//       }
//       document.body.removeChild(a);
//     }, 100);
//   }
//

// }
//
// MainReactElement.propTypes = {
//   page: PropTypes.string.isRequired,
//   dispatch: PropTypes.func.isRequired,
//   spinner: PropTypes.number,
//   browserMessage: PropTypes.string,
// };
//

/*  to fix iOS's dreaded 300ms tap delay, we need this plugin
NOTE Facebook is not planning on supporting tap events (#436) because browsers are fixing/removing
the click delay. Unfortunately it will take a lot of time before all mobile
browsers (including iOS' UIWebView) will and can be updated.
https://github.com/zilverline/react-tap-event-plugin
Following https://github.com/zilverline/react-tap-event-plugin/issues/61
we wrap this in a try-catch as hotloading triggers errors */
try {
  injectTapEventPlugin();
} catch (e) {
  // empty
}

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // for react chrome extension debugger
}

const store = configureStore();
// const ConnectedMainReactElement = connect((state)=>({
//   page: state.router,
//   spinner: state.spinner,
// }))(MainReactElement);


render(
  <div>
    {process.env.NODE_ENV === 'production' ? null :
      <DevTools key={'devToolsKey'} store={store}/>
    }
    <Provider store={store} key={'providerKey'}>
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <Monitor/>
            <ConnectedHeader />
            <Spinner/>
            <Switch>
              <Route exact path="/" component={ConnectedLandingPage}/>
              <Route path="/examples" component={ConnectedExamples}/>
              <Route path="/main" component={ConnectedCanvasContainer}/>
              <Route path="/*" component={ConnectedLandingPage}/>
            </Switch>
            <ConnectedNotifications />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('react')
);

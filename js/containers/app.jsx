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
import { Main } from './main';
// import { Settings } from './settings';
import { LandingPage } from './landingPage';
import { ExamplesPage } from './examplesPage';

// misc
import { Header } from '../components/header';
import { notificationSeen } from '../actions/notifications';

/*
TODO: move these connect statements to the files themselves & use @decorator syntax
*/
const ConnectedMain = connect((state)=>({
  active: state.layout.active,
  colPercs: state.layout.colPercs,
  rowPercs: state.layout.rowPercs,
  logoIsOn: state.layout.logoIsOn,
}))(Main);
// const ConnectedSettings = connect()(Settings);
const ConnectedLandingPage = connect(
  () =>({}),
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
)(Header);

/* PDF event
https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
This is a one-off thing and so it uses events rather than the flux approach
*/
const pdfEvent = new Event('pdf');

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
              <Route path="/main" component={ConnectedMain}/>
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

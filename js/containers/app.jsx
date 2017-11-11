import 'babel-polyfill';
import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { NotificationDisplay } from '../components/notification';
import Spinner from '../components/spinner';
import { notificationSeen } from '../actions/notifications';

import Monitor from './monitor';

// Pages to display
import { Main } from './main';
import { LandingPage } from './landingPage';
import { ExamplesPage } from './examplesPage';
import Header from '../components/header';
import ProjectGPS from '../components/projects/gps';

/*
TODO: move these connect statements to the files themselves & use @decorator syntax
*/
const ConnectedMain = connect((state)=>({
  active: state.layout.active,
  colPercs: state.layout.colPercs,
  rowPercs: state.layout.rowPercs,
  logoIsOn: state.layout.logoIsOn,
}))(Main);
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

const HeaderWithRouter = withRouter(Header);
const MonitorWithRouter = withRouter(Monitor);
const ConnectedExamples = connect()(ExamplesPage); // dispatch is used

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
      <HashRouter>
        <MuiThemeProvider>
          <div>
            <MonitorWithRouter/>
            <HeaderWithRouter/>
            <Spinner/>
            <Switch>
              <Route exact path="/" component={ConnectedLandingPage}/>
              <Route path="/examples" component={ConnectedExamples}/>
              <Route path="/main" component={ConnectedMain}/>
              <Route path="/gps" component={ProjectGPS}/>
              <Route path="/*" component={ConnectedLandingPage}/>
            </Switch>
            <ConnectedNotifications />
          </div>
        </MuiThemeProvider>
      </HashRouter>
    </Provider>
  </div>,
  document.getElementById('react')
);

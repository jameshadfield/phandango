import 'babel-polyfill';
import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NotificationDisplay } from '../components/notification';
import Spinner from '../components/spinner';
import Monitor from './monitor';
import { Main } from './main';
import { LandingPage } from './landingPage';
import { ExamplesPage } from './examplesPage';
import Header from '../components/header';
import ProjectGPS from '../components/projects/gps';

const store = configureStore();
const HeaderWithRouter = withRouter(Header);
const MonitorWithRouter = withRouter(Monitor);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // for react chrome extension debugger
}

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
              <Route exact path="/" component={LandingPage}/>
              <Route path="/examples" component={ExamplesPage}/>
              <Route path="/main" component={Main}/>
              <Route path="/gps" component={ProjectGPS}/>
              <Route path="/*" component={LandingPage}/>
            </Switch>
            <NotificationDisplay />
          </div>
        </MuiThemeProvider>
      </HashRouter>
    </Provider>
  </div>,
  document.getElementById('react')
);


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

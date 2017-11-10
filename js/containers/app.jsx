import 'babel-polyfill';
import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import { MainReactElement } from './main';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
const ConnectedMainReactElement = connect((state)=>({
  page: state.router,
  spinner: state.spinner,
}))(MainReactElement);

const elements = [
  <Provider store={store} key={'providerKey'}>
    <BrowserRouter>
      <MuiThemeProvider>
        <Switch>
          <Route path="/*" component={ConnectedMainReactElement}/>
          {/* <ConnectedMainReactElement browserMessage={browserMessage}/> */}
        </Switch>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
];
if (process.env.NODE_ENV !== 'production') {
  elements.push(
    <DevTools key={'devToolsKey'} store={store}/>
  );
}

// if (navigator.userAgent.match(/WebKit/i)) {
//   window.ga('send', 'pageview', '/unsupportedBrowser');
//   elements = <UnsupportedBrowser msg="mobile devices are not yet supported"/>;
// }

render(
  <div>{elements}</div>,
  document.getElementById('react')
);

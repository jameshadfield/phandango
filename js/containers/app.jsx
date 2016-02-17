import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import { MainReactElement } from './main';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { NotChrome } from '../components/notChrome';
// Needed for onTouchTap -- Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // for react chrome extension debugger
}

const store = configureStore();
const ConnectedMainReactElement = connect((state)=>({
  page: state.router,
  spinner: state.spinner,
}))(MainReactElement);

let elements = [
  <Provider store={store} key={'providerKey'}>
    <ConnectedMainReactElement/>
  </Provider>,
];
if (process.env.NODE_ENV !== 'production') {
  elements.push(
    <DevTools key={'devToolsKey'} store={store}/>
  );
}
if (!navigator.userAgent.match(/WebKit/i)) {
  window.ga('send', 'pageview', '/notChrome');
  elements = <NotChrome />;
}

render(
  <div>{elements}</div>,
  document.getElementById('react')
);

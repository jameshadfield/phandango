import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import { MainReactElement } from './main';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap -- Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // for react chrome extension debugger
}

const store = configureStore();
const ConnectedMainReactElement = connect((state)=>({
  page: state.router,
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
if (!navigator.userAgent.match(/Chrome/i)) {
  elements = [
    <div className="fullpage" key={'notChromeKey'}>
      <h1>JScandy only works in Chrome</h1>
      <p>Sorry :(</p>
      <p><a href="https://www.google.com/chrome/browser/desktop/">Download Chrome here</a></p>
    </div>,
  ];
}

render(
  <div>{elements}</div>,
  document.getElementById('react')
);

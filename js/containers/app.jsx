import '../../css/JScandy.css';
import '../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import React from 'react';
import { render } from 'react-dom';
import configureStore from '../store/configureStore';
import DevTools from '../containers/devTools';
import { Provider, connect } from 'react-redux';
import { MainReactElement } from './main';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { UnsupportedBrowser } from '../components/UnsupportedBrowser';
import { getBrowser } from '../misc/helperFunctions';
// Needed for onTouchTap -- Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // for react chrome extension debugger
}

const browser = getBrowser();
console.log(browser);
let elements;

if (browser.mobile) {
  window.ga('send', 'pageview', '/unsupportedBrowser');
  elements = <UnsupportedBrowser msg="mobile devices are not yet supported"/>;
} else if (browser.name === 'Firefox' && browser.version < 45) {
  window.ga('send', 'pageview', '/unsupportedBrowser');
  const msg = 'Firefox is only supported for versions 45 and above (you have version ' + browser.version.toString() + ')';
  elements = <UnsupportedBrowser msg={msg}/>;
} else {
  const store = configureStore();
  const ConnectedMainReactElement = connect((state)=>({
    page: state.router,
    spinner: state.spinner,
  }))(MainReactElement);

  let browserMessage = null;
  if ([ 'Chrome', 'Safari', 'Firefox' ].indexOf((browser.name)) === -1) {
    browserMessage = browser.name + ' version ' + browser.version.toString();
  }
  elements = [
    <Provider store={store} key={'providerKey'}>
      <ConnectedMainReactElement browserMessage={browserMessage}/>
    </Provider>,
  ];
  if (process.env.NODE_ENV !== 'production') {
    elements.push(
      <DevTools key={'devToolsKey'} store={store}/>
    );
  }
}

// if (navigator.userAgent.match(/WebKit/i)) {
//   window.ga('send', 'pageview', '/unsupportedBrowser');
//   elements = <UnsupportedBrowser msg="mobile devices are not yet supported"/>;
// }

render(
  <div>{elements}</div>,
  document.getElementById('react')
);

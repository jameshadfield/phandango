import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import DevTools from '../containers/devTools';

// https://github.com/gaearon/redux-devtools
let finalCreateStore;
if (process.env.NODE_ENV === 'production') {
  finalCreateStore = compose(applyMiddleware(thunk))(createStore);
} else {
  finalCreateStore = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()
  )(createStore);
}

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);
  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default /* .default if you use Babel 6+ */)
    );
  }
  return store;
}

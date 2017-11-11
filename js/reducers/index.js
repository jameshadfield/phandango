import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { genomeInfo } from './genomeInfo';
import { layout } from './layout';
import { lineGraph } from './lineGraph';
import { gwasGraph } from './gwasGraph';
import { notifications } from './notifications';
import { metadata } from './metadata';
import { blocks } from './blocks';

const initialPhylogenyState = {
  newickString: undefined,
  activeTaxa: {},
  fileName: 'not loaded',
};

const rootReducer = combineReducers({
  annotation,
  metadata,
  blocks,
  lineGraph,
  gwasGraph,
  genomeInfo,
  misc,
  phylogeny,
  layout,
  notifications,
  spinner,
});

export default rootReducer;

function annotation(state = { data: [], fileName: 'not loaded' }, action) {
  switch (action.type) {
  case 'annotationData':
    return { data: action.data, fileName: action.fileName };
  case 'clearAnnotationData':
    return { data: [], fileName: '' };
  default:
    return state;
  }
}

function phylogeny(state = initialPhylogenyState, action) {
  switch (action.type) {
  case 'treeData':
    return merge({}, state, {
      newickString: action.data,
      fileName: action.fileName,
    });
  case 'clearTree':
    return initialPhylogenyState;
  case 'updatedTaxaPositions':
    const ret = merge({}, state);
    ret.activeTaxa = action.activeTaxa;
    return ret;
    /* do not use merge in one go!
     * if oldState.activeTaxa.X !== undefined, but now
     * action.activeTaxa = undefined (as tip not visible)
     * then the old value is retained!!!!!
     * so merge is really a deepMerge
     */
    // return merge({}, state, {
      // activeTaxa: action.activeTaxa,
    // });
  default:
    return state;
  }
}

function misc(state = { showSettings: false }, action) {
  switch (action.type) {
  case 'toggleSettings':
    return merge({}, state, { showSettings: !state.showSettings });
  default:
    return state;
  }
}

/* the spinner reducer is simply an integer of how many things are "to load"
 * so it reduces by one each time a data type comes in!
 */
function spinner(state = 0, action) {
  switch (action.type) {
  case 'increaseSpinner':
    // console.log('spinner value set to ', action.value);
    return action.value;
  case 'decreaseSpinner':
    // console.log('spinner value decreasing via ', action.type);
    return state ? state - 1 : state;
  case 'notificationNew':
    return action.type.startsWith('Input error') ? state - 1 : state;
  default:
    return state;
  }
}

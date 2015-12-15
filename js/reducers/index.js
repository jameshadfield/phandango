import merge from 'lodash/object/merge';
import clone from 'lodash/lang/clone';
import { combineReducers } from 'redux';
import { genomeInfo } from './genomeInfo';
import { errorQueue } from './errors';
import { layout } from './layout';
import { lineGraph } from './lineGraph';

const initialBlockState = {
  gubbins: [],
  roary: [],
  other: [],
  blocks: [], // this is the only thing actually displayed
  fileNames: {},
};

const initialPhylogenyState = {
  newickString: undefined,
  activeTaxa: {},
  fileName: undefined,
};

const initialMetadataState = {
  data: undefined,
  values: undefined,
  colours: undefined,
  headerNames: undefined,
  info: undefined,
  toggles: undefined,
  fileName: undefined,
};

const rootReducer = combineReducers({
  dummyReducer,
  annotation,
  metadata,
  blocks,
  lineGraph,
  genomeInfo,
  phylogeny,
  router,
  errorQueue,
  layout,
});

export default rootReducer;

function dummyReducer(state = [], action) {
  switch (action.type) {
  case 'dummyAction':
    return ([ action.data, ...state ]);
  default:
    return state;
  }
}

function annotation(state = [], action) {
  switch (action.type) {
  case 'annotationData':
    return (action.data);
  default:
    return state;
  }
}

function blocks(state = initialBlockState, action) {
  switch (action.type) {
  case 'gubbinsData':
    return merge({}, state, {
      gubbins: action.data,
      blocks: action.data,
    });
  default:
    return state;
  }
}

function phylogeny(state = initialPhylogenyState, action) {
  switch (action.type) {
  case 'treeData':
    return merge({}, state, {
      newickString: action.data,
    });
  case 'updatedTaxaPositions':
    return merge({}, state, {
      activeTaxa: action.activeTaxa,
    });
  default:
    return state;
  }
}

function router(state = 'landing', action) {
  switch (action.type) {
  case 'newPage':
    return state === action.pageName ? state : action.pageName;
  case 'clearSpinner':
    return state === 'unknown' ? state : 'unknown';
  default:
    return state;
  }
}

function metadata(state = initialMetadataState, action) {
  switch (action.type) {
  case 'metaData':
    return {
      data: action.data,
      values: action.values,
      colours: action.colours,
      headerNames: action.headerNames,
      info: action.info,
      toggles: action.toggles,
      fileName: action.fileName,
    };
  case 'toggleMetadataColumn':
    // const newState = { ...state }; // DON'T DO THIS. NOT PURE.
    // const newState = merge({}, state);
    const newState = clone(state, true);
    newState.toggles[action.idx] = action.newValue;
    return newState;
  default:
    return state;
  }
}

import clone from 'lodash/lang/clone';


const initialMetadataState = {
  data: undefined,
  values: undefined,
  colours: undefined,
  headerNames: undefined,
  info: undefined,
  toggles: undefined,
  fileName: 'not loaded',
};

export function metadata(state = initialMetadataState, action) {
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

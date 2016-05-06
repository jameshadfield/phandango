import cloneDeep from 'lodash/cloneDeep';

const initialMetadataState = {
  data: {},
  values: [],
  colours: [],
  headerNames: [],
  groups: {},
  info: [],
  toggles: [],
  fileName: 'not loaded',
  rawBratData: {},
};

export function metadata(state = initialMetadataState, action) {
  switch (action.type) {
  case 'clearAllData':
    return initialMetadataState;
  case 'metaData':
    let ret = {
      data: action.data,
      values: action.values,
      colours: action.colours,
      groups: action.groups,
      headerNames: action.headerNames,
      info: action.info,
      toggles: action.toggles,
      fileName: action.fileName,
      rawBratData: state.rawBratData,
    };
    if (Object.keys(ret.rawBratData).length) {
      ret = appendBratData(ret, ret.rawBratData);
    }
    return ret;
  case 'toggleMetadataColumn':
    // const newState = { ...state }; // DON'T DO THIS. NOT PURE.
    // const newState = merge({}, state);
    const newState = cloneDeep(state, true);
    newState.toggles[action.idx] = action.newValue;
    return newState;
  case 'toggleAllMetaColumns':
    const newStateX = cloneDeep(state, true);
    for (let idx = 0; idx < newStateX.toggles.length; idx++) {
      newStateX.toggles[idx] = action.newBool;
    }
    return newStateX;
  case 'clearMetadata':
    return initialMetadataState;
  case 'bratNextGenData':
    const stateWithBrat = appendBratData(cloneDeep(state, true), action.metadata);
    stateWithBrat.rawBratData = cloneDeep(action.metadata, true);
    return stateWithBrat;
  default:
    return state;
  }
}

function appendBratData(newState, bratData) {
  newState.headerNames.push('BRAT NextGen cluster');
  newState.info.push({});
  newState.toggles.push(true);
  newState.colours.push(bratData.colours);
  if (newState.fileName === 'not loaded') {
    newState.fileName = 'bratNextGen';
  }
  // the values are integers so we make them match the index
  const vals = [];
  for (let i = 0; i < bratData.colours.length; i++) {
    vals[i] = i;
  }
  newState.values.push(vals);
  for (const taxaName of Object.keys(bratData.taxaClusterMap)) {
    if (!newState.data[taxaName]) {
      newState.data[taxaName] = new Array(newState.headerNames.length - 1); // filled with undefined
    }
    if (!newState.data[taxaName]) {
      newState.data[taxaName] = new Array(newState.headerNames.length - 1); // filled with undefined
    }
    newState.data[taxaName].push(bratData.taxaClusterMap[taxaName]);
  }
  return newState;
}

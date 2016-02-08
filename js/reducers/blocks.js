import merge from 'lodash/object/merge';

const initialBlockState = {
  gubbins: [],
  roary: [],
  other: [],
  blocks: [], // this is the only thing actually displayed
  fileNames: {}, // doubles as what's 'loaded'
  roarySortMethod: undefined,
  dataType: undefined,
};

export function blocks(state = initialBlockState, action) {
  let ret;
  switch (action.type) {
  case 'gubbinsData':
    ret = merge({}, state, {
      gubbins: action.data,
      blocks: action.data,
      dataType: 'gubbins',
    });
    ret.fileNames.gubbins = action.fileName;
    return ret;
  case 'roaryData':
    /* this is written very verbosely but using
     * merge() causes it to freeze!
     */
    const newState = {};
    newState.blocks = action.data;
    newState.roary = action.data;
    newState.other = state.other; // pass by reference
    newState.gubbins = state.gubbins; // pass by reference
    newState.roarySortMethod  = 'linear';
    newState.fileNames = { ...state.fileNames }; // copy 1 deep
    newState.fileNames.roary = action.fileName;
    newState.dataType = 'roary';
    // following is ridiculously slow!!!!
    // ret = merge({}, state, {
    //   roary: action.blockData,
    //   blocks: action.blockData,
    //   roarySortMethod: 'linear',
    // });
    // ret.fileNames.roary = action.fileName;
    return newState;
  default:
    return state;
  }
}

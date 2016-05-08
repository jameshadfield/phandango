import merge from 'lodash/merge';

const initialInfo = {
  genomeLength: 0,
  visibleGenome: [ 0, 0 ],
};

export function genomeInfo(state = initialInfo, action) {
  switch (action.type) {
  case 'clearAllData':
    return initialInfo;
  // case 'clearAnnotationData':
  //   return initialInfo;
  case 'annotationData': // fallthrough
  case 'roaryData':
    return merge({}, state, {
      genomeLength: action.genomeLength,
      visibleGenome: [ 0, action.genomeLength ],
    });
  case 'gubbinsData': // fallthrough
  case 'bratNextGenData':
    // the difference here is, if an annotation file is already loaded,
    // we don't want to change the genome length!
    if (state.genomeLength) {
      return state;
    }
    return merge({}, state, {
      genomeLength: action.genomeLength,
      visibleGenome: [ 0, action.genomeLength ],
    });
  case 'updateVisibleGenome':
    return merge({}, state, {
      visibleGenome: action.visibleGenome,
    });
  default:
    return state;
  }
}

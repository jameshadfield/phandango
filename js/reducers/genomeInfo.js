import merge from 'lodash/object/merge';

const initialInfo = {
  genomeLength: 0,
  visibleGenome: [ 0, 0 ],
};

export function genomeInfo(state = initialInfo, action) {
  switch (action.type) {
  case 'annotationData': // fallthrough
  case 'roaryData': // fallthrough
  case 'gubbinsData':
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

import merge from 'lodash/object/merge';
const initialState = { values: [], max: 0, subValues: undefined };

/* lineGraph computes the array of points
  @param action {obj}
  @param action.taxa - if false => no taxa, compute main graph
                          array[0] => node deselected, remove subValues
                          array => node selected, compute subValues
*/

export function lineGraph(state = initialState, action) {
  switch (action.type) {
  case 'computeLineGraph':
    const ret = {};
    if (action.taxa) { // subgraph!
      if (action.taxa.length) {
        ret.values = state.values;
        ret.max = state.max;
        ret.subValues = computeLineGraph(action.blocks, action.genomeLength, action.taxa);
      } else {
        ret.values = state.values;
        ret.max = state.max;
        ret.subValues = undefined;
      }
    } else {
      ret.values = computeLineGraph(action.blocks, action.genomeLength, false);
      ret.max = findMaxValueOfArray(ret.values);
      ret.subValues = undefined;
    }
    return ret;
  case 'computeSubLineGraph':
    const subValues = action.taxa.length ? computeLineGraph(action.blocks, action.genomeLength, action.taxa) : [];
    return { ...state, subValues };
  default:
    return state;
  }
}


function computeLineGraph(blocks, genomeLength, taxaToUse) {
  const plotValues = Array(genomeLength).fill(0);
  for (const block of blocks) {
    if (taxaToUse) {
      /* check that the recombination block taxa is a subset (or equal to) the
       * taxaToUse. This way we exclude ancestral recombinations
       * taxaToUse {array of strings}
       * block.taxa (array of strings)
       */
      let flag = false; // whether to exclude block
      for (let i = 0; i < block.taxa.length; i++) {
        if (taxaToUse.indexOf(block.taxa[i]) === -1) {
          flag = true;
          break;
        }
      }
      if (flag) {
        continue;
      }
    }
    for (let j = block.startBase; j < block.endBase; j++) {
      plotValues[j]++;
    }
  }
  return plotValues;
}

function findMaxValueOfArray(arr) {
  let max = 1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

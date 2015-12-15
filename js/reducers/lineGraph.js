export function lineGraph(state = { values: [], max: 0 }, action) {
  switch (action.type) {
  case 'computeLineGraph':
    const values = computeLineGraph(action.blocks, action.genomeLength, false);
    return ({
      values,
      max: findMaxValueOfArray(values),
    });
  default:
    return state;
  }
}


function computeLineGraph(blocks, genomeLength, taxaToUse) {
  const plotValues = Array(genomeLength).fill(0);
  for (const block of blocks) {
    // check overlap of blocks if demanded
    if (taxaToUse) {
      console.err('not written yet');
      break;
      // if (blocks[i].taxa) {
      //   continue;
      // } else {
      //   break;
      // }
    }
    for (let j = block.start_base; j < block.end_base; j++) {
      plotValues[j] += 1;
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

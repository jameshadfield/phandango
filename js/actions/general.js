import { computeLineGraph, computeMergedLineGraph, clearLineGraph } from './lineGraph.js';

export function goToPage(name) {
  return ({ type: 'newPage', name: name });
}

export function layoutChange(col, idx, perc) {
  const type = col ? 'layoutColChange' : 'layoutRowChange';
  return ({ type, idx, perc });
}

export function turnOffCanvas(name) {
  return ({ type: 'turnOffCanvas', name });
}

export function turnOnCanvas(name) {
  return ({ type: 'turnOnCanvas', name });
}

export function toggleMetadataColumn(idx, newValue) {
  return ({ type: 'toggleMetadataColumn', idx, newValue });
}

export function toggleMetaKey() {
  return ({ type: 'toggleMetaKey' });
}

/* showBlocks is a thunk in order to gain access to dispatch for multiple dispatches */
export function showBlocks(name) {
  return function (dispatch) {
    console.log('must check i can do this...');
    dispatch({ type: 'showBlocks', name: name });
    if (name === 'merged') {
      dispatch(clearLineGraph());
      dispatch(computeMergedLineGraph([ 'gubbinsPerTaxa', 'bratNextGen' ]));
    } else {
      dispatch(computeLineGraph());
    }
  };
}


// export function computeLineGraph() {
//   // THUNK
//   return function (dispatch, getState) {
//     // setTimeout( () => {
//     dispatch({
//       type: 'computeLineGraph',
//       blocks: getState().blocks.blocks,
//       genomeLength: getState().genomeInfo.genomeLength,
//     });
//     // }, 100);
//   };
// }

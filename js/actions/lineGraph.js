export function computeLineGraph() {
  // THUNK
  return function (dispatch, getState) {
    setTimeout( () => {
      dispatch({
        type: 'computeLineGraph',
        blocks: getState().blocks.blocks,
        genomeLength: getState().genomeInfo.genomeLength,
      });
    }, 1000);
  };
}

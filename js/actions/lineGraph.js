export function computeLineGraph(wait) {
  // THUNK
  return function (dispatch, getState) {
    if (wait) {
      setTimeout(()=>{
        dispatch({
          type: 'computeLineGraph',
          blockType: getState().blocks.dataType,
          blocks: getState().blocks.blocks,
          blocksArePerTaxa: getState().blocks.blocksArePerTaxa,
          genomeLength: getState().genomeInfo.genomeLength,
          fileName: getState().blocks.fileNames[getState().blocks.dataType],
        }
      );}, 100);
    } else {
      dispatch({
        type: 'computeLineGraph',
        blockType: getState().blocks.dataType,
        blocks: getState().blocks.blocks,
        blocksArePerTaxa: getState().blocks.blocksArePerTaxa,
        genomeLength: getState().genomeInfo.genomeLength,
        fileName: getState().blocks.fileNames[getState().blocks.dataType],
      });
    }
  };
}

export function computeMergedLineGraph(blockTypes) {
  // THUNK
  return function (dispatch, getState) {
    // check the lines have been calculated!
    for (const blockType of blockTypes) {
      // if (!getState().lineGraph.preComputedValues[blockType]) {
        dispatch({
          type: 'computeLineGraph',
          blockType,
          blocks: getState().blocks[blockType],
          blocksArePerTaxa: true,
          genomeLength: getState().genomeInfo.genomeLength,
          fileName: getState().blocks.fileNames[blockType],
        });
      // }
    }
    // now we know the lines have been calculated...
    dispatch({
      type: 'computeMergedLineGraph',
      blockTypes,
    });
  };
}

export function clearLineGraph() {
  return ({ type: 'clearLineGraph' });
}

export function computeSubLineGraph(taxa) {
  return function (dispatch, getState) {
    dispatch({
      type: 'computeSubLineGraph',
      blocks: getState().blocks.blocks,
      genomeLength: getState().genomeInfo.genomeLength,
      blocksArePerTaxa: getState().blocks.blocksArePerTaxa,
      taxa: taxa,
    });
  };
}

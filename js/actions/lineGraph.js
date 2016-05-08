export function updateLineGraphData(wait = false) {
  // console.log('changeLineGraphData action triggered');
  // THUNK
  return function (dispatch, getState) {
    let blocksDisplayed = [ getState().blocks.dataType ];
    let percent = false;
    if (blocksDisplayed[0] === 'merged') {
      blocksDisplayed = [ 'gubbinsPerTaxa', 'bratNextGen' ];
    } else if (blocksDisplayed[0] === 'roary') {
      percent = true;
    }
    // console.log('blocks to use = ', blocksDisplayed, getState().blocks[blocksDisplayed[0]], getState().genomeInfo.genomeLength);
    const data = {};
    for (const blockType of blocksDisplayed) {
      data[blockType] = {};
      data[blockType].blocks = getState().blocks[blockType];
      data[blockType].fileName = getState().blocks.fileNames[blockType];
    }
    dispatch({
      type: 'computeLineGraph',
      data,
      blocksArePerTaxa: blocksDisplayed.length > 1 ? true : getState().blocks.blocksArePerTaxa,
      genomeLength: getState().genomeInfo.genomeLength,
      taxa: Object.keys(getState().phylogeny.activeTaxa),
      percent,
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

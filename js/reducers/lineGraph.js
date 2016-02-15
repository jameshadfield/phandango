import { colourDB } from '../parsers/shapes';
// import merge from 'lodash/object/merge';

const initialState = {
  preComputedValues: {},
  values: [],
  max: 0,
  subValues: undefined,
  lineColours: [],
};

export function lineGraph(state = initialState, action) {
  switch (action.type) {
  case 'clearAllData':
    const r = initialState;
    r.preComputedValues = {};
    return r;
  case 'clearLineGraph':
    return ({
      preComputedValues: state.preComputedValues,
      values: [],
      max: 0,
      subValues: undefined,
      lineColours: [],
    });
  case 'computeLineGraph':
    // only ever one line graph here...
    // console.log('starting line graph computation');
    if (!action.genomeLength) {
      return state;
    }
    const ret = {
      preComputedValues: state.preComputedValues,
      subValues: undefined,
    };

    if (ret.preComputedValues[action.blockType]) {
      ret.max = ret.preComputedValues[action.blockType].max;
      ret.values = [ ret.preComputedValues[action.blockType].values ];
      ret.lineColours = [ colourDB.line[action.blockType] ];
    } else {
      // console.log('computing plot value for ', action.blockType);
      const plotValues = computeLine(action.genomeLength, action.blocksArePerTaxa, action.blocks);
      ret.max = findMaxValueOfArray(plotValues);
      ret.values = [ plotValues ];
      ret.lineColours = [ colourDB.line[action.blockType] ];
      ret.preComputedValues[action.blockType] = {
        max: ret.max,
        values: plotValues,
      };
    }
    return ret;
  case 'computeMergedLineGraph':
    const rett = {
      preComputedValues: state.preComputedValues,
      subValues: undefined,
      values: [],
      lineColours: [],
      max: 0,
    };
    for (const blockType of action.blockTypes) {
      if (rett.preComputedValues[blockType].max > rett.max) {
        rett.max = rett.preComputedValues[blockType].max;
      }
      rett.values.push(rett.preComputedValues[blockType].values);
      rett.lineColours.push(colourDB.line[blockType]);
    }
    return rett;
  case 'computeSubLineGraph':
    let subValues = [];
    if (action.taxa.length && state.values.length === 1) {
      subValues = computeLineForSelectedTaxa(action.genomeLength, action.blocksArePerTaxa, action.blocks, action.taxa);
    }
    return { ...state, subValues };
  default:
    return state;
  }
}

function computeLine(genomeLength, blocksArePerTaxa, blocks) {
  let plotValues = Array(genomeLength).fill(0);
  if (blocksArePerTaxa) {
    for (const taxaName of Object.keys(blocks)) {
      plotValues = addValuesFromBlocks(plotValues, blocks[taxaName], false);
    }
  } else {
    plotValues = addValuesFromBlocks(plotValues, blocks, false);
  }
  return plotValues;
}

function computeLineForSelectedTaxa(genomeLength, blocksArePerTaxa, blocks, taxaToUse) {
  let plotValues = Array(genomeLength).fill(0);
  if (blocksArePerTaxa) {
    for (const taxaName of Object.keys(blocks)) {
      if (taxaToUse.indexOf(taxaName) > -1) {
        plotValues = addValuesFromBlocks(plotValues, blocks[taxaName], false);
      }
    }
  } else {
    plotValues = addValuesFromBlocks(plotValues, blocks, taxaToUse);
  }
  return plotValues;
}

function addValuesFromBlocks(plotValues, blocks, taxaToUse) {
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

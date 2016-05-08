import { colourDB } from '../parsers/shapes';

/* all lines to be displayed are contained here in the arrays values
 * with respective colours in lineColours array
 * info is only used internally (i.e. not by components)
 *
 * cache is an object with keys corresponding to data-types
 * i.e. rorary / gubbins / gubbinsPerTaxa / bratNextGen
 * and each object has keys of:
 *    values
 *    taxa used to calculate
 *    maxValue (?)
 */

const initialState = {
  cache: {},
  values: [],
  max: 0,
  lineColours: [],
  info: [],
  displayedAsPercent: false,
};

export function lineGraph(state = initialState, action) {
  let ret = state;
  switch (action.type) {
  case 'clearAllData': // fallthrough
  case 'clearLineGraph':
    return initialState;
  case 'computeLineGraph':
    if (!action.genomeLength) {
      return state;
    }
    ret = {
      cache: state.cache,
      values: [],
      max: 0,
      lineColours: [],
      info: [],
      displayedAsPercent: action.percent,
    };
    addLines(ret, action, ret.displayedAsPercent);
    return ret;
  case 'computeSubLineGraph':
    ret = {
      cache: state.cache,
      values: [],
      max: state.max,
      lineColours: [],
      info: [],
      displayedAsPercent: state.displayedAsPercent,
    };
    // add back in all the non-subgraphs in state
    for (let i = 0; i < state.values.length; i++) {
      if (!state.info[i].subGraph) {
        ret.values.push(state.values[i]);
        ret.lineColours.push(state.lineColours[i]);
        ret.info.push(state.info[i]);
      }
    }

    // secondly, compute the new subgraph
    // TODO: multiple graphs
    if (action.taxa.length) {
      ret.values.push(computeLine(action.genomeLength, action.blocksArePerTaxa, action.blocks, action.taxa));
      ret.info.push({ subGraph: true, taxa: action.taxa });
      ret.lineColours.push('purple');
      if (state.displayedAsPercent) {
        // console.log('percent-ising subvalues');
        turnValuesToPercent(ret.values[ret.values.length - 1], action.taxa.length);
      }
    }
    return ret;
  default:
    return state;
  }
}

function addLines(ret, action, percent) {
  // ret already has cache in it, as well as values[] colours[] e.t.c
  for (const blockType in action.data) {
    if (action.data.hasOwnProperty(blockType)) {
      if (isPlotCached(blockType, action.taxa, ret.cache)) {
        // console.log('line', blockType, 'cache hit :)');
        ret.values.push(ret.cache[blockType].values);
        ret.max = ret.cache[blockType].max > ret.max ? ret.cache[blockType].max : ret.max;
      } else {
        // console.log('calculating line', blockType);
        const vals = computeLine(action.genomeLength, action.blocksArePerTaxa, action.data[blockType].blocks, action.taxa);
        if (percent) {
          // console.log('percent-ising the line');
          turnValuesToPercent(vals, action.taxa.length);
        }
        const thisMax = percent ? 100 : findMaxValueOfArray(vals);
        ret.cache = cachePlot(ret.cache, blockType, action.taxa, vals, thisMax);
        ret.values.push(vals);
        ret.max = ret.max > thisMax ? ret.max : thisMax;
      }
      ret.lineColours.push(colourDB.line[blockType]);
      ret.info.push({ subGraph: false });
    }
  }
  // returns nothing (modifies inputs)
}

function computeLine(genomeLength, blocksArePerTaxa, blocks, taxaToUse) {
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

function turnValuesToPercent(vals, numTaxa) {
  // modifies argument in place
  for (let i = 0; i < vals.length; i++) {
    vals[i] = parseInt(vals[i] * 100 / numTaxa, 10);
  }
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

function isPlotCached(blockType, taxa, cache) {
  if (Object.keys(cache).indexOf(blockType) > -1 && areTaxaSame(taxa, cache[blockType].taxa)) {
    return true;
  }
  return false;
}

function cachePlot(cache, blockType, taxa, vals, max) {
  cache[blockType] = {
    values: vals,
    max,
    taxa,
  };
  return cache;
}

function areTaxaSame(taxa1, taxa2) {
  if (taxa1.length !== taxa2.length) {
    return false;
  }
  for (let i = 0; i < taxa1.length; i++) {
    if (taxa2.indexOf(taxa1[i]) === -1) {
      return false;
    }
  }
  return true;
}

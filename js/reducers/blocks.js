import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { Block, colourDB } from '../parsers/shapes';

/* important speed observation:
 * using lodash's merge is very slow!
 * here we re-allocate things by hand
 * this makes things look long but work FAST
 */

const initialBlockState = {
  gubbins: [],
  gubbinsPerTaxa: {},
  roary: [],
  bratNextGen: {},
  merged: {},
  // fastGear: [],
  blocks: [], // this is the only thing actually displayed
  fileNames: {}, // doubles as what's 'loaded'
  // roarySortMethod: undefined,
  dataType: undefined,
  shouldMouseOver: false,
  blocksArePerTaxa: false, // reflects the structure of the blocks
  blockFillAlpha: 1,
  dataAvailable: {},
};

export function blocks(state = initialBlockState, action) {
  let ret = {};
  switch (action.type) {
  case 'clearAllData':
    return initialBlockState;
  case 'gubbinsData':
    ret = merge({}, state, {
      gubbins: action.data,
      blocks: action.data,
      shouldMouseOver: true,
      dataType: 'gubbins',
      blocksArePerTaxa: false,
      blockFillAlpha: 0.4,
    });
    ret.roary = [];
    ret.dataAvailable.gubbins = true;
    ret.dataAvailable.gubbinsPerTaxa = true;
    ret.fileNames.gubbins = action.fileName;
    return ret;
  case 'roaryData':
    ret.blocks = action.data;
    ret.roary = action.data;
    ret.bratNextGen = {};
    ret.merged = {};
    ret.gubbins = [];
    ret.gubbinsPerTaxa = {};
    ret.fileNames = { roary: action.fileName };
    ret.dataAvailable = { roary: true };
    ret.shouldMouseOver = false;
    ret.dataType = 'roary';
    ret.blocksArePerTaxa = true;
    ret.blockFillAlpha = 1;
    // following is ridiculously slow!!!!
    // ret = merge({}, state, {
    //   roary: action.blockData,
    //   blocks: action.blockData,
    //   roarySortMethod: 'linear',
    // });
    // ret.fileNames.roary = action.fileName;
    return ret;
  case 'bratNextGenData':
    ret = merge({}, state, {
      bratNextGen: action.data,
      blocks: action.data,
      dataType: 'bratNextGen',
      shouldMouseOver: false,
      blocksArePerTaxa: true,
      blockFillAlpha: 1,
    });
    ret.roary = [];
    ret.fileNames.bratNextGen = action.fileName;
    ret.dataAvailable.bratNextGen = true;
    return ret;

  case 'showBlocks':
    if (action.name === 'gubbins') {
      // console.log('showing gubbins data now...');
      ret = {};
      ret.roary = [];
      ret.merged = state.merged;
      ret.bratNextGen = state.bratNextGen;
      ret.gubbinsPerTaxa = state.gubbinsPerTaxa;
      ret.gubbins = state.gubbins;
      ret.blocks = state.gubbins;
      ret.fileNames = { ...state.fileNames };
      ret.dataAvailable = { ...state.dataAvailable };
      ret.shouldMouseOver = true;
      ret.dataType = 'gubbins';
      ret.blocksArePerTaxa = false;
      ret.blockFillAlpha = 0.4;
    } else if (action.name === 'gubbinsPerTaxa') {
      // console.log('showing gubbinsPerTaxa data now...');
      ret = {};
      ret.roary = [];
      ret.bratNextGen = state.bratNextGen;
      ret.merged = state.merged;
      ret.gubbinsPerTaxa = state.gubbinsPerTaxa;
      ret.gubbins = state.gubbins;
      ret.fileNames = { ...state.fileNames };
      ret.dataAvailable = { ...state.dataAvailable };
      ret.shouldMouseOver = false;
      ret.dataType = 'gubbinsPerTaxa';
      ret.blocksArePerTaxa = true;
      ret.blockFillAlpha = 1;
      if (!Object.keys(ret.gubbinsPerTaxa).length) {
        ret.gubbinsPerTaxa = collapseGubbins(ret.gubbins);
        // ret.dataAvailable.gubbinsPerTaxa = true;
      }
      ret.blocks = ret.gubbinsPerTaxa;
    } else if (action.name === 'bratNextGen') {
      // console.log('showing bratNextGen data now...');
      ret = {};
      ret.roary = [];
      ret.blocks = state.bratNextGen;
      ret.merged = state.merged;
      ret.bratNextGen = state.bratNextGen;
      ret.gubbins = state.gubbins;
      ret.gubbinsPerTaxa = state.gubbinsPerTaxa;

      ret.fileNames = { ...state.fileNames };
      ret.dataAvailable = { ...state.dataAvailable };
      ret.shouldMouseOver = false;
      ret.dataType = 'bratNextGen';
      ret.blocksArePerTaxa = true;
      ret.blockFillAlpha = 1;
    } else if (action.name === 'merged') {
      // console.log('showing Merged data now...');
      ret = mergeBratNextGenAndGubbins(state);
    }
    return ret;
  default:
    return state;
  }
}

function mergeBratNextGenAndGubbins(state) {
  const ret = {};
  ret.roary = [];
  ret.bratNextGen = state.bratNextGen;
  ret.gubbins = state.gubbins;
  ret.gubbinsPerTaxa = state.gubbinsPerTaxa;
  ret.fileNames = { ...state.fileNames };
  ret.dataAvailable = { ...state.dataAvailable };
  ret.shouldMouseOver = false;
  ret.dataType = 'merged';
  ret.blocksArePerTaxa = true;
  ret.blockFillAlpha = 1;
  ret.merged = state.merged;
  if (!Object.keys(ret.merged).length) {
    /* remember that bratNextGen is, by default, perTaxa, but we have to collapse gubbins */
    if (!ret.gubbinsPerTaxa.length) {
      ret.gubbinsPerTaxa = collapseGubbins(ret.gubbins);
      // ret.dataAvailable.gubbinsPerTaxa = true;
    }
    // merge the objects gubbinsPerTaxa and bratNextGen
    const gubbinsTaxa = Object.keys(ret.gubbinsPerTaxa);
    const bratNextGenTaxa = Object.keys(ret.bratNextGen);
    const taxaOnlyInGubbins = gubbinsTaxa.filter( (n) => bratNextGenTaxa.indexOf(n) === -1 );
    const taxaOnlyInBratNextGen = bratNextGenTaxa.filter( (n) => gubbinsTaxa.indexOf(n) === -1 );
    const commonTaxa = gubbinsTaxa.filter( (n) => bratNextGenTaxa.indexOf(n) > -1 );

    // clone the blocks (how slow is this?)
    const bratNextGen = cloneDeep(ret.bratNextGen);
    const gubbinsCopy = cloneDeep(ret.gubbinsPerTaxa);

    // change the colours of bratNextGen & gubbinsPerTaxa
    for (const key of Object.keys(bratNextGen)) {
      for (let i = 0; i < bratNextGen[key].length; i++) {
        bratNextGen[key][i].fill = colourDB.block.bratNextGen.default;
      }
    }
    for (const key of Object.keys(gubbinsCopy)) {
      for (let i = 0; i < gubbinsCopy[key].length; i++) {
        gubbinsCopy[key][i].fill = colourDB.block.gubbinsPerTaxa;
      }
    }

    // merge!
    for (const taxa of taxaOnlyInGubbins) {
      ret.merged[taxa] = gubbinsCopy[taxa]; // pass by reference
    }
    for (const taxa of taxaOnlyInBratNextGen) {
      ret.merged[taxa] = bratNextGen[taxa]; // pass by reference
    }
    /* if we simply wanted to add in both sets of blocks and let the opacity merge we could do
     * // for (const taxa of commonTaxa) {
     * //   ret.merged[taxa] = bratNextGen[taxa].concat(gubbinsCopy[taxa]); // pass by reference
     * // }
     * but we want to actually slice up the blocks and create new ones for the overlaps
     *
     * remember no two gubbins blocks will overlap & vice versa
     */
    for (const taxa of commonTaxa) {
      let uniqId = 100000;
      const allBlocks = gubbinsCopy[taxa].concat(bratNextGen[taxa]);
      allBlocks.sort(sortBlockwise);
      const merged = [ allBlocks[0] ];
      for (let i = 1; i < allBlocks.length; i++) {
        if (allBlocks[i].startBase < merged[merged.length - 1].endBase) {
          // overlap of some kind
          if (allBlocks[i].startBase === merged[merged.length - 1].startBase) {
            // overlap cancelling out the first bit of the saved block
            // note that because we sorted on endBase as well
            // this incomming block CANNOT be shorter than the saved block - so we can overwrite
            merged[merged.length - 1].fill = colourDB.block.merge;
            if (allBlocks[i].endBase > merged[merged.length - 1].endBase) {
              allBlocks[i].startBase = merged[merged.length - 1].endBase + 1;
              merged.push(allBlocks[i]);
            }
          } else {
            // so we know that incomming.start > existing.start, so make this start block
            const existingEndBase = merged[merged.length - 1].endBase;
            const existingColour = merged[merged.length - 1].fill;
            merged[merged.length - 1].endBase = allBlocks[i].startBase;
            if (allBlocks[i].endBase > existingEndBase) {
              merged.push(new Block(allBlocks[i].startBase, existingEndBase, uniqId++, { colour: colourDB.block.merge }));
              allBlocks[i].startBase = existingEndBase + 1;
              merged.push(allBlocks[i]);
            } else {
              merged.push(new Block(allBlocks[i].startBase, allBlocks[i].endBase, uniqId++, { colour: colourDB.block.merge }));
              merged.push(new Block(allBlocks[i].endBase + 1, existingEndBase, uniqId++, { colour: existingColour }));
            }
          }
        } else {
          // no overlap -> add in the block
          merged.push(allBlocks[i]);
        }
      }
      ret.merged[taxa] = merged;
    }
  }
  ret.blocks = ret.merged;
  return ret;
}

function sortBlockwise(a, b) {
  if (a.startBase < b.startBase) {
    return (-1);
  }
  if (a.startBase > b.startBase) {
    return (1);
  }
  // if we're here then the startBases are equal
  if (a.endBase < b.endBase) {
    return (-1);
  }
  if (a.endBase < b.endBase) {
    return (1);
  }
  // identical positioning
  return (0);
}


function collapseGubbins(blocksIn) {
  const blocksByTaxa = {};
  let uniqId = 0;
  for (const block of blocksIn) {
    for (const taxaName of block.taxa) { // caution: can't reuse 'taxa' as a variable name here
      if (!blocksByTaxa[taxaName]) {
        blocksByTaxa[taxaName] = [];
      }
      //  new Block(start, end, id, {colour, taxa, node, info})
      blocksByTaxa[taxaName].push(new Block(block.startBase, block.endBase, uniqId++, {}));
    }
  }
  /* we now have a object with keys of taxaName and values of Array of Blocks
   * and we want to collapse the blocks, i.e. if they are overlapping then take em out!
   * alrogithm:
   * for each taxaName:
   * - sort the array on x1
   * - if block in question extends past last one in ret but overlaps then change the co-ords in ret
   * - if block doesn't overlap with ret then append it!
   */
  const ret = {};
  uniqId = 0;
  for (const taxaName of Object.keys(blocksByTaxa)) {
    const blocksOneTaxa = blocksByTaxa[taxaName];
    blocksOneTaxa.sort(sortBlockwise);
    const mergedBlocks = [ new Block(blocksOneTaxa[0].startBase, blocksOneTaxa[0].endBase, uniqId++, { colour: colourDB.block.gubbinsPerTaxa }) ];
    for (const thisBlock of blocksOneTaxa) {
      // note that thisBlock.startBase CANNOT be before mergedBlocks[mergedBlocks.length-1].startBase
      // but thisBlock.startBase MAY BE BEFORE mergedBlocks[mergedBlocks.length-1].endBase
      // and thisBlock.startBase MAY BE AFTER mergedBlocks[mergedBlocks.length-1].endBase
      if (thisBlock.startBase < mergedBlocks[mergedBlocks.length - 1].endBase && thisBlock.endBase > mergedBlocks[mergedBlocks.length - 1].endBase) { // MERGE
        mergedBlocks[mergedBlocks.length - 1].endBase = thisBlock.endBase;
      } else if (thisBlock.startBase > mergedBlocks[mergedBlocks.length - 1].endBase) { // NEW BLOCK
        mergedBlocks.push(new Block(thisBlock.startBase, thisBlock.endBase, uniqId++, { colour: colourDB.block.gubbinsPerTaxa }));
      }
    }
    ret[taxaName] = mergedBlocks;
  }
  return (ret);
}


/* VERY VERY SLOW */
// function collapseGubbins(blocksIn) {
//   console.log('this is slow & must be moved to a webworker. should show spinner!');
//   /* three steps:
//    * (1) create a map with keys of taxa and values = sparse array of genome length
//    * (2) for each block make the sparse array = 1 across it's coordinates
//    * (3) crawl that map by taxa making up arrows as we go along
//    */
//   // step 1 and two combined...
//   const presence = {};
//   for (const block of blocksIn) {
//     for (const taxaName of block.taxa) { // caution: can't reuse 'taxa' as a variable name here
//       if (!presence[taxaName]) {
//         presence[taxaName] = [];
//       }
//       for (let basePos = block.startBase; basePos <= block.endBase; basePos++) {
//         presence[taxaName][basePos] = 1;
//       }
//     }
//   }
//   console.log('step 1+2 done');
//   // step 3
//   const ret = {};
//   for (const taxa of Object.keys(presence)) {
//     ret[taxa] = [];
//     let inBlock = false;
//     let startBase = undefined;
//     let uniqId = 0;
//     for (let idx = 0; idx < presence[taxa].length; idx++) {
//       if (inBlock) {
//         if (!presence[taxa][idx]) { // no longer in block -- save!
//           //  new Block(start, end, id, {colour, taxa, node, info})
//           ret[taxa].push(new Block(startBase, idx - 1, uniqId++, {}));
//           inBlock = false;
//         }
//       } else { // not in a block
//         if (presence[taxa][idx]) { // open a block
//           inBlock = true;
//           startBase = idx;
//         }
//       }
//     }
//     // step 3 close last block
//     if (inBlock) {
//       ret[taxa].push(new Block(startBase, presence[taxa].length, uniqId++, {}));
//     }
//   }
//   console.log('step 3/3 done');
//   return (ret);
// }


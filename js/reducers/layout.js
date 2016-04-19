import merge from 'lodash/merge';

const startingValues = {
  colPercs: [ 20, 11, 69 ],
  rowPercs: [ 15, 70, 15 ],
};


const init = {
  active: {
    blocks: false,
    tree: false,
    smallGenome: false,
    meta: false,
    annotation: false,
    metaKey: false,
    plots: {},
  },
  colPercs: startingValues.colPercs,
  rowPercs: startingValues.rowPercs,
  logoIsOn: true,
};


export function layout(state = init, action) {
  let newState;
  switch (action.type) {
  // when new data is loaded, load it and give it a percentage
  case 'clearAllData':
    const r = init;
    r.active.plots = {};
    return r;
  case 'annotationData':
    newState = merge({}, state);
    newState.active.annotation = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 0, false);
    return newState;
  case 'roaryData': // fallthrough
  case 'gubbinsData':
    newState = merge({}, state);
    newState.active.blocks = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    return newState;
  case 'computeLineGraph':
    newState = merge({}, state);
    newState.active.plots.line = true;
    if (newState.rowPercs[2] < startingValues.rowPercs[2]) {
      newState.rowPercs = changePercs(newState.rowPercs, startingValues.rowPercs[2], 2);
    }
    return newState;
  case 'gwasData':
    newState = merge({}, state);
    newState.active.plots.gwas = true;
    if (newState.rowPercs[2] < startingValues.rowPercs[2]) {
      newState.rowPercs = changePercs(newState.rowPercs, startingValues.rowPercs[2], 2);
    }
    return newState;
  case 'treeData':
    newState = merge({}, state);
    newState.active.tree = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 0, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    return newState;
  case 'bratNextGenData':
    // copy and paste job of both blocks and metadata -- to imporve!
    newState = merge({}, state);
    newState.active.meta = true;
    newState.active.blocks = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    newState.colPercs = calculateNewPercs(state.colPercs, 1, true);
    return newState;
  case 'metaData':
    newState = merge({}, state);
    newState.active.meta = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 1, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    return newState;
  // modify percentages
  // case 'layoutColChange':
  //   newState = merge({}, state);
  //   newState.colPercs = distributeNewPercs(newState.colPercs, action.perc, action.idx);
  //   // newState.colPercs[action.idx] = action.perc;
  //   return newState;
  // case 'layoutRowChange':
  //   newState = merge({}, state);
  //   // newState.rowPercs[action.idx] = action.perc;
  //   newState.rowPercs = distributeNewPercs(newState.rowPercs, action.perc, action.idx);
  //   return newState;
  case 'layoutRowPercentChange':
    newState = merge({}, state);
    newState.rowPercs = changePercs(newState.rowPercs, action.perc, action.idx);
    return newState;
  case 'layoutColPercentChange':
    newState = merge({}, state);
    newState.colPercs = changePercs(newState.colPercs, action.perc, action.idx);
    return newState;
  // de-re-activate things
  case 'turnOffCanvas':
    newState = merge({}, state);
    newState.active[action.name] = false;
    if (!newState.active.meta) {
      newState.active.metaKey = false;
    }
    return newState;
  case 'turnOnCanvas':
    newState = merge({}, state);
    newState.active[action.name] = true;
    return newState;
  case 'toggleMetaKey':
    newState = merge({}, state);
    // if metadata is currently active, then we can toggle:
    if (state.active.meta) {
      newState.active.metaKey = !state.active.metaKey;
    }
    return newState;
  case 'toggleLogo':
    newState = merge({}, state);
    newState.logoIsOn = !newState.logoIsOn;
    return newState;
  default:
    return state;
  }
}


function calculateNewPercs(old, idxAdded, column) {
  let ret;
  if (old[idxAdded]) {
    // console.log('what should I do?');
    ret = old;
  } else {
    [ ...ret ] = old;
    ret[idxAdded] = column ? startingValues.colPercs[idxAdded] : startingValues.rowPercs[idxAdded];
    // divy up the newly added value and remove it from the current ones (right?)
  }
  return ret;
}

function add(a, b) {return (a + b);} // http://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers

// function distributeNewPercs(oldVals, newVal, newIdx) {
//   const newVals = [ ...oldVals ];
//   newVals[newIdx] = newVal;
//   const spaceToFill = oldVals[newIdx] - newVal;

//   for (let i = 0; i < oldVals.length; i++) {
//     if (i === newIdx) {
//       continue;
//     }
//     newVals[i] = parseInt(oldVals[i] + spaceToFill * (oldVals[i] / 100), 10);
//   }

//   newVals[0] -= newVals.reduce(add, 0) - 100;

//   return newVals;
// }

export function changePercs(oldVals, nv, idx) {
  const newVal = parseInt(nv, 10);
  if (newVal === oldVals[idx]) {
    return oldVals;
  }

  const newVals = [ ...oldVals ];
  newVals[idx] = newVal;

  if (newVals[idx] < 0) {
    newVals[idx] = 0;
  }

  // if (newIdx + 1 === oldVals.length) {
  //   return oldVals;
  // }

  const delta = newVals[idx] - oldVals[idx];
  /* delta > 0 iff element getting bigger */

  /* now distribute delta to the previous or next element */
  if (idx === oldVals.length - 1) {
    /* i.e. we've modified the final element */
    newVals[idx - 1] -= delta;
  } else if (idx === 0) {
    /* we've modified the top element */
    newVals[1] -= delta;
  } else {
    /* we've modified a middle element
     * remember the drag handle is below the element
     * so always change the subsequent element
     */
    newVals[idx + 1] -= delta;
  }

  if (newVals.some((cv) => cv < 0)) {
    return oldVals;
  }

  // console.log('changePercs (idx ', idx, ') ', delta, newVal, oldVals, newVals, oldVals.reduce(add, 0), newVals.reduce(add, 0));
  return newVals;
}

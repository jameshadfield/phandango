import merge from 'lodash/merge';

const startingValues = {
  colPercs: [ 100, 0, 0 ],
  rowPercs: [ 15, 77.5, 7.5 ],
};

const loadedValues = {
  colPercs: [ 20, 15, 65 ],
  rowPercs: [ 15, 70, 15 ],
};

const idealCols = {
  three: [ 20, 15, 65 ],
  noMeta: [ 25, 0, 75 ],
  noBlocks: [ 30, 70, 0 ],
  noBlocksButKey: [ 30, 30, 40 ],
};

const idealRows = {
  three: [ 15, 70, 15 ],
  noGraph: [ 15, 78, 7 ],
  noTree: [ 15, 5, 80 ],
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
    newState.colPercs = newState.active.meta ? idealCols.three : idealCols.noMeta;
    newState.rowPercs = idealRows.three;
    return newState;
  case 'roaryData': // fallthrough
  case 'gubbinsData':
    newState = merge({}, state);
    newState.active.blocks = true;
    newState.colPercs = newState.active.meta ? idealCols.three : idealCols.noMeta;
    return newState;
  case 'computeLineGraph':
    newState = merge({}, state);
    newState.active.plots.line = true;
    if (newState.rowPercs[2] < loadedValues.rowPercs[2]) {
      newState.rowPercs = changePercs(newState.rowPercs, loadedValues.rowPercs[2], 2);
    }
    return newState;
  case 'gwasData':
    newState = merge({}, state);
    newState.active.plots.gwas = true;
    if (newState.rowPercs[2] < loadedValues.rowPercs[2]) {
      newState.rowPercs = changePercs(newState.rowPercs, loadedValues.rowPercs[2], 2);
    }
    return newState;
  case 'treeData':
    newState = merge({}, state);
    newState.active.tree = true;
    if (!newState.colPercs[0]) {
      newState.colPercs = newState.active.meta ? idealCols.three : idealCols.noMeta;
    }
    if (!newState.rowPercs[1]) {
      newState.rowPercs = idealRows.three;
    }
    return newState;
  case 'bratNextGenData':
    // copy and paste job of both blocks and metadata -- to imporve!
    newState = merge({}, state);
    newState.active.meta = true;
    newState.active.blocks = true;
    newState.colPercs = idealCols.three;
    // newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    // newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    // newState.colPercs = calculateNewPercs(state.colPercs, 1, true);
    return newState;
  case 'metaData':
    newState = merge({}, state);
    newState.active.meta = true;
    /* we just want to ensure room for headers & middle panel (w+h) */
    if (newState.rowPercs[0] < loadedValues.rowPercs[0]) {
      newState.rowPercs = changePercs(newState.rowPercs, loadedValues.rowPercs[0], 0);
    }
    if (newState.rowPercs[1] < loadedValues.rowPercs[1]) {
      newState.rowPercs = changePercs(newState.rowPercs, loadedValues.rowPercs[1], 1);
    }
    if (newState.colPercs[2]) {
      /* plots / blocks / annotations have been loaded */
      if (newState.colPercs[1] < loadedValues.colPercs[1]) {
        newState.colPercs = changePercs(newState.colPercs, loadedValues.colPercs[1], 1);
      }
    } else {
      newState.colPercs[0] = 30;
      newState.colPercs[1] = 100 - newState.colPercs[0];
    }
    return newState;
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
    newState.active.blocks = true;
    if (state.active.meta) {
      newState.active.metaKey = !state.active.metaKey;
      if (newState.active.metaKey && !newState.colPercs[2]) {
        newState.colPercs = idealCols.noBlocksButKey;
      } else if (!newState.active.metaKey && !newState.active.annotation) {
        newState.colPercs = idealCols.noBlocks;
      }
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

// function add(a, b) {return (a + b);} // http://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers

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

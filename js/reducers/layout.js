import merge from 'lodash/object/merge';

const init = {
  active: {
    blocks: false,
    tree: false,
    smallGenome: false,
    meta: false,
    annotation: false,
    plots: [ false ],
  },
  colPercs: [ 0, 0, 0 ],
  rowPercs: [ 0, 0, 0 ],
};

const startingValues = {
  colPercs: [ 20, 11, 69 ],
  rowPercs: [ 15, 70, 15 ],
};

function calculateNewPercs(old, idxAdded, column) {
  let ret;
  if (old[idxAdded]) {
    console.log('what should I do?');
    ret = old;
  } else {
    [ ...ret ] = old;
    ret[idxAdded] = column ? startingValues.colPercs[idxAdded] : startingValues.rowPercs[idxAdded];
    // divy up the newly added value and remove it from the current ones (right?)
  }
  return ret;
}


export function layout(state = init, action) {
  const newState = merge({}, state);
  switch (action.type) {
  // when new data is loaded, load it and give it a percentage
  case 'annotationData':
    newState.active.annotation = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 0, false);
    return newState;
  case 'gubbinsData':
    newState.active.blocks = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 2, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    // don't forget the line graph!
    newState.active.plots[0] = true;
    newState.rowPercs[2] = 15;
    return newState;
  case 'treeData':
    newState.active.tree = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 0, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    return newState;
  case 'metaData':
    newState.active.meta = true;
    newState.colPercs = calculateNewPercs(state.colPercs, 1, true);
    newState.rowPercs = calculateNewPercs(state.rowPercs, 1, false);
    return newState;
  // modify percentages
  case 'layoutColChange':
    newState.colPercs[action.idx] = action.perc;
    return newState;
  case 'layoutRowChange':
    newState.rowPercs[action.idx] = action.perc;
    return newState;
  // de-re-activate things
  case 'turnOffCanvas':
    newState.active[action.name] = false;
    return newState;
  case 'turnOnCanvas':
    newState.active[action.name] = true;
    return newState;
  default:
    return state;
  }
}

/*
all cases in change values to defaults (set by constants, not in state)
and the rest are scaled apropriately!
metadata / blocks don't change anything
plots add X% to rows and the rest accomodate them (scale by (100-X))
annotation same as plots
blocks adds X% to cols and meta (if E) and tree scale

tree only 100,100
*/

import {
  computeLineGraph,
  computeMergedLineGraph,
  clearLineGraph,
} from './lineGraph.js';
import { notificationNew } from './notifications';

export function increaseSpinner(value = 1) {
  return ({ type: 'increaseSpinner', value });
}

export function decreaseSpinner() {
  return ({ type: 'decreaseSpinner' });
}

export function goToPage(name) {
  return function (dispatch) {
    dispatch({ type: 'newPage', name: name });
    if (name === 'settings') {
      dispatch(notificationNew('press \'s\' or \'m\' to exit settings!'));
    }
  };
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

export function toggleAllMetaColumns(newBool) {
  return ({ type: 'toggleAllMetaColumns', newBool });
}

export function toggleMetaKey() {
  return ({ type: 'toggleMetaKey' });
}

export function toggleLogo() {
  return ({ type: 'toggleLogo' });
}

/* showBlocks is a thunk in order to gain access to dispatch for multiple dispatches */
export function showBlocks(name) {
  return function (dispatch, getState) {
    /* we're trying to show the named dataset... so it better exist!
     * this could be better i'm sure...
     */
    if (name === 'roary') {
      // remember we trash roary if blocks data loaded...
      // so we can never go to roary except if we drag on data
      return;
    }
    if (name === 'gubbins' || name === 'gubbinsPerTaxa') {
      // check gubbins data is loaded!
      if (!getState().blocks.fileNames.gubbins) {
        return;
      }
    }
    if (name === 'bratNextGen') {
      // check loaded
      if (!getState().blocks.fileNames.bratNextGen) {
        return;
      }
    }
    if (name === 'merged') {
      // check both gubbins and bratNextGen
      if (!(getState().blocks.fileNames.gubbins && getState().blocks.fileNames.bratNextGen)) {
        return;
      }
    }
    // dispactch two things here - switch the blocks and subsequently switch the
    dispatch(increaseSpinner());
    dispatch({ type: 'showBlocks', name: name });
    if (name === 'merged') {
      dispatch(clearLineGraph());
      dispatch(computeMergedLineGraph([ 'gubbinsPerTaxa', 'bratNextGen' ]));
    } else {
      dispatch(computeLineGraph());
    }
    dispatch(decreaseSpinner());
  };
}


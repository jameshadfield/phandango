import { notificationNew } from './notifications';

// why are these thunks? they're not async

export function genomePan(fracCanvasPan, smallGenome = false) {
  // THUNK
  return function (dispatch, getState) {
    const visibleGenome = getState().genomeInfo.visibleGenome;
    const genomeLength = getState().genomeInfo.genomeLength;
    if (visibleGenome[0] === 0 && visibleGenome[1] === genomeLength) {
      dispatch( notificationNew('can\'t drag (whole genome in view)'));
      return;
    }
    let bpToMove = (visibleGenome[1] - visibleGenome[0]) * fracCanvasPan;
    if (smallGenome) {
      bpToMove = genomeLength * fracCanvasPan;
    }

    let newLeft = visibleGenome[0] + bpToMove;
    let newRight = visibleGenome[1] + bpToMove;

    if (newLeft < 0 || newRight > genomeLength) {
      dispatch( notificationNew('can\'t drag (already at edge of genome)'));
      if (newLeft < 0) {
        if (newLeft === 0) {
          return;
        }
        newRight -= newLeft; // adds on the region to the left of 0
        newLeft = 0;
      } else {
        if (newRight === genomeLength) {
          return;
        }
        newLeft -= newRight - genomeLength;
        newRight = genomeLength;
      }
    }

    dispatch({ type: 'updateVisibleGenome', visibleGenome: [ newLeft, newRight ] });
  };
}

export function genomeZoom(delta, fracInCanvas) {
  const minimumBp = 1000;
  // console.log('genomeZoom. delta:', delta, 'fracInCanvas:', fracInCanvas);
  // THUNK
  return function (dispatch, getState) {
    const visibleGenome = getState().genomeInfo.visibleGenome;
    const genomeLength = getState().genomeInfo.genomeLength;
    // if we are trying to zoom out, but can already see entire genome:
    if (visibleGenome[0] === 0 && visibleGenome[1] === genomeLength && delta < 0) {
      dispatch( notificationNew('can\'t zoom out: whole genome in view'));
      return;
    }
    // if we are trying to zoom in too far:
    if (visibleGenome[1] - visibleGenome[0] === minimumBp && delta > 0) {
      dispatch( notificationNew('can\'t zoom in to less than 1000bp'));
      return;
    }
    // const multiplier = 2;   // each zoom shows X times as much / half as much of the viewport
    const deltaModifier = 1.5; // has to shift abs(delta) from [0,2] -> (1, x)
    const multiplier = delta > 0 ? delta + deltaModifier : delta * -1 + deltaModifier;
    // console.log('ZOOM delta '+delta+' fracInCanvas '+fracInCanvas)
    const bpLeftOfMouseX = fracInCanvas * (visibleGenome[1] - visibleGenome[0]);
    const bpRightOfMouseX = (visibleGenome[1] - visibleGenome[0]) - bpLeftOfMouseX;
    const baseAtMouseX = bpLeftOfMouseX + visibleGenome[0];
    let newVisibleGenome;
    if (delta > 0) { // zooming in
      newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX / multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX / multiplier, 10) ];
    } else {
      newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX * multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX * multiplier, 10) ];
    }

    // need some checking here -- don't want to zoom in too much and don't want to zoom out too much!
    if (newVisibleGenome[1] - newVisibleGenome[0] < minimumBp) {
      newVisibleGenome = [ baseAtMouseX - minimumBp / 2, baseAtMouseX + minimumBp / 2 ];
      // return;
    }
    if (newVisibleGenome[0] < 0) {newVisibleGenome[0] = 0; if (newVisibleGenome[1] < minimumBp) { newVisibleGenome[1] = minimumBp; } }
    if (newVisibleGenome[1] > genomeLength) {newVisibleGenome[1] = genomeLength; if (newVisibleGenome[0] > genomeLength - minimumBp) { newVisibleGenome[0] = genomeLength - minimumBp; } }

    // console.log('Now viewing ' + newVisibleGenome[0] + ' - ' + newVisibleGenome[1] + 'bp');
    dispatch({ type: 'updateVisibleGenome', visibleGenome: newVisibleGenome });
  };
}

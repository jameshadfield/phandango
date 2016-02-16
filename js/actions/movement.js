import { notificationNew } from './notifications';

// why are these thunks? they're not async

export function genomePan(fracCanvasPan) {
  // THUNK
  return function (dispatch, getState) {
    const visibleGenome = getState().genomeInfo.visibleGenome;
    const genomeLength = getState().genomeInfo.genomeLength;
    if (visibleGenome[0] === 0 && visibleGenome[1] === genomeLength) {
      dispatch( notificationNew('can\'t drag (whole genome in view)'));
      return;
    }
    const bpToMove = (visibleGenome[1] - visibleGenome[0]) * fracCanvasPan;
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
    const multiplier = 2;   // each zoom shows X times as much / half as much of the viewport
    // console.log('ZOOM delta '+delta+' fracInCanvas '+fracInCanvas)
    const bpLeftOfMouseX = fracInCanvas * (visibleGenome[1] - visibleGenome[0]);
    const bpRightOfMouseX = (visibleGenome[1] - visibleGenome[0]) - bpLeftOfMouseX;
    const baseAtMouseX = bpLeftOfMouseX + visibleGenome[0];
    let newVisibleGenome;
    if (delta > 0) {
      newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX / multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX / multiplier, 10) ];
    } else {
      newVisibleGenome = [ baseAtMouseX - parseInt(bpLeftOfMouseX * multiplier, 10), baseAtMouseX + parseInt(bpRightOfMouseX * multiplier, 10) ];
    }
    // need some checking here -- don't want to zoom in too much and don't want to zoom out too much!
    if (newVisibleGenome[1] - newVisibleGenome[0] < 1000) {
      dispatch( notificationNew('can\'t zoom in to less than 1000bp'));
      return;
    }
    if (newVisibleGenome[0] < 0) {newVisibleGenome[0] = 0;}
    if (newVisibleGenome[1] > genomeLength) {newVisibleGenome[1] = genomeLength;}
    // console.log('Now viewing ' + newVisibleGenome[0] + ' - ' + newVisibleGenome[1] + 'bp');
    dispatch({ type: 'updateVisibleGenome', visibleGenome: newVisibleGenome });
  };
}

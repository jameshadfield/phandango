export function genomePan(fracCanvasPan) {
  // THUNK
  return function (dispatch, getState) {
    const visibleGenome = getState().genomeInfo.visibleGenome;
    const genomeLength = getState().genomeInfo.genomeLength;
    if (visibleGenome[0] === 0 && visibleGenome[1] === genomeLength) {
      // console.log('can\'t drag (whole genome in view)');
      return { type: 'dummyAction', data: 'can\'t drag (whole genome in view)' };
    }
    const bpToMove = (visibleGenome[1] - visibleGenome[0]) * fracCanvasPan;
    const newLeft = visibleGenome[0] + bpToMove;
    const newRight = visibleGenome[1] + bpToMove;
    if (newLeft < 0 || newRight > genomeLength) {
      // console.log('can\'t drag (already at edge of genome)');
      dispatch({ type: 'dummyAction', data: 'can\'t drag (already at edge of genome)' });
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
      // console.log('can\'t zoom in to less than 1000bp');
      dispatch({ type: 'dummyAction', data: 'can\'t zoom in to less than 1000bp' });
    }
    if (newVisibleGenome[0] < 0) {newVisibleGenome[0] = 0;}
    if (newVisibleGenome[1] > genomeLength) {newVisibleGenome[1] = genomeLength;}
    // console.log('Now viewing ' + newVisibleGenome[0] + ' - ' + newVisibleGenome[1] + 'bp');
    dispatch({ type: 'updateVisibleGenome', visibleGenome: newVisibleGenome });
  };
}

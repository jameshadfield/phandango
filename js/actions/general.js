export function route(page) {
  return ({ type: 'newPage', pageName: page });
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

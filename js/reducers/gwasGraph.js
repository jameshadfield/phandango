const initialState = { values: [], max: 0 };

export function gwasGraph(state = initialState, action) {
  switch (action.type) {
  case 'clearAllData':
    return initialState;
  case 'clearPlotData':
    return initialState;
  case 'gwasData':
    return ({
      values: action.data,
      max: findMaxValueOfCircles(action.data),
    });
  default:
    return state;
  }
}


function findMaxValueOfCircles(arr) {
  let max = 1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].featurey > max) {
      max = arr[i].featurey;
    }
  }
  return max;
}

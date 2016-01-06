export function gwasGraph(state = { values: [], max: 0 }, action) {
  switch (action.type) {
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

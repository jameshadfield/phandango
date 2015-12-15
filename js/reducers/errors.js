export function errorQueue(state = [], action) {
  switch (action.type) {
  case 'newError':
    return [ action.message, ...state ];
  default:
    return state;
  }
}

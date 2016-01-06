
const noNotification = {
  message: undefined,
  dialog: true,
  title: undefined,
  open: false,
};

/* notifications reducer
responds to two actions (noticationNew & notificationSeen)
state.active holds the current notification (or noNotification)
an incomming notification either becomes the active notification or goes on the queue
a seen notification removes the active one and shifts off the queue
*/

export function notifications(state = { active: noNotification, queue: [], counter: 0 }, action) {
  switch (action.type) {
  case 'notificationNew':
    // is is the same as we are currently displaying?
    if (action.title === state.active.title) {
      return state;
    }
    const notification = {
      message: action.msg,
      title: action.title,
      dialog: action.dialog,
      open: true,
    };
    const newQueue = [ ...state.queue, notification ];
    let active;
    if (!state.active.open) { // nothing currently displayed
      active =  newQueue.shift();
    } else {
      active = state.active;
    }
    return ({ active, queue: newQueue, counter: state.counter + 1 });
  case 'notificationSeen':
    if (!state.active.open) {
      console.error('clearing a notification which doesn\'t exist!');
    }
    const newState = { counter: state.counter + 1 };
    if (state.queue.length) { // things to go out
      newState.queue = [ ...state.queue ];
      newState.active = newState.queue.shift();
    } else { // nothing on queue
      newState.active = noNotification;
      newState.queue = [];
    }
    return newState;
  default:
    return state;
  }
}


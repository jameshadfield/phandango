const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');
let queue; // maintain a queue of err objects

const ErrStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    // console.log('change emitted');
    this.emit('change');
  },
  addChangeListener: function (callback) {
    this.on('change', callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },
  getErr: function () {
    return queue.shift();
  },

});

Dispatcher.register(function (payload) {
  if (payload.actionType === 'newErr') {
    // console.log('ErrStore has received a new error:', payload.errObj);
    // if (payload.errObj.isArray()) {
    //  Array.prototype.push.apply(queue, payload.errObj);
    // } else {
    //  queue.push(payload.errObj);
    //  }
    queue = payload.errObj;
    ErrStore.emitChange();
  }
});

module.exports = ErrStore;

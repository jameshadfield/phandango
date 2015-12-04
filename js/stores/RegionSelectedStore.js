const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');

let locationClicked = [ 0, 0 ];
let canvasId = undefined;

const RegionSelectedStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    // console.log("regions selected store store emission")
    this.emit('change');
  },
  addChangeListener: function (callback) {
    this.on('change', callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },
  getClickXY: function () {
    return locationClicked;
  },
  getID: function () {
    return canvasId;
  },
});

Dispatcher.register(function (payload) {
  if (payload.actionType === 'click') {
    canvasId = payload.id;
    locationClicked = [ payload.mx, payload.my ];
    // console.log('action received. locationClicked = ['+payload.mx+', '+payload.my+']')
    RegionSelectedStore.emitChange();
  }
});

module.exports = RegionSelectedStore;

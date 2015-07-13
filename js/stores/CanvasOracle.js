
// normally, using browserify / JSinclude / whatever we would have the following:
// var EventEmitter = require('events').EventEmitter;
// var assign = require('object-assign');
// but, using the following https://github.com/substack/browserify-handbook#standalone
// and http://learnjs.io/blog/2014/02/06/creating-js-library-builds-with-browserify-and-other-npm-modules/
// we have them included as normal scripts in index.html
// e.g. objectAssign via a temp .js file with:
//		var objectAssign = require('object-assign');
//		module.exports = objectAssign;
// variables (global) objectAssign (instead of assign) and EventEmitter (as normal)
// this also means that variables here are global and not closed !

// following http://www.jackcallister.com/2015/02/26/the-flux-quick-start-guide.html

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
console.log(Dispatcher)
var active_canvases = {gubbins:true, phylo:true};

var CanvasOracle = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getAll: function() {
		return active_canvases;

	}

})

function _turn_on_canvas(canvasName) {
	active_canvases[canvasName] = true;
}
function _turn_off_canvas(canvasName) {
	active_canvases[canvasName] = false;
}
function _toggle_canvas(canvasName) {
	if (active_canvases[canvasName]) {
		active_canvases[canvasName] = false
	} else {
		active_canvases[canvasName] = true
	}
}
// register this store with the dispatcher (here, not in actions)

Dispatcher.register(function(payload) {
  if (payload.actionType === 'turn-on-canvas') {
    _turn_on_canvas(payload.canvasName);
    CanvasOracle.emitChange();
  }
  else if (payload.actionType === 'turn-off-canvas') {
    _turn_off_canvas(payload.canvasName);
    CanvasOracle.emitChange();
  }
  else if (payload.actionType === 'toggle-canvas') {
    _toggle_canvas(payload.canvasName);
    CanvasOracle.emitChange();
  }
})

module.exports = CanvasOracle;

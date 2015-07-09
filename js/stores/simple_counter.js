
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

var count = 0;

var SimpleStore = objectAssign({}, EventEmitter.prototype, {
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
		return count;

	}

})

function _increment_count() {
	count = count+1
}

// register this store with the dispatcher (here, not in actions)

dispatcher.register(function(payload) {
  if (payload.actionType === 'counter-increment') {
    // simple_store.increment_current_count()
    _increment_count();
    SimpleStore.emitChange();
  }

})


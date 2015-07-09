
// already defined: dispatcher


dispatcher.register(function(payload) {
  if (payload.actionType === 'counter-increment') {
    // simple_store.increment_current_count()
    _increment_count();
    SimpleStore.emitChange();
  }

})




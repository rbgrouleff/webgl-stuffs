(function() {
  var Observable = {
    on: function(event, callback, context) {
      this.callbacks = this.callbacks || {};
      this.callbacks[event] = this.callbacks[event] || [];
      this.callbacks[event].push(function(arguments) { callback.apply(context, arguments); });
    },

    trigger: function(event, arguments) {
      if (this.callbacks) this.callbacks[event].forEach(function(c) { c.apply(null, arguments); });
    }
  };

  this.Observable = Observable;
}).call(this);

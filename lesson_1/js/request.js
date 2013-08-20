(function() {
  function Request(url, callback, context) {
    this.url = url;
    this.callback = callback;
    this.context = context;
    this.rawRequest = new XMLHttpRequest();
  };

  Request.prototype = {
    open: function() {
      var context = this;
      this.rawRequest.onreadystatechange = function() { context.stateChanged.call(context); };
      this.rawRequest.open('GET', this.url, true);
      this.rawRequest.send();
    },
    stateChanged: function() {
      if (this.rawRequest.readyState === 4) {
        this.callback.apply(this.context, [this.rawRequest.responseText]);
      }
    }
  };

  this.Request = Request;
}).call(this);

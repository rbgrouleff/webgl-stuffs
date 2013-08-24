(function() {
  function request(url, callback) {
    return function() {
      var req = new XMLHttpRequest();
      req.onreadystatechange = readyStateChanged(req, callback);
      req.open('GET', url, true);
      req.send();
    };
  };

  function readyStateChanged(request, callback) {
    return function() {
      if (request.readyState === 4) {
        callback(request.responseText);
      }
    };
  };

  this.request = request;
}).call(this);

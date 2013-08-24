(function() {
  var initializer = function() {
    var lesson = new this.Lesson1(document.getElementsByTagName('body')[0], 500, 500);
    lesson.start();
  };

  this.addEventListener("load",initializer, false);
}).call(this);

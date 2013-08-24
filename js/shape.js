(function() {
  function Shape(program, vertices, itemSize, numItems) {
    this.program = program,
    this.vertices = vertices,
    this.itemSize = itemSize,
    this.numItems = numItems;
    this.init();
  };

  Shape.prototype = {
    init: function() {
      this.buffer = this.program.createBuffer(this.vertices);
    },

    draw: function() {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    },
  };

  this.Shape = Shape;
}).call(this);

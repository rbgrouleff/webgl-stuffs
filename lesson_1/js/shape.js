(function() {
  function Shape(context, vertices, itemSize, numItems) {
    this.context = context,
    this.vertices = vertices,
    this.itemSize = itemSize,
    this.numItems = numItems;
    this.init();
  };

  Shape.prototype = {
    init: function() {
      this.buffer = this.context.createBuffer();
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(this.vertices), this.context.STATIC_DRAW);
    },

    draw: function() {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
    },
  };

  this.Shape = Shape;
}).call(this);

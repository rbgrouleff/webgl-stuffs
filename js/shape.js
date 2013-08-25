(function() {
  function Shape(program, vertices, position, drawMethod) {
    this.program = program;
    this.context = program.context;
    this.vertices = vertices;
    this.itemSize = 3;
    this.numItems = vertices.length/this.itemSize;
    this.position = position;
    this.drawMethod = drawMethod;
    this.init();
  };

  Shape.prototype = {
    init: function() {
      this.modelViewMatrix = mat4.create();
      this.buffer = this.program.createBuffer(this.vertices);
    },

    draw: function() {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);
      this.context.vertexAttribPointer(this.program.getAttribute('aVertexPosition'), this.itemSize, this.context.FLOAT, false, 0, 0);
      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.position);
      this.context.uniformMatrix4fv(this.program.getUniform('uMVMatrix'), false, this.modelViewMatrix);
      this.context.drawArrays(this.drawMethod, 0, this.numItems);
    },
  };

  this.Shape = Shape;
}).call(this);

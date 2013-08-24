(function() {
  function Lesson1(el, width, height) {
    this.width = width, this.height = height, this.canvas = document.createElement('canvas');
    this.canvas.width = this.width, this.canvas.height = this.height;
    this.context = this.canvas.getContext('webgl');
    this.glProgram = new GLProgram(this.context, { shaders: [{ url: './shaders/shader.fs', type: 'fragment' }, { url: './shaders/shader.vs', type: 'vertex' }] });
    this.projectionMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();
    el.appendChild(this.canvas);
  };

  Lesson1.prototype = {
    start: function() {
      this.context.clearColor(0.0, 0.0, 0.0, 1.0);
      this.context.enable(this.context.DEPTH_TEST);
      this.glProgram.on('initialized', function() {
        this.initBuffers();
        this.drawScene();
      }, this);
      this.glProgram.initialize();
    },

    initBuffers: function() {
      var vertices = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
      ];
      this.triangle = new Shape(this.glProgram, vertices, 3, 3);
      this.triangle.init();

      vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
      ];
      this.square = new Shape(this.glProgram, vertices, 3, 4);
      this.square.init();
    },

    drawScene: function() {
      this.context.viewport(0, 0, this.width, this.height);
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

      mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 100.0);

      mat4.identity(this.modelViewMatrix);

      var vertexPositionAttribute = this.glProgram.getAttribute('aVertexPosition');
      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-1.5, 0.0, -7.0]);

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.triangle.buffer);
      this.context.vertexAttribPointer(vertexPositionAttribute, this.triangle.itemSize, this.context.FLOAT, false, 0, 0);

      this.setMatrixUniforms();

      this.context.drawArrays(this.context.TRIANGLES, 0, this.triangle.numItems);

      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [3.0, 0.0, 0.0]);

      this.context.bindBuffer(this.context.ARRAY_BUFFER, this.square.buffer);
      this.context.vertexAttribPointer(vertexPositionAttribute, this.square.itemSize, this.context.FLOAT, false, 0, 0);

      this.setMatrixUniforms();

      this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, this.square.numItems);
    },

    setMatrixUniforms: function() {
      this.context.uniformMatrix4fv(this.glProgram.getUniform('uPMatrix'), false, this.projectionMatrix);
      this.context.uniformMatrix4fv(this.glProgram.getUniform('uMVMatrix'), false, this.modelViewMatrix);
    },
  };

  this.Lesson1 = Lesson1;
}).call(this);

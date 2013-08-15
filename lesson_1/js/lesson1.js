(function() {
  function Lesson1(el, width, height) {
    this.width = width, this.height = height, this.canvas = document.createElement('canvas');
    this.canvas.width = this.width, this.canvas.height = this.height;
    this.perspectiveMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();
    el.appendChild(this.canvas);
  };

  Lesson1.prototype = {
    start: function() {
      this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      this.glContext.enable(this.glContext.DEPTH_TEST);

      this.drawScene();
    },

    initGL: function() {
      this.glContext = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    },

    initShaders: function() {
    },

    initBuffers: function() {
      var vertices = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
      ];
      this.triangle = new Shape(this.glContext, vertices, 3, 3);

      vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
      ];
      this.square = new Shape(this.glContext, vertices, 3, 4);
    },

    drawScene: function() {
      this.glContext.viewport(0, 0, this.width, this.height);
      this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);

      mat4.perspective(this.perspectiveMatrix, 45, this.width / this.height, 0.1, 100.0);

      mat4.identity(this.modelViewMatrix);
      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-1.5, 0.0, -7.0]);
    },
  };

  this.Lesson1 = Lesson1;
}).call(this);

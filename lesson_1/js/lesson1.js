(function() {
  function Lesson1(el, width, height) {
    this.width = width, this.height = height, this.canvas = document.createElement('canvas');
    this.canvas.width = this.width, this.canvas.height = this.height;
    this.projectionMatrix = mat4.create();
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
      var fragmentShader = this.getShader('shader-fs');
      var vertexShader = this.getShader('shader-vs');

      this.shaderProgram = this.glContext.createProgram();
      this.glContext.attachShader(this.shaderProgram, vertexShader);
      this.glContext.attachShader(this.shaderProgram, fragmentShader);
      this.glContext.linkProgram(this.shaderProgram);

      if (!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS)) {
        alert("Could not initialize shaders.");
      }

      this.glContext.useProgram(this.shaderProgram);

      this.vertexPositionAttribute = this.glContext.getAttribLocation(this.shaderProgram, "aVertexPosition");
      this.glContext.enableVertexAttribArray(this.vertexPositionAttribute);

      this.projectionMatrixUniform = this.glContext.getUniformLocation(this.shaderProgram, "uPMatrix");
      this.modelViewMatrixUniform = this.glContext.getUniformLocation(this.shaderProgram, "uMVMatrix");
    },

    initBuffers: function() {
      var vertices = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
      ];
      this.triangle = new Shape(this.glContext, vertices, 3, 3);
      this.triangle.init();

      vertices = [
         1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
      ];
      this.square = new Shape(this.glContext, vertices, 3, 4);
      this.square.init();
    },

    drawScene: function() {
      this.glContext.viewport(0, 0, this.width, this.height);
      this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);

      mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 100.0);

      mat4.identity(this.modelViewMatrix);
      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-1.5, 0.0, -7.0]);

      this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.triangle.buffer);
      this.glContext.vertexAttribPointer(this.vertexPositionAttribute, this.triangle.itemSize, this.glContext.FLOAT, false, 0, 0);

      this.setMatrixUniforms();

      this.glContext.drawArrays(this.glContext.TRIANGLES, 0, this.triangle.numItems);

      mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [3.0, 0.0, 0.0]);

      this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.square.buffer);
      this.glContext.vertexAttribPointer(this.vertexPositionAttribute, this.square.itemSize, this.glContext.FLOAT, false, 0, 0);

      this.setMatrixUniforms();

      this.glContext.drawArrays(this.glContext.TRIANGLE_STRIP, 0, this.square.numItems);
    },

    getShader: function(id) {
      var shaderScript = document.getElementById(id);
      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
        if (k.nodeType === 3)
          str += k.textContent;
        k = k.nextSibling;
      }
      var shader;
      if (shaderScript.type === 'x-shader/x-fragment') {
        shader = this.glContext.createShader(this.glContext.FRAGMENT_SHADER);
      } else if (shaderScript.type === 'x-shader/x-vertex') {
        shader = this.glContext.createShader(this.glContext.VERTEX_SHADER);
      } else {
        return null;
      }
      this.glContext.shaderSource(shader, str);
      this.glContext.compileShader(shader);

      if (!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)) {
        alert(this.glContext.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    },

    setMatrixUniforms: function() {
      this.glContext.uniformMatrix4fv(this.projectionMatrixUniform, false, this.projectionMatrix);
      this.glContext.uniformMatrix4fv(this.modelViewMatrixUniform, false, this.modelViewMatrix);
    },
  };

  this.Lesson1 = Lesson1;
}).call(this);

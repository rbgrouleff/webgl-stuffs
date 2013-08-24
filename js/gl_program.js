(function() {
  function GLProgram(context, options) {
    this.options = options;
    this.context = context;
    this.attributes = {};
    this.uniforms = {};
  }

  GLProgram.prototype = Object.create(Observable);

  GLProgram.prototype.initialize = function() {
    this.program = this.context.createProgram();
    var context = this;
    async.map(
      this.options.shaders,
      fetchAndCompileShader(this.context, this.program),
      programLinker(this.context, this.program, function() {
        context.trigger.call(context, 'initialized');
      })
    );
  };

  GLProgram.prototype.use = function() {
    this.context.useProgram(this.program);
  };

  GLProgram.prototype.getAttribute = function(name) {
    this.use();
    if (!this.attributes[name]) {
      var attrib = this.context.getAttribLocation(this.program, name);
      this.context.enableVertexAttribArray(attrib);
      this.attributes[name] = attrib;
    }
    return this.attributes[name];
  };

  GLProgram.prototype.getUniform = function(name) {
    this.use();
    if (!this.uniforms[name]) {
      var uniform = this.context.getUniformLocation(this.program, name);
      this.uniforms[name] = uniform;
    }
    return this.uniforms[name];
  };

  GLProgram.prototype.createBuffer = function(vertices) {
    buffer = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(vertices), this.context.STATIC_DRAW);
    return buffer;
  };

  var programLinker = function(context, program, callback) {
    return function(error, shaders) {
      shaders.forEach(function(shader) {
        context.attachShader(program, shader);
      });
      context.linkProgram(program);
      callback();
    };
  };

  var fetchAndCompileShader = function(context, program) {
    return function(shaderOptions, callback) {
      request(shaderOptions.url, shaderCompiler(shaderOptions.type, context, callback)).call();
    };
  };

  var shaderCompiler = function(type, context, callback) {
    var glType = type == 'fragment' ? context.FRAGMENT_SHADER : context.VERTEX_SHADER;
    return function(source) {
      var handle = context.createShader(glType);
      context.shaderSource(handle, source);
      context.compileShader(handle);
      if (!context.getShaderParameter(handle, context.COMPILE_STATUS)) {
        console.log(context.getShaderInfoLog(handle));
      }
      callback(null, handle);
    };
  };

  this.GLProgram = GLProgram;
}).call(this);

(function() {
  function GLProgram(canvas) {
    this.context = canvas.getContext('webgl');
    this.context.enable(this.context.DEPTH_TEST);
    this.program = this.context.createProgram();
  }

  GLProgram.prototype = Object.create(Observable);

  GLProgram.prototype.initialize = function() {
    var context = this;
    async.map(
      [{ url: './shaders/shader.fs', type: 'fragment' }, { url: './shaders/shader.vs', type: 'vertex' }], 
      fetchAndCompileShader(this.context, this.program),
      programLinker(this.context, this.program, function() {
        context.trigger.call(context, 'initialized');
      })
    );
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

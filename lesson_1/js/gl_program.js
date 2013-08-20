(function() {
  function GLProgram(canvas) {
    this.context = canvas.getContext('webgl');
    this.context.enable(this.context.DEPTH_TEST);
  }

  GLProgram.prototype = Object.create(Observable);

  GLProgram.prototype.initialize = function() {
    var fragmentShader = requestShaderSource('./shaders/shader.fs', shaderCompiler('fragment', this.context));
    var vertexShader = requestShaderSource('./shaders/shader.vs', shaderCompiler('vertex', this.context));
    this.trigger('initialized');
  };

  var requestShaderSource = function(url, callback) {
    request = new Request(url, callback).open();
  };

  var shaderCompiler = function(type, context) {
    var glType = type == 'fragment' ? context.FRAGMENT_SHADER : context.VERTEX_SHADER;
    return function(source) {
      var handle = context.createShader(glType);
      context.shaderSource(handle, source);
      context.compileShader(handle);
      if (!context.getShaderParameter(handle, context.COMPILE_STATUS)) {
        console.log(context.getShaderInfoLog(handle));
        return null;
      }
      return handle;
    };
  };

  this.GLProgram = GLProgram;
}).call(this);

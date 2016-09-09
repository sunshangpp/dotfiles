(function() {
  var Environment, Executor, fs, os, _;

  _ = require('underscore-plus');

  os = require('os');

  fs = require('fs-plus');

  Executor = require('./executor');

  module.exports = Environment = (function() {
    function Environment(environment) {
      this.environment = environment;
    }

    Environment.prototype.Clone = function() {
      var env, executor, match, matcher, pathhelper, result;
      env = _.clone(this.environment);
      if (env.DYLD_INSERT_LIBRARIES != null) {
        env.DYLD_INSERT_LIBRARIES = void 0;
      }
      if (!(os.platform() === 'darwin' && env.PATH === '/usr/bin:/bin:/usr/sbin:/sbin')) {
        return env;
      }
      pathhelper = '/usr/libexec/path_helper';
      if (!fs.existsSync(pathhelper)) {
        return env;
      }
      executor = new Executor(env);
      result = executor.execSync(pathhelper);
      if (result.code !== 0) {
        return env;
      }
      if ((result.stderr != null) && result.stderr !== '') {
        return env;
      }
      matcher = /^PATH="(.*?)";/img;
      match = matcher.exec(result.stdout);
      if (match == null) {
        return env;
      }
      env.PATH = match[1];
      return env;
    };

    return Environment;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZW52aXJvbm1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxXQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsV0FBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSwwQkFHQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpREFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBQyxDQUFBLFdBQVQsQ0FBTixDQUFBO0FBQ0EsTUFBQSxJQUF5QyxpQ0FBekM7QUFBQSxRQUFBLEdBQUcsQ0FBQyxxQkFBSixHQUE0QixNQUE1QixDQUFBO09BREE7QUFFQSxNQUFBLElBQUEsQ0FBQSxDQUFrQixFQUFFLENBQUMsUUFBSCxDQUFBLENBQUEsS0FBaUIsUUFBakIsSUFBOEIsR0FBRyxDQUFDLElBQUosS0FBWSwrQkFBNUQsQ0FBQTtBQUFBLGVBQU8sR0FBUCxDQUFBO09BRkE7QUFBQSxNQUdBLFVBQUEsR0FBYSwwQkFIYixDQUFBO0FBSUEsTUFBQSxJQUFBLENBQUEsRUFBb0IsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUFsQjtBQUFBLGVBQU8sR0FBUCxDQUFBO09BSkE7QUFBQSxNQUtBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FBUyxHQUFULENBTGYsQ0FBQTtBQUFBLE1BTUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxRQUFULENBQWtCLFVBQWxCLENBTlQsQ0FBQTtBQU9BLE1BQUEsSUFBYyxNQUFNLENBQUMsSUFBUCxLQUFpQixDQUEvQjtBQUFBLGVBQU8sR0FBUCxDQUFBO09BUEE7QUFRQSxNQUFBLElBQWMsdUJBQUEsSUFBbUIsTUFBTSxDQUFDLE1BQVAsS0FBbUIsRUFBcEQ7QUFBQSxlQUFPLEdBQVAsQ0FBQTtPQVJBO0FBQUEsTUFTQSxPQUFBLEdBQVUsbUJBVFYsQ0FBQTtBQUFBLE1BVUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBTSxDQUFDLE1BQXBCLENBVlIsQ0FBQTtBQVdBLE1BQUEsSUFBa0IsYUFBbEI7QUFBQSxlQUFPLEdBQVAsQ0FBQTtPQVhBO0FBQUEsTUFZQSxHQUFHLENBQUMsSUFBSixHQUFXLEtBQU0sQ0FBQSxDQUFBLENBWmpCLENBQUE7QUFhQSxhQUFPLEdBQVAsQ0FkSztJQUFBLENBSFAsQ0FBQTs7dUJBQUE7O01BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/environment.coffee

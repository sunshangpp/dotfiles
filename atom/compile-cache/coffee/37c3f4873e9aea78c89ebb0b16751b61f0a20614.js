(function() {
  var BufferedProcess, Executor, fs, spawnSync,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawnSync = require('child_process').spawnSync;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs-plus');

  module.exports = Executor = (function() {
    function Executor(environment) {
      this.exec = __bind(this.exec, this);
      this.execSync = __bind(this.execSync, this);
      this.environment = environment;
    }

    Executor.prototype.execSync = function(command, cwd, env, args, input) {
      var done, message, options, result;
      if (input == null) {
        input = null;
      }
      options = {
        cwd: null,
        env: null,
        encoding: 'utf8'
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      if (input) {
        options.input = input;
      }
      if (args == null) {
        args = [];
      }
      done = spawnSync(command, args, options);
      result = {
        error: done != null ? done.error : void 0,
        code: done != null ? done.status : void 0,
        stdout: (done != null ? done.stdout : void 0) != null ? done.stdout : '',
        stderr: (done != null ? done.stderr : void 0) != null ? done.stderr : '',
        messages: []
      };
      if (done.error != null) {
        if (done.error.code === 'ENOENT') {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          result.messages.push(message);
          result.code = 127;
        } else if (done.error.code === 'ENOTCONN') {
          result.error = null;
          result.code = 0;
        } else {
          console.log('Error: ' + JSON.stringify(done.error));
        }
      }
      return result;
    };

    Executor.prototype.exec = function(command, cwd, env, callback, args, input) {
      var bufferedprocess, code, error, exit, messages, options, output, stderr, stdout;
      if (input == null) {
        input = null;
      }
      output = '';
      error = '';
      code = 0;
      messages = [];
      options = {
        cwd: null,
        env: null
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      stdout = function(data) {
        return output += data;
      };
      stderr = function(data) {
        return error += data;
      };
      exit = function(data) {
        var message;
        if ((error != null) && error !== '' && error.replace(/\r?\n|\r/g, '') === "\'" + command + "\' is not recognized as an internal or external command,operable program or batch file.") {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          messages.push(message);
          callback(127, output, error, messages);
          return;
        }
        code = data;
        return callback(code, output, error, messages);
      };
      if (args == null) {
        args = [];
      }
      bufferedprocess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      bufferedprocess.onWillThrowError(function(err) {
        var message;
        if (err == null) {
          return;
        }
        if (err.error.code === 'ENOENT') {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          messages.push(message);
        } else {
          console.log('Error: ' + JSON.stringify(err.error));
        }
        err.handle();
        return callback(127, output, error, messages);
      });
      if (input != null) {
        return bufferedprocess.process.stdin.end(input);
      }
    };

    return Executor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvZXhlY3V0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBQ0Msa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxrQkFBQyxXQUFELEdBQUE7QUFDWCx5Q0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQUFmLENBRFc7SUFBQSxDQUFiOztBQUFBLHVCQUdBLFFBQUEsR0FBVSxTQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixJQUFwQixFQUEwQixLQUExQixHQUFBO0FBQ1IsVUFBQSw4QkFBQTs7UUFEa0MsUUFBUTtPQUMxQztBQUFBLE1BQUEsT0FBQSxHQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBTDtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBREw7QUFBQSxRQUVBLFFBQUEsRUFBVSxNQUZWO09BREYsQ0FBQTtBQUlBLE1BQUEsSUFBc0MsYUFBQSxJQUFTLEdBQUEsS0FBUyxFQUFsQixJQUF5QixHQUFBLEtBQVMsS0FBbEMsSUFBNEMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxHQUFkLENBQWxGO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixHQUFjLEVBQUUsQ0FBQyxZQUFILENBQWdCLEdBQWhCLENBQWQsQ0FBQTtPQUpBO0FBQUEsTUFLQSxPQUFPLENBQUMsR0FBUixHQUFpQixX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

//# sourceURL=/Users/ssun/.atom/packages/go-plus/lib/executor.coffee

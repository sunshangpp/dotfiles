Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _child_process = require('child_process');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _check = require('./check');

'use babel';

var Executor = (function () {
  function Executor(options) {
    _classCallCheck(this, Executor);

    this.environmentFn = null;
    if ((0, _check.isFalsy)(options) || (0, _check.isFalsy)(options.environmentFn)) {
      return;
    }

    this.environmentFn = options.environmentFn;
  }

  _createClass(Executor, [{
    key: 'dispose',
    value: function dispose() {
      this.environmentFn = null;
    }
  }, {
    key: 'environment',
    value: function environment() {
      if ((0, _check.isFalsy)(this.environmentFn)) {
        return process.env;
      }

      return this.environmentFn();
    }
  }, {
    key: 'execSync',
    value: function execSync(command) {
      var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options = (0, _check.isFalsy)(options) ? {} : options;
      options.encoding = 'utf8';
      if ((0, _check.isFalsy)(options.env)) {
        options.env = this.environment();
      }
      if ((0, _check.isTruthy)(options.cwd) && options.cwd.length > 0) {
        try {
          options.cwd = _fsPlus2['default'].realpathSync(options.cwd);
        } catch (e) {
          if (e.handle) {
            e.handle();
          }
          console.log(e);
        }
      }
      if ((0, _check.isFalsy)(args)) {
        args = [];
      }

      var done = (0, _child_process.spawnSync)(command, args, options);
      var code = done.status;

      var stdout = '';
      if (done.stdout && done.stdout.length > 0) {
        stdout = done.stdout;
      }
      var stderr = '';
      if (done.stderr && done.stderr.length > 0) {
        stderr = done.stderr;
      }
      var error = done.error;
      if (error && error.code) {
        switch (error.code) {
          case 'ENOENT':
            code = 127;
            break;
          case 'ENOTCONN':
            // https://github.com/iojs/io.js/pull/1214
            error = null;
            code = 0;
            break;
        }
      }

      return { exitcode: code, stdout: stdout, stderr: stderr, error: error };
    }
  }, {
    key: 'exec',
    value: function exec(command) {
      var _this = this;

      var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        options = (0, _check.isFalsy)(options) ? {} : options;
        options.encoding = 'utf8';
        if ((0, _check.isFalsy)(options.env)) {
          options.env = _this.environment();
        }
        if ((0, _check.isTruthy)(options.cwd) && options.cwd.length > 0) {
          try {
            options.cwd = _fsPlus2['default'].realpathSync(options.cwd);
          } catch (e) {
            if (e.handle) {
              e.handle();
            }
            console.log(e);
          }
        }
        if ((0, _check.isFalsy)(args)) {
          args = [];
        }

        var stdout = '';
        var stderr = '';
        var stdoutFn = function stdoutFn(data) {
          stdout += data;
        };
        var stderrFn = function stderrFn(data) {
          stderr += data;
        };
        var exitFn = function exitFn(code) {
          if ((0, _check.isTruthy)(stderr)) {
            var nonexistentcommand = "'" + command + "' is not recognized as an internal or external command,operable program or batch file.";
            if (stderr.replace(/\r?\n|\r/g, '') === nonexistentcommand) {
              resolve({
                error: {
                  code: 'ENOENT',
                  errno: 'ENOENT',
                  message: 'spawn ' + command + ' ENOENT',
                  path: command
                },
                exitcode: 127,
                stdout: stdout,
                stderr: stderr
              });
              return;
            }
          }

          resolve({
            error: null,
            exitcode: code,
            stdout: stdout,
            stderr: stderr
          });
        };
        if ((0, _check.isFalsy)(args)) {
          args = [];
        }

        var bufferedprocess = new _atom.BufferedProcess({ command: command, args: args, options: options, stdout: stdoutFn, stderr: stderrFn, exit: exitFn });
        bufferedprocess.onWillThrowError(function (err) {
          var e = err;
          if ((0, _check.isTruthy)(err)) {
            if (err.handle) {
              err.handle();
            }
            if (err.error) {
              e = err.error;
            }
          }
          resolve({
            error: e,
            exitcode: 127,
            stdout: stdout,
            stderr: stderr
          });
        });

        if ((0, _check.isTruthy)(options.input) && options.input.length > 0) {
          bufferedprocess.process.stdin.end(options.input);
        }
      });
    }
  }]);

  return Executor;
})();

exports.Executor = Executor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvLWNvbmZpZy9saWIvZXhlY3V0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFOEIsTUFBTTs7NkJBQ1osZUFBZTs7c0JBQ3hCLFNBQVM7Ozs7cUJBQ1EsU0FBUzs7QUFMekMsV0FBVyxDQUFBOztJQU9MLFFBQVE7QUFDQSxXQURSLFFBQVEsQ0FDQyxPQUFPLEVBQUU7MEJBRGxCLFFBQVE7O0FBRVYsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsUUFBSSxvQkFBUSxPQUFPLENBQUMsSUFBSSxvQkFBUSxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDdEQsYUFBTTtLQUNQOztBQUVELFFBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQTtHQUMzQzs7ZUFSRyxRQUFROztXQVVKLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7S0FDMUI7OztXQUVXLHVCQUFHO0FBQ2IsVUFBSSxvQkFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDL0IsZUFBTyxPQUFPLENBQUMsR0FBRyxDQUFBO09BQ25COztBQUVELGFBQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQzVCOzs7V0FFUSxrQkFBQyxPQUFPLEVBQTJCO1VBQXpCLElBQUkseURBQUcsRUFBRTtVQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDeEMsYUFBTyxHQUFHLG9CQUFRLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUE7QUFDekMsYUFBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7QUFDekIsVUFBSSxvQkFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7T0FDakM7QUFDRCxVQUFJLHFCQUFTLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxP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TUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO0FBQzdJLHVCQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDeEMsY0FBSSxDQUFDLEdBQUcsR0FBRyxDQUFBO0FBQ1gsY0FBSSxxQkFBUyxHQUFHLENBQUMsRUFBRTtBQUNqQixnQkFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ2QsaUJBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQTthQUNiO0FBQ0QsZ0JBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNiLGVBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO2FBQ2Q7V0FDRjtBQUNELGlCQUFPLENBQUM7QUFDTixpQkFBSyxFQUFFLENBQUM7QUFDUixvQkFBUSxFQUFFLEdBQUc7QUFDYixrQkFBTSxFQUFFLE1BQU07QUFDZCxrQkFBTSxFQUFFLE1BQU07V0FDZixDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7O0FBRUYsWUFBSSxxQkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZELHlCQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ2pEO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQW5KRyxRQUFROzs7UUFzSk4sUUFBUSxHQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL3NzdW4vLmF0b20vcGFja2FnZXMvZ28tY29uZmlnL2xpYi9leGVjdXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7QnVmZmVyZWRQcm9jZXNzfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtzcGF3blN5bmN9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCB7aXNUcnV0aHksIGlzRmFsc3l9IGZyb20gJy4vY2hlY2snXG5cbmNsYXNzIEV4ZWN1dG9yIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICB0aGlzLmVudmlyb25tZW50Rm4gPSBudWxsXG4gICAgaWYgKGlzRmFsc3kob3B0aW9ucykgfHwgaXNGYWxzeShvcHRpb25zLmVudmlyb25tZW50Rm4pKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmVudmlyb25tZW50Rm4gPSBvcHRpb25zLmVudmlyb25tZW50Rm5cbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuZW52aXJvbm1lbnRGbiA9IG51bGxcbiAgfVxuXG4gIGVudmlyb25tZW50ICgpIHtcbiAgICBpZiAoaXNGYWxzeSh0aGlzLmVudmlyb25tZW50Rm4pKSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5lbnZcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudEZuKClcbiAgfVxuXG4gIGV4ZWNTeW5jIChjb21tYW5kLCBhcmdzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBpc0ZhbHN5KG9wdGlvbnMpID8ge30gOiBvcHRpb25zXG4gICAgb3B0aW9ucy5lbmNvZGluZyA9ICd1dGY4J1xuICAgIGlmIChpc0ZhbHN5KG9wdGlvbnMuZW52KSkge1xuICAgICAgb3B0aW9ucy5lbnYgPSB0aGlzLmVudmlyb25tZW50KClcbiAgICB9XG4gICAgaWYgKGlzVHJ1dGh5KG9wdGlvbnMuY3dkKSAmJiBvcHRpb25zLmN3ZC5sZW5ndGggPiAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICBvcHRpb25zLmN3ZCA9IGZzLnJlYWxwYXRoU3luYyhvcHRpb25zLmN3ZClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUuaGFuZGxlKSB7XG4gICAgICAgICAgZS5oYW5kbGUoKVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0ZhbHN5KGFyZ3MpKSB7XG4gICAgICBhcmdzID0gW11cbiAgICB9XG5cbiAgICBsZXQgZG9uZSA9IHNwYXduU3luYyhjb21tYW5kLCBhcmdzLCBvcHRpb25zKVxuICAgIGxldCBjb2RlID0gZG9uZS5zdGF0dXNcblxuICAgIGxldCBzdGRvdXQgPSAnJ1xuICAgIGlmIChkb25lLnN0ZG91dCAmJiBkb25lLnN0ZG91dC5sZW5ndGggPiAwKSB7XG4gICAgICBzdGRvdXQgPSBkb25lLnN0ZG91dFxuICAgIH1cbiAgICBsZXQgc3RkZXJyID0gJydcbiAgICBpZiAoZG9uZS5zdGRlcnIgJiYgZG9uZS5zdGRlcnIubGVuZ3RoID4gMCkge1xuICAgICAgc3RkZXJyID0gZG9uZS5zdGRlcnJcbiAgICB9XG4gICAgbGV0IGVycm9yID0gZG9uZS5lcnJvclxuICAgIGlmIChlcnJvciAmJiBlcnJvci5jb2RlKSB7XG4gICAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICAgICAgY2FzZSAnRU5PRU5UJzpcbiAgICAgICAgICBjb2RlID0gMTI3XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnRU5PVENPTk4nOiAvLyBodHRwczovL2dpdGh1Yi5jb20vaW9qcy9pby5qcy9wdWxsLzEyMTRcbiAgICAgICAgICBlcnJvciA9IG51bGxcbiAgICAgICAgICBjb2RlID0gMFxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtleGl0Y29kZTogY29kZSwgc3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyLCBlcnJvcjogZXJyb3J9XG4gIH1cblxuICBleGVjIChjb21tYW5kLCBhcmdzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBvcHRpb25zID0gaXNGYWxzeShvcHRpb25zKSA/IHt9IDogb3B0aW9uc1xuICAgICAgb3B0aW9ucy5lbmNvZGluZyA9ICd1dGY4J1xuICAgICAgaWYgKGlzRmFsc3kob3B0aW9ucy5lbnYpKSB7XG4gICAgICAgIG9wdGlvbnMuZW52ID0gdGhpcy5lbnZpcm9ubWVudCgpXG4gICAgICB9XG4gICAgICBpZiAoaXNUcnV0aHkob3B0aW9ucy5jd2QpICYmIG9wdGlvbnMuY3dkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBvcHRpb25zLmN3ZCA9IGZzLnJlYWxwYXRoU3luYyhvcHRpb25zLmN3ZClcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlLmhhbmRsZSkge1xuICAgICAgICAgICAgZS5oYW5kbGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNGYWxzeShhcmdzKSkge1xuICAgICAgICBhcmdzID0gW11cbiAgICAgIH1cblxuICAgICAgbGV0IHN0ZG91dCA9ICcnXG4gICAgICBsZXQgc3RkZXJyID0gJydcbiAgICAgIGxldCBzdGRvdXRGbiA9IChkYXRhKSA9PiB7IHN0ZG91dCArPSBkYXRhIH1cbiAgICAgIGxldCBzdGRlcnJGbiA9IChkYXRhKSA9PiB7IHN0ZGVyciArPSBkYXRhIH1cbiAgICAgIGxldCBleGl0Rm4gPSAoY29kZSkgPT4ge1xuICAgICAgICBpZiAoaXNUcnV0aHkoc3RkZXJyKSkge1xuICAgICAgICAgIGxldCBub25leGlzdGVudGNvbW1hbmQgPSBcIidcIiArIGNvbW1hbmQgKyBcIicgaXMgbm90IHJlY29nbml6ZWQgYXMgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwgY29tbWFuZCxvcGVyYWJsZSBwcm9ncmFtIG9yIGJhdGNoIGZpbGUuXCJcbiAgICAgICAgICBpZiAoc3RkZXJyLnJlcGxhY2UoL1xccj9cXG58XFxyL2csICcnKSA9PT0gbm9uZXhpc3RlbnRjb21tYW5kKSB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnRU5PRU5UJyxcbiAgICAgICAgICAgICAgICBlcnJubzogJ0VOT0VOVCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ3NwYXduICcgKyBjb21tYW5kICsgJyBFTk9FTlQnLFxuICAgICAgICAgICAgICAgIHBhdGg6IGNvbW1hbmRcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXhpdGNvZGU6IDEyNyxcbiAgICAgICAgICAgICAgc3Rkb3V0OiBzdGRvdXQsXG4gICAgICAgICAgICAgIHN0ZGVycjogc3RkZXJyXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgZXhpdGNvZGU6IGNvZGUsXG4gICAgICAgICAgc3Rkb3V0OiBzdGRvdXQsXG4gICAgICAgICAgc3RkZXJyOiBzdGRlcnJcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmIChpc0ZhbHN5KGFyZ3MpKSB7XG4gICAgICAgIGFyZ3MgPSBbXVxuICAgICAgfVxuXG4gICAgICBsZXQgYnVmZmVyZWRwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7Y29tbWFuZDogY29tbWFuZCwgYXJnczogYXJncywgb3B0aW9uczogb3B0aW9ucywgc3Rkb3V0OiBzdGRvdXRGbiwgc3RkZXJyOiBzdGRlcnJGbiwgZXhpdDogZXhpdEZufSlcbiAgICAgIGJ1ZmZlcmVkcHJvY2Vzcy5vbldpbGxUaHJvd0Vycm9yKChlcnIpID0+IHtcbiAgICAgICAgbGV0IGUgPSBlcnJcbiAgICAgICAgaWYgKGlzVHJ1dGh5KGVycikpIHtcbiAgICAgICAgICBpZiAoZXJyLmhhbmRsZSkge1xuICAgICAgICAgICAgZXJyLmhhbmRsZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlcnIuZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnIuZXJyb3JcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgZXJyb3I6IGUsXG4gICAgICAgICAgZXhpdGNvZGU6IDEyNyxcbiAgICAgICAgICBzdGRvdXQ6IHN0ZG91dCxcbiAgICAgICAgICBzdGRlcnI6IHN0ZGVyclxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaWYgKGlzVHJ1dGh5KG9wdGlvbnMuaW5wdXQpICYmIG9wdGlvbnMuaW5wdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBidWZmZXJlZHByb2Nlc3MucHJvY2Vzcy5zdGRpbi5lbmQob3B0aW9ucy5pbnB1dClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7RXhlY3V0b3J9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/go-config/lib/executor.js

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

'use babel';

var Builder = (function () {
  function Builder(goconfigFunc) {
    _classCallCheck(this, Builder);

    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();

    this.name = 'go build';
    this.grammarScopes = ['source.go'];
    this.scope = 'project';
    this.lintOnFly = false;
    _temp2['default'].track();
  }

  _createClass(Builder, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.goconfig = null;
      this.name = null;
      this.grammarScopes = null;
      this.lintOnFly = null;
    }
  }, {
    key: 'ready',
    value: function ready() {
      if (!this.goconfig) {
        return false;
      }
      var config = this.goconfig();
      if (!config) {
        return false;
      }

      return true;
    }
  }, {
    key: 'lint',
    value: function lint(editor) {
      var _this = this;

      if (!this.ready() || !editor) {
        return [];
      }
      var p = editor.getPath();
      if (!p) {
        return [];
      }
      return Promise.resolve().then(function () {
        var cwd = _path2['default'].dirname(p);
        var hasTests = false;
        if (editor.getPath().endsWith('_test.go')) {
          hasTests = true;
        } else {
          var files = _fs2['default'].readdirSync(cwd);
          for (var file of files) {
            if (file.endsWith('_test.go')) {
              hasTests = true;
            }
          }
        }

        var config = _this.goconfig();
        var options = _this.getLocatorOptions(editor);
        return config.locator.findTool('go', options).then(function (cmd) {
          if (!cmd) {
            return [];
          }

          var options = _this.getExecutorOptions(editor);
          var buildArgs = ['install', '.'];
          var buildPromise = config.executor.exec(cmd, buildArgs, options).then(function (r) {
            if (r.stdout && r.stdout.trim() !== '') {
              console.log('builder-go: (stdout) ' + r.stdout);
            }
            var messages = [];
            if (r.stderr && r.stderr.trim() !== '') {
              messages = _this.mapMessages(r.stderr, options.cwd, 'build');
            }
            if (!messages || messages.length < 1) {
              return [];
            }
            return messages;
          })['catch'](function (e) {
            console.log(e);
            return [];
          });

          if (!hasTests) {
            return buildPromise;
          }

          var tempdir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
          var testArgs = ['test', '-c', '-o', tempdir, '.'];
          var testPromise = config.executor.exec(cmd, testArgs, options).then(function (r) {
            if (r.stdout && r.stdout.trim() !== '') {
              console.log('builder-go: (stdout) ' + r.stdout);
            }
            var messages = [];
            if (r.stderr && r.stderr.trim() !== '') {
              messages = _this.mapMessages(r.stderr, options.cwd, 'test');
            }
            if (!messages || messages.length < 1) {
              return [];
            }

            (0, _rimraf2['default'])(tempdir, function (e) {
              if (e) {
                if (e.handle) {
                  e.handle();
                }
                console.log(e);
              }
            });
            return messages;
          })['catch'](function (e) {
            console.log(e);
            return [];
          });

          return Promise.all([buildPromise, testPromise]).then(function (results) {
            var messages = [];
            for (var result of results) {
              if (result && result.length) {
                messages = messages.concat(result);
              }
            }
            return messages;
          });
        });
      })['catch'](function (error) {
        if (error.handle) {
          error.handle();
        }
        console.log(error);
        return [];
      });
    }
  }, {
    key: 'getLocatorOptions',
    value: function getLocatorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      var options = {};
      if (editor) {
        options.file = editor.getPath();
        options.directory = _path2['default'].dirname(editor.getPath());
      }
      if (!options.directory && atom.project.paths.length) {
        options.directory = atom.project.paths[0];
      }

      return options;
    }
  }, {
    key: 'getExecutorOptions',
    value: function getExecutorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      var o = this.getLocatorOptions(editor);
      var options = {};
      if (o.directory) {
        options.cwd = o.directory;
      }
      var config = this.goconfig();
      if (config) {
        options.env = config.environment(o);
      }
      if (!options.env) {
        options.env = process.env;
      }
      return options;
    }
  }, {
    key: 'mapMessages',
    value: function mapMessages(data, cwd, linterName) {
      var pattern = /^((#)\s(.*)?)|((.*?):(\d*?):((\d*?):)?\s((.*)?((\n\t.*)+)?))/img;
      var messages = [];
      var extract = function extract(matchLine) {
        if (!matchLine) {
          return;
        }
        if (matchLine[2] && matchLine[2] === '#') {
          // Found A Package Indicator, Skip For Now
        } else {
            var file = undefined;
            if (matchLine[5] && matchLine[5] !== '') {
              if (_path2['default'].isAbsolute(matchLine[5])) {
                file = matchLine[5];
              } else {
                file = _path2['default'].join(cwd, matchLine[5]);
              }
            }
            var row = matchLine[6];
            var column = matchLine[8];
            var text = matchLine[9];
            var range = undefined;
            if (column && column >= 0) {
              range = [[row - 1, column - 1], [row - 1, 1000]];
            } else {
              range = [[row - 1, 0], [row - 1, 1000]];
            }
            messages.push({ name: linterName, type: 'Error', row: row, column: column, text: text + ' (' + linterName + ')', filePath: file, range: range });
          }
      };
      var match = undefined;
      while ((match = pattern.exec(data)) !== null) {
        extract(match);
      }
      return messages;
    }
  }]);

  return Builder;
})();

exports.Builder = Builder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2J1aWxkZXItZ28vbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7a0JBQ3pCLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDSixRQUFROzs7O29CQUNWLE1BQU07Ozs7QUFOdkIsV0FBVyxDQUFBOztJQVFMLE9BQU87QUFDQyxXQURSLE9BQU8sQ0FDRSxZQUFZLEVBQUU7MEJBRHZCLE9BQU87O0FBRVQsUUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUE7QUFDdEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2xDLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO0FBQ3RCLHNCQUFLLEtBQUssRUFBRSxDQUFBO0dBQ2I7O2VBVkcsT0FBTzs7V0FZSCxtQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQzdCO0FBQ0QsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7QUFDekIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7S0FDdEI7OztXQUVLLGlCQUFHO0FBQ1AsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbEIsZUFBTyxLQUFLLENBQUE7T0FDYjtBQUNELFVBQUksTUFBTSxHQUFHLElBQUksQ0FB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QUMsQ0FBQyxDQUFBO1dBQy9JO09BQ0YsQ0FBQTtBQUNELFVBQUksS0FBSyxZQUFBLENBQUE7QUFDVCxhQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsS0FBTSxJQUFJLEVBQUU7QUFDNUMsZUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ2Y7QUFDRCxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1NBdE1HLE9BQU87OztRQXdNTCxPQUFPLEdBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9idWlsZGVyLWdvL2xpYi9idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJ1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCdcblxuY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yIChnb2NvbmZpZ0Z1bmMpIHtcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5uYW1lID0gJ2dvIGJ1aWxkJ1xuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmdvJ11cbiAgICB0aGlzLnNjb3BlID0gJ3Byb2plY3QnXG4gICAgdGhpcy5saW50T25GbHkgPSBmYWxzZVxuICAgIHRlbXAudHJhY2soKVxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLm5hbWUgPSBudWxsXG4gICAgdGhpcy5ncmFtbWFyU2NvcGVzID0gbnVsbFxuICAgIHRoaXMubGludE9uRmx5ID0gbnVsbFxuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIGlmICghdGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICBpZiAoIWNvbmZpZykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGxpbnQgKGVkaXRvcikge1xuICAgIGlmICghdGhpcy5yZWFkeSgpIHx8ICFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBsZXQgcCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpZiAoIXApIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBsZXQgY3dkID0gcGF0aC5kaXJuYW1lKHApXG4gICAgICBsZXQgaGFzVGVzdHMgPSBmYWxzZVxuICAgICAgaWYgKGVkaXRvci5nZXRQYXRoKCkuZW5kc1dpdGgoJ190ZXN0LmdvJykpIHtcbiAgICAgICAgaGFzVGVzdHMgPSB0cnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhjd2QpXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICBpZiAoZmlsZS5lbmRzV2l0aCgnX3Rlc3QuZ28nKSkge1xuICAgICAgICAgICAgaGFzVGVzdHMgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvJywgb3B0aW9ucykudGhlbigoY21kKSA9PiB7XG4gICAgICAgIGlmICghY21kKSB7XG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RXhlY3V0b3JPcHRpb25zKGVkaXRvcilcbiAgICAgICAgbGV0IGJ1aWxkQXJncyA9IFsnaW5zdGFsbCcsICcuJ11cbiAgICAgICAgbGV0IGJ1aWxkUHJvbWlzZSA9IGNvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYnVpbGRBcmdzLCBvcHRpb25zKS50aGVuKChyKSA9PiB7XG4gICAgICAgICAgaWYgKHIuc3Rkb3V0ICYmIHIuc3Rkb3V0LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdidWlsZGVyLWdvOiAoc3Rkb3V0KSAnICsgci5zdGRvdXQpXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBtZXNzYWdlcyA9IFtdXG4gICAgICAgICAgaWYgKHIuc3RkZXJyICYmIHIuc3RkZXJyLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzID0gdGhpcy5tYXBNZXNzYWdlcyhyLnN0ZGVyciwgb3B0aW9ucy5jd2QsICdidWlsZCcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbWVzc2FnZXMgfHwgbWVzc2FnZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtZXNzYWdlc1xuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCFoYXNUZXN0cykge1xuICAgICAgICAgIHJldHVybiBidWlsZFByb21pc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0ZW1wZGlyID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKCkpXG4gICAgICAgIGxldCB0ZXN0QXJncyA9IFsndGVzdCcsICctYycsICctbycsIHRlbXBkaXIsICcuJ11cbiAgICAgICAgbGV0IHRlc3RQcm9taXNlID0gY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCB0ZXN0QXJncywgb3B0aW9ucykudGhlbigocikgPT4ge1xuICAgICAgICAgIGlmIChyLnN0ZG91dCAmJiByLnN0ZG91dC50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYnVpbGRlci1nbzogKHN0ZG91dCkgJyArIHIuc3Rkb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgICAgICAgIGlmIChyLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICBtZXNzYWdlcyA9IHRoaXMubWFwTWVzc2FnZXMoci5zdGRlcnIsIG9wdGlvbnMuY3dkLCAndGVzdCcpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbWVzc2FnZXMgfHwgbWVzc2FnZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmltcmFmKHRlbXBkaXIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICBpZiAoZS5oYW5kbGUpIHtcbiAgICAgICAgICAgICAgICBlLmhhbmRsZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBtZXNzYWdlc1xuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtidWlsZFByb21pc2UsIHRlc3RQcm9taXNlXSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgIGxldCBtZXNzYWdlcyA9IFtdXG4gICAgICAgICAgZm9yIChsZXQgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmNvbmNhdChyZXN1bHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtZXNzYWdlc1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGlmIChlcnJvci5oYW5kbGUpIHtcbiAgICAgICAgZXJyb3IuaGFuZGxlKClcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgcmV0dXJuIFtdXG4gICAgfSlcbiAgfVxuXG4gIGdldExvY2F0b3JPcHRpb25zIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgb3B0aW9ucy5maWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmRpcmVjdG9yeSAmJiBhdG9tLnByb2plY3QucGF0aHMubGVuZ3RoKSB7XG4gICAgICBvcHRpb25zLmRpcmVjdG9yeSA9IGF0b20ucHJvamVjdC5wYXRoc1swXVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBnZXRFeGVjdXRvck9wdGlvbnMgKGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkge1xuICAgIGxldCBvID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChvLmRpcmVjdG9yeSkge1xuICAgICAgb3B0aW9ucy5jd2QgPSBvLmRpcmVjdG9yeVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgb3B0aW9ucy5lbnYgPSBjb25maWcuZW52aXJvbm1lbnQobylcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmVudikge1xuICAgICAgb3B0aW9ucy5lbnYgPSBwcm9jZXNzLmVudlxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgbWFwTWVzc2FnZXMgKGRhdGEsIGN3ZCwgbGludGVyTmFtZSkge1xuICAgIGxldCBwYXR0ZXJuID0gL14oKCMpXFxzKC4qKT8pfCgoLio/KTooXFxkKj8pOigoXFxkKj8pOik/XFxzKCguKik/KChcXG5cXHQuKikrKT8pKS9pbWdcbiAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgIGxldCBleHRyYWN0ID0gKG1hdGNoTGluZSkgPT4ge1xuICAgICAgaWYgKCFtYXRjaExpbmUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hMaW5lWzJdICYmIG1hdGNoTGluZVsyXSA9PT0gJyMnKSB7XG4gICAgICAgIC8vIEZvdW5kIEEgUGFja2FnZSBJbmRpY2F0b3IsIFNraXAgRm9yIE5vd1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGZpbGVcbiAgICAgICAgaWYgKG1hdGNoTGluZVs1XSAmJiBtYXRjaExpbmVbNV0gIT09ICcnKSB7XG4gICAgICAgICAgaWYgKHBhdGguaXNBYnNvbHV0ZShtYXRjaExpbmVbNV0pKSB7XG4gICAgICAgICAgICBmaWxlID0gbWF0Y2hMaW5lWzVdXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbGUgPSBwYXRoLmpvaW4oY3dkLCBtYXRjaExpbmVbNV0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCByb3cgPSBtYXRjaExpbmVbNl1cbiAgICAgICAgbGV0IGNvbHVtbiA9IG1hdGNoTGluZVs4XVxuICAgICAgICBsZXQgdGV4dCA9IG1hdGNoTGluZVs5XVxuICAgICAgICBsZXQgcmFuZ2VcbiAgICAgICAgaWYgKGNvbHVtbiAmJiBjb2x1bW4gPj0gMCkge1xuICAgICAgICAgIHJhbmdlID0gW1tyb3cgLSAxLCBjb2x1bW4gLSAxXSwgW3JvdyAtIDEsIDEwMDBdXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gW1tyb3cgLSAxLCAwXSwgW3JvdyAtIDEsIDEwMDBdXVxuICAgICAgICB9XG4gICAgICAgIG1lc3NhZ2VzLnB1c2goe25hbWU6IGxpbnRlck5hbWUsIHR5cGU6ICdFcnJvcicsIHJvdzogcm93LCBjb2x1bW46IGNvbHVtbiwgdGV4dDogdGV4dCArICcgKCcgKyBsaW50ZXJOYW1lICsgJyknLCBmaWxlUGF0aDogZmlsZSwgcmFuZ2U6IHJhbmdlfSlcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IG1hdGNoXG4gICAgd2hpbGUgKChtYXRjaCA9IHBhdHRlcm4uZXhlYyhkYXRhKSkgIT09IG51bGwpIHtcbiAgICAgIGV4dHJhY3QobWF0Y2gpXG4gICAgfVxuICAgIHJldHVybiBtZXNzYWdlc1xuICB9XG59XG5leHBvcnQge0J1aWxkZXJ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/builder-go/lib/builder.js

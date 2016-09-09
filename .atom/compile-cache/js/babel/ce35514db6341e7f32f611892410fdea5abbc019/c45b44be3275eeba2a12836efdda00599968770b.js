Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

function capitalizeFirstLetter(str) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var GometalinterLinter = (function () {
  function GometalinterLinter(goconfigFunc, gogetFunc) {
    var _this = this;

    _classCallCheck(this, GometalinterLinter);

    this.goget = gogetFunc;
    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();

    this.name = 'gometalinter';
    this.grammarScopes = ['source.go'];
    this.scope = 'project';
    this.lintOnFly = false;
    this.toolCheckComplete = false;
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:updatelinters', function () {
      _this.updateTools();
    }));
  }

  _createClass(GometalinterLinter, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      this.goget = null;
      this.goconfig = null;
      this.name = null;
      this.grammarScopes = null;
      this.lintOnFly = null;
      this.toolCheckComplete = null;
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
      var _this2 = this;

      if (!this.ready() || !editor) {
        return [];
      }
      var buffer = editor.getBuffer();
      if (!buffer) {
        return [];
      }
      var args = atom.config.get('gometalinter-linter.args');
      if (!args || args.constructor !== Array || args.indexOf('--json') === -1) {
        args = ['--vendor', '--fast', '--json', './...'];
      }
      if (args.indexOf('--json') === -1) {
        args.unshift('--json');
      }

      var config = this.goconfig();
      var options = this.getLocatorOptions(editor);
      return config.locator.findTool('gometalinter', options).then(function (cmd) {
        if (!cmd) {
          _this2.checkForTool(editor);
          return [];
        }

        var options = _this2.getExecutorOptions(editor);
        return config.executor.exec(cmd, args, options).then(function (r) {
          if (r.stderr && r.stderr.trim() !== '') {
            console.log('gometalinter-linter: (stderr) ' + r.stderr);
          }
          var messages = [];
          if (r.stdout && r.stdout.trim() !== '') {
            messages = _this2.mapMessages(r.stdout, editor, options.cwd);
          }
          if (!messages || messages.length < 1) {
            return [];
          }
          return messages;
        })['catch'](function (e) {
          console.log(e);
          return [];
        });
      });
    }
  }, {
    key: 'checkForTool',
    value: function checkForTool() {
      var _this3 = this;

      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      var config = this.goconfig();
      var options = this.getLocatorOptions(editor);
      return config.locator.findTool('gometalinter', options).then(function (cmd) {
        if (!cmd && !_this3.toolCheckComplete) {
          _this3.toolCheckComplete = true;
          var goget = _this3.goget();
          if (!goget) {
            return;
          }
          goget.get({
            name: 'gometalinter-linter',
            packageName: 'gometalinter',
            packagePath: 'github.com/alecthomas/gometalinter',
            type: 'missing' // TODO check whether missing or outdated
          }).then(function (r) {
            if (!r.success) {
              return false;
            }
            return _this3.updateTools(editor);
          })['catch'](function (e) {
            console.log(e);
          });
        }
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
    key: 'updateTools',
    value: function updateTools() {
      var _this4 = this;

      var editor = arguments.length <= 0 || arguments[0] === undefined ? atom.workspace.getActiveTextEditor() : arguments[0];

      if (!this.ready()) {
        return Promise.resolve(false);
      }
      var config = this.goconfig();
      var options = this.getLocatorOptions(editor);
      return config.locator.findTool('gometalinter', options).then(function (cmd) {
        if (!cmd) {
          return false;
        }

        var args = ['--install'];
        var notification = atom.notifications.addInfo('gometalinter', {
          dismissable: false,
          icon: 'cloud-download',
          description: 'Running `gometalinter --install` to install tools.'
        });
        var options = _this4.getExecutorOptions(editor);
        return config.executor.exec(cmd, args, options).then(function (r) {
          notification.dismiss();
          var detail = r.stdout + _os2['default'].EOL + r.stderr;

          if (r.exitcode !== 0) {
            atom.notifications.addWarning('gometalinter', {
              dismissable: true,
              icon: 'cloud-download',
              detail: detail.trim()
            });
            return r;
          }
          if (r.stderr && r.stderr.trim() !== '') {
            console.log('gometalinter-linter: (stderr) ' + r.stderr);
          }
          atom.notifications.addSuccess('gometalinter', {
            dismissable: true,
            icon: 'cloud-download',
            detail: detail.trim(),
            description: 'The tools were installed.'
          });
          return r;
        });
      });
    }
  }, {
    key: 'mapMessages',
    value: function mapMessages(data, editor, cwd) {
      var messages = [];
      try {
        messages = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }

      if (!messages || messages.length < 1) {
        return [];
      }
      messages.sort(function (a, b) {
        if (!a && !b) {
          return 0;
        }
        if (!a && b) {
          return -1;
        }
        if (a && !b) {
          return 1;
        }

        if (!a.path && b.path) {
          return -1;
        }
        if (a.path && !b.path) {
          return 1;
        }
        if (a.path === b.path) {
          if (a.line - b.line === 0) {
            return a.row - b.row;
          }
          return a.line - b.line;
        } else {
          return a.path.localeCompare(b.path);
        }
      });

      var results = [];

      for (var message of messages) {
        var range = undefined;
        if (message.col && message.col >= 0) {
          range = [[message.line - 1, message.col - 1], [message.line - 1, 1000]];
        } else {
          range = [[message.line - 1, 0], [message.line - 1, 1000]];
        }
        results.push({ name: message.linter, type: capitalizeFirstLetter(message.severity), row: message.line, column: message.col, text: message.message + ' (' + message.linter + ')', filePath: _path2['default'].join(cwd, message.path), range: range });
      }

      return results;
    }
  }]);

  return GometalinterLinter;
})();

exports.GometalinterLinter = GometalinterLinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL2xpbnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrQyxNQUFNOztrQkFDekIsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQTs7QUFNWCxTQUFTLHFCQUFxQixDQUFFLEdBQUcsRUFBRTtBQUNuQyxNQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsV0FBTyxHQUFHLENBQUE7R0FDWDtBQUNELFNBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2xEOztJQUVLLGtCQUFrQjtBQUNWLFdBRFIsa0JBQWtCLENBQ1QsWUFBWSxFQUFFLFNBQVMsRUFBRTs7OzBCQURsQyxrQkFBa0I7O0FBRXBCLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFBO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNsQyxRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtBQUN0QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFLFlBQU07QUFDdkYsWUFBSyxXQUFXLEVBQUUsQ0FBQTtLQUNuQixDQUFDLENBQUMsQ0FBQTtHQUNKOztlQWRHLGtCQUFrQjs7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LEVBQUUsQ0FBQTs7QUFFaEIsV0FBSyxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7QUFDNUIsWUFBSSxLQUFLLFlBQUEsQ0FBQTtBQUNULFlBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTtBQUNuQyxlQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ3hFLE1BQU07QUFDTCxlQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUMxRDtBQUNELGVBQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxRQUFRLEVBQUUsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7T0FDdk87O0FBRUQsYUFBTyxPQUFPLENBQUE7S0FDZjs7O1NBNU9HLGtCQUFrQjs7O1FBOE9oQixrQkFBa0IsR0FBbEIsa0JBQWtCIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL2xpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlciAoc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICB9XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcbn1cblxuY2xhc3MgR29tZXRhbGludGVyTGludGVyIHtcbiAgY29uc3RydWN0b3IgKGdvY29uZmlnRnVuYywgZ29nZXRGdW5jKSB7XG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0RnVuY1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLm5hbWUgPSAnZ29tZXRhbGludGVyJ1xuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmdvJ11cbiAgICB0aGlzLnNjb3BlID0gJ3Byb2plY3QnXG4gICAgdGhpcy5saW50T25GbHkgPSBmYWxzZVxuICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2dvbGFuZzp1cGRhdGVsaW50ZXJzJywgKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVUb29scygpXG4gICAgfSkpXG4gIH1cblxuICBkaXNwb3NlICgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLmdvZ2V0ID0gbnVsbFxuICAgIHRoaXMuZ29jb25maWcgPSBudWxsXG4gICAgdGhpcy5uYW1lID0gbnVsbFxuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IG51bGxcbiAgICB0aGlzLmxpbnRPbkZseSA9IG51bGxcbiAgICB0aGlzLnRvb2xDaGVja0NvbXBsZXRlID0gbnVsbFxuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIGlmICghdGhpcy5nb2NvbmZpZykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICBpZiAoIWNvbmZpZykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGxpbnQgKGVkaXRvcikge1xuICAgIGlmICghdGhpcy5yZWFkeSgpIHx8ICFlZGl0b3IpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBsZXQgYXJncyA9IGF0b20uY29uZmlnLmdldCgnZ29tZXRhbGludGVyLWxpbnRlci5hcmdzJylcbiAgICBpZiAoIWFyZ3MgfHwgYXJncy5jb25zdHJ1Y3RvciAhPT0gQXJyYXkgfHwgYXJncy5pbmRleE9mKCctLWpzb24nKSA9PT0gLTEpIHtcbiAgICAgIGFyZ3MgPSBbJy0tdmVuZG9yJywgJy0tZmFzdCcsICctLWpzb24nLCAnLi8uLi4nXVxuICAgIH1cbiAgICBpZiAoYXJncy5pbmRleE9mKCctLWpzb24nKSA9PT0gLTEpIHtcbiAgICAgIGFyZ3MudW5zaGlmdCgnLS1qc29uJylcbiAgICB9XG5cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvbWV0YWxpbnRlcicsIG9wdGlvbnMpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgdGhpcy5jaGVja0ZvclRvb2woZWRpdG9yKVxuICAgICAgICByZXR1cm4gW11cbiAgICAgIH1cblxuICAgICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldEV4ZWN1dG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgICByZXR1cm4gY29uZmlnLmV4ZWN1dG9yLmV4ZWMoY21kLCBhcmdzLCBvcHRpb25zKS50aGVuKChyKSA9PiB7XG4gICAgICAgIGlmIChyLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2dvbWV0YWxpbnRlci1saW50ZXI6IChzdGRlcnIpICcgKyByLnN0ZGVycilcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgICAgICBpZiAoci5zdGRvdXQgJiYgci5zdGRvdXQudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgIG1lc3NhZ2VzID0gdGhpcy5tYXBNZXNzYWdlcyhyLnN0ZG91dCwgZWRpdG9yLCBvcHRpb25zLmN3ZClcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1lc3NhZ2VzIHx8IG1lc3NhZ2VzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVzc2FnZXNcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY2hlY2tGb3JUb29sIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvbWV0YWxpbnRlcicsIG9wdGlvbnMpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKCFjbWQgJiYgIXRoaXMudG9vbENoZWNrQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IHRydWVcbiAgICAgICAgbGV0IGdvZ2V0ID0gdGhpcy5nb2dldCgpXG4gICAgICAgIGlmICghZ29nZXQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBnb2dldC5nZXQoe1xuICAgICAgICAgIG5hbWU6ICdnb21ldGFsaW50ZXItbGludGVyJyxcbiAgICAgICAgICBwYWNrYWdlTmFtZTogJ2dvbWV0YWxpbnRlcicsXG4gICAgICAgICAgcGFja2FnZVBhdGg6ICdnaXRodWIuY29tL2FsZWN0aG9tYXMvZ29tZXRhbGludGVyJyxcbiAgICAgICAgICB0eXBlOiAnbWlzc2luZycgLy8gVE9ETyBjaGVjayB3aGV0aGVyIG1pc3Npbmcgb3Igb3V0ZGF0ZWRcbiAgICAgICAgfSkudGhlbigocikgPT4ge1xuICAgICAgICAgIGlmICghci5zdWNjZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVG9vbHMoZWRpdG9yKVxuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldExvY2F0b3JPcHRpb25zIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgb3B0aW9ucy5maWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmRpcmVjdG9yeSAmJiBhdG9tLnByb2plY3QucGF0aHMubGVuZ3RoKSB7XG4gICAgICBvcHRpb25zLmRpcmVjdG9yeSA9IGF0b20ucHJvamVjdC5wYXRoc1swXVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBnZXRFeGVjdXRvck9wdGlvbnMgKGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkge1xuICAgIGxldCBvID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChvLmRpcmVjdG9yeSkge1xuICAgICAgb3B0aW9ucy5jd2QgPSBvLmRpcmVjdG9yeVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgb3B0aW9ucy5lbnYgPSBjb25maWcuZW52aXJvbm1lbnQobylcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmVudikge1xuICAgICAgb3B0aW9ucy5lbnYgPSBwcm9jZXNzLmVudlxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgdXBkYXRlVG9vbHMgKGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkge1xuICAgIGlmICghdGhpcy5yZWFkeSgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2woJ2dvbWV0YWxpbnRlcicsIG9wdGlvbnMpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGxldCBhcmdzID0gWyctLWluc3RhbGwnXVxuICAgICAgbGV0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdnb21ldGFsaW50ZXInLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgaWNvbjogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdSdW5uaW5nIGBnb21ldGFsaW50ZXIgLS1pbnN0YWxsYCB0byBpbnN0YWxsIHRvb2xzLidcbiAgICAgIH0pXG4gICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RXhlY3V0b3JPcHRpb25zKGVkaXRvcilcbiAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIG9wdGlvbnMpLnRoZW4oKHIpID0+IHtcbiAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICBsZXQgZGV0YWlsID0gci5zdGRvdXQgKyBvcy5FT0wgKyByLnN0ZGVyclxuXG4gICAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvbWV0YWxpbnRlcicsIHtcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgfVxuICAgICAgICBpZiAoci5zdGRlcnIgJiYgci5zdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnb21ldGFsaW50ZXItbGludGVyOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgIH1cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ2dvbWV0YWxpbnRlcicsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBpY29uOiAnY2xvdWQtZG93bmxvYWQnLFxuICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSB0b29scyB3ZXJlIGluc3RhbGxlZC4nXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBtYXBNZXNzYWdlcyAoZGF0YSwgZWRpdG9yLCBjd2QpIHtcbiAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgIHRyeSB7XG4gICAgICBtZXNzYWdlcyA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIGlmICghbWVzc2FnZXMgfHwgbWVzc2FnZXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIG1lc3NhZ2VzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmICghYSAmJiAhYikge1xuICAgICAgICByZXR1cm4gMFxuICAgICAgfVxuICAgICAgaWYgKCFhICYmIGIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpZiAoYSAmJiAhYikge1xuICAgICAgICByZXR1cm4gMVxuICAgICAgfVxuXG4gICAgICBpZiAoIWEucGF0aCAmJiBiLnBhdGgpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpZiAoYS5wYXRoICYmICFiLnBhdGgpIHtcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIH1cbiAgICAgIGlmIChhLnBhdGggPT09IGIucGF0aCkge1xuICAgICAgICBpZiAoYS5saW5lIC0gYi5saW5lID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGEucm93IC0gYi5yb3dcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYS5saW5lIC0gYi5saW5lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYS5wYXRoLmxvY2FsZUNvbXBhcmUoYi5wYXRoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBsZXQgcmFuZ2VcbiAgICAgIGlmIChtZXNzYWdlLmNvbCAmJiBtZXNzYWdlLmNvbCA+PSAwKSB7XG4gICAgICAgIHJhbmdlID0gW1ttZXNzYWdlLmxpbmUgLSAxLCBtZXNzYWdlLmNvbCAtIDFdLCBbbWVzc2FnZS5saW5lIC0gMSwgMTAwMF1dXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByYW5nZSA9IFtbbWVzc2FnZS5saW5lIC0gMSwgMF0sIFttZXNzYWdlLmxpbmUgLSAxLCAxMDAwXV1cbiAgICAgIH1cbiAgICAgIHJlc3VsdHMucHVzaCh7bmFtZTogbWVzc2FnZS5saW50ZXIsIHR5cGU6IGNhcGl0YWxpemVGaXJzdExldHRlcihtZXNzYWdlLnNldmVyaXR5KSwgcm93OiBtZXNzYWdlLmxpbmUsIGNvbHVtbjogbWVzc2FnZS5jb2wsIHRleHQ6IG1lc3NhZ2UubWVzc2FnZSArICcgKCcgKyBtZXNzYWdlLmxpbnRlciArICcpJywgZmlsZVBhdGg6IHBhdGguam9pbihjd2QsIG1lc3NhZ2UucGF0aCksIHJhbmdlOiByYW5nZX0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxufVxuZXhwb3J0IHtHb21ldGFsaW50ZXJMaW50ZXJ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/gometalinter-linter/lib/linter.js

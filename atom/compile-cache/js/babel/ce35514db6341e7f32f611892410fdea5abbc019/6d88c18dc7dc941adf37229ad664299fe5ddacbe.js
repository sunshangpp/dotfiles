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

        var args = ['--install', '--update'];
        var notification = atom.notifications.addInfo('gometalinter', {
          dismissable: false,
          icon: 'cloud-download',
          description: 'Running `gometalinter --install --update` to install and update tools.'
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
            description: 'The tools were installed and updated.'
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
        results.push({ name: message.linter, type: message.severity, row: message.line, column: message.col, text: message.message + ' (' + message.linter + ')', filePath: _path2['default'].join(cwd, message.path), range: range });
      }

      return results;
    }
  }]);

  return GometalinterLinter;
})();

exports.GometalinterLinter = GometalinterLinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL2xpbnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrQyxNQUFNOztrQkFDekIsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQTs7SUFNTCxrQkFBa0I7QUFDVixXQURSLGtCQUFrQixDQUNULFlBQVksRUFBRSxTQUFTLEVBQUU7OzswQkFEbEMsa0JBQWtCOztBQUVwQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbEMsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7QUFDdEIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsRUFBRSxZQUFNO0FBQ3ZGLFlBQUssV0FBVyxFQUFFLENBQUE7S0FDbkIsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFkRyxrQkFBa0I7O1dBZ0JkLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFH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R0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDeEUsTUFBTTtBQUNMLGVBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQzFEO0FBQ0QsZUFBTyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxRQUFRLEVBQUUsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7T0FDaE47O0FBRUQsYUFBTyxPQUFPLENBQUE7S0FDZjs7O1NBNU9HLGtCQUFrQjs7O1FBOE9oQixrQkFBa0IsR0FBbEIsa0JBQWtCIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvbWV0YWxpbnRlci1saW50ZXIvbGliL2xpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNsYXNzIEdvbWV0YWxpbnRlckxpbnRlciB7XG4gIGNvbnN0cnVjdG9yIChnb2NvbmZpZ0Z1bmMsIGdvZ2V0RnVuYykge1xuICAgIHRoaXMuZ29nZXQgPSBnb2dldEZ1bmNcbiAgICB0aGlzLmdvY29uZmlnID0gZ29jb25maWdGdW5jXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5uYW1lID0gJ2dvbWV0YWxpbnRlcidcbiAgICB0aGlzLmdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5nbyddXG4gICAgdGhpcy5zY29wZSA9ICdwcm9qZWN0J1xuICAgIHRoaXMubGludE9uRmx5ID0gZmFsc2VcbiAgICB0aGlzLnRvb2xDaGVja0NvbXBsZXRlID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdnb2xhbmc6dXBkYXRlbGludGVycycsICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlVG9vbHMoKVxuICAgIH0pKVxuICB9XG5cbiAgZGlzcG9zZSAoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgdGhpcy5nb2dldCA9IG51bGxcbiAgICB0aGlzLmdvY29uZmlnID0gbnVsbFxuICAgIHRoaXMubmFtZSA9IG51bGxcbiAgICB0aGlzLmdyYW1tYXJTY29wZXMgPSBudWxsXG4gICAgdGhpcy5saW50T25GbHkgPSBudWxsXG4gICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IG51bGxcbiAgfVxuXG4gIHJlYWR5ICgpIHtcbiAgICBpZiAoIXRoaXMuZ29jb25maWcpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBsaW50IChlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhZWRpdG9yKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgbGV0IGFyZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2dvbWV0YWxpbnRlci1saW50ZXIuYXJncycpXG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MuY29uc3RydWN0b3IgIT09IEFycmF5IHx8IGFyZ3MuaW5kZXhPZignLS1qc29uJykgPT09IC0xKSB7XG4gICAgICBhcmdzID0gWyctLXZlbmRvcicsICctLWZhc3QnLCAnLS1qc29uJywgJy4vLi4uJ11cbiAgICB9XG4gICAgaWYgKGFyZ3MuaW5kZXhPZignLS1qc29uJykgPT09IC0xKSB7XG4gICAgICBhcmdzLnVuc2hpZnQoJy0tanNvbicpXG4gICAgfVxuXG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnb21ldGFsaW50ZXInLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmICghY21kKSB7XG4gICAgICAgIHRoaXMuY2hlY2tGb3JUb29sKGVkaXRvcilcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG5cbiAgICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRFeGVjdXRvck9wdGlvbnMoZWRpdG9yKVxuICAgICAgcmV0dXJuIGNvbmZpZy5leGVjdXRvci5leGVjKGNtZCwgYXJncywgb3B0aW9ucykudGhlbigocikgPT4ge1xuICAgICAgICBpZiAoci5zdGRlcnIgJiYgci5zdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnb21ldGFsaW50ZXItbGludGVyOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1lc3NhZ2VzID0gW11cbiAgICAgICAgaWYgKHIuc3Rkb3V0ICYmIHIuc3Rkb3V0LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgICBtZXNzYWdlcyA9IHRoaXMubWFwTWVzc2FnZXMoci5zdGRvdXQsIGVkaXRvciwgb3B0aW9ucy5jd2QpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtZXNzYWdlcyB8fCBtZXNzYWdlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzXG4gICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICByZXR1cm4gW11cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrRm9yVG9vbCAoZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnb21ldGFsaW50ZXInLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmICghY21kICYmICF0aGlzLnRvb2xDaGVja0NvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSB0cnVlXG4gICAgICAgIGxldCBnb2dldCA9IHRoaXMuZ29nZXQoKVxuICAgICAgICBpZiAoIWdvZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZ29nZXQuZ2V0KHtcbiAgICAgICAgICBuYW1lOiAnZ29tZXRhbGludGVyLWxpbnRlcicsXG4gICAgICAgICAgcGFja2FnZU5hbWU6ICdnb21ldGFsaW50ZXInLFxuICAgICAgICAgIHBhY2thZ2VQYXRoOiAnZ2l0aHViLmNvbS9hbGVjdGhvbWFzL2dvbWV0YWxpbnRlcicsXG4gICAgICAgICAgdHlwZTogJ21pc3NpbmcnIC8vIFRPRE8gY2hlY2sgd2hldGhlciBtaXNzaW5nIG9yIG91dGRhdGVkXG4gICAgICAgIH0pLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICBpZiAoIXIuc3VjY2Vzcykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRvb2xzKGVkaXRvcilcbiAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXRMb2NhdG9yT3B0aW9ucyAoZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIG9wdGlvbnMuZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIG9wdGlvbnMuZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5kaXJlY3RvcnkgJiYgYXRvbS5wcm9qZWN0LnBhdGhzLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBhdG9tLnByb2plY3QucGF0aHNbMF1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBsZXQgbyA9IHRoaXMuZ2V0TG9jYXRvck9wdGlvbnMoZWRpdG9yKVxuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBpZiAoby5kaXJlY3RvcnkpIHtcbiAgICAgIG9wdGlvbnMuY3dkID0gby5kaXJlY3RvcnlcbiAgICB9XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIG9wdGlvbnMuZW52ID0gY29uZmlnLmVudmlyb25tZW50KG8pXG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5lbnYpIHtcbiAgICAgIG9wdGlvbnMuZW52ID0gcHJvY2Vzcy5lbnZcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIHVwZGF0ZVRvb2xzIChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpIHtcbiAgICBpZiAoIXRoaXMucmVhZHkoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgcmV0dXJuIGNvbmZpZy5sb2NhdG9yLmZpbmRUb29sKCdnb21ldGFsaW50ZXInLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgIGlmICghY21kKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgYXJncyA9IFsnLS1pbnN0YWxsJywgJy0tdXBkYXRlJ11cbiAgICAgIGxldCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnZ29tZXRhbGludGVyJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgIGljb246ICdjbG91ZC1kb3dubG9hZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnUnVubmluZyBgZ29tZXRhbGludGVyIC0taW5zdGFsbCAtLXVwZGF0ZWAgdG8gaW5zdGFsbCBhbmQgdXBkYXRlIHRvb2xzLidcbiAgICAgIH0pXG4gICAgICBsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RXhlY3V0b3JPcHRpb25zKGVkaXRvcilcbiAgICAgIHJldHVybiBjb25maWcuZXhlY3V0b3IuZXhlYyhjbWQsIGFyZ3MsIG9wdGlvbnMpLnRoZW4oKHIpID0+IHtcbiAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICBsZXQgZGV0YWlsID0gci5zdGRvdXQgKyBvcy5FT0wgKyByLnN0ZGVyclxuXG4gICAgICAgIGlmIChyLmV4aXRjb2RlICE9PSAwKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ2dvbWV0YWxpbnRlcicsIHtcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgaWNvbjogJ2Nsb3VkLWRvd25sb2FkJyxcbiAgICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgfVxuICAgICAgICBpZiAoci5zdGRlcnIgJiYgci5zdGRlcnIudHJpbSgpICE9PSAnJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnb21ldGFsaW50ZXItbGludGVyOiAoc3RkZXJyKSAnICsgci5zdGRlcnIpXG4gICAgICAgIH1cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ2dvbWV0YWxpbnRlcicsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBpY29uOiAnY2xvdWQtZG93bmxvYWQnLFxuICAgICAgICAgIGRldGFpbDogZGV0YWlsLnRyaW0oKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSB0b29scyB3ZXJlIGluc3RhbGxlZCBhbmQgdXBkYXRlZC4nXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiByXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBtYXBNZXNzYWdlcyAoZGF0YSwgZWRpdG9yLCBjd2QpIHtcbiAgICBsZXQgbWVzc2FnZXMgPSBbXVxuICAgIHRyeSB7XG4gICAgICBtZXNzYWdlcyA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cblxuICAgIGlmICghbWVzc2FnZXMgfHwgbWVzc2FnZXMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIG1lc3NhZ2VzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmICghYSAmJiAhYikge1xuICAgICAgICByZXR1cm4gMFxuICAgICAgfVxuICAgICAgaWYgKCFhICYmIGIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpZiAoYSAmJiAhYikge1xuICAgICAgICByZXR1cm4gMVxuICAgICAgfVxuXG4gICAgICBpZiAoIWEucGF0aCAmJiBiLnBhdGgpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpZiAoYS5wYXRoICYmICFiLnBhdGgpIHtcbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIH1cbiAgICAgIGlmIChhLnBhdGggPT09IGIucGF0aCkge1xuICAgICAgICBpZiAoYS5saW5lIC0gYi5saW5lID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGEucm93IC0gYi5yb3dcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYS5saW5lIC0gYi5saW5lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYS5wYXRoLmxvY2FsZUNvbXBhcmUoYi5wYXRoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdXG5cbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBsZXQgcmFuZ2VcbiAgICAgIGlmIChtZXNzYWdlLmNvbCAmJiBtZXNzYWdlLmNvbCA+PSAwKSB7XG4gICAgICAgIHJhbmdlID0gW1ttZXNzYWdlLmxpbmUgLSAxLCBtZXNzYWdlLmNvbCAtIDFdLCBbbWVzc2FnZS5saW5lIC0gMSwgMTAwMF1dXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByYW5nZSA9IFtbbWVzc2FnZS5saW5lIC0gMSwgMF0sIFttZXNzYWdlLmxpbmUgLSAxLCAxMDAwXV1cbiAgICAgIH1cbiAgICAgIHJlc3VsdHMucHVzaCh7bmFtZTogbWVzc2FnZS5saW50ZXIsIHR5cGU6IG1lc3NhZ2Uuc2V2ZXJpdHksIHJvdzogbWVzc2FnZS5saW5lLCBjb2x1bW46IG1lc3NhZ2UuY29sLCB0ZXh0OiBtZXNzYWdlLm1lc3NhZ2UgKyAnICgnICsgbWVzc2FnZS5saW50ZXIgKyAnKScsIGZpbGVQYXRoOiBwYXRoLmpvaW4oY3dkLCBtZXNzYWdlLnBhdGgpLCByYW5nZTogcmFuZ2V9KVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbn1cbmV4cG9ydCB7R29tZXRhbGludGVyTGludGVyfVxuIl19
//# sourceURL=/Users/ssun/.atom/packages/gometalinter-linter/lib/linter.js

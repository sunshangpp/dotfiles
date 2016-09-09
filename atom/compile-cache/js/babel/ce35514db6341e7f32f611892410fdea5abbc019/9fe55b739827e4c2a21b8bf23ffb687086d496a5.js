Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Formatter = (function () {
  function Formatter(goconfigFunc, gogetFunc) {
    _classCallCheck(this, Formatter);

    this.goget = gogetFunc;
    this.goconfig = goconfigFunc;
    this.subscriptions = new _atom.CompositeDisposable();
    this.saveSubscriptions = new _atom.CompositeDisposable();
    this.updatingFormatterCache = false;
    this.setToolLocations();
    this.observeConfig();
    this.handleCommands();
    this.updateFormatterCache();
  }

  _createClass(Formatter, [{
    key: 'dispose',
    value: function dispose() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
      }
      this.subscriptions = null;
      if (this.saveSubscriptions) {
        this.saveSubscriptions.dispose();
      }
      this.saveSubscriptions = null;
      this.goget = null;
      this.goconfig = null;
      this.formatTool = null;
      this.toolCheckComplete = null;
      this.formatterCache = null;
      this.updatingFormatterCache = null;
      this.toolLocations = null;
    }
  }, {
    key: 'setToolLocations',
    value: function setToolLocations() {
      this.toolLocations = {
        gofmt: false,
        goimports: 'golang.org/x/tools/cmd/goimports',
        goreturns: 'github.com/sqs/goreturns'
      };
    }
  }, {
    key: 'handleCommands',
    value: function handleCommands() {
      var _this = this;

      atom.project.onDidChangePaths(function (projectPaths) {
        _this.updateFormatterCache();
      });
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="go"]', 'golang:gofmt', function () {
        if (!_this.ready() || !_this.getEditor()) {
          return;
        }
        _this.format(_this.getEditor(), 'gofmt');
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="go"]', 'golang:goimports', function () {
        if (!_this.ready() || !_this.getEditor()) {
          return;
        }
        _this.format(_this.getEditor(), 'goimports');
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar~="go"]', 'golang:goreturns', function () {
        if (!_this.ready() || !_this.getEditor()) {
          return;
        }
        _this.format(_this.getEditor(), 'goreturns');
      }));
    }
  }, {
    key: 'observeConfig',
    value: function observeConfig() {
      var _this2 = this;

      this.subscriptions.add(atom.config.observe('gofmt.formatTool', function (formatTool) {
        _this2.formatTool = formatTool;
        if (_this2.toolCheckComplete) {
          _this2.toolCheckComplete[formatTool] = false;
        }
        _this2.checkForTool(formatTool);
      }));
      this.subscriptions.add(atom.config.observe('gofmt.formatOnSave', function (formatOnSave) {
        if (_this2.saveSubscriptions) {
          _this2.saveSubscriptions.dispose();
        }
        _this2.saveSubscriptions = new _atom.CompositeDisposable();
        if (formatOnSave) {
          _this2.subscribeToSaveEvents();
        }
      }));
    }
  }, {
    key: 'subscribeToSaveEvents',
    value: function subscribeToSaveEvents() {
      var _this3 = this;

      this.saveSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        if (!editor || !editor.getBuffer()) {
          return;
        }

        var bufferSubscriptions = new _atom.CompositeDisposable();
        bufferSubscriptions.add(editor.getBuffer().onWillSave(function (filePath) {
          var p = editor.getPath();
          if (filePath && filePath.path) {
            p = filePath.path;
          }
          _this3.format(editor, _this3.formatTool, p);
        }));
        bufferSubscriptions.add(editor.getBuffer().onDidDestroy(function () {
          bufferSubscriptions.dispose();
        }));
        _this3.saveSubscriptions.add(bufferSubscriptions);
      }));
    }
  }, {
    key: 'ready',
    value: function ready() {
      return this.goconfig && this.goconfig() && !this.updatingFormatterCache && this.formatterCache && this.formatterCache.size > 0;
    }
  }, {
    key: 'resetFormatterCache',
    value: function resetFormatterCache() {
      this.formatterCache = null;
    }
  }, {
    key: 'updateFormatterCache',
    value: function updateFormatterCache() {
      var _this4 = this;

      if (this.updatingFormatterCache) {
        return Promise.resolve(false);
      }
      this.updatingFormatterCache = true;

      if (!this.goconfig || !this.goconfig()) {
        this.updatingFormatterCache = false;
        return Promise.resolve(false);
      }

      var config = this.goconfig();
      var cache = new Map();
      var paths = atom.project.getPaths();
      paths.push(false);
      var promises = [];
      for (var p of paths) {
        if (p && p.includes('://')) {
          continue;
        }

        var _loop = function (tool) {
          var key = tool + ':' + p;
          var options = { directory: p };
          if (!p) {
            key = tool;
            options = {};
          }

          promises.push(config.locator.findTool(tool, options).then(function (cmd) {
            if (cmd) {
              cache.set(key, cmd);
              return cmd;
            }
            return false;
          }));
        };

        for (var tool of ['gofmt', 'goimports', 'goreturns']) {
          _loop(tool);
        }
      }
      return Promise.all(promises).then(function () {
        _this4.formatterCache = cache;
        _this4.updatingFormatterCache = false;
        return _this4.formatterCache;
      })['catch'](function (e) {
        if (e.handle) {
          e.handle();
        }
        console.log(e);
        _this4.updatingFormatterCache = false;
      });
    }
  }, {
    key: 'cachedToolPath',
    value: function cachedToolPath(toolName, editor) {
      if (!this.formatterCache || !toolName) {
        return false;
      }

      var p = this.projectPath(editor);
      if (p) {
        var key = toolName + ':' + p;
        var _cmd = this.formatterCache.get(key);
        if (_cmd) {
          return _cmd;
        }
      }

      var cmd = this.formatterCache.get(toolName);
      if (cmd) {
        return cmd;
      }
      return false;
    }
  }, {
    key: 'projectPath',
    value: function projectPath(editor) {
      if (editor) {
        var result = atom.project.relativizePath(editor.getPath());
        if (result && result.projectPath) {
          return result.projectPath;
        }
      }
      var paths = atom.project.getPaths();
      if (paths && paths.length) {
        for (var p of paths) {
          if (p && !p.includes('://')) {
            return p;
          }
        }
      }

      return false;
    }
  }, {
    key: 'checkForTool',
    value: function checkForTool() {
      var _this5 = this;

      var toolName = arguments.length <= 0 || arguments[0] === undefined ? this.formatTool : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? this.getLocatorOptions() : arguments[1];

      if (!this.ready()) {
        return;
      }
      var config = this.goconfig();
      return config.locator.findTool(toolName, options).then(function (cmd) {
        if (cmd) {
          return _this5.updateFormatterCache().then(function () {
            return cmd;
          });
        }

        if (!_this5.toolCheckComplete) {
          _this5.toolCheckComplete = {};
        }

        if (!cmd && !_this5.toolCheckComplete[toolName]) {
          var goget = _this5.goget();
          if (!goget) {
            return false;
          }
          _this5.toolCheckComplete[toolName] = true;

          var packagePath = _this5.toolLocations[toolName];
          if (packagePath) {
            goget.get({
              name: 'gofmt',
              packageName: toolName,
              packagePath: packagePath,
              type: 'missing'
            }).then(function () {
              return _this5.updateFormatterCache();
            })['catch'](function (e) {
              console.log(e);
            });
          }
        }

        return false;
      });
    }
  }, {
    key: 'getEditor',
    value: function getEditor() {
      if (!atom || !atom.workspace) {
        return;
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!this.isValidEditor(editor)) {
        return;
      }

      return editor;
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {
      if (!editor || !editor.getGrammar()) {
        return false;
      }

      return editor.getGrammar().scopeName === 'source.go';
    }
  }, {
    key: 'getLocatorOptions',
    value: function getLocatorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

      var options = {};
      var p = this.projectPath(editor);
      if (p) {
        options.directory = p;
      }

      return options;
    }
  }, {
    key: 'getExecutorOptions',
    value: function getExecutorOptions() {
      var editor = arguments.length <= 0 || arguments[0] === undefined ? this.getEditor() : arguments[0];

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
    key: 'format',
    value: function format(editor, tool, filePath) {
      if (editor === undefined) editor = this.getEditor();
      if (tool === undefined) tool = this.formatTool;

      if (!this.ready() || !this.isValidEditor(editor) || !editor.getBuffer()) {
        return;
      }

      if (!filePath) {
        filePath = editor.getPath();
      }

      var formatCmd = this.cachedToolPath(tool, editor);
      if (!formatCmd) {
        this.checkForTool(tool);
        return;
      }

      var cmd = formatCmd;
      var config = this.goconfig();
      var options = this.getExecutorOptions(editor);
      options.input = editor.getText();
      var args = ['-e'];
      if (filePath) {
        if (tool === 'goimports') {
          args.push('--srcdir');
          args.push(_path2['default'].dirname(filePath));
        }
      }

      var r = config.executor.execSync(cmd, args, options);
      if (r.stderr && r.stderr.trim() !== '') {
        console.log('gofmt: (stderr) ' + r.stderr);
        return;
      }
      if (r.exitcode === 0) {
        editor.getBuffer().setTextViaDiff(r.stdout);
      }
    }
  }]);

  return Formatter;
})();

exports.Formatter = Formatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZm10L2xpYi9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7b0JBQ3ZCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBOztJQUtMLFNBQVM7QUFDRCxXQURSLFNBQVMsQ0FDQSxZQUFZLEVBQUUsU0FBUyxFQUFFOzBCQURsQyxTQUFTOztBQUVYLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLCtCQUF5QixDQUFBO0FBQ2xELFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUE7QUFDbkMsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtHQUM1Qjs7ZUFYRyxTQUFTOztXQWFMLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDakM7QUFDRCxVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFB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QUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDcEQsVUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3RDLGVBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFDLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7QUFDcEIsY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDNUM7S0FDRjs7O1NBcFVHLFNBQVM7OztRQXNVUCxTQUFTLEdBQVQsU0FBUyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nb2ZtdC9saWIvZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3IgKGdvY29uZmlnRnVuYywgZ29nZXRGdW5jKSB7XG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0RnVuY1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnVwZGF0aW5nRm9ybWF0dGVyQ2FjaGUgPSBmYWxzZVxuICAgIHRoaXMuc2V0VG9vbExvY2F0aW9ucygpXG4gICAgdGhpcy5vYnNlcnZlQ29uZmlnKClcbiAgICB0aGlzLmhhbmRsZUNvbW1hbmRzKClcbiAgICB0aGlzLnVwZGF0ZUZvcm1hdHRlckNhY2hlKClcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIGlmICh0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLmZvcm1hdFRvb2wgPSBudWxsXG4gICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IG51bGxcbiAgICB0aGlzLmZvcm1hdHRlckNhY2hlID0gbnVsbFxuICAgIHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSA9IG51bGxcbiAgICB0aGlzLnRvb2xMb2NhdGlvbnMgPSBudWxsXG4gIH1cblxuICBzZXRUb29sTG9jYXRpb25zICgpIHtcbiAgICB0aGlzLnRvb2xMb2NhdGlvbnMgPSB7XG4gICAgICBnb2ZtdDogZmFsc2UsXG4gICAgICBnb2ltcG9ydHM6ICdnb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0cycsXG4gICAgICBnb3JldHVybnM6ICdnaXRodWIuY29tL3Nxcy9nb3JldHVybnMnXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ29tbWFuZHMgKCkge1xuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKChwcm9qZWN0UGF0aHMpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PVwiZ29cIl0nLCAnZ29sYW5nOmdvZm10JywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnJlYWR5KCkgfHwgIXRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmZvcm1hdCh0aGlzLmdldEVkaXRvcigpLCAnZ29mbXQnKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImdvXCJdJywgJ2dvbGFuZzpnb2ltcG9ydHMnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZm9ybWF0KHRoaXMuZ2V0RWRpdG9yKCksICdnb2ltcG9ydHMnKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImdvXCJdJywgJ2dvbGFuZzpnb3JldHVybnMnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZm9ybWF0KHRoaXMuZ2V0RWRpdG9yKCksICdnb3JldHVybnMnKVxuICAgIH0pKVxuICB9XG5cbiAgb2JzZXJ2ZUNvbmZpZyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdnb2ZtdC5mb3JtYXRUb29sJywgKGZvcm1hdFRvb2wpID0+IHtcbiAgICAgIHRoaXMuZm9ybWF0VG9vbCA9IGZvcm1hdFRvb2xcbiAgICAgIGlmICh0aGlzLnRvb2xDaGVja0NvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGVbZm9ybWF0VG9vbF0gPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5jaGVja0ZvclRvb2woZm9ybWF0VG9vbClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2dvZm10LmZvcm1hdE9uU2F2ZScsIChmb3JtYXRPblNhdmUpID0+IHtcbiAgICAgIGlmICh0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9XG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgaWYgKGZvcm1hdE9uU2F2ZSkge1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvU2F2ZUV2ZW50cygpXG4gICAgICB9XG4gICAgfSkpXG4gIH1cblxuICBzdWJzY3JpYmVUb1NhdmVFdmVudHMgKCkge1xuICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEJ1ZmZlcigpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgYnVmZmVyU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIGJ1ZmZlclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKChmaWxlUGF0aCkgPT4ge1xuICAgICAgICBsZXQgcCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgaWYgKGZpbGVQYXRoICYmIGZpbGVQYXRoLnBhdGgpIHtcbiAgICAgICAgICBwID0gZmlsZVBhdGgucGF0aFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9ybWF0KGVkaXRvciwgdGhpcy5mb3JtYXRUb29sLCBwKVxuICAgICAgfSkpXG4gICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmFkZChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgYnVmZmVyU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5hZGQoYnVmZmVyU3Vic2NyaXB0aW9ucylcbiAgICB9KSlcbiAgfVxuXG4gIHJlYWR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nb2NvbmZpZyAmJiB0aGlzLmdvY29uZmlnKCkgJiYgIXRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSAmJiB0aGlzLmZvcm1hdHRlckNhY2hlICYmIHRoaXMuZm9ybWF0dGVyQ2FjaGUuc2l6ZSA+IDBcbiAgfVxuXG4gIHJlc2V0Rm9ybWF0dGVyQ2FjaGUgKCkge1xuICAgIHRoaXMuZm9ybWF0dGVyQ2FjaGUgPSBudWxsXG4gIH1cblxuICB1cGRhdGVGb3JtYXR0ZXJDYWNoZSAoKSB7XG4gICAgaWYgKHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICB9XG4gICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gdHJ1ZVxuXG4gICAgaWYgKCF0aGlzLmdvY29uZmlnIHx8ICF0aGlzLmdvY29uZmlnKCkpIHtcbiAgICAgIHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSA9IGZhbHNlXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICBsZXQgY2FjaGUgPSBuZXcgTWFwKClcbiAgICBsZXQgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIHBhdGhzLnB1c2goZmFsc2UpXG4gICAgbGV0IHByb21pc2VzID0gW11cbiAgICBmb3IgKGxldCBwIG9mIHBhdGhzKSB7XG4gICAgICBpZiAocCAmJiBwLmluY2x1ZGVzKCc6Ly8nKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgdG9vbCBvZiBbJ2dvZm10JywgJ2dvaW1wb3J0cycsICdnb3JldHVybnMnXSkge1xuICAgICAgICBsZXQga2V5ID0gdG9vbCArICc6JyArIHBcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7IGRpcmVjdG9yeTogcCB9XG4gICAgICAgIGlmICghcCkge1xuICAgICAgICAgIGtleSA9IHRvb2xcbiAgICAgICAgICBvcHRpb25zID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIHByb21pc2VzLnB1c2goY29uZmlnLmxvY2F0b3IuZmluZFRvb2wodG9vbCwgb3B0aW9ucykudGhlbigoY21kKSA9PiB7XG4gICAgICAgICAgaWYgKGNtZCkge1xuICAgICAgICAgICAgY2FjaGUuc2V0KGtleSwgY21kKVxuICAgICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmZvcm1hdHRlckNhY2hlID0gY2FjaGVcbiAgICAgIHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXR0ZXJDYWNoZVxuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICBpZiAoZS5oYW5kbGUpIHtcbiAgICAgICAgZS5oYW5kbGUoKVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgIHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSA9IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIGNhY2hlZFRvb2xQYXRoICh0b29sTmFtZSwgZWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1hdHRlckNhY2hlIHx8ICF0b29sTmFtZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgbGV0IHAgPSB0aGlzLnByb2plY3RQYXRoKGVkaXRvcilcbiAgICBpZiAocCkge1xuICAgICAgbGV0IGtleSA9IHRvb2xOYW1lICsgJzonICsgcFxuICAgICAgbGV0IGNtZCA9IHRoaXMuZm9ybWF0dGVyQ2FjaGUuZ2V0KGtleSlcbiAgICAgIGlmIChjbWQpIHtcbiAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjbWQgPSB0aGlzLmZvcm1hdHRlckNhY2hlLmdldCh0b29sTmFtZSlcbiAgICBpZiAoY21kKSB7XG4gICAgICByZXR1cm4gY21kXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcHJvamVjdFBhdGggKGVkaXRvcikge1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGxldCByZXN1bHQgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnByb2plY3RQYXRoKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQucHJvamVjdFBhdGhcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBpZiAocGF0aHMgJiYgcGF0aHMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBwIG9mIHBhdGhzKSB7XG4gICAgICAgIGlmIChwICYmICFwLmluY2x1ZGVzKCc6Ly8nKSkge1xuICAgICAgICAgIHJldHVybiBwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNoZWNrRm9yVG9vbCAodG9vbE5hbWUgPSB0aGlzLmZvcm1hdFRvb2wsIG9wdGlvbnMgPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKCkpIHtcbiAgICBpZiAoIXRoaXMucmVhZHkoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICByZXR1cm4gY29uZmlnLmxvY2F0b3IuZmluZFRvb2wodG9vbE5hbWUsIG9wdGlvbnMpLnRoZW4oKGNtZCkgPT4ge1xuICAgICAgaWYgKGNtZCkge1xuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVGb3JtYXR0ZXJDYWNoZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjbWRcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRvb2xDaGVja0NvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudG9vbENoZWNrQ29tcGxldGUgPSB7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFjbWQgJiYgIXRoaXMudG9vbENoZWNrQ29tcGxldGVbdG9vbE5hbWVdKSB7XG4gICAgICAgIGxldCBnb2dldCA9IHRoaXMuZ29nZXQoKVxuICAgICAgICBpZiAoIWdvZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZVt0b29sTmFtZV0gPSB0cnVlXG5cbiAgICAgICAgbGV0IHBhY2thZ2VQYXRoID0gdGhpcy50b29sTG9jYXRpb25zW3Rvb2xOYW1lXVxuICAgICAgICBpZiAocGFja2FnZVBhdGgpIHtcbiAgICAgICAgICBnb2dldC5nZXQoe1xuICAgICAgICAgICAgbmFtZTogJ2dvZm10JyxcbiAgICAgICAgICAgIHBhY2thZ2VOYW1lOiB0b29sTmFtZSxcbiAgICAgICAgICAgIHBhY2thZ2VQYXRoOiBwYWNrYWdlUGF0aCxcbiAgICAgICAgICAgIHR5cGU6ICdtaXNzaW5nJ1xuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRm9ybWF0dGVyQ2FjaGUoKVxuICAgICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIGdldEVkaXRvciAoKSB7XG4gICAgaWYgKCFhdG9tIHx8ICFhdG9tLndvcmtzcGFjZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdG9yXG4gIH1cblxuICBpc1ZhbGlkRWRpdG9yIChlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEdyYW1tYXIoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lID09PSAnc291cmNlLmdvJ1xuICB9XG5cbiAgZ2V0TG9jYXRvck9wdGlvbnMgKGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCkpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgbGV0IHAgPSB0aGlzLnByb2plY3RQYXRoKGVkaXRvcilcbiAgICBpZiAocCkge1xuICAgICAgb3B0aW9ucy5kaXJlY3RvcnkgPSBwXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIGdldEV4ZWN1dG9yT3B0aW9ucyAoZWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgIGxldCBvID0gdGhpcy5nZXRMb2NhdG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgbGV0IG9wdGlvbnMgPSB7fVxuICAgIGlmIChvLmRpcmVjdG9yeSkge1xuICAgICAgb3B0aW9ucy5jd2QgPSBvLmRpcmVjdG9yeVxuICAgIH1cbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgb3B0aW9ucy5lbnYgPSBjb25maWcuZW52aXJvbm1lbnQobylcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmVudikge1xuICAgICAgb3B0aW9ucy5lbnYgPSBwcm9jZXNzLmVudlxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZm9ybWF0IChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpLCB0b29sID0gdGhpcy5mb3JtYXRUb29sLCBmaWxlUGF0aCkge1xuICAgIGlmICghdGhpcy5yZWFkeSgpIHx8ICF0aGlzLmlzVmFsaWRFZGl0b3IoZWRpdG9yKSB8fCAhZWRpdG9yLmdldEJ1ZmZlcigpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICB9XG5cbiAgICBsZXQgZm9ybWF0Q21kID0gdGhpcy5jYWNoZWRUb29sUGF0aCh0b29sLCBlZGl0b3IpXG4gICAgaWYgKCFmb3JtYXRDbWQpIHtcbiAgICAgIHRoaXMuY2hlY2tGb3JUb29sKHRvb2wpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgY21kID0gZm9ybWF0Q21kXG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRFeGVjdXRvck9wdGlvbnMoZWRpdG9yKVxuICAgIG9wdGlvbnMuaW5wdXQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgbGV0IGFyZ3MgPSBbJy1lJ11cbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGlmICh0b29sID09PSAnZ29pbXBvcnRzJykge1xuICAgICAgICBhcmdzLnB1c2goJy0tc3JjZGlyJylcbiAgICAgICAgYXJncy5wdXNoKHBhdGguZGlybmFtZShmaWxlUGF0aCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHIgPSBjb25maWcuZXhlY3V0b3IuZXhlY1N5bmMoY21kLCBhcmdzLCBvcHRpb25zKVxuICAgIGlmIChyLnN0ZGVyciAmJiByLnN0ZGVyci50cmltKCkgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLmxvZygnZ29mbXQ6IChzdGRlcnIpICcgKyByLnN0ZGVycilcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoci5leGl0Y29kZSA9PT0gMCkge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHRWaWFEaWZmKHIuc3Rkb3V0KVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IHtGb3JtYXR0ZXJ9XG4iXX0=
//# sourceURL=/Users/ssun/.atom/packages/gofmt/lib/formatter.js

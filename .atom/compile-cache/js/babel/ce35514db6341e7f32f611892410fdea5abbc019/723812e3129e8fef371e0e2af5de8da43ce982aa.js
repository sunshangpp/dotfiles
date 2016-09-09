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
        goreturns: 'sourcegraph.com/sqs/goreturns'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dvZm10L2xpYi9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7b0JBQ3ZCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBOztJQUtMLFNBQVM7QUFDRCxXQURSLFNBQVMsQ0FDQSxZQUFZLEVBQUUsU0FBUyxFQUFFOzBCQURsQyxTQUFTOztBQUVYLFFBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLCtCQUF5QixDQUFBO0FBQ2xELFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUE7QUFDbkMsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUNyQixRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtHQUM1Qjs7ZUFYRyxTQUFTOztXQWFMLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDN0I7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDakM7QUFDRCxVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0FBQzdCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFB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QUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDcEQsVUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3RDLGVBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFDLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7QUFDcEIsY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDNUM7S0FDRjs7O1NBcFVHLFNBQVM7OztRQXNVUCxTQUFTLEdBQVQsU0FBUyIsImZpbGUiOiIvVXNlcnMvc3N1bi8uYXRvbS9wYWNrYWdlcy9nb2ZtdC9saWIvZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3IgKGdvY29uZmlnRnVuYywgZ29nZXRGdW5jKSB7XG4gICAgdGhpcy5nb2dldCA9IGdvZ2V0RnVuY1xuICAgIHRoaXMuZ29jb25maWcgPSBnb2NvbmZpZ0Z1bmNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnVwZGF0aW5nRm9ybWF0dGVyQ2FjaGUgPSBmYWxzZVxuICAgIHRoaXMuc2V0VG9vbExvY2F0aW9ucygpXG4gICAgdGhpcy5vYnNlcnZlQ29uZmlnKClcbiAgICB0aGlzLmhhbmRsZUNvbW1hbmRzKClcbiAgICB0aGlzLnVwZGF0ZUZvcm1hdHRlckNhY2hlKClcbiAgfVxuXG4gIGRpc3Bvc2UgKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIGlmICh0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIHRoaXMuZ29nZXQgPSBudWxsXG4gICAgdGhpcy5nb2NvbmZpZyA9IG51bGxcbiAgICB0aGlzLmZvcm1hdFRvb2wgPSBudWxsXG4gICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IG51bGxcbiAgICB0aGlzLmZvcm1hdHRlckNhY2hlID0gbnVsbFxuICAgIHRoaXMudXBkYXRpbmdGb3JtYXR0ZXJDYWNoZSA9IG51bGxcbiAgICB0aGlzLnRvb2xMb2NhdGlvbnMgPSBudWxsXG4gIH1cblxuICBzZXRUb29sTG9jYXRpb25zICgpIHtcbiAgICB0aGlzLnRvb2xMb2NhdGlvbnMgPSB7XG4gICAgICBnb2ZtdDogZmFsc2UsXG4gICAgICBnb2ltcG9ydHM6ICdnb2xhbmcub3JnL3gvdG9vbHMvY21kL2dvaW1wb3J0cycsXG4gICAgICBnb3JldHVybnM6ICdzb3VyY2VncmFwaC5jb20vc3FzL2dvcmV0dXJucydcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDb21tYW5kcyAoKSB7XG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKHByb2plY3RQYXRocykgPT4ge1xuICAgICAgdGhpcy51cGRhdGVGb3JtYXR0ZXJDYWNoZSgpXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJnb1wiXScsICdnb2xhbmc6Z29mbXQnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucmVhZHkoKSB8fCAhdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZm9ybWF0KHRoaXMuZ2V0RWRpdG9yKCksICdnb2ZtdCcpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PVwiZ29cIl0nLCAnZ29sYW5nOmdvaW1wb3J0cycsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5yZWFkeSgpIHx8ICF0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5mb3JtYXQodGhpcy5nZXRFZGl0b3IoKSwgJ2dvaW1wb3J0cycpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PVwiZ29cIl0nLCAnZ29sYW5nOmdvcmV0dXJucycsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5yZWFkeSgpIHx8ICF0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5mb3JtYXQodGhpcy5nZXRFZGl0b3IoKSwgJ2dvcmV0dXJucycpXG4gICAgfSkpXG4gIH1cblxuICBvYnNlcnZlQ29uZmlnICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2dvZm10LmZvcm1hdFRvb2wnLCAoZm9ybWF0VG9vbCkgPT4ge1xuICAgICAgdGhpcy5mb3JtYXRUb29sID0gZm9ybWF0VG9vbFxuICAgICAgaWYgKHRoaXMudG9vbENoZWNrQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZVtmb3JtYXRUb29sXSA9IGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLmNoZWNrRm9yVG9vbChmb3JtYXRUb29sKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZ29mbXQuZm9ybWF0T25TYXZlJywgKGZvcm1hdE9uU2F2ZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBpZiAoZm9ybWF0T25TYXZlKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9TYXZlRXZlbnRzKClcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIHN1YnNjcmliZVRvU2F2ZUV2ZW50cyAoKSB7XG4gICAgdGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBidWZmZXJTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgYnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKGZpbGVQYXRoKSA9PiB7XG4gICAgICAgIGxldCBwID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBpZiAoZmlsZVBhdGggJiYgZmlsZVBhdGgucGF0aCkge1xuICAgICAgICAgIHAgPSBmaWxlUGF0aC5wYXRoXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mb3JtYXQoZWRpdG9yLCB0aGlzLmZvcm1hdFRvb2wsIHApXG4gICAgICB9KSlcbiAgICAgIGJ1ZmZlclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICB0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmFkZChidWZmZXJTdWJzY3JpcHRpb25zKVxuICAgIH0pKVxuICB9XG5cbiAgcmVhZHkgKCkge1xuICAgIHJldHVybiB0aGlzLmdvY29uZmlnICYmIHRoaXMuZ29jb25maWcoKSAmJiAhdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlICYmIHRoaXMuZm9ybWF0dGVyQ2FjaGUgJiYgdGhpcy5mb3JtYXR0ZXJDYWNoZS5zaXplID4gMFxuICB9XG5cbiAgcmVzZXRGb3JtYXR0ZXJDYWNoZSAoKSB7XG4gICAgdGhpcy5mb3JtYXR0ZXJDYWNoZSA9IG51bGxcbiAgfVxuXG4gIHVwZGF0ZUZvcm1hdHRlckNhY2hlICgpIHtcbiAgICBpZiAodGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cbiAgICB0aGlzLnVwZGF0aW5nRm9ybWF0dGVyQ2FjaGUgPSB0cnVlXG5cbiAgICBpZiAoIXRoaXMuZ29jb25maWcgfHwgIXRoaXMuZ29jb25maWcoKSkge1xuICAgICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gZmFsc2VcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIGxldCBjYWNoZSA9IG5ldyBNYXAoKVxuICAgIGxldCBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgcGF0aHMucHVzaChmYWxzZSlcbiAgICBsZXQgcHJvbWlzZXMgPSBbXVxuICAgIGZvciAobGV0IHAgb2YgcGF0aHMpIHtcbiAgICAgIGlmIChwICYmIHAuaW5jbHVkZXMoJzovLycpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBmb3IgKGxldCB0b29sIG9mIFsnZ29mbXQnLCAnZ29pbXBvcnRzJywgJ2dvcmV0dXJucyddKSB7XG4gICAgICAgIGxldCBrZXkgPSB0b29sICsgJzonICsgcFxuICAgICAgICBsZXQgb3B0aW9ucyA9IHsgZGlyZWN0b3J5OiBwIH1cbiAgICAgICAgaWYgKCFwKSB7XG4gICAgICAgICAga2V5ID0gdG9vbFxuICAgICAgICAgIG9wdGlvbnMgPSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZXMucHVzaChjb25maWcubG9jYXRvci5maW5kVG9vbCh0b29sLCBvcHRpb25zKS50aGVuKChjbWQpID0+IHtcbiAgICAgICAgICBpZiAoY21kKSB7XG4gICAgICAgICAgICBjYWNoZS5zZXQoa2V5LCBjbWQpXG4gICAgICAgICAgICByZXR1cm4gY21kXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZm9ybWF0dGVyQ2FjaGUgPSBjYWNoZVxuICAgICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gZmFsc2VcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdHRlckNhY2hlXG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmhhbmRsZSkge1xuICAgICAgICBlLmhhbmRsZSgpXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgdGhpcy51cGRhdGluZ0Zvcm1hdHRlckNhY2hlID0gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgY2FjaGVkVG9vbFBhdGggKHRvb2xOYW1lLCBlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZm9ybWF0dGVyQ2FjaGUgfHwgIXRvb2xOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBsZXQgcCA9IHRoaXMucHJvamVjdFBhdGgoZWRpdG9yKVxuICAgIGlmIChwKSB7XG4gICAgICBsZXQga2V5ID0gdG9vbE5hbWUgKyAnOicgKyBwXG4gICAgICBsZXQgY21kID0gdGhpcy5mb3JtYXR0ZXJDYWNoZS5nZXQoa2V5KVxuICAgICAgaWYgKGNtZCkge1xuICAgICAgICByZXR1cm4gY21kXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNtZCA9IHRoaXMuZm9ybWF0dGVyQ2FjaGUuZ2V0KHRvb2xOYW1lKVxuICAgIGlmIChjbWQpIHtcbiAgICAgIHJldHVybiBjbWRcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBwcm9qZWN0UGF0aCAoZWRpdG9yKSB7XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgbGV0IHJlc3VsdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQucHJvamVjdFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9qZWN0UGF0aFxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGlmIChwYXRocyAmJiBwYXRocy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IHAgb2YgcGF0aHMpIHtcbiAgICAgICAgaWYgKHAgJiYgIXAuaW5jbHVkZXMoJzovLycpKSB7XG4gICAgICAgICAgcmV0dXJuIHBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY2hlY2tGb3JUb29sICh0b29sTmFtZSA9IHRoaXMuZm9ybWF0VG9vbCwgb3B0aW9ucyA9IHRoaXMuZ2V0TG9jYXRvck9wdGlvbnMoKSkge1xuICAgIGlmICghdGhpcy5yZWFkeSgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IGNvbmZpZyA9IHRoaXMuZ29jb25maWcoKVxuICAgIHJldHVybiBjb25maWcubG9jYXRvci5maW5kVG9vbCh0b29sTmFtZSwgb3B0aW9ucykudGhlbigoY21kKSA9PiB7XG4gICAgICBpZiAoY21kKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUZvcm1hdHRlckNhY2hlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNtZFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMudG9vbENoZWNrQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy50b29sQ2hlY2tDb21wbGV0ZSA9IHsgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNtZCAmJiAhdGhpcy50b29sQ2hlY2tDb21wbGV0ZVt0b29sTmFtZV0pIHtcbiAgICAgICAgbGV0IGdvZ2V0ID0gdGhpcy5nb2dldCgpXG4gICAgICAgIGlmICghZ29nZXQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvb2xDaGVja0NvbXBsZXRlW3Rvb2xOYW1lXSA9IHRydWVcblxuICAgICAgICBsZXQgcGFja2FnZVBhdGggPSB0aGlzLnRvb2xMb2NhdGlvbnNbdG9vbE5hbWVdXG4gICAgICAgIGlmIChwYWNrYWdlUGF0aCkge1xuICAgICAgICAgIGdvZ2V0LmdldCh7XG4gICAgICAgICAgICBuYW1lOiAnZ29mbXQnLFxuICAgICAgICAgICAgcGFja2FnZU5hbWU6IHRvb2xOYW1lLFxuICAgICAgICAgICAgcGFja2FnZVBhdGg6IHBhY2thZ2VQYXRoLFxuICAgICAgICAgICAgdHlwZTogJ21pc3NpbmcnXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVGb3JtYXR0ZXJDYWNoZSgpXG4gICAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgZ2V0RWRpdG9yICgpIHtcbiAgICBpZiAoIWF0b20gfHwgIWF0b20ud29ya3NwYWNlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHJldHVybiBlZGl0b3JcbiAgfVxuXG4gIGlzVmFsaWRFZGl0b3IgKGVkaXRvcikge1xuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT09ICdzb3VyY2UuZ28nXG4gIH1cblxuICBnZXRMb2NhdG9yT3B0aW9ucyAoZWRpdG9yID0gdGhpcy5nZXRFZGl0b3IoKSkge1xuICAgIGxldCBvcHRpb25zID0ge31cbiAgICBsZXQgcCA9IHRoaXMucHJvamVjdFBhdGgoZWRpdG9yKVxuICAgIGlmIChwKSB7XG4gICAgICBvcHRpb25zLmRpcmVjdG9yeSA9IHBcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgZ2V0RXhlY3V0b3JPcHRpb25zIChlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpKSB7XG4gICAgbGV0IG8gPSB0aGlzLmdldExvY2F0b3JPcHRpb25zKGVkaXRvcilcbiAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgaWYgKG8uZGlyZWN0b3J5KSB7XG4gICAgICBvcHRpb25zLmN3ZCA9IG8uZGlyZWN0b3J5XG4gICAgfVxuICAgIGxldCBjb25maWcgPSB0aGlzLmdvY29uZmlnKClcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBvcHRpb25zLmVudiA9IGNvbmZpZy5lbnZpcm9ubWVudChvKVxuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuZW52KSB7XG4gICAgICBvcHRpb25zLmVudiA9IHByb2Nlc3MuZW52XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBmb3JtYXQgKGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCksIHRvb2wgPSB0aGlzLmZvcm1hdFRvb2wsIGZpbGVQYXRoKSB7XG4gICAgaWYgKCF0aGlzLnJlYWR5KCkgfHwgIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIH1cblxuICAgIGxldCBmb3JtYXRDbWQgPSB0aGlzLmNhY2hlZFRvb2xQYXRoKHRvb2wsIGVkaXRvcilcbiAgICBpZiAoIWZvcm1hdENtZCkge1xuICAgICAgdGhpcy5jaGVja0ZvclRvb2wodG9vbClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBjbWQgPSBmb3JtYXRDbWRcbiAgICBsZXQgY29uZmlnID0gdGhpcy5nb2NvbmZpZygpXG4gICAgbGV0IG9wdGlvbnMgPSB0aGlzLmdldEV4ZWN1dG9yT3B0aW9ucyhlZGl0b3IpXG4gICAgb3B0aW9ucy5pbnB1dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICBsZXQgYXJncyA9IFsnLWUnXVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgaWYgKHRvb2wgPT09ICdnb2ltcG9ydHMnKSB7XG4gICAgICAgIGFyZ3MucHVzaCgnLS1zcmNkaXInKVxuICAgICAgICBhcmdzLnB1c2gocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgciA9IGNvbmZpZy5leGVjdXRvci5leGVjU3luYyhjbWQsIGFyZ3MsIG9wdGlvbnMpXG4gICAgaWYgKHIuc3RkZXJyICYmIHIuc3RkZXJyLnRyaW0oKSAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnb2ZtdDogKHN0ZGVycikgJyArIHIuc3RkZXJyKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChyLmV4aXRjb2RlID09PSAwKSB7XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dFZpYURpZmYoci5zdGRvdXQpXG4gICAgfVxuICB9XG59XG5leHBvcnQge0Zvcm1hdHRlcn1cbiJdfQ==
//# sourceURL=/Users/ssun/.atom/packages/gofmt/lib/formatter.js
